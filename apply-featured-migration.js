const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ Variáveis de ambiente não encontradas');
  console.error('Verifique se NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão configuradas');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function applyFeaturedMigration() {
  try {
    console.log('🚀 Aplicando migration para adicionar coluna is_featured...\n');
    
    // Ler o arquivo SQL
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '015_add_is_featured_to_contents.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Dividir em comandos individuais
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📄 Executando ${commands.length} comando(s)...\n`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      const preview = command.substring(0, 80).replace(/\n/g, ' ');
      
      try {
        console.log(`[${i + 1}/${commands.length}] ${preview}...`);
        
        // Executar via RPC se disponível
        const { error } = await supabase.rpc('exec_sql', { sql: command + ';' });
        
        if (error) {
          // Se já existe, ignorar
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate') ||
              error.message.includes('column') && error.message.includes('already exists')) {
            console.log(`   ⚠️  Ignorando (já existe)\n`);
          } else {
            console.error(`   ❌ Erro: ${error.message}\n`);
            throw error;
          }
        } else {
          console.log(`   ✅ Sucesso\n`);
        }
      } catch (err) {
        console.error(`   ❌ Erro ao executar: ${err.message}\n`);
        console.error('   💡 Você pode executar este comando manualmente no SQL Editor do Supabase:\n');
        console.error(`   ${command}\n`);
        throw err;
      }
      
      // Pequena pausa entre comandos
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('✅ Migration aplicada com sucesso!\n');
    
    // Verificar se a coluna foi criada
    console.log('🔍 Verificando se a coluna foi criada...');
    const { data, error } = await supabase
      .from('contents')
      .select('is_featured')
      .limit(1);
    
    if (error && error.message.includes('column') && error.message.includes('does not exist')) {
      console.log('⚠️  A coluna ainda não foi reconhecida. Pode levar alguns segundos.');
      console.log('   Tente recarregar a página ou aguarde alguns instantes.\n');
    } else {
      console.log('✅ Coluna is_featured verificada com sucesso!\n');
    }
    
  } catch (error) {
    console.error('\n❌ Erro ao aplicar migration:', error.message);
    console.error('\n📋 Alternativa: Aplique manualmente no Supabase Dashboard:');
    console.error('   1. Acesse: https://supabase.com/dashboard');
    console.error('   2. Selecione seu projeto');
    console.error('   3. Vá em SQL Editor > New Query');
    console.error('   4. Cole o conteúdo de: supabase/migrations/015_add_is_featured_to_contents.sql');
    console.error('   5. Execute (Ctrl+Enter ou Cmd+Enter)\n');
    process.exit(1);
  }
}

applyFeaturedMigration();

