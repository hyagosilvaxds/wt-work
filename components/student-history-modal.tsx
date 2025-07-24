"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  History, 
  Calendar, 
  User, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Clock,
  BarChart3,
  FileText,
  Users,
  MapPin,
  GraduationCap,
  Target,
  TrendingUp,
  Download,
  Award,
  Eye,
  AlertTriangle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { 
  getStudentHistory, 
  getStudentStatistics,
  downloadCertificatePDF,
  checkStudentEligibilityForCertificate,
  type StudentHistoryResponseDto, 
  type StudentStatistics,
  type StudentHistoryFilters,
  type StudentHistoryClassDto,
  type StudentEligibilityResultDto
} from "@/lib/api/superadmin"
import { CertificatePreviewModal } from "@/components/certificate-preview-modal"

interface StudentHistoryModalProps {
  studentId: string
  studentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_COLORS = {
  'EM_ABERTO': 'bg-gray-100 text-gray-800',
  'EM_ANDAMENTO': 'bg-blue-100 text-blue-800',
  'CONCLUIDA': 'bg-green-100 text-green-800',
  'CONCLUIDO': 'bg-green-100 text-green-800',
  'CANCELADA': 'bg-red-100 text-red-800',
  'SUSPENSA': 'bg-yellow-100 text-yellow-800'
}

const STATUS_LABELS = {
  'EM_ABERTO': 'Em Aberto',
  'EM_ANDAMENTO': 'Em Andamento',
  'CONCLUIDA': 'Concluída',
  'CONCLUIDO': 'Concluído',
  'CANCELADA': 'Cancelada',
  'SUSPENSA': 'Suspensa'
}

// Componente para renderizar as ações do certificado
function CertificateActions({ 
  classData, 
  studentId, 
  isClient, 
  isInstructor, 
  onGenerateCertificate 
}: {
  classData: StudentHistoryClassDto
  studentId: string
  isClient: boolean
  isInstructor: boolean
  onGenerateCertificate: (classData: StudentHistoryClassDto) => Promise<void>
}) {
  const [impediments, setImpediments] = useState<{
    hasAbsences: boolean
    hasInsufficientGrades: boolean
    hasAnyImpediment: boolean
    apiResult: StudentEligibilityResultDto | null
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkImpediments = async () => {
      try {
        // Tentar usar a nova API
        const eligibility = await checkStudentEligibilityForCertificate(classData.id, studentId)
        
        setImpediments({
          hasAbsences: eligibility.absences > 0,
          hasInsufficientGrades: eligibility.reason.toLowerCase().includes('nota'),
          hasAnyImpediment: !eligibility.isEligible,
          apiResult: eligibility
        })
      } catch (error) {
        console.error('❌ Erro ao verificar elegibilidade, usando lógica local:', error)
        
        // Fallback para lógica local
        const hasAbsencesLocal = classData.lessonAttendances.filter(
          attendance => attendance.status === 'AUSENTE'
        ).length > 0
        
        let hasInsufficientGradesLocal = false
        if (classData.studentGrade) {
          const practicalGrade = classData.studentGrade.practicalGrade
          const theoreticalGrade = classData.studentGrade.theoreticalGrade
          
          const hasBadPractical = (practicalGrade !== null && practicalGrade !== undefined) && practicalGrade < 5
          const hasBadTheoretical = (theoreticalGrade !== null && theoreticalGrade !== undefined) && theoreticalGrade < 5
          
          hasInsufficientGradesLocal = hasBadPractical || hasBadTheoretical
        }
        
        setImpediments({
          hasAbsences: hasAbsencesLocal,
          hasInsufficientGrades: hasInsufficientGradesLocal,
          hasAnyImpediment: hasAbsencesLocal || hasInsufficientGradesLocal,
          apiResult: null
        })
      } finally {
        setLoading(false)
      }
    }

    checkImpediments()
  }, [classData.id, studentId])

  if (loading) {
    return (
      <div className="mt-4 pt-4 border-t bg-gradient-to-r from-gray-50 to-gray-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Verificando elegibilidade...</span>
        </div>
      </div>
    )
  }

  if (!impediments) return null

  // Se for cliente e o estudante tiver impedimentos, mostrar aviso e desabilitar
  if (isClient && impediments.hasAnyImpediment) {
    let reasons = []
    if (impediments.hasAbsences) reasons.push("faltas")
    if (impediments.hasInsufficientGrades) reasons.push("notas insuficientes")
    
    return (
      <div className="mt-4 pt-4 border-t bg-gradient-to-r from-red-50 to-red-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-red-800">Certificado Não Disponível</p>
              <p className="text-sm text-red-600">
                Aluno possui {reasons.join(" e ")} - Certificado não pode ser gerado
              </p>
              {impediments.apiResult && (
                <p className="text-xs text-red-500 mt-1">
                  Motivo: {impediments.apiResult.reason}
                </p>
              )}
            </div>
          </div>
          <Button
            className="gap-2 bg-gray-400 cursor-not-allowed"
            size="sm"
            disabled
          >
            <XCircle className="h-4 w-4" />
            Não Disponível
          </Button>
        </div>
      </div>
    )
  }
  
  // Se for instrutor/admin e o estudante tiver impedimentos, mostrar aviso mas permitir
  if ((isInstructor || (!isClient && !isInstructor)) && impediments.hasAnyImpediment) {
    let reasons = []
    if (impediments.hasAbsences) reasons.push("faltas")
    if (impediments.hasInsufficientGrades) reasons.push("notas baixas")
    
    return (
      <div className="mt-4 pt-4 border-t bg-gradient-to-r from-yellow-50 to-orange-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium text-yellow-800">Certificado com Ressalvas</p>
              <p className="text-sm text-yellow-600">
                Aluno possui {reasons.join(" e ")} - Gerar mesmo assim?
              </p>
              {impediments.apiResult && (
                <p className="text-xs text-yellow-600 mt-1">
                  Motivo: {impediments.apiResult.reason}
                </p>
              )}
            </div>
          </div>
          <Button
            className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-white shadow-md"
            size="sm"
            onClick={() => onGenerateCertificate(classData)}
          >
            <AlertTriangle className="h-4 w-4" />
            Gerar com Ressalvas
          </Button>
        </div>
      </div>
    )
  }
  
  // Caso padrão - sem impedimentos
  return (
    <div className="mt-4 pt-4 border-t bg-gradient-to-r from-green-50 to-blue-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <Award className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-800">Certificado Disponível</p>
            <p className="text-sm text-green-600">Turma concluída - Certificado pronto para download</p>
            {impediments.apiResult && (
              <p className="text-xs text-green-600 mt-1">
                ✅ Verificado via API: {impediments.apiResult.reason}
              </p>
            )}
          </div>
        </div>
        <Button
          className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md"
          size="sm"
          onClick={() => onGenerateCertificate(classData)}
        >
          <Award className="h-4 w-4" />
          Gerar Certificado
        </Button>
      </div>
    </div>
  )
}

export function StudentHistoryModal({ 
  studentId, 
  studentName, 
  open, 
  onOpenChange 
}: StudentHistoryModalProps) {
  const [history, setHistory] = useState<StudentHistoryResponseDto | null>(null)
  const [statistics, setStatistics] = useState<StudentStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [certificateLoading, setCertificateLoading] = useState<{ [key: string]: boolean }>({})
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean
    classId: string
    trainingTitle: string
  }>({
    isOpen: false,
    classId: '',
    trainingTitle: ''
  })
  const [activeTab, setActiveTab] = useState("history")
  const [eligibilityCache, setEligibilityCache] = useState<{ [key: string]: StudentEligibilityResultDto }>({})
  const { toast } = useToast()
  const { user, isClient, isInstructor } = useAuth()

  useEffect(() => {
    if (open && studentId) {
      console.log('🚀 Modal de Histórico Aberto:', {
        studentId,
        studentName,
        open
      })
      fetchHistory()
      fetchStatistics()
    }
  }, [open, studentId])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const data = await getStudentHistory(studentId)
      console.log('📊 Resposta da API - Histórico do Aluno:', {
        studentId,
        response: data,
        totalClasses: data?.classes?.length || 0,
        classes: data?.classes
      })
      setHistory(data)
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar histórico do aluno",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      setStatsLoading(true)
      const data = await getStudentStatistics(studentId)
      console.log('📈 Resposta da API - Estatísticas do Aluno:', {
        studentId,
        response: data,
        totalClasses: data?.totalClasses || 0,
        completedClasses: data?.completedClasses || 0
      })
      setStatistics(data)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar estatísticas do aluno",
        variant: "destructive",
      })
    } finally {
      setStatsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const getStatusBadge = (status: string) => {
    const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800'
    const label = STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status
    
    return (
      <Badge className={colorClass}>
        {label}
      </Badge>
    )
  }

  const getAttendanceIcon = (status: string) => {
    if (status === 'PRESENTE') {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    } else if (status === 'AUSENTE') {
      return <XCircle className="h-4 w-4 text-red-500" />
    } else {
      return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  // Função para abrir modal de prévia do certificado
  const handleOpenCertificatePreview = (classData: StudentHistoryClassDto) => {
    setPreviewModal({
      isOpen: true,
      classId: classData.id,
      trainingTitle: classData.training.title
    })
  }

  // Função para fechar modal de prévia
  const handleCloseCertificatePreview = () => {
    setPreviewModal({
      isOpen: false,
      classId: '',
      trainingTitle: ''
    })
  }

  // Função para verificar elegibilidade usando a nova API
  const checkEligibilityFromAPI = async (classData: StudentHistoryClassDto): Promise<StudentEligibilityResultDto | null> => {
    const cacheKey = `${classData.id}-${studentId}`
    
    // Verificar cache primeiro
    if (eligibilityCache[cacheKey]) {
      console.log('🎯 Usando elegibilidade do cache:', eligibilityCache[cacheKey])
      return eligibilityCache[cacheKey]
    }
    
    try {
      console.log('🔍 Verificando elegibilidade via API:', {
        classId: classData.id,
        studentId,
        trainingTitle: classData.training.title
      })
      
      const eligibility = await checkStudentEligibilityForCertificate(classData.id, studentId)
      
      // Armazenar no cache
      setEligibilityCache(prev => ({
        ...prev,
        [cacheKey]: eligibility
      }))
      
      console.log('✅ Elegibilidade obtida da API:', eligibility)
      return eligibility
    } catch (error) {
      console.error('❌ Erro ao verificar elegibilidade via API:', error)
      return null
    }
  }

  // Função para obter informações de notas (baseada no certificates-page)
  const getGradesInfo = (classData: StudentHistoryClassDto) => {
    if (!classData.studentGrade) return null
    
    const practicalGrade = classData.studentGrade.practicalGrade
    const theoreticalGrade = classData.studentGrade.theoreticalGrade
    
    // Verificar se pelo menos uma nota existe e é um número válido
    const hasPracticalGrade = practicalGrade !== null && practicalGrade !== undefined && !isNaN(Number(practicalGrade))
    const hasTheoreticalGrade = theoreticalGrade !== null && theoreticalGrade !== undefined && !isNaN(Number(theoreticalGrade))
    
    if (!hasPracticalGrade && !hasTheoreticalGrade) return null
    
    return {
      practicalGrade: hasPracticalGrade ? Number(practicalGrade) : null,
      theoreticalGrade: hasTheoreticalGrade ? Number(theoreticalGrade) : null,
      hasFailingGrade: (hasPracticalGrade && Number(practicalGrade) < 5.0) || 
                       (hasTheoreticalGrade && Number(theoreticalGrade) < 5.0)
    }
  }

  // Verificar se é possível gerar certificado (turma concluída)
  const canGenerateCertificate = (classData: StudentHistoryClassDto) => {
    const canGenerate = classData.status === 'CONCLUIDA' || classData.status === 'CONCLUIDO'
    console.log('🎓 Verificação de certificado:', {
      classId: classData.id,
      trainingTitle: classData.training.title,
      status: classData.status,
      canGenerate
    })
    return canGenerate
  }

  // Verificar se o aluno tem faltas na turma
  const hasAbsences = (classData: StudentHistoryClassDto) => {
    const absenceCount = classData.lessonAttendances.filter(
      attendance => attendance.status === 'AUSENTE'
    ).length
    return absenceCount > 0
  }

  // Verificar se o aluno tem notas insuficientes (menor que 5) - atualizada
  const hasInsufficientGrades = (classData: StudentHistoryClassDto) => {
    const gradesInfo = getGradesInfo(classData)
    
    console.log('🎓 Verificação de notas detalhada:', {
      classId: classData.id,
      trainingTitle: classData.training.title,
      gradesInfo,
      hasFailingGrade: gradesInfo?.hasFailingGrade || false
    })
    
    return gradesInfo?.hasFailingGrade || false
  }

  // Verificar se há impedimentos para gerar certificado (usando API quando possível)
  const hasImpediments = async (classData: StudentHistoryClassDto) => {
    // Tentar usar a nova API primeiro
    const apiEligibility = await checkEligibilityFromAPI(classData)
    
    if (apiEligibility) {
      console.log('🎯 Usando resultado da API de elegibilidade:', {
        classId: classData.id,
        studentId,
        isEligible: apiEligibility.isEligible,
        reason: apiEligibility.reason
      })
      
      // Converter resultado da API para formato esperado
      return {
        hasAbsences: apiEligibility.absences > 0,
        hasInsufficientGrades: apiEligibility.reason.toLowerCase().includes('nota'),
        hasAnyImpediment: !apiEligibility.isEligible,
        apiResult: apiEligibility
      }
    }
    
    // Fallback para lógica local se API não estiver disponível
    console.log('⚠️ API não disponível, usando verificação local')
    const studentHasAbsences = hasAbsences(classData)
    const studentHasInsufficientGrades = hasInsufficientGrades(classData)
    
    return {
      hasAbsences: studentHasAbsences,
      hasInsufficientGrades: studentHasInsufficientGrades,
      hasAnyImpediment: studentHasAbsences || studentHasInsufficientGrades,
      apiResult: null
    }
  }

  // Função para lidar com geração de certificado considerando faltas e notas
  const handleCertificateGeneration = async (classData: StudentHistoryClassDto) => {
    const impediments = await hasImpediments(classData)
    
    console.log('🔍 Verificação de impedimentos:', {
      classId: classData.id,
      trainingTitle: classData.training.title,
      hasAbsences: impediments.hasAbsences,
      hasInsufficientGrades: impediments.hasInsufficientGrades,
      hasAnyImpediment: impediments.hasAnyImpediment,
      userType: { isClient, isInstructor, isAdmin: !isClient && !isInstructor },
      apiResult: impediments.apiResult
    })

    // Se for cliente e o estudante tiver qualquer impedimento, não permitir geração
    if (isClient && impediments.hasAnyImpediment) {
      let description = "Não é possível gerar certificado:"
      if (impediments.hasAbsences) description += " aluno possui faltas"
      if (impediments.hasInsufficientGrades) {
        if (impediments.hasAbsences) description += " e"
        description += " notas insuficientes (< 5.0)"
      }
      
      toast({
        title: "Certificado não disponível",
        description,
        variant: "destructive",
      })
      return
    }

    // Se for instrutor ou admin e o estudante tiver impedimentos, permitir mas com aviso
    if ((isInstructor || (!isClient && !isInstructor)) && impediments.hasAnyImpediment) {
      let warningType = []
      if (impediments.hasAbsences) warningType.push("faltas")
      if (impediments.hasInsufficientGrades) warningType.push("notas baixas")
      console.log(`⚠️ Admin/Instrutor gerando certificado com ${warningType.join(" e ")}`)
    }

    // Proceder com a geração do certificado
    handleOpenCertificatePreview(classData)
  }

  // Todas as turmas (sem filtros)
  const allClasses = history?.classes || []

  // Debug: log das turmas e certificados
  console.log('🔍 Análise de Turmas do Aluno:', {
    totalClasses: history?.classes?.length || 0,
    allClasses: history?.classes,
    completedClasses: allClasses.filter(cls => cls.status === 'CONCLUIDA' || cls.status === 'CONCLUIDO'),
    completedCount: allClasses.filter(cls => cls.status === 'CONCLUIDA' || cls.status === 'CONCLUIDO').length,
    statusDistribution: allClasses.reduce((acc, cls) => {
      acc[cls.status] = (acc[cls.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  })

  // Debug log de renderização
  console.log('🎯 Renderização das Turmas:', {
    loading,
    hasHistory: !!history,
    hasClasses: !!history?.classes,
    totalClasses: history?.classes?.length || 0,
    classesCount: allClasses.length,
    willRender: allClasses.length > 0
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <History className="h-6 w-6" />
            Histórico do Aluno - {studentName}
          </DialogTitle>
          <DialogDescription>
            Histórico completo de turmas, certificações e desempenho
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Histórico de Turmas
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {/* Resumo do Histórico */}
            {history && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total de Turmas</p>
                        <p className="text-2xl font-bold">{history.totalClasses}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Concluídas</p>
                        <p className="text-2xl font-bold text-green-600">{history.completedClasses}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ativas</p>
                        <p className="text-2xl font-bold text-blue-600">{history.activeClasses}</p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Lista de Turmas */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Aviso sobre certificados para debug */}
                {allClasses.length > 0 && allClasses.filter(cls => cls.status === 'CONCLUIDA' || cls.status === 'CONCLUIDO').length === 0 && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium text-yellow-800">Informação sobre Certificados</p>
                          <p className="text-sm text-yellow-700">
                            O botão de certificado aparece apenas para turmas com status "CONCLUIDA" ou "CONCLUIDO". 
                            Atualmente há {allClasses.length} turma(s), mas nenhuma concluída.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {allClasses.map((cls) => (
                  <Card key={cls.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{cls.training.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(cls.startDate)} - {formatDate(cls.endDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {cls.instructor.name}
                            </div>
                            {cls.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {cls.location}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(cls.status)}
                          <Badge variant="outline">{cls.type}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Informações da Turma */}
                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Detalhes do Treinamento
                          </h4>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Carga Horária:</span> {cls.training.durationHours}h</p>
                            {cls.training.validityDays && (
                              <p><span className="font-medium">Validade:</span> {cls.training.validityDays} dias</p>
                            )}
                            {cls.client && (
                              <p><span className="font-medium">Empresa:</span> {cls.client.name}</p>
                            )}
                            {cls.technicalResponsible && (
                              <p><span className="font-medium">Resp. Técnico:</span> {cls.technicalResponsible.name}</p>
                            )}
                          </div>
                        </div>

                        {/* Notas */}
                        {cls.studentGrade && (
                          <div className="space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              Notas
                            </h4>
                            <div className="text-sm space-y-1">
                              {cls.studentGrade.practicalGrade !== null && cls.studentGrade.practicalGrade !== undefined && (
                                <p>
                                  <span className="font-medium">Prática:</span> 
                                  <span className={cls.studentGrade.practicalGrade < 5 ? 'text-red-600 font-bold' : 'text-green-600'}>
                                    {cls.studentGrade.practicalGrade.toFixed(1)}
                                  </span>
                                  {cls.studentGrade.practicalGrade < 5 && <span className="text-red-500 ml-1">⚠️ Insuficiente</span>}
                                </p>
                              )}
                              {cls.studentGrade.theoreticalGrade !== null && cls.studentGrade.theoreticalGrade !== undefined && (
                                <p>
                                  <span className="font-medium">Teórica:</span> 
                                  <span className={cls.studentGrade.theoreticalGrade < 5 ? 'text-red-600 font-bold' : 'text-green-600'}>
                                    {cls.studentGrade.theoreticalGrade.toFixed(1)}
                                  </span>
                                  {cls.studentGrade.theoreticalGrade < 5 && <span className="text-red-500 ml-1">⚠️ Insuficiente</span>}
                                </p>
                              )}
                              {cls.studentGrade.observations && (
                                <p><span className="font-medium">Obs:</span> {cls.studentGrade.observations}</p>
                              )}
                              <p className="text-xs text-gray-500">
                                Avaliado em {formatDate(cls.studentGrade.gradedAt)}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Frequência */}
                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Frequência
                          </h4>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">Aulas:</span> {cls.lessonAttendances.length} registros
                            </p>
                            <div className="flex gap-1">
                              {cls.lessonAttendances.slice(0, 10).map((attendance, index) => (
                                <div key={index} title={`${attendance.lesson.title} - ${attendance.status}`}>
                                  {getAttendanceIcon(attendance.status)}
                                </div>
                              ))}
                              {cls.lessonAttendances.length > 10 && (
                                <span className="text-xs text-gray-500">+{cls.lessonAttendances.length - 10}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {cls.observations && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">
                            <span className="font-medium">Observações:</span> {cls.observations}
                          </p>
                        </div>
                      )}

                      {/* Ações - Certificado */}
                      {canGenerateCertificate(cls) && (
                        <div className="mt-4 pt-4 border-t bg-gradient-to-r from-green-50 to-blue-50 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
                          <CertificateActions 
                            classData={cls} 
                            studentId={studentId}
                            isClient={isClient}
                            isInstructor={isInstructor}
                            onGenerateCertificate={handleCertificateGeneration}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {allClasses.length === 0 && !loading && (
                  <Card className="text-center py-8">
                    <CardContent>
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhuma turma encontrada
                      </h3>
                      <p className="text-gray-500">
                        Este aluno ainda não participou de nenhuma turma
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : statistics ? (
              <div className="space-y-6">
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Taxa de Frequência</p>
                          <p className="text-2xl font-bold text-green-600">{statistics.attendanceRate.toFixed(1)}%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Aulas Frequentadas</p>
                          <p className="text-2xl font-bold">{statistics.attendedLessons}/{statistics.totalLessons}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Informações Detalhadas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Desempenho Acadêmico
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Média Prática:</span>
                          <span className="font-bold text-lg">{statistics.averageGrades.practical.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(statistics.averageGrades.practical / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Média Teórica:</span>
                          <span className="font-bold text-lg">{statistics.averageGrades.theoretical.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(statistics.averageGrades.theoretical / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Taxa de Frequência:</span>
                          <span className="font-bold text-lg">{statistics.attendanceRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${statistics.attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Resumo Geral
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Data de Matrícula:</span>
                          <span className="font-medium">{formatDate(statistics.enrollmentDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total de Turmas:</span>
                          <span className="font-medium">{statistics.totalClasses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Turmas Concluídas:</span>
                          <span className="font-medium text-green-600">{statistics.completedClasses}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total de Aulas:</span>
                          <span className="font-medium">{statistics.totalLessons}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Aulas Frequentadas:</span>
                          <span className="font-medium">{statistics.attendedLessons}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Horas de Treinamento:</span>
                          <span className="font-medium">{statistics.totalHoursCompleted}h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Estatísticas não disponíveis
                  </h3>
                  <p className="text-gray-500">
                    Não foi possível carregar as estatísticas do aluno
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>

      {/* Modal de Prévia do Certificado */}
      <CertificatePreviewModal
        isOpen={previewModal.isOpen}
        onClose={handleCloseCertificatePreview}
        studentId={studentId}
        studentName={studentName}
        classId={previewModal.classId}
        trainingTitle={previewModal.trainingTitle}
      />
    </Dialog>
  )
}
