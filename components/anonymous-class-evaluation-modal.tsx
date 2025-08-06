"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Star,
  Users,
  BookOpen,
  Building2,
  UserCheck,
  Loader2,
  CheckCircle,
  Shield
} from "lucide-react"
import { 
  createAnonymousClassEvaluation,
  AnonymousClassEvaluationData
} from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface AnonymousClassEvaluationModalProps {
  isOpen: boolean
  onClose: () => void
  turma: {
    id: string
    training: {
      title: string
    }
  } | null
}

interface EvaluationForm extends Omit<AnonymousClassEvaluationData, 'classId'> {}

export function AnonymousClassEvaluationModal({
  isOpen,
  onClose,
  turma
}: AnonymousClassEvaluationModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [evaluation, setEvaluation] = useState<EvaluationForm>({
    observations: ""
  })

  const handleRating = (field: keyof EvaluationForm, value: number) => {
    setEvaluation(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    if (!turma) return

    // Verificar se pelo menos uma avaliação foi feita
    const hasAnyRating = Object.keys(evaluation).some(key => 
      key !== 'observations' && evaluation[key as keyof EvaluationForm] !== undefined
    )

    if (!hasAnyRating && !evaluation.observations?.trim()) {
      toast({
        title: "Avaliação incompleta",
        description: "Por favor, avalie pelo menos um aspecto ou deixe um comentário.",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      
      const evaluationData: AnonymousClassEvaluationData = {
        classId: turma.id,
        ...evaluation
      }

      await createAnonymousClassEvaluation(evaluationData)
      
      setSubmitted(true)
      toast({
        title: "Avaliação enviada!",
        description: "Sua avaliação foi registrada de forma anônima.",
        variant: "default"
      })
      
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setEvaluation({ observations: "" })
      }, 2000)
      
    } catch (error: any) {
      console.error('Erro ao enviar avaliação:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar avaliação",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setEvaluation({ observations: "" })
      setSubmitted(false)
    }
  }

  const renderStarRating = (field: keyof EvaluationForm, label: string) => {
    const currentValue = evaluation[field] as number | undefined
    
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRating(field, value)}
              className="transition-colors"
              disabled={loading || submitted}
            >
              <Star
                className={`h-6 w-6 ${
                  currentValue && currentValue >= value
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 hover:text-yellow-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (!turma) return null

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Avaliação Enviada!</h3>
            <p className="text-gray-600">
              Obrigado por sua avaliação anônima. Seu feedback é muito importante para nós.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Avaliação Anônima - {turma.training.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Aviso de Anonimato */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">100% Anônimo</span>
            </div>
            <p className="text-sm text-green-700">
              Esta avaliação é completamente anônima. Nenhuma informação pessoal será associada às suas respostas.
            </p>
          </div>

          {/* Conteúdo/Programa */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Conteúdo/Programa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderStarRating('contentAdequacy', 'Adequação do conteúdo')}
              {renderStarRating('contentApplicability', 'Aplicabilidade profissional')}
              {renderStarRating('contentTheoryPracticeBalance', 'Equilíbrio teoria/prática')}
              {renderStarRating('contentNewKnowledge', 'Nível de novos conhecimentos')}
            </CardContent>
          </Card>

          {/* Instrutor/Palestrante */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-purple-600" />
                Instrutor/Palestrante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderStarRating('instructorKnowledge', 'Conhecimentos do assunto')}
              {renderStarRating('instructorDidactic', 'Didática utilizada')}
              {renderStarRating('instructorCommunication', 'Facilidade na comunicação')}
              {renderStarRating('instructorAssimilation', 'Verificação da assimilação')}
              {renderStarRating('instructorPracticalApps', 'Aplicações práticas')}
            </CardContent>
          </Card>

          {/* Infraestrutura e Logística */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-orange-600" />
                Infraestrutura e Logística
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderStarRating('infrastructureFacilities', 'Adequação das instalações')}
              {renderStarRating('infrastructureClassrooms', 'Salas de aula')}
              {renderStarRating('infrastructureSchedule', 'Carga horária')}
            </CardContent>
          </Card>

          {/* Participação dos Alunos */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
                Participação dos Alunos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderStarRating('participantsUnderstanding', 'Facilidade de entendimento')}
              {renderStarRating('participantsRelationship', 'Relação com participantes')}
              {renderStarRating('participantsConsideration', 'Autoavaliação da participação')}
              {renderStarRating('participantsInstructorRel', 'Relação com instrutores')}
            </CardContent>
          </Card>

          {/* Comentários */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Comentários Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Deixe seus comentários ou sugestões (opcional)"
                value={evaluation.observations || ""}
                onChange={(e) => setEvaluation(prev => ({ ...prev, observations: e.target.value }))}
                disabled={loading || submitted}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Avaliação'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
