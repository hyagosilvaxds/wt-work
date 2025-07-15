"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  BookOpen,
  Save,
  X,
  Plus,
  AlertCircle,
  Check
} from "lucide-react"
import { createLesson } from "@/lib/api/superadmin"

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
  training: {
    id: string
    title: string
    description: string
    durationHours: number
    validityDays: number
  }
  instructor: {
    id: string
    name: string
    email?: string
  }
  client?: {
    id: string
    name: string
  }
  students: Array<{
    id: string
    name: string
  }>
}

interface LessonScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  turma: TurmaData | null
}

interface LessonFormData {
  title: string
  description: string
  date: Date | undefined
  startTime: string
  endTime: string
  status: string
  location: string
  observations: string
}

const LESSON_STATUS_OPTIONS = [
  { value: "AGENDADA", label: "Agendada", color: "bg-blue-100 text-blue-800" },
  { value: "CONFIRMADA", label: "Confirmada", color: "bg-green-100 text-green-800" },
  { value: "CANCELADA", label: "Cancelada", color: "bg-red-100 text-red-800" },
  { value: "REAGENDADA", label: "Reagendada", color: "bg-yellow-100 text-yellow-800" }
]

export function LessonScheduleModal({ isOpen, onClose, onSuccess, turma }: LessonScheduleModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<LessonFormData>({
    title: "",
    description: "",
    date: undefined,
    startTime: "",
    endTime: "",
    status: "AGENDADA",
    location: "",
    observations: ""
  })

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (isOpen && turma) {
      // Debug: verificar datas da turma
      console.log('Turma startDate:', turma.startDate)
      console.log('Turma endDate:', turma.endDate)
      console.log('Turma startDate parsed:', new Date(turma.startDate))
      console.log('Turma endDate parsed:', new Date(turma.endDate))
      console.log('Current date:', new Date())
      
      setFormData({
        title: `Aula - ${turma.training.title}`,
        description: turma.training.description || "",
        date: undefined,
        startTime: "",
        endTime: "",
        status: "AGENDADA",
        location: turma.location || "",
        observations: ""
      })
    } else if (!isOpen) {
      setFormData({
        title: "",
        description: "",
        date: undefined,
        startTime: "",
        endTime: "",
        status: "AGENDADA",
        location: "",
        observations: ""
      })
    }
  }, [isOpen, turma])

  const handleInputChange = (field: keyof LessonFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const errors: string[] = []

    if (!formData.title.trim()) {
      errors.push("Título é obrigatório")
    }

    if (!formData.date) {
      errors.push("Data é obrigatória")
    }

    if (!formData.startTime) {
      errors.push("Horário de início é obrigatório")
    }

    if (!formData.endTime) {
      errors.push("Horário de fim é obrigatório")
    }

    if (formData.startTime && formData.endTime) {
      const startTimeMinutes = timeToMinutes(formData.startTime)
      const endTimeMinutes = timeToMinutes(formData.endTime)
      
      if (startTimeMinutes >= endTimeMinutes) {
        errors.push("Horário de início deve ser anterior ao horário de fim")
      }
    }

    // Validar se a data está dentro do período da turma
    if (formData.date && turma) {
      const lessonDate = new Date(formData.date)
      const turmaStart = new Date(turma.startDate)
      const turmaEnd = new Date(turma.endDate)
      const today = new Date()
      
      // Normalizar todas as datas para o mesmo horário (meio-dia) para evitar problemas de timezone
      lessonDate.setHours(12, 0, 0, 0)
      turmaStart.setHours(12, 0, 0, 0)
      turmaEnd.setHours(12, 0, 0, 0)
      today.setHours(12, 0, 0, 0)
      
      // Debug: mostrar as datas sendo comparadas
      console.log('Validação de datas:')
      console.log('Data da aula:', format(lessonDate, 'dd/MM/yyyy'))
      console.log('Hoje:', format(today, 'dd/MM/yyyy'))
      console.log('Início da turma:', format(turmaStart, 'dd/MM/yyyy'))
      console.log('Fim da turma:', format(turmaEnd, 'dd/MM/yyyy'))
      
      // Verificar se as datas da turma são válidas
      if (turmaStart >= turmaEnd) {
        errors.push(`Erro: Data de início da turma (${format(turmaStart, 'dd/MM/yyyy')}) deve ser anterior à data de fim (${format(turmaEnd, 'dd/MM/yyyy')})`)
      }
      
      // Verificar se a data não é no passado
      if (lessonDate < today) {
        errors.push(`A data da aula não pode ser no passado. Data mínima: ${format(today, 'dd/MM/yyyy')}`)
      }
      // Verificar se a data não é anterior ao início da turma
      else if (lessonDate < turmaStart) {
        errors.push(`A data da aula não pode ser anterior ao início da turma: ${format(turmaStart, 'dd/MM/yyyy')}`)
      }
      // Verificar se a data não é posterior ao fim da turma
      else if (lessonDate > turmaEnd) {
        errors.push(`A data da aula não pode ser posterior ao fim da turma: ${format(turmaEnd, 'dd/MM/yyyy')}`)
      }
    }

    return errors
  }

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!turma) return

    const errors = validateForm()
    if (errors.length > 0) {
      toast({
        title: "Erro de validação",
        description: errors.join(", "),
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      // Criar data e hora de início
      const startDateTime = new Date(formData.date!)
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number)
      startDateTime.setHours(startHours, startMinutes, 0, 0)

      // Criar data e hora de fim
      const endDateTime = new Date(formData.date!)
      const [endHours, endMinutes] = formData.endTime.split(':').map(Number)
      endDateTime.setHours(endHours, endMinutes, 0, 0)

      const lessonData = {
        title: formData.title,
        description: formData.description || undefined,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        status: formData.status,
        location: formData.location || undefined,
        observations: formData.observations || undefined,
        instructorId: turma.instructorId,
        clientId: turma.clientId || undefined,
        classId: turma.id
      }

      await createLesson(lessonData)

      toast({
        title: "Sucesso!",
        description: "Aula agendada com sucesso.",
        variant: "default"
      })

      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error('Erro ao agendar aula:', error)
      
      let errorMessage = "Erro ao agendar aula"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
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

  const getCurrentSelectedStatus = () => {
    return LESSON_STATUS_OPTIONS.find(option => option.value === formData.status)
  }

  if (!turma) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Agendar Aula</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Turma */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Informações da Turma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Treinamento</Label>
                  <p className="text-sm font-medium">{turma.training.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Instrutor</Label>
                  <p className="text-sm font-medium">{turma.instructor.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Período da Turma</Label>
                  <p className="text-sm">
                    {format(new Date(turma.startDate), 'dd/MM/yyyy')} - {format(new Date(turma.endDate), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Alunos</Label>
                  <p className="text-sm">{turma.students.length} aluno{turma.students.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Agendamento */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Dados da Aula
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Aula *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Aula 1 - Introdução"
                    required
                  />
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descrição detalhada da aula..."
                    rows={3}
                  />
                </div>

                {/* Data e Horários */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data da Aula *</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="date"
                        type="date"
                        value={formData.date ? format(formData.date, "yyyy-MM-dd") : ''}
                        onChange={(e) => {
                          const dateValue = e.target.value
                          if (dateValue) {
                            const date = new Date(dateValue + 'T12:00:00')
                            handleInputChange('date', date)
                          } else {
                            handleInputChange('date', undefined)
                          }
                        }}
                        className="pl-10"
                        min={turma ? (() => {
                          const today = new Date()
                          const turmaStart = new Date(turma.startDate)
                          const minDate = today > turmaStart ? today : turmaStart
                          return format(minDate, "yyyy-MM-dd")
                        })() : format(new Date(), "yyyy-MM-dd")}
                        max={turma ? format(new Date(turma.endDate), "yyyy-MM-dd") : undefined}
                        required
                      />
                    </div>
                    {turma && (
                      <p className="text-xs text-gray-500">
                        Período da turma: {format(new Date(turma.startDate), 'dd/MM/yyyy', { locale: ptBR })} - {format(new Date(turma.endDate), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Horário de Início *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">Horário de Fim *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Status e Local */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue>
                          {getCurrentSelectedStatus() && (
                            <div className="flex items-center gap-2">
                              <Badge className={getCurrentSelectedStatus()!.color} variant="outline">
                                {getCurrentSelectedStatus()!.label}
                              </Badge>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {LESSON_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Badge className={option.color} variant="outline">
                                {option.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Local</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Local da aula"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="observations">Observações</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => handleInputChange('observations', e.target.value)}
                    placeholder="Observações adicionais sobre a aula..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                    Agendando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Agendar Aula
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
