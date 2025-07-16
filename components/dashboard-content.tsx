"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import ClientDashboard from "./client-dashboard"
import {
  Users,
  BookOpen,
  Award,
  Clock,
  Plus,
  TrendingUp,
  Calendar,
  DollarSign,
  MapPin,
  BarChart3,
  Target,
  Shield
} from "lucide-react"

export default function DashboardContent() {
  const { hasPermission, isClient } = useAuth()
  
  // Se for cliente, mostrar dashboard específico
  if (isClient) {
    return <ClientDashboard />
  }
  
  const allStats = [
    {
      title: "Total de Alunos",
      value: "1,234",
      description: "+12% em relação ao mês anterior",
      icon: Users,
      trend: "+12%",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      permission: "VIEW_STUDENTS"
    },
    {
      title: "Treinamentos Ativos",
      value: "45", 
      description: "8 novos este mês",
      icon: BookOpen,
      trend: "+8",
      color: "text-green-600",
      bgColor: "bg-green-50",
      permission: "VIEW_TRAININGS"
    },
    {
      title: "Certificados Emitidos",
      value: "892",
      description: "+18% este mês", 
      icon: Award,
      trend: "+18%",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      permission: "VIEW_CERTIFICATES"
    },
    {
      title: "Horas de Treinamento",
      value: "3,456",
      description: "+25% desde o último mês",
      icon: Clock,
      trend: "+25%",
      color: "text-orange-600", 
      bgColor: "bg-orange-50",
      permission: "VIEW_TRAININGS"
    },
    {
      title: "Receita Total",
      value: "R$ 89,245",
      description: "+15% este mês",
      icon: DollarSign,
      trend: "+15%",
      color: "text-green-600",
      bgColor: "bg-green-50",
      permission: "VIEW_FINANCIAL"
    },
    {
      title: "Contas a Receber",
      value: "R$ 12,340",
      description: "5 pendentes",
      icon: Target,
      trend: "-5",
      color: "text-red-600",
      bgColor: "bg-red-50",
      permission: "VIEW_ACCOUNTS_RECEIVABLE"
    },
    {
      title: "Turmas Ativas",
      value: "28",
      description: "6 novas este mês",
      icon: MapPin,
      trend: "+6",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      permission: "VIEW_CLASSES"
    },
    {
      title: "Instrutores Ativos",
      value: "15",
      description: "2 novos este mês",
      icon: Users,
      trend: "+2",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      permission: "VIEW_USERS"
    }
  ]

  // Filtrar estatísticas baseado nas permissões
  const stats = allStats.filter(stat => 
    hasPermission(stat.permission) || 
    (stat.permission === "VIEW_TRAININGS" && hasPermission("VIEW_OWN_TRAININGS")) ||
    (stat.permission === "VIEW_CERTIFICATES" && hasPermission("VIEW_OWN_CERTIFICATES")) ||
    (stat.permission === "VIEW_CLASSES" && hasPermission("VIEW_OWN_CLASSES"))
  )

  const chartData = [
    { month: "Jun", value: 28 },
    { month: "Jul", value: 32 },
    { month: "Ago", value: 35 },
    { month: "Set", value: 38 },
    { month: "Out", value: 42 },
    { month: "Nov", value: 45 },
    { month: "Dez", value: 48 },
  ]

  const events = [
    {
      id: 1,
      title: "Treinamento de Segurança",
      time: "08:00 - 12:00",
      location: "Sala 101",
      participants: 15,
      status: "Confirmado"
    },
    {
      id: 2,
      title: "Reunião de Planejamento",
      time: "14:00 - 15:30", 
      location: "Sala de Reuniões",
      participants: 8,
      status: "Pendente"
    },
    {
      id: 3,
      title: "Workshop de Inovação",
      time: "09:00 - 17:00",
      location: "Auditório Principal", 
      participants: 25,
      status: "Confirmado"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do seu centro de treinamento</p>
        </div>
        <div className="flex gap-2">
          {hasPermission('CREATE_CLASSES') && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Turma
            </Button>
          )}
          {hasPermission('CREATE_TRAININGS') && (
            <Button variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Novo Treinamento
            </Button>
          )}
          {hasPermission('VIEW_REPORTS') && (
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Relatórios
            </Button>
          )}
          {hasPermission('VIEW_FINANCIAL') && (
            <Button variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Financeiro
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {stat.description}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs font-medium text-green-600">
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simple Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Evolução de Turmas
            </CardTitle>
            <CardDescription>
              Crescimento mensal das turmas oferecidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between h-32 gap-1">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600 cursor-pointer"
                      style={{
                        height: `${(item.value / 48) * 100}%`,
                        minHeight: "20px",
                      }}
                      title={`${item.month}: ${item.value} turmas`}
                    />
                    <span className="text-xs text-gray-600 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">48</div>
                  <div className="text-sm text-gray-600">Este mês</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">+71%</div>
                  <div className="text-sm text-gray-600">Crescimento</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Visão Financeira
            </CardTitle>
            <CardDescription>
              Resumo das receitas e pagamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">R$ 108k</div>
                  <div className="text-sm text-gray-600">Recebido</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">R$ 12k</div>
                  <div className="text-sm text-gray-600">Pendente</div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">R$ 120k</div>
                <div className="text-sm text-gray-600">Total do Mês</div>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+7% vs mês anterior</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Próximos Eventos
              </CardTitle>
              <CardDescription>
                Treinamentos e reuniões agendados para esta semana
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.participants} participantes
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'Confirmado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardContent className="p-6 text-center">
            <Users className="h-10 w-10 mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold text-gray-900 mb-2">Gerenciar Alunos</h3>
            <p className="text-sm text-gray-600">Adicionar, editar ou visualizar informações dos alunos</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-10 w-10 mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold text-gray-900 mb-2">Criar Treinamento</h3>
            <p className="text-sm text-gray-600">Configurar novos cursos e programas de treinamento</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardContent className="p-6 text-center">
            <Award className="h-10 w-10 mx-auto mb-3 text-purple-600" />
            <h3 className="font-semibold text-gray-900 mb-2">Emitir Certificados</h3>
            <p className="text-sm text-gray-600">Gerar e gerenciar certificados para os alunos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}