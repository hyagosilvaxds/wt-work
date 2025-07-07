"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileSpreadsheet,
  FileText,
  Filter,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react"

export function CashFlowReport() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [account, setAccount] = useState("")
  const [activeTab, setActiveTab] = useState("report")

  // Dados de exemplo para o fluxo de caixa
  const cashFlowData = [
    {
      id: 1,
      date: "2024-06-01",
      description: "Recebimento - Empresa ABC Ltda",
      type: "entrada",
      account: "Conta Principal",
      paymentMethod: "Transferência",
      value: 1500.0,
    },
    {
      id: 2,
      date: "2024-06-02",
      description: "Pagamento - Fornecedor de Material Didático",
      type: "saida",
      account: "Conta Principal",
      paymentMethod: "Transferência",
      value: 2500.0,
    },
    {
      id: 3,
      date: "2024-06-05",
      description: "Recebimento - 123 Comércio",
      type: "entrada",
      account: "Conta Poupança",
      paymentMethod: "Boleto",
      value: 950.0,
    },
    {
      id: 4,
      date: "2024-06-08",
      description: "Pagamento - Aluguel de Equipamentos",
      type: "saida",
      account: "Conta Principal",
      paymentMethod: "Boleto",
      value: 950.0,
    },
    {
      id: 5,
      date: "2024-06-10",
      description: "Recebimento - Construtora Silva",
      type: "entrada",
      account: "Conta Investimentos",
      paymentMethod: "PIX",
      value: 3200.0,
    },
    {
      id: 6,
      date: "2024-06-12",
      description: "Pagamento - Carlos Silva (Instrutor)",
      type: "saida",
      account: "Conta Principal",
      paymentMethod: "PIX",
      value: 3200.0,
    },
    {
      id: 7,
      date: "2024-06-14",
      description: "Recebimento - Empresa ABC Ltda",
      type: "entrada",
      account: "Conta Principal",
      paymentMethod: "Transferência",
      value: 2200.0,
    },
    {
      id: 8,
      date: "2024-06-15",
      description: "Pagamento - Ana Santos (Instrutora)",
      type: "saida",
      account: "Conta Poupança",
      paymentMethod: "Transferência",
      value: 1800.0,
    },
    {
      id: 9,
      date: "2024-06-18",
      description: "Recebimento - XYZ Indústria S.A.",
      type: "entrada",
      account: "Conta Principal",
      paymentMethod: "Cartão de Crédito",
      value: 2800.0,
    },
    {
      id: 10,
      date: "2024-06-20",
      description: "Pagamento - Aluguel do Espaço",
      type: "saida",
      account: "Conta Principal",
      paymentMethod: "Transferência",
      value: 3500.0,
    },
  ]

  // Aplicar filtros
  const filteredCashFlow = cashFlowData.filter((item) => {
    // Filtro de período
    if (startDate && endDate) {
      const itemDate = new Date(item.date)
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Ajustar para o final do dia

      if (itemDate < start || itemDate > end) return false
    }

    // Filtro de forma de pagamento
    if (paymentMethod && item.paymentMethod !== paymentMethod) return false

    // Filtro de conta
    if (account && item.account !== account) return false

    return true
  })

  // Ordenar por data
  const sortedCashFlow = [...filteredCashFlow].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calcular saldos
  const initialBalance = 10000.0 // Saldo inicial fictício
  let currentBalance = initialBalance

  const cashFlowWithBalance = sortedCashFlow.map((item) => {
    if (item.type === "entrada") {
      currentBalance += item.value
    } else {
      currentBalance -= item.value
    }
    return { ...item, balance: currentBalance }
  })

  // Calcular totais
  const totalIncome = filteredCashFlow
    .filter((item) => item.type === "entrada")
    .reduce((sum, item) => sum + item.value, 0)
  const totalExpense = filteredCashFlow
    .filter((item) => item.type === "saida")
    .reduce((sum, item) => sum + item.value, 0)
  const finalBalance = initialBalance + totalIncome - totalExpense

  // Agrupar por forma de pagamento
  const totalByPaymentMethod = filteredCashFlow.reduce(
    (acc, item) => {
      const method = item.paymentMethod
      if (item.type === "entrada") {
        acc.income[method] = (acc.income[method] || 0) + item.value
      } else {
        acc.expense[method] = (acc.expense[method] || 0) + item.value
      }
      return acc
    },
    { income: {} as Record<string, number>, expense: {} as Record<string, number> },
  )

  // Agrupar por conta
  const totalByAccount = filteredCashFlow.reduce(
    (acc, item) => {
      const accountName = item.account
      if (item.type === "entrada") {
        acc.income[accountName] = (acc.income[accountName] || 0) + item.value
      } else {
        acc.expense[accountName] = (acc.expense[accountName] || 0) + item.value
      }
      return acc
    },
    { income: {} as Record<string, number>, expense: {} as Record<string, number> },
  )

  // Listas para os filtros
  const accounts = [...new Set(cashFlowData.map((item) => item.account))]
  const paymentMethods = [...new Set(cashFlowData.map((item) => item.paymentMethod))]

  const handleExportExcel = () => {
    console.log("Exportando para Excel...")
    // Implementação da exportação para Excel
  }

  const handleExportPDF = () => {
    console.log("Exportando para PDF...")
    // Implementação da exportação para PDF
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fluxo de Caixa</h1>
          <p className="text-gray-600">Visualize e analise o fluxo de entradas e saídas financeiras</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-50 border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Saldo Inicial</span>
              <Wallet className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              R$ {initialBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-600">Total de Entradas</span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-600">Total de Saídas</span>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">Saldo Atual</span>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              R$ {finalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="report" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
          <TabsTrigger value="report">Fluxo de Caixa</TabsTrigger>
          <TabsTrigger value="summary">Resumos</TabsTrigger>
        </TabsList>

        <TabsContent value="report" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Data Inicial</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Data Final</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Forma de Pagamento</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Conta</Label>
                  <Select value={account} onValueChange={setAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {accounts.map((acc) => (
                        <SelectItem key={acc} value={acc}>
                          {acc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Fluxo de Caixa */}
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa</CardTitle>
              <CardDescription>
                {cashFlowWithBalance.length} registro(s) encontrado(s) • Período:{" "}
                {startDate && endDate
                  ? `${new Date(startDate).toLocaleDateString("pt-BR")} a ${new Date(endDate).toLocaleDateString(
                      "pt-BR",
                    )}`
                  : "Todo o período"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Conta</TableHead>
                      <TableHead>Forma de Pagamento</TableHead>
                      <TableHead>Entrada</TableHead>
                      <TableHead>Saída</TableHead>
                      <TableHead>Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} className="font-medium">
                        Saldo Inicial
                      </TableCell>
                      <TableCell className="font-bold">
                        R$ {initialBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                    {cashFlowWithBalance.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{new Date(item.date).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {item.type === "entrada" ? (
                              <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowDownRight className="mr-2 h-4 w-4 text-red-500" />
                            )}
                            {item.description}
                          </div>
                        </TableCell>
                        <TableCell>{item.account}</TableCell>
                        <TableCell>{item.paymentMethod}</TableCell>
                        <TableCell className="text-green-600">
                          {item.type === "entrada"
                            ? `R$ ${item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-red-600">
                          {item.type === "saida"
                            ? `R$ ${item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                            : "-"}
                        </TableCell>
                        <TableCell className={`font-medium ${item.balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                          R$ {item.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totais */}
              <div className="mt-6 bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total de Entradas:</span>
                    <span className="font-bold text-green-600">
                      R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total de Saídas:</span>
                    <span className="font-bold text-red-600">
                      R$ {totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Saldo Final:</span>
                    <span className={`font-bold text-lg ${finalBalance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                      R$ {finalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          {/* Resumo por Forma de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Forma de Pagamento</CardTitle>
              <CardDescription>Total de entradas e saídas agrupado por forma de pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Forma de Pagamento</TableHead>
                      <TableHead className="text-right">Entradas</TableHead>
                      <TableHead className="text-right">Saídas</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentMethods.map((method) => {
                      const income = totalByPaymentMethod.income[method] || 0
                      const expense = totalByPaymentMethod.expense[method] || 0
                      const balance = income - expense
                      return (
                        <TableRow key={method}>
                          <TableCell className="font-medium">{method}</TableCell>
                          <TableCell className="text-right text-green-600">
                            R$ {income.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            R$ {expense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}
                          >
                            R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Resumo por Conta */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Conta</CardTitle>
              <CardDescription>Total de entradas e saídas agrupado por conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Conta</TableHead>
                      <TableHead className="text-right">Entradas</TableHead>
                      <TableHead className="text-right">Saídas</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((accountName) => {
                      const income = totalByAccount.income[accountName] || 0
                      const expense = totalByAccount.expense[accountName] || 0
                      const balance = income - expense
                      return (
                        <TableRow key={accountName}>
                          <TableCell className="font-medium">{accountName}</TableCell>
                          <TableCell className="text-right text-green-600">
                            R$ {income.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            R$ {expense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}
                          >
                            R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Resumo Geral */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo Geral</CardTitle>
              <CardDescription>Visão consolidada do fluxo de caixa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="font-medium">Saldo Inicial:</span>
                    <span className="font-bold">
                      R$ {initialBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                    <span className="font-medium text-green-700">Total de Entradas:</span>
                    <span className="font-bold text-green-700">
                      R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                    <span className="font-medium text-red-700">Total de Saídas:</span>
                    <span className="font-bold text-red-700">
                      R$ {totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                    <span className="font-medium text-blue-700">Saldo Final:</span>
                    <span className={`font-bold ${finalBalance >= 0 ? "text-blue-700" : "text-red-700"}`}>
                      R$ {finalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-4">Estatísticas</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Entradas vs Saídas</span>
                        <span>
                          {Math.round((totalIncome / (totalIncome + totalExpense)) * 100)}% /{" "}
                          {Math.round((totalExpense / (totalIncome + totalExpense)) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${(totalIncome / (totalIncome + totalExpense)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Maior entrada</p>
                        <p className="font-medium">
                          R${" "}
                          {Math.max(
                            ...filteredCashFlow.filter((item) => item.type === "entrada").map((item) => item.value),
                            0,
                          ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Maior saída</p>
                        <p className="font-medium">
                          R${" "}
                          {Math.max(
                            ...filteredCashFlow.filter((item) => item.type === "saida").map((item) => item.value),
                            0,
                          ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Média de entradas</p>
                        <p className="font-medium">
                          R${" "}
                          {(
                            totalIncome / (filteredCashFlow.filter((item) => item.type === "entrada").length || 1)
                          ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Média de saídas</p>
                        <p className="font-medium">
                          R${" "}
                          {(
                            totalExpense / (filteredCashFlow.filter((item) => item.type === "saida").length || 1)
                          ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
