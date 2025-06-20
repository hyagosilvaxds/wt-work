"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Download, Trash2, Edit, Eye, FileText } from "lucide-react"
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
import { AddPayableDialog } from "./add-payable-dialog"
import type { DateRange } from "react-day-picker"
import { format, isWithinInterval, parseISO } from "date-fns"

interface AccountsPayablePageProps {
  searchTerm: string
  dateRange: DateRange | undefined
  selectedAccounts: string[]
  selectedPaymentMethods: string[]
  isAddDialogOpen?: boolean
  setIsAddDialogOpen?: (open: boolean) => void
}

export function AccountsPayablePage({
  searchTerm,
  dateRange,
  selectedAccounts,
  selectedPaymentMethods,
  isAddDialogOpen: externalIsAddDialogOpen,
  setIsAddDialogOpen: externalSetIsAddDialogOpen,
}: AccountsPayablePageProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [payablesList, setPayablesList] = useState([
    {
      id: 1,
      value: 2500.0,
      supplier: "Fornecedor de Material Didático",
      isRecurring: false,
      dueDate: "2024-06-15",
      paymentDate: "2024-06-14",
      paymentMethod: "Transferência",
      accountId: "1",
      observation: "Pagamento de material didático para treinamentos",
      status: "Pago",
      attachments: ["nota-fiscal-material.pdf"],
    },
    {
      id: 2,
      value: 1800.0,
      supplier: "Aluguel de Sala",
      isRecurring: true,
      dueDate: "2024-06-10",
      paymentDate: "2024-06-10",
      paymentMethod: "PIX",
      accountId: "1",
      observation: "Aluguel mensal da sala de treinamento",
      status: "Pago",
      attachments: ["recibo-aluguel.pdf"],
    },
    {
      id: 3,
      value: 950.0,
      supplier: "Serviço de Internet",
      isRecurring: true,
      dueDate: "2024-06-20",
      paymentDate: null,
      paymentMethod: null,
      accountId: "2",
      observation: "Mensalidade de internet corporativa",
      status: "Pendente",
      attachments: ["fatura-internet.pdf"],
    },
    {
      id: 4,
      value: 3500.0,
      supplier: "Consultoria Especializada",
      isRecurring: false,
      dueDate: "2024-06-25",
      paymentDate: null,
      paymentMethod: null,
      accountId: "3",
      observation: "Consultoria para desenvolvimento de novo treinamento",
      status: "Pendente",
      attachments: [],
    },
    {
      id: 5,
      value: 1200.0,
      supplier: "Energia Elétrica",
      isRecurring: true,
      dueDate: "2024-06-05",
      paymentDate: null,
      paymentMethod: null,
      accountId: "4",
      observation: "Conta de energia do escritório",
      status: "Atrasado",
      attachments: ["conta-energia.pdf"],
    },
  ])

  // Função para adicionar novo pagável
  const handleAddPayable = (newPayable: any) => {
    setPayablesList(prev => [...prev, newPayable])
  }

  // Aplicar filtros
  const filteredPayables = payablesList.filter((invoice) => {
    // Filtro de busca
    const searchFilter =
      invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.observation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de data
    let dateFilter = true
    if (dateRange?.from && dateRange?.to) {
      const dueDate = parseISO(invoice.dueDate)
      dateFilter = isWithinInterval(dueDate, {
        start: dateRange.from,
        end: dateRange.to,
      })
    }

    // Filtro de conta
    const accountFilter = selectedAccounts.length === 0 || selectedAccounts.includes(invoice.accountId)

    // Filtro de método de pagamento
    const paymentMethodFilter =
      selectedPaymentMethods.length === 0 ||
      (invoice.paymentMethod && selectedPaymentMethods.includes(invoice.paymentMethod))

    return searchFilter && dateFilter && accountFilter && paymentMethodFilter
  })

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setIsViewDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Atrasado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Estatísticas
  const totalPayables = filteredPayables.reduce((sum, invoice) => sum + invoice.value, 0)
  const paidPayables = filteredPayables
    .filter((invoice) => invoice.status === "Pago")
    .reduce((sum, invoice) => sum + invoice.value, 0)
  const pendingPayables = filteredPayables
    .filter((invoice) => invoice.status === "Pendente" || invoice.status === "Atrasado")
    .reduce((sum, invoice) => sum + invoice.value, 0)

  const paymentMethods = ["Transferência", "PIX", "Boleto", "Cartão de Crédito", "Dinheiro", "Cheque"]

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
          <CardTitle>Contas a Pagar</CardTitle>
          <CardDescription>{filteredPayables.length} conta(s) encontrada(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
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
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.supplier}</TableCell>
                  <TableCell>R$ {invoice.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{format(parseISO(invoice.dueDate), "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell>{invoice.isRecurring ? "Sim" : "Não"}</TableCell>
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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Exportar
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
                  <p className="font-medium">{selectedInvoice.supplier}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Valor</Label>
                  <p className="font-medium">
                    R$ {selectedInvoice.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
                    <Badge className={getStatusColor(selectedInvoice.status)}>{selectedInvoice.status}</Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Recorrente</Label>
                  <p className="font-medium">{selectedInvoice.isRecurring ? "Sim" : "Não"}</p>
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
                    {selectedInvoice.accountId === "1"
                      ? "Conta Principal"
                      : selectedInvoice.accountId === "2"
                        ? "Conta Poupança"
                        : selectedInvoice.accountId === "3"
                          ? "Conta Investimentos"
                          : selectedInvoice.accountId === "4"
                            ? "Caixa"
                            : "Cartão Corporativo"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Observação</Label>
                <p className="font-medium">{selectedInvoice.observation}</p>
              </div>

              {selectedInvoice.attachments.length > 0 && (
                <div>
                  <Label className="text-sm text-gray-500">Anexos</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedInvoice.attachments.map((attachment: string, index: number) => (
                      <Button key={index} variant="outline" size="sm" className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {attachment}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Fechar
              </Button>
              <Button className="bg-primary-500 hover:bg-primary-600">
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog para adicionar nova conta a pagar */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Conta a Pagar</DialogTitle>
            <DialogDescription>Preencha os dados da nova conta a pagar.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="supplier">Fornecedor</Label>
                <input
                  id="supplier"
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
                <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                <select
                  id="paymentMethod"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione...</option>
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Pago">Pago</option>
                  <option value="Atrasado">Atrasado</option>
                </select>
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
