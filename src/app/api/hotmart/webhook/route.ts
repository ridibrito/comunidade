import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const HOTMART_WEBHOOK_SECRET = process.env.HOTMART_WEBHOOK_SECRET!;
const HOTMART_PRODUCT_IDS = process.env.HOTMART_PRODUCT_IDS?.split(',').map(s => s.trim()).filter(Boolean) || [];
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Função para verificar a assinatura do webhook da Hotmart
function verifyHotmartSignature(body: string, signature: string, secret: string): boolean {
  try {
    // Verificar HMAC-SHA256
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(body, 'utf8');
    const expectedSignature = hmac.digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return false;
  }
}

// Função para mapear dados da Hotmart
function mapHotmartData(event: any) {
  const buyer = event.buyer || event.data?.buyer || {};
  const purchase = event.purchase || event.data?.purchase || {};
  const subscription = event.subscription || event.data?.subscription || {};
  
  return {
    event: event.event || event.event_name || '',
    email: (buyer.email || event.email || '').toLowerCase(),
    name: buyer.name || buyer.full_name || event.name || 'Aluno',
    product_id: String(event.product?.id ?? purchase.product?.id ?? subscription?.plan?.id ?? event.product_id ?? ''),
    purchase_id: String(purchase.purchase_id ?? event.transaction ?? event.purchase_id ?? ''),
    purchase_status: purchase.status ?? event.status ?? 'UNKNOWN',
  };
}

// Função para normalizar status
function normalizeStatus(event: string, purchaseStatus: string): string {
  const e = event.toUpperCase();
  const s = purchaseStatus.toUpperCase();
  
  if (e.includes('APPROVED') || e.includes('COMPLETED') || s === 'APPROVED') {
    return 'active';
  }
  if (e.includes('PENDING') || s === 'PENDING') {
    return 'pending';
  }
  if (e.includes('TRIAL')) {
    return 'trial';
  }
  if (e.includes('CANCELED') || e.includes('CANCELLED') || s === 'CANCELLED') {
    return 'canceled';
  }
  if (e.includes('REFUNDED') || s === 'REFUNDED') {
    return 'refunded';
  }
  if (e.includes('CHARGEBACK') || s === 'CHARGEBACK') {
    return 'chargeback';
  }
  if (e.includes('PAST_DUE') || s === 'PAST_DUE') {
    return 'past_due';
  }
  
  return 'pending';
}

// Função para enviar email de boas-vindas
async function sendWelcomeEmail(email: string, name: string) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log('[DEV] Email mock - Enviando email de boas-vindas para:', email);
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || 'no-reply@comunidade.com',
        to: email,
        subject: 'Bem-vindo à Comunidade! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FF6B00;">Bem-vindo à Comunidade!</h1>
            <p>Olá ${name},</p>
            <p>Sua compra foi aprovada e você já tem acesso completo à nossa plataforma!</p>
            <p>Acesse sua conta em: <a href="${APP_URL}/dashboard" style="color: #FF6B00;">${APP_URL}/dashboard</a></p>
            <p>Se você não tem uma senha, use a opção "Esqueci minha senha" para criar uma.</p>
            <p>Bem-vindo à nossa comunidade!</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      console.error('Erro ao enviar email:', await response.text());
    }
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hotmart-hmac-sha256') || request.headers.get('hottok') || '';
    
    // Verificar assinatura do webhook
    if (!verifyHotmartSignature(body, signature, HOTMART_WEBHOOK_SECRET)) {
      console.error('Assinatura inválida do webhook');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const event = Array.isArray(payload) ? payload[0] : payload;
    
    const { email, name, product_id, purchase_id, event: eventType, purchase_status } = mapHotmartData(event);
    
    if (!email || !product_id) {
      console.error('Campos obrigatórios ausentes:', { email, product_id });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verificar se o produto está na whitelist (se configurada)
    if (HOTMART_PRODUCT_IDS.length > 0 && !HOTMART_PRODUCT_IDS.includes(product_id)) {
      console.log('Produto não está na whitelist:', product_id);
      return NextResponse.json({ message: 'Product not in whitelist' }, { status: 200 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const normalizedStatus = normalizeStatus(eventType, purchase_status);
    const approvedEvents = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETED', 'SUBSCRIPTION_RENEWED'];
    const isPaidEvent = approvedEvents.includes(eventType);

    // 1. Verificar se usuário já existe
    const { data: existingUsers } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });
    
    let user = existingUsers?.users?.find(u => u.email === email);
    
    if (!user) {
      // 2. Criar usuário se não existir
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { name },
      });
      
      if (createError) {
        console.error('Erro ao criar usuário:', createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      
      user = newUser.user!;
    }

    // 3. Garantir que o perfil existe
    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: name,
      is_admin: false,
    });

    // 4. Criar/atualizar assinatura
    const { error: subscriptionError } = await supabase.from('subscriptions').upsert({
      user_id: user.id,
      provider: 'hotmart',
      product_id,
      purchase_id,
      status: normalizedStatus,
      meta: event,
    }, {
      onConflict: 'purchase_id'
    });

    if (subscriptionError) {
      console.error('Erro ao criar assinatura:', subscriptionError);
      return NextResponse.json({ error: subscriptionError.message }, { status: 500 });
    }

    // 5. Se for um evento de pagamento aprovado, enviar email de boas-vindas
    if (isPaidEvent && normalizedStatus === 'active') {
      await sendWelcomeEmail(email, name);
    }

    console.log('Webhook processado com sucesso:', {
      email,
      name,
      product_id,
      purchase_id,
      event: eventType,
      status: normalizedStatus,
    });

    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      user_id: user.id,
      status: normalizedStatus 
    });

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Método GET para verificar se o endpoint está funcionando
export async function GET() {
  return NextResponse.json({ 
    message: 'Hotmart webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
