"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, getUserFromToken, getFullUserData, logout } from '@/lib/api/auth'

interface User {
  id: string
  email: string
  name: string
  roleId: string
  [key: string]: any
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: () => void
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    setIsLoading(true)
    console.log('Verificando autenticação...')
    
    if (isAuthenticated()) {
      try {
        // Primeiro, tentar obter dados do token
        const userData = getUserFromToken()
        console.log('Dados do usuário obtidos do token:', userData)
        
        if (userData) {
          // Se temos dados básicos, mas não nome/email, buscar da API
          if (!userData.name || !userData.email) {
            console.log('Dados incompletos, buscando dados completos...')
            const fullUserData = await getFullUserData()
            if (fullUserData) {
              setIsAuth(true)
              setUser(fullUserData as User)
              console.log('Usuário setado no contexto (dados completos):', fullUserData)
            } else {
              setIsAuth(true)
              setUser(userData as User)
              console.log('Usuário setado no contexto (dados do token):', userData)
            }
          } else {
            setIsAuth(true)
            setUser(userData as User)
            console.log('Usuário setado no contexto:', userData)
          }
        } else {
          console.log('Dados do usuário não encontrados')
          setIsAuth(false)
          setUser(null)
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        setIsAuth(false)
        setUser(null)
      }
    } else {
      console.log('Usuário não autenticado')
      setIsAuth(false)
      setUser(null)
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
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuth,
        user,
        login: handleLogin,
        logout: handleLogout,
        isLoading
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
