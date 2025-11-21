"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarWithEvents } from '@/components/ui/calendar-with-events'
import { Loader2, Users, BookOpen, Calendar as CalendarIcon, CheckCircle, Clock, MapPin, User, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { getClientStatistics, getClientLessons } from '@/lib/api/auth'
import { useAuth } from '@/hooks/use-auth'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ClientStatistics {
  clientId: string
  clientName: string
  totalStudents: number
  totalClasses: number
  totalLessons: number
  completedClasses: number
}

interface ClientLesson {
  id: string
  title: string
  startDate: string
  endDate: string
  classId: string
  className: string
  trainingTitle: string
  instructorName: string
  location: string | null
}

interface ClientLessonsResponse {
  clientId: string
  clientName: string
  totalLessons: number
  lessons: ClientLesson[]
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const [statistics, setStatistics] = useState<ClientStatistics | null>(null)
  const [lessonsData, setLessonsData] = useState<ClientLessonsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  console.log('ClientDashboard - user:', user)

  useEffect(() => {
    const fetchClientData = async () => {
      if (!user?.id) {
        setError('Usuário não encontrado')
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Buscar estatísticas e aulas em paralelo
        const [stats, lessons] = await Promise.all([
          getClientStatistics(),
          getClientLessons()
        ])
        
        setStatistics(stats)
        setLessonsData(lessons)
        setError(null)
      } catch (err: any) {
        console.error('Erro ao carregar dados do cliente:', err)
        
        // Tratar diferentes tipos de erro
        if (err?.response?.status === 401) {
          setError(err?.response?.data?.message || 'Não autorizado')
        } else if (err?.response?.status === 404) {
          setError('Usuário não encontrado')
        } else {
          setError('Erro ao carregar dados do cliente')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchClientData()
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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: ptBR })
  }

  const stats = [
    {
      title: "Total de Alunos",
      value: statistics?.totalStudents || 0,
      description: "Alunos em suas turmas",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Total de Turmas",
      value: statistics?.totalClasses || 0,
      description: "Turmas ativas",
      icon: BookOpen,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Total de Aulas",
      value: statistics?.totalLessons || 0,
      description: "Aulas em todas as turmas",
      icon: CalendarIcon,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Turmas Concluídas",
      value: statistics?.completedClasses || 0,
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
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard do Cliente
            {statistics?.clientName && (
              <span className="text-2xl text-gray-600 ml-3">- {statistics.clientName}</span>
            )}
          </h1>
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
        key="calendar"
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        lessons={lessonsData?.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: `${lesson.className} - ${lesson.trainingTitle}`,
          startDate: lesson.startDate,
          endDate: lesson.endDate,
          location: lesson.location,
          status: 'AGENDADA',
          instructorName: lesson.instructorName,
          className: lesson.className,
          observations: null
        })) || []}
        className="w-full"
      />
    </div>
  )
}
