"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { FileDown, Filter, Settings, X, Download } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  filteredReportsApi,
  type FilteredReportRequest,
  REPORT_INCLUDE_OPTIONS,
  SORT_BY_OPTIONS,
  RECEIVABLE_CATEGORIES,
  PAYABLE_CATEGORIES,
  PAYMENT_METHODS,
  STATUS_OPTIONS,
} from "@/lib/api/financial"

interface FilterChip {
  key: string
  label: string
  value: any
}

export function FinancialReports() {
  const [isExporting, setIsExporting] = useState(false)
  
  // Estados dos filtros
  const [filters, setFilters] = useState<FilteredReportRequest>({
    includeReceivable: true,
    includePayable: true,
    includeBankAccounts: false,
    sortBy: "dueDate",
    sortOrder: "desc",
  })
  
  const [appliedFilters, setAppliedFilters] = useState<FilterChip[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Função para aplicar filtros
  const applyFilter = (key: string, value: any, label: string) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return

    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Adicionar chip do filtro
    const existingFilterIndex = appliedFilters.findIndex(f => f.key === key)
    const newChip: FilterChip = { key, label, value }
    
    if (existingFilterIndex >= 0) {
      const updatedFilters = [...appliedFilters]
      updatedFilters[existingFilterIndex] = newChip
      setAppliedFilters(updatedFilters)
    } else {
      setAppliedFilters([...appliedFilters, newChip])
    }
  }

  // Função para remover filtro
  const removeFilter = (key: string) => {
    const newFilters = { ...filters }
    delete newFilters[key as keyof FilteredReportRequest]
    setFilters(newFilters)
    
    setAppliedFilters(appliedFilters.filter(f => f.key !== key))
  }

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setFilters({
      includeReceivable: true,
      includePayable: true,
      includeBankAccounts: false,
      sortBy: "dueDate",
      sortOrder: "desc",
    })
    setAppliedFilters([])
  }

  // Função para exportar relatório
  const handleExportReport = async () => {
    // Validação básica - pelo menos um tipo de relatório deve estar incluído
    if (!filters.includeReceivable && !filters.includePayable && !filters.includeBankAccounts) {
      toast.error("Por favor, selecione pelo menos um tipo de dados para incluir no relatório")
      return
    }

    setIsExporting(true)
    try {
      await filteredReportsApi.exportFiltered(filters)
      toast.success("Relatório Excel exportado com sucesso!")
      
    } catch (error: any) {
      console.error("Erro ao exportar relatório:", error)
      toast.error(error.message || "Erro ao exportar relatório")
    } finally {
      setIsExporting(false)
    }
  }

  // Função para aplicar filtros rápidos
  const applyQuickFilter = (filterKey: string, filterValue: any, label: string) => {
    const newFilters = { ...filters, [filterKey]: filterValue }
    setFilters(newFilters)
    applyFilter(filterKey, filterValue, label)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios Financeiros</h2>
          <p className="text-muted-foreground">
            Exporte relatórios personalizados em Excel com filtros avançados
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Filtros Aplicados */}
        {appliedFilters.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Filtros Aplicados</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-8 px-2 text-xs"
                >
                  Limpar Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {appliedFilters.map((filter) => (
                  <Badge
                    key={filter.key}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    <span className="text-xs">{filter.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFilter(filter.key)}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Configuração de Relatório */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Configurações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações Básicas
              </CardTitle>
              <CardDescription>
                Defina o tipo e período do relatório
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Incluir no Relatório</Label>
                <div className="space-y-2">
                  {REPORT_INCLUDE_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={filters[option.value as keyof FilteredReportRequest] as boolean}
                        onCheckedChange={(checked) => {
                          const newFilters = { ...filters, [option.value]: checked }
                          setFilters(newFilters)
                        }}
                      />
                      <Label htmlFor={option.value} className="text-sm font-normal cursor-pointer">
                        {option.icon} {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dateRange">Período de Dados</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      type="date"
                      placeholder="Data inicial"
                      value={filters.startDate || ""}
                      onChange={(e) => {
                        const newFilters = { ...filters, startDate: e.target.value }
                        setFilters(newFilters)
                        if (e.target.value) {
                          applyFilter("startDate", e.target.value, `Início: ${e.target.value}`)
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      placeholder="Data final"
                      value={filters.endDate || ""}
                      onChange={(e) => {
                        const newFilters = { ...filters, endDate: e.target.value }
                        setFilters(newFilters)
                        if (e.target.value) {
                          applyFilter("endDate", e.target.value, `Fim: ${e.target.value}`)
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Ordenação</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={filters.sortBy || "dueDate"}
                    onValueChange={(value) => {
                      const newFilters = { ...filters, sortBy: value }
                      setFilters(newFilters)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_BY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filters.sortOrder || "desc"}
                    onValueChange={(value: "asc" | "desc") => {
                      const newFilters = { ...filters, sortOrder: value }
                      setFilters(newFilters)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ordem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Crescente</SelectItem>
                      <SelectItem value="desc">Decrescente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filtros Avançados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros Avançados
              </CardTitle>
              <CardDescription>
                Configure filtros específicos para o relatório
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Toggle Filtros Avançados */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="w-full"
              >
                {showAdvancedFilters ? "Ocultar" : "Mostrar"} Filtros Avançados
              </Button>

              {showAdvancedFilters && (
                <div className="space-y-4 border-t pt-4">
                  {/* Filtros de Status */}
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {STATUS_OPTIONS.map((status) => (
                        <div key={status.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status.value}`}
                            checked={filters.status?.includes(status.value) || false}
                            onCheckedChange={(checked) => {
                              const currentStatus = filters.status || []
                              const newStatus = checked
                                ? [...currentStatus, status.value]
                                : currentStatus.filter(s => s !== status.value)
                              
                              const newFilters = { ...filters, status: newStatus }
                              setFilters(newFilters)
                              
                              if (newStatus.length > 0) {
                                applyFilter("status", newStatus, `Status: ${newStatus.join(", ")}`)
                              }
                            }}
                          />
                          <Label htmlFor={`status-${status.value}`} className="text-sm cursor-pointer">
                            {status.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filtros de Categoria */}
                  <div className="grid gap-2">
                    <Label>Categorias (Recebimento)</Label>
                    <div className="grid grid-cols-1 gap-1 max-h-24 overflow-y-auto">
                      {RECEIVABLE_CATEGORIES.map((category) => (
                        <div key={category.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`rec-cat-${category.value}`}
                            checked={filters.categories?.includes(category.value) || false}
                            onCheckedChange={(checked) => {
                              const currentCategories = filters.categories || []
                              const newCategories = checked
                                ? [...currentCategories, category.value]
                                : currentCategories.filter(c => c !== category.value)
                              
                              const newFilters = { ...filters, categories: newCategories }
                              setFilters(newFilters)
                              
                              if (newCategories.length > 0) {
                                applyFilter("categories", newCategories, `Categorias: ${newCategories.length} selecionadas`)
                              }
                            }}
                          />
                          <Label htmlFor={`rec-cat-${category.value}`} className="text-xs cursor-pointer">
                            {category.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filtros de Métodos de Pagamento */}
                  <div className="grid gap-2">
                    <Label>Métodos de Pagamento</Label>
                    <div className="grid grid-cols-1 gap-1 max-h-24 overflow-y-auto">
                      {PAYMENT_METHODS.map((method) => (
                        <div key={method.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`payment-${method.value}`}
                            checked={filters.paymentMethods?.includes(method.value) || false}
                            onCheckedChange={(checked) => {
                              const currentMethods = filters.paymentMethods || []
                              const newMethods = checked
                                ? [...currentMethods, method.value]
                                : currentMethods.filter(m => m !== method.value)
                              
                              const newFilters = { ...filters, paymentMethods: newMethods }
                              setFilters(newFilters)
                              
                              if (newMethods.length > 0) {
                                applyFilter("paymentMethods", newMethods, `Métodos: ${newMethods.length} selecionados`)
                              }
                            }}
                          />
                          <Label htmlFor={`payment-${method.value}`} className="text-xs cursor-pointer">
                            {method.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filtros de Valor */}
                  <div className="grid gap-2">
                    <Label>Faixa de Valores</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="number"
                          placeholder="Valor mínimo"
                          step="0.01"
                          min="0"
                          value={filters.minAmount || ""}
                          onChange={(e) => {
                            const value = e.target.value ? parseFloat(e.target.value) : undefined
                            const newFilters = { ...filters, minAmount: value }
                            setFilters(newFilters)
                            if (value) {
                              applyFilter("minAmount", value, `Min: R$ ${value.toFixed(2)}`)
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Valor máximo"
                          step="0.01"
                          min="0"
                          value={filters.maxAmount || ""}
                          onChange={(e) => {
                            const value = e.target.value ? parseFloat(e.target.value) : undefined
                            const newFilters = { ...filters, maxAmount: value }
                            setFilters(newFilters)
                            if (value) {
                              applyFilter("maxAmount", value, `Max: R$ ${value.toFixed(2)}`)
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filtros de Texto */}
                  <div className="grid gap-2">
                    <Label>Busca em Descrições</Label>
                    <Input
                      placeholder="Buscar na descrição..."
                      value={filters.searchDescription || ""}
                      onChange={(e) => {
                        const newFilters = { ...filters, searchDescription: e.target.value }
                        setFilters(newFilters)
                        if (e.target.value) {
                          applyFilter("searchDescription", e.target.value, `Busca: "${e.target.value}"`)
                        }
                      }}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Busca em Observações</Label>
                    <Textarea
                      placeholder="Buscar nas observações..."
                      value={filters.searchNotes || ""}
                      onChange={(e) => {
                        const newFilters = { ...filters, searchNotes: e.target.value }
                        setFilters(newFilters)
                        if (e.target.value) {
                          applyFilter("searchNotes", e.target.value, `Observações: "${e.target.value}"`)
                        }
                      }}
                      rows={2}
                    />
                  </div>

                  {/* Filtros de Recorrência */}
                  <div className="grid gap-2">
                    <Label>Características Especiais</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isRecurring"
                          checked={filters.isRecurring || false}
                          onCheckedChange={(checked) => {
                            const newFilters = { ...filters, isRecurring: checked === true ? true : undefined }
                            setFilters(newFilters)
                            if (checked === true) {
                              applyFilter("isRecurring", true, "Apenas recorrentes")
                            }
                          }}
                        />
                        <Label htmlFor="isRecurring" className="text-sm cursor-pointer">
                          Apenas contas recorrentes
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasInstallments"
                          checked={filters.hasInstallments || false}
                          onCheckedChange={(checked) => {
                            const newFilters = { ...filters, hasInstallments: checked === true ? true : undefined }
                            setFilters(newFilters)
                            if (checked === true) {
                              applyFilter("hasInstallments", true, "Apenas parceladas")
                            }
                          }}
                        />
                        <Label htmlFor="hasInstallments" className="text-sm cursor-pointer">
                          Apenas contas parceladas
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Exportar Relatório */}
        <div className="flex justify-center">
          <Button
            onClick={handleExportReport}
            disabled={isExporting}
            size="lg"
            className="px-8"
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Exportar Relatório Excel
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
