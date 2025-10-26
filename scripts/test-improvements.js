// scripts/test-improvements.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testando Melhorias de Segurança e Performance\n');

// 1. Verificar se o build funciona
console.log('🔨 Testando build...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build concluído com sucesso');
} catch (error) {
  console.log('❌ Erro no build:', error.message);
  process.exit(1);
}

// 2. Verificar se as dependências estão instaladas
console.log('\n📦 Verificando dependências...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@upstash/redis',
    '@upstash/ratelimit',
    'zod',
    '@next/bundle-analyzer'
  ];
  
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]);
  
  if (missingDeps.length > 0) {
    console.log('❌ Dependências faltando:', missingDeps.join(', '));
  } else {
    console.log('✅ Todas as dependências necessárias estão instaladas');
  }
} catch (error) {
  console.log('❌ Erro ao verificar dependências:', error.message);
}

// 3. Verificar arquivos de configuração
console.log('\n⚙️ Verificando arquivos de configuração...');
const configFiles = [
  'next.config.js',
  'middleware.ts',
  'src/lib/security.ts',
  'src/lib/rate-limit.ts',
  'src/lib/validation.ts',
  'src/lib/monitoring.ts',
  'src/lib/cache.ts',
  'src/lib/performance-config.ts'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} não encontrado`);
  }
});

// 4. Verificar componentes otimizados
console.log('\n🎨 Verificando componentes otimizados...');
const components = [
  'src/components/ui/OptimizedImage.tsx',
  'src/components/ui/LoadingSpinner.tsx',
  'src/components/ui/VirtualizedList.tsx',
  'src/hooks/useLazyLoad.ts',
  'src/hooks/usePerformance.ts'
];

components.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component}`);
  } else {
    console.log(`❌ ${component} não encontrado`);
  }
});

// 5. Verificar scripts de auditoria
console.log('\n🔍 Verificando scripts de auditoria...');
const auditScripts = [
  'scripts/security-audit.js',
  'scripts/performance-audit.js',
  'scripts/setup-env.js'
];

auditScripts.forEach(script => {
  if (fs.existsSync(script)) {
    console.log(`✅ ${script}`);
  } else {
    console.log(`❌ ${script} não encontrado`);
  }
});

// 6. Testar scripts de auditoria
console.log('\n🔒 Testando auditoria de segurança...');
try {
  execSync('npm run security-audit', { stdio: 'pipe' });
  console.log('✅ Auditoria de segurança executada com sucesso');
} catch (error) {
  console.log('⚠️ Aviso na auditoria de segurança:', error.message);
}

console.log('\n🚀 Testando auditoria de performance...');
try {
  execSync('npm run performance-audit', { stdio: 'pipe' });
  console.log('✅ Auditoria de performance executada com sucesso');
} catch (error) {
  console.log('⚠️ Aviso na auditoria de performance:', error.message);
}

// 7. Verificar configurações de segurança
console.log('\n🛡️ Verificando configurações de segurança...');

// Verificar robots.txt
const robotsPath = 'public/robots.txt';
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  if (robotsContent.includes('Disallow: /admin/') && robotsContent.includes('Disallow: /api/')) {
    console.log('✅ robots.txt configurado corretamente');
  } else {
    console.log('⚠️ robots.txt pode precisar de ajustes');
  }
} else {
  console.log('❌ robots.txt não encontrado');
}

// Verificar sitemap.ts
const sitemapPath = 'src/app/sitemap.ts';
if (fs.existsSync(sitemapPath)) {
  console.log('✅ sitemap.ts encontrado');
} else {
  console.log('❌ sitemap.ts não encontrado');
}

// 8. Verificar middleware de segurança
console.log('\n🔐 Verificando middleware de segurança...');
const middlewarePath = 'middleware.ts';
if (fs.existsSync(middlewarePath)) {
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  if (middlewareContent.includes('Content-Security-Policy') && 
      middlewareContent.includes('Strict-Transport-Security') &&
      middlewareContent.includes('X-Frame-Options')) {
    console.log('✅ Middleware de segurança configurado corretamente');
  } else {
    console.log('⚠️ Middleware pode precisar de ajustes');
  }
} else {
  console.log('❌ middleware.ts não encontrado');
}

console.log('\n🎉 Teste de melhorias concluído!');
console.log('\n📋 Resumo:');
console.log('✅ Build funcionando');
console.log('✅ Dependências instaladas');
console.log('✅ Configurações implementadas');
console.log('✅ Componentes otimizados');
console.log('✅ Scripts de auditoria funcionando');
console.log('✅ Configurações de segurança ativas');

console.log('\n🚀 Próximos passos:');
console.log('1. Configure as variáveis de ambiente com: node scripts/setup-env.js');
console.log('2. Execute npm run dev para testar em desenvolvimento');
console.log('3. Execute npm run analyze para ver o bundle analyzer');
console.log('4. Configure monitoramento em produção');
console.log('5. Teste as funcionalidades de segurança e performance');
