"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Download, Trash2, Edit, FileSpreadsheet } from "lucide-react"
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
  const [newAccountName, setNewAccountName] = useState("")

  // Dados de exemplo para contas
  const accounts = [
    { id: 1, name: "Conta Principal", type: "Corrente", balance: 25000.0 },
    { id: 2, name: "Conta Poupança", type: "Poupança", balance: 50000.0 },
    { id: 3, name: "Conta Investimentos", type: "Investimento", balance: 100000.0 },
    { id: 4, name: "Caixa", type: "Dinheiro", balance: 2500.0 },
    { id: 5, name: "Cartão Corporativo", type: "Cartão de Crédito", balance: -5000.0 },
  ]

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddAccount = () => {
    // Aqui seria implementada a lógica para adicionar uma nova conta
    console.log("Nova conta:", newAccountName)
    setNewAccountName("")
    setIsAddAccountDialogOpen(false)
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Aqui seria implementada a lógica para importar o arquivo
    const file = e.target.files?.[0]
    if (file) {
      console.log("Arquivo selecionado:", file.name)
      // Processamento do arquivo...
      setIsImportDialogOpen(false)
    }
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="space-y-6">
      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{accounts.length}</div>
            <p className="text-sm text-gray-600">Total de Contas</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-gray-600">Saldo Total</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {accounts.filter((a) => a.balance > 0).length}/{accounts.length}
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
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.id}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell className={account.balance >= 0 ? "text-green-600" : "text-red-600"}>
                    R$ {account.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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

      {/* Dialog para adicionar nova conta */}
      <Dialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Conta</DialogTitle>
            <DialogDescription>Preencha os dados da nova conta financeira.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo
              </Label>
              <select
                id="type"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Corrente">Conta Corrente</option>
                <option value="Poupança">Conta Poupança</option>
                <option value="Investimento">Investimento</option>
                <option value="Dinheiro">Dinheiro em Caixa</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Saldo Inicial
              </Label>
              <Input id="balance" type="number" step="0.01" defaultValue="0.00" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAccountDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddAccount} className="bg-primary-500 hover:bg-primary-600">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para importar planilha */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Importar Planilha</DialogTitle>
            <DialogDescription>Selecione um arquivo Excel ou CSV para importar contas.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <FileSpreadsheet className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">Arraste e solte um arquivo ou clique para selecionar</p>
              <p className="text-xs text-gray-500">Suporta arquivos .xlsx, .xls e .csv</p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImportFile}
              />
            </div>
            <div className="text-xs text-gray-500">
              <p className="font-medium mb-1">Formato esperado:</p>
              <p>- Coluna A: Nome da Conta</p>
              <p>- Coluna B: Tipo da Conta</p>
              <p>- Coluna C: Saldo Inicial</p>
              <a href="#" className="text-primary-500 hover:underline block mt-2">
                Baixar modelo de planilha
              </a>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-primary-500 hover:bg-primary-600">Importar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
