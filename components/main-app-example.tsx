"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AdaptiveSidebar } from "@/components/adaptive-sidebar"
import DashboardContent from "@/components/dashboard-content"
import { ClientClassesPage } from "@/components/client-classes-page"
import { StudentsPageExample } from "@/components/students-page-example"
import { PermissionsDebug } from "@/components/permissions-debug"
import { RoleBasedContent } from "@/components/role-based-content"

export default function MainApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { isClient } = useAuth()

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />
      
      case "my-classes":
        // Página específica para clientes
        return isClient ? <ClientClassesPage /> : <div>Acesso negado</div>
      
      case "students":
        return <StudentsPageExample />
      
      case "permissions-debug":
        return <PermissionsDebug />
      
      case "role-based":
        return <RoleBasedContent />
      
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdaptiveSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
