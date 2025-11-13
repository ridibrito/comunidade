# Configuração do Google Gemini

## Como obter a chave da API do Gemini

1. Acesse o [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Get API Key" ou "Criar chave de API"
4. Se solicitado, selecione ou crie um projeto do Google Cloud
5. Copie a chave gerada (começa com "AIza...")

## Configurar a variável de ambiente

Adicione a chave no arquivo `.env.local` na raiz do projeto:

```env
GEMINI_API_KEY=sua-chave-aqui
```

**Importante:** 
- Nunca commite o arquivo `.env.local` no Git
- Mantenha sua chave segura e não a compartilhe publicamente
- A chave é necessária para que a IA funcione corretamente

## Após configurar

1. Reinicie o servidor de desenvolvimento (`npm run dev`)
2. A aplicação agora usará o Gemini ao invés do OpenAI
3. Teste enviando uma mensagem no chat da IA

## Modelo utilizado

O sistema está configurado para usar o modelo `gemini-pro` do Google Gemini.

