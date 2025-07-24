"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Loader2, Camera, PenTool, X, Check } from "lucide-react"
import { SignatureCanvas } from "@/components/signature-canvas"
import { 
  getLightInstructors, 
  uploadSignature
} from "@/lib/api/superadmin"
import { toast } from "sonner"

interface Instructor {
  id: string
  name: string
  email: string | null
}

interface ModernSignatureUploadModalProps {
  onSignatureUploaded: () => void
}

export function ModernSignatureUploadModal({ onSignatureUploaded }: ModernSignatureUploadModalProps) {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [selectedInstructorId, setSelectedInstructorId] = useState("")
  const [activeTab, setActiveTab] = useState("draw")
  
  // Estados para desenho
  const [hasSignature, setHasSignature] = useState(false)
  const [getSignatureFile, setGetSignatureFile] = useState<(() => Promise<File>) | null>(null)
  
  // Estados para upload de foto
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [uploading, setUploading] = useState(false)
  const [loadingInstructors, setLoadingInstructors] = useState(false)
  const [open, setOpen] = useState(false)

  // Buscar instrutores quando o modal abrir
  useEffect(() => {
    if (open) {
      fetchInstructors()
    }
  }, [open])

  const fetchInstructors = async () => {
    try {
      setLoadingInstructors(true)
      const response = await getLightInstructors()
      setInstructors(response)
    } catch (error) {
      console.error('Erro ao buscar instrutores:', error)
      toast.error('Erro ao carregar instrutores')
    } finally {
      setLoadingInstructors(false)
    }
  }

  const handleSignatureChange = (hasSignature: boolean, getFile?: () => Promise<File>) => {
    console.log('Signature changed in modal:', hasSignature)
    setHasSignature(hasSignature)
    setGetSignatureFile(getFile ? () => getFile : null)
  }

  // Função para lidar com seleção de arquivo
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato de arquivo não suportado', {
        description: 'Por favor, selecione uma imagem JPG, PNG ou WebP.'
      })
      return
    }

    // Validar tamanho do arquivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande', {
        description: 'Por favor, selecione uma imagem menor que 5MB.'
      })
      return
    }

    setSelectedFile(file)
    
    // Criar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Função para remover arquivo selecionado
  const removeSelectedFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedInstructorId) {
      toast.error('Selecione um instrutor')
      return
    }

    let file: File | null = null

    if (activeTab === 'draw') {
      if (!hasSignature || !getSignatureFile) {
        toast.error('Desenhe uma assinatura antes de continuar')
        return
      }
    } else {
      if (!selectedFile) {
        toast.error('Selecione uma foto da assinatura antes de continuar')
        return
      }
    }

    try {
      setUploading(true)
      
      if (activeTab === 'draw') {
        // Toast informativo sobre o progresso
        const uploadToast = toast.loading('Convertendo assinatura em imagem...')
        
        // Obter arquivo da assinatura
        file = await getSignatureFile!()
        
        toast.dismiss(uploadToast)
        const uploadImageToast = toast.loading('Enviando imagem para o servidor...')
        
        await uploadSignature(selectedInstructorId, file)
        
        toast.dismiss(uploadImageToast)
      } else {
        // Upload da foto
        const uploadImageToast = toast.loading('Enviando foto da assinatura...')
        
        await uploadSignature(selectedInstructorId, selectedFile!)
        
        toast.dismiss(uploadImageToast)
      }
      
      toast.success('Assinatura enviada com sucesso!', {
        description: 'A assinatura foi salva e já está disponível para uso.'
      })
      
      onSignatureUploaded()
      setOpen(false)
      resetForm()
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      toast.error('Erro ao fazer upload da assinatura', {
        description: 'Verifique sua conexão e tente novamente.'
      })
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedInstructorId("")
    setActiveTab("draw")
    setHasSignature(false)
    setGetSignatureFile(null)
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const selectedInstructor = instructors.find(i => i.id === selectedInstructorId)
  const canSubmit = selectedInstructorId && 
    ((activeTab === 'draw' && hasSignature) || (activeTab === 'upload' && selectedFile))

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Upload className="mr-2 h-4 w-4" />
          Criar Assinatura
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Criar Assinatura Digital
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Selecione um instrutor e escolha como criar a assinatura
          </p>
        </DialogHeader>
        
        <form onSubmit={handleUpload} className="space-y-6">
          {/* Seleção do Instrutor */}
          <div className="space-y-2">
            <Label htmlFor="instructor" className="text-sm font-medium">
              Instrutor *
            </Label>
            {loadingInstructors ? (
              <div className="flex items-center space-x-2 p-3 border rounded-md bg-gray-50">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-600">Carregando instrutores...</span>
              </div>
            ) : (
              <Select value={selectedInstructorId} onValueChange={setSelectedInstructorId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um instrutor" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{instructor.name}</span>
                        {instructor.email && (
                          <span className="text-sm text-gray-500">{instructor.email}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Informações do instrutor selecionado */}
          {selectedInstructor && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Instrutor Selecionado</h4>
              <div className="space-y-1">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Nome:</span> {selectedInstructor.name}
                </p>
                {selectedInstructor.email && (
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Email:</span> {selectedInstructor.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Abas para escolher método de assinatura */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="draw" className="flex items-center">
                <PenTool className="w-4 h-4 mr-2" />
                Desenhar
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center">
                <Camera className="w-4 h-4 mr-2" />
                Carregar Foto
              </TabsTrigger>
            </TabsList>

            {/* Aba para desenhar assinatura */}
            <TabsContent value="draw" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Desenhe sua Assinatura *
                </Label>
                <SignatureCanvas
                  onSignatureChange={handleSignatureChange}
                  disabled={uploading}
                />
              </div>
            </TabsContent>

            {/* Aba para upload de foto */}
            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Foto da Assinatura *
                </Label>
                
                {!selectedFile ? (
                  <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Selecione uma foto da assinatura
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Escolha uma imagem JPG, PNG ou WebP da assinatura (máximo 5MB)
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Selecionar Arquivo
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-green-600">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Arquivo selecionado</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost" 
                            size="sm"
                            onClick={removeSelectedFile}
                            disabled={uploading}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {previewUrl && (
                          <div className="border rounded-lg p-2 bg-gray-50">
                            <img
                              src={previewUrl}
                              alt="Preview da assinatura"
                              className="max-w-full max-h-48 mx-auto rounded border bg-white"
                              style={{ objectFit: 'contain' }}
                            />
                          </div>
                        )}
                        
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Arquivo:</span> {selectedFile.name}
                          </p>
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Tamanho:</span> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Trocar Arquivo
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={!canSubmit || uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Criar Assinatura
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
