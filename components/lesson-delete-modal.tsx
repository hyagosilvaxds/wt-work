"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  AlertTriangle,
  Trash2,
  X,
  CalendarIcon,
  Clock,
  MapPin,
  FileText
} from "lucide-react"
import { deleteLesson } from "@/lib/api/superadmin"

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

interface LessonDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  lesson: LessonData | null
}

const LESSON_STATUS_OPTIONS = [
  { value: "AGENDADA", label: "Agendada", color: "bg-blue-100 text-blue-800" },
  { value: "CONFIRMADA", label: "Confirmada", color: "bg-green-100 text-green-800" },
  { value: "CANCELADA", label: "Cancelada", color: "bg-red-100 text-red-800" },
  { value: "REAGENDADA", label: "Reagendada", color: "bg-yellow-100 text-yellow-800" },
  { value: "REALIZADA", label: "Realizada", color: "bg-purple-100 text-purple-800" }
]

export function LessonDeleteModal({ isOpen, onClose, onSuccess, lesson }: LessonDeleteModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!lesson) return

    setLoading(true)

    try {
      await deleteLesson(lesson.id)

      toast({
        title: "Sucesso!",
        description: "Aula excluída com sucesso.",
        variant: "default"
      })

      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error('Erro ao excluir aula:', error)
      
      let errorMessage = "Erro ao excluir aula"
      
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

  const getStatusColor = (status: string) => {
    const statusOption = LESSON_STATUS_OPTIONS.find(option => option.value === status)
    return statusOption ? statusOption.color : "bg-gray-100 text-gray-800"
  }

  const getStatusLabel = (status: string) => {
    const statusOption = LESSON_STATUS_OPTIONS.find(option => option.value === status)
    return statusOption ? statusOption.label : status
  }

  if (!lesson) return null

  const startDate = new Date(lesson.startDate)
  const endDate = new Date(lesson.endDate)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Trash2 className="h-6 w-6 text-red-600" />
              Excluir Aula
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
          {/* Alerta de Confirmação */}
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Atenção!</h3>
              <p className="text-sm text-red-700 mt-1">
                Esta ação não pode ser desfeita. A aula será permanentemente removida do sistema.
              </p>
            </div>
          </div>

          {/* Informações da Aula */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                {lesson.description && (
                  <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                )}
              </div>
              <Badge className={getStatusColor(lesson.status)} variant="outline">
                {getStatusLabel(lesson.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data e Horário */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Data: {format(startDate, 'dd/MM/yyyy', { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    Horário: {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
                  </span>
                </div>
              </div>

              {/* Local */}
              {lesson.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Local: {lesson.location}</span>
                </div>
              )}
            </div>

            {/* Observações */}
            {lesson.observations && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4 mt-0.5" />
                <div>
                  <span className="font-medium">Observações:</span>
                  <p className="mt-1">{lesson.observations}</p>
                </div>
              </div>
            )}
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
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Excluir Aula
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
