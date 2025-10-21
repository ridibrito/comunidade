-- Adicionar campos de status de convite e login à tabela profiles existente
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS invite_status TEXT CHECK (invite_status IN ('pending', 'sent', 'accepted', 'expired')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS invite_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS invite_email TEXT,
ADD COLUMN IF NOT EXISTS invite_token TEXT;

-- Atualizar usuários existentes para ter status 'accepted' (já fizeram login)
UPDATE profiles 
SET invite_status = 'accepted', last_login_at = created_at
WHERE invite_status IS NULL OR invite_status = 'pending';

-- Função para atualizar last_login_at quando usuário faz login
CREATE OR REPLACE FUNCTION update_user_login_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar último login e incrementar contador
    UPDATE profiles 
    SET 
        last_login_at = NOW(),
        login_count = COALESCE(login_count, 0) + 1,
        invite_status = CASE 
            WHEN invite_status = 'sent' THEN 'accepted'
            ELSE invite_status 
        END,
        updated_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para capturar logins
CREATE TRIGGER update_login_stats_trigger
    AFTER INSERT ON auth.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_login_stats();

-- Função para criar convite de usuário
CREATE OR REPLACE FUNCTION create_user_invite(
    p_email TEXT,
    p_full_name TEXT,
    p_role TEXT,
    p_invited_by UUID
)
RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
    v_invite_token TEXT;
    v_result JSON;
BEGIN
    -- Gerar token único para o convite
    v_invite_token := encode(gen_random_bytes(32), 'hex');
    
    -- Criar usuário no auth (isso enviará o email de convite)
    INSERT INTO auth.users (
        email,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data
    ) VALUES (
        p_email,
        NULL, -- Não confirmado ainda
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        json_build_object('full_name', p_full_name, 'role', p_role)
    ) RETURNING id INTO v_user_id;
    
    -- Criar perfil com status de convite enviado
    INSERT INTO profiles (
        id,
        full_name,
        role,
        is_admin,
        invite_status,
        invite_sent_at,
        invited_by,
        invite_email,
        invite_token
    ) VALUES (
        v_user_id,
        p_full_name,
        p_role,
        (p_role = 'admin'),
        'sent',
        NOW(),
        p_invited_by,
        p_email,
        v_invite_token
    );
    
    -- Retornar resultado
    v_result := json_build_object(
        'user_id', v_user_id,
        'invite_token', v_invite_token,
        'status', 'sent'
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política para permitir que admins vejam status de convites
CREATE POLICY "Admins can view invite status" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );
