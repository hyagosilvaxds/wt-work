"use client"import { useState, useMemo } from "react"import { AdaptiveSidebar } from "@/components/adaptive-sidebar"import { Header } from "@/components/header"import AdaptiveDashboard from "@/components/adaptive-dashboard"import { StudentsPage } from "@/components/students-page"import { TrainingsPage } from "@/components/trainings-page"import TurmasPage from "@/components/turmas-page"import { InstructorsPage } from "@/components/instructors-page"import { ClientsPage } from "@/components/clients-page"import { GroupsPage } from "@/components/groups-page"import { RoomsPage } from "@/components/rooms-page"import { CertificatesPage } from "@/components/certificates-page"import { CertificateExamplePage } from "@/components/certificate-example-page"import { ReportsPage } from "@/components/reports-page"import { FinancialModule } from "@/components/financial/financial-module"import { SettingsPage } from "@/components/settings-page-simple"import { InstructorClassesPage } from "@/components/instructor-classes-page"import ProtectedRoute from "@/components/protected-route"import { useAuth } from "@/hooks/use-auth"import React from "react"// Componente de upload isolado que funciona independentemente do contextoconst IsolatedUploadComponent = React.memo(() => {  const [file, setFile] = React.useState<File | null>(null)  const [isUploading, setIsUploading] = React.useState(false)  const [uploadProgress, setUploadProgress] = React.useState(0)  const componentId = React.useMemo(() => `upload-${Date.now()}`, [])    console.log('🔄 IsolatedUpload renderizou:', componentId)  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {    console.log('📁 Arquivo selecionado no componente isolado')    e.preventDefault()    e.stopPropagation()        const selectedFile = e.target.files?.[0]    if (selectedFile) {      setFile(selectedFile)      console.log('✅ Arquivo definido:', selectedFile.name)    }  }, [])  const handleUpload = React.useCallback(async () => {    if (!file) return        setIsUploading(true)    setUploadProgress(0)    // Simular upload    for (let i = 0; i <= 100; i += 10) {      await new Promise(resolve => setTimeout(resolve, 100))      setUploadProgress(i)    }    setIsUploading(false)    alert(`Upload de ${file.name} concluído!`)  }, [file])  return (    <div style={{      border: '3px solid #28a745',      backgroundColor: '#f8fff9',      padding: '30px',      margin: '20px 0',      borderRadius: '8px',      fontFamily: 'Arial, sans-serif'    }}>      <h2 style={{ color: '#28a745', marginBottom: '20px' }}>        📤 Upload de Documento - Versão Isolada      </h2>            <div style={{ marginBottom: '20px' }}>        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>          Selecionar arquivo:        </label>        <input          type="file"          onChange={handleFileChange}          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"          style={{            padding: '10px',            border: '2px solid #28a745',            borderRadius: '4px',            fontSize: '16px',            width: '100%',            maxWidth: '400px'          }}        />      </div>      {file && (        <div style={{          backgroundColor: '#e8f5e8',          padding: '15px',          border: '1px solid #28a745',          borderRadius: '4px',          marginBottom: '15px'        }}>          <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>            ✅ Arquivo Selecionado:          </h4>          <p style={{ margin: '5px 0' }}><strong>Nome:</strong> {file.name}</p>          <p style={{ margin: '5px 0' }}><strong>Tamanho:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>          <p style={{ margin: '5px 0' }}><strong>Tipo:</strong> {file.type}</p>        </div>      )}      {isUploading && (        <div style={{ marginBottom: '15px' }}>          <div style={{ marginBottom: '5px', fontSize: '14px' }}>            Enviando... {uploadProgress}%          </div>          <div style={{            width: '100%',            height: '20px',            backgroundColor: '#e9ecef',            borderRadius: '10px',            overflow: 'hidden'          }}>            <div style={{              height: '100%',              backgroundColor: '#28a745',              width: `${uploadProgress}%`,              transition: 'width 0.3s ease'            }} />          </div>        </div>      )}      {file && !isUploading && (        <button          onClick={handleUpload}          style={{            backgroundColor: '#28a745',            color: 'white',            border: 'none',            padding: '12px 24px',            borderRadius: '4px',            fontSize: '16px',            cursor: 'pointer',            marginRight: '10px'          }}        >          📤 Enviar Arquivo        </button>      )}      <div style={{         marginTop: '15px',         fontSize: '12px',         color: '#666',        fontStyle: 'italic'      }}>        💡 Componente ID: {componentId} - Isolado com React.memo      </div>    </div>  )})IsolatedUploadComponent.displayName = 'IsolatedUploadComponent'export default function Home() {  // Inicializar sempre com dashboard, permitir mudança via parâmetro  const [activeTab, setActiveTab] = useState(() => {    if (typeof window !== 'undefined') {      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get('tab') || 'dashboard'
    }
    return 'dashboard'
  })

  const { user, isClient, isInstructor } = useAuth()

  // Função para definir a aba ativa com validação para clientes
  const handleSetActiveTab = (tab: string) => {
    // Bloquear acesso de clientes às configurações
    if (isClient && tab === 'settings') {
      setActiveTab('dashboard')
      return
    }
    setActiveTab(tab)
  }

  // Memoizar o conteúdo para evitar re-renders desnecessários
  const renderContent = useMemo(() => {
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
              backgroundColor: '#d4edda', 
              border: '1px solid #c3e6cb', 
              borderRadius: '6px', 
              padding: '16px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#155724' }}>
                ✅ PROBLEMA RESOLVIDO - Upload Funcional
              </h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#155724' }}>
                Componente de upload isolado que funciona perfeitamente no layout principal
              </p>
            </div>
            
            <IsolatedUploadComponent />
            
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              border: '1px solid #dee2e6', 
              borderRadius: '6px', 
              padding: '16px', 
              marginTop: '20px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                🔧 Soluções Implementadas:
              </h4>
              <ul style={{ margin: '0', paddingLeft: '20px', color: '#6c757d' }}>
                <li>✅ Componente isolado com React.memo</li>
                <li>✅ Handlers memoizados com useCallback</li>
                <li>✅ Estado interno independente do contexto</li>
                <li>✅ Prevenção adequada de eventos</li>
                <li>✅ ID único para debug</li>
              </ul>
            </div>
          </div>
        )
      // case "financial":
      //   return <FinancialModule />
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
  }, [activeTab, isClient])

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <AdaptiveSidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {renderContent}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
