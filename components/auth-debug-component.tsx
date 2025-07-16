"use client"

import { useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'

export default function AuthDebugComponent() {
  const { user, isClient } = useAuth()

  useEffect(() => {
    if (user) {
      console.log('=== AUTH DEBUG ===')
      console.log('User object:', user)
      console.log('User keys:', Object.keys(user))
      console.log('User.role:', user.role)
      console.log('User.roleId:', user.roleId)
      console.log('User.roleName:', user.roleName)
      console.log('IsClient:', isClient)
      
      // Verificar se o problema é que user.role não existe
      if (!user.role) {
        console.log('PROBLEMA: user.role está undefined!')
        
        // Vamos tentar buscar o role baseado no roleId
        if (user.roleId) {
          console.log('Tentando buscar role pelo roleId:', user.roleId)
          // Aqui podemos implementar uma busca para popular o role
        }
      }
      
      console.log('==================')
    }
  }, [user, isClient])

  if (!user) {
    return <div>Carregando dados do usuário...</div>
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Debug de Autenticação</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role (completo):</strong> {JSON.stringify(user.role, null, 2)}</p>
        <p><strong>Role.name:</strong> {user.role?.name}</p>
        <p><strong>Role.id:</strong> {user.role?.id}</p>
        <p><strong>RoleId:</strong> {user.roleId}</p>
        <p><strong>RoleName:</strong> {user.roleName}</p>
        <p><strong>É Cliente:</strong> {isClient ? 'Sim' : 'Não'}</p>
        <p><strong>Verificação manual:</strong> {user.role?.name === 'CLIENTE' ? 'Sim' : 'Não'}</p>
      </div>
    </div>
  )
}
