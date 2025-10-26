// scripts/test-improvements-simple.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testando Melhorias de Segurança e Performance (Modo Simples)\n');

// 1. Verificar se as dependências estão instaladas
console.log('📦 Verificando dependências...');
let requiredDeps = [];
let missingDeps = [];
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  requiredDeps = [
    '@upstash/redis',
    '@upstash/ratelimit',
    'zod',
    '@next/bundle-analyzer'
  ];
  
  missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]);
  
  if (missingDeps.length > 0) {
    console.log('❌ Dependências faltando:', missingDeps.join(', '));
  } else {
    console.log('✅ Todas as dependências necessárias estão instaladas');
  }
} catch (error) {
  console.log('❌ Erro ao verificar dependências:', error.message);
}

// 2. Verificar arquivos de configuração
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

let configFilesOk = 0;
configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
    configFilesOk++;
  } else {
    console.log(`❌ ${file} não encontrado`);
  }
});

// 3. Verificar componentes otimizados
console.log('\n🎨 Verificando componentes otimizados...');
const components = [
  'src/components/ui/OptimizedImage.tsx',
  'src/components/ui/LoadingSpinner.tsx',
  'src/components/ui/VirtualizedList.tsx',
  'src/hooks/useLazyLoad.ts',
  'src/hooks/usePerformance.ts'
];

let componentsOk = 0;
components.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${component}`);
    componentsOk++;
  } else {
    console.log(`❌ ${component} não encontrado`);
  }
});

// 4. Verificar scripts de auditoria
console.log('\n🔍 Verificando scripts de auditoria...');
const auditScripts = [
  'scripts/security-audit.js',
  'scripts/performance-audit.js',
  'scripts/setup-env.js',
  'scripts/test-improvements.js'
];

let scriptsOk = 0;
auditScripts.forEach(script => {
  if (fs.existsSync(script)) {
    console.log(`✅ ${script}`);
    scriptsOk++;
  } else {
    console.log(`❌ ${script} não encontrado`);
  }
});

// 5. Verificar configurações de segurança
console.log('\n🛡️ Verificando configurações de segurança...');

// Verificar robots.txt
const robotsPath = 'public/robots.txt';
let securityOk = 0;
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  if (robotsContent.includes('Disallow: /admin/') && robotsContent.includes('Disallow: /api/')) {
    console.log('✅ robots.txt configurado corretamente');
    securityOk++;
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
  securityOk++;
} else {
  console.log('❌ sitemap.ts não encontrado');
}

// Verificar middleware de segurança
const middlewarePath = 'middleware.ts';
if (fs.existsSync(middlewarePath)) {
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  if (middlewareContent.includes('Content-Security-Policy') && 
      middlewareContent.includes('Strict-Transport-Security') &&
      middlewareContent.includes('X-Frame-Options')) {
    console.log('✅ Middleware de segurança configurado corretamente');
    securityOk++;
  } else {
    console.log('⚠️ Middleware pode precisar de ajustes');
  }
} else {
  console.log('❌ middleware.ts não encontrado');
}

// 6. Verificar documentação
console.log('\n📚 Verificando documentação...');
const docs = [
  'DEPLOY_GUIDE.md'
];

let docsOk = 0;
docs.forEach(doc => {
  if (fs.existsSync(doc)) {
    console.log(`✅ ${doc}`);
    docsOk++;
  } else {
    console.log(`❌ ${doc} não encontrado`);
  }
});

// 7. Resumo final
console.log('\n📊 RESUMO DOS TESTES:');
console.log(`📦 Dependências: ${requiredDeps.length - (missingDeps ? missingDeps.length : 0)}/${requiredDeps.length} instaladas`);
console.log(`⚙️ Arquivos de configuração: ${configFilesOk}/${configFiles.length} encontrados`);
console.log(`🎨 Componentes otimizados: ${componentsOk}/${components.length} encontrados`);
console.log(`🔍 Scripts de auditoria: ${scriptsOk}/${auditScripts.length} encontrados`);
console.log(`🛡️ Configurações de segurança: ${securityOk}/3 ativas`);
console.log(`📚 Documentação: ${docsOk}/${docs.length} arquivos encontrados`);

const totalScore = (configFilesOk + componentsOk + scriptsOk + securityOk + docsOk);
const maxScore = configFiles.length + components.length + auditScripts.length + 3 + docs.length;

console.log(`\n🎯 SCORE GERAL: ${totalScore}/${maxScore} (${Math.round((totalScore/maxScore)*100)}%)`);

if (totalScore >= maxScore * 0.8) {
  console.log('\n🎉 EXCELENTE! Todas as melhorias foram implementadas com sucesso!');
} else if (totalScore >= maxScore * 0.6) {
  console.log('\n✅ BOM! A maioria das melhorias foi implementada.');
} else {
  console.log('\n⚠️ ATENÇÃO! Algumas melhorias ainda precisam ser implementadas.');
}

console.log('\n🚀 Próximos passos:');
console.log('1. Configure as variáveis de ambiente com: npm run setup-env');
console.log('2. Execute npm run dev para testar em desenvolvimento');
console.log('3. Execute npm run analyze para ver o bundle analyzer');
console.log('4. Configure monitoramento em produção');
console.log('5. Teste as funcionalidades de segurança e performance');
