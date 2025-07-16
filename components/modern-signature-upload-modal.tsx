"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2 } from "lucide-react"
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
  const [hasSignature, setHasSignature] = useState(false)
  const [getSignatureFile, setGetSignatureFile] = useState<(() => Promise<File>) | null>(null)
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedInstructorId) {
      toast.error('Selecione um instrutor')
      return
    }

    if (!hasSignature || !getSignatureFile) {
      toast.error('Desenhe uma assinatura antes de continuar')
      return
    }

    try {
      setUploading(true)
      
      // Toast informativo sobre o progresso
      const uploadToast = toast.loading('Convertendo assinatura em imagem...')
      
      // Obter arquivo da assinatura
      const file = await getSignatureFile()
      
      toast.dismiss(uploadToast)
      const uploadImageToast = toast.loading('Enviando imagem para o servidor...')
      
      await uploadSignature(selectedInstructorId, file)
      
      toast.dismiss(uploadImageToast)
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
    setHasSignature(false)
    setGetSignatureFile(null)
  }

  const selectedInstructor = instructors.find(i => i.id === selectedInstructorId)

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Criar Assinatura Digital
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Selecione um instrutor e desenhe a assinatura digital
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

          {/* Canvas para Desenhar Assinatura */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Desenhe sua Assinatura *
            </Label>
            <SignatureCanvas
              onSignatureChange={handleSignatureChange}
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
              disabled={!selectedInstructorId || !hasSignature || uploading}
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
