"use client"

import * as React from "react"
import { addDays, format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronDown, X, ArrowRight } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface DateRangePickerProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  showPresets?: boolean
  align?: "start" | "center" | "end"
}

interface PresetRange {
  label: string
  range: DateRange
  badge?: string
}

export function DateRangePicker({
  date,
  onDateChange,
  placeholder = "Selecione o período",
  className,
  disabled = false,
  showPresets = true,
  align = "start",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<"presets" | "calendars">("presets")
  const [isMobile, setIsMobile] = React.useState(true)
  const [tempFromDate, setTempFromDate] = React.useState<Date | undefined>(date?.from)
  const [tempToDate, setTempToDate] = React.useState<Date | undefined>(date?.to)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Sincronizar datas temporárias quando o popover abre
  React.useEffect(() => {
    if (isOpen) {
      setTempFromDate(date?.from)
      setTempToDate(date?.to)
    }
  }, [isOpen, date])

  // Predefinições de período organizadas por categoria
  const presetCategories = React.useMemo(() => {
    const today = new Date()
    
    return {
      recentes: [
        {
          label: "Hoje",
          range: { from: today, to: today },
          badge: "hoje"
        },
        {
          label: "Ontem", 
          range: { from: subDays(today, 1), to: subDays(today, 1) }
        },
        {
          label: "Últimos 7 dias",
          range: { from: subDays(today, 6), to: today },
          badge: "7d"
        },
        {
          label: "Últimos 30 dias",
          range: { from: subDays(today, 29), to: today },
          badge: "30d"
        }
      ],
      mensais: [
        {
          label: "Este mês",
          range: { from: startOfMonth(today), to: endOfMonth(today) }
        },
        {
          label: "Mês passado",
          range: { 
            from: startOfMonth(subMonths(today, 1)), 
            to: endOfMonth(subMonths(today, 1)) 
          }
        },
        {
          label: "Últimos 3 meses",
          range: { from: startOfMonth(subMonths(today, 2)), to: endOfMonth(today) }
        },
        {
          label: "Últimos 6 meses", 
          range: { from: startOfMonth(subMonths(today, 5)), to: endOfMonth(today) }
        }
      ],
      anuais: [
        {
          label: "Este ano",
          range: { from: startOfYear(today), to: endOfYear(today) }
        },
        {
          label: "Ano passado",
          range: { 
            from: startOfYear(subMonths(today, 12)), 
            to: endOfYear(subMonths(today, 12)) 
          }
        }
      ]
    }
  }, [])

  const handlePresetSelect = (preset: PresetRange) => {
    setTempFromDate(preset.range.from)
    setTempToDate(preset.range.to)
    onDateChange?.(preset.range)
    setIsOpen(false)
  }

  const handleFromDateSelect = (selectedDate: Date | undefined) => {
    setTempFromDate(selectedDate)
    
    // Se a data de fim for anterior à nova data de início, ajustar automaticamente
    if (selectedDate && tempToDate && selectedDate > tempToDate) {
      setTempToDate(selectedDate)
    }
  }

  const handleToDateSelect = (selectedDate: Date | undefined) => {
    setTempToDate(selectedDate)
    
    // Se a data de início for posterior à nova data de fim, ajustar automaticamente
    if (selectedDate && tempFromDate && tempFromDate > selectedDate) {
      setTempFromDate(selectedDate)
    }
  }

  const applyDateRange = () => {
    const newRange = tempFromDate ? { from: tempFromDate, to: tempToDate || tempFromDate } : undefined
    onDateChange?.(newRange)
    setIsOpen(false)
  }

  const clearSelection = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setTempFromDate(undefined)
    setTempToDate(undefined)
    onDateChange?.(undefined)
    if (e) setIsOpen(false)
  }

  const formatDateRange = (dateRange?: DateRange) => {
    if (!dateRange?.from) {
      return placeholder
    }

    if (!dateRange.to || dateRange.from.getTime() === dateRange.to.getTime()) {
      return format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
    }

    const fromFormatted = format(dateRange.from, "dd/MM", { locale: ptBR })
    const toFormatted = format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })
    
    return `${fromFormatted} - ${toFormatted}`
  }

  const formatSingleDate = (date?: Date) => {
    return date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"
  }

  const isValidRange = tempFromDate && tempToDate && tempFromDate <= tempToDate
  const hasChanges = tempFromDate !== date?.from || tempToDate !== date?.to

  return (
    <div className={cn("relative", className)}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-10 px-3",
              !date?.from && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">{formatDateRange(date)}</span>
            {date?.from && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0 hover:bg-muted"
                onClick={clearSelection}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            {!date?.from && <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 flex flex-col">
          {isMobile ? (
            // Layout mobile com abas
            <div className="w-full max-w-[400px] mx-auto flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b flex-shrink-0">
                <h3 className="font-semibold text-lg">Selecionar Período</h3>
                <p className="text-sm text-muted-foreground">Escolha um período predefinido ou use o calendário</p>
              </div>

              {/* Abas de navegação */}
              <div className="border-b p-2 flex-shrink-0">
                <div className="flex space-x-1">
                  <Button
                    variant={activeTab === "presets" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("presets")}
                    className="flex-1"
                  >
                    Períodos
                  </Button>
                  <Button
                    variant={activeTab === "calendars" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("calendars")}
                    className="flex-1"
                  >
                    Calendários
                  </Button>
                </div>
              </div>

              {/* Conteúdo das abas */}
              <div className="flex-1 overflow-hidden">
                {activeTab === "presets" && showPresets && (
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4 pb-6">
                      {/* Recentes */}
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                          Recentes
                        </h5>
                        <div className="space-y-2">
                          {presetCategories.recentes.map((preset) => (
                            <Button
                              key={preset.label}
                              variant="ghost"
                              className="w-full justify-between font-normal text-sm h-10 px-3"
                              onClick={() => handlePresetSelect(preset)}
                            >
                              <span>{preset.label}</span>
                              {preset.badge && (
                                <Badge variant="secondary" className="text-xs h-5">
                                  {preset.badge}
                                </Badge>
                              )}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Mensais */}
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                          Mensais
                        </h5>
                        <div className="space-y-2">
                          {presetCategories.mensais.map((preset) => (
                            <Button
                              key={preset.label}
                              variant="ghost"
                              className="w-full justify-start font-normal text-sm h-10 px-3"
                              onClick={() => handlePresetSelect(preset)}
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Anuais */}
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                          Anuais
                        </h5>
                        <div className="space-y-2">
                          {presetCategories.anuais.map((preset) => (
                            <Button
                              key={preset.label}
                              variant="ghost"
                              className="w-full justify-start font-normal text-sm h-10 px-3"
                              onClick={() => handlePresetSelect(preset)}
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                )}

                {activeTab === "calendars" && (
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-6 pb-6">
                      {/* Seleção de Data de Início */}
                      <div>
                        <label className="text-sm font-medium mb-3 block">Data de Início</label>
                        <div className="p-3 border rounded-lg">
                          <div className="text-center text-sm font-medium mb-3 text-primary">
                            {formatSingleDate(tempFromDate)}
                          </div>
                          <Calendar
                            mode="single"
                            selected={tempFromDate}
                            onSelect={handleFromDateSelect}
                            locale={ptBR}
                            showOutsideDays={true}
                            className="rounded-md"
                            disabled={(date) => tempToDate ? date > tempToDate : false}
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* Seleção de Data de Fim */}
                      <div>
                        <label className="text-sm font-medium mb-3 block">Data de Fim</label>
                        <div className="p-3 border rounded-lg">
                          <div className="text-center text-sm font-medium mb-3 text-primary">
                            {formatSingleDate(tempToDate)}
                          </div>
                          <Calendar
                            mode="single"
                            selected={tempToDate}
                            onSelect={handleToDateSelect}
                            locale={ptBR}
                            showOutsideDays={true}
                            className="rounded-md"
                            disabled={(date) => tempFromDate ? date < tempFromDate : false}
                          />
                        </div>
                      </div>

                      {/* Botão de confirmação quando há mudanças pendentes */}
                      {hasChanges && (tempFromDate || tempToDate) && (
                        <div className="pt-4 border-t">
                          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Período selecionado:</span>
                              <div className="text-sm text-primary font-medium">
                                {tempFromDate && tempToDate ? (
                                  `${formatSingleDate(tempFromDate)} - ${formatSingleDate(tempToDate)}`
                                ) : tempFromDate ? (
                                  `A partir de ${formatSingleDate(tempFromDate)}`
                                ) : (
                                  `Até ${formatSingleDate(tempToDate)}`
                                )}
                              </div>
                            </div>
                            <Button 
                              onClick={applyDateRange}
                              className="w-full"
                              disabled={!tempFromDate}
                            >
                              Confirmar e Aplicar Período
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          ) : (
            // Layout desktop
            <div className="w-full max-w-[1000px] mx-auto flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b flex-shrink-0">
                <h3 className="font-semibold text-xl">Selecionar Período</h3>
                <p className="text-sm text-muted-foreground mt-1">Escolha um período predefinido ou use os calendários para seleção personalizada</p>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Predefinições */}
                {showPresets && (
                  <div className="w-64 border-r border-border flex-shrink-0">
                    <div className="p-4 border-b border-border">
                      <h4 className="font-medium text-sm">Períodos Rápidos</h4>
                    </div>
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-4 pb-6">
                        {/* Recentes */}
                        <div>
                          <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
                            Recentes
                          </h5>
                          <div className="space-y-1">
                            {presetCategories.recentes.map((preset) => (
                              <Button
                                key={preset.label}
                                variant="ghost"
                                className="w-full justify-between font-normal text-sm h-9 px-3"
                                onClick={() => handlePresetSelect(preset)}
                              >
                                <span>{preset.label}</span>
                                {preset.badge && (
                                  <Badge variant="secondary" className="text-xs h-5">
                                    {preset.badge}
                                  </Badge>
                                )}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Mensais */}
                        <div>
                          <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
                            Mensais
                          </h5>
                          <div className="space-y-1">
                            {presetCategories.mensais.map((preset) => (
                              <Button
                                key={preset.label}
                                variant="ghost"
                                className="w-full justify-start font-normal text-sm h-9 px-3"
                                onClick={() => handlePresetSelect(preset)}
                              >
                                {preset.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Anuais */}
                        <div>
                          <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
                            Anuais
                          </h5>
                          <div className="space-y-1">
                            {presetCategories.anuais.map((preset) => (
                              <Button
                                key={preset.label}
                                variant="ghost"
                                className="w-full justify-start font-normal text-sm h-9 px-3"
                                onClick={() => handlePresetSelect(preset)}
                              >
                                {preset.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                )}
                
                {/* Calendários Duplos */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-8">
                    {/* Calendário de Início */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium">Data de Início</label>
                        <div className="text-sm text-primary font-medium">
                          {formatSingleDate(tempFromDate)}
                        </div>
                      </div>
                      <div className="p-4 border rounded-xl bg-muted/30">
                        <Calendar
                          mode="single"
                          selected={tempFromDate}
                          onSelect={handleFromDateSelect}
                          locale={ptBR}
                          className="rounded-md"
                          disabled={(date) => tempToDate ? date > tempToDate : false}
                          classNames={{
                            months: "flex flex-col space-y-4",
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center",
                            caption_label: "text-sm font-medium",
                            nav: "space-x-1 flex items-center",
                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 cursor-pointer",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1",
                            row: "flex w-full mt-2",
                            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
                            day: "h-9 w-9 p-0 font-normal cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                            day_today: "bg-accent text-accent-foreground font-semibold",
                            day_outside: "text-muted-foreground opacity-50",
                            day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed hover:bg-transparent",
                          }}
                        />
                      </div>
                    </div>

                    {/* Calendário de Fim */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium">Data de Fim</label>
                        <div className="text-sm text-primary font-medium">
                          {formatSingleDate(tempToDate)}
                        </div>
                      </div>
                      <div className="p-4 border rounded-xl bg-muted/30">
                        <Calendar
                          mode="single"
                          selected={tempToDate}
                          onSelect={handleToDateSelect}
                          locale={ptBR}
                          className="rounded-md"
                          disabled={(date) => tempFromDate ? date < tempFromDate : false}
                          classNames={{
                            months: "flex flex-col space-y-4",
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center",
                            caption_label: "text-sm font-medium",
                            nav: "space-x-1 flex items-center",
                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 cursor-pointer",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1",
                            row: "flex w-full mt-2",
                            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
                            day: "h-9 w-9 p-0 font-normal cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                            day_today: "bg-accent text-accent-foreground font-semibold",
                            day_outside: "text-muted-foreground opacity-50",
                            day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed hover:bg-transparent",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Indicador visual de conexão e botão de confirmação */}
                  <div className="flex items-center justify-center mt-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <ArrowRight className="h-4 w-4" />
                        <span>Período selecionado</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      
                      {/* Botão de confirmação quando há mudanças pendentes */}
                      {hasChanges && (tempFromDate || tempToDate) && (
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 min-w-[300px]">
                          <div className="flex flex-col items-center space-y-3">
                            <span className="text-sm font-medium">Período selecionado:</span>
                            <div className="text-sm text-primary font-medium text-center">
                              {tempFromDate && tempToDate ? (
                                `${formatSingleDate(tempFromDate)} - ${formatSingleDate(tempToDate)}`
                              ) : tempFromDate ? (
                                `A partir de ${formatSingleDate(tempFromDate)}`
                              ) : (
                                `Até ${formatSingleDate(tempToDate)}`
                              )}
                            </div>
                            <Button 
                              onClick={applyDateRange}
                              className="w-full"
                              disabled={!tempFromDate}
                            >
                              Confirmar e Aplicar Período
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Rodapé com ações - sempre visível na parte inferior */}
          <div className="border-t border-border p-4 flex flex-col sm:flex-row gap-3 sm:justify-between bg-muted/20 flex-shrink-0">
            <div className="flex gap-3 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearSelection()}
                className="flex-1 sm:flex-none"
              >
                Limpar
              </Button>
              {(tempFromDate || tempToDate) && !hasChanges && (
                <div className="flex items-center text-sm text-muted-foreground px-3 py-1 bg-background rounded-md border">
                  {tempFromDate && tempToDate ? (
                    `${formatSingleDate(tempFromDate)} - ${formatSingleDate(tempToDate)}`
                  ) : tempFromDate ? (
                    `A partir de ${formatSingleDate(tempFromDate)}`
                  ) : (
                    `Até ${formatSingleDate(tempToDate)}`
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="flex-1 sm:flex-none"
              >
                {hasChanges ? 'Cancelar' : 'Fechar'}
              </Button>
              {/* Mostrar botão Aplicar apenas se não há mudanças pendentes ou não estamos na aba de calendários */}
              {(!hasChanges || activeTab === "presets") && (
                <Button
                  size="sm"
                  onClick={applyDateRange}
                  disabled={!tempFromDate}
                  className="flex-1 sm:flex-none"
                >
                  Aplicar Período
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente de compatibilidade para versões antigas
interface DatePickerWithRangeProps {
  className?: string
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

export function DatePickerWithRange({ className, date, setDate }: DatePickerWithRangeProps) {
  return (
    <DateRangePicker
      className={className}
      date={date}
      onDateChange={setDate}
      placeholder="Selecione o período"
    />
  )
}
