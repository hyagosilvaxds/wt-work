# Sistema de Histórico do Aluno

Este módulo implementa um sistema completo para visualização do histórico acadêmico dos alunos, baseado na API de histórico do aluno.

## Funcionalidades Implementadas

### 1. Botão de Histórico na Página de Alunos
- **Localização**: Dropdown menu de ações de cada aluno na tabela
- **Ícone**: History (relógio) para fácil identificação
- **Acesso**: Primeiro item do menu, destacando sua importância

### 2. Modal de Histórico (`student-history-modal.tsx`)

#### 2.1 Estrutura em Abas
- **Aba "Histórico de Turmas"**: Lista detalhada de todas as turmas
- **Aba "Estatísticas"**: Métricas e indicadores de desempenho

#### 2.2 Sistema de Filtros Avançados
- **Busca por texto**: Treinamento, instrutor, empresa ou localização
- **Filtro por status**: EM_ABERTO, EM_ANDAMENTO, CONCLUIDA, CANCELADA, SUSPENSA
- **Filtro por período**: Data de início e fim personalizáveis
- **Filtros dinâmicos**: Aplicação automática ao alterar valores

#### 2.3 Cards de Resumo
- **Total de Turmas**: Contador geral de participações
- **Turmas Concluídas**: Indicador de sucesso (cor verde)
- **Turmas Ativas**: Indicador de andamento (cor azul)
- **Total de Certificados**: Conquistas do aluno (cor amarela)

### 3. Detalhamento de Turmas

#### 3.1 Informações Principais
- **Nome do treinamento** como título principal
- **Período**: Data de início e fim formatadas
- **Instrutor responsável** com nome completo
- **Localização** quando disponível
- **Status visual** com badges coloridos por categoria
- **Tipo de turma** (CURSO, RECICLAGEM, etc.)

#### 3.2 Seções Organizadas

##### Detalhes do Treinamento
- ✅ Carga horária total
- ✅ Período de validade do certificado
- ✅ Empresa contratante
- ✅ Responsável técnico (quando aplicável)

##### Sistema de Notas
- ✅ Nota prática (0-10)
- ✅ Nota teórica (0-10)
- ✅ Observações do avaliador
- ✅ Data e responsável pela avaliação

##### Frequência Visual
- ✅ Ícones visuais para cada aula:
  - 🟢 CheckCircle = Presente
  - 🔴 XCircle = Ausente  
  - 🟡 Clock = Outro status
- ✅ Contador total de aulas
- ✅ Visualização limitada (10 ícones + contador)
- ✅ Tooltip com detalhes da aula

##### Certificações
- ✅ Lista de certificados emitidos
- ✅ Código de validação único
- ✅ Data de emissão
- ✅ Status de bloqueios (se houver)

#### 3.3 Observações da Turma
- ✅ Campo destacado em cinza claro
- ✅ Observações gerais sobre a turma
- ✅ Preservação de quebras de linha

### 4. Aba de Estatísticas

#### 4.1 Métricas Principais (Cards)
- **Taxa de Frequência**: Percentual de presença geral
- **Aulas Frequentadas**: Contador fracional (presentes/total)
- **Horas Concluídas**: Total de horas de treinamento
- **Certificados**: Total de certificações obtidas

#### 4.2 Desempenho Acadêmico
- **Média Prática**: Valor numérico + barra de progresso
- **Média Teórica**: Valor numérico + barra de progresso  
- **Taxa de Frequência**: Percentual + barra de progresso
- **Cores diferenciadas**: Azul, verde e roxo para distinção

#### 4.3 Resumo Geral
- ✅ Data de matrícula do aluno
- ✅ Contadores detalhados (turmas, aulas, horas)
- ✅ Indicadores coloridos para destaque
- ✅ Layout organizado em duas colunas

## Estrutura da API Integrada

### Endpoints Utilizados
- `GET /students/{studentId}/history` - Histórico completo com filtros
- `GET /students/{studentId}/statistics` - Estatísticas resumidas
- `GET /students/{studentId}/history/class/{classId}` - Detalhes de turma específica

### Filtros Implementados
```typescript
interface StudentHistoryFilters {
  status?: 'EM_ABERTO' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA' | 'SUSPENSA'
  startDate?: string // YYYY-MM-DD
  endDate?: string   // YYYY-MM-DD
  trainingId?: string
  instructorId?: string
  includeInactive?: boolean
}
```

### Interfaces TypeScript Completas
- ✅ `StudentHistoryResponseDto` - Resposta principal
- ✅ `StudentHistoryClassDto` - Dados de cada turma
- ✅ `StudentStatistics` - Métricas estatísticas
- ✅ `StudentGrade` - Sistema de notas
- ✅ `LessonAttendance` - Controle de frequência
- ✅ `Certificate` - Certificados emitidos
- ✅ `CertificateBlock` - Bloqueios de certificado

## Recursos Visuais

### Sistema de Cores
- **Verde**: Sucesso, conclusão, aprovação
- **Azul**: Andamento, ativo, processos
- **Amarelo**: Certificados, conquistas
- **Vermelho**: Cancelado, ausente, bloqueios
- **Roxo**: Horas, tempo, duração
- **Cinza**: Neutro, inativo, informativo

### Badges de Status
```typescript
const STATUS_COLORS = {
  'EM_ABERTO': 'bg-gray-100 text-gray-800',
  'EM_ANDAMENTO': 'bg-blue-100 text-blue-800', 
  'CONCLUIDA': 'bg-green-100 text-green-800',
  'CANCELADA': 'bg-red-100 text-red-800',
  'SUSPENSA': 'bg-yellow-100 text-yellow-800'
}
```

### Ícones Lucide React
- 📚 **BookOpen**: Treinamentos e turmas
- 📊 **BarChart3**: Estatísticas e métricas
- 🎯 **Target**: Frequência e objetivos
- 🎓 **GraduationCap**: Notas e avaliações
- 🏆 **Award**: Certificados e conquistas
- 📅 **Calendar**: Datas e períodos
- 👤 **User**: Instrutores e pessoas
- 📍 **MapPin**: Localização
- ⏰ **Clock**: Tempo e duração
- 📈 **TrendingUp**: Crescimento e progresso

## Tratamento de Erros

### Estados de Loading
- ✅ Spinner durante carregamento inicial
- ✅ Estados separados para histórico e estatísticas
- ✅ Feedback visual durante filtros

### Empty States
- ✅ Mensagem personalizada quando sem dados
- ✅ Orientação sobre filtros ativos
- ✅ Ícone representativo para contexto

### Tratamento de API
- ✅ Try/catch em todas as requisições
- ✅ Toast notifications para erros
- ✅ Logs detalhados no console
- ✅ Fallbacks para dados indisponíveis

## Responsividade

### Layout Adaptativo
- **Desktop**: Grid de 3-4 colunas nos cards
- **Tablet**: Grid de 2 colunas
- **Mobile**: Layout em coluna única
- **Modal**: Scroll vertical em telas pequenas

### Componentes Flexíveis
- ✅ Cards de estatísticas responsivos
- ✅ Filtros em grid adaptativo
- ✅ Tabelas com scroll horizontal
- ✅ Modal com altura máxima controlada

## Como Usar

### 1. Acessar Histórico do Aluno
1. Vá para a página "Alunos" no menu lateral
2. Localize o aluno desejado na tabela
3. Clique no botão de ações (três pontos) na linha do aluno
4. Selecione "Histórico" (primeiro item do menu)

### 2. Navegar pelas Abas
- **Histórico de Turmas**: Visualização detalhada de participações
- **Estatísticas**: Métricas e indicadores de desempenho

### 3. Aplicar Filtros
- **Campo de busca**: Digite termos para busca textual
- **Status**: Selecione status específico das turmas
- **Datas**: Defina período de interesse
- **Aplicação automática**: Filtros aplicados em tempo real

### 4. Interpretar Informações

#### Badges de Status
- 🔴 **Cancelada/Suspensa**: Turma não concluída
- 🟡 **Em Aberto**: Aguardando início
- 🔵 **Em Andamento**: Turma ativa
- 🟢 **Concluída**: Turma finalizada com sucesso

#### Ícones de Frequência
- ✅ **Verde**: Presente na aula
- ❌ **Vermelho**: Ausente da aula
- ⏰ **Amarelo**: Outros status (atraso, etc.)

#### Indicadores de Performance
- **Barras de progresso**: Representam percentuais (0-100%)
- **Cores**: Verde = bom, azul = neutro, vermelho = atenção

## Benefícios do Sistema

### Para Gestores
- ✅ **Visão completa** do histórico acadêmico
- ✅ **Métricas de desempenho** para análise
- ✅ **Filtros avançados** para consultas específicas
- ✅ **Dados organizados** para tomada de decisão

### Para Instrutores
- ✅ **Acompanhamento individual** do progresso
- ✅ **Histórico de notas** e avaliações
- ✅ **Controle de frequência** visual
- ✅ **Certificações obtidas** pelo aluno

### Para Auditoria
- ✅ **Rastreabilidade completa** das atividades
- ✅ **Dados estruturados** para relatórios
- ✅ **Histórico preservado** com timestamps
- ✅ **Certificados validáveis** com códigos únicos

---

**Status**: ✅ Implementação completa e funcional  
**Integração**: ✅ Totalmente integrado à página de alunos  
**API**: ✅ Consumo completo da documentação fornecida  
**Última atualização**: 22/07/2025
