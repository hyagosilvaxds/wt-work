"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, UserPlus, UserMinus, X, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getStudents, addStudentsToClass, removeStudentsFromClass } from "@/lib/api/superadmin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Student {
  id: string
  name: string
  email?: string
  cpf: string
  isActive: boolean
}

interface TurmaData {
  id: string
  training: {
    title: string
  }
  students: Student[]
}

interface ClassStudentsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  turma: TurmaData | null
}

export function ClassStudentsModal({ isOpen, onClose, onSuccess, turma }: ClassStudentsModalProps) {
  const { toast } = useToast()
  const { isClient } = useAuth()
  const [loading, setLoading] = useState(false)
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [studentsToRemove, setStudentsToRemove] = useState<string[]>([])
  const [actionLoading, setActionLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  // Carregar estudantes quando o modal abrir ou quando buscar
  useEffect(() => {
    if (isOpen) {
      // Não carregar estudantes automaticamente, apenas quando houver busca
      setAllStudents([])
    } else {
      // Limpar estados quando o modal for fechado
      setSelectedStudents([])
      setStudentsToRemove([])
      setSearchTerm("")
      setAllStudents([])
    }
  }, [isOpen])

  // Buscar estudantes com debounce
  useEffect(() => {
    if (!isOpen) return

    // Mostrar loading se há texto e tem pelo menos 2 caracteres
    if (searchTerm.trim() !== "" && searchTerm.trim().length >= 2) {
      setSearchLoading(true)
    }

    const timer = setTimeout(() => {
      if (searchTerm.trim() !== "" && searchTerm.trim().length >= 2) {
        loadStudents()
      } else {
        setAllStudents([])
        setSearchLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, isOpen])

  const loadStudents = async () => {
    const trimmedSearch = searchTerm.trim()
    
    if (trimmedSearch === "" || trimmedSearch.length < 2) {
      setAllStudents([])
      setSearchLoading(false)
      return
    }

    setSearchLoading(true)
    
    try {
      console.log('Carregando estudantes com busca:', trimmedSearch)
      console.log('Parâmetros da busca: page=1, limit=100, search=', trimmedSearch)
      
      const response = await getStudents(1, 100, trimmedSearch)
      console.log('Resposta da API:', response)
      console.log('Estudantes carregados:', response.students?.length || 0)
      
      // Filtrar estudantes que não estão na turma e que estão ativos
      const availableStudents = (response.students || []).filter((student: Student) => {
        const isAlreadyInClass = turma?.students.some(classStudent => classStudent.id === student.id)
        return !isAlreadyInClass && student.isActive
      })
      
      console.log('Estudantes disponíveis após filtro:', availableStudents.length)
      setAllStudents(availableStudents)
    } catch (error) {
      console.error('Erro ao carregar estudantes:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar estudantes",
        variant: "destructive"
      })
      setAllStudents([])
    } finally {
      setSearchLoading(false)
    }
  }

  // Usar diretamente os estudantes já filtrados do backend
  const availableStudents = allStudents

  const handleAddStudents = async () => {
    if (!turma || selectedStudents.length === 0) return

    setActionLoading(true)
    try {
      console.log('Adicionando alunos:', selectedStudents)
      console.log('À turma:', turma.id)
      
      await addStudentsToClass(turma.id, selectedStudents)
      toast({
        title: "Sucesso",
        description: `${selectedStudents.length} aluno(s) adicionado(s) à turma`,
      })
      setSelectedStudents([])
      
      // Recarregar a lista de estudantes disponíveis
      await loadStudents()
      
      // Atualizar a lista principal de turmas
      onSuccess()
    } catch (error: any) {
      console.error('Erro ao adicionar alunos:', error)
      
      let errorMessage = "Erro ao adicionar alunos à turma"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemoveStudents = async () => {
    if (!turma || studentsToRemove.length === 0) return

    setActionLoading(true)
    try {
      console.log('Tentando remover alunos:', studentsToRemove)
      console.log('Da turma:', turma.id)
      
      await removeStudentsFromClass(turma.id, studentsToRemove)
      
      toast({
        title: "Sucesso",
        description: `${studentsToRemove.length} aluno(s) removido(s) da turma`,
      })
      setStudentsToRemove([])
      
      // Recarregar a lista de estudantes disponíveis
      await loadStudents()
      
      // Atualizar a lista principal de turmas
      onSuccess()
    } catch (error: any) {
      console.error('Erro ao remover alunos:', error)
      
      let errorMessage = "Erro ao remover alunos da turma"
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedStudents([])
    setStudentsToRemove([])
    setSearchTerm("")
    setAllStudents([])
    setSearchLoading(false)
    onClose()
  }

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const toggleStudentRemoval = (studentId: string) => {
    setStudentsToRemove(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  if (!turma) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Alunos - {turma.training.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alunos Atuais da Turma */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Alunos na Turma ({turma.students.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {turma.students.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Nenhum aluno matriculado nesta turma
                </p>
              ) : (
                <div className="space-y-2">
                  {turma.students.map((student) => (
                    <div 
                      key={student.id} 
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        studentsToRemove.includes(student.id) 
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-600">
                          {student.email} • CPF: {student.cpf}
                        </p>
                      </div>
                      {!isClient && (
                        <Button
                          variant={studentsToRemove.includes(student.id) ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => toggleStudentRemoval(student.id)}
                        >
                          {studentsToRemove.includes(student.id) ? (
                            <>
                              <X className="h-4 w-4 mr-2" />
                              Cancelar
                            </>
                          ) : (
                            <>
                              <UserMinus className="h-4 w-4 mr-2" />
                              Remover
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {studentsToRemove.length > 0 && (
                    <div className="flex justify-end pt-4">
                      <Button
                        variant="destructive"
                        onClick={handleRemoveStudents}
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <UserMinus className="h-4 w-4 mr-2" />
                        )}
                        Remover {studentsToRemove.length} Aluno(s)
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Adicionar Novos Alunos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Adicionar Alunos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="student-search">Selecionar Alunos</Label>
                  <div className="space-y-2">
                    {/* Campo de busca */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Digite pelo menos 2 caracteres (nome, email ou CPF)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                      {searchLoading && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                      )}
                    </div>

                    {/* Resultados da busca */}
                    {searchTerm.trim() !== "" ? (
                      <div className="border rounded-lg max-h-60 overflow-y-auto">
                        {searchLoading ? (
                          <div className="p-4 text-center text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                            Buscando...
                          </div>
                        ) : searchTerm.trim().length < 2 ? (
                          <div className="p-4 text-center text-gray-500">
                            Digite pelo menos 2 caracteres...
                          </div>
                        ) : availableStudents.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            Nenhum aluno encontrado para "{searchTerm.trim()}"
                          </div>
                        ) : (
                          <div className="space-y-1 p-2">
                            <div className="px-2 py-1 text-xs text-gray-500 border-b">
                              {availableStudents.length} aluno{availableStudents.length !== 1 ? 's' : ''} encontrado{availableStudents.length !== 1 ? 's' : ''}
                            </div>
                            {availableStudents.map((student) => (
                              <div
                                key={student.id}
                                className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer border ${
                                  selectedStudents.includes(student.id) 
                                    ? 'bg-blue-50 border-blue-200' 
                                    : 'border-transparent hover:border-gray-200'
                                }`}
                                onClick={() => toggleStudentSelection(student.id)}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedStudents.includes(student.id)}
                                  onChange={() => {}}
                                  className="rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{student.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {student.email ? `${student.email} • ` : ''}CPF: {student.cpf}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 text-center text-gray-500">
                        Digite pelo menos 2 caracteres para buscar alunos...
                      </div>
                    )}
                  </div>
                </div>

                {/* Alunos Selecionados */}
                {selectedStudents.length > 0 && (
                  <div className="space-y-2">
                    <Label>Alunos Selecionados ({selectedStudents.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudents.map((studentId) => {
                        const student = allStudents.find(s => s.id === studentId)
                        return (
                          <Badge key={studentId} variant="secondary">
                            {student?.name}
                            <button
                              onClick={() => toggleStudentSelection(studentId)}
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}

                {selectedStudents.length > 0 && (
                  <Button
                    onClick={handleAddStudents}
                    disabled={actionLoading}
                    className="w-full"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    Adicionar {selectedStudents.length} Aluno(s)
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
