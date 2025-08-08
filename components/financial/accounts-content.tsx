"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Download, Trash2, Edit, FileSpreadsheet, Building2, CreditCard, PiggyBank, Loader2, Upload, FileDown, FileUp } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { bankAccountsApi, type BankAccount, type CreateBankAccountData, type UpdateBankAccountData } from "@/lib/api/financial"
import type { DateRange } from "react-day-picker"

interface AccountsContentProps {
  isAddAccountDialogOpen: boolean
  setIsAddAccountDialogOpen: (open: boolean) => void
  isImportDialogOpen: boolean
  setIsImportDialogOpen: (open: boolean) => void
  searchTerm: string
  dateRange: DateRange | undefined
  selectedAccounts: string[]
  selectedPaymentMethods: string[]
}

interface BankStatistics {
  totalAccounts: number
  totalBalance: number
  accountsWithPositiveBalance: number
  accountsWithNegativeBalance: number
  accountsWithZeroBalance: number
  mainAccount: BankAccount | null
  distributionByType: Array<{
    type: string
    count: number
    totalBalance: number
  }>
  distributionByBank: Array<{
    bank: string
    count: number
    totalBalance: number
  }>
}

interface AccountsContentProps {
  isAddAccountDialogOpen: boolean
  setIsAddAccountDialogOpen: (open: boolean) => void
  isImportDialogOpen: boolean
  setIsImportDialogOpen: (open: boolean) => void
  searchTerm: string
  dateRange: DateRange | undefined
  selectedAccounts: string[]
  selectedPaymentMethods: string[]
}

export function AccountsContent({
  isAddAccountDialogOpen,
  setIsAddAccountDialogOpen,
  isImportDialogOpen,
  setIsImportDialogOpen,
  searchTerm,
  dateRange,
  selectedAccounts,
  selectedPaymentMethods,
}: AccountsContentProps) {
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [statistics, setStatistics] = useState<BankStatistics | null>(null)
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newAccount, setNewAccount] = useState<CreateBankAccountData>({
    nome: "",
    banco: "",
    codigoBanco: "",
    agencia: "",
    numero: "",
    digitoVerificador: "",
    tipoConta: "CORRENTE",
    saldo: 0,
    isActive: true,
    isMain: false,
    observations: "",
  })
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  // Dados mock para fallback
  const getMockAccountsData = () => {
    return [
      {
        id: "1",
        nome: "Conta Principal",
        banco: "Banco do Brasil",
        codigoBanco: "001",
        agencia: "1234",
        numero: "56789",
        digitoVerificador: "0",
        tipoConta: "CORRENTE" as const,
        saldo: 10000,
        isActive: true,
        isMain: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "2",
        nome: "Conta Poupança",
        banco: "Itaú",
        codigoBanco: "341",
        agencia: "5678",
        numero: "12345",
        digitoVerificador: "6",
        tipoConta: "POUPANCA" as const,
        saldo: 5000,
        isActive: true,
        isMain: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }

  const loadAccountsData = async () => {
    try {
      setLoading(true)
      const [accountsResponse, statisticsResponse] = await Promise.all([
        bankAccountsApi.getAll({ search: searchTerm }).catch(() => getMockAccountsData()),
        bankAccountsApi.getStatistics().catch(() => ({
          totalAccounts: 2,
          totalBalance: 15000,
          accountsWithPositiveBalance: 2,
          accountsWithNegativeBalance: 0,
          accountsWithZeroBalance: 0,
          mainAccount: getMockAccountsData()[0],
          distributionByType: [
            { type: "CORRENTE", count: 1, totalBalance: 10000 },
            { type: "POUPANCA", count: 1, totalBalance: 5000 }
          ]
        })),
      ])

      // Verificar se accountsResponse é um array ou um objeto com dados
      const accountsData = Array.isArray(accountsResponse) 
        ? accountsResponse 
        : accountsResponse?.data || accountsResponse?.items || getMockAccountsData()

      setAccounts(accountsData)
      setStatistics(statisticsResponse)
    } catch (error: any) {
      console.error('Erro ao carregar contas:', error)
      // Use dados mock como fallback
      setAccounts(getMockAccountsData())
      
      toast({
        title: "Modo Offline",
        description: "Usando dados de exemplo (API não disponível)",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccountsData()
  }, [searchTerm])

  const handleAddAccount = async () => {
    try {
      if (!newAccount.nome || !newAccount.banco || !newAccount.agencia || !newAccount.numero) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive"
        })
        return
      }

      await bankAccountsApi.create(newAccount)
      
      toast({
        title: "Sucesso",
        description: "Conta bancária criada com sucesso",
      })
      
      setNewAccount({
        nome: "",
        banco: "",
        codigoBanco: "",
        agencia: "",
        numero: "",
        digitoVerificador: "",
        tipoConta: "CORRENTE",
        saldo: 0,
        isActive: true,
        isMain: false,
        observations: "",
      })
      setIsAddAccountDialogOpen(false)
      loadAccountsData()
    } catch (error: any) {
      console.error('Erro ao criar conta:', error)
      toast({
        title: "Erro",
        description: "Erro ao criar conta bancária",
        variant: "destructive"
      })
    }
  }

  const handleEditAccount = async () => {
    if (!editingAccount) return

    try {
      const updateData: UpdateBankAccountData = {
        nome: editingAccount.nome,
        banco: editingAccount.banco,
        agencia: editingAccount.agencia,
        numero: editingAccount.numero,
        tipoConta: editingAccount.tipoConta,
        isActive: editingAccount.isActive,
        isMain: editingAccount.isMain,
        observations: editingAccount.observations,
      }

      await bankAccountsApi.update(editingAccount.id, updateData)
      
      toast({
        title: "Sucesso",
        description: "Conta bancária atualizada com sucesso",
      })
      
      setIsEditDialogOpen(false)
      setEditingAccount(null)
      loadAccountsData()
    } catch (error: any) {
      console.error('Erro ao atualizar conta:', error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar conta bancária",
        variant: "destructive"
      })
    }
  }

  const handleDeleteAccount = async (id: string) => {
    try {
      await bankAccountsApi.delete(id)
      
      toast({
        title: "Sucesso",
        description: "Conta bancária excluída com sucesso",
      })
      
      loadAccountsData()
    } catch (error: any) {
      console.error('Erro ao excluir conta:', error)
      toast({
        title: "Erro",
        description: "Erro ao excluir conta bancária",
        variant: "destructive"
      })
    }
  }

  // Funções de Excel
  const handleExportToExcel = async () => {
    try {
      setIsExporting(true)
      
      const params = {
        search: searchTerm || undefined,
        activeOnly: true // Exportar apenas contas ativas por padrão
      }
      
      await bankAccountsApi.exportToExcel(params)
      
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Erro",
          description: "Tipo de arquivo não suportado. Use apenas arquivos Excel (.xlsx, .xls) ou CSV (.csv)",
          variant: "destructive"
        })
        return
      }
      
      setSelectedFile(file)
    }
  }

  const handleImportFromExcel = async () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo para importar",
        variant: "destructive"
      })
      return
    }

    try {
      setIsImporting(true)
      
      const result = await bankAccountsApi.importFromExcel(selectedFile)
      
      // Verificar se a importação foi bem-sucedida
      if (result.success) {
        toast({
          title: "Sucesso",
          description: `${result.summary?.imported || 0} contas importadas com sucesso${result.summary?.duplicates ? `. ${result.summary.duplicates} duplicatas encontradas` : ''}${result.summary?.errors?.length ? `. ${result.summary.errors.length} erro(s) encontrado(s)` : ''}`,
        })
        
        if (result.summary?.errors?.length > 0) {
          console.warn('Erros na importação:', result.summary.errors)
          // Mostrar os primeiros erros em um toast adicional
          const firstErrors = result.summary.errors.slice(0, 3).join(', ')
          toast({
            title: "Avisos da Importação",
            description: `Erros encontrados: ${firstErrors}${result.summary.errors.length > 3 ? '...' : ''}`,
            variant: "destructive"
          })
        }
      } else {
        throw new Error(result.message || 'Erro na importação')
      }
      
      setSelectedFile(null)
      setIsImportDialogOpen(false)
      loadAccountsData()
    } catch (error: any) {
      console.error('Erro ao importar:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao importar arquivo",
        variant: "destructive"
      })
    } finally {
      setIsImporting(false)
    }
  }

  const openEditDialog = (account: BankAccount) => {
    setEditingAccount({ ...account })
    setIsEditDialogOpen(true)
  }

  const filteredAccounts = accounts.filter(
    (account) =>
      account.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.banco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.tipoConta.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'CORRENTE':
        return <Building2 className="h-4 w-4" />
      case 'POUPANCA':
        return <PiggyBank className="h-4 w-4" />
      case 'INVESTIMENTO':
        return <CreditCard className="h-4 w-4" />
      default:
        return <Building2 className="h-4 w-4" />
    }
  }

  const getAccountTypeName = (type: string) => {
    switch (type) {
      case 'CORRENTE':
        return 'Conta Corrente'
      case 'POUPANCA':
        return 'Poupança'
      case 'INVESTIMENTO':
        return 'Investimento'
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Carregando contas bancárias...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{statistics?.totalAccounts || 0}</div>
            <p className="text-sm text-gray-600">Total de Contas</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              R$ {(statistics?.totalBalance || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-gray-600">Saldo Total</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {statistics?.accountsWithPositiveBalance || 0}/{statistics?.totalAccounts || 0}
            </div>
            <p className="text-sm text-gray-600">Contas com Saldo Positivo</p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas</CardTitle>
          <CardDescription>{filteredAccounts.length} conta(s) encontrada(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Agência/Conta</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getAccountTypeIcon(account.tipoConta)}
                      {account.nome}
                      {account.isMain && (
                        <Badge variant="secondary" className="text-xs">Principal</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{account.banco}</TableCell>
                  <TableCell>{account.agencia} / {account.numero}</TableCell>
                  <TableCell>{getAccountTypeName(account.tipoConta)}</TableCell>
                  <TableCell className={account.saldo >= 0 ? "text-green-600" : "text-red-600"}>
                    R$ {account.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={account.isActive ? "default" : "secondary"}>
                      {account.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(account)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteAccount(account.id)}
                        >
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

      {/* Dialog para adicionar nova conta */}
      <Dialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Conta Bancária</DialogTitle>
            <DialogDescription>Preencha os dados da nova conta bancária.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome da Conta *</Label>
                <Input
                  id="nome"
                  value={newAccount.nome}
                  onChange={(e) => setNewAccount({ ...newAccount, nome: e.target.value })}
                  placeholder="Ex: Conta Principal"
                />
              </div>
              <div>
                <Label htmlFor="banco">Banco *</Label>
                <Input
                  id="banco"
                  value={newAccount.banco}
                  onChange={(e) => setNewAccount({ ...newAccount, banco: e.target.value })}
                  placeholder="Ex: Banco do Brasil"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="agencia">Agência *</Label>
                <Input
                  id="agencia"
                  value={newAccount.agencia}
                  onChange={(e) => setNewAccount({ ...newAccount, agencia: e.target.value })}
                  placeholder="1234-5"
                />
              </div>
              <div>
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  value={newAccount.numero}
                  onChange={(e) => setNewAccount({ ...newAccount, numero: e.target.value })}
                  placeholder="12345-6"
                />
              </div>
              <div>
                <Label htmlFor="tipoConta">Tipo *</Label>
                <Select 
                  value={newAccount.tipoConta} 
                  onValueChange={(value: 'CORRENTE' | 'POUPANCA' | 'INVESTIMENTO') => 
                    setNewAccount({ ...newAccount, tipoConta: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CORRENTE">Conta Corrente</SelectItem>
                    <SelectItem value="POUPANCA">Poupança</SelectItem>
                    <SelectItem value="INVESTIMENTO">Investimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="saldo">Saldo Inicial</Label>
                <Input
                  id="saldo"
                  type="number"
                  step="0.01"
                  value={newAccount.saldo}
                  onChange={(e) => setNewAccount({ ...newAccount, saldo: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="codigoBanco">Código do Banco</Label>
                <Input
                  id="codigoBanco"
                  value={newAccount.codigoBanco}
                  onChange={(e) => setNewAccount({ ...newAccount, codigoBanco: e.target.value })}
                  placeholder="001"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={newAccount.observations}
                onChange={(e) => setNewAccount({ ...newAccount, observations: e.target.value })}
                placeholder="Observações sobre a conta..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAccountDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddAccount}>
              Salvar Conta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar conta */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Conta Bancária</DialogTitle>
            <DialogDescription>Altere os dados da conta bancária.</DialogDescription>
          </DialogHeader>
          {editingAccount && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-nome">Nome da Conta</Label>
                  <Input
                    id="edit-nome"
                    value={editingAccount.nome}
                    onChange={(e) => setEditingAccount({ ...editingAccount, nome: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-banco">Banco</Label>
                  <Input
                    id="edit-banco"
                    value={editingAccount.banco}
                    onChange={(e) => setEditingAccount({ ...editingAccount, banco: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-agencia">Agência</Label>
                  <Input
                    id="edit-agencia"
                    value={editingAccount.agencia}
                    onChange={(e) => setEditingAccount({ ...editingAccount, agencia: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-numero">Número</Label>
                  <Input
                    id="edit-numero"
                    value={editingAccount.numero}
                    onChange={(e) => setEditingAccount({ ...editingAccount, numero: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tipoConta">Tipo</Label>
                  <Select 
                    value={editingAccount.tipoConta} 
                    onValueChange={(value: 'CORRENTE' | 'POUPANCA' | 'INVESTIMENTO') => 
                      setEditingAccount({ ...editingAccount, tipoConta: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CORRENTE">Conta Corrente</SelectItem>
                      <SelectItem value="POUPANCA">Poupança</SelectItem>
                      <SelectItem value="INVESTIMENTO">Investimento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-observations">Observações</Label>
                <Textarea
                  id="edit-observations"
                  value={editingAccount.observations || ""}
                  onChange={(e) => setEditingAccount({ ...editingAccount, observations: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={editingAccount.isActive}
                  onChange={(e) => setEditingAccount({ ...editingAccount, isActive: e.target.checked })}
                />
                <Label htmlFor="edit-isActive">Conta ativa</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditAccount}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para importar planilha */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Importar Contas Bancárias</DialogTitle>
            <DialogDescription>
              Importe contas bancárias através de um arquivo Excel (.xlsx, .xls) ou CSV (.csv)
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Área de upload de arquivo */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors relative">
              <FileSpreadsheet className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              {selectedFile ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="mt-2"
                  >
                    Remover arquivo
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-2">
                    Arraste e solte um arquivo ou clique para selecionar
                  </p>
                  <p className="text-xs text-gray-500">
                    Suporta arquivos .xlsx, .xls e .csv (máx. 10MB)
                  </p>
                </>
              )}
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileSelect}
              />
            </div>

            {/* Informações sobre o formato */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Formato do arquivo:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>Nome da Conta</strong> (obrigatório)</li>
                <li>• <strong>Banco</strong> (obrigatório)</li>
                <li>• <strong>Código do Banco</strong> (opcional)</li>
                <li>• <strong>Agência</strong> (obrigatório)</li>
                <li>• <strong>Número da Conta</strong> (obrigatório)</li>
                <li>• <strong>Dígito Verificador</strong> (opcional)</li>
                <li>• <strong>Tipo da Conta</strong> (CORRENTE, POUPANCA, INVESTIMENTO)</li>
                <li>• <strong>Saldo Inicial</strong> (numérico, opcional)</li>
                <li>• <strong>Ativa</strong> (true/false, opcional)</li>
                <li>• <strong>Principal</strong> (true/false, opcional)</li>
                <li>• <strong>Observações</strong> (opcional)</li>
              </ul>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleDownloadTemplate}
                  className="text-xs p-0 h-auto"
                >
                  <FileDown className="mr-1 h-3 w-3" />
                  Baixar modelo de planilha
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsImportDialogOpen(false)
                setSelectedFile(null)
              }}
              disabled={isImporting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleImportFromExcel}
              disabled={!selectedFile || isImporting}
              className="bg-primary-500 hover:bg-primary-600"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" />
                  Importar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
