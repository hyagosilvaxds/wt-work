"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Loader2, Eye } from "lucide-react"
import { ModernFileUpload } from "@/components/modern-file-upload"
import { uploadSignature } from "@/lib/api/superadmin"
import { toast } from "sonner"

interface SignatureData {
  id: string
  instructorId: string
  pngPath: string
  createdAt: string
  updatedAt: string
  instructor: {
    id: string
    name: string
    email: string | null
  }
}

interface ModernSignatureUpdateModalProps {
  signature: SignatureData
  onSignatureUpdated: () => void
}

export function ModernSignatureUpdateModal({ signature, onSignatureUpdated }: ModernSignatureUpdateModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      toast.error('Selecione um arquivo para fazer upload')
      return
    }

    try {
      setUploading(true)
      
      const uploadToast = toast.loading('Atualizando assinatura...')
      
      await uploadSignature(signature.instructorId, file)
      
      toast.dismiss(uploadToast)
      toast.success('Assinatura atualizada com sucesso!', {
        description: 'A nova assinatura foi salva e já está disponível para uso.'
      })
      
      onSignatureUpdated()
      setOpen(false)
      setFile(null)
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      toast.error('Erro ao atualizar assinatura', {
        description: 'Verifique sua conexão e tente novamente.'
      })
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
          <Upload className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Atualizar Assinatura
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Atualize a assinatura de {signature.instructor.name}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleUpload} className="space-y-6">
          {/* Informações do instrutor */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Instrutor</h4>
            <div className="space-y-1">
              <p className="text-sm text-gray-800">
                <span className="font-medium">Nome:</span> {signature.instructor.name}
              </p>
              {signature.instructor.email && (
                <p className="text-sm text-gray-800">
                  <span className="font-medium">Email:</span> {signature.instructor.email}
                </p>
              )}
            </div>
          </div>

          {/* Assinatura atual */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Assinatura Atual</Label>
            <div className="border rounded-lg p-4 bg-gray-50">
              <img 
                src={`https://work.olimpussolucoes.tech${signature.pngPath}`} 
                alt={`Assinatura atual de ${signature.instructor.name}`}
                className="max-w-full h-32 object-contain mx-auto"
              />
            </div>
          </div>

          {/* Upload de Nova Assinatura */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Nova Assinatura *
            </Label>
            <ModernFileUpload
              onFileSelect={handleFileSelect}
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              preview={true}
              disabled={uploading}
            />
          </div>

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
              disabled={!file || uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Atualizar
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Modal para visualizar assinatura (versão moderna)
interface ModernSignatureViewModalProps {
  signature: SignatureData
}

export function ModernSignatureViewModal({ signature }: ModernSignatureViewModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hover:bg-gray-50">
          <Eye className="mr-2 h-4 w-4" />
          Visualizar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Assinatura - {signature.instructor.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Assinatura em destaque */}
          <div className="flex justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8">
            <img 
              src={`https://work.olimpussolucoes.tech${signature.pngPath}`} 
              alt={`Assinatura de ${signature.instructor.name}`}
              className="max-w-full max-h-96 object-contain"
            />
          </div>
          
          {/* Informações detalhadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">INSTRUTOR</Label>
                <p className="text-lg font-semibold text-gray-900">{signature.instructor.name}</p>
              </div>
              
              {signature.instructor.email && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">EMAIL</Label>
                  <p className="text-gray-800">{signature.instructor.email}</p>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium text-gray-500">ID DO INSTRUTOR</Label>
                <p className="text-gray-800 font-mono text-sm">{signature.instructorId}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">CRIADA EM</Label>
                <p className="text-gray-800">
                  {new Date(signature.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">ATUALIZADA EM</Label>
                <p className="text-gray-800">
                  {new Date(signature.updatedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">ID DA ASSINATURA</Label>
                <p className="text-gray-800 font-mono text-sm">{signature.id}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
