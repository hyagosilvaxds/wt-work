"use client"

import { useState } from "react"
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

export function WeeklyTimelineCalendarFixed() {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  // Eventos estáticos para evitar problemas de renderização
  const weeklyEvents: TimelineEvent[] = [
    {
      id: 1,
      title: "Consultoria Empresarial",
      startTime: "08:00",
      endTime: "09:15",
      date: "2024-12-16",
      type: "meeting",
      instructor: "Roberto Lima",
      location: "Sala Executiva",
      participants: 5,
      maxParticipants: 8,
    },
    {
      id: 2,
      title: "Análise de Dados",
      startTime: "11:00",
      endTime: "12:00",
      date: "2024-12-17",
      type: "class",
      instructor: "Ana Santos",
      location: "Lab Informática",
      participants: 16,
      maxParticipants: 20,
    },
    {
      id: 3,
      title: "Consultoria Técnica",
      startTime: "13:00",
      endTime: "14:15",
      date: "2024-12-18",
      type: "meeting",
      instructor: "Carlos Silva",
      location: "Sala de Reuniões",
      participants: 8,
      maxParticipants: 10,
    },
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

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">Agenda Semanal</CardTitle>
          <CardDescription>Cronograma de treinamentos e eventos</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newWeek = new Date(currentWeek)
              newWeek.setDate(currentWeek.getDate() - 7)
              setCurrentWeek(newWeek)
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium px-3 py-1 bg-gray-100 rounded">
            Semana de {currentWeek.toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'short' 
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newWeek = new Date(currentWeek)
              newWeek.setDate(currentWeek.getDate() + 7)
              setCurrentWeek(newWeek)
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weeklyEvents.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type)} bg-white shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.startTime} - {event.endTime}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {event.participants}/{event.maxParticipants}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Instrutor: {event.instructor}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.type === 'class' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'meeting' ? 'bg-green-100 text-green-800' :
                    event.type === 'workshop' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type === 'class' ? 'Aula' :
                     event.type === 'meeting' ? 'Reunião' :
                     event.type === 'workshop' ? 'Workshop' :
                     'Certificação'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button variant="outline" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Adicionar Evento</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
