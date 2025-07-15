'use client'

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
import { deleteClass } from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle } from "lucide-react"

interface Class {
  id: string
  training?: {
    title: string
  }
  startDate: Date | string
  endDate: Date | string
  location?: string
}

interface ClassDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  classItem: Class | null
}

export function ClassDeleteModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  classItem 
}: ClassDeleteModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!classItem) return

    setLoading(true)
    try {
      await deleteClass(classItem.id)
      toast({
        title: "Sucesso",
        description: "Turma excluída com sucesso!",
      })
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erro ao excluir aula:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao excluir turma",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date | string) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. A turma será permanentemente excluída.
          </DialogDescription>
        </DialogHeader>
        
        {classItem && (
          <div className="space-y-3 py-4">
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <p><strong>Treinamento:</strong> {classItem.training?.title || "N/A"}</p>
              <p><strong>Início:</strong> {formatDate(classItem.startDate)}</p>
              <p><strong>Fim:</strong> {formatDate(classItem.endDate)}</p>
              {classItem.location && (
                <p><strong>Local:</strong> {classItem.location}</p>
              )}
            </div>
            <p className="text-sm text-red-600 font-medium">
              Tem certeza de que deseja excluir esta turma?
            </p>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
