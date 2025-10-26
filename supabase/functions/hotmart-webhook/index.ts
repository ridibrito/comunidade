import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "jsr:@std/http";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { crypto } from "jsr:@std/crypto/crypto";

type HotmartEvent = Record<string, any>;

// Fallback para evitar bloqueio de secrets com prefixo SUPABASE_
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? Deno.env.get("SB_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SB_SERVICE_ROLE_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("HOTMART_WEBHOOK_SECRET")!;
const PRODUCT_WHITELIST = (Deno.env.get("HOTMART_PRODUCT_IDS") ?? "").split(",").map(s => s.trim()).filter(Boolean);
const APP_URL = Deno.env.get("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000";

const mailProvider = {
  async send({ to, subject, html }: { to: string; subject: string; html: string }) {
    const key = Deno.env.get("RESEND_API_KEY");
    if (!key) { console.log("[DEV] email mock", { to, subject }); return; }
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: Deno.env.get("MAIL_FROM") ?? "no-reply@example.com",
        to, subject, html
      })
    });
  }
};

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i];
  return out === 0;
}

async function verifyHotmartSignature(req: Request, rawBody: string) {
  // 1) Contas com HMAC habilitado
  const hmac = req.headers.get("x-hotmart-hmac-sha256") ?? req.headers.get("X-Hotmart-Hmac-SHA256");
  if (hmac) {
    const key = new TextEncoder().encode(WEBHOOK_SECRET);
    const mac = await crypto.subtle.sign(
      { name: "HMAC", hash: "SHA-256" },
      await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]),
      new TextEncoder().encode(rawBody)
    );
    const expected = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, "0")).join("");
    return timingSafeEqual(new TextEncoder().encode(expected), new TextEncoder().encode(hmac.toLowerCase()));
  }

  // 2) Contas que usam somente Hottok
  const hottok = req.headers.get("hottok") ?? req.headers.get("Hottok");
  if (hottok && WEBHOOK_SECRET && hottok === WEBHOOK_SECRET) return true;

  return false;
}

function mapHotmart(evt: HotmartEvent) {
  const buyer = evt.buyer || evt.data?.buyer || {};
  const purchase = evt.purchase || evt.data?.purchase || {};
  const subscription = evt.subscription || evt.data?.subscription || {};
  return {
    event: evt.event || evt.event_name || "",
    email: (buyer.email || evt.email || "").toLowerCase(),
    name: buyer.name || buyer.full_name || evt.name || "Aluno",
    product_id: String(evt.product?.id ?? purchase.product?.id ?? subscription?.plan?.id ?? evt.product_id ?? ""),
    purchase_id: String(purchase.purchase_id ?? evt.transaction ?? evt.purchase_id ?? ""),
    purchase_status: purchase.status ?? evt.status ?? "UNKNOWN",
  };
}

function normalizeStatus(event: string, purchaseStatus: string) {
  const e = event.toUpperCase();
  const s = purchaseStatus.toUpperCase();

  if (["PURCHASE_APPROVED", "PURCHASE_COMPLETED", "SUBSCRIPTION_RENEWED"].includes(e) || s === "APPROVED")
    return "active";
  if (["PURCHASE_PENDING"].includes(e) || s === "PENDING")
    return "pending";
  if (["PURCHASE_REFUNDED"].includes(e) || s === "REFUNDED")
    return "refunded";
  if (["PURCHASE_CHARGEBACK"].includes(e) || s === "CHARGEBACK")
    return "chargeback";
  if (["PURCHASE_CANCELED", "SUBSCRIPTION_CANCELED"].includes(e))
    return "canceled";
  return "past_due";
}

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const rawBody = await req.text();
  const verified = await verifyHotmartSignature(req, rawBody);
  if (!verified) return new Response("Invalid signature", { status: 401 });

  const payload = JSON.parse(rawBody);
  const evt = Array.isArray(payload) ? payload[0] : payload;
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  const { email, name, product_id, purchase_id, event, purchase_status } = mapHotmart(evt);
  if (!email || !product_id) return new Response("Missing fields", { status: 400 });
  if (PRODUCT_WHITELIST.length && !PRODUCT_WHITELIST.includes(product_id)) return new Response("Ignored", { status: 200 });

  const normalized = normalizeStatus(event, purchase_status);
  const approvedEvents = ["PURCHASE_APPROVED", "PURCHASE_COMPLETED", "SUBSCRIPTION_RENEWED"];
  const isPaidEvent = approvedEvents.includes(event);

  // 1) garante usuário
  const lookup = await supabase.auth.admin.listUsers({ page: 1, perPage: 1, email });
  let user = lookup?.data?.users?.[0];
  if (!user) {
    const created = await supabase.auth.admin.createUser({
      email, email_confirm: true, user_metadata: { name }
    });
    if (created.error) return new Response(created.error.message, { status: 500 });
    user = created.data.user!;
  }

  // 2) garante profile com role de aluno
  await supabase.from("profiles").upsert({ 
    id: user.id, 
    full_name: name, 
    is_admin: false,
    role: 'aluno'
  });

  // 3) upsert assinatura
  await supabase.from("subscriptions").upsert({
    user_id: user.id,
    provider: "hotmart",
    product_id,
    purchase_id,
    status: normalized,
    meta: evt
  }, { onConflict: "purchase_id" });

  // 4) se realmente pago → enviar link recovery
  if (isPaidEvent && normalized === "active") {
    const { data: link, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: `${APP_URL}/onboarding/sucesso` }
    });
    if (!error && link?.action_link) {
      const html = `
        <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #FF6B00; font-size: 28px; margin: 0;">Bem-vindo à Comunidade! 🎉</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;">Olá ${name},</p>
            <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;">Sua compra foi confirmada e você já tem acesso completo à nossa plataforma!</p>
            <p style="margin: 0; font-size: 16px; color: #333;">Acesse sua conta e defina sua senha clicando no botão abaixo:</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link.action_link}" style="background: #FF6B00; color: #fff; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
              Definir minha senha
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px; margin: 0;">Este link expira em 24 horas.</p>
            <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">Se você não conseguir acessar, use a opção "Esqueci minha senha" na página de login.</p>
          </div>
          
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">Bem-vindo à nossa comunidade!</p>
          </div>
        </div>`;
      await mailProvider.send({ to: email, subject: "Bem-vindo à Comunidade! 🎉 - Defina sua senha", html });
    }
  }

  return new Response("ok", { status: 200 });
});


