"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Users,
  Calendar,
  BookOpen,
  Clock,
  GraduationCap,
  Loader2,
  Eye,
  Download,
  UserCog,
  Building2,
  FileText,
  FolderOpen,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin
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
  students?: any[]
  lessons?: any[]
  // Propriedades aninhadas adicionadas pela transformação
  training?: {
    id: string
    title: string
    description?: string
    durationHours?: number
    validityDays?: number
  }
  instructor?: {
    id: string
    name: string
  }
  client?: {
    id?: string
    name?: string
    cnpj?: string
  }
  technicalResponsible?: {
    name?: string
    profession?: string
  }
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
  const [detailsTurma, setDetailsTurma] = useState<any | null>(null)
  const [attendanceListTurma, setAttendanceListTurma] = useState<any | null>(null)
  const [reportsModalTurma, setReportsModalTurma] = useState<any | null>(null)
  const [documentsTurma, setDocumentsTurma] = useState<any | null>(null)

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

      // Transformar para formato compatível com modais (adicionar estruturas aninhadas esperadas)
      const transformedClasses = response.classes.map((cls: ClientClass) => ({
        ...cls,
        training: {
          id: cls.trainingId,
          title: cls.trainingTitle,
          description: cls.trainingDescription || '',
          durationHours: cls.trainingDurationHours || 0,
          validityDays: cls.trainingValidityDays || 0
        },
        instructor: {
          id: cls.instructorId,
          name: cls.instructorName
        },
        client: cls.clientName ? {
          id: cls.clientId,
          name: cls.clientName,
          cnpj: cls.clientCnpj
        } : undefined,
        technicalResponsible: cls.technicalResponsibleName ? {
          name: cls.technicalResponsibleName,
          profession: cls.technicalResponsibleProfession
        } : undefined,
        students: cls.students || [],
        lessons: cls.lessons || []
      }))

      setTurmas(transformedClasses)
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
  const calculateExpirationStatus = (turma: any) => {
    if (!turma.training?.validityDays) {
      return { daysUntilExpiration: 999, isExpired: false, isExpiringSoon: false }
    }

    const today = new Date()
    const endDate = new Date(turma.endDate)
    const expirationDate = new Date(endDate)
    expirationDate.setDate(expirationDate.getDate() + turma.training.validityDays)
    
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
      case 'completed':
      case 'concluída':
        return 'bg-green-100 text-green-800'
      case 'ongoing':
      case 'em andamento':
        return 'bg-blue-100 text-blue-800'
      case 'scheduled':
      case 'agendada':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
      case 'cancelada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'presencial': return 'border-blue-200 text-blue-700'
      case 'ead': return 'border-purple-200 text-purple-700'
      case 'híbrido': return 'border-orange-200 text-orange-700'
      default: return 'border-gray-200 text-gray-700'
    }
  }

  // Handlers de modais
  const handleViewDetails = (turma: any) => {
    setDetailsTurma(turma)
  }

  const handleManageAttendanceList = (turma: any) => {
    setAttendanceListTurma(turma)
  }

  const handleOpenReportsModal = (turma: any) => {
    setReportsModalTurma(turma)
  }

  const handleManageDocuments = (turma: any) => {
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

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Turmas</h1>
          <p className="text-gray-600">
            {searchTerm ? (
              <>
                Resultados para "{searchTerm}"
                {totalTurmas > 0 && (
                  <span className="ml-2 text-sm font-medium">
                    ({totalTurmas} turma{totalTurmas !== 1 ? 's' : ''} encontrada{totalTurmas !== 1 ? 's' : ''})
                  </span>
                )}
              </>
            ) : (
              <>
                Visualize suas turmas de treinamento
                {totalTurmas > 0 && (
                  <span className="ml-2 text-sm font-medium">
                    ({totalTurmas} turma{totalTurmas !== 1 ? 's' : ''})
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Busca */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            {searchLoading ? (
              <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            )}
            <Input
              placeholder="Buscar minhas turmas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={searchLoading}
            />
            {searchTerm && !searchLoading && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                onClick={() => setSearchTerm("")}
              >
                ×
              </Button>
            )}
          </div>
        </div>
        
        {/* Cards das Turmas */}
        {searchLoading && !loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Buscando turmas...</span>
          </div>
        ) : turmas.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "Nenhuma turma encontrada" : "Nenhuma turma cadastrada"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? "Tente ajustar os filtros de busca."
                    : "Você não possui turmas no momento."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {turmas.map((turma) => (
              <Card key={turma.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">
                          {turma.training?.title || turma.trainingTitle}
                        </CardTitle>
                        <Badge className={getStatusColor(turma.status)}>
                          {turma.status}
                        </Badge>
                        {turma.type && (
                          <Badge className={getTypeColor(turma.type)} variant="outline">
                            {turma.type}
                          </Badge>
                        )}
                        {(() => {
                          const expirationStatus = calculateExpirationStatus(turma)
                          if (expirationStatus.isExpired) {
                            return (
                              <Badge className="bg-red-100 text-red-800">
                                Expirado
                              </Badge>
                            )
                          } else if (expirationStatus.isExpiringSoon) {
                            return (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Vence em {expirationStatus.daysUntilExpiration} dia{expirationStatus.daysUntilExpiration !== 1 ? 's' : ''}
                              </Badge>
                            )
                          }
                          return null
                        })()}
                      </div>
                      <p className="text-gray-600 font-medium">
                        {turma.training?.description || turma.trainingDescription || ''}
                      </p>
                      {turma.client && (
                        <div className="flex items-center gap-2 mt-2">
                          <Building2 className="h-4 w-4 text-blue-600" />
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-blue-900 bg-blue-50 px-2 py-1 rounded">
                              {turma.client.name}
                            </p>
                            {turma.client.cnpj && (
                              <p className="text-xs text-blue-700 mt-1 px-2">
                                CNPJ: {turma.client.cnpj}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(turma)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageAttendanceList(turma)}>
                          <Download className="mr-2 h-4 w-4" />
                          Lista de Presença em PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenReportsModal(turma)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Relatórios
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageDocuments(turma)}>
                          <FolderOpen className="mr-2 h-4 w-4" />
                          Evidências
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Informações do Instrutor */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <BookOpen className="h-4 w-4" />
                        Instrutor
                      </div>
                      <p className="font-medium">{turma.instructor?.name || "Instrutor não definido"}</p>
                    </div>

                    {/* Informações dos Alunos */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        Alunos
                      </div>
                      <div>
                        <p className="font-medium">
                          {turma.totalStudents} aluno{turma.totalStudents !== 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-gray-500">
                          {turma.totalLessons} aula{turma.totalLessons !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Período */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        Período
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {formatDate(turma.startDate)} - {formatDate(turma.endDate)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {calculateDuration(turma.startDate, turma.endDate)} dias
                        </p>
                      </div>
                    </div>

                    {/* Duração do Treinamento */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        Carga Horária
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {turma.training?.durationHours || turma.trainingDurationHours || 0}h
                        </p>
                        <p className="text-sm text-gray-500">
                          Validade: {turma.training?.validityDays || turma.trainingValidityDays || 0} dias
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  {(turma.technicalResponsible || turma.location || turma.recycling !== "NÃO" || turma.observations) && (
                    <div className="mt-6 pt-6 border-t">
                      {/* Responsável Técnico */}
                      {turma.technicalResponsible && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <UserCog className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Responsável Técnico</span>
                          </div>
                          <p className="font-medium text-blue-900">{turma.technicalResponsible.name}</p>
                          {turma.technicalResponsible.profession && (
                            <p className="text-sm text-blue-700">{turma.technicalResponsible.profession}</p>
                          )}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {turma.location && (
                          <div>
                            <span className="text-gray-500">Local:</span>
                            <p className="font-medium">{turma.location}</p>
                          </div>
                        )}
                        {turma.recycling !== "NÃO" && (
                          <div>
                            <span className="text-gray-500">Reciclagem:</span>
                            <p className="font-medium">{turma.recycling}</p>
                          </div>
                        )}
                        {turma.observations && (
                          <div>
                            <span className="text-gray-500">Observações:</span>
                            <p className="font-medium">{turma.observations}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="mt-6 pt-6 border-t flex gap-2 flex-wrap">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleViewDetails(turma)}
                    >
                      <Eye className="h-4 w-4" />
                      Detalhes
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
                      onClick={() => handleOpenReportsModal(turma)}
                    >
                      <FileText className="h-4 w-4" />
                      Relatórios
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => handleManageDocuments(turma)}
                    >
                      <FolderOpen className="h-4 w-4" />
                      Evidências
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="text-sm text-gray-600">
              Mostrando {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, totalTurmas)} de {totalTurmas} turma{totalTurmas !== 1 ? 's' : ''}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modais */}
      {detailsTurma && (
        <ClassDetailsModal
          isOpen={!!detailsTurma}
          onClose={() => setDetailsTurma(null)}
          turma={detailsTurma}
          onSuccess={() => loadTurmas()}
        />
      )}

      {attendanceListTurma && (
        <AttendanceListModal
          isOpen={!!attendanceListTurma}
          onClose={() => setAttendanceListTurma(null)}
          turma={attendanceListTurma}
        />
      )}

      {reportsModalTurma && (
        <ClassReportsModal
          isOpen={!!reportsModalTurma}
          onClose={() => setReportsModalTurma(null)}
          turma={reportsModalTurma}
          onOpenCompanyEvaluation={() => {}}
          onOpenEvidenceReport={() => {}}
          onOpenGrades={() => {}}
          onOpenPhotos={() => {}}
          onOpenTechnicalResponsible={() => {}}
          onOpenDocuments={() => handleManageDocuments(reportsModalTurma)}
          isClientView={true}
          generatingReport={false}
        />
      )}

      {documentsTurma && (
        <ClassDocumentsModal
          isOpen={!!documentsTurma}
          onClose={() => setDocumentsTurma(null)}
          turma={documentsTurma}
        />
      )}
    </>
  )
}
