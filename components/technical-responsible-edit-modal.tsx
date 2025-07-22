"use client"

import { useState, useEffect } from "react"
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
} from "@/components/ui/dialog"
import { 
  getTechnicalResponsibleById, 
  updateTechnicalResponsible, 
  type TechnicalResponsible, 
  type TechnicalResponsibleUpdateData 
} from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface TechnicalResponsibleEditModalProps {
  technicalResponsibleId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onTechnicalResponsibleUpdated: () => void
}

export function TechnicalResponsibleEditModal({ 
  technicalResponsibleId, 
  open, 
  onOpenChange, 
  onTechnicalResponsibleUpdated 
}: TechnicalResponsibleEditModalProps) {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<TechnicalResponsibleUpdateData>({
    name: "",
    email: "",
    rg: "",
    profession: "",
    professionalRegistry: "",
    phone: "",
    mobilePhone: "",
    isActive: true,
    observations: ""
  })

  useEffect(() => {
    if (open && technicalResponsibleId) {
      fetchTechnicalResponsible()
    }
  }, [open, technicalResponsibleId])

  const fetchTechnicalResponsible = async () => {
    try {
      setLoadingData(true)
      const data = await getTechnicalResponsibleById(technicalResponsibleId)
      
      setFormData({
        name: data.name,
        email: data.email,
        rg: data.rg || "",
        profession: data.profession,
        professionalRegistry: data.professionalRegistry || "",
        phone: data.phone || "",
        mobilePhone: data.mobilePhone || "",
        isActive: data.isActive,
        observations: data.observations || ""
      })
    } catch (error) {
      console.error('Erro ao buscar responsável técnico:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do responsável técnico",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações básicas
    if (!formData.name?.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome é obrigatório",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.email?.trim()) {
      toast({
        title: "Erro de validação",
        description: "Email é obrigatório",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.profession?.trim()) {
      toast({
        title: "Erro de validação",
        description: "Profissão é obrigatória",
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
      
      // Preparar dados para envio (remover campos vazios)
      const dataToSend: TechnicalResponsibleUpdateData = {}
      
      if (formData.name?.trim()) dataToSend.name = formData.name.trim()
      if (formData.email?.trim()) dataToSend.email = formData.email.trim()
      if (formData.rg?.trim()) dataToSend.rg = formData.rg.trim()
      if (formData.profession?.trim()) dataToSend.profession = formData.profession.trim()
      if (formData.professionalRegistry?.trim()) dataToSend.professionalRegistry = formData.professionalRegistry.trim()
      if (formData.phone?.trim()) dataToSend.phone = formData.phone.replace(/\D/g, '')
      if (formData.mobilePhone?.trim()) dataToSend.mobilePhone = formData.mobilePhone.replace(/\D/g, '')
      if (formData.observations?.trim()) dataToSend.observations = formData.observations.trim()
      dataToSend.isActive = formData.isActive

      await updateTechnicalResponsible(technicalResponsibleId, dataToSend)
      
      toast({
        title: "Sucesso!",
        description: "Responsável técnico atualizado com sucesso!",
        variant: "default",
      })
      onOpenChange(false)
      onTechnicalResponsibleUpdated()
    } catch (error: any) {
      console.error('Erro ao atualizar responsável técnico:', error)
      
      // Tratar erros específicos
      if (error.response?.status === 409) {
        if (error.response.data.message.includes('Email')) {
          toast({
            title: "Erro de duplicação",
            description: "Este email já está em uso por outro responsável técnico",
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
      } else if (error.response?.status === 404) {
        toast({
          title: "Não encontrado",
          description: "Responsável técnico não encontrado",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro",
          description: "Erro ao atualizar responsável técnico. Tente novamente.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof TechnicalResponsibleUpdateData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

  if (loadingData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Carregando...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Responsável Técnico</DialogTitle>
          <DialogDescription>
            Atualize as informações do responsável técnico. Todos os campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="md:col-span-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name || ""}
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
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="joao.silva@empresa.com"
                required
              />
            </div>

            {/* RG */}
            <div>
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={formData.rg || ""}
                onChange={(e) => handleInputChange("rg", e.target.value)}
                placeholder="MG1234567"
              />
            </div>

            {/* Profissão */}
            <div>
              <Label htmlFor="profession">Profissão *</Label>
              <Input
                id="profession"
                value={formData.profession || ""}
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
                value={formData.professionalRegistry || ""}
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
                value={formData.observations || ""}
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
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
