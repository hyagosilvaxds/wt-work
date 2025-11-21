# Redesign do ClientClassesPage - Design Unificado com TurmasPage

**Data:** 21 de novembro de 2025  
**Tipo:** Redesign / Refatoração Completa  
**Impacto:** ALTO - Unifica experiência do usuário entre admin e cliente

---

## 📋 Resumo

Redesign completo do componente `ClientClassesPage` para ter o mesmo design visual e funcionalidades do `TurmasPage`, mantendo apenas o endpoint específico `/client-dashboard/classes` para clientes.

---

## 🎯 Objetivo

Criar uma experiência visual consistente entre:
- **TurmasPage**: Usado por administradores e instrutores
- **ClientClassesPage**: Usado exclusivamente por clientes

Ambos agora compartilham:
- ✅ Mesmo layout de cards
- ✅ Mesmas informações exibidas
- ✅ Mesma estrutura de navegação
- ✅ Mesmas funcionalidades de modais
- ✅ Mesmo sistema de paginação

---

## 🔄 Mudanças Principais

### 1. **Layout de Cards Unificado**

**Antes (antigo ClientClassesPage):**
```tsx
// Layout de grid 3 colunas com cards simples
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>
    <CardHeader>
      <CardTitle>{turma.trainingTitle}</CardTitle>
      <Badge>{turma.status}</Badge>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        {/* Informações básicas */}
      </div>
    </CardContent>
  </Card>
</div>
```

**Depois (novo ClientClassesPage):**
```tsx
// Layout vertical com cards expandidos (igual ao TurmasPage)
<div className="grid gap-6">
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <CardTitle>{turma.training?.title}</CardTitle>
            <Badge className={getStatusColor(turma.status)}>{turma.status}</Badge>
            <Badge className={getTypeColor(turma.type)} variant="outline">{turma.type}</Badge>
            {/* Badge de expiração */}
          </div>
          <p className="text-gray-600 font-medium">{turma.training?.description}</p>
          {/* Informações do cliente */}
        </div>
        <DropdownMenu>
          {/* Ações rápidas */}
        </DropdownMenu>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Instrutor, Alunos, Período, Carga Horária */}
      </div>
      {/* Informações adicionais */}
      {/* Botões de ação */}
    </CardContent>
  </Card>
</div>
```

---

### 2. **Sistema de Badges Melhorado**

#### Badges de Status
```typescript
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'concluída':
      return 'bg-green-100 text-green-800'
    case 'ongoing':
    case 'em andamento':
      return 'bg-blue-100 text-blue-800'
    case 'scheduled':
    case 'agendada':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
    case 'cancelada':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
```

#### Badges de Tipo de Treinamento
```typescript
const getTypeColor = (type?: string) => {
  switch (type?.toLowerCase()) {
    case 'presencial': return 'border-blue-200 text-blue-700'
    case 'ead': return 'border-purple-200 text-purple-700'
    case 'híbrido': return 'border-orange-200 text-orange-700'
    default: return 'border-gray-200 text-gray-700'
  }
}
```

#### Badges de Validade/Expiração
```tsx
{(() => {
  const expirationStatus = calculateExpirationStatus(turma)
  if (expirationStatus.isExpired) {
    return <Badge className="bg-red-100 text-red-800">Expirado</Badge>
  } else if (expirationStatus.isExpiringSoon) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800">
        Vence em {expirationStatus.daysUntilExpiration} dia{expirationStatus.daysUntilExpiration !== 1 ? 's' : ''}
      </Badge>
    )
  }
  return null
})()}
```

---

### 3. **Grid de Informações Estruturado**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Informações do Instrutor */}
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <BookOpen className="h-4 w-4" />
      Instrutor
    </div>
    <p className="font-medium">{turma.instructor?.name || "Instrutor não definido"}</p>
  </div>

  {/* Informações dos Alunos */}
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Users className="h-4 w-4" />
      Alunos
    </div>
    <div>
      <p className="font-medium">{turma.totalStudents} aluno{turma.totalStudents !== 1 ? 's' : ''}</p>
      <p className="text-sm text-gray-500">{turma.totalLessons} aula{turma.totalLessons !== 1 ? 's' : ''}</p>
    </div>
  </div>

  {/* Período */}
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Calendar className="h-4 w-4" />
      Período
    </div>
    <div>
      <p className="text-sm font-medium">
        {formatDate(turma.startDate)} - {formatDate(turma.endDate)}
      </p>
      <p className="text-sm text-gray-500">
        {calculateDuration(turma.startDate, turma.endDate)} dias
      </p>
    </div>
  </div>

  {/* Duração do Treinamento */}
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Clock className="h-4 w-4" />
      Carga Horária
    </div>
    <div>
      <p className="text-sm font-medium">
        {turma.training?.durationHours || turma.trainingDurationHours || 0}h
      </p>
      <p className="text-sm text-gray-500">
        Validade: {turma.training?.validityDays || turma.trainingValidityDays || 0} dias
      </p>
    </div>
  </div>
</div>
```

---

### 4. **Informações Adicionais Expandidas**

```tsx
{(turma.technicalResponsible || turma.location || turma.recycling !== "NÃO" || turma.observations) && (
  <div className="mt-6 pt-6 border-t">
    {/* Responsável Técnico */}
    {turma.technicalResponsible && (
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <UserCog className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Responsável Técnico</span>
        </div>
        <p className="font-medium text-blue-900">{turma.technicalResponsible.name}</p>
        {turma.technicalResponsible.profession && (
          <p className="text-sm text-blue-700">{turma.technicalResponsible.profession}</p>
        )}
      </div>
    )}
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      {turma.location && (
        <div>
          <span className="text-gray-500">Local:</span>
          <p className="font-medium">{turma.location}</p>
        </div>
      )}
      {turma.recycling !== "NÃO" && (
        <div>
          <span className="text-gray-500">Reciclagem:</span>
          <p className="font-medium">{turma.recycling}</p>
        </div>
      )}
      {turma.observations && (
        <div>
          <span className="text-gray-500">Observações:</span>
          <p className="font-medium">{turma.observations}</p>
        </div>
      )}
    </div>
  </div>
)}
```

---

### 5. **Botões de Ação Padronizados**

```tsx
<div className="mt-6 pt-6 border-t flex gap-2 flex-wrap">
  <Button 
    variant="outline" 
    size="sm" 
    className="gap-2"
    onClick={() => handleViewDetails(turma)}
  >
    <Eye className="h-4 w-4" />
    Detalhes
  </Button>
  
  <Button 
    variant="outline" 
    size="sm" 
    className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
    onClick={() => handleOpenReportsModal(turma)}
  >
    <FileText className="h-4 w-4" />
    Relatórios
  </Button>

  <Button 
    variant="outline" 
    size="sm" 
    className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
    onClick={() => handleManageDocuments(turma)}
  >
    <FolderOpen className="h-4 w-4" />
    Evidências
  </Button>
</div>
```

---

### 6. **Menu Dropdown com Ações Rápidas**

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => handleViewDetails(turma)}>
      <Eye className="mr-2 h-4 w-4" />
      Ver Detalhes
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => handleManageAttendanceList(turma)}>
      <Download className="mr-2 h-4 w-4" />
      Lista de Presença em PDF
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => handleOpenReportsModal(turma)}>
      <FileText className="mr-2 h-4 w-4" />
      Relatórios
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => handleManageDocuments(turma)}>
      <FolderOpen className="mr-2 h-4 w-4" />
      Evidências
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### 7. **Transformação de Dados para Compatibilidade com Modais**

```typescript
// Transformar para formato compatível com modais (adicionar estruturas aninhadas esperadas)
const transformedClasses = response.classes.map((cls: ClientClass) => ({
  ...cls,
  training: {
    id: cls.trainingId,
    title: cls.trainingTitle,
    description: cls.trainingDescription || '',
    durationHours: cls.trainingDurationHours || 0,
    validityDays: cls.trainingValidityDays || 0
  },
  instructor: {
    id: cls.instructorId,
    name: cls.instructorName
  },
  client: cls.clientName ? {
    id: cls.clientId,
    name: cls.clientName,
    cnpj: cls.clientCnpj
  } : undefined,
  technicalResponsible: cls.technicalResponsibleName ? {
    name: cls.technicalResponsibleName,
    profession: cls.technicalResponsibleProfession
  } : undefined,
  students: cls.students || [],
  lessons: cls.lessons || []
}))
```

---

### 8. **Integração com Modais**

```tsx
{/* Modais */}
{detailsTurma && (
  <ClassDetailsModal
    isOpen={!!detailsTurma}
    onClose={() => setDetailsTurma(null)}
    turma={detailsTurma}
    onSuccess={() => loadTurmas()}
  />
)}

{attendanceListTurma && (
  <AttendanceListModal
    isOpen={!!attendanceListTurma}
    onClose={() => setAttendanceListTurma(null)}
    turma={attendanceListTurma}
  />
)}

{reportsModalTurma && (
  <ClassReportsModal
    isOpen={!!reportsModalTurma}
    onClose={() => setReportsModalTurma(null)}
    turma={reportsModalTurma}
    onOpenCompanyEvaluation={() => {}}
    onOpenEvidenceReport={() => {}}
    onOpenGrades={() => {}}
    onOpenPhotos={() => {}}
    onOpenTechnicalResponsible={() => {}}
    onOpenDocuments={() => handleManageDocuments(reportsModalTurma)}
    isClientView={true}
    generatingReport={false}
  />
)}

{documentsTurma && (
  <ClassDocumentsModal
    isOpen={!!documentsTurma}
    onClose={() => setDocumentsTurma(null)}
    turma={documentsTurma}
  />
)}
```

---

## 📊 Comparação Visual

### Layout Antigo vs Novo

| Aspecto | Antigo (3 colunas) | Novo (Cards expandidos) |
|---------|-------------------|-------------------------|
| **Cards por linha** | 3 | 1 (full width) |
| **Informações visíveis** | Básicas apenas | Completas + Detalhadas |
| **Badges** | Status apenas | Status + Tipo + Validade |
| **Ações** | Botão único | Dropdown + Botões na parte inferior |
| **Responsável Técnico** | Não exibido | Destacado em banner azul |
| **Localização** | Ícone pequeno | Seção de informações adicionais |
| **Empresa/Cliente** | Não destacado | Banner azul com CNPJ |

---

## 🎨 Sistema de Cores

### Badges de Status
- **Concluída**: `bg-green-100 text-green-800` (Verde)
- **Em Andamento**: `bg-blue-100 text-blue-800` (Azul)
- **Agendada**: `bg-yellow-100 text-yellow-800` (Amarelo)
- **Cancelada**: `bg-red-100 text-red-800` (Vermelho)
- **Expirado**: `bg-red-100 text-red-800` (Vermelho)
- **Expirando**: `bg-yellow-100 text-yellow-800` (Amarelo)

### Badges de Tipo
- **Presencial**: `border-blue-200 text-blue-700` (Azul)
- **EAD**: `border-purple-200 text-purple-700` (Roxo)
- **Híbrido**: `border-orange-200 text-orange-700` (Laranja)

### Botões de Ação
- **Detalhes**: `variant="outline"` (Cinza padrão)
- **Relatórios**: `border-amber-200 text-amber-700 hover:bg-amber-50` (Âmbar)
- **Evidências**: `border-blue-200 text-blue-700 hover:bg-blue-50` (Azul)

---

## 🔧 Funcionalidades Mantidas

- ✅ **Endpoint específico**: `/client-dashboard/classes`
- ✅ **Paginação**: 10 itens por página
- ✅ **Busca**: Com debounce de 500ms
- ✅ **Filtros**: Por status (implementável)
- ✅ **Modais**: Detalhes, Lista de Presença, Relatórios, Evidências
- ✅ **Validação**: Apenas usuários CLIENTE podem acessar
- ✅ **Loading states**: Skeleton screens durante carregamento

---

## 📁 Arquivos Modificados

### `components/client-classes-page.tsx`
- **Antes**: 574 linhas, layout grid 3 colunas
- **Depois**: 691 linhas, layout cards expandidos

### Estrutura do Componente
```
ClientClassesPage
├── Estados
│   ├── turmas (ClientClass[])
│   ├── currentPage, totalPages, totalTurmas
│   ├── loading, searchLoading
│   ├── searchTerm, clientName
│   └── Modais (details, attendance, reports, documents)
├── Funções
│   ├── loadTurmas() - Carrega dados do endpoint
│   ├── formatDate() - Formata datas em pt-BR
│   ├── calculateDuration() - Calcula dias entre datas
│   ├── calculateExpirationStatus() - Calcula status de validade
│   ├── getStatusColor() - Retorna classe CSS para status
│   ├── getTypeColor() - Retorna classe CSS para tipo
│   └── Handlers de modais
├── useEffect
│   ├── Carregamento por paginação
│   └── Busca com debounce
└── Render
    ├── Loading skeleton
    ├── Header + Busca
    ├── Cards das turmas
    ├── Paginação
    └── Modais
```

---

## 🚀 Benefícios do Redesign

### 1. **Experiência Unificada**
- Cliente e Admin veem informações no mesmo formato
- Facilita treinamento de usuários
- Reduz confusão entre interfaces

### 2. **Mais Informações Visíveis**
- Cards expandidos mostram tudo de uma vez
- Não precisa clicar para ver detalhes básicos
- Responsável técnico destacado

### 3. **Melhor Organização**
- Grid 4 colunas para informações principais
- Seção separada para informações adicionais
- Botões de ação agrupados logicamente

### 4. **Ações Mais Acessíveis**
- Dropdown para ações rápidas
- Botões grandes e descritivos
- Cores contextuais (âmbar para relatórios, azul para evidências)

### 5. **Feedback Visual Melhorado**
- Badge de expiração chama atenção
- Cores consistentes com significado
- Hover effects em cards

---

## 🧪 Testes Necessários

### Cenários de Teste

#### 1. Carregamento Inicial
```bash
1. Login como CLIENTE
2. Acessar "Minhas Turmas"
3. ✅ Verificar skeleton loading
4. ✅ Verificar cards carregam corretamente
5. ✅ Verificar todas as informações visíveis
```

#### 2. Badges e Cores
```bash
1. Verificar turmas com diferentes status
2. ✅ Concluída: verde
3. ✅ Em andamento: azul
4. ✅ Agendada: amarelo
5. ✅ Badge de expiração aparece quando apropriado
```

#### 3. Dropdown de Ações
```bash
1. Clicar no ícone de três pontos
2. ✅ Menu abre com 4 opções
3. ✅ Clicar em cada opção abre modal correto
```

#### 4. Botões de Ação
```bash
1. Clicar em "Detalhes"
2. ✅ ClassDetailsModal abre
3. Clicar em "Relatórios"
4. ✅ ClassReportsModal abre
5. Clicar em "Evidências"
6. ✅ ClassDocumentsModal abre
```

#### 5. Paginação
```bash
1. Verificar primeira página
2. ✅ Mostrar 10 turmas
3. Clicar em "Próxima"
4. ✅ Segunda página carrega
5. ✅ Contador atualiza: "Mostrando 11-20 de X"
```

#### 6. Busca
```bash
1. Digite no campo de busca
2. ✅ Aguardar 500ms (debounce)
3. ✅ Resultados filtrados aparecem
4. ✅ Contador atualiza com total encontrado
5. ✅ Limpar busca: botão X aparece
```

---

## 📝 Conclusão

O redesign do `ClientClassesPage` garante uma experiência visual consistente e profissional para clientes, alinhando o design com o `TurmasPage` usado por administradores, enquanto mantém o endpoint específico `/client-dashboard/classes` para segurança e filtragem adequada dos dados.

**Status:** ✅ **IMPLEMENTADO E FUNCIONAL**

---

## 🏷️ Tags

`#frontend` `#redesign` `#client-dashboard` `#ux` `#ui` `#typescript` `#nextjs` `#shadcn-ui` `#responsive-design`
