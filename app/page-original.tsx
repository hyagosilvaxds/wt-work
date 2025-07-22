"use client"

import { useState, useEffect } from "react"
import InstructorDocumentUploadFinal from '@/components/instructor-document-upload-final'
import UltraIsolatedFileTest from '@/components/ultra-isolated-file-test'
import FileInputDebugger from '@/components/file-input-debugger'
import AuthStateMonitor from '@/components/auth-state-monitor'
import AntiRemountFileInput from '@/components/anti-remount-file-input'
import PathMonitor from '@/components/path-monitor'
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
import { InstructorClassesPage } from "@/components/instructor-classes-page"
import InstructorDocumentUploadIsolated from "@/components/instructor-document-upload-isolated"
import InstructorDocumentUploadNoForm from "@/components/instructor-document-upload-no-form"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  // Iniciar com teste-upload se houver parâmetro na URL ou para demonstração
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('teste') === 'upload') {
        return "teste-upload"
      }
    }
    return "dashboard"
  })
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
      case "teste-upload":
        return (
          <div>
            <div style={{ 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              borderRadius: '6px', 
              padding: '16px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#856404' }}>🧪 DIAGNÓSTICO DE RELOAD - SELEÇÃO DE ARQUIVO</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#856404' }}>
                Este teste foca especificamente no problema de reload durante a seleção de arquivo
              </p>
            </div>
            
            {/* Monitor de pathname */}
            <PathMonitor />
            
            {/* Monitor do useAuth */}
            <AuthStateMonitor />
            
            {/* Debugger de detecção de remount */}
            <FileInputDebugger />
            
            {/* Testes anti-remount */}
            <AntiRemountFileInput />
            
            {/* Teste ultra isolado primeiro */}
            <UltraIsolatedFileTest />
            
            {/* Teste específico para file input */}
            <InstructorDocumentUploadFinal />
            
            <div style={{ margin: '40px 0', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
              <h3 style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
                Outros Testes (caso o problema persista)
              </h3>
            </div>
            
            <InstructorDocumentUploadIsolated />
            <div style={{ margin: '40px 0' }}></div>
            <InstructorDocumentUploadNoForm />
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
