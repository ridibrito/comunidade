const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function criarConteudoTeste() {
  console.log('🚀 Criando conteúdo de teste com marcos...\n');
  
  try {
    // 1. Buscar a trilha PAPaiS Express
    const { data: trail, error: trailError } = await supabase
      .from('trails')
      .select('id, title, slug')
      .eq('slug', 'papais_express')
      .single();
    
    if (trailError || !trail) {
      console.error('❌ Erro ao buscar trilha PAPaiS Express');
      return;
    }
    
    console.log(`✅ Trilha encontrada: ${trail.title}`);
    console.log(`   ID: ${trail.id}\n`);
    
    // 2. Buscar os módulos dessa trilha
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('id, title, position')
      .eq('trail_id', trail.id)
      .order('position');
    
    if (modulesError || !modules || modules.length === 0) {
      console.error('❌ Nenhum módulo encontrado para esta trilha');
      return;
    }
    
    console.log(`✅ Módulos encontrados: ${modules.length}`);
    modules.forEach((mod, i) => {
      console.log(`   ${i + 1}. ${mod.title}`);
    });
    console.log('');
    
    // 3. Buscar um usuário para teste
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .limit(1);
    
    if (usersError || !users || users.length === 0) {
      console.error('❌ Nenhum usuário encontrado');
      return;
    }
    
    const testUser = users[0];
    console.log(`✅ Usuário de teste: ${testUser.full_name}\n`);
    
    // 4. Criar conteúdo de teste no primeiro módulo
    const firstModule = modules[0];
    
    const { data: newContent, error: contentError } = await supabase
      .from('contents')
      .insert({
        title: `🎯 Teste de Marcos - ${firstModule.title}`,
        description: 'Conteúdo de teste para visualizar o sistema de marcos funcionando!',
        content_type: 'video',
        slug: `teste-marcos-${Date.now()}`,
        duration: 15,
        module_id: firstModule.id,
        // trail_id: trail.id,  // Removido - constraint impede ter os dois
        status: 'published',
        image_url: '/logo_full.png'
      })
      .select()
      .single();
    
    if (contentError) {
      console.error('❌ Erro ao criar conteúdo:', contentError.message);
      return;
    }
    
    console.log('✅ Conteúdo de teste criado com sucesso!');
    console.log(`   ID: ${newContent.id}`);
    console.log(`   Título: ${newContent.title}\n`);
    
    // 5. Testar a função get_marcos_trilha
    console.log('🔍 Testando função get_marcos_trilha...');
    const { data: marcosData, error: marcosError } = await supabase
      .rpc('get_marcos_trilha', {
        p_user_id: testUser.id,
        p_trail_id: trail.id
      });
    
    if (marcosError) {
      console.error('❌ Erro ao buscar marcos:', marcosError.message);
    } else {
      console.log(`✅ Marcos encontrados: ${marcosData?.length || 0}`);
      if (marcosData && marcosData.length > 0) {
        marcosData.forEach((marco, i) => {
          const status = marco.conquered ? '🚩 CONQUISTADO' : '⚪ Não conquistado';
          console.log(`   ${i + 1}. ${marco.module_title} - ${status}`);
        });
      }
      console.log('');
    }
    
    console.log('='.repeat(60));
    console.log('🎉 Tudo pronto!');
    console.log('');
    console.log('📋 Próximos passos:');
    console.log('   1. Recarregue o dashboard');
    console.log('   2. Você verá o conteúdo de teste nos "Novidades"');
    console.log(`   3. O card mostrará ${modules.length} marcos (bandeirinhas)`);
    console.log('   4. Todos estarão "não conquistados" (cinza)');
    console.log('');
    console.log('💡 Para conquistar um marco:');
    console.log('   - Complete um módulo (assista 100% do conteúdo)');
    console.log('   - O marco ficará dourado automaticamente! 🏆');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

criarConteudoTeste();

