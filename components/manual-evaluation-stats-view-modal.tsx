"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart3,
  Users,
  BookOpen,
  Building2,
  UserCheck,
  Loader2,
  Shield,
  MessageCircle,
  TrendingUp,
  Calendar,
  User,
  FileText
} from "lucide-react"
import { 
  getManualEvaluationStats,
  ManualEvaluationStatsResponse,
  NotaStats
} from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface ManualEvaluationStatsViewModalProps {
  isOpen: boolean
  onClose: () => void
  turma: {
    id: string
    training: {
      title: string
    }
  } | null
}

export function ManualEvaluationStatsViewModal({
  isOpen,
  onClose,
  turma
}: ManualEvaluationStatsViewModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<ManualEvaluationStatsResponse | null>(null)

  useEffect(() => {
    if (isOpen && turma) {
      loadStats()
    }
  }, [isOpen, turma])

  const loadStats = async () => {
    if (!turma) return

    try {
      setLoading(true)
      const data = await getManualEvaluationStats(turma.id)
      setStats(data)
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error)
      if (error.response?.status === 404) {
        toast({
          title: "Nenhuma estatística encontrada",
          description: "Esta turma ainda não possui estatísticas de avaliação lançadas",
          variant: "default"
        })
      } else {
        toast({
          title: "Erro",
          description: "Erro ao carregar estatísticas das avaliações",
          variant: "destructive"
        })
      }
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  const renderFieldStats = (fieldStats: NotaStats, title: string, totalEvaluations: number) => {
    const totalResponses = fieldStats.nota1 + fieldStats.nota2 + fieldStats.nota3 + fieldStats.nota4 + fieldStats.nota5
    
    if (totalResponses === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          <span className="text-sm">Nenhuma avaliação registrada</span>
        </div>
      )
    }

    // Calcular média
    const average = ((fieldStats.nota1 * 1) + (fieldStats.nota2 * 2) + (fieldStats.nota3 * 3) + (fieldStats.nota4 * 4) + (fieldStats.nota5 * 5)) / totalResponses

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{title}</span>
          <Badge variant="outline" className="text-xs">
            {totalResponses} de {totalEvaluations} responderam
          </Badge>
        </div>
        
        {/* Média */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Média:</span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold">{average.toFixed(1)}</span>
          </div>
        </div>

        {/* Distribuição */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = fieldStats[`nota${rating}` as keyof NotaStats] as number
            const percentage = totalResponses > 0 
              ? (count / totalResponses) * 100 
              : 0
            
            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-yellow-500">★</span>
                  <span>{rating}</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-16 text-right flex items-center gap-1">
                  <span className="font-medium">{count}</span>
                  <span className="text-gray-500 text-xs">({percentage.toFixed(0)}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (!turma) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Estatísticas de Avaliação - {turma.training.title}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Carregando estatísticas...</span>
          </div>
        ) : !stats ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma estatística encontrada
            </h3>
            <p className="text-gray-600">
              Esta turma ainda não possui estatísticas de avaliação lançadas.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Informações da Coleta */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Informações da Coleta</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Coletado por:
                  </span>
                  <p className="font-semibold">{stats.collectedBy}</p>
                </div>
                <div>
                  <span className="text-blue-600 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Avaliações:
                  </span>
                  <p className="font-semibold">{stats.totalEvaluationsCollected} coletadas</p>
                </div>
                <div>
                  <span className="text-blue-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Participação:
                  </span>
                  <p className="font-semibold">{stats.statistics.participationRate.toFixed(1)}%</p>
                </div>
                <div>
                  <span className="text-blue-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Registro:
                  </span>
                  <p className="font-semibold">{new Date(stats.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>

            {/* Resumo das Médias */}
            {stats.statistics.averages && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.statistics.averages.contentAverage && (
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.statistics.averages.contentAverage.toFixed(1)}</div>
                    <div className="text-sm text-blue-700">Conteúdo</div>
                  </div>
                )}
                {stats.statistics.averages.instructorAverage && (
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.statistics.averages.instructorAverage.toFixed(1)}</div>
                    <div className="text-sm text-purple-700">Instrutor</div>
                  </div>
                )}
                {stats.statistics.averages.infrastructureAverage && (
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{stats.statistics.averages.infrastructureAverage.toFixed(1)}</div>
                    <div className="text-sm text-orange-700">Infraestrutura</div>
                  </div>
                )}
                {stats.statistics.averages.participantsAverage && (
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.statistics.averages.participantsAverage.toFixed(1)}</div>
                    <div className="text-sm text-green-700">Participantes</div>
                  </div>
                )}
                {stats.statistics.averages.overallAverage && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg border-2 border-gray-300">
                    <div className="text-2xl font-bold text-gray-800">{stats.statistics.averages.overallAverage.toFixed(1)}</div>
                    <div className="text-sm text-gray-700">Média Geral</div>
                  </div>
                )}
              </div>
            )}

            {/* Grid de Estatísticas Detalhadas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conteúdo/Programa */}
              {stats.statistics.contentStats && Object.keys(stats.statistics.contentStats).length > 0 && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      Conteúdo/Programa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {stats.statistics.contentStats.adequacy && renderFieldStats(stats.statistics.contentStats.adequacy, 'Adequação do conteúdo', stats.totalEvaluationsCollected)}
                    {stats.statistics.contentStats.applicability && renderFieldStats(stats.statistics.contentStats.applicability, 'Aplicabilidade profissional', stats.totalEvaluationsCollected)}
                    {stats.statistics.contentStats.theoryPractice && renderFieldStats(stats.statistics.contentStats.theoryPractice, 'Equilíbrio teoria/prática', stats.totalEvaluationsCollected)}
                    {stats.statistics.contentStats.newKnowledge && renderFieldStats(stats.statistics.contentStats.newKnowledge, 'Nível de novos conhecimentos', stats.totalEvaluationsCollected)}
                  </CardContent>
                </Card>
              )}

              {/* Instrutor/Palestrante */}
              {stats.statistics.instructorStats && Object.keys(stats.statistics.instructorStats).length > 0 && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                      Instrutor/Palestrante
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {stats.statistics.instructorStats.knowledge && renderFieldStats(stats.statistics.instructorStats.knowledge, 'Conhecimentos do assunto', stats.totalEvaluationsCollected)}
                    {stats.statistics.instructorStats.didactic && renderFieldStats(stats.statistics.instructorStats.didactic, 'Didática utilizada', stats.totalEvaluationsCollected)}
                    {stats.statistics.instructorStats.communication && renderFieldStats(stats.statistics.instructorStats.communication, 'Facilidade na comunicação', stats.totalEvaluationsCollected)}
                    {stats.statistics.instructorStats.assimilation && renderFieldStats(stats.statistics.instructorStats.assimilation, 'Verificação da assimilação', stats.totalEvaluationsCollected)}
                    {stats.statistics.instructorStats.practicalApps && renderFieldStats(stats.statistics.instructorStats.practicalApps, 'Aplicações práticas', stats.totalEvaluationsCollected)}
                  </CardContent>
                </Card>
              )}

              {/* Infraestrutura e Logística */}
              {stats.statistics.infrastructureStats && Object.keys(stats.statistics.infrastructureStats).length > 0 && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building2 className="h-5 w-5 text-orange-600" />
                      Infraestrutura e Logística
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {stats.statistics.infrastructureStats.facilities && renderFieldStats(stats.statistics.infrastructureStats.facilities, 'Adequação das instalações', stats.totalEvaluationsCollected)}
                    {stats.statistics.infrastructureStats.classrooms && renderFieldStats(stats.statistics.infrastructureStats.classrooms, 'Salas de aula', stats.totalEvaluationsCollected)}
                    {stats.statistics.infrastructureStats.schedule && renderFieldStats(stats.statistics.infrastructureStats.schedule, 'Carga horária', stats.totalEvaluationsCollected)}
                  </CardContent>
                </Card>
              )}

              {/* Participação dos Alunos */}
              {stats.statistics.participantsStats && Object.keys(stats.statistics.participantsStats).length > 0 && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <UserCheck className="h-5 w-5 text-green-600" />
                      Participação dos Alunos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {stats.statistics.participantsStats.understanding && renderFieldStats(stats.statistics.participantsStats.understanding, 'Facilidade de entendimento', stats.totalEvaluationsCollected)}
                    {stats.statistics.participantsStats.relationship && renderFieldStats(stats.statistics.participantsStats.relationship, 'Relação com participantes', stats.totalEvaluationsCollected)}
                    {stats.statistics.participantsStats.consideration && renderFieldStats(stats.statistics.participantsStats.consideration, 'Autoavaliação da participação', stats.totalEvaluationsCollected)}
                    {stats.statistics.participantsStats.instructorRel && renderFieldStats(stats.statistics.participantsStats.instructorRel, 'Relação com instrutores', stats.totalEvaluationsCollected)}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Comentários e Observações */}
            {(stats.collectedComments || stats.observations) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.collectedComments && (
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MessageCircle className="h-5 w-5 text-indigo-600" />
                        Comentários Coletados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{stats.collectedComments}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {stats.observations && (
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="h-5 w-5 text-gray-600" />
                        Observações da Coleta
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{stats.observations}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Informações de Auditoria */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Criado em:</span>
                  <p className="font-medium">{new Date(stats.createdAt).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <span className="text-gray-600">Última atualização:</span>
                  <p className="font-medium">{new Date(stats.updatedAt).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <span className="text-gray-600">ID da turma:</span>
                  <p className="font-medium font-mono text-xs">{stats.classId}</p>
                </div>
              </div>
            </div>

            {/* Botão Fechar */}
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
