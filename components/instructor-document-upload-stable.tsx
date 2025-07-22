'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// Hook personalizado para evitar re-renders desnecessários
function useStableRef<T>(value: T): React.MutableRefObject<T> {
  const ref = useRef<T>(value)
  ref.current = value
  return ref
}

export default function InstructorDocumentUploadStable() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  
  // Refs estáveis que não causam re-render
  const fileInputRef = useRef<HTMLInputElement>(null)
  const componentIdRef = useRef(`stable-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const isUnmountingRef = useRef(false)

  const addLog = useCallback((message: string) => {
    if (isUnmountingRef.current) return
    
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    console.log('🔧 STABLE:', logMessage)
    
    setDebugLogs(prev => {
      if (isUnmountingRef.current) return prev
      return [...prev.slice(-15), logMessage]
    })
  }, [])

  // Effect de montagem único e estável
  useEffect(() => {
    if (mounted) return // Evita execução dupla
    
    setMounted(true)
    isUnmountingRef.current = false
    
    addLog('✅ Componente ESTÁVEL montado - ID: ' + componentIdRef.current)
    addLog('📍 URL: ' + window.location.href)
    addLog('🎯 Tentando criar file input estável...')

    return () => {
      isUnmountingRef.current = true
      addLog('⚠️ Componente sendo desmontado - verificar causa!')
    }
  }, [addLog, mounted])

  // File handler completamente isolado
  const handleFileChange = useCallback((event: Event) => {
    if (isUnmountingRef.current) return
    
    addLog('🔍 === FILE CHANGE START ===')
    addLog('📎 Event type: ' + event.type)
    
    // Máxima prevenção
    event.preventDefault()
    event.stopPropagation()
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation()
    }
    
    try {
      const input = event.target as HTMLInputElement
      const file = input.files?.[0]
      
      if (file) {
        addLog('✅ Arquivo capturado: ' + file.name)
        addLog('📏 Tamanho: ' + (file.size / 1024).toFixed(2) + ' KB')
        
        // Set state de forma estável
        setSelectedFile(prevFile => {
          if (prevFile?.name === file.name && prevFile?.size === file.size) {
            addLog('📝 Arquivo já selecionado, ignorando')
            return prevFile
          }
          addLog('💾 Atualizando state com novo arquivo')
          return file
        })
      } else {
        addLog('❌ Nenhum arquivo no event')
      }
    } catch (error) {
      addLog('💥 ERRO no handler: ' + String(error))
    }
    
    addLog('🔍 === FILE CHANGE END ===')
    return false
  }, [addLog])

  // Click handler estável
  const handleButtonClick = useCallback((event: React.MouseEvent) => {
    addLog('🖱️ === BUTTON CLICK START ===')
    
    event.preventDefault()
    event.stopPropagation()
    
    try {
      const input = fileInputRef.current
      if (input) {
        addLog('🎯 Disparando click no input')
        input.click()
        addLog('✅ Click disparado com sucesso')
      } else {
        addLog('❌ Input ref é null!')
      }
    } catch (error) {
      addLog('💥 ERRO no click: ' + String(error))
    }
    
    addLog('🖱️ === BUTTON CLICK END ===')
    return false
  }, [addLog])

  // Effect para anexar listener de forma super estável
  useEffect(() => {
    if (!mounted) return
    
    const input = fileInputRef.current
    if (!input) {
      addLog('⚠️ Input não encontrado para anexar listener')
      return
    }

    addLog('🔗 Anexando listener estável...')
    
    // Remove qualquer listener existente
    input.removeEventListener('change', handleFileChange, true)
    
    // Adiciona com configuração máxima de prevenção
    input.addEventListener('change', handleFileChange, {
      passive: false,
      capture: true,
      once: false
    })
    
    addLog('✅ Listener anexado com sucesso')

    return () => {
      if (input && !isUnmountingRef.current) {
        addLog('🔓 Removendo listener...')
        input.removeEventListener('change', handleFileChange, true)
      }
    }
  }, [mounted, handleFileChange, addLog])

  const clearFile = useCallback(() => {
    addLog('🗑️ Limpando arquivo...')
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    addLog('✅ Arquivo limpo')
  }, [addLog])

  const clearLogs = useCallback(() => {
    setDebugLogs([])
    addLog('🧹 Logs limpos')
  }, [addLog])

  // Prevent component unmounting
  const containerStyle = {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f0fff4',
    border: '3px solid #4caf50',
    borderRadius: '8px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    position: 'relative' as const
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{
        backgroundColor: '#e8f5e8',
        border: '2px solid #4caf50',
        borderRadius: '6px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#2e7d32', fontSize: '18px', fontWeight: 'bold' }}>
          🔧 COMPONENTE ESTÁVEL - ANTI-REMOUNT
        </h2>
        <div style={{ fontSize: '12px', color: '#2e7d32' }}>
          <div>🆔 ID: {componentIdRef.current}</div>
          <div>📁 Arquivo: {selectedFile?.name || 'AGUARDANDO SELEÇÃO'}</div>
          <div>🔄 Montado: {mounted ? '✅ SIM' : '❌ NÃO'}</div>
          <div>📊 Logs: {debugLogs.length}</div>
        </div>
      </div>

      {/* File Selection */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        border: '2px solid #4caf50',
        textAlign: 'center'
      }}>
        {!selectedFile ? (
          <div>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📁</div>
            <h3 style={{ margin: '0 0 16px 0', color: '#2e7d32' }}>
              Teste de Seleção ESTÁVEL
            </h3>
            <button
              type="button"
              onClick={handleButtonClick}
              style={{
                padding: '20px 40px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'transform 0.1s'
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              🔧 TESTAR SELEÇÃO ESTÁVEL
            </button>
            <p style={{ margin: '16px 0 0 0', fontSize: '14px', color: '#666' }}>
              Este componente deve permanecer montado durante a seleção
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#e8f5e8',
            border: '2px solid #4caf50',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#2e7d32' }}>
              SUCESSO! Arquivo selecionado sem remount
            </h3>
            <div style={{ fontSize: '16px', color: '#2e7d32', marginBottom: '16px' }}>
              📄 {selectedFile.name}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
              📏 Tamanho: {(selectedFile.size / 1024).toFixed(2)} KB
            </div>
            <button
              type="button"
              onClick={clearFile}
              style={{
                padding: '12px 24px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🔄 Testar Novamente
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
          key={componentIdRef.current} // Força estabilidade
        />
      </div>

      {/* Debug Panel */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #4caf50',
        borderRadius: '6px',
        padding: '16px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h4 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold', color: '#2e7d32' }}>
            🔧 Debug Logs Estáveis ({debugLogs.length})
          </h4>
          <button
            type="button"
            onClick={clearLogs}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Limpar
          </button>
        </div>
        
        <div style={{
          maxHeight: '250px',
          overflowY: 'auto',
          fontSize: '11px',
          fontFamily: 'monospace',
          backgroundColor: '#ffffff',
          border: '1px solid #4caf50',
          borderRadius: '4px',
          padding: '12px'
        }}>
          {debugLogs.length === 0 ? (
            <div style={{ color: '#666', fontStyle: 'italic' }}>
              Logs aparecerão aqui... Clique no botão verde para testar.
            </div>
          ) : (
            debugLogs.map((log, index) => (
              <div key={index} style={{ 
                marginBottom: '3px',
                color: log.includes('❌') || log.includes('💥') || log.includes('⚠️') 
                  ? '#d32f2f' 
                  : log.includes('✅') || log.includes('🎉')
                  ? '#2e7d32'
                  : '#333',
                fontWeight: log.includes('===') ? 'bold' : 'normal'
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
