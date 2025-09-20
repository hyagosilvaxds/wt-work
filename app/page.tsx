"use client"

import { useState, useEffect } from "react"
import { AdaptiveSidebar } from "@/components/adaptive-sidebar"
import { Header } from "@/components/header"
import AdaptiveDashboard from "@/components/adaptive-dashboard"
import { StudentsPage } from "@/components/students-page"
import { TrainingsPage } from "@/components/trainings-page"
import TurmasPage from "@/components/turmas-page"
import { InstructorsPage } from "@/components/instructors-page"
import { TechnicalResponsiblesPage } from "@/components/technical-responsibles-page"
import { VehiclesPage } from "@/components/vehicles-page"
import { ClientsPage } from "@/components/clients-page"
import { GroupsPage } from "@/components/groups-page"
import { RoomsPage } from "@/components/rooms-page"
import { CertificatesPage } from "@/components/certificates-page"
import { BudgetManagementPage } from "@/components/budget-management-page"
import { ReportsPage } from "@/components/reports-page"
import { FinancialModule } from "@/components/financial/financial-module"
import { SettingsPage } from "@/components/settings-page-simple"
import { InstructorClassesPage } from "@/components/instructor-classes-page"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  // Iniciar com dashboard por padrão
  const [activeTab, setActiveTab] = useState("dashboard")
  const { isClient } = useAuth()

  // Escutar eventos de navegação personalizada
  /*useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      handleSetActiveTab(event.detail)
    }
    
    window.addEventListener('navigate', handleNavigate as EventListener)
    
    return () => {
      window.removeEventListener('navigate', handleNavigate as EventListener)
    }
  }, [])*/

  // Função para definir a aba ativa com validação para clientes
  const handleSetActiveTab = (tab: string) => {
    // Bloquear acesso de clientes às configurações
    if (isClient && tab === "settings") {
      setActiveTab("dashboard")
      return
    }
    setActiveTab(tab)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdaptiveDashboard />
      case "students":
        return <StudentsPage />
      case "trainings":
        return <TrainingsPage />
      case "classes":
        return <TurmasPage />
      case "instructor-classes":
        return <InstructorClassesPage />
      case "my-classes":
        return <TurmasPage isClientView={true} />
      case "instructors":
        return <InstructorsPage />
      case "technical-responsibles":
        return <TechnicalResponsiblesPage />
      case "vehicles":
        return <VehiclesPage />
      case "clients":
        return <ClientsPage />
      case "groups":
        return <GroupsPage />
      case "rooms":
        return <RoomsPage />
      case "budgets":
        return <BudgetManagementPage />
      case "certificates":
        return <CertificatesPage />
      case "certificate-generator":
        return (
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                Gerador de Certificados Descontinuado
              </h2>
              <p className="text-yellow-700 mb-4">
                O gerador de certificados manual foi descontinuado. Agora todos os certificados 
                são gerados através da API automaticamente.
              </p>
              <p className="text-yellow-700">
                Para gerar certificados, acesse a página <strong>Certificados</strong> no menu lateral.
              </p>
            </div>
          </div>
        )
      case "financial":
        return <FinancialModule />
      case "reports":
        return <ReportsPage />
      case "settings":
        // Bloquear acesso de clientes às configurações
        if (isClient) {
          return <AdaptiveDashboard />
        }
        return <SettingsPage />
      default:
        return <AdaptiveDashboard />
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <AdaptiveSidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
