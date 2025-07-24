"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Building2,
  Save,
  Loader2,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { 
  getCompanyEvaluationByClass, 
  createCompanyEvaluation,
  updateCompanyEvaluation,
  deleteCompanyEvaluation,
  CompanyEvaluationData,
  CompanyEvaluation
} from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface CompanyEvaluationModalProps {
  isOpen: boolean
  onClose: () => void
  turma: {
    id: string
    training: {
      title: string
    }
    client?: {
      name: string
    }
  } | null
}

interface EvaluationFormData {
  practicalContent: string
  hasEquipment: boolean
  equipmentDescription: string
  trainingDifficulties: string
  companyNeeds: string
  observations: string
  feedback: string
}

export function CompanyEvaluationModal({ isOpen, onClose, turma }: CompanyEvaluationModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [evaluation, setEvaluation] = useState<CompanyEvaluation | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<EvaluationFormData>({
    practicalContent: "",
    hasEquipment: false,
    equipmentDescription: "",
    trainingDifficulties: "",
    companyNeeds: "",
    observations: "",
    feedback: ""
  })

  // Carregar dados quando o modal abrir
  useEffect(() => {
    if (isOpen && turma) {
      loadEvaluation()
    } else if (!isOpen) {
      // Limpar dados quando o modal for fechado
      setEvaluation(null)
      setIsEditing(false)
      setFormData({
        practicalContent: "",
        hasEquipment: false,
        equipmentDescription: "",
        trainingDifficulties: "",
        companyNeeds: "",
        observations: "",
        feedback: ""
      })
    }
  }, [isOpen, turma])

  const loadEvaluation = async () => {
    if (!turma) return
    
    setLoading(true)
    try {
      const evaluationData = await getCompanyEvaluationByClass(turma.id)
      setEvaluation(evaluationData)
      
      if (evaluationData) {
        setFormData({
          practicalContent: evaluationData.practicalContent || "",
          hasEquipment: evaluationData.hasEquipment || false,
          equipmentDescription: evaluationData.equipmentDescription || "",
          trainingDifficulties: evaluationData.trainingDifficulties || "",
          companyNeeds: evaluationData.companyNeeds || "",
          observations: evaluationData.observations || "",
          feedback: evaluationData.feedback || ""
        })
      }
    } catch (error: any) {
      console.error('Erro ao carregar avaliação da empresa:', error)
      
      // Se for erro 404, não há avaliação ainda
      if (error.response?.status !== 404) {
        toast({
          title: "Erro",
          description: "Erro ao carregar avaliação da empresa",
          variant: "destructive"
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEvaluation = async () => {
    if (!turma) return
    
    setLoading(true)
    try {
      const evaluationData: CompanyEvaluationData = {
        classId: turma.id,
        ...formData
      }

      if (evaluation) {
        await updateCompanyEvaluation(turma.id, formData)
        toast({
          title: "Sucesso",
          description: "Avaliação da empresa atualizada com sucesso"
        })
      } else {
        await createCompanyEvaluation(evaluationData)
        toast({
          title: "Sucesso",
          description: "Avaliação da empresa criada com sucesso"
        })
      }

      await loadEvaluation()
      setIsEditing(false)
    } catch (error: any) {
      console.error('Erro ao salvar avaliação da empresa:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao salvar avaliação da empresa",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvaluation = async () => {
    if (!turma || !evaluation) return
    
    setLoading(true)
    try {
      await deleteCompanyEvaluation(turma.id)
      toast({
        title: "Sucesso",
        description: "Avaliação da empresa removida com sucesso"
      })
      setEvaluation(null)
      setFormData({
        practicalContent: "",
        hasEquipment: false,
        equipmentDescription: "",
        trainingDifficulties: "",
        companyNeeds: "",
        observations: "",
        feedback: ""
      })
    } catch (error: any) {
      console.error('Erro ao remover avaliação da empresa:', error)
      toast({
        title: "Erro",
        description: "Erro ao remover avaliação da empresa",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStartEditing = () => {
    setIsEditing(true)
  }

  const handleCancelEditing = () => {
    setIsEditing(false)
    // Restaurar dados originais
    if (evaluation) {
      setFormData({
        practicalContent: evaluation.practicalContent || "",
        hasEquipment: evaluation.hasEquipment || false,
        equipmentDescription: evaluation.equipmentDescription || "",
        trainingDifficulties: evaluation.trainingDifficulties || "",
        companyNeeds: evaluation.companyNeeds || "",
        observations: evaluation.observations || "",
        feedback: evaluation.feedback || ""
      })
    }
  }

  if (!turma) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Avaliação da Empresa Contratante - {turma.training.title}
          </DialogTitle>
          {turma.client && (
            <p className="text-sm text-gray-600">
              Cliente: {turma.client.name}
            </p>
          )}
        </DialogHeader>

        {loading && !evaluation && !isEditing ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Carregando avaliação...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status da Avaliação */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Status da Avaliação</span>
                  <div className="flex items-center gap-2">
                    {evaluation ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Avaliada
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Não avaliada
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              {evaluation && !isEditing && (
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Avaliada em: {new Date(evaluation.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleStartEditing}
                        disabled={loading}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteEvaluation}
                        disabled={loading}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Formulário de Avaliação */}
            {(isEditing || !evaluation) && (
              <div className="space-y-6">
                {/* Aula Prática */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Aula Prática</CardTitle>
                    <p className="text-sm text-gray-500">
                      Descreva todo conteúdo aplicado na aula prática
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="As aulas foram abordadas dentro da realidade da empresa, sendo dividida entre teóricas e práticas. As aulas práticas foram: montagem de sistemas, resgate de vítima, montagem de maca sked, sistema de polia, entre outras."
                      value={formData.practicalContent}
                      onChange={(e) => setFormData(prev => ({ ...prev, practicalContent: e.target.value }))}
                      rows={4}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Equipamentos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">A empresa possuía equipamentos para o treinamento?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hasEquipment"
                        checked={formData.hasEquipment}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasEquipment: checked }))}
                      />
                      <Label htmlFor="hasEquipment">
                        {formData.hasEquipment ? "Sim, a empresa possui equipamentos" : "Não, a empresa não possui equipamentos"}
                      </Label>
                    </div>
                    
                    {formData.hasEquipment && (
                      <div className="space-y-2">
                        <Label htmlFor="equipmentDescription">Se sim, quais?</Label>
                        <Textarea
                          id="equipmentDescription"
                          placeholder="Descreva os equipamentos que a empresa possui..."
                          value={formData.equipmentDescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, equipmentDescription: e.target.value }))}
                          rows={3}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Dificuldades */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cite as principais dificuldades na realização do treinamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Nenhuma dificuldade encontrada a empresa nos auxiliou em todas as etapas para o desenvolvimento do curso ministrado."
                      value={formData.trainingDifficulties}
                      onChange={(e) => setFormData(prev => ({ ...prev, trainingDifficulties: e.target.value }))}
                      rows={3}
                    />
                  </CardContent>
                </Card>

                {/* Necessidades da Empresa */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Descreva a necessidade da empresa contratante</CardTitle>
                    <p className="text-sm text-gray-500">
                      (equipamento e/ou processos que necessitam ser implantados para que os funcionários tenham êxito em suas atividades)
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="A empresa possui recursos para atendimento."
                      value={formData.companyNeeds}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyNeeds: e.target.value }))}
                      rows={3}
                    />
                  </CardContent>
                </Card>

                {/* Observações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Observação</CardTitle>
                    <p className="text-sm text-gray-500">
                      (descreva qualquer observação ocorrido no treinamento, atrasos, colaboradores que não concluíram o treinamento, não realizaram avaliação, aula prática, etc)
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="N/A"
                      value={formData.observations}
                      onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                      rows={3}
                    />
                  </CardContent>
                </Card>

                {/* Crítica/Elogio */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Deixe uma Crítica/Elogio sobre a empresa contratante</CardTitle>
                    <p className="text-sm text-gray-500">
                      (deixe uma crítica/elogio, seja positiva ou não para que possa haver melhoria contínua)
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Empresa voltada neste momento para organização e capacitação dos colaboradores para atuação direta e indireta em ambientes confinados, realizando todas as etapas para entrada e trabalho como avaliações de risco, medições de gases, dispositivos de controle de entrada."
                      value={formData.feedback}
                      onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                      rows={4}
                    />
                  </CardContent>
                </Card>

                {/* Ações */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={evaluation ? handleCancelEditing : onClose}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveEvaluation}
                    disabled={loading}
                  >
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {evaluation ? 'Atualizar' : 'Salvar'} Avaliação
                  </Button>
                </div>
              </div>
            )}

            {/* Visualização da Avaliação */}
            {evaluation && !isEditing && (
              <div className="space-y-6">
                {/* Aula Prática */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Aula Prática</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">
                      {evaluation.practicalContent || "Não informado"}
                    </p>
                  </CardContent>
                </Card>

                {/* Equipamentos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Equipamentos da Empresa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={evaluation.hasEquipment ? "default" : "secondary"}>
                          {evaluation.hasEquipment ? "Possui equipamentos" : "Não possui equipamentos"}
                        </Badge>
                      </div>
                      {evaluation.hasEquipment && evaluation.equipmentDescription && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Descrição dos equipamentos:</Label>
                          <p className="text-sm mt-1 whitespace-pre-wrap">
                            {evaluation.equipmentDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Dificuldades */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dificuldades no Treinamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">
                      {evaluation.trainingDifficulties || "Não informado"}
                    </p>
                  </CardContent>
                </Card>

                {/* Necessidades da Empresa */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Necessidades da Empresa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">
                      {evaluation.companyNeeds || "Não informado"}
                    </p>
                  </CardContent>
                </Card>

                {/* Observações */}
                {evaluation.observations && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Observações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">
                        {evaluation.observations}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Feedback */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Crítica/Elogio sobre a Empresa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">
                      {evaluation.feedback || "Não informado"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Botão para criar nova avaliação */}
            {!evaluation && !isEditing && (
              <Card>
                <CardContent className="p-12">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma avaliação da empresa
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Esta turma ainda não possui uma avaliação da empresa contratante.
                    </p>
                    <Button 
                      className="gap-2" 
                      onClick={() => setIsEditing(true)}
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4" />
                      Criar Avaliação da Empresa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
