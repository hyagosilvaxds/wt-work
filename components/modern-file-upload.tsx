"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon, FileIcon, Check } from "lucide-react"
import { toast } from "sonner"

interface ModernFileUploadProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSize?: number // em bytes
  preview?: boolean
  disabled?: boolean
  className?: string
}

export function ModernFileUpload({
  onFileSelect,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB por padrão
  preview = true,
  disabled = false,
  className = ""
}: ModernFileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): boolean => {
    // Verificar tamanho
    if (file.size > maxSize) {
      toast.error(`Arquivo muito grande. Tamanho máximo: ${formatFileSize(maxSize)}`)
      return false
    }

    // Verificar tipo se accept for especificado
    if (accept && !file.type.match(accept.replace(/\*/g, '.*'))) {
      toast.error('Tipo de arquivo não permitido')
      return false
    }

    return true
  }

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!validateFile(selectedFile)) return

    setFile(selectedFile)
    onFileSelect(selectedFile)

    // Criar preview para imagens
    if (preview && selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }, [onFileSelect, preview, maxSize, accept])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [disabled, handleFileSelect])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input changed:', e.target.files)
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleClick = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }, [disabled])

  const handleRemoveFile = useCallback(() => {
    setFile(null)
    setPreviewUrl(null)
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onFileSelect])

  const getAcceptText = () => {
    if (accept === "image/*") return "PNG, JPG, JPEG"
    if (accept === "application/pdf") return "PDF"
    return accept
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {!file ? (
        <Card 
          className={`border-2 border-dashed transition-all cursor-pointer hover:border-gray-400 ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleClick(e)
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className={`rounded-full p-3 mb-4 ${
              isDragging ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Upload className={`h-8 w-8 ${
                isDragging ? 'text-blue-500' : 'text-gray-400'
              }`} />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                {isDragging ? 'Solte o arquivo aqui' : 'Arraste um arquivo ou clique para selecionar'}
              </p>
              <p className="text-sm text-gray-500">
                Formatos aceitos: {getAcceptText()}
              </p>
              <p className="text-xs text-gray-400">
                Tamanho máximo: {formatFileSize(maxSize)}
              </p>
            </div>

            {!isDragging && (
              <Button 
                variant="outline" 
                className="mt-4"
                disabled={disabled}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleClick(e)
                }}
                type="button"
              >
                Selecionar Arquivo
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              {/* Preview da imagem ou ícone */}
              <div className="flex-shrink-0">
                {previewUrl ? (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Informações do arquivo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.type}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Barra de progresso visual */}
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-green-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-full transition-all duration-500"></div>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Upload pronto</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
