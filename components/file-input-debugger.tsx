import React from 'react'

// Componente que simula o comportamento exato do problema
const FileInputDebugger = () => {
  const [renderCount, setRenderCount] = React.useState(0)
  const [file, setFile] = React.useState<File | null>(null)
  const [logs, setLogs] = React.useState<string[]>([])
  
  // Contador de renders
  React.useEffect(() => {
    setRenderCount(prev => prev + 1)
    addLog('Componente re-renderizado')
  })

  const addLog = React.useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev.slice(-19), `${timestamp}: ${message}`]) // Manter apenas últimos 20 logs
  }, [])

  // Detectar quando o componente é montado/desmontado
  React.useEffect(() => {
    addLog('🟢 Componente MONTADO')
    return () => {
      console.log('🔴 Componente DESMONTADO')
    }
  }, [addLog])

  // Handler do file input com debug completo
  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    addLog('📂 handleFileChange EXECUTADO')
    console.log('📂 handleFileChange event:', e)
    
    // Prevenir comportamento padrão
    e.preventDefault()
    e.stopPropagation()
    
    addLog('🚫 preventDefault() e stopPropagation() executados')
    
    try {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) {
        addLog(`✅ Arquivo selecionado: ${selectedFile.name}`)
        setFile(selectedFile)
      } else {
        addLog('❌ Nenhum arquivo selecionado')
      }
    } catch (error) {
      addLog(`💥 ERRO: ${error}`)
    }
  }, [addLog])

  return (
    <div style={{
      border: '4px solid #ff4444',
      backgroundColor: '#fff5f5',
      padding: '20px',
      margin: '20px 0',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '13px'
    }}>
      <div style={{ 
        backgroundColor: '#ff4444', 
        color: 'white', 
        padding: '8px', 
        marginBottom: '15px',
        borderRadius: '4px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        🚨 DEBUGGER DE FILE INPUT - DETECÇÃO DE REMOUNT
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {/* Status do componente */}
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            📊 Status do Componente:
          </div>
          <div style={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '4px' }}>
            <div>🔄 Renders: <strong>{renderCount}</strong></div>
            <div>📁 Arquivo: <strong>{file?.name || 'Nenhum'}</strong></div>
            <div>🕒 Timestamp: <strong>{new Date().toLocaleTimeString()}</strong></div>
          </div>
        </div>

        {/* Input de arquivo */}
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
            📂 Teste de Arquivo:
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '2px solid #ff4444',
              borderRadius: '4px',
              backgroundColor: 'white'
            }}
          />
          {file && (
            <div style={{ 
              marginTop: '8px', 
              padding: '6px', 
              backgroundColor: '#e8f5e8', 
              border: '1px solid #4CAF50',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              ✅ <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>
      </div>

      {/* Log de eventos */}
      <div style={{ marginTop: '15px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
          📝 Log de Eventos (últimos 20):
        </div>
        <div style={{
          backgroundColor: '#f8f8f8',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '8px',
          maxHeight: '150px',
          overflow: 'auto',
          fontSize: '11px'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: '#666', fontStyle: 'italic' }}>Nenhum evento ainda...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ 
                marginBottom: '2px',
                color: log.includes('ERRO') ? '#ff0000' : 
                       log.includes('MONTADO') ? '#008000' : 
                       log.includes('selecionado') ? '#0066cc' : '#333'
              }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ 
        marginTop: '10px', 
        fontSize: '11px', 
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        💡 Objetivo: Detectar se o componente está sendo remontado durante a seleção de arquivo
      </div>
    </div>
  )
}

export default FileInputDebugger
