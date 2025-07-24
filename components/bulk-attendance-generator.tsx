'use client'

import { useState } from 'react'
import { useAttendanceListGenerator } from './attendance-list-generator'

interface Lesson {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
}

interface BulkAttendanceGeneratorProps {
  lessons: Lesson[]
  className?: string
}

export default function BulkAttendanceGenerator({ lessons, className = '' }: BulkAttendanceGeneratorProps) {
  const { downloadAttendanceList, previewAttendanceList, isGenerating } = useAttendanceListGenerator()
  const [selectedLessons, setSelectedLessons] = useState<string[]>([])
  const [generationType, setGenerationType] = useState<'with-students' | 'empty-fields'>('with-students')

  // Selecionar/deselecionar todas as aulas
  const toggleSelectAll = () => {
    if (selectedLessons.length === lessons.length) {
      setSelectedLessons([])
    } else {
      setSelectedLessons(lessons.map(lesson => lesson.id))
    }
  }

  // Selecionar/deselecionar uma aula específica
  const toggleSelectLesson = (lessonId: string) => {
    setSelectedLessons(prev => 
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    )
  }

  // Gerar listas em lote
  const generateBulkAttendanceLists = async () => {
    if (selectedLessons.length === 0) {
      alert('Selecione pelo menos uma aula para gerar as listas.')
      return
    }

    try {
      for (const lessonId of selectedLessons) {
        await downloadAttendanceList(lessonId, generationType)
        // Pequeno delay entre downloads para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      alert(`${selectedLessons.length} listas de presença foram geradas com sucesso!`)
    } catch (error) {
      alert(`Erro ao gerar listas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (lessons.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        Nenhuma aula disponível para gerar listas de presença.
      </div>
    )
  }

  return (
    <div className={`bulk-attendance-generator ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Geração em Lote de Listas de Presença
          </h3>
          <p className="text-gray-600 text-sm">
            Selecione as aulas para gerar suas listas de presença simultaneamente.
          </p>
        </div>

        {/* Controles de seleção */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {selectedLessons.length === lessons.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
            </button>
            <span className="text-sm text-gray-500">
              {selectedLessons.length} de {lessons.length} selecionadas
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Tipo:</label>
            <select
              value={generationType}
              onChange={(e) => setGenerationType(e.target.value as 'with-students' | 'empty-fields')}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="with-students">Com Alunos</option>
              <option value="empty-fields">Campos Vazios</option>
            </select>
          </div>
        </div>

        {/* Lista de aulas */}
        <div className="mb-6 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedLessons.includes(lesson.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleSelectLesson(lesson.id)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedLessons.includes(lesson.id)}
                    onChange={() => toggleSelectLesson(lesson.id)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                    <div className="text-sm text-gray-600 mt-1">
                      📅 {formatDate(lesson.date)} • 🕐 {lesson.startTime} - {lesson.endTime}
                    </div>
                  </div>
                  <div className="ml-3 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        previewAttendanceList(lesson.id, 'with-students')
                      }}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      title="Preview com alunos"
                    >
                      👁️ Alunos
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        previewAttendanceList(lesson.id, 'empty-fields')
                      }}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      title="Preview vazia"
                    >
                      👁️ Vazia
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão de geração */}
        <div className="flex justify-center">
          <button
            onClick={generateBulkAttendanceLists}
            disabled={selectedLessons.length === 0 || isGenerating}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">⏳</span>
                Gerando...
              </>
            ) : (
              <>
                📥 Gerar {selectedLessons.length} Lista{selectedLessons.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>

        {/* Instruções */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">📋 Instruções:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Com Alunos:</strong> Gera listas preenchidas com nomes e CPF dos alunos matriculados</li>
            <li>• <strong>Campos Vazios:</strong> Gera listas em branco com 20 linhas para preenchimento manual</li>
            <li>• <strong>Preview:</strong> Use os botões 👁️ para visualizar as listas antes de baixar</li>
            <li>• <strong>Download:</strong> Os arquivos PDF serão baixados automaticamente</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
