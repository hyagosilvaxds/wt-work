"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Download,
  Calendar as CalendarIcon,
  CreditCard,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Plus,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import { AddTransactionDialog } from "./add-transaction-dialog"

interface CashFlowEntry {
  id: number
  date: string
  description: string
  account: string
  paymentMethod: string
  type: "entrada" | "saida"
  amount: number
  category: string
  reference?: string
}

export function CashFlowPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const [selectedAccount, setSelectedAccount] = useState<string>("all")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] = useState(false)
  const [cashFlowData, setCashFlowData] = useState<CashFlowEntry[]>([
    {
      id: 1,
      date: "2024-06-13",
      description: "Pagamento - Curso de Segurança do Trabalho",
      account: "Conta Corrente Banco do Brasil",
      paymentMethod: "Transferência Bancária",
      type: "entrada",
      amount: 2500.00,
      category: "Receita de Cursos",
      reference: "TRF001234"
    },
    {
      id: 2,
      date: "2024-06-13",
      description: "Pagamento de Salários - Junho/2024",
      account: "Conta Corrente Banco do Brasil",
      paymentMethod: "Transferência Bancária",
      type: "saida",
      amount: 15000.00,
      category: "Folha de Pagamento",
      reference: "SAL202406"
    },
    {
      id: 3,
      date: "2024-06-12",
      description: "Recebimento - Treinamento Excel Avançado",
      account: "Conta Poupança Caixa",
      paymentMethod: "PIX",
      type: "entrada",
      amount: 1800.00,
      category: "Receita de Cursos",
      reference: "PIX789456"
    },
    {
      id: 4,
      date: "2024-06-12",
      description: "Compra de Material Didático",
      account: "Cartão de Crédito",
      paymentMethod: "Cartão de Crédito",
      type: "saida",
      amount: 850.00,
      category: "Material e Suprimentos",
      reference: "CC156789"
    },
    {
      id: 5,
      date: "2024-06-11",
      description: "Pagamento - Certificação NR-35",
      account: "Conta Corrente Itaú",
      paymentMethod: "Boleto Bancário",
      type: "entrada",
      amount: 3200.00,
      category: "Receita de Certificações",
      reference: "BOL987654"
    },
    {
      id: 6,
      date: "2024-06-11",
      description: "Aluguel da Sede - Junho/2024",
      account: "Conta Corrente Banco do Brasil",
      paymentMethod: "Débito Automático",
      type: "saida",
      amount: 4500.00,
      category: "Despesas Operacionais",
      reference: "DEB654321"
    },
    {
      id: 7,
      date: "2024-06-10",
      description: "Recebimento - Workshop de Liderança",
      account: "Conta Corrente Itaú",
      paymentMethod: "Dinheiro",
      type: "entrada",
      amount: 1200.00,
      category: "Receita de Workshops",
      reference: "DIN001"
    },
    {
      id: 8,
      date: "2024-06-10",
      description: "Pagamento de Energia Elétrica",
      account: "Conta Corrente Banco do Brasil",
      paymentMethod: "Débito Automático",
      type: "saida",
      amount: 680.00,
      category: "Utilities",
      reference: "ENE202406"
    },
  ])

  // Função para adicionar nova transação
  const handleAddTransaction = (newTransaction: any) => {
    setCashFlowData(prev => [...prev, newTransaction])
  }

  const accounts = [
    "Conta Corrente Banco do Brasil",
    "Conta Corrente Itaú",
    "Conta Poupança Caixa",
    "Cartão de Crédito"
  ]

  const paymentMethods = [
    "Transferência Bancária",
    "PIX",
    "Cartão de Crédito", 
    "Cartão de Débito",
    "Boleto Bancário",
    "Débito Automático",
    "Dinheiro",
    "Cheque"
  ]

  // Filtrar dados baseado nos filtros selecionados
  const filteredData = cashFlowData.filter(entry => {
    const matchesAccount = selectedAccount === "all" || entry.account === selectedAccount
    const matchesPaymentMethod = selectedPaymentMethod === "all" || entry.paymentMethod === selectedPaymentMethod
    const matchesSearch = searchTerm === "" || 
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const entryDate = new Date(entry.date)
    const matchesDateRange = (!dateRange?.from || entryDate >= dateRange.from) && 
      (!dateRange?.to || entryDate <= dateRange.to)

    return matchesAccount && matchesPaymentMethod && matchesSearch && matchesDateRange
  })

  // Calcular totais
  const totalEntradas = filteredData
    .filter(entry => entry.type === "entrada")
    .reduce((sum, entry) => sum + entry.amount, 0)

  const totalSaidas = filteredData
    .filter(entry => entry.type === "saida")
    .reduce((sum, entry) => sum + entry.amount, 0)

  const saldoLiquido = totalEntradas - totalSaidas

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fluxo de Caixa</h1>
          <p className="text-gray-600 mt-1">Controle de entradas e saídas financeiras</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsAddTransactionDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Entradas</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEntradas)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Saídas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSaidas)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo Líquido</p>
                <p className={`text-2xl font-bold ${saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(saldoLiquido)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${saldoLiquido >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`w-6 h-6 ${saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Período */}
            <div className="space-y-2">
              <Label>Período</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                      )
                    ) : (
                      "Selecione o período"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Conta */}
            <div className="space-y-2">
              <Label>Conta</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <Building2 className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as contas</SelectItem>
                  {accounts.map(account => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Forma de Pagamento */}
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger>
                  <CreditCard className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Selecione a forma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as formas</SelectItem>
                  {paymentMethods.map(method => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Busca */}
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>
            {filteredData.length} transação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData.map((entry, index) => (
              <div key={entry.id}>
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    {/* Seta de entrada/saída */}
                    <div className={`p-2 rounded-full ${
                      entry.type === "entrada" 
                        ? "bg-green-100" 
                        : "bg-red-100"
                    }`}>
                      {entry.type === "entrada" ? (
                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 text-red-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{entry.description}</h3>
                        <Badge 
                          variant="secondary" 
                          className={entry.type === "entrada" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                        >
                          {entry.type === "entrada" ? "Entrada" : "Saída"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span>{entry.account}</span> • <span>{entry.paymentMethod}</span>
                        {entry.reference && <span> • Ref: {entry.reference}</span>}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {entry.category} • {formatDate(entry.date)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      entry.type === "entrada" ? "text-green-600" : "text-red-600"
                    }`}>
                      {entry.type === "entrada" ? "+" : "-"}{formatCurrency(entry.amount)}
                    </div>
                  </div>
                </div>
                {index < filteredData.length - 1 && <Separator />}
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <DollarSign className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-600">Nenhuma transação encontrada</p>
                <p className="text-sm text-gray-500 mt-1">
                  Ajuste os filtros para ver mais resultados
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Adicionar Transação */}
      <AddTransactionDialog
        isOpen={isAddTransactionDialogOpen}
        onClose={() => setIsAddTransactionDialogOpen(false)}
        onSave={handleAddTransaction}
      />
    </div>
  )
}