const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function fixProfilesPolicy() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis de ambiente do Supabase não encontradas');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🔧 Corrigindo políticas da tabela profiles...');

    // Executar o script SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Remover todas as políticas existentes da tabela profiles
        DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
        DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
        DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
        DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
        DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;

        -- Recriar políticas simples e corretas
        CREATE POLICY "Users can view own profile" ON profiles
            FOR SELECT USING (auth.uid() = id);

        CREATE POLICY "Users can update own profile" ON profiles
            FOR UPDATE USING (auth.uid() = id);

        CREATE POLICY "Users can insert own profile" ON profiles
            FOR INSERT WITH CHECK (auth.uid() = id);

        -- Verificar se RLS está habilitado
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
      `
    });

    if (error) {
      console.error('❌ Erro ao executar correção:', error);
      return;
    }

    console.log('✅ Políticas corrigidas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

fixProfilesPolicy();
