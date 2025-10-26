const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  console.error('\n📝 Certifique-se de que o arquivo .env.local existe e contém essas variáveis.');
  process.exit(1);
}

// Criar cliente Supabase com service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMarcosMigration() {
  try {
    console.log('🚀 Iniciando aplicação da migração do Sistema de Marcos...\n');

    // Ler o arquivo de migração
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '001_create_marcos_system.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Arquivo de migração não encontrado:', migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📄 Arquivo de migração carregado com sucesso');

    // Executar a migração
    console.log('⚡ Executando migração...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      console.error('❌ Erro ao executar migração:', error);
      process.exit(1);
    }

    console.log('✅ Migração executada com sucesso!');
    console.log('📊 Dados retornados:', data);

    // Verificar se as tabelas foram criadas
    console.log('\n🔍 Verificando criação das tabelas...');
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['marcos_conquistados']);

    if (tablesError) {
      console.warn('⚠️ Não foi possível verificar as tabelas:', tablesError);
    } else {
      console.log('📋 Tabelas encontradas:', tables?.map(t => t.table_name));
    }

    // Verificar se as funções foram criadas
    console.log('\n🔍 Verificando criação das funções...');
    
    const { data: functions, error: functionsError } = await supabase
      .from('information_schema.routines')
      .select('routine_name')
      .eq('routine_schema', 'public')
      .in('routine_name', ['get_marcos_trilha', 'get_progresso_marcos', 'conquistar_marco']);

    if (functionsError) {
      console.warn('⚠️ Não foi possível verificar as funções:', functionsError);
    } else {
      console.log('⚙️ Funções encontradas:', functions?.map(f => f.routine_name));
    }

    console.log('\n🎉 Sistema de Marcos instalado com sucesso!');
    console.log('🏔️ Os Aldeões agora podem conquistar marcos ao completar módulos!');

  } catch (error) {
    console.error('❌ Erro durante a aplicação da migração:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  applyMarcosMigration();
}

module.exports = { applyMarcosMigration };
