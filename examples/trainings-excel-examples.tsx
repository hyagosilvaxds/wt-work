// Exemplo de como integrar as funcionalidades de Excel em páginas existentes

import { QuickTrainingExcel } from "@/components/quick-training-excel"
import { TrainingExcelManager } from "@/components/training-excel-manager"
import { useTrainingExcel } from "@/hooks/use-training-excel"

// 1. Integração Simples - Adicionar botões em qualquer página
export function ExemploIntegracaoSimples() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1>Minha Página de Treinamentos</h1>
        
        {/* Botões simples para Excel */}
        <QuickTrainingExcel 
          onImportComplete={() => {
            console.log('Treinamentos importados!')
            // Recarregar lista, etc.
          }}
          exportFilters={{ isActive: true }}
        />
      </div>
      
      {/* Resto do conteúdo da página */}
      <div>Minha lista de treinamentos...</div>
    </div>
  )
}

// 2. Integração com Hook - Controle total
export function ExemploComHook() {
  const {
    exportLoading,
    importLoading,
    templateLoading,
    exportTrainings,
    importTrainings,
    downloadTemplate
  } = useTrainingExcel({
    onImportSuccess: (result) => {
      console.log(`${result.importedRecords} treinamentos importados!`)
      // Atualizar estado da página
    },
    onExportSuccess: (fileName, totalRecords) => {
      console.log(`${totalRecords} treinamentos exportados`)
    }
  })

  const handleExportWithFilters = async () => {
    await exportTrainings({
      search: "NR",
      isActive: true,
      startDate: "2024-01-01",
      endDate: "2024-12-31"
    })
  }

  const handleFileImport = async (file: File) => {
    await importTrainings(file)
  }

  return (
    <div className="p-6">
      <h1>Controle Avançado de Excel</h1>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={handleExportWithFilters}
          disabled={exportLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {exportLoading ? 'Exportando...' : 'Exportar Filtrado'}
        </button>
        
        <button 
          onClick={downloadTemplate}
          disabled={templateLoading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {templateLoading ? 'Baixando...' : 'Baixar Template'}
        </button>
      </div>

      {/* Input de arquivo personalizado */}
      <input 
        type="file" 
        accept=".xlsx,.xls"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileImport(file)
        }}
      />
    </div>
  )
}

// 3. Página Completa de Gerenciamento
export function ExemploPageCompleta() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Treinamentos via Excel</h1>
      
      {/* Componente completo */}
      <TrainingExcelManager 
        onImportComplete={() => {
          // Atualizar dados da página
          console.log('Dados atualizados após import!')
        }}
      />
    </div>
  )
}

// 4. Integração na Página de Certificados (já implementado)
// Ver: components/certificates-page.tsx linha ~600
// Mostra como adicionar botões Excel em páginas existentes sem quebrar funcionalidades

export default {
  ExemploIntegracaoSimples,
  ExemploComHook,
  ExemploPageCompleta
}
