# Implementação da Página "Minhas Turmas" para Cliente

## Resumo
Atualização da página "Minhas Turmas" do cliente para usar o novo endpoint `/client-dashboard/classes` com paginação, busca e filtros.

## Mudanças Implementadas

### 1. Nova Função da API (`lib/api/auth.ts`)

#### getClientDashboardClasses()
```typescript
export const getClientDashboardClasses = async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: 'completed' | 'ongoing'
}) => {
    try {
        const queryParams = new URLSearchParams();
        
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.status) queryParams.append('status', params.status);
        
        const queryString = queryParams.toString();
        const url = queryString 
            ? `/client-dashboard/classes?${queryString}` 
            : '/client-dashboard/classes';
        
        const response = await api.get(url);
        console.log('Turmas do cliente:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar turmas do cliente:', error);
        throw error;
    }
};
```

**Características:**
- Suporte a paginação (`page`, `limit`)
- Busca por nome, instrutor ou localização (`search`)
- Filtros de status (`completed`, `ongoing`)
- Usa JWT token automaticamente

**Resposta esperada:**
```typescript
{
  clientId: string
  clientName: string
  classes: Array<{
    id: string
    trainingId: string
    trainingTitle: string
    instructorId: string
    instructorName: string
    startDate: string (ISO 8601)
    endDate: string (ISO 8601)
    location: string | null
    status: string
    closingDate: string | null (ISO 8601)
    totalStudents: number
    totalLessons: number
    completedLessons: number
  }>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### 2. Componente Atualizado (`components/client-classes-page.tsx`)

#### Novas Interfaces

```typescript
interface ClientClass {
  id: string
  trainingId: string
  trainingTitle: string
  instructorId: string
  instructorName: string
  startDate: string
  endDate: string
  location: string | null
  status: string
  closingDate: string | null
  totalStudents: number
  totalLessons: number
  completedLessons: number
}

interface ClientClassesResponse {
  clientId: string
  clientName: string
  classes: ClientClass[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

#### Novos States

```typescript
const [data, setData] = useState<ClientClassesResponse | null>(null)
const [searchTerm, setSearchTerm] = useState("")
const [statusFilter, setStatusFilter] = useState<'completed' | 'ongoing' | ''>("")
const [currentPage, setCurrentPage] = useState(1)
const limit = 9 // 9 cards por página (3x3 grid)
```

#### Funcionalidades Implementadas

**1. Busca em Tempo Real**
```typescript
const handleSearch = (value: string) => {
  setSearchTerm(value)
  setCurrentPage(1) // Reset para primeira página ao buscar
}
```
- Busca por nome do treinamento, instrutor ou localização
- Reset automático para página 1 ao buscar

**2. Filtros de Status**
```typescript
const handleStatusFilter = (value: 'completed' | 'ongoing' | '') => {
  setStatusFilter(value)
  setCurrentPage(1) // Reset para primeira página ao filtrar
}
```
- Filtrar todas as turmas
- Filtrar apenas turmas em andamento
- Filtrar apenas turmas concluídas

**3. Paginação**
```typescript
<Button
  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
  disabled={currentPage === 1}
>
  Anterior
</Button>

{Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map(page => (
  <Button
    variant={page === currentPage ? 'default' : 'outline'}
    onClick={() => setCurrentPage(page)}
  >
    {page}
  </Button>
))}

<Button
  onClick={() => setCurrentPage(prev => Math.min(data.pagination.totalPages, prev + 1))}
  disabled={currentPage === data.pagination.totalPages}
>
  Próxima
</Button>
```

**4. Cards de Estatísticas Atualizados**
- **Total de Turmas**: `data?.pagination.total` (do backend)
- **Turmas Ativas**: Filtradas por status "Em andamento" ou "Agendada"
- **Total de Alunos**: Soma de `totalStudents` de todas as turmas
- **Turmas Concluídas**: Filtradas por status "Concluída"

**5. Cards de Turmas Atualizados**
```tsx
<CardTitle>{turma.trainingTitle}</CardTitle>
<CardDescription>Instrutor: {turma.instructorName}</CardDescription>

<div className="grid grid-cols-2 gap-4">
  <div>
    <Users /> {turma.totalStudents} alunos
  </div>
  <div>
    <BookOpen /> {turma.totalLessons} aulas
  </div>
  <div>
    <Calendar /> {new Date(turma.startDate).toLocaleDateString('pt-BR')}
  </div>
  <div>
    <Clock /> {turma.completedLessons}/{turma.totalLessons}
  </div>
</div>

{turma.location && (
  <div>
    <MapPin /> {turma.location}
  </div>
)}

{turma.closingDate && (
  <div className="text-green-600">
    <Award /> Concluída em {new Date(turma.closingDate).toLocaleDateString('pt-BR')}
  </div>
)}
```

#### useEffect Atualizado

**Antes:**
```typescript
useEffect(() => {
  const response = await getClientClasses()
  setClasses(response.classes || response || [])
}, [isClient, getClientClasses])
```

**Depois:**
```typescript
useEffect(() => {
  const response = await getClientDashboardClasses({
    page: currentPage,
    limit,
    search: searchTerm || undefined,
    status: statusFilter || undefined
  })
  setData(response)
}, [isClient, currentPage, searchTerm, statusFilter])
```

**Diferenças:**
- ✅ Parâmetros de paginação, busca e filtro
- ✅ Reage a mudanças em qualquer um dos filtros
- ✅ Estrutura de dados tipada com TypeScript

### 3. Status das Turmas

O backend calcula automaticamente o status:

| Status | Condição |
|--------|----------|
| **Agendada** | `startDate` > hoje |
| **Em andamento** | `startDate` ≤ hoje ≤ `endDate` e sem `closingDate` |
| **Encerrada** | `endDate` < hoje mas sem `closingDate` |
| **Concluída** | Tem `closingDate` preenchido |

### 4. Funcionalidades Removidas

- ❌ Cálculo de expiração de certificados (não disponível no novo endpoint)
- ❌ Dependência de `getClientClasses` do hook `useAuth`
- ❌ Campos antigos: `name`, `title`, `description`, `training`, `instructor` (objeto), `certificates`

### 5. Funcionalidades Adicionadas

- ✅ Busca em tempo real
- ✅ Filtros de status (Todas, Em Andamento, Concluídas)
- ✅ Paginação com botões anterior/próxima e números de página
- ✅ Exibição de aulas completadas vs total (`completedLessons/totalLessons`)
- ✅ Data de encerramento oficial quando disponível
- ✅ Nome do cliente no subtítulo

## Endpoint da API

### GET /client-dashboard/classes

**Autenticação:** Obrigatória (JWT token)

**Query Parameters:**

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|---------|-----------|
| `page` | number | Não | 1 | Número da página |
| `limit` | number | Não | 10 | Itens por página |
| `search` | string | Não | - | Busca por título, instrutor ou localização |
| `status` | string | Não | - | Filtro: `completed` ou `ongoing` |

**Requisição:**
```http
GET /client-dashboard/classes?page=1&limit=9&search=NR-35&status=ongoing HTTP/1.1
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Resposta de Sucesso (200):**
```json
{
  "clientId": "cm1a2b3c4d5e6f7g8h9i0j1k",
  "clientName": "Empresa XYZ Ltda",
  "classes": [
    {
      "id": "class-uuid-1",
      "trainingId": "training-uuid-1",
      "trainingTitle": "NR-35 - Trabalho em Altura",
      "instructorId": "instructor-uuid-1",
      "instructorName": "João Silva",
      "startDate": "2025-11-01T08:00:00.000Z",
      "endDate": "2025-11-05T17:00:00.000Z",
      "location": "São Paulo - SP",
      "status": "Concluída",
      "closingDate": "2025-11-05T17:30:00.000Z",
      "totalStudents": 25,
      "totalLessons": 4,
      "completedLessons": 4
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 9,
    "total": 12,
    "totalPages": 2
  }
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

### 1. **Performance**
- ✅ Paginação reduz a quantidade de dados carregados
- ✅ Busca e filtros no backend (mais eficiente)
- ✅ Menos dados trafegados pela rede

### 2. **UX Melhorada**
- ✅ Busca instantânea
- ✅ Filtros fáceis de usar
- ✅ Navegação entre páginas intuitiva
- ✅ Indicador visual de progresso das aulas

### 3. **Segurança**
- ✅ Backend valida permissões automaticamente
- ✅ Apenas turmas do cliente são retornadas
- ✅ Não depende de filtros no frontend

### 4. **Manutenibilidade**
- ✅ Código mais limpo e tipado
- ✅ Menos lógica no frontend
- ✅ API dedicada para clientes

## Layout da Página

```
Minhas Turmas
Turmas de [Nome do Cliente]                    [Exportar Lista]
├─────────────────────────────────────────────────────────────
├── Busca e Filtros
│   └── [Buscar...] [Todas] [Em Andamento] [Concluídas]
├─────────────────────────────────────────────────────────────
├── Cards de Estatísticas (4 cards)
│   ├── Total de Turmas: 12
│   ├── Turmas Ativas: 5
│   ├── Total de Alunos: 145
│   └── Turmas Concluídas: 7
├─────────────────────────────────────────────────────────────
├── Grid de Turmas (3x3 = 9 por página)
│   ├── Card 1: NR-35 - Trabalho em Altura
│   │   ├── Instrutor: João Silva
│   │   ├── Status: Em andamento
│   │   ├── 25 alunos | 4 aulas
│   │   ├── 01/11/2025 | 2/4 aulas
│   │   └── [Detalhes]
│   ├── Card 2: ...
│   └── ...
├─────────────────────────────────────────────────────────────
└── Paginação
    └── [< Anterior] [1] [2] [Próxima >]
```

## Testes Recomendados

1. **Busca**
   - Buscar por nome de treinamento
   - Buscar por instrutor
   - Buscar por localização
   - Verificar que reseta para página 1

2. **Filtros de Status**
   - Filtrar "Todas"
   - Filtrar "Em Andamento"
   - Filtrar "Concluídas"
   - Verificar contadores atualizados

3. **Paginação**
   - Navegar entre páginas
   - Verificar botões desabilitados nos limites
   - Verificar que mantém busca/filtros

4. **Performance**
   - Verificar tempo de carregamento
   - Verificar quantidade de dados retornados
   - Verificar que não há chamadas desnecessárias

5. **Responsividade**
   - Testar em mobile (cards em coluna única)
   - Testar em tablet (2 colunas)
   - Testar em desktop (3 colunas)

## Observações Importantes

- ✅ Limite de 9 turmas por página (grid 3x3)
- ✅ Busca é case-insensitive no backend
- ✅ Filtros são cumulativos (busca + status)
- ✅ Paginação é controlada pelo backend
- ✅ Status é calculado automaticamente pelo backend

## Data de Implementação
21 de novembro de 2025
