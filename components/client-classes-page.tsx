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

export function ClientClassesPage() {
  const { isClient, getClientClasses } = useAuth()
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClasses = async () => {
      if (!isClient) {
        setError('Acesso negado: Usuário não é do tipo CLIENTE')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await getClientClasses()
        setClasses(response.classes || response || [])
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar turmas')
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [isClient, getClientClasses])

  if (!isClient) {
    return (
      <Alert className="m-6">
        <AlertDescription>
          Esta página é exclusiva para usuários do tipo CLIENTE.
        </AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando suas turmas...</p>
        </div>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Turmas</h1>
          <p className="text-gray-600">Turmas da sua empresa</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Lista
          </Button>
        </div>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="search"
                placeholder="Buscar turmas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
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
            <p className="text-xs text-gray-600">Cadastradas</p>
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
            <CardTitle className="text-sm font-medium text-gray-600">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.reduce((acc, c) => acc + (c.students?.length || c.totalStudents || 0), 0)}
            </div>
            <p className="text-xs text-gray-600">Matriculados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Certificados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classes.reduce((acc, c) => acc + (c.certificates?.length || 0), 0)}
            </div>
            <p className="text-xs text-gray-600">Emitidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de turmas */}
      {classes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma turma encontrada</h3>
            <p className="text-gray-600">Sua empresa ainda não possui turmas cadastradas.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((turma) => (
            <Card key={turma.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{turma.name || turma.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {turma.description || 'Sem descrição'}
                    </CardDescription>
                  </div>
                  <Badge variant={
                    turma.status === 'ATIVO' || turma.status === 'EM_ANDAMENTO' ? 'default' : 
                    turma.status === 'CONCLUIDO' ? 'secondary' : 'outline'
                  }>
                    {turma.status || 'N/A'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  
                  {/* Informações da turma */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{turma.students?.length || turma.totalStudents || 0} alunos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span>{turma.training?.name || turma.courseName || 'Curso'}</span>
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

                  {/* Instrutor */}
                  {turma.instructor && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>Instrutor: {turma.instructor.name || turma.instructor}</span>
                    </div>
                  )}

                  {/* Local */}
                  {turma.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{turma.location}</span>
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
                    {turma.certificates && turma.certificates.length > 0 && (
                      <Button variant="outline" size="sm">
                        <Award className="h-4 w-4 mr-2" />
                        Certificados
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Informações adicionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Esta página exibe apenas as turmas relacionadas à sua empresa</p>
            <p>• Para mais informações sobre uma turma específica, clique em "Detalhes"</p>
            <p>• Certificados podem ser baixados individualmente após a conclusão do treinamento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
