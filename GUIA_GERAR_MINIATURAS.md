# 🎨 Guia Prático: Gerar Miniaturas e Thumbnails

## ⚡ Início Rápido

### 1. Instalar Dependência
```bash
npm install sharp
```

### 2. Executar Script
```bash
# Gerar para uma imagem (padrão: module)
node generate-thumbnails.js ./minha-imagem.jpg

# Gerar hero carousel
node generate-thumbnails.js ./banner.jpg hero

# Processar pasta inteira
node generate-thumbnails.js ./imagens module
```

### 3. Resultado
Você terá 3 arquivos WebP gerados:
- `imagem-full.webp` (alta qualidade, tamanho completo)
- `imagem-thumb.webp` (qualidade média, tamanho médio)
- `imagem-mini.webp` (qualidade boa, tamanho pequeno)

---

## 📋 Tipos de Imagem Suportados

### 🎪 Hero Carousel
```bash
node generate-thumbnails.js ./banner.jpg hero
```
**Tamanhos gerados:**
- Full: 1920 x 640px (3:1)
- Thumb: 960 x 320px
- Mini: 480 x 160px

**Qualidade:** 85% (full), 80% (thumb), 75% (mini)

**Uso:** Banners principais do dashboard

---

### 📦 Capa de Módulo (Padrão)
```bash
node generate-thumbnails.js ./capa-modulo.jpg
# ou explícito:
node generate-thumbnails.js ./capa-modulo.jpg module
```
**Tamanhos gerados:**
- Full: 700 x 768px (9:16)
- Thumb: 350 x 384px
- Mini: 175 x 192px

**Qualidade:** 85% (full), 80% (thumb), 75% (mini)

**Uso:** Cards de módulos no catálogo

---

### 🎪 Capa de Trilha
```bash
node generate-thumbnails.js ./capa-trilha.jpg trail
```
**Tamanhos gerados:**
- Full: 1200 x 400px (3:1)
- Thumb: 600 x 200px
- Mini: 300 x 100px

**Qualidade:** 85% (full), 80% (thumb), 75% (mini)

**Uso:** Cabeçalho/header das trilhas

---

### 👤 Avatar/Perfil
```bash
node generate-thumbnails.js ./perfil.jpg avatar
```
**Tamanhos gerados:**
- Full: 400 x 400px (1:1)
- Thumb: 200 x 200px
- Mini: 100 x 100px

**Qualidade:** 85% (full), 80% (thumb), 75% (mini)

**Uso:** Fotos de perfil de usuários

---

### 🖼️ Full HD (16:9)
```bash
node generate-thumbnails.js ./grande.jpg full
```
**Tamanhos gerados:**
- Full: 1920 x 1080px (16:9)
- Thumb: 960 x 540px
- Mini: 480 x 270px

**Qualidade:** 85% (full), 80% (thumb), 75% (mini)

**Uso:** Seções grandes, hero sections

---

## 🎯 Exemplos Práticos

### Cenário 1: Imagem única de módulo
```bash
node generate-thumbnails.js ~/Downloads/modulo-react.jpg

# Resultado:
# ✅ modulo-react-full.webp  (156 KB)
# ✅ modulo-react-thumb.webp (52 KB)
# ✅ modulo-react-mini.webp  (15 KB)
```

### Cenário 2: Processar pasta inteira de heroes
```bash
node generate-thumbnails.js ./assets/heroes hero

# Resultado:
# ✅ banner-01-full.webp
# ✅ banner-01-thumb.webp
# ✅ banner-01-mini.webp
# ✅ banner-02-full.webp
# ✅ banner-02-thumb.webp
# ✅ banner-02-mini.webp
```

### Cenário 3: Avatares em pasta
```bash
node generate-thumbnails.js ./public/avatars avatar

# Processa todos os .jpg, .png, .webp da pasta
```

### Cenário 4: Gerar hero carousel de imagem grande
```bash
# Você tem uma imagem 4000x1333 que quer usar como hero
node generate-thumbnails.js ./imagem-grande.jpg hero

# Será redimensionada para:
# - 1920x640 (full)
# - 960x320 (thumb)
# - 480x160 (mini)
```

---

## 📊 Comparação de Tamanhos

### Antes vs Depois
```
Original: imagem.jpg (2.5 MB)

Depois de processar (hero):
- banner-full.webp  : 350 KB  (-86%)
- banner-thumb.webp :  95 KB  (-96%)
- banner-mini.webp  :  25 KB  (-99%)
```

### Tamanhos Típicos Gerados

| Tipo | Full | Thumb | Mini | Total |
|------|------|-------|------|-------|
| **Hero** | 250-400 KB | 80-120 KB | 20-40 KB | ~450-560 KB |
| **Module** | 150-250 KB | 50-80 KB | 12-20 KB | ~212-350 KB |
| **Trail** | 200-350 KB | 60-100 KB | 15-30 KB | ~275-480 KB |
| **Avatar** | 80-150 KB | 25-40 KB | 8-15 KB | ~113-205 KB |

---

## 🚀 Workflow Integrado

### 1️⃣ Design
Criar imagem no Canva/Figma com pelo menos:
- Hero: 3840x1280px
- Module: 1400x1536px
- Avatar: 800x800px

### 2️⃣ Exportar
- Formato: PNG ou JPG
- Qualidade: Alta (100%)
- Sem compressão

### 3️⃣ Gerar Miniaturas
```bash
node generate-thumbnails.js ./imagem-original.jpg [tipo]
```

### 4️⃣ Upload
Fazer upload das 3 versões geradas ao Supabase:
- `-full.webp` → versão principal
- `-thumb.webp` → cache/preview
- `-mini.webp` → carregamento inicial

### 5️⃣ Usar no Código
```typescript
// Componente seleciona versão apropriada
const imageUrl = isMobile 
  ? `${baseUrl}-mini.webp`
  : isTablet
  ? `${baseUrl}-thumb.webp`
  : `${baseUrl}-full.webp`;
```

---

## 🔧 Troubleshooting

### Erro: "sharp is not installed"
```bash
npm install sharp
```

### Erro: "File not found"
Certifique-se de que:
1. O caminho do arquivo está correto
2. A extensão está inclusa: `.jpg`, não `jpg`
3. O arquivo existe

```bash
# ❌ Errado
node generate-thumbnails.js imagem

# ✅ Correto
node generate-thumbnails.js ./imagem.jpg
```

### Erro: "Tipo inválido"
```bash
# ❌ Errado
node generate-thumbnails.js ./img.jpg portrait

# ✅ Correto
node generate-thumbnails.js ./img.jpg avatar
# Tipos: hero, module, trail, avatar, full
```

### Imagem saiu cortada
Isso é normal! O script usa `fit: 'cover'` para manter proporção.
- Se sua imagem é 4000x3000, será cortada para caber em 700x768

**Solução:**
1. Editar imagem no Canva antes de exportar
2. Usar tamanho apropriado desde o design
3. Usar crop manual antes de executar script

---

## 💡 Dicas e Boas Práticas

### ✅ Faça
- Use o script para todas as imagens (consistência)
- Nomeie arquivos descritivamente: `modulo-react.jpg`
- Mantenha originais (não sobrescreva)
- Teste em vários dispositivos após upload
- Use a pasta apropriada no Supabase

### ❌ Evite
- Não sobrescreva a imagem original
- Não use imagens muito pequenas (ficam pixeladas)
- Não misture tipos (hero com module)
- Não confie em apenas uma versão

---

## 🎬 Integração com CI/CD (Opcional)

Se quiser automatizar na pipeline de build:

### Em `package.json`:
```json
{
  "scripts": {
    "generate-thumbnails": "node generate-thumbnails.js",
    "generate:heroes": "node generate-thumbnails.js ./public/heroes hero",
    "generate:modules": "node generate-thumbnails.js ./public/modules module",
    "generate:all": "npm run generate:heroes && npm run generate:modules"
  }
}
```

### Usar:
```bash
npm run generate:heroes
npm run generate:all
```

---

## 📱 Teste Responsivo

Após gerar e fazer upload, teste em:

### Desktop
- Abra desenvolvedor (F12)
- Coloque em 1920px ou mais
- Verifique que carrega a versão `-full.webp`

### Tablet
- Responsive mode: 768px
- Deve carregar `-thumb.webp`

### Mobile
- Responsive mode: 375px ou 480px
- Deve carregar `-mini.webp`

### Verificação
```javascript
// No console do navegador
const img = document.querySelector('img');
console.log(img.src); // deve conter -full, -thumb ou -mini
```

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o `sharp` está instalado
2. Verifique se o arquivo existe
3. Verifique se o tipo é válido
4. Tente com outro arquivo para isolar problema

Comandos úteis:
```bash
# Ver versão do sharp
npm list sharp

# Reinstalar sharp
npm uninstall sharp
npm install sharp

# Ver ajuda do script
node generate-thumbnails.js --help
```

---

**Última atualização:** 2025-10-27  
**Versão do Sharp:** 0.32+  
**Versão do Node:** 16+
