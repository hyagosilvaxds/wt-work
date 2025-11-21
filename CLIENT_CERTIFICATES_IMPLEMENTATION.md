# Implementação da Tela de Certificados para Cliente

## Resumo
Adaptação da página de certificados para usuários com perfil CLIENTE utilizarem o novo endpoint `/client-dashboard/eligible-classes` que retorna turmas concluídas com informações de elegibilidade para certificados.

## Mudanças Implementadas

### 1. Nova Função da API (`lib/api/auth.ts`)

#### Interfaces TypeScript

```typescript
export interface EligibleStudent {
    studentId: string
    studentName: string
    averageGrade: number
    practicalGrade?: number
    theoreticalGrade?: number
    absences: number
    presences: number
    totalLessons: number
    isEligible: boolean
}

export interface EligibleClass {
    classId: string
    trainingName: string
    startDate: string
    endDate: string
    status: string
    location?: string
    trainingDurationHours: number
    certificateValidityDays?: number
    totalStudents: number
    studentsWithoutAbsences: number
    studentsWithAbsences: number
    totalLessons: number
    students: EligibleStudent[]
}

export interface ClientEligibleClassesResponse {
    clientId: string
    clientName: string
    totalClasses: number
    eligibleClasses: number
    classes: EligibleClass[]
}
```

#### getClientEligibleClassesForCertificates()

```typescript
export const getClientEligibleClassesForCertificates = async (): Promise<ClientEligibleClassesResponse> => {
    try {
        const response = await api.get('/client-dashboard/eligible-classes');
        console.log('Turmas elegíveis para certificados:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar turmas elegíveis:', error);
        throw error;
    }
};
```

**Características:**
- ✅ Usa JWT token automaticamente (não precisa passar clientId)
- ✅ Retorna apenas turmas concluídas (status: CONCLUIDO)
- ✅ Inclui cálculo de elegibilidade no backend
- ✅ Retorna todos os alunos com informações detalhadas

**Resposta esperada:**
```json
{
  "clientId": "cm1a2b3c4d5e6f7g8h9i0j1k",
  "clientName": "Empresa XYZ Ltda",
  "totalClasses": 5,
  "eligibleClasses": 3,
  "classes": [
    {
      "classId": "class-uuid-1",
      "trainingName": "NR-35 - Trabalho em Altura",
      "startDate": "2025-10-01T08:00:00.000Z",
      "endDate": "2025-10-05T17:00:00.000Z",
      "status": "CONCLUIDO",
      "location": "São Paulo - SP",
      "trainingDurationHours": 8,
      "certificateValidityDays": 730,
      "totalStudents": 25,
      "studentsWithoutAbsences": 20,
      "studentsWithAbsences": 5,
      "totalLessons": 4,
      "students": [
        {
          "studentId": "student-uuid-1",
          "studentName": "João Silva",
          "averageGrade": 8.5,
          "practicalGrade": 9,
          "theoreticalGrade": 8,
          "absences": 0,
          "presences": 4,
          "totalLessons": 4,
          "isEligible": true
        },
        {
          "studentId": "student-uuid-3",
          "studentName": "Pedro Oliveira",
          "averageGrade": 4,
          "practicalGrade": 4,
          "absences": 0,
          "presences": 4,
          "totalLessons": 4,
          "isEligible": false
        }
      ]
    }
  ]
}
```

### 2. Componente Atualizado (`components/certificates-page.tsx`)

#### Importações Adicionadas

```typescript
import { 
  getClientEligibleClassesForCertificates, 
  type ClientEligibleClassesResponse as AuthClientEligibleClassesResponse,
  type EligibleClass,
  type EligibleStudent
} from "@/lib/api/auth"
```

#### Lógica de Carregamento Atualizada

**Antes:**
```typescript
useEffect(() => {
  if (isClient && user?.id) {
    loadClientId()
  } else if (isInstructor && user?.id) {
    loadInstructorId()
  } else {
    loadFinishedClasses()
  }
}, [currentPage, isClient, isInstructor, user?.id])

useEffect(() => {
  if (clientId) {
    loadFinishedClasses()
  }
}, [clientId])
```

**Depois:**
```typescript
useEffect(() => {
  if (isClient) {
    // Para clientes, carregar diretamente (JWT token identifica o cliente)
    loadFinishedClasses()
  } else if (isInstructor && user?.id) {
    loadInstructorId()
  } else {
    loadFinishedClasses()
  }
}, [currentPage, isClient, isInstructor, user?.id])

// Removido: useEffect de clientId
```

**Mudanças:**
- ✅ Removida dependência de `clientId`
- ✅ Cliente carrega dados diretamente usando JWT
- ✅ Simplificação do fluxo de carregamento

#### Função loadFinishedClasses Atualizada

```typescript
const loadFinishedClasses = async () => {
  try {
    setLoading(true)
    
    // Se for cliente, usar o endpoint específico
    if (isClient) {
      const response = await getClientEligibleClassesForCertificates()
      
      // Transformar dados para o formato esperado pelo componente
      const classes = response.classes.map(cls => ({
        id: cls.classId,
        training: { 
          title: cls.trainingName,
          durationHours: cls.trainingDurationHours,
          validityDays: cls.certificateValidityDays
        },
        startDate: cls.startDate,
        endDate: cls.endDate,
        status: cls.status,
        location: cls.location,
        totalStudents: cls.totalStudents,
        students: cls.students.map(student => ({
          id: student.studentId,
          name: student.studentName,
          practicalGrade: student.practicalGrade,
          theoreticalGrade: student.theoreticalGrade,
          averageGrade: student.averageGrade,
          totalLessons: student.totalLessons,
          attendedLessons: student.presences,
          absences: student.absences,
          isEligible: student.isEligible,
          eligibilityReason: student.isEligible 
            ? 'Apto para receber certificado' 
            : student.absences > 0 
              ? 'Possui faltas registradas'
              : 'Nota abaixo da média mínima (5.0)',
          hasAbsences: student.absences > 0
        }))
      }))
      
      // Aplicar filtro de busca no frontend (se houver)
      const filteredClasses = searchTerm.trim() 
        ? classes.filter(cls => 
            cls.training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.location?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : classes
      
      setFinishedClasses(filteredClasses)
      setTotalPages(1) // Cliente não tem paginação no backend
      
      return
    }
    
    // Para não-clientes, continua usando o endpoint com paginação
    // ... resto do código
  }
}
```

**Mudanças:**
- ✅ Verifica se `isClient` antes de chamar endpoint específico
- ✅ Mapeia resposta da API para formato interno do componente
- ✅ Calcula `eligibilityReason` baseado nas regras de negócio
- ✅ Aplica busca no frontend (já que não há paginação)
- ✅ Define `totalPages = 1` para clientes

#### Mapeamento de Dados

| Campo da API | Campo Interno | Observações |
|--------------|---------------|-------------|
| `classId` | `id` | UUID da turma |
| `trainingName` | `training.title` | Nome do treinamento |
| `trainingDurationHours` | `training.durationHours` | Carga horária |
| `certificateValidityDays` | `training.validityDays` | Validade do certificado |
| `studentId` | `id` | UUID do aluno |
| `studentName` | `name` | Nome completo |
| `averageGrade` | `averageGrade` | Média calculada |
| `practicalGrade` | `practicalGrade` | Nota prática |
| `theoreticalGrade` | `theoreticalGrade` | Nota teórica (pós-teste) |
| `presences` | `attendedLessons` | Quantidade de presenças |
| `isEligible` | `isEligible` | Elegibilidade (calculada no backend) |

### 3. Regras de Elegibilidade

Um aluno é considerado **APTO** quando:

1. ✅ **Sem faltas**: `absences === 0`
2. ✅ **Nota mínima**: Todas as notas existentes `>= 5`
3. ✅ **Turma concluída**: `status === 'CONCLUIDO'`

**Cálculo de eligibilityReason:**
```typescript
eligibilityReason: student.isEligible 
  ? 'Apto para receber certificado' 
  : student.absences > 0 
    ? 'Possui faltas registradas'
    : (student.practicalGrade && student.practicalGrade < 5) || 
      (student.theoreticalGrade && student.theoreticalGrade < 5)
      ? 'Nota abaixo da média mínima (5.0)'
      : 'Não elegível'
```

### 4. Comportamento para Clientes vs Não-Clientes

#### Para CLIENTE

| Funcionalidade | Comportamento |
|----------------|---------------|
| **Endpoint** | `/client-dashboard/eligible-classes` |
| **Autenticação** | JWT token (automático) |
| **Paginação** | Não (retorna todas as turmas) |
| **Busca** | No frontend (filtra por nome do treinamento ou localização) |
| **Filtros** | Não disponível |
| **Turmas exibidas** | Apenas turmas concluídas do cliente |
| **Geração de certificados** | Bloqueada para alunos não elegíveis |

#### Para ADMIN/INSTRUTOR

| Funcionalidade | Comportamento |
|----------------|---------------|
| **Endpoint** | `/certificates/completed-classes-filtered` |
| **Autenticação** | JWT token |
| **Paginação** | Sim (10 por página) |
| **Busca** | No backend (API) |
| **Filtros** | Disponível (por status, data, etc.) |
| **Turmas exibidas** | Todas as turmas (filtradas por permissão) |
| **Geração de certificados** | Permitida mesmo para não elegíveis (com aviso) |

### 5. Validações e Mensagens

#### Geração de Certificado para Cliente

```typescript
const handleGenerateCertificate = (student: any, classData: any) => {
  if (!student.isEligible) {
    if (isClient) {
      // Bloquear geração para clientes
      toast.error(`Não é possível gerar certificado: ${student.eligibilityReason}`)
      return
    }
    
    // Para admin/instrutor, permitir com aviso
    toast.warning(`Atenção: ${student.eligibilityReason}. Gerando certificado mesmo assim.`)
  }
  
  // Continuar com geração...
}
```

**Mensagens de erro:**

| Situação | Mensagem | Perfil |
|----------|----------|--------|
| Aluno com faltas | "Não é possível gerar certificado: Possui faltas registradas" | CLIENTE |
| Nota abaixo de 5 | "Não é possível gerar certificado: Nota abaixo da média mínima (5.0)" | CLIENTE |
| Admin gera para inapto | "Atenção: Possui faltas registradas. Gerando certificado mesmo assim." | ADMIN/INSTRUTOR |

### 6. Funcionalidades Removidas para Clientes

- ❌ **loadClientId()**: Não é mais necessário (JWT identifica o cliente)
- ❌ **getUserClientId()**: Não é mais chamado
- ❌ **Paginação no backend**: Cliente recebe todas as turmas de uma vez
- ❌ **Dependência de clientId state**: Removida

### 7. Funcionalidades Mantidas

- ✅ **Busca por nome do treinamento**
- ✅ **Busca por localização**
- ✅ **Expandir/colapsar turmas**
- ✅ **Visualizar alunos elegíveis/não elegíveis**
- ✅ **Preview de certificados**
- ✅ **Download de certificados**
- ✅ **Geração em lote (apenas para elegíveis)**
- ✅ **Estatísticas de turmas/alunos**

## Endpoint da API

### GET /client-dashboard/eligible-classes

**Autenticação:** Obrigatória (JWT token)

**Headers:**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Query Parameters:** Nenhum (retorna todas as turmas concluídas)

**Resposta de Sucesso (200):**
```json
{
  "clientId": "cm1a2b3c4d5e6f7g8h9i0j1k",
  "clientName": "Empresa XYZ Ltda",
  "totalClasses": 5,
  "eligibleClasses": 3,
  "classes": [...]
}
```

**Erros Possíveis:**

| Status | Mensagem | Quando ocorre |
|--------|----------|---------------|
| 401 | "Unauthorized" | Token inválido ou ausente |
| 401 | "Apenas usuários com perfil de cliente podem acessar esta informação" | Usuário não tem perfil CLIENTE |
| 401 | "Usuário não está vinculado a nenhum cliente" | Usuário não tem clientId |
| 404 | "Usuário não encontrado" | Usuário do token não existe |

## Benefícios da Mudança

### 1. **Segurança**
- ✅ JWT token identifica automaticamente o cliente
- ✅ Backend valida permissões (apenas CLIENTE pode acessar)
- ✅ Cliente só vê turmas da sua empresa
- ✅ Não é possível manipular URL para ver dados de outros clientes

### 2. **Performance**
- ✅ Uma única chamada retorna todas as turmas elegíveis
- ✅ Cálculo de elegibilidade no backend (mais eficiente)
- ✅ Menos chamadas de API necessárias

### 3. **UX Melhorada**
- ✅ Carregamento mais rápido (sem paginação)
- ✅ Busca instantânea no frontend
- ✅ Informações claras sobre elegibilidade
- ✅ Mensagens de erro específicas para cada caso

### 4. **Manutenibilidade**
- ✅ Código mais limpo e menos dependências
- ✅ Menos estados no componente
- ✅ Lógica de negócio centralizada no backend
- ✅ Fácil de estender com novos campos

## Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE AUTENTICADO                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│   useAuth() detecta isClient = true                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│   useEffect chama loadFinishedClasses()                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│   if (isClient) → getClientEligibleClassesForCertificates() │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│   GET /client-dashboard/eligible-classes                    │
│   Authorization: Bearer <jwt_token>                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│   BACKEND:                                                   │
│   1. Valida JWT token                                       │
│   2. Extrai userId do token                                 │
│   3. Busca user e verifica role === CLIENTE                 │
│   4. Busca clientId do usuário                              │
│   5. Busca turmas concluídas do cliente                     │
│   6. Para cada aluno, calcula elegibilidade:                │
│      - absences === 0                                       │
│      - practicalGrade >= 5 (se existir)                     │
│      - theoreticalGrade >= 5 (se existir)                   │
│   7. Retorna turmas com informações de elegibilidade        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│   FRONTEND:                                                  │
│   1. Recebe resposta com classes                            │
│   2. Mapeia para formato interno do componente              │
│   3. Aplica filtro de busca (se houver)                     │
│   4. Atualiza estado finishedClasses                        │
│   5. Renderiza turmas e alunos                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│   CLIENTE VISUALIZA:                                         │
│   - Turmas concluídas                                       │
│   - Alunos elegíveis (badge verde)                          │
│   - Alunos não elegíveis (badge vermelho + motivo)          │
│   - Pode gerar certificados apenas para elegíveis           │
└─────────────────────────────────────────────────────────────┘
```

## Layout da Tela (Cliente)

```
Certificados
Turmas concluídas da [Nome do Cliente]        [Buscar...]
├──────────────────────────────────────────────────────────
├── Turma: NR-35 - Trabalho em Altura [▼]
│   ├── Status: Concluída
│   ├── Local: São Paulo - SP
│   ├── Período: 01/10/2025 - 05/10/2025
│   ├── Total: 25 alunos | 20 aptos | 5 inaptos
│   │
│   └── Alunos:
│       ├── ✅ João Silva - Média: 8.5 [Gerar Certificado]
│       ├── ✅ Maria Santos - Média: 7.0 [Gerar Certificado]
│       ├── ❌ Pedro Oliveira - Média: 4.0 (Nota abaixo da média mínima)
│       └── ❌ Ana Costa - 1 falta (Possui faltas registradas)
│
├──────────────────────────────────────────────────────────
├── Turma: NR-10 - Segurança em Eletricidade [▼]
│   └── ...
└──────────────────────────────────────────────────────────
```

## Testes Recomendados

### 1. **Teste de Autenticação**
- [ ] Cliente autenticado vê apenas suas turmas
- [ ] Token inválido retorna 401
- [ ] Usuário não-cliente não acessa o endpoint

### 2. **Teste de Elegibilidade**
- [ ] Aluno sem faltas e nota >= 5 é elegível
- [ ] Aluno com falta não é elegível
- [ ] Aluno com nota < 5 não é elegível
- [ ] Aluno sem notas mas sem faltas é elegível

### 3. **Teste de Busca**
- [ ] Buscar por nome do treinamento filtra corretamente
- [ ] Buscar por localização filtra corretamente
- [ ] Busca case-insensitive funciona

### 4. **Teste de Geração de Certificados**
- [ ] Cliente pode gerar certificado para aluno elegível
- [ ] Cliente não pode gerar certificado para aluno não elegível
- [ ] Mensagem de erro é clara e específica
- [ ] Preview do certificado funciona

### 5. **Teste de Performance**
- [ ] Carregamento rápido (< 2 segundos)
- [ ] Busca instantânea no frontend
- [ ] Não há chamadas desnecessárias à API

## Observações Importantes

- ✅ Cliente não precisa passar `clientId` (JWT identifica automaticamente)
- ✅ Todas as turmas são retornadas de uma vez (sem paginação)
- ✅ Busca é feita no frontend (mais rápida e instantânea)
- ✅ Elegibilidade é calculada no backend (regras centralizadas)
- ✅ Cliente só pode gerar certificados para alunos elegíveis
- ✅ Admin/Instrutor mantêm flexibilidade para casos excepcionais

## Próximos Passos (Backend)

1. **Implementar Endpoint:**
   - Criar controller `ClientDashboardController`
   - Criar método `getEligibleClasses()`
   - Validar JWT e extrair userId
   - Verificar role === 'CLIENTE'
   - Buscar clientId do usuário
   - Buscar turmas com status 'CONCLUIDO'
   - Calcular elegibilidade de cada aluno
   - Retornar resposta formatada

2. **Regras de Elegibilidade:**
   ```typescript
   isEligible = 
     absences === 0 &&
     (practicalGrade === null || practicalGrade >= 5) &&
     (theoreticalGrade === null || theoreticalGrade >= 5)
   ```

3. **Validações:**
   - Usuário existe
   - Usuário tem role CLIENTE
   - Usuário tem clientId vinculado
   - Turmas pertencem ao cliente

4. **Testes:**
   - Testes unitários das regras de elegibilidade
   - Testes de integração do endpoint
   - Testes de autorização (apenas CLIENTE)
   - Testes de performance (muitas turmas/alunos)

## Data de Implementação
21 de novembro de 2025
