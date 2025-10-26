import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const config = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ Não configurado',
    supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurado' : '❌ Não configurado',
    hotmartWebhookSecret: process.env.HOTMART_WEBHOOK_SECRET ? '✅ Configurado' : '❌ Não configurado',
    hotmartProductIds: process.env.HOTMART_PRODUCT_IDS || 'Nenhum configurado',
    resendApiKey: process.env.RESEND_API_KEY ? '✅ Configurado' : '❌ Não configurado',
    mailFrom: process.env.MAIL_FROM || 'Não configurado',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'Não configurado'
  };

  return NextResponse.json({
    message: 'Configuração do webhook Hotmart',
    config,
    timestamp: new Date().toISOString()
  });
}
