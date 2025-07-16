"use client"

import React from 'react'
import { CertificateTemplate, CertificateData, generateCertificatePDF } from '@/lib/certificate-generator'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

const testCertificate: CertificateData = {
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
}

export default function TestCertificate() {
  const handleGeneratePDF = async () => {
    try {
      await generateCertificatePDF(testCertificate)
      alert('PDF gerado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF')
    }
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teste do Certificado com Nova Imagem de Fundo</h1>
          <Button onClick={handleGeneratePDF} className="bg-green-600 hover:bg-green-700">
            <Download className="mr-2 h-4 w-4" />
            Gerar PDF
          </Button>
        </div>
        <div className="transform scale-50 origin-top">
          <CertificateTemplate data={testCertificate} />
        </div>
      </div>
    </div>
  )
}
