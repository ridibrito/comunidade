# Sistema de Convites - Coruss

## Visão Geral

O sistema de convites permite que administradores criem novos usuários enviando um link por email para que eles definam sua própria senha. O usuário é automaticamente redirecionado para o dashboard após definir a senha.

## Fluxo do Sistema

### 1. Criação do Convite (Admin)
- Admin acessa `/admin/users`
- Clica em "Adicionar usuário"
- Preenche: Nome, Email, Função
- Sistema gera link de reset de senha via Supabase
- Email é enviado automaticamente pelo Supabase

### 2. Recebimento do Email
- Usuário recebe email com link de convite
- Link direciona para `/auth/reset?email=usuario@exemplo.com`
- Email contém instruções para definir senha

### 3. Definição de Senha
- Usuário acessa o link
- Define nova senha (mínimo 6 caracteres)
- Confirma a senha
- Sistema atualiza perfil com status "accepted"
- Redirecionamento automático para `/dashboard`

## Configuração do Supabase

### 1. Configurar Email Templates
No dashboard do Supabase, vá para:
- Authentication → Email Templates
- Configure o template "Reset Password" com:
  - Assunto: "Convite para acessar a plataforma Coruss"
  - Conteúdo personalizado com branding da Coruss

### 2. Configurar URLs de Redirecionamento
No dashboard do Supabase, vá para:
- Authentication → URL Configuration
- Adicione as URLs permitidas:
  - `http://localhost:3000/auth/reset` (desenvolvimento)
  - `https://seudominio.com/auth/reset` (produção)

### 3. Configurar Site URL
- Authentication → URL Configuration
- Site URL: `https://seudominio.com` (produção)

## Estrutura do Banco de Dados

### Tabela `profiles`
```sql
- id: uuid (chave primária)
- full_name: text
- role: text (admin, aluno, profissional)
- is_admin: boolean
- invite_status: text (pending, accepted, expired)
- invite_sent_at: timestamp
- invite_email: text
- invite_token: text
- last_login_at: timestamp
- login_count: integer
- created_at: timestamp
- updated_at: timestamp
```

## Status dos Convites

- **pending**: Convite criado, aguardando usuário definir senha
- **accepted**: Usuário definiu senha e está ativo
- **expired**: Convite expirou (24h)

## APIs Disponíveis

### POST `/api/admin/users`
Cria novo usuário e envia convite.

**Body:**
```json
{
  "email": "usuario@exemplo.com",
  "name": "Nome Completo",
  "role": "aluno"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Convite enviado com sucesso via Supabase",
  "inviteLink": "https://...",
  "emailSent": true,
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "full_name": "Nome Completo",
    "role": "aluno",
    "invite_status": "pending"
  }
}
```

## Páginas do Sistema

### `/admin/users`
- Lista todos os usuários
- Criação de novos convites
- Gerenciamento de usuários existentes
- Estatísticas de convites

### `/auth/reset`
- Página para definir nova senha
- Acessada via link do email
- Redirecionamento automático após sucesso

## Variáveis de Ambiente Necessárias

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico
NEXT_PUBLIC_SITE_URL=https://seudominio.com
```

## Segurança

- Links de convite expiram em 24 horas
- Senhas devem ter mínimo 6 caracteres
- Apenas administradores podem criar convites
- RLS (Row Level Security) desabilitado temporariamente para desenvolvimento

## Desenvolvimento vs Produção

### Desenvolvimento
- Links de convite são exibidos no console
- Mock de envio de email
- RLS desabilitado para facilitar testes

### Produção
- Emails enviados automaticamente pelo Supabase
- RLS habilitado para segurança
- URLs de redirecionamento configuradas

## Troubleshooting

### Email não enviado
1. Verificar configuração do Supabase
2. Verificar URLs de redirecionamento
3. Verificar logs do Supabase

### Link não funciona
1. Verificar se não expirou (24h)
2. Verificar configuração de URLs
3. Verificar se usuário já definiu senha

### Erro de permissão
1. Verificar se RLS está configurado corretamente
2. Verificar políticas de acesso
3. Verificar se usuário tem permissão de admin
