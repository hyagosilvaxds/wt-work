"use client"

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  exportTrainingsToExcel,
  importTrainingsFromExcel,
  downloadTrainingTemplate,
  downloadExcelFile,
  deleteExcelFile,
  downloadBlob,
  validateExcelFile,
  type TrainingExportFilters,
  type TrainingImportResponse
} from '@/lib/api/trainings-excel'

export interface UseTrainingExcelOptions {
  onImportSuccess?: (result: TrainingImportResponse) => void
  onExportSuccess?: (fileName: string, totalRecords: number) => void
  onError?: (error: any, operation: string) => void
}

export function useTrainingExcel(options: UseTrainingExcelOptions = {}) {
  const [exportLoading, setExportLoading] = useState(false)
  const [importLoading, setImportLoading] = useState(false)
  const [templateLoading, setTemplateLoading] = useState(false)
  const [validatingImport, setValidatingImport] = useState(false)

  // Exportar treinamentos
  const exportTrainings = useCallback(async (filters: TrainingExportFilters = {}) => {
    try {
      setExportLoading(true)
      const result = await exportTrainingsToExcel(filters)
      
      // Baixar o arquivo automaticamente
      const blob = await downloadExcelFile(result.fileName)
      downloadBlob(blob, result.fileName)
      
      const successMessage = `Exportação concluída! ${result.totalRecords} treinamentos exportados.`
      toast.success(successMessage)
      options.onExportSuccess?.(result.fileName, result.totalRecords)
      
      return result
    } catch (error) {
      console.error('Erro ao exportar treinamentos:', error)
      const errorMessage = 'Erro ao exportar treinamentos'
      toast.error(errorMessage)
      options.onError?.(error, 'export')
      throw error
    } finally {
      setExportLoading(false)
    }
  }, [options])

  // Validar importação
  const validateImport = useCallback(async (file: File) => {
    const validation = validateExcelFile(file)
    if (!validation.isValid) {
      toast.error(validation.error)
      return null
    }

    try {
      setValidatingImport(true)
      const result = await importTrainingsFromExcel(file, true)
      
      if (result.validRecords === 0) {
        toast.error('Nenhum registro válido encontrado no arquivo')
        return null
      }
      
      return result
    } catch (error) {
      console.error('Erro ao validar importação:', error)
      const errorMessage = 'Erro ao validar arquivo'
      toast.error(errorMessage)
      options.onError?.(error, 'validate')
      throw error
    } finally {
      setValidatingImport(false)
    }
  }, [options])

  // Importar treinamentos
  const importTrainings = useCallback(async (file: File) => {
    const validation = validateExcelFile(file)
    if (!validation.isValid) {
      toast.error(validation.error)
      return null
    }

    try {
      setImportLoading(true)
      const result = await importTrainingsFromExcel(file, false)
      
      const successMessage = `Importação concluída! ${result.importedRecords} treinamentos importados.`
      toast.success(successMessage)
      options.onImportSuccess?.(result)
      
      return result
    } catch (error) {
      console.error('Erro ao importar treinamentos:', error)
      const errorMessage = 'Erro ao importar treinamentos'
      toast.error(errorMessage)
      options.onError?.(error, 'import')
      throw error
    } finally {
      setImportLoading(false)
    }
  }, [options])

  // Baixar template
  const downloadTemplate = useCallback(async () => {
    try {
      setTemplateLoading(true)
      const blob = await downloadTrainingTemplate()
      downloadBlob(blob, 'template_treinamentos.xlsx')
      toast.success('Template baixado com sucesso!')
    } catch (error) {
      console.error('Erro ao baixar template:', error)
      const errorMessage = 'Erro ao baixar template'
      toast.error(errorMessage)
      options.onError?.(error, 'template')
      throw error
    } finally {
      setTemplateLoading(false)
    }
  }, [options])

  // Baixar arquivo Excel
  const downloadFile = useCallback(async (fileName: string) => {
    try {
      const blob = await downloadExcelFile(fileName)
      downloadBlob(blob, fileName)
      toast.success('Arquivo baixado com sucesso!')
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error)
      const errorMessage = 'Erro ao baixar arquivo'
      toast.error(errorMessage)
      options.onError?.(error, 'download')
      throw error
    }
  }, [options])

  // Deletar arquivo Excel
  const deleteFile = useCallback(async (fileName: string) => {
    try {
      await deleteExcelFile(fileName)
      toast.success('Arquivo deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error)
      const errorMessage = 'Erro ao deletar arquivo'
      toast.error(errorMessage)
      options.onError?.(error, 'delete')
      throw error
    }
  }, [options])

  return {
    // Estados de loading
    exportLoading,
    importLoading,
    templateLoading,
    validatingImport,
    
    // Funções
    exportTrainings,
    validateImport,
    importTrainings,
    downloadTemplate,
    downloadFile,
    deleteFile,
    
    // Utilitários
    validateExcelFile
  }
}

export default useTrainingExcel
