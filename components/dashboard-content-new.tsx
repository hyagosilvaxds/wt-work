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
  Plus,
  TrendingUp,
  Calendar,
  DollarSign,
  MapPin,
  Briefcase,
} from "lucide-react"

export default function DashboardContentNew() {
  const stats = [
    {
      title: "Total de Alunos",
      value: "1,234",
      description: "+12% em relação ao mês anterior",
      icon: Users,
      trend: "+12%",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Treinamentos Ativos", 
      value: "45",
      description: "8 novos este mês",
      icon: BookOpen,
      trend: "+8",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Certificados Emitidos",
      value: "892", 
      description: "+18% este mês",
      icon: Award,
      trend: "+18%",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Horas de Treinamento",
      value: "3,456",
      description: "+25% desde o último mês", 
      icon: Clock,
      trend: "+25%",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  // Dados simples para gráficos
  const classesData = [
    { month: "Jun", classes: 28 },
    { month: "Jul", classes: 32 },
    { month: "Ago", classes: 35 },
    { month: "Set", classes: 38 },
    { month: "Out", classes: 42 },
    { month: "Nov", classes: 45 },
    { month: "Dez", classes: 48 },
  ]

  const financialData = [
    { month: "Jun", amount: 78000, paid: 72000 },
    { month: "Jul", amount: 85000, paid: 78000 },
    { month: "Ago", amount: 92000, paid: 83000 },
    { month: "Set", amount: 97000, paid: 89000 },
    { month: "Out", amount: 105000, paid: 95000 },
    { month: "Nov", amount: 112000, paid: 102000 },
    { month: "Dez", amount: 120000, paid: 108000 },
  ]

  const events = [
    {
      id: 1,
      title: "Treinamento de Segurança",
      time: "08:00 - 12:00",
      location: "Sala 101",
      participants: 15,
      type: "class",
      color: "border-l-blue-500 bg-blue-50",
    },
    {
      id: 2,
      title: "Reunião de Planejamento", 
      time: "14:00 - 15:30",
      location: "Sala de Reuniões",
      participants: 8,
      type: "meeting",
      color: "border-l-green-500 bg-green-50",
    },
    {
      id: 3,
      title: "Workshop de Inovação",
      time: "09:00 - 17:00", 
      location: "Auditório Principal",
      participants: 25,
      type: "workshop",
      color: "border-l-yellow-500 bg-yellow-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do seu centro deasdfa treinamento</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Classes Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Turmas por Mês
            </CardTitle>
            <CardDescription>
              Crescimento das turmas nos últimos 7 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simple bar chart */}
              <div className="flex items-end justify-between h-32 gap-2">
                {classesData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                      style={{
                        height: `${(item.classes / 48) * 100}%`,
                        minHeight: "20px",
                      }}
                    />
                    <span className="text-xs text-gray-600 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">48</div>
                  <div className="text-sm text-gray-600">Turmas este mês</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">720</div>
                  <div className="text-sm text-gray-600">Alunos ativos</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Receitas Mensais
            </CardTitle>
            <CardDescription>
              Contas a receber e pagamentos realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simple bar chart */}
              <div className="flex items-end justify-between h-32 gap-2">
                {financialData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="w-full relative">
                      <div
                        className="w-full bg-gray-200 rounded-t-sm"
                        style={{
                          height: `${(item.amount / 120000) * 100}px`,
                          minHeight: "20px",
                        }}
                      />
                      <div
                        className="w-full bg-green-500 rounded-t-sm absolute bottom-0"
                        style={{
                          height: `${(item.paid / 120000) * 100}px`,
                          minHeight: "15px",
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">R$ 108k</div>
                  <div className="text-xs text-gray-600">Recebido</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">R$ 12k</div>
                  <div className="text-xs text-gray-600">Pendente</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">R$ 120k</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Widget */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Agenda da Semana
              </CardTitle>
              <CardDescription>
                Próximos eventos e treinamentos agendados
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Evento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border-l-4 ${event.color} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start justify-between">
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
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Gerenciar Alunos</h3>
            <p className="text-sm text-gray-600 mt-1">Adicionar, editar ou visualizar alunos</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold text-gray-900">Criar Treinamento</h3>
            <p className="text-sm text-gray-600 mt-1">Configurar novos cursos e treinamentos</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Emitir Certificados</h3>
            <p className="text-sm text-gray-600 mt-1">Gerar certificados para alunos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
