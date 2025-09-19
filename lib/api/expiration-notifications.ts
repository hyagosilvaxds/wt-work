import api from './client'

export type ExpirationStatus = 'EXPIRED' | 'EXPIRING_SOON'

export interface ExpirationNotification {
  classId: string
  trainingName: string
  clientName: string
  clientId: string
  startDate: string
  endDate: string
  expirationDate: string
  daysUntilExpiration: number
  status: ExpirationStatus
  validityDays: number
  location?: string
  isRead: boolean
}

export interface ExpirationSummary {
  total: number
  expired: number
  expiringSoon: number
  unread: number
}

export interface ExpirationNotificationsResponse {
  notifications: ExpirationNotification[]
  summary: ExpirationSummary
}

/**
 * Lista notificações de vencimento de turmas.
 * Opções:
 * - clientId?: filtrar por cliente
 * - status?: 'EXPIRED' | 'EXPIRING_SOON'
 * - search?: texto para busca
 */
export async function listExpirationNotifications(params?: { clientId?: string; status?: ExpirationStatus; search?: string }) {
  const query = new URLSearchParams()
  if (params?.clientId) query.append('clientId', params.clientId)
  if (params?.status) query.append('status', params.status)
  if (params?.search) query.append('search', params.search)

  const endpoint = `/superadmin/expiration-notifications${query.toString() ? `?${query.toString()}` : ''}`
  // Log útil para depuração
  console.log('[expiration-notifications] GET', endpoint)

  const response = await api.get<ExpirationNotificationsResponse>(endpoint)
  return response.data
}

export interface MarkReadPayload {
  classId: string
  userId?: string
  clientId?: string
}

export interface MarkReadResponse {
  success: boolean
  message?: string
}

/**
 * Marca uma notificação como lida para o usuário/cliente atual.
 */
export async function markNotificationRead(payload: MarkReadPayload) {
  if (!payload?.classId) throw new Error('classId é obrigatório')
  const endpoint = `/superadmin/expiration-notifications/mark-read`
  console.log('[expiration-notifications] POST', endpoint, payload)
  const response = await api.post<MarkReadResponse>(endpoint, payload)
  return response.data
}
