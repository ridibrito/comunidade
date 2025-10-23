# ⚡ Favicon Rápido - 2 Minutos

## 🎯 Solução Mais Rápida

### 1️⃣ Acesse Este Site
```
https://favicon.io/favicon-converter/
```

### 2️⃣ Upload da Imagem
- Clique em "Choose File"
- Selecione: `Coruja-colorida.png` (na pasta `public/`)
- Clique em "Download"

### 3️⃣ Extrair e Copiar
1. Descompacte o arquivo `favicon_io.zip`
2. Copie TODOS os arquivos para `comunidade/public/`
3. Pronto!

## ✅ Já Está Configurado!

O Next.js já está configurado em `src/app/layout.tsx`:
```typescript
icons: {
  icon: [
    { url: '/Coruja-colorida.png', sizes: '32x32' },
    { url: '/Coruja-colorida.png', sizes: '16x16' },
  ],
  apple: '/Coruja-colorida.png',
}
```

## 🧪 Testar

Após copiar os arquivos:

```bash
# Rodar local
npm run dev

# Abrir navegador
http://localhost:3000
```

Você verá a coruja colorida na aba do navegador! 🦉

## 🚀 Commit

```bash
git add public/favicon*
git add public/apple-touch-icon.png
git add src/app/layout.tsx
git commit -m "feat: adicionar favicon da Coruja Colorida"
git push
```

---

**2 minutos e está pronto!** ⚡🦉

