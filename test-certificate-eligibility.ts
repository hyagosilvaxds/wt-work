// Teste das funções de elegibilidade de certificados
// Este arquivo pode ser usado para testar as APIs localmente

import { 
  getCertificateEligibility,
  getCompletedClassesWithEligibility,
  getClientEligibleClasses 
} from '../lib/api/superadmin'

// Exemplo de como testar as novas APIs
async function testEligibilityAPIs() {
  try {
    console.log('🧪 Testando APIs de Elegibilidade de Certificados')
    
    // Teste 1: Verificar elegibilidade de uma turma específica
    console.log('\n1️⃣ Testando getCertificateEligibility...')
    try {
      const classId = 'test-class-id' // Substitua por um ID real
      const students = await getCertificateEligibility(classId)
      console.log('✅ Estudantes encontrados:', students.length)
      
      // Analisar dados retornados
      students.forEach(student => {
        console.log(`👤 ${student.studentName}:`)
        console.log(`   - Elegível: ${student.isEligible ? '✅' : '❌'}`)
        console.log(`   - Motivo: ${student.reason}`)
        if (student.practicalGrade !== null) {
          console.log(`   - Nota Prática: ${student.practicalGrade}`)
        }
        if (student.theoreticalGrade !== null) {
          console.log(`   - Nota Teórica: ${student.theoreticalGrade}`)
        }
        if (student.averageGrade !== null) {
          console.log(`   - Média: ${student.averageGrade}`)
        }
        console.log(`   - Presenças: ${student.attendedLessons}/${student.totalLessons}`)
        console.log(`   - Faltas: ${student.absences}`)
        console.log('')
      })
    } catch (error) {
      console.log('⚠️ API não disponível ou erro:', error.message)
    }
    
    // Teste 2: Listar todas as turmas concluídas
    console.log('\n2️⃣ Testando getCompletedClassesWithEligibility...')
    try {
      const classes = await getCompletedClassesWithEligibility()
      console.log('✅ Turmas concluídas encontradas:', classes.length)
      
      classes.forEach(cls => {
        const eligibleStudents = cls.students.filter(s => s.isEligible).length
        const totalStudents = cls.students.length
        console.log(`🏫 ${cls.trainingName}:`)
        console.log(`   - Elegíveis: ${eligibleStudents}/${totalStudents}`)
        console.log(`   - Período: ${cls.startDate} - ${cls.endDate}`)
        console.log(`   - Status: ${cls.status}`)
        if (cls.trainingDurationHours) {
          console.log(`   - Carga Horária: ${cls.trainingDurationHours}h`)
        }
        if (cls.certificateValidityDays) {
          console.log(`   - Validade: ${cls.certificateValidityDays} dias`)
        }
        console.log('')
      })
    } catch (error) {
      console.log('⚠️ API não disponível ou erro:', error.message)
    }
    
    // Teste 3: Turmas de um cliente específico
    console.log('\n3️⃣ Testando getClientEligibleClasses...')
    try {
      const clientId = 'test-client-id' // Substitua por um ID real
      const clientData = await getClientEligibleClasses(clientId)
      console.log('✅ Dados do cliente obtidos:')
      console.log(`👥 Cliente: ${clientData.clientName}`)
      console.log(`📊 Turmas: ${clientData.eligibleClasses}/${clientData.totalClasses} com alunos elegíveis`)
      
      clientData.classes.forEach(cls => {
        const eligibleStudents = cls.students.filter(s => s.isEligible).length
        console.log(`🏫 ${cls.trainingName}: ${eligibleStudents} alunos elegíveis`)
      })
    } catch (error) {
      console.log('⚠️ API não disponível ou erro:', error.message)
    }
    
  } catch (error) {
    console.error('❌ Erro geral nos testes:', error)
  }
}

// Função para testar casos específicos de notas
function testGradeValidation() {
  console.log('\n🧪 Testando validação de notas...')
  
  const testCases = [
    {
      name: 'João - Aprovado (ambas as notas)',
      practicalGrade: 8.5,
      theoreticalGrade: 7.0,
      averageGrade: 7.75,
      expected: 'elegível'
    },
    {
      name: 'Maria - Reprovado (nota teórica)',
      practicalGrade: 8.0,
      theoreticalGrade: 4.5,
      averageGrade: 6.25,
      expected: 'não elegível'
    },
    {
      name: 'Pedro - Apenas prática (aprovado)',
      practicalGrade: 7.5,
      theoreticalGrade: null,
      averageGrade: 7.5,
      expected: 'elegível'
    },
    {
      name: 'Ana - Sem notas',
      practicalGrade: null,
      theoreticalGrade: null,
      averageGrade: null,
      expected: 'elegível (sem avaliação)'
    }
  ]
  
  testCases.forEach(testCase => {
    const hasFailingGrade = (testCase.practicalGrade !== null && testCase.practicalGrade < 5.0) || 
                            (testCase.theoreticalGrade !== null && testCase.theoreticalGrade < 5.0)
    
    const isEligible = !hasFailingGrade
    
    console.log(`👤 ${testCase.name}:`)
    console.log(`   - Resultado: ${isEligible ? '✅ Elegível' : '❌ Não elegível'}`)
    console.log(`   - Esperado: ${testCase.expected}`)
    console.log(`   - Match: ${isEligible === testCase.expected.includes('elegível') ? '✅' : '❌'}`)
    console.log('')
  })
}

// Função para testar presença
function testAttendanceValidation() {
  console.log('\n🧪 Testando validação de presença...')
  
  const testCases = [
    {
      name: 'Carlos - Sem faltas',
      totalLessons: 10,
      attendedLessons: 10,
      absences: 0,
      expected: 'elegível'
    },
    {
      name: 'Paula - Com faltas',
      totalLessons: 10,
      attendedLessons: 8,
      absences: 2,
      expected: 'não elegível'
    },
    {
      name: 'Roberto - Sem registros',
      totalLessons: 0,
      attendedLessons: 0,
      absences: 0,
      expected: 'elegível (sem chamadas)'
    }
  ]
  
  testCases.forEach(testCase => {
    const hasAbsences = testCase.absences > 0
    const isEligible = !hasAbsences
    
    console.log(`👤 ${testCase.name}:`)
    console.log(`   - Resultado: ${isEligible ? '✅ Elegível' : '❌ Não elegível'}`)
    console.log(`   - Esperado: ${testCase.expected}`)
    console.log(`   - Presenças: ${testCase.attendedLessons}/${testCase.totalLessons}`)
    console.log(`   - Faltas: ${testCase.absences}`)
    console.log('')
  })
}

// Executar testes se este arquivo for rodado diretamente
if (typeof window !== 'undefined') {
  console.log('🚀 Iniciando testes de elegibilidade...')
  
  // Testar validações locais primeiro
  testGradeValidation()
  testAttendanceValidation()
  
  // Depois testar APIs (apenas se disponíveis)
  testEligibilityAPIs()
}

export {
  testEligibilityAPIs,
  testGradeValidation,
  testAttendanceValidation
}
