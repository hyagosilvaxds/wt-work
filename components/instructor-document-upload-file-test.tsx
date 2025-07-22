'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export default function InstructorDocumentUploadFileTest() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const componentId = useRef(`file-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    console.log('🔍 FILE-TEST:', logMessage)
    setDebugLogs(prev => [...prev.slice(-10), logMessage]) // Keep last 10 logs
  }, [])

  useEffect(() => {
    addLog('Componente montado com ID: ' + componentId.current)
    addLog('URL atual: ' + window.location.href)
    
    // Monitor de mudanças na URL
    const handlePopState = () => {
      addLog('ALERTA: PopState detectado - navegação ocorreu!')
    }
    
    const handleBeforeUnload = () => {
      addLog('ALERTA: BeforeUnload detectado - página vai recarregar!')
    }
    
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      addLog('Componente sendo desmontado')
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [addLog])

  // Handler do input file com máxima prevenção
  const handleFileSelect = useCallback((event: Event) => {
    addLog('=== INÍCIO handleFileSelect ===')
    addLog('Event type: ' + event.type)
    addLog('Event target: ' + (event.target as HTMLElement)?.tagName)
    
    // Múltiplas prevenções
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    
    addLog('Prevenções aplicadas')
    
    try {
      const input = event.target as HTMLInputElement
      const file = input.files?.[0]
      
      if (file) {
        addLog('Arquivo detectado: ' + file.name)
        addLog('Tamanho: ' + (file.size / 1024).toFixed(2) + ' KB')
        setSelectedFile(file)
        addLog('State atualizado com sucesso')
      } else {
        addLog('Nenhum arquivo selecionado')
      }
    } catch (error) {
      addLog('ERRO no handleFileSelect: ' + String(error))
    }
    
    addLog('=== FIM handleFileSelect ===')
    
    // Return false para máxima prevenção
    return false
  }, [addLog])

  // Handler do clique no botão
  const handleButtonClick = useCallback((event: React.MouseEvent) => {
    addLog('=== INÍCIO handleButtonClick ===')
    addLog('Button clicked, about to trigger file input')
    
    event.preventDefault()
    event.stopPropagation()
    
    try {
      if (fileInputRef.current) {
        addLog('Disparando click no input file')
        fileInputRef.current.click()
      } else {
        addLog('ERRO: fileInputRef.current é null')
      }
    } catch (error) {
      addLog('ERRO no handleButtonClick: ' + String(error))
    }
    
    addLog('=== FIM handleButtonClick ===')
    return false
  }, [addLog])

  // Effect para anexar o listener de forma nativa
  useEffect(() => {
    const inputElement = fileInputRef.current
    if (inputElement) {
      addLog('Anexando event listener nativo ao input file')
      
      // Remove qualquer listener existente
      inputElement.removeEventListener('change', handleFileSelect)
      
      // Adiciona o listener
      inputElement.addEventListener('change', handleFileSelect, { 
        passive: false,
        capture: true 
      })
      
      return () => {
        addLog('Removendo event listener do input file')
        inputElement.removeEventListener('change', handleFileSelect)
      }
    }
  }, [handleFileSelect, addLog])

  const clearLogs = () => {
    setDebugLogs([])
    addLog('Logs limpos')
  }

  const clearFile = () => {
    addLog('Limpando arquivo selecionado')
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff5f5',
      border: '2px solid #ff6b6b',
      borderRadius: '8px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#ffe0e0',
        border: '1px solid #ff6b6b',
        borderRadius: '6px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#c92a2a', fontSize: '18px', fontWeight: 'bold' }}>
          🔍 DIAGNÓSTICO DE RELOAD NO FILE INPUT
        </h2>
        <div style={{ fontSize: '12px', color: '#c92a2a' }}>
          <div>ID: {componentId.current}</div>
          <div>Arquivo: {selectedFile?.name || 'NENHUM SELECIONADO'}</div>
          <div>Status: {selectedFile ? '✅ SUCESSO' : '❌ AGUARDANDO'}</div>
        </div>
      </div>

      {/* File Selection Area */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        border: '2px dashed #ff6b6b'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>
          Teste de Seleção de Arquivo
        </h3>
        
        {!selectedFile ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
            <button
              type="button"
              onClick={handleButtonClick}
              style={{
                padding: '16px 32px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              🔍 TESTAR SELEÇÃO DE ARQUIVO
            </button>
            <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: '#666' }}>
              Clique no botão acima e observe se a página recarrega
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#e8f5e8',
            border: '2px solid #4caf50',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontWeight: 'bold', color: '#2e7d32', marginBottom: '8px' }}>
              SUCESSO! Arquivo selecionado sem reload
            </div>
            <div style={{ fontSize: '14px', color: '#2e7d32' }}>
              📄 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </div>
            <button
              type="button"
              onClick={clearFile}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Limpar e Testar Novamente
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
          // Não usar onChange aqui - usando addEventListener nativo
        />
      </div>

      {/* Debug Logs */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        padding: '16px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h4 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>
            🔍 Logs de Debug ({debugLogs.length})
          </h4>
          <button
            type="button"
            onClick={clearLogs}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Limpar Logs
          </button>
        </div>
        
        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          fontSize: '11px',
          fontFamily: 'monospace',
          backgroundColor: '#ffffff',
          border: '1px solid #e9ecef',
          borderRadius: '4px',
          padding: '8px'
        }}>
          {debugLogs.length === 0 ? (
            <div style={{ color: '#6c757d', fontStyle: 'italic' }}>
              Nenhum log ainda... Clique no botão de teste acima.
            </div>
          ) : (
            debugLogs.map((log, index) => (
              <div key={index} style={{ 
                marginBottom: '2px',
                color: log.includes('ERRO') || log.includes('ALERTA') ? '#dc3545' : '#495057'
              }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
