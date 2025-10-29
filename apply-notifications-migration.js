// Script para aplicar migration de notificações no Supabase
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
  console.error('\n💡 Configure as variáveis no arquivo .env.local ou .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Função para executar SQL diretamente via REST API
async function executeSQL(sql) {
  try {
    // Usar o método REST diretamente para executar SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ sql })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    // Se exec_sql não existir, tentar método alternativo
    console.log('⚠️ Método exec_sql não disponível, tentando alternativa...');
    throw error;
  }
}

async function applyNotificationsMigration() {
  try {
    console.log('🚀 Aplicando migration do Sistema de Notificações...\n');
    
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '014_create_notifications_table.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Arquivo de migration não encontrado:', migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📄 Arquivo de migration carregado com sucesso\n');

    // Dividir SQL em blocos executáveis
    // Remover comentários e dividir por ponto e vírgula
    const sqlBlocks = migrationSQL
      .split(';')
      .map(block => block.trim())
      .filter(block => {
        // Filtrar blocos vazios e comentários
        const trimmed = block.trim();
        return trimmed.length > 0 && 
               !trimmed.startsWith('--') && 
               !trimmed.startsWith('/*') &&
               trimmed !== '';
      });

    console.log(`📦 Encontrados ${sqlBlocks.length} blocos SQL para executar\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (let i = 0; i < sqlBlocks.length; i++) {
      const block = sqlBlocks[i];
      const preview = block.substring(0, 60).replace(/\n/g, ' ');
      
      try {
        console.log(`[${i + 1}/${sqlBlocks.length}] Executando: ${preview}...`);
        
        // Executar via RPC se disponível
        const { error } = await supabase.rpc('exec_sql', { sql: block + ';' });
        
        if (error) {
          // Se já existe, ignorar
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate') ||
              error.message.includes('already exists') ||
              error.message.includes('relation') && error.message.includes('already exists')) {
            console.log(`   ⚠️  Ignorando (já existe)\n`);
            skipCount++;
          } else {
            console.error(`   ❌ Erro: ${error.message}\n`);
            errorCount++;
          }
        } else {
          console.log(`   ✅ Sucesso\n`);
          successCount++;
        }
      } catch (err) {
        // Tentar execução direta via REST
        try {
          const result = await executeSQL(block + ';');
          console.log(`   ✅ Sucesso (via REST)\n`);
          successCount++;
        } catch (restError) {
          console.error(`   ❌ Erro: ${restError.message}\n`);
          console.error(`   ⚠️  Execute este bloco manualmente no SQL Editor do Supabase\n`);
          errorCount++;
        }
      }
      
      // Pequena pausa entre comandos
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📊 Resultado Final:`);
    console.log(`   ✅ Sucesso: ${successCount}`);
    console.log(`   ⚠️  Ignorados (já existem): ${skipCount}`);
    console.log(`   ❌ Erros: ${errorCount}`);
    console.log('='.repeat(60) + '\n');

    if (errorCount === 0) {
      console.log('🎉 Migration aplicada com sucesso!');
      console.log('\n📋 Próximos passos:');
      console.log('1. ✅ Tabela notifications criada');
      console.log('2. ✅ Políticas RLS configuradas');
      console.log('3. ✅ Funções stored procedures criadas');
      console.log('4. ⚠️  Habilite Realtime no Dashboard do Supabase:');
      console.log('   - Vá em Database > Replication');
      console.log('   - Adicione a tabela "notifications"');
      console.log('   - Ou execute: ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;');
      console.log('\n🔔 Sistema de Notificações pronto para uso!');
    } else {
      console.log('⚠️  Alguns comandos falharam.');
      console.log('💡 Execute o SQL manualmente no Supabase Dashboard:');
      console.log('   https://supabase.com/dashboard/project/[seu-projeto]/sql/new');
      console.log('\n📄 Arquivo: supabase/migrations/014_create_notifications_table.sql');
    }

    // Verificar se a tabela foi criada
    console.log('\n🔍 Verificando criação da tabela...');
    const { data, error } = await supabase
      .from('notifications')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') {
      console.log('⚠️  Tabela notifications ainda não existe. Execute o SQL manualmente.');
    } else if (error) {
      console.log('⚠️  Não foi possível verificar a tabela:', error.message);
    } else {
      console.log('✅ Tabela notifications encontrada e funcionando!');
    }

  } catch (error) {
    console.error('\n❌ Erro fatal ao aplicar migration:', error.message);
    console.error('\n💡 Solução alternativa:');
    console.error('1. Acesse o Supabase Dashboard');
    console.error('2. Vá em SQL Editor');
    console.error('3. Cole o conteúdo de supabase/migrations/014_create_notifications_table.sql');
    console.error('4. Execute o SQL');
    process.exit(1);
  }
}

// Executar
applyNotificationsMigration().catch(console.error);

