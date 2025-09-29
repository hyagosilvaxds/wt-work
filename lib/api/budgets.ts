import api from './client'

export type BudgetStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED' | 'EXPIRED'

export interface BudgetItemRequest {
  trainingId: string
  quantity: number
  unitPrice: number
  description?: string
  observations?: string
  order?: number
  customValue?: number
  location?: string
  studentQuantity?: number
  classQuantity?: number
}

export interface CreateBudgetRequest {
  title: string
  description?: string
  clientId: string
  validityDays?: number
  observations?: string
  coverPageId?: string
  backCoverPageId?: string
  certificatePageId?: string
  trainingDate?: string
  dueDate?: string
  attentionTo?: string
  sector?: string
  instructors?: string
  responsibilities?: string
  clientResponsibilities?: string
  location?: string
  items: BudgetItemRequest[]
}

export interface BudgetItemResponse {
  id: string
  trainingId: string
  trainingTitle: string
  quantity: number
  unitPrice: number
  totalPrice: number
  description?: string
  observations?: string
  order?: number
  customValue?: number
  location?: string
  studentQuantity?: number
  classQuantity?: number
}

export interface BudgetResponse {
  id: string
  number: string
  title: string
  description?: string
  clientId: string
  clientName?: string
  status: BudgetStatus
  validityDays: number
  totalValue: number
  observations?: string
  coverPageId?: string
  backCoverPageId?: string
  certificatePageId?: string
  trainingDate?: string
  dueDate?: string
  attentionTo?: string
  sector?: string
  instructors?: string
  clientLogoPath?: string
  clientLogoName?: string
  responsibilities?: string
  clientResponsibilities?: string
  location?: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
  sentAt?: string
  approvedAt?: string
  rejectedAt?: string
  expiresAt?: string
  items: BudgetItemResponse[]
}

/**
 * Cria um novo orçamento
 */
export async function createBudget(payload: CreateBudgetRequest) {
  // Validações mínimas
  if (!payload.title) throw new Error('title é obrigatório')
  if (!payload.clientId) throw new Error('clientId é obrigatório')
  if (!payload.items || payload.items.length === 0) throw new Error('items é obrigatório e deve conter pelo menos 1 item')
  if (payload.validityDays && (payload.validityDays < 1 || payload.validityDays > 365)) throw new Error('validityDays deve estar entre 1 e 365')

  const endpoint = '/budgets'
  console.log('[budgets] POST', endpoint, { title: payload.title, clientId: payload.clientId })
  const response = await api.post<BudgetResponse>(endpoint, payload)
  return response.data
}

export interface BudgetListParams {
  clientId?: string
  status?: BudgetStatus
  search?: string
  createdBy?: string
  startDate?: string
  endDate?: string
}

/**
 * Lista orçamentos com filtros opcionais
 */
export async function listBudgets(params?: BudgetListParams) {
  const query = new URLSearchParams()
  if (params?.clientId) query.append('clientId', params.clientId)
  if (params?.status) query.append('status', params.status)
  if (params?.search) query.append('search', params.search)
  if (params?.createdBy) query.append('createdBy', params.createdBy)
  if (params?.startDate) query.append('startDate', params.startDate)
  if (params?.endDate) query.append('endDate', params.endDate)

  const endpoint = `/budgets${query.toString() ? `?${query.toString()}` : ''}`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<BudgetResponse[]>(endpoint)
  return response.data
}

export interface UpdateBudgetRequest {
  title?: string
  description?: string
  status?: BudgetStatus
  validityDays?: number
  observations?: string
  coverPageId?: string
  backCoverPageId?: string
  certificatePageId?: string
  trainingDate?: string
  dueDate?: string
  attentionTo?: string
  sector?: string
  instructors?: string
  responsibilities?: string
  clientResponsibilities?: string
  location?: string
  items?: BudgetItemRequest[]
}

/**
 * Atualiza um orçamento existente (PATCH /budgets/{id})
 */
export async function updateBudget(id: string, payload: UpdateBudgetRequest) {
  if (!id) throw new Error('id é obrigatório')
  if (payload.validityDays && (payload.validityDays < 1 || payload.validityDays > 365)) throw new Error('validityDays deve estar entre 1 e 365')
  if (payload.items) {
    if (!Array.isArray(payload.items)) throw new Error('items deve ser um array')
    if (payload.items.length === 0) throw new Error('items deve conter pelo menos 1 item se fornecido')
    for (const it of payload.items) {
      if (it.quantity == null || it.quantity < 1) throw new Error('cada item deve ter quantity >= 1')
      if (it.unitPrice == null || it.unitPrice < 0) throw new Error('cada item deve ter unitPrice >= 0')
  if (it.studentQuantity != null && it.studentQuantity < 1) throw new Error('studentQuantity deve ser >= 1 se fornecido')
  if (it.classQuantity != null && it.classQuantity < 1) throw new Error('classQuantity deve ser >= 1 se fornecido')
    }
  }

  const endpoint = `/budgets/${id}`
  console.log('[budgets] PATCH', endpoint, { id })
  const response = await api.patch<BudgetResponse>(endpoint, payload)
  return response.data
}

/**
 * Obtém um orçamento por ID (GET /budgets/{id})
 */
export async function getBudgetById(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/${id}`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<BudgetResponse>(endpoint)
  return response.data
}

/**
 * Deleta um orçamento
 * DELETE /budgets/{id}
 */
export async function deleteBudget(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/${id}`
  console.log('[budgets] DELETE', endpoint)
  const response = await api.delete<{ message: string }>(endpoint)
  return response.data
}

export interface CoverPage {
  id: string
  name: string
  description?: string
  type: 'COVER' | 'BACK_COVER'
  filePath?: string
  fileName?: string
  fileSize?: number
  isDefault?: boolean
  isActive?: boolean
}

export interface BudgetCoverResponse {
  coverPage?: CoverPage
  backCoverPage?: CoverPage
}

/**
 * Obtém as capas (cover / back cover) de um orçamento (GET /budgets/{id}/cover)
 */
export async function getBudgetCover(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/${id}/cover`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<BudgetCoverResponse>(endpoint)
  return response.data
}

// Tipos para global data
export interface PhotoRef {
  id: string
  caption?: string
  filePath?: string
  fileName?: string
}

export interface IncludedItemGlobal {
  id: string
  description?: string
  details?: string
  photos?: PhotoRef[]
}

// ----------------------------
// Included Item Photos
// ----------------------------

export interface IncludedItemPhotoResponse {
  id: string
  includedItemId: string
  caption?: string
  description?: string
  filePath?: string
  fileName?: string
  fileSize?: number
  createdAt?: string
  updatedAt?: string
}

/**
 * Upload de foto para um item incluído (multipart/form-data)
 * POST /budgets/global-settings/included-items/{includedItemId}/photos
 */
export async function uploadIncludedItemPhoto(includedItemId: string, formData: FormData) {
  if (!includedItemId) throw new Error('includedItemId é obrigatório')
  const endpoint = `/budgets/global-settings/included-items/${includedItemId}/photos`
  console.log('[budgets] POST', endpoint)
  const response = await api.post<IncludedItemPhotoResponse>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

/**
 * Obtém uma foto do item incluído por ID
 * GET /budgets/global-settings/included-item-photos/{id}
 */
export async function getIncludedItemPhotoById(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/included-item-photos/${id}`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<IncludedItemPhotoResponse>(endpoint)
  return response.data
}

/**
 * Atualiza metadados de uma foto do item incluído
 * PATCH /budgets/global-settings/included-item-photos/{id}
 */
export async function updateIncludedItemPhoto(id: string, payload: { caption?: string; description?: string }) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/included-item-photos/${id}`
  console.log('[budgets] PATCH', endpoint)
  const response = await api.patch<IncludedItemPhotoResponse>(endpoint, payload)
  return response.data
}

/**
 * Deleta uma foto do item incluído
 * DELETE /budgets/global-settings/included-item-photos/{id}
 */
export async function deleteIncludedItemPhoto(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/included-item-photos/${id}`
  console.log('[budgets] DELETE', endpoint)
  const response = await api.delete<{ message: string }>(endpoint)
  return response.data
}

// ----------------------------
// Global Settings - Included Items
// ----------------------------

export interface CreateIncludedItemPayload {
  description: string
  details?: string
}

/**
 * Cria um item incluído global
 */
export async function createIncludedItem(payload: CreateIncludedItemPayload) {
  if (!payload?.description) throw new Error('description é obrigatório')
  const endpoint = `/budgets/global-settings/included-items`
  console.log('[budgets] POST', endpoint)
  const response = await api.post<IncludedItemGlobal>(endpoint, payload)
  return response.data
}

/**
 * Lista itens incluídos
 */
export async function listIncludedItems() {
  const endpoint = `/budgets/global-settings/included-items`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<IncludedItemGlobal[]>(endpoint)
  return response.data
}

/**
 * Obtém um item incluído por ID
 */
export async function getIncludedItemById(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/included-items/${id}`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<IncludedItemGlobal>(endpoint)
  return response.data
}

/**
 * Atualiza um item incluído
 */
export async function updateIncludedItem(id: string, payload: Partial<CreateIncludedItemPayload>) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/included-items/${id}`
  console.log('[budgets] PATCH', endpoint)
  const response = await api.patch<IncludedItemGlobal>(endpoint, payload)
  return response.data
}

/**
 * Deleta um item incluído
 */
export async function deleteIncludedItem(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/included-items/${id}`
  console.log('[budgets] DELETE', endpoint)
  const response = await api.delete<{ message: string }>(endpoint)
  return response.data
}

export interface EquipmentGlobal {
  id: string
  name?: string
  description?: string
  specifications?: string
  photos?: PhotoRef[]
}

// ----------------------------
// Equipments (Global)
// ----------------------------

export interface CreateEquipmentPayload {
  name: string
  description?: string
  specifications?: string
}

export interface EquipmentResponse {
  id: string
  name: string
  description?: string
  specifications?: string
  photos?: PhotoRef[]
  createdAt?: string
  updatedAt?: string
}

// ----------------------------
// Equipment Photos
// ----------------------------

export interface EquipmentPhotoResponse {
  id: string
  equipmentId: string
  caption?: string
  description?: string
  filePath?: string
  fileName?: string
  fileSize?: number
  createdAt?: string
  updatedAt?: string
}

/**
 * Upload de foto para equipamento (multipart/form-data)
 * POST /budgets/global-settings/equipments/{equipmentId}/photos
 */
export async function uploadEquipmentPhoto(equipmentId: string, formData: FormData) {
  if (!equipmentId) throw new Error('equipmentId é obrigatório')
  const endpoint = `/budgets/global-settings/equipments/${equipmentId}/photos`
  console.log('[budgets] POST', endpoint)
  const response = await api.post<EquipmentPhotoResponse>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

/**
 * Obtém foto de equipamento por ID
 * GET /budgets/global-settings/equipment-photos/{id}
 */
export async function getEquipmentPhotoById(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/equipment-photos/${id}`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<EquipmentPhotoResponse>(endpoint)
  console.log('[budgets] GET', response.data)
  return response.data
}

/**
 * Atualiza metadados de foto de equipamento
 * PATCH /budgets/global-settings/equipment-photos/{id}
 */
export async function updateEquipmentPhoto(id: string, payload: { caption?: string; description?: string }) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/equipment-photos/${id}`
  console.log('[budgets] PATCH', endpoint)
  const response = await api.patch<EquipmentPhotoResponse>(endpoint, payload)
  return response.data
}

/**
 * Deleta foto de equipamento
 * DELETE /budgets/global-settings/equipment-photos/{id}
 */
export async function deleteEquipmentPhoto(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/equipment-photos/${id}`
  console.log('[budgets] DELETE', endpoint)
  const response = await api.delete<{ message: string }>(endpoint)
  return response.data
}

/**
 * Cria um equipamento global
 * POST /budgets/global-settings/equipments
 */
export async function createEquipment(payload: CreateEquipmentPayload) {
  if (!payload?.name) throw new Error('name é obrigatório')
  const endpoint = `/budgets/global-settings/equipments`
  console.log('[budgets] POST', endpoint)
  const response = await api.post<EquipmentResponse>(endpoint, payload)
  return response.data
}

/**
 * Lista equipamentos
 * GET /budgets/global-settings/equipments
 */
export async function listEquipments() {
  const endpoint = `/budgets/global-settings/equipments`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<EquipmentResponse[]>(endpoint)
  return response.data
}

/**
 * Obtém equipamento por ID
 * GET /budgets/global-settings/equipments/{id}
 */
export async function getEquipmentById(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/equipments/${id}`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<EquipmentResponse>(endpoint)
  return response.data
}

/**
 * Atualiza equipamento
 * PATCH /budgets/global-settings/equipments/{id}
 */
export async function updateEquipment(id: string, payload: Partial<CreateEquipmentPayload>) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/equipments/${id}`
  console.log('[budgets] PATCH', endpoint)
  const response = await api.patch<EquipmentResponse>(endpoint, payload)
  return response.data
}

/**
 * Deleta equipamento
 * DELETE /budgets/global-settings/equipments/{id}
 */
export async function deleteEquipment(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/equipments/${id}`
  console.log('[budgets] DELETE', endpoint)
  const response = await api.delete<{ message: string }>(endpoint)
  return response.data
}

export interface SystemDescriptionGlobal {
  id: string
  title?: string
  description?: string
  features?: string
  benefits?: string
  photos?: PhotoRef[]
}

// ----------------------------
// System Descriptions (Global)
// ----------------------------

export interface CreateSystemDescriptionPayload {
  title: string
  description: string
  features?: string
  benefits?: string
}

export interface SystemDescriptionResponse {
  id: string
  title: string
  description?: string
  features?: string
  benefits?: string
  photos?: PhotoRef[]
  createdAt?: string
  updatedAt?: string
}

// ----------------------------
// System Photos
// ----------------------------

export interface SystemPhotoResponse {
  id: string
  systemDescriptionId: string
  caption?: string
  description?: string
  filePath?: string
  fileName?: string
  fileSize?: number
  createdAt?: string
  updatedAt?: string
}

export interface CertificateGlobal {
  id: string
  name?: string
  description?: string
  issuer?: string
  validUntil?: string
  filePath?: string
  fileName?: string
}

// ----------------------------
// Certificates (Global)
// ----------------------------

export interface CreateCertificatePayload {
  name: string
  description: string
  issuer?: string
  validUntil?: string
}

export interface CertificateResponse {
  id: string
  name: string
  description?: string
  issuer?: string
  validUntil?: string
  filePath?: string
  fileName?: string
  fileSize?: number
  createdAt?: string
  updatedAt?: string
}

/**
 * Upload de certificado (multipart/form-data)
 * POST /budgets/global-settings/certificates
 * Note: The file field should be named "certificate" in the FormData
 */
export async function uploadCertificate(formData: FormData) {
  const endpoint = `/budgets/global-settings/certificates`
  console.log('[budgets] POST', endpoint)
  // Log FormData contents for debugging
  try {
    for (const pair of Array.from(formData.entries())) {
      const [key, value] = pair as [string, any]
      if (value instanceof File) {
        console.log(`[budgets] FormData field: ${key} => File(name=${value.name}, size=${value.size}, type=${value.type})`)
      } else {
        console.log(`[budgets] FormData field: ${key} => ${value}`)
      }
    }
  } catch (err) {
    console.warn('[budgets] Could not enumerate FormData for logging', err)
  }

  const response = await api.post<CertificateResponse>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

/**
 * Lista certificados
 * GET /budgets/global-settings/certificates
 */
export async function listCertificates() {
  const endpoint = `/budgets/global-settings/certificates`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<CertificateResponse[]>(endpoint)
  return response.data
}

/**
 * Obtém certificado por ID
 * GET /budgets/global-settings/certificates/{id}
 */
export async function getCertificateById(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/certificates/${id}`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<CertificateResponse>(endpoint)
  return response.data
}

/**
 * Atualiza metadados do certificado
 * PATCH /budgets/global-settings/certificates/{id}
 */
export async function updateCertificate(id: string, payload: Partial<CreateCertificatePayload>) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/certificates/${id}`
  console.log('[budgets] PATCH', endpoint)
  const response = await api.patch<CertificateResponse>(endpoint, payload)
  return response.data
}

/**
 * Deleta certificado
 * DELETE /budgets/global-settings/certificates/{id}
 */
export async function deleteCertificate(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/certificates/${id}`
  console.log('[budgets] DELETE', endpoint)
  const response = await api.delete<{ message: string }>(endpoint)
  return response.data
}

/**
 * Upload de foto para uma descrição do sistema (multipart/form-data)
 * POST /budgets/global-settings/system-descriptions/{systemDescriptionId}/photos
 */
export async function uploadSystemPhoto(systemDescriptionId: string, formData: FormData) {
  if (!systemDescriptionId) throw new Error('systemDescriptionId é obrigatório')
  const endpoint = `/budgets/global-settings/system-descriptions/${systemDescriptionId}/photos`
  // Log endpoint and formData contents for debugging
  console.log('[budgets] POST', endpoint)
  try {
    // Iterate FormData entries to log keys and file info
    for (const pair of Array.from(formData.entries())) {
      const [key, value] = pair as [string, any]
      if (value instanceof File) {
        console.log(`[budgets] FormData field: ${key} => File(name=${value.name}, size=${value.size}, type=${value.type})`)
      } else {
        console.log(`[budgets] FormData field: ${key} => ${value}`)
      }
    }
  } catch (err) {
    console.warn('[budgets] Could not enumerate FormData for logging', err)
  }
  const response = await api.post<SystemPhotoResponse>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

/**
 * Obtém foto do sistema por ID
 * GET /budgets/global-settings/system-photos/{id}
 */
export async function getSystemPhotoById(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/system-photos/${id}`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<SystemPhotoResponse>(endpoint)
  return response.data
}

/**
 * Atualiza metadados de foto do sistema
 * PATCH /budgets/global-settings/system-photos/{id}
 */
export async function updateSystemPhoto(id: string, payload: { caption?: string; description?: string }) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/system-photos/${id}`
  console.log('[budgets] PATCH', endpoint)
  const response = await api.patch<SystemPhotoResponse>(endpoint, payload)
  return response.data
}

/**
 * Deleta foto do sistema
 * DELETE /budgets/global-settings/system-photos/{id}
 */
export async function deleteSystemPhoto(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/system-photos/${id}`
  console.log('[budgets] DELETE', endpoint)
  const response = await api.delete<{ message: string }>(endpoint)
  return response.data
}

/**
 * Cria uma descrição de sistema
 * POST /budgets/global-settings/system-descriptions
 */
export async function createSystemDescription(payload: CreateSystemDescriptionPayload) {
  if (!payload?.title) throw new Error('title é obrigatório')
  if (!payload?.description) throw new Error('description é obrigatório')
  const endpoint = `/budgets/global-settings/system-descriptions`
  console.log('[budgets] POST', endpoint)
  const response = await api.post<SystemDescriptionResponse>(endpoint, payload)
  return response.data
}

/**
 * Lista descrições de sistema
 * GET /budgets/global-settings/system-descriptions
 */
export async function listSystemDescriptions() {
  const endpoint = `/budgets/global-settings/system-descriptions`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<SystemDescriptionResponse[]>(endpoint)
  return response.data
}

/**
 * Obtém descrição do sistema por ID
 * GET /budgets/global-settings/system-descriptions/{id}
 */
export async function getSystemDescriptionById(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/system-descriptions/${id}`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<SystemDescriptionResponse>(endpoint)
  return response.data
}

/**
 * Atualiza descrição do sistema
 * PATCH /budgets/global-settings/system-descriptions/{id}
 */
export async function updateSystemDescription(id: string, payload: Partial<CreateSystemDescriptionPayload>) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/system-descriptions/${id}`
  console.log('[budgets] PATCH', endpoint)
  const response = await api.patch<SystemDescriptionResponse>(endpoint, payload)
  return response.data
}

/**
 * Deleta descrição do sistema
 * DELETE /budgets/global-settings/system-descriptions/{id}
 */
export async function deleteSystemDescription(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/system-descriptions/${id}`
  console.log('[budgets] DELETE', endpoint)
  const response = await api.delete<{ message: string }>(endpoint)
  return response.data
}

export interface CertificateGlobal {
  id: string
  name?: string
  description?: string
  issuer?: string
  validUntil?: string
  filePath?: string
  fileName?: string
}

export interface PaymentConditionGlobal {
  id: string
  name?: string
  description?: string
  terms?: string
}

// ----------------------------
// Payment Conditions (Global)
// ----------------------------

export interface CreatePaymentConditionPayload {
  name: string
  description: string
  terms?: string
}

export interface PaymentConditionResponse {
  id: string
  name: string
  description?: string
  terms?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Cria condição de pagamento
 * POST /budgets/global-settings/payment-conditions
 */
export async function createPaymentCondition(payload: CreatePaymentConditionPayload) {
  if (!payload?.name) throw new Error('name é obrigatório')
  const endpoint = `/budgets/global-settings/payment-conditions`
  console.log('[budgets] POST', endpoint)
  const response = await api.post<PaymentConditionResponse>(endpoint, payload)
  return response.data
}

/**
 * Lista condições de pagamento
 * GET /budgets/global-settings/payment-conditions
 */
export async function listPaymentConditions() {
  const endpoint = `/budgets/global-settings/payment-conditions`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<PaymentConditionResponse[]>(endpoint)
  return response.data
}

/**
 * Obtém condição de pagamento por ID
 * GET /budgets/global-settings/payment-conditions/{id}
 */
export async function getPaymentConditionById(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/payment-conditions/${id}`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<PaymentConditionResponse>(endpoint)
  return response.data
}

/**
 * Atualiza condição de pagamento
 * PATCH /budgets/global-settings/payment-conditions/{id}
 */
export async function updatePaymentCondition(id: string, payload: Partial<CreatePaymentConditionPayload>) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/payment-conditions/${id}`
  console.log('[budgets] PATCH', endpoint)
  const response = await api.patch<PaymentConditionResponse>(endpoint, payload)
  return response.data
}

/**
 * Deleta condição de pagamento
 * DELETE /budgets/global-settings/payment-conditions/{id}
 */
export async function deletePaymentCondition(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/payment-conditions/${id}`
  console.log('[budgets] DELETE', endpoint)
  const response = await api.delete<{ message: string }>(endpoint)
  return response.data
}

export interface BankDataGlobal {
  id?: string
  bank1Name?: string
  bank1Agency?: string
  bank1Account?: string
  bank1Beneficiary?: string
  bank2Name?: string
  bank2Agency?: string
  bank2Account?: string
  bank2Beneficiary?: string
  pixKey?: string
  pixType?: string
}

// ----------------------------
// Bank Data (Global)
// ----------------------------

export interface CreateBankDataPayload {
  bank1Name: string
  bank1Agency: string
  bank1Account: string
  bank1Beneficiary: string
  bank2Name?: string
  bank2Agency?: string
  bank2Account?: string
  bank2Beneficiary?: string
  pixKey?: string
  pixType?: string
}

export interface BankDataResponse {
  id: string
  bank1Name: string
  bank1Agency: string
  bank1Account: string
  bank1Beneficiary: string
  bank2Name?: string
  bank2Agency?: string
  bank2Account?: string
  bank2Beneficiary?: string
  pixKey?: string
  pixType?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Cria os dados bancários globais
 * POST /budgets/global-settings/bank-data
 */
export async function createBankData(payload: CreateBankDataPayload) {
  if (!payload?.bank1Name) throw new Error('bank1Name é obrigatório')
  if (!payload?.bank1Agency) throw new Error('bank1Agency é obrigatório')
  if (!payload?.bank1Account) throw new Error('bank1Account é obrigatório')
  if (!payload?.bank1Beneficiary) throw new Error('bank1Beneficiary é obrigatório')

  const endpoint = `/budgets/global-settings/bank-data`
  console.log('[budgets] POST', endpoint)
  const response = await api.post<BankDataResponse>(endpoint, payload)
  return response.data
}

/**
 * Obtém os dados bancários globais
 * GET /budgets/global-settings/bank-data
 */
export async function getBankData() {
  const endpoint = `/budgets/global-settings/bank-data`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<BankDataResponse>(endpoint)
  return response.data
}

/**
 * Atualiza os dados bancários globais
 * PATCH /budgets/global-settings/bank-data/{id}
 */
export async function updateBankData(id: string, payload: Partial<CreateBankDataPayload>) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/bank-data/${id}`
  console.log('[budgets] PATCH', endpoint)
  const response = await api.patch<BankDataResponse>(endpoint, payload)
  return response.data
}

export interface CompanyDataGlobal {
  id?: string
  companyName?: string
  tradeName?: string
  phone1?: string
  phone2?: string
  cnpj?: string
  address?: string
  municipalRegistration?: string
  email2?: string
  stateRegistration?: string
  zipCode?: string
  city?: string
  state?: string
}

// ----------------------------
// Company Data (Global)
// ----------------------------

export interface CreateCompanyDataPayload {
  companyName: string
  tradeName?: string
  phone1?: string
  phone2?: string
  cnpj: string
  address?: string
  municipalRegistration?: string
  email2?: string
  stateRegistration?: string
  zipCode?: string
  city?: string
  state?: string
}

export interface CompanyDataResponse {
  id: string
  companyName: string
  tradeName?: string
  phone1?: string
  phone2?: string
  cnpj: string
  address?: string
  municipalRegistration?: string
  email2?: string
  stateRegistration?: string
  zipCode?: string
  city?: string
  state?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Cria os dados da empresa
 * POST /budgets/global-settings/company-data
 */
export async function createCompanyData(payload: CreateCompanyDataPayload) {
  if (!payload?.companyName) throw new Error('companyName é obrigatório')
  if (!payload?.cnpj) throw new Error('cnpj é obrigatório')

  const endpoint = `/budgets/global-settings/company-data`
  console.log('[budgets] POST', endpoint)
  const response = await api.post<CompanyDataResponse>(endpoint, payload)
  return response.data
}

/**
 * Obtém os dados da empresa
 * GET /budgets/global-settings/company-data
 */
export async function getCompanyData() {
  const endpoint = `/budgets/global-settings/company-data`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<CompanyDataResponse>(endpoint)
  return response.data
}

/**
 * Atualiza os dados da empresa
 * PATCH /budgets/global-settings/company-data/{id}
 */
export async function updateCompanyData(id: string, payload: Partial<CreateCompanyDataPayload>) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/company-data/${id}`
  console.log('[budgets] PATCH', endpoint)
  const response = await api.patch<CompanyDataResponse>(endpoint, payload)
  return response.data
}

export interface EmailGlobal {
  id: string
  email: string
  description?: string
}

export interface WithGlobalDataResponse {
  budget: BudgetResponse
  globalData: {
    email?: EmailGlobal
    includedItems?: IncludedItemGlobal[]
    equipments?: EquipmentGlobal[]
    systemDescriptions?: SystemDescriptionGlobal[]
    certificates?: CertificateGlobal[]
    paymentConditions?: PaymentConditionGlobal[]
    bankData?: BankDataGlobal
    companyData?: CompanyDataGlobal
  }
}

// ----------------------------
// Global Settings - Email
// ----------------------------

export interface CreateGlobalEmailPayload {
  email: string
  description?: string
}

export interface GlobalEmailResponse {
  id: string
  email: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export async function createGlobalEmail(payload: CreateGlobalEmailPayload) {
  if (!payload?.email) throw new Error('email é obrigatório')
  const endpoint = `/budgets/global-settings/email`
  console.log('[budgets] POST', endpoint)
  const response = await api.post<GlobalEmailResponse>(endpoint, payload)
  return response.data
}

export async function getGlobalEmail() {
  const endpoint = `/budgets/global-settings/email`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<GlobalEmailResponse>(endpoint)
  return response.data
}

export async function updateGlobalEmail(id: string, payload: Partial<CreateGlobalEmailPayload>) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/global-settings/email/${id}`
  console.log('[budgets] PATCH', endpoint)
  const response = await api.patch<GlobalEmailResponse>(endpoint, payload)
  return response.data
}

/**
 * Obtém o orçamento com dados globais (GET /budgets/{id}/with-global-data)
 */
export async function getBudgetWithGlobalData(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/${id}/with-global-data`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<WithGlobalDataResponse>(endpoint)
  return response.data
}

// ----------------------------
// Cover Pages (Capas)
// ----------------------------

export type CoverPageType = 'COVER' | 'BACK_COVER'

export interface CoverPageResponse {
  id: string
  name: string
  description?: string
  type: CoverPageType
  filePath?: string
  fileName?: string
  fileSize?: number
  isDefault?: boolean
  isActive?: boolean
  uploadedBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCoverPagePayload {
  name: string
  description?: string
  type: CoverPageType
  isDefault?: boolean
  // file will be sent as multipart/form-data, handled in the caller
}

/**
 * Cria uma nova cover page (multipart/form-data)
 */
export async function createCoverPage(formData: FormData) {
  const endpoint = '/budgets/cover-pages'
  console.log('[budgets] POST', endpoint)
  const response = await api.post<CoverPageResponse>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

/**
 * Lista cover pages com filtros
 */
export async function listCoverPages(params?: { type?: CoverPageType; isDefault?: boolean; isActive?: boolean; search?: string }) {
  const query = new URLSearchParams()
  if (params?.type) query.append('type', params.type)
  if (typeof params?.isDefault === 'boolean') query.append('isDefault', String(params.isDefault))
  if (typeof params?.isActive === 'boolean') query.append('isActive', String(params.isActive))
  if (params?.search) query.append('search', params.search)

  const endpoint = `/budgets/cover-pages${query.toString() ? `?${query.toString()}` : ''}`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<CoverPageResponse[]>(endpoint)
  return response.data
}

/**
 * Obtém uma cover page por ID
 */
export async function getCoverPageById(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/cover-pages/${id}`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<CoverPageResponse>(endpoint)
  return response.data
}

export interface UpdateCoverPagePayload {
  name?: string
  description?: string
  isDefault?: boolean
  isActive?: boolean
}

/**
 * Atualiza uma cover page (PATCH)
 */
export async function updateCoverPage(id: string, payload: UpdateCoverPagePayload) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/cover-pages/${id}`
  console.log('[budgets] PATCH', endpoint)
  const response = await api.patch<CoverPageResponse>(endpoint, payload)
  return response.data
}

/**
 * Deleta uma cover page
 */
export async function deleteCoverPage(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/cover-pages/${id}`
  console.log('[budgets] DELETE', endpoint)
  const response = await api.delete<{ message: string }>(endpoint)
  return response.data
}

/**
 * Faz upload de arquivo para uma cover page existente (multipart/form-data)
 */
export async function uploadCoverFile(id: string, formData: FormData) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/cover-pages/${id}/upload`
  console.log('[budgets] POST', endpoint)
  const response = await api.post<{ message: string; filePath?: string }>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

// ----------------------------
// Client Logo (upload / view / update / delete)
// ----------------------------

export interface ClientLogoResponse {
  message?: string
  logoPath?: string | null
  logoName?: string | null
}

/**
 * Upload inicial do logo do cliente (POST multipart/form-data)
 */
export async function uploadClientLogo(id: string, formData: FormData) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/${id}/upload-client-logo`
  console.log('[budgets] POST', endpoint)
  const response = await api.post<ClientLogoResponse>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

/**
 * Visualiza o logo do cliente (GET)
 */
export async function getClientLogo(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/${id}/client-logo`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<ClientLogoResponse>(endpoint)
  return response.data
}

/**
 * Atualiza/substitui o logo do cliente (PATCH multipart/form-data)
 */
export async function updateClientLogo(id: string, formData: FormData) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/${id}/client-logo`
  console.log('[budgets] PATCH', endpoint)
  const response = await api.patch<ClientLogoResponse>(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

/**
 * Remove o logo do cliente (DELETE)
 */
export async function deleteClientLogo(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/${id}/client-logo`
  console.log('[budgets] DELETE', endpoint)
  const response = await api.delete<{ message: string }>(endpoint)
  return response.data
}

/**
 * Gera o orçamento em PDF (GET /budgets/{id}/pdf)
 * Retorna o PDF como blob para download
 */
export async function generateBudgetPdf(id: string) {
  if (!id) throw new Error('id é obrigatório')
  const endpoint = `/budgets/${id}/pdf`
  console.log('[budgets] GET', endpoint)

  const response = await api.get(endpoint, {
    responseType: 'blob',
    headers: {
      'Accept': 'application/pdf'
    }
  })

  // Extrai o nome do arquivo do header Content-Disposition se disponível
  const contentDisposition = response.headers['content-disposition']
  let filename = `orcamento-${id}.pdf`

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].replace(/['"]/g, '')
    }
  }

  return {
    blob: response.data as Blob,
    filename,
    contentType: response.headers['content-type'] || 'application/pdf'
  }
}

// ----------------------------
// Analytics & Dashboard
// ----------------------------

export interface DashboardAnalyticsResponse {
  pendingProposals: {
    count: number
    totalValue: number
  }
  approvedProposals: {
    count: number
    totalValue: number
  }
  expiredProposals: {
    count: number
    totalValue: number
  }
  conversionRate: number
  averageTicket: number
  totalProposals: number
  recentProposals: BudgetResponse[]
}

export interface AnalyticsParams {
  startDate?: string
  endDate?: string
  clientId?: string
  createdBy?: string
}

export async function getBudgetAnalyticsDashboard(params?: AnalyticsParams) {
  const query = new URLSearchParams()
  if (params?.startDate) query.append('startDate', params.startDate)
  if (params?.endDate) query.append('endDate', params.endDate)
  if (params?.clientId) query.append('clientId', params.clientId)
  if (params?.createdBy) query.append('createdBy', params.createdBy)

  const endpoint = `/budgets/analytics/dashboard${query.toString() ? `?${query.toString()}` : ''}`
  console.log('[budgets] GET', endpoint)
  const response = await api.get<DashboardAnalyticsResponse>(endpoint)
  return response.data
}
