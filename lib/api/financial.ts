import api from './client'

// Função helper para fazer requisições usando o cliente axios configurado
export async function apiRequest(endpoint: string, options: { method?: string; data?: any } = {}) {
  const { method = 'GET', data } = options
  
  try {
    const response = await api({
      url: endpoint,
      method,
      data,
    })
    
    // Para endpoints de cash-flow, retornar a resposta completa
    if (method === 'GET' && endpoint.includes('cash-flow')) {
      return response.data
    }
    
    // Para requisições de listagem (getAll), verificar se há dados em 'data' property
    if (method === 'GET' && (endpoint.includes('?') || endpoint.includes('accounts-receivable'))) {
      // Se a resposta tem uma propriedade 'data' que é um array, usar ela
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data
      }
      // Se a resposta tem uma propriedade 'items' que é um array, usar ela
      if (response.data && Array.isArray(response.data.items)) {
        return response.data.items
      }
      // Se a resposta direta é um array, usar ela
      if (Array.isArray(response.data)) {
        return response.data
      }
    }
    
    return response.data
  } catch (error: any) {
    console.error('❌ Erro na requisição da API:', {
      endpoint,
      method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message
    })
    throw new Error(error.response?.data?.message || error.message || 'Erro na requisição')
  }
}

// 🏦 CONTAS BANCÁRIAS
export interface BankAccount {
  id: string
  nome: string
  banco: string
  codigoBanco: string
  agencia: string
  numero: string
  digitoVerificador: string
  tipoConta: 'CORRENTE' | 'POUPANCA' | 'INVESTIMENTO'
  saldo: number
  isActive: boolean
  isMain: boolean
  observations?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBankAccountData {
  nome: string
  banco: string
  codigoBanco: string
  agencia: string
  numero: string
  digitoVerificador: string
  tipoConta: 'CORRENTE' | 'POUPANCA' | 'INVESTIMENTO'
  saldo: number
  isActive: boolean
  isMain: boolean
  observations?: string
}

export interface UpdateBankAccountData {
  nome?: string
  banco?: string
  codigoBanco?: string
  agencia?: string
  numero?: string
  digitoVerificador?: string
  tipoConta?: 'CORRENTE' | 'POUPANCA' | 'INVESTIMENTO'
  saldo?: number
  pix?: string
  isActive?: boolean
  isMain?: boolean
  observations?: string
}

export const bankAccountsApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
  }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.search) query.append('search', params.search)
    
    return apiRequest(`/api/financial/bank-accounts?${query}`)
  },

  create: async (data: CreateBankAccountData) => {
    return apiRequest('/api/financial/bank-accounts', {
      method: 'POST',
      data,
    })
  },

  update: async (id: string, data: UpdateBankAccountData) => {
    return apiRequest(`/api/financial/bank-accounts/${id}`, {
      method: 'PUT',
      data,
    })
  },

  delete: async (id: string) => {
    return apiRequest(`/api/financial/bank-accounts/${id}`, {
      method: 'DELETE',
    })
  },

  updateBalance: async (id: string, saldo: number) => {
    return apiRequest(`/api/financial/bank-accounts/${id}/balance`, {
      method: 'PUT',
      data: { saldo },
    })
  },

  getBalance: async (id: string) => {
    return apiRequest(`/api/financial/bank-accounts/${id}/balance`)
  },

  getById: async (id: string) => {
    return apiRequest(`/api/financial/bank-accounts/${id}`)
  },

  getStatistics: async () => {
    return apiRequest('/api/financial/bank-accounts/statistics')
  },

  getMainAccount: async () => {
    return apiRequest('/api/financial/bank-accounts/main')
  },

  // Excel Import/Export
  exportToExcel: async (params?: {
    search?: string
    accountType?: string
    activeOnly?: boolean
  }) => {
    const query = new URLSearchParams()
    if (params?.search) query.append('search', params.search)
    if (params?.accountType) query.append('accountType', params.accountType)
    if (params?.activeOnly !== undefined) query.append('activeOnly', params.activeOnly.toString())
    
    const response = await api({
      url: `/api/financial/bank-accounts/excel/export?${query}`,
      method: 'GET',
      responseType: 'blob',
    })

    // Retorna o blob para download
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contas-bancarias.xlsx'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },

  // Transferência entre contas bancárias
  transferBetweenAccounts: async (data: TransferBetweenAccountsDto): Promise<TransferResponse> => {
    // Validação básica no cliente
    if (!data.fromAccountId || !data.toAccountId) {
      throw new Error('fromAccountId e toAccountId são obrigatórios')
    }
    if (data.fromAccountId === data.toAccountId) {
      throw new Error('fromAccountId e toAccountId devem ser contas diferentes')
    }
    if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
      throw new Error('amount deve ser um número positivo')
    }

    const response = await apiRequest('/api/financial/bank-accounts/transfer', {
      method: 'POST',
      data,
    })

    return response as TransferResponse
  },

   downloadTemplate: async () => {
     const response = await api({
       url: '/api/financial/bank-accounts/excel/template',
       method: 'GET',
       responseType: 'blob',
     })

     // Retorna o blob para download
     const blob = new Blob([response.data], { 
       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
     })
     const url = window.URL.createObjectURL(blob)
     const a = document.createElement('a')
     a.href = url
     a.download = 'template-contas-bancarias.xlsx'
     document.body.appendChild(a)
     a.click()
     window.URL.revokeObjectURL(url)
     document.body.removeChild(a)
   },

  importFromExcel: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api({
      url: '/api/financial/bank-accounts/excel/import',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },

  // Listar transferências com paginação e filtro por conta
  listTransfers: async (params?: { page?: number; limit?: number; accountId?: string }) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.accountId) query.append('accountId', params.accountId)

  const endpoint = `/api/financial/bank-accounts/transfers${query.toString() ? `?${query.toString()}` : ''}`
  // DEBUG: log do endpoint utilizado para listagem de transferências
  console.log('[bankAccountsApi.listTransfers] endpoint:', endpoint)
  return apiRequest(endpoint)
  },

  // Buscar transferência por ID
  getTransferById: async (id: string) => {
    if (!id) throw new Error('id é obrigatório')
    return apiRequest(`/api/financial/bank-accounts/transfers/${id}`)
  },
}

// Interfaces para listagem de transferências
export interface TransferItem {
  id: string
  fromAccountId: string
  toAccountId: string
  amount: number
  description?: string
  createdAt: string
  fromAccount?: {
    id: string
    nome: string
    banco?: string
  }
  toAccount?: {
    id: string
    nome: string
    banco?: string
  }
}

export interface TransfersListResponse {
  data: TransferItem[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// DTOs para transferência entre contas
export interface TransferBetweenAccountsDto {
  fromAccountId: string
  toAccountId: string
  amount: number
  description?: string
}

export interface TransferAccountInfo {
  id: string
  name: string
  previousBalance: number
  newBalance: number
}

export interface TransferDetails {
  fromAccount: TransferAccountInfo
  toAccount: TransferAccountInfo
  amount: number
  description?: string
  timestamp: string
}

export interface TransferResponse {
  success: boolean
  message: string
  transfer: TransferDetails
}

// 💰 CONTAS A RECEBER
export interface AccountReceivable {
  id: string
  description: string
  amount: number
  amountPaid: number
  dueDate: string
  paymentDate?: string
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO' | 'CANCELADO'
  category: 'MENSALIDADE' | 'MATERIAL' | 'CERTIFICADO' | 'SERVICOS' | 'OUTROS'
  referenceMonth?: string
  customerName: string
  customerDocument: string
  customerEmail?: string
  customerPhone?: string
  observations?: string
  paymentMethod?: 'DINHEIRO' | 'PIX' | 'TRANSFERENCIA' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'BOLETO' | 'DEBITO_AUTOMATICO'
  isRecurrent?: boolean
  installmentNumber?: number
  totalInstallments?: number
  bankAccountId?: string
  clientId?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  bankAccount?: {
    id: string
    nome: string
    banco: string
    agencia?: string
    numero?: string
    saldo?: number
  }
}

export interface CreateAccountReceivableData {
  description: string
  amount: number
  dueDate: string
  status?: 'PENDENTE' | 'PAGO' | 'VENCIDO' | 'CANCELADO'
  category?: 'MENSALIDADE' | 'MATERIAL' | 'CERTIFICADO' | 'SERVICOS' | 'OUTROS'
  referenceMonth?: string
  customerName?: string
  customerDocument?: string
  customerEmail?: string
  customerPhone?: string
  observations?: string
  paymentMethod?: 'DINHEIRO' | 'PIX' | 'TRANSFERENCIA' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'BOLETO' | 'DEBITO_AUTOMATICO'
  isRecurrent?: boolean
  installmentNumber?: number
  totalInstallments?: number
  bankAccountId?: string
  clientId?: string
}

export interface PaymentData {
  amount: number
  paymentDate?: string
  paymentMethod?: 'DINHEIRO' | 'PIX' | 'TRANSFERENCIA' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'BOLETO' | 'DEBITO_AUTOMATICO'
  bankAccountId?: string
  observations?: string
}

export interface ReceivableStatistics {
  totalReceivable: number
  totalReceived: number
  pendingReceivable: number
  overdueAmount: number
  overdueCount: number
  totalAccounts: number
  receivablesByCategory: Array<{
    category: string
    totalAmount: number
    amountReceived: number
    pendingAmount: number
    count: number
  }>
  receivablesByPaymentMethod: Array<{
    paymentMethod: string
    amountReceived: number
    count: number
  }>
  receivablesByBankAccount: Array<{
    bankAccountId: string
    totalAmount: number
    amountReceived: number
    pendingAmount: number
    count: number
  }>
}

export const accountsReceivableApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    status?: string
    category?: string
    customerDocument?: string
    bankAccountId?: string
    dateFrom?: string
    dateTo?: string
    search?: string
  }) => {
    const query = new URLSearchParams()
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value) query.append(key, value.toString())
    })
    
    return apiRequest(`/api/financial/accounts-receivable?${query}`)
  },

  getById: async (id: string) => {
    return apiRequest(`/api/financial/accounts-receivable/${id}`)
  },

  getStatistics: async () => {
    return apiRequest('/api/financial/accounts-receivable/statistics')
  },

  create: async (data: CreateAccountReceivableData) => {
    return apiRequest('/api/financial/accounts-receivable', {
      method: 'POST',
      data,
    })
  },

  update: async (id: string, data: Partial<CreateAccountReceivableData>) => {
    return apiRequest(`/api/financial/accounts-receivable/${id}`, {
      method: 'PUT',
      data,
    })
  },

  delete: async (id: string) => {
    return apiRequest(`/api/financial/accounts-receivable/${id}`, {
      method: 'DELETE',
    })
  },

  receivePayment: async (id: string, data: PaymentData) => {
    return apiRequest(`/api/financial/accounts-receivable/${id}/payment`, {
      method: 'POST',
      data,
    })
  },

  partialPayment: async (id: string, data: PaymentData) => {
    return apiRequest(`/api/financial/accounts-receivable/${id}/partial-payment`, {
      method: 'POST',
      data,
    })
  },

  getOverdue: async () => {
    return apiRequest('/api/financial/accounts-receivable/overdue')
  },

  getTotalsByStatus: async () => {
    return apiRequest('/api/financial/accounts-receivable/totals/status')
  },

  // 📊 EXCEL - Exportar para Excel
  exportToExcel: async () => {
    try {
      const response = await api({
        url: '/api/financial/accounts-receivable/excel/export',
        method: 'GET',
        responseType: 'blob',
      })
      
      // Criar URL para download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = window.URL.createObjectURL(blob)
      
      // Criar link temporário para download
      const link = document.createElement('a')
      link.href = url
      link.download = 'contas-a-receber.xlsx'
      document.body.appendChild(link)
      link.click()
      
      // Limpeza
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return { success: true, message: 'Arquivo exportado com sucesso!' }
    } catch (error: any) {
      console.error('❌ Erro ao exportar Excel:', error)
      throw new Error(error.response?.data?.message || 'Erro ao exportar arquivo Excel')
    }
  },

  // 📄 EXCEL - Baixar template
  downloadTemplate: async () => {
    try {
      const response = await api({
        url: '/api/financial/accounts-receivable/excel/template',
        method: 'GET',
        responseType: 'blob',
      })
      
      // Criar URL para download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = window.URL.createObjectURL(blob)
      
      // Criar link temporário para download
      const link = document.createElement('a')
      link.href = url
      link.download = 'template-contas-a-receber.xlsx'
      document.body.appendChild(link)
      link.click()
      
      // Limpeza
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return { success: true, message: 'Template baixado com sucesso!' }
    } catch (error: any) {
      console.error('❌ Erro ao baixar template:', error)
      throw new Error(error.response?.data?.message || 'Erro ao baixar template')
    }
  },

  // 📤 EXCEL - Importar do Excel
  importFromExcel: async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api({
        url: '/api/financial/accounts-receivable/excel/import',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      return response.data
    } catch (error: any) {
      console.error('❌ Erro ao importar Excel:', error)
      throw new Error(error.response?.data?.message || 'Erro ao importar arquivo Excel')
    }
  },
}

// 👥 CLIENTES (API de apoio)
export interface Client {
  id: string
  name: string
  cpf?: string
  cnpj?: string
  email?: string
  mobileAreaCode?: string
  mobileNumber?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  isActive: boolean
  createdAt: string
}

export const clientsApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
  }) => {
    const query = new URLSearchParams()
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value) query.append(key, value.toString())
    })
    
    return apiRequest(`/api/financial/clients?${query}`)
  },

  search: async (params: {
    query: string
    limit?: number
  }) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.append(key, value.toString())
    })
    
    return apiRequest(`/api/financial/clients/search?${query}`)
  },
}

// 📄 CONTAS A PAGAR
export interface AccountPayable {
  id: string
  description: string
  amount: number
  amountPaid: number
  dueDate: string
  paymentDate?: string
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO' | 'CANCELADO'
  category?: string
  supplierName: string
  supplierDocument?: string
  supplierEmail?: string
  supplierPhone?: string
  observations?: string
  paymentMethod?: string
  isRecurrent: boolean
  installmentNumber?: number
  totalInstallments?: number
  bankAccountId?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  bankAccount?: {
    id: string
    nome: string
    banco: string
    agencia?: string
    numero?: string
    saldo?: number
  }
}

export interface ListAccountsPayableParams {
  page?: number
  limit?: number
  status?: string
  category?: string
  supplierDocument?: string
  bankAccountId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface CreateAccountPayableRequest {
  description: string
  amount: number
  dueDate: string
  supplierName: string
  status?: string
  category?: string
  supplierDocument?: string
  supplierEmail?: string
  supplierPhone?: string
  observations?: string
  paymentMethod?: string
  isRecurrent?: boolean
  installmentNumber?: number
  totalInstallments?: number
  bankAccountId?: string
}

export interface UpdateAccountPayableRequest {
  description?: string
  amount?: number
  dueDate?: string
  status?: string
  category?: string
  supplierName?: string
  supplierDocument?: string
  supplierEmail?: string
  supplierPhone?: string
  observations?: string
  paymentMethod?: string
  isRecurrent?: boolean
  installmentNumber?: number
  totalInstallments?: number
  bankAccountId?: string
}

export interface PaymentRequest {
  amount: number
  paymentMethod: string
  paymentDate?: string
  bankAccountId?: string
  observations?: string
}

export interface AccountsPayableStatistics {
  totalPayable: number
  totalPaid: number
  pendingPayable: number
  overdueAmount: number
  overdueCount: number
  totalAccounts: number
  payablesByCategory: {
    category: string
    totalAmount: number
    amountPaid: number
    pendingAmount: number
    count: number
  }[]
  payablesByPaymentMethod: {
    paymentMethod: string
    amountPaid: number
    count: number
  }[]
  payablesByBankAccount: {
    bankAccountId: string
    totalAmount: number
    amountPaid: number
    pendingAmount: number
    count: number
  }[]
}

export interface TotalsByStatus {
  PENDENTE: {
    total: number
    count: number
  }
  PAGO: {
    total: number
    count: number
  }
  VENCIDO: {
    total: number
    count: number
  }
  CANCELADO: {
    total: number
    count: number
  }
}

export const accountsPayableApi = {
  // Listar contas a pagar
  getAll: async (params?: ListAccountsPayableParams): Promise<AccountPayable[]> => {
    const queryParams = new URLSearchParams()
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.supplierDocument) queryParams.append('supplierDocument', params.supplierDocument)
    if (params?.bankAccountId) queryParams.append('bankAccountId', params.bankAccountId)
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom)
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo)
    if (params?.search) queryParams.append('search', params.search)

    const url = queryParams.toString() ? `/api/financial/accounts-payable?${queryParams}` : '/api/financial/accounts-payable'
    const response = await apiRequest(url)
    return response.data || response || []
  },

  // Buscar conta por ID
  getById: async (id: string): Promise<AccountPayable> => {
    return await apiRequest(`/api/financial/accounts-payable/${id}`)
  },

  // Criar nova conta a pagar
  create: async (data: CreateAccountPayableRequest): Promise<AccountPayable> => {
    return await apiRequest('/api/financial/accounts-payable', {
      method: 'POST',
      data,
    })
  },

  // Atualizar conta a pagar
  update: async (id: string, data: UpdateAccountPayableRequest): Promise<AccountPayable> => {
    return await apiRequest(`/api/financial/accounts-payable/${id}`, {
      method: 'PUT',
      data,
    })
  },

  // Efetuar pagamento total
  payment: async (id: string, data: PaymentRequest): Promise<AccountPayable> => {
    return await apiRequest(`/api/financial/accounts-payable/${id}/payment`, {
      method: 'POST',
      data,
    })
  },

  // Efetuar pagamento parcial
  partialPayment: async (id: string, data: PaymentRequest): Promise<AccountPayable> => {
    return await apiRequest(`/api/financial/accounts-payable/${id}/partial-payment`, {
      method: 'POST',
      data,
    })
  },

  // Obter estatísticas
  getStatistics: async (): Promise<AccountsPayableStatistics> => {
    return await apiRequest('/api/financial/accounts-payable/statistics')
  },

  // Obter contas vencidas
  getOverdue: async (): Promise<AccountPayable[]> => {
    const response = await apiRequest('/api/financial/accounts-payable/overdue')
    return response.data || response || []
  },

  // Obter totais por status
  getTotalsByStatus: async (): Promise<TotalsByStatus> => {
    return await apiRequest('/api/financial/accounts-payable/totals/status')
  },

  // Excluir conta a pagar
  delete: async (id: string): Promise<{ message: string }> => {
    return await apiRequest(`/api/financial/accounts-payable/${id}`, {
      method: 'DELETE'
    })
  },

  // 📊 EXCEL - Exportar para Excel
  exportToExcel: async () => {
    try {
      const response = await api({
        url: '/api/financial/accounts-payable/excel/export',
        method: 'GET',
        responseType: 'blob',
      })
      
      // Criar URL para download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = window.URL.createObjectURL(blob)
      
      // Criar link temporário para download
      const link = document.createElement('a')
      link.href = url
      link.download = 'contas-a-pagar.xlsx'
      document.body.appendChild(link)
      link.click()
      
      // Limpeza
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return { success: true, message: 'Arquivo exportado com sucesso!' }
    } catch (error: any) {
      console.error('❌ Erro ao exportar Excel:', error)
      throw new Error(error.response?.data?.message || 'Erro ao exportar arquivo Excel')
    }
  },

  // 📄 EXCEL - Baixar template
  downloadTemplate: async () => {
    try {
      const response = await api({
        url: '/api/financial/accounts-payable/excel/template',
        method: 'GET',
        responseType: 'blob',
      })
      
      // Criar URL para download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = window.URL.createObjectURL(blob)
      
      // Criar link temporário para download
      const link = document.createElement('a')
      link.href = url
      link.download = 'template-contas-a-pagar.xlsx'
      document.body.appendChild(link)
      link.click()
      
      // Limpeza
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return { success: true, message: 'Template baixado com sucesso!' }
    } catch (error: any) {
      console.error('❌ Erro ao baixar template:', error)
      throw new Error(error.response?.data?.message || 'Erro ao baixar template')
    }
  },

  // 📤 EXCEL - Importar do Excel
  importFromExcel: async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api({
        url: '/api/financial/accounts-payable/excel/import',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      return response.data
    } catch (error: any) {
      console.error('❌ Erro ao importar Excel:', error)
      throw new Error(error.response?.data?.message || 'Erro ao importar arquivo Excel')
    }
  },
}

// 🔄 TRANSAÇÕES
export interface Transaction {
  id: string
  valor: number
  data: string
  tipo: 'ENTRADA' | 'SAIDA' | 'TRANSFERENCIA'
  categoria: 'RECEBIMENTO' | 'PAGAMENTO' | 'TAXA' | 'JUROS' | 'RENDIMENTO' | 'TRANSFERENCIA'
  descricao: string
  numeroDocumento?: string
  contaBancariaId: string
  observations?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionData {
  valor: number
  data: string
  tipo: 'ENTRADA' | 'SAIDA' | 'TRANSFERENCIA'
  categoria: 'RECEBIMENTO' | 'PAGAMENTO' | 'TAXA' | 'JUROS' | 'RENDIMENTO' | 'TRANSFERENCIA'
  descricao: string
  numeroDocumento?: string
  contaBancariaId: string
  observations?: string
}

export const transactionsApi = {
  getAll: async (params?: {
    bankAccountId?: string
    tipo?: string
    categoria?: string
    dateFrom?: string
    dateTo?: string
    page?: number
    limit?: number
  }) => {
    const query = new URLSearchParams()
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value) query.append(key, value.toString())
    })
    
    return apiRequest(`/api/financial/transactions?${query}`)
  },

  create: async (data: CreateTransactionData) => {
    return apiRequest('/api/financial/transactions', {
      method: 'POST',
      data,
    })
  },

  transfer: async (data: {
    fromBankAccountId: string
    toBankAccountId: string
    valor: number
    data: string
    descricao: string
    numeroDocumento?: string
  }) => {
    return apiRequest('/api/financial/transactions/transfer', {
      method: 'POST',
      data,
    })
  },

  getCashFlow: async (params: {
    startDate: string
    endDate: string
    bankAccountId?: string
  }) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.append(key, value)
    })
    
    return apiRequest(`/api/financial/transactions/cash-flow?${query}`)
  },
}

// 📊 RELATÓRIOS
export const reportsApi = {
  getOpenAccounts: async (params?: {
    type?: 'receivable' | 'payable' | 'both'
    upTo?: string
  }) => {
    const query = new URLSearchParams()
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value) query.append(key, value)
    })
    
    return apiRequest(`/api/financial/reports/open-accounts?${query}`)
  },

  getFinancialPosition: async () => {
    return apiRequest('/api/financial/reports/financial-position')
  },

  getCashFlow: async (params: {
    startDate: string
    endDate: string
    bankAccountId?: string
  }) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) query.append(key, value)
    })
    
    return apiRequest(`/api/financial/reports/cash-flow?${query}`)
  },
}

// 🏪 BANCOS
export interface Bank {
  codigo: string
  nome: string
}

export const banksApi = {
  getAll: async (): Promise<Bank[]> => {
    return apiRequest('/api/financial/banks')
  },
}

// Constantes
export const PAYMENT_METHODS = [
  { value: 'DINHEIRO', label: 'Dinheiro' },
  { value: 'PIX', label: 'PIX' },
  { value: 'TRANSFERENCIA', label: 'Transferência bancária' },
  { value: 'CARTAO_CREDITO', label: 'Cartão de crédito' },
  { value: 'CARTAO_DEBITO', label: 'Cartão de débito' },
  { value: 'BOLETO', label: 'Boleto bancário' },
  { value: 'DEBITO_AUTOMATICO', label: 'Débito automático' },
]

export const ACCOUNT_TYPES = [
  { value: 'CORRENTE', label: 'Conta corrente' },
  { value: 'POUPANCA', label: 'Conta poupança' },
  { value: 'INVESTIMENTO', label: 'Conta de investimento' },
]

export const RECEIVABLE_CATEGORIES = [
  { value: 'MENSALIDADE', label: 'Mensalidades de cursos' },
  { value: 'MATERIAL', label: 'Venda de materiais' },
  { value: 'CERTIFICADO', label: 'Emissão de certificados' },
  { value: 'SERVICOS', label: 'Prestação de serviços' },
  { value: 'OUTROS', label: 'Outras receitas' },
]

export const PAYABLE_CATEGORIES = [
  { value: 'SALARIO', label: 'Pagamento de salários' },
  { value: 'FORNECEDOR', label: 'Pagamento a fornecedores' },
  { value: 'ALUGUEL', label: 'Aluguel de imóveis' },
  { value: 'CONTA_LUZ', label: 'Conta de energia elétrica' },
  { value: 'CONTA_AGUA', label: 'Conta de água' },
  { value: 'IMPOSTOS', label: 'Impostos e taxas' },
  { value: 'COMBUSTIVEL', label: 'Combustível' },
  { value: 'MANUTENCAO', label: 'Manutenção' },
  { value: 'OUTROS', label: 'Outras despesas' },
]

export const STATUS_OPTIONS = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PAGO', label: 'Pago' },
  { value: 'VENCIDO', label: 'Vencido' },
  { value: 'CANCELADO', label: 'Cancelado' },
]

// Aliases para compatibilidade com contas a pagar
export const ACCOUNT_CATEGORIES = PAYABLE_CATEGORIES
export const ACCOUNT_STATUS = STATUS_OPTIONS

// 📊 INTERFACES DO DASHBOARD FINANCEIRO
export interface DashboardSummary {
  bankAccountsBalance: {
    total: number
    accounts: Array<{
      id: string
      nome: string
      banco: string
      saldo: number
    }>
  }
  accountsReceivable: {
    total: number
    pending: number
    overdue: number
  }
  accountsPayable: {
    total: number
    pending: number
    overdue: number
  }
  monthlyFlow: {
    currentMonth: {
      received: number
      paid: number
      balance: number
    }
  }
}

export interface YearlyFlowData {
  year: number
  months: Array<{
    month: number
    monthName: string
    valueToReceive: number
    valueReceived: number
    valueToPay: number
    valuePaid: number
    netFlow: number
  }>
  totals: {
    valueToReceive: number
    valueReceived: number
    totalReceivables: number
    valueToPay: number
    valuePaid: number
    totalPayables: number
    annualNetFlow: number
  }
}

export interface PaymentMethodsYearlyData {
  year: number
  period: {
    startDate: string
    endDate: string
  }
  receivedByPaymentMethod: Record<string, number>
  paidByPaymentMethod: Record<string, number>
  totals: {
    totalReceived: number
    totalPaid: number
    netFlow: number
  }
}

export interface PaymentMethodsMonthlyData {
  year: number
  months: Array<{
    month: number
    monthName: string
    receivedByPaymentMethod: Record<string, number>
    paidByPaymentMethod: Record<string, number>
  }>
}

export interface ReceivablesTimelineData {
  year: number
  months: Array<{
    month: number
    monthName: string
    totalToReceive: number
    totalReceived: number
    pending: number
    overdue: number
  }>
  totals: {
    yearToReceive: number
    yearReceived: number
    yearPending: number
    yearOverdue: number
  }
}

export interface PayablesTimelineData {
  year: number
  months: Array<{
    month: number
    monthName: string
    totalToPay: number
    totalPaid: number
    pending: number
    overdue: number
  }>
  totals: {
    yearToPay: number
    yearPaid: number
    yearPending: number
    yearOverdue: number
  }
}

export interface MonthlyCashFlowData {
  year: number
  months: Array<{
    month: number
    monthName: string
    totalReceived: number
    totalPaid: number
    netFlow: number
    currentBalance: number
    breakdown: {
      receivedByCategory: Record<string, number>
      paidByCategory: Record<string, number>
    }
  }>
  summary: {
    totalReceived: number
    totalPaid: number
    netFlow: number
    finalBalance: number
  }
}

// API para dashboard financeiro
export const dashboardApi = {
  // Resumo geral do dashboard
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiRequest('/api/financial/dashboard/summary')
    return response
  },

  // Análise de fluxo anual
  getYearlyFlow: async (year?: number): Promise<YearlyFlowData> => {
    const response = await apiRequest(`/api/financial/dashboard/yearly-flow${year ? `?year=${year}` : ''}`)
    return response
  },

  // Análise de métodos de pagamento (anual)
  getPaymentMethodsYearly: async (year?: number): Promise<PaymentMethodsYearlyData> => {
    const response = await apiRequest(`/api/financial/dashboard/payment-methods-yearly${year ? `?year=${year}` : ''}`)
    return response
  },

  // Análise mensal de métodos de pagamento
  getPaymentMethodsMonthly: async (year?: number): Promise<PaymentMethodsMonthlyData> => {
    const response = await apiRequest(`/api/financial/dashboard/payment-methods-monthly${year ? `?year=${year}` : ''}`)
    return response
  },

  // Timeline de contas a receber
  getReceivablesTimeline: async (year?: number): Promise<ReceivablesTimelineData> => {
    const response = await apiRequest(`/api/financial/dashboard/receivables-timeline${year ? `?year=${year}` : ''}`)
    return response
  },

  // Timeline de contas a pagar
  getPayablesTimeline: async (year?: number): Promise<PayablesTimelineData> => {
    const response = await apiRequest(`/api/financial/dashboard/payables-timeline${year ? `?year=${year}` : ''}`)
    return response
  },

  // Fluxo de caixa mensal
  getMonthlyCashFlow: async (year?: number): Promise<MonthlyCashFlowData> => {
    const response = await apiRequest(`/api/financial/dashboard/monthly-cash-flow${year ? `?year=${year}` : ''}`)
    return response
  },

  // Endpoints de compatibilidade (legacy)
  getMonthlyComparison: async (year?: number): Promise<YearlyFlowData> => {
    const response = await apiRequest(`/api/financial/dashboard/monthly-comparison${year ? `?year=${year}` : ''}`)
    return response
  },

  getPaymentMethods: async (params?: { 
    startDate?: string
    endDate?: string
    type?: 'received' | 'paid' | 'both' 
  }): Promise<PaymentMethodsYearlyData> => {
    const queryParams = new URLSearchParams()
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)
    if (params?.type) queryParams.append('type', params.type)
    
    const response = await apiRequest(`/api/financial/dashboard/payment-methods?${queryParams.toString()}`)
    return response
  },
}

// 💰 FLUXO DE CAIXA - INTERFACES
export interface CashFlowTransaction {
  id: string
  valor: number
  data: string
  tipo: 'ENTRADA' | 'SAIDA'
  categoria: 'RECEBIMENTO' | 'PAGAMENTO' | 'TAXA' | 'JUROS' | 'RENDIMENTO' | 'TRANSFERENCIA'
  descricao: string
  numeroDocumento: string
  origem: 'CONTA_RECEBER' | 'CONTA_PAGAR' | 'MANUAL' | 'TRANSFERENCIA'
  referenceId?: string
  contaBancariaId: string
  createdBy: string
  createdAt: string
  updatedAt: string
  transactionType: 'ENTRADA' | 'SAIDA'
  displayAmount: string
  contaBancaria: {
    id: string
    nome: string
    banco: string
    agencia?: string
    numero?: string
  }
}

export interface CashFlowStatistics {
  period: {
    startDate: string
    endDate: string
    bankAccountId?: string | null
  }
  summary: {
    totalEntradas: number
    totalSaidas: number
    saldoLiquido: number
    totalTransactions: number
  }
  byCategory: {
    entradas: Record<string, number>
    saidas: Record<string, number>
  }
  byOrigin: Array<{
    origin: string
    total: number
    count: number
  }>
  byBankAccount: Array<{
    bankAccountId: string
    bankAccountName: string
    bankName: string
    totalEntradas: number
    totalSaidas: number
    saldoLiquido: number
    transactionCount: number
  }>
}

export interface CashFlowTransactionsResponse {
  data: CashFlowTransaction[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  summary: {
    totalEntradas: number
    totalSaidas: number
  }
}

export interface CashFlowEntriesExits {
  period: {
    startDate: string
    endDate: string
    bankAccountId?: string | null
  }
  summary: {
    totalEntradas: number
    totalSaidas: number
    saldoLiquido: number
    qtdEntradas: number
    qtdSaidas: number
  }
  entradas: CashFlowTransaction[]
  saidas: CashFlowTransaction[]
}

export interface DailyCashFlow {
  date: string
  entradas: number
  saídas: number
  saldoDia: number
  saldoAcumulado: number
}

export interface CashFlowDailyResponse {
  period: {
    startDate: string
    endDate: string
    bankAccountId?: string | null
  }
  summary: {
    totalEntradas: number
    totalSaidas: number
    saldoLiquido: number
    totalDays: number
  }
  dailyFlow: DailyCashFlow[]
}

// Parâmetros para filtros de fluxo de caixa
export interface CashFlowFilters {
  startDate?: string
  endDate?: string
  bankAccountId?: string
  categoria?: 'RECEBIMENTO' | 'PAGAMENTO' | 'TAXA' | 'JUROS' | 'RENDIMENTO' | 'TRANSFERENCIA'
  search?: string
  page?: number
  limit?: number
}

// 💰 FLUXO DE CAIXA - API
export const cashFlowApi = {
  // Estatísticas do fluxo de caixa
  getStatistics: async (filters?: Omit<CashFlowFilters, 'page' | 'limit' | 'search'>): Promise<CashFlowStatistics> => {
    const params = new URLSearchParams()
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.bankAccountId) params.append('bankAccountId', filters.bankAccountId)
    
    const queryString = params.toString()
    const endpoint = `/api/financial/cash-flow/statistics${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint)
  },

  // Todas as transações do fluxo de caixa
  getTransactions: async (filters?: CashFlowFilters): Promise<CashFlowTransactionsResponse> => {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.bankAccountId) params.append('bankAccountId', filters.bankAccountId)
    if (filters?.categoria) params.append('categoria', filters.categoria)
    if (filters?.search) params.append('search', filters.search)
    
    const queryString = params.toString()
    const endpoint = `/api/financial/cash-flow/transactions${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint)
  },

  // Entradas e saídas separadas
  getEntriesExits: async (filters?: Omit<CashFlowFilters, 'page' | 'limit' | 'categoria' | 'search'>): Promise<CashFlowEntriesExits> => {
    const params = new URLSearchParams()
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.bankAccountId) params.append('bankAccountId', filters.bankAccountId)
    
    const queryString = params.toString()
    const endpoint = `/api/financial/cash-flow/entries-exits${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint)
  },

  // Fluxo de caixa diário
  getDailyFlow: async (filters: { startDate: string; endDate: string; bankAccountId?: string }): Promise<CashFlowDailyResponse> => {
    const params = new URLSearchParams()
    params.append('startDate', filters.startDate)
    params.append('endDate', filters.endDate)
    if (filters.bankAccountId) params.append('bankAccountId', filters.bankAccountId)
    
    const queryString = params.toString()
    const endpoint = `/api/financial/cash-flow/daily-flow?${queryString}`
    
    return apiRequest(endpoint)
  },

  // 📊 EXCEL - Exportar fluxo de caixa para Excel
  exportToExcel: async (filters?: Omit<CashFlowFilters, 'page' | 'limit'>): Promise<void> => {
    try {
      const params = new URLSearchParams()
      if (filters?.startDate) params.append('startDate', filters.startDate)
      if (filters?.endDate) params.append('endDate', filters.endDate)
      if (filters?.bankAccountId) params.append('bankAccountId', filters.bankAccountId)
      if (filters?.categoria) params.append('categoria', filters.categoria)
      if (filters?.search) params.append('search', filters.search)
      
      const queryString = params.toString()
      const endpoint = `/api/financial/cash-flow/excel/export${queryString ? `?${queryString}` : ''}`
      
      const response = await api({
        url: endpoint,
        method: 'GET',
        responseType: 'blob', // Importante para arquivos Excel
      })

      // Criar URL do blob e fazer download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `fluxo-caixa-${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log('✅ Fluxo de caixa exportado para Excel com sucesso!')
    } catch (error) {
      console.error('❌ Erro ao exportar fluxo de caixa para Excel:', error)
      throw error
    }
  }
}

// Constantes para categorias de fluxo de caixa
export const CASH_FLOW_CATEGORIES = [
  { value: 'RECEBIMENTO', label: 'Recebimento', type: 'ENTRADA' },
  { value: 'PAGAMENTO', label: 'Pagamento', type: 'SAIDA' },
  { value: 'TAXA', label: 'Taxa', type: 'SAIDA' },
  { value: 'JUROS', label: 'Juros', type: 'ENTRADA' },
  { value: 'RENDIMENTO', label: 'Rendimento', type: 'ENTRADA' },
  { value: 'TRANSFERENCIA', label: 'Transferência', type: 'AMBOS' },
]

export const CASH_FLOW_ORIGINS = [
  { value: 'CONTA_RECEBER', label: 'Conta a Receber' },
  { value: 'CONTA_PAGAR', label: 'Conta a Pagar' },
  { value: 'MANUAL', label: 'Lançamento Manual' },
  { value: 'TRANSFERENCIA', label: 'Transferência entre Contas' },
]

export const TRANSACTION_TYPES = [
  { value: 'ENTRADA', label: 'Entrada', color: 'text-green-600' },
  { value: 'SAIDA', label: 'Saída', color: 'text-red-600' },
]

// 📊 RELATÓRIOS FILTRADOS - INTERFACES
export interface FilteredReportRequest {
  // === FILTROS DE DATA ===
  startDate?: string              // Data de criação inicial (YYYY-MM-DD)
  endDate?: string                // Data de criação final (YYYY-MM-DD)
  dueDateStart?: string           // Data de vencimento inicial
  dueDateEnd?: string             // Data de vencimento final
  paymentDateStart?: string       // Data de pagamento inicial
  paymentDateEnd?: string         // Data de pagamento final
  
  // === FILTROS DE STATUS ===
  status?: string[]               // Array de status
  
  // === FILTROS DE CATEGORIA ===
  categories?: string[]           // Array de categorias
  
  // === FILTROS DE MÉTODO DE PAGAMENTO ===
  paymentMethods?: string[]       // Array de métodos
  
  // === FILTROS DE VALOR ===
  minAmount?: number              // Valor mínimo
  maxAmount?: number              // Valor máximo
  
  // === FILTROS DE CLIENTE/FORNECEDOR ===
  customerNames?: string[]        // Nomes de clientes
  supplierNames?: string[]        // Nomes de fornecedores
  customerDocuments?: string[]    // CPF/CNPJ de clientes
  supplierDocuments?: string[]    // CPF/CNPJ de fornecedores
  
  // === FILTROS DE CONTA BANCÁRIA ===
  bankAccountIds?: string[]       // IDs das contas bancárias
  
  // === FILTROS DE RECORRÊNCIA ===
  isRecurring?: boolean           // true/false ou omitir
  
  // === FILTROS DE PARCELAS ===
  hasInstallments?: boolean       // Se tem parcelas
  installmentNumber?: number      // Número da parcela específica
  
  // === FILTROS DE TEXTO ===
  searchDescription?: string      // Busca na descrição
  searchNotes?: string            // Busca nas observações
  
  // === FILTROS ESPECÍFICOS CONTAS A RECEBER ===
  referenceMonth?: string         // Mês de referência (AAAA-MM)
  
  // === FILTROS DE ORDENAÇÃO ===
  sortBy?: string                 // Campo para ordenação
  sortOrder?: 'asc' | 'desc'      // asc ou desc
  
  // === FILTROS DE TIPO DE RELATÓRIO ===
  includeReceivable?: boolean     // Incluir contas a receber
  includePayable?: boolean        // Incluir contas a pagar
  includeBankAccounts?: boolean   // Incluir contas bancárias
}

export interface FilteredReportResponse {
  success: boolean
  message?: string
  generatedAt: string
  period: {
    startDate: string
    endDate: string
  }
  statistics: {
    totalRecords: number
    totalAmount: number
    averageAmount: number
    
    // Para contas a receber
    totalReceivable?: number
    totalReceived?: number
    pendingReceivable?: number
    overdueAmount?: number
    overdueCount?: number
    
    // Para contas a pagar
    totalPayable?: number
    totalPaid?: number
    pendingPayable?: number
  }
}

// 📊 RELATÓRIOS FILTRADOS - API
export const filteredReportsApi = {
  // Exportar relatório filtrado (único método disponível)
  exportFiltered: async (filters: FilteredReportRequest): Promise<void> => {
    try {
      const response = await api({
        url: '/api/financial/reports/filtered-export',
        method: 'POST',
        data: filters,
        responseType: 'blob',
      })

      // Criar nome do arquivo baseado na data
      const timestamp = new Date().toISOString().split('T')[0]
      const fileName = `relatorio-financeiro-${timestamp}.xlsx`

      // Criar blob e fazer download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log('✅ Relatório financeiro exportado com sucesso!')
    } catch (error) {
      console.error('❌ Erro ao exportar relatório filtrado:', error)
      throw error
    }
  },
}

// Constantes para relatórios filtrados
export const REPORT_INCLUDE_OPTIONS = [
  { value: 'includeReceivable', label: 'Contas a Receber', icon: '💰' },
  { value: 'includePayable', label: 'Contas a Pagar', icon: '📄' },
  { value: 'includeBankAccounts', label: 'Contas Bancárias', icon: '🏦' },
]

export const SORT_BY_OPTIONS = [
  { value: 'dueDate', label: 'Data de Vencimento' },
  { value: 'createdAt', label: 'Data de Criação' },
  { value: 'amount', label: 'Valor' },
  { value: 'paymentDate', label: 'Data de Pagamento' },
  { value: 'status', label: 'Status' },
  { value: 'category', label: 'Categoria' },
  { value: 'customerName', label: 'Nome do Cliente' },
  { value: 'supplierName', label: 'Nome do Fornecedor' },
]
