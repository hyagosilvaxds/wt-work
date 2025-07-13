"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react"

export function NewFinancialChart() {
  // Dados simples para receitas
  const data = [
    { month: "Jun", amount: 78000, paid: 72000, pending: 6000 },
    { month: "Jul", amount: 85000, paid: 78000, pending: 7000 },
    { month: "Ago", amount: 92000, paid: 83000, pending: 9000 },
    { month: "Set", amount: 97000, paid: 89000, pending: 8000 },
    { month: "Out", amount: 105000, paid: 95000, pending: 10000 },
    { month: "Nov", amount: 112000, paid: 102000, pending: 10000 },
    { month: "Dez", amount: 120000, paid: 108000, pending: 12000 },
  ]

  const currentMonth = data[data.length - 1]
  const previousMonth = data[data.length - 2]
  const growth = Math.round(((currentMonth.amount - previousMonth.amount) / previousMonth.amount) * 100)

  return (
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
          {/* Gráfico de barras simples */}
          <div className="flex items-end justify-between h-32 gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full relative">
                  {/* Barra total */}
                  <div
                    className="w-full bg-gray-200 rounded-t-sm"
                    style={{
                      height: `${(item.amount / 120000) * 100}px`,
                      minHeight: "20px",
                    }}
                  />
                  {/* Barra paga */}
                  <div
                    className="w-full bg-green-500 rounded-t-sm absolute bottom-0 transition-all duration-300 hover:bg-green-600"
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

          {/* Legenda */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-sm" />
              <span className="text-gray-600">Recebido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-sm" />
              <span className="text-gray-600">Pendente</span>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                R$ {(currentMonth.paid / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-gray-600">Recebido</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">
                R$ {(currentMonth.pending / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-gray-600">Pendente</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                R$ {(currentMonth.amount / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>

          {/* Indicador de crescimento */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">
              +{growth}% vs mês anterior
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
