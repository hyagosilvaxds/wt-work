"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { MonthlyComparisonChart } from "./monthly-comparison-chart"
import { AccountsReceivableChart } from "./accounts-receivable-chart"
import { PaymentMethodDistributionChart } from "./payment-method-distribution-chart"
import { 
  dashboardApi,
  type DashboardSummary,
  type YearlyFlowData,
  type PaymentMethodsYearlyData,
  type ReceivablesTimelineData,
  type PayablesTimelineData,
  type MonthlyCashFlowData
} from "@/lib/api/financial"
import { useToast } from "@/hooks/use-toast"
import { Loader2, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface FinancialDashboardContentProps {
  dateRange: DateRange | undefined
  selectedAccounts: string[]
  selectedPaymentMethods: string[]
  searchTerm: string
}

interface DashboardData {
  summary: DashboardSummary | null
  yearlyFlow: YearlyFlowData | null
  paymentMethods: PaymentMethodsYearlyData | null
  receivablesTimeline: ReceivablesTimelineData | null
  payablesTimeline: PayablesTimelineData | null
  monthlyCashFlow: MonthlyCashFlowData | null
}

export function FinancialDashboardContent({
  dateRange,
  selectedAccounts,
  selectedPaymentMethods,
  searchTerm,
}: FinancialDashboardContentProps) {
  const [dashboardTab, setDashboardTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    summary: null,
    yearlyFlow: null,
    paymentMethods: null,
    receivablesTimeline: null,
    payablesTimeline: null,
    monthlyCashFlow: null,
  })
  const { toast } = useToast()

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const currentYear = new Date().getFullYear()
      
      // Carregar dados em paralelo usando a nova API do dashboard
      const [
        summaryResponse,
        yearlyFlowResponse,
        paymentMethodsResponse,
        receivablesTimelineResponse,
        payablesTimelineResponse,
        monthlyCashFlowResponse
      ] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getYearlyFlow(currentYear),
        dashboardApi.getPaymentMethodsYearly(currentYear),
        dashboardApi.getReceivablesTimeline(currentYear),
        dashboardApi.getPayablesTimeline(currentYear),
        dashboardApi.getMonthlyCashFlow(currentYear),
      ])

      setDashboardData({
        summary: summaryResponse,
        yearlyFlow: yearlyFlowResponse,
        paymentMethods: paymentMethodsResponse,
        receivablesTimeline: receivablesTimelineResponse,
        payablesTimeline: payablesTimelineResponse,
        monthlyCashFlow: monthlyCashFlowResponse,
      })

    } catch (error: any) {
      console.error('Erro ao carregar dados do dashboard:', error)
      toast({
        title: "Modo Offline",
        description: "Usando dados de exemplo (API não disponível)",
        variant: "destructive",
      })
      
      // Usar dados mock em caso de erro
      setDashboardData({
        summary: {
          bankAccountsBalance: {
            total: 50000.00,
            accounts: [
              {
                id: "1",
                nome: "Conta Principal",
                banco: "Banco do Brasil",
                saldo: 35000.00
              },
              {
                id: "2",
                nome: "Conta Poupança",
                banco: "Caixa Econômica",
                saldo: 15000.00
              }
            ]
          },
          accountsReceivable: {
            total: 25000.00,
            pending: 20000.00,
            overdue: 5000.00
          },
          accountsPayable: {
            total: 15000.00,
            pending: 12000.00,
            overdue: 3000.00
          },
          monthlyFlow: {
            currentMonth: {
              received: 18000.00,
              paid: 12000.00,
              balance: 6000.00
            }
          }
        },
        yearlyFlow: {
          year: 2024,
          months: Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            monthName: format(new Date(2024, i), 'MMMM', { locale: ptBR }),
            valueToReceive: 8000 + Math.random() * 2000,
            valueReceived: 7500 + Math.random() * 1500,
            valueToPay: 5000 + Math.random() * 1000,
            valuePaid: 4800 + Math.random() * 800,
            netFlow: 2700 + Math.random() * 1000,
          })),
          totals: {
            valueToReceive: 96000,
            valueReceived: 90000,
            totalReceivables: 96000,
            valueToPay: 60000,
            valuePaid: 57600,
            totalPayables: 60000,
            annualNetFlow: 32400,
          }
        },
        paymentMethods: null,
        receivablesTimeline: null,
        payablesTimeline: null,
        monthlyCashFlow: null,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [dateRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dashboard financeiro...</span>
      </div>
    )
  }

  // Preparar dados para os gráficos
  const prepareMonthlyData = () => {
    if (!dashboardData.yearlyFlow) return []
    
    return dashboardData.yearlyFlow.months.map(month => ({
      month: month.monthName,
      received: month.valueReceived,
      paid: month.valuePaid,
      toReceive: month.valueToReceive,
      toPay: month.valueToPay,
      balance: month.netFlow,
    }))
  }

  const preparePaymentMethodsData = () => {
    if (!dashboardData.paymentMethods) return { received: [], paid: [] }
    
    const received = Object.entries(dashboardData.paymentMethods.receivedByPaymentMethod).map(([method, value]) => ({
      method,
      value: Number(value),
    }))
    
    const paid = Object.entries(dashboardData.paymentMethods.paidByPaymentMethod).map(([method, value]) => ({
      method,
      value: Number(value),
    }))
    
    return { received, paid }
  }

  const monthlyData = prepareMonthlyData()
  const paymentMethodsData = preparePaymentMethodsData()

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Saldo em Contas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo em Contas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {dashboardData.summary?.bankAccountsBalance.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.summary?.bankAccountsBalance.accounts.length || 0} conta(s) bancária(s)
            </p>
          </CardContent>
        </Card>

        {/* Valor a Receber */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor a Receber</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {dashboardData.summary?.accountsReceivable.pending.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.summary?.accountsReceivable.overdue ? 
                `R$ ${dashboardData.summary.accountsReceivable.overdue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em atraso` : 
                "Nenhum valor em atraso"
              }
            </p>
          </CardContent>
        </Card>

        {/* Valor a Pagar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor a Pagar</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {dashboardData.summary?.accountsPayable.pending.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.summary?.accountsPayable.overdue ? 
                `R$ ${dashboardData.summary.accountsPayable.overdue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em atraso` : 
                "Nenhum valor em atraso"
              }
            </p>
          </CardContent>
        </Card>

        {/* Fluxo Mensal */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fluxo do Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R$ {dashboardData.summary?.monthlyFlow.currentMonth.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Recebido: R$ {dashboardData.summary?.monthlyFlow.currentMonth.received.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) || "0,00"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Análises */}
      <Tabs value={dashboardTab} onValueChange={setDashboardTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="monthly">Análise Mensal</TabsTrigger>
          <TabsTrigger value="receivables">Contas a Receber</TabsTrigger>
          <TabsTrigger value="payables">Contas a Pagar</TabsTrigger>
          <TabsTrigger value="methods">Métodos de Pagamento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {monthlyData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Comparação Mensal</CardTitle>
                <CardDescription>Receitas e despesas por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyComparisonChart data={monthlyData} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          {monthlyData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Análise Detalhada Mensal</CardTitle>
                <CardDescription>Breakdown completo de receitas e despesas</CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyComparisonChart data={monthlyData} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="receivables" className="space-y-4">
          {dashboardData.receivablesTimeline && (
            <Card>
              <CardHeader>
                <CardTitle>Timeline de Contas a Receber</CardTitle>
                <CardDescription>Evolução das contas a receber ao longo do ano</CardDescription>
              </CardHeader>
              <CardContent>
                <AccountsReceivableChart 
                  data={dashboardData.receivablesTimeline.months.map(month => ({
                    month: month.monthName,
                    received: month.totalReceived,
                    paid: 0,
                    toReceive: month.totalToReceive,
                    toPay: 0,
                    balance: month.totalReceived - month.totalToReceive,
                  }))} 
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="payables" className="space-y-4">
          {dashboardData.payablesTimeline && (
            <Card>
              <CardHeader>
                <CardTitle>Timeline de Contas a Pagar</CardTitle>
                <CardDescription>Evolução das contas a pagar ao longo do ano</CardDescription>
              </CardHeader>
              <CardContent>
                <AccountsReceivableChart 
                  data={dashboardData.payablesTimeline.months.map(month => ({
                    month: month.monthName,
                    received: 0,
                    paid: month.totalPaid,
                    toReceive: 0,
                    toPay: month.totalToPay,
                    balance: month.totalPaid - month.totalToPay,
                  }))} 
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          {paymentMethodsData.received.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Valores Recebidos por Método</CardTitle>
                  <CardDescription>Distribuição dos recebimentos por método de pagamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentMethodDistributionChart data={paymentMethodsData.received} type="received" />
                </CardContent>
              </Card>
              
              {paymentMethodsData.paid.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Valores Pagos por Método</CardTitle>
                    <CardDescription>Distribuição dos pagamentos por método</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PaymentMethodDistributionChart data={paymentMethodsData.paid} type="paid" />
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Contas Bancárias */}
      {dashboardData.summary?.bankAccountsBalance.accounts.length && (
        <Card>
          <CardHeader>
            <CardTitle>Contas Bancárias</CardTitle>
            <CardDescription>Saldo atual de todas as contas bancárias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.summary.bankAccountsBalance.accounts.map((account) => (
                <div key={account.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{account.nome}</h4>
                  <p className="text-sm text-muted-foreground">{account.banco}</p>
                  <p className="text-lg font-semibold text-green-600">
                    R$ {account.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
