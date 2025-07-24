'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import AttendanceListGenerator from "./attendance-list-generator"

interface Lesson {
  id: string
  title: string
  date: string
  startTime?: string
  endTime?: string
  duration?: number
  location?: string
  status: string
}

interface TurmaData {
  id: string
  training: {
    title: string
  }
  lessons: Lesson[]
}

interface AttendanceListModalProps {
  isOpen: boolean
  onClose: () => void
  turma: TurmaData | null
}

export function AttendanceListModal({ isOpen, onClose, turma }: AttendanceListModalProps) {
  if (!turma) return null

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não definida'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REALIZADA":
        return "bg-green-100 text-green-800"
      case "AGENDADA":
        return "bg-blue-100 text-blue-800"
      case "CANCELADA":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Listas de Presença - {turma.training.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {turma.lessons && turma.lessons.length > 0 ? (
            <>
              <div className="text-sm text-gray-600 mb-6">
                Gere listas de presença para cada aula desta turma. Você pode baixar listas preenchidas com os dados dos alunos ou listas em branco para preenchimento manual.
              </div>

              <div className="space-y-4">
                {turma.lessons.map((lesson) => (
                  <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                      {/* Informações da Aula */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{lesson.title}</h3>
                          <Badge className={getStatusColor(lesson.status)} variant="outline">
                            {lesson.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <span>📅</span>
                            <span>{formatDate(lesson.date)}</span>
                          </div>
                          {lesson.startTime && lesson.endTime && (
                            <div className="flex items-center gap-1">
                              <span>🕐</span>
                              <span>{lesson.startTime} - {lesson.endTime}</span>
                            </div>
                          )}
                          {lesson.duration && (
                            <div className="flex items-center gap-1">
                              <span>⏱️</span>
                              <span>{lesson.duration}h</span>
                            </div>
                          )}
                          {lesson.location && (
                            <div className="flex items-center gap-1">
                              <span>📍</span>
                              <span>{lesson.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Gerador de Lista de Presença */}
                      <div className="flex-shrink-0 border-l border-gray-200 pl-4">
                        <AttendanceListGenerator
                          lessonId={lesson.id}
                          lessonTitle={lesson.title}
                          size="md"
                          className="min-w-[280px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instruções */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">📋 Como usar:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Com Alunos:</strong> Baixa lista preenchida com nomes e CPF dos alunos matriculados</li>
                  <li>• <strong>Lista Vazia:</strong> Baixa lista em branco com campos para preenchimento manual</li>
                  <li>• <strong>Formato:</strong> Todos os arquivos são gerados em PDF otimizado para impressão</li>
                  <li>• <strong>Download:</strong> Os PDFs são baixados automaticamente no seu computador</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma aula programada
              </h3>
              <p className="text-gray-600">
                Esta turma ainda não possui aulas agendadas. Agende uma aula para poder gerar listas de presença.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
