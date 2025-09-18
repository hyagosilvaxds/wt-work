"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Upload, Calendar, RefreshCw, Download, FileDown, ArrowLeftRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AccountsContent } from "./accounts-content"
import { AccountsReceivablePage } from "./accounts-receivable-page"
import { AccountsPayablePage } from "./accounts-payable-page"
import { CashFlowPage } from "./cash-flow-page"
import { TransfersPage } from "./transfers-page"
import { FinancialDashboardContent } from "./dashboard/financial-dashboard-content"
import { FinancialReports } from "./reports/financial-reports"
import { DateRangePicker } from "../ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { bankAccountsApi, accountsReceivableApi, accountsPayableApi } from "@/lib/api/financial"
import { toast } from "@/hooks/use-toast"

export function FinancialModule() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false)
  const [isAddReceivableDialogOpen, setIsAddReceivableDialogOpen] = useState(false)
  const [isAddPayableDialogOpen, setIsAddPayableDialogOpen] = useState(false)
  const [isAddTransferDialogOpen, setIsAddTransferDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isImportReceivableDialogOpen, setIsImportReceivableDialogOpen] = useState(false)
  const [isImportPayableDialogOpen, setIsImportPayableDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  })
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
  const [isExporting, setIsExporting] = useState(false)

  // Funções para os botões de Excel
  const handleExportToExcel = async () => {
    try {
      setIsExporting(true)
      await bankAccountsApi.exportToExcel({ activeOnly: true })
      toast({
        title: "Sucesso",
        description: "Contas bancárias exportadas com sucesso",
      })
    } catch (error: any) {
      console.error('Erro ao exportar:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao exportar contas bancárias",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      await bankAccountsApi.downloadTemplate()
      toast({
        title: "Sucesso",
        description: "Template baixado com sucesso",
      })
    } catch (error: any) {
      console.error('Erro ao baixar template:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao baixar template",
        variant: "destructive"
      })
    }
  }

  // Handlers para Contas a Receber
  const handleExportReceivablesToExcel = async () => {
    try {
      setIsExporting(true)
      await accountsReceivableApi.exportToExcel()
      toast({
        title: "Sucesso",
        description: "Contas a receber exportadas com sucesso",
      })
    } catch (error: any) {
      console.error('Erro ao exportar contas a receber:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao exportar contas a receber",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadReceivableTemplate = async () => {
    try {
      await accountsReceivableApi.downloadTemplate()
      toast({
        title: "Sucesso",
        description: "Template de contas a receber baixado com sucesso",
      })
    } catch (error: any) {
      console.error('Erro ao baixar template de contas a receber:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao baixar template de contas a receber",
        variant: "destructive"
      })
    }
  }

  // Handlers para Contas a Pagar
  const handleExportPayablesToExcel = async () => {
    try {
      setIsExporting(true)
      await accountsPayableApi.exportToExcel()
      toast({
        title: "Sucesso",
        description: "Contas a pagar exportadas com sucesso",
      })
    } catch (error: any) {
      console.error('Erro ao exportar contas a pagar:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao exportar contas a pagar",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadPayableTemplate = async () => {
    try {
      await accountsPayableApi.downloadTemplate()
      toast({
        title: "Sucesso",
        description: "Template de contas a pagar baixado com sucesso",
      })
    } catch (error: any) {
      console.error('Erro ao baixar template de contas a pagar:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao baixar template de contas a pagar",
        variant: "destructive"
      })
    }
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
          <>
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Template
            </Button>
            <Button
              variant="outline"
              onClick={handleExportToExcel}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Excel
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Importar Excel
            </Button>
            <Button className="bg-primary-500 hover:bg-primary-600" onClick={() => setIsAddAccountDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta
            </Button>
          </>
        )
      case "receivable":
        return (
          <>
            <Button
              variant="outline"
              onClick={handleDownloadReceivableTemplate}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Template
            </Button>
            <Button
              variant="outline"
              onClick={handleExportReceivablesToExcel}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Excel
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsImportReceivableDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Importar Excel
            </Button>
            <Button className="bg-primary-500 hover:bg-primary-600" onClick={() => setIsAddReceivableDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta a Receber
            </Button>
          </>
        )
      case "payable":
        return (
          <>
            <Button
              variant="outline"
              onClick={handleDownloadPayableTemplate}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Template
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPayablesToExcel}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Excel
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsImportPayableDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Importar Excel
            </Button>
            <Button className="bg-primary-500 hover:bg-primary-600" onClick={() => setIsAddPayableDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta a Pagar
            </Button>
          </>
        )
      case "transfers":
        return (
          <>
            <Button className="bg-primary-500 hover:bg-primary-600" onClick={() => setIsAddTransferDialogOpen(true)}>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Nova Transferência
            </Button>
          </>
        )
      case "cash-flow":
        return null // Botão já existe na própria página
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
                <DateRangePicker 
                  date={dateRange} 
                  onDateChange={setDateRange}
                  placeholder="Selecionar período"
                  showPresets={true}
                  align="start"
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      <Tabs defaultValue="dashboard" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 w-full max-w-5xl mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="accounts">Contas</TabsTrigger>
          <TabsTrigger value="receivable">Contas a Receber</TabsTrigger>
          <TabsTrigger value="payable">Contas a Pagar</TabsTrigger>
          <TabsTrigger value="transfers">Transferências</TabsTrigger>
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
            isImportDialogOpen={isImportReceivableDialogOpen}
            setIsImportDialogOpen={setIsImportReceivableDialogOpen}
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
            isImportDialogOpen={isImportPayableDialogOpen}
            setIsImportDialogOpen={setIsImportPayableDialogOpen}
          />
        </TabsContent>

        <TabsContent value="transfers">
          <TransfersPage
            searchTerm={searchTerm}
            isAddDialogOpen={isAddTransferDialogOpen}
            setIsAddDialogOpen={setIsAddTransferDialogOpen}
          />
        </TabsContent>

        <TabsContent value="cash-flow">
          <CashFlowPage
            searchTerm={searchTerm}
            dateRange={dateRange}
            selectedAccounts={selectedAccounts}
            selectedPaymentMethods={selectedPaymentMethods}
          />
        </TabsContent>

        <TabsContent value="reports">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}