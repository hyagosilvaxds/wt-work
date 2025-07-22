import React from 'react'

// Componente que usa portal para renderizar fora da árvore de componentes
const PortalFileInput = () => {
  const [portalRoot, setPortalRoot] = React.useState<HTMLElement | null>(null)
  const [file, setFile] = React.useState<File | null>(null)
  
  React.useEffect(() => {
    // Criar um div fora da árvore de componentes do React
    const portalDiv = document.createElement('div')
    portalDiv.id = 'portal-file-input'
    portalDiv.style.cssText = `
      border: 4px solid #9c27b0;
      background-color: #f3e5f5;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      font-family: monospace;
    `
    document.body.appendChild(portalDiv)
    setPortalRoot(portalDiv)
    
    // Criar o conteúdo HTML diretamente no DOM
    portalDiv.innerHTML = `
      <div style="background-color: #9c27b0; color: white; padding: 8px; margin-bottom: 15px; border-radius: 4px; text-align: center; font-weight: bold;">
        🌀 PORTAL FILE INPUT - FORA DA ÁRVORE REACT
      </div>
      <div style="margin-bottom: 15px;">
        <div style="font-weight: bold; margin-bottom: 8px;">📂 Input de arquivo via Portal DOM:</div>
        <input type="file" id="portal-input" style="width: 100%; padding: 8px; border: 2px solid #9c27b0; border-radius: 4px; background-color: white;">
      </div>
      <div id="portal-status" style="background-color: #f0f0f0; padding: 8px; border-radius: 4px; font-size: 12px;">
        Status: Aguardando seleção...
      </div>
      <div style="margin-top: 10px; font-size: 11px; color: #666; text-align: center; font-style: italic;">
        💡 Este componente é renderizado fora da árvore React via DOM direto
      </div>
    `
    
    // Adicionar listener diretamente no DOM
    const input = portalDiv.querySelector('#portal-input') as HTMLInputElement
    const status = portalDiv.querySelector('#portal-status') as HTMLElement
    
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      
      if (file) {
        status.innerHTML = `
          <strong>✅ Arquivo selecionado:</strong><br>
          📁 Nome: ${file.name}<br>
          📊 Tamanho: ${(file.size / 1024).toFixed(2)} KB<br>
          🕒 Timestamp: ${new Date().toLocaleTimeString()}
        `
        status.style.backgroundColor = '#e8f5e8'
        status.style.border = '1px solid #4CAF50'
        
        console.log('🌀 Portal: Arquivo selecionado via DOM direto:', file.name)
      }
    }
    
    input.addEventListener('change', handleFileChange)
    
    return () => {
      input.removeEventListener('change', handleFileChange)
      document.body.removeChild(portalDiv)
    }
  }, [])
  
  // Este componente retorna null porque o conteúdo é renderizado via portal DOM
  return null
}

// Componente React isolado com ref estável
const IsolatedFileInputWithRef = React.memo(() => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const [id] = React.useState(() => `isolated-${Math.random().toString(36).substr(2, 9)}`)
  
  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🔒 Isolated: File change event')
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      console.log('🔒 Isolated: File selected:', selectedFile.name)
      setFile(selectedFile)
    }
  }, [])
  
  console.log('🔒 Isolated component render:', id)
  
  return (
    <div style={{
      border: '4px solid #2196f3',
      backgroundColor: '#e3f2fd',
      padding: '20px',
      margin: '20px 0',
      borderRadius: '8px',
      fontFamily: 'monospace'
    }}>
      <div style={{
        backgroundColor: '#2196f3',
        color: 'white',
        padding: '8px',
        marginBottom: '15px',
        borderRadius: '4px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        🔒 REACT ISOLADO COM REF ESTÁVEL
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          📂 Input com useRef:
        </div>
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '2px solid #2196f3',
            borderRadius: '4px',
            backgroundColor: 'white'
          }}
        />
      </div>
      
      {file && (
        <div style={{
          backgroundColor: '#e8f5e8',
          padding: '8px',
          border: '1px solid #4CAF50',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          ✅ <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
        </div>
      )}
      
      <div style={{
        marginTop: '10px',
        fontSize: '11px',
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        💡 ID: {id} - Componente memoizado com ref estável
      </div>
    </div>
  )
})

IsolatedFileInputWithRef.displayName = 'IsolatedFileInputWithRef'

const AntiRemountFileInput = () => {
  return (
    <div>
      <PortalFileInput />
      <IsolatedFileInputWithRef />
    </div>
  )
}

export default AntiRemountFileInput
