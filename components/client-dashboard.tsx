"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarWithEvents } from '@/components/ui/calendar-with-events'
import { Loader2, Users, BookOpen, Calendar as CalendarIcon, CheckCircle, Clock, MapPin, User, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { getClientDashboard } from '@/lib/api/auth'
import { getUserClientId } from '@/lib/api/superadmin'
import { useAuth } from '@/hooks/use-auth'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ClientDashboardData {
  totalStudents: number
  totalClasses: number
  totalScheduledLessons: number
  totalCompletedClasses: number
  scheduledLessons: {
    id: string
    title: string
    description: string
    startDate: string
    endDate: string
    location: string | null
    status: string
    instructorName: string
    className: string
    observations: string | null
  }[]
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<ClientDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  console.log('ClientDashboard - user:', user)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setError('Usuário não encontrado')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Primeiro buscar o clientId do usuário
        const userClientData = await getUserClientId(user.id)
        
        if (!userClientData.hasClient || !userClientData.clientId) {
          setError('Usuário não está associado a um cliente')
          setLoading(false)
          return
        }

        // Depois buscar os dados do dashboard usando o clientId
        const data = await getClientDashboard(userClientData.clientId)
        setDashboardData(data)
        setError(null)
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err)
        setError('Erro ao carregar dados do dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user?.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">Erro ao carregar dados</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Nenhum dado disponível</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADA':
        return 'bg-blue-100 text-blue-800'
      case 'REALIZADA':
        return 'bg-green-100 text-green-800'
      case 'CANCELADA':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: ptBR })
  }

  const stats = [
    {
      title: "Total de Alunos",
      value: dashboardData?.totalStudents || 0,
      description: "Alunos em suas turmas",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Total de Turmas",
      value: dashboardData?.totalClasses || 0,
      description: "Turmas ativas",
      icon: BookOpen,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Aulas Agendadas",
      value: dashboardData?.totalScheduledLessons || 0,
      description: "Próximas aulas",
      icon: CalendarIcon,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Turmas Concluídas",
      value: dashboardData?.totalCompletedClasses || 0,
      description: "Turmas finalizadas",
      icon: CheckCircle,
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Cliente</h1>
          <p className="text-gray-600">Acompanhe suas turmas e aulas agendadas</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {stat.description}
                </p>
                <div className="flex items-center mt-2">
                
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Calendar with Events */}
      <CalendarWithEvents
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        lessons={dashboardData?.scheduledLessons || []}
        className="w-full"
      />

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Próximas Aulas
            </CardTitle>
            <CardDescription>
              Suas próximas 5 aulas agendadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.scheduledLessons.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma aula agendada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData?.scheduledLessons.slice(0, 5).map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-3 rounded-lg border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{lesson.title}</h4>
                          <Badge className={getStatusColor(lesson.status)}>
                            {lesson.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span>{formatDate(lesson.startDate)} - {formatTime(lesson.startDate)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span>{lesson.instructorName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-purple-600" />
              Resumo Semanal
            </CardTitle>
            <CardDescription>
              Atividades desta semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Aulas Agendadas</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {dashboardData?.scheduledLessons.filter(lesson => lesson.status === 'AGENDADA').length || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Aulas Realizadas</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {dashboardData?.scheduledLessons.filter(lesson => lesson.status === 'REALIZADA').length || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Turmas Ativas</span>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {dashboardData?.totalClasses || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Total de Alunos</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {dashboardData?.totalStudents || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
