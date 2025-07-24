'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Clock, Users, BookOpen, Search, Edit, Trash2, Eye, FileSpreadsheet } from "lucide-react"
import { useState, useEffect } from "react"
import { 
  getTrainings, 
  deleteTraining, 
  type CreateTrainingData 
} from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"
import { TrainingCreateModal } from "./training-create-modal"
import { TrainingDetailsModal } from "./training-details-modal"
import { QuickTrainingExcel } from "./quick-training-excel"
import { TrainingExcelManager } from "./training-excel-manager"

interface Training {
  id: string
  title: string
  description?: string
  durationHours: number
  programContent?: string
  isActive: boolean
  validityDays?: number
  createdAt: string
  updatedAt: string
}

export function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTraining, setEditingTraining] = useState<Training | null>(null)
  const [viewingTraining, setViewingTraining] = useState<Training | null>(null)
  const [activeTab, setActiveTab] = useState("list")
  const { toast } = useToast()

  // Carregar treinamentos
  const loadTrainings = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true)
      const response = await getTrainings(page, 10, search)
      
      console.log('API Response:', response) // Debug log
      
      // Ajustar para a estrutura real da API
      if (response) {
        // A resposta pode vir diretamente ou dentro de response.data
        const data = response.data || response
        
        setTrainings(data.trainings || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalItems(data.pagination?.total || 0)
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar treinamentos",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erro ao carregar treinamentos:', error)
      toast({
        title: "Erro",
        description: "Falha ao carregar treinamentos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Deletar treinamento
  const handleDeleteTraining = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o treinamento "${title}"?`)) {
      return
    }

    try {
      const response = await deleteTraining(id)
      
      console.log('Delete Response:', response) // Debug log
      
      // A API pode retornar diferentes estruturas dependendo do sucesso
      toast({
        title: "Sucesso",
        description: "Treinamento excluído com sucesso",
      })
      loadTrainings(currentPage, searchTerm)
    } catch (error) {
      console.error('Erro ao excluir treinamento:', error)
      toast({
        title: "Erro",
        description: "Falha ao excluir treinamento",
        variant: "destructive",
      })
    }
  }

  // Buscar treinamentos (com debounce)
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
    // Não chama loadTrainings diretamente aqui
  }

  // Debounce para busca
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  // Chama a busca quando debouncedSearchTerm muda
  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      loadTrainings(1, debouncedSearchTerm)
    } else {
      loadTrainings(1, "")
    }
  }, [debouncedSearchTerm])

  // Carregar dados iniciais
  useEffect(() => {
    loadTrainings()
  }, [])

  // Abrir modal de criação
  const handleCreateTraining = () => {
    setEditingTraining(null)
    setShowCreateModal(true)
  }

  // Abrir modal de visualização de detalhes
  const handleViewTraining = (training: Training) => {
    setViewingTraining(training)
  }

  // Abrir modal de edição
  const handleEditTraining = (training: Training) => {
    setEditingTraining(training)
    setShowCreateModal(true)
  }

  // Fechar modal
  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingTraining(null)
  }

  // Navegar páginas
  const goToPage = (page: number) => {
    setCurrentPage(page)
    loadTrainings(page, searchTerm)
  }

  // Callback de sucesso do modal
  const handleModalSuccess = () => {
    loadTrainings(currentPage, searchTerm)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Treinamentos</h1>
            <p className="text-gray-600">Gerencie os treinamentos oferecidos</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Carregando treinamentos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Treinamentos</h1>
          <p className="text-gray-600">Gerencie os treinamentos oferecidos</p>
        </div>
        <div className="flex items-center gap-3">
          <QuickTrainingExcel 
            onImportComplete={() => {
              toast({
                title: "Sucesso",
                description: "Treinamentos importados com sucesso!",
              })
              loadTrainings(currentPage, searchTerm)
            }}
            exportFilters={{ isActive: true }}
          />
          <Button 
            className="bg-primary-500 hover:bg-primary-600"
            onClick={handleCreateTraining}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Treinamento
          </Button>
        </div>
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
          {/* Barra de busca */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título, descrição ou conteúdo programático..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              {totalItems} treinamento{totalItems !== 1 ? 's' : ''} encontrado{totalItems !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Lista de treinamentos */}
          {trainings.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum treinamento encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece criando um novo treinamento.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainings.map((training) => (
                <Card key={training.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Treinamento</Badge>
                      <Badge
                        variant={training.isActive ? "default" : "secondary"}
                        className={training.isActive ? "bg-primary-500" : ""}
                      >
                        {training.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{training.title}</CardTitle>
                    <CardDescription>{training.description || "Sem descrição"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="mr-2 h-4 w-4" />
                        {training.durationHours} hora{training.durationHours !== 1 ? 's' : ''}
                      </div>
                      {training.validityDays && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="mr-2 h-4 w-4" />
                          Válido por {training.validityDays} dias
                        </div>
                      )}
                      {training.programContent && (
                        <div className="flex items-center text-sm text-gray-600">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Conteúdo programático disponível
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewTraining(training)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          Ver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-secondary-500 hover:bg-secondary-600 text-white"
                          onClick={() => handleEditTraining(training)}
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteTraining(training.id, training.title)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Anterior
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className={currentPage === pageNum ? "bg-primary-500" : ""}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Próximo
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Aba Excel */}
        <TabsContent value="excel">
          <TrainingExcelManager 
            onImportComplete={() => {
              toast({
                title: "Sucesso",
                description: "Treinamentos importados com sucesso!",
              })
              loadTrainings(currentPage, searchTerm)
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Modal de criação/edição */}
      <TrainingCreateModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        training={editingTraining}
      />

      {/* Modal de visualização de detalhes */}
      <TrainingDetailsModal
        isOpen={!!viewingTraining}
        onClose={() => setViewingTraining(null)}
        training={viewingTraining}
      />
    </div>
  )
}
