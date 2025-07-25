"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Users,
  Calendar,
  BookOpen,
  Clock,
  GraduationCap,
  MoreHorizontal,
  Edit,
  Eye,
  Loader2,
  ClipboardList,
  Building2,
  MapPin
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getInstructorClasses } from "@/lib/api/superadmin"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ClassDetailsModal } from "@/components/class-details-modal"
import { ClassStudentsModal } from "@/components/class-students-modal"
import { ClassAttendanceModal } from "@/components/class-attendance-modal"
import { LessonScheduleModal } from "@/components/lesson-schedule-modal"
import { LessonEditModal } from "@/components/lesson-edit-modal"

interface TurmaData {
  id: string
  trainingId: string
  instructorId: string
  startDate: string
  endDate: string
  status: string
  type: string
  recycling: string
  location?: string
  observations?: string
  clientId?: string
  createdAt: string
  updatedAt: string
  training: {
    id: string
    title: string
    description: string
    durationHours: number
    isActive: boolean
    validityDays: number
  }
  instructor?: {
    id: string
    name: string
    email?: string
    personType: string
    cpf?: string
    education?: string
    isActive: boolean
  }
  client?: {
    id: string
    name: string
    email?: string
    corporateName?: string
    personType: string
    isActive: boolean
  } | null
  students?: {
    id: string
    name: string
    email?: string
    cpf?: string
  }[] | null
  lessons: any[]
}

export function InstructorClassesPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [turmas, setTurmas] = useState<TurmaData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalTurmas, setTotalTurmas] = useState(0)
  const [limit] = useState(10)

  // Estados para modais
  const [detailsTurma, setDetailsTurma] = useState<TurmaData | null>(null)
  const [schedulingTurma, setSchedulingTurma] = useState<TurmaData | null>(null)
  const [editingLesson, setEditingLesson] = useState<any>(null)
  const [managingStudentsTurma, setManagingStudentsTurma] = useState<TurmaData | null>(null)
  const [attendanceTurma, setAttendanceTurma] = useState<TurmaData | null>(null)

  // Carregar dados das turmas do instrutor
  const loadTurmas = async (resetPage = false) => {
    if (resetPage) {
      setSearchLoading(true)
    } else {
      setLoading(true)
    }
    
    try {
      const currentPageToUse = resetPage ? 1 : currentPage
      
      const response = await getInstructorClasses(currentPageToUse, limit, searchTerm.trim() || undefined)
      
      // A API retorna: { classes: [...], pagination: { page, limit, total, totalPages } }
      setTurmas(response.classes || [])
      setTotalPages(response.pagination?.totalPages || 0)
      setTotalTurmas(response.pagination?.total || 0)
      
      // Se resetPage for true, atualizar a página atual
      if (resetPage) {
        setCurrentPage(1)
      }
    } catch (error: any) {
      console.error('Erro ao carregar turmas do instrutor:', error)
      toast.error('Erro ao carregar turmas do instrutor')
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  useEffect(() => {
    loadTurmas()
  }, [currentPage, limit])

  // Busca com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTurmas(true) // Reset page when searching
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Função para atualizar a lista após criação/edição
  const handleSuccess = () => {
    loadTurmas()
  }

  // Handlers para modais
  const handleCloseModal = () => {
    setDetailsTurma(null)
    setSchedulingTurma(null)
    setEditingLesson(null)
    setManagingStudentsTurma(null)
    setAttendanceTurma(null)
  }

  const handleViewDetails = (turma: TurmaData) => {
    setDetailsTurma(turma)
  }

  const handleScheduleLesson = (turma: TurmaData) => {
    setSchedulingTurma(turma)
  }

  const handleManageStudents = (turma: TurmaData) => {
    setManagingStudentsTurma(turma)
  }

  const handleManageAttendance = (turma: TurmaData) => {
    setAttendanceTurma(turma)
  }

  // Função para sucesso no gerenciamento de alunos
  const handleStudentsSuccess = () => {
    loadTurmas()
    setManagingStudentsTurma(null)
  }

  // Função para sucesso na chamada
  const handleAttendanceSuccess = () => {
    loadTurmas()
    setAttendanceTurma(null)
  }

  // Função para sucesso na edição de aula
  const handleLessonEditSuccess = () => {
    loadTurmas()
    setEditingLesson(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EM ABERTO":
        return "bg-yellow-100 text-yellow-800"
      case "ATIVA":
        return "bg-green-100 text-green-800"
      case "FINALIZADA":
        return "bg-blue-100 text-blue-800"
      case "CANCELADA":
        return "bg-red-100 text-red-800"
      case "CONCLUIDO":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "CURSO":
        return "bg-blue-100 text-blue-800"
      case "TREINAMENTO":
        return "bg-green-100 text-green-800"
      case "CAPACITACAO":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Função para calcular se a turma está próxima do vencimento
  const calculateExpirationStatus = (turma: TurmaData) => {
    const today = new Date()
    const endDate = new Date(turma.endDate)
    const validityDays = turma.training.validityDays
    
    // Calcular a data de vencimento da validade (fim da turma + dias de validade)
    const expirationDate = new Date(endDate)
    expirationDate.setDate(expirationDate.getDate() + validityDays)
    
    // Calcular a diferença em dias
    const diffTime = expirationDate.getTime() - today.getTime()
    const daysUntilExpiration = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return {
      daysUntilExpiration,
      isExpired: daysUntilExpiration <= 0,
      isExpiringSoon: daysUntilExpiration > 0 && daysUntilExpiration <= 30, // Considerar "próximo do vencimento" se restam 30 dias ou menos
      expirationDate
    }
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

        {/* Ações e Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            {searchLoading ? (
              <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            )}
            <Input
              placeholder="Buscar por treinamento, cliente ou local..."
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
                  {searchTerm ? "Nenhuma turma encontrada" : "Nenhuma turma atribuída"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? "Tente ajustar os filtros de busca."
                    : "Você não possui turmas atribuídas no momento."
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
                          {turma.training.title}
                        </CardTitle>
                        <Badge className={getStatusColor(turma.status)}>
                          {turma.status}
                        </Badge>
                        <Badge className={getTypeColor(turma.type)} variant="outline">
                          {turma.type}
                        </Badge>
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
                        {turma.training.description}
                      </p>
                      {turma.client && (
                        <p className="text-sm text-gray-500 mt-1">
                          Cliente: {turma.client.name}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="gap-2"
                          onClick={() => handleViewDetails(turma)}
                        >
                          <Eye className="h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          className="gap-2"
                          onClick={() => handleManageStudents(turma)}
                        >
                          <Users className="h-4 w-4" />
                          Gerenciar Alunos
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          className="gap-2"
                          onClick={() => handleManageAttendance(turma)}
                          disabled={!turma.lessons.some(lesson => lesson.status === "REALIZADA")}
                        >
                          <ClipboardList className="h-4 w-4" />
                          Chamada
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          className="gap-2"
                          onClick={() => handleScheduleLesson(turma)}
                        >
                          <Calendar className="h-4 w-4" />
                          Agendar Aula
                        </DropdownMenuItem>
                        
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Informações do Cliente */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Building2 className="h-4 w-4" />
                        Cliente
                      </div>
                      <p className="font-medium">{turma.client?.name || "Não informado"}</p>
                    </div>

                    {/* Informações dos Alunos */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        Alunos
                      </div>
                      <div>
                        <p className="font-medium">
                          {turma.students?.length || 0} aluno{(turma.students?.length || 0) !== 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-gray-500">
                          {turma.lessons.length} aula{turma.lessons.length !== 1 ? 's' : ''}
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
                          {turma.training.durationHours}h
                        </p>
                        <p className="text-sm text-gray-500">
                          Validade: {turma.training.validityDays} dias
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  {(turma.location || turma.recycling !== "NÃO" || turma.observations) && (
                    <div className="mt-6 pt-6 border-t">
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
                      className="gap-2"
                      onClick={() => handleManageStudents(turma)}
                    >
                      <Users className="h-4 w-4" />
                      Gerenciar Alunos
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleManageAttendance(turma)}
                      disabled={!turma.lessons.some(lesson => lesson.status === "REALIZADA")}
                    >
                      <ClipboardList className="h-4 w-4" />
                      Chamada
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleScheduleLesson(turma)}
                    >
                      <Calendar className="h-4 w-4" />
                      Agendar Aula
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
                Anterior
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number
                  if (totalPages <= 5) {
                    page = i + 1
                  } else {
                    const start = Math.max(1, currentPage - 2)
                    const end = Math.min(totalPages, start + 4)
                    const adjustedStart = Math.max(1, end - 4)
                    page = adjustedStart + i
                  }
                  
                  if (page > totalPages) return null
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      <ClassDetailsModal
        isOpen={!!detailsTurma}
        onClose={handleCloseModal}
        turma={detailsTurma}
        onEdit={undefined} // Instrutores não podem editar turmas
        onScheduleLesson={handleScheduleLesson}
        onSuccess={handleSuccess}
      />

      {/* Modal de Agendamento de Aula */}
      <LessonScheduleModal
        isOpen={!!schedulingTurma}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        turma={schedulingTurma}
      />

      {/* Modal de Edição de Aula */}
      <LessonEditModal
        isOpen={!!editingLesson}
        onClose={() => setEditingLesson(null)}
        onSuccess={handleLessonEditSuccess}
        lesson={editingLesson}
        turma={editingLesson ? {
          id: editingLesson.classId,
          startDate: detailsTurma?.startDate || "",
          endDate: detailsTurma?.endDate || "",
          training: {
            title: detailsTurma?.training.title || ""
          }
        } : undefined}
      />

      {/* Modal de Gerenciamento de Alunos */}
      <ClassStudentsModal
        isOpen={!!managingStudentsTurma}
        onClose={handleCloseModal}
        onSuccess={handleStudentsSuccess}
        turma={managingStudentsTurma}
      />

      {/* Modal de Chamada */}
      <ClassAttendanceModal
        isOpen={!!attendanceTurma}
        onClose={handleCloseModal}
        onSuccess={handleAttendanceSuccess}
        turma={attendanceTurma}
      />
    </>
  )
}