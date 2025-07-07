"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'

export default function LoadingPage() {
  const { isLoading } = useAuth()
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
    }, 500)

    return () => clearInterval(interval)
  }, [])

  if (!isLoading) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">
          Carregando{dots}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Verificando autenticação
        </p>
      </div>
    </div>
  )
}
