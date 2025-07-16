"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Users, BookOpen, Calendar, CheckCircle, Clock, MapPin, User } from 'lucide-react'
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

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Alunos em suas turmas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Turmas ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aulas Agendadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalScheduledLessons}</div>
            <p className="text-xs text-muted-foreground">
              Próximas aulas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turmas Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalCompletedClasses}</div>
            <p className="text-xs text-muted-foreground">
              Turmas finalizadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agenda de Aulas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agenda de Aulas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.scheduledLessons.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma aula agendada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.scheduledLessons.map((lesson) => (
                <Card key={lesson.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{lesson.title}</h4>
                          <Badge className={getStatusColor(lesson.status)}>
                            {lesson.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{lesson.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>
                              {formatDate(lesson.startDate)} - {formatTime(lesson.startDate)} às {formatTime(lesson.endDate)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-gray-400" />
                            <span>Turma: {lesson.className}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>Instrutor: {lesson.instructorName}</span>
                          </div>
                          
                          {lesson.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{lesson.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {lesson.observations && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700">
                              <strong>Observações:</strong> {lesson.observations}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
