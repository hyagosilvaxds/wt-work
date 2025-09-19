"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Camera,
  Upload,
  Trash2,
  Edit,
  Download,
  Image as ImageIcon,
  Loader2,
  X,
  Save,
  ImageOff
} from "lucide-react"
import { 
  uploadClassPhoto, 
  getClassPhotos, 
  updateClassPhotoCaption, 
  deleteClassPhoto,
  type ClassPhoto 
} from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface ClassPhotosModalProps {
  isOpen: boolean
  onClose: () => void
  turma: {
    id: string
    training: {
      title: string
    }
  } | null
  readOnly?: boolean
}

export function ClassPhotosModal({ isOpen, onClose, turma, readOnly = false }: ClassPhotosModalProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [photos, setPhotos] = useState<ClassPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [uploadCaption, setUploadCaption] = useState("Parte Prática")
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null)
  const [editingCaption, setEditingCaption] = useState("")

  // Carregar fotos da turma
  const loadPhotos = async () => {
    if (!turma) return
    
    setLoading(true)
    try {
      const photosData = await getClassPhotos(turma.id)
      setPhotos(photosData)
    } catch (error: any) {
      console.error('Erro ao carregar fotos:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar fotos da turma",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && turma) {
      loadPhotos()
    }
  }, [isOpen, turma])

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem",
          variant: "destructive"
        })
        return
      }
      
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "Arquivo muito grande. Máximo 5MB",
          variant: "destructive"
        })
        return
      }
      
      setSelectedPhoto(file)
    }
  }

  // Upload de foto
  const handleUpload = async () => {
    if (!selectedPhoto || !turma) return
    
    setUploading(true)
    try {
      await uploadClassPhoto(turma.id, selectedPhoto, uploadCaption)
      
      toast({
        title: "Sucesso",
        description: "Foto enviada com sucesso!",
        variant: "default"
      })
      
      // Reset form
      setSelectedPhoto(null)
      setUploadCaption("Parte Prática")
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Recarregar fotos
      await loadPhotos()
    } catch (error: any) {
      console.error('Erro no upload:', error)
      toast({
        title: "Erro",
        description: "Erro ao enviar foto",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  // Editar legenda
  const handleEditCaption = (photo: ClassPhoto) => {
    setEditingPhoto(photo.id)
    setEditingCaption(photo.caption || "")
  }

  // Salvar legenda editada
  const handleSaveCaption = async (photoId: string) => {
    try {
      await updateClassPhotoCaption(photoId, editingCaption)
      
      toast({
        title: "Sucesso",
        description: "Legenda atualizada com sucesso!",
        variant: "default"
      })
      
      setEditingPhoto(null)
      setEditingCaption("")
      
      // Recarregar fotos
      await loadPhotos()
    } catch (error: any) {
      console.error('Erro ao atualizar legenda:', error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar legenda",
        variant: "destructive"
      })
    }
  }

  // Remover foto
  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Tem certeza que deseja remover esta foto?')) return
    
    try {
      await deleteClassPhoto(photoId)
      
      toast({
        title: "Sucesso",
        description: "Foto removida com sucesso!",
        variant: "default"
      })
      
      // Recarregar fotos
      await loadPhotos()
    } catch (error: any) {
      console.error('Erro ao remover foto:', error)
      toast({
        title: "Erro",
        description: "Erro ao remover foto",
        variant: "destructive"
      })
    }
  }

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingPhoto(null)
    setEditingCaption("")
  }

  // Download da foto
  const handleDownloadPhoto = (photo: ClassPhoto) => {
    const link = document.createElement('a')
    link.href = `https://api.olimpustech.com/${photo.path}`
    link.download = `foto-turma-${photo.uploadedAt}`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const clearSelection = () => {
    setSelectedPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Registros Fotográficos - {turma?.training.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Área de Upload */}
          {!readOnly && (
            <div className="lg:col-span-1 space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Adicionar Foto</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG, GIF até 5MB
                    </p>
                  </div>
                
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Selecionar Foto
                  </Button>
                  
                  {selectedPhoto && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{selectedPhoto.name}</p>
                            <p className="text-xs text-gray-500">
                              {(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearSelection}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="caption">Legenda</Label>
                        <select
                          value={uploadCaption}
                          onChange={(e) => setUploadCaption(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Parte Prática">Parte Prática</option>
                          <option value="Parte Teórica">Parte Teórica</option>
                        </select>
                      </div>
                      
                      <Button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Enviar Foto
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Estatísticas */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Estatísticas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de fotos:</span>
                    <span className="font-medium">{photos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parte Prática:</span>
                    <span className="font-medium">
                      {photos.filter(p => p.caption === "Parte Prática").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parte Teórica:</span>
                    <span className="font-medium">
                      {photos.filter(p => p.caption === "Parte Teórica").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Galeria de Fotos */}
          <div className={readOnly ? "col-span-1" : "lg:col-span-2"}>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Galeria de Fotos</h3>
              <p className="text-sm text-gray-500">
                {photos.length} foto{photos.length !== 1 ? 's' : ''} registrada{photos.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <ScrollArea className="h-[500px]">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600">Carregando fotos...</span>
                </div>
              ) : photos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <ImageOff className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma foto registrada
                  </h3>
                  <p className="text-gray-600">
                    Comece adicionando fotos das atividades da turma.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {photos.map((photo) => {
                    console.log('📸 Path original:', photo.path, '| URL completa:', `https://api.olimpustech.com${photo.path}`, '| ID:', photo.id)
                    return (
                      <Card key={photo.id} className="overflow-hidden h-fit">
                        <div className="aspect-video relative bg-gray-100">
                          <img
                            src={`https://api.olimpustech.com/${photo.path}`}
                            alt={photo.caption || "Foto da turma"}
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute top-2 right-2">
                          <Badge 
                            variant={photo.caption === "Parte Prática" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {photo.caption || "Sem legenda"}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          {!readOnly && editingPhoto === photo.id ? (
                            <div className="space-y-2">
                              <select
                                value={editingCaption}
                                onChange={(e) => setEditingCaption(e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="Parte Prática">Parte Prática</option>
                                <option value="Parte Teórica">Parte Teórica</option>
                              </select>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveCaption(photo.id)}
                                >
                                  <Save className="h-3 w-3 mr-1" />
                                  Salvar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                {photo.caption || "Sem legenda"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(photo.uploadedAt)}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex gap-1 pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadPhoto(photo)}
                              className="flex-1"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            {!readOnly && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditCaption(photo)}
                                  disabled={editingPhoto === photo.id}
                                  className="flex-1"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeletePhoto(photo.id)}
                                  className="text-red-600 hover:text-red-700 flex-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
