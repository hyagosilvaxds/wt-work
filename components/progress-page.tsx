"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Award, Clock, Target, BookOpen, CheckCircle, Star, Calendar } from "lucide-react"

export function ProgressPage() {
  // Dados mockados para demonstração
  const overallProgress = {
    totalCourses: 8,
    completedCourses: 3,
    inProgressCourses: 2,
    totalHours: 64,
    completedHours: 28,
    certificates: 3,
    averageScore: 8.5,
    currentStreak: 5,
    monthlyGoal: 40,
    monthlyProgress: 28
  }

  const courseProgress = [
    {
      id: 1,
      name: "Fundamentos de Segurança do Trabalho",
      progress: 75,
      score: 9.2,
      timeSpent: "6h 30min",
      lastAccessed: "2024-12-22",
      status: "Em andamento",
      modules: { completed: 9, total: 12 }
    },
    {
      id: 2,
      name: "Primeiros Socorros",
      progress: 100,
      score: 8.8,
      timeSpent: "6h 00min",
      lastAccessed: "2024-12-15",
      status: "Concluído",
      modules: { completed: 8, total: 8 }
    },
    {
      id: 3,
      name: "Prevenção de Incêndios",
      progress: 30,
      score: 7.5,
      timeSpent: "3h 15min",
      lastAccessed: "2024-12-20",
      status: "Em andamento",
      modules: { completed: 3, total: 10 }
    },
    {
      id: 4,
      name: "Ergonomia no Trabalho",
      progress: 100,
      score: 9.0,
      timeSpent: "4h 00min",
      lastAccessed: "2024-12-10",
      status: "Concluído",
      modules: { completed: 6, total: 6 }
    }
  ]

  const achievements = [
    {
      id: 1,
      name: "Primeiro Certificado",
      description: "Concluiu seu primeiro curso",
      icon: Award,
      earned: true,
      date: "2024-12-10"
    },
    {
      id: 2,
      name: "Estudante Dedicado",
      description: "5 dias consecutivos estudando",
      icon: Star,
      earned: true,
      date: "2024-12-22"
    },
    {
      id: 3,
      name: "Nota Máxima",
      description: "Tirou nota 10 em uma avaliação",
      icon: Target,
      earned: false,
      progress: 90
    },
    {
      id: 4,
      name: "Maratonista",
      description: "Estudou por 8 horas em um dia",
      icon: Clock,
      earned: false,
      progress: 60
    }
  ]

  const monthlyStats = [
    { month: "Ago", hours: 12, courses: 1 },
    { month: "Set", hours: 18, courses: 2 },
    { month: "Out", hours: 25, courses: 2 },
    { month: "Nov", hours: 22, courses: 3 },
    { month: "Dez", hours: 28, courses: 2 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-100 text-green-800"
      case "Em andamento":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meu Progresso</h1>
        <p className="text-gray-600">Acompanhe sua evolução nos treinamentos</p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cursos Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overallProgress.completedCourses}/{overallProgress.totalCourses}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Horas Estudadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overallProgress.completedHours}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Certificados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overallProgress.certificates}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nota Média</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overallProgress.averageScore}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meta Mensal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Meta Mensal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Progresso este mês</span>
            <span className="text-sm font-medium">
              {overallProgress.monthlyProgress}h / {overallProgress.monthlyGoal}h
            </span>
          </div>
          <Progress 
            value={(overallProgress.monthlyProgress / overallProgress.monthlyGoal) * 100} 
            className="h-3"
          />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span>Você está {Math.round((overallProgress.monthlyProgress / overallProgress.monthlyGoal) * 100)}% da sua meta!</span>
          </div>
        </CardContent>
      </Card>

      {/* Progresso por Curso */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso por Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseProgress.map((course) => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{course.name}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>Nota: {course.score}</span>
                      <span>Tempo: {course.timeSpent}</span>
                      <span>Módulos: {course.modules.completed}/{course.modules.total}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(course.status)}>
                    {course.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Último acesso: {new Date(course.lastAccessed).toLocaleDateString("pt-BR")}</span>
                    {course.progress === 100 && (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Concluído
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conquistas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`border rounded-lg p-4 ${achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${achievement.earned ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <achievement.icon className={`w-5 h-5 ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    {achievement.earned && achievement.date && (
                      <p className="text-xs text-green-600 mt-1">
                        Conquistado em {new Date(achievement.date).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                    {!achievement.earned && achievement.progress && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progresso</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Histórico Mensal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Histórico Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-600">{stat.month}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{stat.hours}h estudadas</p>
                    <p className="text-sm text-gray-600">{stat.courses} cursos</p>
                  </div>
                </div>
                <div className="w-32">
                  <Progress value={(stat.hours / 30) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
