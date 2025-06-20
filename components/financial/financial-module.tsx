"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Upload, Calendar, ChevronDown, X, RefreshCw } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AccountsContent } from "./accounts-content"
import { AccountsReceivablePage } from "./accounts-receivable-page"
import { AccountsPayablePage } from "./accounts-payable-page"
import { CashFlowPage } from "./cash-flow-page"
import { FinancialDashboardContent } from "./dashboard/financial-dashboard-content"
import { FinancialReports } from "./reports/financial-reports"
import { DatePickerWithRange } from "../ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function FinancialModule() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false)
  const [isAddReceivableDialogOpen, setIsAddReceivableDialogOpen] = useState(false)
  const [isAddPayableDialogOpen, setIsAddPayableDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Dados de exemplo para contas e métodos de pagamento
  const accounts = [
    { id: "1", name: "Conta Principal" },
    { id: "2", name: "Conta Poupança" },
    { id: "3", name: "Conta Investimentos" },
    { id: "4", name: "Caixa" },
    { id: "5", name: "Cartão Corporativo" },
  ]

  const paymentMethods = [
    { id: "1", name: "Transferência" },
    { id: "2", name: "PIX" },
    { id: "3", name: "Boleto" },
    { id: "4", name: "Cartão de Crédito" },
    { id: "5", name: "Dinheiro" },
    { id: "6", name: "Cheque" },
  ]

  const handleAccountCheckboxChange = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId],
    )
  }

  const handlePaymentMethodCheckboxChange = (methodId: string) => {
    setSelectedPaymentMethods((prev) =>
      prev.includes(methodId) ? prev.filter((id) => id !== methodId) : [...prev, methodId],
    )
  }

  const clearFilters = () => {
    setSelectedAccounts([])
    setSelectedPaymentMethods([])
    setDateRange({
      from: new Date(2024, 0, 1),
      to: new Date(),
    })
  }

  const getActionButton = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Button variant="outline" onClick={() => {}}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar Dados
          </Button>
        )
      case "accounts":
        return (
          <Button className="bg-primary-500 hover:bg-primary-600" onClick={() => setIsAddAccountDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Conta
          </Button>
        )
      case "receivable":
        return (
          <Button className="bg-primary-500 hover:bg-primary-600" onClick={() => setIsAddReceivableDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Conta a Receber
          </Button>
        )
      case "payable":
        return (
          <Button className="bg-primary-500 hover:bg-primary-600" onClick={() => setIsAddPayableDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Conta a Pagar
          </Button>
        )
      case "cash-flow":
        return (
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => {}}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        )
      case "reports":
        return (
          <Button variant="outline" onClick={() => {}}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar Relatórios
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600">Gerencie contas, receitas, despesas e análises financeiras</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          {getActionButton()}
        </div>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro de Data */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal w-[240px]">
                  <Calendar className="mr-2 h-4 w-4" />
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
                    <span>Selecione um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              </PopoverContent>
            </Popover>

            {/* Filtros Avançados */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                  {(selectedAccounts.length > 0 || selectedPaymentMethods.length > 0) && (
                    <span className="ml-2 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {selectedAccounts.length + selectedPaymentMethods.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[350px] p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Contas</h4>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {accounts.map((account) => (
                        <div key={account.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`account-${account.id}`}
                            checked={selectedAccounts.includes(account.id)}
                            onCheckedChange={() => handleAccountCheckboxChange(account.id)}
                          />
                          <Label htmlFor={`account-${account.id}`}>{account.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Formas de Pagamento</h4>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`method-${method.id}`}
                            checked={selectedPaymentMethods.includes(method.id)}
                            onCheckedChange={() => handlePaymentMethodCheckboxChange(method.id)}
                          />
                          <Label htmlFor={`method-${method.id}`}>{method.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <X className="mr-2 h-3 w-3" />
                      Limpar Filtros
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary-500 hover:bg-primary-600"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Aplicar Filtros
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      <Tabs defaultValue="dashboard" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full max-w-4xl mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="accounts">Contas</TabsTrigger>
          <TabsTrigger value="receivable">Contas a Receber</TabsTrigger>
          <TabsTrigger value="payable">Contas a Pagar</TabsTrigger>
          <TabsTrigger value="cash-flow">Fluxo de Caixa</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <FinancialDashboardContent
            dateRange={dateRange}
            selectedAccounts={selectedAccounts}
            selectedPaymentMethods={selectedPaymentMethods}
            searchTerm={searchTerm}
          />
        </TabsContent>

        <TabsContent value="accounts">
          <AccountsContent
            isAddAccountDialogOpen={isAddAccountDialogOpen}
            setIsAddAccountDialogOpen={setIsAddAccountDialogOpen}
            isImportDialogOpen={isImportDialogOpen}
            setIsImportDialogOpen={setIsImportDialogOpen}
            searchTerm={searchTerm}
            dateRange={dateRange}
            selectedAccounts={selectedAccounts}
            selectedPaymentMethods={selectedPaymentMethods}
          />
        </TabsContent>

        <TabsContent value="receivable">
          <AccountsReceivablePage
            searchTerm={searchTerm}
            dateRange={dateRange}
            selectedAccounts={selectedAccounts}
            selectedPaymentMethods={selectedPaymentMethods}
            isAddDialogOpen={isAddReceivableDialogOpen}
            setIsAddDialogOpen={setIsAddReceivableDialogOpen}
          />
        </TabsContent>

        <TabsContent value="payable">
          <AccountsPayablePage
            searchTerm={searchTerm}
            dateRange={dateRange}
            selectedAccounts={selectedAccounts}
            selectedPaymentMethods={selectedPaymentMethods}
            isAddDialogOpen={isAddPayableDialogOpen}
            setIsAddDialogOpen={setIsAddPayableDialogOpen}
          />
        </TabsContent>

        <TabsContent value="cash-flow">
          <CashFlowPage />
        </TabsContent>

        <TabsContent value="reports">
          <FinancialReports
            dateRange={dateRange}
            selectedAccounts={selectedAccounts}
            selectedPaymentMethods={selectedPaymentMethods}
            searchTerm={searchTerm}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
