// Teste simples para verificar se a API de contas bancárias está funcionando
const API_BASE_URL = 'http://localhost:3001'

async function testBankAccountsAPI() {
  console.log('🔍 Testando API de contas bancárias...')
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/financial/bank-accounts`, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTJhYmMxMjNkZWY0NTYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MzQ4MTg4NTYsImV4cCI6MTczNDkwNTI1Nn0.vYf_6tJxH2LTKOyYhQO_yE0-WcC8A9lE7T5VN-Ym8sA',
        'Content-Type': 'application/json'
      }
    })

    console.log('📡 Status da resposta:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Dados retornados:', data)
      console.log('🏦 Estrutura esperada:', {
        accounts: data.accounts || 'NÃO ENCONTRADO',
        length: data.accounts?.length || 0
      })
    } else {
      console.error('❌ Erro na API:', await response.text())
    }
  } catch (error) {
    console.error('❌ Erro de rede:', error)
  }
}

testBankAccountsAPI()
