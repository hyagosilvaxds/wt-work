'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Clock, Users, BookOpen, Search, Edit, Trash2, Eye, FileSpreadsheet, Download, Upload, FileText, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { 
  getTrainings, 
  deleteTraining, 
  type CreateTrainingData,
  exportTrainingsToExcel,
  importTrainingsFromExcel,
  downloadTrainingsTemplate,
  downloadExcelFile
} from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"
import { TrainingCreateModal } from "./training-create-modal"
import { TrainingDetailsModal } from "./training-details-modal"

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
  
  // Excel states
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  
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

  // Handle download template
  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadTrainingsTemplate()
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'template_treinamentos.xlsx'
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Download concluído",
        description: "Template de treinamentos baixado com sucesso",
      })
    } catch (error: any) {
      console.error('Erro ao baixar template:', error)
      toast({
        title: "Erro no download",
        description: "Erro ao baixar template de treinamentos",
        variant: "destructive"
      })
    }
  }

  // Handle export to Excel
  const handleExportToExcel = async () => {
    try {
      setIsExporting(true)
      
      const filters = {
        search: searchTerm || undefined,
        isActive: true
      }
      
      const result = await exportTrainingsToExcel(filters)
      
      toast({
        title: "Exportação concluída",
        description: `${result.totalRecords} treinamentos exportados com sucesso`,
      })

      // Fazer download automático usando o fileName da resposta
      await downloadExcelFile(result.fileName)
      
    } catch (error: any) {
      console.error('Erro na exportação:', error)
      
      let errorMessage = "Erro ao exportar treinamentos"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Erro na exportação",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Handle file selection for import
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  // Handle import from Excel
  const handleImportFromExcel = async () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo Excel primeiro",
        variant: "destructive"
      })
      return
    }

    try {
      setIsImporting(true)
      
      // Primeiro validar o arquivo
      const validation = await importTrainingsFromExcel(selectedFile, true)
      
      if (validation.invalidRecords > 0) {
        const errorDetails = validation.errors?.map(err => 
          `Linha ${err.row}: ${err.field} - ${err.message}`
        ).join('\n') || ''
        
        toast({
          title: "Arquivo com erros",
          description: `${validation.invalidRecords} registros com problemas:\n${errorDetails}`,
          variant: "destructive"
        })
        return
      }

      // Se validação passou, perguntar se quer importar
      if (!confirm(`Validação concluída! ${validation.validRecords} registros válidos encontrados. Deseja prosseguir com a importação?`)) {
        return
      }

      // Importar os dados
      const result = await importTrainingsFromExcel(selectedFile, false)
      
      toast({
        title: "Importação concluída",
        description: `${result.importedRecords} treinamentos importados com sucesso de ${result.totalRecords} registros processados`,
      })

      // Limpar arquivo selecionado e recarregar lista
      setSelectedFile(null)
      setIsImportDialogOpen(false)
      const fileInput = document.getElementById('training-file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      
      loadTrainings(currentPage, searchTerm)
      
    } catch (error: any) {
      console.error('Erro na importação:', error)
      
      let errorMessage = "Erro ao importar treinamentos"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.errors) {
        const errorDetails = error.response.data.errors.map((err: any) => 
          `Linha ${err.row}: ${err.field} - ${err.message}`
        ).join('\n')
        errorMessage = `Erros encontrados:\n${errorDetails}`
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Erro na importação",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsImporting(false)
    }
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
          <Button 
            variant="outline"
            onClick={handleExportToExcel}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <div className="h-4 w-4 animate-spin border-2 border-gray-300 border-t-gray-600 rounded-full" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? 'Exportando...' : 'Exportar Excel'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setIsImportDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar Excel
          </Button>
          
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
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Lista de Treinamentos
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

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Importar Treinamentos do Excel</DialogTitle>
            <DialogDescription>
              Selecione um arquivo Excel (.xlsx ou .xls) para importar treinamentos em lote
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h4 className="font-medium text-blue-900 mb-2">Precisa do template?</h4>
              <p className="text-sm text-blue-700 mb-3">
                Baixe o arquivo modelo com a estrutura correta para importação.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar Template
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="training-file-input">Arquivo Excel</Label>
              <Input
                id="training-file-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
              />
              <p className="text-sm text-muted-foreground">
                Apenas arquivos .xlsx e .xls são aceitos
              </p>
            </div>

            {selectedFile && (
              <div className="p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <div className="p-3 border rounded-lg bg-yellow-50">
              <h4 className="font-medium text-yellow-900 mb-1">Importante:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Título é obrigatório e deve ser único</li>
                <li>• Duração (Horas) deve ser maior que 0</li>
                <li>• Validade (Dias) é opcional</li>
                <li>• Status padrão é "Ativo"</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsImportDialogOpen(false)
                setSelectedFile(null)
                const fileInput = document.getElementById('training-file-input') as HTMLInputElement
                if (fileInput) fileInput.value = ''
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleImportFromExcel}
              disabled={!selectedFile || isImporting}
              className="flex items-center gap-2"
            >
              {isImporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isImporting ? 'Importando...' : 'Importar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
