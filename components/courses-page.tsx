"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Users, Play, CheckCircle } from "lucide-react"

export function CoursesPage() {
  // Dados mockados para demonstração
  const courses = [
    {
      id: 1,
      title: "Fundamentos de Segurança do Trabalho",
      description: "Conceitos básicos sobre segurança e saúde ocupacional",
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      duration: "8 horas",
      instructor: "João Silva",
      status: "Em andamento",
      nextLesson: "Equipamentos de Proteção Individual",
      dueDate: "2024-12-30"
    },
    {
      id: 2,
      title: "Primeiros Socorros",
      description: "Técnicas básicas de primeiros socorros no ambiente de trabalho",
      progress: 100,
      totalLessons: 8,
      completedLessons: 8,
      duration: "6 horas",
      instructor: "Maria Santos",
      status: "Concluído",
      certificate: true,
      completedDate: "2024-12-15"
    },
    {
      id: 3,
      title: "Prevenção de Incêndios",
      description: "Como prevenir e combater incêndios no ambiente de trabalho",
      progress: 30,
      totalLessons: 10,
      completedLessons: 3,
      duration: "10 horas",
      instructor: "Carlos Lima",
      status: "Em andamento",
      nextLesson: "Tipos de Extintores",
      dueDate: "2025-01-15"
    },
    {
      id: 4,
      title: "Ergonomia no Trabalho",
      description: "Princípios de ergonomia para prevenir lesões ocupacionais",
      progress: 0,
      totalLessons: 6,
      completedLessons: 0,
      duration: "4 horas",
      instructor: "Ana Costa",
      status: "Não iniciado",
      startDate: "2025-01-10"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-100 text-green-800"
      case "Em andamento":
        return "bg-blue-100 text-blue-800"
      case "Não iniciado":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluído":
        return <CheckCircle className="w-4 h-4" />
      case "Em andamento":
        return <Play className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meus Cursos</h1>
        <p className="text-gray-600">Acompanhe o progresso dos seus treinamentos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                </div>
                <Badge className={getStatusColor(course.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(course.status)}
                    {course.status}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progresso */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{course.completedLessons} de {course.totalLessons} aulas</span>
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* Informações do curso */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  Instrutor: {course.instructor}
                </div>
                
                {course.nextLesson && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Play className="mr-2 h-4 w-4" />
                    Próxima aula: {course.nextLesson}
                  </div>
                )}

                {course.dueDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-2 h-4 w-4" />
                    Prazo: {new Date(course.dueDate).toLocaleDateString("pt-BR")}
                  </div>
                )}

                {course.completedDate && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Concluído em: {new Date(course.completedDate).toLocaleDateString("pt-BR")}
                  </div>
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2 pt-2">
                {course.status === "Concluído" ? (
                  <>
                    <Button variant="outline" className="flex-1">
                      Revisar Conteúdo
                    </Button>
                    {course.certificate && (
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        Baixar Certificado
                      </Button>
                    )}
                  </>
                ) : course.status === "Em andamento" ? (
                  <>
                    <Button className="flex-1 bg-primary-600 hover:bg-primary-700">
                      Continuar Curso
                    </Button>
                    <Button variant="outline">
                      Ver Detalhes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="flex-1 bg-primary-600 hover:bg-primary-700">
                      Iniciar Curso
                    </Button>
                    <Button variant="outline">
                      Ver Detalhes
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
