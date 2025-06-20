"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileSpreadsheet, FileIcon as FilePdf, Filter, Printer } from "lucide-react"

export function AccountsReceivableReport() {
  const [dateType, setDateType] = useState("dueDate")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [account, setAccount] = useState("")
  const [client, setClient] = useState("")
  const [status, setStatus] = useState("")
  const [activeTab, setActiveTab] = useState("report")

  // Dados de exemplo para contas a receber
  const receivables = [
    {
      id: 1,
      value: 1500.0,
      client: "Empresa ABC Ltda",
      account: "Conta Principal",
      isRecurring: true,
      dueDate: "2024-06-15",
      paymentDate: "2024-06-14",
      paymentMethod: "Transferência",
      observation: "Pagamento referente ao treinamento de Excel Avançado",
      status: "Quitada",
    },
    {
      id: 2,
      value: 2800.0,
      client: "XYZ Indústria S.A.",
      account: "Conta Principal",
      isRecurring: false,
      dueDate: "2024-06-20",
      paymentDate: null,
      paymentMethod: null,
      observation: "Treinamento de Segurança do Trabalho para 10 funcionários",
      status: "Normal",
    },
    {
      id: 3,
      value: 950.0,
      client: "123 Comércio",
      account: "Conta Poupança",
      isRecurring: true,
      dueDate: "2024-06-10",
      paymentDate: "2024-06-08",
      paymentMethod: "Boleto",
      observation: "Mensalidade de consultoria",
      status: "Quitada",
    },
    {
      id: 4,
      value: 3500.0,
      client: "Construtora Silva",
      account: "Conta Principal",
      isRecurring: false,
      dueDate: "2024-06-25",
      paymentDate: null,
      paymentMethod: null,
      observation: "Treinamento NR-35 para equipe",
      status: "Normal",
    },
    {
      id: 5,
      value: 1200.0,
      client: "Mercado Central",
      account: "Conta Investimentos",
      isRecurring: true,
      dueDate: "2024-06-05",
      paymentDate: null,
      paymentMethod: null,
      observation: "Mensalidade de suporte técnico",
      status: "Vencida",
    },
    {
      id: 6,
      value: 2200.0,
      client: "Empresa ABC Ltda",
      account: "Conta Principal",
      isRecurring: false,
      dueDate: "2024-06-28",
      paymentDate: null,
      paymentMethod: null,
      observation: "Consultoria em processos",
      status: "Normal",
    },
    {
      id: 7,
      value: 1800.0,
      client: "XYZ Indústria S.A.",
      account: "Conta Poupança",
      isRecurring: true,
      dueDate: "2024-05-20",
      paymentDate: "2024-05-19",
      paymentMethod: "PIX",
      observation: "Mensalidade de suporte",
      status: "Quitada",
    },
    {
      id: 8,
      value: 3200.0,
      client: "Construtora Silva",
      account: "Conta Investimentos",
      isRecurring: false,
      dueDate: "2024-05-15",
      paymentDate: "2024-05-20",
      paymentMethod: "Cartão de Crédito",
      observation: "Treinamento de liderança",
      status: "Quitada",
    },
    {
      id: 9,
      value: 750.0,
      client: "123 Comércio",
      account: "Conta Principal",
      isRecurring: false,
      dueDate: "2024-05-10",
      paymentDate: null,
      paymentMethod: null,
      observation: "Material didático",
      status: "Vencida",
    },
    {
      id: 10,
      value: 4500.0,
      client: "Mercado Central",
      account: "Conta Principal",
      isRecurring: false,
      dueDate: "2024-07-05",
      paymentDate: null,
      paymentMethod: null,
      observation: "Treinamento completo para equipe",
      status: "Normal",
    },
  ]

  // Aplicar filtros
  const filteredReceivables = receivables.filter((item) => {
    // Filtro de período
    if (startDate && endDate) {
      const itemDate = new Date(dateType === "dueDate" ? item.dueDate : item.paymentDate || "")
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Ajustar para o final do dia

      if (itemDate < start || itemDate > end) return false
    }

    // Filtro de forma de pagamento
    if (paymentMethod && item.paymentMethod !== paymentMethod) return false

    // Filtro de conta
    if (account && item.account !== account) return false

    // Filtro de cliente
    if (client && !item.client.toLowerCase().includes(client.toLowerCase())) return false

    // Filtro de status
    if (status && item.status !== status) return false

    return true
  })

  // Calcular totais
  const totalValue = filteredReceivables.reduce((sum, item) => sum + item.value, 0)

  // Agrupar por cliente
  const totalByClient = filteredReceivables.reduce(
    (acc, item) => {
      acc[item.client] = (acc[item.client] || 0) + item.value
      return acc
    },
    {} as Record<string, number>,
  )

  // Agrupar por conta
  const totalByAccount = filteredReceivables.reduce(
    (acc, item) => {
      acc[item.account] = (acc[item.account] || 0) + item.value
      return acc
    },
    {} as Record<string, number>,
  )

  // Agrupar por forma de pagamento
  const totalByPaymentMethod = filteredReceivables.reduce(
    (acc, item) => {
      const method = item.paymentMethod || "Não definido"
      acc[method] = (acc[method] || 0) + item.value
      return acc
    },
    {} as Record<string, number>,
  )

  // Listas para os filtros
  const clients = [...new Set(receivables.map((item) => item.client))]
  const accounts = [...new Set(receivables.map((item) => item.account))]
  const paymentMethods = [
    ...new Set(receivables.filter((item) => item.paymentMethod).map((item) => item.paymentMethod)),
  ]
  const statuses = [...new Set(receivables.map((item) => item.status))]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Quitada":
        return "bg-green-100 text-green-800"
      case "Normal":
        return "bg-blue-100 text-blue-800"
      case "Vencida":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Relatório de Contas a Receber</h1>
          <p className="text-gray-600">Visualize e analise as contas a receber com filtros personalizados</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FilePdf className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      <Tabs defaultValue="report" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
          <TabsTrigger value="report">Relatório</TabsTrigger>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Data</Label>
                  <Select value={dateType} onValueChange={setDateType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de data" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dueDate">Data de Vencimento</SelectItem>
                      <SelectItem value="paymentDate">Data de Pagamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                        <SelectItem key={method} value={method || "all"}>
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

                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select value={client} onValueChange={setClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {clients.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Resultados */}
          <Card>
            <CardHeader>
              <CardTitle>Contas a Receber</CardTitle>
              <CardDescription>
                {filteredReceivables.length} registro(s) encontrado(s) • Total:{" "}
                <span className="font-semibold">
                  R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Conta</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Forma de Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReceivables.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.client}</TableCell>
                        <TableCell>{item.account}</TableCell>
                        <TableCell>R$ {item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{new Date(item.dueDate).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString("pt-BR") : "-"}
                        </TableCell>
                        <TableCell>{item.paymentMethod || "-"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totais */}
              <div className="mt-6 bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Geral:</span>
                  <span className="font-bold text-lg">
                    R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          {/* Resumo por Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Cliente</CardTitle>
              <CardDescription>Total de contas a receber agrupado por cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(totalByClient).map(([client, total]) => (
                      <TableRow key={client}>
                        <TableCell className="font-medium">{client}</TableCell>
                        <TableCell className="text-right">
                          R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Resumo por Conta */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Conta</CardTitle>
              <CardDescription>Total de contas a receber agrupado por conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Conta</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(totalByAccount).map(([account, total]) => (
                      <TableRow key={account}>
                        <TableCell className="font-medium">{account}</TableCell>
                        <TableCell className="text-right">
                          R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Resumo por Forma de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Forma de Pagamento</CardTitle>
              <CardDescription>Total de contas a receber agrupado por forma de pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Forma de Pagamento</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(totalByPaymentMethod).map(([method, total]) => (
                      <TableRow key={method}>
                        <TableCell className="font-medium">{method}</TableCell>
                        <TableCell className="text-right">
                          R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
