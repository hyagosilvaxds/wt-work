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

export const createInstructor = async (instructorData: CreateInstructorData) => {
  try {
    const response = await api.post('/superadmin/instructors', instructorData)
    return response.data
  } catch (error) {
    console.error('Erro ao criar instrutor:', error)
    throw error
  }
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