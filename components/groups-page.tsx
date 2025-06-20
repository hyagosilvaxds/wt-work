import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Calendar, BookOpen, User } from "lucide-react"

export function GroupsPage() {
  const groups = [
    {
      id: 1,
      name: "Turma Segurança A - Janeiro",
      training: "Segurança do Trabalho",
      instructor: "Carlos Silva",
      students: 25,
      maxStudents: 30,
      startDate: "2024-01-20",
      endDate: "2024-01-20",
      status: "Em Andamento",
    },
    {
      id: 2,
      name: "Excel Avançado - Turma 1",
      training: "Excel Avançado",
      instructor: "Ana Santos",
      students: 15,
      maxStudents: 20,
      startDate: "2024-01-22",
      endDate: "2024-02-05",
      status: "Agendada",
    },
    {
      id: 3,
      name: "Liderança - Workshop Executivo",
      training: "Liderança e Gestão",
      instructor: "Roberto Lima",
      students: 20,
      maxStudents: 25,
      startDate: "2024-01-15",
      endDate: "2024-01-18",
      status: "Concluída",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-600">Gerencie as turmas de treinamento</p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus className="mr-2 h-4 w-4" />
          Nova Turma
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription>{group.training}</CardDescription>
                </div>
                <Badge
                  variant={
                    group.status === "Em Andamento" ? "default" : group.status === "Agendada" ? "secondary" : "outline"
                  }
                  className={
                    group.status === "Em Andamento"
                      ? "bg-primary-500"
                      : group.status === "Agendada"
                        ? "bg-secondary-500"
                        : ""
                  }
                >
                  {group.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="mr-2 h-4 w-4" />
                  Instrutor: {group.instructor}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  {group.students}/{group.maxStudents} alunos
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(group.startDate).toLocaleDateString("pt-BR")} -{" "}
                  {new Date(group.endDate).toLocaleDateString("pt-BR")}
                </div>

                {/* Progress bar */}
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${(group.students / group.maxStudents) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round((group.students / group.maxStudents) * 100)}% das vagas preenchidas
                </p>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <BookOpen className="mr-1 h-3 w-3" />
                    Ver Alunos
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
