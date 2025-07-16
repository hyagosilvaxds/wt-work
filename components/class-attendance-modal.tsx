"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, ClipboardList, User, Calendar, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getLessonAttendanceByClass, createLessonAttendance, patchLessonAttendance, deleteLessonAttendance, markAllStudentsAbsent } from "@/lib/api/superadmin"

interface Student {
  id: string
  name: string
  email?: string
  cpf: string
  isActive: boolean
}

interface Lesson {
  id: string
  title: string
  startDate: string
  endDate: string
  status: string
  location?: string
  observations?: string
}

interface TurmaData {
  id: string
  training: {
    title: string
  }
  students: Student[]
  lessons: Lesson[]
}

interface Attendance {
  id: string
  lessonId: string
  studentId: string
  status: string
  observations?: string
  lesson: Lesson
  student: Student
}

interface ClassAttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  turma: TurmaData | null
}

export function ClassAttendanceModal({ isOpen, onClose, onSuccess, turma }: ClassAttendanceModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [selectedLesson, setSelectedLesson] = useState<string>("")
  const [actionLoading, setActionLoading] = useState(false)
  const [initializingLesson, setInitializingLesson] = useState(false)

  // Carregar presenças quando o modal abrir
  useEffect(() => {
    if (isOpen && turma) {
      loadAttendances()
    }
  }, [isOpen, turma])

  // Marcar todos como ausentes quando uma aula for selecionada
  useEffect(() => {
    if (selectedLesson && turma) {
      initializeLessonAttendance(selectedLesson)
    }
  }, [selectedLesson, turma])

  const initializeLessonAttendance = async (lessonId: string) => {
    if (!turma || !lessonId) return

    setInitializingLesson(true)
    try {
      // Verificar se já existem presenças para esta aula
      const existingAttendances = attendances.filter(att => att.lessonId === lessonId)
      
      // Se não existem presenças, marcar todos como ausentes
      if (existingAttendances.length === 0) {
        console.log('Inicializando presenças para a aula:', lessonId)
        await markAllStudentsAbsent(turma.id, lessonId)
        
        // Recarregar as presenças
        await loadAttendances()
        
        toast({
          title: "Chamada Inicializada",
          description: "Todos os alunos foram marcados como ausentes. Marque os presentes.",
        })
      }
    } catch (error) {
      console.error('Erro ao inicializar presenças:', error)
      toast({
        title: "Erro",
        description: "Erro ao inicializar chamada da aula",
        variant: "destructive"
      })
    } finally {
      setInitializingLesson(false)
    }
  }

  const loadAttendances = async () => {
    if (!turma) return
    
    setLoading(true)
    try {
      const response = await getLessonAttendanceByClass(turma.id)
      setAttendances(response.attendances || [])
    } catch (error) {
      console.error('Erro ao carregar presenças:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar presenças",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAttendanceChange = async (studentId: string, lessonId: string, isPresent: boolean) => {
    if (!turma) return

    setActionLoading(true)
    try {
      const status = isPresent ? "PRESENTE" : "AUSENTE"
      
      // Buscar a presença existente (deve existir pois foi inicializada)
      const existingAttendance = attendances.find(
        att => att.studentId === studentId && att.lessonId === lessonId
      )

      if (existingAttendance) {
        // Atualizar presença existente usando PATCH
        await patchLessonAttendance(existingAttendance.id, {
          status
        })
        
        // Atualizar o estado local imediatamente para evitar recarregar a lista
        setAttendances(prevAttendances => 
          prevAttendances.map(att => 
            att.id === existingAttendance.id 
              ? { ...att, status } 
              : att
          )
        )
        
        toast({
          title: "Sucesso",
          description: `Aluno marcado como ${status.toLowerCase()}`,
        })
      } else {
        // Fallback: se não existir, criar nova presença
        const newAttendance = await createLessonAttendance({
          lessonId,
          studentId,
          status
        })
        
        // Adicionar a nova presença ao estado local
        setAttendances(prevAttendances => [...prevAttendances, newAttendance])
        
        toast({
          title: "Sucesso",
          description: `Presença criada como ${status.toLowerCase()}`,
        })
      }
      
      // NÃO recarregar a lista completa para evitar scroll reset
      // await loadAttendances()
      
    } catch (error) {
      console.error('Erro ao atualizar presença:', error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar presença",
        variant: "destructive"
      })
    } finally {
      setActionLoading(false)
    }
  }

  const isStudentPresent = (studentId: string, lessonId: string) => {
    const attendance = attendances.find(
      att => att.studentId === studentId && att.lessonId === lessonId
    )
    return attendance?.status === "PRESENTE"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filtrar apenas aulas com status "REALIZADA"
  const realizadas = turma?.lessons.filter(lesson => lesson.status === "REALIZADA") || []

  const handleClose = () => {
    setSelectedLesson("")
    setInitializingLesson(false)
    // Chamar onSuccess apenas quando o modal for fechado
    if (onSuccess) {
      onSuccess()
    }
    onClose()
  }

  if (!turma) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Chamada - {turma.training.title}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Carregando presenças...</span>
          </div>
        ) : realizadas.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma aula realizada
            </h3>
            <p className="text-gray-500">
              Apenas aulas com status "REALIZADA" podem ter chamada registrada.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Seletor de Aula */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Selecionar Aula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma aula realizada..." />
                  </SelectTrigger>
                  <SelectContent>
                    {realizadas.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{lesson.title}</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(lesson.startDate)} - {formatTime(lesson.startDate)}
                            {lesson.location && <span> • {lesson.location}</span>}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Lista de Alunos */}
            {selectedLesson && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Chamada - {realizadas.find(l => l.id === selectedLesson)?.title}
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    {(() => {
                      const lesson = realizadas.find(l => l.id === selectedLesson)
                      if (lesson) {
                        return `${formatDate(lesson.startDate)} - ${formatTime(lesson.startDate)} às ${formatTime(lesson.endDate)}`
                      }
                      return ""
                    })()}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {turma.students.map((student) => {
                      const isPresent = isStudentPresent(student.id, selectedLesson)
                      return (
                        <div 
                          key={student.id} 
                          className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                            isPresent 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isPresent 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {isPresent ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <XCircle className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">{student.name}</h4>
                              <p className="text-sm text-gray-500">CPF: {student.cpf}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`${student.id}-${selectedLesson}`}
                                checked={isPresent}
                                onCheckedChange={(checked) => 
                                  handleAttendanceChange(student.id, selectedLesson, checked as boolean)
                                }
                                disabled={actionLoading}
                              />
                              <Label 
                                htmlFor={`${student.id}-${selectedLesson}`}
                                className={`text-sm font-medium cursor-pointer ${
                                  isPresent ? 'text-green-700' : 'text-red-700'
                                }`}
                              >
                                {isPresent ? "Presente" : "Ausente"}
                              </Label>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">
                          <strong>{attendances.filter(att => att.lessonId === selectedLesson && att.status === "PRESENTE").length}</strong> Presentes
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="text-sm">
                          <strong>{turma.students.length - attendances.filter(att => att.lessonId === selectedLesson && att.status === "PRESENTE").length}</strong> Ausentes
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {initializingLesson && (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Inicializando chamada...
                        </>
                      )}
                      {!initializingLesson && selectedLesson && (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Chamada ativa - marque os presentes
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
