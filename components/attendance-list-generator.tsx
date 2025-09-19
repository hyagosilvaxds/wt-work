'use client'

import { useState } from 'react'
import { Download, Users, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AttendanceListGeneratorProps {
  lessonId: string
  lessonTitle?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function AttendanceListGenerator({ 
  lessonId, 
  lessonTitle,
  className = '',
  size = 'md'
}: AttendanceListGeneratorProps) {
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null)

  // Função para gerar lista de presença com alunos
  const generateAttendanceListWithStudents = async () => {
    setGeneratingPDF('with-students')
    try {
      const response = await fetch('https://api.olimpustech.com/certificado/attendance-list/with-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `lista-presenca-alunos-${lessonId}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao gerar lista de presença')
      }
    } catch (error) {
      console.error('Erro ao gerar lista:', error)
      alert(`Erro ao gerar lista de presença: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setGeneratingPDF(null)
    }
  }

  // Função para gerar lista de presença vazia
  const generateAttendanceListEmpty = async () => {
    setGeneratingPDF('empty-fields')
    try {
      const response = await fetch('https://api.olimpustech.com/certificado/attendance-list/empty-fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `lista-presenca-vazia-${lessonId}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao gerar lista de presença')
      }
    } catch (error) {
      console.error('Erro ao gerar lista:', error)
      alert(`Erro ao gerar lista de presença: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setGeneratingPDF(null)
    }
  }

  // Configurações de tamanho
  const sizeConfig = {
    sm: { button: 'h-8 px-3 text-xs', gap: 'gap-2' },
    md: { button: 'h-9 px-4 text-sm', gap: 'gap-3' },
    lg: { button: 'h-10 px-6 text-base', gap: 'gap-4' }
  }

  const { button: buttonSize, gap } = sizeConfig[size]

  return (
    <div className={`attendance-list-generator ${className}`}>
      {lessonTitle && (
        <div className="mb-3">
          <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-green-600" />
            {lessonTitle}
          </h4>
          <p className="text-xs text-gray-500 mt-1">Gere listas de presença em PDF</p>
        </div>
      )}

      <div className={`flex flex-col sm:flex-row ${gap}`}>
        {/* Botão Lista com Alunos */}
        <Button
          onClick={generateAttendanceListWithStudents}
          disabled={generatingPDF !== null}
          className={`${buttonSize} bg-green-600 hover:bg-green-700 text-white flex-1 min-w-[140px]`}
          title="Baixar lista com nomes e CPF dos alunos matriculados"
        >
          {generatingPDF === 'with-students' ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Users className="h-4 w-4 mr-2" />
          )}
          {generatingPDF === 'with-students' ? 'Gerando...' : 'Com Alunos'}
        </Button>
        
        {/* Botão Lista Vazia */}
        <Button
          onClick={generateAttendanceListEmpty}
          disabled={generatingPDF !== null}
          variant="outline"
          className={`${buttonSize} border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 flex-1 min-w-[140px]`}
          title="Baixar lista em branco para preenchimento manual"
        >
          {generatingPDF === 'empty-fields' ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {generatingPDF === 'empty-fields' ? 'Gerando...' : 'Lista Vazia'}
        </Button>
      </div>

      {/* Indicador de status */}
      {generatingPDF && (
        <div className="mt-3 flex items-center justify-center">
          <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
            <Loader2 className="h-3 w-3 animate-spin mr-2" />
            Gerando arquivo PDF...
          </div>
        </div>
      )}
    </div>
  )
}
