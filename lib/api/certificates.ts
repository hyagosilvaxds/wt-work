import Cookies from "js-cookie"

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.olimpustech.com'
    // Usar a mesma lógica de obtenção de token do client.ts
    const token = Cookies.get("jwtToken")
    
    console.log('🔄 Gerando relatório de evidências para turma:', classId)
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
    console.error('❌ Erro detalhado ao gerar relatório de evidências:', error)
    
    // Melhorar as mensagens de erro para o usuário
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Erro de conexão: Verifique sua internet e tente novamente. Se o problema persistir, a API pode estar indisponível.')
    } else if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Erro desconhecido ao gerar relatório de evidências')
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
      // Para relatório de evidências, basta ter alunos na turma (elegíveis ou não)
      return eligibility.length > 0 // Se há alunos na turma, pode gerar relatório
    }
    
    return false
  } catch (error) {
    console.warn('Erro ao verificar elegibilidade da turma:', error)
    return false
  }
}
