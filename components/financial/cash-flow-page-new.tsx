"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Loader2,
  BarChart3,
  Eye,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { toast } from "@/hooks/use-toast"
import { 
  cashFlowApi, 
  bankAccountsApi,
  type CashFlowStatistics,
  type CashFlowTransaction,
  type CashFlowTransactionsResponse,
  type CashFlowFilters,
  CASH_FLOW_CATEGORIES,
  CASH_FLOW_ORIGINS,
} from "@/lib/api/financial"

interface CashFlowPageProps {
  searchTerm?: string
  dateRange?: DateRange | undefined
  selectedAccounts?: string[]
  selectedPaymentMethods?: string[]
}

export function CashFlowPage({
  searchTerm: externalSearchTerm,
  dateRange: externalDateRange,
  selectedAccounts,
  selectedPaymentMethods,
}: CashFlowPageProps) {
  const [statistics, setStatistics] = useState<CashFlowStatistics | null>(null)
  const [transactions, setTransactions] = useState<CashFlowTransaction[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [summary, setSummary] = useState({ totalEntradas: 0, totalSaidas: 0 })
  const [loading, setLoading] = useState(true)
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [bankAccounts, setBankAccounts] = useState<any[]>([])
  
  // Estados locais para filtros
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    externalDateRange || {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    }
  )
  const [selectedAccount, setSelectedAccount] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>(externalSearchTerm || "")
  const [currentPage, setCurrentPage] = useState(1)

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  // Carregar transações quando filtros mudarem
  useEffect(() => {
    loadTransactions()
  }, [dateRange, selectedAccount, selectedCategory, searchTerm, currentPage])

  // Carregar estatísticas quando filtros relevantes mudarem
  useEffect(() => {
    loadStatistics()
  }, [dateRange, selectedAccount])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Carregar contas bancárias
      const accountsResponse = await bankAccountsApi.getAll().catch(() => getMockBankAccounts())
      const accounts = Array.isArray(accountsResponse) 
        ? accountsResponse 
        : accountsResponse?.data || accountsResponse?.items || getMockBankAccounts()
      setBankAccounts(accounts)

      // Carregar dados iniciais
      await Promise.all([loadStatistics(), loadTransactions()])
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do fluxo de caixa",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMockBankAccounts = () => {
    return [
      {
        id: "1",
        nome: "Conta Principal",
        banco: "Banco do Brasil",
        isActive: true,
      },
      {
        id: "2",
        nome: "Conta Poupança",
        banco: "Itaú",
        isActive: true,
      }
    ]
  }

  const buildFilters = (): CashFlowFilters => {
    const filters: CashFlowFilters = {
      page: currentPage,
      limit: pagination.limit,
    }

    if (dateRange?.from) {
      filters.startDate = format(dateRange.from, "yyyy-MM-dd")
    }
    if (dateRange?.to) {
      filters.endDate = format(dateRange.to, "yyyy-MM-dd")
    }
    if (selectedAccount !== "all") {
      filters.bankAccountId = selectedAccount
    }
    if (selectedCategory !== "all") {
      filters.categoria = selectedCategory as any
    }
    if (searchTerm) {
      filters.search = searchTerm
    }

    return filters
  }

  const loadStatistics = async () => {
    try {
      const filters = buildFilters()
      delete filters.page
      delete filters.limit
      delete filters.search
      delete filters.categoria

      const statsData = await cashFlowApi.getStatistics(filters).catch(() => getMockStatistics())
      setStatistics(statsData)
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
      setStatistics(getMockStatistics())
    }
  }

  const loadTransactions = async () => {
    try {
      setLoadingTransactions(true)
      const filters = buildFilters()
      
      const response = await cashFlowApi.getTransactions(filters).catch(() => getMockTransactions())
      
      setTransactions(response.data || [])
      setPagination(response.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
      setSummary(response.summary || { totalEntradas: 0, totalSaidas: 0 })
    } catch (error) {
      console.error("Erro ao carregar transações:", error)
      const mockData = getMockTransactions()
      setTransactions(mockData.data)
      setPagination(mockData.pagination)
      setSummary(mockData.summary)
    } finally {
      setLoadingTransactions(false)
    }
  }

  const getMockStatistics = (): CashFlowStatistics => {
    return {
      period: {
        startDate: format(dateRange?.from || new Date(), "yyyy-MM-dd"),
        endDate: format(dateRange?.to || new Date(), "yyyy-MM-dd"),
        bankAccountId: selectedAccount !== "all" ? selectedAccount : null
      },
      summary: {
        totalEntradas: 125450.75,
        totalSaidas: 89320.50,
        saldoLiquido: 36130.25,
        totalTransactions: 185
      },
      byCategory: {
        entradas: {
          RECEBIMENTO: 95450.75,
          RENDIMENTO: 15000.00,
          TRANSFERENCIA: 15000.00
        },
        saidas: {
          PAGAMENTO: 65320.50,
          TAXA: 12000.00,
          TRANSFERENCIA: 12000.00
        }
      },
      byOrigin: [
        { origin: "CONTA_RECEBER", total: 75450.75, count: 85 },
        { origin: "CONTA_PAGAR", total: 45320.50, count: 65 },
        { origin: "MANUAL", total: 25000.00, count: 35 }
      ],
      byBankAccount: [
        {
          bankAccountId: "1",
          bankAccountName: "Conta Principal",
          bankName: "Banco do Brasil",
          totalEntradas: 85000.00,
          totalSaidas: 55000.00,
          saldoLiquido: 30000.00,
          transactionCount: 120
        }
      ]
    }
  }

  const getMockTransactions = (): CashFlowTransactionsResponse => {
    return {
      data: [
        {
          id: "1",
          valor: 1500.00,
          data: new Date().toISOString(),
          tipo: "ENTRADA",
          categoria: "RECEBIMENTO",
          descricao: "Recebimento - Mensalidade Janeiro 2024",
          numeroDocumento: "REC-12345678",
          origem: "CONTA_RECEBER",
          contaBancariaId: "1",
          createdBy: "SYSTEM",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          transactionType: "ENTRADA",
          displayAmount: "+1500.00",
          contaBancaria: {
            id: "1",
            nome: "Conta Principal",
            banco: "Banco do Brasil"
          }
        }
      ],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      summary: { totalEntradas: 1500.00, totalSaidas: 0 }
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getTransactionTypeIcon = (type: string) => {
    return type === "ENTRADA" ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownLeft className="h-4 w-4 text-red-600" />
    )
  }

  const getTransactionTypeColor = (type: string) => {
    return type === "ENTRADA" ? "text-green-600" : "text-red-600"
  }

  const getCategoryLabel = (categoria: string) => {
    const category = CASH_FLOW_CATEGORIES.find(cat => cat.value === categoria)
    return category ? category.label : categoria
  }

  const getOriginLabel = (origem: string) => {
    const origin = CASH_FLOW_ORIGINS.find(orig => orig.value === origem)
    return origin ? origin.label : origem
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando fluxo de caixa...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas principais */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Entradas</p>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(statistics.summary.totalEntradas)}
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Saídas</p>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(statistics.summary.totalSaidas)}
                  </div>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Saldo Líquido</p>
                  <div className={`text-2xl font-bold ${
                    statistics.summary.saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(statistics.summary.saldoLiquido)}
                  </div>
                </div>
                <DollarSign className={`h-8 w-8 ${
                  statistics.summary.saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Transações</p>
                  <div className="text-2xl font-bold text-blue-600">
                    {statistics.summary.totalTransactions}
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Conta Bancária */}
            <div className="space-y-2">
              <Label>Conta Bancária</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as contas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as contas</SelectItem>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.nome} - {account.banco}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {CASH_FLOW_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Busca */}
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Transações */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Transações do Fluxo de Caixa</CardTitle>
              <CardDescription>
                {pagination.total} transação(ões) encontrada(s)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingTransactions ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando transações...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Conta</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(new Date(transaction.data), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionTypeIcon(transaction.tipo)}
                          <span className={getTransactionTypeColor(transaction.tipo)}>
                            {transaction.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.descricao}</p>
                          <p className="text-sm text-gray-500">{transaction.numeroDocumento}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCategoryLabel(transaction.categoria)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.contaBancaria.nome}</p>
                          <p className="text-sm text-gray-500">{transaction.contaBancaria.banco}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getOriginLabel(transaction.origem)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={getTransactionTypeColor(transaction.tipo)}>
                          {formatCurrency(transaction.valor)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginação */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Mostrando {((currentPage - 1) * pagination.limit) + 1} a{" "}
                    {Math.min(currentPage * pagination.limit, pagination.total)} de{" "}
                    {pagination.total} resultados
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Resumo do período atual */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Período</CardTitle>
            <CardDescription>
              Totais das transações filtradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.totalEntradas)}
                </div>
                <p className="text-sm text-gray-600">Total de Entradas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(summary.totalSaidas)}
                </div>
                <p className="text-sm text-gray-600">Total de Saídas</p>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  (summary.totalEntradas - summary.totalSaidas) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(summary.totalEntradas - summary.totalSaidas)}
                </div>
                <p className="text-sm text-gray-600">Saldo Líquido</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
