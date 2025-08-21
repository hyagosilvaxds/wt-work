"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { 
  Plus, 
  Building2, 
  Mail, 
  Phone, 
  Users, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Eye,
  EyeOff,
  Loader2,
  Search,
  MapPin,
  Download,
  Upload,
  FileText
} from "lucide-react"
import { 
  getClients, 
  createClient, 
  CreateClientData, 
  getClientById, 
  patchClient, 
  deleteClient, 
  UpdateClientData,
  exportClientsToExcel,
  importClientsFromExcel,
  downloadClientsTemplate,
  downloadExcelFile
} from "@/lib/api/superadmin"

interface Client {
  id: string
  name: string
  corporateName?: string
  personType?: string
  cpf?: string
  cnpj?: string
  municipalRegistration?: string
  stateRegistration?: string
  zipCode?: string
  address?: string
  number?: string
  neighborhood?: string
  city?: string
  state?: string
  landlineAreaCode?: string
  landlineNumber?: string
  mobileAreaCode?: string
  mobileNumber?: string
  email?: string
  observations?: string
  responsibleName?: string
  responsibleEmail?: string
  responsiblePhone?: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    email: string
    isActive: boolean
  } | null
}

export function ClientsPage() {
  const { toast } = useToast()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalClients, setTotalClients] = useState(0)
  const [clientsPerPage] = useState(10)
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  
  // Excel states
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  
  // Form state
  const [clientForm, setClientForm] = useState<CreateClientData>({
    name: "",
    corporateName: "",
    personType: "FISICA",
    cpf: "",
    cnpj: "",
    municipalRegistration: "",
    stateRegistration: "",
    zipCode: "",
    address: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    landlineAreaCode: "",
    landlineNumber: "",
    mobileAreaCode: "",
    mobileNumber: "",
    email: "",
    observations: "",
    responsibleName: "",
    responsibleEmail: "",
    responsiblePhone: "",
    isActive: true
  })

  // Load clients on component mount
  useEffect(() => {
    loadClients()
  }, [currentPage, searchTerm])

  // API function to load clients
  const loadClients = async () => {
    try {
      setLoading(true)
      const data = await getClients(currentPage, clientsPerPage, searchTerm)
      
      if (data && data.clients) {
        setClients(data.clients)
        setTotalClients(data.pagination?.total || 0)
        setTotalPages(Math.ceil((data.pagination?.total || 0) / clientsPerPage))
      }
    } catch (error) {
      console.error('Error loading clients:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar clientes",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle create client
  const handleCreateClient = async () => {
    if (!clientForm.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      })
      return
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (clientForm.email?.trim() && !emailRegex.test(clientForm.email.trim())) {
      toast({
        title: "Erro",
        description: "Email deve ter um formato válido",
        variant: "destructive"
      })
      return
    }
    
    if (clientForm.responsibleEmail?.trim() && !emailRegex.test(clientForm.responsibleEmail.trim())) {
      toast({
        title: "Erro",
        description: "Email do responsável deve ter um formato válido",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      
      // Clean up the form data - remove empty strings and undefined values
      const cleanedFormData: CreateClientData = {
        name: clientForm.name.trim(),
        isActive: clientForm.isActive ?? true
      }

      // Add optional fields only if they have values
      if (clientForm.corporateName?.trim()) {
        cleanedFormData.corporateName = clientForm.corporateName.trim()
      }
      if (clientForm.personType) {
        cleanedFormData.personType = clientForm.personType
      }
      if (clientForm.cpf?.trim()) {
        cleanedFormData.cpf = clientForm.cpf.trim()
      }
      if (clientForm.cnpj?.trim()) {
        cleanedFormData.cnpj = clientForm.cnpj.trim()
      }
      if (clientForm.email?.trim()) {
        cleanedFormData.email = clientForm.email.trim()
      }
      if (clientForm.responsibleName?.trim()) {
        cleanedFormData.responsibleName = clientForm.responsibleName.trim()
      }
      if (clientForm.responsibleEmail?.trim()) {
        cleanedFormData.responsibleEmail = clientForm.responsibleEmail.trim()
      }
      if (clientForm.responsiblePhone?.trim()) {
        cleanedFormData.responsiblePhone = clientForm.responsiblePhone.trim()
      }
      if (clientForm.observations?.trim()) {
        cleanedFormData.observations = clientForm.observations.trim()
      }
      
      // Address fields
      if (clientForm.zipCode?.trim()) {
        cleanedFormData.zipCode = clientForm.zipCode.trim()
      }
      if (clientForm.address?.trim()) {
        cleanedFormData.address = clientForm.address.trim()
      }
      if (clientForm.number?.trim()) {
        cleanedFormData.number = clientForm.number.trim()
      }
      if (clientForm.neighborhood?.trim()) {
        cleanedFormData.neighborhood = clientForm.neighborhood.trim()
      }
      if (clientForm.city?.trim()) {
        cleanedFormData.city = clientForm.city.trim()
      }
      if (clientForm.state?.trim()) {
        cleanedFormData.state = clientForm.state.trim()
      }

      console.log('Sending client data to API:', cleanedFormData)
      
      await createClient(cleanedFormData)
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso",
      })
      setIsAddDialogOpen(false)
      resetForm()
      loadClients()
    } catch (error: any) {
      console.error('Error creating client:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      
      let errorMessage = "Falha ao criar cliente"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.details) {
        errorMessage = `Erro de validação: ${JSON.stringify(error.response.data.details)}`
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle edit client
  const handleEditClient = async () => {
    if (!selectedClient || !clientForm.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      })
      return
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (clientForm.email?.trim() && !emailRegex.test(clientForm.email.trim())) {
      toast({
        title: "Erro",
        description: "Email deve ter um formato válido",
        variant: "destructive"
      })
      return
    }
    
    if (clientForm.responsibleEmail?.trim() && !emailRegex.test(clientForm.responsibleEmail.trim())) {
      toast({
        title: "Erro",
        description: "Email do responsável deve ter um formato válido",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      
      // Clean up the form data - remove empty strings and undefined values
      const cleanedFormData: UpdateClientData = {
        name: clientForm.name.trim(),
        isActive: clientForm.isActive ?? true
      }

      // Add optional fields only if they have values
      if (clientForm.corporateName?.trim()) {
        cleanedFormData.corporateName = clientForm.corporateName.trim()
      }
      if (clientForm.personType) {
        cleanedFormData.personType = clientForm.personType
      }
      if (clientForm.cpf?.trim()) {
        cleanedFormData.cpf = clientForm.cpf.trim()
      }
      if (clientForm.cnpj?.trim()) {
        cleanedFormData.cnpj = clientForm.cnpj.trim()
      }
      if (clientForm.email?.trim()) {
        cleanedFormData.email = clientForm.email.trim()
      }
      if (clientForm.responsibleName?.trim()) {
        cleanedFormData.responsibleName = clientForm.responsibleName.trim()
      }
      if (clientForm.responsibleEmail?.trim()) {
        cleanedFormData.responsibleEmail = clientForm.responsibleEmail.trim()
      }
      if (clientForm.responsiblePhone?.trim()) {
        cleanedFormData.responsiblePhone = clientForm.responsiblePhone.trim()
      }
      if (clientForm.observations?.trim()) {
        cleanedFormData.observations = clientForm.observations.trim()
      }
      
      // Address fields
      if (clientForm.zipCode?.trim()) {
        cleanedFormData.zipCode = clientForm.zipCode.trim()
      }
      if (clientForm.address?.trim()) {
        cleanedFormData.address = clientForm.address.trim()
      }
      if (clientForm.number?.trim()) {
        cleanedFormData.number = clientForm.number.trim()
      }
      if (clientForm.neighborhood?.trim()) {
        cleanedFormData.neighborhood = clientForm.neighborhood.trim()
      }
      if (clientForm.city?.trim()) {
        cleanedFormData.city = clientForm.city.trim()
      }
      if (clientForm.state?.trim()) {
        cleanedFormData.state = clientForm.state.trim()
      }

      console.log('Sending updated client data to API:', cleanedFormData)
      
      await patchClient(selectedClient.id, cleanedFormData)
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso",
      })
      setIsEditDialogOpen(false)
      setSelectedClient(null)
      resetForm()
      loadClients()
    } catch (error: any) {
      console.error('Error updating client:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      
      let errorMessage = "Falha ao atualizar cliente"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.details) {
        errorMessage = `Erro de validação: ${JSON.stringify(error.response.data.details)}`
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle delete client
  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return
    }

    try {
      setLoading(true)
      await deleteClient(clientId)
      toast({
        title: "Sucesso",
        description: "Cliente excluído com sucesso",
      })
      loadClients()
    } catch (error) {
      console.error('Error deleting client:', error)
      toast({
        title: "Erro",
        description: "Falha ao excluir cliente",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Open edit dialog
  const openEditDialog = (client: Client) => {
    setSelectedClient(client)
    setClientForm({
      name: client.name,
      corporateName: client.corporateName || "",
      personType: client.personType as 'FISICA' | 'JURIDICA' || "FISICA",
      cpf: client.cpf || "",
      cnpj: client.cnpj || "",
      municipalRegistration: client.municipalRegistration || "",
      stateRegistration: client.stateRegistration || "",
      zipCode: client.zipCode || "",
      address: client.address || "",
      number: client.number || "",
      neighborhood: client.neighborhood || "",
      city: client.city || "",
      state: client.state || "",
      landlineAreaCode: client.landlineAreaCode || "",
      landlineNumber: client.landlineNumber || "",
      mobileAreaCode: client.mobileAreaCode || "",
      mobileNumber: client.mobileNumber || "",
      email: client.email || "",
      observations: client.observations || "",
      responsibleName: client.responsibleName || "",
      responsibleEmail: client.responsibleEmail || "",
      responsiblePhone: client.responsiblePhone || "",
      isActive: client.isActive ?? true
    })
    setIsEditDialogOpen(true)
  }

  // Reset form
  const resetForm = () => {
    setClientForm({
      name: "",
      corporateName: "",
      personType: "FISICA",
      cpf: "",
      cnpj: "",
      municipalRegistration: "",
      stateRegistration: "",
      zipCode: "",
      address: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      landlineAreaCode: "",
      landlineNumber: "",
      mobileAreaCode: "",
      mobileNumber: "",
      email: "",
      observations: "",
      responsibleName: "",
      responsibleEmail: "",
      responsiblePhone: "",
      isActive: true
    })
  }

  // Format phone number
  const formatPhone = (areaCode?: string, number?: string) => {
    if (!areaCode && !number) return "Não informado"
    return `(${areaCode || "--"}) ${number || "-----"}`
  }

  // Get full address
  const getFullAddress = (client: Client) => {
    const parts = [
      client.address,
      client.number,
      client.neighborhood,
      client.city,
      client.state
    ].filter(Boolean)
    
    return parts.length > 0 ? parts.join(", ") : "Endereço não informado"
  }

  // Handle export to Excel
  const handleExportToExcel = async () => {
    try {
      setIsExporting(true)
      
      const filters = {
        search: searchTerm || undefined
      }
      
      const result = await exportClientsToExcel(filters)
      
      toast({
        title: "Exportação concluída",
        description: `${result.totalRecords} clientes exportados com sucesso`,
      })

      // Fazer download automático usando o fileName da resposta
      await downloadExcelFile(result.fileName)
      
    } catch (error: any) {
      console.error('Erro na exportação:', error)
      
      let errorMessage = "Erro ao exportar clientes"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Erro na exportação",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Handle download template
  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadClientsTemplate()
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'template_clientes.xlsx'
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Download concluído",
        description: "Template de clientes baixado com sucesso",
      })
    } catch (error: any) {
      console.error('Erro ao baixar template:', error)
      toast({
        title: "Erro no download",
        description: "Erro ao baixar template de clientes",
        variant: "destructive"
      })
    }
  }

  // Handle file selection for import
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  // Handle import from Excel
  const handleImportFromExcel = async () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo Excel primeiro",
        variant: "destructive"
      })
      return
    }

    try {
      setIsImporting(true)
      
      // Primeiro validar o arquivo
      const validation = await importClientsFromExcel(selectedFile, true)
      
      if (validation.invalidRecords > 0) {
        const errorDetails = validation.errors?.map(err => 
          `Linha ${err.row}: ${err.field} - ${err.message}`
        ).join('\n') || ''
        
        toast({
          title: "Arquivo com erros",
          description: `${validation.invalidRecords} registros com problemas:\n${errorDetails}`,
          variant: "destructive"
        })
        return
      }

      // Se validação passou, perguntar se quer importar
      if (!confirm(`Validação concluída! ${validation.validRecords} registros válidos encontrados. Deseja prosseguir com a importação?`)) {
        return
      }

      // Importar os dados
      const result = await importClientsFromExcel(selectedFile, false)
      
      toast({
        title: "Importação concluída",
        description: `${result.importedRecords} clientes importados com sucesso de ${result.totalRecords} registros processados`,
      })

      // Limpar arquivo selecionado e recarregar lista
      setSelectedFile(null)
      setIsImportDialogOpen(false)
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      
      loadClients()
      
    } catch (error: any) {
      console.error('Erro na importação:', error)
      
      let errorMessage = "Erro ao importar clientes"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.errors) {
        const errorDetails = error.response.data.errors.map((err: any) => 
          `Linha ${err.row}: ${err.field} - ${err.message}`
        ).join('\n')
        errorMessage = `Erros encontrados:\n${errorDetails}`
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Erro na importação",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie as empresas clientes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={handleExportToExcel}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? 'Exportando...' : 'Exportar Excel'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setIsImportDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar Excel
          </Button>
          
          <Button 
            className="bg-primary-500 hover:bg-primary-600"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Clients Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando clientes...</span>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? "Tente ajustar sua busca" : "Comece criando um novo cliente"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-8 w-8 text-secondary-500 mt-1" />
                    <div>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <CardDescription>
                        {client.responsibleName ? `Contato: ${client.responsibleName}` : client.corporateName || "Cliente"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={client.isActive ? "default" : "secondary"}
                    className={client.isActive ? "bg-primary-500" : ""}
                  >
                    {client.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="mr-2 h-4 w-4" />
                    {client.email || client.responsibleEmail || "Email não informado"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="mr-2 h-4 w-4" />
                    {client.responsiblePhone || formatPhone(client.mobileAreaCode, client.mobileNumber)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span className="truncate">{getFullAddress(client)}</span>
                  </div>
                  {client.user && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Usuário Vinculado</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {client.user.name}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => openEditDialog(client)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Editar
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(client)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClient(client.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {clients.length} de {totalClients} clientes
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

      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Adicione um novo cliente ao sistema
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Básicas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={clientForm.name}
                    onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do cliente"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="corporateName">Nome Corporativo</Label>
                  <Input
                    id="corporateName"
                    value={clientForm.corporateName}
                    onChange={(e) => setClientForm(prev => ({ ...prev, corporateName: e.target.value }))}
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="personType">Tipo de Pessoa</Label>
                  <Select 
                    value={clientForm.personType} 
                    onValueChange={(value: 'FISICA' | 'JURIDICA') => 
                      setClientForm(prev => ({ ...prev, personType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FISICA">Pessoa Física</SelectItem>
                      <SelectItem value="JURIDICA">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document">
                    {clientForm.personType === 'FISICA' ? 'CPF' : 'CNPJ'}
                  </Label>
                  <Input
                    id="document"
                    value={clientForm.personType === 'FISICA' ? clientForm.cpf : clientForm.cnpj}
                    onChange={(e) => setClientForm(prev => ({ 
                      ...prev, 
                      [clientForm.personType === 'FISICA' ? 'cpf' : 'cnpj']: e.target.value 
                    }))}
                    placeholder={clientForm.personType === 'FISICA' ? 'Digite o CPF' : 'Digite o CNPJ'}
                  />
                </div>
              </div>
              
              {/* Registros Fiscais */}
              {clientForm.personType === 'JURIDICA' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="municipalRegistration">Inscrição Municipal</Label>
                    <Input
                      id="municipalRegistration"
                      value={clientForm.municipalRegistration}
                      onChange={(e) => setClientForm(prev => ({ ...prev, municipalRegistration: e.target.value }))}
                      placeholder="Digite a inscrição municipal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateRegistration">Inscrição Estadual</Label>
                    <Input
                      id="stateRegistration"
                      value={clientForm.stateRegistration}
                      onChange={(e) => setClientForm(prev => ({ ...prev, stateRegistration: e.target.value }))}
                      placeholder="Digite a inscrição estadual"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={clientForm.isActive}
                  onCheckedChange={(checked) => setClientForm(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Cliente Ativo</Label>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Endereço</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={clientForm.zipCode}
                    onChange={(e) => setClientForm(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="00000-000"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={clientForm.address}
                    onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Rua, Avenida, etc."
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={clientForm.number}
                    onChange={(e) => setClientForm(prev => ({ ...prev, number: e.target.value }))}
                    placeholder="123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={clientForm.neighborhood}
                    onChange={(e) => setClientForm(prev => ({ ...prev, neighborhood: e.target.value }))}
                    placeholder="Bairro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={clientForm.city}
                    onChange={(e) => setClientForm(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Cidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={clientForm.state}
                    onChange={(e) => setClientForm(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="SP"
                  />
                </div>
              </div>
            </div>

            {/* Contatos */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contatos</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientForm.email}
                    onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsibleName">Nome do Responsável</Label>
                  <Input
                    id="responsibleName"
                    value={clientForm.responsibleName}
                    onChange={(e) => setClientForm(prev => ({ ...prev, responsibleName: e.target.value }))}
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>
              
              {/* Telefones */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone Fixo</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Input
                        value={clientForm.landlineAreaCode}
                        onChange={(e) => setClientForm(prev => ({ ...prev, landlineAreaCode: e.target.value }))}
                        placeholder="11"
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Input
                        value={clientForm.landlineNumber}
                        onChange={(e) => setClientForm(prev => ({ ...prev, landlineNumber: e.target.value }))}
                        placeholder="99999-9999"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Telefone Celular</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Input
                        value={clientForm.mobileAreaCode}
                        onChange={(e) => setClientForm(prev => ({ ...prev, mobileAreaCode: e.target.value }))}
                        placeholder="11"
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Input
                        value={clientForm.mobileNumber}
                        onChange={(e) => setClientForm(prev => ({ ...prev, mobileNumber: e.target.value }))}
                        placeholder="99999-9999"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsibleEmail">Email do Responsável</Label>
                  <Input
                    id="responsibleEmail"
                    type="email"
                    value={clientForm.responsibleEmail}
                    onChange={(e) => setClientForm(prev => ({ ...prev, responsibleEmail: e.target.value }))}
                    placeholder="responsavel@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsiblePhone">Telefone do Responsável</Label>
                  <Input
                    id="responsiblePhone"
                    value={clientForm.responsiblePhone}
                    onChange={(e) => setClientForm(prev => ({ ...prev, responsiblePhone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Observações</h3>
              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  value={clientForm.observations}
                  onChange={(e) => setClientForm(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="Observações sobre o cliente..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateClient} 
              className="bg-primary-500 hover:bg-primary-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Cliente'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open)
        if (!open) {
          setSelectedClient(null)
          resetForm()
        }
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Altere as informações do cliente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Same form fields as add dialog */}
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Básicas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome *</Label>
                  <Input
                    id="edit-name"
                    value={clientForm.name}
                    onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do cliente"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-corporateName">Nome Corporativo</Label>
                  <Input
                    id="edit-corporateName"
                    value={clientForm.corporateName}
                    onChange={(e) => setClientForm(prev => ({ ...prev, corporateName: e.target.value }))}
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-personType">Tipo de Pessoa</Label>
                  <Select 
                    value={clientForm.personType} 
                    onValueChange={(value: 'FISICA' | 'JURIDICA') => 
                      setClientForm(prev => ({ ...prev, personType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FISICA">Pessoa Física</SelectItem>
                      <SelectItem value="JURIDICA">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-document">
                    {clientForm.personType === 'FISICA' ? 'CPF' : 'CNPJ'}
                  </Label>
                  <Input
                    id="edit-document"
                    value={clientForm.personType === 'FISICA' ? clientForm.cpf : clientForm.cnpj}
                    onChange={(e) => setClientForm(prev => ({ 
                      ...prev, 
                      [clientForm.personType === 'FISICA' ? 'cpf' : 'cnpj']: e.target.value 
                    }))}
                    placeholder={clientForm.personType === 'FISICA' ? 'Digite o CPF' : 'Digite o CNPJ'}
                  />
                </div>
              </div>
              
              {/* Registros Fiscais */}
              {clientForm.personType === 'JURIDICA' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-municipalRegistration">Inscrição Municipal</Label>
                    <Input
                      id="edit-municipalRegistration"
                      value={clientForm.municipalRegistration}
                      onChange={(e) => setClientForm(prev => ({ ...prev, municipalRegistration: e.target.value }))}
                      placeholder="Digite a inscrição municipal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-stateRegistration">Inscrição Estadual</Label>
                    <Input
                      id="edit-stateRegistration"
                      value={clientForm.stateRegistration}
                      onChange={(e) => setClientForm(prev => ({ ...prev, stateRegistration: e.target.value }))}
                      placeholder="Digite a inscrição estadual"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={clientForm.isActive}
                  onCheckedChange={(checked) => setClientForm(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="edit-isActive">Cliente Ativo</Label>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Endereço</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-zipCode">CEP</Label>
                  <Input
                    id="edit-zipCode"
                    value={clientForm.zipCode}
                    onChange={(e) => setClientForm(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="00000-000"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-address">Endereço</Label>
                  <Input
                    id="edit-address"
                    value={clientForm.address}
                    onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Rua, Avenida, etc."
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-number">Número</Label>
                  <Input
                    id="edit-number"
                    value={clientForm.number}
                    onChange={(e) => setClientForm(prev => ({ ...prev, number: e.target.value }))}
                    placeholder="123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-neighborhood">Bairro</Label>
                  <Input
                    id="edit-neighborhood"
                    value={clientForm.neighborhood}
                    onChange={(e) => setClientForm(prev => ({ ...prev, neighborhood: e.target.value }))}
                    placeholder="Bairro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-city">Cidade</Label>
                  <Input
                    id="edit-city"
                    value={clientForm.city}
                    onChange={(e) => setClientForm(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Cidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">Estado</Label>
                  <Input
                    id="edit-state"
                    value={clientForm.state}
                    onChange={(e) => setClientForm(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="SP"
                  />
                </div>
              </div>
            </div>

            {/* Contatos */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contatos</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={clientForm.email}
                    onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-responsibleName">Nome do Responsável</Label>
                  <Input
                    id="edit-responsibleName"
                    value={clientForm.responsibleName}
                    onChange={(e) => setClientForm(prev => ({ ...prev, responsibleName: e.target.value }))}
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>
              
              {/* Telefones */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone Fixo</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Input
                        value={clientForm.landlineAreaCode}
                        onChange={(e) => setClientForm(prev => ({ ...prev, landlineAreaCode: e.target.value }))}
                        placeholder="11"
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Input
                        value={clientForm.landlineNumber}
                        onChange={(e) => setClientForm(prev => ({ ...prev, landlineNumber: e.target.value }))}
                        placeholder="99999-9999"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Telefone Celular</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Input
                        value={clientForm.mobileAreaCode}
                        onChange={(e) => setClientForm(prev => ({ ...prev, mobileAreaCode: e.target.value }))}
                        placeholder="11"
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Input
                        value={clientForm.mobileNumber}
                        onChange={(e) => setClientForm(prev => ({ ...prev, mobileNumber: e.target.value }))}
                        placeholder="99999-9999"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-responsibleEmail">Email do Responsável</Label>
                  <Input
                    id="edit-responsibleEmail"
                    type="email"
                    value={clientForm.responsibleEmail}
                    onChange={(e) => setClientForm(prev => ({ ...prev, responsibleEmail: e.target.value }))}
                    placeholder="responsavel@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-responsiblePhone">Telefone do Responsável</Label>
                  <Input
                    id="edit-responsiblePhone"
                    value={clientForm.responsiblePhone}
                    onChange={(e) => setClientForm(prev => ({ ...prev, responsiblePhone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Observações</h3>
              <div className="space-y-2">
                <Label htmlFor="edit-observations">Observações</Label>
                <Textarea
                  id="edit-observations"
                  value={clientForm.observations}
                  onChange={(e) => setClientForm(prev => ({ ...prev, observations: e.target.value }))}
                  placeholder="Observações sobre o cliente..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEditClient} 
              className="bg-primary-500 hover:bg-primary-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Importar Clientes do Excel</DialogTitle>
            <DialogDescription>
              Selecione um arquivo Excel (.xlsx ou .xls) para importar clientes em lote
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h4 className="font-medium text-blue-900 mb-2">Precisa do template?</h4>
              <p className="text-sm text-blue-700 mb-3">
                Baixe o arquivo modelo com a estrutura correta para importação.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar Template
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-input">Arquivo Excel</Label>
              <Input
                id="file-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
              />
              <p className="text-sm text-muted-foreground">
                Apenas arquivos .xlsx e .xls são aceitos
              </p>
            </div>

            {selectedFile && (
              <div className="p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <div className="p-3 border rounded-lg bg-yellow-50">
              <h4 className="font-medium text-yellow-900 mb-1">Importante:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Nome é obrigatório</li>
                <li>• Pessoa Física: requer CPF válido</li>
                <li>• Pessoa Jurídica: requer CNPJ válido</li>
                <li>• Emails devem ser únicos no sistema</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsImportDialogOpen(false)
                setSelectedFile(null)
                const fileInput = document.getElementById('file-input') as HTMLInputElement
                if (fileInput) fileInput.value = ''
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleImportFromExcel}
              disabled={!selectedFile || isImporting}
              className="flex items-center gap-2"
            >
              {isImporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isImporting ? 'Importando...' : 'Importar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
