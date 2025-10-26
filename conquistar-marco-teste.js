const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function conquistarMarcoTeste() {
  console.log('🏆 Conquistando marco de teste...\n');
  
  try {
    // 1. Buscar o usuário
    const { data: users } = await supabase
      .from('profiles')
      .select('id, full_name')
      .limit(1);
    
    if (!users || users.length === 0) {
      console.error('❌ Nenhum usuário encontrado');
      return;
    }
    
    const testUser = users[0];
    console.log(`✅ Usuário: ${testUser.full_name}\n`);
    
    // 2. Buscar o módulo PAPaiS Express
    const { data: trail } = await supabase
      .from('trails')
      .select('id')
      .eq('slug', 'papais_express')
      .single();
    
    if (!trail) {
      console.error('❌ Trilha não encontrada');
      return;
    }
    
    const { data: modules } = await supabase
      .from('modules')
      .select('id, title')
      .eq('trail_id', trail.id)
      .limit(1);
    
    if (!modules || modules.length === 0) {
      console.error('❌ Módulo não encontrado');
      return;
    }
    
    const testModule = modules[0];
    console.log(`✅ Módulo: ${testModule.title}\n`);
    
    // 3. Buscar conteúdo desse módulo
    const { data: contents } = await supabase
      .from('contents')
      .select('id, title')
      .eq('module_id', testModule.id)
      .limit(1);
    
    if (!contents || contents.length === 0) {
      console.error('❌ Conteúdo não encontrado');
      return;
    }
    
    const testContent = contents[0];
    console.log(`✅ Conteúdo: ${testContent.title}\n`);
    
    // 4. Criar/atualizar progresso para 100%
    console.log('📊 Atualizando progresso para 100%...');
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: testUser.id,
        content_id: testContent.id,
        completion_percentage: 100,
        is_completed: true,
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (progressError) {
      console.error('❌ Erro ao atualizar progresso:', progressError.message);
      return;
    }
    
    console.log('✅ Progresso atualizado para 100%!\n');
    
    // 5. Verificar se o marco foi conquistado
    console.log('🔍 Verificando marcos conquistados...');
    await new Promise(resolve => setTimeout(resolve, 500)); // Aguardar trigger
    
    const { data: marcos, error: marcosError } = await supabase
      .from('marcos_conquistados')
      .select('*')
      .eq('user_id', testUser.id)
      .eq('module_id', testModule.id);
    
    if (marcosError) {
      console.error('❌ Erro ao verificar marcos:', marcosError.message);
      return;
    }
    
    if (marcos && marcos.length > 0) {
      console.log('🎉 MARCO CONQUISTADO!');
      console.log(`   Módulo: ${testModule.title}`);
      console.log(`   Conquistado em: ${new Date(marcos[0].conquered_at).toLocaleString('pt-BR')}`);
    } else {
      console.log('⚠️ Marco ainda não foi conquistado automaticamente.');
      console.log('   Vou inserir manualmente...\n');
      
      const { error: insertError } = await supabase
        .from('marcos_conquistados')
        .insert({
          user_id: testUser.id,
          module_id: testModule.id,
          trail_id: trail.id,
          conquered_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('❌ Erro ao inserir marco:', insertError.message);
        return;
      }
      
      console.log('✅ Marco inserido manualmente!');
    }
    
    console.log('');
    console.log('='.repeat(60));
    console.log('🎉 Marco conquistado com sucesso!');
    console.log('');
    console.log('📋 Próximos passos:');
    console.log('   1. Recarregue o dashboard');
    console.log('   2. A bandeirinha agora estará DOURADA! 🏆');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

conquistarMarcoTeste();

