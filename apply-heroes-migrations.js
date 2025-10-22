const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function applyMigration(sqlFile) {
  try {
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Executar cada comando SQL separadamente
    const commands = sql.split(';').filter(cmd => cmd.trim());
    
    for (const command of commands) {
      if (command.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: command.trim() + ';' });
        
        if (error && !error.message.includes('already exists')) {
          console.error(`❌ Erro ao aplicar comando em ${sqlFile}:`, error.message);
          console.error('Comando:', command.trim());
          return false;
        }
      }
    }
    
    console.log(`✅ ${sqlFile} aplicado com sucesso`);
    return true;
  } catch (err) {
    console.error(`❌ Erro ao ler ${sqlFile}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Aplicando migrações para Heroes...\n');
  
  const migrations = [
    'supabase/migrations/006_page_heroes.sql',
    'supabase/migrations/007_heroes_storage.sql'
  ];
  
  for (const migration of migrations) {
    await applyMigration(migration);
  }
  
  console.log('\n✨ Migrações concluídas!');
}

main().catch(console.error);
