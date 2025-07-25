'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Combobox } from "@/components/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createClass, patchClass, type CreateClassData, type UpdateClassData, getTrainings, getInstructors, getClients } from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface Class {
  id: string
  trainingId: string
  instructorId: string
  startDate: Date | string
  endDate: Date | string
  type?: string
  recycling?: string
  status?: string
  location?: string
  clientId?: string
  observations?: string
}

interface ClassCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  classItem?: Class | null
}

export function ClassCreateModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  classItem 
}: ClassCreateModalProps) {
  const [formData, setFormData] = useState<CreateClassData & UpdateClassData>({
    trainingId: "",
    instructorId: "",
    startDate: "",
    endDate: "",
    type: "",
    recycling: "",
    status: "EM ABERTO",
    location: "",
    clientId: "",
    observations: "",
  })
  
  const [loading, setLoading] = useState(false)
  const [trainings, setTrainings] = useState<any[]>([])
  const [instructors, setInstructors] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const { toast } = useToast()

  const isEditing = !!classItem

  // Carregar dados necessários para os selects
  useEffect(() => {
    if (isOpen) {
      loadSelectData()
    }
  }, [isOpen])

  const loadSelectData = async () => {
    setLoadingData(true)
    try {
      console.log('Starting to load select data...')
      
      const [trainingsRes, instructorsRes, clientsRes] = await Promise.all([
        getTrainings(1, 100),
        getInstructors(1, 100),
        getClients(1, 100)
      ])
      
      console.log('Trainings response:', trainingsRes)
      console.log('Instructors response:', instructorsRes)
      console.log('Clients response:', clientsRes)
      
      // Extrair os dados corretamente baseado na estrutura retornada
      // Para treinamentos: pode vir como { trainings: [...] } ou { data: [...] }
      let trainingsData = []
      if (trainingsRes?.trainings) {
        trainingsData = trainingsRes.trainings
      } else if (trainingsRes?.data) {
        trainingsData = trainingsRes.data
      } else if (Array.isArray(trainingsRes)) {
        trainingsData = trainingsRes
      }
      
      // Para instrutores: pode vir como { instructors: [...] } ou { data: [...] }
      let instructorsData = []
      if (instructorsRes?.instructors) {
        instructorsData = instructorsRes.instructors
      } else if (instructorsRes?.data) {
        instructorsData = instructorsRes.data
      } else if (Array.isArray(instructorsRes)) {
        instructorsData = instructorsRes
      }
      
      // Para clientes: pode vir como { clients: [...] } ou { data: [...] }
      let clientsData = []
      if (clientsRes?.clients) {
        clientsData = clientsRes.clients
      } else if (clientsRes?.data) {
        clientsData = clientsRes.data
      } else if (Array.isArray(clientsRes)) {
        clientsData = clientsRes
      }
      
      setTrainings(trainingsData)
      setInstructors(instructorsData)
      setClients(clientsData)
      
      console.log('Final trainings array length:', trainingsData.length)
      console.log('Final instructors array length:', instructorsData.length)
      console.log('Final clients array length:', clientsData.length)
      console.log('Final trainings array:', trainingsData)
      console.log('Final instructors array:', instructorsData)
      console.log('Final clients array:', clientsData)
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error)
      
      // Mostrar erro mais específico baseado na resposta
      let errorMessage = "Erro ao carregar dados necessários"
      
      if (error.response?.status === 401) {
        errorMessage = "Sessão expirada. Faça login novamente."
      } else if (error.response?.status === 403) {
        errorMessage = "Você não tem permissão para acessar esses dados."
      } else if (error.response?.status === 404) {
        errorMessage = "Serviço não encontrado. Verifique se o servidor está rodando."
      } else if (!error.response) {
        errorMessage = "Erro de conexão. Verifique se o servidor está rodando."
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  // Funções de pesquisa para os comboboxes
  const searchTrainings = async (query: string) => {
    try {
      const response = await getTrainings(1, 50, query)
      let trainingsData = []
      if (response?.trainings) {
        trainingsData = response.trainings
      } else if (response?.data) {
        trainingsData = response.data
      } else if (Array.isArray(response)) {
        trainingsData = response
      }
      
      return trainingsData.map((training: any) => ({
        value: training.id,
        label: training.title
      }))
    } catch (error) {
      console.error('Erro ao pesquisar treinamentos:', error)
      return []
    }
  }

  const searchInstructors = async (query: string) => {
    try {
      const response = await getInstructors(1, 50, query)
      let instructorsData = []
      if (response?.instructors) {
        instructorsData = response.instructors
      } else if (response?.data) {
        instructorsData = response.data
      } else if (Array.isArray(response)) {
        instructorsData = response
      }
      
      return instructorsData.map((instructor: any) => ({
        value: instructor.id,
        label: instructor.name
      }))
    } catch (error) {
      console.error('Erro ao pesquisar instrutores:', error)
      return []
    }
  }

  const searchClients = async (query: string) => {
    try {
      const response = await getClients(1, 50, query)
      let clientsData = []
      if (response?.clients) {
        clientsData = response.clients
      } else if (response?.data) {
        clientsData = response.data
      } else if (Array.isArray(response)) {
        clientsData = response
      }
      
      return clientsData.map((client: any) => ({
        value: client.id,
        label: client.name
      }))
    } catch (error) {
      console.error('Erro ao pesquisar clientes:', error)
      return []
    }
  }

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (classItem && isOpen) {
      const formattedData = {
        trainingId: classItem.trainingId,
        instructorId: classItem.instructorId,
        startDate: formatDateTimeLocal(classItem.startDate),
        endDate: formatDateTimeLocal(classItem.endDate),
        type: classItem.type || "",
        recycling: classItem.recycling || "",
        status: classItem.status || "EM ABERTO",
        location: classItem.location || "",
        clientId: classItem.clientId || "",
        observations: classItem.observations || "",
      }
      setFormData(formattedData)
    } else if (!classItem && isOpen) {
      // Resetar formulário para criação
      setFormData({
        trainingId: "",
        instructorId: "",
        startDate: "",
        endDate: "",
        type: "",
        recycling: "",
        status: "EM ABERTO",
        location: "",
        clientId: "",
        observations: "",
      })
    }
  }, [classItem, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Formatar as datas corretamente, preservando o horário digitado pelo usuário
      const formatToISO = (dateString: string | Date) => {
        if (!dateString) return dateString
        
        // Se é uma string no formato datetime-local (YYYY-MM-DDTHH:mm)
        if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
          // Criar uma data interpretando como horário local
          const [datePart, timePart] = dateString.split('T')
          const [year, month, day] = datePart.split('-').map(Number)
          const [hour, minute] = timePart.split(':').map(Number)
          
          // Criar data no timezone local
          const localDate = new Date(year, month - 1, day, hour, minute, 0, 0)
          return localDate.toISOString()
        }
        
        // Para outros casos (edição), converte mantendo o horário
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
          return dateString
        }
        return date.toISOString()
      }

      const formattedData = {
        ...formData,
        startDate: formatToISO(formData.startDate),
        endDate: formatToISO(formData.endDate),
      }

      if (isEditing && classItem) {
        const result = await patchClass(classItem.id, formattedData)
        
        toast({
          title: "Sucesso",
          description: "Turma atualizada com sucesso!",
        })
      } else {
        const result = await createClass(formattedData)
        
        toast({
          title: "Sucesso",
          description: "Turma criada com sucesso!",
        })
      }
      
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erro ao salvar turma:', error)
      console.error('Erro details:', error.response?.data)
      console.error('Erro status:', error.response?.status)
      
      let errorMessage = "Erro ao salvar turma"
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage = "Dados inválidos. Verifique os campos obrigatórios."
      } else if (error.response?.status === 401) {
        errorMessage = "Sessão expirada. Faça login novamente."
      } else if (error.response?.status === 403) {
        errorMessage = "Você não tem permissão para realizar esta ação."
      } else if (error.response?.status === 404) {
        errorMessage = "Turma não encontrada."
      } else if (error.response?.status === 500) {
        errorMessage = "Erro interno do servidor. Tente novamente."
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDateTimeLocal = (date: Date | string) => {
    if (!date) return ""
    
    const d = new Date(date)
    
    // Verificar se a data é válida
    if (isNaN(d.getTime())) return ""
    
    // Converter para formato datetime-local preservando o horário local
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  if (loadingData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Carregando dados</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Carregando dados...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Turma" : "Criar Nova Turma"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize as informações da turma." : "Preencha as informações para criar uma nova turma."}
          </DialogDescription>
        </DialogHeader>

        {/* Alerta quando faltam dados necessários */}
        {!loadingData && (trainings.length === 0 || instructors.length === 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Dados necessários não encontrados
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Para criar uma turma, você precisa ter:</p>
                  <ul className="list-disc list-inside mt-1">
                    {trainings.length === 0 && <li>Pelo menos um treinamento cadastrado</li>}
                    {instructors.length === 0 && <li>Pelo menos um instrutor cadastrado</li>}
                  </ul>
                  <p className="mt-2">
                    Acesse as páginas de gerenciamento correspondentes para cadastrar esses dados primeiro.
                  </p>
                </div>
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={loadSelectData}
                    className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                  >
                    Tentar carregar novamente
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Treinamento */}
            <div className="space-y-2">
              <Label htmlFor="trainingId">Treinamento *</Label>
              <Combobox
                options={trainings.map(training => ({
                  value: training.id,
                  label: training.title
                }))}
                value={formData.trainingId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, trainingId: value }))}
                placeholder={trainings.length === 0 ? "Nenhum treinamento disponível" : "Selecione o treinamento"}
                searchPlaceholder="Pesquisar treinamentos..."
                emptyMessage="Nenhum treinamento encontrado."
                disabled={trainings.length === 0}
                loading={loadingData}
                onSearch={searchTrainings}
              />
            </div>

            {/* Instrutor */}
            <div className="space-y-2">
              <Label htmlFor="instructorId">Instrutor *</Label>
              <Combobox
                options={instructors.map(instructor => ({
                  value: instructor.id,
                  label: instructor.name
                }))}
                value={formData.instructorId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, instructorId: value }))}
                placeholder={instructors.length === 0 ? "Nenhum instrutor disponível" : "Selecione o instrutor"}
                searchPlaceholder="Pesquisar instrutores..."
                emptyMessage="Nenhum instrutor encontrado."
                disabled={instructors.length === 0}
                loading={loadingData}
                onSearch={searchInstructors}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente</Label>
              <Combobox
                options={clients.map(client => ({
                  value: client.id,
                  label: client.name
                }))}
                value={formData.clientId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}
                placeholder="Selecione o cliente (opcional)"
                searchPlaceholder="Pesquisar clientes..."
                emptyMessage="Nenhum cliente encontrado."
                loading={loadingData}
                onSearch={searchClients}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Data de Início */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formatDateTimeLocal(formData.startDate)}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>

            {/* Data de Fim */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Fim *</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formatDateTimeLocal(formData.endDate)}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Input
                id="type"
                type="text"
                placeholder="Tipo da aula"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              />
            </div>

            {/* Reciclagem */}
            <div className="space-y-2">
              <Label htmlFor="recycling">Reciclagem</Label>
              <Input
                id="recycling"
                type="text"
                placeholder="Informações de reciclagem"
                value={formData.recycling}
                onChange={(e) => setFormData(prev => ({ ...prev, recycling: e.target.value }))}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EM ABERTO">EM ABERTO</SelectItem>
                  <SelectItem value="CONCLUIDO">CONCLUÍDO</SelectItem>
                  <SelectItem value="CANCELADO">CANCELADO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Localização */}
          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              type="text"
              placeholder="Local da aula"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              placeholder="Observações sobre a turma"
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || trainings.length === 0 || instructors.length === 0}
            >
              {loading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
