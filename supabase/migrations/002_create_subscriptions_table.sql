-- Criar tabela subscriptions se não existir
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'hotmart',
  product_id text NOT NULL,
  purchase_id text UNIQUE,
  status text NOT NULL CHECK (status IN ('active','pending','trial','past_due','canceled','refunded','chargeback')),
  started_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  meta jsonb DEFAULT '{}'::jsonb
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_sub_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_sub_status ON public.subscriptions(status);

-- Criar view para usuários ativos
CREATE OR REPLACE VIEW public.v_user_active AS
SELECT user_id
FROM public.subscriptions
WHERE status IN ('active','trial')
  AND (ends_at IS NULL OR ends_at > now())
GROUP BY user_id;

-- Habilitar RLS e políticas mínimas seguras
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscriptions' AND policyname = 'allow_user_read_own_subscriptions'
  ) THEN
    CREATE POLICY "allow_user_read_own_subscriptions"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Inserções/atualizações somente por service role (executadas via backend)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscriptions' AND policyname = 'allow_service_role_write_subscriptions'
  ) THEN
    CREATE POLICY "allow_service_role_write_subscriptions"
    ON public.subscriptions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;
