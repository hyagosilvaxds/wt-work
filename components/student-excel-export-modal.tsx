"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Download, FileSpreadsheet, Calendar, MapPin, Users, Loader2, CheckCircle, User } from "lucide-react"
import { exportStudentsToExcel, downloadExcelFile, downloadBlobAsFile, StudentExportFilters } from "@/lib/api/superadmin"
import { toast } from "sonner"

interface StudentExcelExportModalProps {
  onExportCompleted?: () => void
}

export function StudentExcelExportModal({ onExportCompleted }: StudentExcelExportModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<StudentExportFilters>({})
  const [lastExport, setLastExport] = useState<{
    fileName: string
    totalRecords: number
    generatedAt: string
  } | null>(null)

  const handleExport = async () => {
    try {
      setLoading(true)
      
      // Exportar dados
      const exportData = await exportStudentsToExcel(filters)
      
      // Fazer download do arquivo
      const blob = await downloadExcelFile(exportData.fileName)
      downloadBlobAsFile(blob, exportData.fileName)
      
      // Salvar informações da última exportação
      setLastExport({
        fileName: exportData.fileName,
        totalRecords: exportData.totalRecords,
        generatedAt: exportData.generatedAt
      })
      
      toast.success(`Excel exportado com sucesso! ${exportData.totalRecords} registros exportados.`)
      
      if (onExportCompleted) {
        onExportCompleted()
      }
      
    } catch (error) {
      console.error('Erro ao exportar:', error)
      toast.error('Erro ao exportar estudantes. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setFilters({})
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
          <Download className="h-4 w-4 mr-2" />
          Exportar Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-green-600" />
            Exportar Estudantes para Excel
          </DialogTitle>
          <DialogDescription>
            Configure os filtros para exportar os estudantes desejados em formato Excel.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filtros de Busca */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filtros de Exportação</h3>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Busca Geral */}
              <div className="md:col-span-2">
                <Label htmlFor="search">Busca Geral</Label>
                <Input
                  id="search"
                  placeholder="Nome, email, CPF ou RG..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value || undefined }))}
                />
              </div>

              {/* Cidade */}
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Ex: São Paulo"
                  value={filters.city || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value || undefined }))}
                />
              </div>

              {/* Estado */}
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  placeholder="Ex: SP"
                  value={filters.state || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value || undefined }))}
                  maxLength={2}
                />
              </div>

              {/* Gênero */}
              <div>
                <Label>Gênero</Label>
                <Select 
                  value={filters.gender || 'TODOS'} 
                  onValueChange={(value) => setFilters(prev => ({ 
                    ...prev, 
                    gender: value === 'TODOS' ? undefined : value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Ativo */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activeOnly"
                  checked={filters.isActive === true}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ 
                      ...prev, 
                      isActive: checked === true ? true : undefined 
                    }))
                  }
                />
                <Label htmlFor="activeOnly">Apenas estudantes ativos</Label>
              </div>

              {/* Data Inicial */}
              <div>
                <Label htmlFor="startDate">Data Inicial (Matrícula)</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value || undefined }))}
                />
              </div>

              {/* Data Final */}
              <div>
                <Label htmlFor="endDate">Data Final (Matrícula)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value || undefined }))}
                />
              </div>

              {/* Cliente ID (opcional) */}
              <div className="md:col-span-2">
                <Label htmlFor="clientId">ID do Cliente (opcional)</Label>
                <Input
                  id="clientId"
                  placeholder="Filtrar por cliente específico..."
                  value={filters.clientId || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, clientId: e.target.value || undefined }))}
                />
              </div>
            </div>

            {/* Resumo dos Filtros */}
            {hasActiveFilters && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Filtros Ativos:</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Busca: {filters.search}
                    </Badge>
                  )}
                  {filters.city && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <MapPin className="h-3 w-3 mr-1" />
                      {filters.city}
                    </Badge>
                  )}
                  {filters.state && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Estado: {filters.state}
                    </Badge>
                  )}
                  {filters.gender && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <User className="h-3 w-3 mr-1" />
                      {filters.gender}
                    </Badge>
                  )}
                  {filters.isActive === true && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Apenas Ativos
                    </Badge>
                  )}
                  {(filters.startDate || filters.endDate) && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Calendar className="h-3 w-3 mr-1" />
                      {filters.startDate || '...'} até {filters.endDate || '...'}
                    </Badge>
                  )}
                  {filters.clientId && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <Users className="h-3 w-3 mr-1" />
                      Cliente: {filters.clientId}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Última Exportação */}
          {lastExport && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <h4 className="text-sm font-medium text-green-900">Última Exportação</h4>
              </div>
              <div className="text-sm text-green-700">
                <p><strong>Arquivo:</strong> {lastExport.fileName}</p>
                <p><strong>Registros:</strong> {lastExport.totalRecords}</p>
                <p><strong>Data:</strong> {new Date(lastExport.generatedAt).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          )}

          {/* Informações sobre o Excel */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <FileSpreadsheet className="h-4 w-4 text-gray-600 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Sobre o Arquivo Excel</h4>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Formato: .xlsx (Excel 2007+)</p>
              <p>• Colunas: Nome, CPF, Email, Telefone, Endereço, Cliente, Status e mais</p>
              <p>• Estatísticas: Turmas, certificados, presenças e faltas</p>
              <p>• Dados atualizados em tempo real</p>
              <p>• Compatível com Excel, LibreOffice e Google Sheets</p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Excel
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
