import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Award, Download } from 'lucide-react'
import { generateCertificatePDFWithSignature, CertificateData } from '@/lib/certificate-generator'
import { getSignatureByInstructorId } from '@/lib/api/superadmin'
import { toast } from 'sonner'

interface CertificateGeneratorModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  student?: {
    id: string
    name: string
  }
  training?: {
    id: string
    name: string
    durationHours: number
  }
  instructor?: {
    id: string
    name: string
  }
  classData?: {
    id: string
    startDate: string
    endDate: string
    location?: string
  }
  company?: string
  onCertificateGenerated?: (certificateData: CertificateData) => void
}

export function CertificateGeneratorModal({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  student,
  training,
  instructor,
  classData,
  company,
  onCertificateGenerated
}: CertificateGeneratorModalProps) {  const [internalOpen, setInternalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [validationCode, setValidationCode] = useState('')
  const [instructorSignature, setInstructorSignature] = useState<string | null>(null)
  
  // Usar controle externo se fornecido, senão usar controle interno
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = externalOnOpenChange || setInternalOpen

  // Gerar dados do certificado automaticamente baseado nos props
  const generateValidationCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = 'WT-'
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Buscar assinatura do instrutor
  const fetchInstructorSignature = async (instructorId: string) => {
    try {
      const signature = await getSignatureByInstructorId(instructorId)
      setInstructorSignature(signature?.pngPath || null)
    } catch (error) {
      console.error('Erro ao buscar assinatura do instrutor:', error)
      setInstructorSignature(null)
    }
  }

  // Gerar código de validação único quando o modal abrir ou o estudante mudar
  useEffect(() => {
    if (student?.id) {
      setValidationCode(generateValidationCode())
    }
  }, [student?.id])

  // Buscar assinatura quando o instrutor mudar
  useEffect(() => {
    if (instructor?.id) {
      fetchInstructorSignature(instructor.id)
    }
  }, [instructor?.id])

  const formData: CertificateData = {
    studentName: student?.name || '',
    trainingName: training?.name || '',
    instructorName: instructor?.name || '',
    issueDate: new Date().toLocaleDateString('pt-BR'),
    validationCode: validationCode,
    workload: training?.durationHours ? `${training.durationHours}h` : '',
    company: company || '',
    location: classData?.location || '',
    startDate: classData?.startDate ? new Date(classData.startDate).toLocaleDateString('pt-BR') : '',
    endDate: classData?.endDate ? new Date(classData.endDate).toLocaleDateString('pt-BR') : '',
    instructorSignature: instructorSignature || undefined
  }

  const handleGeneratePDF = async () => {
    if (!formData.studentName || !formData.trainingName || !formData.instructorName) {
      toast.error('Dados insuficientes para gerar certificado')
      return
    }

    setIsGenerating(true)
    try {
      await generateCertificatePDFWithSignature(formData, instructor?.id)
      toast.success('Certificado gerado com sucesso!')
      onCertificateGenerated?.(formData)
      setOpen(false)
    } catch (error) {
      console.error('Erro ao gerar certificado:', error)
      toast.error('Erro ao gerar certificado. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Só mostrar o trigger se não estiver sendo controlado externamente */}
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button className="bg-primary-500 hover:bg-primary-600">
            <Award className="mr-2 h-4 w-4" />
            Gerar Certificado
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Gerar Certificado
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Certificado */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Dados do Certificado</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Estudante</label>
                <p className="text-sm text-gray-900 mt-1">{formData.studentName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Treinamento</label>
                <p className="text-sm text-gray-900 mt-1">{formData.trainingName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Instrutor</label>
                <p className="text-sm text-gray-900 mt-1">{formData.instructorName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Carga Horária</label>
                <p className="text-sm text-gray-900 mt-1">{formData.workload}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Empresa</label>
                <p className="text-sm text-gray-900 mt-1">{formData.company || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Local</label>
                <p className="text-sm text-gray-900 mt-1">{formData.location || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Data de Início</label>
                <p className="text-sm text-gray-900 mt-1">{formData.startDate || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Data de Término</label>
                <p className="text-sm text-gray-900 mt-1">{formData.endDate || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Data de Emissão</label>
                <p className="text-sm text-gray-900 mt-1">{formData.issueDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Código de Validação</label>
                <p className="text-sm text-gray-900 mt-1">{formData.validationCode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Assinatura do Instrutor</label>
                <p className="text-sm text-gray-900 mt-1">
                  {instructorSignature ? (
                    <span className="text-green-600">✓ Assinatura encontrada</span>
                  ) : (
                    <span className="text-orange-600">⚠ Assinatura não encontrada</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isGenerating}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <Download className="mr-2 h-4 w-4" />
              {isGenerating ? 'Gerando...' : 'Gerar e Baixar PDF'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
