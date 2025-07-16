import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Award, Download, Eye, RefreshCw } from 'lucide-react'
import { generateCertificatePDFWithSignature, CertificateData } from '@/lib/certificate-generator'
import { toast } from 'sonner'

const sampleCertificates: CertificateData[] = [
  {
    studentName: "João Silva Santos",
    trainingName: "Segurança do Trabalho - NR 35",
    instructorName: "Carlos Alberto Pereira",
    issueDate: "15/07/2025",
    validationCode: "WT-2025-001",
    workload: "40h",
    company: "Empresa ABC Ltda",
    location: "São Paulo - SP",
    startDate: "01/07/2025",
    endDate: "15/07/2025"
  },
  {
    studentName: "Maria Fernanda Costa",
    trainingName: "Excel Avançado para Empresas",
    instructorName: "Ana Paula Rodrigues",
    issueDate: "15/07/2025",
    validationCode: "WT-2025-002",
    workload: "32h",
    company: "Tech Solutions Inc",
    location: "Rio de Janeiro - RJ",
    startDate: "08/07/2025",
    endDate: "15/07/2025"
  },
  {
    studentName: "Pedro Henrique Oliveira",
    trainingName: "Liderança e Gestão de Equipes",
    instructorName: "Roberto Lima Silva",
    issueDate: "15/07/2025",
    validationCode: "WT-2025-003",
    workload: "24h",
    company: "Consultoria Empresarial XYZ",
    location: "Belo Horizonte - MG",
    startDate: "12/07/2025",
    endDate: "15/07/2025"
  },
  {
    studentName: "Fernanda Alves Santos",
    trainingName: "Primeiros Socorros no Trabalho",
    instructorName: "Dr. Marcos Antonio",
    issueDate: "15/07/2025",
    validationCode: "WT-2025-004",
    workload: "16h",
    company: "Hospital São Lucas",
    location: "Salvador - BA",
    startDate: "14/07/2025",
    endDate: "15/07/2025"
  },
  {
    studentName: "Ricardo Gomes Pereira",
    trainingName: "Gestão de Projetos com Metodologias Ágeis",
    instructorName: "Juliana Martins",
    issueDate: "15/07/2025",
    validationCode: "WT-2025-005",
    workload: "48h",
    company: "StartupTech Brasil",
    location: "Porto Alegre - RS",
    startDate: "01/07/2025",
    endDate: "15/07/2025"
  }
]

export function CertificateExamplePage() {
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData>(sampleCertificates[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [customData, setCustomData] = useState<CertificateData>({
    studentName: "Nome do Estudante",
    trainingName: "Nome do Treinamento",
    instructorName: "Nome do Instrutor",
    issueDate: new Date().toLocaleDateString('pt-BR'),
    validationCode: generateValidationCode(),
    workload: "40h",
    company: "Empresa Exemplo",
    location: "Cidade - Estado",
    startDate: new Date().toLocaleDateString('pt-BR'),
    endDate: new Date().toLocaleDateString('pt-BR')
  })
  const [useCustomData, setUseCustomData] = useState(false)

  function generateValidationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = 'WT-'
    const year = new Date().getFullYear()
    result += year + '-'
    for (let i = 0; i < 3; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleGeneratePDF = async (certificateData: CertificateData) => {
    setIsGenerating(true)
    try {
      await generateCertificatePDFWithSignature(certificateData)
      toast.success('Certificado gerado e baixado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar certificado:', error)
      toast.error('Erro ao gerar certificado. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleInputChange = (field: keyof CertificateData, value: string) => {
    setCustomData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRandomCertificate = () => {
    const randomIndex = Math.floor(Math.random() * sampleCertificates.length)
    setSelectedCertificate(sampleCertificates[randomIndex])
    setUseCustomData(false)
  }

  const getCurrentCertificateData = () => {
    return useCustomData ? customData : selectedCertificate
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerador de Certificados</h1>
          <p className="text-gray-600">Visualize e gere certificados estilizados em PDF</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRandomCertificate}
            disabled={isGenerating}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Exemplo Aleatório
          </Button>
          <Button
            onClick={() => handleGeneratePDF(getCurrentCertificateData())}
            disabled={isGenerating}
            className="bg-primary-500 hover:bg-primary-600"
          >
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? 'Gerando...' : 'Gerar PDF'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controles */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Controles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={!useCustomData ? "default" : "outline"}
                  onClick={() => setUseCustomData(false)}
                  className="flex-1"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Exemplo
                </Button>
                <Button
                  variant={useCustomData ? "default" : "outline"}
                  onClick={() => setUseCustomData(true)}
                  className="flex-1"
                >
                  Personalizar
                </Button>
              </div>

              {!useCustomData && (
                <div className="space-y-2">
                  <Label>Certificados de Exemplo</Label>
                  <div className="grid gap-2">
                    {sampleCertificates.map((cert, index) => (
                      <Button
                        key={index}
                        variant={selectedCertificate === cert ? "default" : "outline"}
                        onClick={() => setSelectedCertificate(cert)}
                        className="w-full text-left justify-start p-2 h-auto"
                      >
                        <div className="text-left">
                          <div className="font-medium text-sm">{cert.studentName}</div>
                          <div className="text-xs text-gray-500">{cert.trainingName}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {useCustomData && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="studentName">Nome do Estudante</Label>
                    <Input
                      id="studentName"
                      value={customData.studentName}
                      onChange={(e) => handleInputChange('studentName', e.target.value)}
                      placeholder="Digite o nome completo"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="trainingName">Nome do Treinamento</Label>
                    <Input
                      id="trainingName"
                      value={customData.trainingName}
                      onChange={(e) => handleInputChange('trainingName', e.target.value)}
                      placeholder="Digite o nome do treinamento"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="instructorName">Nome do Instrutor</Label>
                    <Input
                      id="instructorName"
                      value={customData.instructorName}
                      onChange={(e) => handleInputChange('instructorName', e.target.value)}
                      placeholder="Digite o nome do instrutor"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="workload">Carga Horária</Label>
                    <Input
                      id="workload"
                      value={customData.workload}
                      onChange={(e) => handleInputChange('workload', e.target.value)}
                      placeholder="Ex: 40h"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      value={customData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Nome da empresa"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Local</Label>
                    <Input
                      id="location"
                      value={customData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Cidade - Estado"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="validationCode">Código de Validação</Label>
                    <div className="flex gap-2">
                      <Input
                        id="validationCode"
                        value={customData.validationCode}
                        onChange={(e) => handleInputChange('validationCode', e.target.value)}
                        placeholder="Código de validação"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleInputChange('validationCode', generateValidationCode())}
                        className="px-3"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opções de Geração</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-primary-700">PDF Direto</span>
                    <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">Recomendado</span>
                  </div>
                  <div className="text-xs text-primary-600">
                    • Geração mais rápida e confiável<br/>
                    • Layout otimizado para impressão<br/>
                    • Melhor controle de qualidade
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">PDF HTML</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Alternativo</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    • Baseado em renderização HTML<br/>
                    • Pode variar entre navegadores<br/>
                    • Experimental
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Formato:</span>
                    <span className="font-medium">A4 Paisagem</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Validação:</span>
                    <span className="font-medium">Código Único</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prévia do Certificado */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Prévia do Certificado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded-lg overflow-hidden">
                <div className="transform origin-top-left scale-[0.35] lg:scale-[0.45]">
                  <div 
                    id="certificate-preview"
                    className="bg-white font-serif relative overflow-hidden shadow-2xl"
                    style={{
                      width: '1123px',
                      height: '794px',
                      backgroundImage: 'url("/fundo-certificado.png")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      border: '8px solid #78BA00',
                      padding: '60px'
                    }}
                  >
                    <div className="relative z-10 h-full flex flex-col">
                      {/* Header */}
                      <div className="text-center mb-8 mt-24">
                        <h1 className="text-6xl font-bold text-gray-800 mb-2">
                          CERTIFICADO
                        </h1>
                        <div className="w-32 h-1 bg-primary-600 mx-auto mb-4"></div>
                        <p className="text-xl text-gray-600">
                          DE CONCLUSÃO DE CURSO
                        </p>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-center text-center px-8">
                        <p className="text-2xl text-gray-700 mb-8 leading-relaxed">
                          Certificamos que
                        </p>
                        
                        <div className="mb-12">
                          <p className="text-5xl font-bold text-primary-700 mb-4 border-b-2 border-primary-200 pb-2 inline-block">
                            {getCurrentCertificateData().studentName}
                          </p>
                        </div>

                        <p className="text-2xl text-gray-700 mb-8 leading-relaxed">
                          concluiu com êxito o curso de
                        </p>

                        <div className="mb-12">
                          <p className="text-4xl font-bold text-gray-800 mb-4">
                            {getCurrentCertificateData().trainingName}
                          </p>
                          <div className="flex justify-center items-center gap-8 text-lg text-gray-600">
                            <span>Carga horária: <strong>{getCurrentCertificateData().workload}</strong></span>
                            {getCurrentCertificateData().company && <span>•</span>}
                            {getCurrentCertificateData().company && <span>Empresa: <strong>{getCurrentCertificateData().company}</strong></span>}
                          </div>
                        </div>

                        <div className="flex justify-center items-center gap-4 text-lg text-gray-600 mb-8">
                          {getCurrentCertificateData().startDate && getCurrentCertificateData().endDate && (
                            <span>
                              Período: <strong>{getCurrentCertificateData().startDate} a {getCurrentCertificateData().endDate}</strong>
                            </span>
                          )}
                          {getCurrentCertificateData().location && (
                            <>
                              <span>•</span>
                              <span>Local: <strong>{getCurrentCertificateData().location}</strong></span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-auto pt-4">
                        <div className="flex justify-between items-end mb-4">
                          <div className="text-center flex-1">
                            <div className="border-t-2 border-gray-400 pt-2 mx-8 mt-8">
                              <p className="text-lg font-semibold text-gray-700">{getCurrentCertificateData().instructorName}</p>
                              <p className="text-sm text-gray-600">Instrutor Responsável</p>
                            </div>
                          </div>
                          
                          <div className="text-center flex-1">
                            <div className="border-t-2 border-gray-400 pt-2 mx-8 mt-8">
                              <p className="text-lg font-semibold text-gray-700">WT Work Treinamentos</p>
                              <p className="text-sm text-gray-600">Direção</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
