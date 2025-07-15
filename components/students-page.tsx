"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Edit, Trash2, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getStudents } from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"
import { StudentCreateModal } from "@/components/student-create-modal"
import { StudentEditModal } from "@/components/student-edit-modal"
import { StudentDeleteModal } from "@/components/student-delete-modal"

interface Student {
  id: string
  name: string
  cpf: string
  rg?: string
  gender?: string
  birthDate?: string
  education?: string
  zipCode?: string
  address?: string
  addressNumber?: string
  neighborhood?: string
  city?: string
  state?: string
  landlineAreaCode?: string
  landlineNumber?: string
  mobileAreaCode?: string
  mobileNumber?: string
  email?: string
  observations?: string
  clientId?: string
  isActive: boolean
  enrollmentDate?: string
  createdAt?: string
  updatedAt?: string
  client?: {
    id: string
    name: string
    corporateName?: string
    personType?: string
    email?: string
    responsibleName?: string
    responsiblePhone?: string
  }
}

export function StudentsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const limit = 10

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  // Load students data
  const loadStudents = async () => {
    setLoading(true)
    try {
      const response = await getStudents(currentPage, limit, searchTerm)
      
      // A API retorna: { students: [...], pagination: { page, limit, total, totalPages } }
      setStudents(response.students || [])
      setTotalPages(response.pagination?.totalPages || 0)
      setTotalStudents(response.pagination?.total || 0)
    } catch (error: any) {
      console.error('Erro ao carregar estudantes:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar estudantes",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [currentPage])

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      loadStudents()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setEditModalOpen(true)
  }

  const handleDelete = (student: Student) => {
    setSelectedStudent(student)
    setDeleteModalOpen(true)
  }

  const handleSuccess = () => {
    loadStudents()
  }

  const formatPhone = (areaCode?: string, number?: string) => {
    if (!areaCode || !number) return "-"
    return `(${areaCode}) ${number}`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
          <p className="text-gray-600">Gerencie os alunos cadastrados no sistema</p>
        </div>
        <Button 
          className="bg-primary-500 hover:bg-primary-600"
          onClick={() => setCreateModalOpen(true)}
        >
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
                placeholder="Buscar por nome, email, CPF ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>
            {loading ? "Carregando..." : `${totalStudents} aluno(s) encontrado(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Matrícula</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.cpf}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {student.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="mr-1 h-3 w-3" />
                            {student.email}
                          </div>
                        )}
                        {(student.mobileAreaCode && student.mobileNumber) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="mr-1 h-3 w-3" />
                            {formatPhone(student.mobileAreaCode, student.mobileNumber)}
                          </div>
                        )}
                        {(!student.email && !student.mobileAreaCode) && (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.client ? (
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{student.client.name}</div>
                          {student.client.responsibleName && (
                            <div className="text-xs text-gray-600">
                              Resp: {student.client.responsibleName}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={student.isActive ? "default" : "secondary"}
                        className={student.isActive ? "bg-primary-500" : ""}
                      >
                        {student.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString('pt-BR') : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(student)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(student)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <StudentCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleSuccess}
      />

      <StudentEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={handleSuccess}
        student={selectedStudent}
      />

      <StudentDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onSuccess={handleSuccess}
        student={selectedStudent}
      />
    </div>
  )
}
