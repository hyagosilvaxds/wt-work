"use client"

import React from 'react'

// Componente de upload ultra simples para teste
const SimpleFileTest = () => {
  const [file, setFile] = React.useState<File | null>(null)
  const [renderCount, setRenderCount] = React.useState(0)
  
  React.useEffect(() => {
    setRenderCount(prev => prev + 1)
    console.log('SimpleFileTest renderizou:', renderCount + 1)
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🔥 ARQUIVO SELECIONADO:', e.target.files?.[0]?.name)
    e.preventDefault()
    e.stopPropagation()
    
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h1 style={{ color: 'red', fontSize: '32px' }}>🚨 TESTE ISOLADO COMPLETO</h1>
      <p>Renderizações: <strong>{renderCount}</strong></p>
      
      <div style={{ 
        border: '4px solid red', 
        padding: '30px', 
        margin: '30px 0',
        backgroundColor: '#ffe6e6' 
      }}>
        <h2>📁 Input de Arquivo:</h2>
        <input 
          type="file" 
          onChange={handleFileChange}
          style={{ 
            fontSize: '18px', 
            padding: '10px',
            border: '2px solid black',
            width: '400px'
          }}
        />
        
        {file && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#e6ffe6',
            border: '2px solid green'
          }}>
            <h3>✅ Arquivo Selecionado:</h3>
            <p><strong>Nome:</strong> {file.name}</p>
            <p><strong>Tamanho:</strong> {(file.size / 1024).toFixed(2)} KB</p>
            <p><strong>Timestamp:</strong> {new Date().toLocaleTimeString()}</p>
          </div>
        )}
      </div>
      
      <div style={{ color: '#666', fontSize: '14px' }}>
        <p>Esta página está completamente isolada:</p>
        <ul>
          <li>❌ Sem useAuth</li>
          <li>❌ Sem Sidebar</li>
          <li>❌ Sem Header</li>
          <li>❌ Sem ProtectedRoute</li>
          <li>❌ Sem contextos externos</li>
        </ul>
      </div>
    </div>
  )
}

export default function Home() {
  console.log('🏠 Página principal renderizada')
  
  return <SimpleFileTest />
}
