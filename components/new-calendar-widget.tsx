"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  BookOpen,
  Award,
  Briefcase
} from "lucide-react"

interface Event {
  id: number
  title: string
  time: string
  date: string
  location: string
  participants: number
  type: "class" | "meeting" | "workshop" | "certification"
  status: "confirmed" | "pending" | "cancelled"
}

export function NewCalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Eventos estáticos para evitar problemas
  const events: Event[] = [
    {
      id: 1,
      title: "Treinamento de Segurança",
      time: "08:00 - 12:00",
      date: "2024-12-16",
      location: "Sala 101",
      participants: 15,
      type: "class",
      status: "confirmed"
    },
    {
      id: 2,
      title: "Reunião de Planejamento",
      time: "14:00 - 15:30",
      date: "2024-12-17",
      location: "Sala de Reuniões",
      participants: 8,
      type: "meeting",
      status: "confirmed"
    },
    {
      id: 3,
      title: "Workshop de Inovação",
      time: "09:00 - 17:00",
      date: "2024-12-18",
      location: "Auditório Principal",
      participants: 25,
      type: "workshop",
      status: "pending"
    },
    {
      id: 4,
      title: "Certificação ISO",
      time: "10:00 - 16:00",
      date: "2024-12-19",
      location: "Centro de Avaliação",
      participants: 12,
      type: "certification",
      status: "confirmed"
    },
    {
      id: 5,
      title: "Consultoria Empresarial",
      time: "13:00 - 14:30",
      date: "2024-12-20",
      location: "Sala VIP",
      participants: 6,
      type: "meeting",
      status: "confirmed"
    }
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case "class":
        return <BookOpen className="h-4 w-4" />
      case "meeting":
        return <Users className="h-4 w-4" />
      case "workshop":
        return <Briefcase className="h-4 w-4" />
      case "certification":
        return <Award className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "class":
        return "border-l-blue-500 bg-blue-50"
      case "meeting":
        return "border-l-green-500 bg-green-50"
      case "workshop":
        return "border-l-yellow-500 bg-yellow-50"
      case "certification":
        return "border-l-purple-500 bg-purple-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Agenda da Semana
            </CardTitle>
            <CardDescription>
              Próximos eventos e treinamentos agendados
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-3">
              {currentDate.toLocaleDateString('pt-BR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border-l-4 ${getEventColor(event.type)} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.participants} participantes
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.status === 'confirmed' ? 'Confirmado' : 
                     event.status === 'pending' ? 'Pendente' : 'Cancelado'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {events.length} eventos esta semana
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Evento
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
