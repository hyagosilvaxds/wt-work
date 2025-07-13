"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, BookOpen } from "lucide-react"

export function NewClassesChart() {
  // Dados simples para o gráfico
  const data = [
    { month: "Jun", classes: 28, students: 420 },
    { month: "Jul", classes: 32, students: 480 },
    { month: "Ago", classes: 35, students: 525 },
    { month: "Set", classes: 38, students: 570 },
    { month: "Out", classes: 42, students: 630 },
    { month: "Nov", classes: 45, students: 675 },
    { month: "Dez", classes: 48, students: 720 },
  ]

  const growth = 71 // Crescimento percentual

  return (
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
          {/* Gráfico de barras simples */}
          <div className="flex items-end justify-between h-32 gap-2">
            {data.map((item, index) => (
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

          {/* Estatísticas */}
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

          {/* Indicador de crescimento */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">
              +{growth}% de crescimento
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
