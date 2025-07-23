"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Award,
  Download,
  Eye,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  downloadCertificatePDF,
  openCertificatePreview
} from "@/lib/api/superadmin"

interface CertificatePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string
  studentName: string
  classId: string
  trainingTitle: string
}

export function CertificatePreviewModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  classId,
  trainingTitle
}: CertificatePreviewModalProps) {
  const [downloading, setDownloading] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const { toast } = useToast()

  // Resetar estados quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setDownloading(false)
      setPreviewing(false)
    }
  }, [isOpen])

  // Função para download do certificado
  const handleDownload = async () => {
    try {
      setDownloading(true)
      
      await downloadCertificatePDF(studentId, classId, studentName, trainingTitle)
      
      toast({
        title: "✅ Sucesso!",
        description: "Certificado baixado com sucesso",
        variant: "default",
      })
      
      // Fechar modal após download bem sucedido
      setTimeout(() => {
        onClose()
      }, 1000)
      
    } catch (error: any) {
      console.error('Erro ao baixar certificado:', error)
      
      let errorMessage = "Erro ao baixar certificado"
      
      if (error.message?.includes('bloqueado')) {
        errorMessage = "Certificado bloqueado"
      } else if (error.message?.includes('não está matriculado')) {
        errorMessage = "Aluno não está matriculado nesta turma"
      } else if (error.message?.includes('não encontrada')) {
        errorMessage = "Turma não encontrada"
      } else if (error.message?.includes('não encontrado')) {
        errorMessage = "Aluno não encontrado"
      }
      
      toast({
        title: "❌ Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

  // Função para visualizar certificado
  const handlePreview = async () => {
    try {
      setPreviewing(true)
      
      await openCertificatePreview(studentId, classId)
      
      toast({
        title: "👁️ Preview",
        description: "Certificado aberto em nova aba",
        variant: "default",
      })
      
    } catch (error: any) {
      console.error('Erro ao visualizar certificado:', error)
      
      let errorMessage = "Erro ao visualizar certificado"
      
      if (error.message?.includes('Popup bloqueado')) {
        errorMessage = "Popup bloqueado pelo navegador. Permita popups para esta página."
      } else if (error.message?.includes('bloqueado')) {
        errorMessage = "Certificado bloqueado"
      }
      
      toast({
        title: "❌ Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setPreviewing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Award className="h-6 w-6 text-yellow-600" />
            Certificado de Conclusão
          </DialogTitle>
          <DialogDescription>
            Gerar e visualizar certificado para <strong>{studentName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Certificado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5" />
                Informações do Certificado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aluno</p>
                  <p className="font-medium">{studentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Treinamento</p>
                  <p className="font-medium">{trainingTitle}</p>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Certificado Pronto</p>
                    <p className="text-sm text-green-600">
                      Este certificado está pronto para ser gerado e baixado
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aviso sobre o Sistema */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Certificado Estilizado</p>
                  <p className="text-sm text-blue-700">
                    O certificado será gerado em formato PDF profissional com 2 páginas:
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
                    <li><strong>Página 1:</strong> Certificado principal com assinaturas</li>
                    <li><strong>Página 2:</strong> Conteúdo programático detalhado</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={downloading || previewing}
          >
            Cancelar
          </Button>
          
          <Button
            variant="secondary"
            onClick={handlePreview}
            disabled={downloading || previewing}
            className="gap-2"
          >
            {previewing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Abrindo Preview...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Visualizar
              </>
            )}
          </Button>
          
          <Button
            onClick={handleDownload}
            disabled={downloading || previewing}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Baixando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Baixar Certificado
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
