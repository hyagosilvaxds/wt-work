"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Star,
  StarHalf,
  Users,
  BarChart3,
  UserCheck,
  UserX,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Loader2
} from "lucide-react"
import { 
  getClassEvaluations, 
  getClassEvaluationStats, 
  createClassEvaluation,
  updateClassEvaluation,
  deleteClassEvaluation,
  ClassEvaluations,
  ClassEvaluationStats,
  ClassEvaluationData,
  ClassEvaluation
} from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface ClassEvaluationsModalProps {
  isOpen: boolean
  onClose: () => void
  turma: {
    id: string
    training: {
      title: string
    }
    students: Array<{
      id: string
      name: string
      cpf: string
    }>
  } | null
}

interface EvaluationFormData {
  // Conteúdo
  contentAdequacy?: number
  contentApplicability?: number
  contentTheoryPracticeBalance?: number
  contentNewKnowledge?: number
  
  // Instrutor
  instructorKnowledge?: number
  instructorDidactic?: number
  instructorCommunication?: number
  instructorAssimilation?: number
  instructorPracticalApps?: number
  
  // Infraestrutura
  infrastructureFacilities?: number
  infrastructureClassrooms?: number
  infrastructureSchedule?: number
  
  // Participantes
  participantsUnderstanding?: number
  participantsRelationship?: number
  participantsConsideration?: number
  participantsInstructorRel?: number
  
  observations?: string
}

export function ClassEvaluationsModal({ isOpen, onClose, turma }: ClassEvaluationsModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [evaluations, setEvaluations] = useState<ClassEvaluations | null>(null)
  const [stats, setStats] = useState<ClassEvaluationStats | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [editingEvaluation, setEditingEvaluation] = useState<ClassEvaluation | null>(null)
  const [formData, setFormData] = useState<EvaluationFormData>({})
  const [searchTerm, setSearchTerm] = useState("")

  // Carregar dados quando o modal abrir
  useEffect(() => {
    if (isOpen && turma) {
      loadData()
    }
  }, [isOpen, turma])

  const loadData = async () => {
    if (!turma) return
    
    setLoading(true)
    try {
      const [evaluationsData, statsData] = await Promise.all([
        getClassEvaluations(turma.id),
        getClassEvaluationStats(turma.id)
      ])
      
      setEvaluations(evaluationsData)
      setStats(statsData)
    } catch (error: any) {
      console.error('Erro ao carregar dados das avaliações:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados das avaliações",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvaluation = (studentId: string) => {
    setSelectedStudent(studentId)
    setEditingEvaluation(null)
    setFormData({})
  }

  const handleEditEvaluation = (evaluation: ClassEvaluation) => {
    setSelectedStudent(evaluation.studentId)
    setEditingEvaluation(evaluation)
    setFormData({
      contentAdequacy: evaluation.contentAdequacy,
      contentApplicability: evaluation.contentApplicability,
      contentTheoryPracticeBalance: evaluation.contentTheoryPracticeBalance,
      contentNewKnowledge: evaluation.contentNewKnowledge,
      instructorKnowledge: evaluation.instructorKnowledge,
      instructorDidactic: evaluation.instructorDidactic,
      instructorCommunication: evaluation.instructorCommunication,
      instructorAssimilation: evaluation.instructorAssimilation,
      instructorPracticalApps: evaluation.instructorPracticalApps,
      infrastructureFacilities: evaluation.infrastructureFacilities,
      infrastructureClassrooms: evaluation.infrastructureClassrooms,
      infrastructureSchedule: evaluation.infrastructureSchedule,
      participantsUnderstanding: evaluation.participantsUnderstanding,
      participantsRelationship: evaluation.participantsRelationship,
      participantsConsideration: evaluation.participantsConsideration,
      participantsInstructorRel: evaluation.participantsInstructorRel,
      observations: evaluation.observations || ""
    })
  }

  const handleSaveEvaluation = async () => {
    if (!turma || !selectedStudent) return
    
    setLoading(true)
    try {
      const evaluationData: ClassEvaluationData = {
        classId: turma.id,
        studentId: selectedStudent,
        ...formData
      }

      if (editingEvaluation) {
        await updateClassEvaluation(turma.id, selectedStudent, formData)
        toast({
          title: "Sucesso",
          description: "Avaliação atualizada com sucesso"
        })
      } else {
        await createClassEvaluation(evaluationData)
        toast({
          title: "Sucesso",
          description: "Avaliação criada com sucesso"
        })
      }

      await loadData()
      setSelectedStudent(null)
      setEditingEvaluation(null)
      setFormData({})
    } catch (error: any) {
      console.error('Erro ao salvar avaliação:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao salvar avaliação",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvaluation = async (studentId: string) => {
    if (!turma) return
    
    setLoading(true)
    try {
      await deleteClassEvaluation(turma.id, studentId)
      toast({
        title: "Sucesso",
        description: "Avaliação removida com sucesso"
      })
      await loadData()
    } catch (error: any) {
      console.error('Erro ao remover avaliação:', error)
      toast({
        title: "Erro",
        description: "Erro ao remover avaliação",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStarRating = (value?: number) => {
    if (!value || value === 0) return <span className="text-gray-400">-</span>
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm font-medium">{value.toFixed(1)}</span>
      </div>
    )
  }

  const renderStarInput = (label: string, field: keyof EvaluationFormData) => {
    const value = formData[field] as number || 0
    
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, [field]: i + 1 }))}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <Star 
                className={`h-5 w-5 ${i < value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`} 
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {value > 0 ? value : 'Não avaliado'}
          </span>
        </div>
      </div>
    )
  }

  const getStudentEvaluation = (studentId: string) => {
    return evaluations?.evaluations.find(evaluation => evaluation.studentId === studentId)
  }

  const filteredStudents = turma?.students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.cpf.includes(searchTerm)
  ) || []

  if (!turma) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Avaliações da Turma - {turma.training.title}
          </DialogTitle>
        </DialogHeader>

        {loading && !evaluations ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Carregando avaliações...</span>
          </div>
        ) : (
          <Tabs defaultValue="evaluations" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="evaluations" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Avaliações ({evaluations?.evaluations.length || 0})
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Estatísticas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="evaluations" className="space-y-4">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar alunos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Lista de Alunos */}
              <div className="space-y-3">
                {filteredStudents.map(student => {
                  const evaluation = getStudentEvaluation(student.id)
                  
                  return (
                    <Card key={student.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{student.name}</h4>
                            <p className="text-sm text-gray-600">{student.cpf}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {evaluation ? (
                              <>
                                <Badge className="bg-green-100 text-green-800">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Avaliado
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditEvaluation(evaluation)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteEvaluation(student.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Badge variant="outline" className="text-gray-600">
                                  <UserX className="h-3 w-3 mr-1" />
                                  Não avaliado
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCreateEvaluation(student.id)}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Avaliar
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-4">
              {stats && (
                <>
                  {/* Resumo */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {stats.summary.evaluatedStudents}
                        </div>
                        <div className="text-sm text-gray-600">Alunos Avaliados</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {stats.summary.notEvaluatedStudents}
                        </div>
                        <div className="text-sm text-gray-600">Não Avaliados</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {stats.summary.evaluationRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Taxa de Avaliação</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Estatísticas por Categoria */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Conteúdo */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Conteúdo/Programa</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Adequação do conteúdo</span>
                          {renderStarRating(stats.statistics?.content?.adequacy?.average)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Aplicabilidade</span>
                          {renderStarRating(stats.statistics?.content?.applicability?.average)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Equilíbrio teoria/prática</span>
                          {renderStarRating(stats.statistics?.content?.theoryPracticeBalance?.average)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Novos conhecimentos</span>
                          {renderStarRating(stats.statistics?.content?.newKnowledge?.average)}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Instrutor */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Instrutor/Palestrante</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Conhecimento do assunto</span>
                          {renderStarRating(stats.statistics.instructor.knowledge.average)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Didática utilizada</span>
                          {renderStarRating(stats.statistics.instructor.didactic.average)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Comunicação</span>
                          {renderStarRating(stats.statistics.instructor.communication.average)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Verificação da assimilação</span>
                          {renderStarRating(stats.statistics.instructor.assimilation.average)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Aplicações práticas</span>
                          {renderStarRating(stats.statistics.instructor.practicalApps.average)}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Infraestrutura */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Infraestrutura</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Instalações/equipamentos</span>
                          {renderStarRating(stats.statistics.infrastructure.facilities.average)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Salas de aula</span>
                          {renderStarRating(stats.statistics.infrastructure.classrooms.average)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Carga horária</span>
                          {renderStarRating(stats.statistics.infrastructure.schedule.average)}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Participantes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Participantes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Facilidade de entendimento</span>
                          {renderStarRating(stats.statistics.participants.understanding.average)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Relação com outros participantes</span>
                          {renderStarRating(stats.statistics.participants.relationship.average)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Própria participação</span>
                          {renderStarRating(stats.statistics.participants.consideration.average)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Relação com instrutores</span>
                          {renderStarRating(stats.statistics.participants.instructorRel.average)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Modal de Formulário de Avaliação */}
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvaluation ? 'Editar Avaliação' : 'Nova Avaliação'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Conteúdo/Programa */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conteúdo/Programa</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderStarInput("Adequação do conteúdo", "contentAdequacy")}
                  {renderStarInput("Aplicabilidade profissional", "contentApplicability")}
                  {renderStarInput("Equilíbrio teoria/prática", "contentTheoryPracticeBalance")}
                  {renderStarInput("Novos conhecimentos", "contentNewKnowledge")}
                </CardContent>
              </Card>

              {/* Instrutor/Palestrante */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Instrutor/Palestrante</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderStarInput("Conhecimento do assunto", "instructorKnowledge")}
                  {renderStarInput("Didática utilizada", "instructorDidactic")}
                  {renderStarInput("Comunicação", "instructorCommunication")}
                  {renderStarInput("Verificação da assimilação", "instructorAssimilation")}
                  {renderStarInput("Aplicações práticas", "instructorPracticalApps")}
                </CardContent>
              </Card>

              {/* Infraestrutura */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Infraestrutura e Logística</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderStarInput("Instalações/equipamentos", "infrastructureFacilities")}
                  {renderStarInput("Salas de aula", "infrastructureClassrooms")}
                  {renderStarInput("Carga horária", "infrastructureSchedule")}
                </CardContent>
              </Card>

              {/* Participantes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Participantes</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderStarInput("Facilidade de entendimento", "participantsUnderstanding")}
                  {renderStarInput("Relação com outros participantes", "participantsRelationship")}
                  {renderStarInput("Própria participação", "participantsConsideration")}
                  {renderStarInput("Relação com instrutores", "participantsInstructorRel")}
                </CardContent>
              </Card>

              {/* Observações */}
              <div className="space-y-2">
                <Label>Observações (opcional)</Label>
                <Textarea
                  placeholder="Comentários adicionais..."
                  value={formData.observations || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Ações */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedStudent(null)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveEvaluation}
                  disabled={loading}
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingEvaluation ? 'Atualizar' : 'Salvar'} Avaliação
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}
