"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar as CalendarIcon, Plus, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { 
  accountsReceivableApi, 
  bankAccountsApi, 
  clientsApi,
  type CreateAccountReceivableData,
  PAYMENT_METHODS 
} from "@/lib/api/financial"

interface AddReceivableDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

export function AddReceivableDialog({ isOpen, onClose, onSave }: AddReceivableDialogProps) {
  const [formData, setFormData] = useState<CreateAccountReceivableData>({
    description: "",
    amount: 0,
    dueDate: "",
    status: "PENDENTE",
    category: "OUTROS",
    customerName: "",
    customerDocument: "",
    customerEmail: "",
    customerPhone: "",
    observations: "",
    installmentNumber: 1,
    totalInstallments: 1,
    bankAccountId: "",
  })

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [loading, setLoading] = useState(false)
  const [bankAccounts, setBankAccounts] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(false)

  // Carregar contas bancárias
  useEffect(() => {
    if (isOpen) {
      loadBankAccounts()
    }
  }, [isOpen])

  const loadBankAccounts = async () => {
    try {
      setLoadingAccounts(true)
      const accounts = await bankAccountsApi.getAll()
      setBankAccounts(accounts)
    } catch (error) {
      console.error("Erro ao carregar contas bancárias:", error)
    } finally {
      setLoadingAccounts(false)
    }
  }

  const categories = [
    { value: "MENSALIDADE", label: "Mensalidade" },
    { value: "MATERIAL", label: "Material" },
    { value: "CERTIFICADO", label: "Certificado" },
    { value: "SERVICOS", label: "Serviços" },
    { value: "OUTROS", label: "Outros" }
  ] as const

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerName || !formData.amount || !formData.dueDate) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      const newReceivable = await accountsReceivableApi.create(formData)
      onSave(newReceivable)
      handleClose()
      
      toast({
        title: "Sucesso!",
        description: "Conta a receber criada com sucesso",
      })
    } catch (error) {
      console.error("Erro ao criar conta a receber:", error)
      toast({
        title: "Erro",
        description: "Erro ao criar conta a receber",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      description: "",
      amount: 0,
      dueDate: "",
      status: "PENDENTE",
      category: "OUTROS",
      customerName: "",
      customerDocument: "",
      customerEmail: "",
      customerPhone: "",
      observations: "",
      installmentNumber: 1,
      totalInstallments: 1,
      bankAccountId: "",
    })
    setSelectedDate(undefined)
    onClose()
  }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2 text-green-600" />
            Nova Conta a Receber
          </DialogTitle>
          <DialogDescription>
            Cadastre uma nova conta a receber no sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="customerName">Nome do Cliente *</Label>
              <Input
                id="customerName"
                placeholder="Nome do cliente"
                value={formData.customerName || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                required
              />
            </div>

            {/* Documento */}
            <div className="space-y-2">
              <Label htmlFor="customerDocument">CPF/CNPJ</Label>
              <Input
                id="customerDocument"
                placeholder="000.000.000-00"
                value={formData.customerDocument || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, customerDocument: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="cliente@email.com"
                value={formData.customerEmail || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
              />
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Telefone</Label>
              <Input
                id="customerPhone"
                placeholder="(11) 99999-9999"
                value={formData.customerPhone || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              placeholder="Descrição do serviço ou produto"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="amount">Valor *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data de Vencimento */}
            <div className="space-y-2">
              <Label>Data de Vencimento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      "Selecione a data"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date)
                      setFormData(prev => ({ 
                        ...prev, 
                        dueDate: date ? format(date, "yyyy-MM-dd") : "" 
                      }))
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Conta Bancária */}
            <div className="space-y-2">
              <Label>Conta de Recebimento</Label>
              <Select 
                value={formData.bankAccountId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, bankAccountId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingAccounts ? "Carregando..." : "Selecione a conta"} />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.nome} - {account.banco}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Número da Parcela */}
            <div className="space-y-2">
              <Label>Parcela</Label>
              <Input
                type="number"
                min="1"
                placeholder="1"
                value={formData.installmentNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, installmentNumber: parseInt(e.target.value) || 1 }))}
              />
            </div>

            {/* Total de Parcelas */}
            <div className="space-y-2">
              <Label>Total de Parcelas</Label>
              <Input
                type="number"
                min="1"
                placeholder="1"
                value={formData.totalInstallments}
                onChange={(e) => setFormData(prev => ({ ...prev, totalInstallments: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              placeholder="Observações adicionais..."
              value={formData.observations || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar Conta a Receber
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
