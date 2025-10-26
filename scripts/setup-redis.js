// scripts/setup-redis.js
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupRedis() {
  console.log('🔧 Configuração do Redis - Aldeia Singular\n');
  
  console.log('Cole as credenciais do seu Redis Upstash:\n');
  
  const redisUrl = await question('🔗 REST URL do Redis: ');
  const redisToken = await question('🔑 REST Token do Redis: ');
  
  if (!redisUrl || !redisToken) {
    console.log('❌ Credenciais inválidas. Configuração cancelada.');
    rl.close();
    return;
  }
  
  // Criar conteúdo do .env.local
  const envContent = `# Configurações para desenvolvimento
# Gerado automaticamente em ${new Date().toISOString()}

# ===========================================
# RATE LIMITING (UPSTASH REDIS)
# ===========================================
UPSTASH_REDIS_REST_URL=${redisUrl}
UPSTASH_REDIS_REST_TOKEN=${redisToken}

# ===========================================
# ENVIRONMENT
# ===========================================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===========================================
# OUTRAS CONFIGURAÇÕES (configure conforme necessário)
# ===========================================
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# OPENAI_API_KEY=sk-your_openai_api_key
# HOTMART_WEBHOOK_SECRET=your_hotmart_webhook_secret
# RESEND_API_KEY=re_your_resend_api_key
# NEXTAUTH_SECRET=your_nextauth_secret_key_min_32_chars
# NEXTAUTH_URL=https://app.aldeiasingular.com.br
`;

  // Verificar se .env.local já existe
  const envPath = '.env.local';
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  Arquivo .env.local já existe. Deseja sobrescrever? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      console.log('❌ Configuração cancelada.');
      rl.close();
      return;
    }
  }
  
  // Escrever arquivo
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Redis configurado com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Execute: npm run dev');
  console.log('2. Teste o rate limiting');
  console.log('3. Execute: npm run test-improvements-simple');
  
  rl.close();
}

setupRedis().catch(console.error);
