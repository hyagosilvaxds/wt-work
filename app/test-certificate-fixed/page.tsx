"use client"

import React from 'react'
import { CertificateTemplate, CertificateData } from '@/lib/certificate-generator'
import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

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

export default function TestCertificateAlternative() {
  const generatePDFAlternative = async () => {
    try {
      // Encontrar o template na página
      const templateElement = document.getElementById('certificate-template')
      
      if (!templateElement) {
        alert('Template não encontrado')
        return
      }

      // Aguardar um pouco para garantir que tudo esteja renderizado
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Capturar o elemento como imagem
      const canvas = await html2canvas(templateElement, {
        scale: 3, // Aumentar escala para melhor qualidade
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: templateElement.offsetWidth,
        height: templateElement.offsetHeight,
        windowWidth: templateElement.offsetWidth,
        windowHeight: templateElement.offsetHeight
      })

      // Criar PDF em formato landscape A4
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Obter dimensões do canvas
      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      
      // Dimensões do PDF A4 landscape (297mm x 210mm)
      const pdfWidth = 297
      const pdfHeight = 210
      
      // Calcular escala para manter proporção
      const scaleX = pdfWidth / canvasWidth
      const scaleY = pdfHeight / canvasHeight
      const scale = Math.min(scaleX, scaleY)
      
      // Calcular dimensões finais
      const finalWidth = canvasWidth * scale
      const finalHeight = canvasHeight * scale
      
      // Calcular posição para centralizar
      const x = (pdfWidth - finalWidth) / 2
      const y = (pdfHeight - finalHeight) / 2
      
      // Adicionar a imagem ao PDF
      const imgData = canvas.toDataURL('image/png', 1.0)
      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)

      // Fazer download do PDF
      pdf.save(`certificado-${testCertificate.studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`)
      
      alert('PDF gerado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    }
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teste do Certificado - Versão Corrigida</h1>
          <div className="flex gap-3">
            <Button onClick={generatePDFAlternative} className="bg-blue-600 hover:bg-blue-700">
              <FileText className="mr-2 h-4 w-4" />
              Gerar PDF Alternativo
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="transform scale-50 origin-top">
            <CertificateTemplate data={testCertificate} />
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Dimensões do Certificado:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Template: 297mm x 210mm (A4 Landscape)</li>
            <li>• Resolução: 1123px x 794px (300 DPI)</li>
            <li>• Escala de captura: 3x para alta qualidade</li>
            <li>• Proporção mantida automaticamente</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
