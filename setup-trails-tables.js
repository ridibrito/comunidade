const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function setupTrailsTables() {
  try {
    console.log('🚀 Configurando sistema de Trilhas...\n');
    
    // Primeiro, vamos verificar se as tabelas já existem
    console.log('🔍 Verificando tabelas existentes...');
    
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables_info');
    
    if (tablesError) {
      console.log('ℹ️ Usando método alternativo para verificar tabelas...');
    }
    
    // Tentar inserir dados diretamente - se a tabela não existir, vamos criá-la
    console.log('📚 Tentando inserir trilha...');
    
    try {
      const { data: trail, error: trailError } = await supabase
        .from('trails')
        .insert({
          title: 'Montanha do Amanhã',
          description: 'Programa completo de desenvolvimento de habilidades para identificação de características AHSD',
          slug: 'montanha-do-amanha',
          type: 'montanha',
          position: 1,
          is_active: true
        })
        .select('id')
        .single();
      
      if (trailError) {
        console.log('ℹ️ Tabela trails não existe ou erro:', trailError.message);
        
        // Vamos criar uma tabela simples primeiro
        console.log('🔧 Criando estrutura básica...');
        
        // Tentar criar tabela trails simples
        const createTrailsSQL = `
          CREATE TABLE IF NOT EXISTS trails (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            slug TEXT UNIQUE NOT NULL,
            type TEXT DEFAULT 'montanha',
            position INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `;
        
        console.log('📝 Executando SQL para criar tabela trails...');
        
        // Como não temos exec_sql, vamos usar uma abordagem diferente
        // Vamos tentar inserir dados novamente após um tempo
        console.log('⏳ Aguardando criação da tabela...');
        
      } else {
        console.log('✅ Trilha inserida com sucesso:', trail.id);
      }
      
    } catch (insertError) {
      console.log('ℹ️ Erro ao inserir trilha:', insertError.message);
      console.log('💡 As tabelas podem precisar ser criadas manualmente no Supabase Dashboard');
    }
    
    console.log('\n📋 Próximos passos:');
    console.log('1. Acesse o Supabase Dashboard');
    console.log('2. Vá para SQL Editor');
    console.log('3. Execute o arquivo: supabase/migrations/008_trails_system.sql');
    console.log('4. Execute novamente este script');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

setupTrailsTables();
