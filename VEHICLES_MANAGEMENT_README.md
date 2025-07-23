# Sistema de Gerenciamento de Veículos

Este módulo implementa um sistema completo de gerenciamento de veículos para autoescolas, baseado na API de veículos dos instrutores.

## Funcionalidades Implementadas

### 1. Página Principal de Veículos (`vehicles-page.tsx`)
- **Listagem completa** de todos os veículos cadastrados
- **Cards estatísticos** com métricas importantes:
  - Total de veículos
  - Veículos ativos
  - Veículos inativos  
  - Número de instrutores com veículos
- **Sistema de filtros avançados**:
  - Busca por marca, modelo, placa ou instrutor
  - Filtro por categoria (A, B, C, D, E)
  - Filtro por status (ativo/inativo)
  - Busca específica por placa
- **Paginação** para grandes volumes de dados
- **Layout responsivo** com cards informativos
- **Interface intuitiva** com ações rápidas

### 2. Modal de Criação (`vehicle-create-modal.tsx`)
- **Formulário completo** com todos os campos obrigatórios
- **Validações em tempo real**:
  - Formato da placa (ABC-1234 ou ABC1D23 Mercosul)
  - RENAVAM com 11 dígitos
  - Número do chassi com 17 caracteres
  - Ano válido
- **Seleção de instrutor** com carregamento dinâmico
- **Formatação automática** de campos (placa, RENAVAM)
- **Tratamento de erros** específicos da API

### 3. Modal de Edição (`vehicle-edit-modal.tsx`)
- **Carregamento automático** dos dados do veículo
- **Edição de todos os campos** exceto o instrutor responsável
- **Função de ativar/desativar** veículo
- **Validações consistentes** com o formulário de criação
- **Feedback visual** do status atual

### 4. Modal de Detalhes (`vehicle-details-modal.tsx`)
- **Visualização completa** das informações do veículo
- **Formatação adequada** de dados (placa, RENAVAM, datas)
- **Informações do instrutor** responsável
- **Histórico de datas** (criação e atualização)
- **Layout organizado** em seções

### 5. Modal de Exclusão (`vehicle-delete-modal.tsx`)
- **Confirmação segura** com avisos visuais
- **Informações do veículo** a ser excluído
- **Alertas sobre consequências** da exclusão
- **Sugestão de alternativa** (desativação)
- **Interface clara** para evitar exclusões acidentais

## Estrutura da API

### Endpoints Utilizados
- `POST /instructors/{instructorId}/vehicles` - Criar veículo
- `GET /instructors/vehicles` - Listar todos os veículos
- `GET /instructors/vehicles/{vehicleId}` - Buscar veículo por ID
- `PUT /instructors/vehicles/{vehicleId}` - Atualizar veículo
- `PATCH /instructors/vehicles/{vehicleId}/toggle-status` - Ativar/desativar
- `GET /instructors/vehicles/category/{category}` - Buscar por categoria
- `GET /instructors/vehicles/search/license-plate?plate={plate}` - Buscar por placa
- `DELETE /instructors/vehicles/{vehicleId}` - Excluir veículo

### Interfaces TypeScript
```typescript
interface Vehicle {
  id: string
  instructorId: string
  brand: string
  model: string
  year: number
  licensePlate: string
  color: string
  renavam: string
  chassisNumber: string
  fuelType: string
  category: 'A' | 'B' | 'C' | 'D' | 'E'
  isActive: boolean
  observations?: string
  createdAt: string
  updatedAt: string
  instructor?: {
    id: string
    name: string
    email: string
  }
}
```

## Validações Implementadas

### Placa do Veículo
- **Formato antigo**: ABC-1234 (3 letras + hífen + 4 números)
- **Formato Mercosul**: ABC1D23 (3 letras + 1 número + 1 letra + 2 números)
- **Formatação automática** aplicada durante a digitação

### RENAVAM
- **11 dígitos** obrigatórios
- **Formatação visual**: XX.XXX.XXX.XXX
- **Validação em tempo real**

### Número do Chassi
- **17 caracteres** alfanuméricos
- **Conversão automática** para maiúsculas
- **Validação de comprimento**

### Categorias CNH
- **A**: Motocicletas
- **B**: Automóveis
- **C**: Caminhões
- **D**: Ônibus  
- **E**: Carreta

## Permissões e Navegação

### Acesso ao Menu
- **Superadmin**: Acesso completo
- **Instructores**: Acesso completo (podem gerenciar seus veículos)
- **Clientes**: SEM acesso (menu oculto)

### Funcionalidades por Tipo de Usuário
- **Superadmin**: CRUD completo, visualiza todos os veículos
- **Instructores**: CRUD dos próprios veículos
- **Clientes**: Sem acesso

## Recursos Técnicos

### Sistema de Toast
- Utiliza `useToast` hook do projeto
- Feedback para todas as ações (criar, editar, excluir)
- Tratamento de erros específicos da API

### Responsividade
- **Layout adaptativo** para diferentes tamanhos de tela
- **Cards responsivos** na listagem
- **Formulários otimizados** para mobile
- **Navegação touch-friendly**

### Performance
- **Paginação** para grandes volumes
- **Debounce** na busca por texto
- **Carregamento otimizado** de instrutores
- **Estados de loading** em todas as operações

## Como Usar

### Acessar o Sistema
1. Faça login como superadmin ou instrutor
2. No menu lateral, clique em "Veículos" (ícone de carro)
3. A página principal será exibida com estatísticas e filtros

### Cadastrar Novo Veículo
1. Clique no botão "Novo Veículo" no canto superior direito
2. Selecione o instrutor responsável
3. Preencha todos os campos obrigatórios
4. Clique em "Cadastrar Veículo"

### Buscar Veículos
- **Por texto**: Digite marca, modelo, placa ou nome do instrutor
- **Por categoria**: Use o filtro dropdown de categoria
- **Por status**: Filtre por ativos/inativos
- **Por placa específica**: Use o botão de busca para busca exata

### Gerenciar Veículo
- **Visualizar**: Clique no ícone de olho para ver detalhes completos
- **Editar**: Clique no ícone de lápis para modificar informações
- **Excluir**: Clique no ícone de lixeira (com confirmação de segurança)

## Tratamento de Erros

### Erros Comuns
- **409 - Conflict**: Placa já cadastrada
- **404 - Not Found**: Instrutor não encontrado
- **400 - Bad Request**: Dados inválidos

### Validações em Tempo Real
- Formato da placa
- Comprimento do RENAVAM e chassi
- Ano válido
- Campos obrigatórios

## Integração com Sistema Existente

### Navegação
- Integrado no `adaptive-sidebar.tsx`
- Respeitando permissões do usuário
- Rota configurada no `app/page.tsx`

### API
- Utiliza o cliente API existente (`lib/api/superadmin.ts`)
- Consistent error handling
- Seguindo padrões do projeto

### UI/UX
- Utiliza componentes shadcn/ui
- Mantém consistência visual
- Ícones lucide-react
- Toast notifications

## Melhorias Futuras Sugeridas

1. **Filtro por instrutor específico**
2. **Importação em lote via CSV**
3. **Histórico de manutenções**
4. **Upload de fotos dos veículos**
5. **Integração com agendamento de aulas**
6. **Relatórios de utilização**
7. **Notificações de vencimento de documentos**

---

**Status**: ✅ Implementação completa e funcional
**Última atualização**: 22/07/2025
