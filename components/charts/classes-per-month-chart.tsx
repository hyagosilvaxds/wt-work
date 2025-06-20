"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersRound, TrendingUp } from "lucide-react"

// Dados fictícios para gráfico de turmas por mês (últimos 7 meses)
const classesPerMonthData = [
  { month: "Jun", classes: 28, students: 420 },
  { month: "Jul", classes: 32, students: 480 },
  { month: "Ago", classes: 35, students: 525 },
  { month: "Set", classes: 38, students: 570 },
  { month: "Out", classes: 42, students: 630 },
  { month: "Nov", classes: 45, students: 675 },
  { month: "Dez", classes: 48, students: 720 },
]

export function ClassesPerMonthChart() {
  // Calcula o crescimento percentual
  const calculateGrowth = () => {
    const firstMonth = classesPerMonthData[0].classes
    const lastMonth = classesPerMonthData[classesPerMonthData.length - 1].classes
    return Math.round(((lastMonth - firstMonth) / firstMonth) * 100)
  }

  const growth = calculateGrowth()

  // Encontra os valores máximos para escala do gráfico
  const maxClasses = Math.max(...classesPerMonthData.map((d) => d.classes))
  const maxStudents = Math.max(...classesPerMonthData.map((d) => d.students))

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 border-b">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg mr-3">
            <UsersRound className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Turmas por Mês</CardTitle>
            <CardDescription className="text-gray-600 mt-1">Comparativo de turmas e alunos</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span>Turmas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
                <span>Alunos</span>
              </div>
            </div>
            <div className={`flex items-center space-x-1 ${growth >= 0 ? "text-green-600" : "text-red-600"}`}>
              <TrendingUp className={`w-4 h-4 ${growth < 0 ? "rotate-180" : ""}`} />
              <span className="text-sm font-medium">
                {growth >= 0 ? "+" : ""}
                {growth}%
              </span>
            </div>
          </div>

          {/* Gráfico */}
          <div className="h-80 bg-gray-50 rounded-lg p-4 overflow-hidden">
            <div className="h-full flex items-end justify-between gap-2 relative">
              {/* Linhas de grade horizontais */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="w-full h-px bg-gray-200"></div>
                ))}
              </div>

              {classesPerMonthData.map((data, i) => {
                const classHeight = Math.max((data.classes / maxClasses) * 70, 5) // Mínimo 5% de altura
                const studentHeight = Math.max((data.students / maxStudents) * 70, 5) // Mínimo 5% de altura

                return (
                  <div key={i} className="flex flex-col items-center group min-w-0 flex-1">
                    <div className="flex justify-center space-x-1 h-64 items-end w-full">
                      <div className="relative flex flex-col justify-end h-full w-6 max-w-6">
                        <div
                          className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md transition-all duration-300 group-hover:scale-105 relative min-h-[8px]"
                          style={{ height: `${classHeight}%` }}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                            {data.classes} turmas
                          </div>
                        </div>
                      </div>
                      <div className="relative flex flex-col justify-end h-full w-6 max-w-6">
                        <div
                          className="w-full bg-gradient-to-t from-secondary-600 to-secondary-400 rounded-t-md transition-all duration-300 group-hover:scale-105 relative min-h-[8px]"
                          style={{ height: `${studentHeight}%` }}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                            {data.students} alunos
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-3 font-medium truncate w-full text-center">
                      {data.month}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {classesPerMonthData[classesPerMonthData.length - 1]?.classes || 0}
              </div>
              <div className="text-sm text-gray-600">Turmas atuais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">
                {classesPerMonthData[classesPerMonthData.length - 1]?.students || 0}
              </div>
              <div className="text-sm text-gray-600">Alunos ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  classesPerMonthData[classesPerMonthData.length - 1]?.students /
                    classesPerMonthData[classesPerMonthData.length - 1]?.classes,
                ) || 0}
              </div>
              <div className="text-sm text-gray-600">Média por turma</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {growth >= 0 ? "+" : ""}
                {growth}%
              </div>
              <div className="text-sm text-gray-600">Crescimento</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
