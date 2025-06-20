import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Users, Award, Download, Calendar } from "lucide-react"

export function ReportsPage() {
  const reportTypes = [
    {
      title: "Relatório de Alunos",
      description: "Lista completa de alunos cadastrados com status e informações",
      icon: Users,
      color: "text-primary-500",
    },
    {
      title: "Relatório de Treinamentos",
      description: "Estatísticas e dados dos treinamentos oferecidos",
      icon: BarChart3,
      color: "text-secondary-500",
    },
    {
      title: "Relatório de Certificados",
      description: "Certificados emitidos por período e treinamento",
      icon: Award,
      color: "text-primary-500",
    },
    {
      title: "Relatório de Performance",
      description: "Análise de performance dos instrutores e treinamentos",
      icon: TrendingUp,
      color: "text-secondary-500",
    },
  ]

  const quickStats = [
    { label: "Total de Relatórios Gerados", value: "156", period: "Este mês" },
    { label: "Último Relatório", value: "Há 2 horas", period: "Relatório de Alunos" },
    { label: "Relatórios Agendados", value: "8", period: "Próximos 7 dias" },
    { label: "Downloads Realizados", value: "89", period: "Esta semana" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Gere e visualize relatórios do sistema</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report, index) => {
          const Icon = report.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Icon className={`h-8 w-8 ${report.color}`} />
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-primary-500 hover:bg-primary-600">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Gerar Relatório
                  </Button>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Recentes</CardTitle>
          <CardDescription>Últimos relatórios gerados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Relatório Mensal de Alunos", date: "2024-01-15", size: "2.3 MB" },
              { name: "Performance dos Instrutores", date: "2024-01-14", size: "1.8 MB" },
              { name: "Certificados Emitidos - Janeiro", date: "2024-01-13", size: "945 KB" },
              { name: "Relatório de Treinamentos Ativos", date: "2024-01-12", size: "1.2 MB" },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-gray-600">
                    {report.date} • {report.size}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
