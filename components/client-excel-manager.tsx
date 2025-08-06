'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { 
  exportClientsToExcel, 
  importClientsFromExcel, 
  downloadExcelFile,
  type ClientExportFilters,
  type ExportClientResponse,
  type ImportClientResponse
} from '@/lib/api/superadmin'
import { Download, Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export function ClientExcelManager() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationResult, setValidationResult] = useState<ImportClientResponse | null>(null)
  const [lastExport, setLastExport] = useState<ExportClientResponse | null>(null)

  // Estados dos filtros de exportação
  const [exportFilters, setExportFilters] = useState<ClientExportFilters>({
    isActive: undefined,
    search: '',
    city: '',
    state: '',
    personType: undefined,
    startDate: '',
    endDate: ''
  })

  const handleExport = async () => {
    try {
      setIsExporting(true)
      
      // Limpar campos vazios
      const filters = Object.fromEntries(
        Object.entries(exportFilters).filter(([_, value]) => value !== '' && value !== undefined)
      ) as ClientExportFilters

      const result = await exportClientsToExcel(filters)
      setLastExport(result)
      
      toast({
        title: "Exportação concluída",
        description: `${result.totalRecords} clientes exportados com sucesso`,
      })

    } catch (error: any) {
      toast({
        title: "Erro na exportação",
        description: error.message || "Erro ao exportar clientes",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownload = async () => {
    if (!lastExport) return
    
    try {
      await downloadExcelFile(lastExport.fileName)
      
      toast({
        title: "Download iniciado",
        description: "O arquivo está sendo baixado",
      })
    } catch (error: any) {
      toast({
        title: "Erro no download",
        description: error.message || "Erro ao baixar arquivo",
        variant: "destructive"
      })
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setValidationResult(null)
    }
  }

  const handleValidate = async () => {
    if (!selectedFile) return

    try {
      setIsValidating(true)
      
      const result = await importClientsFromExcel(selectedFile, true)
      setValidationResult(result)
      
      if (result.invalidRecords === 0) {
        toast({
          title: "Validação aprovada",
          description: `Todos os ${result.validRecords} registros estão válidos`,
        })
      } else {
        toast({
          title: "Validação com erros",
          description: `${result.invalidRecords} registros com erros de ${result.totalRecords} total`,
          variant: "destructive"
        })
      }

    } catch (error: any) {
      toast({
        title: "Erro na validação",
        description: error.message || "Erro ao validar arquivo",
        variant: "destructive"
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleImport = async () => {
    if (!selectedFile || !validationResult || validationResult.invalidRecords > 0) return

    try {
      setIsImporting(true)
      
      const result = await importClientsFromExcel(selectedFile, false)
      
      toast({
        title: "Importação concluída",
        description: `${result.importedRecords} clientes importados com sucesso`,
      })

      // Limpar estado após importação
      setSelectedFile(null)
      setValidationResult(null)
      const input = document.getElementById('file-input') as HTMLInputElement
      if (input) input.value = ''

    } catch (error: any) {
      toast({
        title: "Erro na importação",
        description: error.message || "Erro ao importar clientes",
        variant: "destructive"
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Clientes Excel</h1>
          <p className="text-muted-foreground">
            Exporte e importe dados de clientes em formato Excel
          </p>
        </div>
      </div>

      <Tabs defaultValue="export" className="w-full">
        <TabsList>
          <TabsTrigger value="export">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </TabsTrigger>
          <TabsTrigger value="import">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exportar Clientes</CardTitle>
              <CardDescription>
                Configure os filtros e exporte os dados dos clientes para Excel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Busca</Label>
                  <Input
                    id="search"
                    placeholder="Nome, email, CPF, CNPJ..."
                    value={exportFilters.search}
                    onChange={(e) => setExportFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    placeholder="Cidade"
                    value={exportFilters.city}
                    onChange={(e) => setExportFilters(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    placeholder="UF"
                    value={exportFilters.state}
                    onChange={(e) => setExportFilters(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="person-type">Tipo de Pessoa</Label>
                  <Select 
                    value={exportFilters.personType || ''} 
                    onValueChange={(value) => setExportFilters(prev => ({ 
                      ...prev, 
                      personType: value as 'FISICA' | 'JURIDICA' | undefined 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="FISICA">Pessoa Física</SelectItem>
                      <SelectItem value="JURIDICA">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={exportFilters.isActive === undefined ? '' : exportFilters.isActive.toString()} 
                    onValueChange={(value) => setExportFilters(prev => ({ 
                      ...prev, 
                      isActive: value === '' ? undefined : value === 'true' 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="true">Ativo</SelectItem>
                      <SelectItem value="false">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-date">Data Inicial</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={exportFilters.startDate}
                    onChange={(e) => setExportFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">Data Final</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={exportFilters.endDate}
                    onChange={(e) => setExportFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleExport} 
                  disabled={isExporting}
                  className="flex items-center gap-2"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  {isExporting ? 'Exportando...' : 'Exportar para Excel'}
                </Button>

                {lastExport && (
                  <Button 
                    variant="outline" 
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Baixar Arquivo
                  </Button>
                )}
              </div>

              {lastExport && (
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Exportação concluída</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    {lastExport.totalRecords} registros exportados em {lastExport.fileName}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importar Clientes</CardTitle>
              <CardDescription>
                Faça upload de um arquivo Excel para importar clientes em lote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-input">Arquivo Excel</Label>
                <Input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                />
                <p className="text-sm text-muted-foreground">
                  Apenas arquivos .xlsx e .xls são aceitos
                </p>
              </div>

              {selectedFile && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={handleValidate} 
                  disabled={!selectedFile || isValidating}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {isValidating ? 'Validando...' : 'Validar Arquivo'}
                </Button>

                <Button 
                  onClick={handleImport} 
                  disabled={!validationResult || validationResult.invalidRecords > 0 || isImporting}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {isImporting ? 'Importando...' : 'Importar Clientes'}
                </Button>
              </div>

              {validationResult && (
                <div className={`p-4 border rounded-lg ${
                  validationResult.invalidRecords === 0 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className={`flex items-center gap-2 ${
                    validationResult.invalidRecords === 0 
                      ? 'text-green-700' 
                      : 'text-red-700'
                  }`}>
                    {validationResult.invalidRecords === 0 ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {validationResult.invalidRecords === 0 
                        ? 'Validação aprovada' 
                        : 'Validação com erros'
                      }
                    </span>
                  </div>
                  
                  <div className="mt-2 space-y-1 text-sm">
                    <p>Total de registros: {validationResult.totalRecords}</p>
                    <p>Registros válidos: {validationResult.validRecords}</p>
                    <p>Registros com erro: {validationResult.invalidRecords}</p>
                    {validationResult.importedRecords > 0 && (
                      <p>Registros importados: {validationResult.importedRecords}</p>
                    )}
                  </div>

                  {validationResult.errors.length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium text-sm mb-2">Erros encontrados:</p>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {validationResult.errors.map((error, index) => (
                          <div key={index} className="text-xs p-2 bg-white border rounded">
                            <span className="font-medium">Linha {error.row}:</span> {error.message}
                            {error.field !== 'geral' && (
                              <span className="text-muted-foreground"> (Campo: {error.field})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
