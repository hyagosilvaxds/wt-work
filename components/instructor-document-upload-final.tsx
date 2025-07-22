import React, { useState, useCallback, useRef, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, FileText, X } from 'lucide-react'

const InstructorDocumentUploadFinal = React.memo(() => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const componentIdRef = useRef(`upload-final-${Math.random().toString(36).substr(2, 9)}`)

  console.log('🔄 [UploadFinal] Renderizando componente ID:', componentIdRef.current)

  // Memoizar handlers para evitar re-criação desnecessária
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 [UploadFinal] handleFileSelect chamado')
    event.preventDefault()
    event.stopPropagation()
    
    const file = event.target.files?.[0]
    if (file) {
      console.log('✅ [UploadFinal] Arquivo selecionado:', file.name)
      setSelectedFile(file)
    }
  }, [])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    console.log('🎯 [UploadFinal] handleDrop chamado')
    event.preventDefault()
    event.stopPropagation()
    
    const file = event.dataTransfer.files[0]
    if (file) {
      console.log('✅ [UploadFinal] Arquivo dropado:', file.name)
      setSelectedFile(file)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return
    
    console.log('🚀 [UploadFinal] Iniciando upload simulado de:', selectedFile.name)
    setIsUploading(true)
    setUploadProgress(0)

    // Simular upload com progresso
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadProgress(i)
    }

    setIsUploading(false)
    console.log('✅ [UploadFinal] Upload simulado concluído!')
    alert(`Upload de ${selectedFile.name} concluído com sucesso!`)
  }, [selectedFile])

  const handleRemoveFile = useCallback(() => {
    console.log('🗑️ [UploadFinal] Removendo arquivo')
    setSelectedFile(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleButtonClick = useCallback(() => {
    console.log('🖱️ [UploadFinal] Botão clicado')
    fileInputRef.current?.click()
  }, [])

  // Memoizar o JSX para evitar re-renders desnecessários
  const dropZoneContent = useMemo(() => (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-sm text-gray-600 mb-2">
        Arraste e solte um arquivo aqui ou
      </p>
      <Button 
        type="button"
        variant="outline" 
        onClick={handleButtonClick}
        className="mb-2"
      >
        Selecionar Arquivo
      </Button>
      <p className="text-xs text-gray-500">
        Máximo 10MB - PDF, DOC, DOCX, JPG, PNG
      </p>
    </div>
  ), [handleDrop, handleDragOver, handleButtonClick])

  const filePreview = useMemo(() => {
    if (!selectedFile) return null
    
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium text-sm">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {isUploading && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Enviando...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }, [selectedFile, isUploading, uploadProgress, handleRemoveFile])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Upload de Documento - Versão Final</h2>
        <p className="text-sm text-gray-600 mb-4">
          ID do componente: {componentIdRef.current}
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            id={`file-input-${componentIdRef.current}`}
          />
          
          {!selectedFile ? dropZoneContent : filePreview}

          {selectedFile && !isUploading && (
            <div className="mt-4 flex space-x-2">
              <Button onClick={handleUpload} className="flex-1">
                Enviar Documento
              </Button>
              <Button variant="outline" onClick={handleRemoveFile}>
                Cancelar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Info */}
      <div className="text-xs text-gray-500 p-3 bg-gray-100 rounded">
        <p><strong>Debug:</strong></p>
        <p>Arquivo selecionado: {selectedFile?.name || 'Nenhum'}</p>
        <p>Uploading: {isUploading ? 'Sim' : 'Não'}</p>
        <p>Progresso: {uploadProgress}%</p>
        <p>Timestamp: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  )
})

InstructorDocumentUploadFinal.displayName = 'InstructorDocumentUploadFinal'

export default InstructorDocumentUploadFinal
