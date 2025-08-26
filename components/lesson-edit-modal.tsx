"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  CalendarIcon,
  Clock,
  MapPin,
  Save,
  X,
  Edit
} from "lucide-react"
import { patchLesson, getLessonById } from "@/lib/api/superadmin"

interface LessonData {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  status: string
  location?: string
  observations?: string
  classId: string
  instructorId: string
  clientId?: string
}

interface LessonEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  lesson: LessonData | null
  turma?: {
    id: string
    startDate: string
    endDate: string
    training: {
      title: string
    }
  }
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
  { value: "REAGENDADA", label: "Reagendada", color: "bg-yellow-100 text-yellow-800" },
  { value: "REALIZADA", label: "Realizada", color: "bg-purple-100 text-purple-800" }
]

export function LessonEditModal({ isOpen, onClose, onSuccess, lesson, turma }: LessonEditModalProps) {
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

  // Função para extrair data e hora do ISO string
  const extractDateAndTime = (isoString: string) => {
    const date = new Date(isoString)
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const timeString = `${hours}:${minutes}`
    return { date: dateOnly, time: timeString }
  }

  // Reset form quando modal abre/fecha
  useEffect(() => {
    if (isOpen && lesson) {
      const { date: startDate, time: startTime } = extractDateAndTime(lesson.startDate)
      const { time: endTime } = extractDateAndTime(lesson.endDate)

      setFormData({
        title: lesson.title || "",
        description: lesson.description || "",
        date: startDate,
        startTime: startTime,
        endTime: endTime,
        status: lesson.status || "AGENDADA",
        location: lesson.location || "",
        observations: lesson.observations || ""
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
  }, [isOpen, lesson])

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

    // Removido: Validação de data dentro do período da turma
    // Agora permite qualquer data (anterior, posterior, etc.)

    return errors
  }

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!lesson) return

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

      const updateData = {
        title: formData.title,
        description: formData.description || undefined,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        status: formData.status,
        location: formData.location || undefined,
        observations: formData.observations || undefined
      }

      await patchLesson(lesson.id, updateData)

      toast({
        title: "Sucesso!",
        description: "Aula atualizada com sucesso.",
        variant: "default"
      })

      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error('Erro ao atualizar aula:', error)
      
      let errorMessage = "Erro ao atualizar aula"
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      // Tratamento específico para diferentes tipos de erro
      if (error.response?.status === 404) {
        errorMessage = "Aula não encontrada"
      } else if (error.response?.status === 401) {
        errorMessage = "Não autorizado. Faça login novamente."
      } else if (error.response?.status === 403) {
        errorMessage = "Acesso negado"
      } else if (error.response?.status === 500) {
        errorMessage = "Erro interno do servidor"
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

  if (!lesson) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Edit className="h-6 w-6" />
              Editar Aula
            </DialogTitle>
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
          {turma && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Turma: {turma.training.title}</h3>
              <p className="text-sm text-gray-600">
                Período: {format(new Date(turma.startDate), 'dd/MM/yyyy')} - {format(new Date(turma.endDate), 'dd/MM/yyyy')}
              </p>
            </div>
          )}

          {/* Formulário de Edição */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                    required
                  />
                </div>
                {turma && (
                  <p className="text-xs text-gray-500">
                    Período da turma: {format(new Date(turma.startDate), 'dd/MM/yyyy', { locale: ptBR })} - {format(new Date(turma.endDate), 'dd/MM/yyyy', { locale: ptBR })} (apenas informativo - você pode escolher qualquer data)
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

            {/* Ações */}
            <div className="flex justify-end gap-3 pt-4">
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
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Alterações
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
