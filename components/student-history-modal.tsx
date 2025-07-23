"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  History, 
  Calendar, 
  User, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Clock,
  BarChart3,
  FileText,
  Users,
  MapPin,
  GraduationCap,
  Target,
  TrendingUp
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  getStudentHistory, 
  getStudentStatistics,
  type StudentHistoryResponseDto, 
  type StudentStatistics,
  type StudentHistoryFilters,
  type StudentHistoryClassDto
} from "@/lib/api/superadmin"

interface StudentHistoryModalProps {
  studentId: string
  studentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_COLORS = {
  'EM_ABERTO': 'bg-gray-100 text-gray-800',
  'EM_ANDAMENTO': 'bg-blue-100 text-blue-800',
  'CONCLUIDA': 'bg-green-100 text-green-800',
  'CANCELADA': 'bg-red-100 text-red-800',
  'SUSPENSA': 'bg-yellow-100 text-yellow-800'
}

const STATUS_LABELS = {
  'EM_ABERTO': 'Em Aberto',
  'EM_ANDAMENTO': 'Em Andamento',
  'CONCLUIDA': 'Concluída',
  'CANCELADA': 'Cancelada',
  'SUSPENSA': 'Suspensa'
}

export function StudentHistoryModal({ 
  studentId, 
  studentName, 
  open, 
  onOpenChange 
}: StudentHistoryModalProps) {
  const [history, setHistory] = useState<StudentHistoryResponseDto | null>(null)
  const [statistics, setStatistics] = useState<StudentStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("history")
  const { toast } = useToast()

  useEffect(() => {
    if (open && studentId) {
      console.log('🚀 Modal de Histórico Aberto:', {
        studentId,
        studentName,
        open
      })
      fetchHistory()
      fetchStatistics()
    }
  }, [open, studentId])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const data = await getStudentHistory(studentId)
      console.log('📊 Resposta da API - Histórico do Aluno:', {
        studentId,
        response: data,
        totalClasses: data?.classes?.length || 0,
        classes: data?.classes
      })
      setHistory(data)
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar histórico do aluno",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      setStatsLoading(true)
      const data = await getStudentStatistics(studentId)
      console.log('📈 Resposta da API - Estatísticas do Aluno:', {
        studentId,
        response: data,
        totalClasses: data?.totalClasses || 0,
        completedClasses: data?.completedClasses || 0
      })
      setStatistics(data)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar estatísticas do aluno",
        variant: "destructive",
      })
    } finally {
      setStatsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getStatusBadge = (status: string) => {
    const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800'
    const label = STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status
    
    return (
      <Badge className={colorClass}>
        {label}
      </Badge>
    )
  }

  const getAttendanceIcon = (status: string) => {
    if (status === 'PRESENTE') {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    } else if (status === 'AUSENTE') {
      return <XCircle className="h-4 w-4 text-red-500" />
    } else {
      return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  // Todas as turmas (sem filtros)
  const allClasses = history?.classes || []

  // Debug: log das turmas
  console.log('🔍 Turmas do Aluno:', {
    totalClasses: history?.classes?.length || 0,
    allClasses: history?.classes
  })

  // Debug log de renderização
  console.log('🎯 Renderização das Turmas:', {
    loading,
    hasHistory: !!history,
    hasClasses: !!history?.classes,
    totalClasses: history?.classes?.length || 0,
    classesCount: allClasses.length,
    willRender: allClasses.length > 0
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <History className="h-6 w-6" />
            Histórico do Aluno - {studentName}
          </DialogTitle>
          <DialogDescription>
            Histórico completo de turmas, certificações e desempenho
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Histórico de Turmas
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {/* Resumo do Histórico */}
            {history && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total de Turmas</p>
                        <p className="text-2xl font-bold">{history.totalClasses}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Concluídas</p>
                        <p className="text-2xl font-bold text-green-600">{history.completedClasses}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ativas</p>
                        <p className="text-2xl font-bold text-blue-600">{history.activeClasses}</p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Lista de Turmas */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {allClasses.map((cls) => (
                  <Card key={cls.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{cls.training.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(cls.startDate)} - {formatDate(cls.endDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {cls.instructor.name}
                            </div>
                            {cls.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {cls.location}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(cls.status)}
                          <Badge variant="outline">{cls.type}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Informações da Turma */}
                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Detalhes do Treinamento
                          </h4>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Carga Horária:</span> {cls.training.durationHours}h</p>
                            {cls.training.validityDays && (
                              <p><span className="font-medium">Validade:</span> {cls.training.validityDays} dias</p>
                            )}
                            {cls.client && (
                              <p><span className="font-medium">Empresa:</span> {cls.client.name}</p>
                            )}
                            {cls.technicalResponsible && (
                              <p><span className="font-medium">Resp. Técnico:</span> {cls.technicalResponsible.name}</p>
                            )}
                          </div>
                        </div>

                        {/* Notas */}
                        {cls.studentGrade && (
                          <div className="space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              Notas
                            </h4>
                            <div className="text-sm space-y-1">
                              {cls.studentGrade.practicalGrade && (
                                <p><span className="font-medium">Prática:</span> {cls.studentGrade.practicalGrade.toFixed(1)}</p>
                              )}
                              {cls.studentGrade.theoreticalGrade && (
                                <p><span className="font-medium">Teórica:</span> {cls.studentGrade.theoreticalGrade.toFixed(1)}</p>
                              )}
                              {cls.studentGrade.observations && (
                                <p><span className="font-medium">Obs:</span> {cls.studentGrade.observations}</p>
                              )}
                              <p className="text-xs text-gray-500">
                                Avaliado em {formatDate(cls.studentGrade.gradedAt)}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Frequência */}
                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Frequência
                          </h4>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">Aulas:</span> {cls.lessonAttendances.length} registros
                            </p>
                            <div className="flex gap-1">
                              {cls.lessonAttendances.slice(0, 10).map((attendance, index) => (
                                <div key={index} title={`${attendance.lesson.title} - ${attendance.status}`}>
                                  {getAttendanceIcon(attendance.status)}
                                </div>
                              ))}
                              {cls.lessonAttendances.length > 10 && (
                                <span className="text-xs text-gray-500">+{cls.lessonAttendances.length - 10}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {cls.observations && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">
                            <span className="font-medium">Observações:</span> {cls.observations}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {allClasses.length === 0 && !loading && (
                  <Card className="text-center py-8">
                    <CardContent>
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhuma turma encontrada
                      </h3>
                      <p className="text-gray-500">
                        Este aluno ainda não participou de nenhuma turma
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : statistics ? (
              <div className="space-y-6">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Taxa de Frequência</p>
                          <p className="text-2xl font-bold text-green-600">{statistics.attendanceRate.toFixed(1)}%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Aulas Frequentadas</p>
                          <p className="text-2xl font-bold">{statistics.attendedLessons}/{statistics.totalLessons}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Informações Detalhadas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Desempenho Acadêmico
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Média Prática:</span>
                          <span className="font-bold text-lg">{statistics.averageGrades.practical.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(statistics.averageGrades.practical / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Média Teórica:</span>
                          <span className="font-bold text-lg">{statistics.averageGrades.theoretical.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(statistics.averageGrades.theoretical / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Taxa de Frequência:</span>
                          <span className="font-bold text-lg">{statistics.attendanceRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${statistics.attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Resumo Geral
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Data de Matrícula:</span>
                          <span className="font-medium">{formatDate(statistics.enrollmentDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total de Turmas:</span>
                          <span className="font-medium">{statistics.totalClasses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Turmas Concluídas:</span>
                          <span className="font-medium text-green-600">{statistics.completedClasses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total de Aulas:</span>
                          <span className="font-medium">{statistics.totalLessons}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Aulas Frequentadas:</span>
                          <span className="font-medium">{statistics.attendedLessons}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Horas de Treinamento:</span>
                          <span className="font-medium">{statistics.totalHoursCompleted}h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Estatísticas não disponíveis
                  </h3>
                  <p className="text-gray-500">
                    Não foi possível carregar as estatísticas do aluno
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
