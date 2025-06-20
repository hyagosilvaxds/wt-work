"use client"

import { useState } from "react"
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
import { Calendar as CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface AddReceivableDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

export function AddReceivableDialog({ isOpen, onClose, onSave }: AddReceivableDialogProps) {
  const [formData, setFormData] = useState({
    client: "",
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
  })

  const paymentMethods = [
    "Transferência Bancária",
    "PIX",
    "Cartão de Crédito",
    "Cartão de Débito", 
    "Boleto Bancário",
    "Dinheiro",
    "Cheque"
  ]

  const accounts = [
    { id: "1", name: "Conta Corrente Banco do Brasil" },
    { id: "2", name: "Conta Corrente Itaú" },
    { id: "3", name: "Conta Poupança Caixa" },
    { id: "4", name: "Cartão de Crédito" }
  ]

  const categories = [
    "Receita de Cursos",
    "Receita de Certificações", 
    "Receita de Workshops",
    "Receita de Consultorias",
    "Outras Receitas"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.client || !formData.value || !formData.dueDate) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    const newReceivable = {
      id: Date.now(),
      client: formData.client,
      description: formData.description,
      value: parseFloat(formData.value),
      dueDate: format(formData.dueDate, "yyyy-MM-dd"),
      paymentMethod: formData.paymentMethod,
      accountId: formData.accountId,
      category: formData.category,
      isRecurring: formData.isRecurring,
      recurrenceType: formData.recurrenceType,
      installments: formData.installments ? parseInt(formData.installments) : null,
      notes: formData.notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    onSave(newReceivable)
    onClose()
    
    // Reset form
    setFormData({
      client: "",
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
              <Label htmlFor="client">Cliente/Empresa *</Label>
              <Input
                id="client"
                placeholder="Nome do cliente ou empresa"
                value={formData.client}
                onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
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
              placeholder="Descrição do serviço ou produto"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
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
              <Label>Conta de Recebimento</Label>
              <Select value={formData.accountId} onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Cadastrar Conta a Receber
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
