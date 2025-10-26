const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarTrilha() {
  const trailId = '87691353-8b61-49bd-9a30-6bdf3987d668';
  
  console.log('🔍 Verificando trilha:', trailId);
  console.log('');
  
  // 1. Buscar info da trilha
  const { data: trail, error: trailError } = await supabase
    .from('trails')
    .select('id, title, slug')
    .eq('id', trailId)
    .single();
  
  if (trailError) {
    console.error('❌ Erro ao buscar trilha:', trailError.message);
    return;
  }
  
  console.log('✅ Trilha encontrada:');
  console.log(`   Título: ${trail.title}`);
  console.log(`   Slug: ${trail.slug}`);
  console.log('');
  
  // 2. Buscar módulos dessa trilha
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('id, title, position')
    .eq('trail_id', trailId)
    .order('position');
  
  if (modulesError) {
    console.error('❌ Erro ao buscar módulos:', modulesError.message);
    return;
  }
  
  console.log(`📋 Módulos encontrados: ${modules?.length || 0}`);
  
  if (modules && modules.length > 0) {
    modules.forEach((mod, i) => {
      console.log(`   ${i + 1}. ${mod.title} (posição: ${mod.position})`);
    });
  } else {
    console.log('   ⚠️ Esta trilha não possui módulos!');
    console.log('');
    console.log('💡 SOLUÇÃO:');
    console.log('   Para ver os marcos funcionando, você precisa:');
    console.log('   1. Criar módulos para esta trilha no admin');
    console.log('   2. OU usar uma trilha que já tenha módulos');
    console.log('');
    console.log('🔍 Buscando outras trilhas com módulos...');
    console.log('');
    
    // Buscar trilhas que têm módulos
    const { data: allTrails } = await supabase
      .from('trails')
      .select(`
        id,
        title,
        slug,
        modules:modules(count)
      `);
    
    if (allTrails) {
      const trilhasComModulos = allTrails.filter((t) => t.modules && t.modules.length > 0 && t.modules[0].count > 0);
      
      if (trilhasComModulos.length > 0) {
        console.log(`✅ Encontradas ${trilhasComModulos.length} trilhas com módulos:`);
        trilhasComModulos.forEach((t, i) => {
          console.log(`   ${i + 1}. ${t.title} (${t.slug})`);
        });
      } else {
        console.log('⚠️ Nenhuma trilha possui módulos no momento.');
        console.log('   Você precisa criar módulos no admin para ver os marcos!');
      }
    }
  }
  
  console.log('');
  console.log('='.repeat(60));
}

verificarTrilha();

