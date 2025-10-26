// scripts/setup-env.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envTemplate = `# Configurações de produção para Aldeia Singular
# Gerado automaticamente em ${new Date().toISOString()}

# ===========================================
# SUPABASE CONFIGURATION
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ===========================================
# RATE LIMITING (UPSTASH REDIS)
# ===========================================
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# ===========================================
# OPENAI (PARA IA)
# ===========================================
OPENAI_API_KEY=sk-your_openai_api_key

# ===========================================
# HOTMART INTEGRATION
# ===========================================
HOTMART_WEBHOOK_SECRET=your_hotmart_webhook_secret

# ===========================================
# EMAIL (RESEND)
# ===========================================
RESEND_API_KEY=re_your_resend_api_key

# ===========================================
# SECURITY
# ===========================================
NEXTAUTH_SECRET=your_nextauth_secret_key_min_32_chars
NEXTAUTH_URL=https://app.aldeiasingular.com.br

# ===========================================
# MONITORING (OPCIONAL)
# ===========================================
SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
VERCEL_ANALYTICS_ID=your_vercel_analytics_id

# ===========================================
# ENVIRONMENT
# ===========================================
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://app.aldeiasingular.com.br

# ===========================================
# PERFORMANCE
# ===========================================
CACHE_TTL=300000
CACHE_MAX_SIZE=1000

# ===========================================
# SECURITY HEADERS
# ===========================================
CSP_NONCE_ENABLED=true
HSTS_MAX_AGE=31536000

# ===========================================
# RATE LIMITING CONFIG
# ===========================================
RATE_LIMIT_LOGIN=5
RATE_LIMIT_WINDOW=300000
RATE_LIMIT_PASSWORD_RESET=3
RATE_LIMIT_PASSWORD_RESET_WINDOW=3600000`;

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnvironment() {
  console.log('🔧 Configuração de Ambiente - Aldeia Singular\n');
  
  console.log('Este script irá ajudá-lo a configurar as variáveis de ambiente necessárias.\n');
  
  const envPath = path.join(__dirname, '../.env.local');
  const envExists = fs.existsSync(envPath);
  
  if (envExists) {
    const overwrite = await question('⚠️  Arquivo .env.local já existe. Deseja sobrescrever? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      console.log('❌ Configuração cancelada.');
      rl.close();
      return;
    }
  }
  
  console.log('\n📝 Configurando variáveis de ambiente...\n');
  
  // Coletar informações do usuário
  const supabaseUrl = await question('🔗 URL do Supabase: ');
  const supabaseAnonKey = await question('🔑 Chave anônima do Supabase: ');
  const supabaseServiceKey = await question('🔐 Chave de serviço do Supabase: ');
  
  const redisUrl = await question('💾 URL do Redis (Upstash): ');
  const redisToken = await question('🔑 Token do Redis: ');
  
  const openaiKey = await question('🤖 Chave da OpenAI: ');
  const hotmartSecret = await question('🛒 Secret do Hotmart: ');
  const resendKey = await question('📧 Chave do Resend: ');
  
  const nextauthSecret = await question('🔒 Secret do NextAuth (mín. 32 caracteres): ');
  
  // Gerar arquivo .env.local
  const envContent = envTemplate
    .replace('https://your-project.supabase.co', supabaseUrl)
    .replace('your_supabase_anon_key', supabaseAnonKey)
    .replace('your_supabase_service_role_key', supabaseServiceKey)
    .replace('https://your-redis.upstash.io', redisUrl)
    .replace('your_upstash_redis_token', redisToken)
    .replace('sk-your_openai_api_key', openaiKey)
    .replace('your_hotmart_webhook_secret', hotmartSecret)
    .replace('re_your_resend_api_key', resendKey)
    .replace('your_nextauth_secret_key_min_32_chars', nextauthSecret);
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Arquivo .env.local criado com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Verifique se todas as variáveis estão corretas');
  console.log('2. Execute npm run dev para testar');
  console.log('3. Execute npm run security-audit para verificar');
  console.log('4. Execute npm run performance-audit para testar performance');
  
  rl.close();
}

setupEnvironment().catch(console.error);
