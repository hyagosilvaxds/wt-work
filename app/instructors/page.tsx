import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Users, Calendar, BookOpen } from 'lucide-react'

export default function InstructorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portal do Instrutor</h1>
              <p className="text-gray-600">Gerencie suas turmas, materiais e documentos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto p-6">
        
        {/* Seção de Teste - Destaque */}
        <div className="mb-8">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Upload className="h-6 w-6" />
                🧪 Teste de Upload de Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-blue-700 font-medium mb-2">
                    Funcionalidade de teste ativa!
                  </p>
                  <p className="text-blue-600 text-sm">
                    Teste o formulário completo de upload de documentos com simulação de envio, 
                    validação de campos e painel de debug em tempo real.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href="/instructors/upload">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Testar Agora
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Upload de Documentos */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Upload de Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Envie materiais de apoio, exercícios e outros documentos para suas turmas.
              </p>
              <Link href="/instructors/upload">
                <Button className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Documento
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Gerenciar Turmas */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Minhas Turmas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Visualize e gerencie suas turmas, alunos e cronogramas de aulas.
              </p>
              <Button variant="outline" className="w-full" disabled>
                <Users className="h-4 w-4 mr-2" />
                Ver Turmas (Em breve)
              </Button>
            </CardContent>
          </Card>

          {/* Agendar Aulas */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Agendar Aulas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Agende novas aulas e gerencie seu calendário de atividades.
              </p>
              <Button variant="outline" className="w-full" disabled>
                <Calendar className="h-4 w-4 mr-2" />
                Agendar (Em breve)
              </Button>
            </CardContent>
          </Card>

          {/* Meus Documentos */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Meus Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Visualize e organize todos os documentos que você já enviou.
              </p>
              <Button variant="outline" className="w-full" disabled>
                <FileText className="h-4 w-4 mr-2" />
                Ver Documentos (Em breve)
              </Button>
            </CardContent>
          </Card>

          {/* Cursos */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-red-600" />
                Meus Cursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gerencie o conteúdo e estrutura dos cursos que você ministra.
              </p>
              <Button variant="outline" className="w-full" disabled>
                <BookOpen className="h-4 w-4 mr-2" />
                Ver Cursos (Em breve)
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Status Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚀 Status do Sistema - Teste Ativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600">✅</div>
                  <div className="text-sm font-semibold text-green-700 mt-2">Teste Ativo</div>
                  <div className="text-xs text-green-600">Upload de Documentos</div>
                  <Link href="/instructors/upload" className="inline-block mt-2">
                    <Button size="sm" variant="outline" className="text-xs border-green-300">
                      Testar
                    </Button>
                  </Link>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">4</div>
                  <div className="text-sm text-gray-600">Em Desenvolvimento</div>
                  <div className="text-xs text-gray-500">Outras funcionalidades</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-gray-600">Sistema de Teste</div>
                  <div className="text-xs text-gray-500">Pronto para usar</div>
                </div>
              </div>
              
              {/* Instruções de Teste */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">📋 Como testar:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Clique em "Testar Agora" na seção azul acima</li>
                  <li>2. Selecione um arquivo (PDF, DOC, JPG, PNG)</li>
                  <li>3. Preencha título e categoria</li>
                  <li>4. Observe o painel de debug em tempo real</li>
                  <li>5. Clique em "Enviar" para simular o upload</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
