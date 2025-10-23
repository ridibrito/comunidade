# 🔒 Desabilitar Link Tracking do Resend

## ⚠️ Problema Identificado

Usuários veem aviso de segurança ao clicar em links de email:
```
❌ 2b5e3d448ad59b59a94db8cdca1fc425.sa-east-1.resend-links.com
⚠️ "não é compatível com uma ligação segura com HTTPS"
```

## 🎯 Causa

O Resend usa **link tracking** por padrão, que:
1. Substitui links reais por links de tracking (`resend-links.com`)
2. Redireciona para o link real após rastrear o clique
3. O domínio de tracking **não tem HTTPS** configurado

## ✅ Solução 1: Desabilitar no Dashboard (Recomendado)

### Passo a Passo:

1. **Acesse o Resend Dashboard:**
   ```
   https://resend.com/settings
   ```

2. **Vá para "Tracking":**
   - Menu lateral → **"Tracking"** ou **"Settings"**

3. **Desabilite Click Tracking:**
   - Encontre: **"Click Tracking"** ou **"Link Tracking"**
   - Toggle: **OFF** (desligado)

4. **Salve as Alterações**

## ✅ Solução 2: Desabilitar por API (No Código)

Se estiver enviando emails por API, adicione `tags` no código:

### Exemplo (se usar API diretamente):

```typescript
// Em algum arquivo de envio de email
await resend.emails.send({
  from: 'Aldeia Singular <contato@aldeiasingular.com.br>',
  to: email,
  subject: 'Convite para Aldeia Singular',
  html: htmlContent,
  tags: [
    { name: 'click_tracking', value: 'false' }  // ← Desabilita tracking
  ]
});
```

## ✅ Solução 3: Usar Headers (Se disponível)

```typescript
headers: {
  'X-Resend-Click-Tracking': 'false'
}
```

## 🔍 Verificar Se Funciona

Após desabilitar, teste:

1. **Envie um novo email de convite**
2. **Inspecione o email:**
   - Clique com botão direito no link
   - Selecione "Copiar endereço do link"
3. **Verifique o link:**
   ```
   ✅ Deve começar com: https://app.aldeiasingular.com.br
   ❌ NÃO deve ter: resend-links.com
   ```

## 📧 Como Verificar no Email

### ANTES (Com Tracking):
```html
<a href="https://2b5e3d448ad59b59a94db8cdca1fc425.sa-east-1.resend-links.com/...">
  Aceitar Convite
</a>
```

### DEPOIS (Sem Tracking):
```html
<a href="https://app.aldeiasingular.com.br/auth/callback?type=invite&token=...">
  Aceitar Convite
</a>
```

## 🎯 Resultado Final

Após desabilitar o tracking:
- ✅ Links diretos e seguros (HTTPS)
- ✅ Sem avisos de segurança
- ✅ Melhor experiência do usuário
- ❌ Sem estatísticas de cliques (trade-off)

## 🤔 Alternativa: Manter Tracking com Domínio Personalizado

Se você quiser **manter** as estatísticas de cliques:

1. **Configure domínio personalizado no Resend:**
   ```
   track.aldeiasingular.com.br
   ```

2. **Adicione DNS:**
   ```
   CNAME track → resend-tracking.com
   ```

3. **Configure SSL no Resend**

Assim você mantém tracking **COM HTTPS**.

## 📊 Trade-offs

| Opção | Vantagens | Desvantagens |
|-------|-----------|--------------|
| **Desabilitar Tracking** | ✅ Sem avisos<br>✅ Links diretos<br>✅ Mais seguro | ❌ Sem estatísticas de cliques |
| **Domínio Personalizado** | ✅ Tracking funciona<br>✅ HTTPS seguro<br>✅ Estatísticas | ❌ Configuração extra<br>❌ DNS necessário |
| **Manter Como Está** | ✅ Funciona<br>✅ Estatísticas | ❌ Aviso de segurança<br>❌ Má experiência |

## 🚀 Recomendação

**Para produção: DESABILITE o tracking**

Motivos:
1. ✅ Melhor experiência do usuário
2. ✅ Sem avisos de segurança
3. ✅ Mais confiável
4. ✅ HTTPS nativo
5. ✅ Fácil de implementar

Você pode sempre habilitar estatísticas mais tarde com domínio personalizado.

---

**Desabilite o tracking no Resend Dashboard agora mesmo!** 🔒✨

