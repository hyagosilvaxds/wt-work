// Teste para verificar os dados retornados pelas APIs de certificados

// Função para converter data brasileira (DD/MM/YYYY) para Date válido
const parseBrazilianDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return null
  
  // Se já está em formato ISO, usar diretamente
  if (dateString.includes('-')) {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date
  }
  
  // Converter formato brasileiro DD/MM/YYYY
  const parts = dateString.split('/')
  if (parts.length !== 3) return null
  
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1 // Mês é 0-indexed
  const year = parseInt(parts[2], 10)
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null
  
  const date = new Date(year, month, day)
  return isNaN(date.getTime()) ? null : date
}

// Função para calcular status de expiração
const calculateExpirationStatus = (classItem) => {
  if (!classItem.endDate) {
    return {
      daysUntilExpiration: 0,
      isExpired: false,
      isExpiringSoon: false,
      expirationDate: null,
      hasValidData: false
    }
  }

  const today = new Date()
  const endDate = parseBrazilianDate(classItem.endDate)
  
  if (!endDate) {
    return {
      daysUntilExpiration: 0,
      isExpired: false,
      isExpiringSoon: false,
      expirationDate: null,
      hasValidData: false
    }
  }

  let validityDays = classItem.certificateValidityDays || 365
  
  if (isNaN(Number(validityDays))) {
    validityDays = 365
  }
  
  const expirationDate = new Date(endDate)
  expirationDate.setDate(expirationDate.getDate() + Number(validityDays))
  
  const diffTime = expirationDate.getTime() - today.getTime()
  const daysUntilExpiration = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return {
    daysUntilExpiration,
    isExpired: daysUntilExpiration <= 0,
    isExpiringSoon: daysUntilExpiration > 0 && daysUntilExpiration <= 30,
    expirationDate,
    hasValidData: true
  }
}

// Teste principal
async function testCertificatesData() {
  try {
    console.log('🚀 Testando dados de certificados...\n')
    
    // Testar API de turmas concluídas
    const response = await fetch('https://api.olimpustech.com.br/certificado/completed-classes')
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log(`📊 Total de turmas encontradas: ${data.length}\n`)
    
    if (data.length > 0) {
      const firstClass = data[0]
      console.log('🔍 Dados da primeira turma:')
      console.log('- ID:', firstClass.classId)
      console.log('- Nome:', firstClass.trainingName)
      console.log('- Data Início (original):', firstClass.startDate)
      console.log('- Data Fim (original):', firstClass.endDate)
      console.log('- Validade (dias):', firstClass.certificateValidityDays)
      
      console.log('\n📅 Teste de conversão de datas:')
      const startDate = parseBrazilianDate(firstClass.startDate)
      const endDate = parseBrazilianDate(firstClass.endDate)
      
      console.log('- Data Início (convertida):', startDate?.toLocaleDateString('pt-BR'))
      console.log('- Data Fim (convertida):', endDate?.toLocaleDateString('pt-BR'))
      
      console.log('\n⏰ Teste de cálculo de validade:')
      const expirationStatus = calculateExpirationStatus(firstClass)
      console.log('- Dados válidos:', expirationStatus.hasValidData)
      
      if (expirationStatus.hasValidData) {
        console.log('- Dias até expiração:', expirationStatus.daysUntilExpiration)
        console.log('- Está vencido:', expirationStatus.isExpired)
        console.log('- Próximo do vencimento:', expirationStatus.isExpiringSoon)
        console.log('- Data de expiração:', expirationStatus.expirationDate?.toLocaleDateString('pt-BR'))
        
        if (expirationStatus.isExpired) {
          console.log('🔴 RESULTADO: Certificado Vencido')
        } else if (expirationStatus.isExpiringSoon) {
          console.log(`⚠️ RESULTADO: Expira em ${expirationStatus.daysUntilExpiration} dias`)
        } else {
          console.log(`✅ RESULTADO: Válido por ${expirationStatus.daysUntilExpiration} dias`)
        }
      } else {
        console.log('❌ RESULTADO: Dados inválidos')
      }
      
      console.log('\n👥 Estudantes da turma:')
      firstClass.students.forEach((student, index) => {
        console.log(`${index + 1}. ${student.studentName} - Elegível: ${student.isEligible ? '✅' : '❌'} (${student.reason})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
  }
}

// Executar teste
testCertificatesData()
