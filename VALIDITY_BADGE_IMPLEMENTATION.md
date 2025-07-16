# Implementação do Badge de Validade das Turmas

## ✅ Funcionalidade Implementada

### Descrição
Foi implementada uma funcionalidade que calcula e exibe quando uma turma está próxima do vencimento, considerando o fim do período da turma e a quantidade de dias de validade do treinamento.

### Cálculo da Validade
- **Data de Vencimento**: Fim da turma + dias de validade do treinamento
- **Limite para "Próximo do Vencimento"**: 30 dias
- **Estados possíveis**:
  - **Expirado**: Quando a validade já passou
  - **Vencendo**: Quando restam 30 dias ou menos
  - **Normal**: Quando ainda há tempo suficiente (não exibe badge)

### Badge de Validade
O badge é exibido nos cards das turmas com as seguintes características:

#### Cores e Estados
- 🔴 **Vermelho** (`bg-red-100 text-red-800`): "Expirado"
- 🟡 **Amarelo** (`bg-yellow-100 text-yellow-800`): "Vence em X dia(s)"
- ⚫ **Não exibido**: Quando a validade está normal (mais de 30 dias)

## 📁 Arquivos Modificados

### 1. `/components/turmas-page.tsx`
- **Função adicionada**: `calculateExpirationStatus(turma: TurmaData)`
- **Função adicionada**: `getValidityBadgeColor(expirationStatus: any)`
- **Badge implementado**: Na linha dos badges de status e tipo

### 2. `/components/client-classes-page.tsx`
- **Função adicionada**: `calculateExpirationStatus(turma: any)`
- **Badge implementado**: Na página de turmas exclusiva para clientes

### 3. `/components/classes-page-new.tsx`
- **Função adicionada**: `calculateExpirationStatus(classItem: Class)`
- **Interface atualizada**: Adicionado `validityDays?` ao training
- **Badge implementado**: Na listagem de classes

### 4. `/components/certificates-page.tsx`
- **Função adicionada**: `calculateExpirationStatus(classItem: any)`
- **Badge implementado**: No cabeçalho dos cards de turma
- **Informações de validade**: Na seção de informações da turma
- **Badge individual**: Em cada card de estudante

## 🔧 Função de Cálculo

```typescript
const calculateExpirationStatus = (turma: TurmaData) => {
  const today = new Date()
  const endDate = new Date(turma.endDate)
  const validityDays = turma.training.validityDays
  
  // Calcular a data de vencimento da validade (fim da turma + dias de validade)
  const expirationDate = new Date(endDate)
  expirationDate.setDate(expirationDate.getDate() + validityDays)
  
  // Calcular a diferença em dias
  const diffTime = expirationDate.getTime() - today.getTime()
  const daysUntilExpiration = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return {
    daysUntilExpiration,
    isExpired: daysUntilExpiration <= 0,
    isExpiringSoon: daysUntilExpiration > 0 && daysUntilExpiration <= 30,
    expirationDate
  }
}
```

## 🎨 Implementação do Badge

```tsx
{(() => {
  const expirationStatus = calculateExpirationStatus(turma)
  if (expirationStatus.isExpired) {
    return (
      <Badge className="bg-red-100 text-red-800">
        Expirado
      </Badge>
    )
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

## 📋 Páginas Afetadas

1. **Turmas (Admin)**: `/components/turmas-page.tsx`
2. **Minhas Turmas (Cliente)**: `/components/client-classes-page.tsx`
3. **Classes (Nova)**: `/components/classes-page-new.tsx`
4. **Certificados**: `/components/certificates-page.tsx`

## 🎨 Implementação na Página de Certificados

### Badge no Cabeçalho da Turma
```tsx
{(() => {
  const expirationStatus = calculateExpirationStatus(classItem)
  if (expirationStatus.isExpired) {
    return (
      <Badge className="bg-red-100 text-red-800">
        Certificado Expirado
      </Badge>
    )
  } else if (expirationStatus.isExpiringSoon) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800">
        Expira em {expirationStatus.daysUntilExpiration} dia{expirationStatus.daysUntilExpiration !== 1 ? 's' : ''}
      </Badge>
    )
  }
  return null
})()}
```

### Informações de Validade na Seção da Turma
```tsx
<div className="flex items-center space-x-2">
  <Award className="h-4 w-4 text-gray-500" />
  <div>
    <p className="text-sm font-medium">Validade do Certificado</p>
    {(() => {
      const expirationStatus = calculateExpirationStatus(classItem)
      if (expirationStatus.isExpired) {
        return <p className="text-sm text-red-600 font-medium">Expirado</p>
      } else if (expirationStatus.isExpiringSoon) {
        return <p className="text-sm text-yellow-600 font-medium">Expira em {expirationStatus.daysUntilExpiration} dia{expirationStatus.daysUntilExpiration !== 1 ? 's' : ''}</p>
      } else {
        return <p className="text-sm text-green-600 font-medium">Válido por {expirationStatus.daysUntilExpiration} dia{expirationStatus.daysUntilExpiration !== 1 ? 's' : ''}</p>
      }
    })()}
  </div>
</div>
```

### Badge Individual para cada Estudante
```tsx
{(() => {
  const expirationStatus = calculateExpirationStatus(classItem)
  if (expirationStatus.isExpired) {
    return (
      <Badge className="bg-red-100 text-red-800 text-xs">
        Expirado
      </Badge>
    )
  } else if (expirationStatus.isExpiringSoon) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
        {expirationStatus.daysUntilExpiration}d
      </Badge>
    )
  } else {
    return (
      <Badge className="bg-green-100 text-green-800 text-xs">
        Válido
      </Badge>
    )
  }
})()}
```

## ⚙️ Configurações

### Limite de Vencimento
Para alterar o limite de dias para considerar "próximo do vencimento", modifique o valor `30` na condição:

```typescript
isExpiringSoon: daysUntilExpiration > 0 && daysUntilExpiration <= 30
```

### Fallback de Validade
Para turmas sem `validityDays` definido, o sistema usa 365 dias como fallback:

```typescript
const validityDays = turma.training?.validityDays || 365
```

## 🎯 Benefícios

1. **Visibilidade**: Fácil identificação de turmas próximas do vencimento
2. **Proatividade**: Permite ação antecipada para renovação/reciclagem
3. **Gestão**: Melhor controle sobre a validade dos treinamentos
4. **Conformidade**: Auxilia no cumprimento de requisitos regulatórios
5. **Certificados**: Identificação clara do status de validade dos certificados

## 🏆 Funcionalidades Específicas dos Certificados

### Estados dos Certificados
- **Válido**: Certificado ainda dentro da validade (badge verde)
- **Expirando**: Certificado próximo do vencimento (badge amarelo com dias restantes)
- **Expirado**: Certificado vencido (badge vermelho)

### Indicadores Visuais
- **Badge no cabeçalho**: Mostra o status geral da turma
- **Informações detalhadas**: Seção específica com informações de validade
- **Badge individual**: Cada estudante tem seu próprio indicador de validade

### Textos Contextuais
- **Certificado Expirado**: Para certificados vencidos
- **Expira em X dias**: Para certificados próximos do vencimento
- **Válido por X dias**: Para certificados ainda válidos
- **Xd**: Versão compacta mostrando apenas os dias restantes

## 🚀 Próximos Passos (Futuro)

- [ ] Notificações automáticas por email
- [ ] Relatório de turmas vencendo
- [ ] Filtros por status de validade
- [ ] Dashboard com métricas de validade
- [ ] Integração com sistema de reciclagem automática
