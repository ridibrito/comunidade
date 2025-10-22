-- Corrigir políticas RLS para resolver erro de autenticação

-- Desabilitar RLS temporariamente
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Criar políticas básicas e funcionais
CREATE POLICY "Enable read access for all users" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user id" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Habilitar RLS novamente
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Verificar se há registros na tabela profiles para o usuário ricardo
INSERT INTO profiles (id, full_name, role, is_admin, invite_email)
SELECT 
    'ff1df3c4-9545-46d0-b344-84b48a5c4a5d'::uuid,
    'Ricardo',
    'admin',
    true,
    'ricardo@coruss.com.br'
WHERE NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = 'ff1df3c4-9545-46d0-b344-84b48a5c4a5d'::uuid
);
