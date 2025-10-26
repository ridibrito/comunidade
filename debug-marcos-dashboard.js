const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugDashboard() {
  console.log('🔍 Debugando sistema de marcos no dashboard...\n');
  
  try {
    // 1. Buscar o conteúdo de teste
    const { data: testContent, error: contentError } = await supabase
      .from('contents')
      .select(`
        id,
        title,
        content_type,
        module_id,
        trail_id,
        modules:modules (
          id,
          title,
          trail_id,
          trails:trails (
            id,
            title,
            slug
          )
        )
      `)
      .ilike('title', '%Teste de Marcos%')
      .single();
    
    if (contentError || !testContent) {
      console.error('❌ Conteúdo de teste não encontrado');
      return;
    }
    
    console.log('✅ Conteúdo de teste encontrado:');
    console.log('   ID:', testContent.id);
    console.log('   Título:', testContent.title);
    console.log('   module_id:', testContent.module_id);
    console.log('   trail_id direto:', testContent.trail_id);
    console.log('');
    
    // 2. Verificar estrutura do módulo
    if (testContent.modules) {
      console.log('✅ Módulo encontrado:');
      console.log('   ID:', testContent.modules.id);
      console.log('   Título:', testContent.modules.title);
      console.log('   trail_id do módulo:', testContent.modules.trail_id);
      console.log('');
      
      if (testContent.modules.trails) {
        console.log('✅ Trilha encontrada via módulo:');
        console.log('   ID:', testContent.modules.trails.id);
        console.log('   Título:', testContent.modules.trails.title);
        console.log('   Slug:', testContent.modules.trails.slug);
        console.log('');
      }
    } else {
      console.log('⚠️ Módulo não encontrado na consulta');
    }
    
    // 3. Qual trail_id o dashboard deveria usar?
    const trailIdToUse = testContent.modules?.trail_id || testContent.trail_id;
    console.log('📋 trail_id que deveria ser usado:', trailIdToUse);
    console.log('');
    
    // 4. Testar a função get_marcos_trilha com esse trail_id
    if (trailIdToUse) {
      const { data: users } = await supabase
        .from('profiles')
        .select('id, full_name')
        .limit(1);
      
      if (users && users.length > 0) {
        const testUser = users[0];
        
        console.log(`🔍 Testando get_marcos_trilha para trail_id: ${trailIdToUse}`);
        const { data: marcosData, error: marcosError } = await supabase
          .rpc('get_marcos_trilha', {
            p_user_id: testUser.id,
            p_trail_id: trailIdToUse
          });
        
        if (marcosError) {
          console.error('❌ Erro ao buscar marcos:', marcosError.message);
        } else {
          console.log(`✅ Marcos retornados: ${marcosData?.length || 0}`);
          if (marcosData && marcosData.length > 0) {
            marcosData.forEach((marco, i) => {
              console.log(`   ${i + 1}. ${marco.module_title} (conquistado: ${marco.conquered})`);
            });
          }
        }
      }
    }
    
    console.log('');
    console.log('='.repeat(60));
    console.log('📊 RESUMO DO PROBLEMA:');
    console.log('');
    
    if (!testContent.modules?.trail_id && !testContent.trail_id) {
      console.log('❌ PROBLEMA IDENTIFICADO:');
      console.log('   O conteúdo não tem trail_id acessível!');
      console.log('');
      console.log('💡 SOLUÇÃO:');
      console.log('   O dashboard precisa buscar trail_id via módulo:');
      console.log('   content.modules.trail_id em vez de content.trail_id');
    } else {
      console.log('✅ trail_id está disponível');
      console.log('   Verifique o console do navegador para ver o log do CardComMarcos');
    }
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

debugDashboard();

