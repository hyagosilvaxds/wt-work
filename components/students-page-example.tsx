"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react"

export function StudentsPageExample() {
  const { hasPermission } = useAuth()

  // Dados mockados de alunos
  const students = [
    {
      id: 1,
      name: "João Silva",
      email: "joao@email.com",
      cpf: "123.456.789-00",
      phone: "(11) 99999-9999",
      status: "Ativo",
      trainings: 3
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@email.com",
      cpf: "987.654.321-00",
      phone: "(11) 88888-8888",
      status: "Ativo",
      trainings: 1
    },
    {
      id: 3,
      name: "Pedro Oliveira",
      email: "pedro@email.com",
      cpf: "456.789.123-00",
      phone: "(11) 77777-7777",
      status: "Inativo",
      trainings: 0
    }
  ]

  // Verificar se o usuário tem pelo menos permissão para ver alunos
  if (!hasPermission('VIEW_STUDENTS')) {
    return (
      <Alert className="m-6">
        <AlertDescription>
          Você não tem permissão para visualizar alunos.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Header com ações condicionais */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
          <p className="text-gray-600">Gerenciamento de estudantes</p>
        </div>
        <div className="flex gap-2">
          {hasPermission('CREATE_STUDENTS') && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Aluno
            </Button>
          )}
          {hasPermission('EXPORT_REPORTS') && (
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          )}
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
                placeholder="Buscar alunos..."
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

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-gray-600">+2 este mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Alunos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter(s => s.status === 'Ativo').length}</div>
            <p className="text-xs text-gray-600">66% do total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Em Treinamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter(s => s.trainings > 0).length}</div>
            <p className="text-xs text-gray-600">Participando ativamente</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de alunos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Alunos
          </CardTitle>
          <CardDescription>
            Gerencie os alunos cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Nome</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">CPF</th>
                  <th className="text-left p-3 font-medium">Telefone</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Treinamentos</th>
                  <th className="text-left p-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">{student.name}</div>
                    </td>
                    <td className="p-3 text-gray-600">{student.email}</td>
                    <td className="p-3 text-gray-600">{student.cpf}</td>
                    <td className="p-3 text-gray-600">{student.phone}</td>
                    <td className="p-3">
                      <Badge variant={student.status === 'Ativo' ? 'default' : 'secondary'}>
                        {student.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {student.trainings}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        
                        {/* Ações sempre visíveis */}
                        <Button variant="ghost" size="sm" title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {/* Ações condicionais baseadas em permissões */}
                        {hasPermission('EDIT_STUDENTS') && (
                          <Button variant="ghost" size="sm" title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {hasPermission('DELETE_STUDENTS') && (
                          <Button variant="ghost" size="sm" title="Excluir" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm" title="Mais opções">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ações em lote - só aparece se tiver permissões */}
      {(hasPermission('EDIT_STUDENTS') || hasPermission('DELETE_STUDENTS')) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações em Lote</CardTitle>
            <CardDescription>
              Selecione alunos para executar ações em massa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {hasPermission('EDIT_STUDENTS') && (
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Selecionados
                </Button>
              )}
              {hasPermission('DELETE_STUDENTS') && (
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Selecionados
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações sobre permissões para debug */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Suas Permissões Relacionadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant={hasPermission('VIEW_STUDENTS') ? 'default' : 'secondary'}>
              VIEW_STUDENTS: {hasPermission('VIEW_STUDENTS') ? '✓' : '✗'}
            </Badge>
            <Badge variant={hasPermission('CREATE_STUDENTS') ? 'default' : 'secondary'}>
              CREATE_STUDENTS: {hasPermission('CREATE_STUDENTS') ? '✓' : '✗'}
            </Badge>
            <Badge variant={hasPermission('EDIT_STUDENTS') ? 'default' : 'secondary'}>
              EDIT_STUDENTS: {hasPermission('EDIT_STUDENTS') ? '✓' : '✗'}
            </Badge>
            <Badge variant={hasPermission('DELETE_STUDENTS') ? 'default' : 'secondary'}>
              DELETE_STUDENTS: {hasPermission('DELETE_STUDENTS') ? '✓' : '✗'}
            </Badge>
            <Badge variant={hasPermission('EXPORT_REPORTS') ? 'default' : 'secondary'}>
              EXPORT_REPORTS: {hasPermission('EXPORT_REPORTS') ? '✓' : '✗'}
            </Badge>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
