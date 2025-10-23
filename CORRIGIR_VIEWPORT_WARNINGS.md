# ⚠️ Corrigir Avisos de Viewport (Não Urgente)

## 📋 O Que São Esses Avisos?

Durante o build, você vê:
```
⚠ Unsupported metadata viewport is configured in metadata export
```

## 🎯 Causa

Next.js 15 mudou a API. Antes:
```typescript
export const metadata = {
  viewport: { ... }  ← Antigo
}
```

Agora:
```typescript
export const viewport = { ... }  ← Novo
```

## ✅ Não É Urgente

Esses são apenas **avisos**, não erros:
- ✅ Build funciona
- ✅ Aplicação roda normalmente
- ✅ Viewport funciona corretamente
- ⚠️ Apenas deprecated (será removido em versões futuras)

## 🔧 Como Corrigir (Opcional)

### Exemplo: Antes e Depois

**ANTES (layout.tsx já está correto):**
```typescript
export const metadata: Metadata = {
  title: "...",
  viewport: {  // ← Movido para export separado
    width: 'device-width',
    initialScale: 1,
  }
};
```

**DEPOIS:**
```typescript
export const metadata: Metadata = {
  title: "...",
  // viewport removido daqui
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};
```

## 📝 Arquivos Afetados

Esses arquivos têm viewport na metadata (podem ser corrigidos depois):

```
/admin/users
/catalog/acervo-digital
/community/chat
/ai
/calendar
/catalog
/catalog/montanha-do-amanha
/_not-found
/auth/auth-code-error
/catalog/rodas-de-conversa
/events/calendar
/profile/anamnese
/community/members
/catalog/plantao-de-duvidas
/dashboard
/events
/community
/events/history
/profile/diario
/profile
/onboarding/sucesso
/admin/modules
/admin/heroes
/admin/mountains
/admin
/admin/acervo
/profile/familia
/test-elements
/profile/rotina
/admin/plantao
/admin/reports
/admin/lessons
/admin/rodas
/admin/trails
```

## 🚀 Quando Corrigir?

Recomendo corrigir:
- ✅ Quando tiver tempo livre
- ✅ Em uma próxima sprint
- ✅ Antes de atualizar para Next.js 16

**Não precisa corrigir agora!** Funciona perfeitamente.

## 🔍 Como Identificar Páginas com Viewport

Use grep para encontrar:
```bash
grep -r "viewport:" src/app/
```

## 📖 Documentação Oficial

https://nextjs.org/docs/app/api-reference/functions/generate-viewport

---

**Pode ignorar esses avisos por enquanto. A aplicação funciona perfeitamente!** ✅

