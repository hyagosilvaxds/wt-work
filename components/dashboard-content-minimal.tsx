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
import { NewClassesChart } from "@/components/charts/new-classes-chart"
import { NewFinancialChart } from "@/components/charts/new-financial-chart"
import { NewCalendarWidget } from "@/components/new-calendar-widget"

export default function DashboardContentMinimal() {
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
      title: "Certificados Emitidos",
      value: "892",
      description: "+18% este mês",
      icon: Award,
      color: "from-accent-500 to-accent-600",
      textColor: "text-accent-600",
      bgColor: "bg-accent-50",
      trend: "+18%",
      trendColor: "text-green-600",
    },
    {
      title: "Horas de Treinamento",
      value: "3,456",
      description: "+25% desde o último mês",
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "+25%",
      trendColor: "text-green-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do seu centro de treinamento</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.textColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {stat.description}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium ${stat.trendColor}`}>
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Gráficos Comparativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NewClassesChart />
        <NewFinancialChart />
      </div>

      {/* Agenda - Timeline Semanal */}
      <div className="grid grid-cols-1 gap-8">
        <NewCalendarWidget />
      </div>
    </div>
  )
}
