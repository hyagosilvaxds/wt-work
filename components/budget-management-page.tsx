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
import { Button as PaginationButton } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { listBudgets, getBudgetById, updateBudget, generateBudgetPdf, getBudgetAnalyticsDashboard, BudgetResponse, BudgetStatus, DashboardAnalyticsResponse, BudgetListParams } from '@/lib/api/budgets'

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
  const [allBudgets, setAllBudgets] = useState<Budget[]>([]) // All budgets from API
  const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]) // Filtered budgets for display
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<'management' | 'settings'>('management')
  const [analytics, setAnalytics] = useState<DashboardAnalyticsResponse | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  // Client-side pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10
  })

  // Date filters
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Load analytics from API
  const loadAnalytics = async () => {
    try {
      setAnalyticsLoading(true)
      console.log('[BudgetManagementPage] Loading analytics...')
      const analyticsData = await getBudgetAnalyticsDashboard()
      console.log('[BudgetManagementPage] Loaded analytics:', analyticsData)
      setAnalytics(analyticsData)
    } catch (err) {
      console.error('[BudgetManagementPage] Error loading analytics:', err)
      // Don't show error for analytics, just log it
    } finally {
      setAnalyticsLoading(false)
    }
  }

  // Load budgets from API with API-side filters only
  const loadBudgets = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: BudgetListParams = {
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? (statusFilter.toUpperCase() as BudgetStatus) : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }

      console.log('[BudgetManagementPage] Loading budgets with params:', params)
      const budgetResponses = await listBudgets(params)
      console.log('[BudgetManagementPage] Loaded budgets:', budgetResponses)

      const mappedBudgets = budgetResponses.map(mapBudgetResponse)
      setAllBudgets(mappedBudgets)
    } catch (err) {
      console.error('[BudgetManagementPage] Error loading budgets:', err)
      setError('Erro ao carregar orçamentos')
    } finally {
      setLoading(false)
    }
  }

  // Load all data
  const loadData = async () => {
    await Promise.all([loadBudgets(), loadAnalytics()])
  }

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Reload budgets when API-side filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadBudgets() // Reload from API with new filters
      setPagination(prev => ({ ...prev, currentPage: 1 })) // Reset to page 1
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter, startDate, endDate])

  // Client-side filtering and pagination
  useEffect(() => {
    let filtered = allBudgets

    // Apply any additional client-side filters here if needed
    // For now, all filtering is done on the API side

    setFilteredBudgets(filtered)
  }, [allBudgets])

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
    setAllBudgets(allBudgets.filter((b: Budget) => b.id !== budgetId))
  }

  const handleDownloadPDF = async (budget: Budget) => {
    try {
      console.log('[BudgetManagementPage] Generating PDF for budget:', budget.id)
      const pdfData = await generateBudgetPdf(budget.id)
      
      // Criar URL para download
      const url = URL.createObjectURL(pdfData.blob)
      const link = document.createElement('a')
      link.href = url
      link.download = pdfData.filename
      link.click()
      URL.revokeObjectURL(url)
      
      console.log('[BudgetManagementPage] PDF downloaded successfully:', pdfData.filename)
    } catch (error) {
      console.error('[BudgetManagementPage] Error generating PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    }
  }

  const getTotalStats = () => {
    // Use analytics data if available, otherwise fallback to local calculations
    if (analytics && !analyticsLoading) {
      return {
        total: analytics.totalProposals,
        pending: analytics.pendingProposals.count,
        approved: analytics.approvedProposals.count,
        expired: analytics.expiredProposals.count,
        totalValue: analytics.pendingProposals.totalValue + analytics.approvedProposals.totalValue + analytics.expiredProposals.totalValue,
        conversionRate: analytics.conversionRate,
        averageTicket: analytics.averageTicket,
        pendingValue: analytics.pendingProposals.totalValue,
        approvedValue: analytics.approvedProposals.totalValue,
        expiredValue: analytics.expiredProposals.totalValue
      }
    }

    // Fallback to local calculations
    const total = allBudgets.length
    const pending = allBudgets.filter((b: Budget) => b.status === 'pending').length
    const approved = allBudgets.filter((b: Budget) => b.status === 'approved').length
    const expired = allBudgets.filter((b: Budget) => b.status === 'expired').length
    const totalValue = allBudgets.reduce((sum: number, b: Budget) => sum + b.totalValue, 0)
    const pendingValue = allBudgets.filter((b: Budget) => b.status === 'pending').reduce((sum: number, b: Budget) => sum + b.totalValue, 0)
    const approvedValue = allBudgets.filter((b: Budget) => b.status === 'approved').reduce((sum: number, b: Budget) => sum + b.totalValue, 0)
    const expiredValue = allBudgets.filter((b: Budget) => b.status === 'expired').reduce((sum: number, b: Budget) => sum + b.totalValue, 0)

    return {
      total,
      pending,
      approved,
      expired,
      totalValue,
      conversionRate: total > 0 ? (approved / total) * 100 : 0,
      averageTicket: total > 0 ? totalValue / total : 0,
      pendingValue,
      approvedValue,
      expiredValue
    }
  }

  const stats = getTotalStats()

  // Client-side pagination calculations
  const totalItems = filteredBudgets.length
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage)
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
  const endIndex = startIndex + pagination.itemsPerPage
  const currentPageBudgets = filteredBudgets.slice(startIndex, endIndex)

  const paginationInfo = {
    currentPage: pagination.currentPage,
    totalPages,
    totalItems,
    itemsPerPage: pagination.itemsPerPage,
    hasNextPage: pagination.currentPage < totalPages,
    hasPreviousPage: pagination.currentPage > 1,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, totalItems)
  }

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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Orçamentos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.total
                  )}
                </p>
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
                <p className="text-2xl font-bold text-yellow-600">
                  {analyticsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.pending
                  )}
                </p>
                {!analyticsLoading && (
                  <p className="text-xs text-gray-500">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(stats.pendingValue || 0)}
                  </p>
                )}
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
                <p className="text-2xl font-bold text-green-600">
                  {analyticsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.approved
                  )}
                </p>
                {!analyticsLoading && (
                  <p className="text-xs text-gray-500">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(stats.approvedValue || 0)}
                  </p>
                )}
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vencidos</p>
                <p className="text-2xl font-bold text-red-600">
                  {analyticsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.expired || 0
                  )}
                </p>
                {!analyticsLoading && (
                  <p className="text-xs text-gray-500">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(stats.expiredValue || 0)}
                  </p>
                )}
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analyticsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  ) : (
                    `${stats.conversionRate?.toFixed(1) || '0.0'}%`
                  )}
                </p>
              </div>
              <div className="h-8 w-8 text-purple-600 flex items-center justify-center text-lg font-bold">
                %
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analyticsLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                  ) : (
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(stats.averageTicket || 0)
                  )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Buscar por cliente, empresa ou número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="sent">Enviado</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                  <SelectItem value="expired">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Items per page selector */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Label htmlFor="limit" className="text-sm">Itens por página:</Label>
              <Select
                value={pagination.itemsPerPage.toString()}
                onValueChange={(value) => setPagination(prev => ({ ...prev, itemsPerPage: parseInt(value), currentPage: 1 }))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-gray-500">
              {paginationInfo.totalItems > 0 && (
                <>
                  Mostrando {paginationInfo.startIndex} a{' '}
                  {paginationInfo.endIndex} de {paginationInfo.totalItems} orçamentos
                </>
              )}
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
              <Button onClick={loadData} variant="outline">
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
              {currentPageBudgets.map((budget: Budget) => (
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

          {/* Pagination Controls */}
          {paginationInfo.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
              <PaginationButton
                variant="outline"
                size="icon"
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={!paginationInfo.hasPreviousPage || loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </PaginationButton>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, paginationInfo.totalPages) }, (_, i) => {
                  let pageNum
                  if (paginationInfo.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (paginationInfo.currentPage <= 3) {
                    pageNum = i + 1
                  } else if (paginationInfo.currentPage >= paginationInfo.totalPages - 2) {
                    pageNum = paginationInfo.totalPages - 4 + i
                  } else {
                    pageNum = paginationInfo.currentPage - 2 + i
                  }

                  return (
                    <PaginationButton
                      key={pageNum}
                      variant={paginationInfo.currentPage === pageNum ? "default" : "outline"}
                      size="icon"
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
                      disabled={loading}
                    >
                      {pageNum}
                    </PaginationButton>
                  )
                })}
              </div>

              <PaginationButton
                variant="outline"
                size="icon"
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={!paginationInfo.hasNextPage || loading}
              >
                <ChevronRight className="h-4 w-4" />
              </PaginationButton>
            </div>
          )}

          {currentPageBudgets.length === 0 && !loading && !error && (
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
        onSave={async () => {
          try {
            if (selectedBudget) {
              // Update existing budget - refresh list and analytics
              await loadData()
            } else {
              // New budget created - refresh list and analytics
              await loadData()
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

            // Refresh budgets list and analytics
            await loadData()
            
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