"use client"

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showText?: boolean
}

export default function LogoutButton({ 
  variant = 'ghost', 
  size = 'default', 
  className = '',
  showText = true 
}: LogoutButtonProps) {
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      {showText && (
        <span className="ml-2">
          {isLoading ? 'Saindo...' : 'Sair'}
        </span>
      )}
    </Button>
  )
}
