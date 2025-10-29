# 🔔 Sistema de Notificações - Implementação Completa

## 📋 Visão Geral

Sistema completo de notificações implementado com persistência no banco de dados Supabase, sincronização em tempo real, e integração completa com a aplicação.

## 🚀 Funcionalidades Implementadas

### ✅ Persistência no Banco de Dados
- **Tabela `notifications`** no Supabase com todas as colunas necessárias
- **RLS (Row Level Security)** configurado para segurança
- **Índices otimizados** para consultas rápidas
- **Funções stored procedures** para operações comuns

### ✅ API REST Completa
- **GET** `/api/notifications` - Listar notificações (com filtros)
- **POST** `/api/notifications` - Criar nova notificação
- **PATCH** `/api/notifications` - Atualizar notificação (marcar como lida)
- **DELETE** `/api/notifications` - Remover notificação

### ✅ Sincronização em Tempo Real
- **Supabase Realtime** configurado para atualizações instantâneas
- **Atualizações automáticas** quando notificações são criadas/modificadas
- **Sincronização multi-dispositivo** automática

### ✅ Componentes e Hooks
- **NotificationProvider** - Context provider com estado global
- **NotificationBell** - Componente de sino com contador
- **NotificationCard** - Card individual de notificação
- **NotificationList** - Lista de notificações com scroll
- **useNotifications** - Hook principal para usar notificações
- **useNotificationHelpers** - Hook com métodos helper simplificados

### ✅ Funções Utilitárias
- **Criação automática** de notificações baseadas em eventos
- **Templates pré-configurados** para eventos comuns
- **TypeScript** completo com tipos seguros

## 🗄️ Estrutura do Banco de Dados

### Tabela `notifications`

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'progress')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  action_text TEXT,
  progress INTEGER CHECK (progress >= 0 AND progress <= 100),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Índices Criados
- `idx_notifications_user_id` - Para filtrar por usuário
- `idx_notifications_read` - Para filtrar por status de leitura
- `idx_notifications_created_at` - Para ordenação por data
- `idx_notifications_user_unread` - Índice composto otimizado

## 📱 Como Usar

### 1. Usando o Hook Básico

```tsx
import { useNotifications } from "@/components/ui/NotificationSystem";

function MyComponent() {
  const { addNotification, notifications, unreadCount } = useNotifications();

  const handleAction = async () => {
    await addNotification({
      title: "Ação Concluída",
      message: "Sua ação foi realizada com sucesso",
      type: "success",
      actionUrl: "/dashboard",
      actionText: "Ver Dashboard",
    });
  };

  return (
    <div>
      <p>Notificações não lidas: {unreadCount}</p>
      <button onClick={handleAction}>Executar Ação</button>
    </div>
  );
}
```

### 2. Usando Helpers Simplificados

```tsx
import { useNotificationHelpers } from "@/hooks/useNotificationHelpers";

function MyComponent() {
  const {
    notifySuccess,
    notifyError,
    notifyLessonCompleted,
    notifyProgressUpdate,
  } = useNotificationHelpers();

  const handleLessonComplete = async () => {
    await notifyLessonCompleted(
      "Aspectos Cognitivos - Aula 01",
      "Aspectos Cognitivos",
      "Identificação"
    );
  };

  const handleError = async () => {
    await notifyError(
      "Erro no Vídeo",
      "Não foi possível carregar o vídeo",
      {
        actionUrl: "/support",
        actionText: "Obter Ajuda",
      }
    );
  };

  return (
    <div>
      <button onClick={handleLessonComplete}>Completar Aula</button>
      <button onClick={handleError}>Simular Erro</button>
    </div>
  );
}
```

### 3. Usando Funções Utilitárias

```tsx
import { createLessonCompletedNotification } from "@/lib/notificationUtils";
import { useNotifications } from "@/components/ui/NotificationSystem";

function MyComponent() {
  const { addNotification } = useNotifications();

  const handleLessonComplete = async () => {
    const notification = createLessonCompletedNotification(
      "Aula sobre Aspectos Cognitivos",
      "Aspectos Cognitivos",
      "Identificação"
    );
    await addNotification(notification);
  };

  return <button onClick={handleLessonComplete}>Completar</button>;
}
```

## 🎯 Tipos de Notificação Disponíveis

### Tipos Básicos
- **info** - Informações gerais
- **success** - Sucesso/ações concluídas
- **warning** - Avisos importantes
- **error** - Erros e problemas
- **progress** - Atualizações de progresso

### Funções Utilitárias Disponíveis

```typescript
// Eventos de Conteúdo
createLessonCompletedNotification(lessonName, moduleName?, trailName?)
createModuleCompletedNotification(moduleName, trailName?)
createTrailCompletedNotification(trailName)
createNewContentNotification(contentType, name, url?)

// Progresso
createProgressNotification(progress, trailName?, message?)

// Conquistas
createAchievementNotification(achievementName, description?)

// Outros
createLockedContentNotification(contentType, name, requirements?)
createStudyReminderNotification(trailName, pendingLessons?)
createRatingNotification(lessonName, rating)
createErrorNotification(title, message, actionUrl?, actionText?)
createSyncNotification(success, message?)
```

## 🔄 Sincronização em Tempo Real

O sistema utiliza Supabase Realtime para sincronização automática:

```typescript
// Configurado automaticamente no NotificationProvider
useEffect(() => {
  const supabase = createClient();
  
  const channel = supabase
    .channel("notifications-changes")
    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "notifications",
    }, (payload) => {
      fetchNotifications(); // Recarrega automaticamente
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

## 🛡️ Segurança

### Row Level Security (RLS)
- Usuários só podem ver suas próprias notificações
- Usuários só podem atualizar suas próprias notificações
- Usuários só podem deletar suas próprias notificações
- Inserções podem ser feitas via API com autenticação

### Validações
- Tipo de notificação validado no banco
- Progresso entre 0-100
- User ID sempre validado
- Timestamps automáticos

## 📊 Performance

### Otimizações Implementadas
- **Índices compostos** para consultas frequentes
- **Paginação** via query parameter `limit`
- **Atualizações otimistas** para melhor UX
- **Cache local** com sincronização com servidor
- **Lazy loading** de notificações antigas

### Queries Otimizadas
```sql
-- Buscar notificações não lidas (índice otimizado)
SELECT * FROM notifications 
WHERE user_id = $1 AND read = FALSE 
ORDER BY created_at DESC 
LIMIT 50;

-- Contar não lidas (índice otimizado)
SELECT COUNT(*) FROM notifications 
WHERE user_id = $1 AND read = FALSE;
```

## 🧪 Testes

### Testar Notificações Manualmente

1. **Via API:**
```bash
# Criar notificação
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste",
    "message": "Mensagem de teste",
    "type": "info"
  }'
```

2. **Via Hook:**
```tsx
const { addNotification } = useNotifications();
await addNotification({
  title: "Teste",
  message: "Testando notificação",
  type: "success",
});
```

3. **Via Helpers:**
```tsx
const { notifySuccess } = useNotificationHelpers();
await notifySuccess("Sucesso!", "Operação concluída");
```

## 📝 Migration

Para aplicar a migration no Supabase:

```bash
# Aplicar migration
supabase migration up

# Ou via SQL direto
psql -h [host] -U [user] -d [database] -f supabase/migrations/014_create_notifications_table.sql
```

## 🚀 Próximos Passos Sugeridos

1. **Push Notifications** - Notificações do navegador
2. **Email Notifications** - Envio de emails para notificações importantes
3. **Filtros Avançados** - Filtrar por tipo, data, metadata
4. **Agrupamento** - Agrupar notificações similares
5. **Preferências** - Permitir usuários configurar quais notificações querem receber
6. **Analytics** - Métricas de engajamento e taxa de leitura

## 📚 Referências

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase API Docs](https://supabase.com/docs/reference/javascript/select)

---

**Sistema implementado e pronto para uso!** 🎉
