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
} from "lucide-react"

export default function DashboardSimpleWorking() {
  const stats = [
    {
      title: "Total de Alunos",
      value: "1,234",
      description: "+12% em relação ao mês anterior",
      icon: Users,
      trend: "+12%",
    },
    {
      title: "Treinamentos Ativos",
      value: "45",
      description: "8 novos este mês",
      icon: BookOpen,
      trend: "+8",
    },
    {
      title: "Certificados Emitidos",
      value: "892",
      description: "+18% este mês",
      icon: Award,
      trend: "+18%",
    },
    {
      title: "Horas de Treinamento",
      value: "3,456",
      description: "+25% desde o último mês",
      icon: Clock,
      trend: "+25%",
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
                <Icon className="h-4 w-4 text-blue-600" />
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

      {/* Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Turmas por Mês</CardTitle>
            <CardDescription>Crescimento das turmas nos últimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600 font-medium">Gráfico de Turmas</p>
                <p className="text-sm text-gray-500">48 turmas este mês (+71% crescimento)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receitas Mensais</CardTitle>
            <CardDescription>Contas a receber e pagamentos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <p className="text-gray-600 font-medium">Análise Financeira</p>
                <p className="text-sm text-gray-500">R$ 120k este mês (+7% crescimento)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Agenda da Semana</CardTitle>
          <CardDescription>Próximos eventos e treinamentos agendados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <p className="text-gray-600 font-medium">Calendário Semanal</p>
              <p className="text-sm text-gray-500">5 eventos agendados para esta semana</p>
            </div>
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
