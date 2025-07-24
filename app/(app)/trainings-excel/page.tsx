"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BookOpen,
  Clock,
  Calendar,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Plus,
  Filter,
  Search,
  FileSpreadsheet,
  Download,
  Upload,
  Loader2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { TrainingExcelManager } from "@/components/training-excel-manager"
import { toast } from "sonner"

// Mock data para demonstração - substitua pela chamada real da API
interface Training {
  id: string
  title: string
  description?: string
  durationHours: number
  validityDays?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  totalClasses?: number
  totalStudents?: number
}

const mockTrainings: Training[] = [
  {
    id: "1",
    title: "NR10 - Segurança em Instalações e Serviços em Eletricidade",
    description: "Treinamento obrigatório para trabalhos em eletricidade",
    durationHours: 40,
    validityDays: 730,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    totalClasses: 12,
    totalStudents: 180
  },
  {
    id: "2", 
    title: "NR33 - Segurança e Saúde nos Trabalhos em Espaços Confinados",
    description: "Capacitação para trabalhos em espaços confinados",
    durationHours: 16,
    validityDays: 365,
    isActive: true,
    createdAt: "2024-02-01T14:30:00Z",
    updatedAt: "2024-02-01T14:30:00Z",
    totalClasses: 8,
    totalStudents: 95
  },
  {
    id: "3",
    title: "Primeiros Socorros",
    description: "Curso básico de primeiros socorros no ambiente de trabalho",
    durationHours: 8,
    validityDays: 365,
    isActive: true,
    createdAt: "2024-03-10T09:15:00Z",
    updatedAt: "2024-03-10T09:15:00Z",
    totalClasses: 15,
    totalStudents: 220
  },
  {
    id: "4",
    title: "Direção Defensiva",
    description: "Treinamento de direção defensiva para condutores",
    durationHours: 20,
    validityDays: 1095,
    isActive: false,
    createdAt: "2024-01-20T16:45:00Z",
    updatedAt: "2024-06-15T11:20:00Z",
    totalClasses: 5,
    totalStudents: 60
  }
]

export default function TrainingsManagementPage() {
  const [trainings, setTrainings] = useState<Training[]>(mockTrainings)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("list")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  // Função para recarregar treinamentos (substitua pela chamada real da API)
  const loadTrainings = async () => {
    setLoading(true)
    try {
      // Simular carregamento da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      // setTrainings(await fetchTrainings())
    } catch (error) {
      console.error('Erro ao carregar treinamentos:', error)
      toast.error('Erro ao carregar treinamentos')
    } finally {
      setLoading(false)
    }
  }

  // Filtrar treinamentos
  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = 
      training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && training.isActive) ||
      (statusFilter === "inactive" && !training.isActive)
    
    return matchesSearch && matchesStatus
  })

  // Estatísticas
  const stats = {
    total: trainings.length,
    active: trainings.filter(t => t.isActive).length,
    inactive: trainings.filter(t => !t.isActive).length,
    totalClasses: trainings.reduce((sum, t) => sum + (t.totalClasses || 0), 0),
    totalStudents: trainings.reduce((sum, t) => sum + (t.totalStudents || 0), 0)
  }

  const handleImportComplete = () => {
    toast.success('Treinamentos importados! Atualizando lista...')
    loadTrainings()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${hours}h`
    }
    const days = Math.floor(hours / 8) // Considerando 8h por dia
    const remainingHours = hours % 8
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
  }

  const formatValidity = (days?: number) => {
    if (!days) return 'Indefinida'
    if (days < 30) return `${days} dias`
    if (days < 365) return `${Math.floor(days / 30)} meses`
    return `${Math.floor(days / 365)} anos`
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Treinamentos</h1>
          <p className="text-gray-600">
            Gerencie treinamentos e importe/exporte dados via Excel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={loadTrainings} variant="outline" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              '🔄'
            )}
            Atualizar
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Treinamento
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-sm text-gray-600">Total de Treinamentos</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-sm text-gray-600">Treinamentos Ativos</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            <p className="text-sm text-gray-600">Treinamentos Inativos</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.totalClasses}</div>
            <p className="text-sm text-gray-600">Total de Turmas</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.totalStudents}</div>
            <p className="text-sm text-gray-600">Total de Alunos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Lista de Treinamentos
          </TabsTrigger>
          <TabsTrigger value="excel" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Excel Import/Export
          </TabsTrigger>
        </TabsList>

        {/* Aba Lista de Treinamentos */}
        <TabsContent value="list" className="space-y-4">
          {/* Filtros e Busca */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar treinamentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Status: {statusFilter === "all" ? "Todos" : statusFilter === "active" ? "Ativos" : "Inativos"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      Todos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                      Apenas Ativos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                      Apenas Inativos
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Treinamentos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTrainings.map((training) => (
              <Card key={training.id} className="border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{training.title}</CardTitle>
                      {training.description && (
                        <CardDescription className="mt-2 line-clamp-2">
                          {training.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge variant={training.isActive ? "default" : "secondary"}>
                        {training.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Duração:</span>
                        <span className="font-medium">{formatDuration(training.durationHours)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Validade:</span>
                        <span className="font-medium">{formatValidity(training.validityDays)}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Turmas:</span>
                        <span className="font-medium">{training.totalClasses || 0}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Alunos:</span>
                        <span className="font-medium">{training.totalStudents || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Criado: {formatDate(training.createdAt)}</span>
                      <span>Atualizado: {formatDate(training.updatedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTrainings.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600">
                {searchTerm ? "Nenhum treinamento encontrado" : "Nenhum treinamento cadastrado"}
              </h3>
              <p className="text-gray-500 mt-2">
                {searchTerm 
                  ? "Tente usar outros termos de busca" 
                  : "Comece adicionando um novo treinamento ou importe via Excel"
                }
              </p>
            </div>
          )}
        </TabsContent>

        {/* Aba Excel */}
        <TabsContent value="excel">
          <TrainingExcelManager onImportComplete={handleImportComplete} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
