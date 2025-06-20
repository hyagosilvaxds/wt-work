"use client"

import type * as React from "react"
import { ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  events?: Array<{
    id: number
    date: string
    title: string
    type?: string
    time?: string
    location?: string
    instructor?: string
    participants?: number
    maxParticipants?: number
  }>
}

export function DynamicCalendar({
  className,
  classNames,
  showOutsideDays = true,
  events = [],
  ...props
}: CalendarProps) {
  // Função para verificar se um dia tem eventos
  const hasEventOnDay = (day: Date | undefined) => {
    if (!day) return false

    return events.some((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      )
    })
  }

  // Função para obter os eventos em um dia específico
  const getEventsForDay = (day: Date | undefined) => {
    if (!day) return []

    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      )
    })
  }

  // Função para obter os tipos de eventos em um dia específico
  const getEventTypesForDay = (day: Date | undefined) => {
    if (!day) return []

    return events
      .filter((event) => {
        const eventDate = new Date(event.date)
        return (
          eventDate.getDate() === day.getDate() &&
          eventDate.getMonth() === day.getMonth() &&
          eventDate.getFullYear() === day.getFullYear()
        )
      })
      .map((event) => event.type || "default")
  }

  // Função para determinar a cor do evento
  const getEventColor = (type: string) => {
    switch (type) {
      case "class":
        return "bg-primary-500"
      case "meeting":
        return "bg-yellow-500"
      case "workshop":
        return "bg-secondary-500"
      case "certification":
        return "bg-green-600"
      default:
        return "bg-gray-400"
    }
  }

  // Função para determinar o texto do tipo de evento
  const getEventTypeText = (type: string) => {
    switch (type) {
      case "class":
        return "Aula"
      case "meeting":
        return "Reunião"
      case "workshop":
        return "Workshop"
      case "certification":
        return "Certificação"
      default:
        return "Evento"
    }
  }

  // Função para renderizar o conteúdo do dia
  const renderDay = (day: Date | undefined) => {
    if (!day) return null

    const dayEvents = getEventsForDay(day)
    const eventTypes = getEventTypesForDay(day)
    const hasEvents = eventTypes.length > 0
    const isToday = new Date().toDateString() === day.toDateString()

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-start p-1">
        <div className={`text-sm font-medium ${isToday ? "text-primary-600" : ""}`}>{day.getDate()}</div>

        {hasEvents && (
          <div className="w-full mt-1 space-y-1">
            {dayEvents.slice(0, 3).map((event, index) => (
              <Popover key={event.id}>
                <PopoverTrigger asChild>
                  <div
                    className={cn(
                      "w-full h-1.5 rounded-full cursor-pointer transition-all duration-200 hover:h-2",
                      getEventColor(event.type || "default"),
                    )}
                    title={event.title}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" side="right" align="start">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={cn("text-white", getEventColor(event.type || "default"))}>
                        {getEventTypeText(event.type || "default")}
                      </Badge>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{event.time}</span>
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-3">{event.title}</h4>

                    <div className="space-y-2 text-sm text-gray-600">
                      {event.time && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {event.time}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {event.location}
                        </div>
                      )}
                      {event.instructor && (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          {event.instructor}
                        </div>
                      )}
                      {event.participants && event.maxParticipants && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs">
                            {event.participants}/{event.maxParticipants} participantes
                          </span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all duration-300",
                                getEventColor(event.type || "default"),
                              )}
                              style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        Ver Detalhes
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary-500 hover:bg-primary-600">
                        Editar
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ))}

            {dayEvents.length > 3 && (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="w-full h-1.5 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition-colors flex items-center justify-center">
                    <span className="text-xs text-white font-medium">+{dayEvents.length - 3}</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" side="right" align="start">
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Todos os eventos - {day.toLocaleDateString("pt-BR")}
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {dayEvents.map((event) => (
                        <div key={event.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                          <div className={cn("w-3 h-3 rounded-full mt-1", getEventColor(event.type || "default"))} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                            <p className="text-xs text-gray-500">{event.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}

        {isToday && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
        )}
      </div>
    )
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-lg font-semibold text-gray-900",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-white hover:bg-gray-50 border-gray-200 shadow-sm",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex mb-2",
        head_cell: "text-gray-500 rounded-md w-full font-medium text-sm text-center py-2",
        row: "flex w-full mt-1",
        cell: "relative h-20 w-full text-center text-sm p-0 focus-within:relative focus-within:z-20 border border-gray-100 hover:bg-gray-50 transition-colors",
        day: cn("h-full w-full p-0 font-normal hover:bg-gray-50 focus:bg-gray-100 transition-colors relative"),
        day_range_end: "day-range-end",
        day_selected: "bg-primary-50 text-primary-900 hover:bg-primary-100 focus:bg-primary-100 border-primary-200",
        day_today: "bg-blue-50 text-blue-900 border-blue-200",
        day_outside: "text-gray-400 opacity-50",
        day_disabled: "text-gray-300 opacity-30",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Day: ({ date, ...props }) => {
          if (!date) return null
          return <div {...props}>{renderDay(date)}</div>
        },
      }}
      {...props}
    />
  )
}
