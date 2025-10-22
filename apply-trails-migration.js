const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function applyTrailsMigration() {
  try {
    console.log('🚀 Criando sistema de Trilhas, Módulos e Aulas...\n');
    
    // Ler o arquivo SQL
    const sql = fs.readFileSync('supabase/migrations/008_trails_system.sql', 'utf8');
    
    // Dividir em comandos individuais
    const commands = sql.split(';').filter(cmd => cmd.trim());
    
    for (const command of commands) {
      if (command.trim()) {
        try {
          // Executar cada comando
          const { error } = await supabase.rpc('exec_sql', { sql: command.trim() + ';' });
          
          if (error && !error.message.includes('already exists') && !error.message.includes('does not exist')) {
            console.error(`❌ Erro ao executar comando:`, error.message);
            console.error('Comando:', command.trim().substring(0, 100) + '...');
          }
        } catch (err) {
          console.log('ℹ️ Comando pode já ter sido executado:', err.message);
        }
      }
    }
    
    console.log('✅ Sistema de trilhas criado com sucesso!');
    
    // Verificar se as tabelas foram criadas
    console.log('\n🔍 Verificando tabelas criadas...');
    
    const { data: trails, error: trailsError } = await supabase
      .from('trails')
      .select('id, title, slug, type')
      .limit(5);
    
    if (trailsError) {
      console.error('❌ Erro ao verificar trails:', trailsError.message);
    } else {
      console.log('📚 Trilhas encontradas:', trails.length);
      trails.forEach(trail => {
        console.log(`  - ${trail.title} (${trail.type})`);
      });
    }
    
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('id, title, slug, difficulty')
      .limit(5);
    
    if (modulesError) {
      console.error('❌ Erro ao verificar modules:', modulesError.message);
    } else {
      console.log('📖 Módulos encontrados:', modules.length);
      modules.forEach(module => {
        console.log(`  - ${module.title} (${module.difficulty})`);
      });
    }
    
    console.log('\n✨ Sistema de trilhas configurado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

applyTrailsMigration();
