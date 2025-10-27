# 📐 Cheat Sheet - Tamanhos de Imagens

## 🎯 Resumo em Uma Página

```
┌─────────────────────────────────────────────────────────────┐
│  TAMANHOS RÁPIDOS - Comunidade App                          │
└─────────────────────────────────────────────────────────────┘

🎪 HERO CAROUSEL
├─ Full: 1920 x 640  (3:1)   [250-400 KB]
├─ Thumb: 960 x 320          [80-120 KB]
└─ Mini: 480 x 160           [20-40 KB]

📦 CAPA DE MÓDULO ⭐
├─ Full: 700 x 768   (9:16)  [150-250 KB]
├─ Thumb: 350 x 384          [50-80 KB]
└─ Mini: 175 x 192           [12-20 KB]

🏔️ CAPA DE TRILHA
├─ Full: 1200 x 400  (3:1)   [200-350 KB]
├─ Thumb: 600 x 200          [60-100 KB]
└─ Mini: 300 x 100           [15-30 KB]

👤 AVATAR/PERFIL
├─ Full: 400 x 400   (1:1)   [80-150 KB]
├─ Thumb: 200 x 200          [25-40 KB]
└─ Mini: 100 x 100           [8-15 KB]

🖼️ FULL HD (16:9)
├─ Full: 1920 x 1080         [300-500 KB]
├─ Thumb: 960 x 540          [100-150 KB]
└─ Mini: 480 x 270           [30-50 KB]
```

---

## ⚡ Comandos Rápidos

```bash
# Hero Carousel
node generate-thumbnails.js ./banner.jpg hero

# Capa de Módulo (padrão)
node generate-thumbnails.js ./capa.jpg

# Capa de Trilha
node generate-thumbnails.js ./trilha.jpg trail

# Avatar
node generate-thumbnails.js ./perfil.jpg avatar

# Pasta inteira
node generate-thumbnails.js ./pasta hero
```

---

## 🎨 Proporções Visuais

```
Hero Carousel (3:1)          Capa Módulo (9:16)        Avatar (1:1)
┌──────────────────┐         ┌─────┐                   ┌─────┐
│                  │         │     │                   │     │
│                  │ 640px   │     │ 768px              │     │ 400px
│     1920px       │         │ 700 │                   │ 400 │
│                  │         │     │                   │     │
│                  │         │     │                   │     │
└──────────────────┘         └─────┘                   └─────┘

Capa Trilha (3:1)            Full HD (16:9)
┌──────────────────┐         ┌──────────────────┐
│                  │         │                  │
│   1200 x 400px   │         │  1920 x 1080px   │
│                  │         │                  │
└──────────────────┘         └──────────────────┘
```

---

## 📱 Responsivo

```
DESKTOP (≥1920px)        TABLET (768-1023px)      MOBILE (<768px)
├─ Hero: 1920x640       ├─ Hero: 1024x341        ├─ Hero: 100% x 250px
├─ Module: 350x384      ├─ Module: 300x384       ├─ Module: 100% x 384px
├─ Avatar: 80px         ├─ Avatar: 48px          └─ Avatar: 40px
└─ Trail: 1200x400      └─ Trail: 800x267        └─ Trail: 100% x 200px

Usa: -full.webp         Usa: -thumb.webp         Usa: -mini.webp
```

---

## ✅ Checklist de Criação

```
1. Design
   □ Dimensão correta (Canva/Figma)
   □ Elementos no centro
   □ Alto contraste
   □ Qualidade alta

2. Exportar
   □ Formato: PNG ou JPG
   □ Qualidade: 100%
   □ Sem compressão
   □ Nome descritivo

3. Gerar Miniaturas
   □ npm install sharp
   □ node generate-thumbnails.js ./img.jpg [tipo]
   □ Verificar 3 arquivos gerados

4. Upload
   □ -full.webp → versão principal
   □ -thumb.webp → cache
   □ -mini.webp → mobile

5. Testar
   □ Desktop (F12: 1920px)
   □ Tablet (768px)
   □ Mobile (375px)
   □ Carregamento rápido?
```

---

## 🎯 Tipos de Uso

| Onde Usar | Tipo | Tamanho | Proporção |
|-----------|------|--------|-----------|
| Dashboard topo | **hero** | 1920x640 | 3:1 |
| Cards módulos | **module** | 700x768 | 9:16 |
| Header trilha | **trail** | 1200x400 | 3:1 |
| Perfil usuário | **avatar** | 400x400 | 1:1 |
| Seção grande | **full** | 1920x1080 | 16:9 |

---

## 🔄 Fluxo Rápido

```
1. Canva/Figma
   └─ Criar imagem

2. Exportar
   └─ JPG ou PNG

3. Script
   └─ node generate-thumbnails.js ./img.jpg [tipo]
   └─ 3 arquivos gerados

4. Upload Supabase
   └─ bucket/modules/{id}/img-full.webp
   └─ bucket/modules/{id}/img-thumb.webp
   └─ bucket/modules/{id}/img-mini.webp

5. Usar no Código
   └─ <img src="{url}-{full|thumb|mini}.webp" />
```

---

## 💾 Formato de Saída

**Sempre WebP:**
```
- Qualidade: 75-85%
- Compressão: Lossless + Lossy
- Compatibilidade: 94% dos navegadores
- Redução: 25-35% vs JPG, 80% vs PNG
```

**Nomes dos arquivos:**
```
imagem-full.webp     (versão completa)
imagem-thumb.webp    (tamanho médio)
imagem-mini.webp     (tamanho pequeno)
```

---

## 🚨 Erros Comuns

| Erro | Solução |
|------|---------|
| ❌ "sharp not found" | `npm install sharp` |
| ❌ "File not found" | Verificar caminho + extensão |
| ❌ "Invalid type" | Usar: hero, module, trail, avatar, full |
| ❌ Imagem cortada | Usar proporção correta no design |
| ❌ Arquivo muito grande | Usar WebP, qualidade 80-85% |

---

## 📊 Exemplo: Processo Completo

```bash
# 1. Criar no Canva (700x768px)
# 2. Download: modulo-react.jpg (2.1 MB)

# 3. Executar script
$ node generate-thumbnails.js ./modulo-react.jpg

# Output:
# 📸 📦 Capa de Módulo
# 📁 Arquivo: modulo-react.jpg
# 📊 Dimensões originais: 700x768px
# 
# 🔄 Gerando...
#   ⚙️  Full: 700x768px
#   ⚙️  Thumb: 350x384px
#   ⚙️  Mini: 175x192px
#
# ✅ Arquivos gerados com sucesso!
#
# 📋 Tamanho dos arquivos:
#   • modulo-react-full.webp  → 187 KB
#   • modulo-react-thumb.webp → 63 KB
#   • modulo-react-mini.webp  → 18 KB
#
#   Total: 268 KB

# 4. Upload dos 3 arquivos ao Supabase

# 5. Usar na aplicação
# <img src="{url}/modulo-react-full.webp" alt="..." />
```

---

## 🎬 Quick Links

- **Documentação Completa:** `TAMANHOS_IMAGENS_MODULOS.md`
- **Guia Prático:** `GUIA_GERAR_MINIATURAS.md`
- **Script:** `generate-thumbnails.js`

---

**Última atualização:** 2025-10-27
