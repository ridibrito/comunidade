# 🔔 Sistema de Notificações e Toasts

## 📋 Visão Geral

Sistema moderno de notificações e toasts implementado com React, TypeScript e Tailwind CSS, inspirado no shadcn-ui.

## 🚀 Funcionalidades

### ✅ Notificações Persistentes
- **Sino de notificações** na navbar com contador de não lidas
- **Popover moderno** com lista de notificações
- **Tipos de notificação**: info, success, warning, error
- **Ações personalizadas** com links e botões
- **Marcar como lida** individual ou em massa
- **Remover notificações** individualmente

### 🍞 Toasts Temporários
- **Toasts automáticos** que desaparecem após 5 segundos
- **4 tipos**: success, error, warning, info
- **Animações suaves** de entrada e saída
- **Posicionamento fixo** no canto superior direito
- **Múltiplos toasts** simultâneos

### 🎯 Simulador Automático
- **Notificações automáticas** baseadas em eventos
- **Intervalo configurável** (30-60 segundos)
- **Cenários realistas** (novas aulas, lembretes, progresso)
- **Toasts combinados** com notificações

## 🛠️ Componentes Criados

### Core Components
- `Toast.tsx` - Componente individual de toast
- `ToastContainer.tsx` - Container para múltiplos toasts
- `Popover.tsx` - Popover reutilizável
- `NotificationSystem.tsx` - Sistema completo de notificações
- `Switch.tsx` - Switch toggle
- `Textarea.tsx` - Textarea component

### Hooks
- `useToast.ts` - Hook para gerenciar toasts
- `useNotificationSimulator.ts` - Simulador automático

### Providers
- `ToastProvider.tsx` - Provider global para toasts
- `NotificationProvider` - Provider para notificações

## 📱 Como Usar

### 1. Notificações
```tsx
import { useNotifications } from "@/components/ui/NotificationSystem";

const { addNotification } = useNotifications();

// Adicionar notificação
addNotification({
  title: "Nova Aula Disponível",
  message: "Aula sobre Aspectos Cognitivos foi publicada",
  type: "success",
  actionUrl: "/catalog/modulo/aspectos-cognitivos",
  actionText: "Assistir",
});
```

### 2. Toasts
```tsx
import { useToastContext } from "@/components/providers/ToastProvider";

const { success, error, warning, info } = useToastContext();

// Mostrar toast
success("Aula Concluída!", "Parabéns! Você completou a aula.");
error("Erro no Vídeo", "Não foi possível carregar o vídeo.");
```

### 3. Simulador
```tsx
import { useNotificationSimulator } from "@/hooks/useNotificationSimulator";

// Ativar simulador automático
useNotificationSimulator();
```

## 🎨 Design System

### Cores por Tipo
- **Success**: Verde (`text-green-500`, `bg-green-50`)
- **Error**: Vermelho (`text-red-500`, `bg-red-50`)
- **Warning**: Amarelo (`text-yellow-500`, `bg-yellow-50`)
- **Info**: Azul (`text-blue-500`, `bg-blue-50`)

### Animações
- **Entrada**: `translate-x-0 opacity-100`
- **Saída**: `translate-x-full opacity-0`
- **Duração**: `transition-all duration-300`

### Responsividade
- **Mobile**: Toasts em tela cheia
- **Desktop**: Popover posicionado
- **Tablet**: Adaptação automática

## 🔧 Configuração

### 1. Providers no Layout
```tsx
<ThemeProvider>
  <ToastProvider>
    <NotificationProvider>
      {/* App content */}
    </NotificationProvider>
  </ToastProvider>
</ThemeProvider>
```

### 2. Navbar com Sino
```tsx
import { NotificationBell } from "@/components/ui/NotificationSystem";

<NotificationBell />
```

### 3. Página de Teste
Acesse `/test-notifications` para testar todas as funcionalidades.

## 📊 Tipos de Notificação

### Notificações do Sistema
- **Nova Aula**: Quando uma aula é publicada
- **Lembrete**: Eventos e compromissos
- **Progresso**: Atualizações de progresso
- **Material**: Novos recursos disponíveis
- **Sistema**: Atualizações da plataforma

### Toasts de Ação
- **Sucesso**: Operações concluídas
- **Erro**: Falhas e problemas
- **Aviso**: Alertas importantes
- **Info**: Informações gerais

## 🎯 Casos de Uso

### 1. Nova Aula Publicada
```tsx
addNotification({
  title: "Nova Aula Disponível",
  message: "Aula sobre 'Aspectos Cognitivos' está disponível",
  type: "success",
  actionUrl: "/catalog/modulo/aspectos-cognitivos",
  actionText: "Assistir",
});
```

### 2. Progresso Atualizado
```tsx
success("Aula Concluída!", "Você completou 75% do módulo");
```

### 3. Erro no Sistema
```tsx
error("Erro no Vídeo", "Não foi possível carregar o vídeo. Tente novamente.");
```

## 🔄 Estado e Persistência

### Notificações
- **Estado local** no contexto React
- **Persistência** durante a sessão
- **Limpeza automática** ao fechar

### Toasts
- **Temporários** (5 segundos)
- **Auto-remoção** após duração
- **Múltiplos** simultâneos

## 🚀 Próximos Passos

1. **Persistência no banco** - Salvar notificações no Supabase
2. **Push notifications** - Notificações do navegador
3. **Email integration** - Envio de emails
4. **Templates** - Templates personalizáveis
5. **Analytics** - Métricas de engajamento

## 🎨 Inspiração

Baseado no **shadcn-ui** com:
- Design system consistente
- Acessibilidade (ARIA)
- Animações suaves
- Responsividade
- Dark mode support

---

**Sistema implementado com sucesso!** 🎉
