"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Award,
  Download,
  Eye,
  Calendar,
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  Search,
  Filter,
} from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

export function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedGroups, setExpandedGroups] = useState<number[]>([1, 2]) // IDs das turmas expandidas por padrão

  // Dados das turmas
  const groups = [
    {
      id: 1,
      name: "Turma Segurança A - Janeiro",
      training: "Segurança do Trabalho",
      instructor: "Carlos Silva",
      students: 25,
      completedStudents: 23,
      startDate: "2024-01-20",
      endDate: "2024-01-20",
      status: "Concluída",
      certificates: [
        {
          id: 101,
          student: "João Silva",
          issueDate: "2024-01-22",
          certificateNumber: "WT-2024-001",
          status: "Emitido",
          downloadCount: 3,
          lastDownload: "2024-01-25",
        },
        {
          id: 102,
          student: "Maria Santos",
          issueDate: "2024-01-22",
          certificateNumber: "WT-2024-002",
          status: "Emitido",
          downloadCount: 1,
          lastDownload: "2024-01-23",
        },
        {
          id: 103,
          student: "Pedro Oliveira",
          issueDate: "2024-01-22",
          certificateNumber: "WT-2024-003",
          status: "Emitido",
          downloadCount: 0,
          lastDownload: "-",
        },
        {
          id: 104,
          student: "Ana Pereira",
          issueDate: "2024-01-22",
          certificateNumber: "WT-2024-004",
          status: "Emitido",
          downloadCount: 2,
          lastDownload: "2024-01-24",
        },
        {
          id: 105,
          student: "Carlos Mendes",
          issueDate: "-",
          certificateNumber: "-",
          status: "Pendente",
          downloadCount: 0,
          lastDownload: "-",
        },
      ],
    },
    {
      id: 2,
      name: "Excel Avançado - Turma 1",
      training: "Excel Avançado",
      instructor: "Ana Santos",
      students: 15,
      completedStudents: 15,
      startDate: "2024-01-22",
      endDate: "2024-02-05",
      status: "Concluída",
      certificates: [
        {
          id: 201,
          student: "Roberto Lima",
          issueDate: "2024-02-07",
          certificateNumber: "WT-2024-015",
          status: "Emitido",
          downloadCount: 1,
          lastDownload: "2024-02-08",
        },
        {
          id: 202,
          student: "Fernanda Costa",
          issueDate: "2024-02-07",
          certificateNumber: "WT-2024-016",
          status: "Emitido",
          downloadCount: 0,
          lastDownload: "-",
        },
        {
          id: 203,
          student: "Lucas Martins",
          issueDate: "2024-02-07",
          certificateNumber: "WT-2024-017",
          status: "Emitido",
          downloadCount: 2,
          lastDownload: "2024-02-10",
        },
      ],
    },
    {
      id: 3,
      name: "Liderança - Workshop Executivo",
      training: "Liderança e Gestão",
      instructor: "Roberto Lima",
      students: 20,
      completedStudents: 18,
      startDate: "2024-01-15",
      endDate: "2024-01-18",
      status: "Concluída",
      certificates: [
        {
          id: 301,
          student: "Juliana Alves",
          issueDate: "2024-01-20",
          certificateNumber: "WT-2024-025",
          status: "Emitido",
          downloadCount: 4,
          lastDownload: "2024-01-30",
        },
        {
          id: 302,
          student: "Marcos Souza",
          issueDate: "2024-01-20",
          certificateNumber: "WT-2024-026",
          status: "Emitido",
          downloadCount: 1,
          lastDownload: "2024-01-21",
        },
        {
          id: 303,
          student: "Camila Ferreira",
          issueDate: "-",
          certificateNumber: "-",
          status: "Pendente",
          downloadCount: 0,
          lastDownload: "-",
        },
        {
          id: 304,
          student: "Ricardo Gomes",
          issueDate: "-",
          certificateNumber: "-",
          status: "Pendente",
          downloadCount: 0,
          lastDownload: "-",
        },
      ],
    },
    {
      id: 4,
      name: "NR-35 - Trabalho em Altura",
      training: "Segurança do Trabalho",
      instructor: "Carlos Silva",
      students: 12,
      completedStudents: 12,
      startDate: "2024-02-10",
      endDate: "2024-02-11",
      status: "Concluída",
      certificates: [
        {
          id: 401,
          student: "Paulo Ribeiro",
          issueDate: "2024-02-13",
          certificateNumber: "WT-2024-035",
          status: "Emitido",
          downloadCount: 2,
          lastDownload: "2024-02-15",
        },
        {
          id: 402,
          student: "Mariana Costa",
          issueDate: "2024-02-13",
          certificateNumber: "WT-2024-036",
          status: "Emitido",
          downloadCount: 1,
          lastDownload: "2024-02-14",
        },
      ],
    },
    {
      id: 5,
      name: "Gestão de Projetos - Turma 2",
      training: "Gestão de Projetos",
      instructor: "Fernanda Oliveira",
      students: 18,
      completedStudents: 0,
      startDate: "2024-02-15",
      endDate: "2024-03-15",
      status: "Em Andamento",
      certificates: [],
    },
  ]

  // Função para alternar a expansão de um grupo
  const toggleGroupExpansion = (groupId: number) => {
    if (expandedGroups.includes(groupId)) {
      setExpandedGroups(expandedGroups.filter((id) => id !== groupId))
    } else {
      setExpandedGroups([...expandedGroups, groupId])
    }
  }

  // Filtragem de grupos e certificados com base no termo de busca
  const filteredGroups = groups.filter((group) => {
    const groupMatches =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.training.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.instructor.toLowerCase().includes(searchTerm.toLowerCase())

    const certificateMatches = group.certificates.some(
      (cert) =>
        cert.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return groupMatches || certificateMatches
  })

  // Estatísticas de certificados
  const totalCertificates = groups.reduce((sum, group) => sum + group.certificates.length, 0)
  const issuedCertificates = groups.reduce(
    (sum, group) => sum + group.certificates.filter((cert) => cert.status === "Emitido").length,
    0,
  )
  const pendingCertificates = totalCertificates - issuedCertificates
  const downloadedCertificates = groups.reduce(
    (sum, group) => sum + group.certificates.filter((cert) => cert.downloadCount > 0).length,
    0,
  )

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Emitido":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Função para obter a cor do status da turma
  const getGroupStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-green-100 text-green-800"
      case "Em Andamento":
        return "bg-blue-100 text-blue-800"
      case "Agendada":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificados</h1>
          <p className="text-gray-600">Gerencie os certificados emitidos por turma</p>
        </div>
        <Button className="bg-primary-500 hover:bg-primary-600">
          <Plus className="mr-2 h-4 w-4" />
          Emitir Certificado
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{totalCertificates}</div>
            <p className="text-sm text-gray-600">Total de Certificados</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{issuedCertificates}</div>
            <p className="text-sm text-gray-600">Certificados Emitidos</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{pendingCertificates}</div>
            <p className="text-sm text-gray-600">Certificados Pendentes</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{downloadedCertificates}</div>
            <p className="text-sm text-gray-600">Certificados Baixados</p>
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
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certificados agrupados por turma */}
      <div className="space-y-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="border-none shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader
              className="cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => toggleGroupExpansion(group.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary-500 rounded-lg">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription>{group.training}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getGroupStatusColor(group.status)}>{group.status}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {expandedGroups.includes(group.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedGroups.includes(group.id) && (
              <CardContent className="pt-4">
                <div className="space-y-6">
                  {/* Informações da turma */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Instrutor</p>
                        <p className="text-sm text-gray-600">{group.instructor}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Período</p>
                        <p className="text-sm text-gray-600">
                          {new Date(group.startDate).toLocaleDateString("pt-BR")} a{" "}
                          {new Date(group.endDate).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Progresso de Certificação</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={(group.completedStudents / group.students) * 100} className="h-2 flex-1" />
                          <span className="text-xs text-gray-600">
                            {group.completedStudents}/{group.students}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de certificados */}
                  {group.certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.certificates.map((certificate) => (
                        <Card
                          key={certificate.id}
                          className="hover:shadow-md transition-all duration-300 border border-gray-200"
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center space-x-2">
                                <Award className="h-5 w-5 text-primary-500" />
                                <h3 className="font-medium text-gray-900">{certificate.student}</h3>
                              </div>
                              <Badge className={getStatusColor(certificate.status)}>{certificate.status}</Badge>
                            </div>

                            <div className="space-y-2 text-sm">
                              {certificate.status === "Emitido" && (
                                <>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Nº Certificado:</span>
                                    <span className="font-medium">{certificate.certificateNumber}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Emitido em:</span>
                                    <span>{certificate.issueDate}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Downloads:</span>
                                    <span>{certificate.downloadCount}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Último download:</span>
                                    <span>{certificate.lastDownload}</span>
                                  </div>
                                </>
                              )}

                              {certificate.status === "Pendente" && (
                                <div className="py-2 text-center text-yellow-600">Certificado ainda não emitido</div>
                              )}

                              <div className="flex gap-2 pt-3">
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Eye className="mr-1 h-3 w-3" />
                                  Visualizar
                                </Button>
                                {certificate.status === "Emitido" && (
                                  <Button size="sm" className="flex-1 bg-primary-500 hover:bg-primary-600">
                                    <Download className="mr-1 h-3 w-3" />
                                    Download
                                  </Button>
                                )}
                                {certificate.status === "Pendente" && (
                                  <Button size="sm" className="flex-1 bg-secondary-500 hover:bg-secondary-600">
                                    <Award className="mr-1 h-3 w-3" />
                                    Emitir
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-600">Nenhum certificado disponível</h3>
                      <p className="text-gray-500 mt-1">Esta turma ainda não possui certificados emitidos</p>
                      {group.status === "Concluída" && (
                        <Button className="mt-4 bg-primary-500 hover:bg-primary-600">
                          <Plus className="mr-2 h-4 w-4" />
                          Emitir Certificados em Lote
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Ações da turma */}
                  <div className="flex justify-end space-x-3 pt-2 border-t">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Turma
                    </Button>
                    {group.status === "Concluída" && group.certificates.some((c) => c.status === "Pendente") && (
                      <Button size="sm" className="bg-primary-500 hover:bg-primary-600">
                        <Award className="mr-2 h-4 w-4" />
                        Emitir Certificados Pendentes
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {filteredGroups.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">Nenhuma turma encontrada</h3>
            <p className="text-gray-500 mt-2">Tente ajustar seus filtros de busca</p>
          </div>
        )}
      </div>
    </div>
  )
}
