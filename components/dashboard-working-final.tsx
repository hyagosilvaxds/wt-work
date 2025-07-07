"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  Calendar,
  Plus,
  MapPin,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Activity,
  Target
} from "lucide-react"

export default function DashboardFinal() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const stats = [
    {
      title: "Total de Alunos",
      value: "1,234",
      description: "+12% em relação ao mês anterior",
      icon: Users,
      trend: "+12%",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Treinamentos Ativos",
      value: "45",
      description: "8 novos este mês",
      icon: BookOpen,
      trend: "+8",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Certificados Emitidos",
      value: "892",
      description: "+18% este mês",
      icon: Award,
      trend: "+18%",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Horas de Treinamento",
      value: "3,456",
      description: "+25% desde o último mês",
      icon: Clock,
      trend: "+25%",
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
  ]

  // Dados simples para gráficos
  const chartData = [
    { month: "Jun", classes: 28, revenue: 78000 },
    { month: "Jul", classes: 32, revenue: 85000 },
    { month: "Ago", classes: 35, revenue: 92000 },
    { month: "Set", classes: 38, revenue: 97000 },
    { month: "Out", classes: 42, revenue: 105000 },
    { month: "Nov", classes: 45, revenue: 112000 },
    { month: "Dez", classes: 48, revenue: 120000 },
  ]

  // Eventos da agenda
  const upcomingEvents = [
    {
      id: 1,
      title: "Treinamento de Segurança",
      date: "16 Dez",
      time: "08:00 - 12:00",
      location: "Sala 101",
      participants: 15,
      type: "class"
    },
    {
      id: 2,
      title: "Reunião de Planejamento",
      date: "17 Dez",
      time: "14:00 - 15:30",
      location: "Sala de Reuniões",
      participants: 8,
      type: "meeting"
    },
    {
      id: 3,
      title: "Workshop de Inovação",
      date: "18 Dez",
      time: "09:00 - 17:00",
      location: "Auditório Principal",
      participants: 25,
      type: "workshop"
    },
    {
      id: 4,
      title: "Certificação ISO",
      date: "19 Dez",
      time: "10:00 - 16:00",
      location: "Centro de Avaliação",
      participants: 12,
      type: "certification"
    }
  ]

  const getEventColor = (type: string) => {
    switch (type) {
      case "class": return "border-l-blue-500 bg-blue-50"
      case "meeting": return "border-l-green-500 bg-green-50"
      case "workshop": return "border-l-yellow-500 bg-yellow-50"
      case "certification": return "border-l-purple-500 bg-purple-50"
      default: return "border-l-gray-500 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do seu centro de treinamento</p>
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
            <CardDescription>Crescimento das turmas nos últimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between h-32 gap-2">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600 cursor-pointer"
                      style={{
                        height: `${(item.classes / 48) * 100}%`,
                        minHeight: "20px",
                      }}
                      title={`${item.month}: ${item.classes} turmas`}
                    />
                    <span className="text-xs text-gray-600 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">48</div>
                  <div className="text-sm text-gray-600">Turmas este mês</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+71%</div>
                  <div className="text-sm text-gray-600">Crescimento</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Receitas Mensais
            </CardTitle>
            <CardDescription>Evolução das receitas nos últimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between h-32 gap-2">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-green-500 rounded-t-sm transition-all duration-300 hover:bg-green-600 cursor-pointer"
                      style={{
                        height: `${(item.revenue / 120000) * 100}%`,
                        minHeight: "20px",
                      }}
                      title={`${item.month}: R$ ${(item.revenue / 1000).toFixed(0)}k`}
                    />
                    <span className="text-xs text-gray-600 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">R$ 120k</div>
                  <div className="text-sm text-gray-600">Receita este mês</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">+54%</div>
                  <div className="text-sm text-gray-600">Crescimento</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Agenda da Semana
              </CardTitle>
              <CardDescription>Próximos eventos e treinamentos agendados</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-3">
                {currentDate.toLocaleDateString('pt-BR', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type)} transition-all duration-200 hover:shadow-md cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {event.date}
                      </div>
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
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.type === 'class' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'meeting' ? 'bg-green-100 text-green-800' :
                      event.type === 'workshop' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {event.type === 'class' ? 'Aula' :
                       event.type === 'meeting' ? 'Reunião' :
                       event.type === 'workshop' ? 'Workshop' :
                       'Certificação'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {upcomingEvents.length} eventos esta semana
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Evento
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Gerenciar Alunos</h3>
            <p className="text-sm text-gray-600 mt-1">Adicionar, editar ou visualizar alunos</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold text-gray-900">Criar Treinamento</h3>
            <p className="text-sm text-gray-600 mt-1">Configurar novos cursos e treinamentos</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Emitir Certificados</h3>
            <p className="text-sm text-gray-600 mt-1">Gerar certificados para alunos</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Relatórios</h3>
            <p className="text-sm text-gray-600 mt-1">Visualizar relatórios e análises</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
