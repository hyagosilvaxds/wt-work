"use client"

import * as React from "react"
import { addDays, format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  showPresets?: boolean
  align?: "start" | "center" | "end"
  minDate?: Date
  maxDate?: Date
}

interface PresetDate {
  label: string
  date: Date
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Selecione a data",
  className,
  disabled = false,
  showPresets = true,
  align = "start",
  minDate,
  maxDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Predefinições de data
  const presetDates: PresetDate[] = React.useMemo(() => {
    const today = new Date()
    
    return [
      {
        label: "Hoje",
        date: today
      },
      {
        label: "Amanhã", 
        date: addDays(today, 1)
      },
      {
        label: "Em 1 semana",
        date: addDays(today, 7)
      },
      {
        label: "Em 15 dias",
        date: addDays(today, 15)
      },
      {
        label: "Em 30 dias",
        date: addDays(today, 30)
      },
      {
        label: "Final do mês",
        date: endOfMonth(today)
      },
      {
        label: "Final do ano",
        date: endOfYear(today)
      }
    ]
  }, [])

  const handlePresetSelect = (preset: PresetDate) => {
    onDateChange?.(preset.date)
    setIsOpen(false)
  }

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate)
    setIsOpen(false)
  }

  const formatDate = (selectedDate?: Date) => {
    if (!selectedDate) {
      return placeholder
    }

    return format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDate(date)}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align={align}
          sideOffset={4}
        >
          <div className="flex">
            {/* Predefinições */}
            {showPresets && (
              <div className="border-r border-border">
                <div className="p-3 border-b border-border">
                  <h4 className="font-medium text-sm">Datas Sugeridas</h4>
                </div>
                <div className="p-2 space-y-1 min-w-[150px]">
                  {presetDates.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      className="w-full justify-start font-normal text-sm h-8"
                      onClick={() => handlePresetSelect(preset)}
                      disabled={
                        (minDate && preset.date < minDate) ||
                        (maxDate && preset.date > maxDate)
                      }
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Calendário */}
            <div className="p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleCalendarSelect}
                locale={ptBR}
                className="rounded-md"
                disabled={(date) => 
                  (minDate && date < minDate) || 
                  (maxDate && date > maxDate) ||
                  false
                }
              />
            </div>
          </div>
          
          {/* Rodapé com ações */}
          <div className="border-t border-border p-3 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onDateChange?.(undefined)
                setIsOpen(false)
              }}
            >
              Limpar
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
                disabled={!date}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
