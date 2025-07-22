"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { createTechnicalResponsible, type TechnicalResponsibleCreateData } from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface TechnicalResponsibleCreateModalProps {
  onTechnicalResponsibleCreated: () => void
}

export function TechnicalResponsibleCreateModal({ onTechnicalResponsibleCreated }: TechnicalResponsibleCreateModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<TechnicalResponsibleCreateData>({
    name: "",
    email: "",
    cpf: "",
    rg: "",
    profession: "",
    professionalRegistry: "",
    phone: "",
    mobilePhone: "",
    isActive: true,
    observations: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações básicas
    if (!formData.name.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome é obrigatório",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Erro de validação",
        description: "Email é obrigatório",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.cpf.trim()) {
      toast({
        title: "Erro de validação",
        description: "CPF é obrigatório",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.profession.trim()) {
      toast({
        title: "Erro de validação",
        description: "Profissão é obrigatória",
        variant: "destructive",
      })
      return
    }

    // Validar formato do CPF (apenas números e 11 dígitos)
    const cpfClean = formData.cpf.replace(/\D/g, '')
    if (cpfClean.length !== 11) {
      toast({
        title: "Erro de validação",
        description: "CPF deve conter 11 dígitos",
        variant: "destructive",
      })
      return
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erro de validação",
        description: "Email inválido",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      // Preparar dados para envio
      const dataToSend = {
        ...formData,
        cpf: cpfClean,
        // Remover campos vazios opcionais
        rg: formData.rg?.trim() || undefined,
        professionalRegistry: formData.professionalRegistry?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
        mobilePhone: formData.mobilePhone?.trim() || undefined,
        observations: formData.observations?.trim() || undefined
      }

      await createTechnicalResponsible(dataToSend)
      
      toast({
        title: "Sucesso!",
        description: "Responsável técnico criado com sucesso!",
        variant: "default",
      })
      setOpen(false)
      
      // Resetar formulário
      setFormData({
        name: "",
        email: "",
        cpf: "",
        rg: "",
        profession: "",
        professionalRegistry: "",
        phone: "",
        mobilePhone: "",
        isActive: true,
        observations: ""
      })
      
      onTechnicalResponsibleCreated()
    } catch (error: any) {
      console.error('Erro ao criar responsável técnico:', error)
      
      // Tratar erros específicos
      if (error.response?.status === 409) {
        if (error.response.data.message.includes('Email')) {
          toast({
            title: "Erro de duplicação",
            description: "Este email já está cadastrado",
            variant: "destructive",
          })
        } else if (error.response.data.message.includes('CPF')) {
          toast({
            title: "Erro de duplicação",
            description: "Este CPF já está cadastrado",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Erro de duplicação",
            description: "Dados já cadastrados no sistema",
            variant: "destructive",
          })
        }
      } else if (error.response?.status === 400) {
        toast({
          title: "Dados inválidos",
          description: error.response.data.message || "Dados inválidos",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro",
          description: "Erro ao criar responsável técnico. Tente novamente.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof TechnicalResponsibleCreateData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Novo Responsável Técnico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Responsável Técnico</DialogTitle>
          <DialogDescription>
            Adicione um novo responsável técnico ao sistema. Todos os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="md:col-span-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Dr. João Silva Santos"
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="joao.silva@empresa.com"
                required
              />
            </div>

            {/* CPF */}
            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formatCPF(formData.cpf)}
                onChange={(e) => {
                  const numbers = e.target.value.replace(/\D/g, '')
                  if (numbers.length <= 11) {
                    handleInputChange("cpf", numbers)
                  }
                }}
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>

            {/* RG */}
            <div>
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={formData.rg}
                onChange={(e) => handleInputChange("rg", e.target.value)}
                placeholder="MG1234567"
              />
            </div>

            {/* Profissão */}
            <div>
              <Label htmlFor="profession">Profissão *</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => handleInputChange("profession", e.target.value)}
                placeholder="Ex: Engenheiro de Segurança do Trabalho"
                required
              />
            </div>

            {/* Registro Profissional */}
            <div>
              <Label htmlFor="professionalRegistry">Registro Profissional</Label>
              <Input
                id="professionalRegistry"
                value={formData.professionalRegistry}
                onChange={(e) => handleInputChange("professionalRegistry", e.target.value)}
                placeholder="Ex: CREA-MG 123456"
              />
            </div>

            {/* Telefone Fixo */}
            <div>
              <Label htmlFor="phone">Telefone Fixo</Label>
              <Input
                id="phone"
                value={formatPhone(formData.phone || "")}
                onChange={(e) => {
                  const numbers = e.target.value.replace(/\D/g, '')
                  if (numbers.length <= 11) {
                    handleInputChange("phone", numbers)
                  }
                }}
                placeholder="(31) 3333-4444"
                maxLength={15}
              />
            </div>

            {/* Telefone Celular */}
            <div>
              <Label htmlFor="mobilePhone">Telefone Celular</Label>
              <Input
                id="mobilePhone"
                value={formatPhone(formData.mobilePhone || "")}
                onChange={(e) => {
                  const numbers = e.target.value.replace(/\D/g, '')
                  if (numbers.length <= 11) {
                    handleInputChange("mobilePhone", numbers)
                  }
                }}
                placeholder="(31) 99988-7766"
                maxLength={15}
              />
            </div>

            {/* Status Ativo */}
            <div className="md:col-span-2 flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Responsável técnico ativo</Label>
            </div>

            {/* Observações */}
            <div className="md:col-span-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange("observations", e.target.value)}
                placeholder="Ex: Especialista em NR-35 e trabalho em altura"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Responsável Técnico"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
