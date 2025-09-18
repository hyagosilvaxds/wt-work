"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Building2,
  FileText,
  Camera,
  UserCog,
  ClipboardList,
  Loader2,
  FolderOpen,
  BarChart3,
  Calculator,
  Edit,
  Upload,
  Calendar,
  Save,
  X
} from "lucide-react"
import { ManualEvaluationStatsModal } from "./manual-evaluation-stats-modal"
import { ManualEvaluationStatsViewModal } from "./manual-evaluation-stats-view-modal"
import { CustomCoverModal } from "./custom-cover-modal"
import { updateClassClosingDate, getClassClosingDate, type ClosingDateResponseDto } from "@/lib/api/superadmin"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface TurmaData {
  id: string
  training: {
    title: string
  }
  status: string
  startDate: string
  endDate: string
  students: any[]
  lessons: any[]
  client?: {
    id: string
    name: string
  }
  technicalResponsible?: {
    id: string
    name: string
    profession?: string
    email?: string
    professionalRegistry?: string
  }
}

interface ClassReportsModalProps {
  isOpen: boolean
  onClose: () => void
  turma: TurmaData | null
  onOpenCompanyEvaluation: () => void
  onOpenEvidenceReport: () => void
  onOpenGrades: () => void
  onOpenPhotos: () => void
  onOpenTechnicalResponsible: () => void
  onOpenDocuments: () => void
  isClientView?: boolean
  generatingReport?: boolean
}

export function ClassReportsModal({
  isOpen,
  onClose,
  turma,
  onOpenCompanyEvaluation,
  onOpenEvidenceReport,
  onOpenGrades,
  onOpenPhotos,
  onOpenTechnicalResponsible,
  onOpenDocuments,
  isClientView = false,
  generatingReport = false
}: ClassReportsModalProps) {
  const [manualStatsOpen, setManualStatsOpen] = useState(false)
  const [manualStatsViewOpen, setManualStatsViewOpen] = useState(false)
  const [customCoverOpen, setCustomCoverOpen] = useState(false)
  const [closingDateData, setClosingDateData] = useState<ClosingDateResponseDto | null>(null)
  const [editingClosingDate, setEditingClosingDate] = useState(false)
  const [newClosingDate, setNewClosingDate] = useState("")
  const [loadingClosingDate, setLoadingClosingDate] = useState(false)
  const [savingClosingDate, setSavingClosingDate] = useState(false)

  // Carregar data de encerramento quando o modal abrir
  useEffect(() => {
    if (isOpen && turma?.id && !isClientView) {
      loadClosingDate()
    }
  }, [isOpen, turma?.id, isClientView])

  const loadClosingDate = async () => {
    if (!turma?.id) return
    
    setLoadingClosingDate(true)
    try {
      const data = await getClassClosingDate(turma.id)
      setClosingDateData(data)
      if (data.closingDate) {
        setNewClosingDate(format(new Date(data.closingDate), 'yyyy-MM-dd'))
      } else {
        setNewClosingDate("")
      }
    } catch (error) {
      console.error('Erro ao carregar data de encerramento:', error)
    } finally {
      setLoadingClosingDate(false)
    }
  }

  const handleSaveClosingDate = async () => {
    if (!turma?.id) return
    
    setSavingClosingDate(true)
    try {
      const closingDate = newClosingDate ? new Date(newClosingDate + 'T23:59:59').toISOString() : null
      const data = await updateClassClosingDate(turma.id, { closingDate })
      setClosingDateData(data)
      setEditingClosingDate(false)
    } catch (error) {
      console.error('Erro ao salvar data de encerramento:', error)
      alert('Erro ao salvar data de encerramento. Tente novamente.')
    } finally {
      setSavingClosingDate(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingClosingDate(false)
    if (closingDateData?.closingDate) {
      setNewClosingDate(format(new Date(closingDateData.closingDate), 'yyyy-MM-dd'))
    } else {
      setNewClosingDate("")
    }
  }

  const handleOptionClick = (callback: () => void) => {
    callback()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios - {turma?.training.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Informações da Turma */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Informações da Turma</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Status:</span>
                <p className="font-medium">{turma?.status}</p>
              </div>
              <div>
                <span className="text-gray-500">Alunos:</span>
                <p className="font-medium">{turma?.students.length} matriculado{turma?.students.length !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <span className="text-gray-500">Aulas:</span>
                <p className="font-medium">{turma?.lessons.length} agendada{turma?.lessons.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Data de Encerramento Personalizada */}
          {!isClientView && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Data de Encerramento para Relatórios</span>
                </div>
                {!editingClosingDate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingClosingDate(true)}
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                )}
              </div>

              {loadingClosingDate ? (
                <div className="flex items-center gap-2 text-blue-700">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Carregando...</span>
                </div>
              ) : editingClosingDate ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="closing-date" className="text-sm text-blue-900">
                      Data de Encerramento Personalizada
                    </Label>
                    <Input
                      id="closing-date"
                      type="date"
                      value={newClosingDate}
                      onChange={(e) => setNewClosingDate(e.target.value)}
                      className="mt-1"
                      placeholder="Deixe vazio para usar a data padrão da turma"
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      Deixe vazio para usar a data de término da turma ({turma?.endDate ? format(new Date(turma.endDate), 'dd/MM/yyyy', { locale: ptBR }) : 'não definida'})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveClosingDate}
                      disabled={savingClosingDate}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {savingClosingDate ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-3 w-3 mr-1" />
                          Salvar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={savingClosingDate}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700">Data para relatórios:</span>
                    <span className="font-medium text-blue-900">
                      {closingDateData?.closingDate 
                        ? format(new Date(closingDateData.closingDate), 'dd/MM/yyyy', { locale: ptBR })
                        : `Padrão (${turma?.endDate ? format(new Date(turma.endDate), 'dd/MM/yyyy', { locale: ptBR }) : 'não definida'})`
                      }
                    </span>
                  </div>
                  {closingDateData?.closingDate && (
                    <p className="text-xs text-blue-600 mt-1">
                      Data personalizada definida. Será usada nos relatórios.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Opções de Relatórios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Evidências/Documentos */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleOptionClick(onOpenDocuments)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FolderOpen className="h-5 w-5 text-orange-600" />
                  Evidências
                </CardTitle>
                <CardDescription>
                  {isClientView ? 'Visualizar' : 'Gerenciar'} documentos e evidências da turma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100">
                  {isClientView ? 'Visualizar' : 'Gerenciar'} Documentos
                </Button>
              </CardContent>
            </Card>

            {/* Avaliação de Ação e Reação */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setManualStatsOpen(true)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Avaliação de Ação e Reação
                </CardTitle>
                <CardDescription>
                  Registrar estatísticas de avaliações coletadas em papel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                  <Edit className="h-4 w-4 mr-2" />
                  Lançar Dados
                </Button>
              </CardContent>
            </Card>

            {/* Ver Estatísticas das Avaliações */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setManualStatsViewOpen(true)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Estatísticas das Avaliações
                </CardTitle>
                <CardDescription>
                  Visualizar estatísticas das avaliações registradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                  Ver Estatísticas
                </Button>
              </CardContent>
            </Card>

            {/* Avaliação do Treinamento */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleOptionClick(onOpenCompanyEvaluation)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Avaliação do Treinamento
                </CardTitle>
                <CardDescription>
                  {isClientView ? 'Visualizar' : 'Gerenciar'} avaliação da empresa sobre o treinamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                  {isClientView ? 'Visualizar' : 'Acessar'} Avaliação
                </Button>
              </CardContent>
            </Card>

            {/* Relatório */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-amber-600" />
                  Relatório
                </CardTitle>
                <CardDescription>
                  Gerar relatório completo com evidências do treinamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                  disabled={generatingReport}
                  onClick={() => onOpenEvidenceReport()}
                >
                  {generatingReport ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    'Gerar Relatório'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Capa Personalizada */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCustomCoverOpen(true)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Upload className="h-5 w-5 text-indigo-600" />
                  Capa Personalizada
                </CardTitle>
                <CardDescription>
                  {isClientView ? 'Visualizar' : 'Gerenciar'} capa personalizada do relatório
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100">
                  {isClientView ? 'Visualizar' : 'Gerenciar'} Capa
                </Button>
              </CardContent>
            </Card>

            {/* Avaliações/Notas */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleOptionClick(onOpenGrades)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardList className="h-5 w-5 text-green-600" />
                  Avaliações
                </CardTitle>
                <CardDescription>
                  {isClientView ? 'Visualizar' : 'Gerenciar'} notas e avaliações dos alunos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                  {isClientView ? 'Visualizar' : 'Acessar'} Notas
                </Button>
              </CardContent>
            </Card>

            {/* Fotos */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleOptionClick(onOpenPhotos)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Camera className="h-5 w-5 text-purple-600" />
                  Fotos
                </CardTitle>
                <CardDescription>
                  {isClientView ? 'Visualizar' : 'Gerenciar'} fotos do treinamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100">
                  {isClientView ? 'Visualizar' : 'Gerenciar'} Fotos
                </Button>
              </CardContent>
            </Card>

            {/* Responsável Técnico */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleOptionClick(onOpenTechnicalResponsible)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserCog className="h-5 w-5 text-indigo-600" />
                  Responsável Técnico
                </CardTitle>
                <CardDescription>
                  {isClientView ? 'Visualizar' : 'Gerenciar'} responsável técnico da turma
                  {turma?.technicalResponsible && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Definido
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100">
                  {isClientView ? 'Visualizar' : 'Gerenciar'} Responsável
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Responsável Técnico Info - se definido */}
          {turma?.technicalResponsible && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <UserCog className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Responsável Técnico Atual</span>
              </div>
              <p className="font-medium text-blue-900">{turma.technicalResponsible.name}</p>
              {turma.technicalResponsible.profession && (
                <p className="text-sm text-blue-700">{turma.technicalResponsible.profession}</p>
              )}
            </div>
          )}
        </div>

        {/* Modais de Estatísticas Manuais */}
        <ManualEvaluationStatsModal
          isOpen={manualStatsOpen}
          onClose={() => setManualStatsOpen(false)}
          turma={turma}
          readOnly={isClientView}
        />

        <ManualEvaluationStatsViewModal
          isOpen={manualStatsViewOpen}
          onClose={() => setManualStatsViewOpen(false)}
          turma={turma}
        />

        {/* Modal de Capa Personalizada */}
        <CustomCoverModal
          isOpen={customCoverOpen}
          onClose={() => setCustomCoverOpen(false)}
          turma={turma}
          readOnly={isClientView}
          onSuccess={() => {
            // Opcional: callback quando capa é alterada
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
