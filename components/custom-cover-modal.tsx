"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  FileImage,
  FileText,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download
} from "lucide-react"
import { uploadCustomCover, checkCustomCover, removeCustomCover } from "@/lib/api/certificates"
import { useToast } from "@/hooks/use-toast"

interface TurmaData {
  id: string
  training: {
    title: string
  }
}

interface CustomCoverModalProps {
  isOpen: boolean
  onClose: () => void
  turma: TurmaData | null
  readOnly?: boolean
  onSuccess?: () => void
}

export function CustomCoverModal({
  isOpen,
  onClose,
  turma,
  readOnly = false,
  onSuccess
}: CustomCoverModalProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [uploading, setUploading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [hasCustomCover, setHasCustomCover] = useState(false)
  const [coverFilePath, setCoverFilePath] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Verificar se a turma possui capa personalizada ao abrir o modal
  useEffect(() => {
    if (isOpen && turma) {
      checkCoverStatus()
    }
  }, [isOpen, turma])

  // Limpar estado ao fechar o modal
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null)
      setHasCustomCover(false)
      setCoverFilePath(null)
    }
  }, [isOpen])

  const checkCoverStatus = async () => {
    if (!turma) return
    
    setChecking(true)
    try {
      const response = await checkCustomCover(turma.id)
      setHasCustomCover(response.data.hasCustomCover || false)
      setCoverFilePath(response.data.filePath || null)
    } catch (error: any) {
      console.error('Erro ao verificar capa personalizada:', error)
      // Não mostrar toast de erro para verificação, apenas log
    } finally {
      setChecking(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Arquivo inválido",
        description: "Apenas arquivos PDF, JPEG ou PNG são aceitos.",
        variant: "destructive"
      })
      return
    }

    // Validar tamanho (5MB máximo)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo é de 5MB.",
        variant: "destructive"
      })
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !turma) return

    setUploading(true)
    try {
      await uploadCustomCover(turma.id, selectedFile)
      
      toast({
        title: "Capa enviada",
        description: "A capa personalizada foi enviada com sucesso.",
        variant: "default"
      })

      // Limpar arquivo selecionado e recarregar status
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      await checkCoverStatus()
      onSuccess?.()
      
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error)
      toast({
        title: "Erro no upload",
        description: error.message || "Erro ao enviar a capa personalizada",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!turma) return

    setRemoving(true)
    try {
      await removeCustomCover(turma.id)
      
      toast({
        title: "Capa removida",
        description: "A capa personalizada foi removida com sucesso.",
        variant: "default"
      })

      await checkCoverStatus()
      onSuccess?.()
      
    } catch (error: any) {
      console.error('Erro ao remover capa:', error)
      toast({
        title: "Erro ao remover",
        description: error.message || "Erro ao remover a capa personalizada",
        variant: "destructive"
      })
    } finally {
      setRemoving(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />
    } else {
      return <FileImage className="h-8 w-8 text-blue-500" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {readOnly ? 'Visualizar Capa Personalizada' : 'Capa Personalizada'} - {turma?.training.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações sobre formatos aceitos - apenas para não readonly */}
          {!readOnly && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Formatos aceitos:</strong> PDF, JPEG, PNG • <strong>Tamanho máximo:</strong> 5MB
              </AlertDescription>
            </Alert>
          )}

          {checking ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Verificando capa atual...</span>
            </div>
          ) : (
            <>
              {/* Status da capa atual */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {hasCustomCover ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Capa Personalizada Ativa
                      </>
                    ) : (
                      <>
                        <FileText className="h-5 w-5 text-gray-400" />
                        Usando Capa Padrão
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {hasCustomCover 
                      ? "Esta turma possui uma capa personalizada configurada."
                      : "Esta turma está usando a capa padrão do sistema."
                    }
                  </CardDescription>
                </CardHeader>
                {hasCustomCover && (
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Arquivo: {coverFilePath?.split('/').pop() || 'Arquivo personalizado'}
                      </div>
                      {!readOnly && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRemove}
                          disabled={removing}
                          className="text-red-600 hover:text-red-700"
                        >
                          {removing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Removendo...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Upload de nova capa */}
              {!readOnly && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {hasCustomCover ? 'Substituir Capa' : 'Enviar Nova Capa'}
                    </CardTitle>
                    <CardDescription>
                      {hasCustomCover 
                        ? "Envie um novo arquivo para substituir a capa atual."
                        : "Envie um arquivo para usar como capa personalizada."
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Área de drop ou seleção de arquivo */}
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Clique para selecionar um arquivo
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, JPEG ou PNG • Máximo 5MB
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {/* Arquivo selecionado */}
                    {selectedFile && (
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(selectedFile)}
                            <div className="flex-1">
                              <p className="font-medium text-blue-900">{selectedFile.name}</p>
                              <p className="text-sm text-blue-700">
                                {formatFileSize(selectedFile.size)} • {selectedFile.type}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedFile(null)
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = ''
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Botão de upload */}
                    {selectedFile && (
                      <Button 
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            {hasCustomCover ? 'Substituir Capa' : 'Enviar Capa'}
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Botões do modal */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
