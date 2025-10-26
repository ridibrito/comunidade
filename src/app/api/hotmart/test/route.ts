import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    console.log('=== WEBHOOK HOTMART TESTE (SEM VALIDAÇÃO) ===');
    console.log('Body:', body);
    console.log('==============================================');
    
    const payload = JSON.parse(body);
    const event = Array.isArray(payload) ? payload[0] : payload;
    
    // Simular dados da Hotmart para teste
    const email = event.buyer?.email || event.email || 'teste@exemplo.com';
    const name = event.buyer?.name || event.name || 'Usuário Teste';
    const product_id = event.product?.id || event.product_id || '123456';
    
    console.log('📊 Dados simulados:', { email, name, product_id });
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Verificar se usuário já existe
    console.log('🔍 Verificando se usuário já existe:', email);
    const { data: existingUsers } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000, // Aumentar limite para encontrar o usuário
    });
    
    let user = existingUsers?.users?.find(u => u.email === email);
    
    if (!user) {
      console.log('👤 Usuário não existe, criando novo usuário...');
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { name },
      });
      
      if (createError) {
        console.error('❌ Erro ao criar usuário:', createError);
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      
      user = newUser.user!;
      console.log('✅ Usuário criado com sucesso:', user.id);
    } else {
      console.log('✅ Usuário já existe:', user.id);
    }

    // Criar perfil com role de aluno
    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: name,
      is_admin: false,
      role: 'aluno'
    });

    // Criar assinatura
    await supabase.from('subscriptions').upsert({
      user_id: user.id,
      provider: 'hotmart',
      product_id,
      purchase_id: `teste_${Date.now()}`,
      status: 'active',
      meta: event
    }, {
      onConflict: 'purchase_id'
    });

    console.log('🎉 Webhook processado com sucesso!');
    
    return NextResponse.json({ 
      message: 'Webhook de teste processado com sucesso!',
      user_id: user.id,
      email: email,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Endpoint de teste do webhook Hotmart (sem validação)',
    timestamp: new Date().toISOString()
  });
}
