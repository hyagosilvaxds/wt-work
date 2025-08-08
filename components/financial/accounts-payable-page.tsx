"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Download, Trash2, Edit, Eye, FileText, CheckCircle, FileDown, Upload } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { AddPayableDialog } from "./add-payable-dialog"
import type { DateRange } from "react-day-picker"
import { format, isWithinInterval, parseISO, differenceInDays } from "date-fns"
import { 
  accountsPayableApi, 
  AccountPayable, 
  ACCOUNT_CATEGORIES, 
  PAYMENT_METHODS, 
  ACCOUNT_STATUS,
  AccountsPayableStatistics,
  bankAccountsApi, 
  BankAccount 
} from "@/lib/api/financial"

interface AccountsPayablePageProps {
  searchTerm: string
  dateRange: DateRange | undefined
  selectedAccounts: string[]
  selectedPaymentMethods: string[]
  isAddDialogOpen?: boolean
  setIsAddDialogOpen?: (open: boolean) => void
  isImportDialogOpen?: boolean
  setIsImportDialogOpen?: (open: boolean) => void
}

export function AccountsPayablePage({
  searchTerm,
  dateRange,
  selectedAccounts,
  selectedPaymentMethods,
  isAddDialogOpen: externalIsAddDialogOpen,
  setIsAddDialogOpen: externalSetIsAddDialogOpen,
  isImportDialogOpen: externalIsImportDialogOpen,
  setIsImportDialogOpen: externalSetIsImportDialogOpen,
}: AccountsPayablePageProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<AccountPayable | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<AccountPayable | null>(null)
  const [selectedPayables, setSelectedPayables] = useState<string[]>([])
  const [payablesList, setPayablesList] = useState<AccountPayable[]>([])
  const [statistics, setStatistics] = useState<AccountsPayableStatistics | null>(null)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [editLoading, setEditLoading] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  // Carregar dados da API
  useEffect(() => {
    loadPayables()
    loadStatistics()
    loadBankAccounts()
  }, [])

  const loadPayables = async () => {
    try {
      setLoading(true)
      const data = await accountsPayableApi.getAll()
      setPayablesList(data)
    } catch (error) {
      console.error('Erro ao carregar contas a pagar:', error)
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as contas a pagar. Usando dados de exemplo.",
        variant: "destructive",
      })
      // Fallback para dados de exemplo
      setPayablesList([])
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const stats = await accountsPayableApi.getStatistics()
      setStatistics(stats)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const loadBankAccounts = async () => {
    try {
      const accounts = await bankAccountsApi.getAll()
      setBankAccounts(accounts)
    } catch (error) {
      console.error('Erro ao carregar contas bancárias:', error)
    }
  }

  // Função para marcar/desmarcar conta a pagar
  const handleSelectPayable = (id: string) => {
    setSelectedPayables(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  // Função para selecionar/deselecionar todos
  const handleSelectAll = () => {
    if (selectedPayables.length === filteredPayables.length) {
      setSelectedPayables([])
    } else {
      setSelectedPayables(filteredPayables.map(item => item.id))
    }
  }

  // Função para quitar contas selecionadas
  const handleSettleSelected = async () => {
    const countToSettle = selectedPayables.filter(id => {
      const item = payablesList.find(p => p.id === id)
      return item && item.status !== "PAGO"
    }).length

    try {
      // Processar pagamentos em lote
      const paymentPromises = selectedPayables
        .map(id => payablesList.find(p => p.id === id))
        .filter(item => item && item.status !== "PAGO")
        .map(item => 
          accountsPayableApi.payment(item!.id, {
            amount: item!.amount - item!.amountPaid,
            paymentMethod: "TRANSFERENCIA",
            paymentDate: new Date().toISOString().split('T')[0]
          })
        )

      await Promise.all(paymentPromises)
      
      // Recarregar lista
      await loadPayables()
      await loadStatistics()
      setSelectedPayables([])
      
      toast({
        title: "Contas quitadas com sucesso!",
        description: `${countToSettle} conta(s) foram marcadas como pagas.`,
        duration: 3000,
      })
    } catch (error) {
      console.error('Erro ao quitar contas:', error)
      toast({
        title: "Erro ao quitar contas",
        description: "Ocorreu um erro ao processar os pagamentos.",
        variant: "destructive",
      })
    }
  }

  // Função para adicionar nova conta a pagar
  const handleAddPayable = async (newPayable: any) => {
    try {
      // Transformar os dados do modal antigo para o formato da API
      const payableData = {
        description: newPayable.description || `Pagamento para ${newPayable.supplier}`,
        amount: typeof newPayable.value === 'number' ? newPayable.value : parseFloat(newPayable.value),
        dueDate: newPayable.dueDate, // Já deve estar em formato YYYY-MM-DD
        supplierName: newPayable.supplier,
        supplierDocument: newPayable.supplierDocument,
        supplierEmail: newPayable.supplierEmail,
        supplierPhone: newPayable.supplierPhone,
        status: newPayable.status === 'pending' ? 'PENDENTE' : newPayable.status?.toUpperCase(),
        category: newPayable.category?.toUpperCase(),
        paymentMethod: newPayable.paymentMethod?.toUpperCase()?.replace(' ', '_'),
        isRecurrent: newPayable.isRecurring || false,
        bankAccountId: newPayable.accountId,
        observations: newPayable.notes || newPayable.observations,
      }

      // Remover propriedades undefined
      Object.keys(payableData).forEach(key => {
        if (payableData[key as keyof typeof payableData] === undefined || payableData[key as keyof typeof payableData] === '') {
          delete payableData[key as keyof typeof payableData]
        }
      })

      await accountsPayableApi.create(payableData)
      
      // Recarregar dados
      await loadPayables()
      await loadStatistics()
      
      toast({
        title: "Sucesso!",
        description: `Conta adicionada com sucesso!`,
      })
    } catch (error) {
      console.error('Erro ao adicionar conta:', error)
      toast({
        title: "Erro ao adicionar conta",
        description: "Ocorreu um erro ao adicionar a conta a pagar.",
        variant: "destructive",
      })
    }
  }

  // 📊 EXCEL - Handlers para importação/exportação
  const handleExportToExcel = async () => {
    try {
      await accountsPayableApi.exportToExcel()
      
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
      await accountsPayableApi.downloadTemplate()
      
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
      
      const result = await accountsPayableApi.importFromExcel(importFile)
      
      // Recarregar dados após importação
      await loadPayables()
      await loadStatistics()
      
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

  // Aplicar filtros
  const filteredPayables = payablesList.filter((invoice) => {
    // Filtro de busca - usar os nomes corretos das propriedades da API
    const searchFilter = !searchTerm || 
      invoice.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.observations && invoice.observations.toLowerCase().includes(searchTerm.toLowerCase())) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de data - verificar se há diferença significativa nos dias para determinar se é filtro padrão
    let dateFilter = true
    if (dateRange?.from && dateRange?.to) {
      const daysDiff = differenceInDays(dateRange.to, dateRange.from)
      // Se a diferença for maior que 400 dias, considerar como filtro padrão (não filtrar)
      if (daysDiff <= 400) {
        const dueDate = parseISO(invoice.dueDate)
        dateFilter = isWithinInterval(dueDate, {
          start: dateRange.from,
          end: dateRange.to,
        })
      }
    }

    // Filtro de conta - usar bankAccountId ao invés de accountId
    const accountFilter = selectedAccounts.length === 0 || 
      (invoice.bankAccountId && selectedAccounts.includes(invoice.bankAccountId))

    // Filtro de método de pagamento
    const paymentMethodFilter =
      selectedPaymentMethods.length === 0 ||
      (invoice.paymentMethod && selectedPaymentMethods.includes(invoice.paymentMethod))

    return searchFilter && dateFilter && accountFilter && paymentMethodFilter
  })

  const handleViewInvoice = (invoice: AccountPayable) => {
    setSelectedInvoice(invoice)
    setIsViewDialogOpen(true)
  }

  const handleEditInvoice = (invoice: AccountPayable) => {
    setEditingInvoice(invoice)
    setIsEditDialogOpen(true)
    setIsViewDialogOpen(false)
  }

  const handleSaveEdit = async (editedData: any) => {
    if (!editingInvoice) return

    // Validações básicas
    if (!editedData.description?.trim()) {
      toast({
        title: "Erro de validação",
        description: "A descrição é obrigatória.",
        variant: "destructive",
      })
      return
    }

    if (!editedData.amount || editedData.amount <= 0) {
      toast({
        title: "Erro de validação",
        description: "O valor deve ser maior que zero.",
        variant: "destructive",
      })
      return
    }

    if (!editedData.dueDate) {
      toast({
        title: "Erro de validação",
        description: "A data de vencimento é obrigatória.",
        variant: "destructive",
      })
      return
    }

    if (!editedData.supplierName?.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome do fornecedor é obrigatório.",
        variant: "destructive",
      })
      return
    }

    try {
      setEditLoading(true)
      await accountsPayableApi.update(editingInvoice.id, editedData)
      
      // Recarregar dados
      await loadPayables()
      await loadStatistics()
      
      setIsEditDialogOpen(false)
      setEditingInvoice(null)
      
      toast({
        title: "Sucesso!",
        description: "Conta a pagar atualizada com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao atualizar conta:', error)
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao atualizar a conta a pagar.",
        variant: "destructive",
      })
    } finally {
      setEditLoading(false)
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
    switch (status) {
      case "PAGO":
        return "Pago"
      case "PENDENTE":
        return "Pendente"
      case "VENCIDO":
        return "Vencido"
      case "CANCELADO":
        return "Cancelado"
      default:
        return status
    }
  }

  // Estatísticas calculadas
  const totalPayables = statistics ? statistics.totalPayable : filteredPayables.reduce((sum, invoice) => sum + invoice.amount, 0)
  const paidPayables = statistics ? statistics.totalPaid : filteredPayables
    .filter((invoice) => invoice.status === "PAGO")
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const pendingPayables = statistics ? statistics.pendingPayable : filteredPayables
    .filter((invoice) => invoice.status === "PENDENTE" || invoice.status === "VENCIDO")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  const paymentMethods = PAYMENT_METHODS.map(method => method.label)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando contas a pagar...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">
              R$ {totalPayables.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-gray-600">Total a Pagar</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              R$ {paidPayables.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-gray-600">Total Pago</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              R$ {pendingPayables.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-gray-600">Pendente de Pagamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Payable Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Contas a Pagar</CardTitle>
              <CardDescription>{filteredPayables.length} conta(s) encontrada(s)</CardDescription>
            </div>
            <div className="flex gap-2 items-center">
              {/* Botões de ação em lote */}
              {selectedPayables.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSettleSelected}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    Quitar {selectedPayables.length} Conta(s)
                  </Button>
                  <Button
                    onClick={() => setSelectedPayables([])}
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
                    checked={selectedPayables.length === filteredPayables.length && filteredPayables.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recorrente</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayables.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedPayables.includes(invoice.id)}
                      onCheckedChange={() => handleSelectPayable(invoice.id)}
                      disabled={invoice.status === "PAGO"}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.supplierName}</TableCell>
                  <TableCell>R$ {invoice.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{format(parseISO(invoice.dueDate), "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>{getStatusLabel(invoice.status)}</Badge>
                  </TableCell>
                  <TableCell>{invoice.isRecurrent ? "Sim" : "Não"}</TableCell>
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
              <DialogTitle>Detalhes da Conta a Pagar</DialogTitle>
              <DialogDescription>Informações detalhadas sobre a conta a pagar.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Fornecedor</Label>
                  <p className="font-medium">{selectedInvoice.supplierName}</p>
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
                  <p className="font-medium">{selectedInvoice.isRecurrent ? "Sim" : "Não"}</p>
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
                    {selectedInvoice.bankAccount?.nome || "Não especificada"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Descrição</Label>
                <p className="font-medium">{selectedInvoice.description}</p>
              </div>

              {selectedInvoice.observations && (
                <div>
                  <Label className="text-sm text-gray-500">Observação</Label>
                  <p className="font-medium">{selectedInvoice.observations}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Fechar
              </Button>
              <Button 
                className="bg-primary-500 hover:bg-primary-600"
                onClick={() => handleEditInvoice(selectedInvoice)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Edição */}
      {editingInvoice && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Conta a Pagar</DialogTitle>
              <DialogDescription>Edite as informações da conta a pagar.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              
              // Garantir que os dados estão no formato correto para a API
              const editedData = {
                description: formData.get('description') as string,
                amount: parseFloat(formData.get('amount') as string),
                dueDate: formData.get('dueDate') as string, // Formato YYYY-MM-DD
                supplierName: formData.get('supplierName') as string,
                supplierDocument: (formData.get('supplierDocument') as string) || undefined,
                supplierEmail: (formData.get('supplierEmail') as string) || undefined,
                supplierPhone: (formData.get('supplierPhone') as string) || undefined,
                status: formData.get('status') as string,
                category: (formData.get('category') as string) || undefined,
                paymentMethod: (formData.get('paymentMethod') as string) || undefined,
                isRecurrent: formData.get('isRecurrent') === 'on',
                bankAccountId: (formData.get('bankAccountId') as string) || undefined,
                observations: (formData.get('observations') as string) || undefined,
              }

              // Remover propriedades undefined para não enviar valores vazios
              Object.keys(editedData).forEach(key => {
                if (editedData[key as keyof typeof editedData] === undefined || editedData[key as keyof typeof editedData] === '') {
                  delete editedData[key as keyof typeof editedData]
                }
              })

              handleSaveEdit(editedData)
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Descrição *</Label>
                    <Input
                      id="edit-description"
                      name="description"
                      defaultValue={editingInvoice.description}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-amount">Valor *</Label>
                    <Input
                      id="edit-amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      defaultValue={editingInvoice.amount}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-supplierName">Fornecedor *</Label>
                    <Input
                      id="edit-supplierName"
                      name="supplierName"
                      defaultValue={editingInvoice.supplierName}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-supplierDocument">CPF/CNPJ</Label>
                    <Input
                      id="edit-supplierDocument"
                      name="supplierDocument"
                      defaultValue={editingInvoice.supplierDocument || ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-supplierEmail">E-mail do Fornecedor</Label>
                    <Input
                      id="edit-supplierEmail"
                      name="supplierEmail"
                      type="email"
                      defaultValue={editingInvoice.supplierEmail || ''}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-supplierPhone">Telefone do Fornecedor</Label>
                    <Input
                      id="edit-supplierPhone"
                      name="supplierPhone"
                      defaultValue={editingInvoice.supplierPhone || ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-dueDate">Data de Vencimento *</Label>
                    <Input
                      id="edit-dueDate"
                      name="dueDate"
                      type="date"
                      defaultValue={editingInvoice.dueDate}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select name="status" defaultValue={editingInvoice.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCOUNT_STATUS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Categoria</Label>
                    <Select name="category" defaultValue={editingInvoice.category || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCOUNT_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-paymentMethod">Método de Pagamento</Label>
                    <Select name="paymentMethod" defaultValue={editingInvoice.paymentMethod || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um método" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-bankAccountId">Conta Bancária</Label>
                    <Select name="bankAccountId" defaultValue={editingInvoice.bankAccountId || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma conta bancária" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma conta selecionada</SelectItem>
                        {bankAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.nome} - {account.banco}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox 
                      id="edit-isRecurrent" 
                      name="isRecurrent"
                      defaultChecked={editingInvoice.isRecurrent}
                    />
                    <Label htmlFor="edit-isRecurrent">Conta Recorrente</Label>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-observations">Observações</Label>
                  <Textarea
                    id="edit-observations"
                    name="observations"
                    defaultValue={editingInvoice.observations || ''}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={editLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog para importar Excel */}
      <Dialog open={externalIsImportDialogOpen ?? isImportDialogOpen} onOpenChange={externalSetIsImportDialogOpen ?? setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Importar Contas a Pagar</DialogTitle>
            <DialogDescription>
              Selecione um arquivo Excel (.xlsx ou .xls) para importar contas a pagar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="excel-file">Arquivo Excel</Label>
              <input
                id="excel-file"
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

      {/* Modal de Adicionar Conta a Pagar */}
      <AddPayableDialog
        isOpen={externalIsAddDialogOpen ?? isAddDialogOpen}
        onClose={() => {
          if (externalSetIsAddDialogOpen) {
            externalSetIsAddDialogOpen(false)
          } else {
            setIsAddDialogOpen(false)
          }
        }}
        onSave={handleAddPayable}
      />
    </div>
  )
}
