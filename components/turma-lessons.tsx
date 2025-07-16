"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users
} from "lucide-react"
import { getLessons } from "@/lib/api/superadmin"
import { useAuth } from "@/hooks/use-auth"

interface LessonData {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  status: string
  location?: string
  observations?: string
  instructorId: string
  clientId?: string
  classId: string
  instructor?: {
    id: string
    name: string
  }
  client?: {
    id: string
    name: string
  }
  class?: {
    id: string
    training: {
      title: string
    }
  }
}

interface TurmaLessonsProps {
  turmaId: string
  onScheduleNew?: () => void
  onEditLesson?: (lesson: LessonData) => void
  onDeleteLesson?: (lesson: LessonData) => void
  onViewDetails?: (lesson: LessonData) => void
  refreshTrigger?: number
}

export function TurmaLessons({ 
  turmaId, 
  onScheduleNew, 
  onEditLesson,
  onDeleteLesson,
  onViewDetails,
  refreshTrigger 
}: TurmaLessonsProps) {
  const { toast } = useToast()
  const { isClient } = useAuth()
  const [loading, setLoading] = useState(true)
  const [lessons, setLessons] = useState<LessonData[]>([])

  const loadLessons = async () => {
    setLoading(true)
    try {
      // Buscar todas as aulas e filtrar por turma
      const response = await getLessons(1, 100) // Buscar um número maior para pegar todas
      const turmaLessons = response.lessons?.filter((lesson: LessonData) => lesson.classId === turmaId) || []
      
      // Ordenar por data
      turmaLessons.sort((a: LessonData, b: LessonData) => {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      })
      
      setLessons(turmaLessons)
    } catch (error: any) {
      console.error('Erro ao carregar aulas:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar aulas da turma",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (turmaId) {
      loadLessons()
    }
  }, [turmaId, refreshTrigger])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AGENDADA":
        return "bg-blue-100 text-blue-800"
      case "CONFIRMADA":
        return "bg-green-100 text-green-800"
      case "CONCLUIDA":
        return "bg-purple-100 text-purple-800"
      case "CANCELADA":
        return "bg-red-100 text-red-800"
      case "REAGENDADA":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "AGENDADA":
        return <Calendar className="h-4 w-4" />
      case "CONFIRMADA":
        return <CheckCircle className="h-4 w-4" />
      case "CONCLUIDA":
        return <CheckCircle className="h-4 w-4" />
      case "CANCELADA":
        return <XCircle className="h-4 w-4" />
      case "REAGENDADA":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: ptBR })
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
    
    if (diffMinutes < 60) {
      return `${diffMinutes}min`
    } else {
      const hours = Math.floor(diffMinutes / 60)
      const minutes = diffMinutes % 60
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`
    }
  }

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date()
  }

  const isPast = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Aulas Agendadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Aulas Agendadas ({lessons.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadLessons}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
            
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {lessons.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma aula agendada
            </h3>
            <p className="text-gray-600 mb-4">
              Comece agendando a primeira aula para esta turma.
            </p>
            {onScheduleNew && (
              <Button onClick={onScheduleNew} className="gap-2">
                <Plus className="h-4 w-4" />
                Agendar Primeira Aula
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <div key={lesson.id}>
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(lesson.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 truncate">
                        {lesson.title}
                      </h4>
                      <Badge className={getStatusColor(lesson.status)}>
                        {lesson.status}
                      </Badge>
                      {isUpcoming(lesson.startDate) && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Próxima
                        </Badge>
                      )}
                      {isPast(lesson.endDate) && lesson.status !== "CONCLUIDA" && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700">
                          Atrasada
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateTime(lesson.startDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(lesson.startDate)} - {formatTime(lesson.endDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {calculateDuration(lesson.startDate, lesson.endDate)}
                      </span>
                    </div>
                    
                    {lesson.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <MapPin className="h-3 w-3" />
                        {lesson.location}
                      </div>
                    )}
                    
                    {lesson.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {lesson.description}
                      </p>
                    )}
                    
                    {lesson.observations && (
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        <strong>Observações:</strong> {lesson.observations}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {onViewDetails && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(lesson)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEditLesson && !isClient && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditLesson(lesson)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDeleteLesson && !isClient && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteLesson(lesson)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {index < lessons.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
