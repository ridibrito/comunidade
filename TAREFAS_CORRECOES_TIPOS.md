# 📋 Tarefas de Correção de Erros de Tipo

**Data de Criação:** 27 de Outubro de 2025  
**Status:** ⏳ Pendente  
**Prioridade:** Média

---

## 🎯 Objetivo

Corrigir todos os erros de tipo TypeScript que foram ignorados durante o build para melhorar a qualidade do código e permitir habilitar `typescript.ignoreBuildErrors: false` no futuro.

---

## 📝 Erros a Corrigir

### 1. **ToastProvider.tsx** - Tipo de retorno da função `promise`
**Arquivo:** `src/components/providers/ToastProvider.tsx`  
**Linha:** 15-22  
**Problema:**
```typescript
// Atual (incorreto)
promise: <T>(
  promise: Promise<T>,
  options: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) => any;
```

**Solução:**
- O tipo de retorno deve ser `Promise<T>` em vez de `any`
- Verificar a tipagem do Sonner para entender o retorno correto da função `toast.promise()`
- Pode ser necessário criar um wrapper mais específico

---

### 2. **Chart.tsx** - Interface ChartTooltipContentProps
**Arquivo:** `src/components/ui/Chart.tsx`  
**Linhas:** 107-117  
**Problema:**
```typescript
// Atual (foi refatorado mas pode ter conflitos)
interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<any>
  // ... outros tipos com 'any'
}
```

**Solução:**
- Remover o uso de `Array<any>` e usar tipagem mais específica
- Tipar corretamente o `payload` baseado na API do Recharts
- Considerar usar tipos do Recharts: `TooltipProps<ValueType, NameType>`

---

### 3. **webhook/route.ts** - Tipagem do array users
**Arquivo:** `src/app/api/hotmart/webhook/route.ts`  
**Linha:** 209  
**Problema:**
```typescript
// Atual (com type casting)
let user = existingUsers?.users?.find((u: any) => u.email === email);
```

**Solução:**
- Importar os tipos do Supabase Auth Admin API
- Tipar corretamente: `existingUsers?.users?.find((u: User) => u.email === email)`
- Remover o cast `any`

**Referência:**
```typescript
import type { User } from '@supabase/supabase-js'
```

---

## 🔧 Configuração Atual

**Arquivo:** `next.config.js`

```javascript
typescript: {
  ignoreBuildErrors: true,  // ⚠️ Erros de tipo sendo ignorados
},
```

### Checklist de Ativação:
- [ ] Corrigir todos os 3 erros acima
- [ ] Mudar para: `ignoreBuildErrors: false`
- [ ] Executar `npm run build` sem erros
- [ ] Fazer commit

---

## 📚 Recursos Úteis

### Documentação Relevante:
- [Sonner Toast - TypeScript](https://sonner.emilkowal.ski/)
- [Recharts - Props API](https://recharts.org/api)
- [Supabase Admin API - Users](https://supabase.com/docs/reference/javascript/admin-api)
- [Next.js TypeScript Config](https://nextjs.org/docs/app/building-your-application/configuring/typescript)

### Comandos Úteis:
```bash
# Verificar erros de tipo sem fazer build completo
npx tsc --noEmit

# Build sem ignorar erros
npm run build

# Verificar apenas um arquivo
npx tsc --noEmit src/components/providers/ToastProvider.tsx
```

---

## ✅ Checklist de Correção

- [ ] **ToastProvider.tsx** - Corrigir tipo de retorno `promise`
- [ ] **Chart.tsx** - Tipar corretamente `ChartTooltipContentProps` e `payload`
- [ ] **webhook/route.ts** - Remover `any` e usar tipo `User` correto
- [ ] **next.config.js** - Mudar `ignoreBuildErrors: false`
- [ ] **Testes** - Executar build sem erros
- [ ] **Commit** - `git commit -m "fix: corrigir todos os erros de tipo TypeScript"`
- [ ] **Push** - `git push origin main`

---

## 📌 Notas

- Erros de tipo foram ignorados para permitir deploy rápido
- Qualidade do código será melhorada gradualmente
- Não afeta funcionalidade da aplicação no momento
- Recomenda-se corrigir assim que possível

---

**Responsável:** Ricardo  
**Próxima Revisão:** Quando o build passar sem `ignoreBuildErrors`
