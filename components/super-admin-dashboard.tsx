"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarWithEvents } from "@/components/ui/calendar-with-events"
import {
  Users,
  BookOpen,
  Award,
  Clock,
  CalendarIcon,
  ChevronRight,
  Target,
  ArrowUpRight,
  Building2,
  UserCheck,
  CheckCircle,
} from "lucide-react"
import { getDashboardData, DashboardData, getOpenClasses, OpenClass, OpenClassesResponse } from "@/lib/api/superadmin"

export function SuperAdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [openClasses, setOpenClasses] = useState<OpenClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [dashboardResponse, openClassesResponse] = await Promise.all([
          getDashboardData(),
          getOpenClasses(1, 5) // Buscar as primeiras 5 turmas em aberto
        ])
        setDashboardData(dashboardResponse)
        setOpenClasses(openClassesResponse.classes)
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error)
        setError('Erro ao carregar dados do dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'STUDENT_ENROLLED':
        return <Users className="w-4 h-4" />
      case 'LESSON_CREATED':
        return <BookOpen className="w-4 h-4" />
      case 'CLASS_CREATED':
        return <Target className="w-4 h-4" />
      case 'CERTIFICATE_ISSUED':
        return <Award className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'STUDENT_ENROLLED':
        return 'bg-green-100 text-green-600'
      case 'LESSON_CREATED':
        return 'bg-blue-100 text-blue-600'
      case 'CLASS_CREATED':
        return 'bg-purple-100 text-purple-600'
      case 'CERTIFICATE_ISSUED':
        return 'bg-yellow-100 text-yellow-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
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

  const getStats = () => {
    if (!dashboardData) return []
    
    return [
      {
        title: "Total de Alunos",
        value: dashboardData.totalStudents.toString(),
        description: "Estudantes cadastrados",
        icon: Users,
        color: "from-blue-500 to-blue-600",
        textColor: "text-blue-600",
        bgColor: "bg-blue-50",
        trend: dashboardData.totalStudents.toString(),
        trendColor: "text-blue-600",
      },
      {
        title: "Turmas Ativas",
        value: dashboardData.totalClasses.toString(),
        description: "Turmas em andamento",
        icon: Target,
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
        icon: CalendarIcon,
        color: "from-purple-500 to-purple-600",
        textColor: "text-purple-600",
        bgColor: "bg-purple-50",
        trend: dashboardData.totalScheduledLessons.toString(),
        trendColor: "text-purple-600",
      },
      {
        title: "Treinamentos",
        value: dashboardData.totalTrainings.toString(),
        description: "Treinamentos disponíveis",
        icon: BookOpen,
        color: "from-orange-500 to-orange-600",
        textColor: "text-orange-600",
        bgColor: "bg-orange-50",
        trend: dashboardData.totalTrainings.toString(),
        trendColor: "text-orange-600",
      },
      {
        title: "Instrutores",
        value: dashboardData.totalInstructors.toString(),
        description: "Instrutores cadastrados",
        icon: UserCheck,
        color: "from-indigo-500 to-indigo-600",
        textColor: "text-indigo-600",
        bgColor: "bg-indigo-50",
        trend: dashboardData.totalInstructors.toString(),
        trendColor: "text-indigo-600",
      },
      {
        title: "Clientes",
        value: dashboardData.totalClients.toString(),
        description: "Empresas parceiras",
        icon: Building2,
        color: "from-pink-500 to-pink-600",
        textColor: "text-pink-600",
        bgColor: "bg-pink-50",
        trend: dashboardData.totalClients.toString(),
        trendColor: "text-pink-600",
      },
    ]
  }

  const stats = getStats()

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-blue-100 text-lg">Bem-vindo ao sistema de gestão de treinamentos</p>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Última atualização: agora</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="border-none shadow-lg animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full text-center py-8 text-red-600">
            {error}
          </div>
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.textColor}`} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
                    </div>
                    <div className={`flex items-center space-x-1 ${stat.trendColor}`}>
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-sm font-medium">{stat.trend}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Calendário com Aulas Agendadas */}
      {dashboardData && (
        <CalendarWithEvents
          selectedDate={new Date()}
          onDateSelect={() => {}}
          lessons={dashboardData.scheduledLessons}
          className="w-full"
        />
      )}

      {/* Agenda e Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Treinamentos em Aberto */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Treinamentos em Aberto
            </CardTitle>
            <CardDescription>Turmas que ainda não foram concluídas</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : openClasses.length > 0 ? (
              <div className="space-y-4">
                {openClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{classItem.training.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{classItem.training.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                        <span>🧑‍🏫 {classItem.instructor.name}</span>
                        <span>🏢 {classItem.client.name}</span>
                        <span>� {classItem.location || 'Online'}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(classItem.startDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-gray-600">
                        {classItem.type}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                        classItem.status === 'EM_ABERTO' 
                          ? 'bg-orange-100 text-orange-800' 
                          : classItem.status === 'EM_ANDAMENTO'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {classItem.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>Nenhum treinamento em aberto</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo de Aulas */}
        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
          <div className="bg-purple-50 p-6 border-b">
            <CardTitle className="flex items-center text-xl font-bold text-gray-900">
              <div className="p-2 bg-purple-600 rounded-lg mr-3">
                <Target className="h-5 w-5 text-white" />
              </div>
              Resumo de Aulas
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">Estatísticas das aulas por status</CardDescription>
          </div>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 animate-pulse">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            ) : dashboardData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Aulas Agendadas</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {dashboardData.scheduledLessons.filter(lesson => lesson.status === 'AGENDADA').length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Aulas Realizadas</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {dashboardData.scheduledLessons.filter(lesson => lesson.status === 'REALIZADA').length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Aulas Canceladas</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">
                    {dashboardData.scheduledLessons.filter(lesson => lesson.status === 'CANCELADA').length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium">Total de Aulas</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {dashboardData.scheduledLessons.length}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p>Nenhum dado disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
        <div className="bg-green-50 p-6 border-b">
          <CardTitle className="flex items-center text-xl font-bold text-gray-900">
            <div className="p-2 bg-green-600 rounded-lg mr-3">
              <Clock className="h-5 w-5 text-white" />
            </div>
            Atividades Recentes
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">Últimas atividades do sistema</CardDescription>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              ))
            ) : dashboardData && dashboardData.recentActivities.length > 0 ? (
              dashboardData.recentActivities.slice(0, 5).map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className={`w-10 h-10 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">{activity.entityType}</p>
                  </div>
                  <span className="text-xs text-gray-500">{formatTimeAgo(activity.createdAt)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma atividade recente encontrada
              </div>
            )}
            {dashboardData && dashboardData.recentActivities.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-4 rounded-xl"
              >
                Ver todas as atividades
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
