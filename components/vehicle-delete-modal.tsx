"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteVehicle, type Vehicle } from "@/lib/api/superadmin"

interface VehicleDeleteModalProps {
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
  onVehicleDeleted: () => void
}

export function VehicleDeleteModal({ 
  vehicle, 
  open, 
  onOpenChange, 
  onVehicleDeleted 
}: VehicleDeleteModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      setLoading(true)
      
      await deleteVehicle(vehicle.id)
      
      onVehicleDeleted()
      
      toast({
        title: "Sucesso",
        description: "Veículo excluído com sucesso",
      })
    } catch (error: any) {
      console.error('Erro ao excluir veículo:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao excluir veículo",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 mb-1">
                  Atenção: Exclusão Permanente
                </h4>
                <p className="text-sm text-red-700">
                  Você está prestes a excluir permanentemente o veículo:
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Veículo:</span>
                <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Placa:</span>
                <span className="font-mono font-medium">{formatLicensePlate(vehicle.licensePlate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ano:</span>
                <span className="font-medium">{vehicle.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categoria:</span>
                <span className="font-medium">{vehicle.category}</span>
              </div>
              {vehicle.instructor && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Instrutor:</span>
                  <span className="font-medium">{vehicle.instructor.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium mb-1">Consequências da exclusão:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>O veículo será removido permanentemente do sistema</li>
                  <li>Histórico de aulas e atividades relacionadas podem ser afetados</li>
                  <li>Esta ação não pode ser desfeita</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Alternativa recomendada:</p>
                <p>
                  Considere desativar o veículo em vez de excluí-lo. 
                  Isso manterá o histórico preservado.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Excluindo..." : "Confirmar Exclusão"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
