"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Video, Bell } from "lucide-react"

export function SchedulePage() {
  // Dados mockados para demonstração
  const upcomingClasses = [
    {
      id: 1,
      title: "Fundamentos de Segurança do Trabalho",
      type: "Aula prática",
      date: "2024-12-23",
      time: "08:00",
      endTime: "10:00",
      instructor: "João Silva",
      location: "Sala 101",
      isOnline: false,
      attendees: 15,
      maxAttendees: 20,
      status: "Confirmado",
      description: "Prática com equipamentos de proteção individual"
    },
    {
      id: 2,
      title: "Primeiros Socorros",
      type: "Aula teórica",
      date: "2024-12-24",
      time: "14:00",
      endTime: "16:00",
      instructor: "Maria Santos",
      location: "Online",
      isOnline: true,
      attendees: 12,
      maxAttendees: 25,
      status: "Confirmado",
      description: "Técnicas básicas de ressuscitação cardiopulmonar"
    },
    {
      id: 3,
      title: "Prevenção de Incêndios",
      type: "Aula prática",
      date: "2024-12-26",
      time: "09:00",
      endTime: "11:00",
      instructor: "Carlos Lima",
      location: "Laboratório",
      isOnline: false,
      attendees: 8,
      maxAttendees: 15,
      status: "Confirmado",
      description: "Simulação de combate a incêndios"
    },
    {
      id: 4,
      title: "Ergonomia no Trabalho",
      type: "Workshop",
      date: "2024-12-27",
      time: "13:30",
      endTime: "15:30",
      instructor: "Ana Costa",
      location: "Auditório",
      isOnline: false,
      attendees: 20,
      maxAttendees: 30,
      status: "Aguardando confirmação",
      description: "Exercícios práticos de ergonomia"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-green-100 text-green-800"
      case "Aguardando confirmação":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isToday = (date: string) => {
    const today = new Date().toISOString().split('T')[0]
    return date === today
  }

  const isTomorrow = (date: string) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return date === tomorrow.toISOString().split('T')[0]
  }

  const getDateLabel = (date: string) => {
    if (isToday(date)) return "Hoje"
    if (isTomorrow(date)) return "Amanhã"
    return new Date(date).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minha Agenda</h1>
        <p className="text-gray-600">Veja suas próximas aulas e eventos</p>
      </div>

      {/* Resumo da semana */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Esta semana</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingClasses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Horas de aula</p>
                <p className="text-2xl font-bold text-gray-900">8h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Video className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aulas online</p>
                <p className="text-2xl font-bold text-gray-900">
                  {upcomingClasses.filter(c => c.isOnline).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de aulas */}
      <div className="space-y-4">
        {upcomingClasses.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{classItem.type}</Badge>
                    {classItem.isOnline && (
                      <Badge variant="secondary">
                        <Video className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{classItem.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{classItem.description}</p>
                </div>
                <Badge className={getStatusColor(classItem.status)}>
                  {classItem.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Data e hora */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className="font-medium">
                    {getDateLabel(classItem.date)}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-2 h-4 w-4" />
                  {classItem.time} - {classItem.endTime}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {classItem.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  {classItem.attendees}/{classItem.maxAttendees} participantes
                </div>
              </div>

              {/* Instrutor */}
              <div className="text-sm text-gray-600">
                <strong>Instrutor:</strong> {classItem.instructor}
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2 pt-2">
                {classItem.isOnline ? (
                  <Button className="bg-primary-600 hover:bg-primary-700">
                    <Video className="w-4 h-4 mr-2" />
                    Entrar na Aula
                  </Button>
                ) : (
                  <Button className="bg-primary-600 hover:bg-primary-700">
                    Confirmar Presença
                  </Button>
                )}
                <Button variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Lembrete
                </Button>
                <Button variant="outline">
                  Ver Detalhes
                </Button>
              </div>

              {/* Alertas */}
              {isToday(classItem.date) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Hoje:</strong> Não esqueça da sua aula às {classItem.time}!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
