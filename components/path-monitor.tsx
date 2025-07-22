import React from 'react'
import { usePathname } from 'next/navigation'

const PathMonitor = () => {
  const pathname = usePathname()
  const [logs, setLogs] = React.useState<string[]>([])
  const [renderCount, setRenderCount] = React.useState(0)
  
  React.useEffect(() => {
    setRenderCount(prev => prev + 1)
  })
  
  React.useEffect(() => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev.slice(-9), `${timestamp}: pathname = ${pathname}`])
    console.log('🛣️ Pathname changed:', pathname)
  }, [pathname])

  return (
    <div style={{
      border: '3px solid #e91e63',
      backgroundColor: '#fce4ec',
      padding: '15px',
      margin: '15px 0',
      borderRadius: '6px',
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      <div style={{
        backgroundColor: '#e91e63',
        color: 'white',
        padding: '6px',
        marginBottom: '10px',
        borderRadius: '3px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        🛣️ MONITOR DE PATHNAME - MUDANÇAS DE ROTA
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Status Atual:</div>
          <div style={{ backgroundColor: '#f5f5f5', padding: '6px', borderRadius: '3px', fontSize: '11px' }}>
            <div>🔄 Renders: <strong>{renderCount}</strong></div>
            <div>🛣️ Pathname: <strong>{pathname}</strong></div>
            <div>🔗 URL: <strong>{typeof window !== 'undefined' ? window.location.href : 'SSR'}</strong></div>
            <div>🔍 Hash: <strong>{typeof window !== 'undefined' ? window.location.hash : 'N/A'}</strong></div>
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
            {logs.map((log, index) => (
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
        💡 Objetivo: Detectar se mudanças no pathname estão disparando re-renders
      </div>
    </div>
  )
}

export default PathMonitor
