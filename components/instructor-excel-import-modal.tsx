"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Loader2,
  FileText,
  Users,
  Eye
} from "lucide-react"
import { 
  importInstructorsFromExcel, 
  validateInstructorsExcel,
  downloadInstructorsTemplate,
  downloadBlobAsFile,
  formatFileSize,
  ImportResponse,
  ImportError
} from "@/lib/api/superadmin"
import { toast } from "sonner"

interface InstructorExcelImportModalProps {
  onImportCompleted?: () => void
}

export function InstructorExcelImportModal({ onImportCompleted }: InstructorExcelImportModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [validationResult, setValidationResult] = useState<ImportResponse | null>(null)
  const [importResult, setImportResult] = useState<ImportResponse | null>(null)
  const [step, setStep] = useState<'select' | 'validate' | 'import' | 'result'>('select')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setTimeout(resetModal, 300) // Reset após fechar para evitar flash
    }
  }

  const handleFileSelect = (file: File) => {
    // Validar tipo de arquivo
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo inválido. Use apenas arquivos .xlsx ou .xls')
      return
    }

    // Validar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Tamanho máximo: 10MB')
      return
    }

    setSelectedFile(file)
    setValidationResult(null)
    setImportResult(null)
    setStep('validate')
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const validateFile = async () => {
    if (!selectedFile) return

    try {
      setValidating(true)
      const result = await validateInstructorsExcel(selectedFile)
      setValidationResult(result)
      setStep('import')
      
      if (result.invalidRecords > 0) {
        toast.warning(`Validação concluída: ${result.invalidRecords} erro(s) encontrado(s)`)
      } else {
        toast.success(`Validação concluída: ${result.validRecords} registro(s) válido(s)`)
      }
    } catch (error) {
      console.error('Erro na validação:', error)
      toast.error('Erro ao validar arquivo. Verifique o formato e tente novamente.')
    } finally {
      setValidating(false)
    }
  }

  const importFile = async () => {
    if (!selectedFile) return

    try {
      setLoading(true)
      const result = await importInstructorsFromExcel(selectedFile, false)
      setImportResult(result)
      setStep('result')
      
      if (result.success) {
        toast.success(`Importação concluída: ${result.importedRecords} instrutor(es) importado(s)`)
        if (onImportCompleted) {
          onImportCompleted()
        }
      } else {
        toast.error('Importação falhou. Verifique os erros e tente novamente.')
      }
    } catch (error) {
      console.error('Erro na importação:', error)
      toast.error('Erro ao importar arquivo. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = async () => {
    try {
      const blob = await downloadInstructorsTemplate()
      downloadBlobAsFile(blob, 'template_instrutores.xlsx')
      toast.success('Template baixado com sucesso!')
    } catch (error) {
      console.error('Erro ao baixar template:', error)
      toast.error('Erro ao baixar template. Tente novamente.')
    }
  }

  const resetModal = () => {
    setSelectedFile(null)
    setValidationResult(null)
    setImportResult(null)
    setStep('select')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const renderErrors = (errors: ImportError[]) => (
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {errors.slice(0, 10).map((error, index) => (
        <div key={index} className="bg-red-50 border border-red-200 rounded p-2 text-sm">
          <div className="flex items-center text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            <span className="font-medium">Linha {error.row}</span>
          </div>
          <div className="text-red-700 mt-1">
            <strong>{error.field}:</strong> {error.message}
          </div>
        </div>
      ))}
      {errors.length > 10 && (
        <div className="text-sm text-gray-600 text-center py-2">
          ... e mais {errors.length - 10} erro(s)
        </div>
      )}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          <Upload className="h-4 w-4 mr-2" />
          Importar Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-blue-600" />
            Importar Instrutores do Excel
          </DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo Excel para importar instrutores em lote.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Download Template */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-amber-900">Template Excel</h4>
                <p className="text-sm text-amber-700">
                  Baixe o template para garantir que seus dados estejam no formato correto.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Baixar Template
              </Button>
            </div>
          </div>

          {/* Seleção de Arquivo */}
          {step === 'select' && (
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    Arraste seu arquivo Excel aqui
                  </p>
                  <p className="text-sm text-gray-600">
                    ou clique para selecionar um arquivo
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2"
                  >
                    Selecionar Arquivo
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                />
              </div>

              <div className="text-xs text-gray-500 text-center space-y-1">
                <p>Formatos aceitos: .xlsx, .xls</p>
                <p>Tamanho máximo: 10MB</p>
              </div>
            </div>
          )}

          {/* Validação */}
          {step === 'validate' && selectedFile && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3 text-gray-600" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetModal}>
                    Trocar Arquivo
                  </Button>
                </div>
              </div>

              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  Vamos validar seu arquivo antes da importação para identificar possíveis erros.
                </AlertDescription>
              </Alert>

              <div className="flex justify-between">
                <Button variant="outline" onClick={resetModal}>
                  Voltar
                </Button>
                <Button onClick={validateFile} disabled={validating}>
                  {validating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Validar Arquivo
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Importação */}
          {step === 'import' && validationResult && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-3">Resultado da Validação</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded p-3">
                    <div className="text-2xl font-bold text-blue-600">{validationResult.totalRecords}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="bg-white rounded p-3">
                    <div className="text-2xl font-bold text-green-600">{validationResult.validRecords}</div>
                    <div className="text-sm text-gray-600">Válidos</div>
                  </div>
                  <div className="bg-white rounded p-3">
                    <div className="text-2xl font-bold text-red-600">{validationResult.invalidRecords}</div>
                    <div className="text-sm text-gray-600">Erros</div>
                  </div>
                </div>
              </div>

              {validationResult.errors.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                    <h4 className="font-medium">Erros Encontrados</h4>
                  </div>
                  {renderErrors(validationResult.errors)}
                </div>
              )}

              {validationResult.validRecords > 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    {validationResult.validRecords} registro(s) estão prontos para importação.
                    {validationResult.invalidRecords > 0 && ' Os registros com erro serão ignorados.'}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Nenhum registro válido encontrado. Corrija os erros e tente novamente.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('validate')}>
                  Voltar
                </Button>
                <Button 
                  onClick={importFile} 
                  disabled={loading || validationResult.validRecords === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Importar {validationResult.validRecords} Instrutor(es)
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Resultado */}
          {step === 'result' && importResult && (
            <div className="space-y-4">
              <div className={`rounded-lg p-4 ${
                importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-3">
                  {importResult.success ? (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2 text-red-600" />
                  )}
                  <h4 className={`font-medium ${
                    importResult.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {importResult.success ? 'Importação Concluída!' : 'Importação Falhou'}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      importResult.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {importResult.importedRecords || 0}
                    </div>
                    <div className="text-sm text-gray-600">Importados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{importResult.invalidRecords}</div>
                    <div className="text-sm text-gray-600">Erros</div>
                  </div>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Erros Durante a Importação</h4>
                  {renderErrors(importResult.errors)}
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={resetModal}>
                  Nova Importação
                </Button>
                <Button onClick={() => handleOpenChange(false)}>
                  Concluir
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
