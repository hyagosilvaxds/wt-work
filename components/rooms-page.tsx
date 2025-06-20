"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Users,
  Wifi,
  Monitor,
  Coffee,
  Car,
  Thermometer,
  Volume2,
  Camera,
  Projector,
  Calendar,
  Clock,
  Settings,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const rooms = [
    {
      id: 1,
      name: "Sala 101",
      type: "Sala de Aula",
      capacity: 30,
      currentOccupancy: 25,
      location: "Bloco A - 1º Andar",
      status: "Ocupada",
      nextAvailable: "14:00",
      equipment: ["Projetor", "Wi-Fi", "Ar Condicionado", "Som"],
      description: "Sala ampla com equipamentos modernos para treinamentos",
      image: "/placeholder.svg?height=200&width=300&text=Sala+101",
      bookings: [
        { time: "08:00-12:00", event: "Segurança do Trabalho", instructor: "Carlos Silva" },
        { time: "14:00-18:00", event: "Excel Avançado", instructor: "Ana Santos" },
      ],
    },
    {
      id: 2,
      name: "Lab Informática",
      type: "Laboratório",
      capacity: 20,
      currentOccupancy: 0,
      location: "Bloco B - 2º Andar",
      status: "Disponível",
      nextAvailable: "Agora",
      equipment: ["20 Computadores", "Projetor", "Wi-Fi", "Ar Condicionado"],
      description: "Laboratório equipado com computadores para treinamentos de informática",
      image: "/placeholder.svg?height=200&width=300&text=Lab+Informática",
      bookings: [
        { time: "09:00-12:00", event: "Programação Básica", instructor: "Tech Team" },
        { time: "14:00-17:00", event: "Excel Avançado", instructor: "Ana Santos" },
      ],
    },
    {
      id: 3,
      name: "Auditório Principal",
      type: "Auditório",
      capacity: 100,
      currentOccupancy: 0,
      location: "Bloco C - Térreo",
      status: "Disponível",
      nextAvailable: "Agora",
      equipment: ["Sistema de Som", "Projetor 4K", "Palco", "Wi-Fi", "Ar Condicionado"],
      description: "Auditório para grandes eventos e palestras",
      image: "/placeholder.svg?height=200&width=300&text=Auditório",
      bookings: [
        { time: "09:00-12:00", event: "Workshop de Liderança", instructor: "Roberto Lima" },
        { time: "14:00-16:00", event: "Palestra Motivacional", instructor: "Palestrante Externo" },
      ],
    },
    {
      id: 4,
      name: "Sala de Reuniões",
      type: "Sala de Reunião",
      capacity: 12,
      currentOccupancy: 8,
      location: "Bloco A - 2º Andar",
      status: "Ocupada",
      nextAvailable: "15:30",
      equipment: ['TV 55"', "Wi-Fi", "Mesa de Reunião", "Ar Condicionado"],
      description: "Sala executiva para reuniões e pequenos grupos",
      image: "/placeholder.svg?height=200&width=300&text=Sala+Reuniões",
      bookings: [
        { time: "10:00-12:00", event: "Reunião de Diretoria", instructor: "Presidente" },
        { time: "14:00-15:30", event: "Reunião de Equipe", instructor: "Gerente TI" },
      ],
    },
    {
      id: 5,
      name: "Sala 102",
      type: "Sala de Aula",
      capacity: 25,
      currentOccupancy: 0,
      location: "Bloco A - 1º Andar",
      status: "Manutenção",
      nextAvailable: "Amanhã",
      equipment: ["Projetor", "Wi-Fi", "Quadro Branco"],
      description: "Sala em manutenção - equipamentos sendo atualizados",
      image: "/placeholder.svg?height=200&width=300&text=Sala+102",
      bookings: [],
    },
    {
      id: 6,
      name: "Campo de Treinamento",
      type: "Área Externa",
      capacity: 50,
      currentOccupancy: 12,
      location: "Área Externa",
      status: "Ocupada",
      nextAvailable: "16:00",
      equipment: ["Equipamentos de Segurança", "Primeiros Socorros", "Área Coberta"],
      description: "Campo para treinamentos práticos de segurança",
      image: "/placeholder.svg?height=200&width=300&text=Campo+Treinamento",
      bookings: [
        { time: "08:00-12:00", event: "Certificação NR-35", instructor: "Carlos Silva" },
        { time: "14:00-16:00", event: "Primeiros Socorros", instructor: "Dra. Maria" },
      ],
    },
    {
      id: 7,
      name: "Sala VIP",
      type: "Sala Executiva",
      capacity: 8,
      currentOccupancy: 0,
      location: "Bloco C - 3º Andar",
      status: "Disponível",
      nextAvailable: "Agora",
      equipment: ['TV 65"', "Sistema de Som", "Mesa Executiva", "Wi-Fi Premium", "Café"],
      description: "Sala premium para reuniões executivas",
      image: "/placeholder.svg?height=200&width=300&text=Sala+VIP",
      bookings: [{ time: "10:00-11:00", event: "Café com Diretoria", instructor: "Diretoria" }],
    },
    {
      id: 8,
      name: "Oficina Técnica",
      type: "Oficina",
      capacity: 15,
      currentOccupancy: 8,
      location: "Bloco D - Térreo",
      status: "Ocupada",
      nextAvailable: "17:00",
      equipment: ["Ferramentas", "Bancadas", "Equipamentos Técnicos", "Ventilação"],
      description: "Oficina para treinamentos técnicos e manutenção",
      image: "/placeholder.svg?height=200&width=300&text=Oficina",
      bookings: [{ time: "13:00-17:00", event: "Manutenção de Equipamentos", instructor: "Eng. Marcos" }],
    },
  ]

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível":
        return "bg-green-500"
      case "Ocupada":
        return "bg-red-500"
      case "Manutenção":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Disponível":
        return "bg-green-100 text-green-800"
      case "Ocupada":
        return "bg-red-100 text-red-800"
      case "Manutenção":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEquipmentIcon = (equipment: string) => {
    if (equipment.includes("Projetor") || equipment.includes("TV")) return <Projector className="h-4 w-4" />
    if (equipment.includes("Wi-Fi")) return <Wifi className="h-4 w-4" />
    if (equipment.includes("Som")) return <Volume2 className="h-4 w-4" />
    if (equipment.includes("Ar Condicionado")) return <Thermometer className="h-4 w-4" />
    if (equipment.includes("Computador")) return <Monitor className="h-4 w-4" />
    if (equipment.includes("Café")) return <Coffee className="h-4 w-4" />
    if (equipment.includes("Estacionamento")) return <Car className="h-4 w-4" />
    if (equipment.includes("Câmera")) return <Camera className="h-4 w-4" />
    return <Settings className="h-4 w-4" />
  }

  const roomStats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === "Disponível").length,
    occupied: rooms.filter((r) => r.status === "Ocupada").length,
    maintenance: rooms.filter((r) => r.status === "Manutenção").length,
    totalCapacity: rooms.reduce((sum, room) => sum + room.capacity, 0),
    currentOccupancy: rooms.reduce((sum, room) => sum + room.currentOccupancy, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salas</h1>
          <p className="text-gray-600">Gerencie as salas e espaços de treinamento</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className={viewMode === "cards" ? "bg-primary-500 hover:bg-primary-600" : ""}
          >
            Cards
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={viewMode === "table" ? "bg-primary-500 hover:bg-primary-600" : ""}
          >
            Tabela
          </Button>
          <Button className="bg-primary-500 hover:bg-primary-600">
            <Plus className="mr-2 h-4 w-4" />
            Nova Sala
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{roomStats.total}</div>
            <p className="text-sm text-gray-600">Total de Salas</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{roomStats.available}</div>
            <p className="text-sm text-gray-600">Disponíveis</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{roomStats.occupied}</div>
            <p className="text-sm text-gray-600">Ocupadas</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{roomStats.maintenance}</div>
            <p className="text-sm text-gray-600">Manutenção</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((roomStats.currentOccupancy / roomStats.totalCapacity) * 100)}%
            </div>
            <p className="text-sm text-gray-600">Taxa de Ocupação</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, tipo ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visualização em Cards */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <img
                  src={room.image || "/placeholder.svg"}
                  alt={room.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={`${getStatusBadge(room.status)} font-medium`}>{room.status}</Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(room.status)} animate-pulse`}></div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold">{room.name}</CardTitle>
                    <CardDescription className="text-sm">{room.type}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Reservar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {room.location}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="mr-2 h-4 w-4" />
                    {room.currentOccupancy}/{room.capacity} pessoas
                  </div>
                  <Progress value={(room.currentOccupancy / room.capacity) * 100} className="w-20 h-2" />
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-2 h-4 w-4" />
                  Próximo disponível: <span className="font-medium ml-1">{room.nextAvailable}</span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Equipamentos:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.equipment.slice(0, 3).map((equipment, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {getEquipmentIcon(equipment)}
                        <span className="ml-1 truncate">{equipment}</span>
                      </div>
                    ))}
                    {room.equipment.length > 3 && (
                      <div className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        +{room.equipment.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {room.bookings.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Próximas reservas:</p>
                    <div className="space-y-1">
                      {room.bookings.slice(0, 2).map((booking, index) => (
                        <div key={index} className="text-xs bg-blue-50 p-2 rounded">
                          <div className="font-medium text-blue-800">{booking.time}</div>
                          <div className="text-blue-600">{booking.event}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Ver Agenda
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-primary-500 hover:bg-primary-600"
                    disabled={room.status !== "Disponível"}
                  >
                    Reservar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Visualização em Tabela */}
      {viewMode === "table" && (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Salas</CardTitle>
            <CardDescription>{filteredRooms.length} sala(s) encontrada(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Próximo Disponível</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>{room.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>
                          {room.currentOccupancy}/{room.capacity}
                        </span>
                        <Progress value={(room.currentOccupancy / room.capacity) * 100} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadge(room.status)}`}>{room.status}</Badge>
                    </TableCell>
                    <TableCell>{room.nextAvailable}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Reservar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
