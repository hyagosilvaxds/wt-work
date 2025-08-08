"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Download, Trash2, Edit, Eye, FileText, CheckCircle, Loader2, FileDown, Upload } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { AddReceivableDialog } from "./add-receivable-dialog"
import { accountsReceivableApi, type AccountReceivable, type ReceivableStatistics, PAYMENT_METHODS, STATUS_OPTIONS, RECEIVABLE_CATEGORIES } from "@/lib/api/financial"
import type { DateRange } from "react-day-picker"
import { format, isWithinInterval, parseISO } from "date-fns"

interface AccountsReceivablePageProps {
  searchTerm: string
  dateRange: DateRange | undefined
  selectedAccounts: string[]
  selectedPaymentMethods: string[]
  isAddDialogOpen?: boolean
  setIsAddDialogOpen?: (open: boolean) => void
  isImportDialogOpen?: boolean
  setIsImportDialogOpen?: (open: boolean) => void
}

export function AccountsReceivablePage({
  searchTerm,
  dateRange,
  selectedAccounts,
  selectedPaymentMethods,
  isAddDialogOpen: externalIsAddDialogOpen,
  setIsAddDialogOpen: externalSetIsAddDialogOpen,
  isImportDialogOpen: externalIsImportDialogOpen,
  setIsImportDialogOpen: externalSetIsImportDialogOpen,
}: AccountsReceivablePageProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<AccountReceivable | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<AccountReceivable | null>(null)
  const [selectedReceivables, setSelectedReceivables] = useState<string[]>([])
  const [receivablesList, setReceivablesList] = useState<AccountReceivable[]>([])
  const [statistics, setStatistics] = useState<ReceivableStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [settling, setSettling] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  // Carregar dados da API
  useEffect(() => {
    loadReceivablesData()
  }, [])

  // Dados mock para fallback
  const getMockData = () => {
    return [
      {
        id: "1",
        description: "Curso de Excel Avançado",
        amount: 1500.0,
        amountPaid: 1500.0,
        dueDate: "2024-12-15",
        paymentDate: "2024-12-14",
        status: "PAGO" as const,
        category: "OUTROS" as const,
        customerName: "Empresa ABC Ltda",
        customerDocument: "12.345.678/0001-90",
        customerEmail: "contato@empresaabc.com",
        observations: "Pagamento referente ao treinamento de Excel Avançado",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bankAccount: {
          id: "1",
          nome: "Conta Principal",
          banco: "Banco do Brasil"
        }
      },
      {
        id: "2", 
        description: "Treinamento de Segurança do Trabalho",
        amount: 2800.0,
        amountPaid: 0,
        dueDate: "2024-12-20",
        status: "PENDENTE" as const,
        category: "SERVICOS" as const,
        customerName: "XYZ Indústria S.A.",
        customerDocument: "98.765.432/0001-10",
        customerEmail: "rh@xyzindustria.com",
        observations: "Treinamento para 10 funcionários",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bankAccount: {
          id: "2",
          nome: "Conta Poupança",
          banco: "Itaú"
        }
      }
    ]
  }

  const loadReceivablesData = async () => {
    try {
      setLoading(true)
      
      const [receivablesResponse, statisticsResponse] = await Promise.all([
        accountsReceivableApi.getAll().catch((error) => {
          console.log('⚠️ API de contas a receber falhou, usando dados mock:', error.message)
          return getMockData()
        }),
        accountsReceivableApi.getStatistics().catch((error) => {
          console.log('⚠️ API de estatísticas falhou, usando dados mock:', error.message)
          return ({
            totalReceivable: 4300,
            totalReceived: 1500,
            pendingReceivable: 2800,
            overdueAmount: 0,
            overdueCount: 0,
            totalAccounts: 2,
            receivablesByCategory: [],
            receivablesByPaymentMethod: [],
            receivablesByBankAccount: []
          })
        })
      ])
      
      // Verificar se receivablesResponse é um array ou um objeto com dados
      const receivablesData = Array.isArray(receivablesResponse) 
        ? receivablesResponse 
        : receivablesResponse?.data || receivablesResponse?.items || getMockData()
      
      setReceivablesList(receivablesData)
      setStatistics(statisticsResponse)
      
      console.log('✅ Contas a receber carregadas:', receivablesData.length, 'itens')
    } catch (error) {
      console.error("❌ Erro ao carregar contas a receber:", error)
      // Use dados mock como fallback
      const mockData = getMockData()
      console.log('🔄 Usando dados mock como fallback:', mockData.length, 'itens')
      setReceivablesList(mockData)
      setStatistics({
        totalReceivable: 4300,
        totalReceived: 1500,
        pendingReceivable: 2800,
        overdueAmount: 0,
        overdueCount: 0,
        totalAccounts: 2,
        receivablesByCategory: [],
        receivablesByPaymentMethod: [],
        receivablesByBankAccount: []
      })
      
      toast({
        title: "Modo Offline",
        description: "Usando dados de exemplo (API não disponível)",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para marcar/desmarcar recebível
  const handleSelectReceivable = (id: string) => {
    setSelectedReceivables(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  // Função para selecionar/deselecionar todos
  const handleSelectAll = () => {
    if (selectedReceivables.length === filteredReceivables.length) {
      setSelectedReceivables([])
    } else {
      setSelectedReceivables(filteredReceivables.map(item => item.id))
    }
  }

  // Função para quitar contas selecionadas
  const handleSettleSelected = async () => {
    if (selectedReceivables.length === 0) return
    
    try {
      setSettling(true)
      
      // Processar cada conta selecionada
      for (const id of selectedReceivables) {
        const receivable = receivablesList.find(r => r.id === id)
        if (receivable && receivable.status !== "PAGO") {
          await accountsReceivableApi.receivePayment(id, {
            amount: receivable.amount,
            paymentMethod: "TRANSFERENCIA",
            paymentDate: new Date().toISOString().split('T')[0],
            bankAccountId: receivable.bankAccount?.id || "",
            observations: "Pagamento quitado em lote"
          })
        }
      }
      
      // Recarregar dados
      await loadReceivablesData()
      setSelectedReceivables([])
      
      toast({
        title: "Contas quitadas com sucesso!",
        description: `${selectedReceivables.length} conta(s) foram marcadas como pagas.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Erro ao quitar contas:", error)
      toast({
        title: "Erro",
        description: "Erro ao quitar contas selecionadas",
        variant: "destructive",
      })
    } finally {
      setSettling(false)
    }
  }

  // Aplicar filtros - garantir que receivablesList seja sempre um array
  const filteredReceivables = (Array.isArray(receivablesList) ? receivablesList : []).filter((invoice) => {
    // Filtro de busca - só aplicar se houver termo de busca
    const searchFilter = !searchTerm || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.observations && invoice.observations.toLowerCase().includes(searchTerm.toLowerCase())) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.customerDocument && invoice.customerDocument.toLowerCase().includes(searchTerm.toLowerCase())) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de data - só aplicar se houver intervalo de datas EXPLICITAMENTE selecionado pelo usuário
    let dateFilter = true
    if (dateRange?.from && dateRange?.to) {
      // Verificar se é um filtro padrão (muito amplo) ou um filtro específico do usuário
      const rangeSpanDays = Math.abs(dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
      
      // Se o range for muito amplo (mais de 400 dias), consideramos como "sem filtro"
      if (rangeSpanDays > 400) {
        dateFilter = true
      } else {
        const dueDate = parseISO(invoice.dueDate)
        dateFilter = isWithinInterval(dueDate, {
          start: dateRange.from,
          end: dateRange.to,
        })
      }
    }

    // Filtro de conta bancária - só aplicar se houver contas selecionadas
    const accountFilter = selectedAccounts.length === 0 || 
      (invoice.bankAccount?.id && selectedAccounts.includes(invoice.bankAccount.id)) ||
      (invoice.bankAccountId && selectedAccounts.includes(invoice.bankAccountId))

    // Filtro de método de pagamento - só aplicar se houver métodos selecionados
    const paymentMethodFilter = selectedPaymentMethods.length === 0 ||
      (invoice.paymentMethod && selectedPaymentMethods.includes(invoice.paymentMethod))

    return searchFilter && dateFilter && accountFilter && paymentMethodFilter
  })

  const handleViewInvoice = (invoice: AccountReceivable) => {
    setSelectedInvoice(invoice)
    setIsViewDialogOpen(true)
  }

  const handleEditInvoice = (invoice: AccountReceivable) => {
    setEditingInvoice(invoice)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async (formData: any) => {
    if (!editingInvoice) return

    try {
      setEditLoading(true)

      const updateData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: formData.status,
        category: formData.category,
        customerName: formData.customerName,
        customerDocument: formData.customerDocument,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        observations: formData.observations,
        bankAccountId: formData.bankAccountId,
        installmentNumber: formData.installmentNumber ? parseInt(formData.installmentNumber) : 1,
        totalInstallments: formData.totalInstallments ? parseInt(formData.totalInstallments) : 1,
      }

      await accountsReceivableApi.update(editingInvoice.id, updateData)
      
      // Recarregar dados
      await loadReceivablesData()
      
      setIsEditDialogOpen(false)
      setEditingInvoice(null)
      
      toast({
        title: "Conta atualizada com sucesso!",
        description: "As informações da conta a receber foram atualizadas.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Erro ao atualizar conta:", error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar a conta a receber",
        variant: "destructive",
      })
    } finally {
      setEditLoading(false)
    }
  }

  // Função para adicionar novo recebível
  const handleAddReceivable = async (newReceivable: any) => {
    await loadReceivablesData() // Recarregar dados após adicionar
  }

  // 📊 EXCEL - Handlers para importação/exportação
  const handleExportToExcel = async () => {
    try {
      await accountsReceivableApi.exportToExcel()
      
      toast({
        title: "Sucesso!",
        description: "Dados exportados para Excel com sucesso!",
        duration: 3000,
      })
    } catch (error) {
      console.error("Erro ao exportar Excel:", error)
      toast({
        title: "Erro",
        description: "Erro ao exportar dados para Excel",
        variant: "destructive",
      })
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      await accountsReceivableApi.downloadTemplate()
      
      toast({
        title: "Sucesso!",
        description: "Template baixado com sucesso!",
        duration: 3000,
      })
    } catch (error) {
      console.error("Erro ao baixar template:", error)
      toast({
        title: "Erro",
        description: "Erro ao baixar template Excel",
        variant: "destructive",
      })
    }
  }

  const handleImportFromExcel = async () => {
    if (!importFile) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo para importar",
        variant: "destructive",
      })
      return
    }

    try {
      setImporting(true)
      
      const result = await accountsReceivableApi.importFromExcel(importFile)
      
      // Recarregar dados após importação
      await loadReceivablesData()
      
      if (externalSetIsImportDialogOpen) {
        externalSetIsImportDialogOpen(false)
      } else {
        setIsImportDialogOpen(false)
      }
      setImportFile(null)
      
      toast({
        title: "Sucesso!",
        description: `Importação concluída: ${result.summary?.imported || 0} registros importados`,
        duration: 5000,
      })
    } catch (error) {
      console.error("Erro ao importar Excel:", error)
      toast({
        title: "Erro",
        description: "Erro ao importar arquivo Excel",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAGO":
        return "bg-green-100 text-green-800"
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800"
      case "VENCIDO":
        return "bg-red-100 text-red-800"
      case "CANCELADO":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(option => option.value === status)
    return statusOption ? statusOption.label : status
  }

  // Cálculos para os cards (usar dados das estatísticas da API quando disponíveis)
  const totalReceivables = statistics?.totalReceivable || filteredReceivables.reduce((sum, invoice) => sum + invoice.amount, 0)
  const paidReceivables = statistics?.totalReceived || filteredReceivables
    .filter((invoice) => invoice.status === "PAGO")
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const pendingReceivables = statistics?.pendingReceivable || filteredReceivables
    .filter((invoice) => invoice.status === "PENDENTE" || invoice.status === "VENCIDO")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  const paymentMethods = PAYMENT_METHODS.map(method => method.label)

  return (
    <div className="space-y-6">
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando contas a receber...</span>
        </div>
      )}

      {!loading && (
        <>
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">
                  R$ {totalReceivables.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-gray-600">Total a Receber</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  R$ {paidReceivables.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-gray-600">Total Recebido</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-orange-600">
                  R$ {pendingReceivables.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-gray-600">Pendente de Recebimento</p>
              </CardContent>
            </Card>
          </div>

      {/* Accounts Receivable Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Contas a Receber</CardTitle>
              <CardDescription>{filteredReceivables.length} conta(s) encontrada(s)</CardDescription>
            </div>
            <div className="flex gap-2 items-center">
              {/* Botões de ação em lote */}
              {selectedReceivables.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSettleSelected}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    Quitar {selectedReceivables.length} Conta(s)
                  </Button>
                  <Button
                    onClick={() => setSelectedReceivables([])}
                    variant="outline"
                    size="sm"
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={selectedReceivables.length === filteredReceivables.length && filteredReceivables.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recorrente</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceivables.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedReceivables.includes(invoice.id)}
                      onCheckedChange={() => handleSelectReceivable(invoice.id)}
                      disabled={invoice.status === "PAGO"}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>R$ {invoice.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{format(parseISO(invoice.dueDate), "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>{getStatusLabel(invoice.status)}</Badge>
                  </TableCell>
                  <TableCell>{invoice.totalInstallments ? "Sim" : "Não"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para visualizar conta */}
      {selectedInvoice && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalhes da Conta a Receber</DialogTitle>
              <DialogDescription>Informações detalhadas sobre a conta a receber.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Cliente</Label>
                  <p className="font-medium">{selectedInvoice.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Valor</Label>
                  <p className="font-medium">
                    R$ {selectedInvoice.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Data de Vencimento</Label>
                  <p className="font-medium">{format(parseISO(selectedInvoice.dueDate), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Data de Pagamento</Label>
                  <p className="font-medium">
                    {selectedInvoice.paymentDate ? format(parseISO(selectedInvoice.paymentDate), "dd/MM/yyyy") : "-"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Status</Label>
                  <p>
                    <Badge className={getStatusColor(selectedInvoice.status)}>{getStatusLabel(selectedInvoice.status)}</Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Recorrente</Label>
                  <p className="font-medium">{selectedInvoice.totalInstallments ? "Sim" : "Não"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Método de Pagamento</Label>
                  <p className="font-medium">{selectedInvoice.paymentMethod || "-"}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Conta</Label>
                  <p className="font-medium">
                    {selectedInvoice.bankAccount?.nome || "Não informado"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Observação</Label>
                <p className="font-medium">{selectedInvoice.observations || "Sem observações"}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Fechar
              </Button>
              <Button 
                className="bg-primary-500 hover:bg-primary-600"
                onClick={() => {
                  setIsViewDialogOpen(false)
                  if (selectedInvoice) {
                    handleEditInvoice(selectedInvoice)
                  }
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog para editar conta a receber */}
      {editingInvoice && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Conta a Receber</DialogTitle>
              <DialogDescription>Atualize as informações da conta a receber.</DialogDescription>
            </DialogHeader>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const data = Object.fromEntries(formData.entries())
                handleSaveEdit(data)
              }}
              className="grid gap-4 py-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Descrição</Label>
                  <input
                    id="edit-description"
                    name="description"
                    defaultValue={editingInvoice.description}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-amount">Valor</Label>
                  <input
                    id="edit-amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    defaultValue={editingInvoice.amount}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-customerName">Cliente</Label>
                  <input
                    id="edit-customerName"
                    name="customerName"
                    defaultValue={editingInvoice.customerName}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-customerDocument">Documento</Label>
                  <input
                    id="edit-customerDocument"
                    name="customerDocument"
                    defaultValue={editingInvoice.customerDocument}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-customerEmail">Email</Label>
                  <input
                    id="edit-customerEmail"
                    name="customerEmail"
                    type="email"
                    defaultValue={editingInvoice.customerEmail || ''}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-customerPhone">Telefone</Label>
                  <input
                    id="edit-customerPhone"
                    name="customerPhone"
                    defaultValue={editingInvoice.customerPhone || ''}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-dueDate">Data de Vencimento</Label>
                  <input
                    id="edit-dueDate"
                    name="dueDate"
                    type="date"
                    defaultValue={editingInvoice.dueDate.split('T')[0]}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    name="status"
                    defaultValue={editingInvoice.status}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Categoria</Label>
                  <select
                    id="edit-category"
                    name="category"
                    defaultValue={editingInvoice.category}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {RECEIVABLE_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-bankAccountId">Conta Bancária</Label>
                  <select
                    id="edit-bankAccountId"
                    name="bankAccountId"
                    defaultValue={editingInvoice.bankAccountId || ''}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selecione uma conta...</option>
                    <option value="cme20bqrz0000vbmx4fkszseb">Conta 1 - BB</option>
                    <option value="2">Conta Poupança - Itaú</option>
                    <option value="3">Conta Investimentos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-installmentNumber">Parcela Nº</Label>
                  <input
                    id="edit-installmentNumber"
                    name="installmentNumber"
                    type="number"
                    min="1"
                    defaultValue={editingInvoice.installmentNumber || 1}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-totalInstallments">Total de Parcelas</Label>
                  <input
                    id="edit-totalInstallments"
                    name="totalInstallments"
                    type="number"
                    min="1"
                    defaultValue={editingInvoice.totalInstallments || 1}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-observations">Observações</Label>
                <Textarea 
                  id="edit-observations" 
                  name="observations"
                  defaultValue={editingInvoice.observations || ''}
                  className="min-h-[80px]"
                />
              </div>

              <DialogFooter className="gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={editLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary-500 hover:bg-primary-600"
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog para adicionar nova conta a receber */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Conta a Receber</DialogTitle>
            <DialogDescription>Preencha os dados da nova conta a receber.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="client">Cliente</Label>
                <input
                  id="client"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Valor</Label>
                <input
                  id="value"
                  type="number"
                  step="0.01"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Data de Vencimento</Label>
                <div className="flex">
                  <input
                    id="dueDate"
                    type="date"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account">Conta</Label>
                <select
                  id="account"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="1">Conta Principal</option>
                  <option value="2">Conta Poupança</option>
                  <option value="3">Conta Investimentos</option>
                  <option value="4">Caixa</option>
                  <option value="5">Cartão Corporativo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {RECEIVABLE_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <input
                  id="description"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Ex: Curso de Excel Avançado"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customerDocument">Documento do Cliente</Label>
                <input
                  id="customerDocument"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="CPF ou CNPJ"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customerEmail">Email do Cliente</Label>
                <input
                  id="customerEmail"
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="contato@empresa.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                <select
                  id="paymentMethod"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione...</option>
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                {/* Campo removido - status será definido automaticamente como PENDENTE */}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="isRecurring" />
              <Label htmlFor="isRecurring">Conta Recorrente</Label>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observation">Observação</Label>
              <Textarea id="observation" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="attachments">Anexos</Label>
              <input
                id="attachments"
                type="file"
                multiple
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-primary-500 hover:bg-primary-600">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para importar Excel */}
      <Dialog open={externalIsImportDialogOpen ?? isImportDialogOpen} onOpenChange={externalSetIsImportDialogOpen ?? setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Importar Contas a Receber</DialogTitle>
            <DialogDescription>
              Selecione um arquivo Excel (.xlsx ou .xls) para importar contas a receber.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="excel-file-receivable">Arquivo Excel</Label>
              <input
                id="excel-file-receivable"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setImportFile(file)
                  }
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {importFile && (
                <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: {importFile.name}
                </p>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <p>💡 <strong>Dica:</strong> Baixe o template para ver o formato correto dos dados.</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                if (externalSetIsImportDialogOpen) {
                  externalSetIsImportDialogOpen(false)
                } else {
                  setIsImportDialogOpen(false)
                }
                setImportFile(null)
              }}
              disabled={importing}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleImportFromExcel}
              disabled={!importFile || importing}
              className="gap-2"
            >
              {importing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Importar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar Conta a Receber */}
      <AddReceivableDialog
        isOpen={externalIsAddDialogOpen ?? isAddDialogOpen}
        onClose={() => {
          if (externalSetIsAddDialogOpen) {
            externalSetIsAddDialogOpen(false)
          } else {
            setIsAddDialogOpen(false)
          }
        }}
        onSave={handleAddReceivable}
      />
        </>
      )}
    </div>
  )
}
