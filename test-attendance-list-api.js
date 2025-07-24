// Arquivo de teste para API de Lista de Presença
// Execute este arquivo com: node test-attendance-list-api.js

const lessonId = 'lesson-1' // Substitua por um ID válido de aula

console.log('🧪 Testando API de Lista de Presença\n')

// Teste 1: Gerar lista com alunos
async function testAttendanceListWithStudents() {
  console.log('1️⃣ Testando geração de lista com alunos...')
  
  try {
    const response = await fetch('https://olimpustech.com/certificado/attendance-list/with-students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lessonId })
    })
    
    if (response.ok) {
      console.log('✅ Lista com alunos gerada com sucesso!')
      console.log(`📄 Content-Type: ${response.headers.get('content-type')}`)
      console.log(`📦 Content-Length: ${response.headers.get('content-length')} bytes`)
    } else {
      const errorData = await response.json()
      console.log('❌ Erro ao gerar lista com alunos:', errorData.message)
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message)
  }
  
  console.log('')
}

// Teste 2: Gerar lista vazia
async function testAttendanceListEmpty() {
  console.log('2️⃣ Testando geração de lista vazia...')
  
  try {
    const response = await fetch('https://olimpustech.com/certificado/attendance-list/empty-fields', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lessonId })
    })
    
    if (response.ok) {
      console.log('✅ Lista vazia gerada com sucesso!')
      console.log(`📄 Content-Type: ${response.headers.get('content-type')}`)
      console.log(`📦 Content-Length: ${response.headers.get('content-length')} bytes`)
    } else {
      const errorData = await response.json()
      console.log('❌ Erro ao gerar lista vazia:', errorData.message)
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message)
  }
  
  console.log('')
}

// Teste 3: Preview com alunos
async function testPreviewWithStudents() {
  console.log('3️⃣ Testando preview com alunos...')
  
  try {
    const response = await fetch(`https://olimpustech.com/certificado/attendance-list/${lessonId}/preview/with-students`)
    
    if (response.ok) {
      console.log('✅ Preview com alunos disponível!')
      console.log(`📄 Content-Type: ${response.headers.get('content-type')}`)
      console.log(`🔗 URL: https://olimpustech.com/certificado/attendance-list/${lessonId}/preview/with-students`)
    } else {
      const errorData = await response.json()
      console.log('❌ Erro no preview com alunos:', errorData.message)
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message)
  }
  
  console.log('')
}

// Teste 4: Preview vazia
async function testPreviewEmpty() {
  console.log('4️⃣ Testando preview vazia...')
  
  try {
    const response = await fetch(`https://olimpustech.com/certificado/attendance-list/${lessonId}/preview/empty-fields`)
    
    if (response.ok) {
      console.log('✅ Preview vazia disponível!')
      console.log(`📄 Content-Type: ${response.headers.get('content-type')}`)
      console.log(`🔗 URL: https://olimpustech.com/certificado/attendance-list/${lessonId}/preview/empty-fields`)
    } else {
      const errorData = await response.json()
      console.log('❌ Erro no preview vazia:', errorData.message)
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message)
  }
  
  console.log('')
}

// Teste 5: Validação de parâmetros inválidos
async function testInvalidParameters() {
  console.log('5️⃣ Testando validação de parâmetros inválidos...')
  
  try {
    // Teste com lessonId inválido
    const response = await fetch('https://olimpustech.com/certificado/attendance-list/with-students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lessonId: 'invalid-lesson-id' })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.log('✅ Validação funcionando - erro esperado:', errorData.message)
    } else {
      console.log('⚠️ Validação pode não estar funcionando corretamente')
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message)
  }
  
  console.log('')
}

// Função para simular download via JavaScript (para testes no navegador)
function createBrowserTestScript() {
  const script = `
// Cole este código no console do navegador para testar downloads

// Teste de download com alunos
async function downloadWithStudents(lessonId) {
  try {
    const response = await fetch('/certificado/attendance-list/with-students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId })
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`lista-presenca-alunos-\${lessonId}.pdf\`;
      a.click();
      URL.revokeObjectURL(url);
      console.log('✅ Download iniciado!');
    } else {
      console.error('❌ Erro:', await response.json());
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// Teste de download vazia
async function downloadEmpty(lessonId) {
  try {
    const response = await fetch('/certificado/attendance-list/empty-fields', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId })
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`lista-presenca-vazia-\${lessonId}.pdf\`;
      a.click();
      URL.revokeObjectURL(url);
      console.log('✅ Download iniciado!');
    } else {
      console.error('❌ Erro:', await response.json());
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// Teste de preview
function openPreview(lessonId, type) {
  window.open(\`/certificado/attendance-list/\${lessonId}/preview/\${type}\`, '_blank');
}

// Exemplos de uso:
// downloadWithStudents('${lessonId}');
// downloadEmpty('${lessonId}');
// openPreview('${lessonId}', 'with-students');
// openPreview('${lessonId}', 'empty-fields');
`

  console.log('🌐 Script para teste no navegador:')
  console.log('=' .repeat(50))
  console.log(script)
  console.log('=' .repeat(50))
}

// Executar todos os testes
async function runAllTests() {
  console.log(`📚 Testando com lessonId: ${lessonId}`)
  console.log('=' .repeat(50))
  
  await testAttendanceListWithStudents()
  await testAttendanceListEmpty()
  await testPreviewWithStudents()
  await testPreviewEmpty()
  await testInvalidParameters()
  
  console.log('🏁 Testes concluídos!')
  console.log('')
  
  createBrowserTestScript()
}

// Executar apenas se este arquivo for chamado diretamente
if (typeof window === 'undefined') {
  runAllTests()
}

// Exportar funções para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testAttendanceListWithStudents,
    testAttendanceListEmpty,
    testPreviewWithStudents,
    testPreviewEmpty,
    testInvalidParameters,
    runAllTests
  }
}
