# 🏔️ Identidade e Gamificação - Aldeia Singular

## 📖 Visão Geral

A **Aldeia Singular** possui uma identidade narrativa única baseada em **gamificação** com uma **metáfora de jornada e conquista**. O sistema transforma o aprendizado em uma **aventura épica** onde os usuários são **Aldeões** que trilham caminhos de conhecimento na **Montanha do Amanhã**.

---

## 🎯 Terminologia Específica

### **Personagens e Identidade:**
- **Aldeão**: O usuário/membro da comunidade
- **Mentora/Corujinha**: Assistente IA da plataforma
- **Aldeia Singular**: A comunidade de aprendizado

### **Geografia Narrativa:**
- **Montanha do Amanhã**: A jornada principal de aprendizado (programa principal)
- **Trilhas**: Caminhos de aprendizado específicos (cursos/módulos)
- **Marcos**: Pontos de conquista ao longo das trilhas
- **Bandeiras**: Simbolizam conquistas alcançadas

### **Ações Gamificadas:**
- **Fincar a bandeira**: Completar uma meta ou etapa
- **Trilhar**: Percorrer caminhos de aprendizado
- **Conquistar marcos**: Alcançar objetivos específicos
- **Expandir trilhas**: Adicionar novos conteúdos aos caminhos existentes

---

## 🎮 Sistema de Gamificação

### **Estrutura Hierárquica:**
```
Montanha do Amanhã (Programa Principal)
├── Trilhas (Cursos/Módulos)
│   ├── Módulos (Seções)
│   │   ├── Aulas (Conteúdo Individual)
│   │   └── Conteúdos (Livros, Vídeos, etc.)
│   └── Marcos Conquistados (Conquistas)
```

### **Progressão Visual:**
- **Bandeiras**: Representam conquistas alcançadas
- **Marcos**: Pontos específicos de progresso
- **Trilhas**: Caminhos visuais de aprendizado
- **Progresso**: Percentual de conclusão das trilhas

### **Evolução Contínua:**
- **Jornada Infinita**: A "Montanha do Amanhã" nunca acaba
- **Expansão Dinâmica**: Novos conteúdos adicionam novos caminhos
- **Crescimento Orgânico**: As trilhas crescem conforme novos materiais são adicionados

---

## 🗄️ Estrutura de Dados

### **Tabelas Principais:**

#### **Montanhas (Programas)**
```sql
mountains (
  id, slug, title, description, cover_url, position, published_at
)
```

#### **Trilhas (Cursos)**
```sql
trails (
  id, mountain_id, slug, title, description, cover_url, position
)
```

#### **Módulos (Seções)**
```sql
modules (
  id, trail_id, slug, title, description, cover_url, position
)
```

#### **Aulas (Conteúdo)**
```sql
lessons (
  id, module_id, slug, title, description, video_url, duration_seconds, position
)
```

#### **Progresso do Usuário**
```sql
progress (
  user_id, lesson_id, completed, watched_seconds, updated_at
)
```

#### **Progresso Avançado (user_progress)**
```sql
user_progress (
  user_id, content_id, completion_percentage, is_completed, updated_at
)
```

---

## 🎨 Identidade Visual

### **Cores da Marca:**
- **Laranja Principal**: `#FF6B00` (cor oficial da marca)
- **Roxo de Acento**: `#43085E` (destaques e elementos especiais)
- **Azul**: `#0A2540` (textos e elementos secundários)

### **Elementos Visuais:**
- **Coruja**: Mascote da plataforma (Mentora/IA)
- **Montanhas**: Representação visual das trilhas
- **Bandeiras**: Ícones de conquista
- **Gradientes**: Transições suaves entre seções

### **Tipografia:**
- **Fonte Principal**: Inter (toda a aplicação)
- **Fonte Display**: Sora (títulos e destaques)

---

## 🚀 Implementações Atuais

### **Dashboard:**
- **Seção "Novidades"**: Últimos conteúdos postados
- **Seção "Continue de onde parou"**: Progresso do usuário
- **Badges por Origem**: Montanha do Amanhã, Acervo Digital, etc.

### **Sistema de Progresso:**
- **ProgressCard**: Componente para exibir progresso
- **user_progress**: Tabela com percentual de conclusão
- **Continue Assistindo**: Página com conteúdos iniciados

### **Navegação:**
- **Rail**: Navegação lateral com ícones
- **MobileMenu**: Menu responsivo para mobile
- **Badges**: Identificação visual de origem do conteúdo

---

## 🎯 Oportunidades de Implementação

### **Sistema de Conquistas:**
- [ ] **Marcos Visuais**: Bandeiras animadas ao completar etapas
- [ ] **Badges de Conquista**: Sistema de recompensas visuais
- [ ] **Progressão de Nível**: Sistema de experiência do Aldeão

### **Gamificação Avançada:**
- [ ] **Mapa da Montanha**: Visualização 3D das trilhas
- [ ] **Expedições**: Desafios especiais e eventos
- [ ] **Coleção de Conquistas**: Galeria de marcos alcançados

### **Social e Comunidade:**
- [ ] **Ranking de Aldeões**: Classificação por progresso
- [ ] **Expedições em Grupo**: Desafios colaborativos
- [ ] **Compartilhamento de Conquistas**: Rede social de progresso

---

## 📝 Diretrizes de Conteúdo

### **Tom de Voz:**
- **Acolhedor**: Como uma comunidade que recebe novos membros
- **Motivador**: Incentivando a jornada de aprendizado
- **Épico**: Transformando o aprendizado em aventura
- **Inclusivo**: Linguagem acessível e acolhedora

### **Exemplos de Frases:**
- "Bem-vindo, Aldeão! Sua jornada na Montanha do Amanhã começa aqui."
- "Parabéns! Você fincou sua bandeira neste marco importante."
- "Nova trilha descoberta! Continue explorando a Montanha do Amanhã."
- "Sua expedição de aprendizado continua com novos caminhos."

---

## 🔧 Implementação Técnica

### **Componentes Existentes:**
- `ProgressCard`: Exibição de progresso
- `Badge`: Identificação de origem
- `ContentCarousel`: Navegação de conteúdo
- `HeroCarousel`: Destaque de conteúdo principal

### **APIs e Integrações:**
- **Supabase**: Banco de dados principal
- **Sistema de Progresso**: Tracking de conclusão
- **Notificações**: Alertas de novos conteúdos
- **IA (Mentora)**: Assistente inteligente

---

## 📚 Referências e Inspiração

### **Conceitos Base:**
- **Gamificação Educacional**: Transformar aprendizado em jogo
- **Jornada do Herói**: Estrutura narrativa de progressão
- **Comunidade de Aprendizado**: Aprendizado colaborativo
- **Educação Continuada**: Aprendizado ao longo da vida

### **Metáforas Utilizadas:**
- **Montanha**: Desafio e conquista
- **Trilha**: Caminho de aprendizado
- **Bandeira**: Marco de conquista
- **Aldeia**: Comunidade acolhedora

---

## 🎯 Próximos Passos

1. **Implementar Sistema de Marcos**: Criar visualizações de conquistas
2. **Desenvolver Mapa da Montanha**: Interface visual das trilhas
3. **Criar Sistema de Badges**: Recompensas por progresso
4. **Implementar Ranking**: Gamificação social
5. **Desenvolver Expedições**: Desafios especiais

---

*Documentação criada em: Dezembro 2024*  
*Versão: 1.0*  
*Última atualização: Implementação inicial da gamificação*
