"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
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
  AlertCircle,
  Loader2
} from "lucide-react"
import { getUsers, getRoles, createUser, CreateUserData, deleteUser, getPermissions, updateRole, UpdateRoleData, deleteRole, createInstructor, CreateInstructorData, createRole, CreateRoleData, getLightInstructors, editUser, linkUserToInstructor, LinkUserToInstructorDto, getClients, linkUserToClient, LinkUserToClientDto } from "@/lib/api/superadmin"

interface User {
  id: string
  name: string
  email: string
  role: { id: string; name: string; description?: string }
  isActive?: boolean
  createdAt: string
  lastLogin?: string
  bio?: string
}

interface Role {
  id: string
  name: string
  description: string
  users: { id: string; name: string }[]
  permissions: {
    id: string
    roleId: string
    permissionId: string
    createdAt: string
  }[]
}

interface Permission {
  id: string
  name: string
  description: string
  module: string
}

interface LightInstructor {
  id: string
  name: string
  email: string | null
  user?: {
    isActive: boolean
  } | null
}

interface LightClient {
  id: string
  name: string
  email: string | null
  user?: {
    isActive: boolean
  } | null
}

export function SettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("users")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false)
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingRoles, setLoadingRoles] = useState(false)

  // State for data
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [availableInstructors, setAvailableInstructors] = useState<LightInstructor[]>([])
  const [loadingInstructors, setLoadingInstructors] = useState(false)
  const [availableClients, setAvailableClients] = useState<LightClient[]>([])
  const [loadingClients, setLoadingClients] = useState(false)
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [usersPerPage] = useState(10)

  // Load data on component mount
  useEffect(() => {
    loadUsers()
    loadRoles()
  }, [currentPage])

  // Load roles only once on component mount
  useEffect(() => {
    loadRoles()
  }, [])



  // API function to load users
  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers(currentPage, usersPerPage)
      
      if (data && data.users) {
        setUsers(data.users)
        setTotalUsers(data.pagination?.total || 0)
        setTotalPages(Math.ceil((data.pagination?.total || 0) / usersPerPage))
      }
    } catch (error) {
      console.error('Error loading users:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar usuários",
        variant: "destructive"
      })
      // Fallback to mock data if API fails
      setUsers([
        {
          id: "1",
          name: "Admin Sistema",
          email: "admin@wtwork.com",
          role: { id: "admin", name: "Administrador", description: "Gerencia o sistema" },
          isActive: true,
          createdAt: "2024-01-01",
          lastLogin: "2024-01-15"
        },
        {
          id: "2",
          name: "Carlos Silva",
          email: "carlos.silva@wtwork.com",
          role: { id: "instructor", name: "Instrutor", description: "Ministra treinamentos" },
          isActive: true,
          createdAt: "2024-01-05",
          lastLogin: "2024-01-14"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // API function to load roles
  const loadRoles = async () => {
    try {
      setLoadingRoles(true)
      const data = await getRoles()
      
      console.log('Raw roles data from API:', data)
      
      // Check if data is an array (direct response) or object with roles property
      if (Array.isArray(data)) {
        console.log('Roles loaded (array format):', data)
        setRoles(data)
      } else if (data && data.roles) {
        console.log('Roles loaded (object format):', data.roles)
        setRoles(data.roles)
      } else {
        console.log('Formato de resposta inesperado:', data)
      }
    } catch (error) {
      console.error('Error loading roles:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar funções",
        variant: "destructive"
      })
      // Fallback to mock data if API fails
      setRoles([
        {
          id: "admin",
          name: "SUPER_ADMIN",
          description: "Administrador com acesso total",
          users: [],
          permissions: []
        },
        {
          id: "instructor",
          name: "INSTRUCTOR",
          description: "Instrutor que pode ministrar aulas",
          users: [],
          permissions: []
        },
        {
          id: "student",
          name: "STUDENT",
          description: "Estudante que pode se inscrever em aulas",
          users: [],
          permissions: []
        }
      ])
    } finally {
      setLoadingRoles(false)
    }
  }

  // Mapeamento de IDs das permissões da API para nomes das permissões do frontend
  const permissionIdToNameMap: Record<string, string> = {
    // Usuários
    "cmcxv2jva001avbxl4shz2t9c": "CREATE_USERS",
    "cmcxv2jvb001cvbxlu1tvz4pr": "VIEW_USERS", 
    "cmcxv2jv1000rvbxlegbjl90j": "EDIT_USERS",
    "cmcxv2jus0009vbxlq6iimva3": "DELETE_USERS",
    "cmcxv2jv2000vvbxlivrktmgz": "MANAGE_USERS",
    
    // Funções
    "cmcxv2jvb001bvbxljcr6y65v": "CREATE_ROLES",
    "cmcxv2jug0005vbxlzc2rur9t": "VIEW_ROLES",
    "cmcxv2juz000lvbxll7te86hd": "EDIT_ROLES", 
    "cmcxv2jum0008vbxlzvd14c56": "DELETE_ROLES",
    
    // Alunos
    "cmcxv2jv3000zvbxlkouaowse": "CREATE_STUDENTS",
    "cmcxv2jv40010vbxloczasxrm": "VIEW_STUDENTS",
    "cmcxv2jut000dvbxly5ouxhws": "EDIT_STUDENTS",
    "cmcxv2jut000bvbxlqslngy42": "DELETE_STUDENTS",
    
    // Treinamentos
    "cmcxv2jut000cvbxlv0p39x1u": "CREATE_TRAININGS",
    "cmcxv2jux000ivbxl3iey6axr": "VIEW_TRAININGS",
    "cmcxv2juz000mvbxlx2854l3z": "VIEW_OWN_TRAININGS",
    "cmcxv2jsy0000vbxlqjl1y0z7": "EDIT_TRAININGS",
    "cmcxv2jv50013vbxl04124luk": "EDIT_OWN_TRAININGS",
    "cmcxv2jv50015vbxlddjexhv7": "DELETE_TRAININGS",
    
    // Aulas
    "cmcxv2jv40011vbxlso4n1m74": "CREATE_CLASSES",
    "cmcxv2jv40012vbxltilwycrg": "VIEW_CLASSES", 
    "cmcxv2jv70019vbxl5fl0nqmu": "VIEW_OWN_CLASSES",
    "cmcxv2juv000gvbxlatw7poc6": "EDIT_CLASSES",
    "cmcxv2jv50016vbxlzs3x2wfh": "EDIT_OWN_CLASSES",
    "cmcxv2jv50014vbxlet64hzy8": "DELETE_CLASSES",
    
    // Certificados
    "cmcxv2ju90004vbxloh52kiik": "CREATE_CERTIFICATES",
    "cmcxv2juh0006vbxll8pbxuxh": "CREATE_OWN_CERTIFICATES",
    "cmcxv2juv000hvbxlg8xpbqlb": "VIEW_CERTIFICATES",
    "cmcxv2jux000kvbxlw5txdweb": "VIEW_OWN_CERTIFICATES",
    
    // Financeiro
    "cmcxv2juu000evbxlvb664d1h": "CREATE_FINANCIAL",
    "cmcxv2jv2000wvbxlhededrpo": "VIEW_FINANCIAL",
    "cmcxv2jut000avbxl4etkjqct": "EDIT_FINANCIAL",
    "cmcxv2jtt0001vbxlpw0xlls3": "DELETE_FINANCIAL",
    "cmcxv2jul0007vbxlruimtboh": "VIEW_ACCOUNTS_PAYABLE",
    "cmcxv2jv3000yvbxlku4nptf3": "VIEW_ACCOUNTS_RECEIVABLE",
    "cmcxv2jv50018vbxlzbauvcvj": "VIEW_CASH_FLOW",
    "cmcxv2juu000fvbxlvmajrth6": "MANAGE_BANK_ACCOUNTS",
    "cmcxv2jv50017vbxljxk8tk27": "SETTLE_ACCOUNTS",
    "cmcxv2jtw0002vbxlag8jp2y8": "VIEW_FINANCIAL_REPORTS",
    "cmcxv2ju00003vbxl4jtibfuo": "GENERATE_FINANCIAL_REPORTS",
    
    // Relatórios
    "cmcxv2jv1000pvbxlvyuu2hp6": "CREATE_REPORTS",
    "cmcxv2jv1000nvbxlg85qp6e3": "VIEW_REPORTS",
    "cmcxv2jv3000xvbxlq44bbthb": "EDIT_REPORTS",
    "cmcxv2jv1000qvbxlbwucxrny": "DELETE_REPORTS",
    "cmcxv2jv1000svbxlghg78rm5": "EXPORT_REPORTS",
    
    // Dashboard
    "cmcxv2jv2000uvbxl3g13dwg9": "VIEW_DASHBOARD",
    "cmcxv2jv2000tvbxlh2w14iq0": "VIEW_ANALYTICS",
    
    // Perfil
    "cmcxv2jux000jvbxldbtlpdd7": "VIEW_PROFILE",
    "cmcxv2jv1000ovbxl0lhgnejf": "EDIT_PROFILE",
  }

  // Mapeamento inverso: nome da permissão para ID da API
  const permissionNameToIdMap: Record<string, string> = Object.fromEntries(
    Object.entries(permissionIdToNameMap).map(([id, name]) => [name, id])
  )

  const permissions: Permission[] = [
    // Usuários
    { id: "CREATE_USERS", name: "Criar Usuários", description: "Criar Usuários", module: "Usuários" },
    { id: "VIEW_USERS", name: "Visualizar Usuários", description: "Visualizar Usuários", module: "Usuários" },
    { id: "EDIT_USERS", name: "Editar Usuários", description: "Editar Usuários", module: "Usuários" },
    { id: "DELETE_USERS", name: "Excluir Usuários", description: "Excluir Usuários", module: "Usuários" },
    { id: "MANAGE_USERS", name: "Gerenciar Usuários", description: "Gerenciar Usuários (Acesso Total)", module: "Usuários" },
    
    // Funções
    { id: "CREATE_ROLES", name: "Criar Funções", description: "Criar Funções", module: "Funções" },
    { id: "VIEW_ROLES", name: "Visualizar Funções", description: "Visualizar Funções", module: "Funções" },
    { id: "EDIT_ROLES", name: "Editar Funções", description: "Editar Funções", module: "Funções" },
    { id: "DELETE_ROLES", name: "Excluir Funções", description: "Excluir Funções", module: "Funções" },
    
    // Alunos
    { id: "CREATE_STUDENTS", name: "Criar Alunos", description: "Criar Alunos", module: "Alunos" },
    { id: "VIEW_STUDENTS", name: "Visualizar Alunos", description: "Visualizar Alunos", module: "Alunos" },
    { id: "EDIT_STUDENTS", name: "Editar Alunos", description: "Editar Alunos", module: "Alunos" },
    { id: "DELETE_STUDENTS", name: "Excluir Alunos", description: "Excluir Alunos", module: "Alunos" },
    
    // Treinamentos
    { id: "CREATE_TRAININGS", name: "Criar Treinamentos", description: "Criar Treinamentos", module: "Treinamentos" },
    { id: "VIEW_TRAININGS", name: "Visualizar Todos os Treinamentos", description: "Visualizar Todos os Treinamentos", module: "Treinamentos" },
    { id: "VIEW_OWN_TRAININGS", name: "Visualizar Próprios Treinamentos", description: "Visualizar Apenas Treinamentos Ministrados por Ele", module: "Treinamentos" },
    { id: "EDIT_TRAININGS", name: "Editar Treinamentos", description: "Editar Treinamentos", module: "Treinamentos" },
    { id: "EDIT_OWN_TRAININGS", name: "Editar Próprios Treinamentos", description: "Editar Apenas Treinamentos Ministrados por Ele", module: "Treinamentos" },
    { id: "DELETE_TRAININGS", name: "Excluir Treinamentos", description: "Excluir Treinamentos", module: "Treinamentos" },
    
    // Aulas
    { id: "CREATE_CLASSES", name: "Criar Aulas", description: "Criar Aulas", module: "Aulas" },
    { id: "VIEW_CLASSES", name: "Visualizar Todas as Aulas", description: "Visualizar Todas as Aulas", module: "Aulas" },
    { id: "VIEW_OWN_CLASSES", name: "Visualizar Próprias Aulas", description: "Visualizar Apenas Aulas Ministradas por Ele", module: "Aulas" },
    { id: "EDIT_CLASSES", name: "Editar Aulas", description: "Editar Aulas", module: "Aulas" },
    { id: "EDIT_OWN_CLASSES", name: "Editar Próprias Aulas", description: "Editar Apenas Aulas Ministradas por Ele", module: "Aulas" },
    { id: "DELETE_CLASSES", name: "Excluir Aulas", description: "Excluir Aulas", module: "Aulas" },
    
    // Certificados
    { id: "CREATE_CERTIFICATES", name: "Criar Certificados", description: "Criar Certificados", module: "Certificados" },
    { id: "CREATE_OWN_CERTIFICATES", name: "Emitir Próprios Certificados", description: "Emitir Certificados Apenas de Treinamentos Ministrados por Ele", module: "Certificados" },
    { id: "VIEW_CERTIFICATES", name: "Visualizar Certificados", description: "Visualizar Certificados", module: "Certificados" },
    { id: "VIEW_OWN_CERTIFICATES", name: "Visualizar Próprios Certificados", description: "Visualizar Apenas Certificados de Treinamentos Ministrados por Ele", module: "Certificados" },
    
    // Financeiro
    { id: "CREATE_FINANCIAL", name: "Criar Registros Financeiros", description: "Criar Registros Financeiros", module: "Financeiro" },
    { id: "VIEW_FINANCIAL", name: "Visualizar Dados Financeiros", description: "Visualizar Dados Financeiros", module: "Financeiro" },
    { id: "EDIT_FINANCIAL", name: "Editar Dados Financeiros", description: "Editar Dados Financeiros", module: "Financeiro" },
    { id: "DELETE_FINANCIAL", name: "Excluir Registros Financeiros", description: "Excluir Registros Financeiros", module: "Financeiro" },
    { id: "VIEW_ACCOUNTS_PAYABLE", name: "Visualizar Contas a Pagar", description: "Visualizar Contas a Pagar", module: "Financeiro" },
    { id: "VIEW_ACCOUNTS_RECEIVABLE", name: "Visualizar Contas a Receber", description: "Visualizar Contas a Receber", module: "Financeiro" },
    { id: "VIEW_CASH_FLOW", name: "Visualizar Fluxo de Caixa", description: "Visualizar Fluxo de Caixa", module: "Financeiro" },
    { id: "MANAGE_BANK_ACCOUNTS", name: "Gerenciar Contas Bancárias", description: "Gerenciar Contas Bancárias", module: "Financeiro" },
    { id: "SETTLE_ACCOUNTS", name: "Quitar Contas", description: "Quitar Contas", module: "Financeiro" },
    { id: "VIEW_FINANCIAL_REPORTS", name: "Visualizar Relatórios Financeiros", description: "Visualizar Relatórios Financeiros", module: "Financeiro" },
    { id: "GENERATE_FINANCIAL_REPORTS", name: "Gerar Relatórios Financeiros", description: "Gerar Relatórios Financeiros", module: "Financeiro" },
    
    // Relatórios
    { id: "CREATE_REPORTS", name: "Criar Relatórios", description: "Criar Relatórios", module: "Relatórios" },
    { id: "VIEW_REPORTS", name: "Visualizar Relatórios", description: "Visualizar Relatórios", module: "Relatórios" },
    { id: "EDIT_REPORTS", name: "Editar Relatórios", description: "Editar Relatórios", module: "Relatórios" },
    { id: "DELETE_REPORTS", name: "Excluir Relatórios", description: "Excluir Relatórios", module: "Relatórios" },
    { id: "EXPORT_REPORTS", name: "Exportar Relatórios", description: "Exportar Relatórios", module: "Relatórios" },
    
    // Dashboard e Analytics
    { id: "VIEW_DASHBOARD", name: "Visualizar Dashboard", description: "Visualizar Dashboard", module: "Dashboard" },
    { id: "VIEW_ANALYTICS", name: "Visualizar Análises", description: "Visualizar Análises", module: "Dashboard" },
    
    // Perfil
    { id: "VIEW_PROFILE", name: "Visualizar Perfil", description: "Visualizar Perfil", module: "Perfil" },
    { id: "EDIT_PROFILE", name: "Editar Perfil", description: "Editar Perfil", module: "Perfil" },
  ]

  const [userForm, setUserForm] = useState<CreateUserData>({
    name: "",
    email: "",
    password: "",
    roleId: "",
    isActive: true,
    bio: ""
  })

  const [instructorForm, setInstructorForm] = useState<CreateInstructorData>({
    name: "",
    email: "",
    password: "",
    bio: "",
    isActive: true,
    corporateName: "",
    personType: "FISICA",
    cpf: "",
    cnpj: "",
    municipalRegistration: "",
    stateRegistration: "",
    zipCode: "",
    address: "",
    addressNumber: "",
    neighborhood: "",
    city: "",
    state: "",
    landlineAreaCode: "",
    landlineNumber: "",
    mobileAreaCode: "",
    mobileNumber: "",
    instructorEmail: "",
    education: "",
    registrationNumber: "",
    observations: ""
  })

  const [isInstructorMode, setIsInstructorMode] = useState(false)
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("")
  const [isClientMode, setIsClientMode] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string>("")

  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  })

  // Helper function to extract role ID from user.role (which can be string or object)
  const getRoleId = (role: string | { id: string; name: string; description?: string }) => {
    return typeof role === 'object' ? role.id || role.name : role;
  }

  // Helper function to get role display name
  const getRoleDisplayName = (userRole: string | { id: string; name: string; description?: string }) => {
    const roleId = getRoleId(userRole);
    return roles.find(r => r.id === roleId)?.name || roleId;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "INACTIVE":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: boolean) => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-800"
      case false:
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

  // Load available instructors for instructor mode
  const loadAvailableInstructors = async () => {
    try {
      setLoadingInstructors(true)
      const response = await getLightInstructors()
      
      console.log('Response from getLightInstructors:', response)
      
      // Filter instructors that don't have a user associated (user === null)
      // These are the ones available for connection
      const availableInstructors = response.filter((instructor: LightInstructor) => 
        instructor.user === null
      )
      
      console.log('Available instructors for connection:', availableInstructors)
      
      setAvailableInstructors(availableInstructors)
    } catch (error) {
      console.error('Error loading available instructors:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar instrutores disponíveis",
        variant: "destructive"
      })
    } finally {
      setLoadingInstructors(false)
    }
  }

  // Load available clients for client mode
  const loadAvailableClients = async () => {
    try {
      setLoadingClients(true)
      const response = await getClients(1, 100) // Get first 100 clients
      
      console.log('Response from getClients:', response)
      
      // Filter clients that don't have a user associated (user === null)
      // These are the ones available for connection
      const availableClients = response.clients?.filter((client: LightClient) => 
        client.user === null
      ) || []
      
      console.log('Available clients for connection:', availableClients)
      
      setAvailableClients(availableClients)
    } catch (error) {
      console.error('Error loading available clients:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar clientes disponíveis",
        variant: "destructive"
      })
    } finally {
      setLoadingClients(false)
    }
  }

  // Load instructors when instructor mode is activated
  useEffect(() => {
    if (isInstructorMode) {
      loadAvailableInstructors()
    }
  }, [isInstructorMode])

  // Load clients when client mode is activated
  useEffect(() => {
    if (isClientMode) {
      loadAvailableClients()
    }
  }, [isClientMode])

  const handleAddUser = async () => {
    const validationErrors = validateUserForm()
    
    if (validationErrors.length > 0) {
      toast({
        title: "Erro de Validação",
        description: validationErrors.join(", "),
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      
      // Verificar se é instrutor ou cliente
      const selectedRole = roles.find(role => role.id === userForm.roleId)
      const isInstructor = selectedRole?.name === "INSTRUCTOR" || selectedRole?.name === "INSTRUTOR"
      const isClient = selectedRole?.name === "CLIENT" || selectedRole?.name === "CLIENTE"
      
      console.log('All available roles:', roles)
      console.log('Selected role ID:', userForm.roleId)
      console.log('Selected role:', selectedRole)
      console.log('Is instructor:', isInstructor)
      console.log('Is client:', isClient)
      
      if (isInstructor) {
        // Para modo instrutor, conectar com instrutor existente
        const selectedInstructor = availableInstructors.find(inst => inst.id === selectedInstructorId)
        
        console.log('Selected instructor ID:', selectedInstructorId)
        console.log('Available instructors:', availableInstructors)
        console.log('Selected instructor:', selectedInstructor)
        
        if (!selectedInstructor) {
          toast({
            title: "Erro",
            description: "Instrutor selecionado não encontrado",
            variant: "destructive"
          })
          return
        }
        
        // Preparar dados para conectar usuário ao instrutor
        const linkData: LinkUserToInstructorDto = {
          instructorId: selectedInstructorId,
          name: userForm.name,
          email: userForm.email,
          password: userForm.password,
          bio: userForm.bio || undefined,
          isActive: userForm.isActive ?? true
        }
        
        console.log('Link data being sent:', linkData)
        console.log('User form data:', userForm)
        console.log('Selected instructor ID:', selectedInstructorId)
        
        // Validação adicional antes de enviar
        if (!linkData.instructorId) {
          toast({
            title: "Erro",
            description: "ID do instrutor não encontrado",
            variant: "destructive"
          })
          return
        }
        
        // Chamar API para conectar usuário ao instrutor
        await linkUserToInstructor(linkData)
        
        toast({
          title: "Sucesso",
          description: `Instrutor ${selectedInstructor.name} conectado com sucesso`,
        })
      } else if (isClient) {
        // Para modo cliente, conectar com cliente existente
        const selectedClient = availableClients.find(client => client.id === selectedClientId)
        
        console.log('Selected client ID:', selectedClientId)
        console.log('Available clients:', availableClients)
        console.log('Selected client:', selectedClient)
        
        if (!selectedClient) {
          toast({
            title: "Erro",
            description: "Cliente selecionado não encontrado",
            variant: "destructive"
          })
          return
        }
        
        // Preparar dados para conectar usuário ao cliente
        const linkData: Omit<LinkUserToClientDto, 'clientId'> = {
          name: userForm.name,
          email: userForm.email,
          password: userForm.password,
          bio: userForm.bio || undefined,
          isActive: userForm.isActive ?? true
        }
        
        console.log('Client link data being sent:', linkData)
        console.log('User form data:', userForm)
        console.log('Selected client ID:', selectedClientId)
        
        // Validação adicional antes de enviar
        if (!selectedClientId) {
          toast({
            title: "Erro",
            description: "ID do cliente não encontrado",
            variant: "destructive"
          })
          return
        }
        
        // Chamar API para conectar usuário ao cliente
        await linkUserToClient(selectedClientId, linkData)
        
        toast({
          title: "Sucesso",
          description: `Cliente ${selectedClient.name} conectado com sucesso`,
        })
      } else {
        // Usar função padrão para outros tipos de usuário
        const newUser = await createUser(userForm)
        
        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso",
        })
      }
      
      // Reload users to get the updated list
      await loadUsers()
      
      // Reset forms using the centralized function
      resetAllModalStates()
      setIsAddUserDialogOpen(false)
      
    } catch (error: any) {
      console.error('Error creating user:', error)
      
      // Log detalhado do erro
      if (error.response) {
        console.error('Error response:', error.response.data)
        console.error('Error status:', error.response.status)
        console.error('Error headers:', error.response.headers)
      } else if (error.request) {
        console.error('Error request:', error.request)
      } else {
        console.error('Error message:', error.message)
      }
      
      const errorMessage = error.response?.data?.message || error.message || "Falha ao criar usuário"
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = async () => {
    if (!selectedUser) return;
    if (!userForm.name || !userForm.email || !userForm.roleId) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return;
    }
    try {
      setLoading(true)
      // Monta o objeto de atualização, removendo campos vazios
      const updateData: any = {
        name: userForm.name,
        email: userForm.email,
        roleId: userForm.roleId,
        isActive: userForm.isActive,
        bio: userForm.bio
      }
      if (userForm.password && userForm.password.length >= 6) {
        updateData.password = userForm.password
      }
      await editUser(selectedUser.id, updateData)
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
      })
      await loadUsers()
      resetAllModalStates()
      setIsEditUserDialogOpen(false)
    } catch (error) {
      console.error('Error updating user:', error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar usuário",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return
    }

    try {
      setLoading(true)
      await deleteUser(userId)
      
      // Recarregar a lista de usuários após deletar
      await loadUsers()
      
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Erro",
        description: "Falha ao excluir usuário",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddRole = async () => {
    if (!roleForm.name || !roleForm.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      
      // Mapear os nomes das permissões para IDs da API
      const permissionIds = roleForm.permissions
        .map(permissionName => permissionNameToIdMap[permissionName])
        .filter(Boolean) // Remove valores undefined

      const roleData: CreateRoleData = {
        name: roleForm.name,
        description: roleForm.description,
        permissionIds
      }

      await createRole(roleData)
      
      // Recarregar a lista de roles após criar
      await loadRoles()
      
      resetRoleForm()
      setIsAddRoleDialogOpen(false)
      
      toast({
        title: "Sucesso",
        description: "Função criada com sucesso",
      })
    } catch (error) {
      console.error('Error creating role:', error)
      toast({
        title: "Erro",
        description: "Falha ao criar função",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditRole = async () => {
    if (!selectedRole || !roleForm.name || !roleForm.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      
      // Debug: log das permissões do formulário
      console.log('Role form permissions:', roleForm.permissions)
      console.log('Permission Name to ID Map:', permissionNameToIdMap)
      
      // Mapear os nomes das permissões de volta para IDs da API
      const permissionIds = roleForm.permissions
        .map(permissionName => {
          const mappedId = permissionNameToIdMap[permissionName]
          console.log(`Mapping ${permissionName} to ${mappedId}`)
          return mappedId
        })
        .filter(Boolean) // Remove valores undefined

      console.log('Permission IDs to send:', permissionIds)

      const roleData: UpdateRoleData = {
        description: roleForm.description,
        permissionIds
      }

      // Só incluir o nome se não for a role "Instrutor"
      if (selectedRole.name !== "INSTRUCTOR" && selectedRole.name !== "INSTRUTOR") {
        roleData.name = roleForm.name
      }

      console.log('Role data to send:', roleData)

      await updateRole(selectedRole.id, roleData)
      
      // Recarregar as roles após editar
      await loadRoles()
      
      setSelectedRole(null)
      resetRoleForm()
      setIsEditRoleDialogOpen(false)
      
      toast({
        title: "Sucesso",
        description: "Função atualizada com sucesso",
      })
    } catch (error) {
      console.error('Error updating role:', error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar função",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    // Proteger a role "Instrutor" de ser deletada
    const roleToDelete = roles.find(role => role.id === roleId)
    if (roleToDelete && (roleToDelete.name === "INSTRUCTOR" || roleToDelete.name === "INSTRUTOR")) {
      toast({
        title: "Erro",
        description: "A função 'Instrutor' não pode ser excluída",
        variant: "destructive"
      })
      return
    }

    if (!confirm('Tem certeza que deseja excluir esta função?')) {
      return
    }

    try {
      setLoading(true)
      await deleteRole(roleId)
      
      // Recarregar a lista de roles após deletar
      await loadRoles()
      
      toast({
        title: "Sucesso",
        description: "Função excluída com sucesso",
      })
    } catch (error) {
      console.error('Error deleting role:', error)
      toast({
        title: "Erro",
        description: "Falha ao excluir função",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const openEditUserDialog = (user: User) => {
    // Primeiro limpar qualquer estado anterior
    resetUserForm()
    setSelectedUser(user)
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      roleId: getRoleId(user.role),
      isActive: user.isActive ?? true,
      bio: user.bio || ""
    })
    setIsEditUserDialogOpen(true)
  }

  const openEditRoleDialog = (role: Role) => {
    // Primeiro limpar qualquer estado anterior
    setRoleForm({ name: "", description: "", permissions: [] })
    setSelectedRole(role)
    
    // Debug: log das permissões da role
    console.log('Role permissions:', role.permissions)
    console.log('Permission ID to Name Map:', permissionIdToNameMap)
    
    // Mapear os IDs das permissões da API para os nomes das permissões do frontend
    const mappedPermissions = role.permissions
      .map(p => {
        const mappedPermission = permissionIdToNameMap[p.permissionId]
        console.log(`Mapping ${p.permissionId} to ${mappedPermission}`)
        return mappedPermission
      })
      .filter(Boolean) // Remove valores undefined
    
    console.log('Mapped permissions:', mappedPermissions)
    console.log('Available permission IDs in map:', Object.keys(permissionIdToNameMap))
    
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: mappedPermissions
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

  // Function to reset user form
  const resetUserForm = () => {
    setUserForm({
      name: "",
      email: "",
      password: "",
      roleId: "",
      isActive: true,
      bio: ""
    })
  }

  // Function to reset instructor form
  const resetInstructorForm = () => {
    setInstructorForm({
      name: "",
      email: "",
      password: "",
      bio: "",
      isActive: true,
      corporateName: "",
      personType: "FISICA",
      cpf: "",
      cnpj: "",
      municipalRegistration: "",
      stateRegistration: "",
      zipCode: "",
      address: "",
      addressNumber: "",
      neighborhood: "",
      city: "",
      state: "",
      landlineAreaCode: "",
      landlineNumber: "",
      mobileAreaCode: "",
      mobileNumber: "",
      instructorEmail: "",
      education: "",
      registrationNumber: "",
      observations: ""
    })
  }

  // Function to reset role form
  const resetRoleForm = () => {
    setRoleForm({ name: "", description: "", permissions: [] })
  }

  // Function to reset all modal states
  const resetAllModalStates = () => {
    resetUserForm()
    resetInstructorForm()
    resetRoleForm()
    setSelectedUser(null)
    setSelectedRole(null)
    setIsInstructorMode(false)
    setSelectedInstructorId("")
    setAvailableInstructors([])
    setIsClientMode(false)
    setSelectedClientId("")
    setAvailableClients([])
  }

  // Function to validate user form
  const validateUserForm = () => {
    const errors: string[] = []
    
    if (isInstructorMode) {
      // Validation for instructor connection mode
      if (!selectedInstructorId) {
        errors.push("Selecione um instrutor para conectar")
      }
      // Validate user form fields for instructor mode too
      if (!userForm.name.trim()) errors.push("Nome é obrigatório")
      if (!userForm.email.trim()) errors.push("Email é obrigatório")
      if (!userForm.password.trim()) errors.push("Senha é obrigatória")
      if (userForm.password.length > 0 && userForm.password.length < 6) errors.push("Senha deve ter pelo menos 6 caracteres")
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (userForm.email && !emailRegex.test(userForm.email)) {
        errors.push("Email deve ter um formato válido")
      }
      
      // Log dos dados para debug
      console.log('Validating instructor mode:')
      console.log('Selected instructor ID:', selectedInstructorId)
      console.log('User form:', userForm)
      console.log('Available instructors:', availableInstructors)
    } else if (isClientMode) {
      // Validation for client connection mode
      if (!selectedClientId) {
        errors.push("Selecione um cliente para conectar")
      }
      // Validate user form fields for client mode too
      if (!userForm.name.trim()) errors.push("Nome é obrigatório")
      if (!userForm.email.trim()) errors.push("Email é obrigatório")
      if (!userForm.password.trim()) errors.push("Senha é obrigatória")
      if (userForm.password.length > 0 && userForm.password.length < 6) errors.push("Senha deve ter pelo menos 6 caracteres")
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (userForm.email && !emailRegex.test(userForm.email)) {
        errors.push("Email deve ter um formato válido")
      }
      
      // Log dos dados para debug
      console.log('Validating client mode:')
      console.log('Selected client ID:', selectedClientId)
      console.log('User form:', userForm)
      console.log('Available clients:', availableClients)
    } else {
      // Standard validation for regular users
      const currentForm = userForm
      
      if (!currentForm.name.trim()) errors.push("Nome é obrigatório")
      if (!currentForm.email.trim()) errors.push("Email é obrigatório")
      if (!currentForm.password.trim()) errors.push("Senha é obrigatória")
      if (currentForm.password.length > 0 && currentForm.password.length < 6) errors.push("Senha deve ter pelo menos 6 caracteres")
      if (!userForm.roleId) errors.push("Função é obrigatória")
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (currentForm.email && !emailRegex.test(currentForm.email)) {
        errors.push("Email deve ter um formato válido")
      }
    }
    
    console.log('Validation errors:', errors)
    return errors
  }

  // Function to handle role selection and update instructor/client mode
  const handleRoleChange = (roleId: string) => {
    console.log('Role changed to:', roleId)
    setUserForm(prev => ({ ...prev, roleId }))
    
    // Find the selected role to check if it's an instructor or client
    const selectedRole = roles.find(role => role.id === roleId)
    const isInstructor = selectedRole?.name === "INSTRUCTOR" || selectedRole?.name === "INSTRUTOR"
    const isClient = selectedRole?.name === "CLIENT" || selectedRole?.name === "CLIENTE"
    
    console.log('Selected role:', selectedRole)
    console.log('Is instructor:', isInstructor)
    console.log('Is client:', isClient)
    
    setIsInstructorMode(isInstructor)
    setIsClientMode(isClient)
    
    // Reset instructor/client selection when switching modes
    if (!isInstructor) {
      setSelectedInstructorId("")
      setAvailableInstructors([])
    }
    if (!isClient) {
      setSelectedClientId("")
      setAvailableClients([])
    }
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
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="roles">Funções</TabsTrigger>
          
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
                    
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Carregando usuários...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <span>Nenhum usuário encontrado</span>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={user.role.name}>
                            {user.role.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {user.isActive === true ? (
                              <Eye className="h-4 w-4 text-green-500" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-red-500" />
                            )}
                            <Badge className={getStatusBadge(user.isActive ?? false)}>
                              {user.isActive === true ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      
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
                    ))
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Mostrando {users.length} de {totalUsers} usuários
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1 || loading}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || loading}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
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
                        {(role.name !== "INSTRUCTOR" && role.name !== "INSTRUTOR") && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteRole(role.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Usuários:</span>
                      <Badge variant="secondary">{role.users.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Permissões:</span>
                      <Badge variant="secondary">{role.permissions.length}</Badge>
                    </div>
                    {role.users.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Usuários: {role.users.map(u => u.name).join(', ')}
                      </div>
                    )}
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
      <Dialog open={isAddUserDialogOpen} onOpenChange={(open) => {
        setIsAddUserDialogOpen(open)
        if (!open) {
          resetAllModalStates()
        }
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
            <DialogDescription>
              Crie um novo usuário para o sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Informações Básicas - Sempre visível */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Básicas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={userForm.name}
                    onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="role">Função *</Label>
                  <Select 
                    value={userForm.roleId} 
                    onValueChange={handleRoleChange}
                    disabled={loadingRoles}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingRoles ? "Carregando funções..." : "Selecione uma função"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingRoles ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Carregando...</span>
                          </div>
                        </SelectItem>
                      ) : roles.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          Nenhuma função encontrada
                        </SelectItem>
                      ) : (
                        roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Input
                    id="bio"
                    value={userForm.bio || ""}
                    onChange={(e) => setUserForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Breve descrição profissional"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="isActive"
                    checked={userForm.isActive}
                    onCheckedChange={(checked) => setUserForm(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Usuário Ativo</Label>
                </div>
              </div>
            </div>

            {/* Modo Instrutor - Seleção Simplificada */}
            {isInstructorMode && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Conectar com Instrutor</h3>
                <div className="space-y-2">
                  <Label htmlFor="instructorSelect">Selecione um instrutor para conectar *</Label>
                  <Select 
                    value={selectedInstructorId} 
                    onValueChange={(value) => {
                      console.log('Instructor selected:', value)
                      console.log('Available instructors:', availableInstructors)
                      setSelectedInstructorId(value)
                    }}
                    disabled={loadingInstructors}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingInstructors ? "Carregando instrutores..." : "Selecione um instrutor"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingInstructors ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Carregando...</span>
                          </div>
                        </SelectItem>
                      ) : availableInstructors.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          Nenhum instrutor encontrado
                        </SelectItem>
                      ) : (
                        availableInstructors.map((instructor) => (
                          <SelectItem key={instructor.id} value={instructor.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{instructor.name}</span>
                              <span className="text-sm text-gray-500">
                                {instructor.email || 'Email não informado'}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Apenas instrutores sem usuário associado estão disponíveis para conexão.
                  </p>
                </div>
              </div>
            )}

            {/* Modo Cliente - Seleção Simplificada */}
            {isClientMode && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Conectar com Cliente</h3>
                <div className="space-y-2">
                  <Label htmlFor="clientSelect">Selecione um cliente para conectar *</Label>
                  <Select 
                    value={selectedClientId} 
                    onValueChange={(value) => {
                      console.log('Client selected:', value)
                      console.log('Available clients:', availableClients)
                      setSelectedClientId(value)
                    }}
                    disabled={loadingClients}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingClients ? "Carregando clientes..." : "Selecione um cliente"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingClients ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Carregando...</span>
                          </div>
                        </SelectItem>
                      ) : availableClients.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          Nenhum cliente encontrado
                        </SelectItem>
                      ) : (
                        availableClients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{client.name}</span>
                              <span className="text-sm text-gray-500">
                                {client.email || 'Email não informado'}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Apenas clientes sem usuário associado estão disponíveis para conexão.
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddUserDialogOpen(false)
              resetAllModalStates()
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddUser} 
              className="bg-primary-500 hover:bg-primary-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isInstructorMode ? 'Conectando...' : isClientMode ? 'Conectando...' : 'Criando...'}
                </>
              ) : (
                isInstructorMode ? 'Conectar Instrutor' : isClientMode ? 'Conectar Cliente' : 'Criar Usuário'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={(open) => {
        setIsEditUserDialogOpen(open)
        if (!open) {
          resetAllModalStates()
        }
      }}>
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
                <Label htmlFor="edit-password">Nova Senha (opcional)</Label>
                <div className="relative">
                  <Input
                    id="edit-password"
                    type={showPassword ? "text" : "password"}
                    value={userForm.password}
                    onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Digite uma nova senha"
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
              <div className="space-y-2">
                <Label htmlFor="edit-bio">Biografia</Label>
                <Input
                  id="edit-bio"
                  value={userForm.bio || ""}
                  onChange={(e) => setUserForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Breve descrição profissional"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={userForm.isActive}
                onCheckedChange={(checked) => setUserForm(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="edit-isActive">Usuário Ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditUserDialogOpen(false)
              resetAllModalStates()
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEditUser} 
              className="bg-primary-500 hover:bg-primary-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleDialogOpen} onOpenChange={(open) => {
        setIsAddRoleDialogOpen(open)
        if (!open) {
          resetRoleForm()
        }
      }}>
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
            <Button variant="outline" onClick={() => {
              setIsAddRoleDialogOpen(false)
              resetRoleForm()
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddRole} 
              className="bg-primary-500 hover:bg-primary-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Função'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleDialogOpen} onOpenChange={(open) => {
        setIsEditRoleDialogOpen(open)
        if (!open) {
          resetRoleForm()
          setSelectedRole(null)
        }
      }}>
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
                  disabled={selectedRole?.name === "INSTRUCTOR" || selectedRole?.name === "INSTRUTOR"}
                />
                {(selectedRole?.name === "INSTRUCTOR" || selectedRole?.name === "INSTRUTOR") && (
                  <p className="text-xs text-gray-500">
                    O nome da função "Instrutor" não pode ser alterado
                  </p>
                )}
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
            <Button variant="outline" onClick={() => {
              setIsEditRoleDialogOpen(false)
              resetRoleForm()
              setSelectedRole(null)
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEditRole} 
              className="bg-primary-500 hover:bg-primary-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
