# Configuração do Banco de Dados

## Problema Identificado

A página de usuários não está puxando dados do banco de dados porque:

1. **Variáveis de ambiente não configuradas** - O arquivo `.env.local` precisa ser configurado com as chaves corretas do Supabase
2. **Tabela `profiles` pode não existir** - A tabela necessária pode não ter sido criada no banco
3. **Conexão com Supabase não estabelecida** - As credenciais podem estar incorretas

## Solução Implementada

### 1. Fallback com Dados Mockados
- A página agora usa dados mockados quando não consegue conectar com o banco
- Indicador visual mostra quando está em "Modo Demonstração"
- Todas as funcionalidades (criar, editar, excluir) funcionam com dados mockados

### 2. Componente de Debug
- Botão "Debug DB" no canto inferior direito da página de usuários
- Mostra status da conexão, variáveis de ambiente e tabelas disponíveis
- Ajuda a identificar problemas de configuração

### 3. Tratamento de Erros Melhorado
- Logs detalhados no console para debugging
- Mensagens de erro mais informativas
- Fallback automático para dados mockados

## Como Configurar o Banco de Dados

### Passo 1: Configurar Variáveis de Ambiente

Crie ou edite o arquivo `.env.local` na raiz do projeto:

```bash
# URL do seu projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co

# Chave anônima do Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui

# Chave de serviço do Supabase (para operações admin)
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui

# Outras chaves (opcionais)
OPENAI_API_KEY=sua-chave-openai-aqui
RESEND_API_KEY=sua-chave-resend-aqui
```

### Passo 2: Criar Tabela Profiles

Execute o SQL no seu projeto Supabase (SQL Editor):

```sql
-- Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'aluno', 'profissional')),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );
```

### Passo 3: Testar a Conexão

1. Acesse a página de usuários em `/admin/users`
2. Clique no botão "Debug DB" no canto inferior direito
3. Verifique se:
   - Variáveis de ambiente estão configuradas (verde)
   - Status da conexão está "Conectado"
   - Tabela `profiles` aparece na lista

### Passo 4: Verificar Logs

Abra o console do navegador (F12) e verifique se há mensagens como:
- "Users API response: {users: [...]}"
- "Users found: X"

## Estrutura da Tabela Profiles

```sql
profiles:
- id (UUID, PK, FK para auth.users)
- full_name (TEXT, nullable)
- role (TEXT: 'admin', 'aluno', 'profissional')
- is_admin (BOOLEAN, default false)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Troubleshooting

### Erro: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
- Verifique se o arquivo `.env.local` existe e tem as variáveis corretas
- Reinicie o servidor de desenvolvimento após alterar o `.env.local`

### Erro: "relation 'profiles' does not exist"
- Execute o SQL de criação da tabela no Supabase
- Verifique se está no projeto correto

### Erro: "permission denied"
- Verifique as políticas RLS da tabela
- Confirme se o usuário tem permissões adequadas

### Página mostra "Modo Demonstração"
- A página está usando dados mockados
- Configure o banco de dados seguindo os passos acima
- Use o botão "Debug DB" para diagnosticar problemas

## Arquivos Relacionados

- `src/app/api/admin/users/route.ts` - API route para usuários
- `src/app/(app)/admin/users/page.tsx` - Página de usuários
- `src/components/ui/DebugSupabase.tsx` - Componente de debug
- `src/components/ui/MockUsers.tsx` - Hook para dados mockados
- `supabase/migrations/001_create_profiles_table.sql` - Migration SQL
