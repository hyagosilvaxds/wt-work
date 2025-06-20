import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Users, BookOpen } from "lucide-react"

export function TrainingsPage() {
  const trainings = [
    {
      id: 1,
      title: "Segurança do Trabalho",
      description: "Treinamento completo sobre normas de segurança",
      duration: "8 horas",
      students: 45,
      status: "Ativo",
      category: "Segurança",
    },
    {
      id: 2,
      title: "Excel Avançado",
      description: "Curso avançado de Microsoft Excel",
      duration: "16 horas",
      students: 32,
      status: "Ativo",
      category: "Informática",
    },
    {
      id: 3,
      title: "Liderança e Gestão",
      description: "Desenvolvimento de habilidades de liderança",
      duration: "12 horas",
      students: 28,
      status: "Em Desenvolvimento",
      category: "Gestão",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Treinamentos</h1>
          <p className="text-gray-600">Gerencie os treinamentos oferecidos</p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus className="mr-2 h-4 w-4" />
          Novo Treinamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((training) => (
          <Card key={training.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="outline">{training.category}</Badge>
                <Badge
                  variant={training.status === "Ativo" ? "default" : "secondary"}
                  className={training.status === "Ativo" ? "bg-primary-500" : ""}
                >
                  {training.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{training.title}</CardTitle>
              <CardDescription>{training.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-2 h-4 w-4" />
                  {training.duration}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  {training.students} alunos matriculados
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <BookOpen className="mr-1 h-3 w-3" />
                    Ver Detalhes
                  </Button>
                  <Button size="sm" className="flex-1 bg-secondary-500 hover:bg-secondary-600">
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
