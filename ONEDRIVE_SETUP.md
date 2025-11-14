# Configuração para Evitar Problemas com OneDrive

Este projeto está localizado em uma pasta sincronizada pelo OneDrive, o que pode causar problemas com arquivos temporários e de cache do Next.js.

## Solução Implementada

### 1. Script de Limpeza Automática

Foi criado um script `scripts/clean-next.js` que limpa a pasta `.next` de forma segura antes de executar `dev` ou `build`.

**Uso:**
```bash
npm run clean        # Limpa manualmente
npm run dev          # Limpa automaticamente antes de iniciar
npm run build        # Limpa automaticamente antes de buildar
```

### 2. Arquivo .onedriveignore

Foi criado um arquivo `.onedriveignore` na raiz do projeto para instruir o OneDrive a não sincronizar certas pastas.

**Nota:** O OneDrive não suporta nativamente `.onedriveignore`, mas você pode usar ferramentas de terceiros ou configurar manualmente.

### 3. Configuração Manual do OneDrive (Recomendado)

Para evitar completamente os problemas, configure o OneDrive para **não sincronizar** a pasta `.next`:

#### Opção A: Excluir pasta específica do OneDrive
1. Clique com o botão direito no ícone do OneDrive na bandeja do sistema
2. Vá em **Configurações** > **Conta** > **Escolher pastas**
3. Desmarque a pasta `.next` se ela aparecer na lista

#### Opção B: Mover projeto para fora do OneDrive (Melhor Solução)
Considere mover o projeto para uma pasta local que não seja sincronizada pelo OneDrive, como:
- `C:\dev\comunidade`
- `C:\projetos\comunidade`
- `D:\dev\comunidade`

### 4. Alternativa: Usar WSL ou Git Bash

Se você usar WSL (Windows Subsystem for Linux) ou Git Bash, os comandos funcionarão normalmente sem problemas de sincronização do OneDrive.

## Problemas Comuns

### Erro: `EINVAL: invalid argument, readlink`
Este erro ocorre quando o OneDrive tenta sincronizar arquivos que estão sendo modificados pelo Next.js.

**Solução:**
1. Execute `npm run clean` antes de rodar comandos
2. Configure o OneDrive para não sincronizar `.next`
3. Ou mova o projeto para fora do OneDrive

### Build falha no Vercel mas funciona localmente
Isso geralmente não está relacionado ao OneDrive, mas sim a diferenças de ambiente. Verifique:
- Variáveis de ambiente no Vercel
- Versões de Node.js
- Dependências faltando

## Comandos Úteis

```bash
# Limpar cache manualmente
npm run clean

# Desenvolvimento (limpa automaticamente)
npm run dev

# Build para produção (limpa automaticamente)
npm run build

# Verificar se .next está sendo sincronizado
# (verifique no OneDrive se a pasta aparece)
```

## Recomendação Final

**Para desenvolvimento profissional, recomenda-se:**
1. Mover o projeto para uma pasta fora do OneDrive
2. Usar apenas o Git para versionamento
3. Manter o OneDrive apenas para documentos e arquivos pessoais

Isso evita todos os problemas de sincronização e melhora significativamente a performance do desenvolvimento.

