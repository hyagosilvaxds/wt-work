// Exemplos de uso das APIs de Excel para Clientes
// Este arquivo contém exemplos práticos de como usar as funções implementadas

import React from 'react'
import { 
  exportClientsToExcel, 
  importClientsFromExcel, 
  downloadExcelFile 
} from '@/lib/api/superadmin'

// ===== EXEMPLO 1: EXPORTAÇÃO BÁSICA =====
export async function exemploExportacaoBasica() {
  try {
    // Exportar todos os clientes ativos
    const resultado = await exportClientsToExcel({
      isActive: true
    })
    
    console.log(`✅ Exportação concluída!`)
    console.log(`📁 Arquivo: ${resultado.fileName}`)
    console.log(`📊 Total de registros: ${resultado.totalRecords}`)
    console.log(`🔗 URL de download: ${resultado.downloadUrl}`)
    
    return resultado
  } catch (error) {
    console.error('❌ Erro na exportação:', error)
    throw error
  }
}

// ===== EXEMPLO 2: EXPORTAÇÃO COM FILTROS AVANÇADOS =====
export async function exemploExportacaoAvancada() {
  try {
    // Exportar clientes de São Paulo, pessoas jurídicas, criados em 2024
    const resultado = await exportClientsToExcel({
      city: "São Paulo",
      state: "SP",
      personType: "JURIDICA",
      isActive: true,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      search: "tech" // Buscar por "tech" no nome
    })
    
    console.log(`✅ Exportação filtrada concluída!`)
    console.log(`📁 Arquivo: ${resultado.fileName}`)
    console.log(`📊 ${resultado.totalRecords} clientes exportados`)
    
    return resultado
  } catch (error) {
    console.error('❌ Erro na exportação filtrada:', error)
    throw error
  }
}

// ===== EXEMPLO 3: VALIDAÇÃO DE ARQUIVO ANTES DA IMPORTAÇÃO =====
export async function exemploValidacaoArquivo(arquivo: File) {
  try {
    console.log(`🔍 Validando arquivo: ${arquivo.name}`)
    
    // Validar sem importar (validateOnly = true)
    const validacao = await importClientsFromExcel(arquivo, true)
    
    console.log(`📊 Resultados da validação:`)
    console.log(`   - Total de registros: ${validacao.totalRecords}`)
    console.log(`   - Registros válidos: ${validacao.validRecords}`)
    console.log(`   - Registros inválidos: ${validacao.invalidRecords}`)
    
    if (validacao.invalidRecords > 0) {
      console.log(`❌ Erros encontrados:`)
      validacao.errors.forEach((erro, index) => {
        console.log(`   ${index + 1}. Linha ${erro.row}: ${erro.message} (Campo: ${erro.field})`)
      })
      return false
    } else {
      console.log(`✅ Todos os registros são válidos!`)
      return true
    }
  } catch (error) {
    console.error('❌ Erro na validação:', error)
    return false
  }
}

// ===== EXEMPLO 4: IMPORTAÇÃO COMPLETA COM VALIDAÇÃO =====
export async function exemploImportacaoCompleta(arquivo: File) {
  try {
    console.log(`📤 Iniciando importação de: ${arquivo.name}`)
    
    // Passo 1: Validar arquivo
    const validacaoOk = await exemploValidacaoArquivo(arquivo)
    
    if (!validacaoOk) {
      throw new Error('Arquivo contém erros. Corrija e tente novamente.')
    }
    
    // Passo 2: Importar dados (validateOnly = false)
    console.log(`⚡ Importando dados...`)
    const resultado = await importClientsFromExcel(arquivo, false)
    
    console.log(`✅ Importação concluída!`)
    console.log(`📊 Estatísticas:`)
    console.log(`   - Total processado: ${resultado.totalRecords}`)
    console.log(`   - Importados com sucesso: ${resultado.importedRecords}`)
    console.log(`   - Erros durante importação: ${resultado.invalidRecords}`)
    
    if (resultado.errors.length > 0) {
      console.log(`⚠️ Alguns registros falharam:`)
      resultado.errors.forEach((erro, index) => {
        console.log(`   ${index + 1}. Linha ${erro.row}: ${erro.message}`)
      })
    }
    
    return resultado
  } catch (error) {
    console.error('❌ Erro na importação:', error)
    throw error
  }
}

// ===== EXEMPLO 5: DOWNLOAD DIRETO DE ARQUIVO =====
export async function exemploDownloadArquivo(nomeArquivo: string) {
  try {
    console.log(`📥 Baixando arquivo: ${nomeArquivo}`)
    
    await downloadExcelFile(nomeArquivo)
    
    console.log(`✅ Download iniciado!`)
  } catch (error) {
    console.error('❌ Erro no download:', error)
    throw error
  }
}

// ===== EXEMPLO 6: FLUXO COMPLETO DE EXPORTAÇÃO E DOWNLOAD =====
export async function exemploFluxoCompleto() {
  try {
    console.log(`🚀 Iniciando fluxo completo...`)
    
    // 1. Exportar dados
    const exportacao = await exportClientsToExcel({
      isActive: true,
      personType: "JURIDICA"
    })
    
    console.log(`✅ Etapa 1: Dados exportados (${exportacao.totalRecords} registros)`)
    
    // 2. Aguardar um momento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 3. Fazer download automático
    await downloadExcelFile(exportacao.fileName)
    
    console.log(`✅ Etapa 2: Download iniciado`)
    console.log(`🎉 Fluxo completo finalizado!`)
    
    return exportacao
  } catch (error) {
    console.error('❌ Erro no fluxo completo:', error)
    throw error
  }
}

// ===== EXEMPLO 7: TRATAMENTO DE ERROS AVANÇADO =====
export async function exemploTratamentoErros(arquivo?: File) {
  try {
    if (arquivo) {
      // Tentar importação com tratamento de erros específicos
      const resultado = await importClientsFromExcel(arquivo, false)
      
      if (resultado.errors.length > 0) {
        // Agrupar erros por tipo
        const errosPorTipo = resultado.errors.reduce((acc, erro) => {
          if (!acc[erro.field]) acc[erro.field] = []
          acc[erro.field].push(erro)
          return acc
        }, {} as Record<string, typeof resultado.errors>)
        
        console.log(`📋 Resumo de erros por campo:`)
        Object.entries(errosPorTipo).forEach(([campo, erros]) => {
          console.log(`   ${campo}: ${erros.length} erro(s)`)
        })
      }
      
      return resultado
    } else {
      // Tentar exportação
      const resultado = await exportClientsToExcel()
      return resultado
    }
    
  } catch (error: any) {
    // Tratar diferentes tipos de erro
    if (error.response?.status === 400) {
      console.error('❌ Erro de validação:', error.response.data.message)
    } else if (error.response?.status === 404) {
      console.error('❌ Arquivo não encontrado')
    } else if (error.response?.status === 500) {
      console.error('❌ Erro interno do servidor')
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('❌ Erro de conexão')
    } else {
      console.error('❌ Erro desconhecido:', error.message)
    }
    
    throw error
  }
}

// ===== EXEMPLO 8: USO EM COMPONENTE REACT =====
export const ExemploComponenteReact = () => {
  const [arquivoSelecionado, setArquivoSelecionado] = React.useState<File | null>(null)
  const [carregando, setCarregando] = React.useState(false)
  const [ultimaExportacao, setUltimaExportacao] = React.useState<any>(null)
  
  const handleExportar = async () => {
    setCarregando(true)
    try {
      const resultado = await exemploExportacaoBasica()
      setUltimaExportacao(resultado)
      alert(`Exportação concluída! ${resultado.totalRecords} registros.`)
    } catch (error) {
      alert('Erro na exportação!')
    } finally {
      setCarregando(false)
    }
  }
  
  const handleImportar = async () => {
    if (!arquivoSelecionado) {
      alert('Selecione um arquivo primeiro!')
      return
    }
    
    setCarregando(true)
    try {
      const resultado = await exemploImportacaoCompleta(arquivoSelecionado)
      alert(`Importação concluída! ${resultado.importedRecords} registros importados.`)
    } catch (error) {
      alert('Erro na importação!')
    } finally {
      setCarregando(false)
    }
  }
  
  const handleDownload = async () => {
    if (!ultimaExportacao) return
    
    try {
      await exemploDownloadArquivo(ultimaExportacao.fileName)
    } catch (error) {
      alert('Erro no download!')
    }
  }
  
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Exemplo de Uso das APIs Excel</h2>
      
      <div className="flex gap-2">
        <button 
          onClick={handleExportar} 
          disabled={carregando}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {carregando ? 'Exportando...' : 'Exportar Clientes'}
        </button>
        
        {ultimaExportacao && (
          <button 
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Baixar Arquivo
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setArquivoSelecionado(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500"
        />
        
        <button 
          onClick={handleImportar} 
          disabled={carregando || !arquivoSelecionado}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {carregando ? 'Importando...' : 'Importar Clientes'}
        </button>
      </div>
      
      {ultimaExportacao && (
        <div className="p-3 bg-green-100 border border-green-300 rounded">
          <p className="text-sm">
            ✅ Última exportação: {ultimaExportacao.totalRecords} registros em {ultimaExportacao.fileName}
          </p>
        </div>
      )}
    </div>
  )
}

// ===== EXEMPLO 9: HOOKS PERSONALIZADOS =====
export const useClientExcel = () => {
  const [carregando, setCarregando] = React.useState(false)
  const [ultimaExportacao, setUltimaExportacao] = React.useState<any>(null)
  const [erros, setErros] = React.useState<string[]>([])
  
  const exportar = async (filtros = {}) => {
    setCarregando(true)
    setErros([])
    
    try {
      const resultado = await exportClientsToExcel(filtros)
      setUltimaExportacao(resultado)
      return resultado
    } catch (error: any) {
      const mensagem = error.response?.data?.message || error.message
      setErros([mensagem])
      throw error
    } finally {
      setCarregando(false)
    }
  }
  
  const importar = async (arquivo: File, apenasValidar = false) => {
    setCarregando(true)
    setErros([])
    
    try {
      const resultado = await importClientsFromExcel(arquivo, apenasValidar)
      
      if (resultado.errors.length > 0) {
        setErros(resultado.errors.map(e => `Linha ${e.row}: ${e.message}`))
      }
      
      return resultado
    } catch (error: any) {
      const mensagem = error.response?.data?.message || error.message
      setErros([mensagem])
      throw error
    } finally {
      setCarregando(false)
    }
  }
  
  const baixar = async (nomeArquivo: string) => {
    try {
      await downloadExcelFile(nomeArquivo)
    } catch (error: any) {
      const mensagem = error.response?.data?.message || error.message
      setErros([mensagem])
      throw error
    }
  }
  
  return {
    carregando,
    ultimaExportacao,
    erros,
    exportar,
    importar,
    baixar,
    limparErros: () => setErros([])
  }
}
