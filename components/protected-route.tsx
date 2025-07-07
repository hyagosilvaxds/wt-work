"use client"

import { useAuth } from '@/hooks/use-auth'
import LoadingPage from '@/components/loading-page'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router])

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <LoadingPage />
  }

  // Se requer autenticação mas usuário não está autenticado, não renderizar nada
  // (o useEffect já vai redirecionar)
  if (requireAuth && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}
