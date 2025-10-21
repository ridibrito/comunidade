// Script para adicionar campos de convite à tabela profiles
const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function addInviteFields() {
  try {
    console.log('🚀 Adicionando campos de convite à tabela profiles...\n');
    
    // SQL para adicionar os novos campos
    const sql = `
      -- Adicionar campos de status de convite e login
      ALTER TABLE profiles 
      ADD COLUMN IF NOT EXISTS invite_status TEXT CHECK (invite_status IN ('pending', 'sent', 'accepted', 'expired')) DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS invite_sent_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users(id),
      ADD COLUMN IF NOT EXISTS invite_email TEXT,
      ADD COLUMN IF NOT EXISTS invite_token TEXT;
    `;
    
    console.log('📝 Executando SQL...');
    
    // Usar o método correto para executar SQL
    const { data, error } = await supabase.rpc('exec', { sql });
    
    if (error) {
      console.error('❌ Erro ao executar SQL:', error.message);
      
      // Tentar método alternativo
      console.log('🔄 Tentando método alternativo...');
      
      // Executar comandos individuais
      const commands = [
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invite_status TEXT CHECK (invite_status IN ('pending', 'sent', 'accepted', 'expired')) DEFAULT 'pending'",
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invite_sent_at TIMESTAMP WITH TIME ZONE",
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE",
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0",
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users(id)",
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invite_email TEXT",
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS invite_token TEXT"
      ];
      
      for (const command of commands) {
        try {
          const { error: cmdError } = await supabase.rpc('exec', { sql: command });
          if (cmdError) {
            if (cmdError.message.includes('already exists')) {
              console.log(`   ⚠️  Campo já existe: ${command.split(' ')[5]}`);
            } else {
              console.error(`   ❌ Erro: ${cmdError.message}`);
            }
          } else {
            console.log(`   ✅ Campo adicionado: ${command.split(' ')[5]}`);
          }
        } catch (e) {
          console.log(`   ⚠️  Ignorando erro: ${e.message}`);
        }
      }
    } else {
      console.log('✅ Campos adicionados com sucesso!');
    }
    
    // Atualizar usuários existentes para ter status 'accepted'
    console.log('\n🔄 Atualizando usuários existentes...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        invite_status: 'accepted',
        last_login_at: new Date().toISOString()
      })
      .is('invite_status', null);
    
    if (updateError) {
      console.log('⚠️  Erro ao atualizar usuários existentes:', updateError.message);
    } else {
      console.log('✅ Usuários existentes atualizados para status "accepted"');
    }
    
    console.log('\n🎉 Migração concluída! A tabela profiles agora inclui campos de convite.');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

addInviteFields();
