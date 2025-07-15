"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Calendar,
  BookOpen,
  Clock,
  MapPin,
  User,
  GraduationCap,
  FileText,
  Phone,
  Mail,
  Building,
  IdCard,
  Edit,
  X,
  CalendarDays,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { TurmaLessons } from "@/components/turma-lessons"
import { LessonEditModal } from "@/components/lesson-edit-modal"
import { LessonDeleteModal } from "@/components/lesson-delete-modal"

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
  instructor: {
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
  }
  students: Array<{
    id: string
    name: string
    email?: string
    cpf?: string
    phone?: string
    isActive: boolean
  }>
  lessons: Array<{
    id: string
    title: string
    date: string
    startTime: string
    endTime: string
    status: string
    attendance?: Array<{
      studentId: string
      present: boolean
      studentName: string
    }>
  }>
}

interface ClassDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  turma: TurmaData | null
  onEdit?: (turma: TurmaData) => void
  onScheduleLesson?: (turma: TurmaData) => void
}

export function ClassDetailsModal({ isOpen, onClose, turma, onEdit, onScheduleLesson }: ClassDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingLesson, setEditingLesson] = useState<any>(null)
  const [deletingLesson, setDeletingLesson] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview")
      setRefreshTrigger(prev => prev + 1)
    }
  }, [isOpen])

  const handleEditLesson = (lesson: any) => {
    setEditingLesson(lesson)
  }

  const handleLessonEditSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
    setEditingLesson(null)
  }

  const handleCloseLessonEdit = () => {
    setEditingLesson(null)
  }

  const handleDeleteLesson = (lesson: any) => {
    setDeletingLesson(lesson)
  }

  const handleLessonDeleteSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
    setDeletingLesson(null)
  }

  const handleCloseLessonDelete = () => {
    setDeletingLesson(null)
  }

  if (!turma) return null

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

  const getLessonStatusColor = (status: string) => {
    switch (status) {
      case "CONCLUIDA":
        return "bg-green-100 text-green-800"
      case "AGENDADA":
        return "bg-blue-100 text-blue-800"
      case "CANCELADA":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5)
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const calculateAttendanceRate = () => {
    const totalLessons = turma.lessons.length
    if (totalLessons === 0) return 0

    const totalAttendances = turma.lessons.reduce((acc, lesson) => {
      return acc + (lesson.attendance?.filter(a => a.present).length || 0)
    }, 0)

    const totalPossibleAttendances = totalLessons * turma.students.length
    return totalPossibleAttendances > 0 ? (totalAttendances / totalPossibleAttendances) * 100 : 0
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-2xl">
                  {turma.training.title}
                </DialogTitle>
                <Badge className={getStatusColor(turma.status)}>
                  {turma.status}
                </Badge>
                <Badge className={getTypeColor(turma.type)} variant="outline">
                  {turma.type}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(turma)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                )}
                {onScheduleLesson && (
                  <Button
                    size="sm"
                    onClick={() => onScheduleLesson(turma)}
                    className="gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Agendar Aula
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="lessons">Aulas</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna Esquerda */}
                <div className="space-y-6">
                  {/* Informações Gerais */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Informações Gerais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <Badge className={getStatusColor(turma.status)}>
                            {turma.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tipo</label>
                          <Badge className={getTypeColor(turma.type)} variant="outline">
                            {turma.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Período</label>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          {formatDate(turma.startDate)} - {formatDate(turma.endDate)}
                          <span className="text-gray-500">
                            ({calculateDuration(turma.startDate, turma.endDate)} dias)
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Carga Horária</label>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          {turma.training.durationHours} horas
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Validade</label>
                        <p className="text-sm">{turma.training.validityDays} dias</p>
                      </div>
                      
                      {turma.location && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Local</label>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            {turma.location}
                          </div>
                        </div>
                      )}
                      
                      {turma.recycling && turma.recycling !== "NÃO" && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Reciclagem</label>
                          <p className="text-sm">{turma.recycling}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Descrição do Treinamento */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Descrição do Treinamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{turma.training.description}</p>
                    </CardContent>
                  </Card>

                  {/* Alunos */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Alunos ({turma.students.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {turma.students.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum aluno matriculado</p>
                      ) : (
                        <div className="space-y-3">
                          {turma.students.map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{student.name}</p>
                                {student.email && (
                                  <p className="text-sm text-gray-500">{student.email}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {student.isActive ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700">
                                    Ativo
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-red-50 text-red-700">
                                    Inativo
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Coluna Direita */}
                <div className="space-y-6">
                  {/* Instrutor */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Instrutor
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nome</label>
                        <p className="text-sm">{turma.instructor.name}</p>
                      </div>
                      {turma.instructor.email && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-sm flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {turma.instructor.email}
                          </p>
                        </div>
                      )}
                      {turma.instructor.cpf && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">CPF</label>
                          <p className="text-sm flex items-center gap-2">
                            <IdCard className="h-4 w-4" />
                            {turma.instructor.cpf}
                          </p>
                        </div>
                      )}
                      {turma.instructor.education && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Formação</label>
                          <p className="text-sm">{turma.instructor.education}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tipo</label>
                        <p className="text-sm">{turma.instructor.personType}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cliente */}
                  {turma.client && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          Cliente
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Nome</label>
                          <p className="text-sm">{turma.client.name}</p>
                        </div>
                        {turma.client.corporateName && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Razão Social</label>
                            <p className="text-sm">{turma.client.corporateName}</p>
                          </div>
                        )}
                        {turma.client.email && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-sm flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {turma.client.email}
                            </p>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tipo</label>
                          <p className="text-sm">{turma.client.personType}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Observações */}
                  {turma.observations && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Observações
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{turma.observations}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Informações de Sistema */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Informações de Sistema</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Criado em</label>
                        <p>{formatDateTime(turma.createdAt)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Última atualização</label>
                        <p>{formatDateTime(turma.updatedAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="lessons" className="space-y-6">
              <TurmaLessons
                turmaId={turma.id}
                refreshTrigger={refreshTrigger}
                onScheduleNew={onScheduleLesson ? () => onScheduleLesson(turma) : undefined}
                onEditLesson={handleEditLesson}
                onDeleteLesson={handleDeleteLesson}
              />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Alunos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {turma.students.length}
                    </div>
                    <p className="text-sm text-gray-500">Total de alunos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      Aulas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {turma.lessons.length}
                    </div>
                    <p className="text-sm text-gray-500">Total de aulas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Frequência
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {calculateAttendanceRate().toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-500">Taxa de presença</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Progresso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Aulas Concluídas</label>
                        <p className="text-lg font-semibold">
                          {turma.lessons.filter(l => l.status === "CONCLUIDA").length} / {turma.lessons.length}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Aulas Agendadas</label>
                        <p className="text-lg font-semibold">
                          {turma.lessons.filter(l => l.status === "AGENDADA").length}
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status da Turma</label>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(turma.status)} variant="outline">
                          {turma.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {turma.status === "EM ABERTO" && "Aguardando início"}
                          {turma.status === "ATIVA" && "Em andamento"}
                          {turma.status === "FINALIZADA" && "Concluída"}
                          {turma.status === "CANCELADA" && "Cancelada"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Aula */}
      <LessonEditModal
        isOpen={!!editingLesson}
        onClose={handleCloseLessonEdit}
        onSuccess={handleLessonEditSuccess}
        lesson={editingLesson}
        turma={turma ? {
          id: turma.id,
          startDate: turma.startDate,
          endDate: turma.endDate,
          training: {
            title: turma.training.title
          }
        } : undefined}
      />

      {/* Modal de Exclusão de Aula */}
      <LessonDeleteModal
        isOpen={!!deletingLesson}
        onClose={handleCloseLessonDelete}
        onSuccess={handleLessonDeleteSuccess}
        lesson={deletingLesson}
      />
    </>
  )
}
