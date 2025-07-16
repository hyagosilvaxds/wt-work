"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, UserPlus } from "lucide-react"
import { 
  getLightInstructors, 
  uploadSignature,
  linkUserToInstructor
} from "@/lib/api/superadmin"
import { toast } from "sonner"

interface Instructor {
  id: string
  name: string
  email: string | null
}

interface SignatureUploadFromInstructorModalProps {
  onSignatureUploaded: () => void
}

export function SignatureUploadFromInstructorModal({ onSignatureUploaded }: SignatureUploadFromInstructorModalProps) {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [selectedInstructorId, setSelectedInstructorId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loadingInstructors, setLoadingInstructors] = useState(false)
  const [open, setOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Buscar instrutores quando o modal abrir
  useEffect(() => {
    if (open) {
      fetchInstructors()
    }
  }, [open])

  const fetchInstructors = async () => {
    try {
      setLoadingInstructors(true)
      const response = await getLightInstructors()
      setInstructors(response)
    } catch (error) {
      console.error('Erro ao buscar instrutores:', error)
      toast.error('Erro ao carregar instrutores')
    } finally {
      setLoadingInstructors(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        // Verificar tamanho do arquivo (5MB máximo)
        const maxSize = 5 * 1024 * 1024 // 5MB em bytes
        if (selectedFile.size > maxSize) {
          toast.error('Arquivo muito grande. Tamanho máximo: 5MB')
          return
        }
        
        setFile(selectedFile)
        const url = URL.createObjectURL(selectedFile)
        setPreviewUrl(url)
      } else {
        toast.error('Apenas arquivos de imagem são permitidos')
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedInstructorId) {
      toast.error('Selecione um instrutor')
      return
    }

    if (!file) {
      toast.error('Selecione um arquivo para fazer upload')
      return
    }

    try {
      setUploading(true)
      
      // Atualiza o toast para mostrar o progresso
      toast.info('Enviando imagem para o servidor...')
      
      await uploadSignature(selectedInstructorId, file)
      toast.success('Assinatura enviada com sucesso!')
      onSignatureUploaded()
      setOpen(false)
      resetForm()
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      toast.error('Erro ao fazer upload da assinatura')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedInstructorId("")
    setFile(null)
    setPreviewUrl(null)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Nova Assinatura
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Fazer Upload de Assinatura</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label htmlFor="instructor">Instrutor</Label>
            <Select value={selectedInstructorId} onValueChange={setSelectedInstructorId}>
              <SelectTrigger>
                <SelectValue placeholder={loadingInstructors ? "Carregando..." : "Selecione um instrutor"} />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((instructor) => (
                  <SelectItem key={instructor.id} value={instructor.id}>
                    {instructor.name} {instructor.email && `(${instructor.email})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="signature">Arquivo de Assinatura</Label>
            <Input
              id="signature"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-sm text-gray-500 mt-1">
              Formatos aceitos: PNG, JPG, JPEG. Tamanho máximo: 5MB.
            </p>
          </div>

          {previewUrl && (
            <div className="border rounded-lg p-4">
              <Label>Prévia:</Label>
              <div className="mt-2 flex justify-center">
                <img 
                  src={previewUrl} 
                  alt="Prévia da assinatura" 
                  className="max-w-full max-h-48 object-contain border rounded"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={!selectedInstructorId || !file || uploading}
              className="flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <span>Fazer Upload</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface InstructorWithoutUserModalProps {
  onUserLinked: () => void
}

export function InstructorWithoutUserModal({ onUserLinked }: InstructorWithoutUserModalProps) {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [selectedInstructorId, setSelectedInstructorId] = useState("")
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    bio: ""
  })
  const [linking, setLinking] = useState(false)
  const [loadingInstructors, setLoadingInstructors] = useState(false)
  const [open, setOpen] = useState(false)

  // Buscar instrutores quando o modal abrir
  useEffect(() => {
    if (open) {
      fetchInstructors()
    }
  }, [open])

  const fetchInstructors = async () => {
    try {
      setLoadingInstructors(true)
      const response = await getLightInstructors()
      // Filtrar apenas instrutores que não têm usuário vinculado
      const instructorsWithoutUser = response.filter((instructor: any) => !instructor.userId)
      setInstructors(instructorsWithoutUser)
    } catch (error) {
      console.error('Erro ao buscar instrutores:', error)
      toast.error('Erro ao carregar instrutores')
    } finally {
      setLoadingInstructors(false)
    }
  }

  const handleLinkUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedInstructorId) {
      toast.error('Selecione um instrutor')
      return
    }

    if (!userData.name || !userData.email || !userData.password) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      setLinking(true)
      await linkUserToInstructor({
        instructorId: selectedInstructorId,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        bio: userData.bio || undefined,
        isActive: true
      })
      
      toast.success('Usuário vinculado ao instrutor com sucesso!')
      onUserLinked()
      setOpen(false)
      resetForm()
    } catch (error) {
      console.error('Erro ao vincular usuário:', error)
      toast.error('Erro ao vincular usuário ao instrutor')
    } finally {
      setLinking(false)
    }
  }

  const resetForm = () => {
    setSelectedInstructorId("")
    setUserData({
      name: "",
      email: "",
      password: "",
      bio: ""
    })
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Conectar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Conectar Usuário ao Instrutor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLinkUser} className="space-y-4">
          <div>
            <Label htmlFor="instructor">Instrutor</Label>
            <Select value={selectedInstructorId} onValueChange={setSelectedInstructorId}>
              <SelectTrigger>
                <SelectValue placeholder={loadingInstructors ? "Carregando..." : "Selecione um instrutor"} />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((instructor) => (
                  <SelectItem key={instructor.id} value={instructor.id}>
                    {instructor.name} {instructor.email && `(${instructor.email})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {instructors.length === 0 && !loadingInstructors && (
              <p className="text-sm text-gray-500 mt-1">
                Todos os instrutores já possuem usuários vinculados.
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="name">Nome do Usuário *</Label>
            <Input
              id="name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              placeholder="Nome completo"
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <Label htmlFor="password">Senha *</Label>
            <Input
              id="password"
              type="password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio (opcional)</Label>
            <Input
              id="bio"
              value={userData.bio}
              onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
              placeholder="Biografia do instrutor"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={linking}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={!selectedInstructorId || !userData.name || !userData.email || !userData.password || linking}
            >
              {linking ? 'Conectando...' : 'Conectar Usuário'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
