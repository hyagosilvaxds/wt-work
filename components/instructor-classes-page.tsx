"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState, useEffect } from "react"
import { 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Eye, 
  Download,
  Search,
  Filter,
  BookOpen,
  Award,
  User,
  Building2
} from "lucide-react"

export function InstructorClassesPage() {
  const { isInstructor, getInstructorClasses } = useAuth()
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClasses = async () => {
      if (!isInstructor) {
        setError('Acesso negado: Usuário não é do tipo INSTRUTOR')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await getInstructorClasses()
        setClasses(response.classes || response || [])
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar turmas')
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [isInstructor, getInstructorClasses])

  if (!isInstructor) {
    return (
      <Alert className="m-6">
        <AlertDescription>
          Esta página é exclusiva para usuários do tipo INSTRUTOR.
        </AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="m-6">
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Turmas</h1>
          <p className="text-gray-600">Gerencie suas turmas e acompanhe o progresso</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Pesquisar
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pesquisar Turmas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Pesquisar por nome da turma, treinamento ou cliente..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Pesquisar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas das turmas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-gray-600">Sob sua responsabilidade</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Turmas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.filter(c => c.status === 'ATIVO' || c.status === 'EM_ANDAMENTO').length}
            </div>
            <p className="text-xs text-gray-600">Em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Turmas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.filter(c => c.status === 'CONCLUIDO').length}
            </div>
            <p className="text-xs text-gray-600">Finalizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.reduce((total, turma) => total + (turma.students?.length || 0), 0)}
            </div>
            <p className="text-xs text-gray-600">Alunos ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de turmas */}
      {classes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma turma encontrada</h3>
            <p className="text-gray-600">Você ainda não possui turmas cadastradas.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((turma) => (
            <Card key={turma.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{turma.training?.title || turma.name}</CardTitle>
                    <Badge 
                      variant={turma.status === 'ATIVO' || turma.status === 'EM_ANDAMENTO' ? 'default' : 'secondary'}
                    >
                      {turma.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Informações básicas */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span>{turma.training?.title || turma.courseName || 'Curso'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{turma.startDate ? new Date(turma.startDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{turma.duration || turma.workload || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Cliente */}
                  {turma.client && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span>Cliente: {turma.client.name || turma.client}</span>
                    </div>
                  )}

                  {/* Local */}
                  {turma.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{turma.location}</span>
                    </div>
                  )}

                  {/* Alunos */}
                  {turma.students && turma.students.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600">{turma.students.length} aluno(s)</span>
                    </div>
                  )}

                  {/* Certificados */}
                  {turma.certificates && turma.certificates.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">{turma.certificates.length} certificado(s) emitido(s)</span>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
