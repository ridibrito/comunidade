import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    
    console.log('=== WEBHOOK DEBUG - PRODUÇÃO ===');
    console.log('Headers:', headers);
    console.log('Body:', body);
    console.log('================================');
    
    // Parse do body
    const payload = JSON.parse(body);
    const event = Array.isArray(payload) ? payload[0] : payload;
    
    // Extrair dados básicos
    const buyer = event.buyer || event.data?.buyer || {};
    const email = (buyer.email || event.email || '').toLowerCase();
    const name = buyer.name || buyer.first_name || buyer.name || 'Usuário Teste';
    const product = event.product || event.data?.product || {};
    const product_id = String(product.id || event.product_id || '');
    
    console.log('📊 Dados extraídos:', { email, name, product_id });
    
    if (!email) {
      return NextResponse.json({ 
        message: 'Email não encontrado no payload',
        debug: { event, buyer, product }
      });
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Verificar se usuário existe
    const { data: existingUsers } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    
    const user = existingUsers?.users?.find(u => u.email === email);
    
    return NextResponse.json({
      message: 'Debug webhook executado com sucesso',
      debug: {
        email,
        name,
        product_id,
        user_exists: !!user,
        user_id: user?.id || null,
        total_users: existingUsers?.users?.length || 0,
        headers: {
          'x-hotmart-hottok': headers['x-hotmart-hottok'] || 'Não encontrado',
          'x-hotmart-hmac-sha256': headers['x-hotmart-hmac-sha256'] || 'Não encontrado',
          'hottok': headers['hottok'] || 'Não encontrado'
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Erro no debug webhook:', error);
    return NextResponse.json({
      error: 'Erro no debug webhook',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Endpoint de debug do webhook Hotmart (sem validação)',
    timestamp: new Date().toISOString()
  });
}
