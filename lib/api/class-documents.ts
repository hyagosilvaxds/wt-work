// Funções para gerenciar documentos de turma
import Cookies from "js-cookie"

const API_BASE_URL = 'https://api.olimpustech.com'

interface ClassDocument {
  id: string
  classId: string
  fileName: string
  filePath: string
  fileType?: string
  fileSize?: number
  description?: string
  category?: string
  uploadedBy?: string
  uploadedAt: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface DocumentsListResponse {
  data: ClassDocument[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Obter token de autenticação
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return Cookies.get("jwtToken")
  }
  return null
}

// Headers padrão para requests
const getHeaders = () => {
  const token = getAuthToken()
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

// Headers para upload de arquivo
const getUploadHeaders = () => {
  const token = getAuthToken()
  return {
    'Authorization': `Bearer ${token}`
    // Não incluir Content-Type para FormData
  }
}

/**
 * Upload de documento para uma turma
 */
export const uploadClassDocument = async (
  classId: string,
  file: File,
  description?: string,
  category?: string
): Promise<ClassDocument> => {
  const formData = new FormData()
  formData.append('file', file)
  if (description) formData.append('description', description)
  if (category) formData.append('category', category)

  const response = await fetch(`${API_BASE_URL}/superadmin/classes/${classId}/documents`, {
    method: 'POST',
    headers: getUploadHeaders(),
    body: formData
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao enviar documento')
  }

  return response.json()
}

/**
 * Listar documentos de uma turma específica
 */
export const getClassDocuments = async (classId: string): Promise<ClassDocument[]> => {
  const response = await fetch(`${API_BASE_URL}/superadmin/classes/${classId}/documents`, {
    headers: getHeaders()
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao carregar documentos')
  }

  return response.json()
}

/**
 * Listar todos os documentos com filtros
 */
export const getAllClassDocuments = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    classId?: string
    category?: string
    isActive?: boolean
    uploadedBy?: string
    search?: string
  }
): Promise<DocumentsListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  })

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString())
      }
    })
  }

  const response = await fetch(`${API_BASE_URL}/superadmin/class-documents?${params}`, {
    headers: getHeaders()
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao carregar documentos')
  }

  return response.json()
}

/**
 * Buscar documento por ID
 */
export const getClassDocumentById = async (documentId: string): Promise<ClassDocument> => {
  const response = await fetch(`${API_BASE_URL}/superadmin/class-documents/${documentId}`, {
    headers: getHeaders()
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao carregar documento')
  }

  return response.json()
}

/**
 * Atualizar metadados do documento
 */
export const updateClassDocument = async (
  documentId: string,
  updates: {
    fileName?: string
    description?: string
    category?: string
    isActive?: boolean
  }
): Promise<ClassDocument> => {
  const response = await fetch(`${API_BASE_URL}/superadmin/class-documents/${documentId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(updates)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao atualizar documento')
  }

  return response.json()
}

/**
 * Desativar documento (remoção lógica)
 */
export const deactivateClassDocument = async (documentId: string): Promise<{ id: string; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/superadmin/class-documents/${documentId}/deactivate`, {
    method: 'PATCH',
    headers: getHeaders()
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao desativar documento')
  }

  return response.json()
}

/**
 * Reativar documento
 */
export const activateClassDocument = async (documentId: string): Promise<{ id: string; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/superadmin/class-documents/${documentId}/activate`, {
    method: 'PATCH',
    headers: getHeaders()
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao reativar documento')
  }

  return response.json()
}

/**
 * Remover documento permanentemente
 */
export const deleteClassDocument = async (documentId: string): Promise<{ id: string; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/superadmin/class-documents/${documentId}`, {
    method: 'DELETE',
    headers: getHeaders()
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro ao remover documento')
  }

  return response.json()
}

/**
 * Download de documento
 */
export const downloadClassDocument = async (documentId: string): Promise<Blob> => {
  // Primeiro tenta o endpoint padrão
  let response = await fetch(`${API_BASE_URL}/superadmin/class-documents/${documentId}/download`, {
    headers: getUploadHeaders()
  })

  // Se não funcionar, tenta outros possíveis endpoints
  if (!response.ok) {
    // Tenta sem /superadmin
    response = await fetch(`${API_BASE_URL}/class-documents/${documentId}/download`, {
      headers: getUploadHeaders()
    })
  }

  if (!response.ok) {
    // Tenta com /api
    response = await fetch(`${API_BASE_URL}/class-documents/${documentId}/download`, {
      headers: getUploadHeaders()
    })
  }

  if (!response.ok) {
    // Para download, o erro pode não ser JSON
    let errorMessage = 'Erro ao baixar documento - endpoint não encontrado'
    try {
      const error = await response.json()
      errorMessage = error.message || errorMessage
    } catch {
      // Se não conseguir parsear como JSON, usar status text
      errorMessage = `${response.status}: ${response.statusText}` || errorMessage
    }
    throw new Error(errorMessage)
  }

  return response.blob()
}

// Categorias de documento disponíveis
export const DOCUMENT_CATEGORIES = [
  { value: 'CONTRATO', label: 'Contrato' },
  { value: 'LISTA_PRESENCA', label: 'Lista de Presença' },
  { value: 'MATERIAL_DIDATICO', label: 'Material Didático' },
  { value: 'CERTIFICADO', label: 'Certificado' },
  { value: 'AVALIACAO', label: 'Avaliação' },
  { value: 'RELATORIO', label: 'Relatório' },
  { value: 'OUTROS', label: 'Outros' }
]

// Tipos de arquivo aceitos
export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'text/plain'
]

// Tamanho máximo do arquivo (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024
