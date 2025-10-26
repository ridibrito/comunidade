# 🚀 Guia de Configuração para Produção - Aldeia Singular

## 📋 Visão Geral

Este guia contém todas as instruções necessárias para configurar e implantar a aplicação Aldeia Singular em produção com as melhorias de segurança e performance implementadas.

## 🔧 Configuração Inicial

### 1. Variáveis de Ambiente

Execute o script de configuração interativa:

```bash
npm run setup-env
```

Ou configure manualmente o arquivo `.env.local` com as seguintes variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# OpenAI (para IA)
OPENAI_API_KEY=sk-your_openai_api_key

# Hotmart Integration
HOTMART_WEBHOOK_SECRET=your_hotmart_webhook_secret

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key

# Security
NEXTAUTH_SECRET=your_nextauth_secret_key_min_32_chars
NEXTAUTH_URL=https://app.aldeiasingular.com.br

# Monitoring (opcional)
SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

### 2. Configuração do Supabase

1. **Habilitar pgvector**:
   ```sql
   create extension if not exists vector;
   ```

2. **Aplicar migrações**:
   ```bash
   npx supabase db push
   ```

3. **Configurar RLS** (já aplicado nas migrações)

### 3. Configuração do Redis (Upstash)

1. Criar conta no [Upstash](https://upstash.com)
2. Criar um banco Redis
3. Copiar URL e token para as variáveis de ambiente

## 🛡️ Configurações de Segurança

### 1. Cabeçalhos de Segurança

Os cabeçalhos de segurança já estão configurados no `middleware.ts`:

- **Content Security Policy (CSP)**
- **Strict Transport Security (HSTS)**
- **X-Frame-Options**
- **X-Content-Type-Options**
- **Referrer-Policy**
- **Permissions-Policy**

### 2. Rate Limiting

O rate limiting está configurado para:

- **Login**: 5 tentativas por 5 minutos
- **Recuperação de senha**: 3 tentativas por hora
- **API geral**: 1000 requisições por hora
- **Webhooks**: 100 requisições por minuto

### 3. Validação de Dados

Todos os dados de entrada são validados com schemas Zod:

- **Emails**: Validação de formato e sanitização
- **Senhas**: Verificação de força e requisitos
- **CPF**: Validação com algoritmo completo
- **Nomes**: Sanitização e validação de caracteres

## 🚀 Configurações de Performance

### 1. Otimizações do Next.js

- **Compressão**: Habilitada
- **Imagens**: Otimização automática com WebP/AVIF
- **Cache**: Configurado para assets estáticos
- **Bundle splitting**: Otimizado para chunks menores

### 2. Lazy Loading

- **Componentes**: Carregamento sob demanda
- **Imagens**: Lazy loading com placeholders
- **Dados**: Cache inteligente com TTL

### 3. Monitoramento

- **Logs estruturados**: Para debugging e análise
- **Métricas de performance**: Tempo de renderização e carregamento
- **Detecção de bots**: Bloqueio automático

## 📊 Comandos de Auditoria

### Segurança
```bash
npm run security-audit      # Auditoria completa de segurança
npm run check-security      # Verificação de segurança + dependências
npm run audit              # Verificar vulnerabilidades
npm run audit-fix          # Corrigir vulnerabilidades automaticamente
```

### Performance
```bash
npm run performance-audit   # Auditoria completa de performance
npm run analyze            # Análise de bundle
npm run build:analyze      # Build com análise de bundle
npm run perf:lighthouse    # Teste com Lighthouse
```

### Testes Gerais
```bash
npm run test-improvements  # Testar todas as melhorias
npm run test:all          # Teste completo (segurança + performance)
```

## 🚀 Deploy em Produção

### 1. Vercel (Recomendado)

1. **Conectar repositório** ao Vercel
2. **Configurar variáveis de ambiente** no painel do Vercel
3. **Configurar domínio** personalizado
4. **Habilitar HTTPS** (automático)

### 2. Configurações do Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 3. Variáveis de Ambiente no Vercel

Adicionar todas as variáveis do `.env.local` no painel do Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `OPENAI_API_KEY`
- `HOTMART_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 🔍 Monitoramento em Produção

### 1. Sentry (Recomendado)

1. Criar conta no [Sentry](https://sentry.io)
2. Configurar projeto Next.js
3. Adicionar `SENTRY_DSN` nas variáveis de ambiente
4. Configurar alertas para erros críticos

### 2. Vercel Analytics

1. Habilitar Vercel Analytics no painel
2. Adicionar `VERCEL_ANALYTICS_ID` nas variáveis de ambiente
3. Monitorar métricas de Web Vitals

### 3. Logs de Aplicação

Os logs estruturados estão configurados para:

- **Tentativas de login** (sucesso/falha)
- **Atividades suspeitas** (IPs, User-Agents)
- **Performance** (requisições lentas)
- **Rate limiting** (tentativas bloqueadas)

## 🧪 Testes Pós-Deploy

### 1. Testes de Segurança

```bash
# Verificar cabeçalhos de segurança
curl -I https://app.aldeiasingular.com.br

# Testar rate limiting
for i in {1..10}; do curl -X POST https://app.aldeiasingular.com.br/api/auth/login; done

# Verificar CSP
curl -s https://app.aldeiasingular.com.br | grep -i "content-security-policy"
```

### 2. Testes de Performance

```bash
# Lighthouse CI
npm run perf:lighthouse

# Bundle analysis
npm run analyze
```

### 3. Testes Funcionais

1. **Login/Logout**: Verificar autenticação
2. **Rate Limiting**: Testar limites de requisição
3. **Validação**: Testar validação de dados
4. **Imagens**: Verificar otimização de imagens
5. **Cache**: Verificar funcionamento do cache

## 📈 Métricas de Sucesso

### Segurança
- ✅ **0 vulnerabilidades** críticas
- ✅ **Rate limiting** funcionando
- ✅ **Cabeçalhos de segurança** ativos
- ✅ **Validação de dados** rigorosa

### Performance
- ✅ **Lighthouse Score** > 90
- ✅ **First Contentful Paint** < 1.5s
- ✅ **Largest Contentful Paint** < 2.5s
- ✅ **Cumulative Layout Shift** < 0.1

### Monitoramento
- ✅ **Logs estruturados** funcionando
- ✅ **Alertas configurados** para erros críticos
- ✅ **Métricas de performance** sendo coletadas

## 🆘 Troubleshooting

### Problemas Comuns

1. **Build falhando**: Verificar variáveis de ambiente
2. **Rate limiting não funciona**: Verificar configuração do Redis
3. **Imagens não carregam**: Verificar configuração do Next.js
4. **Logs não aparecem**: Verificar configuração de monitoramento

### Comandos de Debug

```bash
# Verificar configuração
npm run test-improvements

# Verificar segurança
npm run security-audit

# Verificar performance
npm run performance-audit

# Análise de bundle
npm run analyze
```

## 📞 Suporte

Para problemas ou dúvidas:

1. Verificar logs da aplicação
2. Executar comandos de auditoria
3. Consultar documentação do Next.js
4. Verificar configurações do Supabase/Redis

---

**🎉 Parabéns! Sua aplicação Aldeia Singular está configurada com segurança e performance de nível empresarial!**
