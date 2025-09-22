// Script para testar as funcionalidades de avaliação de alunos
// Execute este script no terminal usando: node test-student-grades.js

const API_BASE_URL = 'https://api.olimpustech.com/api'

// Função para fazer requisições
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Adicione aqui o token de autenticação quando necessário
      // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.message || response.statusText}`)
    }
    
    return data
  } catch (error) {
    console.error(`Erro na requisição ${endpoint}:`, error.message)
    throw error
  }
}

// Teste 1: Criar/Atualizar nota de aluno
async function testCreateGrade() {
  console.log('\n=== Teste 1: Criar Nota ===')
  
  const gradeData = {
    classId: "turma_123",
    studentId: "aluno_456", 
    practicalGrade: 8.5,
    theoreticalGrade: 9.0,
    observations: "Excelente desempenho em ambas as avaliações"
  }

  try {
    const result = await makeRequest('/superadmin/student-grades', {
      method: 'POST',
      body: JSON.stringify(gradeData)
    })
    
    console.log('✅ Nota criada com sucesso:', result)
    return result
  } catch (error) {
    console.log('❌ Erro ao criar nota:', error.message)
  }
}

// Teste 2: Buscar notas de uma turma
async function testGetClassGrades(classId) {
  console.log('\n=== Teste 2: Buscar Notas da Turma ===')
  
  try {
    const result = await makeRequest(`/superadmin/student-grades/class/${classId}`)
    console.log('✅ Notas da turma encontradas:', result)
    return result
  } catch (error) {
    console.log('❌ Erro ao buscar notas:', error.message)
  }
}

// Teste 3: Buscar estatísticas da turma
async function testGetClassStats(classId) {
  console.log('\n=== Teste 3: Buscar Estatísticas ===')
  
  try {
    const result = await makeRequest(`/superadmin/student-grades/class/${classId}/stats`)
    console.log('✅ Estatísticas encontradas:', result)
    return result
  } catch (error) {
    console.log('❌ Erro ao buscar estatísticas:', error.message)
  }
}

// Teste 4: Atualizar nota específica
async function testUpdateGrade(classId, studentId) {
  console.log('\n=== Teste 4: Atualizar Nota ===')
  
  const updateData = {
    practicalGrade: 9.5,
    observations: "Melhoria significativa na avaliação prática"
  }

  try {
    const result = await makeRequest(`/superadmin/student-grades/${classId}/${studentId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    })
    
    console.log('✅ Nota atualizada com sucesso:', result)
    return result
  } catch (error) {
    console.log('❌ Erro ao atualizar nota:', error.message)
  }
}

// Teste 5: Buscar todas as notas com filtros
async function testGetAllGrades() {
  console.log('\n=== Teste 5: Buscar Todas as Notas ===')
  
  try {
    const result = await makeRequest('/superadmin/student-grades?page=1&limit=5')
    console.log('✅ Notas encontradas:', result)
    return result
  } catch (error) {
    console.log('❌ Erro ao buscar todas as notas:', error.message)
  }
}

// Teste 6: Remover nota
async function testDeleteGrade(classId, studentId) {
  console.log('\n=== Teste 6: Remover Nota ===')
  
  try {
    const result = await makeRequest(`/superadmin/student-grades/${classId}/${studentId}`, {
      method: 'DELETE'
    })
    
    console.log('✅ Nota removida com sucesso:', result)
    return result
  } catch (error) {
    console.log('❌ Erro ao remover nota:', error.message)
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🚀 Iniciando testes das funcionalidades de avaliação...')
  
  const classId = "turma_123"
  const studentId = "aluno_456"
  
  // Executar testes em sequência
  await testCreateGrade()
  await testGetClassGrades(classId)
  await testGetClassStats(classId)
  await testUpdateGrade(classId, studentId)
  await testGetAllGrades()
  
  // Comentado para não deletar durante os testes
  // await testDeleteGrade(classId, studentId)
  
  console.log('\n✨ Testes concluídos!')
}

// Executar se o arquivo for chamado diretamente
if (require.main === module) {
  runAllTests().catch(console.error)
}

module.exports = {
  testCreateGrade,
  testGetClassGrades,
  testGetClassStats,
  testUpdateGrade,
  testGetAllGrades,
  testDeleteGrade,
  runAllTests
}
