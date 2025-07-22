"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import { deleteTechnicalResponsible } from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface TechnicalResponsibleDeleteModalProps {
  technicalResponsibleId: string
  technicalResponsibleName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onTechnicalResponsibleDeleted: () => void
}

export function TechnicalResponsibleDeleteModal({ 
  technicalResponsibleId, 
  technicalResponsibleName,
  open, 
  onOpenChange, 
  onTechnicalResponsibleDeleted 
}: TechnicalResponsibleDeleteModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      setLoading(true)
      await deleteTechnicalResponsible(technicalResponsibleId)
      toast({
        title: "Sucesso!",
        description: "Responsável técnico excluído com sucesso!",
        variant: "default",
      })
      onOpenChange(false)
      onTechnicalResponsibleDeleted()
    } catch (error: any) {
      console.error('Erro ao deletar responsável técnico:', error)
      
      if (error.response?.status === 404) {
        toast({
          title: "Não encontrado",
          description: "Responsável técnico não encontrado",
          variant: "destructive",
        })
      } else if (error.response?.status === 400) {
        toast({
          title: "Erro de validação",
          description: error.response.data.message || "Não é possível excluir este responsável técnico",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro",
          description: "Erro ao excluir responsável técnico. Tente novamente.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
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
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o responsável técnico e todos os dados associados.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Responsável técnico que será excluído:</strong>
            </p>
            <p className="text-red-900 font-medium mt-1">
              {technicalResponsibleName}
            </p>
          </div>
          
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>• O responsável técnico será removido permanentemente</p>
            <p>• A assinatura digital também será excluída</p>
            <p>• Esta ação não pode ser desfeita</p>
          </div>
        </div>

        <DialogFooter>
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
            {loading ? "Excluindo..." : "Excluir Permanentemente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
