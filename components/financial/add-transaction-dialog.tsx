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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar as CalendarIcon, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface AddTransactionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

export function AddTransactionDialog({ isOpen, onClose, onSave }: AddTransactionDialogProps) {
  const [formData, setFormData] = useState({
    type: "entrada" as "entrada" | "saida",
    description: "",
    value: "",
    date: undefined as Date | undefined,
    paymentMethod: "",
    account: "",
    category: "",
    reference: "",
    notes: "",
    clientSupplier: "",
  })

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

  const accounts = [
    "Conta Corrente Banco do Brasil",
    "Conta Corrente Itaú",
    "Conta Poupança Caixa",
    "Cartão de Crédito"
  ]

  const entradaCategories = [
    "Receita de Cursos",
    "Receita de Certificações",
    "Receita de Workshops",
    "Receita de Consultorias",
    "Outras Receitas"
  ]

  const saidaCategories = [
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.description || !formData.value || !formData.date) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    const newTransaction = {
      id: Date.now(),
      date: format(formData.date, "yyyy-MM-dd"),
      description: formData.description,
      account: formData.account,
      paymentMethod: formData.paymentMethod,
      type: formData.type,
      amount: parseFloat(formData.value.replace(/[R$.\s]/g, "").replace(",", ".")),
      category: formData.category,
      reference: formData.reference,
      clientSupplier: formData.clientSupplier,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    }

    onSave(newTransaction)
    onClose()
    
    // Reset form
    setFormData({
      type: "entrada",
      description: "",
      value: "",
      date: undefined,
      paymentMethod: "",
      account: "",
      category: "",
      reference: "",
      notes: "",
      clientSupplier: "",
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

  const getCurrentCategories = () => {
    return formData.type === "entrada" ? entradaCategories : saidaCategories
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2 text-blue-600" />
            Nova Transação
          </DialogTitle>
          <DialogDescription>
            Cadastre uma nova transação no fluxo de caixa
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Transação */}
          <div className="space-y-4">
            <Label>Tipo de Transação *</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value: "entrada" | "saida") => {
                setFormData(prev => ({ ...prev, type: value, category: "" }))
              }}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="entrada" id="entrada" />
                <Label htmlFor="entrada" className="flex items-center cursor-pointer">
                  <ArrowUpRight className="w-4 h-4 mr-1 text-green-600" />
                  Entrada
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="saida" id="saida" />
                <Label htmlFor="saida" className="flex items-center cursor-pointer">
                  <ArrowDownLeft className="w-4 h-4 mr-1 text-red-600" />
                  Saída
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Input
                id="description"
                placeholder="Descrição da transação"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data */}
            <div className="space-y-2">
              <Label>Data da Transação *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(formData.date, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      "Selecione a data"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Cliente/Fornecedor */}
            <div className="space-y-2">
              <Label htmlFor="clientSupplier">
                {formData.type === "entrada" ? "Cliente" : "Fornecedor"}
              </Label>
              <Input
                id="clientSupplier"
                placeholder={formData.type === "entrada" ? "Nome do cliente" : "Nome do fornecedor"}
                value={formData.clientSupplier}
                onChange={(e) => setFormData(prev => ({ ...prev, clientSupplier: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Categoria */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {getCurrentCategories().map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conta */}
            <div className="space-y-2">
              <Label>Conta</Label>
              <Select value={formData.account} onValueChange={(value) => setFormData(prev => ({ ...prev, account: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(account => (
                    <SelectItem key={account} value={account}>
                      {account}
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

            {/* Referência */}
            <div className="space-y-2">
              <Label htmlFor="reference">Referência</Label>
              <Input
                id="reference"
                placeholder="Ex: TRF001234, PIX789456"
                value={formData.reference}
                onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              />
            </div>
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
            <Button 
              type="submit" 
              className={cn(
                "text-white",
                formData.type === "entrada" 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
              )}
            >
              {formData.type === "entrada" ? (
                <>
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Cadastrar Entrada
                </>
              ) : (
                <>
                  <ArrowDownLeft className="w-4 h-4 mr-2" />
                  Cadastrar Saída
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
