"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Save,
  FileText,
  Users,
  BookOpen,
  Building2,
  UserCheck,
  Loader2,
  Calculator,
  Shield,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { 
  createManualEvaluationStats,
  updateManualEvaluationStats,
  getManualEvaluationStats,
  ManualEvaluationStatsData,
  ManualEvaluationStatsResponse,
  NotaStats
} from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface ManualEvaluationStatsModalProps {
  isOpen: boolean
  onClose: () => void
  turma: {
    id: string
    training: {
      title: string
    }
    students: any[]
  } | null
  readOnly?: boolean
}

export function ManualEvaluationStatsModal({
  isOpen,
  onClose,
  turma,
  readOnly = false
}: ManualEvaluationStatsModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [existingStats, setExistingStats] = useState<ManualEvaluationStatsResponse | null>(null)
  
  // Formulário
  const [collectedBy, setCollectedBy] = useState("")
  const [totalEvaluationsCollected, setTotalEvaluationsCollected] = useState<number>(0)
  const [collectedComments, setCollectedComments] = useState("")
  const [observations, setObservations] = useState("")

  // Estatísticas por categoria
  const [contentStats, setContentStats] = useState<{
    adequacy: NotaStats
    applicability: NotaStats
    theoryPractice: NotaStats
    newKnowledge: NotaStats
  }>({
    adequacy: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
    applicability: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
    theoryPractice: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
    newKnowledge: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 }
  })

  const [instructorStats, setInstructorStats] = useState<{
    knowledge: NotaStats
    didactic: NotaStats
    communication: NotaStats
    assimilation: NotaStats
    practicalApps: NotaStats
  }>({
    knowledge: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
    didactic: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
    communication: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
    assimilation: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
    practicalApps: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 }
  })

  const [infrastructureStats, setInfrastructureStats] = useState<{
    facilities: NotaStats
    classrooms: NotaStats
    schedule: NotaStats
  }>({
    facilities: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
    classrooms: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
    schedule: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 }
  })

  const [participantsStats, setParticipantsStats] = useState<{
    understanding: NotaStats
    relationship: NotaStats
    consideration: NotaStats
    instructorRel: NotaStats
  }>({
    understanding: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
    relationship: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
    consideration: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
    instructorRel: { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 }
  })

  // Carregar dados existentes quando o modal abrir
  useEffect(() => {
    if (isOpen && turma) {
      loadExistingStats()
    }
  }, [isOpen, turma])

  const loadExistingStats = async () => {
    if (!turma) return

    try {
      setLoading(true)
      const stats = await getManualEvaluationStats(turma.id)
      setExistingStats(stats)
      
      // Preencher formulário com dados existentes
      setCollectedBy(stats.collectedBy)
      setTotalEvaluationsCollected(stats.totalEvaluationsCollected)
      setCollectedComments(stats.collectedComments || "")
      setObservations(stats.observations || "")
      
      // Preencher estatísticas
      if (stats.statistics.contentStats) {
        setContentStats({
          adequacy: stats.statistics.contentStats.adequacy || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
          applicability: stats.statistics.contentStats.applicability || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
          theoryPractice: stats.statistics.contentStats.theoryPractice || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
          newKnowledge: stats.statistics.contentStats.newKnowledge || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 }
        })
      }
      
      if (stats.statistics.instructorStats) {
        setInstructorStats({
          knowledge: stats.statistics.instructorStats.knowledge || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
          didactic: stats.statistics.instructorStats.didactic || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
          communication: stats.statistics.instructorStats.communication || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
          assimilation: stats.statistics.instructorStats.assimilation || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
          practicalApps: stats.statistics.instructorStats.practicalApps || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 }
        })
      }
      
      if (stats.statistics.infrastructureStats) {
        setInfrastructureStats({
          facilities: stats.statistics.infrastructureStats.facilities || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
          classrooms: stats.statistics.infrastructureStats.classrooms || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
          schedule: stats.statistics.infrastructureStats.schedule || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 }
        })
      }
      
      if (stats.statistics.participantsStats) {
        setParticipantsStats({
          understanding: stats.statistics.participantsStats.understanding || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
          relationship: stats.statistics.participantsStats.relationship || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
          consideration: stats.statistics.participantsStats.consideration || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 },
          instructorRel: stats.statistics.participantsStats.instructorRel || { nota1: 0, nota2: 0, nota3: 0, nota4: 0, nota5: 0 }
        })
      }
      
    } catch (error: any) {
      // Se não encontrar estatísticas, não é erro - significa que ainda não foram criadas
      if (error.response?.status !== 404) {
        console.error('Erro ao carregar estatísticas:', error)
        toast({
          title: "Erro",
          description: "Erro ao carregar estatísticas existentes",
          variant: "destructive"
        })
      }
      setExistingStats(null)
    } finally {
      setLoading(false)
    }
  }

  // Função para atualizar contagem de uma nota específica
  const updateStats = (
    category: 'content' | 'instructor' | 'infrastructure' | 'participants',
    field: string,
    nota: keyof NotaStats,
    value: number
  ) => {
    const newValue = Math.max(0, value) // Não permitir valores negativos
    
    switch (category) {
      case 'content':
        setContentStats(prev => ({
          ...prev,
          [field]: { ...prev[field as keyof typeof prev], [nota]: newValue }
        }))
        break
      case 'instructor':
        setInstructorStats(prev => ({
          ...prev,
          [field]: { ...prev[field as keyof typeof prev], [nota]: newValue }
        }))
        break
      case 'infrastructure':
        setInfrastructureStats(prev => ({
          ...prev,
          [field]: { ...prev[field as keyof typeof prev], [nota]: newValue }
        }))
        break
      case 'participants':
        setParticipantsStats(prev => ({
          ...prev,
          [field]: { ...prev[field as keyof typeof prev], [nota]: newValue }
        }))
        break
    }
  }

  // Calcular total de respostas para uma estatística
  const getTotalRespostas = (stats: NotaStats): number => {
    return stats.nota1 + stats.nota2 + stats.nota3 + stats.nota4 + stats.nota5
  }

  // Renderizar inputs para uma estatística
  const renderStatsInputs = (
    category: 'content' | 'instructor' | 'infrastructure' | 'participants',
    field: string,
    stats: NotaStats,
    label: string
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <Badge variant="outline" className="text-xs">
          Total: {getTotalRespostas(stats)}
        </Badge>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((nota) => (
          <div key={nota} className="text-center">
            <Label className="text-xs text-gray-500">★{nota}</Label>
            <Input
              type="number"
              min="0"
              value={stats[`nota${nota}` as keyof NotaStats]}
              onChange={(e) => updateStats(category, field, `nota${nota}` as keyof NotaStats, parseInt(e.target.value) || 0)}
              className="text-center h-8"
              disabled={readOnly}
            />
          </div>
        ))}
      </div>
    </div>
  )

  const handleSave = async () => {
    if (!turma) {
      toast({
        title: "Erro",
        description: "Turma não encontrada",
        variant: "destructive"
      })
      return
    }
    
    if (!turma.id) {
      toast({
        title: "Erro",
        description: "ID da turma não encontrado",
        variant: "destructive"
      })
      return
    }
    
    if (!collectedBy.trim()) {
      toast({
        title: "Erro de validação",
        description: "O campo 'Coletado por' é obrigatório",
        variant: "destructive"
      })
      return
    }
    
    if (totalEvaluationsCollected <= 0) {
      toast({
        title: "Erro de validação", 
        description: "O total de avaliações deve ser maior que zero",
        variant: "destructive"
      })
      return
    }

    // Verificar se há pelo menos uma estatística para salvar
    const hasData = getTotalRespostas(contentStats.adequacy) > 0 ||
                   getTotalRespostas(contentStats.applicability) > 0 ||
                   getTotalRespostas(contentStats.theoryPractice) > 0 ||
                   getTotalRespostas(contentStats.newKnowledge) > 0 ||
                   getTotalRespostas(instructorStats.knowledge) > 0 ||
                   getTotalRespostas(instructorStats.didactic) > 0 ||
                   getTotalRespostas(instructorStats.communication) > 0 ||
                   getTotalRespostas(instructorStats.assimilation) > 0 ||
                   getTotalRespostas(instructorStats.practicalApps) > 0 ||
                   getTotalRespostas(infrastructureStats.facilities) > 0 ||
                   getTotalRespostas(infrastructureStats.classrooms) > 0 ||
                   getTotalRespostas(infrastructureStats.schedule) > 0 ||
                   getTotalRespostas(participantsStats.understanding) > 0 ||
                   getTotalRespostas(participantsStats.relationship) > 0 ||
                   getTotalRespostas(participantsStats.consideration) > 0 ||
                   getTotalRespostas(participantsStats.instructorRel) > 0

    if (!hasData) {
      toast({
        title: "Erro de validação",
        description: "É necessário preencher pelo menos uma estatística",
        variant: "destructive"
      })
      return
    }

    try {
      setSaving(true)
      
      const data: ManualEvaluationStatsData = {
        classId: turma.id,
        collectedBy: collectedBy.trim(),
        totalEvaluationsCollected,
        collectedComments: collectedComments.trim() || undefined,
        observations: observations.trim() || undefined,
        
        // Incluir apenas estatísticas que têm pelo menos uma resposta
        ...(getTotalRespostas(contentStats.adequacy) > 0 && { 
          contentAdequacyStats: {
            nota1: contentStats.adequacy.nota1 || 0,
            nota2: contentStats.adequacy.nota2 || 0,
            nota3: contentStats.adequacy.nota3 || 0,
            nota4: contentStats.adequacy.nota4 || 0,
            nota5: contentStats.adequacy.nota5 || 0
          }
        }),
        ...(getTotalRespostas(contentStats.applicability) > 0 && { 
          contentApplicabilityStats: {
            nota1: contentStats.applicability.nota1 || 0,
            nota2: contentStats.applicability.nota2 || 0,
            nota3: contentStats.applicability.nota3 || 0,
            nota4: contentStats.applicability.nota4 || 0,
            nota5: contentStats.applicability.nota5 || 0
          }
        }),
        ...(getTotalRespostas(contentStats.theoryPractice) > 0 && { 
          contentTheoryPracticeStats: {
            nota1: contentStats.theoryPractice.nota1 || 0,
            nota2: contentStats.theoryPractice.nota2 || 0,
            nota3: contentStats.theoryPractice.nota3 || 0,
            nota4: contentStats.theoryPractice.nota4 || 0,
            nota5: contentStats.theoryPractice.nota5 || 0
          }
        }),
        ...(getTotalRespostas(contentStats.newKnowledge) > 0 && { 
          contentNewKnowledgeStats: {
            nota1: contentStats.newKnowledge.nota1 || 0,
            nota2: contentStats.newKnowledge.nota2 || 0,
            nota3: contentStats.newKnowledge.nota3 || 0,
            nota4: contentStats.newKnowledge.nota4 || 0,
            nota5: contentStats.newKnowledge.nota5 || 0
          }
        }),
        
        ...(getTotalRespostas(instructorStats.knowledge) > 0 && { 
          instructorKnowledgeStats: {
            nota1: instructorStats.knowledge.nota1 || 0,
            nota2: instructorStats.knowledge.nota2 || 0,
            nota3: instructorStats.knowledge.nota3 || 0,
            nota4: instructorStats.knowledge.nota4 || 0,
            nota5: instructorStats.knowledge.nota5 || 0
          }
        }),
        ...(getTotalRespostas(instructorStats.didactic) > 0 && { 
          instructorDidacticStats: {
            nota1: instructorStats.didactic.nota1 || 0,
            nota2: instructorStats.didactic.nota2 || 0,
            nota3: instructorStats.didactic.nota3 || 0,
            nota4: instructorStats.didactic.nota4 || 0,
            nota5: instructorStats.didactic.nota5 || 0
          }
        }),
        ...(getTotalRespostas(instructorStats.communication) > 0 && { 
          instructorCommunicationStats: {
            nota1: instructorStats.communication.nota1 || 0,
            nota2: instructorStats.communication.nota2 || 0,
            nota3: instructorStats.communication.nota3 || 0,
            nota4: instructorStats.communication.nota4 || 0,
            nota5: instructorStats.communication.nota5 || 0
          }
        }),
        ...(getTotalRespostas(instructorStats.assimilation) > 0 && { 
          instructorAssimilationStats: {
            nota1: instructorStats.assimilation.nota1 || 0,
            nota2: instructorStats.assimilation.nota2 || 0,
            nota3: instructorStats.assimilation.nota3 || 0,
            nota4: instructorStats.assimilation.nota4 || 0,
            nota5: instructorStats.assimilation.nota5 || 0
          }
        }),
        ...(getTotalRespostas(instructorStats.practicalApps) > 0 && { 
          instructorPracticalAppsStats: {
            nota1: instructorStats.practicalApps.nota1 || 0,
            nota2: instructorStats.practicalApps.nota2 || 0,
            nota3: instructorStats.practicalApps.nota3 || 0,
            nota4: instructorStats.practicalApps.nota4 || 0,
            nota5: instructorStats.practicalApps.nota5 || 0
          }
        }),
        
        ...(getTotalRespostas(infrastructureStats.facilities) > 0 && { 
          infrastructureFacilitiesStats: {
            nota1: infrastructureStats.facilities.nota1 || 0,
            nota2: infrastructureStats.facilities.nota2 || 0,
            nota3: infrastructureStats.facilities.nota3 || 0,
            nota4: infrastructureStats.facilities.nota4 || 0,
            nota5: infrastructureStats.facilities.nota5 || 0
          }
        }),
        ...(getTotalRespostas(infrastructureStats.classrooms) > 0 && { 
          infrastructureClassroomsStats: {
            nota1: infrastructureStats.classrooms.nota1 || 0,
            nota2: infrastructureStats.classrooms.nota2 || 0,
            nota3: infrastructureStats.classrooms.nota3 || 0,
            nota4: infrastructureStats.classrooms.nota4 || 0,
            nota5: infrastructureStats.classrooms.nota5 || 0
          }
        }),
        ...(getTotalRespostas(infrastructureStats.schedule) > 0 && { 
          infrastructureScheduleStats: {
            nota1: infrastructureStats.schedule.nota1 || 0,
            nota2: infrastructureStats.schedule.nota2 || 0,
            nota3: infrastructureStats.schedule.nota3 || 0,
            nota4: infrastructureStats.schedule.nota4 || 0,
            nota5: infrastructureStats.schedule.nota5 || 0
          }
        }),
        
        ...(getTotalRespostas(participantsStats.understanding) > 0 && { 
          participantsUnderstandingStats: {
            nota1: participantsStats.understanding.nota1 || 0,
            nota2: participantsStats.understanding.nota2 || 0,
            nota3: participantsStats.understanding.nota3 || 0,
            nota4: participantsStats.understanding.nota4 || 0,
            nota5: participantsStats.understanding.nota5 || 0
          }
        }),
        ...(getTotalRespostas(participantsStats.relationship) > 0 && { 
          participantsRelationshipStats: {
            nota1: participantsStats.relationship.nota1 || 0,
            nota2: participantsStats.relationship.nota2 || 0,
            nota3: participantsStats.relationship.nota3 || 0,
            nota4: participantsStats.relationship.nota4 || 0,
            nota5: participantsStats.relationship.nota5 || 0
          }
        }),
        ...(getTotalRespostas(participantsStats.consideration) > 0 && { 
          participantsConsiderationStats: {
            nota1: participantsStats.consideration.nota1 || 0,
            nota2: participantsStats.consideration.nota2 || 0,
            nota3: participantsStats.consideration.nota3 || 0,
            nota4: participantsStats.consideration.nota4 || 0,
            nota5: participantsStats.consideration.nota5 || 0
          }
        }),
        ...(getTotalRespostas(participantsStats.instructorRel) > 0 && { 
          participantsInstructorRelStats: {
            nota1: participantsStats.instructorRel.nota1 || 0,
            nota2: participantsStats.instructorRel.nota2 || 0,
            nota3: participantsStats.instructorRel.nota3 || 0,
            nota4: participantsStats.instructorRel.nota4 || 0,
            nota5: participantsStats.instructorRel.nota5 || 0
          }
        })
      }
      
      console.log('Dados que serão enviados para a API:', data)
      console.log('Existing stats:', existingStats)
      
      if (existingStats) {
        console.log('Atualizando estatísticas existentes...')
        await updateManualEvaluationStats(turma.id, data)
        toast({
          title: "Sucesso",
          description: "Estatísticas atualizadas com sucesso",
          variant: "default"
        })
      } else {
        console.log('Criando novas estatísticas...')
        await createManualEvaluationStats(data)
        toast({
          title: "Sucesso",
          description: "Estatísticas criadas com sucesso",
          variant: "default"
        })
      }
      
      onClose()
      
    } catch (error: any) {
      console.error('Erro ao salvar estatísticas:', error)
      console.error('Detalhes do erro:', error.response?.data)
      console.error('Status do erro:', error.response?.status)
      
      // Mostrar detalhes do erro no toast se disponível
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Erro ao salvar estatísticas"
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (!turma) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Lançamento Manual de Estatísticas - {turma.training.title}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Carregando dados...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Aviso sobre anonimato */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Lançamento Manual de Estatísticas</span>
              </div>
              <p className="text-sm text-blue-700">
                Este sistema permite que você registre estatísticas coletadas de formulários físicos de avaliação. 
                Conte quantos alunos deram cada nota (1-5) para cada critério e registre os totais aqui.
              </p>
            </div>

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="collectedBy">Coletado por *</Label>
                <Input
                  id="collectedBy"
                  value={collectedBy}
                  onChange={(e) => setCollectedBy(e.target.value)}
                  placeholder="Nome do responsável pela coleta"
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="totalEvaluations">Total de avaliações coletadas *</Label>
                <Input
                  id="totalEvaluations"
                  type="number"
                  min="0"
                  max={turma.students.length}
                  value={totalEvaluationsCollected}
                  onChange={(e) => setTotalEvaluationsCollected(parseInt(e.target.value) || 0)}
                  disabled={readOnly}
                />
              </div>
              <div className="flex items-end">
                <Badge variant="outline" className="h-10 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {turma.students.length} alunos na turma
                </Badge>
              </div>
            </div>

            {/* Estatísticas por Categoria */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conteúdo/Programa */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Conteúdo/Programa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderStatsInputs('content', 'adequacy', contentStats.adequacy, 'Adequação do conteúdo')}
                  {renderStatsInputs('content', 'applicability', contentStats.applicability, 'Aplicabilidade profissional')}
                  {renderStatsInputs('content', 'theoryPractice', contentStats.theoryPractice, 'Equilíbrio teoria/prática')}
                  {renderStatsInputs('content', 'newKnowledge', contentStats.newKnowledge, 'Nível de novos conhecimentos')}
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
                  {renderStatsInputs('instructor', 'knowledge', instructorStats.knowledge, 'Conhecimentos do assunto')}
                  {renderStatsInputs('instructor', 'didactic', instructorStats.didactic, 'Didática utilizada')}
                  {renderStatsInputs('instructor', 'communication', instructorStats.communication, 'Facilidade na comunicação')}
                  {renderStatsInputs('instructor', 'assimilation', instructorStats.assimilation, 'Verificação da assimilação')}
                  {renderStatsInputs('instructor', 'practicalApps', instructorStats.practicalApps, 'Aplicações práticas')}
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
                  {renderStatsInputs('infrastructure', 'facilities', infrastructureStats.facilities, 'Adequação das instalações')}
                  {renderStatsInputs('infrastructure', 'classrooms', infrastructureStats.classrooms, 'Salas de aula')}
                  {renderStatsInputs('infrastructure', 'schedule', infrastructureStats.schedule, 'Carga horária')}
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
                  {renderStatsInputs('participants', 'understanding', participantsStats.understanding, 'Facilidade de entendimento')}
                  {renderStatsInputs('participants', 'relationship', participantsStats.relationship, 'Relação com participantes')}
                  {renderStatsInputs('participants', 'consideration', participantsStats.consideration, 'Autoavaliação da participação')}
                  {renderStatsInputs('participants', 'instructorRel', participantsStats.instructorRel, 'Relação com instrutores')}
                </CardContent>
              </Card>
            </div>

            {/* Comentários e Observações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="comments">Comentários coletados das avaliações</Label>
                <Textarea
                  id="comments"
                  value={collectedComments}
                  onChange={(e) => setCollectedComments(e.target.value)}
                  placeholder="Principais comentários dos alunos coletados dos formulários..."
                  rows={4}
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="observations">Observações sobre o processo de coleta</Label>
                <Textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Observações sobre como foi feita a coleta, participação dos alunos, etc..."
                  rows={4}
                  disabled={readOnly}
                />
              </div>
            </div>

            {/* Status da coleta */}
            {existingStats && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Estatísticas já lançadas</span>
                </div>
                <div className="text-sm text-green-700">
                  <p>Criado em: {new Date(existingStats.createdAt).toLocaleString('pt-BR')}</p>
                  <p>Última atualização: {new Date(existingStats.updatedAt).toLocaleString('pt-BR')}</p>
                  <p>Taxa de participação: {existingStats.statistics.participationRate.toFixed(1)}%</p>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                {readOnly ? 'Fechar' : 'Cancelar'}
              </Button>
              {!readOnly && (
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {existingStats ? 'Atualizar' : 'Salvar'} Estatísticas
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
