"use client"

import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Eye, Edit, Trash2, Plus, Users, BookOpen } from "lucide-react"

export function PermissionsDebug() {
  const { user, permissions, hasPermission } = useAuth()

  const testPermissions = [
    // Visualização
    { name: "VIEW_DASHBOARD", description: "Visualizar Dashboard", icon: Eye },
    { name: "VIEW_STUDENTS", description: "Visualizar Alunos", icon: Users },
    { name: "VIEW_USERS", description: "Visualizar Usuários", icon: Users },
    { name: "VIEW_TRAININGS", description: "Visualizar Todos os Treinamentos", icon: BookOpen },
    { name: "VIEW_CLASSES", description: "Visualizar Todas as Aulas", icon: BookOpen },
    { name: "VIEW_CERTIFICATES", description: "Visualizar Certificados", icon: BookOpen },
    { name: "VIEW_FINANCIAL", description: "Visualizar Dados Financeiros", icon: Eye },
    { name: "VIEW_REPORTS", description: "Visualizar Relatórios", icon: Eye },
    { name: "VIEW_ACCOUNTS_RECEIVABLE", description: "Visualizar Contas a Receber", icon: Eye },
    { name: "VIEW_ACCOUNTS_PAYABLE", description: "Visualizar Contas a Pagar", icon: Eye },
    { name: "VIEW_CASH_FLOW", description: "Visualizar Fluxo de Caixa", icon: Eye },
    { name: "VIEW_ANALYTICS", description: "Visualizar Análises", icon: Eye },
    
    // Criação
    { name: "CREATE_STUDENTS", description: "Criar Alunos", icon: Plus },
    { name: "CREATE_USERS", description: "Criar Usuários", icon: Plus },
    { name: "CREATE_TRAININGS", description: "Criar Treinamentos", icon: Plus },
    { name: "CREATE_CLASSES", description: "Criar Aulas", icon: Plus },
    { name: "CREATE_CERTIFICATES", description: "Criar Certificados", icon: Plus },
    { name: "CREATE_FINANCIAL", description: "Criar Registros Financeiros", icon: Plus },
    { name: "CREATE_REPORTS", description: "Criar Relatórios", icon: Plus },
    { name: "CREATE_ROLES", description: "Criar Funções", icon: Plus },
    
    // Edição
    { name: "EDIT_STUDENTS", description: "Editar Alunos", icon: Edit },
    { name: "EDIT_USERS", description: "Editar Usuários", icon: Edit },
    { name: "EDIT_TRAININGS", description: "Editar Treinamentos", icon: Edit },
    { name: "EDIT_CLASSES", description: "Editar Aulas", icon: Edit },
    { name: "EDIT_FINANCIAL", description: "Editar Dados Financeiros", icon: Edit },
    { name: "EDIT_REPORTS", description: "Editar Relatórios", icon: Edit },
    { name: "EDIT_ROLES", description: "Editar Funções", icon: Edit },
    { name: "EDIT_PROFILE", description: "Editar Perfil", icon: Edit },
    
    // Exclusão
    { name: "DELETE_STUDENTS", description: "Excluir Alunos", icon: Trash2 },
    { name: "DELETE_USERS", description: "Excluir Usuários", icon: Trash2 },
    { name: "DELETE_TRAININGS", description: "Excluir Treinamentos", icon: Trash2 },
    { name: "DELETE_CLASSES", description: "Excluir Aulas", icon: Trash2 },
    { name: "DELETE_FINANCIAL", description: "Excluir Registros Financeiros", icon: Trash2 },
    { name: "DELETE_REPORTS", description: "Excluir Relatórios", icon: Trash2 },
    { name: "DELETE_ROLES", description: "Excluir Funções", icon: Trash2 },
    
    // Gerenciamento
    { name: "MANAGE_USERS", description: "Gerenciar Usuários (Acesso Total)", icon: Users },
    { name: "MANAGE_BANK_ACCOUNTS", description: "Gerenciar Contas Bancárias", icon: Users },
    
    // Ações Específicas
    { name: "SETTLE_ACCOUNTS", description: "Quitar Contas", icon: Eye },
    { name: "EXPORT_REPORTS", description: "Exportar Relatórios", icon: Eye },
    { name: "GENERATE_FINANCIAL_REPORTS", description: "Gerar Relatórios Financeiros", icon: Eye },
    
    // Permissões Próprias (Instrutor)
    { name: "VIEW_OWN_TRAININGS", description: "Visualizar Apenas Treinamentos Ministrados por Ele", icon: Eye },
    { name: "VIEW_OWN_CLASSES", description: "Visualizar Apenas Aulas Ministradas por Ele", icon: Eye },
    { name: "VIEW_OWN_CERTIFICATES", description: "Visualizar Apenas Certificados de Treinamentos Ministrados por Ele", icon: Eye },
    { name: "EDIT_OWN_TRAININGS", description: "Editar Apenas Treinamentos Ministrados por Ele", icon: Edit },
    { name: "EDIT_OWN_CLASSES", description: "Editar Apenas Aulas Ministradas por Ele", icon: Edit },
    { name: "CREATE_OWN_CERTIFICATES", description: "Emitir Certificados Apenas de Treinamentos Ministrados por Ele", icon: Plus },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Debug de Permissões
          </CardTitle>
          <CardDescription>
            Informações sobre as permissões do usuário atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Usuário:</h3>
              <p><strong>Nome:</strong> {user?.name || 'Não encontrado'}</p>
              <p><strong>Email:</strong> {user?.email || 'Não encontrado'}</p>
              <p><strong>Role:</strong> {user?.role?.name || user?.roleId || 'Não encontrado'}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Permissões ({permissions.length}):</h3>
              <div className="flex flex-wrap gap-2">
                {permissions.map((permission) => (
                  <Badge key={permission.id} variant="secondary" className="text-xs">
                    {permission.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Teste de Permissões:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testPermissions.map((perm) => {
                  const hasAccess = hasPermission(perm.name)
                  const Icon = perm.icon
                  
                  return (
                    <div
                      key={perm.name}
                      className={`p-3 rounded-lg border-2 ${
                        hasAccess
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${hasAccess ? 'text-green-600' : 'text-red-600'}`} />
                        <span className="text-sm font-medium">{perm.name}</span>
                        <Badge variant={hasAccess ? "default" : "destructive"} className="ml-auto">
                          {hasAccess ? "Permitido" : "Negado"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{perm.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Exemplo de Uso:</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <code className="text-sm">
                  {`// Verificar se o usuário tem permissão para ver relatórios
const canViewReports = hasPermission('VIEW_REPORTS')

// Renderizar condicionalmente um botão
{canViewReports && (
  <Button>Ver Relatórios</Button>
)}`}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
