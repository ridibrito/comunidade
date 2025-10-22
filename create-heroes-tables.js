const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function createHeroesTable() {
  try {
    console.log('🚀 Criando tabela page_heroes...');
    
    // Criar tabela page_heroes
    const { error: tableError } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS page_heroes (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          page_slug TEXT UNIQUE NOT NULL,
          title TEXT NOT NULL,
          subtitle TEXT,
          description TEXT,
          hero_image_url TEXT,
          background_gradient TEXT DEFAULT 'from-purple-900 via-purple-700 to-orange-500',
          stats JSONB DEFAULT '[]',
          cta_buttons JSONB DEFAULT '[]',
          visual_elements JSONB DEFAULT '[]',
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (tableError) {
      console.log('ℹ️ Tabela pode já existir:', tableError.message);
    } else {
      console.log('✅ Tabela page_heroes criada');
    }

    // Inserir dados iniciais
    console.log('🚀 Inserindo dados iniciais...');
    const { error: insertError } = await supabase
      .from('page_heroes')
      .upsert({
        page_slug: 'montanha-do-amanha',
        title: 'MONTANHA DO AMANHÃ',
        subtitle: 'Desenvolva suas habilidades de identificação e compreensão das características AHSD',
        description: 'Através de uma jornada educativa completa e transformadora.',
        background_gradient: 'from-purple-900 via-purple-700 to-orange-500',
        stats: [
          { label: "6 Módulos Fundamentais", icon: "green", value: "6" },
          { label: "Certificação Profissional", icon: "blue", value: "Cert" },
          { label: "Suporte Especializado", icon: "purple", value: "24/7" }
        ],
        cta_buttons: [
          { text: "Começar Jornada", variant: "primary", action: "start" },
          { text: "Ver Módulos", variant: "secondary", action: "view" }
        ],
        visual_elements: [
          { type: "block", color: "yellow-orange", position: "top-right", size: "large" },
          { type: "block", color: "pink-purple", position: "bottom-left", size: "medium" },
          { type: "block", color: "blue-purple", position: "center-right", size: "small" }
        ]
      }, { onConflict: 'page_slug' });

    if (insertError) {
      console.error('❌ Erro ao inserir dados:', insertError.message);
    } else {
      console.log('✅ Dados iniciais inseridos');
    }

    console.log('\n✨ Setup concluído!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

createHeroesTable();
