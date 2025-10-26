// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações de performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Compressão
  compress: true,
  
  // Configurações de imagens
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Configurações de headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },
  
  // Configurações de webpack para otimização
  webpack: (config, { dev, isServer }) => {
    // Otimizações de produção
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
  
  // Configurações de bundle analyzer (apenas em desenvolvimento)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(
        new (require('@next/bundle-analyzer')({
          enabled: true,
        }))()
      );
      return config;
    },
  }),
  
  // Configurações de output
  output: 'standalone',
  
  // Configurações de poweredByHeader
  poweredByHeader: false,
  
  // Configurações de trailingSlash
  trailingSlash: false,
  
  // Configurações de reactStrictMode
  reactStrictMode: true,
  
  // Configurações de swcMinify
  swcMinify: true,
};

module.exports = nextConfig;
