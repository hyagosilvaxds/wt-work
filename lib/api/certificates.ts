import Cookies from "js-cookie"

// ========== INTERFACES PARA O NOVO ENDPOINT ==========

// Filtros para buscar turmas concluídas
export interface CompletedClassesFiltersDto {
  search?: string        // Busca geral em nomes de treinamentos, clientes e instrutores
  trainingName?: string
  clientName?: string
  classId?: string
  instructorName?: string
  location?: string
  startDateFrom?: string // ISO 8601
  startDateTo?: string   // ISO 8601
  endDateFrom?: string   // ISO 8601
  endDateTo?: string     // ISO 8601
  page?: number          // default: 1
  limit?: number         // default: 10
  sortBy?: 'trainingName' | 'clientName' | 'startDate' | 'endDate' | 'instructorName' // default: 'endDate'
  sortOrder?: 'asc' | 'desc' // default: 'desc'
}

// Dados do estudante com elegibilidade
export interface StudentCertificateEligibilityDto {
  studentId: string
  studentName: string
  cpf: string
  isEligible: boolean
  absences: number
  totalPresences: number
  attendancePercentage: number
  hasGrade: boolean
  preTestGrade?: number
  postTestGrade?: number
  practicalGrade?: number
  reason: string
}

// Dados da turma concluída com informações completas
export interface EnhancedClassCertificateStatusDto {
  classId: string
  trainingName: string
  startDate: string
  endDate: string
  status: string
  location?: string
  trainingDurationHours: number
  certificateValidityDays?: number
  totalStudents: number
  studentsWithoutAbsences: number
  studentsWithAbsences: number
  totalLessons: number

  // Dados do cliente
  client?: {
    id: string
    name: string
    corporateName?: string
    cnpj?: string
  }

  // Dados do instrutor
  instructor?: {
    id: string
    name: string
    registrationNumber?: string
    email?: string
  }

  students: StudentCertificateEligibilityDto[]
}

// Resposta da API com paginação
export interface CompletedClassesResponseDto {
  classes: EnhancedClassCertificateStatusDto[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Função para buscar turmas concluídas com filtros
export const getCompletedClassesFiltered = async (filters: CompletedClassesFiltersDto = {}): Promise<CompletedClassesResponseDto> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.olimpustech.com'
    const token = Cookies.get("jwtToken")
    
    console.log('🔄 Buscando turmas concluídas com filtros:', filters)
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.')
    }

    // Construir query parameters
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })

    const response = await fetch(`${apiUrl}/certificado/completed-classes-filtered?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('📊 Status da resposta:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao buscar turmas concluídas' }))
      console.error('❌ Erro da API:', errorData)
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ Turmas concluídas carregadas:', result.classes.length, 'turmas')
    
    return result
  } catch (error: any) {
    console.error('❌ Erro ao buscar turmas concluídas:', error)
    throw error
  }
}

// API para gerenciar certificados - implementação futura
export interface CertificateData {
  id?: string
  studentName: string
  trainingName: string
  instructorName: string
  issueDate: string
  validationCode: string
  workload: string
  company?: string
  location?: string
  startDate?: string
  endDate?: string
  instructorSignature?: string
}

export interface CertificateFilters {
  page: number
  limit: number
  search?: string
  studentId?: string
  trainingId?: string
  classId?: string
}

export interface CertificatesResponse {
  certificates: CertificateData[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Implementação futura - por enquanto retorna dados mockados
export const getCertificates = async (filters: CertificateFilters): Promise<CertificatesResponse> => {
  // TODO: Implementar busca real na API
  return {
    certificates: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
  }
}

export const createCertificate = async (data: CertificateData): Promise<CertificateData> => {
  // TODO: Implementar criação real na API
  return {
    id: 'mock-id',
    ...data
  }
}

export const getCertificateById = async (id: string): Promise<CertificateData | null> => {
  // TODO: Implementar busca real na API
  return null
}

export const updateCertificate = async (id: string, data: Partial<CertificateData>): Promise<CertificateData> => {
  // TODO: Implementar atualização real na API
  return {
    id,
    ...data
  } as CertificateData
}

export const deleteCertificate = async (id: string): Promise<void> => {
  // TODO: Implementar exclusão real na API
  return
}

// Função para gerar relatório
export const generateEvidenceReport = async (classId: string): Promise<void> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.olimpustech.com'
    // Usar a mesma lógica de obtenção de token do client.ts
    const token = Cookies.get("jwtToken")
    
    console.log('🔄 Gerando relatório para turma:', classId)
    console.log('📡 URL da API:', apiUrl)
    console.log('🔑 Token presente:', !!token)
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.')
    }

    const response = await fetch(`${apiUrl}/certificado/evidence-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ classId })
    })

    console.log('📊 Status da resposta:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao gerar relatório' }))
      console.error('❌ Erro da API:', errorData)
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`)
    }

    // Verificar se a resposta é um PDF
    const contentType = response.headers.get('content-type')
    console.log('📄 Tipo de conteúdo:', contentType)

    if (!contentType?.includes('application/pdf')) {
      throw new Error('Resposta inválida: arquivo não é um PDF')
    }

    // Fazer download do PDF
    const blob = await response.blob()
    console.log('📦 Tamanho do arquivo:', blob.size, 'bytes')

    if (blob.size === 0) {
      throw new Error('Arquivo PDF vazio recebido')
    }

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-evidencias-${classId}-${new Date().toISOString().split('T')[0]}.pdf`
    a.style.display = 'none'
    
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    // Limpar memória
    window.URL.revokeObjectURL(url)
    
    console.log('✅ Relatório gerado com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro detalhado ao gerar relatório:', error)
    
    // Melhorar as mensagens de erro para o usuário
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Erro de conexão: Verifique sua internet e tente novamente. Se o problema persistir, a API pode estar indisponível.')
    } else if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Erro desconhecido ao gerar relatório')
    }
  }
}

// Função para verificar se uma turma está apta para gerar relatório
export const checkClassEligibility = async (classId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.olimpustech.com'}/certificado/eligibility/${classId}`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get("jwtToken")}`
      }
    })

    if (response.ok) {
      const eligibility = await response.json()
      // Para relatório, basta ter alunos na turma (elegíveis ou não)
      return eligibility.length > 0 // Se há alunos na turma, pode gerar relatório
    }
    
    return false
  } catch (error) {
    console.warn('Erro ao verificar elegibilidade da turma:', error)
    return false
  }
}

// ========== FUNÇÕES PARA CAPA PERSONALIZADA ==========

// Interface para resposta da API de capa personalizada
export interface CustomCoverResponse {
  message: string
  data: {
    message?: string
    filePath?: string
    hasCustomCover?: boolean
    removedFiles?: string[]
  }
}

// Função para fazer upload de capa personalizada
export const uploadCustomCover = async (classId: string, file: File): Promise<CustomCoverResponse> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.olimpustech.com'
    const token = Cookies.get("jwtToken")
    
    console.log('🔄 Fazendo upload de capa personalizada para turma:', classId)
    console.log('📁 Arquivo:', file.name, 'Tamanho:', file.size, 'bytes')
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.')
    }

    // Validar tipo de arquivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não suportado. Use PDF, JPEG ou PNG.')
    }

    // Validar tamanho (5MB máximo)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. O tamanho máximo é de 5MB.')
    }

    const formData = new FormData()
    formData.append('cover', file)
    formData.append('classId', classId)

    const response = await fetch(`${apiUrl}/certificado/evidence-report/custom-cover/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    console.log('📊 Status da resposta:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao fazer upload da capa' }))
      console.error('❌ Erro da API:', errorData)
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ Capa personalizada enviada com sucesso!')
    
    return result
  } catch (error: any) {
    console.error('❌ Erro ao fazer upload da capa:', error)
    throw error
  }
}

// Função para verificar se uma turma possui capa personalizada
export const checkCustomCover = async (classId: string): Promise<CustomCoverResponse> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.olimpustech.com'
    const token = Cookies.get("jwtToken")
    
    console.log('🔍 Verificando capa personalizada para turma:', classId)
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.')
    }

    const response = await fetch(`${apiUrl}/certificado/evidence-report/custom-cover/check/${classId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('📊 Status da resposta:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao verificar capa personalizada' }))
      console.error('❌ Erro da API:', errorData)
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ Verificação realizada:', result.data.hasCustomCover ? 'Possui capa personalizada' : 'Não possui capa personalizada')
    
    return result
  } catch (error: any) {
    console.error('❌ Erro ao verificar capa personalizada:', error)
    throw error
  }
}

// Função para remover capa personalizada
export const removeCustomCover = async (classId: string): Promise<CustomCoverResponse> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.olimpustech.com'
    const token = Cookies.get("jwtToken")
    
    console.log('🗑️ Removendo capa personalizada para turma:', classId)
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.')
    }

    const response = await fetch(`${apiUrl}/certificado/evidence-report/custom-cover/${classId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('📊 Status da resposta:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao remover capa personalizada' }))
      console.error('❌ Erro da API:', errorData)
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ Capa personalizada removida com sucesso!')
    
    return result
  } catch (error: any) {
    console.error('❌ Erro ao remover capa personalizada:', error)
    throw error
  }
}
