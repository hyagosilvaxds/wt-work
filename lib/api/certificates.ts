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

// Função para gerar relatório de evidências
export const generateEvidenceReport = async (classId: string): Promise<void> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.worktreinamentos.com.br'}/certificado/evidence-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ classId })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro ao gerar relatório' }))
      throw new Error(errorData.message || 'Erro ao gerar relatório de evidências')
    }

    // Fazer download do PDF
    const blob = await response.blob()
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
    
  } catch (error) {
    console.error('Erro ao gerar relatório de evidências:', error)
    throw error
  }
}

// Função para verificar se uma turma está apta para gerar relatório
export const checkClassEligibility = async (classId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.worktreinamentos.com.br'}/certificado/eligibility/${classId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (response.ok) {
      const eligibility = await response.json()
      return eligibility.length > 0 // Se há alunos elegíveis, pode gerar relatório
    }
    
    return false
  } catch (error) {
    console.warn('Erro ao verificar elegibilidade da turma:', error)
    return false
  }
}
