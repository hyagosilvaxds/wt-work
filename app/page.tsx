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
import { ReportsPage } from "@/components/reports-page"
import { FinancialModule } from "@/components/financial/financial-module"
import { SettingsPage } from "@/components/settings-page-simple"
import ProtectedRoute from "@/components/protected-route"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

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
      case "financial":
        return <FinancialModule />
      case "reports":
        return <ReportsPage />
      case "settings":
        return <SettingsPage />
      default:
        return <AdaptiveDashboard />
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <AdaptiveSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
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
