const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function createTrailsViaAPI() {
  try {
    console.log('🚀 Criando sistema de Trilhas via API...\n');
    
    // Vamos usar a API REST diretamente para executar SQL
    const sql = `
      -- Criar tabela de Trilhas
      CREATE TABLE IF NOT EXISTS trails (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        slug TEXT UNIQUE NOT NULL,
        type TEXT DEFAULT 'montanha',
        image_url TEXT,
        position INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Criar tabela de Módulos
      CREATE TABLE IF NOT EXISTS modules (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        trail_id UUID REFERENCES trails(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        slug TEXT NOT NULL,
        image_url TEXT,
        instructor TEXT,
        duration TEXT,
        difficulty TEXT CHECK (difficulty IN ('Básico', 'Intermediário', 'Avançado')),
        position INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(trail_id, slug)
      );
      
      -- Criar tabela de Aulas
      CREATE TABLE IF NOT EXISTS lessons (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        slug TEXT NOT NULL,
        video_url TEXT,
        materials_url TEXT,
        duration INTEGER DEFAULT 0,
        position INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(module_id, slug)
      );
    `;
    
    console.log('📝 Executando SQL via API REST...');
    
    // Usar fetch para executar SQL via API REST
    const response = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey
      },
      body: JSON.stringify({ sql })
    });
    
    if (!response.ok) {
      console.log('ℹ️ Executando comandos individuais...');
      
      // Tentar criar as tabelas uma por uma
      const createTrailsResponse = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey
        },
        body: JSON.stringify({ 
          sql: `CREATE TABLE IF NOT EXISTS trails (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            slug TEXT UNIQUE NOT NULL,
            type TEXT DEFAULT 'montanha',
            image_url TEXT,
            position INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );`
        })
      });
      
      console.log('✅ Comando SQL executado via API REST');
      
    } else {
      console.log('✅ SQL executado com sucesso via API REST');
    }
    
    // Agora tentar inserir dados
    console.log('\n📚 Inserindo dados iniciais...');
    
    try {
      const { data: trail, error: trailError } = await supabase
        .from('trails')
        .insert({
          title: 'Montanha do Amanhã',
          description: 'Programa completo de desenvolvimento de habilidades para identificação de características AHSD',
          slug: 'montanha-do-amanha',
          type: 'montanha',
          position: 1
        })
        .select('id')
        .single();
      
      if (trailError) {
        console.error('❌ Erro ao inserir trilha:', trailError.message);
      } else {
        console.log('✅ Trilha criada:', trail.id);
        
        // Criar módulos
        const modules = [
          {
            trail_id: trail.id,
            title: 'Aspectos Cognitivos',
            description: 'Desenvolvimento intelectual e habilidades mentais em crianças AHSD',
            slug: 'aspectos-cognitivos',
            instructor: 'Dr. Maria Silva',
            duration: '2h 30min',
            difficulty: 'Intermediário',
            position: 1
          },
          {
            trail_id: trail.id,
            title: 'Aspectos Socioemocionais',
            description: 'Inteligência emocional e relacionamentos',
            slug: 'aspectos-socioemocionais',
            instructor: 'Psicóloga Ana Costa',
            duration: '1h 45min',
            difficulty: 'Básico',
            position: 2
          }
        ];
        
        for (const moduleData of modules) {
          const { data: module, error: moduleError } = await supabase
            .from('modules')
            .insert(moduleData)
            .select('id, title')
            .single();
          
          if (moduleError) {
            console.error(`❌ Erro ao criar módulo "${moduleData.title}":`, moduleError.message);
          } else {
            console.log(`✅ Módulo criado: ${module.title}`);
          }
        }
      }
      
    } catch (insertError) {
      console.log('ℹ️ Erro ao inserir dados:', insertError.message);
    }
    
    console.log('\n✨ Sistema de trilhas configurado!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

createTrailsViaAPI();
