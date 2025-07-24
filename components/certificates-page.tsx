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
import { 
  getFinishedClasses, 
  getFinishedClassesByClient, 
  getFinishedClassesByInstructor, 
  createCertificate, 
  getUserClientId, 
  getUserInstructorId,
  getCertificateEligibility,
  getCompletedClassesWithEligibility,
  getClientEligibleClasses,
  downloadCertificatePDF,
  downloadBatchCertificates,
  type CertificateEligibilityStudent,
  type CompletedClassWithEligibility,
  type ClientEligibleClassesResponse
} from "@/lib/api/superadmin"
import { CertificateGeneratorModal } from "./certificate-generator-modal"
import { CertificatePreviewModal } from "./certificate-preview-modal"
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
  
  // Novos estados para a API de elegibilidade
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean
    classId: string
    studentId: string
    studentName: string
    trainingTitle: string
  }>({
    isOpen: false,
    classId: '',
    studentId: '',
    studentName: '',
    trainingTitle: ''
  })
  const [eligibilityMode, setEligibilityMode] = useState(true) // Usar nova API por padrão

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
      let classes: any[] = []
      
      if (eligibilityMode) {
        // Usar nova API de elegibilidade
        if (isClient && clientId) {
          const response = await getClientEligibleClasses(clientId)
          classes = response.classes.map(cls => ({
            id: cls.classId,
            training: { 
              title: cls.trainingName,
              durationHours: cls.trainingDurationHours,
              validityDays: cls.certificateValidityDays
            },
            startDate: cls.startDate,
            endDate: cls.endDate,
            status: cls.status,
            location: cls.location,
            students: cls.students.map(student => ({
              id: student.studentId,
              name: student.studentName,
              cpf: student.studentCpf,
              email: student.studentEmail,
              practicalGrade: student.practicalGrade,
              theoreticalGrade: student.theoreticalGrade,
              averageGrade: student.averageGrade,
              totalLessons: student.totalLessons,
              attendedLessons: student.attendedLessons,
              absences: student.absences,
              isEligible: student.isEligible,
              eligibilityReason: student.reason,
              hasAbsences: student.absences > 0
            }))
          }))
        } else if (!isClient) {
          // Admin/Instrutor - usar API geral de turmas concluídas
          const response = await getCompletedClassesWithEligibility()
          classes = response.map(cls => ({
            id: cls.classId,
            training: { 
              title: cls.trainingName,
              durationHours: cls.trainingDurationHours,
              validityDays: cls.certificateValidityDays
            },
            startDate: cls.startDate,
            endDate: cls.endDate,
            status: cls.status,
            location: cls.location,
            students: cls.students.map(student => ({
              id: student.studentId,
              name: student.studentName,
              cpf: student.studentCpf,
              email: student.studentEmail,
              practicalGrade: student.practicalGrade,
              theoreticalGrade: student.theoreticalGrade,
              averageGrade: student.averageGrade,
              totalLessons: student.totalLessons,
              attendedLessons: student.attendedLessons,
              absences: student.absences,
              isEligible: student.isEligible,
              eligibilityReason: student.reason,
              hasAbsences: student.absences > 0
            }))
          }))
          
          // Filtrar por instrutor se necessário
          if (isInstructor && instructorId) {
            classes = classes.filter((classItem: any) => 
              classItem.instructor?.id === instructorId || classItem.instructorId === instructorId
            )
          }
        }
      } else {
        // Usar API antiga (manter compatibilidade)
        let response
        
        if (isClient) {
          if (!clientId) {
            console.log('Aguardando clientId para carregar turmas...')
            return
          }
          response = await getFinishedClassesByClient(clientId, currentPage, 10, searchTerm)
        } else if (isInstructor) {
          response = await getFinishedClasses(currentPage, 10, searchTerm)
        } else {
          response = await getFinishedClasses(currentPage, 10, searchTerm)
        }
        
        classes = response.classes || []
        
        // Filtrar classes do instrutor no frontend
        if (isInstructor && instructorId) {
          classes = classes.filter((classItem: any) => {
            const isInstructorClass = classItem.instructor?.id === instructorId || classItem.instructorId === instructorId
            return isInstructorClass
          })
        }
        
        setTotalPages(response.pagination?.totalPages || 1)
      }
      
      setFinishedClasses(classes)
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
    if (eligibilityMode) {
      // Nova abordagem: usar elegibilidade da API, mas permitir geração mesmo se não elegível
      if (!student.isEligible) {
        // Mostrar toast informativo mas permitir continuar
        toast.warning(`Atenção: ${student.eligibilityReason}. Gerando certificado mesmo assim.`)
      }
      
      // Abrir modal de preview do certificado (sempre permitir)
      setPreviewModal({
        isOpen: true,
        classId: classData.id,
        studentId: student.id,
        studentName: student.name,
        trainingTitle: classData.training.title
      })
    } else {
      // Abordagem antiga: verificar se o estudante tem faltas
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
  }

  const handleCloseCertificatePreview = () => {
    setPreviewModal({
      isOpen: false,
      classId: '',
      studentId: '',
      studentName: '',
      trainingTitle: ''
    })
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
    // Usar dados da nova API de elegibilidade se disponível
    if (eligibilityMode && student.totalLessons !== undefined) {
      return {
        totalLessons: student.totalLessons,
        presentCount: student.attendedLessons,
        absentCount: student.absences,
        hasAbsences: student.absences > 0
      }
    }
    
    // Fallback para API antiga
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

  // Nova função para obter informações de notas (conforme nova API)
  const getGradesInfo = (student: any) => {
    if (!eligibilityMode) return null
    
    // Verificar se pelo menos uma nota existe e é um número válido
    const hasPracticalGrade = student.practicalGrade !== null && student.practicalGrade !== undefined && !isNaN(Number(student.practicalGrade))
    const hasTheoreticalGrade = student.theoreticalGrade !== null && student.theoreticalGrade !== undefined && !isNaN(Number(student.theoreticalGrade))
    const hasAverageGrade = student.averageGrade !== null && student.averageGrade !== undefined && !isNaN(Number(student.averageGrade))
    
    if (!hasPracticalGrade && !hasTheoreticalGrade && !hasAverageGrade) return null
    
    return {
      practicalGrade: hasPracticalGrade ? Number(student.practicalGrade) : null,
      theoreticalGrade: hasTheoreticalGrade ? Number(student.theoreticalGrade) : null,
      averageGrade: hasAverageGrade ? Number(student.averageGrade) : null,
      hasFailingGrade: (hasPracticalGrade && Number(student.practicalGrade) < 5.0) || 
                       (hasTheoreticalGrade && Number(student.theoreticalGrade) < 5.0)
    }
  }

  // Função para determinar o status de elegibilidade baseado no motivo
  const getEligibilityStatus = (student: any) => {
    if (!eligibilityMode || student.isEligible) {
      return {
        type: 'eligible',
        label: 'Apto para certificado',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: <CheckCircle className="h-4 w-4" />
      }
    }
    
    const reason = student.eligibilityReason.toLowerCase()
    
    if (reason.includes('nota')) {
      return {
        type: 'failed_grade',
        label: 'Reprovado por Nota',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: <XCircle className="h-4 w-4" />
      }
    }
    
    if (reason.includes('falta')) {
      return {
        type: 'absences',
        label: 'Reprovado por Faltas',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: <AlertTriangle className="h-4 w-4" />
      }
    }
    
    if (reason.includes('bloqueado')) {
      return {
        type: 'blocked',
        label: 'Certificado Bloqueado',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        icon: <XCircle className="h-4 w-4" />
      }
    }
    
    return {
      type: 'not_eligible',
      label: 'Não Elegível',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: <XCircle className="h-4 w-4" />
    }
  }

  const handleBatchGenerate = async (classItem: any) => {
    try {
      setBatchGenerating(true)
      
      console.log('🔄 Iniciando geração de certificados em lote...')
      
      // Usar a nova API de geração em lote
      const result = await downloadBatchCertificates(
        classItem.id,
        classItem.training?.title
      )
      
      // Mostrar feedback detalhado para o usuário
      const { eligibleStudents, totalStudents, fileName } = result
      
      if (eligibleStudents < totalStudents) {
        toast.warning(
          `Certificados gerados: ${eligibleStudents}/${totalStudents} estudantes elegíveis. ` +
          `${totalStudents - eligibleStudents} estudante(s) não elegível(is) foram incluídos.`
        )
      } else {
        toast.success(`${eligibleStudents} certificados gerados com sucesso!`)
      }
      
      console.log(`✅ Download completado: ${fileName}`)
      
    } catch (error: any) {
      console.error('Erro ao gerar certificados em lote:', error)
      
      // Tratamento específico de erros
      if (error.message?.includes('Nenhum aluno elegível')) {
        toast.error('Nenhum aluno elegível encontrado nesta turma')
      } else if (error.message?.includes('Turma não encontrada')) {
        toast.error('Turma não encontrada')
      } else {
        toast.error('Erro ao gerar certificados em lote. Tente novamente.')
      }
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
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => loadFinishedClasses()}>
            🔄 Atualizar
          </Button>
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
                    let eligibleStudents
                    let buttonText
                    let buttonColor = "outline"
                    
                    if (eligibilityMode) {
                      // Nova lógica: incluir todos os estudantes, mas distinguir elegíveis
                      const allStudents = classItem.students || []
                      const trulyEligible = allStudents.filter((student: any) => student.isEligible)
                      const notEligible = allStudents.filter((student: any) => !student.isEligible)
                      
                      if (allStudents.length > 0) {
                        if (trulyEligible.length === allStudents.length) {
                          // Todos elegíveis
                          eligibleStudents = allStudents
                          buttonText = `Gerar Lote (${allStudents.length})`
                        } else if (trulyEligible.length > 0) {
                          // Misturado: alguns elegíveis, alguns não
                          eligibleStudents = allStudents
                          buttonText = `Gerar Lote (${trulyEligible.length} elegíveis + ${notEligible.length} não elegíveis)`
                          buttonColor = "yellow"
                        } else {
                          // Nenhum elegível
                          eligibleStudents = allStudents
                          buttonText = `Gerar Lote (${allStudents.length} não elegíveis)`
                          buttonColor = "yellow"
                        }
                      }
                    } else {
                      // Lógica antiga: verificar faltas
                      eligibleStudents = classItem.students?.filter((student: any) => {
                        const attendanceInfo = getAttendanceInfo(student)
                        return !attendanceInfo.hasAbsences
                      }) || []
                      
                      if (eligibleStudents.length > 0) {
                        buttonText = `Gerar Lote (${eligibleStudents.length})`
                      }
                    }
                    
                    if (eligibleStudents && eligibleStudents.length > 0) {
                      return (
                        <Button
                          variant={buttonColor === "yellow" ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBatchGenerate(classItem)
                          }}
                          disabled={batchGenerating}
                          className={`gap-2 ${buttonColor === "yellow" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}`}
                        >
                          {batchGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : buttonColor === "yellow" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <Package className="h-4 w-4" />
                          )}
                          {buttonText}
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
                        <p className="text-sm text-gray-600">
                          {eligibilityMode && classItem.totalStudents 
                            ? `${classItem.totalStudents} participantes`
                            : `${classItem.students?.length || 0} participantes`
                          }
                        </p>
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
                        <p className="text-sm text-gray-600">
                          {eligibilityMode && classItem.training?.durationHours 
                            ? `${classItem.training.durationHours}h`
                            : `${classItem.training?.durationHours || 0}h`
                          }
                        </p>
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
                        <p className="text-sm font-medium">
                          {eligibilityMode ? 'Alunos Elegíveis' : 'Sem Faltas'}
                        </p>
                        <p className="text-sm text-green-600">
                          {(() => {
                            if (eligibilityMode) {
                              const eligibleStudents = classItem.students?.filter((student: any) => student.isEligible) || []
                              return `${eligibleStudents.length} estudante${eligibleStudents.length !== 1 ? 's' : ''}`
                            } else {
                              const eligibleStudents = classItem.students?.filter((student: any) => {
                                const attendanceInfo = getAttendanceInfo(student)
                                return !attendanceInfo.hasAbsences
                              }) || []
                              return `${eligibleStudents.length} estudante${eligibleStudents.length !== 1 ? 's' : ''}`
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-sm font-medium">
                          {eligibilityMode ? 'Não Elegíveis' : 'Com Faltas'}
                        </p>
                        <p className="text-sm text-red-600">
                          {(() => {
                            if (eligibilityMode) {
                              const ineligibleStudents = classItem.students?.filter((student: any) => !student.isEligible) || []
                              return `${ineligibleStudents.length} estudante${ineligibleStudents.length !== 1 ? 's' : ''}`
                            } else {
                              const studentsWithAbsences = classItem.students?.filter((student: any) => {
                                const attendanceInfo = getAttendanceInfo(student)
                                return attendanceInfo.hasAbsences
                              }) || []
                              return `${studentsWithAbsences.length} estudante${studentsWithAbsences.length !== 1 ? 's' : ''}`
                            }
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
                                {student.email && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <span>{student.email}</span>
                                  </div>
                                )}
                                
                                {/* Informações de Notas (apenas no modo elegibilidade) */}
                                {(() => {
                                  const gradesInfo = getGradesInfo(student)
                                  if (gradesInfo) {
                                    return (
                                      <div className="border-t pt-2 mt-2">
                                        {gradesInfo.practicalGrade !== null && gradesInfo.practicalGrade !== undefined && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Nota Prática:</span>
                                            <span className={`font-medium ${gradesInfo.practicalGrade >= 5.0 ? 'text-green-600' : 'text-red-600'}`}>
                                              {Number(gradesInfo.practicalGrade).toFixed(1)}
                                            </span>
                                          </div>
                                        )}
                                        {gradesInfo.theoreticalGrade !== null && gradesInfo.theoreticalGrade !== undefined && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Nota Teórica:</span>
                                            <span className={`font-medium ${gradesInfo.theoreticalGrade >= 5.0 ? 'text-green-600' : 'text-red-600'}`}>
                                              {Number(gradesInfo.theoreticalGrade).toFixed(1)}
                                            </span>
                                          </div>
                                        )}
                                        {gradesInfo.averageGrade !== null && gradesInfo.averageGrade !== undefined && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Média:</span>
                                            <span className={`font-medium ${gradesInfo.averageGrade >= 5.0 ? 'text-green-600' : 'text-red-600'}`}>
                                              {Number(gradesInfo.averageGrade).toFixed(1)}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  }
                                  return null
                                })()}
                                
                                {/* Informações de Presença */}
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
                                        {eligibilityMode ? (
                                          <div className={`flex items-center gap-1`}>
                                            {(() => {
                                              const eligibilityStatus = getEligibilityStatus(student)
                                              return (
                                                <div className={`flex items-center gap-1 ${eligibilityStatus.color}`}>
                                                  {eligibilityStatus.icon}
                                                  <span className="font-medium text-xs">
                                                    {eligibilityStatus.label}
                                                  </span>
                                                </div>
                                              )
                                            })()}
                                          </div>
                                        ) : (
                                          <div className={`flex items-center gap-1 ${getAttendanceStatusColor(attendanceInfo.hasAbsences)}`}>
                                            {getAttendanceStatusIcon(attendanceInfo.hasAbsences)}
                                            <span className="font-medium">
                                              {attendanceInfo.hasAbsences ? `${attendanceInfo.absentCount} falta(s)` : 'Sem faltas'}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  )
                                })()}
                              </div>

                              <div className="flex gap-2 pt-3">
                                {(() => {
                                  if (eligibilityMode) {
                                    // Nova lógica: usar elegibilidade da API
                                    const eligibilityStatus = getEligibilityStatus(student)
                                    
                                    if (!student.isEligible) {
                                      return (
                                        <Button 
                                          size="sm" 
                                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                                          onClick={() => handleGenerateCertificate(student, classItem)}
                                          title={`Clique para gerar mesmo assim. Motivo: ${student.eligibilityReason}`}
                                        >
                                          <AlertTriangle className="mr-1 h-3 w-3" />
                                          <span className="text-xs">
                                            Não Apto - Gerar Assim Mesmo
                                          </span>
                                        </Button>
                                      )
                                    }
                                    
                                    // Elegível para certificado
                                    return (
                                      <Button 
                                        size="sm" 
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        onClick={() => handleGenerateCertificate(student, classItem)}
                                      >
                                        <Award className="mr-1 h-3 w-3" />
                                        Gerar Certificado
                                      </Button>
                                    )
                                  } else {
                                    // Lógica antiga: verificar faltas
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
                                  }
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

      {/* Modal de Prévia do Certificado */}
      <CertificatePreviewModal
        isOpen={previewModal.isOpen}
        onClose={handleCloseCertificatePreview}
        studentId={previewModal.studentId}
        studentName={previewModal.studentName}
        classId={previewModal.classId}
        trainingTitle={previewModal.trainingTitle}
      />
    </div>
  )
}
