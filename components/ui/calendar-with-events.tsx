"use client"

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock, User, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Lesson {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string | null
  status: string
  instructorName: string
  className: string
  observations: string | null
}

interface CalendarWithEventsProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  lessons?: Lesson[]
  className?: string
}

export function CalendarWithEvents({ selectedDate, onDateSelect, lessons = [], className = '' }: CalendarWithEventsProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Lesson | null>(null)
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())

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
        lessons: []
      })
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = isSameDay(date, new Date())
      const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
      const dayLessons = lessons.filter(lesson => isSameDay(new Date(lesson.startDate), date))

      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        isSelected,
        lessons: dayLessons
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
        lessons: []
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADA':
        return 'bg-blue-500'
      case 'REALIZADA':
        return 'bg-green-500'
      case 'CANCELADA':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: ptBR })
  }

  const toggleDayExpansion = (dayKey: string) => {
    const newExpandedDays = new Set(expandedDays)
    if (newExpandedDays.has(dayKey)) {
      newExpandedDays.delete(dayKey)
    } else {
      newExpandedDays.add(dayKey)
    }
    setExpandedDays(newExpandedDays)
  }

  const getDayKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className={`w-full ${className}`}>
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-xs font-semibold text-gray-600 uppercase bg-gray-50 rounded-md"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grade do calendário */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayKey = getDayKey(day.date)
              const isExpanded = expandedDays.has(dayKey)
              const visibleLessons = isExpanded ? day.lessons : day.lessons.slice(0, 2)
              const hasMoreEvents = day.lessons.length > 2

              return (
                <div
                  key={index}
                  className={`
                    relative p-1 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer
                    ${day.isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}
                    ${day.isToday ? 'border-blue-500 bg-blue-50' : ''}
                    ${day.isSelected ? 'ring-2 ring-blue-500 bg-blue-100' : ''}
                    ${isExpanded ? 'min-h-[120px]' : 'min-h-[80px]'}
                  `}
                  onClick={() => handleDateClick(day.date)}
                >
                  {/* Número do dia */}
                  <div className={`
                    flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium mb-1
                    ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${day.isToday ? 'bg-blue-600 text-white' : ''}
                    ${day.isSelected && !day.isToday ? 'bg-blue-600 text-white' : ''}
                  `}>
                    {day.date.getDate()}
                  </div>

                  {/* Eventos do dia */}
                  <div className="space-y-1">
                    {visibleLessons.map((lesson, lessonIndex) => (
                      <div
                        key={lessonIndex}
                        className={`
                          px-2 py-1 rounded-md text-xs font-medium text-white truncate
                          ${getStatusColor(lesson.status)}
                          hover:opacity-80 transition-opacity
                        `}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedEvent(lesson)
                          setShowEventDetails(true)
                        }}
                        title={lesson.title}
                      >
                        {formatTime(lesson.startDate)} {lesson.title}
                      </div>
                    ))}
                    
                    {hasMoreEvents && !isExpanded && (
                      <div 
                        className="px-2 py-1 rounded-md text-xs font-medium bg-gray-500 text-white truncate cursor-pointer hover:bg-gray-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleDayExpansion(dayKey)
                        }}
                        title="Clique para ver todos os eventos"
                      >
                        +{day.lessons.length - 2} mais
                      </div>
                    )}

                    {hasMoreEvents && isExpanded && (
                      <div 
                        className="px-2 py-1 rounded-md text-xs font-medium bg-gray-600 text-white truncate cursor-pointer hover:bg-gray-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleDayExpansion(dayKey)
                        }}
                        title="Clique para recolher"
                      >
                        Recolher
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legenda */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-gray-600">Agendada</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-gray-600">Realizada</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-gray-600">Cancelada</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalhes do evento */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedEvent.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEventDetails(false)}
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{selectedEvent.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{formatTime(selectedEvent.startDate)} às {formatTime(selectedEvent.endDate)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Instrutor: {selectedEvent.instructorName}</span>
                </div>
                
                {selectedEvent.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
              </div>

              <Badge className={`${getStatusColor(selectedEvent.status)} text-white`}>
                {selectedEvent.status}
              </Badge>

              {selectedEvent.observations && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>Observações:</strong> {selectedEvent.observations}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
