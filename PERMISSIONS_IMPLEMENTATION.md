# Implementação de Sistema de Permissões

## Resumo das Modificações

Esta implementação adiciona um sistema completo de permissões ao sistema de gerenciamento de treinamentos, fazendo uma requisição para buscar as permissões do usuário após o login e armazenando-as em cookies.

## Arquivos Modificados

### 1. `/lib/api/auth.ts`
- **Novas funções adicionadas:**
  - `getUserPermissions()`: Faz requisição para `/auth/permissions` para buscar permissões do usuário
  - `savePermissionsToCookie()`: Salva permissões no cookie `PERMISSIONS`
  - `getPermissionsFromCookie()`: Recupera permissões do cookie
  - `getClientClasses()`: Faz requisição para `/superadmin/my-classes` para buscar apenas as turmas da empresa do cliente

- **Modificações na função `login()`:**
  - Após login bem-sucedido, faz automaticamente a requisição para `/auth/permissions`
  - Salva as permissões no cookie `PERMISSIONS`
  - Não bloqueia o login se a requisição de permissões falhar

- **Modificações na função `logout()`:**
  - Remove o cookie `PERMISSIONS` ao fazer logout

### 2. `/hooks/use-auth.tsx`
- **Novas interfaces:**
  - `Permission`: Interface para representar uma permissão com `id`, `name` e `description`
  - `AuthContextType`: Atualizada para incluir `permissions` e `hasPermission`

- **Novo estado:**
  - `permissions`: Array de permissões do usuário
  - `hasPermission()`: Função para verificar se o usuário tem uma permissão específica
  - `isClient`: Boolean que indica se o usuário é do tipo "CLIENTE"

- **Novas funções:**
  - `getClientClasses()`: Função para buscar turmas do cliente

- **Modificações na função `checkAuth()`:**
  - Carrega permissões do cookie ao verificar autenticação
  - Se não houver permissões no cookie, tenta buscar da API
  - Limpa permissões ao fazer logout

### 3. `/components/adaptive-sidebar.tsx`
- **Modificações na exibição do perfil:**
  - Agora mostra a quantidade de permissões do usuário
  - Exibe o nome da role do usuário de forma mais precisa
  - Conecta o botão "Sair" com a função de logout

- **Modificações no menu:**
  - Quando `isClient = true`, mostra apenas:
    - Dashboard
    - Minhas Turmas
    - Certificados
    - Configurações

### 4. `/components/dashboard-content.tsx`
- **Exemplo de uso de permissões:**
  - Botões do header são renderizados condicionalmente baseado nas permissões
  - Demonstra como usar a função `hasPermission()` na prática

### 5. `/components/permissions-debug.tsx` (Novo)
- **Componente de debug:**
  - Mostra informações detalhadas sobre o usuário e suas permissões
  - Lista todas as permissões do usuário
  - Testa permissões específicas com feedback visual
  - Inclui exemplos de código para uso

### 6. `/components/client-dashboard.tsx` (Novo):
- **Dashboard específico para clientes**
- Mostra estatísticas das turmas da empresa
- Exibe turmas recentes e próximos eventos
- Informações da empresa
- Ações rápidas para funcionalidades do cliente

### 7. `/components/client-classes-page.tsx` (Novo):
- **Página "Minhas Turmas"** exclusiva para clientes
- Lista apenas as turmas da empresa do cliente
- Estatísticas específicas (total de turmas, alunos, certificados)
- Detalhes de cada turma (status, instrutor, local, etc.)
- Funcionalidade de busca e filtros

## Fluxo de Funcionamento

### Login
1. Usuário faz login com email/senha
2. Sistema recebe JWT token
3. **Nova funcionalidade:** Sistema faz automaticamente requisição para `/auth/permissions` usando o token
4. Permissões são salvas no cookie `PERMISSIONS`
5. Usuário é redirecionado para dashboard

### Verificação de Permissões
1. Hook `useAuth` carrega permissões do cookie ao inicializar
2. Se não houver permissões no cookie, tenta buscar da API
3. Função `hasPermission(permissionName)` verifica se usuário tem permissão específica
4. Componentes renderizam condicionalmente baseado nas permissões

### Logout
1. Usuário clica em "Sair"
2. Sistema faz requisição para `/auth/logout`
3. Todos os cookies são removidos (incluindo `PERMISSIONS`)
4. Usuário é redirecionado para login

## Estrutura da Resposta da API

```json
{
  "user": {
    "id": "cmcxv2jym006gvbxlprgrthvw",
    "name": "Super Admin",
    "email": "admin@sistema.com",
    "role": {
      "id": "cmcxv2jve001dvbxlngd0jium",
      "name": "DIRETOR",
      "description": "Administrador com acesso total"
    }
  },
  "permissions": [
    {
      "id": "cmcxv2jux000kvbxlw5txdweb",
      "name": "VIEW_OWN_CERTIFICATES",
      "description": "Visualizar Apenas Certificados de Treinamentos Ministrados por Ele"
    },
    {
      "id": "cmcxv2jv1000qvbxlbwucxrny",
      "name": "DELETE_REPORTS",
      "description": "Excluir Relatórios"
    }
  ]
}
```

## Como Usar as Permissões

### 1. Verificar Permissão em Componente
```tsx
import { useAuth } from "@/hooks/use-auth"

function MyComponent() {
  const { hasPermission } = useAuth()
  
  return (
    <div>
      {hasPermission('VIEW_REPORTS') && (
        <Button>Ver Relatórios</Button>
      )}
      
      {hasPermission('DELETE_REPORTS') && (
        <Button variant="destructive">Excluir Relatório</Button>
      )}
    </div>
  )
}
```

### 2. Acessar Lista de Permissões
```tsx
import { useAuth } from "@/hooks/use-auth"

function PermissionsList() {
  const { permissions } = useAuth()
  
  return (
    <div>
      <h3>Suas Permissões:</h3>
      {permissions.map(permission => (
        <div key={permission.id}>
          <strong>{permission.name}</strong>
          <p>{permission.description}</p>
        </div>
      ))}
    </div>
  )
}
```

### 3. Informações do Usuário
```tsx
import { useAuth } from "@/hooks/use-auth"

function UserInfo() {
  const { user } = useAuth()
  
  return (
    <div>
      <p>Nome: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role?.name}</p>
    </div>
  )
}
```

### 4. Funcionalidades Específicas para Clientes

#### 🏢 **Tipo de Usuário: CLIENTE**

Para usuários do tipo "CLIENTE", o sistema agora oferece funcionalidades específicas:

- **`getClientClasses()`**: Função para buscar turmas do cliente

#### **Fluxo para Clientes:**

1. **Login como CLIENTE**
   - Sistema detecta `user.role.name === 'CLIENTE'`
   - `isClient = true` no contexto
   - Menu lateral adaptado para clientes

2. **Dashboard do Cliente**
   - Carrega automaticamente as turmas via `getClientClasses()`
   - Mostra estatísticas específicas da empresa
   - Exibe próximos eventos e turmas recentes

3. **Página "Minhas Turmas"**
   - Faz requisição para `/superadmin/my-classes`
   - Lista apenas turmas da empresa do cliente
   - Permite visualizar detalhes e baixar certificados

#### **Estrutura da Resposta `/superadmin/my-classes`:**

```json
{
  "classes": [
    {
      "id": "class_id",
      "name": "Nome da Turma",
      "description": "Descrição da turma",
      "status": "ATIVO",
      "startDate": "2024-01-15",
      "duration": "40h",
      "location": "Sala 101",
      "instructor": {
        "name": "Nome do Instrutor"
      },
      "training": {
        "name": "Nome do Treinamento"
      },
      "students": [
        {
          "id": "student_id",
          "name": "Nome do Aluno"
        }
      ],
      "certificates": [
        {
          "id": "cert_id",
          "studentName": "Nome do Aluno"
        }
      ]
    }
  ]
}
```

#### **Verificação de Acesso:**

```tsx
// Verificar se usuário é cliente
const { isClient } = useAuth()

// Renderização condicional
{isClient && <ClientSpecificContent />}

// Buscar turmas do cliente
const classes = await getClientClasses()
```

#### **Funcionalidades Exclusivas do Cliente:**

1. **Visualização Restrita**
   - Apenas turmas da própria empresa
   - Dados filtrados automaticamente pelo backend

2. **Dashboard Personalizado**
   - Estatísticas específicas da empresa
   - Próximos eventos da empresa
   - Informações da empresa

3. **Menu Simplificado**
   - Apenas funcionalidades relevantes para clientes
   - Interface mais limpa e focada

4. **Relatórios Específicos**
   - Relatórios apenas das turmas da empresa
   - Certificados dos funcionários da empresa

#### **Segurança:**

- Endpoint `/superadmin/my-classes` já filtra por empresa no backend
- Frontend apenas exibe dados já filtrados
- Verificação de tipo de usuário em múltiplas camadas

#### **Exemplo de Uso:**

```tsx
import { useAuth } from "@/hooks/use-auth"

function MyComponent() {
  const { isClient, getClientClasses } = useAuth()
  
  useEffect(() => {
    if (isClient) {
      getClientClasses().then(classes => {
        console.log('Turmas da empresa:', classes)
      })
    }
  }, [isClient])
  
  return (
    <div>
      {isClient ? (
        <ClientDashboard />
      ) : (
        <RegularDashboard />
      )}
    </div>
  )
}
```

### 🎯 **Hierarquia Atualizada:**

#### 🏢 **CLIENTE (Novo)**
- Acesso restrito às próprias turmas da empresa
- Dashboard personalizado com dados da empresa
- Menu simplificado
- Funcionalidades específicas:
  - `getClientClasses()` - buscar turmas da empresa
  - Página "Minhas Turmas"
  - Relatórios da empresa
  - Certificados dos funcionários

#### 🏢 **DIRETOR (Acesso Total)**
- Todas as permissões do sistema
- Acesso completo a dados financeiros
- Gerenciamento de usuários e funções

#### 👨‍💼 **ADMINISTRADOR**
- Permissões de gerenciamento geral
- Acesso a relatórios e análises
- Criação e edição de dados do sistema

#### 👨‍🏫 **INSTRUTOR**
- Permissões limitadas aos próprios treinamentos
- Funcionalidades específicas para instrutores

#### 👨‍🎓 **ALUNO**
- Permissões básicas de visualização
- Acesso ao próprio perfil

## Implementação Prática

### Sidebar Dinâmica
O menu lateral agora é gerado dinamicamente baseado nas permissões:

```tsx
// Exemplo de item de menu condicional
if (hasPermission('VIEW_STUDENTS')) {
  items.push({ id: "students", label: "Alunos", icon: Users })
}

if (hasPermission('VIEW_TRAININGS') || hasPermission('VIEW_OWN_TRAININGS')) {
  items.push({ id: "trainings", label: "Treinamentos", icon: BookOpen })
}
```

### Dashboard Adaptativo
Os cards de estatísticas são filtrados baseado nas permissões:

```tsx
const stats = allStats.filter(stat => 
  hasPermission(stat.permission) || 
  (stat.permission === "VIEW_TRAININGS" && hasPermission("VIEW_OWN_TRAININGS"))
)
```

### Botões de Ação Condicionais
```tsx
{hasPermission('CREATE_CLASSES') && (
  <Button>Nova Turma</Button>
)}

{hasPermission('VIEW_FINANCIAL') && (
  <Button variant="outline">Financeiro</Button>
)}
```

## Componentes de Exemplo

### 1. `PermissionsDebug`
Componente para debug e visualização de todas as permissões do usuário atual.

### 2. `RoleBasedContent`
Demonstra como diferentes tipos de usuários veem diferentes conteúdos baseado em suas permissões.

### 3. Dashboard Adaptativo
O dashboard principal agora mostra apenas as informações que o usuário tem permissão para ver.

## Segurança e Boas Práticas

### ⚠️ **Importante**
- As permissões no frontend são apenas para UX/UI
- **SEMPRE** validar permissões no backend antes de executar ações
- Usar as permissões para esconder/mostrar elementos, não para segurança

### 🔒 **Validação Backend**
```javascript
// Exemplo de validação no backend
if (!userHasPermission(user, 'DELETE_STUDENTS')) {
  return res.status(403).json({ error: 'Permissão negada' })
}
```

### 📱 **Responsividade**
- Menu lateral se adapta às permissões em dispositivos móveis
- Cards de estatísticas se reorganizam automaticamente
- Botões de ação são responsivos

## Testes Sugeridos

1. **Teste com Diretor**: Verifique se todos os menus e funcionalidades aparecem
2. **Teste com Instrutor**: Confirme que apenas conteúdo "próprio" é exibido
3. **Teste com Aluno**: Verifique acesso limitado
4. **Teste de Transição**: Faça logout/login com diferentes usuários

## Expansões Futuras

1. **Cache Inteligente**: Implementar cache de permissões com invalidação automática
2. **Middleware de Permissões**: Criar middleware para verificação automática
3. **Auditoria**: Sistema de log de uso de permissões
4. **Interface de Gerenciamento**: Tela para administrar permissões por usuário
5. **Permissões Temporárias**: Sistema de permissões com expiração
