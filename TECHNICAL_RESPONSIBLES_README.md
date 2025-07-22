# Sistema de Responsáveis Técnicos

## 📋 Visão Geral

Este sistema permite o gerenciamento completo de responsáveis técnicos, incluindo engenheiros de segurança do trabalho, médicos do trabalho, e outros profissionais qualificados que podem assinar documentos e certificados.

## 🚀 Funcionalidades Implementadas

### ✅ CRUD Completo
- **Criar** responsável técnico com validações
- **Listar** com paginação e busca
- **Visualizar** detalhes completos
- **Editar** informações
- **Excluir** com confirmação

### ✅ Upload de Assinatura Digital
- Upload de imagens (PNG, JPG, JPEG)
- Validação de tipo e tamanho (máx. 5MB)
- Preview da imagem
- Drag & drop suportado

### ✅ Busca e Filtros
- Busca por nome, email, CPF ou profissão
- Paginação otimizada
- Debounce automático

### ✅ Interface Moderna
- Design responsivo
- Cards com informações visuais
- Estados de loading
- Feedback visual para ações

## 📁 Arquivos Criados

### Componentes Principais
- `components/technical-responsibles-page.tsx` - Página principal
- `components/technical-responsible-create-modal.tsx` - Modal de criação
- `components/technical-responsible-edit-modal.tsx` - Modal de edição
- `components/technical-responsible-details-modal.tsx` - Modal de detalhes
- `components/technical-responsible-delete-modal.tsx` - Modal de exclusão
- `components/technical-responsible-signature-upload-modal.tsx` - Upload de assinatura

### API Functions
- Funções adicionadas em `lib/api/superadmin.ts`:
  - `getTechnicalResponsibles()` - Listar com paginação
  - `getActiveTechnicalResponsibles()` - Listar apenas ativos
  - `getTechnicalResponsibleById()` - Buscar por ID
  - `createTechnicalResponsible()` - Criar novo
  - `updateTechnicalResponsible()` - Atualizar
  - `deleteTechnicalResponsible()` - Excluir
  - `toggleTechnicalResponsibleStatus()` - Ativar/Desativar
  - `uploadTechnicalResponsibleSignature()` - Upload de assinatura

### Página de Rota
- `app/(app)/technical-responsibles/page.tsx` - Rota da página

## 🔧 Como Usar

### 1. Acessar a Página
Navegue para `/technical-responsibles` no sistema ou adicione um link no menu principal.

### 2. Criar Responsável Técnico
1. Clique em "Novo Responsável Técnico"
2. Preencha os campos obrigatórios:
   - Nome completo
   - Email (único)
   - CPF (único, 11 dígitos)
   - Profissão
3. Campos opcionais:
   - RG
   - Registro profissional (CREA, CRM, etc.)
   - Telefones
   - Observações
4. Clique em "Criar Responsável Técnico"

### 3. Upload de Assinatura
1. Na lista de responsáveis, clique em "Assinatura"
2. Selecione ou arraste uma imagem (PNG, JPG, JPEG)
3. Visualize o preview
4. Clique em "Enviar Assinatura"

### 4. Gerenciar Responsáveis
- **Visualizar**: Clique em "Detalhes" para ver todas as informações
- **Editar**: Clique em "Editar" para modificar dados
- **Excluir**: Clique em "Deletar" com confirmação

### 5. Buscar e Filtrar
- Use a barra de busca para encontrar por nome, email, CPF ou profissão
- Navegue pelas páginas usando os controles de paginação

## 🎯 Integração com o Sistema

### Adicionar ao Menu Principal
Para adicionar ao menu principal do sistema, adicione este item na configuração do menu:

```tsx
{
  title: "Responsáveis Técnicos",
  href: "/technical-responsibles",
  icon: Briefcase,
  description: "Gerencie responsáveis técnicos e assinaturas"
}
```

### Usar em Certificados
Para integrar com o sistema de certificados, use as funções da API:

```tsx
import { getActiveTechnicalResponsibles } from "@/lib/api/superadmin"

// Listar responsáveis ativos para seleção
const activeTechnicalResponsibles = await getActiveTechnicalResponsibles()

// Buscar assinatura de um responsável específico
const technicalResponsible = await getTechnicalResponsibleById(id)
if (technicalResponsible.signaturePath) {
  // Usar a assinatura no certificado
}
```

## 📊 Modelo de Dados

```typescript
interface TechnicalResponsible {
  id: string                    // ID único
  name: string                  // Nome completo
  email: string                 // Email (único)
  cpf: string                   // CPF (único, 11 dígitos)
  rg?: string                   // RG (opcional)
  profession: string            // Profissão
  professionalRegistry?: string // Registro profissional
  phone?: string                // Telefone fixo
  mobilePhone?: string          // Telefone celular
  signaturePath?: string        // Caminho da assinatura
  isActive: boolean             // Status ativo/inativo
  observations?: string         // Observações
  createdAt: string             // Data de criação
  updatedAt: string             // Data de atualização
}
```

## 🔒 Validações Implementadas

### Campos Obrigatórios
- Nome (1-255 caracteres)
- Email (formato válido e único)
- CPF (11 dígitos numéricos e único)
- Profissão (1-255 caracteres)

### Validações Automáticas
- Email único no sistema
- CPF único e formato válido
- Formato de email válido
- Tamanho de arquivo para assinatura (máx. 5MB)
- Tipos de arquivo para assinatura (PNG, JPG, JPEG)

## 🎨 Estados Visuais

### Cards de Responsáveis
- **Badge Verde**: Responsável ativo
- **Badge Vermelho**: Responsável inativo
- **Badge "Com Assinatura"**: Possui assinatura digital
- **Ícones Coloridos**: Diferentes tipos de informação

### Feedback de Ações
- **Toast de Sucesso**: Ações realizadas com sucesso
- **Toast de Erro**: Validações e erros de API
- **Loading States**: Indicadores de carregamento
- **Estados Vazios**: Mensagens quando não há dados

## 🔧 Personalização

### Adicionar Novos Campos
Para adicionar novos campos, edite:
1. Interface `TechnicalResponsible` em `lib/api/superadmin.ts`
2. Formulários nos modais de criação e edição
3. Visualização no modal de detalhes

### Customizar Validações
Edite as funções de validação nos modais de criação e edição:
- Adicione novas regras de negócio
- Modifique mensagens de erro
- Ajuste formatos de campos

### Estilização
Todos os componentes usam Tailwind CSS e seguem o design system do projeto:
- Cores: baseadas no tema do sistema
- Espacamentos: consistentes com outros componentes
- Responsividade: adaptável a diferentes telas

## 📚 Exemplos de Uso

### Profissionais Comuns
- **Engenheiro de Segurança do Trabalho** (CREA)
- **Médico do Trabalho** (CRM)
- **Técnico em Segurança do Trabalho** (Registro Técnico)
- **Engenheiro Civil** (CREA)

### Casos de Uso
1. **Certificados de Treinamento**: Assinatura de engenheiro responsável
2. **Laudos Técnicos**: Assinatura de profissional habilitado
3. **Documentos Oficiais**: Validação por responsável técnico
4. **Relatórios de Segurança**: Aprovação técnica

## 🚀 Próximos Passos

### Melhorias Sugeridas
1. **Exportação em Excel** - Exportar lista de responsáveis
2. **Importação em Lote** - Importar múltiplos responsáveis
3. **Histórico de Alterações** - Log de modificações
4. **Integração com E-signature** - Assinatura eletrônica
5. **Validação de Documentos** - Verificar registros profissionais

### Integrações
1. **Sistema de Certificados** - Usar assinaturas automaticamente
2. **Workflow de Aprovação** - Processo de validação
3. **Notificações** - Alertas para vencimentos de registro
4. **Dashboard Analytics** - Estatísticas de uso

## 🆘 Troubleshooting

### Problemas Comuns

**1. Erro 409 (Conflict)**
- Email ou CPF já cadastrado
- Verificar dados únicos antes de criar

**2. Erro 400 (Bad Request)**
- Dados inválidos no formulário
- Verificar validações de formato

**3. Upload de Assinatura Falha**
- Verificar tamanho do arquivo (máx. 5MB)
- Verificar formato (PNG, JPG, JPEG)

**4. Responsável Não Encontrado**
- ID inválido ou responsável excluído
- Verificar se ainda existe no sistema

### Logs de Debug
- Todos os erros são logados no console
- Mensagens de erro específicas para cada caso
- Feedback visual para o usuário

---

## 💡 Dicas de Implementação

1. **Teste a API** primeiro para garantir conectividade
2. **Configure permissões** adequadas para cada tipo de usuário
3. **Valide dados** tanto no frontend quanto no backend
4. **Use estados de loading** para melhor UX
5. **Implemente fallbacks** para casos de erro

Este sistema está pronto para uso em produção e pode ser facilmente integrado ao fluxo de trabalho existente! 🎉
