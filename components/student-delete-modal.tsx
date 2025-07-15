"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { deleteStudent } from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: string
  name: string
  email?: string
}

interface StudentDeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  student: Student | null
}

export function StudentDeleteModal({ open, onOpenChange, onSuccess, student }: StudentDeleteModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!student) return

    setLoading(true)
    try {
      await deleteStudent(student.id)
      toast({
        title: "Sucesso",
        description: "Estudante excluído com sucesso!"
      })
      
      onOpenChange(false)
      onSuccess()
    } catch (error: any) {
      console.error('Erro ao deletar estudante:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao excluir estudante",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!student) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Excluir Estudante</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este estudante?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900">{student.name}</h4>
            {student.email && (
              <p className="text-sm text-gray-600">{student.email}</p>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-4">
            Esta ação não pode ser desfeita. O estudante será permanentemente removido do sistema.
          </p>
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
