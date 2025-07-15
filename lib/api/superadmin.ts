import api from './client'

// Função de teste para verificar se o token está funcionando
export const testAuth = async () => {
  try {
    console.log('Testando autenticação...')
    const response = await api.get('/superadmin/users?page=1&limit=1')
    console.log('Teste de autenticação bem-sucedido:', response.status)
    return true
  } catch (error: any) {
    console.error('Erro no teste de autenticação:', error)
    return false
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
export const getInstructorById = async (id: string) => {
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
  title: string
  description?: string
  durationHours: number
  isActive?: boolean
  validityDays?: number
}

export interface UpdateTrainingData {
  id?: string
  title?: string
  description?: string
  durationHours?: number
  isActive?: boolean
  validityDays?: number
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
  } catch (error) {
    console.error('Erro ao deletar treinamento:', error)
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
export const patchClass = async (id: string, updateData: Partial<UpdateClassData>) => {
  try {
    console.log('Updating class with ID:', id)
    console.log('Update data:', JSON.stringify(updateData, null, 2))
    
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
    
    console.log('Patch response status:', response.status)
    console.log('Patch response data:', response.data)
    
    return response.data
  } catch (error: any) {
    console.error('Erro ao atualizar classe:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    console.error('Error headers:', error.response?.headers)
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
    console.log('Updating lesson with ID:', id)
    console.log('Update data:', updateData)
    
    const response = await api.patch(`/superadmin/lessons/${id}`, updateData)
    return response.data
  } catch (error: any) {
    console.error('Erro ao atualizar aula:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
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

// Função de teste específica para patch class
export const testPatchClass = async (id: string) => {
  try {
    console.log('Testando patchClass com ID:', id)
    
    // Primeiro, vamos buscar a classe para ver se existe
    const classData = await getClassById(id)
    console.log('Classe encontrada:', classData)
    
    // Fazer um patch simples apenas com observações
    const testData = {
      observations: `Teste de atualização - ${new Date().toISOString()}`
    }
    
    console.log('Dados de teste:', testData)
    
    const result = await patchClass(id, testData)
    console.log('Resultado do teste:', result)
    
    return result
  } catch (error: any) {
    console.error('Erro no teste de patchClass:', error)
    throw error
  }
}