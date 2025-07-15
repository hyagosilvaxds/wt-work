"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { createInstructor, CreateInstructorUserDto } from "@/lib/api/superadmin"

interface CreateInstructorData extends CreateInstructorUserDto {}

interface InstructorCreateModalProps {
  onInstructorCreated?: () => void
}

export function InstructorCreateModal({ onInstructorCreated }: InstructorCreateModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState<CreateInstructorData>({
    name: "",
    isActive: true,
    personType: "FISICA"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await createInstructor(formData)
      
      toast({
        title: "Sucesso!",
        description: "Instrutor criado com sucesso.",
        variant: "default",
      })
      
      setOpen(false)
      
      // Reset form
      setFormData({
        name: "",
        isActive: true,
        personType: "FISICA"
      })

      // Chama callback para atualizar lista
      if (onInstructorCreated) {
        onInstructorCreated()
      }
    } catch (error) {
      console.error("Erro ao criar instrutor:", error)
      toast({
        title: "Erro",
        description: "Erro ao criar instrutor. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateInstructorData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus className="mr-2 h-4 w-4" />
          Novo Instrutor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Instrutor</DialogTitle>
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
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    />
                    <Label htmlFor="isActive">Instrutor Ativo</Label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="corporateName">Nome Corporativo</Label>
                      <Input
                        id="corporateName"
                        value={formData.corporateName || ""}
                        onChange={(e) => handleInputChange('corporateName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="personType">Tipo de Pessoa</Label>
                      <Select value={formData.personType} onValueChange={(value) => handleInputChange('personType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FISICA">Pessoa Física</SelectItem>
                          <SelectItem value="JURIDICA">Pessoa Jurídica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="education">Formação</Label>
                      <Input
                        id="education"
                        value={formData.education || ""}
                        onChange={(e) => handleInputChange('education', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="registrationNumber">Número de Registro</Label>
                    <Input
                      id="registrationNumber"
                      value={formData.registrationNumber || ""}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="observations">Observações</Label>
                    <Textarea
                      id="observations"
                      value={formData.observations || ""}
                      onChange={(e) => handleInputChange('observations', e.target.value)}
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
                  {formData.personType === "FISICA" ? (
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={formData.cpf || ""}
                        onChange={(e) => handleInputChange('cpf', e.target.value)}
                        placeholder="000.000.000-00"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                          id="cnpj"
                          value={formData.cnpj || ""}
                          onChange={(e) => handleInputChange('cnpj', e.target.value)}
                          placeholder="00.000.000/0000-00"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="municipalRegistration">Inscrição Municipal</Label>
                        <Input
                          id="municipalRegistration"
                          value={formData.municipalRegistration || ""}
                          onChange={(e) => handleInputChange('municipalRegistration', e.target.value)}
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label htmlFor="stateRegistration">Inscrição Estadual</Label>
                        <Input
                          id="stateRegistration"
                          value={formData.stateRegistration || ""}
                          onChange={(e) => handleInputChange('stateRegistration', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="address" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode || ""}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="00000-000"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={formData.address || ""}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="addressNumber">Número</Label>
                      <Input
                        id="addressNumber"
                        value={formData.addressNumber || ""}
                        onChange={(e) => handleInputChange('addressNumber', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={formData.neighborhood || ""}
                        onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.city || ""}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">SP</SelectItem>
                          <SelectItem value="RJ">RJ</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                          <SelectItem value="RS">RS</SelectItem>
                          <SelectItem value="PR">PR</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="BA">BA</SelectItem>
                          <SelectItem value="GO">GO</SelectItem>
                          <SelectItem value="DF">DF</SelectItem>
                          {/* Adicione outros estados conforme necessário */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Telefone Fixo</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="DDD"
                          value={formData.landlineAreaCode || ""}
                          onChange={(e) => handleInputChange('landlineAreaCode', e.target.value)}
                          className="w-20"
                        />
                        <Input
                          placeholder="Número"
                          value={formData.landlineNumber || ""}
                          onChange={(e) => handleInputChange('landlineNumber', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Celular</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="DDD"
                          value={formData.mobileAreaCode || ""}
                          onChange={(e) => handleInputChange('mobileAreaCode', e.target.value)}
                          className="w-20"
                        />
                        <Input
                          placeholder="Número"
                          value={formData.mobileNumber || ""}
                          onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary-500 hover:bg-primary-600" disabled={loading}>
              {loading ? "Criando..." : "Criar Instrutor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
