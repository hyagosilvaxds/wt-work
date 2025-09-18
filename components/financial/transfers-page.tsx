"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftRight, Plus, Search, Loader2, Calendar, Eye, Building2, Hash, DollarSign } from "lucide-react"
import { bankAccountsApi, type TransferItem, type BankAccount, type TransferBetweenAccountsDto, type TransfersListResponse } from "@/lib/api/financial"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface TransfersPageProps {
  searchTerm?: string
  isAddDialogOpen?: boolean
  setIsAddDialogOpen?: (open: boolean) => void
}

export function TransfersPage({ 
  searchTerm = "", 
  isAddDialogOpen = false, 
  setIsAddDialogOpen = () => {} 
}: TransfersPageProps) {
  const { toast } = useToast()
  
  // Estados para listagem
  const [transfers, setTransfers] = useState<TransferItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const limit = 10

  // Estados para modal
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [accountsLoading, setAccountsLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  
  // Estados do formulário
  const [fromAccountId, setFromAccountId] = useState("")
  const [toAccountId, setToAccountId] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  // Estados para visualização de detalhes
  const [selectedTransfer, setSelectedTransfer] = useState<TransferItem | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  // Carregar transferências
  const loadTransfers = async () => {
    try {
      setLoading(true)
      const response = await bankAccountsApi.listTransfers({
        page,
        limit,
        // Se houver accountId no searchTerm, usar como filtro
        ...(searchTerm && searchTerm.length > 10 ? { accountId: searchTerm } : {})
      })
      
      // DEBUG: log do retorno da API de listagem de transferências
      console.log('[TransfersPage] listTransfers response:', response)
      
      // Verificar se a resposta é um array direto ou um objeto com propriedade 'data'
      if (Array.isArray(response)) {
        // A API retorna array direto
        setTransfers(response)
        setTotalPages(1) // Como não há paginação, assumir 1 página
        setTotal(response.length)
      } else {
        // A API retorna objeto com estrutura padrão
        setTransfers(response.data || [])
        setTotalPages(response.pagination?.totalPages || 0)
        setTotal(response.pagination?.total || 0)
      }
    } catch (error: any) {
      console.error('Erro ao carregar transferências:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar transferências",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Carregar contas bancárias para o modal
  const loadAccounts = async () => {
    try {
      setAccountsLoading(true)
      const response = await bankAccountsApi.getAll({ limit: 100 })
      setAccounts(response || [])
    } catch (error: any) {
      console.error('Erro ao carregar contas:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar contas bancárias",
        variant: "destructive"
      })
    } finally {
      setAccountsLoading(false)
    }
  }

  // Submeter nova transferência
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fromAccountId || !toAccountId || !amount) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    const transferData: TransferBetweenAccountsDto = {
      fromAccountId,
      toAccountId,
      amount: parseFloat(amount),
      description: description || undefined
    }

    try {
      setCreateLoading(true)
      await bankAccountsApi.transferBetweenAccounts(transferData)
      
      toast({
        title: "Sucesso",
        description: "Transferência realizada com sucesso",
      })
      
      // Limpar formulário
      setFromAccountId("")
      setToAccountId("")
      setAmount("")
      setDescription("")
      setIsAddDialogOpen(false)
      
      // Recarregar lista
      await loadTransfers()
    } catch (error: any) {
      console.error('Erro ao criar transferência:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao realizar transferência",
        variant: "destructive"
      })
    } finally {
      setCreateLoading(false)
    }
  }

  // Ver detalhes da transferência
  const handleViewDetails = async (transfer: TransferItem) => {
    try {
      const details: TransferItem = await bankAccountsApi.getTransferById(transfer.id)
      setSelectedTransfer(details)
      setDetailsDialogOpen(true)
    } catch (error: any) {
      console.error('Erro ao carregar detalhes:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar detalhes da transferência",
        variant: "destructive"
      })
    }
  }

  // Filtrar transferências por busca
  const filteredTransfers = transfers.filter(transfer => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      transfer.id.toLowerCase().includes(search) ||
      transfer.description?.toLowerCase().includes(search) ||
      transfer.fromAccount?.nome?.toLowerCase().includes(search) ||
      transfer.toAccount?.nome?.toLowerCase().includes(search) ||
      transfer.amount.toString().includes(search)
    )
  })

  // Formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR })
  }

  useEffect(() => {
    loadTransfers()
  }, [page])

  useEffect(() => {
    if (isAddDialogOpen && accounts.length === 0) {
      loadAccounts()
    }
  }, [isAddDialogOpen])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transferências entre Contas</h2>
          <p className="text-gray-600">
            Gerencie transferências de valores entre suas contas bancárias
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Transferências</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">transferências realizadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(transfers.reduce((sum, t) => sum + t.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">valor total transferido</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transferências Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transfers.filter(t => {
                const today = new Date().toDateString()
                const transferDate = new Date(t.createdAt).toDateString()
                return today === transferDate
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">transferências de hoje</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Transferências */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Transferências</CardTitle>
          <CardDescription>
            Histórico de todas as transferências realizadas entre suas contas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando transferências...</span>
            </div>
          ) : filteredTransfers.length === 0 ? (
            <div className="text-center py-8">
              <ArrowLeftRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma transferência encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Nenhuma transferência corresponde aos filtros." : "Você ainda não realizou transferências."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>De</TableHead>
                    <TableHead>Para</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatDate(transfer.createdAt)}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            ID: {transfer.id.slice(0, 8)}...
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {transfer.fromAccount?.nome || 'Conta não informada'}
                          </span>
                          {transfer.fromAccount?.banco && (
                            <span className="text-xs text-gray-500">
                              {transfer.fromAccount.banco}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {transfer.toAccount?.nome || 'Conta não informada'}
                          </span>
                          {transfer.toAccount?.banco && (
                            <span className="text-xs text-gray-500">
                              {transfer.toAccount.banco}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-blue-600">
                          {formatCurrency(transfer.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">
                          {transfer.description || "Sem descrição"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(transfer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">
                        Página {page} de {totalPages}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Nova Transferência */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nova Transferência</DialogTitle>
            <DialogDescription>
              Transfira valores entre suas contas bancárias
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromAccount">Conta de Origem *</Label>
                <Select
                  value={fromAccountId}
                  onValueChange={setFromAccountId}
                  disabled={accountsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conta de origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts
                      .filter(acc => acc.isActive && acc.id !== toAccountId)
                      .map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex flex-col">
                            <span>{account.nome}</span>
                            <span className="text-xs text-gray-500">
                              {account.banco} - Saldo: {formatCurrency(account.saldo)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="toAccount">Conta de Destino *</Label>
                <Select
                  value={toAccountId}
                  onValueChange={setToAccountId}
                  disabled={accountsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conta de destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts
                      .filter(acc => acc.isActive && acc.id !== fromAccountId)
                      .map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex flex-col">
                            <span>{account.nome}</span>
                            <span className="text-xs text-gray-500">
                              {account.banco} - Saldo: {formatCurrency(account.saldo)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Valor da Transferência *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Descrição da transferência..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={createLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createLoading || !fromAccountId || !toAccountId || !amount}
              >
                {createLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Transferindo...
                  </>
                ) : (
                  <>
                    <ArrowLeftRight className="mr-2 h-4 w-4" />
                    Transferir
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Transferência</DialogTitle>
            <DialogDescription>
              Informações completas da transferência
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransfer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">ID da Transferência</Label>
                  <p className="font-mono text-sm">{selectedTransfer.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Data/Hora</Label>
                  <p>{formatDate(selectedTransfer.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Valor</Label>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(selectedTransfer.amount)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Conta de Origem</Label>
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <p className="font-medium">{selectedTransfer.fromAccount?.nome}</p>
                    {selectedTransfer.fromAccount?.banco && (
                      <p className="text-sm text-gray-600">{selectedTransfer.fromAccount.banco}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Conta de Destino</Label>
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <p className="font-medium">{selectedTransfer.toAccount?.nome}</p>
                    {selectedTransfer.toAccount?.banco && (
                      <p className="text-sm text-gray-600">{selectedTransfer.toAccount.banco}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedTransfer.description && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Descrição</Label>
                  <p className="text-gray-700">{selectedTransfer.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
