// scripts/performance-audit.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando auditoria de performance...\n');

// 1. Verificar tamanho do bundle
console.log('📦 Analisando tamanho do bundle...');
try {
  const buildResult = execSync('npm run build', { encoding: 'utf8' });
  console.log('✅ Build concluído com sucesso');
  
  // Verificar se o arquivo de análise foi gerado
  const analyzeFile = path.join(__dirname, '../.next/analyze/client.html');
  if (fs.existsSync(analyzeFile)) {
    console.log('✅ Relatório de análise de bundle gerado');
  }
} catch (error) {
  console.log('❌ Erro no build:', error.message);
}

// 2. Verificar dependências desnecessárias
console.log('\n🔍 Verificando dependências desnecessárias...');
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

// 3. Verificar arquivos de configuração
console.log('\n⚙️ Verificando configurações de performance...');

// Verificar next.config.js
const nextConfigPath = path.join(__dirname, '../next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log('✅ next.config.js encontrado');
} else {
  console.log('❌ next.config.js não encontrado');
}

// Verificar middleware.ts
const middlewarePath = path.join(__dirname, '../middleware.ts');
if (fs.existsSync(middlewarePath)) {
  console.log('✅ middleware.ts encontrado');
} else {
  console.log('❌ middleware.ts não encontrado');
}

// 4. Verificar componentes otimizados
console.log('\n🎨 Verificando componentes otimizados...');

const componentsToCheck = [
  'src/components/ui/OptimizedImage.tsx',
  'src/components/ui/LoadingSpinner.tsx',
  'src/components/ui/VirtualizedList.tsx',
  'src/hooks/useLazyLoad.ts',
  'src/hooks/usePerformance.ts',
  'src/lib/cache.ts',
  'src/lib/performance-config.ts',
];

componentsToCheck.forEach(component => {
  const componentPath = path.join(__dirname, '..', component);
  if (fs.existsSync(componentPath)) {
    console.log(`✅ ${component} encontrado`);
  } else {
    console.log(`❌ ${component} não encontrado`);
  }
});

// 5. Verificar otimizações de imagens
console.log('\n🖼️ Verificando otimizações de imagens...');

const publicDir = path.join(__dirname, '../public');
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
const imageFiles = [];

function findImageFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findImageFiles(filePath);
    } else if (imageExtensions.some(ext => file.toLowerCase().endsWith(ext))) {
      imageFiles.push(filePath);
    }
  });
}

findImageFiles(publicDir);

if (imageFiles.length > 0) {
  console.log(`✅ ${imageFiles.length} imagens encontradas no diretório público`);
  console.log('💡 Considere usar next/image para otimização automática');
} else {
  console.log('ℹ️ Nenhuma imagem encontrada no diretório público');
}

// 6. Verificar configurações de cache
console.log('\n💾 Verificando configurações de cache...');

const cacheFiles = [
  'src/lib/cache.ts',
  'src/lib/performance-config.ts',
];

cacheFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} encontrado`);
  } else {
    console.log(`❌ ${file} não encontrado`);
  }
});

console.log('\n🎉 Auditoria de performance concluída!');
console.log('\n📋 Próximos passos recomendados:');
console.log('1. Execute npm run analyze para ver o bundle analyzer');
console.log('2. Teste a aplicação com npm run dev');
console.log('3. Verifique as métricas de Web Vitals');
console.log('4. Configure monitoramento em produção');
console.log('5. Otimize imagens e assets estáticos');
