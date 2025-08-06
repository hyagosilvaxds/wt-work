"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Star,
  Users,
  BookOpen,
  Building2,
  UserCheck,
  Loader2,
  BarChart3,
  Shield,
  MessageCircle,
  TrendingUp
} from "lucide-react"
import { 
  getAnonymousClassEvaluationStats,
  AnonymousClassEvaluationStats,
  AnonymousFieldStats
} from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface AnonymousClassStatsModalProps {
  isOpen: boolean
  onClose: () => void
  turma: {
    id: string
    training: {
      title: string
    }
  } | null
  readOnly?: boolean
}

export function AnonymousClassStatsModal({
  isOpen,
  onClose,
  turma,
  readOnly = false
}: AnonymousClassStatsModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<AnonymousClassEvaluationStats | null>(null)

  useEffect(() => {
    if (isOpen && turma) {
      loadStats()
    }
  }, [isOpen, turma])

  const loadStats = async () => {
    if (!turma) return

    try {
      setLoading(true)
      const data = await getAnonymousClassEvaluationStats(turma.id)
      setStats(data)
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar estatísticas das avaliações",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const renderFieldStats = (fieldStats: AnonymousFieldStats, title: string) => {
    const hasData = fieldStats.totalResponses > 0
    
    if (!hasData) {
      return (
        <div className="text-center py-4 text-gray-500">
          <span className="text-sm">Nenhuma avaliação ainda</span>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{title}</span>
          <Badge variant="outline" className="text-xs">
            {fieldStats.totalResponses} resposta{fieldStats.totalResponses !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        {/* Média */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Média:</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{fieldStats.average.toFixed(1)}</span>
          </div>
        </div>

        {/* Distribuição */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = fieldStats[rating.toString() as keyof AnonymousFieldStats] as number
            const percentage = fieldStats.totalResponses > 0 
              ? (count / fieldStats.totalResponses) * 100 
              : 0
            
            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 w-12">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{rating}</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-12 text-right">{count}</span>
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
            Estatísticas Anônimas - {turma.training.title}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Carregando estatísticas...</span>
          </div>
        ) : !stats ? (
          <div className="text-center py-12">
            <span className="text-gray-600">Nenhuma estatística disponível</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumo */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Resumo das Avaliações Anônimas</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Total de Alunos:</span>
                  <p className="font-semibold">{stats.classInfo.totalStudents}</p>
                </div>
                <div>
                  <span className="text-blue-600">Avaliações Recebidas:</span>
                  <p className="font-semibold">{stats.summary.totalEvaluations}</p>
                </div>
                <div>
                  <span className="text-blue-600">Taxa de Participação:</span>
                  <p className="font-semibold">{stats.summary.participationRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Grid de Estatísticas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conteúdo/Programa */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Conteúdo/Programa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {renderFieldStats(stats.statistics.content.adequacy, 'Adequação do conteúdo')}
                  {renderFieldStats(stats.statistics.content.applicability, 'Aplicabilidade profissional')}
                  {renderFieldStats(stats.statistics.content.theoryPracticeBalance, 'Equilíbrio teoria/prática')}
                  {renderFieldStats(stats.statistics.content.newKnowledge, 'Nível de novos conhecimentos')}
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
                <CardContent className="space-y-6">
                  {renderFieldStats(stats.statistics.instructor.knowledge, 'Conhecimentos do assunto')}
                  {renderFieldStats(stats.statistics.instructor.didactic, 'Didática utilizada')}
                  {renderFieldStats(stats.statistics.instructor.communication, 'Facilidade na comunicação')}
                  {renderFieldStats(stats.statistics.instructor.assimilation, 'Verificação da assimilação')}
                  {renderFieldStats(stats.statistics.instructor.practicalApps, 'Aplicações práticas')}
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
                <CardContent className="space-y-6">
                  {renderFieldStats(stats.statistics.infrastructure.facilities, 'Adequação das instalações')}
                  {renderFieldStats(stats.statistics.infrastructure.classrooms, 'Salas de aula')}
                  {renderFieldStats(stats.statistics.infrastructure.schedule, 'Carga horária')}
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
                <CardContent className="space-y-6">
                  {renderFieldStats(stats.statistics.participants.understanding, 'Facilidade de entendimento')}
                  {renderFieldStats(stats.statistics.participants.relationship, 'Relação com participantes')}
                  {renderFieldStats(stats.statistics.participants.consideration, 'Autoavaliação da participação')}
                  {renderFieldStats(stats.statistics.participants.instructorRel, 'Relação com instrutores')}
                </CardContent>
              </Card>
            </div>

            {/* Comentários Anônimos */}
            {stats.comments && stats.comments.length > 0 && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-indigo-600" />
                    Comentários Anônimos ({stats.comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {stats.comments.map((comment, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
