"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { 
  Car, 
  Calendar, 
  User, 
  Hash, 
  Fuel, 
  Palette, 
  FileText, 
  MapPin,
  Settings,
  CheckCircle,
  XCircle
} from "lucide-react"
import { getVehicleById, type Vehicle } from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface VehicleDetailsModalProps {
  vehicleId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VehicleDetailsModal({ 
  vehicleId, 
  open, 
  onOpenChange 
}: VehicleDetailsModalProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open && vehicleId) {
      fetchVehicle()
    }
  }, [open, vehicleId])

  const fetchVehicle = async () => {
    try {
      setLoading(true)
      const data = await getVehicleById(vehicleId)
      setVehicle(data)
    } catch (error) {
      console.error('Erro ao buscar veículo:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do veículo",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para formatar placa
  const formatLicensePlate = (plate: string) => {
    // Remove caracteres não alfanuméricos
    const clean = plate.replace(/[^A-Z0-9]/g, '')
    
    // Formato antigo: ABC1234 -> ABC-1234
    if (clean.length === 7 && /^[A-Z]{3}[0-9]{4}$/.test(clean)) {
      return `${clean.slice(0, 3)}-${clean.slice(3)}`
    }
    
    // Formato Mercosul: ABC1D23 -> ABC1D23 (sem alteração)
    if (clean.length === 7 && /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(clean)) {
      return clean
    }
    
    return plate
  }

  // Função para formatar RENAVAM
  const formatRenavam = (renavam: string) => {
    return renavam.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1.$2.$3.$4')
  }

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Função para obter label da categoria
  const getCategoryLabel = (category: string) => {
    const categories = {
      'A': 'A - Motocicletas',
      'B': 'B - Automóveis',
      'C': 'C - Caminhões',
      'D': 'D - Ônibus',
      'E': 'E - Carreta'
    }
    return categories[category as keyof typeof categories] || category
  }

  // Função para obter cor do badge da categoria
  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      'A': 'bg-red-100 text-red-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-green-100 text-green-800',
      'D': 'bg-purple-100 text-purple-800',
      'E': 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
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

  if (!vehicle) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Car className="h-6 w-6" />
            {vehicle.brand} {vehicle.model} ({vehicle.year})
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas do veículo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Categoria */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={getCategoryBadgeColor(vehicle.category)}>
                {getCategoryLabel(vehicle.category)}
              </Badge>
              <Badge variant={vehicle.isActive ? "default" : "secondary"} className="flex items-center gap-1">
                {vehicle.isActive ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Ativo
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Inativo
                  </>
                )}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Dados do Veículo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Car className="h-5 w-5" />
                Dados do Veículo
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Placa</p>
                    <p className="font-mono font-medium text-lg">{formatLicensePlate(vehicle.licensePlate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2" style={{ backgroundColor: vehicle.color.toLowerCase() }} />
                  <div>
                    <p className="text-sm text-gray-600">Cor</p>
                    <p className="font-medium">{vehicle.color}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Fuel className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Combustível</p>
                    <p className="font-medium">{vehicle.fuelType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">RENAVAM</p>
                    <p className="font-mono font-medium">{formatRenavam(vehicle.renavam)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Chassi</p>
                    <p className="font-mono font-medium text-sm">{vehicle.chassisNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Instrutor
              </h3>

              {vehicle.instructor ? (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="font-medium">{vehicle.instructor.name}</p>
                  <p className="text-sm text-gray-600">{vehicle.instructor.email}</p>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500">Instrutor não disponível</p>
                </div>
              )}

              <h3 className="font-semibold text-lg flex items-center gap-2 mt-6">
                <Calendar className="h-5 w-5" />
                Datas
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Cadastrado em</p>
                  <p className="font-medium">{formatDate(vehicle.createdAt)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Última atualização</p>
                  <p className="font-medium">{formatDate(vehicle.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          {vehicle.observations && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Observações
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{vehicle.observations}</p>
                </div>
              </div>
            </>
          )}

          {/* Informações Técnicas */}
          <Separator />
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Informações Técnicas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">ID do Veículo</p>
                <p className="font-mono text-xs">{vehicle.id}</p>
              </div>
              <div>
                <p className="text-gray-600">ID do Instrutor</p>
                <p className="font-mono text-xs">{vehicle.instructorId}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className={vehicle.isActive ? "text-green-600" : "text-red-600"}>
                  {vehicle.isActive ? "Ativo" : "Inativo"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Categoria CNH</p>
                <p className="font-medium">{vehicle.category}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
