'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Calendar, Clock, MapPin, Search, Edit, Trash2, MoreHorizontal, Users, ArrowLeft } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getLessons } from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface Lesson {
  id: string
  title: string
  description?: string
  startDate: Date | string
  endDate: Date | string
  status?: string
  location?: string
  observations?: string
  instructorId: string
  clientId?: string
  classId?: string
  instructor?: {
    id: string
    name: string
    email: string
  }
  client?: {
    id: string
    name: string
  }
  class?: {
    id: string
    training?: {
      title: string
    }
  }
}

interface LessonsPageProps {
  classId?: string
  className?: string
}

export function LessonsPage({ classId, className }: LessonsPageProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const limit = 10

  // Carregar aulas
  const loadLessons = async () => {
    setLoading(true)
    try {
      const response = await getLessons(page, limit, searchTerm || undefined)
      // Se temos um classId específico, filtrar apenas as aulas dessa turma
      const filteredLessons = classId 
        ? (response.data || []).filter((lesson: Lesson) => lesson.classId === classId)
        : (response.data || [])
      
      setLessons(filteredLessons)
      setTotalPages(Math.ceil((response.total || 0) / limit))
    } catch (error) {
      console.error('Erro ao carregar aulas:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar aulas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Carregar aulas quando página ou busca mudarem
  useEffect(() => {
    loadLessons()
  }, [page, searchTerm, classId])

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1)
      } else {
        loadLessons()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const formatDate = (date: Date | string) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("pt-BR")
  }

  const formatTime = (startDate: Date | string, endDate: Date | string) => {
    if (!startDate || !endDate) return ""
    const start = new Date(startDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    const end = new Date(endDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    return `${start} - ${end}`
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Agendada":
        return "bg-blue-500"
      case "Em Andamento":
        return "bg-yellow-500"
      case "Concluída":
        return "bg-green-500"
      case "Cancelada":
        return "bg-red-500"
      case "Adiada":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleEdit = (lesson: Lesson) => {
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de edição em desenvolvimento",
      variant: "default",
    })
  }

  const handleDelete = (lesson: Lesson) => {
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de exclusão em desenvolvimento",
      variant: "default",
    })
  }

  const handleAttendance = (lesson: Lesson) => {
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de chamada em desenvolvimento",
      variant: "default",
    })
  }

  if (loading && lessons.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {classId ? `Aulas ${className ? `- ${className}` : ''}` : 'Aulas'}
            </h1>
            <p className="text-gray-600">Gerencie as aulas agendadas</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {classId && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {classId ? `Aulas ${className ? `- ${className}` : ''}` : 'Aulas'}
          </h1>
          <p className="text-gray-600">Gerencie as aulas agendadas</p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus className="mr-2 h-4 w-4" />
          Agendar Aula
        </Button>
      </div>

      {/* Barra de pesquisa */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar aulas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de aulas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription>
                    {lesson.description || "Sem descrição"}
                  </CardDescription>
                  {lesson.class?.training && (
                    <p className="text-xs text-gray-500 mt-1">
                      Turma: {lesson.class.training.title}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${getStatusColor(lesson.status)} text-white`}
                  >
                    {lesson.status || "Não informado"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAttendance(lesson)}>
                        <Users className="mr-2 h-4 w-4" />
                        Fazer Chamada
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(lesson)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(lesson)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDate(lesson.startDate)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-2 h-4 w-4" />
                  {formatTime(lesson.startDate, lesson.endDate)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {lesson.location || "Local não informado"}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Instrutor:</strong> {lesson.instructor?.name || "Não informado"}
                </div>
                {lesson.client && (
                  <div className="text-sm text-gray-600">
                    <strong>Cliente:</strong> {lesson.client.name}
                  </div>
                )}
                {lesson.observations && (
                  <div className="text-sm text-gray-600">
                    <strong>Observações:</strong> {lesson.observations}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mensagem quando não há aulas */}
      {!loading && lessons.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma aula encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? "Tente ajustar os termos de busca." : classId ? "Esta turma ainda não possui aulas agendadas." : "Comece agendando uma nova aula."}
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agendar Primeira Aula
          </Button>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  )
}
