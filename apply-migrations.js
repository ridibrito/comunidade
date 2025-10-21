// Script para aplicar migrations no Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configurações do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function applyMigration(migrationFile) {
  try {
    console.log(`📄 Aplicando migration: ${migrationFile}`);
    
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFile);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Dividir o SQL em comandos individuais
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    for (const command of commands) {
      if (command.trim()) {
        console.log(`   Executando: ${command.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: command });
        
        if (error) {
          // Se for erro de coluna já existe, ignorar
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate key') ||
              error.message.includes('already exists')) {
            console.log(`   ⚠️  Ignorando (já existe): ${error.message}`);
          } else {
            throw error;
          }
        }
      }
    }
    
    console.log(`✅ Migration ${migrationFile} aplicada com sucesso!`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao aplicar migration ${migrationFile}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando aplicação de migrations...\n');
  
  const migrations = [
    '001_create_profiles_table.sql',
    '002_add_invite_status_fields.sql'
  ];
  
  let successCount = 0;
  
  for (const migration of migrations) {
    const success = await applyMigration(migration);
    if (success) successCount++;
    console.log(''); // Linha em branco
  }
  
  console.log(`📊 Resultado: ${successCount}/${migrations.length} migrations aplicadas com sucesso`);
  
  if (successCount === migrations.length) {
    console.log('🎉 Todas as migrations foram aplicadas! A tabela profiles foi atualizada.');
    console.log('\n📋 Novos campos adicionados:');
    console.log('   - invite_status (pending, sent, accepted, expired)');
    console.log('   - invite_sent_at');
    console.log('   - last_login_at');
    console.log('   - login_count');
    console.log('   - invited_by');
    console.log('   - invite_email');
    console.log('   - invite_token');
  } else {
    console.log('⚠️  Algumas migrations falharam. Verifique os logs acima.');
  }
}

main().catch(console.error);
