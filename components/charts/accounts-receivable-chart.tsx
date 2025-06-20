"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ArrowUpRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Dados fictícios para contas a receber por mês (últimos 7 meses)
const accountsReceivableData = [
  { month: "Jun", amount: 78000, paid: 72000, pending: 6000 },
  { month: "Jul", amount: 85000, paid: 78000, pending: 7000 },
  { month: "Ago", amount: 92000, paid: 83000, pending: 9000 },
  { month: "Set", amount: 97000, paid: 89000, pending: 8000 },
  { month: "Out", amount: 105000, paid: 95000, pending: 10000 },
  { month: "Nov", amount: 112000, paid: 102000, pending: 10000 },
  { month: "Dez", amount: 120000, paid: 108000, pending: 12000 },
]

export function AccountsReceivableChart() {
  // Calcula o crescimento percentual
  const calculateGrowth = () => {
    const firstMonth = accountsReceivableData[0].amount
    const lastMonth = accountsReceivableData[accountsReceivableData.length - 1].amount
    return Math.round(((lastMonth - firstMonth) / firstMonth) * 100)
  }

  const growth = calculateGrowth()

  // Encontra o valor máximo para escala do gráfico
  const maxAmount = Math.max(...accountsReceivableData.map((d) => d.amount))

  // Calcula a taxa de recebimento atual
  const currentData = accountsReceivableData[accountsReceivableData.length - 1]
  const currentReceiptRate = Math.round((currentData.paid / currentData.amount) * 100)

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mr-3">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Contas a Receber</CardTitle>
            <CardDescription className="text-gray-600 mt-1">Comparativo financeiro mensal</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Recebido</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Pendente</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium text-gray-700">
                Total atual:{" "}
                <span className="text-green-600 font-bold">R$ {(currentData.amount / 1000).toFixed(0)}k</span>
              </div>
              <div className={`flex items-center space-x-1 ${growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                <ArrowUpRight className={`w-4 h-4 ${growth < 0 ? "rotate-180" : ""}`} />
                <span className="text-sm font-medium">
                  {growth >= 0 ? "+" : ""}
                  {growth}%
                </span>
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div className="h-80 bg-gray-50 rounded-lg p-4 overflow-hidden">
            <div className="h-full flex items-end gap-2 relative pl-12">
              {/* Linhas de grade horizontais */}
              <div className="absolute inset-0 left-12 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="w-full h-px bg-gray-200"></div>
                ))}
              </div>

              {/* Valores da escala */}
              <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-400 pointer-events-none w-10">
                {[0, 1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="transform -translate-y-1/2 text-right pr-2">
                    R$ {Math.round((maxAmount * i) / 4 / 1000)}k
                  </div>
                ))}
              </div>

              {/* Área das barras */}
              <div className="flex-1 flex items-end justify-between gap-2 h-full">
                {accountsReceivableData.map((data, i) => {
                  const paidHeight = Math.max((data.paid / maxAmount) * 70, 5) // Mínimo 5% de altura
                  const pendingHeight = Math.max((data.pending / maxAmount) * 70, 3) // Mínimo 3% de altura
                  const receiptRate = Math.round((data.paid / data.amount) * 100)

                  return (
                    <div key={i} className="flex flex-col items-center group min-w-0 flex-1">
                      <div className="w-full flex justify-center h-64 items-end">
                        <div className="relative flex flex-col justify-end h-full w-10 max-w-10">
                          {/* Barra de valores pendentes (laranja) - no topo */}
                          <div
                            className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-md transition-all duration-300 group-hover:scale-105 relative min-h-[4px]"
                            style={{ height: `${pendingHeight}%` }}
                          >
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                              Pendente: R$ {(data.pending / 1000).toFixed(0)}k
                            </div>
                          </div>
                          {/* Barra de valores recebidos (verde) - na base */}
                          <div
                            className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-b-md transition-all duration-300 group-hover:scale-105 relative min-h-[8px]"
                            style={{ height: `${paidHeight}%` }}
                          >
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                              Recebido: R$ {(data.paid / 1000).toFixed(0)}k
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <div className="text-xs text-gray-600 font-medium truncate w-full">{data.month}</div>
                        <div className="text-xs text-gray-400">{receiptRate}%</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="space-y-6 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">R$ {(currentData.paid / 1000).toFixed(0)}k</div>
                <div className="text-xs text-gray-600">Recebido</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">R$ {(currentData.pending / 1000).toFixed(0)}k</div>
                <div className="text-xs text-gray-600">Pendente</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{currentReceiptRate}%</div>
                <div className="text-xs text-gray-600">Taxa recebimento</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Taxa de recebimento</span>
                <span className="font-bold">{currentReceiptRate}%</span>
              </div>
              <Progress value={currentReceiptRate} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Meta: 95%</span>
                <span>Atual: {currentReceiptRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
