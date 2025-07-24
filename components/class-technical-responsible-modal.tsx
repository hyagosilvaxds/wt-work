"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { 
  UserCheck,
  UserX,
  Users,
  Calendar,
  BookOpen,
  Mail,
  UserCog,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  getTechnicalResponsibles,
  linkTechnicalResponsibleToClass,
  unlinkTechnicalResponsibleFromClass,
  type TechnicalResponsible,
  type ClassWithTechnicalResponsible
} from "@/lib/api/superadmin"

interface ClassTechnicalResponsibleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  turma: {
    id: string
    training: {
      title: string
    }
    technicalResponsible?: {
      id: string
      name: string
      profession?: string
      email?: string
      professionalRegistry?: string
    }
    status: string
    startDate: string
    endDate: string
  } | null
  readOnly?: boolean
}

export function ClassTechnicalResponsibleModal({
  isOpen,
  onClose,
  onSuccess,
  turma,
  readOnly = false
}: ClassTechnicalResponsibleModalProps) {
  const [technicalResponsibles, setTechnicalResponsibles] = useState<TechnicalResponsible[]>([])
  const [selectedTechnicalResponsibleId, setSelectedTechnicalResponsibleId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [loadingResponsibles, setLoadingResponsibles] = useState(false)
  const { toast } = useToast()

  // Carregar responsáveis técnicos
  const loadTechnicalResponsibles = async () => {
    try {
      setLoadingResponsibles(true)
      const response = await getTechnicalResponsibles()
      const data = response.technicalResponsibles || response
      setTechnicalResponsibles(data.filter((tr: TechnicalResponsible) => tr.isActive))
    } catch (error) {
      console.error('Erro ao carregar responsáveis técnicos:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar responsáveis técnicos",
        variant: "destructive",
      })
    } finally {
      setLoadingResponsibles(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadTechnicalResponsibles()
      setSelectedTechnicalResponsibleId("")
    }
  }, [isOpen])

  // Vincular responsável técnico
  const handleLink = async () => {
    if (!turma || !selectedTechnicalResponsibleId) return

    try {
      setLoading(true)
      await linkTechnicalResponsibleToClass(selectedTechnicalResponsibleId, turma.id)
      
      toast({
        title: "Sucesso",
        description: "Responsável técnico vinculado com sucesso",
      })
      
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erro ao vincular responsável técnico:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao vincular responsável técnico",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Desvincular responsável técnico
  const handleUnlink = async () => {
    if (!turma) return

    try {
      setLoading(true)
      await unlinkTechnicalResponsibleFromClass(turma.id)
      
      toast({
        title: "Sucesso",
        description: "Responsável técnico desvinculado com sucesso",
      })
      
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erro ao desvincular responsável técnico:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao desvincular responsável técnico",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EM_ABERTO":
        return "bg-yellow-100 text-yellow-800"
      case "EM_ANDAMENTO":
        return "bg-blue-100 text-blue-800"
      case "CONCLUIDA":
        return "bg-green-100 text-green-800"
      case "CANCELADA":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!turma) return null

  // Permite modificação em turmas de qualquer status
  const canModify = !readOnly
  const currentTechnicalResponsible = turma.technicalResponsible

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <UserCog className="h-6 w-6" />
            {readOnly ? 'Visualizar' : ''} Responsável Técnico
          </DialogTitle>
          <DialogDescription>
            {readOnly ? 'Visualize o responsável técnico da turma' : 'Gerencie o responsável técnico da turma'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Turma */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5" />
                Informações da Turma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium text-lg">{turma.training.title}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {formatDate(turma.startDate)} - {formatDate(turma.endDate)}
                  </div>
                  <Badge className={getStatusColor(turma.status)}>
                    {turma.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nota informativa para turmas concluídas */}
          {turma.status === "CONCLUIDO" && (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">Turma Concluída</p>
                <p className="text-sm text-blue-700">
                  Vinculação de responsável técnico disponível para fins de documentação e certificação
                </p>
              </div>
            </div>
          )}

          {/* Status Atual do Responsável Técnico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Status Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTechnicalResponsible ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium text-green-900">Responsável Técnico Vinculado</p>
                      <p className="text-sm text-green-700">Esta turma possui um responsável técnico ativo</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-lg">{currentTechnicalResponsible.name}</p>
                      {currentTechnicalResponsible.profession && (
                        <p className="text-gray-600">{currentTechnicalResponsible.profession}</p>
                      )}
                    </div>
                    
                    {currentTechnicalResponsible.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {currentTechnicalResponsible.email}
                      </div>
                    )}
                    
                    {currentTechnicalResponsible.professionalRegistry && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Registro:</span> {currentTechnicalResponsible.professionalRegistry}
                      </div>
                    )}
                  </div>

                  {canModify && (
                    <Button
                      variant="destructive"
                      onClick={handleUnlink}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Desvinculando...
                        </>
                      ) : (
                        <>
                          <UserX className="h-4 w-4 mr-2" />
                          Desvincular Responsável Técnico
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium text-yellow-900">Nenhum Responsável Técnico</p>
                      <p className="text-sm text-yellow-700">Esta turma não possui um responsável técnico vinculado</p>
                    </div>
                  </div>

                  {canModify && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Selecionar Responsável Técnico
                        </label>
                        <Select
                          value={selectedTechnicalResponsibleId}
                          onValueChange={setSelectedTechnicalResponsibleId}
                          disabled={loadingResponsibles}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um responsável técnico" />
                          </SelectTrigger>
                          <SelectContent>
                            {technicalResponsibles.map((tr) => (
                              <SelectItem key={tr.id} value={tr.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{tr.name}</span>
                                  {tr.profession && (
                                    <span className="text-sm text-gray-500">{tr.profession}</span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={handleLink}
                        disabled={loading || !selectedTechnicalResponsibleId}
                        className="w-full"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Vinculando...
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Vincular Responsável Técnico
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {!canModify && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <AlertCircle className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Modo Visualização</p>
                <p className="text-sm text-gray-700">
                  {readOnly ? 'Você pode apenas visualizar as informações do responsável técnico' : 'O responsável técnico pode ser vinculado a turmas de qualquer status'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
