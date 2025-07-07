"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  FileSpreadsheet, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Download,
  X,
  FileText
} from "lucide-react"

interface ImportSpreadsheetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (data: any) => void
  type: "accounts" | "receivable" | "payable" | "transactions"
}

interface PreviewData {
  headers: string[]
  rows: any[][]
  totalRows: number
}

export function ImportSpreadsheetDialog({ open, onOpenChange, onImport, type }: ImportSpreadsheetDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({})
  const [hasHeaders, setHasHeaders] = useState(true)
  const [skipRows, setSkipRows] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getTypeTitle = () => {
    switch (type) {
      case "accounts": return "Contas"
      case "receivable": return "Contas a Receber"
      case "payable": return "Contas a Pagar"
      case "transactions": return "Transações"
      default: return "Dados"
    }
  }

  const getRequiredFields = () => {
    switch (type) {
      case "accounts":
        return ["Nome da Conta", "Tipo", "Saldo Inicial"]
      case "receivable":
        return ["Cliente", "Valor", "Data de Vencimento"]
      case "payable":
        return ["Fornecedor", "Valor", "Data de Vencimento"]
      case "transactions":
        return ["Descrição", "Valor", "Data", "Tipo"]
      default:
        return []
    }
  }

  const getOptionalFields = () => {
    switch (type) {
      case "accounts":
        return ["Banco", "Agência", "Conta", "Observações"]
      case "receivable":
        return ["Descrição", "Categoria", "Forma de Pagamento", "Conta", "Observações"]
      case "payable":
        return ["Descrição", "Categoria", "Forma de Pagamento", "Conta", "Prioridade", "Observações"]
      case "transactions":
        return ["Categoria", "Conta", "Forma de Pagamento", "Cliente/Fornecedor", "Referência", "Observações"]
      default:
        return []
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Verificar se é um arquivo Excel ou CSV
      if (
        selectedFile.type === "application/vnd.ms-excel" ||
        selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "text/csv" ||
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".xls") ||
        selectedFile.name.endsWith(".csv")
      ) {
        setFile(selectedFile)
        setUploadStatus("idle")
        setErrorMessage("")
        processFile(selectedFile)
      } else {
        setFile(null)
        setUploadStatus("error")
        setErrorMessage("Formato de arquivo inválido. Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV.")
      }
    }
  }

  const processFile = async (file: File) => {
    try {
      setIsUploading(true)
      setUploadProgress(20)

      // Simular processamento do arquivo
      const text = await file.text()
      setUploadProgress(50)

      // Para CSV simples
      if (file.name.endsWith('.csv')) {
        const lines = text.split('\n').filter(line => line.trim())
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
        const rows = lines.slice(skipRows + (hasHeaders ? 1 : 0), 10) // Mostrar apenas as primeiras 10 linhas
          .map(line => line.split(',').map(cell => cell.trim().replace(/"/g, '')))

        setPreviewData({
          headers,
          rows,
          totalRows: lines.length - (hasHeaders ? 1 : 0) - skipRows
        })
      }

      setUploadProgress(100)
      setUploadStatus("success")
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage("Erro ao processar o arquivo. Verifique o formato e tente novamente.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleImport = () => {
    if (!file || !previewData) return

    // Simular importação
    setIsUploading(true)
    setUploadProgress(0)

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsUploading(false)
          
          // Dados simulados baseados no tipo
          const importedData = {
            file: file.name,
            totalRows: previewData.totalRows,
            mappings: fieldMappings,
            type: type,
            timestamp: new Date().toISOString()
          }
          
          onImport(importedData)
          handleClose()
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleClose = () => {
    setFile(null)
    setPreviewData(null)
    setFieldMappings({})
    setUploadStatus("idle")
    setUploadProgress(0)
    setErrorMessage("")
    setHasHeaders(true)
    setSkipRows(0)
    onOpenChange(false)
  }

  const downloadTemplate = () => {
    const requiredFields = getRequiredFields()
    const optionalFields = getOptionalFields()
    const allFields = [...requiredFields, ...optionalFields]
    
    const csvContent = allFields.join(',') + '\n'
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `template_${type}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getExpectedFormat = () => {
    switch (type) {
      case "accounts":
        return (
          <>
            <p>- Coluna A: Nome da Conta</p>
            <p>- Coluna B: Tipo da Conta</p>
            <p>- Coluna C: Saldo Inicial</p>
          </>
        )
      case "receivable":
        return (
          <>
            <p>- Coluna A: Cliente</p>
            <p>- Coluna B: Valor</p>
            <p>- Coluna C: Data de Vencimento</p>
            <p>- Coluna D: Recorrente (Sim/Não)</p>
            <p>- Coluna E: Observação</p>
          </>
        )
      case "payable":
        return (
          <>
            <p>- Coluna A: Fornecedor</p>
            <p>- Coluna B: Valor</p>
            <p>- Coluna C: Data de Vencimento</p>
            <p>- Coluna D: Recorrente (Sim/Não)</p>
            <p>- Coluna E: Observação</p>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileSpreadsheet className="w-5 h-5 mr-2 text-blue-600" />
            Importar {getTypeTitle()}
          </DialogTitle>
          <DialogDescription>
            Importe dados de uma planilha Excel ou arquivo CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Download Template */}
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <h3 className="font-medium text-blue-900">Precisa de um modelo?</h3>
              <p className="text-sm text-blue-700">Baixe nosso modelo de planilha para facilitar a importação</p>
            </div>
            <Button variant="outline" onClick={downloadTemplate} className="border-blue-300 text-blue-700 hover:bg-blue-100">
              <Download className="w-4 h-4 mr-2" />
              Baixar Modelo
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <Label>Arquivo da Planilha *</Label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {file ? (
                <div className="space-y-2">
                  <FileText className="w-12 h-12 mx-auto text-green-600" />
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  <Button variant="outline" size="sm" onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setPreviewData(null)
                  }}>
                    <X className="w-4 h-4 mr-1" />
                    Remover
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="text-lg font-medium text-gray-900">Clique para selecionar um arquivo</p>
                  <p className="text-sm text-gray-500">ou arraste e solte aqui</p>
                  <p className="text-xs text-gray-400">Formatos aceitos: .xlsx, .xls, .csv (máx. 10MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processando arquivo...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Error Message */}
          {uploadStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {uploadStatus === "success" && previewData && (
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Arquivo processado com sucesso! {previewData.totalRows} registros encontrados.
              </AlertDescription>
            </Alert>
          )}

          {/* Preview Data */}
          {previewData && (
            <div className="space-y-4">
              <h3 className="font-medium">Visualização dos Dados</h3>
              <div className="border rounded-lg overflow-auto max-h-64">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {previewData.headers.map((header, index) => (
                        <th key={index} className="px-3 py-2 text-left font-medium text-gray-700 border-r">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.map((row, index) => (
                      <tr key={index} className="border-t">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2 border-r text-gray-900">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500">
                Mostrando primeiras {Math.min(10, previewData.rows.length)} de {previewData.totalRows} linha(s)
              </p>
            </div>
          )}

          {/* Formato esperado */}
          <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-md">
            <p className="font-medium mb-1">Formato esperado:</p>
            {getExpectedFormat()}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!previewData || isUploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUploading ? (
              <>Importando... {uploadProgress}%</>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Importar {previewData?.totalRows || 0} Registro(s)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
