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
  AlertTriangle,
  ExternalLink
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  getCertificatePreview,
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
  const [preview, setPreview] = useState<CertificatePreviewResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && studentId && classId) {
      fetchPreview()
    }
  }, [isOpen, studentId, classId])

  const fetchPreview = async () => {
    try {
      setLoading(true)
      const data = await getCertificatePreview(studentId, classId)
      setPreview(data)
    } catch (error: any) {
      console.error('Erro ao buscar prévia do certificado:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar prévia do certificado",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      setDownloading(true)
      
      await downloadCertificatePDF(
        studentId,
        classId,
        studentName,
        trainingTitle
      )
      
      toast({
        title: "Sucesso",
        description: `Certificado de "${trainingTitle}" gerado com sucesso!`,
        variant: "default",
      })
      
      onClose()
    } catch (error: any) {
      console.error('Erro ao gerar certificado:', error)
      
      let errorMessage = "Erro ao gerar certificado"
      
      if (error.response?.status === 404) {
        errorMessage = "Estudante não encontrado na turma ou turma não encontrada"
      } else if (error.response?.status === 400) {
        errorMessage = "Dados insuficientes para gerar o certificado"
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setDownloading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Award className="h-6 w-6 text-green-600" />
            Prévia do Certificado
          </DialogTitle>
          <DialogDescription>
            Visualize as informações que serão incluídas no certificado antes de gerar
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Carregando informações...</span>
          </div>
        ) : preview ? (
          <div className="space-y-6">
            {/* Cabeçalho do Certificado */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-center text-xl text-green-800">
                  CERTIFICADO DE CONCLUSÃO
                </CardTitle>
                <p className="text-center text-green-600 font-medium">
                  {preview.data.class.training.title}
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <p className="text-lg">
                    Confere o presente Certificado a <strong>{preview.data.student.name}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Portador(a) do CPF: <strong>{preview.data.student.cpf}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Informações Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações do Treinamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Detalhes do Treinamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Título:</span>
                    <p className="font-medium">{preview.data.class.training.title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Carga Horária:</span>
                    <p className="font-medium">{preview.data.class.training.durationHours} horas</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Período:</span>
                  </div>
                  <p className="font-medium">
                    {formatDate(preview.data.class.startDate)} - {formatDate(preview.data.class.endDate)}
                  </p>
                  {preview.data.class.location && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>Local:</span>
                      </div>
                      <p className="font-medium">{preview.data.class.location}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Informações dos Profissionais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    Profissionais Responsáveis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Instrutor:</span>
                    <p className="font-medium">{preview.data.class.instructor.name}</p>
                  </div>
                  
                  {preview.data.class.technicalResponsible && (
                    <div>
                      <span className="text-sm text-gray-600">Responsável Técnico:</span>
                      <p className="font-medium">{preview.data.class.technicalResponsible.name}</p>
                      {preview.data.class.technicalResponsible.profession && (
                        <p className="text-sm text-gray-500">{preview.data.class.technicalResponsible.profession}</p>
                      )}
                    </div>
                  )}
                  
                  {preview.data.class.client && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="h-4 w-4" />
                        <span>Empresa:</span>
                      </div>
                      <p className="font-medium">{preview.data.class.client.name}</p>
                      {preview.data.class.client.city && preview.data.class.client.state && (
                        <p className="text-sm text-gray-500">
                          {preview.data.class.client.city}/{preview.data.class.client.state}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Conteúdo Programático */}
            {preview.data.class.training.programContent && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Conteúdo Programático
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {preview.data.class.training.programContent}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status */}
            <div className="flex items-center justify-center">
              <Badge className="bg-green-100 text-green-800 px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                Turma Concluída - Certificado Disponível
              </Badge>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Erro ao carregar informações do certificado</p>
          </div>
        )}

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDownload}
            disabled={downloading || !preview}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Gerar e Baixar Certificado
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
