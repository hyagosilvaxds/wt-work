"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  isAuthenticated, 
  getUserFromToken, 
  getFullUserData, 
  logout, 
  getUserPermissions,
  getPermissionsFromCookie,
  savePermissionsToCookie,
  getClientClasses
} from '@/lib/api/auth'
import { getInstructorClasses } from '@/lib/api/superadmin'

interface User {
  id: string
  email: string
  name: string
  roleId: string
  [key: string]: any
}

interface Permission {
  id: string
  name: string
  description: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  permissions: Permission[]
  login: () => void
  logout: () => Promise<void>
  isLoading: boolean
  hasPermission: (permissionName: string) => boolean
  isClient: boolean
  isInstructor: boolean
  getClientClasses: () => Promise<any>
  getInstructorClasses: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  // Recarregar dados sempre que a rota mudar
  useEffect(() => {
    if (isAuth) {
      console.log('Rota mudou, recarregando dados do usuário...')
      checkAuth()
    }
  }, [pathname])

  // Recarregar dados quando a janela receber foco (usuário voltar para a aba)
  useEffect(() => {
    const handleFocus = () => {
      if (isAuth) {
        console.log('Janela recebeu foco, recarregando dados do usuário...')
        checkAuth()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isAuth])

  const checkAuth = async () => {
    setIsLoading(true)
    console.log('Verificando autenticação...')
    
    if (isAuthenticated()) {
      try {
        // Sempre buscar permissões da API primeiro para garantir dados atualizados
        console.log('Buscando permissões e dados do usuário da API...')
        const permissionsResponse = await getUserPermissions()
        
        if (permissionsResponse && permissionsResponse.user) {
          // Usar dados do usuário da resposta de permissões
          const userData = permissionsResponse.user
          console.log('Dados do usuário da API de permissões:', userData)
          
          setIsAuth(true)
          setUser(userData)
          
          // Salvar permissões
          if (permissionsResponse.permissions) {
            setPermissions(permissionsResponse.permissions)
            savePermissionsToCookie(permissionsResponse.permissions)
            console.log('Permissões salvas:', permissionsResponse.permissions)
          }
        } else {
          // Fallback para dados do token se a API não retornar dados do usuário
          console.log('API não retornou dados do usuário, usando dados do token...')
          const userData = getUserFromToken()
          
          if (userData) {
            // Tentar buscar dados completos
            const fullUserData = await getFullUserData()
            setIsAuth(true)
            setUser(fullUserData || userData)
            console.log('Usuário setado no contexto:', fullUserData || userData)
          } else {
            console.log('Dados do usuário não encontrados')
            setIsAuth(false)
            setUser(null)
          }
          
          // Salvar permissões mesmo sem dados do usuário
          if (permissionsResponse && permissionsResponse.permissions) {
            setPermissions(permissionsResponse.permissions)
            savePermissionsToCookie(permissionsResponse.permissions)
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        
        // Fallback para dados do token se a API falhar
        try {
          const userData = getUserFromToken()
          if (userData) {
            setIsAuth(true)
            setUser(userData)
            console.log('Usando dados do token como fallback:', userData)
            
            // Tentar carregar permissões do cookie
            const savedPermissions = getPermissionsFromCookie()
            if (savedPermissions.length > 0) {
              setPermissions(savedPermissions)
              console.log('Permissões carregadas do cookie:', savedPermissions)
            }
          } else {
            setIsAuth(false)
            setUser(null)
            setPermissions([])
          }
        } catch (tokenError) {
          console.error('Erro ao processar token:', tokenError)
          setIsAuth(false)
          setUser(null)
          setPermissions([])
        }
      }
    } else {
      console.log('Usuário não autenticado')
      setIsAuth(false)
      setUser(null)
      setPermissions([])
    }
    
    setIsLoading(false)
  }

  const handleLogin = async () => {
    await checkAuth()
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsAuth(false)
      setUser(null)
      setPermissions([])
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const hasPermission = (permissionName: string): boolean => {
    return permissions.some(permission => permission.name === permissionName)
  }

  // Verificar se o usuário é cliente de forma mais robusta
  const isClient = (() => {
    if (!user) return false;
    
    // Primeiro verificar a estrutura mais comum: user.role.name
    if (user.role && user.role.name) {
      return ['CLIENTE', 'Cliente', 'client', 'CLIENT'].includes(user.role.name);
    }
    
    // Verificação específica por roleId conhecido (fallback)
    if (user.roleId === 'cmd3ynn8p0000vbouraxlw6xy') {
      return true;
    }
    
    // Verificar outras possibilidades de estrutura do objeto user
    const checkRoles = [
      user?.role?.roleName,
      user?.roleName,
      user?.roleId,
      user?.role?.id,
      user?.role
    ];
    
    const clientRoles = ['CLIENTE', 'Cliente', 'client', 'CLIENT'];
    
    return checkRoles.some(role => {
      if (typeof role === 'string') {
        return clientRoles.includes(role);
      }
      return false;
    });
  })();

  // Verificar se o usuário é instrutor
  const isInstructor = (() => {
    if (!user) return false;
    
    // Primeiro verificar a estrutura mais comum: user.role.name
    if (user.role && user.role.name) {
      return ['INSTRUTOR', 'Instrutor', 'instructor', 'INSTRUCTOR'].includes(user.role.name);
    }
    
    // Verificar outras possibilidades de estrutura do objeto user
    const checkRoles = [
      user?.role?.roleName,
      user?.roleName,
      user?.roleId,
      user?.role?.id,
      user?.role
    ];
    
    const instructorRoles = ['INSTRUTOR', 'Instrutor', 'instructor', 'INSTRUCTOR'];
    
    return checkRoles.some(role => {
      if (typeof role === 'string') {
        return instructorRoles.includes(role);
      }
      return false;
    });
  })();

  // Log temporário para debug do problema
  if (user) {
    console.log('DEBUG - Usuário atual:', {
      user: user,
      role: user.role,
      isClient: isClient
    })
  }

  const handleGetClientClasses = async () => {
    if (!isClient) {
      throw new Error('Usuário não é do tipo CLIENTE')
    }
    return await getClientClasses()
  }

  const handleGetInstructorClasses = async () => {
    if (!isInstructor) {
      throw new Error('Usuário não é do tipo INSTRUTOR')
    }
    return await getInstructorClasses()
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuth,
        user,
        permissions,
        login: handleLogin,
        logout: handleLogout,
        isLoading,
        hasPermission,
        isClient,
        isInstructor,
        getClientClasses: handleGetClientClasses,
        getInstructorClasses: handleGetInstructorClasses
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
