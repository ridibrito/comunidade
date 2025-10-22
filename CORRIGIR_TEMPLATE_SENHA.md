# 🔧 Corrigir Template para Mostrar Senha

## 🎯 **Problema Identificado:**
- ✅ **Email chegando** corretamente
- ❌ **Senha não aparece** no email
- ❌ **Template não acessa** `{{ .GeneratedPassword }}`

## 🔍 **Possíveis Causas:**

### **1. Variável Incorreta:**
O Supabase pode não estar passando a senha do metadata para o template.

### **2. Template Não Configurado:**
O template "Invite User" pode não estar configurado corretamente.

### **3. Metadata Não Acessível:**
O Supabase pode não expor o metadata no template.

## 🚀 **Soluções:**

### **Solução 1: Verificar Variáveis Disponíveis**

No template "Invite User", teste estas variáveis:

```html
<!-- Teste estas variáveis no template -->
<p>Email: {{ .Email }}</p>
<p>Nome: {{ .FullName }}</p>
<p>Senha 1: {{ .GeneratedPassword }}</p>
<p>Senha 2: {{ .Password }}</p>
<p>Senha 3: {{ .TempPassword }}</p>
<p>Senha 4: {{ .UserMetadata.GeneratedPassword }}</p>
<p>Senha 5: {{ .UserMetadata.generated_password }}</p>
<p>Senha 6: {{ .UserMetadata.TempPassword }}</p>
<p>Senha 7: {{ .UserMetadata.temp_password }}</p>
```

### **Solução 2: Template Simples para Teste**

Use este template simples para testar:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Bem-vindo à Aldeia Singular</title>
</head>
<body>
    <h1>Bem-vindo à Aldeia Singular!</h1>
    
    <p>Olá {{ .FullName }}!</p>
    
    <h2>Suas Credenciais:</h2>
    <p><strong>Email:</strong> {{ .Email }}</p>
    
    <!-- Teste todas as variáveis possíveis -->
    <p><strong>Senha 1:</strong> {{ .GeneratedPassword }}</p>
    <p><strong>Senha 2:</strong> {{ .Password }}</p>
    <p><strong>Senha 3:</strong> {{ .TempPassword }}</p>
    <p><strong>Senha 4:</strong> {{ .UserMetadata.GeneratedPassword }}</p>
    <p><strong>Senha 5:</strong> {{ .UserMetadata.generated_password }}</p>
    
    <p>Clique no link para acessar: {{ .ConfirmationURL }}</p>
    
    <p>Obrigado!</p>
</body>
</html>
```

### **Solução 3: Abordagem Alternativa**

Se nenhuma variável funcionar, podemos:

1. **Usar Edge Function** para envio de email personalizado
2. **Incluir senha no corpo do email** de outra forma
3. **Usar template personalizado** com Resend

## 🔧 **Passos para Corrigir:**

### **1. Testar Variáveis:**
1. Acesse o Supabase Dashboard
2. Vá para **Authentication** → **Email Templates**
3. Selecione **"Invite user"**
4. Use o template simples acima
5. Teste criando um novo usuário

### **2. Verificar Resultado:**
- Crie um usuário de teste
- Verifique qual variável mostra a senha
- Use a variável que funcionar

### **3. Implementar Solução:**
- Configure o template final com a variável correta
- Teste com usuário real

## 📋 **Próximos Passos:**

1. **Teste o template simples** com todas as variáveis
2. **Identifique qual variável** mostra a senha
3. **Configure o template final** com a variável correta
4. **Teste com usuário real**

**Teste o template simples e me informe qual variável mostra a senha!** 🚀
