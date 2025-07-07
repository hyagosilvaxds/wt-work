"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, MapPin, Users, Plus } from "lucide-react"

interface TimelineEvent {
  id: number
  title: string
  startTime: string
  endTime: string
  date: string
  type: "class" | "meeting" | "workshop" | "certification"
  instructor: string
  location: string
  participants: number
  maxParticipants: number
}

export function WeeklyTimelineCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  // Função para obter o início da semana (domingo)
  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  // Função para gerar os dias da semana
  const getWeekDays = () => {
    const weekStart = getWeekStart(currentWeek)
    const days = []

    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      days.push(day)
    }

    return days
  }

  // Eventos de exemplo para a semana
  const weeklyEvents: TimelineEvent[] = useMemo(() => {
    const weekDays = getWeekDays()
    return [
      // Domingo (16)
      {
        id: 1,
        title: "Consultoria Empresarial",
        startTime: "08:00",
        endTime: "09:15",
        date: weekDays[0].toISOString().split("T")[0],
        type: "meeting",
        instructor: "Roberto Lima",
        location: "Sala Executiva",
        participants: 5,
        maxParticipants: 8,
      },

      // Segunda (17)
      {
        id: 2,
        title: "Análise de Dados",
        startTime: "11:00",
        endTime: "12:00",
        date: weekDays[1].toISOString().split("T")[0],
        type: "class",
        instructor: "Ana Santos",
        location: "Lab Informática",
        participants: 16,
        maxParticipants: 20,
      },

      // Terça (18)
      {
        id: 3,
        title: "Consultoria Técnica",
        startTime: "13:00",
        endTime: "14:15",
        date: weekDays[2].toISOString().split("T")[0],
        type: "meeting",
        instructor: "Carlos Silva",
        location: "Sala de Reuniões",
        participants: 8,
        maxParticipants: 10,
      },

      // Quarta (19)
      {
        id: 4,
        title: "Operação de Segurança",
        startTime: "09:00",
        endTime: "11:40",
        date: weekDays[3].toISOString().split("T")[0],
        type: "workshop",
        instructor: "Equipe Segurança",
        location: "Campo de Treinamento",
        participants: 25,
        maxParticipants: 30,
      },
      {
        id: 5,
        title: "Consultoria Estratégica",
        startTime: "14:00",
        endTime: "15:15",
        date: weekDays[3].toISOString().split("T")[0],
        type: "meeting",
        instructor: "Diretoria",
        location: "Sala VIP",
        participants: 6,
        maxParticipants: 8,
      },

      // Quinta (20)
      {
        id: 6,
        title: "Análise Financeira",
        startTime: "09:00",
        endTime: "10:30",
        date: weekDays[4].toISOString().split("T")[0],
        type: "class",
        instructor: "Contador",
        location: "Sala Financeira",
        participants: 12,
        maxParticipants: 15,
      },
      {
        id: 7,
        title: "Reabilitação de Processos",
        startTime: "12:00",
        endTime: "13:30",
        date: weekDays[4].toISOString().split("T")[0],
        type: "certification",
        instructor: "Consultor ISO",
        location: "Auditório",
        participants: 20,
        maxParticipants: 25,
      },

      // Sexta (21)
      {
        id: 8,
        title: "Reabilitação Técnica",
        startTime: "14:00",
        endTime: "15:30",
        date: weekDays[5].toISOString().split("T")[0],
        type: "certification",
        instructor: "Eng. Marcos",
        location: "Oficina",
        participants: 10,
        maxParticipants: 12,
      },

      // Sábado (22)
      {
        id: 9,
        title: "Consultoria de Gestão",
        startTime: "11:00",
        endTime: "12:15",
        date: weekDays[6].toISOString().split("T")[0],
        type: "meeting",
        instructor: "Consultor Externo",
        location: "Sala de Reuniões",
        participants: 8,
        maxParticipants: 10,
      },
    ]
  }, [currentWeek])

  // Horários da timeline (8:00 às 16:00)
  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
  ]

  // Função para obter cor do evento
  const getEventColor = (type: string) => {
    switch (type) {
      case "class":
        return "bg-blue-400 border-blue-500"
      case "meeting":
        return "bg-green-400 border-green-500"
      case "workshop":
        return "bg-yellow-400 border-yellow-500"
      case "certification":
        return "bg-purple-400 border-purple-500"
      default:
        return "bg-gray-400 border-gray-500"
    }
  }

  // Função para calcular posição e altura do evento
  const getEventPosition = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = timeToMinutes(endTime)
    const duration = endMinutes - startMinutes

    // Cada slot de 30 min = 60px de altura
    const startPosition = ((startMinutes - 480) / 30) * 60 // 480 = 8:00 em minutos
    const height = (duration / 30) * 60

    return { top: startPosition, height }
  }

  // Função para converter horário em minutos
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Função para navegar entre semanas
  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek)
    if (direction === "prev") {
      newWeek.setDate(newWeek.getDate() - 7)
    } else {
      newWeek.setDate(newWeek.getDate() + 7)
    }
    setCurrentWeek(newWeek)
  }

  // Função para ir para a semana atual
  const goToCurrentWeek = () => {
    setCurrentWeek(new Date())
  }

  const weekDays = getWeekDays()
  const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
  const today = new Date()

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg mr-3">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Agenda Semanal</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Visualização em timeline dos eventos da semana
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
              Hoje
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigateWeek("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigateWeek("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Header com os dias da semana */}
        <div className="grid grid-cols-8 border-b bg-gray-50">
          {/* Coluna do horário */}
          <div className="p-4 border-r bg-white flex items-center justify-center">
            <Clock className="h-5 w-5 text-gray-400" />
          </div>

          {/* Colunas dos dias */}
          {weekDays.map((day, index) => {
            const isToday = day.toDateString() === today.toDateString()
            return (
              <div
                key={index}
                className={`p-4 text-center border-r last:border-r-0 ${isToday ? "bg-blue-50 border-blue-200" : ""}`}
              >
                <div className={`font-semibold text-lg ${isToday ? "text-blue-600" : "text-gray-900"}`}>
                  {day.getDate()}
                </div>
                <div className={`text-sm ${isToday ? "text-blue-500" : "text-gray-500"}`}>{dayNames[index]}</div>
              </div>
            )
          })}
        </div>

        {/* Timeline com eventos */}
        <div className="relative">
          <div className="grid grid-cols-8">
            {/* Coluna dos horários */}
            <div className="border-r bg-gray-50">
              {timeSlots.map((time, index) => (
                <div
                  key={time}
                  className={`h-15 px-4 py-2 text-sm text-gray-600 border-b flex items-center justify-end ${
                    index % 2 === 0 ? "font-medium" : "text-gray-400"
                  }`}
                  style={{ height: "60px" }}
                >
                  {index % 2 === 0 ? time : ""}
                </div>
              ))}
            </div>

            {/* Colunas dos dias com eventos */}
            {weekDays.map((day, dayIndex) => {
              const dayEvents = weeklyEvents.filter((event) => event.date === day.toISOString().split("T")[0])
              const isToday = day.toDateString() === today.toDateString()

              return (
                <div
                  key={dayIndex}
                  className={`relative border-r last:border-r-0 ${isToday ? "bg-blue-50/30" : "bg-white"}`}
                  style={{ height: `${timeSlots.length * 60}px` }}
                >
                  {/* Linhas de grade */}
                  {timeSlots.map((_, index) => (
                    <div
                      key={index}
                      className="absolute w-full border-b border-gray-100"
                      style={{ top: `${index * 60}px`, height: "60px" }}
                    />
                  ))}

                  {/* Eventos */}
                  {dayEvents.map((event) => {
                    const position = getEventPosition(event.startTime, event.endTime)
                    return (
                      <div
                        key={event.id}
                        className={`absolute left-1 right-1 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group ${getEventColor(event.type)}`}
                        style={{
                          top: `${position.top}px`,
                          height: `${position.height}px`,
                          minHeight: "40px",
                        }}
                      >
                        <div className="p-2 h-full flex flex-col justify-between">
                          <div>
                            <div className="font-semibold text-sm text-white leading-tight">{event.title}</div>
                            <div className="text-xs text-white/90 mt-1">
                              {event.startTime}-{event.endTime}
                            </div>
                          </div>

                          {position.height > 80 && (
                            <div className="text-xs text-white/80 space-y-1">
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span className="truncate">{event.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                <span>
                                  {event.participants}/{event.maxParticipants}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Tooltip no hover */}
                          <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                            <div className="font-medium">{event.title}</div>
                            <div>
                              {event.startTime} - {event.endTime}
                            </div>
                            <div>{event.instructor}</div>
                            <div>{event.location}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Botão para adicionar evento */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legenda */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded border border-blue-500"></div>
              <span>Aulas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded border border-green-500"></div>
              <span>Reuniões</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded border border-yellow-500"></div>
              <span>Workshops</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded border border-purple-500"></div>
              <span>Certificações</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
