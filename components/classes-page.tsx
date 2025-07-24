'use client'

import { useState, useEffect } from "react"
import AttendanceListGenerator from "./attendance-list-generator"
import BulkAttendanceGenerator from "./bulk-attendance-generator"

// Interfaces para tipagem
interface Lesson {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  duration: number
  location: string
  instructor: string
}

interface Class {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  studentsCount: number
  lessons: Lesson[]
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedClass, setExpandedClass] = useState<string | null>(null)
  const [showBulkGenerator, setShowBulkGenerator] = useState(false)

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setClasses([
        {
          id: "class-1",
          name: "Treinamento de Segurança no Trabalho",
          description: "Curso básico de segurança e prevenção de acidentes",
          startDate: "2024-01-15",
          endDate: "2024-02-15",
          studentsCount: 25,
          lessons: [
            {
              id: "lesson-1",
              title: "Introdução à Segurança",
              date: "2024-01-15",
              startTime: "09:00",
              endTime: "12:00",
              duration: 3,
              location: "Sala A-101",
              instructor: "João Silva"
            },
            {
              id: "lesson-2",
              title: "Equipamentos de Proteção",
              date: "2024-01-22",
              startTime: "14:00",
              endTime: "17:00",
              duration: 3,
              location: "Sala A-102",
              instructor: "Maria Santos"
            },
            {
              id: "lesson-3",
              title: "Procedimentos de Emergência",
              date: "2024-01-29",
              startTime: "09:00",
              endTime: "12:00",
              duration: 3,
              location: "Sala A-101",
              instructor: "João Silva"
            }
          ]
        },
        {
          id: "class-2",
          name: "Primeiros Socorros",
          description: "Curso de primeiros socorros e atendimento emergencial",
          startDate: "2024-02-01",
          endDate: "2024-03-01",
          studentsCount: 18,
          lessons: [
            {
              id: "lesson-4",
              title: "Fundamentos de Primeiros Socorros",
              date: "2024-02-01",
              startTime: "08:00",
              endTime: "11:00",
              duration: 3,
              location: "Laboratório Med-1",
              instructor: "Dr. Carlos Lima"
            },
            {
              id: "lesson-5",
              title: "Atendimento a Emergências",
              date: "2024-02-08",
              startTime: "08:00",
              endTime: "11:00",
              duration: 3,
              location: "Laboratório Med-1",
              instructor: "Dr. Carlos Lima"
            }
          ]
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Obter todas as aulas de todas as turmas para o gerador em lote
  const getAllLessons = () => {
    return classes.flatMap(classItem => classItem.lessons)
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Turmas</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    )
  }

  if (classes.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-600">Gerencie as turmas de treinamento</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma turma encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              Comece criando uma nova turma de treinamento.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Criar Primeira Turma
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Turmas</h1>
            <p className="text-gray-600">Gerencie as turmas de treinamento e gere listas de presença</p>
          </div>
          
          {/* Botão para alternar entre vista individual e geração em lote */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowBulkGenerator(!showBulkGenerator)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                showBulkGenerator
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {showBulkGenerator ? '📋 Vista Individual' : '📦 Geração em Lote'}
            </button>
          </div>
        </div>
      </div>

      {/* Gerador em lote de listas de presença */}
      {showBulkGenerator && (
        <div className="mb-8">
          <BulkAttendanceGenerator lessons={getAllLessons()} />
        </div>
      )}

      {/* Vista individual das turmas */}
      {!showBulkGenerator && (
        <div className="space-y-6">
          {classes.map((classItem) => (
            <div key={classItem.id} className="bg-white rounded-lg shadow">
              {/* Cabeçalho da turma */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {classItem.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{classItem.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📅 {formatDate(classItem.startDate)} - {formatDate(classItem.endDate)}</span>
                      <span>👥 {classItem.studentsCount} alunos</span>
                      <span>📖 {classItem.lessons.length} aulas</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedClass(
                      expandedClass === classItem.id ? null : classItem.id
                    )}
                    className="ml-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    {expandedClass === classItem.id ? '▼ Recolher' : '▶ Ver Aulas'}
                  </button>
                </div>
              </div>

              {/* Lista de aulas (expansível) */}
              {expandedClass === classItem.id && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Aulas da Turma</h4>
                    
                    {/* Gerador em lote específico da turma */}
                    <div className="text-sm">
                      <BulkAttendanceGenerator 
                        lessons={classItem.lessons}
                        className="w-96"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {classItem.lessons.map((lesson) => (
                      <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 mb-2">{lesson.title}</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                              <div>📅 {formatDate(lesson.date)}</div>
                              <div>🕐 {lesson.startTime} - {lesson.endTime}</div>
                              <div>⏱️ {lesson.duration}h</div>
                              <div>📍 {lesson.location}</div>
                              <div className="col-span-2">👨‍🏫 {lesson.instructor}</div>
                            </div>
                          </div>

                          {/* Componente de Lista de Presença */}
                          <div className="ml-4">
                            <AttendanceListGenerator
                              lessonId={lesson.id}
                              size="sm"
                              showPreview={true}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resumo estatístico */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{classes.length}</div>
          <div className="text-blue-800 font-medium">Turmas Ativas</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {classes.reduce((sum, c) => sum + c.studentsCount, 0)}
          </div>
          <div className="text-green-800 font-medium">Total de Alunos</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {getAllLessons().length}
          </div>
          <div className="text-purple-800 font-medium">Total de Aulas</div>
        </div>
      </div>

      {/* Botão para criar nova turma */}
      <div className="mt-8 text-center">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
          + Criar Nova Turma
        </button>
      </div>
    </div>
  )
}
