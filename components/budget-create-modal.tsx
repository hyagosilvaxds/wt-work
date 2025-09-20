"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Trash2,
  Upload,
  FileText,
  User,
  Building,
  Calendar,
  DollarSign,
  X,
  Search
} from "lucide-react"

import { createBudget, updateBudget, CreateBudgetRequest, UpdateBudgetRequest } from '@/lib/api/budgets'
import { getClients, getTrainings } from '@/lib/api/superadmin'

interface Training {
  id: string
  title: string
  description?: string
  durationHours: number
  programContent?: string
  isActive: boolean
  validityDays?: number
}

interface Client {
  id: string
  name: string
  email?: string
  corporateName?: string
  personType?: 'FISICA' | 'JURIDICA'
  cpf?: string
  cnpj?: string
  isActive?: boolean
}

interface BudgetItem {
  id?: string // frontend-only unique id for duplicate items
  trainingId: string
  quantity: number
  unitPrice?: number
  totalPrice: number
  description?: string
  observations?: string
  order?: number
  location?: string
  studentQuantity?: number
  classQuantity?: number
}

interface Budget {
  id: string
  budgetNumber: string
  clientName: string
  clientEmail: string
  clientPhone: string
  companyName: string
  items: BudgetItem[]
  totalValue: number
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  createdAt: string
  expiresAt: string
  notes?: string
  attachments?: string[]
}

interface BudgetCreateModalProps {
  isOpen: boolean
  onClose: () => void
  budget?: Budget | null
  onSave: (budget: Budget) => void
}

export function BudgetCreateModal({ isOpen, onClose, budget, onSave }: BudgetCreateModalProps) {
  const [formData, setFormData] = useState<CreateBudgetRequest>({
    title: "",
    description: "",
    clientId: "",
    validityDays: 30,
    observations: "",
    coverPageId: "",
    backCoverPageId: "",
    trainingDate: "",
    dueDate: "",
    attentionTo: "",
    sector: "",
    instructors: "",
    responsibilities: "",
    clientResponsibilities: "",
    location: "",
    items: []
  })

  const [selectedItems, setSelectedItems] = useState<BudgetItem[]>([])
  const [clientSearch, setClientSearch] = useState("")
  const [trainingSearch, setTrainingSearch] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loadingTrainings, setLoadingTrainings] = useState(false)

  const isEditing = !!budget

  // Função para buscar clientes da API
  const searchClients = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setClients([])
      return
    }

    setLoadingClients(true)
    try {
      const response = await getClients(1, 10, searchTerm)
      setClients(response.clients || [])
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      setClients([])
    } finally {
      setLoadingClients(false)
    }
  }

  // Função para buscar treinamentos da API
  const searchTrainings = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setTrainings([])
      return
    }

    setLoadingTrainings(true)
    try {
      const response = await getTrainings(1, 10, searchTerm)
      setTrainings(response.trainings || [])
    } catch (error) {
      console.error('Erro ao buscar treinamentos:', error)
      setTrainings([])
    } finally {
      setLoadingTrainings(false)
    }
  }

  // Efeito para buscar clientes quando o termo de busca muda
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (clientSearch) {
        searchClients(clientSearch)
      } else {
        setClients([])
      }
    }, 300) // Debounce de 300ms

    return () => clearTimeout(debounceTimer)
  }, [clientSearch])

  // Efeito para buscar treinamentos quando o termo de busca muda
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (trainingSearch) {
        searchTrainings(trainingSearch)
      } else {
        setTrainings([])
      }
    }, 300) // Debounce de 300ms

    return () => clearTimeout(debounceTimer)
  }, [trainingSearch])

  // Filtros para busca
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.corporateName && client.corporateName.toLowerCase().includes(clientSearch.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(clientSearch.toLowerCase())) ||
    (client.cpf && client.cpf.includes(clientSearch)) ||
    (client.cnpj && client.cnpj.includes(clientSearch))
  )

  // Filtros para treinamentos
  const filteredTrainings = trainings.filter(training =>
    training.title.toLowerCase().includes(trainingSearch.toLowerCase()) ||
    (training.description && training.description.toLowerCase().includes(trainingSearch.toLowerCase()))
  )

  useEffect(() => {
    if (isOpen) {
      if (budget) {
        // Mapear dados existentes para edição
        setFormData({
          title: budget.budgetNumber,
          description: budget.notes || "",
          clientId: "", // TODO: mapear do cliente
          validityDays: 30,
          observations: budget.notes || "",
          coverPageId: "",
          backCoverPageId: "",
          trainingDate: "",
          dueDate: budget.expiresAt,
          attentionTo: "",
          sector: "",
          instructors: "",
          responsibilities: "",
          clientResponsibilities: "",
          location: "",
          items: budget.items || []
        })
        setSelectedItems(budget.items || [])
        setAttachments(budget.attachments || [])
      } else {
        const today = new Date()
        const expireDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

        setFormData({
          title: `ORC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
          description: "",
          clientId: "",
          validityDays: 30,
          observations: "",
          coverPageId: "",
          backCoverPageId: "",
          trainingDate: "",
          dueDate: expireDate.toISOString().split('T')[0],
          attentionTo: "",
          sector: "",
          instructors: "",
          responsibilities: "",
          clientResponsibilities: "",
          location: "",
          items: []
        })
        setSelectedItems([])
        setAttachments([])
      }
    }
  }, [isOpen, budget])

  const handleInputChange = (field: keyof CreateBudgetRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleClientSelect = (clientId: string) => {
  setFormData(prev => ({ ...prev, clientId }))
  const client = clients.find(c => c.id === clientId) || null
  setSelectedClient(client)
  setClientSearch("")
  }

  const addTrainingItem = (trainingId: string) => {
    const training = trainings.find(t => t.id === trainingId)
  if (training) {
      const newItem: BudgetItem = {
    id: `${training.id}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    trainingId: training.id,
        quantity: 1,
        totalPrice: 0, // Usuário irá definir o valor total
        description: training.title,
        observations: "",
        order: selectedItems.length + 1,
        location: "",
        studentQuantity: 1,
        classQuantity: 1
      }
      
  setSelectedItems(prev => [...prev, newItem])
  setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }))
      setTrainingSearch("")
    }
  }

  const removeTrainingItem = (itemIdOrTrainingId: string) => {
    const updatedItems = selectedItems.filter(item => item.id !== itemIdOrTrainingId && item.trainingId !== itemIdOrTrainingId)
    setSelectedItems(updatedItems)
    setFormData(prev => ({ ...prev, items: updatedItems }))
  }

  const updateItemField = (itemId: string, field: keyof BudgetItem, value: string | number) => {
    const updatedItems = selectedItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value }

  // unitPrice is optional; we only keep totalPrice as the source of truth

        return updatedItem
      }
      return item
    })

    setSelectedItems(updatedItems)
    setFormData(prev => ({ ...prev, items: updatedItems }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const validFiles: string[] = []
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain'
      ]

      Array.from(files).forEach(file => {
        if (file.size > maxSize) {
          alert(`Arquivo ${file.name} é muito grande. Máximo 10MB.`)
          return
        }

        if (!allowedTypes.includes(file.type)) {
          alert(`Tipo de arquivo não permitido: ${file.name}`)
          return
        }

        validFiles.push(file.name)
      })

      if (validFiles.length > 0) {
        setAttachments(prev => [...prev, ...validFiles])
      }
    }
  }

  const removeAttachment = (filename: string) => {
    setAttachments(prev => prev.filter(f => f !== filename))
  }

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
  }

  const handleSave = async () => {
    try {
      console.log('[BudgetCreateModal] Saving budget...')
      
      if (isEditing && budget) {
        // Update existing budget
        const updateData: UpdateBudgetRequest = {
          ...formData,
          items: selectedItems.map(({ id, totalPrice, unitPrice, ...rest }) => ({
            ...rest,
            customValue: totalPrice
          }))
        }
        
        console.log('[BudgetCreateModal] Updating budget:', budget.id, updateData)
        await updateBudget(budget.id, updateData)
        
      } else {
        // Create new budget
        const createData: CreateBudgetRequest = {
          ...formData,
          items: selectedItems.map(({ id, totalPrice, unitPrice, ...rest }) => ({
            ...rest,
            customValue: totalPrice
          }))
        }
        
        console.log('[BudgetCreateModal] Creating budget:', createData)
        await createBudget(createData)
      }
      
      // Call the parent onSave callback
      const selectedClient = clients.find(c => c.id === formData.clientId)
      const budgetData: Budget = {
        id: budget?.id || "",
        budgetNumber: formData.title,
        clientName: selectedClient?.name || "",
        clientEmail: selectedClient?.email || "",
        clientPhone: "", // Não disponível na API de clientes
        companyName: selectedClient?.corporateName || selectedClient?.name || "",
        items: selectedItems,
        totalValue: calculateTotal(),
        status: "pending", // Default status
        createdAt: budget?.createdAt || new Date().toISOString().split('T')[0],
        expiresAt: formData.dueDate || "",
        notes: formData.observations,
        attachments
      }
      
      onSave(budgetData)
      
    } catch (err) {
      console.error('[BudgetCreateModal] Error saving budget:', err)
      alert('Erro ao salvar orçamento. Tente novamente.')
    }
  }

  const isFormValid = () => {
    return formData.title &&
           formData.clientId &&
           selectedItems.length > 0 &&
           formData.dueDate
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isEditing ? "Editar Orçamento" : "Novo Orçamento"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações do orçamento"
              : "Preencha as informações para criar um novo orçamento"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas do Orçamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título do Orçamento *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Ex: ORC-2025-001"
                  />
                </div>
                <div>
                  <Label htmlFor="validityDays">Validade (dias)</Label>
                  <Input
                    id="validityDays"
                    type="number"
                    value={formData.validityDays || 30}
                    onChange={(e) => handleInputChange("validityDays", Number(e.target.value))}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Data de Vencimento *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="trainingDate">Data do Treinamento</Label>
                  <Input
                    id="trainingDate"
                    type="date"
                    value={formData.trainingDate}
                    onChange={(e) => handleInputChange("trainingDate", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descrição geral do orçamento..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Seleção de Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientSearch">Buscar Cliente</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="clientSearch"
                    placeholder="Busque por nome, empresa ou email..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {clientSearch && filteredClients.length > 0 && (
                  <div className="mt-2 border rounded-md max-h-40 overflow-y-auto">
                    {loadingClients ? (
                      <div className="p-3 text-center text-gray-500">
                        Buscando clientes...
                      </div>
                    ) : (
                      filteredClients.map((client) => (
                        <div
                          key={client.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => handleClientSelect(client.id)}
                        >
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-600">
                            {client.corporateName || (client.personType === 'JURIDICA' ? 'Empresa' : 'Pessoa Física')}
                          </div>
                          <div className="text-sm text-gray-500">{client.email || 'Sem email'}</div>
                          {client.cpf && <div className="text-xs text-gray-400">CPF: {client.cpf}</div>}
                          {client.cnpj && <div className="text-xs text-gray-400">CNPJ: {client.cnpj}</div>}
                        </div>
                      ))
                    )}
                  </div>
                )}
                {formData.clientId && selectedClient && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-md">
                    <div className="font-medium">{selectedClient.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedClient.corporateName || (selectedClient.personType === 'JURIDICA' ? 'Empresa' : 'Pessoa Física')}
                    </div>
                    <div className="text-sm text-gray-500">{selectedClient.email || 'Sem email'}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações Detalhadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Informações Detalhadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="attentionTo">A/C (Atenção para)</Label>
                  <Input
                    id="attentionTo"
                    value={formData.attentionTo}
                    onChange={(e) => handleInputChange("attentionTo", e.target.value)}
                    placeholder="Nome do responsável"
                  />
                </div>
                <div>
                  <Label htmlFor="sector">Setor</Label>
                  <Input
                    id="sector"
                    value={formData.sector}
                    onChange={(e) => handleInputChange("sector", e.target.value)}
                    placeholder="Setor/Departamento"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Local do treinamento"
                  />
                </div>
                <div>
                  <Label htmlFor="instructors">Instrutores</Label>
                  <Input
                    id="instructors"
                    value={formData.instructors}
                    onChange={(e) => handleInputChange("instructors", e.target.value)}
                    placeholder="Nome dos instrutores"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="responsibilities">Responsabilidades da Empresa</Label>
                <Textarea
                  id="responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => handleInputChange("responsibilities", e.target.value)}
                  placeholder="Responsabilidades da empresa prestadora..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="clientResponsibilities">Responsabilidades do Cliente</Label>
                <Textarea
                  id="clientResponsibilities"
                  value={formData.clientResponsibilities}
                  onChange={(e) => handleInputChange("clientResponsibilities", e.target.value)}
                  placeholder="Responsabilidades do cliente..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Treinamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Treinamentos *
              </CardTitle>
              <CardDescription>
                Selecione os treinamentos e configure quantidades e preços
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="trainingSearch">Buscar Treinamento</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="trainingSearch"
                    placeholder="Busque por nome ou descrição do treinamento..."
                    value={trainingSearch}
                    onChange={(e) => setTrainingSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {trainingSearch && filteredTrainings.length > 0 && (
                  <div className="mt-2 border rounded-md max-h-40 overflow-y-auto">
                    {loadingTrainings ? (
                      <div className="p-3 text-center text-gray-500">
                        Buscando treinamentos...
                      </div>
                    ) : (
                      filteredTrainings
                        .map(training => (
                          <div
                            key={training.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                            onClick={() => addTrainingItem(training.id)}
                          >
                            <div className="font-medium">{training.title}</div>
                            <div className="text-sm text-gray-600">{training.description}</div>
                            <div className="text-sm text-blue-600 font-medium">
                              Duração: {training.durationHours}h
                              {training.validityDays && ` • Validade: ${training.validityDays} dias`}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                )}
              </div>

              {selectedItems.length > 0 && (
                <div className="space-y-3">
                  <Label>Treinamentos Selecionados</Label>
                  {selectedItems.map((item) => {
                    const training = trainings.find(t => t.id === item.trainingId)
                    return (
                      <div key={item.id || item.trainingId} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{training?.title || item.description}</p>
                            <p className="text-sm text-gray-600">{training?.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTrainingItem(item.id || item.trainingId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <Label>Quantidade</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItemField(item.id || item.trainingId, "quantity", Number(e.target.value))}
                            />
                          </div>
                          {/* unitPrice removed: only totalPrice (customValue) is used */}
                          <div>
                            <Label>Valor Total *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.totalPrice || 0}
                              onChange={(e) => updateItemField(item.id || item.trainingId, "totalPrice", Number(e.target.value))}
                              placeholder="Digite o valor total"
                            />
                          </div>
                          <div>
                            <Label>Ordem</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.order || 1}
                              onChange={(e) => updateItemField(item.id || item.trainingId, "order", Number(e.target.value))}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label>Local do Treinamento</Label>
                            <Input
                              value={item.location || ""}
                              onChange={(e) => updateItemField(item.id || item.trainingId, "location", e.target.value)}
                              placeholder="Local onde será realizado"
                            />
                          </div>
                          <div>
                            <Label>Quantidade de Alunos</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.studentQuantity || 1}
                              onChange={(e) => updateItemField(item.id || item.trainingId, "studentQuantity", Number(e.target.value))}
                            />
                          </div>
                          <div>
                            <Label>Quantidade de Turmas</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.classQuantity || 1}
                              onChange={(e) => updateItemField(item.id || item.trainingId, "classQuantity", Number(e.target.value))}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Observações do Item</Label>
                          <Textarea
                            value={item.observations || ""}
                            onChange={(e) => updateItemField(item.id || item.trainingId, "observations", e.target.value)}
                            placeholder="Observações específicas deste item..."
                            rows={2}
                          />
                        </div>
                      </div>
                    )
                  })}

                  <div className="flex justify-end pt-3 border-t">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Geral</p>
                      <p className="text-xl font-bold text-blue-600">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(calculateTotal())}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle>Observações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Observações adicionais sobre o orçamento..."
                value={formData.observations}
                onChange={(e) => handleInputChange("observations", e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Configurações Avançadas */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coverPageId">ID da Capa</Label>
                  <Input
                    id="coverPageId"
                    value={formData.coverPageId}
                    onChange={(e) => handleInputChange("coverPageId", e.target.value)}
                    placeholder="ID do template de capa"
                  />
                </div>
                <div>
                  <Label htmlFor="backCoverPageId">ID da Contracapa</Label>
                  <Input
                    id="backCoverPageId"
                    value={formData.backCoverPageId}
                    onChange={(e) => handleInputChange("backCoverPageId", e.target.value)}
                    placeholder="ID do template de contracapa"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isFormValid()}
            className="flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4" />
            {isEditing ? "Salvar Alterações" : "Criar Orçamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}