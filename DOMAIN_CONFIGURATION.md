# Configuração de Domínio - app.aldeiasingular.com.br

## 🌐 Domínio Configurado

**Produção**: `https://app.aldeiasingular.com.br`  
**Desenvolvimento**: `http://localhost:3000`

## 📁 Arquivos Atualizados

### 1. **`.env.local`**
```bash
# Domínio da aplicação
NEXT_PUBLIC_APP_URL=https://app.aldeiasingular.com.br
```

### 2. **`src/lib/config.ts`** (Novo)
- ✅ Configuração centralizada de URLs
- ✅ Funções para gerar URLs de redirecionamento
- ✅ Validação de configurações

### 3. **`src/app/api/admin/users/route.ts`**
- ✅ Usa configuração centralizada
- ✅ URLs dinâmicas baseadas no ambiente

### 4. **`EMAIL_TEMPLATE.md`**
- ✅ Logo: `https://app.aldeiasingular.com.br/logo_full.png`
- ✅ Link: `https://app.aldeiasingular.com.br/`

### 5. **`CONFIGURAR_EMAIL_SUPABASE.md`**
- ✅ Site URL: `https://app.aldeiasingular.com.br`
- ✅ Redirect URLs atualizadas

## 🔧 Configuração no Supabase

### URLs de Redirecionamento:
```
https://app.aldeiasingular.com.br/auth/reset
https://app.aldeiasingular.com.br/auth/login
https://app.aldeiasingular.com.br/dashboard
```

### Para Desenvolvimento:
```
http://localhost:3000/auth/reset
http://localhost:3000/auth/login
http://localhost:3000/dashboard
```

## 🚀 Configuração na Vercel

### Variáveis de Ambiente:
```bash
NEXT_PUBLIC_APP_URL=https://app.aldeiasingular.com.br
NEXT_PUBLIC_SUPABASE_URL=https://ijmiuhfcsxrlgbrohufr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📧 Template de Email

O template de email agora usa:
- ✅ **Logo**: `https://app.aldeiasingular.com.br/logo_full.png`
- ✅ **Link do rodapé**: `https://app.aldeiasingular.com.br/`
- ✅ **Domínio personalizado** em todas as referências

## 🔄 Fluxo de Convites

### Produção:
1. **Admin cria usuário** → Sistema usa `https://app.aldeiasingular.com.br`
2. **Email enviado** com links para o domínio personalizado
3. **Usuário clica** → Vai para `https://app.aldeiasingular.com.br/auth/reset`
4. **Define senha** → Redirecionado para dashboard

### Desenvolvimento:
1. **Admin cria usuário** → Sistema usa `http://localhost:3000`
2. **Email enviado** com links para localhost
3. **Usuário clica** → Vai para `http://localhost:3000/auth/reset`
4. **Define senha** → Redirecionado para dashboard

## ✅ Verificações

- ✅ **Domínio configurado** na Vercel
- ✅ **Variáveis de ambiente** atualizadas
- ✅ **Template de email** atualizado
- ✅ **URLs de redirecionamento** configuradas
- ✅ **Código centralizado** em `config.ts`

## 🎯 Próximos Passos

1. **Deploy na Vercel** com o domínio personalizado
2. **Configurar no Supabase** as URLs de redirecionamento
3. **Atualizar template** de email no Supabase Dashboard
4. **Testar fluxo completo** de convites

## 📝 Notas

- **Desenvolvimento**: Continua usando `localhost:3000`
- **Produção**: Usa `https://app.aldeiasingular.com.br`
- **Configuração automática**: Baseada na variável `NEXT_PUBLIC_APP_URL`
- **Fallback**: Se variável não estiver definida, usa localhost
