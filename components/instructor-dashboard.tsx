"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarWithEvents } from "@/components/ui/calendar-with-events"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  BookOpen,
  Clock,
  CalendarIcon,
  ChevronRight,
  Target,
  Award,
  CheckCircle,
  Calendar,
  UserCheck,
  TrendingUp,
  Loader2,
  ArrowUpRight,
  Building2,
  MapPin,
  User,
} from "lucide-react"
import { getInstructorDashboard, getUserInstructorId, type InstructorDashboardData } from "@/lib/api/superadmin"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function InstructorDashboard() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [dashboardData, setDashboardData] = useState<InstructorDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [instructorId, setInstructorId] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      loadInstructorId()
    }
  }, [user?.id])

  useEffect(() => {
    if (instructorId) {
      loadDashboardData()
    }
  }, [instructorId])

  const loadInstructorId = async () => {
    try {
      if (!user?.id) return
      const response = await getUserInstructorId(user.id)
      setInstructorId(response.instructorId)
    } catch (error) {
      console.error('Erro ao carregar instructorId:', error)
      toast.error('Erro ao carregar dados do instrutor')
    }
  }

  const loadDashboardData = async () => {
    try {
      if (!instructorId) return
      setLoading(true)
      const data = await getInstructorDashboard(instructorId)
      setDashboardData(data)
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      toast.error('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const getStats = () => {
    if (!dashboardData) return []
    
    return [
      {
        title: "Total de Alunos",
        value: dashboardData.totalStudents.toString(),
        description: "Alunos ativos",
        icon: Users,
        color: "from-blue-500 to-blue-600",
        textColor: "text-blue-600",
        bgColor: "bg-blue-50",
        trend: dashboardData.totalStudents.toString(),
        trendColor: "text-blue-600",
      },
      {
        title: "Total de Turmas",
        value: dashboardData.totalClasses.toString(),
        description: "Turmas ativas",
        icon: BookOpen,
        color: "from-green-500 to-green-600",
        textColor: "text-green-600",
        bgColor: "bg-green-50",
        trend: dashboardData.totalClasses.toString(),
        trendColor: "text-green-600",
      },
      {
        title: "Aulas Agendadas",
        value: dashboardData.totalScheduledLessons.toString(),
        description: "Próximas aulas",
        icon: Calendar,
        color: "from-purple-500 to-purple-600",
        textColor: "text-purple-600",
        bgColor: "bg-purple-50",
        trend: dashboardData.totalScheduledLessons.toString(),
        trendColor: "text-purple-600",
      },
      {
        title: "Turmas Concluídas",
        value: dashboardData.totalCompletedClasses.toString(),
        description: "Turmas finalizadas",
        icon: Award,
        color: "from-orange-500 to-orange-600",
        textColor: "text-orange-600",
        bgColor: "bg-orange-50",
        trend: dashboardData.totalCompletedClasses.toString(),
        trendColor: "text-orange-600",
      },
    ]
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} h atrás`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} dias atrás`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADA':
        return 'bg-blue-100 text-blue-800'
      case 'EM_ANDAMENTO':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONCLUIDA':
        return 'bg-green-100 text-green-800'
      case 'CANCELADA':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        <span className="ml-2 text-lg">Carregando dashboard...</span>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-600">Dados não disponíveis</h3>
          <p className="text-gray-500 mt-2">Não foi possível carregar os dados do dashboard</p>
        </div>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Instrutor</h1>
          <p className="text-gray-600">Gerencie suas aulas e acompanhe seu desempenho</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => loadDashboardData()}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-3 rounded-xl ${stat.bgColor} transition-all duration-300`}>
                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center space-x-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">+{stat.trend}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Calendar and Events */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Calendário e Aulas</CardTitle>
                <CardDescription>Suas aulas agendadas e eventos</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                // Usar o sistema de navegação da aplicação
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'instructor-classes' }))
              }}>
                <Calendar className="mr-2 h-4 w-4" />
                Ver Todas as Turmas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarWithEvents
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              lessons={dashboardData.scheduledLessons.map(lesson => ({
                ...lesson,
                instructorName: user?.name || 'Instrutor'
              }))}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Lessons */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Próximas Aulas</CardTitle>
              <CardDescription>Suas aulas agendadas para os próximos dias</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Ver Agenda Completa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dashboardData.scheduledLessons.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.scheduledLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {format(new Date(lesson.startDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })} - 
                        {format(new Date(lesson.endDate), 'HH:mm', { locale: ptBR })}
                      </span>
                      <span className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        {lesson.clientName}
                      </span>
                      {lesson.location && (
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {lesson.location}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getStatusColor(lesson.status)}>
                        {lesson.status}
                      </Badge>
                      <span className="text-xs text-gray-500">{lesson.className}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    Detalhes
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Nenhuma aula agendada no momento</p>
              <p className="text-sm mt-1">Suas próximas aulas aparecerão aqui</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
