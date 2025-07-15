"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Save, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getInstructorById, patchInstructor, CreateInstructorUserDto } from "@/lib/api/superadmin"

interface Instructor {
  id: string
  userId: string | null
  isActive: boolean
  name: string
  corporateName: string | null
  personType: "FISICA" | "JURIDICA"
  cpf: string | null
  cnpj: string | null
  municipalRegistration: string | null
  stateRegistration: string | null
  zipCode: string | null
  address: string | null
  addressNumber: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  landlineAreaCode: string | null
  landlineNumber: string | null
  mobileAreaCode: string | null
  mobileNumber: string | null
  email: string | null
  education: string | null
  registrationNumber: string | null
  observations: string | null
  createdAt: string
  updatedAt: string
  user: any
  classes: any[]
}

interface InstructorEditModalProps {
  instructorId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onInstructorUpdated?: () => void
}

export function InstructorEditModal({ instructorId, open, onOpenChange, onInstructorUpdated }: InstructorEditModalProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [formData, setFormData] = useState<Partial<CreateInstructorUserDto>>({})
  const { toast } = useToast()

  // Buscar dados do instrutor
  useEffect(() => {
    if (open && instructorId) {
      fetchInstructor()
    }
  }, [open, instructorId])

  const fetchInstructor = async () => {
    try {
      setLoading(true)
      const response = await getInstructorById(instructorId)
      setInstructor(response.instructor || response)
      
      // Inicializar form data
      const instructorData = response.instructor || response
      setFormData({
        name: instructorData.name || "",
        corporateName: instructorData.corporateName || "",
        personType: instructorData.personType || "FISICA",
        cpf: instructorData.cpf || "",
        cnpj: instructorData.cnpj || "",
        email: instructorData.email || "",
        education: instructorData.education || "",
        registrationNumber: instructorData.registrationNumber || "",
        observations: instructorData.observations || "",
        isActive: instructorData.isActive ?? true,
        zipCode: instructorData.zipCode || "",
        address: instructorData.address || "",
        addressNumber: instructorData.addressNumber || "",
        neighborhood: instructorData.neighborhood || "",
        city: instructorData.city || "",
        state: instructorData.state || "",
        landlineAreaCode: instructorData.landlineAreaCode || "",
        landlineNumber: instructorData.landlineNumber || "",
        mobileAreaCode: instructorData.mobileAreaCode || "",
        mobileNumber: instructorData.mobileNumber || "",
        municipalRegistration: instructorData.municipalRegistration || "",
        stateRegistration: instructorData.stateRegistration || "",
      })
    } catch (error) {
      console.error('Erro ao buscar instrutor:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do instrutor.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await patchInstructor(instructorId, formData)
      
      toast({
        title: "Sucesso!",
        description: "Instrutor atualizado com sucesso.",
        variant: "default",
      })
      
      onOpenChange(false)
      
      // Chama callback para atualizar lista
      if (onInstructorUpdated) {
        onInstructorUpdated()
      }
    } catch (error) {
      console.error("Erro ao atualizar instrutor:", error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar instrutor. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof CreateInstructorUserDto, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="mr-2 h-5 w-5" />
            Editar Instrutor: {instructor?.name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="address">Endereço</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Nome do instrutor"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="corporateName">Nome Corporativo</Label>
                      <Input
                        id="corporateName"
                        value={formData.corporateName || ""}
                        onChange={(e) => handleInputChange("corporateName", e.target.value)}
                        placeholder="Nome da empresa"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="personType">Tipo de Pessoa</Label>
                      <Select
                        value={formData.personType || "FISICA"}
                        onValueChange={(value) => handleInputChange("personType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FISICA">Pessoa Física</SelectItem>
                          <SelectItem value="JURIDICA">Pessoa Jurídica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 mt-8">
                      <Checkbox
                        id="isActive"
                        checked={formData.isActive ?? true}
                        onCheckedChange={(checked) => handleInputChange("isActive", checked as boolean)}
                      />
                      <Label htmlFor="isActive">Instrutor ativo</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Formação</Label>
                    <Input
                      id="education"
                      value={formData.education || ""}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                      placeholder="Formação acadêmica"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observations">Observações</Label>
                    <Textarea
                      id="observations"
                      value={formData.observations || ""}
                      onChange={(e) => handleInputChange("observations", e.target.value)}
                      placeholder="Observações adicionais"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documentos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={formData.cpf || ""}
                        onChange={(e) => handleInputChange("cpf", e.target.value)}
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={formData.cnpj || ""}
                        onChange={(e) => handleInputChange("cnpj", e.target.value)}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">Número de Registro</Label>
                      <Input
                        id="registrationNumber"
                        value={formData.registrationNumber || ""}
                        onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                        placeholder="Registro profissional"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="municipalRegistration">Inscrição Municipal</Label>
                      <Input
                        id="municipalRegistration"
                        value={formData.municipalRegistration || ""}
                        onChange={(e) => handleInputChange("municipalRegistration", e.target.value)}
                        placeholder="Inscrição municipal"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stateRegistration">Inscrição Estadual</Label>
                      <Input
                        id="stateRegistration"
                        value={formData.stateRegistration || ""}
                        onChange={(e) => handleInputChange("stateRegistration", e.target.value)}
                        placeholder="Inscrição estadual"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode || ""}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        placeholder="00000-000"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Logradouro</Label>
                      <Input
                        id="address"
                        value={formData.address || ""}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Rua, Avenida, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressNumber">Número</Label>
                      <Input
                        id="addressNumber"
                        value={formData.addressNumber || ""}
                        onChange={(e) => handleInputChange("addressNumber", e.target.value)}
                        placeholder="123"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={formData.neighborhood || ""}
                        onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                        placeholder="Nome do bairro"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.city || ""}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Nome da cidade"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={formData.state || ""}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder="UF"
                        maxLength={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobileAreaCode">DDD Celular</Label>
                      <Input
                        id="mobileAreaCode"
                        value={formData.mobileAreaCode || ""}
                        onChange={(e) => handleInputChange("mobileAreaCode", e.target.value)}
                        placeholder="11"
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber">Número Celular</Label>
                      <Input
                        id="mobileNumber"
                        value={formData.mobileNumber || ""}
                        onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                        placeholder="99999-9999"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="landlineAreaCode">DDD Fixo</Label>
                      <Input
                        id="landlineAreaCode"
                        value={formData.landlineAreaCode || ""}
                        onChange={(e) => handleInputChange("landlineAreaCode", e.target.value)}
                        placeholder="11"
                        maxLength={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landlineNumber">Número Fixo</Label>
                      <Input
                        id="landlineNumber"
                        value={formData.landlineNumber || ""}
                        onChange={(e) => handleInputChange("landlineNumber", e.target.value)}
                        placeholder="3333-3333"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
