# 📐 Guia Completo de Tamanhos de Imagens - Comunidade

## 🎯 Resumo Executivo

| Tipo de Imagem | Tamanho Principal | Thumbnail | Miniatura | Proporção | Uso |
|---|---|---|---|---|---|
| **Hero Carousel** | 1920 x 640px | 960 x 320px | 480 x 160px | 3:1 | Banners principais |
| **Capa de Módulo** | 700 x 768px | 350 x 384px | 175 x 192px | 9:16 | Cards de módulos |
| **Capa de Trilha** | 1200 x 400px | 600 x 200px | 300 x 100px | 3:1 | Cabeçalho de trilha |
| **Avatar/Perfil** | 400 x 400px | 200 x 200px | 100 x 100px | 1:1 | Fotos de usuários |
| **Hero Section** | 1920 x 1080px | 960 x 540px | 480 x 270px | 16:9 | Seções grandes |

---

## 📱 HERO CAROUSEL (Carrossel Principal)

### Dimensões Principais
- **Resolução**: 1920 x 640 pixels
- **Proporção**: 3:1 (paisagem)
- **Tamanho Máximo**: 5 MB
- **Formato**: WebP (recomendado) ou PNG, JPG

### Responsivo (Como aparece)

#### Desktop (1920px+)
```
Tamanho: 1920 x 640px
aspect-ratio: 3/1
max-height: 400px
```

#### Tablet (768px)
```
Tamanho: 1024 x 341px
Aplicar: object-cover
```

#### Mobile (320px-480px)
```
Tamanho: 100% da largura
Altura: 250px máximo
aspect-ratio: 3/1
```

### Thumbnail
- **Resolução**: 960 x 320 pixels
- **Uso**: Preview rápido, lista de heróis
- **Formato**: WebP

### Miniatura
- **Resolução**: 480 x 160 pixels
- **Uso**: Carregamento inicial, thumbnails sociais
- **Formato**: WebP

### Arquivo: `HeroCarousel.tsx` (linhas 94-112)
```
Componente renderiza com aspect-ratio: '3 / 1'
min-height: [120px, 160px, 200px] (mobile, sm, md)
max-height: [250px, 350px, 400px] (mobile, sm, md)
object-contain (mobile) → object-cover (sm+)
```

---

## 📦 CAPA DE MÓDULO (Module Cover)

### Dimensões Principais ⭐
- **Resolução**: 700 x 768 pixels (IDEAL)
- **Proporção**: 9:16 (vertical)
- **Tamanho Máximo**: 5 MB
- **Formato**: WebP (recomendado) ou PNG, JPG

### Responsivo (Como aparece)

#### Desktop
```
Card Width: 350px
Card Height: 384px (h-96)
object-cover (preenche todo espaço)
```

#### Tablet
```
Card Width: 300px
Card Height: 384px (h-96)
object-cover
```

#### Mobile
```
Card Width: 100% da tela
Card Height: 384px (h-96)
object-cover
```

### Alternativas Aceitas
```
Mínimo: 600 x 650px
Máximo: 1000 x 1100px

Proporções:
- 9:16 (ideal) → 700x768, 900x1024
- 2:3 (bom) → 600x900, 800x1200
- 3:4 (aceitável) → 600x800, 750x1000
```

### Thumbnail
- **Resolução**: 350 x 384 pixels
- **Uso**: Preview em listas, cache
- **Formato**: WebP

### Miniatura
- **Resolução**: 175 x 192 pixels
- **Uso**: Carregamento lazy, lista compacta
- **Formato**: WebP

### Armazenamento
- **Bucket**: `module-covers`
- **Caminho**: `modules/{module-id}/{filename}`
- **URL Pública**: `https://{project}.supabase.co/storage/v1/object/public/module-covers/modules/{module-id}/{filename}`

---

## 🎪 CAPA DE TRILHA (Trail/Mountain Header)

### Dimensões Principais
- **Resolução**: 1200 x 400 pixels
- **Proporção**: 3:1 (paisagem)
- **Tamanho Máximo**: 5 MB
- **Formato**: WebP ou PNG, JPG

### Responsivo (Como aparece)
```
Desktop: 1200 x 400px
Tablet: 800 x 267px
Mobile: 100% x 200px
aspect-ratio: 3/1
object-cover
```

### Thumbnail
- **Resolução**: 600 x 200 pixels
- **Uso**: Preview de trilhas
- **Formato**: WebP

### Miniatura
- **Resolução**: 300 x 100 pixels
- **Uso**: Ícone/preview pequeno
- **Formato**: WebP

### Dicas
- Coloque logo/elementos principais no centro
- Evite texto importante nas extremidades
- Use cores vibrantes para destaque

---

## 👤 AVATAR/PERFIL

### Dimensões Principais
- **Resolução**: 400 x 400 pixels
- **Proporção**: 1:1 (quadrado)
- **Tamanho Máximo**: 2 MB
- **Formato**: WebP ou PNG, JPG

### Responsivo (Como aparece)
```
Grande: 80-100px (h-20, h-24)
Médio: 40-48px (h-10, h-12)
Pequeno: 32px (h-8)
border-radius: 50% ou valores altos
object-cover
```

### Thumbnail
- **Resolução**: 200 x 200 pixels
- **Uso**: Preview, cache
- **Formato**: WebP

### Miniatura
- **Resolução**: 100 x 100 pixels
- **Uso**: Carregamento rápido
- **Formato**: WebP

### Bucket
- **Nome**: `avatars`
- **Caminho**: `users/{user-id}/avatar`

---

## 🖼️ HERO SECTION (Seções Grandes)

### Dimensões Principais
- **Resolução**: 1920 x 1080 pixels (16:9)
- **Tamanho Máximo**: 5 MB
- **Formato**: WebP ou PNG, JPG

### Responsivo
```
Desktop: 1920 x 1080px
Tablet: 1024 x 576px
Mobile: 100% x 400-600px
aspect-ratio: 16/9
object-cover
```

### Thumbnail
- **Resolução**: 960 x 540 pixels

### Miniatura
- **Resolução**: 480 x 270 pixels

---

## ✅ CHECKLIST PARA CRIAR IMAGENS

### Preparação
- [ ] Definir o tipo de imagem (hero, capa, avatar, etc)
- [ ] Verificar proporção ideal
- [ ] Configurar tamanho no programa (Canva, Figma, GIMP)
- [ ] Design vertical com elementos no centro/inferior

### Design
- [ ] Alta qualidade (não pixelado)
- [ ] Contraste adequado (legível com overlay)
- [ ] Elementos importantes no centro (nunca nas bordas)
- [ ] Fonte legível (se houver texto)
- [ ] Paleta de cores coerente com marca

### Exportação
- [ ] Formato: WebP (preferido) ou PNG
- [ ] Qualidade: 85-95%
- [ ] Remover metadados (EXIF)
- [ ] Testar tamanho do arquivo (<5MB)

### Thumbnail e Miniatura
- [ ] Usar mesmo design/imagem base
- [ ] Manter proporção
- [ ] Testar legibilidade em tamanho pequeno
- [ ] Comprimir adequadamente

---

## 🎨 FERRAMENTAS RECOMENDADAS

### Online (Grátis)
| Ferramenta | Uso | Link |
|---|---|---|
| **Canva** | Design rápido + redimensionamento | https://canva.com |
| **Photopea** | Editor tipo Photoshop | https://photopea.com |
| **ResizeImage** | Redimensionar imagens | https://resizeimage.net |
| **TinyPNG** | Comprimir imagens | https://tinypng.com |
| **Squoosh** | Converter para WebP | https://squoosh.app |

### Desktop
| Ferramenta | Sistema | Custo |
|---|---|---|
| **GIMP** | Win/Mac/Linux | Grátis |
| **Figma** | Web | Grátis (básico) |
| **Photoshop** | Win/Mac | Pago |
| **Krita** | Win/Mac/Linux | Grátis |

### Command Line
```bash
# Usar ImageMagick para redimensionar
convert imagem.jpg -resize 700x768 miniatura.jpg

# Converter para WebP
cwebp -q 80 imagem.jpg -o imagem.webp

# Criar miniatura com ImageMagick
convert imagem.jpg -resize 350x384 -quality 85 thumbnail.webp
```

---

## 🚀 SCRIPT PARA GERAR MINIATURAS (Node.js)

```javascript
// generate-thumbnails.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const SIZES = {
  hero: { full: [1920, 640], thumb: [960, 320], mini: [480, 160] },
  module: { full: [700, 768], thumb: [350, 384], mini: [175, 192] },
  trail: { full: [1200, 400], thumb: [600, 200], mini: [300, 100] },
  avatar: { full: [400, 400], thumb: [200, 200], mini: [100, 100] },
};

async function generateThumbnails(inputPath, type = 'module') {
  const sizes = SIZES[type] || SIZES.module;
  const filename = path.basename(inputPath, path.extname(inputPath));
  const outputDir = path.dirname(inputPath);

  try {
    // Imagem full
    await sharp(inputPath)
      .resize(...sizes.full, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(path.join(outputDir, `${filename}-full.webp`));

    // Thumbnail
    await sharp(inputPath)
      .resize(...sizes.thumb, { fit: 'cover', position: 'center' })
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, `${filename}-thumb.webp`));

    // Miniatura
    await sharp(inputPath)
      .resize(...sizes.mini, { fit: 'cover', position: 'center' })
      .webp({ quality: 75 })
      .toFile(path.join(outputDir, `${filename}-mini.webp`));

    console.log('✅ Miniaturas geradas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao gerar miniaturas:', error);
  }
}

module.exports = { generateThumbnails, SIZES };
```

---

## 📊 COMPARAÇÃO DE TAMANHOS

### Arquivo (Aproximado em WebP 85% quality)
```
Hero Full (1920x640):     250-400 KB
Hero Thumb (960x320):      80-120 KB
Hero Mini (480x160):       20-40 KB

Módulo Full (700x768):     150-250 KB
Módulo Thumb (350x384):    50-80 KB
Módulo Mini (175x192):     12-20 KB

Avatar Full (400x400):     80-150 KB
Avatar Thumb (200x200):    25-40 KB
Avatar Mini (100x100):     8-15 KB
```

---

## 🔄 WORKFLOW RECOMENDADO

### 1. Design/Criação
- Criar em Canva ou Figma
- Resolução máxima (2x do tamanho final)
- Sem compressão

### 2. Redimensionamento
```bash
# Opção 1: Canva
- Download em 1920px de largura
- Depois redimensionar no Canva

# Opção 2: Squoosh
- Fazer upload
- Redimensionar para tamanho desejado
- Download em WebP

# Opção 3: Script Node
- npm install sharp
- node generate-thumbnails.js caminho/imagem.jpg module
```

### 3. Upload
- Enviar apenas a versão FULL
- Sistema gera thumbnail/miniatura automaticamente
- OU enviar as 3 versões ao bucket

### 4. Uso no Código
```typescript
// Carregar versão apropriada por device
const imageUrl = isMobile 
  ? `${baseUrl}-mini.webp`
  : isTablet
  ? `${baseUrl}-thumb.webp`
  : `${baseUrl}-full.webp`;
```

---

## 💡 DICAS IMPORTANTES

### ✅ Faça
- Use WebP sempre que possível (melhor compressão)
- Nomes descritivos para arquivos
- Organize por tipo em subpastas
- Gere thumbnails automaticamente
- Teste em vários devices

### ❌ Evite
- JPG sem comprimir adequadamente
- Imagens maiores que 5MB
- Proporções muito diferentes do recomendado
- Texto pequeno em imagens
- Cores muito próximas (baixo contraste)

---

**Última atualização**: 2025-10-27
**Versão**: 2.0

