"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Download,
  Play,
  Star,
  Users,
  CheckCircle,
  Target,
  ChevronRight,
} from "lucide-react"

export function StudentDashboard() {
  const studentStats = [
    {
      title: "Cursos Concluídos",
      value: "8",
      total: "12",
      description: "De 12 matriculados",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      progress: 67,
    },
    {
      title: "Horas de Estudo",
      value: "124h",
      description: "Este mês",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+18h",
      trendColor: "text-green-600",
    },
    {
      title: "Certificados",
      value: "6",
      description: "Obtidos",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "+2",
      trendColor: "text-green-600",
    },
    {
      title: "Nota Média",
      value: "8.7",
      description: "Últimas avaliações",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      trend: "+0.3",
      trendColor: "text-green-600",
    },
  ]

  const currentCourses = [
    {
      id: 1,
      title: "Excel Avançado",
      instructor: "Ana Santos",
      progress: 75,
      nextClass: "Hoje, 14:00",
      type: "Online",
      status: "Em andamento",
    },
    {
      id: 2,
      title: "Segurança do Trabalho",
      instructor: "Carlos Silva",
      progress: 45,
      nextClass: "Amanhã, 08:00",
      type: "Presencial",
      status: "Em andamento",
    },
    {
      id: 3,
      title: "Liderança e Gestão",
      instructor: "Roberto Lima",
      progress: 20,
      nextClass: "Quinta, 16:00",
      type: "Híbrido",
      status: "Iniciado",
    },
  ]

  const upcomingClasses = [
    {
      id: 1,
      title: "Excel Avançado - Módulo 4",
      time: "14:00 - 16:00",
      date: "Hoje",
      instructor: "Ana Santos",
      type: "Online",
      link: "#",
    },
    {
      id: 2,
      title: "Segurança do Trabalho - NR-35",
      time: "08:00 - 12:00",
      date: "Amanhã",
      instructor: "Carlos Silva",
      type: "Presencial",
      location: "Sala 101",
    },
    {
      id: 3,
      title: "Liderança - Comunicação",
      time: "16:00 - 18:00",
      date: "Quinta-feira",
      instructor: "Roberto Lima",
      type: "Híbrido",
      location: "Sala 203",
    },
  ]

  const achievements = [
    {
      title: "Curso Concluído",
      description: "Excel Básico finalizado com nota 9.2",
      date: "2 dias atrás",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Certificado Recebido",
      description: "Certificado de Power BI disponível",
      date: "1 semana atrás",
      icon: Award,
      color: "text-purple-500",
    },
    {
      title: "Meta Atingida",
      description: "100h de estudo este trimestre",
      date: "2 semanas atrás",
      icon: Target,
      color: "text-blue-500",
    },
  ]

  const certificates = [
    {
      id: 1,
      title: "Certificado Excel Básico",
      issueDate: "15/12/2024",
      validUntil: "15/12/2026",
      status: "Válido",
    },
    {
      id: 2,
      title: "Certificado Power BI",
      issueDate: "08/12/2024",
      validUntil: "08/12/2026",
      status: "Válido",
    },
    {
      id: 3,
      title: "Certificado Segurança Básica",
      issueDate: "01/12/2024",
      validUntil: "01/12/2025",
      status: "Válido",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Aprendizado</h1>
          <p className="text-gray-600">Acompanhe seu progresso e próximas aulas</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Ver Agenda
          </Button>
          <Button className="bg-green-500 hover:bg-green-600">
            <Play className="mr-2 h-4 w-4" />
            Continuar Estudando
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentStats.map((stat, index) => (
          <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                  {stat.total && <span className="text-sm text-gray-500">/{stat.total}</span>}
                </div>
                {stat.trend && (
                  <div className={`text-sm font-medium ${stat.trendColor} flex items-center`}>
                    {stat.trend}
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              {stat.progress && (
                <div className="mt-2">
                  <Progress value={stat.progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Courses */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Meus Cursos</CardTitle>
                  <CardDescription>Cursos em andamento</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.instructor}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {course.nextClass}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Progress value={course.progress} className="flex-1 h-2" />
                      <span className="text-xs text-gray-500 min-w-[3rem]">{course.progress}%</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {course.type}
                      </span>
                      <span className="text-xs text-gray-500">{course.status}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Acessar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div>
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Conquistas Recentes</CardTitle>
              <CardDescription>Seus últimos marcos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
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

      {/* Upcoming Classes */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Próximas Aulas</CardTitle>
              <CardDescription>Sua agenda de estudos</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Ver Agenda Completa
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{classItem.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    classItem.type === 'Online' ? 'bg-green-100 text-green-800' :
                    classItem.type === 'Presencial' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {classItem.type}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {classItem.date} - {classItem.time}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {classItem.instructor}
                  </div>
                  {classItem.location && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {classItem.location}
                    </div>
                  )}
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-3"
                  variant={classItem.type === 'Online' ? 'default' : 'outline'}
                >
                  {classItem.type === 'Online' ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Entrar na Aula
                    </>
                  ) : (
                    'Ver Detalhes'
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Meus Certificados</CardTitle>
              <CardDescription>Certificados obtidos e disponíveis para download</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <Award className="h-8 w-8 text-purple-600" />
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {cert.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{cert.title}</h3>
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <p>Emitido em: {cert.issueDate}</p>
                  <p>Válido até: {cert.validUntil}</p>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar PDF
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
