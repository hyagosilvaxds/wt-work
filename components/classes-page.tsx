import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, MapPin, Users } from "lucide-react"

export function ClassesPage() {
  const classes = [
    {
      id: 1,
      title: "Segurança do Trabalho - Turma A",
      training: "Segurança do Trabalho",
      date: "2024-01-20",
      time: "08:00 - 17:00",
      location: "Sala 101",
      instructor: "Carlos Silva",
      students: 25,
      maxStudents: 30,
      status: "Agendada",
    },
    {
      id: 2,
      title: "Excel Avançado - Módulo 1",
      training: "Excel Avançado",
      date: "2024-01-22",
      time: "14:00 - 18:00",
      location: "Lab Informática",
      instructor: "Ana Santos",
      students: 15,
      maxStudents: 20,
      status: "Agendada",
    },
    {
      id: 3,
      title: "Liderança e Gestão - Workshop",
      training: "Liderança e Gestão",
      date: "2024-01-18",
      time: "09:00 - 12:00",
      location: "Auditório",
      instructor: "Roberto Lima",
      students: 20,
      maxStudents: 25,
      status: "Concluída",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Aulas</h1>
          <p className="text-gray-600">Gerencie as aulas agendadas</p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus className="mr-2 h-4 w-4" />
          Agendar Aula
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{classItem.title}</CardTitle>
                  <CardDescription>{classItem.training}</CardDescription>
                </div>
                <Badge
                  variant={
                    classItem.status === "Agendada"
                      ? "default"
                      : classItem.status === "Concluída"
                        ? "secondary"
                        : "outline"
                  }
                  className={
                    classItem.status === "Agendada"
                      ? "bg-primary-500"
                      : classItem.status === "Concluída"
                        ? "bg-secondary-500"
                        : ""
                  }
                >
                  {classItem.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(classItem.date).toLocaleDateString("pt-BR")}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-2 h-4 w-4" />
                  {classItem.time}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {classItem.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  {classItem.students}/{classItem.maxStudents} alunos
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Instrutor:</strong> {classItem.instructor}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
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
