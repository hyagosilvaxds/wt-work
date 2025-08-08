// API para Contas a Pagar
import { apiRequest } from './financial'

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

const BASE_URL = '/api/financial/accounts-payable'

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

    const url = queryParams.toString() ? `${BASE_URL}?${queryParams}` : BASE_URL
    const response = await apiRequest(url)
    return response.data || response || []
  },

  // Buscar conta por ID
  getById: async (id: string): Promise<AccountPayable> => {
    return await apiRequest(`${BASE_URL}/${id}`)
  },

  // Criar nova conta a pagar
  create: async (data: CreateAccountPayableRequest): Promise<AccountPayable> => {
    return await apiRequest(`${BASE_URL}`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Atualizar conta a pagar
  update: async (id: string, data: UpdateAccountPayableRequest): Promise<AccountPayable> => {
    return await apiRequest(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  // Efetuar pagamento total
  payment: async (id: string, data: PaymentRequest): Promise<AccountPayable> => {
    return await apiRequest(`${BASE_URL}/${id}/payment`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Efetuar pagamento parcial
  partialPayment: async (id: string, data: PaymentRequest): Promise<AccountPayable> => {
    return await apiRequest(`${BASE_URL}/${id}/partial-payment`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Obter estatísticas
  getStatistics: async (): Promise<AccountsPayableStatistics> => {
    return await apiRequest(`${BASE_URL}/statistics`)
  },

  // Obter contas vencidas
  getOverdue: async (): Promise<AccountPayable[]> => {
    const response = await apiRequest(`${BASE_URL}/overdue`)
    return response.data || response || []
  },

  // Obter totais por status
  getTotalsByStatus: async (): Promise<TotalsByStatus> => {
    return await apiRequest(`${BASE_URL}/totals/status`)
  },

  // Excluir conta a pagar
  delete: async (id: string): Promise<{ message: string }> => {
    return await apiRequest(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    })
  }
}

// Constantes para as categorias e formas de pagamento
export const ACCOUNT_CATEGORIES = [
  { value: 'SALARIO', label: 'Salário' },
  { value: 'FORNECEDOR', label: 'Fornecedor' },
  { value: 'ALUGUEL', label: 'Aluguel' },
  { value: 'CONTA_LUZ', label: 'Conta de Luz' },
  { value: 'CONTA_AGUA', label: 'Conta de Água' },
  { value: 'IMPOSTOS', label: 'Impostos' },
  { value: 'COMBUSTIVEL', label: 'Combustível' },
  { value: 'MANUTENCAO', label: 'Manutenção' },
  { value: 'OUTROS', label: 'Outros' }
]

export const PAYMENT_METHODS = [
  { value: 'DINHEIRO', label: 'Dinheiro' },
  { value: 'PIX', label: 'PIX' },
  { value: 'TRANSFERENCIA', label: 'Transferência' },
  { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
  { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
  { value: 'BOLETO', label: 'Boleto' },
  { value: 'DEBITO_AUTOMATICO', label: 'Débito Automático' }
]

export const ACCOUNT_STATUS = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PAGO', label: 'Pago' },
  { value: 'VENCIDO', label: 'Vencido' },
  { value: 'CANCELADO', label: 'Cancelado' }
]
