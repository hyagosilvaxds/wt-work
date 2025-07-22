'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Clock, Calendar, BookOpen, FileText } from "lucide-react"

interface Training {
  id: string
  title: string
  description?: string
  durationHours: number
  programContent?: string
  isActive: boolean
  validityDays?: number
  createdAt: string
  updatedAt: string
}

interface TrainingDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  training: Training | null
}

export function TrainingDetailsModal({ 
  isOpen, 
  onClose, 
  training 
}: TrainingDetailsModalProps) {
  if (!training) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {training.title}
          </DialogTitle>
          <DialogDescription>
            Informações completas do treinamento
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status e Informações Básicas */}
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={training.isActive ? "default" : "secondary"}
              className={training.isActive ? "bg-primary-500" : ""}
            >
              {training.isActive ? "Ativo" : "Inativo"}
            </Badge>
            <Badge variant="outline">
              <Clock className="mr-1 h-3 w-3" />
              {training.durationHours} hora{training.durationHours !== 1 ? 's' : ''}
            </Badge>
            {training.validityDays && (
              <Badge variant="outline">
                <Calendar className="mr-1 h-3 w-3" />
                Válido por {training.validityDays} dias
              </Badge>
            )}
          </div>

          {/* Descrição */}
          {training.description && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Descrição</Label>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {training.description}
                </p>
              </div>
            </div>
          )}

          {/* Conteúdo Programático */}
          {training.programContent && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Conteúdo Programático
              </Label>
              <div className="bg-gray-50 p-4 rounded-md border">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {training.programContent}
                </pre>
              </div>
            </div>
          )}

          {/* Informações de Sistema */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Criado em</Label>
              <p className="text-sm text-gray-700">
                {formatDate(training.createdAt)}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-500">Atualizado em</Label>
              <p className="text-sm text-gray-700">
                {formatDate(training.updatedAt)}
              </p>
            </div>
          </div>

          {/* ID do Treinamento */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-500">ID do Treinamento</Label>
            <p className="text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded">
              {training.id}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
