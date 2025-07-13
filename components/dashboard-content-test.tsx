"use client"

// Teste simples para verificar se o problema é com as importações dos componentes UI
export function DashboardContent() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-blue-100 text-lg">Bem-vindo ao sistema de gestão de treinamentos</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="text-sm font-medium text-gray-600">Total de Alunos</h3>
          <div className="text-3xl font-bold text-gray-900">1,234</div>
          <p className="text-xs text-gray-600 mt-1">+12% em relação ao mês anterior</p>
        </div>
      </div>
    </div>
  )
}
