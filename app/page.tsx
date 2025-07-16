"use client"

import { useState } from "react"
import { AdaptiveSidebar } from "@/components/adaptive-sidebar"
import { Header } from "@/components/header"
import AdaptiveDashboard from "@/components/adaptive-dashboard"
import { StudentsPage } from "@/components/students-page"
import { TrainingsPage } from "@/components/trainings-page"
import TurmasPage from "@/components/turmas-page"
import { InstructorsPage } from "@/components/instructors-page"
import { ClientsPage } from "@/components/clients-page"
import { GroupsPage } from "@/components/groups-page"
import { RoomsPage } from "@/components/rooms-page"
import { CertificatesPage } from "@/components/certificates-page"
import { CertificateExamplePage } from "@/components/certificate-example-page"
import { ReportsPage } from "@/components/reports-page"
import { FinancialModule } from "@/components/financial/financial-module"
import { SettingsPage } from "@/components/settings-page-simple"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { isClient } = useAuth()

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
      case "my-classes":
        return <TurmasPage isClientView={true} />
      case "instructors":
        return <InstructorsPage />
      case "clients":
        return <ClientsPage />
      case "groups":
        return <GroupsPage />
      case "rooms":
        return <RoomsPage />
      case "certificates":
        return <CertificatesPage />
      case "certificate-generator":
        return <CertificateExamplePage />
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
