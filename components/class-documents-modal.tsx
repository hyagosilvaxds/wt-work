"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  uploadClassDocument,
  getClassDocuments,
  updateClassDocument,
  deleteClassDocument,
  deactivateClassDocument,
  downloadClassDocument,
  DOCUMENT_CATEGORIES,
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE
} from "@/lib/api/class-documents"
import {
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  File,
  Image,
  FileSpreadsheet
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface ClassDocument {
  id: string
  classId: string
  fileName: string
  filePath: string
  fileType?: string
  fileSize?: number
  description?: string
  category?: string
  uploadedBy?: string
  uploadedAt: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface TurmaData {
  id: string
  training: {
    title: string
  }
}

interface ClassDocumentsModalProps {
  isOpen: boolean
  onClose: () => void
  turma: TurmaData | null
  readOnly?: boolean
}

export function ClassDocumentsModal({
  isOpen,
  onClose,
  turma,
  readOnly = false
}: ClassDocumentsModalProps) {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<ClassDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [editingDocument, setEditingDocument] = useState<ClassDocument | null>(null)

  // Estados do formulário
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadDescription, setUploadDescription] = useState("")
  const [uploadCategory, setUploadCategory] = useState("")

  // Estados de edição
  const [editFileName, setEditFileName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editCategory, setEditCategory] = useState("")

  // Carregar documentos
  const loadDocuments = async () => {
    if (!turma?.id) return

    setLoading(true)
    try {
      const documents = await getClassDocuments(turma.id)
      setDocuments(documents)
    } catch (error: any) {
      console.error('Erro ao carregar documentos:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar documentos",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && turma?.id) {
      loadDocuments()
    }
  }, [isOpen, turma?.id])

  // Upload de documento
  const handleUpload = async () => {
    if (!uploadFile || !turma?.id) return

    // Validações
    if (!ACCEPTED_FILE_TYPES.includes(uploadFile.type)) {
      toast({
        title: "Tipo de arquivo não suportado",
        description: "Apenas PDF, Word, Excel, imagens e texto são permitidos",
        variant: "destructive"
      })
      return
    }

    if (uploadFile.size > MAX_FILE_SIZE) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB",
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    try {
      await uploadClassDocument(
        turma.id,
        uploadFile,
        uploadDescription || undefined,
        uploadCategory || undefined
      )

      toast({
        title: "Documento enviado",
        description: "O documento foi enviado com sucesso",
        variant: "default"
      })

      // Resetar formulário
      setUploadFile(null)
      setUploadDescription("")
      setUploadCategory("")
      setShowUploadForm(false)

      // Recarregar documentos
      loadDocuments()
    } catch (error: any) {
      console.error('Erro ao enviar documento:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar documento",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  // Atualizar documento
  const handleUpdate = async () => {
    if (!editingDocument) return

    try {
      const updateData: any = {}
      if (editFileName !== editingDocument.fileName) updateData.fileName = editFileName
      if (editDescription !== editingDocument.description) updateData.description = editDescription
      if (editCategory !== editingDocument.category) updateData.category = editCategory

      await updateClassDocument(editingDocument.id, updateData)

      toast({
        title: "Documento atualizado",
        description: "As informações do documento foram atualizadas",
        variant: "default"
      })

      setEditingDocument(null)
      loadDocuments()
    } catch (error: any) {
      console.error('Erro ao atualizar documento:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar documento",
        variant: "destructive"
      })
    }
  }

  // Desativar documento
  const handleDeactivate = async (documentId: string) => {
    try {
      await deactivateClassDocument(documentId)

      toast({
        title: "Documento desativado",
        description: "O documento foi marcado como inativo",
        variant: "default"
      })

      loadDocuments()
    } catch (error: any) {
      console.error('Erro ao desativar documento:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao desativar documento",
        variant: "destructive"
      })
    }
  }

  // Remover documento permanentemente
  const handleDelete = async (documentId: string) => {
    try {
      await deleteClassDocument(documentId)

      toast({
        title: "Documento removido",
        description: "O documento foi removido permanentemente",
        variant: "default"
      })

      loadDocuments()
    } catch (error: any) {
      console.error('Erro ao remover documento:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover documento",
        variant: "destructive"
      })
    }
  }

  // Download de documento
  const handleDownload = async (documentItem: ClassDocument) => {
    try {
      setDownloadingDocId(documentItem.id)
      const blob = await downloadClassDocument(documentItem.id)
      
      // Criar link temporário para download
      const url = window.URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = url
      link.download = documentItem.fileName
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Download concluído",
        description: `Arquivo ${documentItem.fileName} baixado com sucesso`,
        variant: "default"
      })
    } catch (error: any) {
      console.error('Erro ao baixar documento:', error)
      toast({
        title: "Erro",
        description: error.message || "Erro ao baixar documento",
        variant: "destructive"
      })
    } finally {
      setDownloadingDocId(null)
    }
  }

  // Filtrar documentos
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Obter ícone do tipo de arquivo
  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File className="h-4 w-4" />
    
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4 text-red-600" />
    if (fileType.includes('image')) return <Image className="h-4 w-4 text-green-600" />
    if (fileType.includes('sheet') || fileType.includes('excel')) return <FileSpreadsheet className="h-4 w-4 text-green-600" />
    if (fileType.includes('word')) return <FileText className="h-4 w-4 text-blue-600" />
    
    return <File className="h-4 w-4" />
  }

  // Formatar tamanho do arquivo
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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

  // Abrir edição
  const handleEdit = (document: ClassDocument) => {
    setEditingDocument(document)
    setEditFileName(document.fileName)
    setEditDescription(document.description || "")
    setEditCategory(document.category || "")
  }

  if (!turma) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos - {turma.training.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Controles */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro por categoria */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {DOCUMENT_CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Botão upload */}
            {!readOnly && (
              <Button 
                className="gap-2" 
                onClick={() => setShowUploadForm(true)}
                disabled={showUploadForm}
              >
                <Plus className="h-4 w-4" />
                Novo Documento
              </Button>
            )}
          </div>

          {/* Formulário de Upload */}
          {showUploadForm && !readOnly && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Enviar Documento
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowUploadForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="file">Arquivo *</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-gray-500">
                      Tipos aceitos: PDF, Word, Excel, Imagens, Texto (máx. 10MB)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={uploadCategory} onValueChange={setUploadCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {DOCUMENT_CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descrição do documento..."
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleUpload}
                    disabled={!uploadFile || uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Enviar Documento
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowUploadForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Documentos */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Carregando documentos...</span>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || (categoryFilter !== "all") ? "Nenhum documento encontrado" : "Nenhum documento enviado"}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || (categoryFilter !== "all")
                      ? "Tente ajustar os filtros de busca."
                      : "Comece enviando o primeiro documento da turma."
                    }
                  </p>
                  {!readOnly && !searchTerm && (categoryFilter === "all") && (
                    <Button onClick={() => setShowUploadForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Enviar Primeiro Documento
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Nome do Arquivo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Enviado em</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        {getFileIcon(document.fileType)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{document.fileName}</p>
                          {document.description && (
                            <p className="text-sm text-gray-500">{document.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {document.category && (
                          <Badge variant="outline">
                            {DOCUMENT_CATEGORIES.find(cat => cat.value === document.category)?.label || document.category}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatFileSize(document.fileSize)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(document.uploadedAt)}
                      </TableCell>
                      <TableCell>
                        <Badge className={document.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {document.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {/* Botão Download */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(document)}
                            disabled={downloadingDocId === document.id}
                            title={downloadingDocId === document.id ? "Baixando..." : "Baixar documento"}
                          >
                            {downloadingDocId === document.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>

                          {!readOnly && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(document)}
                                title="Editar documento"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" title="Remover documento">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remover documento</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta ação não pode ser desfeita. O documento será removido permanentemente.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(document.id)}>
                                      Remover
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Modal de Edição */}
        {editingDocument && (
          <Dialog open={!!editingDocument} onOpenChange={() => setEditingDocument(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Documento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editFileName">Nome do Arquivo</Label>
                  <Input
                    id="editFileName"
                    value={editFileName}
                    onChange={(e) => setEditFileName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editCategory">Categoria</Label>
                  <Select value={editCategory} onValueChange={setEditCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editDescription">Descrição</Label>
                  <Textarea
                    id="editDescription"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setEditingDocument(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdate}>
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}
