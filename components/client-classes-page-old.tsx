"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Users,
  Calendar,
  BookOpen,
  Clock,
  GraduationCap,
  Filter,
  Edit,
  Trash2,
  Eye,
  Loader2,
  UserPlus,
  UserMinus,
  ClipboardList,
  Star,
  Camera,
  UserCog,
  Building2,
  FileText,
  FolderOpen,
  MoreHorizontal,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { getClientDashboardClasses } from "@/lib/api/auth"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { ClassDetailsModal } from "@/components/class-details-modal"
import { AttendanceListModal } from "@/components/attendance-list-modal"
import { ClassReportsModal } from "@/components/class-reports-modal"
import { ClassDocumentsModal } from "@/components/class-documents-modal"

interface ClientClass {
  id: string
  trainingId: string
  trainingTitle: string
  trainingDescription?: string
  trainingDurationHours?: number
  trainingValidityDays?: number
  instructorId: string
  instructorName: string
  startDate: string
  endDate: string
  location: string | null
  status: string
  type?: string
  recycling?: string
  observations?: string
  closingDate: string | null
  totalStudents: number
  totalLessons: number
  completedLessons: number
  clientId?: string
  clientName?: string
  clientCnpj?: string
  technicalResponsibleName?: string
  technicalResponsibleProfession?: string
}

interface ClientClassesResponse {
  clientId: string
  clientName: string
  classes: ClientClass[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function ClientClassesPage() {
  const { toast } = useToast()
  const { isClient, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [turmas, setTurmas] = useState<ClientClass[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalTurmas, setTotalTurmas] = useState(0)
  const [clientName, setClientName] = useState("")
  const limit = 10

  // Estados para modais
  const [detailsTurma, setDetailsTurma] = useState<ClientClass | null>(null)
  const [attendanceListTurma, setAttendanceListTurma] = useState<ClientClass | null>(null)
  const [reportsModalTurma, setReportsModalTurma] = useState<ClientClass | null>(null)
  const [documentsTurma, setDocumentsTurma] = useState<ClientClass | null>(null)

  // Função para carregar turmas do cliente
  const loadTurmas = async (resetPage = false) => {
    const currentPageToUse = resetPage ? 1 : currentPage

    if (resetPage) {
      setSearchLoading(true)
    } else {
      setLoading(true)
    }

    try {
      if (!isClient) {
        toast({
          title: "Erro",
          description: "Acesso negado: Usuário não é do tipo CLIENTE",
          variant: "destructive"
        })
        return
      }

      console.log('📡 Chamando /client-dashboard/classes')
      const response = await getClientDashboardClasses({
        page: currentPageToUse,
        limit: limit,
        search: searchTerm.trim() || undefined,
        status: undefined
      })
      console.log('📦 Resposta da API client-dashboard/classes:', response)

      // Validar resposta
      if (!response || !response.classes || !Array.isArray(response.classes)) {
        console.error('❌ Resposta inválida:', response)
        setTurmas([])
        setTotalPages(0)
        setTotalTurmas(0)
        return
      }

      setTurmas(response.classes)
      setTotalPages(response.pagination?.totalPages || 0)
      setTotalTurmas(response.pagination?.total || 0)
      setClientName(response.clientName || '')

      if (resetPage) {
        setCurrentPage(1)
      }
    } catch (error: any) {
      console.error('Erro ao carregar turmas:', error)
      toast({
        title: "Erro",
        description: error?.response?.data?.message || "Erro ao carregar turmas",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    loadTurmas()
  }, [currentPage, isClient])

  // Busca com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTurmas(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Funções de formatação
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Função para calcular status de expiração
  const calculateExpirationStatus = (turma: ClientClass) => {
    if (!turma.trainingValidityDays) {
      return { daysUntilExpiration: 999, isExpired: false, isExpiringSoon: false }
    }

    const today = new Date()
    const endDate = new Date(turma.endDate)
    const expirationDate = new Date(endDate)
    expirationDate.setDate(expirationDate.getDate() + turma.trainingValidityDays)
    
    const diffTime = expirationDate.getTime() - today.getTime()
    const daysUntilExpiration = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return {
      daysUntilExpiration,
      isExpired: daysUntilExpiration <= 0,
      isExpiringSoon: daysUntilExpiration > 0 && daysUntilExpiration <= 30,
      expirationDate
    }
  }

  // Funções de cor para badges
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'ongoing': return 'bg-blue-100 text-blue-800'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'presencial': return 'border-blue-200 text-blue-700'
      case 'ead': return 'border-purple-200 text-purple-700'
      case 'híbrido': return 'border-orange-200 text-orange-700'
      default: return 'border-gray-200 text-gray-700'
    }
  }

  // Handlers de modais
  const handleViewDetails = (turma: ClientClass) => {
    setDetailsTurma(turma)
  }

  const handleManageAttendanceList = (turma: ClientClass) => {
    setAttendanceListTurma(turma)
  }

  const handleOpenReportsModal = (turma: ClientClass) => {
    setReportsModalTurma(turma)
  }

  const handleManageDocuments = (turma: ClientClass) => {
    setDocumentsTurma(turma)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        
        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset para primeira página ao buscar
  }

  const handleStatusFilter = (value: 'completed' | 'ongoing' | '') => {
    setStatusFilter(value)
    setCurrentPage(1) // Reset para primeira página ao filtrar
  }

  const getStatusVariant = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes('concluída') || statusLower.includes('concluído')) return 'secondary'
    if (statusLower.includes('andamento')) return 'default'
    if (statusLower.includes('agendada')) return 'outline'
    return 'outline'
  }

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes('concluída') || statusLower.includes('concluído')) return 'text-green-600'
    if (statusLower.includes('andamento')) return 'text-blue-600'
    if (statusLower.includes('agendada')) return 'text-yellow-600'
    if (statusLower.includes('encerrada')) return 'text-gray-600'
    return 'text-gray-600'
  }

  if (!isClient) {
    return (
      <Alert className="m-6">
        <AlertDescription>
          Esta página é exclusiva para usuários do tipo CLIENTE.
        </AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando suas turmas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="m-6">
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    )
  }

  const classes = data?.classes || []
  // Estatísticas calculadas apenas para a página atual
  const totalStudentsCurrentPage = classes.reduce((acc, c) => acc + (c.totalStudents || 0), 0)
  const activeClassesCurrentPage = classes.filter(c => c.status === 'Em andamento' || c.status === 'Agendada').length
  const completedClassesCurrentPage = classes.filter(c => c.status === 'Concluída').length

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Turmas</h1>
          <p className="text-gray-600">
            {data?.clientName && `Turmas de ${data.clientName}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Lista
          </Button>
        </div>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Buscar turmas por nome, instrutor ou localização..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={statusFilter === '' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleStatusFilter('')}
              >
                Todas
              </Button>
              <Button 
                variant={statusFilter === 'ongoing' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleStatusFilter('ongoing')}
              >
                Em Andamento
              </Button>
              <Button 
                variant={statusFilter === 'completed' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleStatusFilter('completed')}
              >
                Concluídas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas das turmas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.pagination.total || 0}</div>
            <p className="text-xs text-gray-600">Cadastradas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Turmas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClassesCurrentPage}</div>
            <p className="text-xs text-gray-600">Nesta página</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudentsCurrentPage}</div>
            <p className="text-xs text-gray-600">Nesta página</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Turmas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedClassesCurrentPage}</div>
            <p className="text-xs text-gray-600">Nesta página</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de turmas */}
      {classes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma turma encontrada</h3>
            <p className="text-gray-600">Sua empresa ainda não possui turmas cadastradas.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((turma) => (
              <Card key={turma.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{turma.trainingTitle}</CardTitle>
                      <CardDescription className="mt-1">
                        Instrutor: {turma.instructorName}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(turma.status)} className={getStatusColor(turma.status)}>
                      {turma.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    
                    {/* Informações da turma */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{turma.totalStudents} alunos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span>{turma.totalLessons} aulas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{new Date(turma.startDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{turma.completedLessons}/{turma.totalLessons}</span>
                      </div>
                    </div>

                    {/* Local */}
                    {turma.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{turma.location}</span>
                      </div>
                    )}

                    {/* Data de encerramento */}
                    {turma.closingDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">
                          Concluída em {new Date(turma.closingDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}

                    {/* Ações */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paginação */}
          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(data.pagination.totalPages, prev + 1))}
                disabled={currentPage === data.pagination.totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Informações adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Esta página exibe apenas as turmas relacionadas à sua empresa</p>
            <p>• Para mais informações sobre uma turma específica, clique em "Detalhes"</p>
            <p>• Certificados podem ser baixados individualmente após a conclusão do treinamento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
