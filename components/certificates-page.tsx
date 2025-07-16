"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  Download,
  Calendar,
  ChevronDown,
  ChevronUp,
  Users,
  Search,
  Filter,
  FileText,
  Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { getFinishedClasses, createCertificate } from "@/lib/api/superadmin"
import { CertificateGeneratorModal } from "./certificate-generator-modal"
import { toast } from "sonner"

export function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [finishedClasses, setFinishedClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [showCertificateModal, setShowCertificateModal] = useState(false)

  useEffect(() => {
    loadFinishedClasses()
  }, [currentPage])

  const loadFinishedClasses = async () => {
    try {
      setLoading(true)
      const response = await getFinishedClasses(currentPage, 10, searchTerm)
      setFinishedClasses(response.classes || [])
      setTotalPages(response.pagination?.totalPages || 1)
    } catch (error) {
      console.error('Erro ao carregar turmas concluídas:', error)
      toast.error('Erro ao carregar turmas concluídas')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCertificate = (student: any, classData: any) => {
    setSelectedStudent(student)
    setSelectedClass(classData)
    setShowCertificateModal(true)
  }

  const handleCertificateGenerated = async (certificateData: any) => {
    try {
      // Criar o certificado no banco de dados
      await createCertificate({
        studentId: selectedStudent.id,
        trainingId: selectedClass.training.id,
        instructorId: selectedClass.instructor.id,
        classId: selectedClass.id
      })
      
      toast.success('Certificado gerado e salvo com sucesso!')
      setShowCertificateModal(false)
    } catch (error) {
      console.error('Erro ao salvar certificado:', error)
      toast.error('Erro ao salvar certificado no banco')
    }
  }

  // Função para alternar a expansão de um grupo
  const toggleGroupExpansion = (groupId: string) => {
    if (expandedGroups.includes(groupId)) {
      setExpandedGroups(expandedGroups.filter((id) => id !== groupId))
    } else {
      setExpandedGroups([...expandedGroups, groupId])
    }
  }

  // Filtragem de grupos e certificados com base no termo de busca
  const filteredGroups = finishedClasses.filter((classItem) => {
    const classMatches =
      classItem.training?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const studentMatches = classItem.students?.some((student: any) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return classMatches || studentMatches
  })

  // Estatísticas de certificados
  const totalStudents = finishedClasses.reduce((sum, classItem) => sum + (classItem.students?.length || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        <span className="ml-2 text-lg">Carregando turmas concluídas...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificados</h1>
          <p className="text-gray-600">Gerencie os certificados das turmas concluídas</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{finishedClasses.length}</div>
            <p className="text-sm text-gray-600">Turmas Concluídas</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{totalStudents}</div>
            <p className="text-sm text-gray-600">Total de Alunos</p>
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
                placeholder="Buscar por aluno, turma, treinamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => loadFinishedClasses()}>
              <Filter className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certificados agrupados por turma */}
      <div className="space-y-6">
        {filteredGroups.map((classItem) => (
          <Card key={classItem.id} className="border-none shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader
              className="cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => toggleGroupExpansion(classItem.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary-500 rounded-lg">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{classItem.training?.title || 'Treinamento'}</CardTitle>
                    <CardDescription>
                      {classItem.instructor?.name && `Instrutor: ${classItem.instructor.name}`}
                      {classItem.client?.name && ` | Cliente: ${classItem.client.name}`}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-800">Concluída</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {expandedGroups.includes(classItem.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedGroups.includes(classItem.id) && (
              <CardContent className="pt-4">
                <div className="space-y-6">
                  {/* Informações da turma */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Alunos</p>
                        <p className="text-sm text-gray-600">{classItem.students?.length || 0} participantes</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Período</p>
                        <p className="text-sm text-gray-600">
                          {classItem.startDate && new Date(classItem.startDate).toLocaleDateString("pt-BR")}
                          {classItem.endDate && ` - ${new Date(classItem.endDate).toLocaleDateString("pt-BR")}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Carga Horária</p>
                        <p className="text-sm text-gray-600">{classItem.training?.durationHours || 0}h</p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de alunos */}
                  {classItem.students && classItem.students.length > 0 ? (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Alunos da Turma</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classItem.students.map((student: any) => (
                          <Card
                            key={student.id}
                            className="hover:shadow-md transition-all duration-300 border border-gray-200"
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-2">
                                  <Award className="h-5 w-5 text-primary-500" />
                                  <h3 className="font-medium text-gray-900">{student.name}</h3>
                                </div>
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">CPF:</span>
                                  <span className="font-medium">{student.cpf || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Email:</span>
                                  <span>{student.email || 'N/A'}</span>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-3">
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-primary-500 hover:bg-primary-600"
                                  onClick={() => handleGenerateCertificate(student, classItem)}
                                >
                                  <Download className="mr-1 h-3 w-3" />
                                  Gerar Certificado
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-600">Nenhum aluno encontrado</h3>
                      <p className="text-gray-500 mt-1">Esta turma não possui alunos cadastrados</p>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">Nenhuma turma concluída encontrada</h3>
            <p className="text-gray-500 mt-2">Não há turmas concluídas para exibir certificados</p>
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      {/* Modal do Gerador de Certificados */}
      <CertificateGeneratorModal
        open={showCertificateModal}
        onOpenChange={setShowCertificateModal}
        student={selectedStudent ? {
          id: selectedStudent.id,
          name: selectedStudent.name
        } : undefined}
        training={selectedClass ? {
          id: selectedClass.training.id,
          name: selectedClass.training.title,
          durationHours: selectedClass.training.durationHours
        } : undefined}
        instructor={selectedClass ? {
          id: selectedClass.instructor.id,
          name: selectedClass.instructor.name
        } : undefined}
        classData={selectedClass ? {
          id: selectedClass.id,
          startDate: selectedClass.startDate,
          endDate: selectedClass.endDate,
          location: selectedClass.location
        } : undefined}
        company={selectedClass?.client?.name}
        onCertificateGenerated={handleCertificateGenerated}
      />
    </div>
  )
}
