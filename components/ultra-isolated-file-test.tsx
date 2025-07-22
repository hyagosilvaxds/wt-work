import React from 'react'

const UltraIsolatedFileTest = () => {
  const [file, setFile] = React.useState<File | null>(null)
  const [log, setLog] = React.useState<string[]>([])
  
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLog(prev => [...prev, `${timestamp}: ${message}`])
  }

  React.useEffect(() => {
    addLog('Componente montado')
    return () => addLog('Componente desmontado')
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addLog('handleFileChange executado')
    e.preventDefault()
    e.stopPropagation()
    
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      addLog(`Arquivo selecionado: ${selectedFile.name}`)
      setFile(selectedFile)
    }
  }

  return (
    <div style={{
      border: '3px solid red',
      padding: '20px',
      margin: '20px',
      backgroundColor: '#fff',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ color: 'red', margin: '0 0 15px 0' }}>
        🚨 TESTE ULTRA ISOLADO - SEM DEPS EXTERNAS
      </h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Selecionar arquivo:
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          style={{
            padding: '8px',
            border: '2px solid #333',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>

      {file && (
        <div style={{
          backgroundColor: '#e8f5e8',
          padding: '10px',
          border: '1px solid green',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <strong>Arquivo:</strong> {file.name}<br />
          <strong>Tamanho:</strong> {(file.size / 1024).toFixed(2)} KB
        </div>
      )}

      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        maxHeight: '200px',
        overflow: 'auto'
      }}>
        <strong>Log de eventos:</strong>
        {log.map((entry, index) => (
          <div key={index} style={{ fontSize: '12px', marginTop: '2px' }}>
            {entry}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>Objetivo:</strong> Verificar se o problema é do componente ou do contexto/layout
      </div>
    </div>
  )
}

export default UltraIsolatedFileTest
