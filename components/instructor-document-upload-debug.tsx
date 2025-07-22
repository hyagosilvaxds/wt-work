'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, X } from 'lucide-react'

export default function InstructorDocumentUploadDebug() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState({
    componentMounted: false,
    eventListeners: false,
    formSubmissions: 0
  })

  // Gerar ID único para evitar conflitos
  const [uniqueId] = useState(() => `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    console.log('🧪 InstructorDocumentUploadDebug: Componente montado com ID:', uniqueId)
    setDebugInfo(prev => ({ ...prev, componentMounted: true }))
    
    return () => {
      console.log('🧪 InstructorDocumentUploadDebug: Componente desmontado')
    }
  }, [uniqueId])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // Prevenir propagação e comportamento padrão
    event.stopPropagation()
    event.preventDefault()
    
    console.log('🧪 Arquivo selecionado:', event.target.files?.[0])
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setDebugInfo(prev => ({ ...prev, eventListeners: true }))
    }
  }, [])

  const handleRemoveFile = useCallback((event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    console.log('🧪 Arquivo removido')
    setSelectedFile(null)
  }, [])

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    console.log('🧪 Formulário submetido!')
    
    setDebugInfo(prev => ({ ...prev, formSubmissions: prev.formSubmissions + 1 }))
    setIsLoading(true)

    // Simular envio (apenas para teste)
    setTimeout(() => {
      console.log('🧪 Formulário enviado:', {
        file: selectedFile?.name,
        title,
        description,
        category
      })
      alert('Documento enviado com sucesso! (simulação)')
      
      // Limpar formulário
      setSelectedFile(null)
      setTitle('')
      setDescription('')
      setCategory('')
      setIsLoading(false)
    }, 2000)
  }, [selectedFile, title, description, category])

  return (
    <div className="w-full min-h-[600px] relative" style={{ isolation: 'isolate' }}>
      {/* Informações de debug no topo */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-1">🧪 Status do Componente:</h4>
        <div className="text-xs text-blue-700">
          <div>Montado: {debugInfo.componentMounted ? '✅' : '❌'}</div>
          <div>Events: {debugInfo.eventListeners ? '✅' : '❌'}</div>
          <div>Submissões: {debugInfo.formSubmissions}</div>
          <div>URL: {typeof window !== 'undefined' ? window.location.pathname : 'SSR'}</div>
        </div>
      </div>
      
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload de Documento - Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Upload de Arquivo */}
              <div className="space-y-2">
                <Label htmlFor={`file-upload-${uniqueId}`}>Arquivo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {!selectedFile ? (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Label htmlFor={`file-upload-${uniqueId}`} className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-500">
                            Clique para selecionar um arquivo
                          </span>
                          <Input
                            id={`file-upload-${uniqueId}`}
                            name={`file-upload-${uniqueId}`}
                            type="file"
                            className="hidden"
                            onChange={handleFileSelect}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Label>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        PDF, DOC, DOCX, JPG, PNG até 10MB
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium">{selectedFile.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
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
                  )}
                </div>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor={`title-${uniqueId}`}>Título do Documento</Label>
                <Input
                  id={`title-${uniqueId}`}
                  name={`title-${uniqueId}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Material de Apoio - Aula 1"
                  required
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor={`category-${uniqueId}`}>Categoria</Label>
                <select
                  id={`category-${uniqueId}`}
                  name={`category-${uniqueId}`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="material-apoio">Material de Apoio</option>
                  <option value="exercicios">Exercícios</option>
                  <option value="bibliografia">Bibliografia</option>
                  <option value="avaliacoes">Avaliações</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor={`description-${uniqueId}`}>Descrição (Opcional)</Label>
                <Textarea
                  id={`description-${uniqueId}`}
                  name={`description-${uniqueId}`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o conteúdo do documento..."
                  rows={3}
                />
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={!selectedFile || !title || !category || isLoading}
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('🧪 Botão clicado!', e)
                  }}
                >
                  {isLoading ? 'Enviando...' : 'Enviar Documento'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    console.log('🧪 Limpando formulário')
                    setSelectedFile(null)
                    setTitle('')
                    setDescription('')
                    setCategory('')
                  }}
                >
                  Limpar
                </Button>
              </div>
            </form>

            {/* Debug Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Debug - Estado do Formulário:</h3>
              <pre className="text-xs text-gray-600">
                {JSON.stringify({
                  uniqueId: uniqueId,
                  arquivo: selectedFile?.name || 'Nenhum arquivo selecionado',
                  tamanho: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'N/A',
                  titulo: title || 'Vazio',
                  categoria: category || 'Não selecionada',
                  descricao: description || 'Vazia',
                  formularioValido: !!(selectedFile && title && category),
                  componenteMontado: debugInfo.componentMounted,
                  eventListenersAtivos: debugInfo.eventListeners,
                  submissoes: debugInfo.formSubmissions,
                  url: typeof window !== 'undefined' ? window.location.pathname : 'SSR'
                }, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
