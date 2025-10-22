const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function createTrailsSystem() {
  try {
    console.log('🚀 Criando sistema de Trilhas, Módulos e Aulas...\n');
    
    // Criar trilha principal
    console.log('📚 Criando trilha "Montanha do Amanhã"...');
    const { data: trail, error: trailError } = await supabase
      .from('trails')
      .upsert({
        title: 'Montanha do Amanhã',
        description: 'Programa completo de desenvolvimento de habilidades para identificação de características AHSD',
        slug: 'montanha-do-amanha',
        type: 'montanha',
        position: 1,
        is_active: true
      }, { onConflict: 'slug' })
      .select('id')
      .single();
    
    if (trailError) {
      console.error('❌ Erro ao criar trilha:', trailError.message);
      return;
    }
    
    console.log('✅ Trilha criada:', trail.id);
    
    // Criar módulos
    console.log('\n📖 Criando módulos...');
    const modules = [
      {
        title: 'Aspectos Cognitivos',
        description: 'Desenvolvimento intelectual e habilidades mentais em crianças AHSD',
        slug: 'aspectos-cognitivos',
        instructor: 'Dr. Maria Silva',
        duration: '2h 30min',
        difficulty: 'Intermediário',
        position: 1
      },
      {
        title: 'Aspectos Socioemocionais',
        description: 'Inteligência emocional e relacionamentos',
        slug: 'aspectos-socioemocionais',
        instructor: 'Psicóloga Ana Costa',
        duration: '1h 45min',
        difficulty: 'Básico',
        position: 2
      },
      {
        title: 'Rotina e Organização',
        description: 'Estruturação do dia a dia',
        slug: 'rotina-organizacao',
        instructor: 'Pedagoga Carla Santos',
        duration: '1h 20min',
        difficulty: 'Básico',
        position: 3
      },
      {
        title: 'Desenvolvimento Motor',
        description: 'Coordenação e habilidades físicas',
        slug: 'desenvolvimento-motor',
        instructor: 'Fisioterapeuta João Lima',
        duration: '2h 15min',
        difficulty: 'Intermediário',
        position: 4
      },
      {
        title: 'Criatividade',
        description: 'Expressão artística e inovação',
        slug: 'criatividade',
        instructor: 'Arte-terapeuta Sofia Mendes',
        duration: '3h 00min',
        difficulty: 'Avançado',
        position: 5
      },
      {
        title: 'Interesses Específicos',
        description: 'Aprofundamento em áreas de interesse',
        slug: 'interesses-especificos',
        instructor: 'Especialista em AHSD',
        duration: '4h 30min',
        difficulty: 'Avançado',
        position: 6
      }
    ];
    
    for (const moduleData of modules) {
      const { data: module, error: moduleError } = await supabase
        .from('modules')
        .upsert({
          trail_id: trail.id,
          ...moduleData,
          is_active: true
        }, { onConflict: 'trail_id,slug' })
        .select('id, title')
        .single();
      
      if (moduleError) {
        console.error(`❌ Erro ao criar módulo "${moduleData.title}":`, moduleError.message);
      } else {
        console.log(`✅ Módulo criado: ${module.title}`);
      }
    }
    
    // Verificar resultados
    console.log('\n🔍 Verificando dados criados...');
    
    const { data: trails, error: trailsError } = await supabase
      .from('trails')
      .select('id, title, slug');
    
    if (trailsError) {
      console.error('❌ Erro ao verificar trails:', trailsError.message);
    } else {
      console.log('📚 Trilhas encontradas:', trails.length);
      trails.forEach(t => console.log(`  - ${t.title} (${t.slug})`));
    }
    
    const { data: modulesData, error: modulesError } = await supabase
      .from('modules')
      .select('id, title, slug, difficulty');
    
    if (modulesError) {
      console.error('❌ Erro ao verificar modules:', modulesError.message);
    } else {
      console.log('📖 Módulos encontrados:', modulesData.length);
      modulesData.forEach(m => console.log(`  - ${m.title} (${m.difficulty})`));
    }
    
    console.log('\n✨ Sistema de trilhas criado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

createTrailsSystem();
