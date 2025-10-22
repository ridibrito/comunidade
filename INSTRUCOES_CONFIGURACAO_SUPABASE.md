# Instruções para Configurar URLs no Supabase Dashboard

## 🚨 PROBLEMA: "Link de autenticação expirou ou é inválido"

Este erro acontece quando as URLs de redirecionamento não estão configuradas corretamente no Supabase Dashboard.

## 🔧 SOLUÇÃO: Configurar URLs no Supabase

### 1. Acessar o Supabase Dashboard
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Faça login** na sua conta
3. **Selecione seu projeto** (btuenakbvssiekfdbecx)

### 2. Navegar para Authentication
1. No menu lateral esquerdo, clique em **"Authentication"** (ícone de cadeado)
2. Clique em **"URL Configuration"**

### 3. Configurar as URLs

#### **Site URL:**
```
http://localhost:3000
```

#### **Additional Redirect URLs:**
Adicione **UMA URL POR LINHA** (não separe por vírgulas):

```
http://localhost:3000/auth/callback
http://localhost:3000/auth/change-password
http://localhost:3000/auth/callback?type=invite
http://localhost:3000/auth/callback?next=/auth/change-password
```

### 4. Salvar as Configurações
1. Clique no botão **"Save"** (Salvar)
2. Aguarde a confirmação de que foi salvo

## 🧪 Testar a Configuração

### 1. Criar um Usuário de Teste
1. Acesse a interface admin: `http://localhost:3000/admin/users`
2. Clique em **"Adicionar usuário"**
3. Preencha:
   - **Nome**: Teste Configuração
   - **Email**: teste.configuracao@exemplo.com
   - **Permissão**: Aluno
4. Clique em **"Criar"**

### 2. Verificar o Email
1. Verifique a caixa de entrada do email
2. Procure por um email da "Comunidade Montanha do Amanhã"
3. Clique no link **"Confirmar Acesso e Definir Senha"**

### 3. Verificar o Redirecionamento
1. O link deve levar para: `http://localhost:3000/auth/change-password`
2. **NÃO** deve aparecer o erro "Link de autenticação expirou"
3. Deve aparecer a página de definição de senha

## 🔍 Verificar se Está Funcionando

### ✅ Sinais de Sucesso:
- Email é enviado automaticamente
- Link do email funciona
- Redireciona para `/auth/change-password`
- Página de definição de senha aparece
- Usuário pode definir senha e fazer login

### ❌ Sinais de Problema:
- Erro "Link de autenticação expirou"
- Redireciona para `/auth/login`
- Página de erro aparece
- Usuário não consegue definir senha

## 🛠️ Troubleshooting

### Problema: "Link de autenticação expirou"
**Solução**: Verificar se todas as URLs estão configuradas corretamente

### Problema: Redireciona para login em vez de change-password
**Solução**: Verificar se `http://localhost:3000/auth/callback?type=invite` está na lista

### Problema: Email não é enviado
**Solução**: Verificar se o template "Confirm signup" está configurado

### Problema: Callback não funciona
**Solução**: Verificar se o arquivo `/auth/callback/route.ts` existe e foi salvo

## 📋 Checklist de Configuração

- [ ] Site URL configurado: `http://localhost:3000`
- [ ] URL 1 adicionada: `http://localhost:3000/auth/callback`
- [ ] URL 2 adicionada: `http://localhost:3000/auth/change-password`
- [ ] URL 3 adicionada: `http://localhost:3000/auth/callback?type=invite`
- [ ] URL 4 adicionada: `http://localhost:3000/auth/callback?next=/auth/change-password`
- [ ] Configurações salvas no Supabase
- [ ] Template "Confirm signup" personalizado
- [ ] Teste de criação de usuário realizado
- [ ] Link do email funciona corretamente
- [ ] Redirecionamento para change-password funciona

## 🎯 Resultado Esperado

Após a configuração correta:
1. **Admin cria usuário** → Email enviado automaticamente
2. **Usuário recebe email** → Com link de confirmação
3. **Usuário clica no link** → Vai para `/auth/change-password`
4. **Usuário define senha** → Conta ativada
5. **Usuário faz login** → Acesso liberado

## 📞 Se Ainda Não Funcionar

1. **Verifique os logs** do console do navegador
2. **Verifique os logs** do servidor Next.js
3. **Confirme** que todas as URLs estão exatamente como listado
4. **Teste** com um email diferente
5. **Reinicie** o servidor Next.js se necessário

**A configuração correta das URLs é essencial para o funcionamento do sistema de convites!**
