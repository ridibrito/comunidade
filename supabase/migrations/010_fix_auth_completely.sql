-- Correção completa para resolver erro "Database error granting user"

-- 1. Desabilitar RLS temporariamente
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user id" ON profiles;

-- 3. Remover triggers que podem estar causando problemas
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- 4. Remover função que pode estar causando problemas
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 5. Criar políticas muito simples
CREATE POLICY "Allow all operations for authenticated users" ON profiles
    FOR ALL USING (auth.role() = 'authenticated');

-- 6. Habilitar RLS novamente
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 7. Criar função e trigger mais simples
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger mais simples
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Garantir que o perfil do Ricardo existe
INSERT INTO profiles (id, full_name, role, is_admin, invite_email, invite_status)
VALUES (
    'ff1df3c4-9545-46d0-b344-84b48a5c4a5d'::uuid,
    'Ricardo',
    'admin',
    true,
    'ricardo@coruss.com.br',
    'accepted'
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_admin = EXCLUDED.is_admin,
    invite_email = EXCLUDED.invite_email,
    invite_status = EXCLUDED.invite_status;
