const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function fixProfilesPolicy() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis de ambiente do Supabase não encontradas');
    console.log('Verifique se NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas no .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🔧 Testando conexão com Supabase...');
    
    // Testar conexão
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erro de conexão:', testError.message);
      return;
    }

    console.log('✅ Conexão com Supabase estabelecida');
    console.log('📝 Execute o seguinte SQL no Supabase Dashboard:');
    console.log('');
    console.log('-- Corrigir políticas da tabela profiles');
    console.log('DROP POLICY IF EXISTS "Users can view own profile" ON profiles;');
    console.log('DROP POLICY IF EXISTS "Users can update own profile" ON profiles;');
    console.log('DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;');
    console.log('DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;');
    console.log('DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;');
    console.log('DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;');
    console.log('');
    console.log('CREATE POLICY "Users can view own profile" ON profiles');
    console.log('    FOR SELECT USING (auth.uid() = id);');
    console.log('');
    console.log('CREATE POLICY "Users can update own profile" ON profiles');
    console.log('    FOR UPDATE USING (auth.uid() = id);');
    console.log('');
    console.log('CREATE POLICY "Users can insert own profile" ON profiles');
    console.log('    FOR INSERT WITH CHECK (auth.uid() = id);');
    console.log('');
    console.log('ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;');
    console.log('');
    console.log('📋 Vá para: https://app.supabase.com/project/ijmiuhfcsxrlgbrohufr/sql');
    console.log('   Cole o SQL acima e execute');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

fixProfilesPolicy();
