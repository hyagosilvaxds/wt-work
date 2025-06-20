"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react"

interface FinancialSummaryData {
  received: number
  paid: number
  toReceive: number
  toPay: number
  receivedGrowth: number
  paidGrowth: number
  toReceiveGrowth: number
  toPayGrowth: number
}

interface FinancialSummaryCardsProps {
  data: FinancialSummaryData
}

export function FinancialSummaryCards({ data }: FinancialSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card de Valor Recebido */}
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-green-700">Valor Recebido</p>
              <p className="text-2xl font-bold text-green-800 mt-1">
                R$ {data.received.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-700" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div
              className={`flex items-center space-x-1 text-sm ${
                data.receivedGrowth >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {data.receivedGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span>{Math.abs(data.receivedGrowth)}% em relação ao período anterior</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Valor Pago */}
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-red-700">Valor Pago</p>
              <p className="text-2xl font-bold text-red-800 mt-1">
                R$ {data.paid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-red-200 rounded-full">
              <TrendingDown className="h-5 w-5 text-red-700" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div
              className={`flex items-center space-x-1 text-sm ${
                data.paidGrowth >= 0 ? "text-red-700" : "text-green-700"
              }`}
            >
              {data.paidGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span>{Math.abs(data.paidGrowth)}% em relação ao período anterior</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Valor a Receber */}
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-blue-700">A Receber</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">
                R$ {data.toReceive.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-blue-200 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-700" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div
              className={`flex items-center space-x-1 text-sm ${
                data.toReceiveGrowth >= 0 ? "text-blue-700" : "text-red-700"
              }`}
            >
              {data.toReceiveGrowth >= 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span>{Math.abs(data.toReceiveGrowth)}% em relação ao período anterior</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Valor a Pagar */}
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-orange-700">A Pagar</p>
              <p className="text-2xl font-bold text-orange-800 mt-1">
                R$ {data.toPay.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-orange-200 rounded-full">
              <Wallet className="h-5 w-5 text-orange-700" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div
              className={`flex items-center space-x-1 text-sm ${
                data.toPayGrowth >= 0 ? "text-orange-700" : "text-green-700"
              }`}
            >
              {data.toPayGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span>{Math.abs(data.toPayGrowth)}% em relação ao período anterior</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
