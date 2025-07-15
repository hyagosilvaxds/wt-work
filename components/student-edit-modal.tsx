"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { patchStudent, UpdateStudentData, getClients } from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface Client {
  id: string
  name: string
  corporateName?: string
  email?: string
  responsibleName?: string
}

interface Student {
  id: string
  name: string
  cpf: string
  rg?: string
  gender?: string
  birthDate?: string
  education?: string
  zipCode?: string
  address?: string
  addressNumber?: string
  neighborhood?: string
  city?: string
  state?: string
  landlineAreaCode?: string
  landlineNumber?: string
  mobileAreaCode?: string
  mobileNumber?: string
  email?: string
  observations?: string
  clientId?: string
  isActive: boolean
}

interface StudentEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  student: Student | null
}

export function StudentEditModal({ open, onOpenChange, onSuccess, student }: StudentEditModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [formData, setFormData] = useState<UpdateStudentData>({
    name: "",
    cpf: "",
    rg: "",
    gender: "",
    birthDate: "",
    education: "",
    zipCode: "",
    address: "",
    addressNumber: "",
    neighborhood: "",
    city: "",
    state: "",
    landlineAreaCode: "",
    landlineNumber: "",
    mobileAreaCode: "",
    mobileNumber: "",
    email: "",
    observations: "",
    clientId: "",
    isActive: true
  })

  // Carregar clientes quando o modal abrir
  useEffect(() => {
    if (open) {
      loadClients()
    }
  }, [open])

  const loadClients = async () => {
    setLoadingClients(true)
    try {
      const response = await getClients(1, 100) // Carregar todos os clientes
      setClients(response.clients || [])
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de empresas",
        variant: "destructive"
      })
    } finally {
      setLoadingClients(false)
    }
  }

  useEffect(() => {
    if (student && open) {
      setFormData({
        name: student.name || "",
        cpf: student.cpf || "",
        rg: student.rg || "",
        gender: student.gender || "",
        birthDate: student.birthDate ? new Date(student.birthDate).toISOString().split('T')[0] : "",
        education: student.education || "",
        zipCode: student.zipCode || "",
        address: student.address || "",
        addressNumber: student.addressNumber || "",
        neighborhood: student.neighborhood || "",
        city: student.city || "",
        state: student.state || "",
        landlineAreaCode: student.landlineAreaCode || "",
        landlineNumber: student.landlineNumber || "",
        mobileAreaCode: student.mobileAreaCode || "",
        mobileNumber: student.mobileNumber || "",
        email: student.email || "",
        observations: student.observations || "",
        clientId: student.clientId || "",
        isActive: student.isActive ?? true
      })
    }
  }, [student, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!student) return

    if (!formData.name || !formData.cpf) {
      toast({
        title: "Erro",
        description: "Nome e CPF são obrigatórios",
        variant: "destructive"
      })
      return
    }

    if (formData.cpf && formData.cpf.length < 11) {
      toast({
        title: "Erro",
        description: "CPF deve ter pelo menos 11 caracteres",
        variant: "destructive"
      })
      return
    }

    // Validar email se preenchido
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Erro",
        description: "Email inválido",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // Preparar dados para envio - criando objeto limpo
      const submitData: Partial<UpdateStudentData> = {
        name: formData.name,
        cpf: formData.cpf,
        isActive: formData.isActive
      }

      // Adicionar campos opcionais apenas se tiverem valor válido
      if (formData.rg?.trim()) submitData.rg = formData.rg.trim()
      if (formData.gender?.trim()) submitData.gender = formData.gender.trim()
      if (formData.birthDate?.trim()) submitData.birthDate = new Date(formData.birthDate).toISOString()
      if (formData.education?.trim()) submitData.education = formData.education.trim()
      if (formData.zipCode?.trim()) submitData.zipCode = formData.zipCode.trim()
      if (formData.address?.trim()) submitData.address = formData.address.trim()
      if (formData.addressNumber?.trim()) submitData.addressNumber = formData.addressNumber.trim()
      if (formData.neighborhood?.trim()) submitData.neighborhood = formData.neighborhood.trim()
      if (formData.city?.trim()) submitData.city = formData.city.trim()
      if (formData.state?.trim()) submitData.state = formData.state.trim()
      if (formData.landlineAreaCode?.trim()) submitData.landlineAreaCode = formData.landlineAreaCode.trim()
      if (formData.landlineNumber?.trim()) submitData.landlineNumber = formData.landlineNumber.trim()
      if (formData.mobileAreaCode?.trim()) submitData.mobileAreaCode = formData.mobileAreaCode.trim()
      if (formData.mobileNumber?.trim()) submitData.mobileNumber = formData.mobileNumber.trim()
      if (formData.email?.trim()) submitData.email = formData.email.trim()
      if (formData.observations?.trim()) submitData.observations = formData.observations.trim()
      
      // Tratar clientId: adicionar se tiver valor
      if (formData.clientId && formData.clientId.trim()) {
        submitData.clientId = formData.clientId.trim()
      }

      await patchStudent(student.id, submitData)
      toast({
        title: "Sucesso",
        description: "Estudante atualizado com sucesso!"
      })
      
      onOpenChange(false)
      onSuccess()
    } catch (error: any) {
      console.error('Erro ao atualizar estudante:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao atualizar estudante",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof UpdateStudentData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!student) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Estudante</DialogTitle>
          <DialogDescription>
            Altere os dados do estudante {student.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nome completo"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div>
              <Label htmlFor="clientId">Empresa</Label>
              <div className="flex gap-2">
                <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingClients ? "Carregando..." : "Selecione uma empresa"} />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingClients ? (
                      <SelectItem value="loading" disabled>Carregando...</SelectItem>
                    ) : (
                      <>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.corporateName || client.name}
                            {client.responsibleName && ` - ${client.responsibleName}`}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
                {formData.clientId && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('clientId', '')}
                    className="px-3"
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={formData.rg}
                onChange={(e) => handleInputChange('rg', e.target.value)}
                placeholder="00.000.000-0"
              />
            </div>

            <div>
              <Label htmlFor="gender">Gênero</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                  <SelectItem value="O">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="education">Escolaridade</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                placeholder="Ex: Ensino Superior Completo"
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="00000-000"
                />
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, Avenida..."
                />
              </div>

              <div>
                <Label htmlFor="addressNumber">Número</Label>
                <Input
                  id="addressNumber"
                  value={formData.addressNumber}
                  onChange={(e) => handleInputChange('addressNumber', e.target.value)}
                  placeholder="123"
                />
              </div>

              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  placeholder="Nome do bairro"
                />
              </div>

              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Nome da cidade"
                />
              </div>

              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="SP"
                />
              </div>
            </div>
          </div>

          {/* Contatos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contatos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="landlineAreaCode">DDD Fixo</Label>
                  <Input
                    id="landlineAreaCode"
                    value={formData.landlineAreaCode}
                    onChange={(e) => handleInputChange('landlineAreaCode', e.target.value)}
                    placeholder="11"
                  />
                </div>
                <div>
                  <Label htmlFor="landlineNumber">Telefone Fixo</Label>
                  <Input
                    id="landlineNumber"
                    value={formData.landlineNumber}
                    onChange={(e) => handleInputChange('landlineNumber', e.target.value)}
                    placeholder="1234-5678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="mobileAreaCode">DDD Celular</Label>
                  <Input
                    id="mobileAreaCode"
                    value={formData.mobileAreaCode}
                    onChange={(e) => handleInputChange('mobileAreaCode', e.target.value)}
                    placeholder="11"
                  />
                </div>
                <div>
                  <Label htmlFor="mobileNumber">Celular</Label>
                  <Input
                    id="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    placeholder="99999-9999"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Adicionais</h3>
            
            <div>
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                placeholder="Observações sobre o estudante..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Estudante Ativo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
