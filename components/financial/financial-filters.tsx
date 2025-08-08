"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Filter, Search, X, RefreshCw } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

interface FinancialFiltersProps {
  // Filtros básicos
  searchTerm?: string
  onSearchChange?: (value: string) => void
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
  
  // Filtros de status (para contas a receber/pagar)
  statusOptions?: Array<{ value: string; label: string }>
  selectedStatus?: string[]
  onStatusChange?: (status: string[]) => void
  
  // Filtros de categorias
  categoryOptions?: Array<{ value: string; label: string }>
  selectedCategories?: string[]
  onCategoryChange?: (categories: string[]) => void
  
  // Filtros de contas bancárias
  accountOptions?: Array<{ value: string; label: string }>
  selectedAccounts?: string[]
  onAccountChange?: (accounts: string[]) => void
  
  // Filtros de formas de pagamento
  paymentMethodOptions?: Array<{ value: string; label: string }>
  selectedPaymentMethods?: string[]
  onPaymentMethodChange?: (methods: string[]) => void
  
  // Configurações visuais
  className?: string
  showCard?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  
  // Ações
  onClearFilters?: () => void
  onApplyFilters?: () => void
}

export function FinancialFilters({
  searchTerm = "",
  onSearchChange,
  dateRange,
  onDateRangeChange,
  statusOptions = [],
  selectedStatus = [],
  onStatusChange,
  categoryOptions = [],
  selectedCategories = [],
  onCategoryChange,
  accountOptions = [],
  selectedAccounts = [],
  onAccountChange,
  paymentMethodOptions = [],
  selectedPaymentMethods = [],
  onPaymentMethodChange,
  className,
  showCard = true,
  collapsible = true,
  defaultExpanded = true,
  onClearFilters,
  onApplyFilters,
}: FinancialFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false)

  const hasActiveFilters = React.useMemo(() => {
    return (
      searchTerm ||
      dateRange?.from ||
      selectedStatus.length > 0 ||
      selectedCategories.length > 0 ||
      selectedAccounts.length > 0 ||
      selectedPaymentMethods.length > 0
    )
  }, [searchTerm, dateRange, selectedStatus, selectedCategories, selectedAccounts, selectedPaymentMethods])

  const handleClearAll = () => {
    onSearchChange?.("")
    onDateRangeChange?.(undefined)
    onStatusChange?.([])
    onCategoryChange?.([])
    onAccountChange?.([])
    onPaymentMethodChange?.([])
    onClearFilters?.()
  }

  const renderMultiSelect = (
    label: string,
    options: Array<{ value: string; label: string }>,
    selectedValues: string[],
    onChange: (values: string[]) => void
  ) => {
    if (options.length === 0) return null

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto min-h-[2.5rem]"
            >
              <div className="flex flex-wrap gap-1">
                {selectedValues.length === 0 && (
                  <span className="text-muted-foreground">Selecionar {label.toLowerCase()}</span>
                )}
                {selectedValues.slice(0, 2).map((value) => {
                  const option = options.find(o => o.value === value)
                  return (
                    <span
                      key={value}
                      className="inline-flex items-center rounded-md border px-2 py-1 text-xs"
                    >
                      {option?.label}
                    </span>
                  )
                })}
                {selectedValues.length > 2 && (
                  <span className="inline-flex items-center rounded-md border px-2 py-1 text-xs">
                    +{selectedValues.length - 2} mais
                  </span>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{label}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange([])}
                >
                  Limpar
                </Button>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={selectedValues.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onChange([...selectedValues, option.value])
                        } else {
                          onChange(selectedValues.filter(v => v !== option.value))
                        }
                      }}
                    />
                    <Label
                      htmlFor={option.value}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  const filtersContent = (
    <div className="space-y-4">
      {/* Filtros principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Busca */}
        {onSearchChange && (
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        )}

        {/* Período */}
        {onDateRangeChange && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Período</Label>
            <DateRangePicker
              date={dateRange}
              onDateChange={onDateRangeChange}
              placeholder="Selecionar período"
              showPresets={true}
              align="start"
            />
          </div>
        )}

        {/* Status */}
        {statusOptions.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select 
              value={selectedStatus[0] || "all"}
              onValueChange={(value) => onStatusChange?.(value === "all" ? [] : [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Categorias (apenas uma se não for filtro avançado) */}
        {categoryOptions.length > 0 && !showAdvancedFilters && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Categoria</Label>
            <Select 
              value={selectedCategories[0] || "all"}
              onValueChange={(value) => onCategoryChange?.(value === "all" ? [] : [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Filtros avançados */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
          {/* Categorias múltiplas */}
          {categoryOptions.length > 0 && onCategoryChange && (
            renderMultiSelect("Categorias", categoryOptions, selectedCategories, onCategoryChange)
          )}

          {/* Contas bancárias */}
          {accountOptions.length > 0 && onAccountChange && (
            renderMultiSelect("Contas Bancárias", accountOptions, selectedAccounts, onAccountChange)
          )}

          {/* Formas de pagamento */}
          {paymentMethodOptions.length > 0 && onPaymentMethodChange && (
            renderMultiSelect("Formas de Pagamento", paymentMethodOptions, selectedPaymentMethods, onPaymentMethodChange)
          )}
        </div>
      )}

      {/* Ações */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          {(categoryOptions.length > 0 || accountOptions.length > 0 || paymentMethodOptions.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? "Filtros Básicos" : "Filtros Avançados"}
            </Button>
          )}
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar Filtros
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onApplyFilters && (
            <Button size="sm" onClick={onApplyFilters}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Aplicar
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  if (!showCard) {
    return <div className={cn("space-y-4", className)}>{filtersContent}</div>
  }

  if (collapsible) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros
              {hasActiveFilters && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {[
                    searchTerm ? 1 : 0,
                    dateRange?.from ? 1 : 0,
                    selectedStatus.length,
                    selectedCategories.length,
                    selectedAccounts.length,
                    selectedPaymentMethods.length
                  ].reduce((acc, curr) => acc + curr, 0)}
                </span>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Ocultar" : "Mostrar"}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            {filtersContent}
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
              {[
                searchTerm ? 1 : 0,
                dateRange?.from ? 1 : 0,
                selectedStatus.length,
                selectedCategories.length,
                selectedAccounts.length,
                selectedPaymentMethods.length
              ].reduce((acc, curr) => acc + curr, 0)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filtersContent}
      </CardContent>
    </Card>
  )
}
