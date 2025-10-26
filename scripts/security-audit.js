// scripts/security-audit.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Iniciando auditoria de segurança...\n');

// 1. Auditoria de dependências
console.log('📦 Verificando vulnerabilidades nas dependências...');
try {
  const auditResult = execSync('npm audit --audit-level=moderate', { encoding: 'utf8' });
  console.log('✅ Auditoria de dependências concluída');
} catch (error) {
  console.log('⚠️ Vulnerabilidades encontradas:');
  console.log(error.stdout);
}

// 2. Verificar dependências desatualizadas
console.log('\n🔄 Verificando dependências desatualizadas...');
try {
  const outdatedResult = execSync('npm outdated', { encoding: 'utf8' });
  if (outdatedResult.trim()) {
    console.log('⚠️ Dependências desatualizadas encontradas:');
    console.log(outdatedResult);
  } else {
    console.log('✅ Todas as dependências estão atualizadas');
  }
} catch (error) {
  console.log('✅ Nenhuma dependência desatualizada encontrada');
}

// 3. Verificar arquivos sensíveis
console.log('\n🔒 Verificando arquivos sensíveis...');
const sensitiveFiles = [
  '.env',
  '.env.local',
  '.env.production',
  '.git',
  'package-lock.json',
  'yarn.lock',
];

const publicDir = path.join(__dirname, '../public');
const foundSensitiveFiles = [];

sensitiveFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    foundSensitiveFiles.push(file);
  }
});

if (foundSensitiveFiles.length > 0) {
  console.log('❌ Arquivos sensíveis encontrados no diretório público:');
  foundSensitiveFiles.forEach(file => console.log(`   - ${file}`));
} else {
  console.log('✅ Nenhum arquivo sensível encontrado no diretório público');
}

// 4. Verificar configurações de segurança
console.log('\n🛡️ Verificando configurações de segurança...');

// Verificar se middleware.ts existe
const middlewarePath = path.join(__dirname, '../middleware.ts');
if (fs.existsSync(middlewarePath)) {
  console.log('✅ Middleware de segurança encontrado');
} else {
  console.log('❌ Middleware de segurança não encontrado');
}

// Verificar se robots.txt existe
const robotsPath = path.join(__dirname, '../public/robots.txt');
if (fs.existsSync(robotsPath)) {
  console.log('✅ robots.txt encontrado');
} else {
  console.log('❌ robots.txt não encontrado');
}

// Verificar se sitemap.ts existe
const sitemapPath = path.join(__dirname, '../src/app/sitemap.ts');
if (fs.existsSync(sitemapPath)) {
  console.log('✅ sitemap.ts encontrado');
} else {
  console.log('❌ sitemap.ts não encontrado');
}

console.log('\n🎉 Auditoria de segurança concluída!');
console.log('\n📋 Próximos passos recomendados:');
console.log('1. Atualizar dependências vulneráveis');
console.log('2. Configurar variáveis de ambiente');
console.log('3. Configurar rate limiting com Redis');
console.log('4. Implementar monitoramento (Sentry, etc.)');
console.log('5. Testar cabeçalhos de segurança');
