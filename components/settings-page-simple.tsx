"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Settings, 
  Users, 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Eye,
  EyeOff,
  Key,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
  lastLogin?: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  createdAt: string
}

interface Permission {
  id: string
  name: string
  description: string
  module: string
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("users")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false)
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Mock data - dados apenas locais
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Admin Sistema",
      email: "admin@wtwork.com",
      role: "admin",
      status: "active",
      createdAt: "2024-01-01",
      lastLogin: "2024-01-15"
    },
    {
      id: "2",
      name: "Carlos Silva",
      email: "carlos.silva@wtwork.com",
      role: "instructor",
      status: "active",
      createdAt: "2024-01-05",
      lastLogin: "2024-01-14"
    },
    {
      id: "3",
      name: "Ana Santos",
      email: "ana.santos@wtwork.com",
      role: "instructor",
      status: "active",
      createdAt: "2024-01-10",
      lastLogin: "2024-01-13"
    },
    {
      id: "4",
      name: "Maria João",
      email: "maria.joao@wtwork.com",
      role: "student",
      status: "inactive",
      createdAt: "2024-01-12",
      lastLogin: "2024-01-12"
    }
  ])

  const [roles, setRoles] = useState<Role[]>([
    {
      id: "admin",
      name: "Administrador",
      description: "Acesso total ao sistema",
      permissions: ["users.create", "users.read", "users.update", "users.delete", "roles.create", "roles.read", "roles.update", "roles.delete", "students.create", "students.read", "students.update", "students.delete", "trainings.create", "trainings.read", "trainings.update", "trainings.delete", "financial.create", "financial.read", "financial.update", "financial.delete"],
      userCount: 1,
      createdAt: "2024-01-01"
    },
    {
      id: "instructor",
      name: "Instrutor",
      description: "Acesso para instrutores",
      permissions: ["students.read", "trainings.read", "trainings.update", "classes.create", "classes.read", "classes.update", "certificates.create", "certificates.read"],
      userCount: 2,
      createdAt: "2024-01-01"
    },
    {
      id: "student",
      name: "Aluno",
      description: "Acesso básico para alunos",
      permissions: ["profile.read", "profile.update", "classes.read", "certificates.read"],
      userCount: 1,
      createdAt: "2024-01-01"
    }
  ])

  const permissions: Permission[] = [
    { id: "users.create", name: "Criar Usuários", description: "Permite criar novos usuários", module: "Usuários" },
    { id: "users.read", name: "Visualizar Usuários", description: "Permite visualizar usuários", module: "Usuários" },
    { id: "users.update", name: "Editar Usuários", description: "Permite editar usuários", module: "Usuários" },
    { id: "users.delete", name: "Excluir Usuários", description: "Permite excluir usuários", module: "Usuários" },
    { id: "roles.create", name: "Criar Funções", description: "Permite criar novas funções", module: "Funções" },
    { id: "roles.read", name: "Visualizar Funções", description: "Permite visualizar funções", module: "Funções" },
    { id: "roles.update", name: "Editar Funções", description: "Permite editar funções", module: "Funções" },
    { id: "roles.delete", name: "Excluir Funções", description: "Permite excluir funções", module: "Funções" },
    { id: "students.create", name: "Criar Alunos", description: "Permite criar novos alunos", module: "Alunos" },
    { id: "students.read", name: "Visualizar Alunos", description: "Permite visualizar alunos", module: "Alunos" },
    { id: "students.update", name: "Editar Alunos", description: "Permite editar alunos", module: "Alunos" },
    { id: "students.delete", name: "Excluir Alunos", description: "Permite excluir alunos", module: "Alunos" },
    { id: "trainings.create", name: "Criar Treinamentos", description: "Permite criar novos treinamentos", module: "Treinamentos" },
    { id: "trainings.read", name: "Visualizar Treinamentos", description: "Permite visualizar treinamentos", module: "Treinamentos" },
    { id: "trainings.update", name: "Editar Treinamentos", description: "Permite editar treinamentos", module: "Treinamentos" },
    { id: "trainings.delete", name: "Excluir Treinamentos", description: "Permite excluir treinamentos", module: "Treinamentos" },
    { id: "classes.create", name: "Criar Aulas", description: "Permite criar novas aulas", module: "Aulas" },
    { id: "classes.read", name: "Visualizar Aulas", description: "Permite visualizar aulas", module: "Aulas" },
    { id: "classes.update", name: "Editar Aulas", description: "Permite editar aulas", module: "Aulas" },
    { id: "classes.delete", name: "Excluir Aulas", description: "Permite excluir aulas", module: "Aulas" },
    { id: "financial.create", name: "Criar Financeiro", description: "Permite criar registros financeiros", module: "Financeiro" },
    { id: "financial.read", name: "Visualizar Financeiro", description: "Permite visualizar dados financeiros", module: "Financeiro" },
    { id: "financial.update", name: "Editar Financeiro", description: "Permite editar dados financeiros", module: "Financeiro" },
    { id: "financial.delete", name: "Excluir Financeiro", description: "Permite excluir dados financeiros", module: "Financeiro" },
    { id: "certificates.create", name: "Criar Certificados", description: "Permite criar certificados", module: "Certificados" },
    { id: "certificates.read", name: "Visualizar Certificados", description: "Permite visualizar certificados", module: "Certificados" },
    { id: "profile.read", name: "Visualizar Perfil", description: "Permite visualizar o próprio perfil", module: "Perfil" },
    { id: "profile.update", name: "Editar Perfil", description: "Permite editar o próprio perfil", module: "Perfil" },
  ]

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    status: "active" as "active" | "inactive"
  })

  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "instructor":
        return "bg-blue-100 text-blue-800"
      case "student":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddUser = () => {
    if (userForm.name && userForm.email && userForm.password && userForm.role) {
      const newUser: User = {
        id: Date.now().toString(),
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        status: userForm.status,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setUsers([...users, newUser])
      setUserForm({ name: "", email: "", password: "", role: "", status: "active" })
      setIsAddUserDialogOpen(false)
    }
  }

  const handleEditUser = () => {
    if (selectedUser && userForm.name && userForm.email && userForm.role) {
      const updatedUsers = users.map(user =>
        user.id === selectedUser.id
          ? { ...user, name: userForm.name, email: userForm.email, role: userForm.role, status: userForm.status }
          : user
      )
      setUsers(updatedUsers)
      setSelectedUser(null)
      setUserForm({ name: "", email: "", password: "", role: "", status: "active" })
      setIsEditUserDialogOpen(false)
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId))
  }

  const handleAddRole = () => {
    if (roleForm.name && roleForm.description) {
      const newRole: Role = {
        id: roleForm.name.toLowerCase().replace(/\s+/g, '_'),
        name: roleForm.name,
        description: roleForm.description,
        permissions: roleForm.permissions,
        userCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setRoles([...roles, newRole])
      setRoleForm({ name: "", description: "", permissions: [] })
      setIsAddRoleDialogOpen(false)
    }
  }

  const handleEditRole = () => {
    if (selectedRole && roleForm.name && roleForm.description) {
      const updatedRoles = roles.map(role =>
        role.id === selectedRole.id
          ? { ...role, name: roleForm.name, description: roleForm.description, permissions: roleForm.permissions }
          : role
      )
      setRoles(updatedRoles)
      setSelectedRole(null)
      setRoleForm({ name: "", description: "", permissions: [] })
      setIsEditRoleDialogOpen(false)
    }
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(role => role.id !== roleId))
  }

  const openEditUserDialog = (user: User) => {
    setSelectedUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status
    })
    setIsEditUserDialogOpen(true)
  }

  const openEditRoleDialog = (role: Role) => {
    setSelectedRole(role)
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    })
    setIsEditRoleDialogOpen(true)
  }

  const togglePermission = (permissionId: string) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const getPermissionsByModule = () => {
    const grouped = permissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = []
      }
      acc[permission.module].push(permission)
      return acc
    }, {} as Record<string, Permission[]>)
    return grouped
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="text-gray-600">Gerencie usuários, funções e permissões</p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="roles">Funções</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold">Usuários do Sistema</h2>
            </div>
            <Button 
              onClick={() => setIsAddUserDialogOpen(true)}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>Gerencie todos os usuários do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadge(user.role)}>
                          {roles.find(r => r.id === user.role)?.name || user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(user.status)}
                          <Badge className={getStatusBadge(user.status)}>
                            {user.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditUserDialog(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold">Funções do Sistema</h2>
            </div>
            <Button 
              onClick={() => setIsAddRoleDialogOpen(true)}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Função
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditRoleDialog(role)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Usuários:</span>
                      <Badge variant="secondary">{role.userCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Permissões:</span>
                      <Badge variant="secondary">{role.permissions.length}</Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      Criado em: {new Date(role.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold">Permissões do Sistema</h2>
          </div>

          <div className="space-y-6">
            {Object.entries(getPermissionsByModule()).map(([module, modulePermissions]) => (
              <Card key={module}>
                <CardHeader>
                  <CardTitle className="text-lg">{module}</CardTitle>
                  <CardDescription>
                    {modulePermissions.length} permissões disponíveis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modulePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Key className="h-4 w-4 text-gray-500 mt-1" />
                        <div className="flex-1">
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-sm text-gray-500">{permission.description}</div>
                          <div className="text-xs text-gray-400 mt-1">ID: {permission.id}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
            <DialogDescription>
              Crie um novo usuário para o sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={userForm.password}
                  onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Digite uma senha"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select value={userForm.role} onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={userForm.status} onValueChange={(value: "active" | "inactive") => setUserForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddUser} className="bg-primary-500 hover:bg-primary-600">
              Criar Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Altere as informações do usuário
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Função</Label>
                <Select value={userForm.role} onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={userForm.status} onValueChange={(value: "active" | "inactive") => setUserForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser} className="bg-primary-500 hover:bg-primary-600">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Função</DialogTitle>
            <DialogDescription>
              Crie uma nova função e defina suas permissões
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Nome da Função</Label>
                <Input
                  id="role-name"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome da função"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-description">Descrição</Label>
                <Input
                  id="role-description"
                  value={roleForm.description}
                  onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da função"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Permissões</Label>
              <div className="space-y-4">
                {Object.entries(getPermissionsByModule()).map(([module, modulePermissions]) => (
                  <div key={module} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">{module}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {modulePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Switch
                            id={permission.id}
                            checked={roleForm.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <Label htmlFor={permission.id} className="text-sm">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddRole} className="bg-primary-500 hover:bg-primary-600">
              Criar Função
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Função</DialogTitle>
            <DialogDescription>
              Altere as informações e permissões da função
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role-name">Nome da Função</Label>
                <Input
                  id="edit-role-name"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome da função"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role-description">Descrição</Label>
                <Input
                  id="edit-role-description"
                  value={roleForm.description}
                  onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da função"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Permissões</Label>
              <div className="space-y-4">
                {Object.entries(getPermissionsByModule()).map(([module, modulePermissions]) => (
                  <div key={module} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">{module}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {modulePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Switch
                            id={`edit-${permission.id}`}
                            checked={roleForm.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <Label htmlFor={`edit-${permission.id}`} className="text-sm">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditRole} className="bg-primary-500 hover:bg-primary-600">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
