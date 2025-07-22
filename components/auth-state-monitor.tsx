import React from 'react'
import { useAuth } from '@/hooks/use-auth'

const AuthStateMonitor = () => {
  const auth = useAuth()
  const [renderCount, setRenderCount] = React.useState(0)
  const [authLogs, setAuthLogs] = React.useState<string[]>([])
  
  // Monitor de mudanças no useAuth
  React.useEffect(() => {
    setRenderCount(prev => prev + 1)
    const timestamp = new Date().toLocaleTimeString()
    setAuthLogs(prev => [...prev.slice(-9), `${timestamp}: useAuth re-renderizou`])
  })

  React.useEffect(() => {
    const timestamp = new Date().toLocaleTimeString()
    setAuthLogs(prev => [...prev.slice(-9), `${timestamp}: isAuthenticated=${auth.isAuthenticated}, isLoading=${auth.isLoading}, user=${auth.user?.name || 'null'}`])
  }, [auth.isAuthenticated, auth.isLoading, auth.user])

  return (
    <div style={{
      border: '3px solid #orange',
      backgroundColor: '#fff9e6',
      padding: '15px',
      margin: '15px 0',
      borderRadius: '6px',
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      <div style={{
        backgroundColor: '#ff8c00',
        color: 'white',
        padding: '6px',
        marginBottom: '10px',
        borderRadius: '3px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        🔍 MONITOR DO useAuth - DETECÇÃO DE MUDANÇAS
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Status Atual:</div>
          <div style={{ backgroundColor: '#f5f5f5', padding: '6px', borderRadius: '3px', fontSize: '11px' }}>
            <div>🔄 Renders: <strong>{renderCount}</strong></div>
            <div>🔐 isAuthenticated: <strong>{String(auth.isAuthenticated)}</strong></div>
            <div>⏳ isLoading: <strong>{String(auth.isLoading)}</strong></div>
            <div>👤 User: <strong>{auth.user?.name || 'null'}</strong></div>
            <div>🔑 Permissions: <strong>{auth.permissions?.length || 0}</strong></div>
          </div>
        </div>
        
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Log de Mudanças:</div>
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: '6px',
            borderRadius: '3px',
            maxHeight: '100px',
            overflow: 'auto',
            fontSize: '10px'
          }}>
            {authLogs.map((log, index) => (
              <div key={index} style={{ marginBottom: '1px' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '8px', 
        fontSize: '10px', 
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        💡 Objetivo: Detectar se mudanças no useAuth estão causando remount dos componentes
      </div>
    </div>
  )
}

export default AuthStateMonitor
