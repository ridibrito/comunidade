/**
 * Script de teste para criar usuário e enviar email de boas-vindas
 * 
 * Uso: node scripts/test-email.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas');
  console.error('Necessário: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createUserAndSendEmail() {
  const email = 'corussmkt@gmail.com';
  const name = 'Ricardo Brito';
  const role = 'aluno';

  console.log('🚀 Iniciando teste de criação de usuário...');
  console.log(`📧 Email: ${email}`);
  console.log(`👤 Nome: ${name}`);
  console.log(`🎭 Role: ${role}`);

  try {
    // 1. Verificar se o usuário já existe
    console.log('\n1️⃣ Verificando se o usuário já existe...');
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const existingUser = usersData.users?.find((user) => user.email === email);
    
    if (existingUser) {
      console.log('⚠️  Usuário já existe. Deletando...');
      const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);
      if (deleteError) {
        console.error('❌ Erro ao deletar usuário existente:', deleteError);
        return;
      }
      console.log('✅ Usuário deletado com sucesso');
    }

    // 2. Gerar senha temporária
    console.log('\n2️⃣ Gerando senha temporária...');
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
    console.log(`🔑 Senha temporária gerada: ${tempPassword}`);

    // 3. Criar usuário
    console.log('\n3️⃣ Criando usuário...');
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        temp_password: true,
        generated_password: tempPassword
      }
    });

    if (createError) {
      console.error('❌ Erro ao criar usuário:', createError);
      return;
    }

    if (!userData?.user?.id) {
      console.error('❌ Resposta inválida ao criar usuário');
      return;
    }

    console.log('✅ Usuário criado com sucesso!');
    console.log(`   ID: ${userData.user.id}`);

    // 4. Criar perfil
    console.log('\n4️⃣ Criando perfil...');
    const { data: profileResult, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userData.user.id,
        full_name: name,
        role: role,
        is_admin: role === 'admin',
        invite_status: 'accepted',
        invite_email: email,
        invite_sent_at: new Date().toISOString(),
        temp_password: tempPassword
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError);
      // Continuar mesmo assim, pois o email pode ser enviado
    } else {
      console.log('✅ Perfil criado com sucesso!');
    }

    // 5. Enviar email via Edge Function
    console.log('\n5️⃣ Enviando email via Edge Function...');
    const { data: emailData, error: emailError } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        email,
        name,
        tempPassword
      }
    });

    if (emailError) {
      console.error('❌ Erro ao enviar email:', emailError);
      console.log('\n📋 Resumo:');
      console.log(`   ✅ Usuário criado: ${userData.user.id}`);
      console.log(`   ❌ Email não enviado`);
      console.log(`   📧 Email: ${email}`);
      console.log(`   🔑 Senha: ${tempPassword}`);
      return;
    }

    console.log('✅ Email enviado com sucesso!');
    console.log('📧 Dados do email:', JSON.stringify(emailData, null, 2));

    // 6. Resumo final
    console.log('\n🎉 Resumo final:');
    console.log('   ✅ Usuário criado');
    console.log('   ✅ Perfil criado');
    console.log('   ✅ Email enviado');
    console.log(`   📧 Email: ${email}`);
    console.log(`   🔑 Senha: ${tempPassword}`);
    console.log(`   🌐 Acesse: https://app.aldeiasingular.com.br/auth/login`);

  } catch (error) {
    console.error('❌ Erro geral:', error);
    if (error instanceof Error) {
      console.error('   Mensagem:', error.message);
      console.error('   Stack:', error.stack);
    }
  }
}

// Executar
createUserAndSendEmail()
  .then(() => {
    console.log('\n✅ Teste concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });

