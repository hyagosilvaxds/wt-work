"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  FileText, 
  Calendar, 
  Building,
  CreditCard,
  Info,
  Upload,
  Download,
  Trash2,
  Filter,
  Search,
  X,
  Plus,
  Loader2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  getInstructorById, 
  getInstructorDocuments, 
  uploadInstructorDocument,
  downloadInstructorDocument,
  deleteInstructorDocument,
  type InstructorDetails, 
  type InstructorDocument,
  type UploadInstructorDocumentResponse
} from "@/lib/api/superadmin"

interface InstructorDetailsModalProps {
  instructorId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InstructorDetailsModal({ instructorId, open, onOpenChange }: InstructorDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("info")
  const [instructor, setInstructor] = useState<InstructorDetails | null>(null)
  const [documents, setDocuments] = useState<InstructorDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  // Estados para upload
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null)
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    category: "instructor",
    type: "",
    description: ""
  })

  // Carregar dados do instrutor quando o modal abre
  useEffect(() => {
    if (open && instructorId) {
      loadInstructorData()
    }
  }, [open, instructorId])

  const loadInstructorData = async () => {
    try {
      setLoading(true)
      const instructorData = await getInstructorById(instructorId)
      setInstructor(instructorData)
      
      // Se o instrutor tem documentos no payload, usa eles, senão busca separadamente
      if (instructorData.documents && instructorData.documents.length > 0) {
        setDocuments(instructorData.documents)
      } else {
        try {
          const instructorDocuments = await getInstructorDocuments(instructorId)
          setDocuments(instructorDocuments)
        } catch (docError) {
          console.log('Nenhum documento encontrado para este instrutor')
          setDocuments([])
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do instrutor:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar documentos
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (doc.type && doc.type.toLowerCase().includes(searchTerm.toLowerCase()))
    
    let matchesCategory = categoryFilter === "all"
    if (!matchesCategory) {
      // Verificar tanto o campo 'type' quanto possíveis categorias deduzidas
      const docCategory = doc.type?.toLowerCase() || ""
      const filterCategory = categoryFilter.toLowerCase()
      
      if (filterCategory === "instructor") {
        matchesCategory = docCategory.includes("instrutor") || docCategory === "instructor"
      } else if (filterCategory === "certificados") {
        matchesCategory = docCategory.includes("certificado") || docCategory.includes("certificate")
      } else if (filterCategory === "formacao") {
        matchesCategory = docCategory.includes("diploma") || docCategory.includes("formacao") || docCategory.includes("education")
      } else if (filterCategory === "documentos") {
        matchesCategory = docCategory.includes("rg") || docCategory.includes("cpf") || docCategory.includes("cnpj") || docCategory === "documento"
      } else {
        matchesCategory = docCategory === filterCategory
      }
    }
    
    return matchesSearch && matchesCategory
  })

  // Formatar tamanho do arquivo (para documentos que não têm essa info)
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Tamanho não disponível'
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

  // Obter ícone da categoria
  const getCategoryIcon = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes('certificado') || lowerType.includes('certificate')) return <FileText className="h-4 w-4" />
    if (lowerType.includes('diploma') || lowerType.includes('formacao') || lowerType.includes('education')) return <BookOpen className="h-4 w-4" />
    if (lowerType.includes('rg') || lowerType.includes('cpf') || lowerType.includes('cnpj')) return <CreditCard className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  // Obter cor da categoria
  const getCategoryColor = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes('certificado') || lowerType.includes('certificate')) return 'bg-blue-100 text-blue-800'
    if (lowerType.includes('diploma') || lowerType.includes('formacao') || lowerType.includes('education')) return 'bg-green-100 text-green-800'
    if (lowerType.includes('rg') || lowerType.includes('cpf') || lowerType.includes('cnpj')) return 'bg-purple-100 text-purple-800'
    return 'bg-gray-100 text-gray-800'
  }

  // Obter nome da categoria
  const getCategoryName = (type: string) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes('certificado') || lowerType.includes('certificate')) return 'Certificado'
    if (lowerType.includes('diploma') || lowerType.includes('formacao') || lowerType.includes('education')) return 'Formação'
    if (lowerType.includes('rg') || lowerType.includes('cpf') || lowerType.includes('cnpj')) return 'Documento'
    return type
  }

  // Upload real de documento
  const handleFileUpload = async () => {
    if (!uploadForm.file || !instructorId) {
      alert('Por favor, selecione um arquivo')
      return
    }

    try {
      setUploading(true)
      const uploadedDoc = await uploadInstructorDocument(
        uploadForm.file,
        instructorId,
        uploadForm.category || undefined,
        uploadForm.type || undefined,
        uploadForm.description || undefined
      )

      // Atualizar a lista de documentos
      const newDocument: InstructorDocument = {
        id: uploadedDoc.id,
        instructorId: uploadedDoc.instructorId,
        path: uploadedDoc.path,
        type: uploadedDoc.type || 'documento',
        description: uploadedDoc.description,
        createdAt: uploadedDoc.createdAt,
        updatedAt: uploadedDoc.updatedAt
      }
      
      setDocuments(prev => [newDocument, ...prev])
      
      // Resetar o formulário
      setUploadForm({
        file: null,
        category: "instructor",
        type: "",
        description: ""
      })
      
      setUploadModalOpen(false)
      alert('Documento enviado com sucesso!')
    } catch (error) {
      console.error('Erro ao enviar documento:', error)
      alert('Erro ao enviar documento. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  // Remover documento real
  const handleRemoveDocument = async (document: any) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) {
      return
    }

    try {
      console.log('Removendo documento:', document)
      console.log('ID do documento:', document.id)
      
      // Usar document.id para deletar o documento
      await deleteInstructorDocument(document.id)
      setDocuments(prev => prev.filter(doc => doc.id !== document.id))
      alert('Documento removido com sucesso!')
    } catch (error) {
      console.error('Erro ao remover documento:', error)
      alert('Erro ao remover documento. Tente novamente.')
    }
  }

  // Download de documento
  const handleDownloadDocument = async (document: any) => {
    try {
      setDownloadingDocId(document.id)
      console.log('Documento para download:', document)
      console.log('Path do documento:', document.path)
      
      // Usar document.path conforme a interface InstructorDocument
      const fileName = document.path?.split('/').pop() || `documento_${document.id}`
      await downloadInstructorDocument(document.path, fileName)
      console.log('Download realizado com sucesso')
    } catch (error) {
      console.error('Erro ao fazer download:', error)
      // Exibir mensagem de erro específica para o usuário
      let errorMessage = 'Erro ao fazer download do documento'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      alert(errorMessage)
    } finally {
      setDownloadingDocId(null)
    }
  }  // Formatar telefone
  const formatPhone = (areaCode: string | null, number: string | null) => {
    if (!areaCode || !number) return null
    return `(${areaCode}) ${number}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Detalhes do Instrutor: {instructor?.name || 'Carregando...'}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Carregando dados do instrutor...</span>
            </div>
          </div>
        ) : instructor ? (
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                <TabsTrigger value="info" className="flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  Informações
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Documentos ({documents.length})
                </TabsTrigger>
                <TabsTrigger value="classes" className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Turmas ({instructor.classes.length})
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto mt-4 pr-2">
                <TabsContent value="info" className="space-y-6 mt-0 h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informações Pessoais */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Informações Pessoais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Nome</label>
                        <p className="text-base">{instructor.name}</p>
                      </div>
                      
                      {instructor.corporateName && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Nome Corporativo</label>
                          <p className="text-base">{instructor.corporateName}</p>
                        </div>
                      )}
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600">Tipo de Pessoa</label>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {instructor.personType === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                          </Badge>
                          <Badge className={instructor.isActive ? "bg-green-500" : "bg-red-500"}>
                            {instructor.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>

                      {instructor.cpf && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">CPF</label>
                          <p className="text-base">{instructor.cpf}</p>
                        </div>
                      )}

                      {instructor.cnpj && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">CNPJ</label>
                          <p className="text-base">{instructor.cnpj}</p>
                        </div>
                      )}

                      {instructor.registrationNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Registro Profissional</label>
                          <p className="text-base">{instructor.registrationNumber}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Contato */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Mail className="h-5 w-5 mr-2" />
                        Contato
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {instructor.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{instructor.email}</span>
                        </div>
                      )}
                      
                      {formatPhone(instructor.mobileAreaCode, instructor.mobileNumber) && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{formatPhone(instructor.mobileAreaCode, instructor.mobileNumber)} (Celular)</span>
                        </div>
                      )}
                      
                      {formatPhone(instructor.landlineAreaCode, instructor.landlineNumber) && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{formatPhone(instructor.landlineAreaCode, instructor.landlineNumber)} (Fixo)</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Endereço */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Endereço
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {instructor.address && (
                        <p>{instructor.address}, {instructor.addressNumber}</p>
                      )}
                      {instructor.neighborhood && (
                        <p>{instructor.neighborhood}</p>
                      )}
                      {instructor.city && instructor.state && (
                        <p>{instructor.city} - {instructor.state}</p>
                      )}
                      {instructor.zipCode && (
                        <p>CEP: {instructor.zipCode}</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Formação e Observações */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Formação e Observações
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {instructor.education && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Formação</label>
                          <p className="text-base">{instructor.education}</p>
                        </div>
                      )}
                      
                      {instructor.observations && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Observações</label>
                          <p className="text-base">{instructor.observations}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-6 mt-0 h-full">
                  {/* Cabeçalho dos Documentos */}
                  <div className="flex justify-between items-center flex-shrink-0">
                    <div>
                      <h3 className="text-lg font-semibold">Documentos do Instrutor</h3>
                      <p className="text-gray-600">{filteredDocuments.length} documento(s) encontrado(s)</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => setUploadModalOpen(true)}
                        className="flex items-center"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>

                  {/* Filtros */}
                  <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar documentos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filtrar por categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        <SelectItem value="instructor">Instrutor</SelectItem>
                        <SelectItem value="certificados">Certificados</SelectItem>
                        <SelectItem value="formacao">Formação</SelectItem>
                        <SelectItem value="documentos">Documentos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lista de Documentos */}
                  <div className="space-y-4 flex-1 overflow-y-auto">
                    {filteredDocuments.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {searchTerm || categoryFilter !== "all" 
                            ? 'Nenhum documento encontrado'
                            : 'Nenhum documento cadastrado'
                          }
                        </h3>
                        <p className="text-gray-600">
                          {searchTerm || categoryFilter !== "all"
                            ? 'Tente ajustar os filtros de busca.'
                            : 'Comece fazendo upload dos documentos do instrutor.'
                          }
                        </p>
                      </div>
                    ) : (
                      filteredDocuments.map((doc) => (
                        <Card key={doc.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="flex-shrink-0">
                                  {getCategoryIcon(doc.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {doc.description || doc.path.split('/').pop() || doc.type}
                                  </h4>
                                  <div className="flex items-center space-x-4 mt-1">
                                    <Badge className={getCategoryColor(doc.type)} variant="secondary">
                                      {getCategoryName(doc.type)}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(doc.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDownloadDocument(doc)}
                                  disabled={downloadingDocId === doc.id}
                                >
                                  {downloadingDocId === doc.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Download className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleRemoveDocument(doc)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="classes" className="space-y-6 mt-0 h-full">
                  <div className="h-full flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 flex-shrink-0">Turmas do Instrutor</h3>
                    <div className="space-y-4 flex-1 overflow-y-auto">
                      {instructor.classes.length === 0 ? (
                        <div className="text-center py-12">
                          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhuma turma encontrada
                          </h3>
                          <p className="text-gray-600">
                            Este instrutor ainda não possui turmas cadastradas.
                          </p>
                        </div>
                      ) : (
                        instructor.classes.map((cls) => (
                          <Card key={cls.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{cls.training.title}</h4>
                                  <p className="text-sm text-gray-600">{cls.training.description}</p>
                                  <div className="flex items-center space-x-4 mt-2">
                                    <Badge variant="outline">
                                      {cls.status}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {cls.training.durationHours}h
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatDate(cls.startDate)} - {formatDate(cls.endDate)}
                                    </span>
                                  </div>
                                  {cls.location && (
                                    <p className="text-xs text-gray-500 mt-1">📍 {cls.location}</p>
                                  )}
                                </div>
                                <Button variant="outline" size="sm">
                                  <Info className="h-4 w-4 mr-2" />
                                  Ver Detalhes
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Instrutor não encontrado
              </h3>
              <p className="text-gray-600">
                Não foi possível carregar os dados do instrutor.
              </p>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Modal de Upload de Documento */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload de Documento</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Arquivo *</Label>
              <Input
                id="file-upload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setUploadForm(prev => ({ ...prev, file }))
                  }
                }}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="mt-1"
              />
              {uploadForm.file && (
                <p className="text-sm text-gray-500 mt-1">
                  Arquivo selecionado: {uploadForm.file.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={uploadForm.category} 
                onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instructor">Instrutor</SelectItem>
                  <SelectItem value="certificados">Certificados</SelectItem>
                  <SelectItem value="formacao">Formação</SelectItem>
                  <SelectItem value="documentos">Documentos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Tipo</Label>
              <Input
                id="type"
                placeholder="Ex: RG, CPF, Diploma..."
                value={uploadForm.type}
                onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descrição do documento..."
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setUploadModalOpen(false)}
                disabled={uploading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleFileUpload}
                disabled={!uploadForm.file || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
