'use client'

import { useState, useEffect, useRef } from 'react'

export default function InstructorDocumentUploadNoForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ID único baseado em timestamp
  const componentId = useRef(`no-form-upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    console.log('🧪 NO-FORM: Componente montado com ID:', componentId.current)
    return () => {
      console.log('🧪 NO-FORM: Componente desmontado')
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🧪 NO-FORM: handleFileChange chamado')
    e.stopPropagation()
    
    const file = e.target.files?.[0]
    if (file) {
      console.log('🧪 NO-FORM: Arquivo selecionado:', file.name)
      setSelectedFile(file)
    }
  }

  const handleFileButtonClick = (e: React.MouseEvent) => {
    console.log('🧪 NO-FORM: handleFileButtonClick chamado')
    e.preventDefault()
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const removeFile = (e: React.MouseEvent) => {
    console.log('🧪 NO-FORM: removeFile chamado')
    e.preventDefault()
    e.stopPropagation()
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const clearForm = (e: React.MouseEvent) => {
    console.log('🧪 NO-FORM: clearForm chamado')
    e.preventDefault()
    e.stopPropagation()
    setSelectedFile(null)
    setTitle('')
    setDescription('')
    setCategory('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.MouseEvent) => {
    console.log('🧪 NO-FORM: handleSubmit via botão - SEM FORM')
    e.preventDefault()
    e.stopPropagation()
    
    if (!selectedFile || !title || !category) {
      console.log('🧪 NO-FORM: Formulário inválido')
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsLoading(true)
    console.log('🧪 NO-FORM: Iniciando simulação')

    setTimeout(() => {
      console.log('🧪 NO-FORM: Envio concluído')
      alert('Upload simulado com sucesso! (SEM FORM)')
      
      // Reset
      setSelectedFile(null)
      setTitle('')
      setDescription('')
      setCategory('')
      setIsLoading(false)
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }, 2000)
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Debug Header */}
      <div style={{
        backgroundColor: '#e8f5e8',
        border: '1px solid #4caf50',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#2e7d32', fontSize: '14px', fontWeight: 'bold' }}>
          🧪 Versão SEM FORM - Teste Anti-Reload
        </h3>
        <div style={{ fontSize: '12px', color: '#2e7d32' }}>
          <div>ID: {componentId.current}</div>
          <div>Arquivo: {selectedFile?.name || 'Nenhum'}</div>
          <div>Título: {title || 'Vazio'}</div>
          <div>Categoria: {category || 'Não selecionada'}</div>
          <div>Método: Apenas botões (sem form)</div>
        </div>
      </div>

      {/* Container sem Form */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          margin: '0 0 24px 0',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📁 Upload SEM FORM - Anti-Reload
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* File Upload */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Arquivo
            </label>
            <div style={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#fafafa'
            }}>
              {!selectedFile ? (
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📁</div>
                  <button
                    type="button"
                    onClick={handleFileButtonClick}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4caf50',
                      cursor: 'pointer',
                      fontSize: '16px',
                      textDecoration: 'underline'
                    }}
                  >
                    Clique para selecionar um arquivo
                  </button>
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
                    PDF, DOC, DOCX, JPG, PNG até 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f0f0f0',
                  padding: '12px',
                  borderRadius: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>📄</span>
                    <span style={{ fontWeight: '500' }}>{selectedFile.name}</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '18px',
                      cursor: 'pointer',
                      color: '#666'
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Título do Documento
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Material de Apoio - Aula 1"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            >
              <option value="">Selecione uma categoria</option>
              <option value="material-apoio">Material de Apoio</option>
              <option value="exercicios">Exercícios</option>
              <option value="bibliografia">Bibliografia</option>
              <option value="avaliacoes">Avaliações</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Descrição (Opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o conteúdo do documento..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedFile || !title || !category || isLoading}
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: (!selectedFile || !title || !category || isLoading) ? '#ccc' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: (!selectedFile || !title || !category || isLoading) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Enviando SEM FORM...' : 'Enviar SEM FORM'}
            </button>
            <button
              type="button"
              onClick={clearForm}
              style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                color: '#666',
                border: '1px solid #ccc',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Debug Info */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '6px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <strong>Estado (SEM FORM):</strong>
          <pre style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify({
              componentId: componentId.current,
              arquivo: selectedFile?.name || 'Nenhum arquivo selecionado',
              tamanho: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'N/A',
              titulo: title || 'Vazio',
              categoria: category || 'Não selecionada',
              descricao: description || 'Vazia',
              formularioValido: !!(selectedFile && title && category),
              metodo: 'SEM FORM - apenas botões',
              url: typeof window !== 'undefined' ? window.location.pathname : 'SSR'
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
