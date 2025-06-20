"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const students = [
    {
      id: 1,
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "(11) 99999-9999",
      company: "Empresa ABC",
      status: "Ativo",
      enrollments: 3,
      lastAccess: "2024-01-15",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria.santos@email.com",
      phone: "(11) 88888-8888",
      company: "Empresa XYZ",
      status: "Ativo",
      enrollments: 2,
      lastAccess: "2024-01-14",
    },
    {
      id: 3,
      name: "Pedro Oliveira",
      email: "pedro.oliveira@email.com",
      phone: "(11) 77777-7777",
      company: "Empresa 123",
      status: "Inativo",
      enrollments: 1,
      lastAccess: "2024-01-10",
    },
  ]

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
          <p className="text-gray-600">Gerencie os alunos cadastrados no sistema</p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus className="mr-2 h-4 w-4" />
          Novo Aluno
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou empresa..."
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

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>{filteredStudents.length} aluno(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Matrículas</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-1 h-3 w-3" />
                        {student.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="mr-1 h-3 w-3" />
                        {student.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.company}</TableCell>
                  <TableCell>
                    <Badge
                      variant={student.status === "Ativo" ? "default" : "secondary"}
                      className={student.status === "Ativo" ? "bg-primary-500" : ""}
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.enrollments}</TableCell>
                  <TableCell>{student.lastAccess}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
