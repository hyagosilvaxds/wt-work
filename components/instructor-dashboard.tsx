"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  BookOpen,
  Clock,
  CalendarIcon,
  ChevronRight,
  Target,
  Zap,
  Activity,
  Plus,
  Award,
  CheckCircle,
  Calendar,
  UserCheck,
  Star,
  TrendingUp,
} from "lucide-react"
// import { WeeklyTimelineCalendar } from "@/components/weekly-timeline-calendar"
import { getInstructors } from "@/lib/api/superadmin"

export function InstructorDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const instructorStats = [
    {
      title: "Aulas Ministradas",
      value: "28",
      description: "Este mês",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+5",
      trendColor: "text-green-600",
    },
    {
      title: "Alunos Ativos",
      value: "156",
      description: "Across all classes",
      icon: Users,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      trend: "+12",
      trendColor: "text-green-600",
    },
    {
      title: "Horas Lecionadas",
      value: "84h",
      description: "Este mês",
      icon: Clock,
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "+8h",
      trendColor: "text-green-600",
    },
    {
      title: "Taxa de Aprovação",
      value: "94%",
      description: "Últimos 3 meses",
      icon: Award,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "+2%",
      trendColor: "text-green-600",
    },
  ]

  const nextClasses = [
    {
      id: 1,
      title: "Segurança do Trabalho - Básico",
      time: "08:00 - 12:00",
      date: "Hoje",
      location: "Sala 101",
      students: 25,
      type: "Presencial",
    },
    {
      id: 2,
      title: "NR-35 - Trabalho em Altura",
      time: "14:00 - 18:00",
      date: "Amanhã",
      location: "Campo de Treinamento",
      students: 15,
      type: "Prático",
    },
    {
      id: 3,
      title: "Primeiros Socorros",
      time: "09:00 - 17:00",
      date: "Quinta-feira",
      location: "Sala 102",
      students: 20,
      type: "Teórico-Prático",
    },
  ]

  const recentAchievements = [
    {
      title: "100% de Aprovação",
      description: "Turma de Excel Avançado",
      date: "Ontem",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Feedback Excelente",
      description: "Média 4.9/5 - Curso de Liderança",
      date: "2 dias atrás",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Certificação Concluída",
      description: "25 alunos certificados em Segurança",
      date: "1 semana atrás",
      icon: Award,
      color: "text-blue-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Instrutor</h1>
          <p className="text-gray-600">Gerencie suas aulas e acompanhe seu desempenho</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Plus className="mr-2 h-4 w-4" />
            Nova Aula
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Ver Agenda
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {instructorStats.map((stat, index) => (
          <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.textColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className={`text-sm font-medium ${stat.trendColor} flex items-center`}>
                  {stat.trend}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas Aulas */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Próximas Aulas</CardTitle>
                  <CardDescription>Suas aulas agendadas</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Ver Todas
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {nextClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{classItem.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {classItem.time}
                      </span>
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {classItem.date}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {classItem.students} alunos
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {classItem.type}
                      </span>
                      <span className="text-xs text-gray-500">{classItem.location}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Gerenciar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Conquistas Recentes */}
        <div>
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Conquistas Recentes</CardTitle>
              <CardDescription>Seus últimos sucessos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-50`}>
                    <achievement.icon className={`h-4 w-4 ${achievement.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calendar */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Agenda Semanal</CardTitle>
              <CardDescription>Suas aulas e compromissos</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Semana Anterior
              </Button>
              <Button variant="outline" size="sm">
                Próxima Semana
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* <WeeklyTimelineCalendar /> */}
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Timeline temporariamente desabilitado</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
