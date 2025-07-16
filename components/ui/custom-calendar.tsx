"use client"

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CalendarProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  scheduledDays?: Date[]
  className?: string
}

export function CustomCalendar({ selectedDate, onDateSelect, scheduledDays = [], className = '' }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Dias do mês anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        hasScheduled: false
      })
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = isSameDay(date, new Date())
      const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
      const hasScheduled = scheduledDays.some(scheduledDay => isSameDay(date, scheduledDay))

      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        isSelected,
        hasScheduled
      })
    }

    // Dias do próximo mês para completar a grade
    const totalCells = 42 // 6 semanas × 7 dias
    const remainingCells = totalCells - days.length
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(year, month + 1, day)
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        hasScheduled: false
      })
    }

    return days
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date)
    }
  }

  const days = getDaysInMonth(currentDate)

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-4">
        {/* Header do calendário */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-semibold text-gray-900">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grade do calendário */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(day.date)}
              className={`
                relative h-10 w-full flex items-center justify-center text-sm rounded-md transition-all duration-200 hover:bg-gray-100
                ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${day.isToday ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                ${day.isSelected ? 'bg-blue-600 text-white font-semibold hover:bg-blue-700' : ''}
                ${day.hasScheduled && !day.isSelected ? 'bg-green-100 text-green-700 font-medium' : ''}
              `}
            >
              <span className="relative z-10">
                {day.date.getDate()}
              </span>
              
              {/* Indicador de aula agendada */}
              {day.hasScheduled && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500 z-20"></div>
              )}
              
              {/* Indicador de hoje */}
              {day.isToday && !day.isSelected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Legenda */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-gray-600">Data selecionada</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Aula agendada</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-600"></div>
              <span className="text-gray-600">Hoje</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
