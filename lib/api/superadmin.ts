import api from './client'

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