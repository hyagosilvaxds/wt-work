"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload, File, X, FileImage } from "lucide-react"
import { uploadTechnicalResponsibleSignature } from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface TechnicalResponsibleSignatureUploadModalProps {
  technicalResponsibleId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignatureUploaded: () => void
}

export function TechnicalResponsibleSignatureUploadModal({ 
  technicalResponsibleId, 
  open, 
  onOpenChange, 
  onSignatureUploaded 
}: TechnicalResponsibleSignatureUploadModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (file: File) => {
    // Validar tipo de arquivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Apenas arquivos PNG, JPG e JPEG são permitidos",
        variant: "destructive",
      })
      return
    }

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB",
        variant: "destructive",
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      toast({
        title: "Erro de validação",
        description: "Selecione um arquivo de assinatura",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await uploadTechnicalResponsibleSignature(technicalResponsibleId, selectedFile)
      toast({
        title: "Sucesso!",
        description: "Assinatura enviada com sucesso!",
        variant: "default",
      })
      onOpenChange(false)
      clearFile()
      onSignatureUploaded()
    } catch (error: any) {
      console.error('Erro ao fazer upload da assinatura:', error)
      
      if (error.response?.status === 400) {
        toast({
          title: "Arquivo inválido",
          description: error.response.data.message || "Arquivo inválido",
          variant: "destructive",
        })
      } else if (error.response?.status === 404) {
        toast({
          title: "Não encontrado",
          description: "Responsável técnico não encontrado",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro",
          description: "Erro ao fazer upload da assinatura. Tente novamente.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleClose = () => {
    if (!loading) {
      clearFile()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Upload de Assinatura
          </DialogTitle>
          <DialogDescription>
            Envie a assinatura digital do responsável técnico. Formatos aceitos: PNG, JPG, JPEG (máx. 5MB).
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Área de Upload */}
          <div className="space-y-4">
            <Label>Arquivo de Assinatura</Label>
            
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  dragActive 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Clique para selecionar ou arraste o arquivo aqui
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, JPEG até 5MB
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {/* Preview da imagem */}
                {previewUrl && (
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <img 
                      src={previewUrl} 
                      alt="Preview da assinatura" 
                      className="max-h-32 mx-auto"
                    />
                  </div>
                )}
                
                {/* Informações do arquivo */}
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <File className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 text-sm">{selectedFile.name}</p>
                      <p className="text-blue-700 text-xs">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFile}
                    className="text-blue-600 hover:text-blue-800 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Botão para trocar arquivo */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  Trocar Arquivo
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !selectedFile}
            >
              {loading ? "Enviando..." : "Enviar Assinatura"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
