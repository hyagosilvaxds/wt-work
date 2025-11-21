"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState, useEffect } from "react"
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Eye, 
  Download,
  Search,
  Filter,
  BookOpen,
  Award,
  User,
  Building2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { getClientDashboardClasses } from "@/lib/api/auth"

interface ClientClass {
  id: string
  trainingId: string
  trainingTitle: string
  instructorId: string
  instructorName: string
  startDate: string
  endDate: string
  location: string | null
  status: string
  closingDate: string | null
  totalStudents: number
  totalLessons: number
  completedLessons: number
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
  const { isClient } = useAuth()
  const [data, setData] = useState<ClientClassesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<'completed' | 'ongoing' | ''>("")
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 9 // 9 cards por página (3x3 grid)

  useEffect(() => {
    const fetchClasses = async () => {
      if (!isClient) {
        setError('Acesso negado: Usuário não é do tipo CLIENTE')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await getClientDashboardClasses({
          page: currentPage,
          limit,
          search: searchTerm || undefined,
          status: statusFilter || undefined
        })
        setData(response)
        setError(null)
      } catch (err: any) {
        console.error('Erro ao carregar turmas:', err)
        setError(err?.response?.data?.message || err.message || 'Erro ao carregar turmas')
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [isClient, currentPage, searchTerm, statusFilter])

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
  const totalStudents = classes.reduce((acc, c) => acc + (c.totalStudents || 0), 0)
  const activeClasses = classes.filter(c => c.status === 'Em andamento' || c.status === 'Agendada').length
  const completedClasses = classes.filter(c => c.status === 'Concluída').length

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
            <div className="text-2xl font-bold">{activeClasses}</div>
            <p className="text-xs text-gray-600">Em andamento</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-gray-600">Matriculados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Turmas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedClasses}</div>
            <p className="text-xs text-gray-600">Finalizadas</p>
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
