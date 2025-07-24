"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { FileSpreadsheet, Download, Upload, FileDown, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useTrainingExcel } from "@/hooks/use-training-excel"
import type { TrainingExportFilters } from "@/lib/api/trainings-excel"

interface QuickTrainingExcelProps {
  onImportComplete?: () => void
  exportFilters?: TrainingExportFilters
}

/**
 * Componente simplificado para operações rápidas de Excel com treinamentos
 * Pode ser usado em qualquer página que precise de funcionalidades de import/export
 */
export function QuickTrainingExcel({ onImportComplete, exportFilters = {} }: QuickTrainingExcelProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const {
    exportLoading,
    importLoading,
    templateLoading,
    exportTrainings,
    importTrainings,
    downloadTemplate,
    validateExcelFile
  } = useTrainingExcel({
    onImportSuccess: () => {
      setShowDialog(false)
      setSelectedFile(null)
      onImportComplete?.()
    }
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateExcelFile(file)
    if (!validation.isValid) {
      toast.error(validation.error)
      return
    }

    setSelectedFile(file)
  }

  const handleImport = async () => {
    if (!selectedFile) return
    await importTrainings(selectedFile)
  }

  const handleExport = async () => {
    await exportTrainings(exportFilters)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Botão de Exportação Rápida */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleExport}
        disabled={exportLoading}
      >
        {exportLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Exportar Excel
      </Button>

      {/* Dialog de Importação */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Importar Excel
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Importar Treinamentos</DialogTitle>
            <DialogDescription>
              Faça upload de um arquivo Excel para importar treinamentos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Botão do Template */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                disabled={templateLoading}
              >
                {templateLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="mr-2 h-4 w-4" />
                )}
                Baixar Template
              </Button>
            </div>

            {/* Seleção de Arquivo */}
            <div>
              <Label htmlFor="file">Arquivo Excel</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
              />
              {selectedFile && (
                <div className="mt-2 text-sm text-green-600">
                  ✓ {selectedFile.name} selecionado
                </div>
              )}
            </div>

            {/* Botão de Importação */}
            <Button
              onClick={handleImport}
              disabled={!selectedFile || importLoading}
              className="w-full"
            >
              {importLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="mr-2 h-4 w-4" />
              )}
              {importLoading ? 'Importando...' : 'Importar Treinamentos'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuickTrainingExcel
