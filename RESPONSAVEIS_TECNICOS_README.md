# Responsáveis Técnicos - Sistema de Gerenciamento

## 📋 Visão Geral

Este sistema permite o gerenciamento completo de responsáveis técnicos, incluindo cadastro, edição, exclusão e upload de assinaturas digitais.

## 🔧 Como Acessar

1. **Via Menu Lateral**: Clique em "Responsáveis Técnicos" no menu lateral esquerdo
2. **Via URL Direta**: Acesse diretamente pela aba no sistema principal

## 🚀 Funcionalidades Implementadas

### ✅ Gerenciamento Básico
- **Listar** todos os responsáveis técnicos com paginação
- **Buscar** por nome, email, CPF ou profissão
- **Criar** novo responsável técnico
- **Editar** dados de responsável existente
- **Excluir** responsável técnico
- **Ativar/Desativar** status do responsável

### ✅ Upload de Assinatura
- **Upload** de assinatura digital (PNG, JPG, JPEG)
- **Validação** de formato e tamanho (máx. 5MB)
- **Substituição** automática de assinatura existente
- **Preview** da imagem antes do upload

### ✅ Validações Implementadas
- **CPF**: Único no sistema, formato com 11 dígitos
- **Email**: Único e formato válido
- **Campos obrigatórios**: Nome, email, CPF, profissão
- **Telefones**: Formatação automática
- **Arquivos**: Validação de tipo e tamanho

## 📊 Interface

### Tela Principal
- **Cards visuais** para cada responsável técnico
- **Badges** de status (Ativo/Inativo, Com/Sem Assinatura)
- **Busca em tempo real** com debounce
- **Paginação** completa com navegação
- **Estado vazio** com orientações

### Modais Disponíveis
1. **Criar**: Formulário completo de cadastro
2. **Editar**: Atualização de dados existentes
3. **Detalhes**: Visualização completa das informações
4. **Excluir**: Confirmação com avisos de segurança
5. **Upload**: Interface drag-and-drop para assinaturas

## 🔗 API Integrada

Todas as funções estão integradas com a API backend:

```typescript
// Principais endpoints utilizados
GET    /technical-responsible           // Listar com paginação
GET    /technical-responsible/active    // Listar apenas ativos
GET    /technical-responsible/:id       // Buscar por ID
POST   /technical-responsible           // Criar novo
PATCH  /technical-responsible/:id       // Atualizar
DELETE /technical-responsible/:id       // Excluir
POST   /technical-responsible/signature/upload  // Upload assinatura
PATCH  /technical-responsible/:id/toggle-status // Ativar/Desativar
```

## 🎨 Design System

- **Componentes UI**: Baseado no shadcn/ui
- **Ícones**: Lucide React
- **Cores**: Paleta consistente com o sistema
- **Responsivo**: Funciona em desktop e mobile
- **Acessibilidade**: Labels e navegação por teclado

## 📱 Responsividade

- **Desktop**: Layout em grid de 3 colunas
- **Tablet**: Layout em grid de 2 colunas  
- **Mobile**: Layout em coluna única
- **Modais**: Ajuste automático de altura

## 🔒 Permissões

O acesso é controlado pelas seguintes permissões:
- `VIEW_USERS`: Para visualizar responsáveis técnicos
- `CREATE_USERS`: Para criar novos responsáveis
- `EDIT_USERS`: Para editar e fazer upload de assinatura
- `DELETE_USERS`: Para excluir responsáveis

## 📄 Estrutura de Dados

```typescript
interface TechnicalResponsible {
  id: string
  name: string                 // Nome completo (obrigatório)
  email: string               // Email único (obrigatório)
  cpf: string                 // CPF único, 11 dígitos (obrigatório)
  rg?: string                 // RG (opcional)
  profession: string          // Profissão (obrigatório)
  professionalRegistry?: string // Registro profissional (opcional)
  phone?: string              // Telefone fixo (opcional)
  mobilePhone?: string        // Telefone celular (opcional)
  signaturePath?: string      // Caminho da assinatura (opcional)
  isActive: boolean           // Status ativo/inativo
  observations?: string       // Observações (opcional)
  createdAt: string          // Data de criação
  updatedAt: string          // Data de atualização
}
```

## 🛠️ Arquivos Criados

### Componentes Principais
- `components/technical-responsibles-page.tsx` - Página principal
- `components/technical-responsible-create-modal.tsx` - Modal de criação
- `components/technical-responsible-edit-modal.tsx` - Modal de edição
- `components/technical-responsible-details-modal.tsx` - Modal de detalhes
- `components/technical-responsible-delete-modal.tsx` - Modal de exclusão
- `components/technical-responsible-signature-upload-modal.tsx` - Modal upload

### API Integration
- Funções adicionadas em `lib/api/superadmin.ts`

### Navegação
- Menu atualizado em `components/sidebar.tsx`
- Menu adaptativo em `components/adaptive-sidebar.tsx`
- Roteamento em `app/page.tsx`

## 🎯 Próximos Passos

1. **Testes**: Implementar testes unitários e de integração
2. **Relatórios**: Adicionar relatórios de responsáveis técnicos
3. **Exportação**: Implementar exportação para Excel/PDF
4. **Importação**: Implementar importação em lote
5. **Auditoria**: Log de alterações e histórico

## 🚨 Notas Importantes

- **Backup**: Sempre fazer backup antes de exclusões
- **Validação**: CPF e email são únicos no sistema
- **Assinaturas**: Arquivos são validados no frontend e backend
- **Permissões**: Funcionalidade restrita a administradores
- **Performance**: Paginação implementada para grandes volumes

---

✅ **Sistema completamente funcional e pronto para uso!**
