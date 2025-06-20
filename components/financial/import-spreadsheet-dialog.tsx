"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ImportSpreadsheetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (data: any) => void
  type: "accounts" | "receivable" | "payable"
}

export function ImportSpreadsheetDialog({ open, onOpenChange, onImport, type }: ImportSpreadsheetDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

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
      } else {
        setFile(null)
        setUploadStatus("error")
        setErrorMessage("Formato de arquivo inválido. Por favor, selecione um arquivo Excel ou CSV.")
      }
    }
  }

  const handleImport = () => {
    if (!file) return

    setIsUploading(true)
    setUploadStatus("uploading")
    setUploadProgress(0)

    // Simulação de upload com progresso
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadStatus("success")

          // Simulação de dados importados
          const mockData = {
            fileName: file.name,
            fileSize: file.size,
            recordsImported: Math.floor(Math.random() * 50) + 10,
            timestamp: new Date().toISOString(),
          }

          onImport(mockData)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const getTemplateLink = () => {
    switch (type) {
      case "accounts":
        return "/templates/contas-template.xlsx"
      case "receivable":
        return "/templates/contas-receber-template.xlsx"
      case "payable":
        return "/templates/contas-pagar-template.xlsx"
      default:
        return "#"
    }
  }

  const getTitle = () => {
    switch (type) {
      case "accounts":
        return "Importar Contas"
      case "receivable":
        return "Importar Contas a Receber"
      case "payable":
        return "Importar Contas a Pagar"
      default:
        return "Importar Planilha"
    }
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
            <p>- Coluna A: Valor</p>
            <p>- Coluna B: Cliente</p>
            <p>- Coluna C: Data de Vencimento</p>
            <p>- Coluna D: Recorrente (Sim/Não)</p>
            <p>- Coluna E: Observação</p>
          </>
        )
      case "payable":
        return (
          <>
            <p>- Coluna A: Valor</p>
            <p>- Coluna B: Fornecedor/Instrutor</p>
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>Selecione um arquivo Excel ou CSV para importar dados.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {uploadStatus !== "success" ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                file ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-primary-500"
              }`}
            >
              <FileSpreadsheet className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              {file ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB • {file.type || "Arquivo Excel/CSV"}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setFile(null)} className="mt-2">
                    Alterar arquivo
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-2">Arraste e solte um arquivo ou clique para selecionar</p>
                  <p className="text-xs text-gray-500">Suporta arquivos .xlsx, .xls e .csv</p>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-4" />
              <p className="text-green-800 font-medium">Importação concluída com sucesso!</p>
              <p className="text-green-600 text-sm mt-1">Os dados foram importados para o sistema.</p>
            </div>
          )}

          {uploadStatus === "uploading" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Importando...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Erro na importação</p>
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-md">
            <p className="font-medium mb-1">Formato esperado:</p>
            {getExpectedFormat()}
            <a href={getTemplateLink()} className="text-primary-500 hover:underline block mt-2">
              Baixar modelo de planilha
            </a>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {uploadStatus === "success" ? "Fechar" : "Cancelar"}
          </Button>
          {file && uploadStatus !== "success" && (
            <Button className="bg-primary-500 hover:bg-primary-600" onClick={handleImport} disabled={isUploading}>
              {isUploading ? (
                <>Processando...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
