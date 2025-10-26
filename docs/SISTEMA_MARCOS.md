# 🏔️ Sistema de Marcos - Gamificação

## 📖 Visão Geral

O **Sistema de Marcos** é a implementação da gamificação da Aldeia Singular, onde cada módulo conquistado gera um **marco** (bandeira) que representa o progresso do Aldeão na trilha de aprendizado.

---

## 🎯 Como Funciona

### **Conquista de Marcos:**
- **Trigger**: Quando um módulo é completado (100% de progresso)
- **Automático**: Sistema detecta automaticamente a conclusão
- **Visual**: Bandeira dourada aparece no lugar da bandeira cinza
- **Persistente**: Marcos são salvos no banco de dados

### **Estrutura de Dados:**
```sql
marcos_conquistados (
  user_id,      -- Usuário que conquistou
  module_id,    -- Módulo completado
  trail_id,     -- Trilha do módulo
  conquered_at  -- Data da conquista
)
```

---

## 🧩 Componentes

### **1. MarcosConquistados**
Exibe as bandeiras (marcos) de uma trilha.

```tsx
import { MarcosConquistados } from '@/components/ui/MarcosConquistados';

<MarcosConquistados 
  marcos={marcos}
  size="md"           // sm, md, lg
  showLabels={true}   // Mostrar tooltips
  className="justify-center"
/>
```

### **2. ProgressoMarcos**
Barra de progresso dos marcos conquistados.

```tsx
import { ProgressoMarcos } from '@/components/ui/MarcosConquistados';

<ProgressoMarcos 
  conquistados={5}
  total={10}
  className="mb-4"
/>
```

### **3. CardComMarcos**
Card de conteúdo com overlay de marcos.

```tsx
import CardComMarcos from '@/components/ui/CardComMarcos';

<CardComMarcos 
  content={content}
  showMarcos={true}
  className="w-full"
/>
```

### **4. TrilhaComMarcos**
Componente completo para exibir trilha com marcos.

```tsx
import TrilhaComMarcos from '@/components/ui/TrilhaComMarcos';

<TrilhaComMarcos 
  trailId="trail-uuid"
  trailTitle="Nome da Trilha"
  showProgress={true}
  showAnimation={true}
/>
```

---

## 🎮 Hook useMarcos

Hook para gerenciar marcos de uma trilha.

```tsx
import { useMarcos } from '@/hooks/useMarcos';

const { 
  marcos,           // Lista de marcos
  loading,          // Estado de carregamento
  error,            // Erro se houver
  conquistados,     // Número de marcos conquistados
  total,            // Total de marcos
  conquistarMarco,  // Função para conquistar marco
  refreshMarcos     // Função para recarregar
} = useMarcos(trailId);
```

---

## 🎨 Animações

### **MarcoConquistado**
Animação fullscreen para conquista de marco.

```tsx
import { MarcoConquistado, useMarcoConquistado } from '@/components/ui/animations/MarcoConquistado';

const { showAnimation, animationTitle, triggerConquest, handleComplete } = useMarcoConquistado();

<MarcoConquistado 
  isVisible={showAnimation}
  title={animationTitle}
  onComplete={handleComplete}
/>
```

### **MarcoToast**
Notificação toast para conquista.

```tsx
import { MarcoToast } from '@/components/ui/animations/MarcoConquistado';

<MarcoToast 
  title="Nome do Marco"
  isVisible={showToast}
  onClose={() => setShowToast(false)}
/>
```

---

## 🗄️ Banco de Dados

### **Migração:**
Execute o arquivo `supabase/migrations/001_create_marcos_system.sql` para criar:
- Tabela `marcos_conquistados`
- Triggers automáticos
- Funções de consulta
- Views de estatísticas

### **Funções Disponíveis:**
```sql
-- Buscar marcos de uma trilha
get_marcos_trilha(user_id, trail_id)

-- Buscar progresso de marcos
get_progresso_marcos(user_id, trail_id)

-- Estatísticas de marcos
v_marcos_stats
```

---

## 🚀 Implementação

### **1. No HeroCarousel:**
```tsx
// HeroCarousel.tsx já implementado
const { marcos, conquistados, total } = useMarcos(currentHero?.trail_id);

// Marcos aparecem automaticamente abaixo do título
```

### **2. Nos Cards de Conteúdo:**
```tsx
// Dashboard já usa CardComMarcos
<CardComMarcos 
  content={content}
  showMarcos={true}
  className="w-full"
/>
```

### **3. Em Páginas de Trilha:**
```tsx
// Exemplo de uso em página de trilha
<TrilhaComMarcos 
  trailId={trail.id}
  trailTitle={trail.title}
  showProgress={true}
  showAnimation={true}
/>
```

---

## 🎯 Estados Visuais

### **Bandeira Não Conquistada:**
- Cor: Cinza (`bg-gray-200`)
- Borda: Cinza (`border-gray-300`)
- Efeito: Sem animação

### **Bandeira Conquistada:**
- Cor: Gradiente dourado (`from-yellow-400 to-yellow-600`)
- Borda: Dourada (`border-yellow-500`)
- Efeito: Sombra dourada (`shadow-yellow-500/30`)
- Animação: Hover scale e pulse

---

## 📱 Responsividade

### **Tamanhos:**
- **sm**: `w-3 h-2` (mobile)
- **md**: `w-4 h-3` (tablet)
- **lg**: `w-6 h-4` (desktop)

### **Espaçamento:**
- **sm**: `gap-1`
- **md**: `gap-1.5`
- **lg**: `gap-2`

---

## 🔧 Customização

### **Cores Personalizadas:**
```tsx
// No componente MarcosConquistados
const customColors = {
  conquered: "bg-gradient-to-br from-green-400 to-green-600",
  unconquered: "bg-gray-200"
};
```

### **Animações Personalizadas:**
```tsx
// No MarcoConquistado
const customAnimation = {
  duration: 5000,  // 5 segundos
  title: "Marco Especial!",
  showParticles: true
};
```

---

## 🐛 Debugging

### **Logs Úteis:**
```tsx
// No hook useMarcos
console.log('Marcos carregados:', marcos);
console.log('Progresso:', conquistados, '/', total);
```

### **Verificar Banco:**
```sql
-- Ver marcos de um usuário
SELECT * FROM marcos_conquistados WHERE user_id = 'user-uuid';

-- Ver progresso de uma trilha
SELECT * FROM get_progresso_marcos('user-uuid', 'trail-uuid');
```

---

## 🎯 Próximos Passos

1. **Implementar em todas as páginas de trilha**
2. **Adicionar sistema de ranking de marcos**
3. **Criar badges especiais para marcos raros**
4. **Implementar notificações push para conquistas**
5. **Adicionar sistema de recompensas por marcos**

---

*Documentação criada em: Dezembro 2024*  
*Versão: 1.0*  
*Sistema implementado e funcional*
