'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Save, ArrowLeft, UserCheck, UserX, Users } from "lucide-react"
import { getLessonAttendances, getStudents, patchLessonAttendance, createLessonAttendance } from "@/lib/api/superadmin"
import { useToast } from "@/hooks/use-toast"

interface LessonAttendance {
  id: string
  lessonId: string
  studentId: string
  status?: string
  observations?: string
  student?: {
    id: string
    name: string
    cpf: string
    email?: string
  }
  lesson?: {
    id: string
    title: string
    startDate: Date | string
    endDate: Date | string
  }
}

interface Student {
  id: string
  name: string
  cpf: string
  email?: string
}

interface AttendancePageProps {
  lessonId?: string
  lessonTitle?: string
}

export function AttendancePage({ lessonId, lessonTitle }: AttendancePageProps) {
  const [attendances, setAttendances] = useState<LessonAttendance[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Carregar presenças e estudantes
  const loadData = async () => {
    setLoading(true)
    try {
      const [attendancesRes, studentsRes] = await Promise.all([
        getLessonAttendances(1, 100),
        getStudents(1, 100)
      ])

      const allAttendances = attendancesRes.data || []
      const lessonAttendances = lessonId 
        ? allAttendances.filter((att: LessonAttendance) => att.lessonId === lessonId)
        : allAttendances

      setAttendances(lessonAttendances)
      setStudents(studentsRes.data || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [lessonId])

  const getAttendanceForStudent = (studentId: string): LessonAttendance | null => {
    return attendances.find(att => att.studentId === studentId) || null
  }

  const handleAttendanceChange = async (studentId: string, present: boolean) => {
    if (!lessonId) return

    setSaving(true)
    try {
      const existingAttendance = getAttendanceForStudent(studentId)
      const status = present ? "Presente" : "Ausente"

      if (existingAttendance) {
        // Atualizar presença existente
        await patchLessonAttendance(existingAttendance.id, { status })
        setAttendances(prev => 
          prev.map(att => 
            att.id === existingAttendance.id 
              ? { ...att, status }
              : att
          )
        )
      } else {
        // Criar nova presença
        const newAttendance = await createLessonAttendance({
          lessonId,
          studentId,
          status
        })
        setAttendances(prev => [...prev, newAttendance])
      }

      toast({
        title: "Sucesso",
        description: `Presença ${present ? 'registrada' : 'removida'} com sucesso!`,
      })
    } catch (error: any) {
      console.error('Erro ao atualizar presença:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao atualizar presença",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.cpf.includes(searchTerm) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const presentCount = attendances.filter(att => att.status === "Presente").length
  const totalStudents = students.length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {lessonId ? `Chamada ${lessonTitle ? `- ${lessonTitle}` : ''}` : 'Presenças'}
            </h1>
            <p className="text-gray-600">Gerencie as presenças dos alunos</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {lessonId && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {lessonId ? `Chamada ${lessonTitle ? `- ${lessonTitle}` : ''}` : 'Presenças'}
          </h1>
          <p className="text-gray-600">Gerencie as presenças dos alunos</p>
        </div>
        
        {lessonId && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Presentes</p>
              <p className="text-2xl font-bold text-green-600">
                {presentCount}/{totalStudents}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Resumo da aula */}
      {lessonId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Resumo da Chamada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                <p className="text-sm text-gray-600">Presentes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{totalStudents - presentCount}</p>
                <p className="text-sm text-gray-600">Ausentes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Barra de pesquisa */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar alunos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de alunos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
          <CardDescription>
            Marque os alunos presentes na aula
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStudents.map((student) => {
              const attendance = getAttendanceForStudent(student.id)
              const isPresent = attendance?.status === "Presente"
              
              return (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isPresent}
                        onCheckedChange={(checked) => 
                          handleAttendanceChange(student.id, !!checked)
                        }
                        disabled={saving || !lessonId}
                      />
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-600">CPF: {student.cpf}</p>
                        {student.email && (
                          <p className="text-sm text-gray-600">Email: {student.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isPresent ? (
                      <Badge className="bg-green-500 text-white">
                        <UserCheck className="mr-1 h-3 w-3" />
                        Presente
                      </Badge>
                    ) : attendance ? (
                      <Badge variant="destructive">
                        <UserX className="mr-1 h-3 w-3" />
                        Ausente
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Não registrado
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum aluno encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm ? "Tente ajustar os termos de busca." : "Não há alunos cadastrados."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
