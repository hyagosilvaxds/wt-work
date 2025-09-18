"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getStudents, addStudentsToClass, removeStudentsFromClass } from "@/lib/api/superadmin"
import { getClassById } from "@/lib/api/superadmin"
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
  XCircle,
  AlertCircle,
  UserPlus,
  UserMinus,
  Search,
  Loader2
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
  onSuccess?: () => void
}

export function ClassDetailsModal({ isOpen, onClose, turma, onEdit, onScheduleLesson, onSuccess }: ClassDetailsModalProps) {
  const { toast } = useToast()
  const { isClient } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingLesson, setEditingLesson] = useState<any>(null)
  const [deletingLesson, setDeletingLesson] = useState<any>(null)
  
  // Estados para gerenciar alunos
  const [allStudents, setAllStudents] = useState<any[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [studentsToRemove, setStudentsToRemove] = useState<string[]>([])
  const [turmaStudents, setTurmaStudents] = useState<any[]>(turma ? turma.students : [])
  const [searchTerm, setSearchTerm] = useState("")
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  const formatCPF = (cpf: string) => {
    if (!cpf) return "-"
    const cleanCPF = cpf.replace(/\D/g, '')
    if (cleanCPF.length !== 11) return cpf
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview")
      setRefreshTrigger(prev => prev + 1)
      setSelectedStudents([])
      setStudentsToRemove([])
      setSearchTerm("")
      setComboboxOpen(false)
  setAllStudents([])
  setTurmaStudents(turma ? turma.students : [])
    }
  }, [isOpen])

  // Carregar quando a aba de alunos for ativada
  useEffect(() => {
    if (activeTab === "students" && isOpen) {
      // Não carregar estudantes automaticamente, apenas quando houver busca
  setAllStudents([])
  setTurmaStudents(turma ? turma.students : [])
    }
  }, [activeTab, isOpen])

  // Buscar estudantes com debounce - mesmo sistema da página de alunos
  useEffect(() => {
    if (!isOpen || activeTab !== "students") return

    console.log('🔍 useEffect disparado - searchTerm:', `"${searchTerm}"`, 'length:', searchTerm.length)

    // Remover a verificação de tamanho mínimo para testar
    if (searchTerm.trim() !== "") {
      setSearchLoading(true)
    }

    const timer = setTimeout(() => {
      console.log('⏰ Timer executado - searchTerm:', `"${searchTerm.trim()}"`)
      if (searchTerm.trim() !== "") {
        loadStudents()
      } else {
        setAllStudents([])
        setSearchLoading(false)
      }
    }, 500) // Usar o mesmo tempo da página de alunos

    return () => clearTimeout(timer)
  }, [searchTerm, isOpen, activeTab])

  const loadStudents = async () => {
    const trimmedSearch = searchTerm.trim()
    
    console.log('🔍 loadStudents chamado com:', `"${trimmedSearch}"`, 'length:', trimmedSearch.length)
    
    if (trimmedSearch === "") {
      setAllStudents([])
      setSearchLoading(false)
      return
    }

    setSearchLoading(true)
    
    try {
      console.log('🔍 Carregando estudantes com busca:', trimmedSearch)
      console.log('📊 Parâmetros da busca: page=1, limit=100, search=', trimmedSearch)
      
      const response = await getStudents(1, 100, trimmedSearch)
      console.log('📥 Resposta da API:', response)
      console.log('👥 Estudantes carregados total:', response.students?.length || 0)
      
      if (response.students?.length > 0) {
        console.log('📝 Primeiros 3 nomes encontrados:', response.students.slice(0, 3).map((s: any) => s.name))
      }
      
      // Filtrar estudantes que não estão na turma e que estão ativos
      const availableStudents = (response.students || []).filter((student: any) => {
        const isAlreadyInClass = (turmaStudents || turma?.students || []).some(classStudent => classStudent.id === student.id)
        const isActive = student.isActive
        
        console.log(`🔍 Checando aluno ${student.name}: já na turma=${isAlreadyInClass}, ativo=${isActive}`)
        
        return !isAlreadyInClass && isActive
      })
      
      console.log('✅ Estudantes disponíveis após filtro:', availableStudents.length)
      if (availableStudents.length > 0) {
        console.log('📝 Nomes disponíveis:', availableStudents.map((s: any) => s.name))
      }
      setAllStudents(availableStudents)
    } catch (error) {
      console.error('Erro ao carregar estudantes:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar estudantes",
        variant: "destructive"
      })
      setAllStudents([])
    } finally {
      setSearchLoading(false)
    }
  }

    // Reload turma students from API
    const reloadTurmaStudents = async () => {
      if (!turma) return
      try {
        const refreshed = await getClassById(turma.id)
        setTurmaStudents(refreshed.students || [])
      } catch (error) {
        console.error('Erro ao recarregar estudantes da turma:', error)
      }
    }

  const handleAddStudents = async () => {
    if (!turma || selectedStudents.length === 0) return

    setActionLoading(true)
    try {
      await addStudentsToClass(turma.id, selectedStudents)
      toast({
        title: "Sucesso",
        description: `${selectedStudents.length} aluno(s) adicionado(s) à turma`,
      })
      setSelectedStudents([])
      setComboboxOpen(false)
      
      // Recarregar a lista de estudantes disponíveis se há uma busca ativa
      if (searchTerm.trim().length >= 2) {
        loadStudents()
      }

      // Recarregar os estudantes da turma para refletir a adição
      await reloadTurmaStudents()
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Erro ao adicionar alunos:', error)
      toast({
        title: "Erro",
        description: "Erro ao adicionar alunos à turma",
        variant: "destructive"
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemoveStudents = async () => {
    if (!turma || studentsToRemove.length === 0) return

    setActionLoading(true)
    try {
      await removeStudentsFromClass(turma.id, studentsToRemove)
      toast({
        title: "Sucesso",
        description: `${studentsToRemove.length} aluno(s) removido(s) da turma`,
      })
      setStudentsToRemove([])
      // Recarregar estudantes da turma para refletir remoção
      await reloadTurmaStudents()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Erro ao remover alunos:', error)
      toast({
        title: "Erro",
        description: "Erro ao remover alunos da turma",
        variant: "destructive"
      })
    } finally {
      setActionLoading(false)
    }
  }

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const toggleStudentRemoval = (studentId: string) => {
    setStudentsToRemove(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  // Usar diretamente os estudantes já filtrados do backend
  const availableStudents = allStudents

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
              <TabsTrigger value="students">Alunos</TabsTrigger>
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
                        Alunos ({(turmaStudents || []).length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(turmaStudents || []).length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum aluno matriculado</p>
                      ) : (
                        <div className="space-y-3">
                          {(turmaStudents || []).map((student) => (
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
                        <p className="text-sm">{turma.instructor?.name || "Instrutor não informado"}</p>
                      </div>
                      {turma.instructor?.email && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-sm flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {turma.instructor.email}
                          </p>
                        </div>
                      )}
                      {turma.instructor?.cpf && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">CPF</label>
                          <p className="text-sm flex items-center gap-2">
                            <IdCard className="h-4 w-4" />
                            {formatCPF(turma.instructor.cpf)}
                          </p>
                        </div>
                      )}
                      {turma.instructor?.education && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Formação</label>
                          <p className="text-sm">{turma.instructor.education}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tipo</label>
                        <p className="text-sm">{turma.instructor?.personType || "Não informado"}</p>
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
                onEditLesson={!isClient ? handleEditLesson : undefined}
                onDeleteLesson={!isClient ? handleDeleteLesson : undefined}
              />
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              {/* Alunos Atuais da Turma */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Alunos Matriculados ({(turmaStudents || []).length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(turmaStudents || []).length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhum aluno matriculado nesta turma</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(turmaStudents || []).map((student: any) => (
                        <div 
                          key={student.id} 
                          className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${
                            studentsToRemove.includes(student.id) 
                              ? 'bg-red-50 border-red-200' 
                              : ''
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{student.name}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                {student.email && (
                                  <span className="flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    {student.email}
                                  </span>
                                )}
                                {student.cpf && (
                                  <span className="flex items-center gap-1">
                                    <IdCard className="h-4 w-4" />
                                    {formatCPF(student.cpf)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={student.isActive ? "default" : "secondary"}>
                              {student.isActive ? "Ativo" : "Inativo"}
                            </Badge>
                            {!isClient && (
                              <Button
                                variant={studentsToRemove.includes(student.id) ? "destructive" : "outline"}
                                size="sm"
                                onClick={() => toggleStudentRemoval(student.id)}
                                disabled={actionLoading}
                              >
                                {studentsToRemove.includes(student.id) ? (
                                  <>
                                    <X className="h-4 w-4 mr-1" />
                                    Cancelar
                                  </>
                                ) : (
                                  <>
                                    <UserMinus className="h-4 w-4 mr-1" />
                                    Remover
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {studentsToRemove.length > 0 && !isClient && (
                        <div className="flex justify-end pt-4 border-t">
                          <Button
                            variant="destructive"
                            onClick={handleRemoveStudents}
                            disabled={actionLoading}
                          >
                            {actionLoading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <UserMinus className="h-4 w-4 mr-2" />
                            )}
                            Remover {studentsToRemove.length} Aluno(s)
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Adicionar Novos Alunos - Apenas para não-CLIENT */}
              {!isClient && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Adicionar Alunos
                    </CardTitle>
                  </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="student-search">Selecionar Alunos</Label>
                      <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={comboboxOpen}
                            className="w-full justify-between"
                            disabled={searchLoading}
                          >
                            {selectedStudents.length === 0 
                              ? "Digite para buscar alunos..." 
                              : `${selectedStudents.length} aluno(s) selecionado(s)`
                            }
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <div className="p-2">
                              <Input 
                                placeholder="Buscar alunos..." 
                                value={searchTerm}
                                onChange={(e) => {
                                  console.log('🎯 Input onChange:', `"${e.target.value}"`);
                                  setSearchTerm(e.target.value);
                                }}
                                className="w-full"
                              />
                            </div>
                            <CommandList>
                              <CommandEmpty>
                                {searchLoading ? "Carregando..." : searchTerm.trim() === "" ? "Digite o nome do aluno para buscar" : "Nenhum aluno encontrado"}
                              </CommandEmpty>
                              <CommandGroup>
                                {availableStudents.map((student) => (
                                  <CommandItem
                                    key={student.id}
                                    value={student.id}
                                    onSelect={() => toggleStudentSelection(student.id)}
                                  >
                                    <div className="flex items-center space-x-2 w-full">
                                      <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() => {}}
                                        className="rounded"
                                      />
                                      <div className="flex-1">
                                        <p className="font-medium">{student.name}</p>
                                        <p className="text-sm text-gray-600">
                                          {student.email} • CPF: {formatCPF(student.cpf)}
                                        </p>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Alunos Selecionados */}
                    {selectedStudents.length > 0 && (
                      <div className="space-y-2">
                        <Label>Alunos Selecionados ({selectedStudents.length})</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedStudents.map((studentId) => {
                            const student = allStudents.find(s => s.id === studentId)
                            return (
                              <Badge key={studentId} variant="secondary">
                                {student?.name}
                                <button
                                  onClick={() => toggleStudentSelection(studentId)}
                                  className="ml-2 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {selectedStudents.length > 0 && (
                      <Button
                        onClick={handleAddStudents}
                        disabled={actionLoading}
                        className="w-full"
                      >
                        {actionLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <UserPlus className="h-4 w-4 mr-2" />
                        )}
                        Adicionar {selectedStudents.length} Aluno(s)
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              )}
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
