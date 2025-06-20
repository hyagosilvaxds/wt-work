import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, Phone, BookOpen, Star } from "lucide-react"

export function InstructorsPage() {
  const instructors = [
    {
      id: 1,
      name: "Carlos Silva",
      email: "carlos.silva@wtwork.com",
      phone: "(11) 99999-1111",
      specialties: ["Segurança do Trabalho", "NR-35"],
      rating: 4.8,
      classes: 45,
      status: "Ativo",
    },
    {
      id: 2,
      name: "Ana Santos",
      email: "ana.santos@wtwork.com",
      phone: "(11) 99999-2222",
      specialties: ["Excel", "Power BI", "Informática"],
      rating: 4.9,
      classes: 32,
      status: "Ativo",
    },
    {
      id: 3,
      name: "Roberto Lima",
      email: "roberto.lima@wtwork.com",
      phone: "(11) 99999-3333",
      specialties: ["Liderança", "Gestão", "RH"],
      rating: 4.7,
      classes: 28,
      status: "Ativo",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instrutores</h1>
          <p className="text-gray-600">Gerencie os instrutores cadastrados</p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus className="mr-2 h-4 w-4" />
          Novo Instrutor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor) => (
          <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{instructor.name}</CardTitle>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{instructor.rating}</span>
                  </div>
                </div>
                <Badge className="bg-primary-500">{instructor.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="mr-2 h-4 w-4" />
                  {instructor.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="mr-2 h-4 w-4" />
                  {instructor.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {instructor.classes} aulas ministradas
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Especialidades:</p>
                  <div className="flex flex-wrap gap-1">
                    {instructor.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Ver Perfil
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
