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
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package
} from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getFinishedClasses, getFinishedClassesByClient, getFinishedClassesByInstructor, createCertificate, getUserClientId, getUserInstructorId } from "@/lib/api/superadmin"
import { CertificateGeneratorModal } from "./certificate-generator-modal"
import { generateBatchCertificatesPDFWithSignature, CertificateData } from "@/lib/certificate-generator"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"

export function CertificatesPage() {
  const { user, isClient, isInstructor } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [finishedClasses, setFinishedClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingCertificate, setPendingCertificate] = useState<{student: any, classData: any} | null>(null)
  const [batchGenerating, setBatchGenerating] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)
  const [instructorId, setInstructorId] = useState<string | null>(null)

  useEffect(() => {
    if (isClient && user?.id) {
      loadClientId()
    } else if (isInstructor && user?.id) {
      loadInstructorId()
    } else {
      loadFinishedClasses()
    }
  }, [currentPage, isClient, isInstructor, user?.id])

  const loadClientId = async () => {
    try {
      if (!user?.id) return
      const response = await getUserClientId(user.id)
      setClientId(response.clientId)
    } catch (error) {
      console.error('Erro ao carregar clientId:', error)
      toast.error('Erro ao carregar dados do cliente')
    }
  }

  const loadInstructorId = async () => {
    try {
      if (!user?.id) return
      console.log('Buscando instructorId para usuário:', user.id)
      const response = await getUserInstructorId(user.id)
      console.log('Resposta getUserInstructorId:', response)
      setInstructorId(response.instructorId)
      console.log('InstructorId definido como:', response.instructorId)
    } catch (error) {
      console.error('Erro ao carregar instructorId:', error)
      toast.error('Erro ao carregar dados do instrutor')
    }
  }

  useEffect(() => {
    if (clientId) {
      loadFinishedClasses()
    }
  }, [clientId])

  useEffect(() => {
    if (instructorId) {
      loadFinishedClasses()
    }
  }, [instructorId])

  // Recarregar quando o termo de busca mudar
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isClient && clientId) {
        loadFinishedClasses()
      } else if (isInstructor) {
        // Para instrutor, carregar sempre que instructorId estiver disponível
        loadFinishedClasses()
      } else if (!isClient && !isInstructor) {
        loadFinishedClasses()
      }
    }, 500) // Debounce de 500ms

    return () => clearTimeout(timeoutId)
  }, [searchTerm, instructorId])

  const loadFinishedClasses = async () => {
    try {
      setLoading(true)
      let response
      
      if (isClient) {
        // Se for cliente, verificar se tem clientId antes de fazer a requisição
        if (!clientId) {
          console.log('Aguardando clientId para carregar turmas...')
          return
        }
        response = await getFinishedClassesByClient(clientId, currentPage, 10, searchTerm)
      } else if (isInstructor) {
        // Se for instrutor, usar endpoint geral e filtrar no frontend
        response = await getFinishedClasses(currentPage, 10, searchTerm)
      } else {
        // Se for admin/superadmin, usar endpoint geral
        response = await getFinishedClasses(currentPage, 10, searchTerm)
      }
      
      let classes = response.classes || []
      
      // Filtrar classes do instrutor no frontend
      if (isInstructor && instructorId) {
        console.log('Todas as turmas recebidas:', classes.length)
        console.log('InstructorId para filtrar:', instructorId)
        console.log('Exemplo de turma:', classes[0])
        
        classes = classes.filter((classItem: any) => {
          const isInstructorClass = classItem.instructor?.id === instructorId || classItem.instructorId === instructorId
          console.log(`Turma ${classItem.id} - Instrutor: ${classItem.instructor?.id || classItem.instructorId} - É do instrutor: ${isInstructorClass}`)
          return isInstructorClass
        })
        
        console.log(`Turmas filtradas para instrutor ${instructorId}:`, classes.length)
      }
      
      setFinishedClasses(classes)
      setTotalPages(response.pagination?.totalPages || 1)
    } catch (error) {
      console.error('Erro ao carregar turmas concluídas:', error)
      toast.error('Erro ao carregar turmas concluídas')
    } finally {
      setLoading(false)
    }
  }

  // Função para calcular se a turma está próxima do vencimento
  const calculateExpirationStatus = (classItem: any) => {
    const today = new Date()
    const endDate = new Date(classItem.endDate)
    const validityDays = classItem.training?.validityDays || 365 // fallback para 365 dias
    
    // Calcular a data de vencimento da validade (fim da turma + dias de validade)
    const expirationDate = new Date(endDate)
    expirationDate.setDate(expirationDate.getDate() + validityDays)
    
    // Calcular a diferença em dias
    const diffTime = expirationDate.getTime() - today.getTime()
    const daysUntilExpiration = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return {
      daysUntilExpiration,
      isExpired: daysUntilExpiration <= 0,
      isExpiringSoon: daysUntilExpiration > 0 && daysUntilExpiration <= 30, // Considerar "próximo do vencimento" se restam 30 dias ou menos
      expirationDate
    }
  }

  const handleGenerateCertificate = (student: any, classData: any) => {
    // Verificar se o estudante tem faltas
    const hasAbsences = student.hasAbsences || student.totalAbsences > 0
    
    // Se for cliente e o estudante tiver faltas, não permitir geração
    if (isClient && hasAbsences) {
      toast.error('Não é possível gerar certificado para estudante com faltas')
      return
    }
    
    // Se for instrutor ou admin e o estudante tiver faltas, mostrar dialog de confirmação
    if ((isInstructor || (!isClient && !isInstructor)) && hasAbsences) {
      setPendingCertificate({ student, classData })
      setShowConfirmDialog(true)
      return
    }
    
    // Se não há faltas ou é um caso permitido, gerar certificado diretamente
    proceedWithCertificateGeneration(student, classData)
  }

  const proceedWithCertificateGeneration = (student: any, classData: any) => {
    setSelectedStudent(student)
    setSelectedClass(classData)
    setShowCertificateModal(true)
  }

  const handleConfirmGeneration = () => {
    if (pendingCertificate) {
      proceedWithCertificateGeneration(pendingCertificate.student, pendingCertificate.classData)
    }
    setShowConfirmDialog(false)
    setPendingCertificate(null)
  }

  const handleCancelGeneration = () => {
    setShowConfirmDialog(false)
    setPendingCertificate(null)
  }

  const getAttendanceInfo = (student: any) => {
    const totalLessons = student.attendances ? student.attendances.length : 0
    const presentCount = student.attendances ? student.attendances.filter((att: any) => att.status === 'PRESENTE').length : 0
    const absentCount = student.totalAbsences || 0
    
    return {
      totalLessons,
      presentCount,
      absentCount,
      hasAbsences: student.hasAbsences || absentCount > 0
    }
  }

  const getAttendanceStatusColor = (hasAbsences: boolean) => {
    return hasAbsences ? 'text-red-600' : 'text-green-600'
  }

  const getAttendanceStatusIcon = (hasAbsences: boolean) => {
    return hasAbsences ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />
  }

  const handleBatchGenerate = async (classItem: any) => {
    try {
      setBatchGenerating(true)
      
      // Filtrar apenas estudantes sem faltas
      const eligibleStudents = classItem.students?.filter((student: any) => {
        const attendanceInfo = getAttendanceInfo(student)
        return !attendanceInfo.hasAbsences
      }) || []

      if (eligibleStudents.length === 0) {
        toast.error('Nenhum estudante sem faltas encontrado para gerar certificados')
        return
      }

      // Preparar dados dos certificados
      const certificates: CertificateData[] = eligibleStudents.map((student: any) => {
        const startDate = classItem.startDate ? new Date(classItem.startDate).toLocaleDateString('pt-BR') : ''
        const endDate = classItem.endDate ? new Date(classItem.endDate).toLocaleDateString('pt-BR') : ''
        
        return {
          studentName: student.name,
          trainingName: classItem.training?.title || 'Treinamento',
          instructorName: classItem.instructor?.name || 'Instrutor',
          issueDate: new Date().toLocaleDateString('pt-BR'),
          validationCode: `${classItem.id}-${student.id}`.slice(-12).toUpperCase(),
          workload: `${classItem.training?.durationHours || 0} horas`,
          company: classItem.client?.name,
          location: classItem.location,
          startDate,
          endDate
        }
      })

      // Gerar PDF em lote
      await generateBatchCertificatesPDFWithSignature(
        certificates,
        classItem.instructor?.id,
        classItem.training?.title
      )

      // Salvar certificados no banco de dados
      const savePromises = eligibleStudents.map(async (student: any) => {
        try {
          await createCertificate({
            studentId: student.id,
            trainingId: classItem.training.id,
            instructorId: classItem.instructor.id,
            classId: classItem.id
          })
        } catch (error) {
          console.error(`Erro ao salvar certificado para ${student.name}:`, error)
        }
      })

      await Promise.all(savePromises)

      toast.success(`${eligibleStudents.length} certificados gerados com sucesso!`)
      
    } catch (error) {
      console.error('Erro ao gerar certificados em lote:', error)
      toast.error('Erro ao gerar certificados em lote')
    } finally {
      setBatchGenerating(false)
    }
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
          <p className="text-gray-600">
            {isClient 
              ? "Gerencie os certificados das suas turmas concluídas" 
              : "Gerencie os certificados das turmas concluídas"
            }
          </p>
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
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center space-x-4 cursor-pointer flex-1"
                  onClick={() => toggleGroupExpansion(classItem.id)}
                >
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
                  {(() => {
                    const expirationStatus = calculateExpirationStatus(classItem)
                    if (expirationStatus.isExpired) {
                      return (
                        <Badge className="bg-red-100 text-red-800">
                          Certificado Expirado
                        </Badge>
                      )
                    } else if (expirationStatus.isExpiringSoon) {
                      return (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Expira em {expirationStatus.daysUntilExpiration} dia{expirationStatus.daysUntilExpiration !== 1 ? 's' : ''}
                        </Badge>
                      )
                    }
                    return null
                  })()}
                  
                  {/* Botão de geração em lote */}
                  {(() => {
                    const eligibleStudents = classItem.students?.filter((student: any) => {
                      const attendanceInfo = getAttendanceInfo(student)
                      return !attendanceInfo.hasAbsences
                    }) || []
                    
                    if (eligibleStudents.length > 0) {
                      return (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBatchGenerate(classItem)
                          }}
                          disabled={batchGenerating}
                          className="gap-2"
                        >
                          {batchGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Package className="h-4 w-4" />
                          )}
                          Gerar Lote ({eligibleStudents.length})
                        </Button>
                      )
                    }
                    return null
                  })()}
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => toggleGroupExpansion(classItem.id)}
                  >
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
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Validade do Certificado</p>
                        {(() => {
                          const expirationStatus = calculateExpirationStatus(classItem)
                          if (expirationStatus.isExpired) {
                            return <p className="text-sm text-red-600 font-medium">Expirado</p>
                          } else if (expirationStatus.isExpiringSoon) {
                            return <p className="text-sm text-yellow-600 font-medium">Expira em {expirationStatus.daysUntilExpiration} dia{expirationStatus.daysUntilExpiration !== 1 ? 's' : ''}</p>
                          } else {
                            return <p className="text-sm text-green-600 font-medium">Válido por {expirationStatus.daysUntilExpiration} dia{expirationStatus.daysUntilExpiration !== 1 ? 's' : ''}</p>
                          }
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Sem Faltas</p>
                        <p className="text-sm text-green-600">
                          {(() => {
                            const eligibleStudents = classItem.students?.filter((student: any) => {
                              const attendanceInfo = getAttendanceInfo(student)
                              return !attendanceInfo.hasAbsences
                            }) || []
                            return `${eligibleStudents.length} estudante${eligibleStudents.length !== 1 ? 's' : ''}`
                          })()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-sm font-medium">Com Faltas</p>
                        <p className="text-sm text-red-600">
                          {(() => {
                            const studentsWithAbsences = classItem.students?.filter((student: any) => {
                              const attendanceInfo = getAttendanceInfo(student)
                              return attendanceInfo.hasAbsences
                            }) || []
                            return `${studentsWithAbsences.length} estudante${studentsWithAbsences.length !== 1 ? 's' : ''}`
                          })()}
                        </p>
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
                                {(() => {
                                  const expirationStatus = calculateExpirationStatus(classItem)
                                  if (expirationStatus.isExpired) {
                                    return (
                                      <Badge className="bg-red-100 text-red-800 text-xs">
                                        Expirado
                                      </Badge>
                                    )
                                  } else if (expirationStatus.isExpiringSoon) {
                                    return (
                                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                        {expirationStatus.daysUntilExpiration}d
                                      </Badge>
                                    )
                                  } else {
                                    return (
                                      <Badge className="bg-green-100 text-green-800 text-xs">
                                        Válido
                                      </Badge>
                                    )
                                  }
                                })()}
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
                                {(() => {
                                  const attendanceInfo = getAttendanceInfo(student)
                                  return (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Presenças:</span>
                                        <span className="font-medium">{attendanceInfo.presentCount}/{attendanceInfo.totalLessons}</span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Status:</span>
                                        <div className={`flex items-center gap-1 ${getAttendanceStatusColor(attendanceInfo.hasAbsences)}`}>
                                          {getAttendanceStatusIcon(attendanceInfo.hasAbsences)}
                                          <span className="font-medium">
                                            {attendanceInfo.hasAbsences ? `${attendanceInfo.absentCount} falta(s)` : 'Sem faltas'}
                                          </span>
                                        </div>
                                      </div>
                                    </>
                                  )
                                })()}
                              </div>

                              <div className="flex gap-2 pt-3">
                                {(() => {
                                  const attendanceInfo = getAttendanceInfo(student)
                                  
                                  // Se for cliente e o estudante tiver faltas, desabilitar o botão
                                  if (isClient && attendanceInfo.hasAbsences) {
                                    return (
                                      <Button 
                                        size="sm" 
                                        className="flex-1 bg-gray-400 cursor-not-allowed"
                                        disabled
                                      >
                                        <XCircle className="mr-1 h-3 w-3" />
                                        Não Disponível (Faltas)
                                      </Button>
                                    )
                                  }
                                  
                                  // Se for instrutor/admin e o estudante tiver faltas, mostrar aviso
                                  if ((isInstructor || (!isClient && !isInstructor)) && attendanceInfo.hasAbsences) {
                                    return (
                                      <Button 
                                        size="sm" 
                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                                        onClick={() => handleGenerateCertificate(student, classItem)}
                                      >
                                        <AlertTriangle className="mr-1 h-3 w-3" />
                                        Gerar com Faltas
                                      </Button>
                                    )
                                  }
                                  
                                  // Caso padrão - sem faltas
                                  return (
                                    <Button 
                                      size="sm" 
                                      className="flex-1 bg-primary-500 hover:bg-primary-600"
                                      onClick={() => handleGenerateCertificate(student, classItem)}
                                    >
                                      <Download className="mr-1 h-3 w-3" />
                                      Gerar Certificado
                                    </Button>
                                  )
                                })()}
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
            <h3 className="text-xl font-medium text-gray-600">
              {isClient 
                ? "Você não possui turmas concluídas" 
                : "Nenhuma turma concluída encontrada"
              }
            </h3>
            <p className="text-gray-500 mt-2">
              {isClient 
                ? "Suas turmas concluídas aparecerão aqui para emissão de certificados" 
                : "Não há turmas concluídas para exibir certificados"
              }
            </p>
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

      {/* Dialog de Confirmação para Estudantes com Faltas */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Confirmar Geração de Certificado
            </AlertDialogTitle>
            <AlertDialogDescription>
              O estudante <strong>{pendingCertificate?.student.name}</strong> possui faltas registradas.
              <br />
              <br />
              {(() => {
                if (pendingCertificate) {
                  const attendanceInfo = getAttendanceInfo(pendingCertificate.student)
                  return (
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Total de aulas:</span>
                          <span className="font-medium">{attendanceInfo.totalLessons}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Presenças:</span>
                          <span className="font-medium text-green-600">{attendanceInfo.presentCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Faltas:</span>
                          <span className="font-medium text-red-600">{attendanceInfo.absentCount}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              })()}
              <br />
              Deseja continuar mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelGeneration}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmGeneration} className="bg-yellow-500 hover:bg-yellow-600">
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
