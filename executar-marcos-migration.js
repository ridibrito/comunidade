const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executarMigracao() {
  console.log('🚀 Executando migração do Sistema de Marcos...\n');
  
  try {
    // Ler o arquivo SQL
    const sql = fs.readFileSync('./sistema-marcos.sql', 'utf8');
    
    // Dividir em comandos individuais
    const comandos = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📋 Executando ${comandos.length} comandos SQL...\n`);
    
    let sucesso = 0;
    let falhas = 0;
    
    for (let i = 0; i < comandos.length; i++) {
      const comando = comandos[i] + ';';
      const descricao = comando.substring(0, 50).replace(/\n/g, ' ');
      
      console.log(`[${i + 1}/${comandos.length}] ${descricao}...`);
      
      try {
        // Tentar executar via RPC primeiro
        const { error } = await supabase.rpc('query', { query_text: comando });
        
        if (error) {
          // Se RPC falhar, tentar método alternativo
          if (comando.toLowerCase().includes('create table')) {
            console.log('  ⚠️ Tentando criar tabela via inserção direta...');
            // A tabela provavelmente já existe ou precisa ser criada via SQL Editor
            console.log('  ℹ️ Execute este comando manualmente no SQL Editor do Supabase');
          } else {
            console.log(`  ⚠️ ${error.message}`);
          }
          falhas++;
        } else {
          console.log('  ✅ Sucesso');
          sucesso++;
        }
      } catch (err) {
        console.log(`  ❌ ${err.message}`);
        falhas++;
      }
      
      // Pequena pausa entre comandos
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`✅ Sucesso: ${sucesso} comandos`);
    console.log(`⚠️ Falhas: ${falhas} comandos`);
    console.log('='.repeat(50));
    
    if (falhas > 0) {
      console.log('\n⚠️ Alguns comandos falharam. Execute o SQL manualmente no Supabase:');
      console.log('1. Acesse: https://supabase.com/dashboard/project/btuenakbvssiekfdbecx/editor');
      console.log('2. Abra o SQL Editor');
      console.log('3. Cole o conteúdo de sistema-marcos.sql');
      console.log('4. Execute');
    } else {
      console.log('\n🎉 Migração concluída com sucesso!');
      console.log('🏔️ Sistema de Marcos está pronto para uso!');
    }
    
  } catch (error) {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  }
}

executarMigracao();

