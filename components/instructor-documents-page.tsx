"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  X, 
  Calendar,
  User,
  FileIcon,
  AlertCircle,
  CheckCircle,
  Plus
} from "lucide-react"
import { getInstructors } from "@/lib/api/superadmin"

interface InstructorDocument {
  id: string
  instructorId: string
  fileName: string
  originalName: string
  fileType: string
  fileSize: number
  uploadDate: string
  description?: string
  category?: string
  instructor: {
    id: string
    name: string
  }
}

interface Instructor {
  id: string
  name: string
  isActive: boolean
}

export function InstructorDocumentsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [documents, setDocuments] = useState<InstructorDocument[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<InstructorDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInstructor, setSelectedInstructor] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<InstructorDocument | null>(null)

  // Estados do formulário de upload
  const [uploadForm, setUploadForm] = useState({
    instructorId: "",
    file: null as File | null,
    description: "",
    category: ""
  })

  const documentCategories = [
    { value: "certificado", label: "Certificado" },
    { value: "diploma", label: "Diploma" },
    { value: "curriculo", label: "Currículo" },
    { value: "comprovante", label: "Comprovante" },
    { value: "contrato", label: "Contrato" },
    { value: "outros", label: "Outros" }
  ]

  // Carregar instrutores
  const fetchInstructors = useCallback(async () => {
    try {
      const response = await getInstructors(1, 1000)
      setInstructors(response.instructors.filter((inst: any) => inst.isActive))
    } catch (error) {
      console.error('Erro ao carregar instrutores:', error)
    }
  }, [])

  // Carregar documentos (simulado - implementar API real)
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true)
      // Simulação de dados - substituir por chamada API real
      const mockDocuments: InstructorDocument[] = [
        {
          id: "1",
          instructorId: "1",
          fileName: "certificado_instrutor_1.pdf",
          originalName: "Certificado de Instrutor.pdf",
          fileType: "application/pdf",
          fileSize: 2048000,
          uploadDate: "2024-01-15T10:30:00Z",
          description: "Certificado de instrutor de segurança",
          category: "certificado",
          instructor: {
            id: "1",
            name: "João Silva"
          }
        },
        {
          id: "2",
          instructorId: "1",
          fileName: "curriculo_joao.pdf",
          originalName: "Currículo João Silva.pdf",
          fileType: "application/pdf",
          fileSize: 1024000,
          uploadDate: "2024-01-10T14:20:00Z",
          description: "Currículo atualizado",
          category: "curriculo",
          instructor: {
            id: "1",
            name: "João Silva"
          }
        }
      ]
      setDocuments(mockDocuments)
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Filtrar documentos
  useEffect(() => {
    let filtered = documents

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por instrutor
    if (selectedInstructor !== "all") {
      filtered = filtered.filter(doc => doc.instructorId === selectedInstructor)
    }

    // Filtrar por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter(doc => doc.category === selectedCategory)
    }

    setFilteredDocuments(filtered)
  }, [documents, searchTerm, selectedInstructor, selectedCategory])

  useEffect(() => {
    fetchInstructors()
    fetchDocuments()
  }, [fetchInstructors, fetchDocuments])

  // Manipular upload de arquivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadForm(prev => ({ ...prev, file }))
    }
  }

  // Submeter upload
  const handleUploadSubmit = async () => {
    if (!uploadForm.file || !uploadForm.instructorId) {
      return
    }

    try {
      setUploadLoading(true)
      
      // Simular upload - implementar API real
      const newDocument: InstructorDocument = {
        id: String(Date.now()),
        instructorId: uploadForm.instructorId,
        fileName: `${Date.now()}_${uploadForm.file.name}`,
        originalName: uploadForm.file.name,
        fileType: uploadForm.file.type,
        fileSize: uploadForm.file.size,
        uploadDate: new Date().toISOString(),
        description: uploadForm.description,
        category: uploadForm.category,
        instructor: {
          id: uploadForm.instructorId,
          name: instructors.find(i => i.id === uploadForm.instructorId)?.name || "Instrutor"
        }
      }

      setDocuments(prev => [newDocument, ...prev])
      
      // Resetar formulário
      setUploadForm({
        instructorId: "",
        file: null,
        description: "",
        category: ""
      })
      
      setUploadModalOpen(false)
      
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
    } finally {
      setUploadLoading(false)
    }
  }

  // Deletar documento
  const handleDeleteDocument = async () => {
    if (!selectedDocument) return

    try {
      // Implementar API de exclusão
      setDocuments(prev => prev.filter(doc => doc.id !== selectedDocument.id))
      setDeleteModalOpen(false)
      setSelectedDocument(null)
    } catch (error) {
      console.error('Erro ao deletar documento:', error)
    }
  }

  // Formatar tamanho do arquivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            {loading 
              ? "Carregando documentos..." 
              : `${filteredDocuments.length} documento(s) encontrado(s)`
            }
          </p>
        </div>
        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Novo Documento
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome do arquivo, instrutor ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Filtrar por instrutor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os instrutores</SelectItem>
            {instructors.map(instructor => (
              <SelectItem key={instructor.id} value={instructor.id}>
                {instructor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {documentCategories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de documentos */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || selectedInstructor !== "all" || selectedCategory !== "all" 
                  ? 'Nenhum documento encontrado' 
                  : 'Nenhum documento cadastrado'
                }
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedInstructor !== "all" || selectedCategory !== "all"
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece fazendo upload de documentos dos instrutores.'
                }
              </p>
              {!(searchTerm || selectedInstructor !== "all" || selectedCategory !== "all") && (
                <Button onClick={() => setUploadModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Documento
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate" title={document.originalName}>
                          {document.originalName}
                        </CardTitle>
                        <div className="flex items-center mt-2 space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {document.category && documentCategories.find(c => c.value === document.category)?.label || 'Sem categoria'}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {formatFileSize(document.fileSize)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{document.instructor.name}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{formatDate(document.uploadDate)}</span>
                    </div>
                    
                    {document.description && (
                      <div className="flex items-start text-sm text-gray-600">
                        <FileText className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{document.description}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Implementar download
                          console.log('Download:', document.fileName)
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDocument(document)
                          setDeleteModalOpen(true)
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de Upload */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Documento</DialogTitle>
          <DialogDescription>
            Faça upload de um documento para um instrutor
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Instrutor *</label>
            <Select value={uploadForm.instructorId} onValueChange={(value) => 
              setUploadForm(prev => ({ ...prev, instructorId: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um instrutor" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map(instructor => (
                  <SelectItem key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Categoria</label>
            <Select value={uploadForm.category} onValueChange={(value) => 
              setUploadForm(prev => ({ ...prev, category: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {documentCategories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Arquivo *</label>
            <Input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="mt-1"
            />
            {uploadForm.file && (
              <p className="text-sm text-gray-600 mt-1">
                {uploadForm.file.name} ({formatFileSize(uploadForm.file.size)})
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Input
              placeholder="Descrição do documento (opcional)"
              value={uploadForm.description}
              onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setUploadModalOpen(false)}
            disabled={uploadLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleUploadSubmit}
            disabled={!uploadForm.file || !uploadForm.instructorId || uploadLoading}
          >
            {uploadLoading ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o documento "{selectedDocument?.originalName}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteDocument}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InstructorDocumentsPage
