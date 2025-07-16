"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import {
  Users,
  BookOpen,
  Award,
  Calendar,
  Clock,
  Building2,
  Eye,
  Download,
  TrendingUp,
  MapPin,
  User
} from "lucide-react"

export default function ClientDashboard() {
  const { user, getClientClasses } = useAuth()
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getClientClasses()
        setClasses(response.classes || response || [])
      } catch (error) {
        console.error('Erro ao carregar turmas:', error)
        setClasses([])
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [getClientClasses])

  // Calcular estatísticas
  const totalClasses = classes.length
  const activeClasses = classes.filter(c => c.status === 'ATIVO' || c.status === 'EM_ANDAMENTO').length
  const totalStudents = classes.reduce((acc, c) => acc + (c.students?.length || c.totalStudents || 0), 0)
  const totalCertificates = classes.reduce((acc, c) => acc + (c.certificates?.length || 0), 0)

  const stats = [
    {
      title: "Minhas Turmas",
      value: totalClasses.toString(),
      description: `${activeClasses} ativas`,
      icon: BookOpen,
      trend: `${activeClasses}/${totalClasses}`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total de Alunos",
      value: totalStudents.toString(),
      description: "Matriculados nas turmas",
      icon: Users,
      trend: `${totalStudents}`,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Certificados",
      value: totalCertificates.toString(),
      description: "Emitidos",
      icon: Award,
      trend: `${totalCertificates}`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Empresa",
      value: user?.company?.name || "Minha Empresa",
      description: "Razão social",
      icon: Building2,
      trend: "Ativo",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Cliente</h1>
          <p className="text-gray-600">Visão geral das suas turmas e treinamentos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Calendário
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {stat.description}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs font-medium text-green-600">
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Turmas Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Turmas Recentes
            </CardTitle>
            <CardDescription>
              Suas turmas mais recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : classes.length > 0 ? (
              <div className="space-y-4">
                {classes.slice(0, 5).map((turma) => (
                  <div key={turma.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{turma.name || turma.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {turma.students?.length || turma.totalStudents || 0} alunos
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        turma.status === 'ATIVO' || turma.status === 'EM_ANDAMENTO' ? 'default' : 'secondary'
                      }>
                        {turma.status || 'N/A'}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>Nenhuma turma encontrada</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Próximos Eventos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Próximos Eventos
            </CardTitle>
            <CardDescription>
              Treinamentos e atividades programadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.filter(c => c.status === 'ATIVO' || c.status === 'EM_ANDAMENTO').slice(0, 3).map((turma) => (
                <div key={turma.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{turma.name || turma.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {turma.startDate ? new Date(turma.startDate).toLocaleDateString() : 'Data a definir'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {turma.duration || turma.workload || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {classes.filter(c => c.status === 'ATIVO' || c.status === 'EM_ANDAMENTO').length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p>Nenhum evento programado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-orange-600" />
            Informações da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Empresa</h4>
              <p className="text-sm">{user?.company?.name || user?.name || 'Nome da Empresa'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Contato</h4>
              <p className="text-sm">{user?.email || 'email@empresa.com'}</p>
              <p className="text-sm">{user?.phone || 'Telefone não informado'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-2">Status</h4>
              <Badge variant="default">Cliente Ativo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-12">
              <BookOpen className="h-4 w-4 mr-2" />
              Ver Todas as Turmas
            </Button>
            <Button variant="outline" className="justify-start h-12">
              <Award className="h-4 w-4 mr-2" />
              Meus Certificados
            </Button>
            <Button variant="outline" className="justify-start h-12">
              <Download className="h-4 w-4 mr-2" />
              Baixar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
