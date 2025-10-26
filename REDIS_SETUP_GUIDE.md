# Guia para configurar Redis Gratuito - Upstash

## 🆓 UPSTASH REDIS (GRATUITO)

### Passo 1: Criar conta
1. Acesse: https://upstash.com
2. Clique em "Sign Up" 
3. Use GitHub, Google ou email
4. Confirme o email

### Passo 2: Criar banco Redis
1. No dashboard, clique em "Create Database"
2. Escolha a região mais próxima (ex: São Paulo)
3. Deixe o nome padrão ou escolha um nome
4. Clique em "Create"

### Passo 3: Obter credenciais
1. Clique no banco criado
2. Vá na aba "Details"
3. Copie:
   - **REST URL**: `https://your-db.upstash.io`
   - **REST Token**: `your-token-here`

### Passo 4: Configurar no projeto
Execute: `npm run setup-env` e cole as credenciais quando solicitado.

### Limites gratuitos:
- ✅ 10.000 requests/dia
- ✅ 256MB de memória
- ✅ Sem expiração
- ✅ Backup automático

---

## 🏠 REDIS LOCAL (DESENVOLVIMENTO)

### Windows:
1. Baixe Redis: https://github.com/microsoftarchive/redis/releases
2. Instale e execute
3. Redis rodará em: `localhost:6379`

### Docker (qualquer OS):
```bash
docker run -d -p 6379:6379 redis:alpine
```

### Configuração local:
```env
UPSTASH_REDIS_REST_URL=http://localhost:6379
UPSTASH_REDIS_REST_TOKEN=local-dev-token
```

---

## ☁️ OUTRAS OPÇÕES GRATUITAS

### Redis Cloud (30MB gratuito):
1. Acesse: https://redis.com/try-free/
2. Crie conta gratuita
3. Configure banco
4. Obtenha credenciais

### Railway (500MB gratuito):
1. Acesse: https://railway.app
2. Conecte GitHub
3. Deploy Redis
4. Obtenha URL de conexão

---

## 🔧 CONFIGURAÇÃO RÁPIDA

### Opção 1: Upstash (Recomendado)
```bash
# Execute o script de configuração
npm run setup-env

# Cole as credenciais do Upstash quando solicitado
```

### Opção 2: Redis Local
```bash
# Instale Redis localmente
# Configure no .env.local:
UPSTASH_REDIS_REST_URL=http://localhost:6379
UPSTASH_REDIS_REST_TOKEN=local-dev
```

### Opção 3: Sem Redis (Fallback)
```bash
# O sistema detectará automaticamente e usará cache em memória
# Funciona para desenvolvimento, mas não para produção
```

---

## ✅ VERIFICAÇÃO

Após configurar, teste:
```bash
npm run test-improvements-simple
```

Se aparecer "✅ Rate limiting configurado", está funcionando!
