"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  BookOpen,
  Award,
  Clock,
  CalendarIcon,
  ChevronRight,
  Target,
  Zap,
  Activity,
  ArrowUpRight,
  Plus,
} from "lucide-react"
import { ClassesPerMonthChart } from "@/components/charts/classes-per-month-chart"
import { AccountsReceivableChart } from "@/components/charts/accounts-receivable-chart"
import { WeeklyTimelineCalendar } from "@/components/weekly-timeline-calendar"

export function DashboardContent() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [calendarView, setCalendarView] = useState<"monthly" | "weekly">("weekly")

  const stats = [
    {
      title: "Total de Alunos",
      value: "1,234",
      description: "+12% em relação ao mês anterior",
      icon: Users,
      color: "from-primary-500 to-primary-600",
      textColor: "text-primary-600",
      bgColor: "bg-primary-50",
      trend: "+12%",
      trendColor: "text-green-600",
    },
    {
      title: "Treinamentos Ativos",
      value: "45",
      description: "8 novos este mês",
      icon: BookOpen,
      color: "from-secondary-500 to-secondary-600",
      textColor: "text-secondary-600",
      bgColor: "bg-secondary-50",
      trend: "+8",
      trendColor: "text-green-600",
    },
    {
      title: "Aulas Agendadas",
      value: "128",
      description: "Para os próximos 30 dias",
      icon: CalendarIcon,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "128",
      trendColor: "text-blue-600",
    },
    {
      title: "Certificados Emitidos",
      value: "892",
      description: "+25% este mês",
      icon: Award,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "+25%",
      trendColor: "text-green-600",
    },
  ]

  const recentActivities = [
    {
      action: "Novo aluno cadastrado",
      name: "João Silva",
      time: "2 min atrás",
      type: "user",
      color: "bg-green-100 text-green-600",
    },
    {
      action: "Aula concluída",
      name: "Treinamento de Segurança",
      time: "15 min atrás",
      type: "class",
      color: "bg-blue-100 text-blue-600",
    },
    {
      action: "Certificado emitido",
      name: "Maria Santos",
      time: "1 hora atrás",
      type: "certificate",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      action: "Nova turma criada",
      name: "Excel Avançado",
      time: "2 horas atrás",
      type: "group",
      color: "bg-purple-100 text-purple-600",
    },
  ]

  // Função para gerar uma data para o mês atual
  const getDateForCurrentMonth = (day: number) => {
    const date = new Date(currentDate)
    date.setDate(day)
    return date.toISOString().split("T")[0]
  }

  // Lista expandida de eventos para o calendário
  const upcomingEvents = [
    // Semana 1
    {
      id: 1,
      title: "Segurança do Trabalho - Turma A",
      date: getDateForCurrentMonth(3),
      time: "08:00 - 17:00",
      location: "Sala 101",
      instructor: "Carlos Silva",
      type: "class",
      participants: 25,
      maxParticipants: 30,
    },
    {
      id: 2,
      title: "Excel Avançado - Módulo 1",
      date: getDateForCurrentMonth(4),
      time: "14:00 - 18:00",
      location: "Lab Informática",
      instructor: "Ana Santos",
      type: "class",
      participants: 15,
      maxParticipants: 20,
    },
    {
      id: 3,
      title: "Reunião com Cliente XYZ",
      date: getDateForCurrentMonth(5),
      time: "10:00 - 11:30",
      location: "Sala de Reuniões",
      instructor: "Roberto Lima",
      type: "meeting",
      participants: 5,
      maxParticipants: 8,
    },
    {
      id: 4,
      title: "Liderança e Gestão - Workshop",
      date: getDateForCurrentMonth(5),
      time: "09:00 - 12:00",
      location: "Auditório",
      instructor: "Roberto Lima",
      type: "workshop",
      participants: 20,
      maxParticipants: 25,
    },
    // Semana 2
    {
      id: 5,
      title: "Certificação NR-35",
      date: getDateForCurrentMonth(8),
      time: "13:00 - 18:00",
      location: "Campo de Treinamento",
      instructor: "Carlos Silva",
      type: "certification",
      participants: 12,
      maxParticipants: 15,
    },
    {
      id: 6,
      title: "Treinamento de Primeiros Socorros",
      date: getDateForCurrentMonth(9),
      time: "09:00 - 12:00",
      location: "Sala 102",
      instructor: "Dra. Maria",
      type: "certification",
      participants: 18,
      maxParticipants: 20,
    },
    {
      id: 7,
      title: "Reunião de Planejamento",
      date: getDateForCurrentMonth(10),
      time: "16:00 - 17:00",
      location: "Sala de Reuniões",
      instructor: "Equipe Gestão",
      type: "meeting",
      participants: 8,
      maxParticipants: 10,
    },
    {
      id: 8,
      title: "Integração Novos Funcionários",
      date: getDateForCurrentMonth(10),
      time: "08:30 - 12:30",
      location: "Auditório Principal",
      instructor: "Depto. RH",
      type: "class",
      participants: 12,
      maxParticipants: 15,
    },
    {
      id: 9,
      title: "Manutenção de Equipamentos",
      date: getDateForCurrentMonth(11),
      time: "13:00 - 17:00",
      location: "Oficina Técnica",
      instructor: "Eng. Marcos",
      type: "workshop",
      participants: 8,
      maxParticipants: 10,
    },
    // Semana 3
    {
      id: 10,
      title: "Segurança de Dados - Módulo 1",
      date: getDateForCurrentMonth(15),
      time: "09:00 - 12:00",
      location: "Sala de Treinamento 3",
      instructor: "Ana Pereira",
      type: "class",
      participants: 18,
      maxParticipants: 20,
    },
    {
      id: 11,
      title: "Reunião de Diretoria",
      date: getDateForCurrentMonth(16),
      time: "14:00 - 16:00",
      location: "Sala de Reuniões Executiva",
      instructor: "Presidente",
      type: "meeting",
      participants: 6,
      maxParticipants: 8,
    },
    {
      id: 12,
      title: "Workshop de Inovação",
      date: getDateForCurrentMonth(17),
      time: "09:00 - 18:00",
      location: "Centro de Convenções",
      instructor: "Consultoria Externa",
      type: "workshop",
      participants: 30,
      maxParticipants: 40,
    },
    {
      id: 13,
      title: "Certificação ISO 9001",
      date: getDateForCurrentMonth(18),
      time: "08:00 - 17:00",
      location: "Sala de Treinamento 1",
      instructor: "Consultor ISO",
      type: "certification",
      participants: 15,
      maxParticipants: 15,
    },
    {
      id: 14,
      title: "Treinamento de Vendas",
      date: getDateForCurrentMonth(18),
      time: "13:00 - 17:00",
      location: "Sala de Reuniões 2",
      instructor: "Gerente Comercial",
      type: "class",
      participants: 12,
      maxParticipants: 15,
    },
    // Semana 4
    {
      id: 15,
      title: "Excel Avançado - Módulo 2",
      date: getDateForCurrentMonth(22),
      time: "14:00 - 18:00",
      location: "Lab Informática",
      instructor: "Ana Santos",
      type: "class",
      participants: 15,
      maxParticipants: 20,
    },
    {
      id: 16,
      title: "Segurança do Trabalho - Turma B",
      date: getDateForCurrentMonth(23),
      time: "08:00 - 17:00",
      location: "Sala 101",
      instructor: "Carlos Silva",
      type: "class",
      participants: 28,
      maxParticipants: 30,
    },
    {
      id: 17,
      title: "Reunião de Fechamento Mensal",
      date: getDateForCurrentMonth(24),
      time: "09:00 - 11:00",
      location: "Sala de Reuniões",
      instructor: "Gerentes",
      type: "meeting",
      participants: 10,
      maxParticipants: 12,
    },
    {
      id: 18,
      title: "Workshop de Comunicação",
      date: getDateForCurrentMonth(25),
      time: "13:00 - 17:00",
      location: "Auditório",
      instructor: "Consultoria RH",
      type: "workshop",
      participants: 25,
      maxParticipants: 30,
    },
    {
      id: 19,
      title: "Certificação em Gestão de Projetos",
      date: getDateForCurrentMonth(26),
      time: "08:00 - 18:00",
      location: "Centro de Treinamento",
      instructor: "PMI Certified",
      type: "certification",
      participants: 20,
      maxParticipants: 25,
    },
    // Dias com múltiplos eventos
    {
      id: 20,
      title: "Reunião de Equipe TI",
      date: getDateForCurrentMonth(15),
      time: "14:00 - 15:00",
      location: "Sala de TI",
      instructor: "Gerente TI",
      type: "meeting",
      participants: 8,
      maxParticipants: 10,
    },
    {
      id: 21,
      title: "Treinamento Segurança Digital",
      date: getDateForCurrentMonth(15),
      time: "16:00 - 18:00",
      location: "Sala de Treinamento 2",
      instructor: "Especialista Segurança",
      type: "class",
      participants: 15,
      maxParticipants: 20,
    },
    {
      id: 22,
      title: "Onboarding Novos Colaboradores",
      date: getDateForCurrentMonth(15),
      time: "08:00 - 09:30",
      location: "Sala de Integração",
      instructor: "RH",
      type: "meeting",
      participants: 5,
      maxParticipants: 5,
    },
    {
      id: 23,
      title: "Café com Diretoria",
      date: getDateForCurrentMonth(15),
      time: "10:00 - 11:00",
      location: "Sala VIP",
      instructor: "Diretoria",
      type: "meeting",
      participants: 12,
      maxParticipants: 15,
    },
  ]

  // Função para obter eventos de um dia específico
  const getEventsForDay = (day: number) => {
    const dayStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split("T")[0]
    return upcomingEvents.filter((event) => event.date === dayStr)
  }

  // Função para determinar a cor do evento
  const getEventColor = (type: string) => {
    switch (type) {
      case "class":
        return "bg-primary-500"
      case "meeting":
        return "bg-yellow-500"
      case "workshop":
        return "bg-secondary-500"
      case "certification":
        return "bg-green-600"
      default:
        return "bg-gray-400"
    }
  }

  // Função para determinar o texto do tipo de evento
  const getEventTypeText = (type: string) => {
    switch (type) {
      case "class":
        return "Aula"
      case "meeting":
        return "Reunião"
      case "workshop":
        return "Workshop"
      case "certification":
        return "Certificação"
      default:
        return "Evento"
    }
  }

  // Função para navegar entre meses
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
    setSelectedDate(null)
  }

  // Função para ir para o dia atual
  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  // Função para gerar os dias do calendário
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const today = new Date()

    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)

      const isCurrentMonth = day.getMonth() === month
      const isToday = day.toDateString() === today.toDateString()
      const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
      const dayEvents = isCurrentMonth ? getEventsForDay(day.getDate()) : []

      days.push({
        date: day,
        day: day.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        events: dayEvents,
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  // Filtrar eventos para o dia selecionado
  const selectedDateEvents = selectedDate
    ? upcomingEvents.filter((event) => {
        const eventDate = new Date(event.date)
        return (
          eventDate.getDate() === selectedDate.getDate() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        )
      })
    : []

  const quickActions = [
    {
      title: "Novo Aluno",
      icon: Users,
      color: "from-primary-500 to-primary-600",
      description: "Cadastrar novo aluno",
    },
    {
      title: "Novo Curso",
      icon: BookOpen,
      color: "from-secondary-500 to-secondary-600",
      description: "Criar novo treinamento",
    },
    {
      title: "Agendar",
      icon: CalendarIcon,
      color: "from-purple-500 to-purple-600",
      description: "Agendar nova aula",
    },
    {
      title: "Certificados",
      icon: Award,
      color: "from-orange-500 to-orange-600",
      description: "Emitir certificado",
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-[#78BA00] p-8 text-white" style={{ backgroundColor: '#78BA00' }}>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-primary-100 text-lg">Bem-vindo ao sistema de gestão de treinamentos</p>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center space-x-2">
            
              
            </div>
            <div className="flex items-center space-x-2">
              
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
        })}
      </div>

      {/* Gráficos Comparativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ClassesPerMonthChart />
        <AccountsReceivableChart />
      </div>

      {/* Agenda - Timeline Semanal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <WeeklyTimelineCalendar />
        </div>

        {/* Recent Activities */}
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
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center`}>
                    {activity.type === "user" && <Users className="w-4 h-4" />}
                    {activity.type === "class" && <BookOpen className="w-4 h-4" />}
                    {activity.type === "certificate" && <Award className="w-4 h-4" />}
                    {activity.type === "group" && <Target className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">{activity.name}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-primary-600 hover:text-primary-700 hover:bg-primary-50 mt-4 rounded-xl"
              >
                Ver todas as atividades
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
        <div className="bg-green-50 p-6 border-b">
          <CardTitle className="flex items-center text-xl font-bold text-gray-900">
            <div className="p-2 bg-green-600 rounded-lg mr-3">
              <Zap className="h-5 w-5 text-white" />
            </div>
            Ações Rápidas
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">Acesso rápido às funcionalidades</CardDescription>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button
                  key={index}
                  className={`h-auto py-6 flex flex-col items-center justify-center bg-gradient-to-br ${action.color} hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 text-white border-none rounded-xl group`}
                >
                  <Icon className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{action.title}</span>
                  <span className="text-xs opacity-90 mt-1">{action.description}</span>
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            className="w-full mt-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-300 hover:bg-primary-50 text-gray-600 hover:text-primary-600 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Personalizar ações
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
