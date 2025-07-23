import api from './client'

// Interfaces para os dados do dashboard
export interface ScheduledLesson {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string | null
  status: string
  instructorName: string
  clientName: string
  className: string
  observations: string | null
}

// Interface para aulas agendadas do instrutor
export interface InstructorScheduledLesson {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string | null
  status: string
  className: string
  clientName: string
  observations: string | null
}

// Interface para dados do dashboard do instrutor
export interface InstructorDashboardData {
  totalStudents: number
  totalClasses: number
  totalScheduledLessons: number
  totalCompletedClasses: number
  scheduledLessons: InstructorScheduledLesson[]
}

export interface RecentActivity {
  id: string
  type: string
  description: string
  createdAt: string
  entityId: string
  entityType: string
}

export interface DashboardData {
  totalStudents: number
  totalClasses: number
  totalScheduledLessons: number
  totalCompletedClasses: number
  totalInstructors: number
  totalClients: number
  totalTrainings: number
  scheduledLessons: ScheduledLesson[]
  recentActivities: RecentActivity[]
}

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get('/superadmin/dashboard')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    throw error
  }
}

// Função para buscar dados do dashboard do instrutor
export const getInstructorDashboard = async (instructorId: string): Promise<InstructorDashboardData> => {
  try {
    const response = await api.get(`/superadmin/instructors/${instructorId}/dashboard`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard do instrutor:', error)
    throw error
  }
}

export const getUsers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/superadmin/users', {
      params: {
        page,
        limit
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    throw error
  }
}

export const getRoles = async () => {
  try {
    const response = await api.get('/superadmin/roles')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar funções:', error)
    throw error
  }
}

export interface CreateUserData {
  // Campos obrigatórios
  name: string
  email: string
  password: string
  roleId: string
  
  // Campos opcionais
  isActive?: boolean
  bio?: string
}

export const createUser = async (userData: CreateUserData) => {
  try {
    const response = await api.post('/superadmin/users', userData)
    return response.data
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    throw error
  }
}

export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`/superadmin/users/${userId}`)
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    throw error
  }
}

export interface UpdateUserData {
  name?: string
  email?: string
  password?: string
  roleId?: string
  isActive?: boolean
  bio?: string
}

export const editUser = async (userId: string, userData: UpdateUserData) => {
  try {
    const response = await api.patch(`/superadmin/users/${userId}`, userData)
    return response.data
  } catch (error) {
    console.error('Erro ao editar usuário:', error)
    throw error
  }
}

export interface CreateRoleData {
  name: string
  description: string
  permissionIds?: string[]
}

export const createRole = async (roleData: CreateRoleData) => {
  try {
    const response = await api.post('/superadmin/roles', roleData)
    return response.data
  } catch (error) {
    console.error('Erro ao criar role:', error)
    throw error
  }
}

export interface UpdateRoleData {
  name?: string
  description?: string
  permissionIds?: string[]
}

export const updateRole = async (roleId: string, roleData: UpdateRoleData) => {
  try {
    const response = await api.patch(`/superadmin/roles/${roleId}`, roleData)
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar role:', error)
    throw error
  }
}

export const deleteRole = async (roleId: string) => {
  try {
    const response = await api.delete(`/superadmin/roles/${roleId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao deletar role:', error)
    throw error
  }
}

export const getPermissions = async () => {
  try {
    const response = await api.get('/superadmin/permissions')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar permissões:', error)
    throw error
  }
}

export interface CreateInstructorData {
  // Dados do usuário
  name: string
  email: string
  password: string
  bio?: string
  skillIds?: string[]
  isActive?: boolean

  // Dados do instrutor
  corporateName?: string
  personType?: 'FISICA' | 'JURIDICA'
  cpf?: string
  cnpj?: string
  municipalRegistration?: string
  stateRegistration?: string
  zipCode?: string
  address?: string
  addressNumber?: string
  neighborhood?: string
  city?: string
  state?: string
  landlineAreaCode?: string
  landlineNumber?: string
  mobileAreaCode?: string
  mobileNumber?: string
  instructorEmail?: string
  education?: string
  registrationNumber?: string
  observations?: string
}



export const getInstructors = async (page: number, limit: number, search?: string) => {
  try {
    const response = await api.get('/superadmin/instructors', {
      params: {
        page,
        limit,
        search
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar instrutores:', error)
    throw error
  }
}

export const getLightInstructors = async () => {
  try {
    const response = await api.get('/superadmin/light-instructors')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar instrutores leves:', error)
    throw error
  }
}

export const getInstructorClasses = async (page: number = 1, limit: number = 10, search?: string) => {
  try {
    const response = await api.get('/superadmin/instructor-classes', {
      params: {
        page,
        limit,
        search
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar classes do instrutor:', error)
    throw error
  }
}

export interface CreateInstructorUserDto {
  userId?: string
  isActive?: boolean
  name: string
  corporateName?: string
  personType?: string // FISICA ou JURIDICA
  cpf?: string
  cnpj?: string
  municipalRegistration?: string
  stateRegistration?: string
  zipCode?: string
  address?: string
  addressNumber?: string
  neighborhood?: string
  city?: string
  state?: string
  landlineAreaCode?: string
  landlineNumber?: string
  mobileAreaCode?: string
  mobileNumber?: string
  email?: string
  education?: string
  registrationNumber?: string
  observations?: string
}

export interface LinkUserToInstructorDto {
  instructorId: string
  name: string
  email: string
  password: string
  bio?: string
  isActive?: boolean
  skillIds?: string[]
}

// Possíveis endpoints baseados na função linkUserToInstructor do backend:
// - POST /superadmin/users/link-to-instructor
// - POST /superadmin/link-user-to-instructor  
// - POST /superadmin/instructors/link-user
// - POST /superadmin/users/link-instructor
// 
// Verifique no seu controller do backend qual rota está configurada

export const linkUserToInstructor = async (linkData: LinkUserToInstructorDto) => {
  try {
    console.log('Sending link request to API with data:', linkData)
    
    // Validação básica dos dados obrigatórios
    if (!linkData.instructorId) {
      throw new Error('instructorId é obrigatório')
    }
    if (!linkData.name) {
      throw new Error('name é obrigatório')
    }
    if (!linkData.email) {
      throw new Error('email é obrigatório')
    }
    if (!linkData.password) {
      throw new Error('password é obrigatório')
    }
    if (linkData.password.length < 6) {
      throw new Error('password deve ter pelo menos 6 caracteres')
    }
    
    const response = await api.post('/superadmin/instructors/link-user', linkData)
    return response.data
  } catch (error: any) {
    console.error('Erro ao conectar usuário ao instrutor:', error)
    if (error.response) {
      console.error('API Error Response:', error.response.data)
      console.error('API Error Status:', error.response.status)
    }
    throw error
  }
}

export const createInstructor = async (instructorData: CreateInstructorUserDto) => {
  try {
    const response = await api.post('/superadmin/instructors', instructorData)
    return response.data
  } catch (error) {
    console.error('Erro ao criar instrutor:', error)
    throw error
  }
}

// Buscar instrutor por ID
export const getInstructorById = async (id: string): Promise<InstructorDetails> => {
  try {
    const response = await api.get(`/superadmin/instructors/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar instrutor por ID:', error)
    throw error
  }
}

// Atualizar instrutor (PATCH)
export const patchInstructor = async (id: string, updateData: Partial<CreateInstructorUserDto>) => {
  try {
    const response = await api.patch(`/superadmin/instructors/${id}`, updateData)
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar instrutor:', error)
    throw error
  }
}

// Deletar instrutor
export const deleteInstructor = async (id: string) => {
  try {
    const response = await api.delete(`/superadmin/instructors/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao deletar instrutor:', error)
    throw error
  }
}

// ============ STUDENTS CRUD ============

export interface CreateStudentData {
  isActive?: boolean
  name: string
  cpf: string
  rg?: string
  gender?: string
  birthDate?: string
  education?: string
  
  // Endereço
  zipCode?: string
  address?: string
  addressNumber?: string
  neighborhood?: string
  city?: string
  state?: string
  
  // Contatos
  landlineAreaCode?: string
  landlineNumber?: string
  mobileAreaCode?: string
  mobileNumber?: string
  email?: string
  
  // Informações adicionais
  observations?: string
  
  // Relacionamento com cliente
  clientId?: string
}

export interface UpdateStudentData extends CreateStudentData {
  id?: string
}

// Criar estudante
export const createStudent = async (studentData: CreateStudentData) => {
  try {
    const response = await api.post('/superadmin/students', studentData)
    return response.data
  } catch (error) {
    console.error('Erro ao criar estudante:', error)
    throw error
  }
}

// Buscar estudantes com paginação
export const getStudents = async (page: number = 1, limit: number = 10, search?: string) => {
  try {
    const response = await api.get('/superadmin/students', {
      params: {
        page,
        limit,
        search
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar estudantes:', error)
    throw error
  }
}

// Buscar estudante por ID
export const getStudentById = async (id: string) => {
  try {
    const response = await api.get(`/superadmin/students/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar estudante por ID:', error)
    throw error
  }
}

// Atualizar estudante (PATCH)
export const patchStudent = async (id: string, updateData: Partial<UpdateStudentData>) => {
  try {
    const response = await api.patch(`/superadmin/students/${id}`, updateData)
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar estudante:', error)
    throw error
  }
}

// Deletar estudante
export const deleteStudent = async (id: string) => {
  try {
    const response = await api.delete(`/superadmin/students/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao deletar estudante:', error)
    throw error
  }
}

// ============ CLIENTS CRUD ============

export interface CreateClientData {
  isActive?: boolean
  name: string
  corporateName?: string
  personType?: 'FISICA' | 'JURIDICA'
  cpf?: string
  cnpj?: string
  municipalRegistration?: string
  stateRegistration?: string
  
  // Endereço
  zipCode?: string
  address?: string
  number?: string
  neighborhood?: string
  city?: string
  state?: string
  
  // Contatos
  landlineAreaCode?: string
  landlineNumber?: string
  mobileAreaCode?: string
  mobileNumber?: string
  email?: string
  
  // Informações adicionais
  observations?: string
  responsibleName?: string
  responsibleEmail?: string
  responsiblePhone?: string
  userId?: string
}

export interface UpdateClientData extends CreateClientData {
  id?: string
}

export interface LinkUserToClientDto {
  clientId: string
  name: string
  email: string
  password: string
  bio?: string
  isActive?: boolean
  skillIds?: string[]
}

// Criar cliente
export const createClient = async (clientData: CreateClientData) => {
  try {
    console.log('Creating client with data:', clientData)
    const response = await api.post('/superadmin/clients', clientData)
    return response.data
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    }
    throw error
  }
}

// Buscar clientes com paginação
export const getClients = async (page: number = 1, limit: number = 10, search?: string) => {
  try {
    console.log('Calling getClients with params:', { page, limit, search })
    
    const response = await api.get('/superadmin/clients', {
      params: {
        page,
        limit,
        search
      }
    })
    
    console.log('getClients response:', response)
    console.log('getClients response.data:', response.data)
    
    return response.data
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    throw error
  }
}

// Buscar cliente por ID
export const getClientById = async (id: string) => {
  try {
    const response = await api.get(`/superadmin/clients/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar cliente por ID:', error)
    throw error
  }
}

// Atualizar cliente (PATCH)
export const patchClient = async (id: string, updateData: Partial<UpdateClientData>) => {
  try {
    console.log('Updating client with ID:', id)
    console.log('Update data:', updateData)
    
    const response = await api.patch(`/superadmin/clients/${id}`, updateData)
    return response.data
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    throw error
  }
}

// Deletar cliente
export const deleteClient = async (id: string) => {
  try {
    const response = await api.delete(`/superadmin/clients/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao deletar cliente:', error)
    throw error
  }
}

// Vincular usuário ao cliente
export const linkUserToClient = async (id: string, linkData: Omit<LinkUserToClientDto, 'clientId'>) => {
  try {
    console.log('Sending link request to API with data:', { ...linkData, clientId: id })
    
    // Validação básica dos dados obrigatórios
    if (!id) {
      throw new Error('clientId é obrigatório')
    }
    if (!linkData.name) {
      throw new Error('name é obrigatório')
    }
    if (!linkData.email) {
      throw new Error('email é obrigatório')
    }
    if (!linkData.password) {
      throw new Error('password é obrigatório')
    }
    if (linkData.password.length < 6) {
      throw new Error('password deve ter pelo menos 6 caracteres')
    }
    
    const response = await api.post(`/superadmin/clients/${id}/link-user`, linkData)
    return response.data
  } catch (error: any) {
    console.error('Erro ao conectar usuário ao cliente:', error)
    if (error.response) {
      console.error('API Error Response:', error.response.data)
      console.error('API Error Status:', error.response.status)
    }
    throw error
  }
}

// ============ TRAININGS CRUD ============

export interface CreateTrainingData {
  title: string                    // Título do treinamento (obrigatório, único)
  description?: string             // Descrição detalhada (opcional)
  durationHours: number           // Duração em horas (obrigatório)
  programContent?: string         // Conteúdo programático (opcional)
  isActive?: boolean              // Status ativo/inativo (padrão: true)
  validityDays?: number           // Validade do certificado em dias (opcional)
}

export interface UpdateTrainingData {
  id?: string
  title?: string                   // Título do treinamento (deve ser único)
  description?: string             // Descrição detalhada
  durationHours?: number          // Duração em horas (deve ser > 0)
  programContent?: string         // Conteúdo programático
  isActive?: boolean              // Status ativo/inativo
  validityDays?: number           // Validade do certificado em dias
}

export interface Training {
  id: string
  title: string                    // Título do treinamento (obrigatório, único)
  description?: string             // Descrição detalhada (opcional)
  durationHours: number           // Duração em horas (obrigatório)
  programContent?: string         // Conteúdo programático (opcional)
  isActive: boolean               // Status ativo/inativo (padrão: true)
  validityDays?: number           // Validade do certificado em dias (opcional)
  createdAt: string               // Data de criação
  updatedAt: string               // Data de atualização
  
  // Relacionamentos (quando incluídos na resposta)
  classes?: any[]                 // Turmas que usam este treinamento
  certificates?: any[]            // Certificados emitidos
  instructors?: any[]             // Instrutores habilitados
}

export interface TrainingsListResponse {
  trainings: Training[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============ INSTRUCTOR DOCUMENTS MANAGEMENT ============
export interface LinkInstructorDocumentDto {
  path: string;
  type: string;
  description?: string;
}

export interface InstructorDocument {
  id: string;
  instructorId: string;
  path: string;
  type: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface completa para instrutor com detalhes
export interface InstructorDetails {
  id: string
  userId: string | null
  isActive: boolean
  name: string
  corporateName: string | null
  personType: "FISICA" | "JURIDICA"
  cpf: string | null
  cnpj: string | null
  municipalRegistration: string | null
  stateRegistration: string | null
  zipCode: string | null
  address: string | null
  addressNumber: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  landlineAreaCode: string | null
  landlineNumber: string | null
  mobileAreaCode: string | null
  mobileNumber: string | null
  email: string | null
  education: string | null
  registrationNumber: string | null
  observations: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  } | null
  classes: {
    id: string
    startDate: string
    endDate: string
    status: string
    type: string
    location: string | null
    training: {
      id: string
      title: string
      description: string
      durationHours: number
    }
  }[]
  documents: InstructorDocument[]
}

// Lista todos os documentos vinculados ao instrutor
export const getInstructorDocuments = async (instructorId: string): Promise<InstructorDocument[]> => {
  try {
    if (!instructorId || instructorId.trim() === '') {
      throw new Error('ID do instrutor é obrigatório');
    }
    const response = await api.get(`/superadmin/instructors/${instructorId}/documents`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao listar documentos do instrutor:', error);
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error('API Error Status:', error.response.status);
    }
    throw error;
  }
};

// Remove um documento específico do instrutor usando o ID do documento
export const deleteInstructorDocument = async (documentId: string): Promise<any> => {
  try {
    if (!documentId || documentId.trim() === '') {
      throw new Error('ID do documento é obrigatório');
    }
    
    console.log('Deletando documento com ID:', documentId);
    
    const response = await api.delete(`/upload/document/${documentId}`);
    
    return response.data;
  } catch (error: any) {
    console.error('Erro ao remover documento do instrutor:', error);
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error('API Error Status:', error.response.status);
    }
    throw error;
  }
};


// Vincula um documento previamente enviado ao instrutor
export const linkDocumentToInstructor = async (
  instructorId: string,
  documentData: LinkInstructorDocumentDto
) => {
  try {
    // Validação básica
    if (!instructorId || instructorId.trim() === '') {
      throw new Error('ID do instrutor é obrigatório');
    }
    if (!documentData.path || !documentData.type) {
      throw new Error('path e type são obrigatórios');
    }

    const response = await api.post(
      `/superadmin/instructors/${instructorId}/documents`,
      documentData
    );
    return response.data;
  } catch (error: any) {
    console.error('Erro ao vincular documento ao instrutor:', error);
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error('API Error Status:', error.response.status);
    }
    throw error;
  }
}

// Criar treinamento
export const createTraining = async (trainingData: CreateTrainingData) => {
  try {
    console.log('Creating training with data:', trainingData)
    const response = await api.post('/superadmin/trainings', trainingData)
    return response.data
  } catch (error: any) {
    console.error('Erro ao criar treinamento:', error)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    }
    throw error
  }
}

// Buscar treinamentos com paginação
export const getTrainings = async (page: number = 1, limit: number = 10, search?: string) => {
  try {
    console.log('Calling getTrainings with params:', { page, limit, search })
    
    const response = await api.get('/superadmin/trainings', {
      params: {
        page,
        limit,
        search
      }
    })
    
    console.log('getTrainings response:', response)
    console.log('getTrainings response.data:', response.data)
    
    return response.data
  } catch (error) {
    console.error('Erro ao buscar treinamentos:', error)
    throw error
  }
}

// Buscar treinamento por ID
export const getTrainingById = async (id: string) => {
  try {
    const response = await api.get(`/superadmin/trainings/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar treinamento por ID:', error)
    throw error
  }
}

// Atualizar treinamento (PATCH)
export const patchTraining = async (id: string, updateData: Partial<UpdateTrainingData>) => {
  try {
    console.log('Updating training with ID:', id)
    console.log('Update data:', updateData)
    
    const response = await api.patch(`/superadmin/trainings/${id}`, updateData)
    return response.data
  } catch (error: any) {
    console.error('Erro ao atualizar treinamento:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    throw error
  }
}

// Deletar treinamento
export const deleteTraining = async (id: string) => {
  try {
    const response = await api.delete(`/superadmin/trainings/${id}`)
    return response.data
  } catch (error: any) {
    console.error('Erro ao deletar treinamento:', error)
    if (error.response) {
      console.error('API Error Response:', error.response.data)
      console.error('API Error Status:', error.response.status)
    }
    throw error
  }
}

// ============ CLASSES CRUD ============

export interface CreateClassData {
  trainingId: string
  instructorId: string
  startDate: Date | string
  endDate: Date | string
  type?: string
  recycling?: string
  status?: string
  location?: string
  clientId?: string
  observations?: string
}

export interface UpdateClassData {
  id?: string
  trainingId?: string
  instructorId?: string
  startDate?: Date | string
  endDate?: Date | string
  type?: string
  recycling?: string
  status?: string
  location?: string
  clientId?: string
  observations?: string
}

// Criar classe
export const createClass = async (classData: CreateClassData) => {
  try {
    console.log('Creating class with data:', classData)
    const response = await api.post('/superadmin/classes', classData)
    return response.data
  } catch (error: any) {
    console.error('Erro ao criar classe:', error)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    }
    throw error
  }
}

// Buscar classes com paginação
export const getClasses = async (page: number = 1, limit: number = 10, search?: string) => {
  try {
    console.log('Calling getClasses with params:', { page, limit, search })
    
    const response = await api.get('/superadmin/classes', {
      params: {
        page,
        limit,
        search
      }
    })
    
    console.log('getClasses response:', response)
    console.log('getClasses response.data:', response.data)
    
    return response.data
  } catch (error) {
    console.error('Erro ao buscar classes:', error)
    throw error
  }
}

// Buscar classe por ID
export const getClassById = async (id: string) => {
  try {
    const response = await api.get(`/superadmin/classes/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar classe por ID:', error)
    throw error
  }
}

// Atualizar classe (PATCH)
// Atualizar classe (PATCH)
export const patchClass = async (id: string, updateData: Partial<UpdateClassData>) => {
  try {
    // Validar se o ID é válido
    if (!id || id.trim() === '') {
      throw new Error('ID da classe é obrigatório')
    }
    
    // Validar se há dados para atualizar
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error('Dados de atualização são obrigatórios')
    }
    
    // Fazer a requisição PATCH
    const response = await api.patch(`/superadmin/classes/${id}`, updateData)
    
    return response.data
  } catch (error: any) {
    console.error('Erro ao atualizar classe:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    throw error
  }
}

// Deletar classe
export const deleteClass = async (id: string) => {
  try {
    const response = await api.delete(`/superadmin/classes/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao deletar classe:', error)
    throw error
  }
}

// ============ CLASS STUDENTS MANAGEMENT ============

export interface AddStudentsToClassData {
  studentIds: string[]
}

export interface RemoveStudentsFromClassData {
  studentIds: string[]
}

// Adicionar alunos a uma turma
export const addStudentsToClass = async (classId: string, studentIds: string[]) => {
  try {
    console.log('Adding students to class with ID:', classId)
    console.log('Student IDs:', studentIds)
    
    // Validação básica
    if (!classId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      throw new Error('ID da turma e lista de IDs de estudantes são obrigatórios')
    }
    
    const requestData = {
      studentIds
    }
    
    console.log('Request data:', requestData)
    console.log('Request URL:', `/superadmin/classes/${classId}/students`)
    
    const response = await api.post(`/superadmin/classes/${classId}/students`, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Response data:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Erro ao adicionar alunos à turma:', error)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    }
    throw error
  }
}

// Remover alunos de uma turma
export const removeStudentsFromClass = async (classId: string, studentIds: string[]) => {
  try {
    console.log('Removing students from class with ID:', classId)
    console.log('Student IDs:', studentIds)
    
    // Validação básica
    if (!classId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      throw new Error('ID da turma e lista de IDs de estudantes são obrigatórios')
    }
    
    // Dados que serão enviados no corpo da requisição
    const requestData = {
      studentIds
    }
    
    console.log('Request data:', requestData)
    console.log('Request URL:', `/superadmin/classes/${classId}/students`)
    
    // Usar o método DELETE conforme implementado no backend
    const response = await api.delete(`/superadmin/classes/${classId}/students`, {
      data: requestData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Response data:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Erro ao remover alunos da turma:', error)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    }
    throw error
  }
}

// ============ LESSONS CRUD ============

export interface CreateLessonData {
  title: string
  description?: string
  startDate: Date | string
  endDate: Date | string
  status?: string
  location?: string
  observations?: string
  instructorId: string
  clientId?: string
  classId?: string
}

export interface UpdateLessonData {
  id?: string
  title?: string
  description?: string
  startDate?: Date | string
  endDate?: Date | string
  status?: string
  location?: string
  observations?: string
  instructorId?: string
  clientId?: string
  classId?: string
}

// Criar aula
export const createLesson = async (lessonData: CreateLessonData) => {
  try {
    console.log('Creating lesson with data:', lessonData)
    const response = await api.post('/superadmin/lessons', lessonData)
    return response.data
  } catch (error: any) {
    console.error('Erro ao criar aula:', error)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    }
    throw error
  }
}

// Buscar aulas com paginação
export const getLessons = async (page: number = 1, limit: number = 10, search?: string) => {
  try {
    console.log('Calling getLessons with params:', { page, limit, search })
    
    const response = await api.get('/superadmin/lessons', {
      params: {
        page,
        limit,
        search
      }
    })
    
    console.log('getLessons response:', response)
    console.log('getLessons response.data:', response.data)
    
    return response.data
  } catch (error) {
    console.error('Erro ao buscar aulas:', error)
    throw error
  }
}

// Buscar aula por ID
export const getLessonById = async (id: string) => {
  try {
    const response = await api.get(`/superadmin/lessons/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar aula por ID:', error)
    throw error
  }
}

// Atualizar aula (PATCH)
export const patchLesson = async (id: string, updateData: Partial<UpdateLessonData>) => {
  try {
    // Validar se o ID é válido
    if (!id || id.trim() === '') {
      throw new Error('ID da aula é obrigatório')
    }
    
    // Validar se há dados para atualizar
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error('Dados de atualização são obrigatórios')
    }
    
    const response = await api.patch(`/superadmin/lessons/${id}`, updateData)
    return response.data
  } catch (error: any) {
    console.error('Erro ao atualizar aula:', error)
    throw error
  }
}

// Deletar aula
export const deleteLesson = async (id: string) => {
  try {
    const response = await api.delete(`/superadmin/lessons/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao deletar aula:', error)
    throw error
  }
}

// ============ LESSON ATTENDANCES CRUD ============

export interface CreateLessonAttendanceData {
  lessonId: string
  studentId: string
  status?: string
  observations?: string
}

export interface UpdateLessonAttendanceData {
  id?: string
  lessonId?: string
  studentId?: string
  status?: string
  observations?: string
}

// Criar presença de aula
export const createLessonAttendance = async (attendanceData: CreateLessonAttendanceData) => {
  try {
    console.log('Creating lesson attendance with data:', attendanceData)
    const response = await api.post('/superadmin/lesson-attendances', attendanceData)
    return response.data
  } catch (error: any) {
    console.error('Erro ao criar presença de aula:', error)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    }
    throw error
  }
}

// Buscar presenças de aula com paginação
export const getLessonAttendances = async (page: number = 1, limit: number = 10, search?: string) => {
  try {
    console.log('Calling getLessonAttendances with params:', { page, limit, search })
    
    const response = await api.get('/superadmin/lesson-attendances', {
      params: {
        page,
        limit,
        search
      }
    })
    
    console.log('getLessonAttendances response:', response)
    console.log('getLessonAttendances response.data:', response.data)
    
    return response.data
  } catch (error) {
    console.error('Erro ao buscar presenças de aula:', error)
    throw error
  }
}

// Buscar presença de aula por ID
export const getLessonAttendanceById = async (id: string) => {
  try {
    const response = await api.get(`/superadmin/lesson-attendances/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar presença de aula por ID:', error)
    throw error
  }
}

// Atualizar presença de aula (PATCH)
export const patchLessonAttendance = async (id: string, updateData: Partial<UpdateLessonAttendanceData>) => {
  try {
    console.log('Updating lesson attendance with ID:', id)
    console.log('Update data:', updateData)
    
    const response = await api.patch(`/superadmin/lesson-attendances/${id}`, updateData)
    return response.data
  } catch (error: any) {
    console.error('Erro ao atualizar presença de aula:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    throw error
  }
}

// Deletar presença de aula
export const deleteLessonAttendance = async (id: string) => {
  try {
    const response = await api.delete(`/superadmin/lesson-attendances/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao deletar presença de aula:', error)
    throw error
  }
}

// Buscar presenças de aula por turma
export const getLessonAttendanceByClass = async (classId: string) => {
  try {
    console.log('Calling getLessonAttendanceByClass with classId:', classId)
    
    const response = await api.get(`/superadmin/class/${classId}/lesson-attendance`)
    
    console.log('getLessonAttendanceByClass response:', response)
    console.log('getLessonAttendanceByClass response.data:', response.data)
    
    return response.data
  } catch (error) {
    console.error('Erro ao buscar presenças de aula por turma:', error)
    throw error
  }
}

export const getEmpresaStudents = async (empresaId: string, page: number = 1, limit: number = 10, search?: string) => {
  try {
    const response = await api.get(`/superadmin/empresas/${empresaId}/students`, {
      params: {
        page,
        limit,
        search
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar estudantes da empresa:', error)
    throw error
  }
}

// Marcar todos os alunos de uma turma como ausentes em uma aula
export const markAllStudentsAbsent = async (classId: string, lessonId: string) => {
  try {
    console.log('Marking all students as absent for lesson:', lessonId, 'in class:', classId)
    
    const response = await api.post(`/superadmin/classes/${classId}/lessons/${lessonId}/mark-all-absent`)
    
    console.log('markAllStudentsAbsent response:', response)
    console.log('markAllStudentsAbsent response.data:', response.data)
    
    return response.data
  } catch (error) {
    console.error('Erro ao marcar todos os alunos como ausentes:', error)
    throw error
  }
}

// Função para buscar turmas do cliente (para usuários do tipo CLIENTE)
export const getClientClasses = async () => {
    try {
        const response = await api.get('/superadmin/my-classes');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar turmas do cliente:', error);
        throw error;
    }
};

// Função para buscar o clientId de um usuário
export const getUserClientId = async (userId: string) => {
    try {
        console.log('Fetching clientId for user:', userId);
        
        const response = await api.get(`/superadmin/users/${userId}/client-id`);
        
        console.log('getUserClientId response:', response);
        console.log('getUserClientId response.data:', response.data);
        
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar clientId do usuário:', error);
        throw error;
    }
};

// Função para buscar o instructorId de um usuário
export const getUserInstructorId = async (userId: string) => {
    try {
        console.log('Fetching instructorId for user:', userId);
        
        const response = await api.get(`/superadmin/users/${userId}/instructor-id`);
        
        console.log('getUserInstructorId response:', response);
        console.log('getUserInstructorId response.data:', response.data);
        
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar instructorId do usuário:', error);
        throw error;
    }
};

// ============ SIGNATURES MANAGEMENT ============

export interface SignatureData {
  id: string
  instructorId: string
  pngPath: string
  createdAt: string
  updatedAt: string
  instructor: {
    id: string
    name: string
    email: string | null
  }
}

export interface UploadSignatureData {
  instructorId: string
  signature: File
}

export interface SignaturesResponse {
  signatures: SignatureData[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Interface para resposta do upload de imagem
export interface UploadImageResponse {
  filename: string
  originalname: string
  path: string
  mimetype: string
  size: number
  url: string
}

// Interface para resposta do upload de documento do instrutor
export interface UploadInstructorDocumentResponse {
  id: string
  instructorId: string
  filename: string
  originalname: string
  path: string
  mimetype: string
  size: number
  category?: string
  type?: string
  description?: string
  createdAt: string
  updatedAt: string
}

// Upload de imagem genérica
export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error)
    throw error
  }
}

// Upload de documento para instrutor
export const uploadInstructorDocument = async (
  file: File,
  instructorId: string,
  category?: string,
  type?: string,
  description?: string
): Promise<UploadInstructorDocumentResponse> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('instructorId', instructorId)
    
    if (category) formData.append('category', category)
    if (type) formData.append('type', type)
    if (description) formData.append('description', description)

    const response = await api.post('/upload/instructor-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Erro ao fazer upload do documento do instrutor:', error)
    throw error
  }
}

// Download de documento do instrutor
export const downloadInstructorDocument = async (documentPath: string, fileName?: string) => {
  try {
    // Validação do parâmetro documentPath
    if (!documentPath || documentPath.trim() === '') {
      throw new Error('Path do documento é obrigatório')
    }
    
    console.log('Iniciando download do documento:')
    console.log('- documentPath:', documentPath)
    console.log('- fileName:', fileName)
    
    // Construir a URL do arquivo baseada no path do documento
    const baseUrl = 'http://localhost:4000'
    const fileUrl = `${baseUrl}${documentPath}`
    console.log('- fileUrl:', fileUrl)
    
    // Obter o token de autenticação se disponível
    const token = localStorage.getItem('token')
    
    // Fazer o download do arquivo com autenticação se necessário
    const headers: HeadersInit = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    const response = await fetch(fileUrl, {
      method: 'GET',
      headers
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Arquivo não encontrado no servidor')
        
      } else if (response.status === 403) {
        throw new Error('Sem permissão para acessar este arquivo')
      } else {
        throw new Error(`Erro ao baixar arquivo: ${response.status} ${response.statusText}`)
      }
    }
    
    const blob = await response.blob()
    
    // Criar um link temporário para download
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Usar o nome do arquivo fornecido ou extrair do path
    const downloadFileName = fileName || documentPath.split('/').pop() || 'documento'
    link.download = downloadFileName
    
    console.log('- downloadFileName:', downloadFileName)
    
    // Adicionar ao DOM temporariamente para permitir o clique
    link.style.display = 'none'
    document.body.appendChild(link)
    
    // Simular clique para iniciar o download
    link.click()
    
    // Limpar recursos após um pequeno delay
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
    
    console.log('Download concluído com sucesso')
    return true
  } catch (error) {
    console.error('Erro ao fazer download do documento:', error)
    throw error
  }
}

// Upload de assinatura para instrutor (nova versão)
export const uploadSignature = async (instructorId: string, file: File) => {
  try {
    // Primeiro faz upload da imagem
    const uploadResponse = await uploadImage(file)
    
    // Depois envia o path da imagem para o endpoint de assinaturas
    const response = await api.post('/superadmin/signatures', {
      instructorId,
      imagePath: uploadResponse.path
    })
    
    return response.data
  } catch (error) {
    console.error('Erro ao fazer upload da assinatura:', error)
    throw error
  }
}

// Buscar assinatura por ID do instrutor
export const getSignatureByInstructorId = async (instructorId: string) => {
  try {
    const response = await api.get(`/superadmin/signatures/instructor/${instructorId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar assinatura do instrutor:', error)
    throw error
  }
}

// Listar todas as assinaturas
export const getAllSignatures = async (page: number = 1, limit: number = 10, search?: string) => {
  try {
    const response = await api.get('/superadmin/signatures', {
      params: {
        page,
        limit,
        search
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error)
    throw error
  }
}

// Deletar assinatura
export const deleteSignature = async (instructorId: string) => {
  try {
    const response = await api.delete(`/superadmin/signatures/instructor/${instructorId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao deletar assinatura:', error)
    throw error
  }
}

// ============ CERTIFICATES MANAGEMENT ============

export interface CertificateData {
  id?: string
  studentId: string
  studentName: string
  trainingId: string
  trainingName: string
  instructorId: string
  instructorName: string
  issueDate: string
  validationCode: string
  workload: string
  company?: string
  location?: string
  startDate?: string
  endDate?: string
  classId?: string
}

export interface CreateCertificateData {
  studentId: string
  trainingId: string
  instructorId: string
  classId?: string
  validationCode?: string
  issueDate?: string
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

// Buscar certificados
export const getCertificates = async (page: number = 1, limit: number = 10, search?: string) => {
  try {
    const response = await api.get('/superadmin/certificates', {
      params: {
        page,
        limit,
        search
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar certificados:', error)
    throw error
  }
}

// Criar certificado
export const createCertificate = async (certificateData: CreateCertificateData) => {
  try {
    const response = await api.post('/superadmin/certificates', certificateData)
    return response.data
  } catch (error) {
    console.error('Erro ao criar certificado:', error)
    throw error
  }
}

// Buscar certificado por ID
export const getCertificateById = async (id: string) => {
  try {
    const response = await api.get(`/superadmin/certificates/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar certificado por ID:', error)
    throw error
  }
}

// Atualizar certificado
export const updateCertificate = async (id: string, updateData: Partial<CertificateData>) => {
  try {
    const response = await api.patch(`/superadmin/certificates/${id}`, updateData)
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar certificado:', error)
    throw error
  }
}

// Deletar certificado
export const deleteCertificate = async (id: string) => {
  try {
    const response = await api.delete(`/superadmin/certificates/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao deletar certificado:', error)
    throw error
  }
}

// Gerar certificado em lote para uma turma
export const generateBatchCertificates = async (classId: string) => {
  try {
    const response = await api.post(`/superadmin/classes/${classId}/certificates/batch`)
    return response.data
  } catch (error) {
    console.error('Erro ao gerar certificados em lote:', error)
    throw error
  }
}

// Buscar certificados por turma
export const getCertificatesByClass = async (classId: string) => {
  try {
    const response = await api.get(`/superadmin/classes/${classId}/certificates`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar certificados da turma:', error)
    throw error
  }
}

// Buscar certificados por estudante
export const getCertificatesByStudent = async (studentId: string) => {
  try {
    const response = await api.get(`/superadmin/students/${studentId}/certificates`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar certificados do estudante:', error)
    throw error
  }
}

// ============ FINISHED CLASSES MANAGEMENT ============

export interface FinishedClassData {
  id: string
  status: 'CONCLUIDO'
  startDate: string
  endDate: string
  location?: string
  observations?: string
  training: {
    id: string
    title: string
    description?: string
    durationHours: number
    validityDays?: number
  }
  instructor: {
    id: string
    name: string
    email?: string
    corporateName?: string
  }
  client: {
    id: string
    name: string
    email?: string
    cpf?: string
    cnpj?: string
  }
  students: {
    id: string
    name: string
    email?: string
    cpf?: string
    birthDate?: string
    mobileAreaCode?: string
    mobileNumber?: string
    landlineAreaCode?: string
    landlineNumber?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    createdAt: string
  }[]
  lessons: {
    id: string
    title: string
    startDate: string
    endDate: string
    status?: string
  }[]
}

export interface FinishedClassesResponse {
  classes: FinishedClassData[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Buscar todas as classes finalizadas
export const getFinishedClasses = async (page: number = 1, limit: number = 10, search?: string) => {
  try {
    console.log('Calling getFinishedClasses with params:', { page, limit, search })
    
    const response = await api.get('/superadmin/classes/finished', {
      params: {
        page,
        limit,
        search
      }
    })
    
    console.log('getFinishedClasses response:', response)
    console.log('getFinishedClasses response.data:', response.data)
    
    return response.data
  } catch (error) {
    console.error('Erro ao buscar classes finalizadas:', error)
    throw error
  }
}

// Buscar classes finalizadas por ID do cliente
export const getFinishedClassesByClient = async (clientId: string, page: number = 1, limit: number = 10, search?: string) => {
  try {
    console.log('Calling getFinishedClassesByClient with params:', { clientId, page, limit, search })
    
    // Validação básica
    if (!clientId || clientId.trim() === '') {
      throw new Error('ID do cliente é obrigatório')
    }
    
    const response = await api.get(`/superadmin/classes/finished/client/${clientId}`, {
      params: {
        page,
        limit,
        search
      }
    })
    
    console.log('getFinishedClassesByClient response:', response)
    console.log('getFinishedClassesByClient response.data:', response.data)
    
    return response.data
  } catch (error) {
    console.error('Erro ao buscar classes finalizadas do cliente:', error)
    throw error
  }
}

// Buscar classes finalizadas por ID do instrutor
export const getFinishedClassesByInstructor = async (instructorId: string, page: number = 1, limit: number = 10, search?: string) => {
  try {
    console.log('Calling getFinishedClassesByInstructor with params:', { instructorId, page, limit, search })
    
    // Validação básica
    if (!instructorId || instructorId.trim() === '') {
      throw new Error('ID do instrutor é obrigatório')
    }
    
    const response = await api.get(`/superadmin/classes/finished/instructor/${instructorId}`, {
      params: {
        page,
        limit,
        search
      }
    })
    
    console.log('getFinishedClassesByInstructor response:', response)
    console.log('getFinishedClassesByInstructor response.data:', response.data)
    
    return response.data
  } catch (error) {
    console.error('Erro ao buscar classes finalizadas do instrutor:', error)
    throw error
  }
}

// ===== INTERFACES PARA IMPORTAÇÃO/EXPORTAÇÃO EXCEL =====

// Interface para filtros de exportação de instrutores
export interface InstructorExportFilters {
  search?: string
  city?: string
  state?: string
  isActive?: boolean
  startDate?: string
  endDate?: string
  personType?: 'FISICA' | 'JURIDICA'
}

// Interface para filtros de exportação de estudantes
export interface StudentExportFilters {
  search?: string
  city?: string
  state?: string
  isActive?: boolean
  startDate?: string
  endDate?: string
  gender?: string
  clientId?: string
}

// Interface para resposta de exportação
export interface ExportResponse {
  filePath: string
  fileName: string
  downloadUrl: string
  totalRecords: number
  generatedAt: string
}

// Interface para erro de importação
export interface ImportError {
  row: number
  field: string
  message: string
}

// Interface para resposta de importação
export interface ImportResponse {
  success: boolean
  totalRecords: number
  validRecords: number
  invalidRecords: number
  importedRecords?: number
  errors: ImportError[]
}

// ===== FUNÇÕES DE EXPORTAÇÃO =====

/**
 * Exporta instrutores para arquivo Excel
 * @param filters - Filtros para a exportação
 * @returns Dados do arquivo gerado
 */
export const exportInstructorsToExcel = async (filters: InstructorExportFilters = {}): Promise<ExportResponse> => {
  try {
    console.log('Exportando instrutores para Excel com filtros:', filters)
    
    const response = await api.post('/excel/export/instructors', filters, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Resposta da exportação:', response.data)
    return response.data
  } catch (error) {
    console.error('Erro ao exportar instrutores:', error)
    throw error
  }
}

/**
 * Faz download do arquivo Excel gerado
 * @param fileName - Nome do arquivo para download
 * @returns Blob do arquivo
 */
export const downloadExcelFile = async (fileName: string): Promise<Blob> => {
  try {
    console.log('Fazendo download do arquivo:', fileName)
    
    const response = await api.get(`/excel/download/${fileName}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Erro ao fazer download do arquivo:', error)
    throw error
  }
}

/**
 * Baixa o template Excel para importação de instrutores
 * @returns Blob do arquivo template
 */
export const downloadInstructorsTemplate = async (): Promise<Blob> => {
  try {
    console.log('Baixando template de instrutores')
    
    const response = await api.get('/excel/template/instructors', {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Erro ao baixar template:', error)
    throw error
  }
}

/**
 * Deleta um arquivo Excel gerado
 * @param fileName - Nome do arquivo para deletar
 */
export const deleteExcelFile = async (fileName: string): Promise<void> => {
  try {
    console.log('Deletando arquivo:', fileName)
    
    await api.delete(`/excel/file/${fileName}`)
    
    console.log('Arquivo deletado com sucesso')
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error)
    throw error
  }
}

// ===== FUNÇÕES DE IMPORTAÇÃO =====

/**
 * Importa instrutores de um arquivo Excel
 * @param file - Arquivo Excel para importação
 * @param validateOnly - Se true, apenas valida sem salvar
 * @returns Resultado da importação
 */
export const importInstructorsFromExcel = async (
  file: File, 
  validateOnly: boolean = false
): Promise<ImportResponse> => {
  try {
    console.log('Importando instrutores do Excel:', file.name, 'Validação apenas:', validateOnly)
    
    const formData = new FormData()
    formData.append('file', file)
    
    if (validateOnly) {
      formData.append('validateOnly', 'true')
    }
    
    const response = await api.post('/excel/import/instructors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    console.log('Resposta da importação:', response.data)
    return response.data
  } catch (error) {
    console.error('Erro ao importar instrutores:', error)
    throw error
  }
}

/**
 * Valida um arquivo Excel de instrutores sem importar
 * @param file - Arquivo Excel para validação
 * @returns Resultado da validação
 */
export const validateInstructorsExcel = async (file: File): Promise<ImportResponse> => {
  return importInstructorsFromExcel(file, true)
}

// ===== FUNÇÕES DE EXPORTAÇÃO E IMPORTAÇÃO DE ESTUDANTES =====

/**
 * Exporta estudantes para arquivo Excel
 * @param filters - Filtros para a exportação
 * @returns Dados do arquivo gerado
 */
export const exportStudentsToExcel = async (filters: StudentExportFilters = {}): Promise<ExportResponse> => {
  try {
    console.log('Exportando estudantes para Excel com filtros:', filters)
    
    const response = await api.post('/excel/export/students', filters, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Resposta da exportação de estudantes:', response.data)
    return response.data
  } catch (error) {
    console.error('Erro ao exportar estudantes:', error)
    throw error
  }
}

/**
 * Baixa o template Excel para importação de estudantes
 * @returns Blob do arquivo template
 */
export const downloadStudentsTemplate = async (): Promise<Blob> => {
  try {
    console.log('Baixando template de estudantes')
    
    const response = await api.get('/excel/template/students', {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Erro ao baixar template de estudantes:', error)
    throw error
  }
}

/**
 * Importa estudantes de um arquivo Excel
 * @param file - Arquivo Excel para importação
 * @param validateOnly - Se true, apenas valida sem salvar
 * @returns Resultado da importação
 */
export const importStudentsFromExcel = async (
  file: File, 
  validateOnly: boolean = false
): Promise<ImportResponse> => {
  try {
    console.log('Importando estudantes do Excel:', file.name, 'Validação apenas:', validateOnly)
    
    const formData = new FormData()
    formData.append('file', file)
    
    if (validateOnly) {
      formData.append('validateOnly', 'true')
    }
    
    const response = await api.post('/excel/import/students', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    console.log('Resposta da importação de estudantes:', response.data)
    return response.data
  } catch (error) {
    console.error('Erro ao importar estudantes:', error)
    throw error
  }
}

/**
 * Valida um arquivo Excel de estudantes sem importar
 * @param file - Arquivo Excel para validação
 * @returns Resultado da validação
 */
export const validateStudentsExcel = async (file: File): Promise<ImportResponse> => {
  return importStudentsFromExcel(file, true)
}

// ===== FUNÇÕES UTILITÁRIAS =====

/**
 * Cria um link para download e inicia o download automaticamente
 * @param blob - Blob do arquivo
 * @param fileName - Nome do arquivo
 */
export const downloadBlobAsFile = (blob: Blob, fileName: string): void => {
  try {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Erro ao fazer download do arquivo:', error)
    throw error
  }
}

/**
 * Gera nome de arquivo único com timestamp
 * @param prefix - Prefixo do arquivo
 * @param extension - Extensão do arquivo
 * @returns Nome do arquivo com timestamp
 */
export const generateFileName = (prefix: string, extension: string = 'xlsx'): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0]
  return `${prefix}_${timestamp}.${extension}`
}

/**
 * Formata o tamanho do arquivo em formato legível
 * @param bytes - Tamanho em bytes
 * @returns Tamanho formatado
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Interfaces para o sistema de notas dos alunos
export interface StudentGrade {
  id: string
  classId: string
  studentId: string
  practicalGrade?: number
  theoreticalGrade?: number
  observations?: string
  gradedAt: string
  gradedBy?: string
  createdAt: string
  updatedAt: string
  class?: {
    id: string
    startDate: string
    endDate: string
    training: {
      id: string
      title: string
    }
  }
  student?: {
    id: string
    name: string
    cpf: string
    email?: string
  }
}

export interface StudentGradeInput {
  classId: string
  studentId: string
  practicalGrade?: number
  theoreticalGrade?: number
  observations?: string
}

export interface ClassGradeStats {
  classInfo: {
    id: string
    trainingTitle: string
    totalStudents: number
  }
  statistics: {
    studentsWithGrades: number
    studentsWithoutGrades: number
    studentsWithPracticalGrade: number
    studentsWithTheoreticalGrade: number
    averagePracticalGrade?: number
    averageTheoreticalGrade?: number
    practicalGradeDistribution: {
      excellent: number  // 9-10
      good: number       // 7-8.9
      average: number    // 5-6.9
      poor: number       // <5
    }
    theoreticalGradeDistribution: {
      excellent: number
      good: number
      average: number
      poor: number
    }
  }
  gradedStudents: Array<{
    studentId: string
    studentName: string
    practicalGrade?: number
    theoreticalGrade?: number
    observations?: string
    gradedAt: string
  }>
}

// Funções da API para gerenciar notas dos alunos

// Criar ou atualizar nota do aluno
export async function createOrUpdateStudentGrade(gradeData: StudentGradeInput): Promise<StudentGrade> {
  const response = await api.post('/superadmin/student-grades', gradeData)
  return response.data
}

// Buscar notas de um aluno específico
export async function getStudentGrades(studentId: string): Promise<StudentGrade[]> {
  const response = await api.get(`/superadmin/student-grades/student/${studentId}`)
  return response.data
}

// Buscar notas de uma turma específica
export async function getClassGrades(classId: string): Promise<StudentGrade[]> {
  const response = await api.get(`/superadmin/student-grades/class/${classId}`)
  return response.data
}

// Buscar estatísticas de uma turma
export async function getClassGradeStats(classId: string): Promise<ClassGradeStats> {
  const response = await api.get(`/superadmin/student-grades/class/${classId}/stats`)
  return response.data
}

// Atualizar nota específica
export async function updateStudentGrade(
  classId: string, 
  studentId: string, 
  gradeData: Partial<StudentGradeInput>
): Promise<StudentGrade> {
  const response = await api.patch(`/superadmin/student-grades/${classId}/${studentId}`, gradeData)
  return response.data
}

// Remover nota de um aluno
export async function deleteStudentGrade(classId: string, studentId: string): Promise<{ id: string; message: string }> {
  const response = await api.delete(`/superadmin/student-grades/${classId}/${studentId}`)
  return response.data
}

// Buscar todas as notas com filtros
export async function getAllStudentGrades(params?: {
  classId?: string
  studentId?: string
  hasPracticalGrade?: boolean
  hasTheoreticalGrade?: boolean
  page?: number
  limit?: number
}): Promise<{
  grades: StudentGrade[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}> {
  const queryParams = new URLSearchParams()
  
  if (params?.classId) queryParams.append('classId', params.classId)
  if (params?.studentId) queryParams.append('studentId', params.studentId)
  if (params?.hasPracticalGrade !== undefined) queryParams.append('hasPracticalGrade', params.hasPracticalGrade.toString())
  if (params?.hasTheoreticalGrade !== undefined) queryParams.append('hasTheoreticalGrade', params.hasTheoreticalGrade.toString())
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const response = await api.get(`/superadmin/student-grades?${queryParams.toString()}`)
  return response.data
}

// Interface para fotos de turmas
export interface ClassPhoto {
  id: string
  classId: string
  path: string
  caption?: string
  uploadedBy?: string
  uploadedAt: string
  createdAt: string
  updatedAt: string
  class?: {
    id: string
    training: {
      title: string
    }
  }
}

export interface ClassPhotoStats {
  classInfo: {
    id: string
    trainingTitle: string
  }
  statistics: {
    totalPhotos: number
    photosWithCaption: number
    photosWithoutCaption: number
    photosByDate: Record<string, number>
    photosByUser: Record<string, number>
    firstPhotoUploadedAt?: string
    lastPhotoUploadedAt?: string
  }
}

// Upload de foto para turma
export async function uploadClassPhoto(
  classId: string,
  photo: File,
  caption?: string
): Promise<ClassPhoto> {
  const formData = new FormData()
  formData.append('photo', photo)
  if (caption) {
    formData.append('caption', caption)
  }

  const response = await api.post(`/superadmin/class-photos/upload/${classId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

// Listar fotos de uma turma
export async function getClassPhotos(classId: string): Promise<ClassPhoto[]> {
  const response = await api.get(`/superadmin/class-photos/class/${classId}`)
  return response.data
}

// Listar todas as fotos com filtros
export async function getAllClassPhotos(params?: {
  classId?: string
  uploadedBy?: string
  page?: number
  limit?: number
}): Promise<{
  photos: ClassPhoto[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}> {
  const queryParams = new URLSearchParams()
  
  if (params?.classId) queryParams.append('classId', params.classId)
  if (params?.uploadedBy) queryParams.append('uploadedBy', params.uploadedBy)
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.limit) queryParams.append('limit', params.limit.toString())

  const response = await api.get(`/superadmin/class-photos?${queryParams.toString()}`)
  return response.data
}

// Estatísticas de fotos da turma
export async function getClassPhotoStats(classId: string): Promise<ClassPhotoStats> {
  const response = await api.get(`/superadmin/class-photos/class/${classId}/stats`)
  return response.data
}

// Atualizar legenda da foto
export async function updateClassPhotoCaption(
  photoId: string,
  caption: string
): Promise<ClassPhoto> {
  const response = await api.patch(`/superadmin/class-photos/${photoId}`, {
    caption
  })
  return response.data
}

// Remover foto
export async function deleteClassPhoto(photoId: string): Promise<void> {
  await api.delete(`/superadmin/class-photos/${photoId}`)
}

// ===== FUNÇÕES PARA RESPONSÁVEIS TÉCNICOS =====

export interface TechnicalResponsible {
  id: string
  name: string
  email: string
  cpf: string
  rg?: string
  profession: string
  professionalRegistry?: string
  phone?: string
  mobilePhone?: string
  signaturePath?: string
  isActive: boolean
  observations?: string
  createdAt: string
  updatedAt: string
}

export interface TechnicalResponsibleCreateData {
  name: string
  email: string
  cpf: string
  rg?: string
  profession: string
  professionalRegistry?: string
  phone?: string
  mobilePhone?: string
  isActive?: boolean
  observations?: string
}

export interface TechnicalResponsibleUpdateData {
  name?: string
  email?: string
  rg?: string
  profession?: string
  professionalRegistry?: string
  phone?: string
  mobilePhone?: string
  isActive?: boolean
  observations?: string
}

export interface TechnicalResponsibleResponse {
  technicalResponsibles: TechnicalResponsible[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Listar responsáveis técnicos com paginação e busca
export async function getTechnicalResponsibles(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<TechnicalResponsibleResponse> {
  try {
    const response = await api.get('/technical-responsible', {
      params: {
        page,
        limit,
        search
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar responsáveis técnicos:', error)
    throw error
  }
}

// Listar apenas responsáveis técnicos ativos
export async function getActiveTechnicalResponsibles(): Promise<TechnicalResponsible[]> {
  try {
    const response = await api.get('/technical-responsible/active')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar responsáveis técnicos ativos:', error)
    throw error
  }
}

// Buscar responsável técnico por ID
export async function getTechnicalResponsibleById(id: string): Promise<TechnicalResponsible> {
  try {
    const response = await api.get(`/technical-responsible/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar responsável técnico:', error)
    throw error
  }
}

// Criar responsável técnico
export async function createTechnicalResponsible(
  data: TechnicalResponsibleCreateData
): Promise<{ message: string; technicalResponsible: TechnicalResponsible }> {
  try {
    const response = await api.post('/technical-responsible', data)
    return response.data
  } catch (error) {
    console.error('Erro ao criar responsável técnico:', error)
    throw error
  }
}

// Atualizar responsável técnico
export async function updateTechnicalResponsible(
  id: string,
  data: TechnicalResponsibleUpdateData
): Promise<{ message: string; technicalResponsible: TechnicalResponsible }> {
  try {
    const response = await api.patch(`/technical-responsible/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar responsável técnico:', error)
    throw error
  }
}

// Deletar responsável técnico
export async function deleteTechnicalResponsible(id: string): Promise<{ message: string }> {
  try {
    const response = await api.delete(`/technical-responsible/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao deletar responsável técnico:', error)
    throw error
  }
}

// Ativar/Desativar responsável técnico
export async function toggleTechnicalResponsibleStatus(
  id: string
): Promise<{ message: string; technicalResponsible: TechnicalResponsible }> {
  try {
    const response = await api.patch(`/technical-responsible/${id}/toggle-status`)
    return response.data
  } catch (error) {
    console.error('Erro ao alterar status do responsável técnico:', error)
    throw error
  }
}

// Upload de assinatura para responsável técnico
export async function uploadTechnicalResponsibleSignature(
  technicalResponsibleId: string,
  signatureFile: File
): Promise<{ message: string; technicalResponsible: TechnicalResponsible }> {
  try {
    const formData = new FormData()
    formData.append('signature', signatureFile)
    formData.append('technicalResponsibleId', technicalResponsibleId)

    const response = await api.post('/technical-responsible/signature/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Erro ao fazer upload da assinatura:', error)
    throw error
  }
}

// ===== VEÍCULOS =====

// Interface para veículo
export interface Vehicle {
  id: string
  instructorId: string
  brand: string
  model: string
  year: number
  licensePlate: string
  color: string
  renavam: string
  chassisNumber: string
  fuelType: string
  category: 'A' | 'B' | 'C' | 'D' | 'E'
  isActive: boolean
  observations?: string
  createdAt: string
  updatedAt: string
  instructor?: {
    id: string
    name: string
    email: string
  }
}

// Interface para criar veículo
export interface CreateVehicle {
  brand: string
  model: string
  year: number
  licensePlate: string
  color: string
  renavam: string
  chassisNumber: string
  fuelType: string
  category: 'A' | 'B' | 'C' | 'D' | 'E'
  observations?: string
}

// Interface para atualizar veículo
export interface UpdateVehicle {
  brand?: string
  model?: string
  year?: number
  licensePlate?: string
  color?: string
  renavam?: string
  chassisNumber?: string
  fuelType?: string
  category?: 'A' | 'B' | 'C' | 'D' | 'E'
  observations?: string
}

// Cadastrar veículo para um instrutor
export async function createVehicle(instructorId: string, vehicle: CreateVehicle): Promise<Vehicle> {
  try {
    const response = await api.post(`/instructors/${instructorId}/vehicles`, vehicle)
    return response.data
  } catch (error) {
    console.error('Erro ao cadastrar veículo:', error)
    throw error
  }
}

// Listar veículos de um instrutor
export async function getInstructorVehicles(instructorId: string): Promise<Vehicle[]> {
  try {
    const response = await api.get(`/instructors/${instructorId}/vehicles`)
    return response.data
  } catch (error) {
    console.error('Erro ao listar veículos do instrutor:', error)
    throw error
  }
}

// Buscar veículo por ID
export async function getVehicleById(vehicleId: string): Promise<Vehicle> {
  try {
    const response = await api.get(`/instructors/vehicles/${vehicleId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar veículo:', error)
    throw error
  }
}

// Atualizar veículo
export async function updateVehicle(vehicleId: string, updates: UpdateVehicle): Promise<Vehicle> {
  try {
    const response = await api.put(`/instructors/vehicles/${vehicleId}`, updates)
    return response.data
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error)
    throw error
  }
}

// Alternar status ativo/inativo do veículo
export async function toggleVehicleStatus(vehicleId: string): Promise<{ message: string; vehicle: Vehicle }> {
  try {
    const response = await api.patch(`/instructors/vehicles/${vehicleId}/toggle-status`)
    return response.data
  } catch (error) {
    console.error('Erro ao alterar status do veículo:', error)
    throw error
  }
}

// Buscar veículos por categoria
export async function getVehiclesByCategory(category: 'A' | 'B' | 'C' | 'D' | 'E'): Promise<Vehicle[]> {
  try {
    const response = await api.get(`/instructors/vehicles/category/${category}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar veículos por categoria:', error)
    throw error
  }
}

// Buscar veículo por placa
export async function getVehicleByLicensePlate(plate: string): Promise<Vehicle> {
  try {
    const response = await api.get(`/instructors/vehicles/search/license-plate?plate=${plate}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar veículo por placa:', error)
    throw error
  }
}

// Deletar veículo
export async function deleteVehicle(vehicleId: string): Promise<{ message: string }> {
  try {
    const response = await api.delete(`/instructors/vehicles/${vehicleId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao deletar veículo:', error)
    throw error
  }
}

// Listar todos os veículos (para superadmin)
export async function getAllVehicles(): Promise<Vehicle[]> {
  try {
    const response = await api.get('/instructors/vehicles')
    return response.data
  } catch (error) {
    console.error('Erro ao listar todos os veículos:', error)
    throw error
  }
}

// ===== HISTÓRICO DO ALUNO =====

// Interface para nota do aluno
export interface StudentGrade {
  id: string
  practicalGrade?: number
  theoreticalGrade?: number
  observations?: string
  gradedAt: string
  gradedBy?: string
}

// Interface para presença em aula
export interface LessonAttendance {
  id: string
  lessonId: string
  status: string
  observations?: string
  createdAt: string
  lesson: {
    id: string
    title: string
    startDate: string
    endDate: string
    status: string
    location?: string
  }
}

// Interface para certificado
export interface Certificate {
  id: string
  issueDate: string
  validationCode: string
}

// Interface para bloqueio de certificado
export interface CertificateBlock {
  id: string
  reason: string
  blockedAt: string
  blockedBy: string
}

// Interface para turma no histórico
export interface StudentHistoryClassDto {
  id: string
  trainingId: string
  instructorId: string
  technicalResponsibleId?: string
  startDate: string
  endDate: string
  status: string
  type: string
  location?: string
  observations?: string
  training: {
    id: string
    title: string
    description?: string
    durationHours: number
    programContent?: string
    validityDays?: number
    isActive: boolean
  }
  instructor: {
    id: string
    name: string
    email?: string
    cpf?: string
    mobileAreaCode?: string
    mobileNumber?: string
  }
  client?: {
    id: string
    name: string
    email?: string
    corporateName?: string
  }
  technicalResponsible?: {
    id: string
    name: string
    email: string
    profession: string
    professionalRegistry?: string
  }
  studentGrade?: StudentGrade
  lessonAttendances: LessonAttendance[]
  certificates: Certificate[]
  certificateBlocks: CertificateBlock[]
}

// Interface para histórico completo do aluno
export interface StudentHistoryResponseDto {
  studentId: string
  studentName: string
  studentCpf: string
  studentEmail?: string
  enrollmentDate: string
  totalClasses: number
  completedClasses: number
  activeClasses: number
  totalCertificates: number
  classes: StudentHistoryClassDto[]
}

// Interface para estatísticas do aluno
export interface StudentStatistics {
  studentId: string
  studentName: string
  enrollmentDate: string
  totalClasses: number
  completedClasses: number
  totalCertificates: number
  totalLessons: number
  attendedLessons: number
  attendanceRate: number
  averageGrades: {
    practical: number
    theoretical: number
  }
  totalHoursCompleted: number
}

// Interface para filtros do histórico
export interface StudentHistoryFilters {
  status?: 'EM_ABERTO' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA' | 'SUSPENSA'
  startDate?: string
  endDate?: string
  trainingId?: string
  instructorId?: string
  includeInactive?: boolean
}

// Buscar histórico completo do aluno
export async function getStudentHistory(
  studentId: string, 
  filters?: StudentHistoryFilters
): Promise<StudentHistoryResponseDto> {
  try {
    const queryParams = new URLSearchParams()
    
    if (filters?.status) queryParams.append('status', filters.status)
    if (filters?.startDate) queryParams.append('startDate', filters.startDate)
    if (filters?.endDate) queryParams.append('endDate', filters.endDate)
    if (filters?.trainingId) queryParams.append('trainingId', filters.trainingId)
    if (filters?.instructorId) queryParams.append('instructorId', filters.instructorId)
    if (filters?.includeInactive) queryParams.append('includeInactive', filters.includeInactive.toString())
    
    const url = `/students/${studentId}/history${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar histórico do aluno:', error)
    throw error
  }
}

// Buscar estatísticas do aluno
export async function getStudentStatistics(studentId: string): Promise<StudentStatistics> {
  try {
    const response = await api.get(`/students/${studentId}/statistics`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar estatísticas do aluno:', error)
    throw error
  }
}

// Buscar detalhes de uma turma específica do aluno
export async function getStudentClassHistory(
  studentId: string, 
  classId: string
): Promise<StudentHistoryClassDto> {
  try {
    const response = await api.get(`/students/${studentId}/history/class/${classId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar detalhes da turma do aluno:', error)
    throw error
  }
}

// ========================================
// VINCULAÇÃO DE RESPONSÁVEL TÉCNICO ÀS TURMAS
// ========================================

// Interface para turma com responsável técnico
export interface ClassWithTechnicalResponsible {
  id: string
  training: {
    id: string
    title: string
    durationHours?: number
  }
  instructor: {
    id: string
    name: string
    email?: string
  }
  client?: {
    id: string
    name: string
    corporateName?: string
  }
  technicalResponsible?: {
    id: string
    name: string
    profession?: string
    email?: string
    professionalRegistry?: string
  }
  startDate: string
  endDate: string
  status: string
  studentsCount?: number
  students?: Array<{
    id: string
    name: string
    email?: string
  }>
}

// Interface para resposta de turmas do responsável técnico
export interface TechnicalResponsibleClassesDto {
  technicalResponsible: {
    id: string
    name: string
    profession?: string
    email?: string
    professionalRegistry?: string
  }
  totalClasses: number
  classes: ClassWithTechnicalResponsible[]
}

// Interface para turmas disponíveis
export interface AvailableClassesDto {
  totalAvailableClasses: number
  classes: ClassWithTechnicalResponsible[]
}

// Vincular responsável técnico à turma
export async function linkTechnicalResponsibleToClass(
  technicalResponsibleId: string,
  classId: string
): Promise<{ message: string; class: ClassWithTechnicalResponsible }> {
  try {
    const response = await api.post(`/technical-responsible/${technicalResponsibleId}/link-class/${classId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao vincular responsável técnico à turma:', error)
    throw error
  }
}

// Desvincular responsável técnico da turma
export async function unlinkTechnicalResponsibleFromClass(
  classId: string
): Promise<{ 
  message: string
  class: ClassWithTechnicalResponsible
  previousTechnicalResponsible?: {
    id: string
    name: string
  }
}> {
  try {
    const response = await api.delete(`/technical-responsible/unlink-class/${classId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao desvincular responsável técnico da turma:', error)
    throw error
  }
}

// Buscar turmas de um responsável técnico
export async function getTechnicalResponsibleClasses(
  technicalResponsibleId: string
): Promise<TechnicalResponsibleClassesDto> {
  try {
    const response = await api.get(`/technical-responsible/${technicalResponsibleId}/classes`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar turmas do responsável técnico:', error)
    throw error
  }
}

// Buscar turmas disponíveis para vinculação (incluindo concluídas)
export async function getAvailableClassesForTechnicalResponsible(): Promise<AvailableClassesDto> {
  try {
    const response = await api.get('/technical-responsible/available-classes')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar turmas disponíveis:', error)
    throw error
  }
}

// ============ CERTIFICATES API ============

export interface CertificateStudentData {
  id: string
  name: string
  cpf: string
  email?: string
  canGenerateCertificate: boolean
}

export interface CertificateClassData {
  classId: string
  training: {
    id: string
    title: string
    durationHours: number
  }
  instructor: {
    name: string
  }
  technicalResponsible?: {
    name: string
    profession?: string
  }
  client?: {
    name: string
    city?: string
    state?: string
  }
  startDate: string
  endDate: string
  location?: string
  canGenerateCertificate: boolean
}

export interface CertificatePreviewData {
  student: {
    id: string
    name: string
    cpf: string
  }
  class: {
    id: string
    startDate: string
    endDate: string
    status: string
    location?: string
    training: {
      title: string
      durationHours: number
      programContent?: string
    }
    instructor: {
      name: string
    }
    technicalResponsible?: {
      name: string
      profession?: string
    }
    client?: {
      name: string
      city?: string
      state?: string
    }
  }
}

export interface StudentCertificatesResponse {
  message: string
  totalCertificates: number
  certificates: CertificateClassData[]
}

export interface ClassStudentsForCertificateResponse {
  message: string
  class: {
    id: string
    training: {
      id: string
      title: string
      durationHours: number
    }
    instructor: {
      name: string
    }
    technicalResponsible?: {
      name: string
      profession?: string
    }
    client?: {
      name: string
      city?: string
      state?: string
    }
    startDate: string
    endDate: string
    status: string
    location?: string
  }
  students: CertificateStudentData[]
  totalStudents: number
}

// Gerar certificado PDF para um estudante - Versão POST
export async function generateCertificatePDF(
  studentId: string,
  classId: string
): Promise<Blob> {
  try {
    const response = await api.post('/certificado/generate', {
      classId,
      studentId
    }, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf',
        'Content-Type': 'application/json'
      },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao gerar certificado PDF:', error)
    throw error
  }
}

// Gerar certificado PDF para um estudante - Versão GET alternativa
export async function generateCertificatePDFGet(
  studentId: string,
  classId: string
): Promise<Blob> {
  try {
    const response = await api.get(`/certificado/generate/${classId}/${studentId}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf',
      },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao gerar certificado PDF (GET):', error)
    throw error
  }
}

// Visualizar preview do certificado
export async function getCertificatePreview(
  studentId: string,
  classId: string
): Promise<Blob> {
  try {
    const response = await api.get(`/certificado/preview/${classId}/${studentId}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf',
      },
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar preview do certificado:', error)
    throw error
  }
}

// Interface para erro de certificado bloqueado
export interface CertificateBlockedError {
  message: string
  blocked: boolean
  reason?: string
}

// Interface para erro de validação
export interface CertificateValidationError {
  message: string
  code: 'CLASS_NOT_FOUND' | 'STUDENT_NOT_FOUND' | 'STUDENT_NOT_ENROLLED' | 'CERTIFICATE_BLOCKED'
}

// Interface para dados de elegibilidade de certificado - ATUALIZADA conforme nova API
export interface CertificateEligibilityStudent {
  studentId: string
  studentName: string
  studentCpf: string
  studentEmail?: string
  practicalGrade?: number | null
  theoreticalGrade?: number | null
  averageGrade?: number | null
  totalLessons: number
  attendedLessons: number
  absences: number
  isEligible: boolean
  reason: string
}

// Interface para turma com elegibilidade de certificados - ATUALIZADA conforme nova API
export interface CompletedClassWithEligibility {
  classId: string
  trainingName: string
  startDate: string
  endDate: string
  status: string
  location?: string
  trainingDurationHours?: number
  certificateValidityDays?: number
  totalStudents?: number
  studentsWithoutAbsences?: number
  studentsWithAbsences?: number
  totalLessons?: number
  students: CertificateEligibilityStudent[]
}

// Interface para resposta de turmas elegíveis por cliente - ATUALIZADA conforme nova API
export interface ClientEligibleClassesResponse {
  clientId: string
  clientName: string
  totalClasses: number
  eligibleClasses: number
  classes: CompletedClassWithEligibility[]
}

// Verificar elegibilidade de certificados - Turma específica
// Endpoint: GET /certificado/eligibility/{classId}
export async function getCertificateEligibility(classId: string): Promise<CertificateEligibilityStudent[]> {
  try {
    console.log('🔍 Buscando elegibilidade de certificados para turma:', classId)
    const response = await api.get(`/certificado/eligibility/${classId}`)
    console.log('✅ Elegibilidade obtida:', response.data?.length, 'estudantes')
    return response.data
  } catch (error: any) {
    console.error('❌ Erro ao buscar elegibilidade de certificados:', error)
    
    // Tratamento específico de erros da nova API
    if (error?.response?.status === 404) {
      throw new Error('Turma não encontrada')
    }
    if (error?.response?.status === 400) {
      throw new Error(`Erro ao verificar elegibilidade: ${error.response.data?.message || 'Dados inválidos'}`)
    }
    
    throw error
  }
}

// Listar turmas concluídas com status de certificados
// Endpoint: GET /certificado/completed-classes
export async function getCompletedClassesWithEligibility(): Promise<CompletedClassWithEligibility[]> {
  try {
    console.log('🔍 Buscando todas as turmas concluídas com elegibilidade')
    const response = await api.get('/certificado/completed-classes')
    console.log('✅ Turmas concluídas obtidas:', response.data?.length, 'turmas')
    return response.data
  } catch (error: any) {
    console.error('❌ Erro ao buscar turmas concluídas com elegibilidade:', error)
    
    if (error?.response?.status === 400) {
      throw new Error(`Erro ao buscar turmas: ${error.response.data?.message || 'Erro interno do servidor'}`)
    }
    
    throw error
  }
}

// Buscar turmas elegíveis por cliente
// Endpoint: GET /certificado/client/{clientId}/eligible-classes
export async function getClientEligibleClasses(clientId: string): Promise<ClientEligibleClassesResponse> {
  try {
    console.log('🔍 Buscando turmas elegíveis para cliente:', clientId)
    const response = await api.get(`/certificado/client/${clientId}/eligible-classes`)
    console.log('✅ Turmas do cliente obtidas:', response.data?.totalClasses, 'total,', response.data?.eligibleClasses, 'elegíveis')
    return response.data
  } catch (error: any) {
    console.error('❌ Erro ao buscar turmas elegíveis do cliente:', error)
    
    if (error?.response?.status === 404) {
      throw new Error('Cliente não encontrado')
    }
    if (error?.response?.status === 400) {
      throw new Error(`Erro ao buscar dados do cliente: ${error.response.data?.message || 'Dados inválidos'}`)
    }
    
    throw error
  }
}

// Listar certificados disponíveis para um estudante (mantido para compatibilidade)
export async function getStudentCertificates(
  studentId: string
): Promise<StudentCertificatesResponse> {
  try {
    const response = await api.get(`/certificates/student/${studentId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar certificados do estudante:', error)
    throw error
  }
}

// Listar estudantes de uma turma para certificação
export async function getClassStudentsForCertificate(
  classId: string
): Promise<ClassStudentsForCertificateResponse> {
  try {
    const response = await api.get(`/certificates/class/${classId}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar estudantes da turma para certificação:', error)
    throw error
  }
}

// Utilitário para fazer download do PDF gerado - usando nova API
export async function downloadCertificatePDF(
  studentId: string,
  classId: string,
  studentName?: string,
  trainingTitle?: string
): Promise<void> {
  try {
    // Usar a versão POST da nova API
    const blob = await generateCertificatePDF(studentId, classId)
    
    // Criar nome do arquivo mais limpo
    const cleanStudentName = studentName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'aluno'
    const cleanTrainingTitle = trainingTitle?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'treinamento'
    const fileName = `certificado-${cleanStudentName}-${cleanTrainingTitle}.pdf`
    
    // Criar link temporário para download
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    
    // Adicionar ao DOM temporariamente para permitir o clique
    link.style.display = 'none'
    document.body.appendChild(link)
    
    // Simular clique para iniciar o download
    link.click()
    
    // Limpar recursos após um pequeno delay
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
    
    console.log('✅ Download do certificado iniciado com sucesso:', fileName)
  } catch (error: any) {
    console.error('❌ Erro ao fazer download do certificado:', error)
    
    // Tratamento específico dos erros da nova API
    if (error?.response?.status === 400) {
      const errorData = error.response.data
      if (errorData?.message?.includes('bloqueado')) {
        throw new Error(`Certificado bloqueado: ${errorData.message}`)
      } else if (errorData?.message?.includes('não está matriculado')) {
        throw new Error('Aluno não está matriculado nesta turma')
      }
    } else if (error?.response?.status === 404) {
      const errorData = error.response.data
      if (errorData?.message?.includes('Turma')) {
        throw new Error('Turma não encontrada')
      } else if (errorData?.message?.includes('Aluno')) {
        throw new Error('Aluno não encontrado')
      }
    }
    
    throw error
  }
}

// Utilitário para abrir preview do certificado no navegador
export async function openCertificatePreview(
  studentId: string,
  classId: string
): Promise<void> {
  try {
    const blob = await getCertificatePreview(studentId, classId)
    
    // Criar URL temporária para o blob
    const url = window.URL.createObjectURL(blob)
    
    // Abrir em nova aba
    const newWindow = window.open(url, '_blank')
    
    if (!newWindow) {
      throw new Error('Popup bloqueado pelo navegador')
    }
    
    // Limpar URL após um tempo para liberar memória
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 5000)
    
    console.log('✅ Preview do certificado aberto com sucesso')
  } catch (error: any) {
    console.error('❌ Erro ao abrir preview do certificado:', error)
    throw error
  }
}

