# ⚡ Corrigir Aviso de Link Inseguro - 1 Minuto

## ❌ Problema

Usuários veem este aviso ao clicar em links de email:
```
⚠️ "2b5e3d448ad59b59a94db8cdca1fc425.sa-east-1.resend-links.com
    não é compatível com uma ligação segura com HTTPS"
```

## 🎯 Causa

O **Resend** está usando **link tracking** que:
- Substitui seus links seguros por links de tracking
- O domínio de tracking não tem HTTPS
- Causa avisos de segurança

## ✅ Solução Rápida (1 minuto)

### 1️⃣ Acesse o Resend
```
https://resend.com/settings
```

### 2️⃣ Vá para "Tracking"
- Menu lateral → **Settings** → **Tracking**

### 3️⃣ Desabilite "Click Tracking"
- Toggle **OFF** (desligado)

### 4️⃣ Salve

## ✅ Resultado

**ANTES:**
```
❌ https://2b5e3d448ad59b59a94db8cdca1fc425.resend-links.com/...
   (aviso de segurança)
```

**DEPOIS:**
```
✅ https://app.aldeiasingular.com.br/auth/callback?type=invite&token=...
   (link direto e seguro)
```

## 🧪 Testar

1. Desabilite o tracking
2. Envie um novo email de convite
3. Verifique: link deve começar com `app.aldeiasingular.com.br`
4. Sem avisos de segurança! ✅

---

**Faça isso agora! Leva apenas 1 minuto.** 🔒⚡

