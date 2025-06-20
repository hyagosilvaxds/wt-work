import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Building2, Mail, Phone, Users } from "lucide-react"

export function ClientsPage() {
  const clients = [
    {
      id: 1,
      name: "Empresa ABC Ltda",
      contact: "João Gerente",
      email: "joao@empresaabc.com",
      phone: "(11) 3333-4444",
      employees: 150,
      activeTrainings: 3,
      status: "Ativo",
    },
    {
      id: 2,
      name: "XYZ Indústria S.A.",
      contact: "Maria Coordenadora",
      email: "maria@xyzindustria.com",
      phone: "(11) 5555-6666",
      employees: 300,
      activeTrainings: 5,
      status: "Ativo",
    },
    {
      id: 3,
      name: "123 Comércio",
      contact: "Pedro Diretor",
      email: "pedro@123comercio.com",
      phone: "(11) 7777-8888",
      employees: 80,
      activeTrainings: 2,
      status: "Inativo",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie as empresas clientes</p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-8 w-8 text-secondary-500 mt-1" />
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription>Contato: {client.contact}</CardDescription>
                  </div>
                </div>
                <Badge
                  variant={client.status === "Ativo" ? "default" : "secondary"}
                  className={client.status === "Ativo" ? "bg-primary-500" : ""}
                >
                  {client.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="mr-2 h-4 w-4" />
                  {client.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="mr-2 h-4 w-4" />
                  {client.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  {client.employees} funcionários
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Treinamentos Ativos</span>
                    <Badge variant="outline">{client.activeTrainings}</Badge>
                  </div>
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
