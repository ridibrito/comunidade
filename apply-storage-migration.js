// Script para aplicar migration de storage no Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configurações do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function applyStorageMigration() {
  try {
    console.log('📦 Aplicando migration de storage para module-covers...');
    
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '011_storage_module_covers.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Dividir o SQL em comandos individuais
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    for (const command of commands) {
      if (command.trim()) {
        console.log(`Executando comando...`);
        const { data, error } = await supabase.rpc('exec_sql', { sql: command + ';' });
        
        if (error) {
          if (error.message.includes('already exists')) {
            console.log('⚠️  Já existe, pulando...');
          } else {
            throw error;
          }
        } else {
          console.log('✅ Comando executado com sucesso');
        }
      }
    }
    
    console.log('✅ Migration aplicada com sucesso!');
    console.log('📸 Bucket "module-covers" está pronto para uso');
    
  } catch (error) {
    console.error('❌ Erro ao aplicar migration:', error.message);
    process.exit(1);
  }
}

applyStorageMigration();

