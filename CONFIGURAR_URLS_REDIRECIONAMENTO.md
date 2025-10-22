# Configuração de URLs de Redirecionamento no Supabase

## Problema
O erro "O link de autenticação expirou ou é inválido" ocorre porque o Supabase não está configurado para aceitar as URLs de redirecionamento da aplicação.

## Solução

### 1. Acessar o Dashboard do Supabase
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral, clique em **Authentication**
4. Clique em **URL Configuration**

### 2. Configurar URLs de Redirecionamento

Na seção **Redirect URLs**, adicione as seguintes URLs:

#### Para Desenvolvimento Local:
```
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/auth/reset
http://localhost:3000/auth/reset
```

#### Para Produção (substitua pelo seu domínio):
```
https://seudominio.com/auth/callback
https://seudominio.com/auth/callback?next=/auth/reset
https://seudominio.com/auth/reset
```

### 3. Configurar Site URL

Na seção **Site URL**, configure:

#### Para Desenvolvimento:
```
http://localhost:3000
```

#### Para Produção:
```
https://seudominio.com
```

### 4. Salvar Configurações

Clique em **Save** para salvar as configurações.

## Verificação

Após configurar as URLs:

1. Crie um novo usuário na área administrativa
2. Verifique se o email foi enviado
3. Clique no link do email
4. O usuário deve ser redirecionado automaticamente para a página de reset de senha

## Troubleshooting

Se ainda houver problemas:

1. Verifique os logs do servidor para ver mensagens de erro específicas
2. Confirme se as URLs estão exatamente como configuradas no Supabase
3. Teste com um novo usuário após salvar as configurações

## URLs Importantes

- **Callback URL**: `http://localhost:3000/auth/callback`
- **Reset URL**: `http://localhost:3000/auth/reset`
- **Error URL**: `http://localhost:3000/auth/auth-code-error`
