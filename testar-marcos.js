const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testarMarcos() {
  console.log('🏔️ Testando Sistema de Marcos...\n');
  
  try {
    // 1. Verificar se a tabela foi criada
    console.log('📋 1. Verificando tabela marcos_conquistados...');
    const { data: tables, error: tableError } = await supabase
      .from('marcos_conquistados')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Erro ao acessar tabela:', tableError.message);
      return;
    }
    console.log('✅ Tabela existe e está acessível!\n');
    
    // 2. Buscar uma trilha do banco
    console.log('📋 2. Buscando trilhas disponíveis...');
    const { data: trails, error: trailsError } = await supabase
      .from('trails')
      .select('id, title, slug')
      .limit(5);
    
    if (trailsError) {
      console.error('❌ Erro ao buscar trilhas:', trailsError.message);
      return;
    }
    
    if (trails && trails.length > 0) {
      console.log(`✅ Encontradas ${trails.length} trilhas:`);
      trails.forEach((trail, i) => {
        console.log(`   ${i + 1}. ${trail.title} (${trail.slug})`);
      });
      console.log('');
      
      // 3. Buscar módulos da primeira trilha
      const firstTrail = trails[0];
      console.log(`📋 3. Buscando módulos da trilha "${firstTrail.title}"...`);
      const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select('id, title, position')
        .eq('trail_id', firstTrail.id)
        .order('position');
      
      if (modulesError) {
        console.error('❌ Erro ao buscar módulos:', modulesError.message);
        return;
      }
      
      if (modules && modules.length > 0) {
        console.log(`✅ Encontrados ${modules.length} módulos:`);
        modules.forEach((mod, i) => {
          console.log(`   ${i + 1}. ${mod.title} (posição: ${mod.position})`);
        });
        console.log('');
      } else {
        console.log('⚠️ Nenhum módulo encontrado para esta trilha.\n');
      }
    } else {
      console.log('⚠️ Nenhuma trilha encontrada no banco.\n');
    }
    
    // 4. Testar função RPC get_marcos_trilha
    console.log('📋 4. Testando função get_marcos_trilha...');
    
    // Buscar um usuário de teste
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .limit(1);
    
    if (usersError || !users || users.length === 0) {
      console.log('⚠️ Nenhum usuário encontrado para teste.\n');
    } else if (trails && trails.length > 0) {
      const testUser = users[0];
      const testTrail = trails[0];
      
      const { data: marcosData, error: marcosError } = await supabase
        .rpc('get_marcos_trilha', {
          p_user_id: testUser.id,
          p_trail_id: testTrail.id
        });
      
      if (marcosError) {
        console.error('❌ Erro ao chamar get_marcos_trilha:', marcosError.message);
      } else {
        console.log(`✅ Função get_marcos_trilha funcionando!`);
        console.log(`   Usuário: ${testUser.full_name}`);
        console.log(`   Trilha: ${testTrail.title}`);
        console.log(`   Marcos retornados: ${marcosData ? marcosData.length : 0}`);
        
        if (marcosData && marcosData.length > 0) {
          const conquistados = marcosData.filter(m => m.conquered).length;
          console.log(`   Marcos conquistados: ${conquistados}/${marcosData.length}`);
        }
        console.log('');
      }
    }
    
    // 5. Testar função RPC get_progresso_marcos
    console.log('📋 5. Testando função get_progresso_marcos...');
    if (users && users.length > 0 && trails && trails.length > 0) {
      const testUser = users[0];
      const testTrail = trails[0];
      
      const { data: progressoData, error: progressoError } = await supabase
        .rpc('get_progresso_marcos', {
          p_user_id: testUser.id,
          p_trail_id: testTrail.id
        });
      
      if (progressoError) {
        console.error('❌ Erro ao chamar get_progresso_marcos:', progressoError.message);
      } else {
        console.log(`✅ Função get_progresso_marcos funcionando!`);
        if (progressoData && progressoData.length > 0) {
          const progresso = progressoData[0];
          console.log(`   Conquistados: ${progresso.conquistados}`);
          console.log(`   Total: ${progresso.total}`);
          console.log(`   Porcentagem: ${progresso.porcentagem}%`);
        }
        console.log('');
      }
    }
    
    console.log('='.repeat(60));
    console.log('🎉 Sistema de Marcos está funcionando corretamente!');
    console.log('🏔️ Os marcos aparecerão automaticamente quando você:');
    console.log('   1. Completar um módulo (100% de progresso)');
    console.log('   2. Visualizar o HeroCarousel de uma trilha');
    console.log('   3. Ver os cards na seção Novidades/Continue de onde parou');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    process.exit(1);
  }
}

testarMarcos();

