"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Filter,
  FileText,
  Calendar,
  DollarSign,
  User,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings
} from "lucide-react"
import { BudgetCreateModal } from "./budget-create-modal"
import { BudgetDetailsModal } from "./budget-details-modal"
import { BudgetSettingsPage } from "./budget-settings-page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { listBudgets, getBudgetById, updateBudget, BudgetResponse, BudgetStatus } from '@/lib/api/budgets'

interface Training {
  id: string
  name: string
  price: number
  totalPrice?: number
}

interface Budget {
  id: string
  budgetNumber: string
  title?: string
  clientName: string
  clientEmail: string
  clientPhone: string
  companyName: string
  trainings: Training[]
  totalValue: number
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  createdAt: string
  expiresAt: string
  notes?: string
  attachments?: string[]
}

// Helper function to convert API response to component format
const mapBudgetResponse = (budget: BudgetResponse): Budget => ({
  id: budget.id,
  budgetNumber: budget.number,
  title: budget.title || budget.number,
  clientName: budget.clientName || 'N/A',
  clientEmail: 'N/A', // Not in API response, would need client data
  clientPhone: 'N/A', // Not in API response, would need client data
  companyName: budget.clientName || 'N/A', // Using clientName as fallback
  trainings: budget.items?.map(item => ({
    id: item.id,
    name: item.trainingTitle,
    price: item.unitPrice,
    totalPrice: item.totalPrice
  })) || [],
  totalValue: budget.totalValue,
  status: budget.status.toLowerCase() as 'pending' | 'approved' | 'rejected' | 'expired',
  createdAt: budget.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
  expiresAt: budget.expiresAt?.split('T')[0] || new Date().toISOString().split('T')[0],
  notes: budget.observations,
  attachments: []
})

const mockBudgets: Budget[] = [
  {
    id: "1",
    budgetNumber: "ORC-2024-001",
    clientName: "João Silva",
    clientEmail: "joao@empresa.com",
    clientPhone: "(11) 99999-9999",
    companyName: "Empresa ABC Ltda",
    trainings: [
      { id: "1", name: "NR-35 - Trabalho em Altura", price: 150 },
      { id: "2", name: "NR-10 - Segurança em Instalações Elétricas", price: 200 }
    ],
    totalValue: 350,
    status: "pending",
    createdAt: "2024-01-15",
    expiresAt: "2024-02-15",
    notes: "Cliente interessado em pacote para 20 funcionários"
  },
  {
    id: "2",
    budgetNumber: "ORC-2024-002",
    clientName: "Maria Santos",
    clientEmail: "maria@construtoraxy.com",
    clientPhone: "(11) 88888-8888",
    companyName: "Construtora XY",
    trainings: [
      { id: "3", name: "NR-18 - Condições de Segurança na Construção", price: 180 }
    ],
    totalValue: 180,
    status: "approved",
    createdAt: "2024-01-10",
    expiresAt: "2024-02-10"
  }
]

export function BudgetManagementPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<'management' | 'settings'>('management')

  // Load budgets from API
  const loadBudgets = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('[BudgetManagementPage] Loading budgets...')
      const budgetResponses = await listBudgets()
      console.log('[BudgetManagementPage] Loaded budgets:', budgetResponses)
      
      const mappedBudgets = budgetResponses.map(mapBudgetResponse)
      setBudgets(mappedBudgets)
      setFilteredBudgets(mappedBudgets)
    } catch (err) {
      console.error('[BudgetManagementPage] Error loading budgets:', err)
      setError('Erro ao carregar orçamentos')
    } finally {
      setLoading(false)
    }
  }

  // Load budgets on component mount
  useEffect(() => {
    loadBudgets()
  }, [])

  useEffect(() => {
    let filtered = budgets

    if (searchTerm) {
      filtered = filtered.filter(budget =>
        budget.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.budgetNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(budget => budget.status === statusFilter)
    }

    setFilteredBudgets(filtered)
  }, [budgets, searchTerm, statusFilter])

  const getStatusBadge = (status: Budget['status']) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const, icon: Clock },
      approved: { label: "Aprovado", variant: "default" as const, icon: CheckCircle },
      rejected: { label: "Rejeitado", variant: "destructive" as const, icon: XCircle },
      expired: { label: "Vencido", variant: "outline" as const, icon: AlertCircle }
    }

    const config = statusConfig[status] ?? {
      label: String(status || 'Desconhecido'),
      variant: 'secondary' as const,
      icon: AlertCircle
    }

    const Icon = config.icon || AlertCircle

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const handleViewDetails = async (budget: Budget) => {
    try {
      console.log('[BudgetManagementPage] Loading budget details for:', budget.id)
      const budgetDetails = await getBudgetById(budget.id)
      console.log('[BudgetManagementPage] Loaded budget details:', budgetDetails)
      
      const mappedBudget = mapBudgetResponse(budgetDetails)
      setSelectedBudget(mappedBudget)
      setIsDetailsModalOpen(true)
    } catch (err) {
      console.error('[BudgetManagementPage] Error loading budget details:', err)
      // Fallback to existing budget data
      setSelectedBudget(budget)
      setIsDetailsModalOpen(true)
    }
  }

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget)
    setIsCreateModalOpen(true)
  }

  const handleDelete = (budgetId: string) => {
    setBudgets(budgets.filter(b => b.id !== budgetId))
  }

  const handleDownloadPDF = (budget: Budget) => {
    // Gerar HTML do orçamento
    const html = generateBudgetHTML(budget)

    // Criar blob e fazer download
    const blob = new Blob([html], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `orcamento-${budget.budgetNumber}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)
  }

  const generateBudgetHTML = (budget: Budget): string => {
    const statusMap = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
      expired: 'Vencido'
    }

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orçamento ${budget.budgetNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
        .section { margin-bottom: 25px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .section-title { font-size: 16px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .trainings-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .trainings-table th, .trainings-table td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .trainings-table th { background-color: #f9fafb; font-weight: bold; }
        .total-row { font-weight: bold; background-color: #f3f4f6; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Work Treinamentos</div>
        <div>Orçamento ${budget.budgetNumber}</div>
        <div>Status: ${statusMap[budget.status]}</div>
    </div>

    <div class="section">
        <div class="section-title">Informações do Cliente</div>
        <div class="info-grid">
            <div><strong>Nome:</strong> ${budget.clientName}</div>
            <div><strong>E-mail:</strong> ${budget.clientEmail}</div>
            <div><strong>Empresa:</strong> ${budget.companyName}</div>
            <div><strong>Telefone:</strong> ${budget.clientPhone || 'Não informado'}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Treinamentos</div>
        <table class="trainings-table">
            <thead>
                <tr><th>Treinamento</th><th style="text-align: right;">Valor</th></tr>
            </thead>
            <tbody>
                ${budget.trainings.map(training => `
                    <tr>
                        <td>${training.name}</td>
                        <td style="text-align: right;">R$ ${training.price.toFixed(2).replace('.', ',')}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td><strong>Total</strong></td>
                    <td style="text-align: right;"><strong>R$ ${budget.totalValue.toFixed(2).replace('.', ',')}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>

    ${budget.notes ? `
    <div class="section">
        <div class="section-title">Observações</div>
        <div>${budget.notes}</div>
    </div>
    ` : ''}

    <div class="footer">
        <p>Work Treinamentos - Documento gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
        <p>Este orçamento é válido até ${new Date(budget.expiresAt).toLocaleDateString('pt-BR')}</p>
    </div>
</body>
</html>
    `
  }

  const getTotalStats = () => {
    const total = budgets.length
    const pending = budgets.filter(b => b.status === 'pending').length
    const approved = budgets.filter(b => b.status === 'approved').length
    const totalValue = budgets.reduce((sum, b) => sum + b.totalValue, 0)

    return { total, pending, approved, totalValue }
  }

  const stats = getTotalStats()

  // If on settings page, render the settings component
  if (currentPage === 'settings') {
    return (
      <div className="space-y-6">
        {/* Header with Back button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações de Orçamentos</h1>
            <p className="text-gray-600">Configure dados padrão para todos os orçamentos</p>
          </div>
          <Button onClick={() => setCurrentPage('management')} variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Voltar ao Gerenciamento
          </Button>
        </div>
        <BudgetSettingsPage />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Orçamentos</h1>
          <p className="text-gray-600">Gerencie propostas, acompanhe o status e gere relatórios</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCurrentPage('settings')} variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Orçamento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Orçamentos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(stats.totalValue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Buscar por cliente, empresa ou número do orçamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                  <SelectItem value="expired">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budgets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orçamentos</CardTitle>
          <CardDescription>
            Lista de todos os orçamentos com status e informações principais
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Carregando orçamentos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={loadBudgets} variant="outline">
                Tentar novamente
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Treinamentos</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Expira em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">{budget.budgetNumber}</TableCell>
                  <TableCell className="font-medium">{budget.title}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{budget.clientName}</div>
                      <div className="text-sm text-gray-500">{budget.clientEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{budget.companyName}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {budget.trainings.length} treinamento{budget.trainings.length !== 1 ? 's' : ''}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(budget.totalValue)}
                  </TableCell>
                  <TableCell>{getStatusBadge(budget.status)}</TableCell>
                  <TableCell>
                    {new Date(budget.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {new Date(budget.expiresAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(budget)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(budget)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadPDF(budget)}
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(budget.id)}
                        title="Excluir"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredBudgets.length === 0 && !loading && !error && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum orçamento encontrado</p>
            </div>
          )}
              </>
            )}
        </CardContent>
      </Card>

      {/* Modals */}
      <BudgetCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setSelectedBudget(null)
        }}
  // casting to any to bypass a structural typing mismatch for now
  budget={selectedBudget as any}
        onSave={async (budget) => {
          try {
            if (selectedBudget) {
              // Update existing budget - refresh list
              await loadBudgets()
            } else {
              // New budget created - refresh list
              await loadBudgets()
            }
            setIsCreateModalOpen(false)
            setSelectedBudget(null)
          } catch (err) {
            console.error('[BudgetManagementPage] Error saving budget:', err)
          }
        }}
      />

      <BudgetDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedBudget(null)
        }}
        budget={selectedBudget}
        onStatusChange={async (budgetId, newStatus) => {
          try {
            console.log('[BudgetManagementPage] Updating budget status:', budgetId, newStatus)
            
            // Map component status to API status
            const apiStatus = newStatus.toUpperCase() as BudgetStatus
            
            await updateBudget(budgetId, { status: apiStatus })
            
            // Refresh budgets list
            await loadBudgets()
            
            // Update selected budget if it's the one being changed
            if (selectedBudget && selectedBudget.id === budgetId) {
              setSelectedBudget({ ...selectedBudget, status: newStatus })
            }
          } catch (err) {
            console.error('[BudgetManagementPage] Error updating budget status:', err)
          }
        }}
      />
    </div>
  )
}