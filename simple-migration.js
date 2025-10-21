// Script simples para adicionar campos de convite
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

async function checkAndUpdateProfiles() {
  try {
    console.log('🔍 Verificando estrutura atual da tabela profiles...');
    
    // Tentar buscar perfis com os novos campos
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, invite_status, last_login_at, login_count')
      .limit(1);
    
    if (error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('📝 Campos de convite não existem. Executando SQL manual...');
        console.log('\n⚠️  ATENÇÃO: Você precisa executar o seguinte SQL no Supabase Dashboard:');
        console.log('\n' + '='.repeat(60));
        console.log(`
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS invite_status TEXT CHECK (invite_status IN ('pending', 'sent', 'accepted', 'expired')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS invite_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS invite_email TEXT,
ADD COLUMN IF NOT EXISTS invite_token TEXT;

-- Atualizar usuários existentes
UPDATE profiles 
SET invite_status = 'accepted', last_login_at = created_at
WHERE invite_status IS NULL OR invite_status = 'pending';
        `);
        console.log('='.repeat(60));
        console.log('\n📋 Instruções:');
        console.log('1. Acesse o Supabase Dashboard');
        console.log('2. Vá para SQL Editor');
        console.log('3. Cole e execute o SQL acima');
        console.log('4. Execute novamente este script para verificar');
        
        return false;
      } else {
        throw error;
      }
    } else {
      console.log('✅ Campos de convite já existem!');
      console.log(`📊 Encontrados ${profiles?.length || 0} perfis`);
      
      // Verificar se há usuários sem status
      const { data: profilesWithoutStatus, error: statusError } = await supabase
        .from('profiles')
        .select('id')
        .is('invite_status', null);
      
      if (statusError) {
        console.log('⚠️  Erro ao verificar status:', statusError.message);
      } else if (profilesWithoutStatus?.length > 0) {
        console.log(`🔄 Atualizando ${profilesWithoutStatus.length} usuários sem status...`);
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            invite_status: 'accepted',
            last_login_at: new Date().toISOString()
          })
          .is('invite_status', null);
        
        if (updateError) {
          console.log('⚠️  Erro ao atualizar:', updateError.message);
        } else {
          console.log('✅ Usuários atualizados com sucesso!');
        }
      }
      
      return true;
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  }
}

checkAndUpdateProfiles();
