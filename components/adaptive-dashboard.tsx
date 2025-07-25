"use client"

import { useAuth } from "@/hooks/use-auth"
import { SuperAdminDashboard } from "@/components/super-admin-dashboard"
import { InstructorDashboard } from "@/components/instructor-dashboard"
import ClientDashboard from "@/components/client-dashboard"
import LoadingPage from "@/components/loading-page"

export default function AdaptiveDashboard() {
  const { user, isLoading, isClient, isInstructor } = useAuth()

  if (isLoading) {
    return <LoadingPage />
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Faça login para acessar</h1>
        <p className="text-gray-600">Entre com suas credenciais para continuar.</p>
      </div>
    </div>
  }

  // Renderizar dashboard baseado no tipo de usuário
  if (isClient) {
    return <ClientDashboard />
  }

  // Se for instrutor, mostrar dashboard do instrutor
  if (isInstructor) {
    return <InstructorDashboard />
  }

  // Por padrão, outros usuários veem o dashboard de admin
  return <SuperAdminDashboard />
}
