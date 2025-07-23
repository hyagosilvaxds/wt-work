"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createVehicle, getLightInstructors, type CreateVehicle } from "@/lib/api/superadmin"

interface VehicleCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVehicleCreated: () => void
}

interface LightInstructor {
  id: string
  name: string
  email: string
}

const CATEGORIES = [
  { value: 'A', label: 'A - Motocicletas' },
  { value: 'B', label: 'B - Automóveis' },
  { value: 'C', label: 'C - Caminhões' },
  { value: 'D', label: 'D - Ônibus' },
  { value: 'E', label: 'E - Carreta' }
] as const

const FUEL_TYPES = [
  'Gasolina',
  'Etanol',
  'Flex',
  'Diesel',
  'GNV',
  'Elétrico',
  'Híbrido'
]

export function VehicleCreateModal({ open, onOpenChange, onVehicleCreated }: VehicleCreateModalProps) {
  const [instructors, setInstructors] = useState<LightInstructor[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingInstructors, setLoadingInstructors] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<CreateVehicle & { instructorId: string }>({
    instructorId: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    color: '',
    renavam: '',
    chassisNumber: '',
    fuelType: '',
    category: 'B',
    observations: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Carregar instrutores
  useEffect(() => {
    if (open) {
      fetchInstructors()
    }
  }, [open])

  const fetchInstructors = async () => {
    try {
      setLoadingInstructors(true)
      const data = await getLightInstructors()
      setInstructors(data)
    } catch (error) {
      console.error('Erro ao carregar instrutores:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de instrutores",
        variant: "destructive",
      })
    } finally {
      setLoadingInstructors(false)
    }
  }

  // Validações
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.instructorId) {
      newErrors.instructorId = 'Instrutor é obrigatório'
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Marca é obrigatória'
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Modelo é obrigatório'
    }

    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Ano deve ser válido'
    }

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'Placa é obrigatória'
    } else {
      // Validar formato da placa
      const plate = formData.licensePlate.replace(/[^A-Z0-9]/g, '').toUpperCase()
      const oldFormat = /^[A-Z]{3}[0-9]{4}$/.test(plate) // ABC1234
      const mercosulFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(plate) // ABC1D23
      
      if (!oldFormat && !mercosulFormat) {
        newErrors.licensePlate = 'Placa deve estar no formato ABC-1234 ou ABC1D23'
      }
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Cor é obrigatória'
    }

    if (!formData.renavam.trim()) {
      newErrors.renavam = 'RENAVAM é obrigatório'
    } else if (!/^[0-9]{11}$/.test(formData.renavam.replace(/\D/g, ''))) {
      newErrors.renavam = 'RENAVAM deve ter 11 dígitos'
    }

    if (!formData.chassisNumber.trim()) {
      newErrors.chassisNumber = 'Número do chassi é obrigatório'
    } else if (formData.chassisNumber.length !== 17) {
      newErrors.chassisNumber = 'Número do chassi deve ter 17 caracteres'
    }

    if (!formData.fuelType) {
      newErrors.fuelType = 'Tipo de combustível é obrigatório'
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      
      const { instructorId, ...vehicleData } = formData
      
      await createVehicle(instructorId, vehicleData)
      
      onVehicleCreated()
      
      // Reset form
      setFormData({
        instructorId: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        color: '',
        renavam: '',
        chassisNumber: '',
        fuelType: '',
        category: 'B',
        observations: ''
      })
      setErrors({})
      
      toast({
        title: "Sucesso",
        description: "Veículo cadastrado com sucesso",
      })
    } catch (error: any) {
      console.error('Erro ao cadastrar veículo:', error)
      
      // Tratar erros específicos
      if (error.response?.status === 409) {
        setErrors({ licensePlate: 'Já existe um veículo cadastrado com esta placa' })
      } else if (error.response?.status === 404) {
        setErrors({ instructorId: 'Instrutor não encontrado' })
      } else {
        toast({
          title: "Erro",
          description: error.response?.data?.message || "Erro ao cadastrar veículo",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Formatar placa automaticamente
  const handleLicensePlateChange = (value: string) => {
    let formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    
    // Limitar a 7 caracteres
    if (formatted.length > 7) {
      formatted = formatted.slice(0, 7)
    }
    
    // Aplicar formato ABC-1234 se for formato antigo
    if (formatted.length >= 4 && /^[A-Z]{3}[0-9]/.test(formatted)) {
      const letters = formatted.slice(0, 3)
      const numbers = formatted.slice(3)
      
      // Se o 4º caractere é número e não há letras depois, é formato antigo
      if (/^[0-9]+$/.test(numbers)) {
        formatted = letters + '-' + numbers
      }
    }
    
    handleInputChange('licensePlate', formatted)
  }

  // Formatar RENAVAM
  const handleRenavamChange = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11)
    handleInputChange('renavam', numbers)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Veículo</DialogTitle>
          <DialogDescription>
            Preencha os dados do veículo para cadastrá-lo no sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Instrutor */}
          <div className="space-y-2">
            <Label htmlFor="instructorId">Instrutor *</Label>
            <Select
              value={formData.instructorId}
              onValueChange={(value) => handleInputChange('instructorId', value)}
              disabled={loadingInstructors}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingInstructors ? "Carregando..." : "Selecione um instrutor"} />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((instructor) => (
                  <SelectItem key={instructor.id} value={instructor.id}>
                    {instructor.name} - {instructor.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.instructorId && (
              <p className="text-sm text-red-600">{errors.instructorId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Marca */}
            <div className="space-y-2">
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="Ex: Volkswagen"
              />
              {errors.brand && (
                <p className="text-sm text-red-600">{errors.brand}</p>
              )}
            </div>

            {/* Modelo */}
            <div className="space-y-2">
              <Label htmlFor="model">Modelo *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="Ex: Gol"
              />
              {errors.model && (
                <p className="text-sm text-red-600">{errors.model}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Ano */}
            <div className="space-y-2">
              <Label htmlFor="year">Ano *</Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
              />
              {errors.year && (
                <p className="text-sm text-red-600">{errors.year}</p>
              )}
            </div>

            {/* Placa */}
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Placa *</Label>
              <Input
                id="licensePlate"
                value={formData.licensePlate}
                onChange={(e) => handleLicensePlateChange(e.target.value)}
                placeholder="ABC-1234"
                maxLength={8}
              />
              {errors.licensePlate && (
                <p className="text-sm text-red-600">{errors.licensePlate}</p>
              )}
            </div>

            {/* Cor */}
            <div className="space-y-2">
              <Label htmlFor="color">Cor *</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="Ex: Branco"
              />
              {errors.color && (
                <p className="text-sm text-red-600">{errors.color}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* RENAVAM */}
            <div className="space-y-2">
              <Label htmlFor="renavam">RENAVAM *</Label>
              <Input
                id="renavam"
                value={formData.renavam}
                onChange={(e) => handleRenavamChange(e.target.value)}
                placeholder="11 dígitos"
                maxLength={11}
              />
              {errors.renavam && (
                <p className="text-sm text-red-600">{errors.renavam}</p>
              )}
            </div>

            {/* Chassi */}
            <div className="space-y-2">
              <Label htmlFor="chassisNumber">Número do Chassi *</Label>
              <Input
                id="chassisNumber"
                value={formData.chassisNumber}
                onChange={(e) => handleInputChange('chassisNumber', e.target.value.toUpperCase())}
                placeholder="17 caracteres"
                maxLength={17}
              />
              {errors.chassisNumber && (
                <p className="text-sm text-red-600">{errors.chassisNumber}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Combustível */}
            <div className="space-y-2">
              <Label htmlFor="fuelType">Tipo de Combustível *</Label>
              <Select
                value={formData.fuelType}
                onValueChange={(value) => handleInputChange('fuelType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o combustível" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map((fuel) => (
                    <SelectItem key={fuel} value={fuel}>
                      {fuel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fuelType && (
                <p className="text-sm text-red-600">{errors.fuelType}</p>
              )}
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleInputChange('observations', e.target.value)}
              placeholder="Informações adicionais sobre o veículo"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Veículo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
