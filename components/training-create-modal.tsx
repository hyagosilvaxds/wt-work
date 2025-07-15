'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createTraining, patchTraining, type CreateTrainingData } from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface Training {
  id: string
  title: string
  description?: string
  durationHours: number
  isActive: boolean
  validityDays?: number
}

interface TrainingCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  training?: Training | null
}

export function TrainingCreateModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  training 
}: TrainingCreateModalProps) {
  const [formData, setFormData] = useState<CreateTrainingData>({
    title: "",
    description: "",
    durationHours: 1,
    isActive: true,
    validityDays: undefined,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Atualizar formData quando training mudar
  useEffect(() => {
    if (training) {
      setFormData({
        title: training.title,
        description: training.description || "",
        durationHours: training.durationHours,
        isActive: training.isActive,
        validityDays: training.validityDays,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        durationHours: 1,
        isActive: true,
        validityDays: undefined,
      })
    }
  }, [training])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (formData.durationHours <= 0) {
      toast({
        title: "Erro",
        description: "A duração deve ser maior que zero",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      const response = training 
        ? await patchTraining(training.id, formData)
        : await createTraining(formData)
      
      console.log('Create/Update Response:', response) // Debug log
      
      // A API pode retornar diferentes estruturas, vamos assumir sucesso se não houver erro
      toast({
        title: "Sucesso",
        description: training 
          ? "Treinamento atualizado com sucesso" 
          : "Treinamento criado com sucesso",
      })
      onSuccess()
      onClose()
      
      // Reset form se for criação
      if (!training) {
        setFormData({
          title: "",
          description: "",
          durationHours: 1,
          isActive: true,
          validityDays: undefined,
        })
      }
    } catch (error) {
      console.error('Erro ao salvar treinamento:', error)
      toast({
        title: "Erro",
        description: training 
          ? "Falha ao atualizar treinamento" 
          : "Falha ao criar treinamento",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      // Reset form se for criação
      if (!training) {
        setFormData({
          title: "",
          description: "",
          durationHours: 1,
          isActive: true,
          validityDays: undefined,
        })
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {training ? "Editar Treinamento" : "Novo Treinamento"}
          </DialogTitle>
          <DialogDescription>
            {training 
              ? "Edite as informações do treinamento." 
              : "Preencha as informações para criar um novo treinamento."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ex: Segurança do Trabalho"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o conteúdo do treinamento..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="durationHours">Duração (horas) *</Label>
              <Input
                id="durationHours"
                type="number"
                min="1"
                max="1000"
                placeholder="8"
                value={formData.durationHours}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  durationHours: parseInt(e.target.value) || 1 
                })}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validityDays">Validade (dias)</Label>
              <Input
                id="validityDays"
                type="number"
                min="1"
                placeholder="365"
                value={formData.validityDays || ""}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  validityDays: e.target.value ? parseInt(e.target.value) : undefined
                })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              disabled={loading}
            />
            <Label htmlFor="isActive">Treinamento ativo</Label>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-primary-500 hover:bg-primary-600"
            >
              {loading ? "Salvando..." : training ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
