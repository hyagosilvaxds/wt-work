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
  ArrowUpRight,
  Plus,
} from "lucide-react"

export function SuperAdminDashboard() {
  const stats = [
    {
      title: "Total de Alunos",
      value: "1,234",
      description: "+12% em relação ao mês anterior",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+12%",
      trendColor: "text-green-600",
    },
    {
      title: "Treinamentos Ativos",
      value: "45",
      description: "8 novos este mês",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
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

  const quickActions = [
    {
      title: "Novo Aluno",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      description: "Cadastrar novo aluno",
    },
    {
      title: "Novo Curso",
      icon: BookOpen,
      color: "from-green-500 to-green-600",
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Dashboard Super Admin</h1>
          <p className="text-blue-100 text-lg">Bem-vindo ao sistema de gestão de trsadfeinamentos</p>
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

      {/* Gráficos Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Turmas por Mês</CardTitle>
            <CardDescription>Comparativo de turmas e alunos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Gráfico será restaurado em breve</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Contas a Receber</CardTitle>
            <CardDescription>Comparativo financeiro mensal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Gráfico será restaurado em breve</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agenda e Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Timeline Placeholder */}
        <div className="lg:col-span-3">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Agenda Semanal</CardTitle>
              <CardDescription>Visualização em timeline dos eventos da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Timeline será restaurado em breve</p>
              </div>
            </CardContent>
          </Card>
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
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
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
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-4 rounded-xl"
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
            className="w-full mt-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Personalizar ações
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
