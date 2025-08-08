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
import { bankAccountsApi, type BankAccount } from "@/lib/api/financial"
import { useToast } from "@/hooks/use-toast"

interface AddPayableDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

export function AddPayableDialog({ isOpen, onClose, onSave }: AddPayableDialogProps) {
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    supplier: "",
    description: "",
    value: "",
    dueDate: undefined as Date | undefined,
    paymentMethod: "",
    accountId: "",
    category: "",
    isRecurring: false,
    recurrenceType: "",
    installments: "",
    notes: "",
    priority: "medium",
  })

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
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
      const response = await bankAccountsApi.getAll()
      
      // Verificar se response é um array ou um objeto com dados
      const accounts = Array.isArray(response) 
        ? response 
        : response?.data || response?.items || []
      
      setBankAccounts(accounts)
    } catch (error) {
      console.error("Erro ao carregar contas bancárias:", error)
      toast({
        title: "Aviso",
        description: "Erro ao carregar contas bancárias. Tente novamente.",
        variant: "destructive",
      })
      setBankAccounts([]) // Use array vazio como fallback
    } finally {
      setLoadingAccounts(false)
    }
  }

  const paymentMethods = [
    "Transferência Bancária",
    "PIX",
    "Cartão de Crédito",
    "Cartão de Débito", 
    "Boleto Bancário",
    "Débito Automático",
    "Dinheiro",
    "Cheque"
  ]

  const categories = [
    "Folha de Pagamento",
    "Despesas Operacionais",
    "Material e Suprimentos",
    "Utilities",
    "Marketing e Publicidade",
    "Tecnologia",
    "Manutenção",
    "Impostos e Taxas",
    "Outras Despesas"
  ]

  const recurrenceTypes = [
    "Semanal",
    "Quinzenal", 
    "Mensal",
    "Bimestral",
    "Trimestral",
    "Semestral",
    "Anual"
  ]

  const priorities = [
    { value: "high", label: "Alta", color: "text-red-600" },
    { value: "medium", label: "Média", color: "text-yellow-600" },
    { value: "low", label: "Baixa", color: "text-green-600" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.supplier || !formData.value || !formData.dueDate || !formData.accountId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios: Fornecedor, Valor, Data de Vencimento e Conta de Débito",
        variant: "destructive",
      })
      return
    }

    const newPayable = {
      id: Date.now(),
      supplier: formData.supplier,
      description: formData.description,
      value: parseFloat(formData.value.replace(/[R$.\s]/g, "").replace(",", ".")),
      dueDate: format(formData.dueDate, "yyyy-MM-dd"),
      paymentMethod: formData.paymentMethod,
      accountId: formData.accountId,
      category: formData.category,
      isRecurring: formData.isRecurring,
      recurrenceType: formData.recurrenceType,
      installments: formData.installments ? parseInt(formData.installments) : null,
      notes: formData.notes,
      priority: formData.priority,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    onSave(newPayable)
    onClose()
    
    // Reset form
    setFormData({
      supplier: "",
      description: "",
      value: "",
      dueDate: undefined,
      paymentMethod: "",
      accountId: "",
      category: "",
      isRecurring: false,
      recurrenceType: "",
      installments: "",
      notes: "",
      priority: "medium",
    })
  }

  const formatCurrency = (value: string) => {
    // Remove caracteres não numéricos
    const numbers = value.replace(/\D/g, "")
    
    // Converte para formato brasileiro
    const amount = parseFloat(numbers) / 100
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
  }

  const handleValueChange = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers) {
      const formatted = formatCurrency(numbers)
      setFormData(prev => ({ ...prev, value: formatted }))
    } else {
      setFormData(prev => ({ ...prev, value: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2 text-red-600" />
            Nova Conta a Pagar
          </DialogTitle>
          <DialogDescription>
            Cadastre uma nova conta a pagar no sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fornecedor */}
            <div className="space-y-2">
              <Label htmlFor="supplier">Fornecedor/Empresa *</Label>
              <Input
                id="supplier"
                placeholder="Nome do fornecedor ou empresa"
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                required
              />
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="value">Valor *</Label>
              <Input
                id="value"
                placeholder="R$ 0,00"
                value={formData.value}
                onChange={(e) => handleValueChange(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Descrição da despesa ou serviço"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Data de Vencimento */}
            <div className="space-y-2">
              <Label>Data de Vencimento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? (
                      format(formData.dueDate, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      "Selecione a data"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prioridade */}
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <span className={priority.color}>{priority.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Forma de Pagamento */}
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conta */}
            <div className="space-y-2">
              <Label>Conta de Débito <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.accountId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
                disabled={loadingAccounts}
              >
                <SelectTrigger className={!formData.accountId ? "border-red-300" : ""}>
                  <SelectValue placeholder={
                    loadingAccounts 
                      ? "Carregando contas..." 
                      : bankAccounts.length === 0 
                        ? "Nenhuma conta disponível" 
                        : "Selecione a conta"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.length > 0 ? (
                    bankAccounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.nome} - {account.banco} 
                        {account.isMain && " (Principal)"}
                      </SelectItem>
                    ))
                  ) : !loadingAccounts ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Nenhuma conta bancária encontrada
                    </div>
                  ) : null}
                </SelectContent>
              </Select>
              {loadingAccounts && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando contas bancárias...
                </div>
              )}
            </div>
          </div>

          {/* Recorrência */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
              />
              <Label htmlFor="recurring">Conta recorrente</Label>
            </div>

            {formData.isRecurring && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Recorrência</Label>
                  <Select value={formData.recurrenceType} onValueChange={(value) => setFormData(prev => ({ ...prev, recurrenceType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {recurrenceTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Número de Parcelas</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 12"
                    value={formData.installments}
                    onChange={(e) => setFormData(prev => ({ ...prev, installments: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Observações adicionais..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Cadastrar Conta a Pagar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
