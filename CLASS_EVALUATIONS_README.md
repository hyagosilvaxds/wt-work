# Sistema de Avaliações de Turmas

## 📋 Visão Geral

O sistema de avaliações permite que os alunos avaliem aspectos das turmas de treinamento através de notas de 1 a 5 estrelas em diferentes categorias. Os administradores podem gerenciar essas avaliações e visualizar estatísticas detalhadas.

## ⭐ Categorias de Avaliação

### 1. Conteúdo/Programa
- **Adequação do conteúdo**: Relevância do material apresentado
- **Aplicabilidade profissional**: Utilidade no ambiente de trabalho
- **Equilíbrio teoria/prática**: Balanceamento entre conceitos e aplicação
- **Novos conhecimentos**: Quantidade de informações novas adquiridas

### 2. Instrutor/Palestrante
- **Conhecimento do assunto**: Domínio técnico do instrutor
- **Didática utilizada**: Metodologia de ensino aplicada
- **Comunicação**: Clareza e efetividade na comunicação
- **Verificação da assimilação**: Acompanhamento do aprendizado
- **Aplicações práticas**: Demonstrações e exercícios práticos

### 3. Infraestrutura e Logística
- **Instalações/equipamentos**: Qualidade das instalações físicas
- **Salas de aula**: Adequação dos espaços de aprendizado
- **Carga horária**: Adequação do tempo de treinamento

### 4. Participantes
- **Facilidade de entendimento**: Compreensão pessoal do conteúdo
- **Relação com outros participantes**: Interação com colegas
- **Própria participação**: Autoavaliação da participação
- **Relação com instrutores**: Qualidade da interação com instrutores

## 🎯 Como Usar o Sistema

### Para Administradores

1. **Acessar Avaliações da Turma**:
   - Na página de turmas, clique nos três pontinhos (⋯) de uma turma
   - Selecione "Avaliações dos Alunos"

2. **Gerenciar Avaliações**:
   - **Aba "Avaliações"**: Lista todos os alunos e status de avaliação
   - **Aba "Estatísticas"**: Mostra métricas e médias por categoria

3. **Criar Nova Avaliação**:
   - Clique no botão "Avaliar" ao lado do aluno desejado
   - Preencha as notas (1-5 estrelas) para cada categoria
   - Adicione observações se necessário
   - Clique em "Salvar Avaliação"

4. **Editar Avaliação Existente**:
   - Clique no botão "Editar" ao lado do aluno
   - Modifique as notas conforme necessário
   - Clique em "Atualizar Avaliação"

5. **Visualizar Estatísticas**:
   - Taxa de avaliação da turma
   - Médias por categoria com distribuição de notas
   - Comparação entre diferentes aspectos do treinamento

### Para Desenvolvedores

#### APIs Disponíveis

```javascript
// Criar avaliação
await createClassEvaluation({
  classId: "turma-id",
  studentId: "aluno-id",
  contentAdequacy: 5,
  instructorKnowledge: 4,
  // ... outros campos
})

// Buscar avaliação específica
const evaluation = await getClassEvaluationByStudent(classId, studentId)

// Listar todas as avaliações da turma
const evaluations = await getClassEvaluations(classId)

// Obter estatísticas
const stats = await getClassEvaluationStats(classId)

// Atualizar avaliação
await updateClassEvaluation(classId, studentId, { contentAdequacy: 3 })

// Remover avaliação
await deleteClassEvaluation(classId, studentId)
```

#### Estrutura dos Dados

```typescript
interface ClassEvaluationData {
  classId: string
  studentId: string
  
  // Conteúdo (1-5, opcional)
  contentAdequacy?: number
  contentApplicability?: number
  contentTheoryPracticeBalance?: number
  contentNewKnowledge?: number
  
  // Instrutor (1-5, opcional)
  instructorKnowledge?: number
  instructorDidactic?: number
  instructorCommunication?: number
  instructorAssimilation?: number
  instructorPracticalApps?: number
  
  // Infraestrutura (1-5, opcional)
  infrastructureFacilities?: number
  infrastructureClassrooms?: number
  infrastructureSchedule?: number
  
  // Participantes (1-5, opcional)
  participantsUnderstanding?: number
  participantsRelationship?: number
  participantsConsideration?: number
  participantsInstructorRel?: number
  
  observations?: string
}
```

## 📊 Interpretação das Estatísticas

### Escala de Avaliação
- **5 estrelas**: Excelente
- **4 estrelas**: Muito Bom
- **3 estrelas**: Bom
- **2 estrelas**: Regular
- **1 estrela**: Ruim

### Métricas Importantes
- **Taxa de Avaliação**: Percentual de alunos que avaliaram a turma
- **Média por Categoria**: Nota média de cada aspecto avaliado
- **Distribuição**: Quantidade de notas por nível (1-5)

### Indicadores de Qualidade
- **Alta taxa de avaliação** (>80%): Boa participação dos alunos
- **Médias altas** (>4.0): Excelente qualidade do treinamento
- **Distribuição concentrada** em notas altas: Consistência na qualidade

## 🔧 Configuração e Manutenção

### Requisitos
- Token JWT válido para autenticação
- Permissões de superadmin para gerenciar avaliações
- Alunos devem estar matriculados na turma para avaliar

### Validações do Sistema
- Apenas uma avaliação por aluno por turma
- Notas devem estar entre 1 e 5
- Todos os campos são opcionais
- Aluno deve estar matriculado na turma

### Solução de Problemas Comuns

1. **"Aluno não está matriculado nesta turma"**
   - Verifique se o aluno está na lista de estudantes da turma
   - Confirme se os IDs estão corretos

2. **"Turma não encontrada"**
   - Verifique se o ID da turma está correto
   - Confirme se a turma existe no sistema

3. **Erro de validação nas notas**
   - Certifique-se de que as notas estão entre 1 e 5
   - Verifique se os campos numéricos não contêm valores inválidos

## 🚀 Testes

Execute o script de testes para verificar as funcionalidades:

```bash
node test-class-evaluations-api.js
```

Lembre-se de:
- Configurar o token JWT válido
- Usar IDs reais de turma e estudante
- Verificar se o servidor está rodando

## 📱 Interface do Usuário

### Componentes Principais
- **ClassEvaluationsModal**: Modal principal para gerenciar avaliações
- **Tabs**: Separação entre lista de avaliações e estatísticas
- **Star Rating**: Sistema de avaliação por estrelas
- **Cards**: Exibição de estatísticas por categoria

### Funcionalidades da Interface
- **Busca**: Filtrar alunos por nome ou CPF
- **Status Visual**: Badges indicando se o aluno já avaliou
- **Formulário Intuitivo**: Sistema de estrelas clicáveis
- **Estatísticas Visuais**: Gráficos e métricas organizadas

## 🎯 Próximos Passos

1. **Relatórios**: Implementar exportação de relatórios de avaliação
2. **Gráficos**: Adicionar visualizações gráficas das estatísticas
3. **Comparações**: Permitir comparar avaliações entre turmas
4. **Notificações**: Alertar sobre turmas com baixas avaliações
5. **Avaliação por Aula**: Permitir avaliar aulas individuais

---

**Desenvolvido para o Sistema de Gerenciamento de Treinamentos**  
*Versão 1.0 - Sistema de Avaliações*
