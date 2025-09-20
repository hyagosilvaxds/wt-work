/**
 * Script de teste para APIs de Avaliações de Turmas
 * 
 * Execute este script para testar as funcionalidades de avaliação:
 * node test-class-evaluations-api.js
 */

const API_BASE_URL = 'http://localhost:4000/api'

// Substitua pelo seu token de autenticação
const AUTH_TOKEN = 'your_jwt_token_here'

// IDs de exemplo - substitua pelos IDs reais do seu sistema
const TEST_CLASS_ID = 'cm2abc123def'
const TEST_STUDENT_ID = 'cm3student456'

const headers = {
  'Authorization': `Bearer ${AUTH_TOKEN}`,
  'Content-Type': 'application/json'
}

// 1. Teste de criação de avaliação
async function testCreateEvaluation() {
  console.log('\n🧪 Testando criação de avaliação...')
  
  const evaluationData = {
    classId: TEST_CLASS_ID,
    studentId: TEST_STUDENT_ID,
    
    // Conteúdo (exemplo com algumas notas)
    contentAdequacy: 5,
    contentApplicability: 4,
    contentTheoryPracticeBalance: 4,
    contentNewKnowledge: 4,
    
    // Instrutor
    instructorKnowledge: 5,
    instructorDidactic: 4,
    instructorCommunication: 4,
    instructorAssimilation: 3,
    instructorPracticalApps: 4,
    
    // Infraestrutura
    infrastructureFacilities: 4,
    infrastructureClassrooms: 4,
    infrastructureSchedule: 4,
    
    // Participantes
    participantsUnderstanding: 3,
    participantsRelationship: 4,
    participantsConsideration: 4,
    participantsInstructorRel: 4,
    
    observations: "Excelente treinamento, muito didático e prático."
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/superadmin/class-evaluations`, {
      method: 'POST',
      headers,
      body: JSON.stringify(evaluationData)
    })
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Avaliação criada com sucesso!')
      console.log('📋 Dados:', JSON.stringify(result, null, 2))
    } else {
      console.log('❌ Erro ao criar avaliação:', result)
    }
  } catch (error) {
    console.log('❌ Erro de rede:', error.message)
  }
}

// 2. Teste de busca de avaliação específica
async function testGetEvaluation() {
  console.log('\n🔍 Testando busca de avaliação específica...')
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/superadmin/class-evaluations/class/${TEST_CLASS_ID}/student/${TEST_STUDENT_ID}`,
      { headers }
    )
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Avaliação encontrada!')
      console.log('📋 Dados:', JSON.stringify(result, null, 2))
    } else {
      console.log('❌ Avaliação não encontrada ou erro:', result)
    }
  } catch (error) {
    console.log('❌ Erro de rede:', error.message)
  }
}

// 3. Teste de estatísticas da turma
async function testGetStats() {
  console.log('\n📊 Testando estatísticas da turma...')
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/superadmin/class-evaluations/class/${TEST_CLASS_ID}/stats`,
      { headers }
    )
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Estatísticas obtidas!')
      console.log('📈 Resumo:', {
        totalEstudantes: result.classInfo.totalStudents,
        avaliados: result.summary.evaluatedStudents,
        naoAvaliados: result.summary.notEvaluatedStudents,
        taxaAvaliacao: `${result.summary.evaluationRate}%`
      })
      
      // Mostrar algumas médias
      console.log('⭐ Médias por categoria:')
      console.log('  - Adequação do conteúdo:', result.statistics.content.adequacy.average)
      console.log('  - Conhecimento do instrutor:', result.statistics.instructor.knowledge.average)
      console.log('  - Instalações:', result.statistics.infrastructure.facilities.average)
    } else {
      console.log('❌ Erro ao obter estatísticas:', result)
    }
  } catch (error) {
    console.log('❌ Erro de rede:', error.message)
  }
}

// 4. Teste de listagem de avaliações da turma
async function testGetClassEvaluations() {
  console.log('\n📝 Testando listagem de avaliações da turma...')
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/superadmin/class-evaluations/class/${TEST_CLASS_ID}`,
      { headers }
    )
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Avaliações da turma obtidas!')
      console.log('🏫 Turma:', result.classInfo.trainingTitle)
      console.log('📊 Total de avaliações:', result.evaluations.length)
      
      result.evaluations.forEach((evaluation, index) => {
        console.log(`📝 Avaliação ${index + 1}:`, {
          aluno: evaluation.student?.name,
          cpf: evaluation.student?.cpf,
          adequacaoConteudo: evaluation.contentAdequacy,
          conhecimentoInstrutor: evaluation.instructorKnowledge
        })
      })
    } else {
      console.log('❌ Erro ao obter avaliações:', result)
    }
  } catch (error) {
    console.log('❌ Erro de rede:', error.message)
  }
}

// 5. Teste de atualização de avaliação
async function testUpdateEvaluation() {
  console.log('\n✏️ Testando atualização de avaliação...')
  
  const updateData = {
    contentAdequacy: 3,
    observations: "Avaliação atualizada via teste de API"
  }
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/superadmin/class-evaluations/class/${TEST_CLASS_ID}/student/${TEST_STUDENT_ID}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updateData)
      }
    )
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Avaliação atualizada com sucesso!')
      console.log('📋 Dados atualizados:', JSON.stringify(result, null, 2))
    } else {
      console.log('❌ Erro ao atualizar avaliação:', result)
    }
  } catch (error) {
    console.log('❌ Erro de rede:', error.message)
  }
}

// 6. Teste de remoção de avaliação (descomente para testar)
async function testDeleteEvaluation() {
  console.log('\n🗑️ Testando remoção de avaliação...')
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/superadmin/class-evaluations/class/${TEST_CLASS_ID}/student/${TEST_STUDENT_ID}`,
      {
        method: 'DELETE',
        headers
      }
    )
    
    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Avaliação removida com sucesso!')
      console.log('📋 Resultado:', result)
    } else {
      console.log('❌ Erro ao remover avaliação:', result)
    }
  } catch (error) {
    console.log('❌ Erro de rede:', error.message)
  }
}

// Função principal para executar todos os testes
async function runTests() {
  console.log('🚀 Iniciando testes das APIs de Avaliação de Turmas...')
  console.log('⚠️  Certifique-se de:')
  console.log('   - Substituir AUTH_TOKEN pelo seu token JWT válido')
  console.log('   - Substituir TEST_CLASS_ID por um ID de turma válido')
  console.log('   - Substituir TEST_STUDENT_ID por um ID de estudante válido')
  console.log('   - O servidor estar rodando na porta 3000')
  
  // Executar testes em sequência
  await testCreateEvaluation()
  await testGetEvaluation()
  await testGetClassEvaluations()
  await testGetStats()
  await testUpdateEvaluation()
  
  // Descomente a linha abaixo para testar remoção (cuidado!)
  // await testDeleteEvaluation()
  
  console.log('\n✨ Testes concluídos!')
}

// Executar os testes se o script for chamado diretamente
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = {
  testCreateEvaluation,
  testGetEvaluation,
  testGetStats,
  testGetClassEvaluations,
  testUpdateEvaluation,
  testDeleteEvaluation
}
