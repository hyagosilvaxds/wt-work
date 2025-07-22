import InstructorDocumentUploadDebug from '@/components/instructor-document-upload-debug'

export default function UploadTestePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simples para a página de teste */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🧪 Teste de Upload</h1>
              <p className="text-gray-600">Teste isolado do formulário de upload de documentos</p>
            </div>
            <div className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
              Rota: /upload-teste
            </div>
          </div>
        </div>
      </div>
      
      {/* Área de informações */}
      <div className="container mx-auto px-6 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-blue-800 font-semibold mb-2">📋 Instruções de Teste:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Esta é uma rota isolada para testar o formulário de upload</li>
            <li>• Abra o console do navegador (F12) para ver os logs detalhados</li>
            <li>• Teste todas as funcionalidades: seleção de arquivo, preenchimento e envio</li>
            <li>• Compare o comportamento com outras rotas se necessário</li>
          </ul>
        </div>
      </div>
      
      {/* Componente de upload */}
      <InstructorDocumentUploadDebug />
    </div>
  )
}
