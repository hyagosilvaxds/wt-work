"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Users, 
  BookOpen, 
  Award, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Shield,
  UserCheck,
  Lock
} from "lucide-react"

export function RoleBasedContent() {
  const { user, hasPermission } = useAuth()

  const isInstructor = hasPermission('VIEW_OWN_TRAININGS') && !hasPermission('VIEW_TRAININGS')
  const isAdmin = hasPermission('MANAGE_USERS')
  const isDirector = hasPermission('VIEW_FINANCIAL')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Conteúdo Baseado em Permissões
          </CardTitle>
          <CardDescription>
            Demonstração de como o conteúdo muda baseado no nível de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Tipo de usuário:</span>
              {isDirector && <Badge variant="default">Diretor</Badge>}
              {isAdmin && <Badge variant="secondary">Administrador</Badge>}
              {isInstructor && <Badge variant="outline">Instrutor</Badge>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Seção de Treinamentos */}
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Treinamentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {hasPermission('VIEW_TRAININGS') ? (
                    <div className="space-y-2">
                      <Alert>
                        <Eye className="h-4 w-4" />
                        <AlertDescription>
                          Você pode ver TODOS os treinamentos do sistema
                        </AlertDescription>
                      </Alert>
                      <div className="flex flex-wrap gap-2">
                        {hasPermission('CREATE_TRAININGS') && (
                          <Button size="sm" className="flex items-center gap-1">
                            <Plus className="h-3 w-3" />
                            Criar
                          </Button>
                        )}
                        {hasPermission('EDIT_TRAININGS') && (
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Edit className="h-3 w-3" />
                            Editar
                          </Button>
                        )}
                        {hasPermission('DELETE_TRAININGS') && (
                          <Button size="sm" variant="destructive" className="flex items-center gap-1">
                            <Trash2 className="h-3 w-3" />
                            Excluir
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : hasPermission('VIEW_OWN_TRAININGS') ? (
                    <div className="space-y-2">
                      <Alert>
                        <UserCheck className="h-4 w-4" />
                        <AlertDescription>
                          Você pode ver apenas seus próprios treinamentos
                        </AlertDescription>
                      </Alert>
                      <div className="flex flex-wrap gap-2">
                        {hasPermission('EDIT_OWN_TRAININGS') && (
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Edit className="h-3 w-3" />
                            Editar Próprios
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Alert>
                      <Lock className="h-4 w-4" />
                      <AlertDescription>
                        Sem acesso a treinamentos
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Seção de Usuários */}
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {hasPermission('MANAGE_USERS') ? (
                    <div className="space-y-2">
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          Você tem acesso total ao gerenciamento de usuários
                        </AlertDescription>
                      </Alert>
                      <div className="flex flex-wrap gap-2">
                        {hasPermission('CREATE_USERS') && (
                          <Button size="sm" className="flex items-center gap-1">
                            <Plus className="h-3 w-3" />
                            Criar
                          </Button>
                        )}
                        {hasPermission('EDIT_USERS') && (
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Edit className="h-3 w-3" />
                            Editar
                          </Button>
                        )}
                        {hasPermission('DELETE_USERS') && (
                          <Button size="sm" variant="destructive" className="flex items-center gap-1">
                            <Trash2 className="h-3 w-3" />
                            Excluir
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : hasPermission('VIEW_USERS') ? (
                    <div className="space-y-2">
                      <Alert>
                        <Eye className="h-4 w-4" />
                        <AlertDescription>
                          Você pode apenas visualizar usuários
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <Alert>
                      <Lock className="h-4 w-4" />
                      <AlertDescription>
                        Sem acesso a usuários
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Seção de Certificados */}
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certificados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {hasPermission('VIEW_CERTIFICATES') ? (
                    <div className="space-y-2">
                      <Alert>
                        <Eye className="h-4 w-4" />
                        <AlertDescription>
                          Você pode ver TODOS os certificados
                        </AlertDescription>
                      </Alert>
                      <div className="flex flex-wrap gap-2">
                        {hasPermission('CREATE_CERTIFICATES') && (
                          <Button size="sm" className="flex items-center gap-1">
                            <Plus className="h-3 w-3" />
                            Criar
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : hasPermission('VIEW_OWN_CERTIFICATES') ? (
                    <div className="space-y-2">
                      <Alert>
                        <UserCheck className="h-4 w-4" />
                        <AlertDescription>
                          Você pode ver apenas certificados dos seus treinamentos
                        </AlertDescription>
                      </Alert>
                      <div className="flex flex-wrap gap-2">
                        {hasPermission('CREATE_OWN_CERTIFICATES') && (
                          <Button size="sm" className="flex items-center gap-1">
                            <Plus className="h-3 w-3" />
                            Emitir Próprios
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Alert>
                      <Lock className="h-4 w-4" />
                      <AlertDescription>
                        Sem acesso a certificados
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Seção Financeira */}
            {hasPermission('VIEW_FINANCIAL') && (
              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                    <Shield className="h-5 w-5" />
                    Acesso Financeiro (Nível Alto)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {hasPermission('VIEW_ACCOUNTS_RECEIVABLE') && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800">Contas a Receber</h4>
                        <p className="text-sm text-green-600">Visualizar e gerenciar recebimentos</p>
                      </div>
                    )}
                    
                    {hasPermission('VIEW_ACCOUNTS_PAYABLE') && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800">Contas a Pagar</h4>
                        <p className="text-sm text-green-600">Visualizar pagamentos pendentes</p>
                      </div>
                    )}
                    
                    {hasPermission('VIEW_CASH_FLOW') && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800">Fluxo de Caixa</h4>
                        <p className="text-sm text-green-600">Controle completo do fluxo financeiro</p>
                      </div>
                    )}
                    
                    {hasPermission('SETTLE_ACCOUNTS') && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800">Quitar Contas</h4>
                        <p className="text-sm text-green-600">Autorizado a realizar quitações</p>
                      </div>
                    )}
                    
                    {hasPermission('MANAGE_BANK_ACCOUNTS') && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800">Contas Bancárias</h4>
                        <p className="text-sm text-green-600">Gerenciar contas bancárias</p>
                      </div>
                    )}

                  </div>
                </CardContent>
              </Card>
            )}

            {/* Exemplo de uso condicional */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exemplo de Código</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <code className="text-sm">
                    {`// Exemplo de renderização condicional
{hasPermission('VIEW_STUDENTS') && (
  <StudentsTable />
)}

{hasPermission('VIEW_OWN_TRAININGS') && !hasPermission('VIEW_TRAININGS') && (
  <InstructorTrainings />
)}

{hasPermission('MANAGE_USERS') && (
  <AdminPanel />
)}`}
                  </code>
                </div>
              </CardContent>
            </Card>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
