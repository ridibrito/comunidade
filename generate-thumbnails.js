#!/usr/bin/env node

/**
 * Script para gerar miniaturas (thumbnails) e miniaturizadas de imagens
 * 
 * Uso:
 *   node generate-thumbnails.js caminho/imagem.jpg [tipo]
 *   node generate-thumbnails.js caminho/imagem.jpg module
 *   node generate-thumbnails.js caminho/ hero (processa pasta inteira)
 * 
 * Tipos suportados: hero, module, trail, avatar, full
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { existsSync } = require('fs');

// Definição de tamanhos para cada tipo de imagem
const SIZES = {
  hero: {
    name: '🎪 Hero Carousel',
    full: { size: [1920, 640], quality: 85 },
    thumb: { size: [960, 320], quality: 80 },
    mini: { size: [480, 160], quality: 75 }
  },
  module: {
    name: '📦 Capa de Módulo',
    full: { size: [700, 768], quality: 85 },
    thumb: { size: [350, 384], quality: 80 },
    mini: { size: [175, 192], quality: 75 }
  },
  trail: {
    name: '🎪 Capa de Trilha',
    full: { size: [1200, 400], quality: 85 },
    thumb: { size: [600, 200], quality: 80 },
    mini: { size: [300, 100], quality: 75 }
  },
  avatar: {
    name: '👤 Avatar/Perfil',
    full: { size: [400, 400], quality: 85 },
    thumb: { size: [200, 200], quality: 80 },
    mini: { size: [100, 100], quality: 75 }
  },
  full: {
    name: '🖼️ Full HD (16:9)',
    full: { size: [1920, 1080], quality: 85 },
    thumb: { size: [960, 540], quality: 80 },
    mini: { size: [480, 270], quality: 75 }
  }
};

/**
 * Gera miniaturas para uma imagem
 */
async function generateThumbnails(inputPath, type = 'module') {
  const config = SIZES[type];
  if (!config) {
    console.error(`❌ Tipo inválido: ${type}`);
    console.log(`\nTipos disponíveis: ${Object.keys(SIZES).join(', ')}`);
    return false;
  }

  const basename = path.basename(inputPath);
  const filename = path.parse(basename).name;
  const outputDir = path.dirname(inputPath);

  console.log(`\n📸 ${config.name}`);
  console.log(`📁 Arquivo: ${basename}`);
  console.log(`💾 Saída: ${outputDir}`);

  try {
    // Verificar se arquivo existe
    await fs.access(inputPath);

    const input = sharp(inputPath);
    const metadata = await input.metadata();
    
    console.log(`📊 Dimensões originais: ${metadata.width}x${metadata.height}px`);
    console.log(`📦 Formato: ${metadata.format?.toUpperCase()}`);

    // Gerar versão FULL
    console.log('\n🔄 Gerando...');
    console.log(`  ⚙️  Full: ${config.full.size[0]}x${config.full.size[1]}px`);
    await sharp(inputPath)
      .resize(config.full.size[0], config.full.size[1], {
        fit: 'cover',
        position: 'center',
        withoutEnlargement: false
      })
      .webp({ quality: config.full.quality })
      .toFile(path.join(outputDir, `${filename}-full.webp`));

    // Gerar THUMBNAIL
    console.log(`  ⚙️  Thumb: ${config.thumb.size[0]}x${config.thumb.size[1]}px`);
    await sharp(inputPath)
      .resize(config.thumb.size[0], config.thumb.size[1], {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: config.thumb.quality })
      .toFile(path.join(outputDir, `${filename}-thumb.webp`));

    // Gerar MINIATURA
    console.log(`  ⚙️  Mini: ${config.mini.size[0]}x${config.mini.size[1]}px`);
    await sharp(inputPath)
      .resize(config.mini.size[0], config.mini.size[1], {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: config.mini.quality })
      .toFile(path.join(outputDir, `${filename}-mini.webp`));

    // Obter tamanhos dos arquivos gerados
    const fullSize = await fs.stat(path.join(outputDir, `${filename}-full.webp`));
    const thumbSize = await fs.stat(path.join(outputDir, `${filename}-thumb.webp`));
    const miniSize = await fs.stat(path.join(outputDir, `${filename}-mini.webp`));

    console.log('\n✅ Arquivos gerados com sucesso!');
    console.log(`\n📋 Tamanho dos arquivos:`);
    console.log(`  • ${filename}-full.webp  → ${formatBytes(fullSize.size)}`);
    console.log(`  • ${filename}-thumb.webp → ${formatBytes(thumbSize.size)}`);
    console.log(`  • ${filename}-mini.webp  → ${formatBytes(miniSize.size)}`);
    console.log(`\n  Total: ${formatBytes(fullSize.size + thumbSize.size + miniSize.size)}`);

    return true;
  } catch (error) {
    console.error(`\n❌ Erro ao processar ${basename}:`);
    console.error(`   ${error.message}`);
    return false;
  }
}

/**
 * Processa todas as imagens em uma pasta
 */
async function processFolderImages(folderPath, type = 'module') {
  console.log(`\n📂 Processando pasta: ${folderPath}`);
  console.log(`🎯 Tipo: ${SIZES[type]?.name || type}`);

  try {
    const files = await fs.readdir(folderPath);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log('⚠️  Nenhuma imagem encontrada na pasta');
      return;
    }

    console.log(`\n🖼️  Encontradas ${imageFiles.length} imagem(ns)`);

    let processed = 0;
    for (const file of imageFiles) {
      const fullPath = path.join(folderPath, file);
      const success = await generateThumbnails(fullPath, type);
      if (success) processed++;
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ Processamento concluído: ${processed}/${imageFiles.length} imagem(ns)`);
  } catch (error) {
    console.error(`\n❌ Erro ao processar pasta:`);
    console.error(`   ${error.message}`);
  }
}

/**
 * Formata bytes para formato legível
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Mostra ajuda
 */
function showHelp() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║        Gerador de Miniaturas - Comunidade Project          ║
╚════════════════════════════════════════════════════════════╝

📖 USO:
  node generate-thumbnails.js <caminho> [tipo]

📋 ARGUMENTOS:
  <caminho>  Caminho da imagem ou pasta
  [tipo]     hero | module | trail | avatar | full
             (padrão: module)

📐 TIPOS E TAMANHOS:

  hero      🎪 Hero Carousel
            Full: 1920x640 | Thumb: 960x320 | Mini: 480x160

  module    📦 Capa de Módulo
            Full: 700x768 | Thumb: 350x384 | Mini: 175x192

  trail     🎪 Capa de Trilha
            Full: 1200x400 | Thumb: 600x200 | Mini: 300x100

  avatar    👤 Avatar/Perfil
            Full: 400x400 | Thumb: 200x200 | Mini: 100x100

  full      🖼️ Full HD (16:9)
            Full: 1920x1080 | Thumb: 960x540 | Mini: 480x270

🎯 EXEMPLOS:

  # Gerar para uma imagem (padrão: module)
  node generate-thumbnails.js ./imagem.jpg

  # Gerar hero carousel
  node generate-thumbnails.js ./banner.jpg hero

  # Processar pasta inteira
  node generate-thumbnails.js ./imagens module

  # Gerar avatares
  node generate-thumbnails.js ./perfil.jpg avatar

💡 NOTAS:
  • Formato de saída: WebP (melhor compressão)
  • Qualidade: 75-85% (balanço entre tamanho e qualidade)
  • Cada imagem gera 3 versões: full, thumb, mini
  • Nomes: imagem-full.webp, imagem-thumb.webp, imagem-mini.webp

📦 REQUISITOS:
  npm install sharp

`);
}

/**
 * Função principal
 */
async function main() {
  const args = process.argv.slice(2);

  // Mostrar ajuda se não houver argumentos
  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  // Verificar se é flag de ajuda
  if (['-h', '--help', 'help'].includes(args[0])) {
    showHelp();
    process.exit(0);
  }

  const inputPath = args[0];
  const type = args[1] || 'module';

  // Verificar se caminho existe
  if (!existsSync(inputPath)) {
    console.error(`\n❌ Caminho não encontrado: ${inputPath}`);
    process.exit(1);
  }

  // Verificar se é pasta ou arquivo
  const stats = await fs.stat(inputPath);

  if (stats.isDirectory()) {
    // Processar pasta
    await processFolderImages(inputPath, type);
  } else {
    // Processar arquivo único
    const success = await generateThumbnails(inputPath, type);
    process.exit(success ? 0 : 1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { generateThumbnails, SIZES, formatBytes };
