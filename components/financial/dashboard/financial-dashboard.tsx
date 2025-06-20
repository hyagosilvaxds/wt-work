"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { useState } from "react"
import { MonthlyComparisonChart } from "./monthly-comparison-chart"
import { AccountsReceivableChart } from "./accounts-receivable-chart"
import { FinancialSummaryCards } from "./financial-summary-cards"
import { PaymentMethodDistributionChart } from "./payment-method-distribution-chart"

export function FinancialDashboard() {
  const [period, setPeriod] = useState("year")
  const [year, setYear] = useState("2024")

  // Dados financeiros fictícios para o dashboard
  const financialData = {
    summary: {
      received: 152500.0,
      paid: 128700.0,
      toReceive: 45800.0,
      toPay: 38200.0,
      receivedGrowth: 12.5,
      paidGrowth: 8.3,
      toReceiveGrowth: -5.2,
      toPayGrowth: 3.7,
    },
    monthlyData: [
      { month: "Jan", received: 12500, paid: 10800, toReceive: 3200, toPay: 2800 },
      { month: "Fev", received: 13200, paid: 11500, toReceive: 3500, toPay: 3100 },
      { month: "Mar", received: 14800, paid: 12200, toReceive: 3800, toPay: 3300 },
      { month: "Abr", received: 13500, paid: 11800, toReceive: 3600, toPay: 3200 },
      { month: "Mai", received: 15200, paid: 12500, toReceive: 4100, toPay: 3500 },
      { month: "Jun", received: 16500, paid: 13800, toReceive: 4500, toPay: 3800 },
      { month: "Jul", received: 14800, paid: 12200, toReceive: 4000, toPay: 3400 },
      { month: "Ago", received: 15500, paid: 13000, toReceive: 4200, toPay: 3600 },
      { month: "Set", received: 16800, paid: 14500, toReceive: 4600, toPay: 3900 },
      { month: "Out", received: 17200, paid: 15000, toReceive: 4700, toPay: 4000 },
      { month: "Nov", received: 18500, paid: 16200, toReceive: 5000, toPay: 4300 },
      { month: "Dez", received: 19800, paid: 17200, toReceive: 5400, toPay: 4600 },
    ],
    paymentMethods: {
      received: [
        { method: "Transferência", value: 58500 },
        { method: "PIX", value: 42300 },
        { method: "Boleto", value: 28700 },
        { method: "Cartão de Crédito", value: 18500 },
        { method: "Dinheiro", value: 4500 },
      ],
      paid: [
        { method: "Transferência", value: 48200 },
        { method: "PIX", value: 35600 },
        { method: "Boleto", value: 22400 },
        { method: "Cartão de Crédito", value: 15800 },
        { method: "Dinheiro", value: 6700 },
      ],
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
          <p className="text-gray-600">Visão geral e comparativa das finanças</p>
        </div>
        <div className="flex space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mês Atual</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Cards de resumo financeiro */}
      <FinancialSummaryCards data={financialData.summary} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="receivable">Contas a Receber</TabsTrigger>
          <TabsTrigger value="payable">Contas a Pagar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Gráfico comparativo mensal */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Comparativo Mensal: Recebido vs Pago</CardTitle>
              <CardDescription>Análise comparativa de valores recebidos e pagos mês a mês</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <MonthlyComparisonChart data={financialData.monthlyData} />
            </CardContent>
          </Card>

          {/* Distribuição por forma de pagamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Distribuição por Forma de Pagamento</CardTitle>
                <CardDescription>Valores recebidos por método de pagamento</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <PaymentMethodDistributionChart data={financialData.paymentMethods.received} type="received" />
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Distribuição por Forma de Pagamento</CardTitle>
                <CardDescription>Valores pagos por método de pagamento</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <PaymentMethodDistributionChart data={financialData.paymentMethods.paid} type="paid" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="receivable" className="space-y-6">
          {/* Gráfico de contas recebidas mês a mês */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Contas Recebidas Mês a Mês</CardTitle>
              <CardDescription>Evolução dos valores recebidos ao longo do ano</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <AccountsReceivableChart data={financialData.monthlyData} />
            </CardContent>
          </Card>

          {/* Tabela de resumo de contas a receber */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Resumo de Contas a Receber</CardTitle>
              <CardDescription>Valores recebidos e a receber por mês</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3 text-left font-medium text-gray-600">Mês</th>
                      <th className="p-3 text-right font-medium text-gray-600">Recebido</th>
                      <th className="p-3 text-right font-medium text-gray-600">A Receber</th>
                      <th className="p-3 text-right font-medium text-gray-600">Total</th>
                      <th className="p-3 text-right font-medium text-gray-600">% Recebido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.monthlyData.map((month) => {
                      const total = month.received + month.toReceive
                      const percentage = Math.round((month.received / total) * 100)
                      return (
                        <tr key={month.month} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{month.month}</td>
                          <td className="p-3 text-right text-green-600">
                            R$ {month.received.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-right text-blue-600">
                            R$ {month.toReceive.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-right font-medium">
                            R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end">
                              <span className="mr-2">{percentage}%</span>
                              <div className="w-16 h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-medium">
                      <td className="p-3">Total</td>
                      <td className="p-3 text-right text-green-600">
                        R${" "}
                        {financialData.monthlyData
                          .reduce((sum, month) => sum + month.received, 0)
                          .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right text-blue-600">
                        R${" "}
                        {financialData.monthlyData
                          .reduce((sum, month) => sum + month.toReceive, 0)
                          .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right">
                        R${" "}
                        {financialData.monthlyData
                          .reduce((sum, month) => sum + month.received + month.toReceive, 0)
                          .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right">
                        {Math.round(
                          (financialData.monthlyData.reduce((sum, month) => sum + month.received, 0) /
                            financialData.monthlyData.reduce(
                              (sum, month) => sum + month.received + month.toReceive,
                              0,
                            )) *
                            100,
                        )}
                        %
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payable" className="space-y-6">
          {/* Gráfico de contas pagas mês a mês */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Contas Pagas Mês a Mês</CardTitle>
              <CardDescription>Evolução dos valores pagos ao longo do ano</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <div className="h-full w-full">
                  {/* Gráfico similar ao AccountsReceivableChart, mas para contas pagas */}
                  <div className="flex items-end h-full space-x-2">
                    {financialData.monthlyData.map((month, index) => {
                      const paidHeight = (month.paid / 20000) * 100
                      const toPayHeight = (month.toPay / 20000) * 100
                      return (
                        <div key={month.month} className="flex-1 flex flex-col items-center group">
                          <div className="h-64 w-full flex flex-col justify-end items-center space-y-1">
                            <div
                              className="w-full max-w-16 bg-red-100 rounded-t-md relative group-hover:bg-red-200 transition-colors"
                              style={{ height: `${toPayHeight}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                A Pagar: R$ {month.toPay.toLocaleString("pt-BR")}
                              </div>
                            </div>
                            <div
                              className="w-full max-w-16 bg-red-500 rounded-t-md relative group-hover:bg-red-600 transition-colors"
                              style={{ height: `${paidHeight}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Pago: R$ {month.paid.toLocaleString("pt-BR")}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-xs font-medium">{month.month}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de resumo de contas a pagar */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Resumo de Contas a Pagar</CardTitle>
              <CardDescription>Valores pagos e a pagar por mês</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3 text-left font-medium text-gray-600">Mês</th>
                      <th className="p-3 text-right font-medium text-gray-600">Pago</th>
                      <th className="p-3 text-right font-medium text-gray-600">A Pagar</th>
                      <th className="p-3 text-right font-medium text-gray-600">Total</th>
                      <th className="p-3 text-right font-medium text-gray-600">% Pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.monthlyData.map((month) => {
                      const total = month.paid + month.toPay
                      const percentage = Math.round((month.paid / total) * 100)
                      return (
                        <tr key={month.month} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{month.month}</td>
                          <td className="p-3 text-right text-red-600">
                            R$ {month.paid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-right text-orange-600">
                            R$ {month.toPay.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-right font-medium">
                            R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end">
                              <span className="mr-2">{percentage}%</span>
                              <div className="w-16 h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-full bg-red-500 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-medium">
                      <td className="p-3">Total</td>
                      <td className="p-3 text-right text-red-600">
                        R${" "}
                        {financialData.monthlyData
                          .reduce((sum, month) => sum + month.paid, 0)
                          .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right text-orange-600">
                        R${" "}
                        {financialData.monthlyData
                          .reduce((sum, month) => sum + month.toPay, 0)
                          .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right">
                        R${" "}
                        {financialData.monthlyData
                          .reduce((sum, month) => sum + month.paid + month.toPay, 0)
                          .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-right">
                        {Math.round(
                          (financialData.monthlyData.reduce((sum, month) => sum + month.paid, 0) /
                            financialData.monthlyData.reduce((sum, month) => sum + month.paid + month.toPay, 0)) *
                            100,
                        )}
                        %
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
