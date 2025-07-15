"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { getLessons } from "@/lib/api/superadmin"

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

interface UpcomingLessonsWidgetProps {
  maxItems?: number
  onViewAll?: () => void
  refreshTrigger?: number
}

export function UpcomingLessonsWidget({ 
  maxItems = 5, 
  onViewAll,
  refreshTrigger 
}: UpcomingLessonsWidgetProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [lessons, setLessons] = useState<LessonData[]>([])

  const loadUpcomingLessons = async () => {
    setLoading(true)
    try {
      const response = await getLessons(1, 50) // Buscar mais aulas para filtrar
      const allLessons = response.lessons || []
      
      // Filtrar apenas aulas futuras e ordenar por data
      const now = new Date()
      const upcomingLessons = allLessons
        .filter((lesson: LessonData) => {
          const lessonDate = new Date(lesson.startDate)
          return lessonDate > now && lesson.status !== "CANCELADA"
        })
        .sort((a: LessonData, b: LessonData) => {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        })
        .slice(0, maxItems)
      
      setLessons(upcomingLessons)
    } catch (error: any) {
      console.error('Erro ao carregar próximas aulas:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar próximas aulas",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUpcomingLessons()
  }, [refreshTrigger, maxItems])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AGENDADA":
        return "bg-blue-100 text-blue-800"
      case "CONFIRMADA":
        return "bg-green-100 text-green-800"
      case "REAGENDADA":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    // Resetar horas para comparação
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())
    
    if (dateOnly.getTime() === todayOnly.getTime()) {
      return `Hoje às ${format(date, 'HH:mm')}`
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return `Amanhã às ${format(date, 'HH:mm')}`
    } else {
      return format(date, "dd/MM 'às' HH:mm", { locale: ptBR })
    }
  }

  const isToday = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isTomorrow = (dateString: string) => {
    const date = new Date(dateString)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return date.toDateString() === tomorrow.toDateString()
  }

  const getUrgencyLevel = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    if (diffHours <= 2) return "urgent"
    if (diffHours <= 24) return "today"
    if (diffHours <= 48) return "tomorrow"
    return "future"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximas Aulas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
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
            Próximas Aulas
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadUpcomingLessons}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            {onViewAll && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewAll}
                className="gap-2"
              >
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {lessons.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Nenhuma aula agendada nos próximos dias
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson) => {
              const urgency = getUrgencyLevel(lesson.startDate)
              
              return (
                <div 
                  key={lesson.id} 
                  className={`p-3 rounded-lg border transition-colors hover:bg-gray-50 ${
                    urgency === "urgent" ? "border-red-200 bg-red-50" :
                    urgency === "today" ? "border-orange-200 bg-orange-50" :
                    urgency === "tomorrow" ? "border-yellow-200 bg-yellow-50" :
                    "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {urgency === "urgent" && (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      {urgency === "today" && (
                        <Clock className="h-4 w-4 text-orange-600" />
                      )}
                      {urgency === "tomorrow" && (
                        <Calendar className="h-4 w-4 text-yellow-600" />
                      )}
                      {urgency === "future" && (
                        <Calendar className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {lesson.title}
                        </h4>
                        <Badge 
                          className={getStatusColor(lesson.status)}
                          variant="outline"
                        >
                          {lesson.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(lesson.startDate)}
                        </span>
                        {lesson.instructor && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {lesson.instructor.name}
                          </span>
                        )}
                      </div>
                      
                      {lesson.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {lesson.location}
                        </div>
                      )}
                      
                      {lesson.class?.training.title && (
                        <div className="text-xs text-gray-500 mt-1">
                          Turma: {lesson.class.training.title}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
