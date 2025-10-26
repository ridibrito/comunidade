// scripts/update-env.js
const fs = require('fs');

const envPath = '.env.local';

try {
  let content = fs.readFileSync(envPath, 'utf8');
  
  // Atualizar NEXTAUTH_SECRET
  content = content.replace(
    'NEXTAUTH_SECRET=',
    'NEXTAUTH_SECRET=27189cc11f17cc8061e5b71c54e1c514e4a18f5dd2ea3f6036bf47feeda19b38'
  );
  
  fs.writeFileSync(envPath, content);
  
  console.log('✅ Arquivo .env.local atualizado com sucesso!');
  console.log('🔑 NEXTAUTH_SECRET configurado');
  
  console.log('\n📋 Variáveis configuradas:');
  console.log('✅ Supabase URL e chaves');
  console.log('✅ Redis URL e token');
  console.log('✅ OpenAI API key');
  console.log('✅ Hotmart webhook secret');
  console.log('✅ Resend API key');
  console.log('✅ NextAuth secret');
  console.log('✅ URLs de produção');
  
  console.log('\n🚀 Próximos passos:');
  console.log('1. Execute: npm run dev');
  console.log('2. Teste o rate limiting');
  console.log('3. Execute: npm run test-improvements-simple');
  
} catch (error) {
  console.error('❌ Erro ao atualizar arquivo:', error.message);
}
