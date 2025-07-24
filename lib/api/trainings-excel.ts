import api from './client'
import Cookies from 'js-cookie'

// Tipos para as operações de Excel
export interface TrainingExportFilters {
  search?: string
  isActive?: boolean
  startDate?: string
  endDate?: string
}

export interface TrainingExportResponse {
  filePath: string
  fileName: string
  downloadUrl: string
  totalRecords: number
  generatedAt: string
}

export interface TrainingImportResponse {
  success: boolean
  totalRecords: number
  validRecords: number
  invalidRecords: number
  importedRecords: number
  errors: {
    row: number
    field: string
    message: string
  }[]
}

export interface TrainingExcelError {
  row: number
  field: string
  message: string
}

// Exportar treinamentos para Excel
export async function exportTrainingsToExcel(
  filters: TrainingExportFilters = {}
): Promise<TrainingExportResponse> {
  const response = await api.post('/excel/export/trainings', filters)
  return response.data
}

// Importar treinamentos do Excel
export async function importTrainingsFromExcel(
  file: File,
  validateOnly: boolean = false
): Promise<TrainingImportResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('validateOnly', validateOnly.toString())

  const response = await api.post('/excel/import/trainings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Baixar template de treinamentos
export async function downloadTrainingTemplate(): Promise<Blob> {
  const response = await api.get('/excel/template/trainings', {
    responseType: 'blob',
    headers: {
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  })
  return response.data
}

// Baixar arquivo Excel gerado
export async function downloadExcelFile(fileName: string): Promise<Blob> {
  const response = await api.get(`/excel/download/${fileName}`, {
    responseType: 'blob',
  })
  return response.data
}

// Deletar arquivo Excel
export async function deleteExcelFile(fileName: string): Promise<{ success: boolean; message: string }> {
  const response = await api.delete(`/excel/file/${fileName}`)
  return response.data
}

// Função auxiliar para fazer download de blob
export function downloadBlob(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Validar arquivo antes do upload
export function validateExcelFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ]

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Arquivo muito grande. Tamanho máximo: 10MB',
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Formato inválido. Apenas arquivos .xlsx e .xls são aceitos',
    }
  }

  return { isValid: true }
}
