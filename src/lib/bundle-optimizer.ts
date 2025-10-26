// lib/bundle-optimizer.ts
// Função para importação dinâmica otimizada
export function dynamicImport<T>(
  importFn: () => Promise<T>,
  fallback?: React.ComponentType
) {
  return React.lazy(importFn);
}

// Função para code splitting de rotas
export function createRouteLoader<T>(
  importFn: () => Promise<T>
) {
  return {
    load: importFn,
    preload: () => {
      // Pré-carregar o módulo
      importFn().catch(() => {
        // Ignorar erros de pré-carregamento
      });
    },
  };
}

// Função para otimizar imports de bibliotecas
export function optimizeImports() {
  // Esta função pode ser usada para configurar imports otimizados
  // Exemplo: importar apenas os componentes necessários do Radix UI
  return {
    // Exemplo de configuração para Radix UI
    radix: {
      // Importar apenas os componentes necessários
      components: [
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-select',
        '@radix-ui/react-tabs',
      ],
    },
  };
}

// Função para análise de bundle
export function analyzeBundle() {
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Análise de Bundle:');
    console.log('- Use npm run analyze para ver o bundle analyzer');
    console.log('- Verifique imports desnecessários');
    console.log('- Considere lazy loading para componentes pesados');
  }
}

// Função para otimizar imagens
export function optimizeImageConfig() {
  return {
    // Configurações otimizadas para imagens
    formats: ['image/webp', 'image/avif'],
    quality: 85,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias
  };
}

// Função para otimizar fontes
export function optimizeFonts() {
  return {
    // Configurações otimizadas para fontes
    display: 'swap',
    preload: true,
    fallback: ['system-ui', 'arial'],
  };
}
