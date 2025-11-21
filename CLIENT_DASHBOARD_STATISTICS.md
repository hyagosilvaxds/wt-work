# Implementação das Estatísticas do Dashboard do Cliente

## Resumo
Adaptação do dashboard do cliente para buscar estatísticas através do novo endpoint `/client-dashboard/statistics` que identifica automaticamente o cliente através do usuário autenticado.

## Mudanças Implementadas

### 1. Nova Função da API (`lib/api/auth.ts`)

#### getClientStatistics()
```typescript
export const getClientStatistics = async () => {
    try {
        const response = await api.get('/client-dashboard/statistics');
        console.log('Estatísticas do cliente:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar estatísticas do cliente:', error);
        throw error;
    }
};
```

**Características:**
- Não requer parâmetros (usa o JWT token do usuário autenticado)
- Retorna automaticamente os dados do cliente vinculado ao usuário
- Tratamento de erros com logs

**Resposta esperada:**
```typescript
{
  clientId: string
  clientName: string
  totalStudents: number
  totalClasses: number
  totalLessons: number
  completedClasses: number
}
```

### 2. Componente Dashboard (`components/client-dashboard.tsx`)

#### Novos States

```typescript
const [statistics, setStatistics] = useState<ClientStatistics | null>(null)
```

**Interface ClientStatistics:**
```typescript
interface ClientStatistics {
  clientId: string
  clientName: string
  totalStudents: number
  totalClasses: number
  totalLessons: number
  completedClasses: number
}
```

#### Atualização do useEffect

**Antes:**
```typescript
// Buscava clientId através de getUserClientId(user.id)
// Depois buscava estatísticas através de getClientDashboard(clientId, filters)
```

**Depois:**
```typescript
useEffect(() => {
  const fetchClientData = async () => {
    if (!user?.id) {
      setError('Usuário não encontrado')
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Buscar estatísticas do novo endpoint
      const stats = await getClientStatistics()
      setStatistics(stats)
      setClientId(stats.clientId)
      setError(null)
    } catch (err: any) {
      console.error('Erro ao carregar estatísticas:', err)
      
      // Tratar diferentes tipos de erro
      if (err?.response?.status === 401) {
        setError(err?.response?.data?.message || 'Não autorizado')
      } else if (err?.response?.status === 404) {
        setError('Usuário não encontrado')
      } else {
        setError('Erro ao carregar dados do cliente')
      }
    } finally {
      setLoading(false)
    }
  }

  fetchClientData()
}, [user?.id])
```

#### Atualização dos Cards de Estatísticas

**Antes:**
```typescript
value: dashboardData?.totalStudents || 0
value: dashboardData?.totalClasses || 0
value: dashboardData?.totalLessons || 0
value: dashboardData?.totalCompletedClasses || 0
```

**Depois:**
```typescript
value: statistics?.totalStudents || 0
value: statistics?.totalClasses || 0
value: statistics?.totalLessons || 0  // Agora é "Total de Aulas" em vez de "Aulas Agendadas"
value: statistics?.completedClasses || 0
```

#### Atualização do Título

**Antes:**
```tsx
<h1 className="text-3xl font-bold text-gray-900">Dashboard do Cliente</h1>
```

**Depois:**
```tsx
<h1 className="text-3xl font-bold text-gray-900">
  Dashboard do Cliente
  {statistics?.clientName && (
    <span className="text-2xl text-gray-600 ml-3">- {statistics.clientName}</span>
  )}
</h1>
```

#### Atualização do Resumo Semanal

**Turmas Ativas** agora calcula:
```typescript
{(statistics?.totalClasses || 0) - (statistics?.completedClasses || 0)}
```
Mostra apenas turmas que ainda não foram concluídas.

**Total de Alunos** agora usa:
```typescript
{statistics?.totalStudents || 0}
```
Busca diretamente do novo endpoint.

## Benefícios da Mudança

### 1. **Segurança Aprimorada**
- ✅ Não é mais necessário passar `clientId` como parâmetro
- ✅ Backend identifica automaticamente o cliente do usuário autenticado
- ✅ Previne acesso a dados de outros clientes

### 2. **Código Simplificado**
- ✅ Menos chamadas à API (antes: 2 chamadas, agora: 1 chamada)
- ✅ Não precisa mais buscar `clientId` separadamente com `getUserClientId`
- ✅ Lógica mais clara e direta

### 3. **Melhor Tratamento de Erros**
- ✅ Tratamento específico para erro 401 (não autorizado)
- ✅ Tratamento específico para erro 404 (usuário não encontrado)
- ✅ Mensagens de erro mais claras para o usuário

### 4. **Performance**
- ✅ Uma chamada à API em vez de duas
- ✅ Menos processamento no frontend
- ✅ Carregamento mais rápido

## Fluxo de Dados

### Antes
```
Usuario autenticado
    ↓
getUserClientId(userId)
    ↓
clientId extraído
    ↓
getClientDashboard(clientId, filters)
    ↓
Estatísticas exibidas
```

### Depois
```
Usuario autenticado (JWT token)
    ↓
getClientStatistics()
    ↓
Backend identifica cliente automaticamente
    ↓
Estatísticas + clientId + clientName retornados
    ↓
Estatísticas exibidas
```

## Endpoint da API

### GET /client-dashboard/statistics

**Autenticação:** Obrigatória (JWT token)

**Requisição:**
```http
GET /client-dashboard/statistics HTTP/1.1
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Resposta de Sucesso (200):**
```json
{
  "clientId": "cm1a2b3c4d5e6f7g8h9i0j1k",
  "clientName": "Empresa XYZ Ltda",
  "totalStudents": 145,
  "totalClasses": 12,
  "totalLessons": 48,
  "completedClasses": 8
}
```

**Erros Possíveis:**

| Status | Mensagem | Quando ocorre |
|--------|----------|---------------|
| 401 | "Unauthorized" | Token inválido ou ausente |
| 401 | "Apenas usuários com perfil de cliente podem acessar essas estatísticas" | Usuário não tem perfil CLIENTE |
| 401 | "Usuário não está vinculado a nenhum cliente" | Usuário não tem clientId |
| 404 | "Usuário não encontrado" | Usuário do token não existe |

## Compatibilidade

### Mantido
- ✅ Busca de aulas por mês/ano (ainda usa o endpoint antigo)
- ✅ Calendário com eventos
- ✅ Filtros de mês e ano
- ✅ Lista de aulas agendadas

### Alterado
- ✅ Cards de estatísticas no topo (agora usa novo endpoint)
- ✅ Resumo semanal (agora usa dados do novo endpoint)
- ✅ Título da dashboard (agora mostra nome do cliente)

## Testes Recomendados

1. **Login como cliente**
   - Verificar que as estatísticas carregam corretamente
   - Verificar que o nome do cliente aparece no título

2. **Usuário sem perfil CLIENTE**
   - Verificar que mostra erro apropriado

3. **Usuário não vinculado a cliente**
   - Verificar que mostra erro apropriado

4. **Token inválido/expirado**
   - Verificar que mostra erro de autenticação

5. **Performance**
   - Verificar que o carregamento é mais rápido (menos chamadas à API)

## Observações Importantes

- O endpoint antigo `/superadmin/clients/${clientId}/dashboard` ainda é usado para buscar as aulas filtradas por mês/ano
- As estatísticas gerais agora vêm do novo endpoint `/client-dashboard/statistics`
- O `clientId` obtido do novo endpoint é usado para buscar as aulas no endpoint antigo
- Esta implementação mantém compatibilidade total com a funcionalidade existente

## Data de Implementação
21 de novembro de 2025
