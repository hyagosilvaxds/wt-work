"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteInstructor } from "@/lib/api/superadmin"

interface InstructorDeleteModalProps {
  instructorId: string
  instructorName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onInstructorDeleted?: () => void
}

export function InstructorDeleteModal({ 
  instructorId, 
  instructorName, 
  open, 
  onOpenChange, 
  onInstructorDeleted 
}: InstructorDeleteModalProps) {
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setDeleting(true)
    
    try {
      await deleteInstructor(instructorId)
      
      toast({
        title: "Sucesso!",
        description: "Instrutor excluído com sucesso.",
        variant: "default",
      })
      
      onOpenChange(false)
      
      // Chama callback para atualizar lista
      if (onInstructorDeleted) {
        onInstructorDeleted()
      }
    } catch (error) {
      console.error("Erro ao deletar instrutor:", error)
      toast({
        title: "Erro",
        description: "Erro ao excluir instrutor. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Confirmar Exclusão
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Atenção: Esta ação não pode ser desfeita
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Você está prestes a excluir permanentemente o instrutor:
                  </p>
                  <p className="font-semibold mt-1">"{instructorName}"</p>
                  <p className="mt-2">
                    Todas as informações relacionadas a este instrutor serão perdidas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>O que será perdido:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Dados pessoais e de contato</li>
              <li>Histórico de aulas ministradas</li>
              <li>Documentos e certificações</li>
              <li>Avaliações e feedback</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={deleting}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Excluir Permanentemente
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
