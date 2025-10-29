-- Sistema de Notificações
-- Tabela para armazenar notificações dos usuários

-- Criar tabela notifications (usar DROP se já existir para recriar corretamente)
DROP TABLE IF EXISTS public.notifications CASCADE;

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'progress')),
  "read" BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  action_text TEXT,
  progress INTEGER CHECK (progress >= 0 AND progress <= 100),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance (criar após a tabela estar garantida)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications("read");
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, "read");

-- Índice composto para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, "read") WHERE "read" = FALSE;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "users_can_read_own_notifications" ON public.notifications;
DROP POLICY IF EXISTS "users_can_update_own_notifications" ON public.notifications;
DROP POLICY IF EXISTS "users_can_delete_own_notifications" ON public.notifications;

-- Política: Usuários podem ler apenas suas próprias notificações
CREATE POLICY "users_can_read_own_notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários podem marcar como lida apenas suas próprias notificações
CREATE POLICY "users_can_update_own_notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem deletar apenas suas próprias notificações
CREATE POLICY "users_can_delete_own_notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Política: Sistema pode inserir notificações (service role)
-- Notificações podem ser criadas via API/Edge Functions com service role
-- Para inserção via cliente, criaremos uma função stored procedure

-- Função para criar notificação (pode ser chamada via API)
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_action_url TEXT DEFAULT NULL,
  p_action_text TEXT DEFAULT NULL,
  p_progress INTEGER DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type,
    action_url,
    action_text,
    progress,
    metadata
  ) VALUES (
    p_user_id,
    p_title,
    p_message,
    p_type,
    p_action_url,
    p_action_text,
    p_progress,
    p_metadata
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para marcar todas as notificações como lidas
CREATE OR REPLACE FUNCTION public.mark_all_notifications_as_read(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE public.notifications
  SET "read" = TRUE, updated_at = NOW()
  WHERE user_id = p_user_id AND "read" = FALSE;
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter contagem de notificações não lidas
CREATE OR REPLACE FUNCTION public.get_unread_notifications_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM public.notifications
  WHERE user_id = p_user_id AND "read" = FALSE;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permitir que usuários executem essas funções
GRANT EXECUTE ON FUNCTION public.create_notification TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_all_notifications_as_read TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unread_notifications_count TO authenticated;

-- IMPORTANTE: Habilitar Realtime para a tabela notifications
-- Isso permite sincronização em tempo real via Supabase Realtime
-- Para habilitar via SQL Editor do Supabase:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
-- Ou habilite via Dashboard do Supabase em Database > Replication

-- Comentários para documentação
COMMENT ON TABLE public.notifications IS 'Tabela para armazenar notificações dos usuários';
COMMENT ON COLUMN public.notifications.type IS 'Tipo da notificação: info, success, warning, error, progress';
COMMENT ON COLUMN public.notifications."read" IS 'Indica se a notificação foi lida';
COMMENT ON COLUMN public.notifications.metadata IS 'Metadados adicionais em formato JSON (ex: lesson, module, trail, rating)';
COMMENT ON COLUMN public.notifications.progress IS 'Progresso em porcentagem (0-100), usado quando type = progress';

