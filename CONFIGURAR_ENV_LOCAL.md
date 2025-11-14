# Como Configurar o Arquivo .env.local

## ⚠️ Erro: Variáveis de Ambiente do Supabase Não Configuradas

Se você está vendo este erro, significa que o arquivo `.env.local` não existe ou não contém as variáveis necessárias do Supabase.

## 📝 Passo a Passo

### 1. Criar o arquivo `.env.local`

Na raiz do projeto, crie um arquivo chamado `.env.local` (se ainda não existir).

### 2. Adicionar as variáveis do Supabase

Adicione as seguintes variáveis ao arquivo `.env.local`:

```env
# URL do projeto Supabase (obrigatório)
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui

# Chave anônima do Supabase (obrigatório)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 3. Obter as credenciais do Supabase

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto (ou crie um novo se necessário)
3. Vá em **Settings** → **API**
4. Copie os seguintes valores:
   - **Project URL** → cole em `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → cole em `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Exemplo de arquivo `.env.local` completo

```env
# ===========================================
# CONFIGURAÇÕES PRINCIPAIS DA APLICAÇÃO
# ===========================================

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ===========================================
# CONFIGURAÇÕES DO SUPABASE (OBRIGATÓRIO)
# ===========================================

NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===========================================
# OUTRAS CONFIGURAÇÕES (OPCIONAL)
# ===========================================

OPENAI_API_KEY=
RESEND_API_KEY=
MAIL_FROM=Comunidade Coruss <noreply@aldeiasingular.com.br>
NODE_ENV=development
```

### 5. Reiniciar o servidor de desenvolvimento

Após criar/editar o arquivo `.env.local`, você precisa reiniciar o servidor:

1. Pare o servidor (Ctrl+C no terminal)
2. Execute novamente: `npm run dev`

## ✅ Verificação

Após configurar, o erro deve desaparecer e a aplicação deve funcionar normalmente.

## 📚 Arquivos de Referência

- `env-template.txt` - Template completo com todas as variáveis
- `env-exemplo-preenchido.txt` - Exemplo preenchido (com valores de exemplo)

## 🔒 Segurança

⚠️ **IMPORTANTE**: O arquivo `.env.local` já está no `.gitignore` e não será commitado no Git. Nunca compartilhe suas chaves de API publicamente!

