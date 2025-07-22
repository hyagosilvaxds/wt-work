"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Loader2,
  Users,
  UserCheck,
  UserX,
  FileX,
  Info
} from "lucide-react"
import { 
  downloadStudentsTemplate, 
  validateStudentsExcel, 
  importStudentsFromExcel,
  downloadBlobAsFile,
  ImportResponse
} from "@/lib/api/superadmin"
import { toast } from "sonner"

interface StudentExcelImportModalProps {
  onImportCompleted?: () => void
}

type ImportStep = 'select' | 'validate' | 'import' | 'result'

export function StudentExcelImportModal({ onImportCompleted }: StudentExcelImportModalProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<ImportStep>('select')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationResult, setValidationResult] = useState<ImportResponse | null>(null)
  const [importResult, setImportResult] = useState<ImportResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const resetModal = () => {
    setStep('select')
    setSelectedFile(null)
    setValidationResult(null)
    setImportResult(null)
    setLoading(false)
    setDragActive(false)
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(resetModal, 300)
  }

  const handleDownloadTemplate = async () => {
    try {
      setLoading(true)
      const blob = await downloadStudentsTemplate()
      downloadBlobAsFile(blob, 'template-estudantes.xlsx')
      toast.success('Template baixado com sucesso!')
    } catch (error) {
      console.error('Erro ao baixar template:', error)
      toast.error('Erro ao baixar template. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      toast.error('Por favor, selecione um arquivo Excel válido (.xlsx ou .xls)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Tamanho máximo: 10MB')
      return
    }

    setSelectedFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleValidate = async () => {
    if (!selectedFile) return

    try {
      setLoading(true)
      const result = await validateStudentsExcel(selectedFile)
      setValidationResult(result)
      setStep('validate')
      
      if (result.success && result.invalidRecords === 0) {
        toast.success(`Arquivo validado! ${result.validRecords} registros válidos encontrados.`)
      } else {
        toast.warning(`Validação concluída com ${result.invalidRecords} erros encontrados.`)
      }
    } catch (error) {
      console.error('Erro na validação:', error)
      toast.error('Erro ao validar arquivo. Verifique o formato e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    if (!selectedFile || !validationResult?.success || validationResult.invalidRecords > 0) return

    try {
      setLoading(true)
      setStep('import')
      
      const result = await importStudentsFromExcel(selectedFile)
      setImportResult(result)
      setStep('result')
      
      if (result.success) {
        toast.success(`Importação concluída! ${result.importedRecords || 0} estudantes importados.`)
        if (onImportCompleted) {
          onImportCompleted()
        }
      } else {
        toast.error(`Importação falhou. Verifique os erros.`)
      }
    } catch (error) {
      console.error('Erro na importação:', error)
      toast.error('Erro ao importar estudantes. Tente novamente.')
      setStep('validate')
    } finally {
      setLoading(false)
    }
  }

  const getStepProgress = () => {
    switch (step) {
      case 'select': return 25
      case 'validate': return 50
      case 'import': return 75
      case 'result': return 100
      default: return 0
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
          <Upload className="h-4 w-4 mr-2" />
          Importar Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-blue-600" />
            Importar Estudantes do Excel
          </DialogTitle>
          <DialogDescription>
            Importe estudantes em lote a partir de um arquivo Excel.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progresso da Importação</span>
            <span>{getStepProgress()}%</span>
          </div>
          <Progress value={getStepProgress()} className="w-full" />
          <div className="flex justify-between text-xs text-gray-500">
            <span className={step === 'select' ? 'font-medium text-blue-600' : ''}>Selecionar</span>
            <span className={step === 'validate' ? 'font-medium text-blue-600' : ''}>Validar</span>
            <span className={step === 'import' ? 'font-medium text-blue-600' : ''}>Importar</span>
            <span className={step === 'result' ? 'font-medium text-blue-600' : ''}>Resultado</span>
          </div>
        </div>

        <div className="space-y-6">
          {step === 'select' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Download className="h-4 w-4 text-blue-600 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Template Excel</h4>
                      <p className="text-xs text-blue-700">Baixe o template com as colunas corretas</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownloadTemplate}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Baixar Template
                  </Button>
                </div>
              </div>

              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : selectedFile 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-3">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-green-900">{selectedFile.name}</p>
                      <p className="text-xs text-green-700">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Arraste o arquivo Excel aqui ou clique para selecionar
                      </p>
                      <p className="text-xs text-gray-500">
                        Formatos suportados: .xlsx, .xls (máx. 10MB)
                      </p>
                    </div>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileSelect(file)
                      }}
                    />
                    <Button 
                      variant="outline" 
                      className="cursor-pointer"
                      onClick={() => {
                        const input = document.getElementById('file-upload') as HTMLInputElement
                        input?.click()
                      }}
                    >
                      Selecionar Arquivo
                    </Button>
                  </div>
                )}
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Importante:</strong> Use o template fornecido para garantir que o arquivo tenha as colunas corretas. 
                  Campos obrigatórios: Nome, CPF, Email.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {step === 'validate' && validationResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{validationResult.totalRecords}</p>
                  <p className="text-sm text-blue-700">Total de Registros</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-900">{validationResult.validRecords}</p>
                  <p className="text-sm text-green-700">Registros Válidos</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <UserX className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-900">{validationResult.invalidRecords}</p>
                  <p className="text-sm text-red-700">Registros com Erro</p>
                </div>
              </div>

              {validationResult.errors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-900 mb-2">
                    Erros Encontrados ({validationResult.errors.length}):
                  </h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {validationResult.errors.slice(0, 10).map((error, index) => (
                      <div key={index} className="text-sm text-red-800 mb-1">
                        <strong>Linha {error.row}:</strong> {error.message}
                        {error.field && <span className="text-red-600"> (Campo: {error.field})</span>}
                      </div>
                    ))}
                    {validationResult.errors.length > 10 && (
                      <p className="text-sm text-red-600 mt-2">
                        ... e mais {validationResult.errors.length - 10} erros
                      </p>
                    )}
                  </div>
                </div>
              )}

              {validationResult.invalidRecords > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Corrija os erros no arquivo Excel e faça o upload novamente para continuar com a importação.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {step === 'import' && (
            <div className="text-center py-8">
              <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Importando Estudantes...</h3>
              <p className="text-sm text-gray-600">
                Por favor, aguarde enquanto processamos os dados.
              </p>
            </div>
          )}

          {step === 'result' && importResult && (
            <div className="space-y-4">
              <div className={`text-center py-6 rounded-lg ${
                importResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {importResult.success ? (
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                ) : (
                  <FileX className="h-16 w-16 text-red-500 mx-auto mb-4" />
                )}
                <h3 className={`text-lg font-medium mb-2 ${
                  importResult.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {importResult.success ? 'Importação Concluída!' : 'Falha na Importação'}
                </h3>
                <p className={`text-sm ${
                  importResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {importResult.success 
                    ? `${importResult.importedRecords || 0} estudantes importados com sucesso`
                    : `Falha na importação - ${importResult.invalidRecords} erros encontrados`
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-900">{importResult.importedRecords || 0}</p>
                  <p className="text-sm text-green-700">Estudantes Importados</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-red-900">{importResult.invalidRecords}</p>
                  <p className="text-sm text-red-700">Erros</p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-900 mb-2">Erros:</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-800">
                        Linha {error.row}: {error.message} {error.field && `(Campo: ${error.field})`}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleClose}>
              {step === 'result' ? 'Fechar' : 'Cancelar'}
            </Button>
            
            <div className="flex gap-2">
              {step === 'select' && (
                <Button 
                  onClick={handleValidate} 
                  disabled={!selectedFile || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    'Validar Arquivo'
                  )}
                </Button>
              )}
              
              {step === 'validate' && (
                <>
                  <Button variant="outline" onClick={() => setStep('select')}>
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleImport} 
                    disabled={!validationResult?.success || validationResult.invalidRecords > 0 || loading}
                  >
                    Importar Estudantes
                  </Button>
                </>
              )}
              
              {step === 'result' && (
                <Button onClick={resetModal}>
                  Nova Importação
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
