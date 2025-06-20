"use client"

import type * as React from "react"
import { ptBR } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerWithRangeProps {
  className?: string
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

export function DatePickerWithRange({ className, date, setDate }: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        locale={ptBR}
      />
      <div className="flex justify-between px-3 pb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const today = new Date()
            setDate({
              from: new Date(today.getFullYear(), today.getMonth(), 1),
              to: today,
            })
          }}
        >
          Mês Atual
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const today = new Date()
            setDate({
              from: new Date(today.getFullYear(), 0, 1),
              to: today,
            })
          }}
        >
          Ano Atual
        </Button>
      </div>
    </div>
  )
}
