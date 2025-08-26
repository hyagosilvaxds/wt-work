"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award, 
  Edit, 
  Trash2, 
  Plus,
  GraduationCap,
  BarChart3,
  Loader2,
  Star,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  createOrUpdateStudentGrade, 
  getClassGrades, 
  getClassGradeStats, 
  updateStudentGrade, 
  deleteStudentGrade,
  type StudentGrade,
  type ClassGradeStats
} from "@/lib/api/superadmin"

interface TurmaData {
  id: string
  training: {
    title: string
  }
  students: Array<{
    id: string
    name: string
    cpf: string
    email?: string
  }>
}

interface ClassGradesModalProps {
  isOpen: boolean
  onClose: () => void
  turma: TurmaData | null
  onSuccess?: () => void
  readOnly?: boolean
}

interface StudentGradeForm {
  studentId: string
  preGrade: string        // Avaliação pré
  postGrade: string       // Avaliação pós
  practicalGrade: string  // Avaliação prática
  observations: string
}

export function ClassGradesModal({ isOpen, onClose, turma, onSuccess, readOnly = false }: ClassGradesModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [gradesLoading, setGradesLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [grades, setGrades] = useState<StudentGrade[]>([])
  const [stats, setStats] = useState<ClassGradeStats | null>(null)
  const [editingStudent, setEditingStudent] = useState<string | null>(null)
  const [gradeForm, setGradeForm] = useState<StudentGradeForm>({
    studentId: "",
    preGrade: "",
    postGrade: "",
    practicalGrade: "",
    observations: ""
  })

  const formatCPF = (cpf: string) => {
    if (!cpf) return "-"
    const cleanCPF = cpf.replace(/\D/g, '')
    if (cleanCPF.length !== 11) return cpf
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  // Carregar notas da turma
  const loadGrades = async () => {
    if (!turma) return
    
    setGradesLoading(true)
    try {
      const gradesData = await getClassGrades(turma.id)
      setGrades(gradesData)
    } catch (error: any) {
      console.error('Erro ao carregar notas:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar notas da turma",
        variant: "destructive"
      })
    } finally {
      setGradesLoading(false)
    }
  }

  // Carregar estatísticas da turma
  const loadStats = async () => {
    if (!turma) return
    
    setStatsLoading(true)
    try {
      const statsData = await getClassGradeStats(turma.id)
      setStats(statsData)
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar estatísticas da turma",
        variant: "destructive"
      })
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && turma) {
      loadGrades()
      loadStats()
    }
  }, [isOpen, turma])

  // Função para iniciar edição de nota
  const handleEditGrade = (studentId: string) => {
    const existingGrade = grades.find(g => g.studentId === studentId)
    setEditingStudent(studentId)
    setGradeForm({
      studentId,
      preGrade: existingGrade?.preGrade?.toString() || "",
      postGrade: existingGrade?.postGrade?.toString() || "",
      practicalGrade: existingGrade?.practicalGrade?.toString() || "",
      observations: existingGrade?.observations || ""
    })
  }

  // Função para salvar nota
  const handleSaveGrade = async () => {
    if (!turma || !editingStudent) return

    const preGrade = gradeForm.preGrade ? parseFloat(gradeForm.preGrade) : undefined
    const postGrade = gradeForm.postGrade ? parseFloat(gradeForm.postGrade) : undefined
    const practicalGrade = gradeForm.practicalGrade ? parseFloat(gradeForm.practicalGrade) : undefined

    // Validações
    if (!preGrade && !postGrade && !practicalGrade) {
      toast({
        title: "Erro",
        description: "Pelo menos uma avaliação (pré, pós ou prática) deve ser informada",
        variant: "destructive"
      })
      return
    }

    // Validar range das notas (0-10)
    const gradesToValidate = [
      { grade: preGrade, name: "pré" },
      { grade: postGrade, name: "pós" },
      { grade: practicalGrade, name: "prática" }
    ]

    for (const { grade, name } of gradesToValidate) {
      if (grade !== undefined && (grade < 0 || grade > 10)) {
        toast({
          title: "Erro",
          description: `A avaliação ${name} deve estar entre 0 e 10`,
          variant: "destructive"
        })
        return
      }
    }

    setLoading(true)
    try {
      await createOrUpdateStudentGrade({
        classId: turma.id,
        studentId: editingStudent,
        preGrade,
        postGrade,
        practicalGrade,
        observations: gradeForm.observations || undefined
      })

      toast({
        title: "Sucesso",
        description: "Avaliação salva com sucesso",
      })

      // Recarregar dados
      await loadGrades()
      await loadStats()
      
      // Limpar formulário
      setEditingStudent(null)
      setGradeForm({
        studentId: "",
        preGrade: "",
        postGrade: "",
        practicalGrade: "",
        observations: ""
      })

      onSuccess?.()
    } catch (error: any) {
      console.error('Erro ao salvar avaliação:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao salvar avaliação",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para excluir nota
  const handleDeleteGrade = async (studentId: string) => {
    if (!turma) return

    if (!confirm("Tem certeza que deseja excluir esta avaliação?")) return

    setLoading(true)
    try {
      await deleteStudentGrade(turma.id, studentId)

      toast({
        title: "Sucesso",
        description: "Avaliação excluída com sucesso",
      })

      // Recarregar dados
      await loadGrades()
      await loadStats()
      onSuccess?.()
    } catch (error: any) {
      console.error('Erro ao excluir nota:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao excluir nota",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setEditingStudent(null)
    setGradeForm({
      studentId: "",
      preGrade: "",
      postGrade: "",
      practicalGrade: "",
      observations: ""
    })
  }

  // Função para obter a cor da nota
  const getGradeColor = (grade?: number) => {
    if (!grade) return "text-gray-500"
    if (grade >= 9) return "text-green-600"
    if (grade >= 7) return "text-blue-600"
    if (grade >= 5) return "text-yellow-600"
    return "text-red-600"
  }

  // Função para obter o badge da nota
  const getGradeBadge = (grade?: number) => {
    if (!grade) return null
    if (grade >= 9) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>
    if (grade >= 7) return <Badge className="bg-blue-100 text-blue-800">Bom</Badge>
    if (grade >= 5) return <Badge className="bg-yellow-100 text-yellow-800">Regular</Badge>
    return <Badge className="bg-red-100 text-red-800">Insuficiente</Badge>
  }

  if (!turma) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {readOnly ? 'Visualizar' : ''} Avaliações - {turma.training.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="grades" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Notas dos Alunos
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grades" className="space-y-4">
            {gradesLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Carregando notas...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {turma.students.length === 0 ? (
                  <Card>
                    <CardContent className="p-8">
                      <div className="text-center">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nenhum aluno matriculado
                        </h3>
                        <p className="text-gray-600">
                          Adicione alunos à turma para poder avaliar.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {turma.students.map((student) => {
                      const grade = grades.find(g => g.studentId === student.id)
                      const isEditing = editingStudent === student.id

                      return (
                        <Card key={student.id}>
                          <CardContent className="p-4">
                            {!readOnly && isEditing ? (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium">{student.name}</h4>
                                    <p className="text-sm text-gray-500">{formatCPF(student.cpf)}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      onClick={handleSaveGrade}
                                      disabled={loading}
                                    >
                                      {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                      Salvar
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={handleCancelEdit}
                                      disabled={loading}
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="preGrade">Avaliação Pré (0-10)</Label>
                                    <Input
                                      id="preGrade"
                                      type="number"
                                      min="0"
                                      max="10"
                                      step="0.1"
                                      value={gradeForm.preGrade}
                                      onChange={(e) => setGradeForm(prev => ({ ...prev, preGrade: e.target.value }))}
                                      placeholder="Ex: 6.0"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="postGrade">Avaliação Pós (0-10)</Label>
                                    <Input
                                      id="postGrade"
                                      type="number"
                                      min="0"
                                      max="10"
                                      step="0.1"
                                      value={gradeForm.postGrade}
                                      onChange={(e) => setGradeForm(prev => ({ ...prev, postGrade: e.target.value }))}
                                      placeholder="Ex: 8.5"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="practicalGrade">Avaliação Prática (0-10)</Label>
                                    <Input
                                      id="practicalGrade"
                                      type="number"
                                      min="0"
                                      max="10"
                                      step="0.1"
                                      value={gradeForm.practicalGrade}
                                      onChange={(e) => setGradeForm(prev => ({ ...prev, practicalGrade: e.target.value }))}
                                      placeholder="Ex: 9.0"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="observations">Observações</Label>
                                  <Textarea
                                    id="observations"
                                    value={gradeForm.observations}
                                    onChange={(e) => setGradeForm(prev => ({ ...prev, observations: e.target.value }))}
                                    placeholder="Observações sobre a avaliação..."
                                    rows={3}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-medium">{student.name}</h4>
                                    {grade && (
                                      <div className="flex gap-2">
                                        {grade.preGrade && getGradeBadge(grade.preGrade)}
                                        {grade.postGrade && getGradeBadge(grade.postGrade)}
                                        {grade.practicalGrade && getGradeBadge(grade.practicalGrade)}
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 mb-2">{formatCPF(student.cpf)}</p>
                                  
                                  {grade ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <span className="text-gray-500">Avaliação Pré:</span>
                                        <span className={`ml-2 font-medium ${getGradeColor(grade.preGrade)}`}>
                                          {grade.preGrade ? grade.preGrade.toFixed(1) : "N/A"}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Avaliação Pós:</span>
                                        <span className={`ml-2 font-medium ${getGradeColor(grade.postGrade)}`}>
                                          {grade.postGrade ? grade.postGrade.toFixed(1) : "N/A"}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Avaliação Prática:</span>
                                        <span className={`ml-2 font-medium ${getGradeColor(grade.practicalGrade)}`}>
                                          {grade.practicalGrade ? grade.practicalGrade.toFixed(1) : "N/A"}
                                        </span>
                                      </div>
                                      {grade.observations && (
                                        <div className="md:col-span-3">
                                          <span className="text-gray-500">Observações:</span>
                                          <p className="text-gray-700 mt-1">{grade.observations}</p>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <AlertCircle className="h-4 w-4" />
                                      Aluno ainda não foi avaliado
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  {!readOnly && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={() => handleEditGrade(student.id)}
                                        disabled={loading}
                                      >
                                        {grade ? (
                                          <>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Editar
                                          </>
                                        ) : (
                                          <>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Avaliar
                                          </>
                                        )}
                                      </Button>
                                      {grade && (
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          onClick={() => handleDeleteGrade(student.id)}
                                          disabled={loading}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            {statsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Carregando estatísticas...</span>
              </div>
            ) : stats ? (
              <div className="space-y-6">
                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Total de Alunos</p>
                          <p className="text-2xl font-bold">{stats.classInfo.totalStudents}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Award className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Avaliados</p>
                          <p className="text-2xl font-bold">{stats.statistics.studentsWithGrades}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Média Pré</p>
                          <p className="text-2xl font-bold">
                            {stats.statistics.averagePreGrade 
                              ? stats.statistics.averagePreGrade.toFixed(1) 
                              : "N/A"
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Média Pós</p>
                          <p className="text-2xl font-bold">
                            {stats.statistics.averagePostGrade 
                              ? stats.statistics.averagePostGrade.toFixed(1) 
                              : "N/A"
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Award className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">Média Prática</p>
                          <p className="text-2xl font-bold">
                            {stats.statistics.averagePracticalGrade 
                              ? stats.statistics.averagePracticalGrade.toFixed(1) 
                              : "N/A"
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Distribuição de Notas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Distribuição Avaliação Pré */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição - Avaliação Pré</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            Excelente (9-10)
                          </span>
                          <span className="font-medium">{stats.statistics.preGradeDistribution.excellent}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            Bom (7-8.9)
                          </span>
                          <span className="font-medium">{stats.statistics.preGradeDistribution.good}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                            Regular (5-6.9)
                          </span>
                          <span className="font-medium">{stats.statistics.preGradeDistribution.average}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            Insuficiente (&lt;5)
                          </span>
                          <span className="font-medium">{stats.statistics.preGradeDistribution.poor}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Distribuição Avaliação Pós */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição - Avaliação Pós</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            Excelente (9-10)
                          </span>
                          <span className="font-medium">{stats.statistics.postGradeDistribution.excellent}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            Bom (7-8.9)
                          </span>
                          <span className="font-medium">{stats.statistics.postGradeDistribution.good}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                            Regular (5-6.9)
                          </span>
                          <span className="font-medium">{stats.statistics.postGradeDistribution.average}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            Insuficiente (&lt;5)
                          </span>
                          <span className="font-medium">{stats.statistics.postGradeDistribution.poor}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Distribuição Avaliação Prática */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição - Avaliação Prática</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            Excelente (9-10)
                          </span>
                          <span className="font-medium">{stats.statistics.practicalGradeDistribution.excellent}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            Bom (7-8.9)
                          </span>
                          <span className="font-medium">{stats.statistics.practicalGradeDistribution.good}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                            Regular (5-6.9)
                          </span>
                          <span className="font-medium">{stats.statistics.practicalGradeDistribution.average}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            Insuficiente (&lt;5)
                          </span>
                          <span className="font-medium">{stats.statistics.practicalGradeDistribution.poor}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Resumo dos Alunos Avaliados */}
                {stats.gradedStudents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumo das Avaliações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Aluno</TableHead>
                            <TableHead>Avaliação Pré</TableHead>
                            <TableHead>Avaliação Pós</TableHead>
                            <TableHead>Avaliação Prática</TableHead>
                            <TableHead>Data Avaliação</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stats.gradedStudents.map((student) => (
                            <TableRow key={student.studentId}>
                              <TableCell className="font-medium">{student.studentName}</TableCell>
                              <TableCell>
                                {student.preGrade ? (
                                  <span className={getGradeColor(student.preGrade)}>
                                    {student.preGrade.toFixed(1)}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">N/A</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {student.postGrade ? (
                                  <span className={getGradeColor(student.postGrade)}>
                                    {student.postGrade.toFixed(1)}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">N/A</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {student.practicalGrade ? (
                                  <span className={getGradeColor(student.practicalGrade)}>
                                    {student.practicalGrade.toFixed(1)}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">N/A</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {new Date(student.gradedAt).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma estatística disponível
                    </h3>
                    <p className="text-gray-600">
                      Avalie alguns alunos para gerar estatísticas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
