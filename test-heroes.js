const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function testHeroes() {
  try {
    console.log('🚀 Testando sistema de Heroes...\n');
    
    // Verificar se a tabela existe
    const { data: heroes, error } = await supabase
      .from('page_heroes')
      .select('*')
      .eq('page_slug', 'montanha-do-amanha');

    if (error) {
      console.error('❌ Erro ao buscar heroes:', error.message);
      return;
    }

    if (heroes && heroes.length > 0) {
      console.log('✅ Heroes encontrados:');
      heroes.forEach(hero => {
        console.log(`  - ${hero.title} (${hero.page_slug})`);
        console.log(`    Ativo: ${hero.is_active}`);
        console.log(`    Imagem: ${hero.hero_image_url || 'Nenhuma'}`);
      });
    } else {
      console.log('ℹ️ Nenhum hero encontrado');
    }

    // Testar bucket de storage
    console.log('\n🚀 Testando bucket de storage...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError.message);
    } else {
      const heroesBucket = buckets.find(b => b.id === 'heroes');
      if (heroesBucket) {
        console.log('✅ Bucket "heroes" encontrado');
        console.log(`  - Público: ${heroesBucket.public}`);
      } else {
        console.log('ℹ️ Bucket "heroes" não encontrado');
      }
    }

    console.log('\n✨ Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testHeroes();
