"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileSpreadsheet,
  Download,
  Upload,
  FileDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
  Calendar,
  Search,
  Trash2,
  Eye,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"
import {
  exportTrainingsToExcel,
  importTrainingsFromExcel,
  downloadTrainingTemplate,
  downloadExcelFile,
  deleteExcelFile,
  downloadBlob,
  validateExcelFile,
  type TrainingExportFilters,
  type TrainingImportResponse,
  type TrainingExcelError
} from "@/lib/api/trainings-excel"

interface TrainingExcelManagerProps {
  onImportComplete?: () => void
}

export function TrainingExcelManager({ onImportComplete }: TrainingExcelManagerProps) {
  // Estados para exportação
  const [exportLoading, setExportLoading] = useState(false)
  const [exportFilters, setExportFilters] = useState<TrainingExportFilters>({})
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [lastExportFile, setLastExportFile] = useState<string | null>(null)

  // Estados para importação
  const [importLoading, setImportLoading] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importResult, setImportResult] = useState<TrainingImportResponse | null>(null)
  const [showImportResult, setShowImportResult] = useState(false)
  const [showConfirmImport, setShowConfirmImport] = useState(false)
  const [validatingImport, setValidatingImport] = useState(false)

  // Estados gerais
  const [templateLoading, setTemplateLoading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Função para baixar template
  const handleDownloadTemplate = async () => {
    try {
      setTemplateLoading(true)
      const blob = await downloadTrainingTemplate()
      downloadBlob(blob, 'template_treinamentos.xlsx')
      toast.success('Template baixado com sucesso!')
    } catch (error) {
      console.error('Erro ao baixar template:', error)
      toast.error('Erro ao baixar template')
    } finally {
      setTemplateLoading(false)
    }
  }

  // Função para exportar treinamentos
  const handleExportTrainings = async () => {
    try {
      setExportLoading(true)
      const result = await exportTrainingsToExcel(exportFilters)
      
      // Baixar o arquivo automaticamente
      const blob = await downloadExcelFile(result.fileName)
      downloadBlob(blob, result.fileName)
      
      setLastExportFile(result.fileName)
      setShowExportDialog(false)
      
      toast.success(`Exportação concluída! ${result.totalRecords} treinamentos exportados.`)
    } catch (error) {
      console.error('Erro ao exportar treinamentos:', error)
      toast.error('Erro ao exportar treinamentos')
    } finally {
      setExportLoading(false)
    }
  }

  // Função para validar importação
  const handleValidateImport = async () => {
    if (!importFile) return

    try {
      setValidatingImport(true)
      const result = await importTrainingsFromExcel(importFile, true)
      setImportResult(result)
      setShowImportResult(true)
      
      if (result.validRecords > 0) {
        setShowConfirmImport(true)
      } else {
        toast.error('Nenhum registro válido encontrado no arquivo')
      }
    } catch (error) {
      console.error('Erro ao validar importação:', error)
      toast.error('Erro ao validar arquivo')
    } finally {
      setValidatingImport(false)
    }
  }

  // Função para confirmar importação
  const handleConfirmImport = async () => {
    if (!importFile) return

    try {
      setImportLoading(true)
      const result = await importTrainingsFromExcel(importFile, false)
      setImportResult(result)
      setShowImportResult(true)
      setShowConfirmImport(false)
      setShowImportDialog(false)
      
      toast.success(`Importação concluída! ${result.importedRecords} treinamentos importados.`)
      
      // Limpar estados
      setImportFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Callback para atualizar lista
      onImportComplete?.()
    } catch (error) {
      console.error('Erro ao importar treinamentos:', error)
      toast.error('Erro ao importar treinamentos')
    } finally {
      setImportLoading(false)
    }
  }

  // Função para lidar com seleção de arquivo
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateExcelFile(file)
    if (!validation.isValid) {
      toast.error(validation.error)
      return
    }

    setImportFile(file)
  }

  // Função para deletar arquivo de exportação
  const handleDeleteExportFile = async (fileName: string) => {
    try {
      await deleteExcelFile(fileName)
      setLastExportFile(null)
      toast.success('Arquivo deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error)
      toast.error('Erro ao deletar arquivo')
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Excel - Treinamentos</h2>
          <p className="text-gray-600">Importe e exporte treinamentos usando planilhas Excel</p>
        </div>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Exportação */}
        <Card className="border-none shadow-md">
          <CardHeader className="bg-blue-50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Download className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Exportar Treinamentos</CardTitle>
                <CardDescription>
                  Baixe os treinamentos em formato Excel
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exportar para Excel
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Exportar Treinamentos</DialogTitle>
                    <DialogDescription>
                      Configure os filtros para exportar os treinamentos desejados
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="search">Buscar por título/descrição</Label>
                      <Input
                        id="search"
                        placeholder="Ex: NR10, Segurança..."
                        value={exportFilters.search || ''}
                        onChange={(e) => setExportFilters(prev => ({ ...prev, search: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={exportFilters.isActive?.toString()} 
                        onValueChange={(value) => setExportFilters(prev => ({ 
                          ...prev, 
                          isActive: value === 'all' ? undefined : value === 'true' 
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="true">Apenas Ativos</SelectItem>
                          <SelectItem value="false">Apenas Inativos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="startDate">Data inicial</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={exportFilters.startDate || ''}
                          onChange={(e) => setExportFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Data final</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={exportFilters.endDate || ''}
                          onChange={(e) => setExportFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleExportTrainings}
                      disabled={exportLoading}
                      className="w-full"
                    >
                      {exportLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="mr-2 h-4 w-4" />
                      )}
                      {exportLoading ? 'Exportando...' : 'Exportar'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {lastExportFile && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Último arquivo exportado
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => downloadExcelFile(lastExportFile!).then(blob => 
                        downloadBlob(blob, lastExportFile!)
                      )}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteExportFile(lastExportFile!)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card de Importação */}
        <Card className="border-none shadow-md">
          <CardHeader className="bg-green-50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Importar Treinamentos</CardTitle>
                <CardDescription>
                  Faça upload de um arquivo Excel com treinamentos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Button
                onClick={handleDownloadTemplate}
                disabled={templateLoading}
                variant="outline"
                className="w-full"
              >
                {templateLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="mr-2 h-4 w-4" />
                )}
                Baixar Template
              </Button>

              <Separator />

              <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Importar do Excel
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Importar Treinamentos</DialogTitle>
                    <DialogDescription>
                      Selecione um arquivo Excel (.xlsx ou .xls) para importar treinamentos
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="file">Arquivo Excel</Label>
                      <Input
                        id="file"
                        type="file"
                        ref={fileInputRef}
                        accept=".xlsx,.xls"
                        onChange={handleFileSelect}
                      />
                      {importFile && (
                        <div className="mt-2 p-2 bg-blue-50 rounded border">
                          <div className="flex items-center space-x-2">
                            <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{importFile.name}</span>
                            <Badge variant="secondary">
                              {(importFile.size / 1024 / 1024).toFixed(2)} MB
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleValidateImport}
                      disabled={!importFile || validatingImport}
                      className="w-full"
                    >
                      {validatingImport ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="mr-2 h-4 w-4" />
                      )}
                      {validatingImport ? 'Validando...' : 'Validar Arquivo'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações sobre formato */}
      <Card className="border-none shadow-sm bg-gray-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
                Campos Obrigatórios
              </h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• <strong>Título:</strong> Nome único do treinamento</li>
                <li>• <strong>Duração (Horas):</strong> Número maior que zero</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center">
                <AlertCircle className="mr-2 h-4 w-4 text-green-500" />
                Campos Opcionais
              </h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• <strong>Descrição:</strong> Descrição do treinamento</li>
                <li>• <strong>Validade (Dias):</strong> Dias de validade do certificado</li>
                <li>• <strong>Status:</strong> Ativo ou Inativo (padrão: Ativo)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Resultado da Validação/Importação */}
      <Dialog open={showImportResult} onOpenChange={setShowImportResult}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {importResult?.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              )}
              <span>Resultado da {showConfirmImport ? 'Validação' : 'Importação'}</span>
            </DialogTitle>
          </DialogHeader>
          
          {importResult && (
            <div className="space-y-4">
              {/* Estatísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {importResult.totalRecords}
                  </div>
                  <div className="text-sm text-blue-600">Total</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {importResult.validRecords}
                  </div>
                  <div className="text-sm text-green-600">Válidos</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {importResult.invalidRecords}
                  </div>
                  <div className="text-sm text-red-600">Inválidos</div>
                </div>
                {importResult.importedRecords !== undefined && (
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {importResult.importedRecords}
                    </div>
                    <div className="text-sm text-purple-600">Importados</div>
                  </div>
                )}
              </div>

              {/* Lista de Erros */}
              {importResult.errors && importResult.errors.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                    Erros Encontrados ({importResult.errors.length})
                  </h4>
                  <div className="max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium text-red-800">Linha {error.row}</span>
                              <span className="text-red-600 ml-2">• {error.field}</span>
                            </div>
                          </div>
                          <p className="text-sm text-red-600 mt-1">{error.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Importação */}
      <AlertDialog open={showConfirmImport} onOpenChange={setShowConfirmImport}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Confirmar Importação</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {importResult && (
                <>
                  Foram encontrados <strong>{importResult.validRecords}</strong> registros válidos 
                  {importResult.invalidRecords > 0 && (
                    <> e <strong>{importResult.invalidRecords}</strong> inválidos</>
                  )}.
                  <br /><br />
                  Deseja prosseguir com a importação dos registros válidos?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmImport}
              disabled={importLoading}
            >
              {importLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Confirmar Importação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
