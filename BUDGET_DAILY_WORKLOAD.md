# Implementação do Campo `dailyWorkload` nos Orçamentos

## Resumo
Foi adicionado um novo campo opcional `dailyWorkload` (Carga Horária Diária) aos orçamentos, permitindo que os usuários especifiquem informações sobre a carga horária diária do treinamento.

## Mudanças Implementadas

### 1. Frontend - TypeScript Types (`lib/api/budgets.ts`)

#### Atualização das Interfaces

**CreateBudgetRequest**
```typescript
export interface CreateBudgetRequest {
  // ... campos existentes
  dailyWorkload?: string  // ← NOVO CAMPO
  items: BudgetItemRequest[]
}
```

**UpdateBudgetRequest**
```typescript
export interface UpdateBudgetRequest {
  // ... campos existentes
  dailyWorkload?: string  // ← NOVO CAMPO
  items?: BudgetItemRequest[]
}
```

**BudgetResponse**
```typescript
export interface BudgetResponse {
  // ... campos existentes
  dailyWorkload?: string  // ← NOVO CAMPO
  createdBy?: string
  // ... mais campos
}
```

### 2. Frontend - Componente de UI (`components/budget-create-modal.tsx`)

#### Estado do Formulário
O campo `dailyWorkload` foi adicionado ao estado inicial do formulário:

```typescript
const [formData, setFormData] = useState<CreateBudgetRequest>({
  // ... campos existentes
  dailyWorkload: "",
  items: []
})
```

#### Campo de Input
Um novo campo foi adicionado ao formulário, após o campo "Data do Treinamento":

```tsx
<div>
  <Label htmlFor="dailyWorkload">Carga Horária Diária</Label>
  <Input
    id="dailyWorkload"
    value={formData.dailyWorkload || ""}
    onChange={(e) => handleInputChange("dailyWorkload", e.target.value)}
    placeholder="Ex: 8h por dia, 4h (manhã) + 4h (tarde)"
  />
</div>
```

#### Carregamento de Dados
O campo é populado quando um orçamento existente é carregado:

```typescript
setFormData({
  // ... campos existentes
  dailyWorkload: response.dailyWorkload || "",
  items: []
})
```

### 3. Next.js API Routes (Referência/Mock)

Foram atualizados os tipos e handlers nas rotas de API do Next.js:

- `/app/api/budgets/route.ts` (POST)
- `/app/api/budgets/[id]/route.ts` (PUT)

**Nota:** Essas rotas são principalmente para referência, pois o frontend se comunica diretamente com o backend NestJS em `https://api.olimpustech.com`.

## Requisitos para o Backend NestJS

### 1. Atualizar o Schema do Banco de Dados

Adicione a coluna `dailyWorkload` à tabela de orçamentos (provavelmente `Budget` ou `Budgets`):

```sql
ALTER TABLE budgets 
ADD COLUMN dailyWorkload VARCHAR(255) NULL;
```

Ou usando Prisma/TypeORM:

**Prisma Schema**
```prisma
model Budget {
  // ... campos existentes
  dailyWorkload     String?
  // ... mais campos
}
```

**TypeORM Entity**
```typescript
@Entity('budgets')
export class Budget {
  // ... campos existentes
  
  @Column({ type: 'varchar', length: 255, nullable: true })
  dailyWorkload?: string;
  
  // ... mais campos
}
```

### 2. Atualizar DTOs (Data Transfer Objects)

**CreateBudgetDto**
```typescript
export class CreateBudgetDto {
  // ... campos existentes
  
  @IsOptional()
  @IsString()
  @MaxLength(255)
  dailyWorkload?: string;
  
  // ... mais campos
}
```

**UpdateBudgetDto**
```typescript
export class UpdateBudgetDto {
  // ... campos existentes
  
  @IsOptional()
  @IsString()
  @MaxLength(255)
  dailyWorkload?: string;
  
  // ... mais campos
}
```

### 3. Atualizar Controllers e Services

O campo será automaticamente incluído nas operações se:
- Os DTOs estiverem atualizados
- O schema do banco de dados estiver atualizado
- O mapeamento entity-to-response estiver correto

**Exemplo de Controller (se necessário mapear explicitamente):**
```typescript
@Post()
async create(@Body() createBudgetDto: CreateBudgetDto) {
  return this.budgetsService.create({
    ...createBudgetDto,
    dailyWorkload: createBudgetDto.dailyWorkload || null
  });
}

@Patch(':id')
async update(
  @Param('id') id: string,
  @Body() updateBudgetDto: UpdateBudgetDto
) {
  return this.budgetsService.update(id, updateBudgetDto);
}
```

## Exemplos de Uso da API

### Criar Orçamento com Carga Horária

```bash
POST https://api.olimpustech.com/budgets
Content-Type: application/json

{
  "title": "Orçamento NR-35",
  "clientId": "uuid-do-cliente",
  "items": [
    {
      "trainingId": "uuid-treinamento",
      "quantity": 1,
      "unitPrice": 150.00
    }
  ],
  "dailyWorkload": "8h por dia"
}
```

### Atualizar Apenas a Carga Horária

```bash
PATCH https://api.olimpustech.com/budgets/:id
Content-Type: application/json

{
  "dailyWorkload": "4h (manhã) + 4h (tarde)"
}
```

### Listar Orçamento (resposta incluirá dailyWorkload)

```bash
GET https://api.olimpustech.com/budgets/:id

Response:
{
  "id": "uuid",
  "title": "Orçamento NR-35",
  "clientId": "uuid-do-cliente",
  "clientName": "Nome do Cliente",
  "dailyWorkload": "8h por dia",
  "totalValue": 150.00,
  // ... outros campos
}
```

## Comportamento do Campo

- **Tipo:** String (texto livre)
- **Obrigatoriedade:** Opcional (pode ser vazio ou null)
- **Tamanho Máximo:** 255 caracteres (recomendado)
- **Exemplos de valores:**
  - "8h por dia"
  - "4h (manhã) + 4h (tarde)"
  - "6 horas diárias"
  - "8:00 às 12:00 e 13:00 às 17:00"

## Validações

- Campo é opcional, não requer validação obrigatória
- Se fornecido, deve ser uma string
- Recomenda-se limite de 255 caracteres no banco de dados
- Não há formatação específica requerida - é texto livre

## Testes Sugeridos

1. **Criar orçamento com dailyWorkload**
   - Verificar se o campo é salvo corretamente
   
2. **Criar orçamento sem dailyWorkload**
   - Verificar que funciona normalmente com campo vazio/null
   
3. **Atualizar dailyWorkload de orçamento existente**
   - Verificar que apenas este campo é atualizado via PATCH
   
4. **Listar orçamentos**
   - Verificar que o campo é retornado na resposta
   
5. **Editar orçamento completo**
   - Verificar que o dailyWorkload é mantido/atualizado corretamente

## Checklist de Implementação Backend

- [ ] Adicionar coluna `dailyWorkload` ao schema do banco de dados
- [ ] Executar migration do banco de dados
- [ ] Atualizar `CreateBudgetDto` com campo `dailyWorkload`
- [ ] Atualizar `UpdateBudgetDto` com campo `dailyWorkload`
- [ ] Atualizar entity `Budget` (se TypeORM/Prisma)
- [ ] Verificar que o campo é retornado nas respostas da API
- [ ] Testar criação de orçamento com o novo campo
- [ ] Testar atualização parcial (PATCH) do campo
- [ ] Testar que funciona com campo vazio/null

## Notas Adicionais

- O campo foi implementado como texto livre para dar flexibilidade ao usuário
- Pode ser usado para descrever horários, turnos, ou qualquer informação sobre a carga horária
- Não afeta cálculos ou lógica de negócio, é apenas informativo
- Se no futuro for necessário parsing ou validação específica, considere usar um formato estruturado (JSON) ou campos separados

## Data de Implementação
13 de novembro de 2025
