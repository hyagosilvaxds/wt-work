import InstructorDocumentUploadDebug from '@/components/instructor-document-upload-debug'

export default function InstructorUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header específico para instrutores */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portal do Instrutor</h1>
              <p className="text-gray-600">Gerenciar documentos e materiais</p>
            </div>
            <div className="text-sm text-gray-500">
              Upload de Documentos
            </div>
          </div>
        </div>
      </div>
      
      {/* Componente de upload */}
      <InstructorDocumentUploadDebug />
    </div>
  )
}
