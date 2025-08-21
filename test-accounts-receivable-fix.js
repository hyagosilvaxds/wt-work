const API_BASE_URL = 'http://localhost:3001'

// Teste para verificar se o problema de bankAccountId foi corrigido
async function testAccountsReceivableFix() {
  console.log('🔍 Testando correção do problema de bankAccountId em contas a receber...\n')

  try {
    // 1. Primeiro, vamos buscar contas bancárias válidas
    console.log('1. Buscando contas bancárias válidas...')
    const bankAccountsResponse = await fetch(`${API_BASE_URL}/api/financial/bank-accounts`, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTJhYmMxMjNkZWY0NTYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MzQ4MTg4NTYsImV4cCI6MTczNDkwNTI1Nn0.vYf_6tJxH2LTKOyYhQO_yE0-WcC8A9lE7T5VN-Ym8sA',
        'Content-Type': 'application/json'
      }
    })

    if (!bankAccountsResponse.ok) {
      console.error('❌ Erro ao buscar contas bancárias:', await bankAccountsResponse.text())
      return
    }

    const bankAccountsData = await bankAccountsResponse.json()
    console.log('✅ Contas bancárias encontradas:', bankAccountsData.accounts?.length || 0)

    if (!bankAccountsData.accounts || bankAccountsData.accounts.length === 0) {
      console.log('⚠️  Nenhuma conta bancária encontrada. Criando uma para teste...')
      
      // Criar uma conta bancária para teste
      const createBankAccountResponse = await fetch(`${API_BASE_URL}/api/financial/bank-accounts`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTJhYmMxMjNkZWY0NTYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MzQ4MTg4NTYsImV4cCI6MTczNDkwNTI1Nn0.vYf_6tJxH2LTKOyYhQO_yE0-WcC8A9lE7T5VN-Ym8sA',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: "Conta Teste",
          banco: "Banco Teste",
          codigoBanco: "123",
          agencia: "1234",
          numero: "56789",
          digitoVerificador: "0",
          tipoConta: "CORRENTE",
          saldo: 1000,
          isActive: true,
          isMain: false
        })
      })

      if (createBankAccountResponse.ok) {
        const newBankAccount = await createBankAccountResponse.json()
        console.log('✅ Conta bancária criada para teste:', newBankAccount.id)
        bankAccountsData.accounts = [newBankAccount]
      } else {
        console.error('❌ Erro ao criar conta bancária:', await createBankAccountResponse.text())
        return
      }
    }

    const validBankAccountId = bankAccountsData.accounts[0].id
    console.log('✅ Usando conta bancária válida:', validBankAccountId)

    // 2. Buscar uma conta a receber existente
    console.log('\n2. Buscando conta a receber existente...')
    const receivablesResponse = await fetch(`${API_BASE_URL}/api/financial/accounts-receivable`, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTJhYmMxMjNkZWY0NTYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MzQ4MTg4NTYsImV4cCI6MTczNDkwNTI1Nn0.vYf_6tJxH2LTKOyYhQO_yE0-WcC8A9lE7T5VN-Ym8sA',
        'Content-Type': 'application/json'
      }
    })

    if (!receivablesResponse.ok) {
      console.error('❌ Erro ao buscar contas a receber:', await receivablesResponse.text())
      return
    }

    const receivablesData = await receivablesResponse.json()
    console.log('✅ Contas a receber encontradas:', receivablesData.receivables?.length || 0)

    if (!receivablesData.receivables || receivablesData.receivables.length === 0) {
      console.log('⚠️  Nenhuma conta a receber encontrada. Criando uma para teste...')
      
      // Criar uma conta a receber para teste
      const createReceivableResponse = await fetch(`${API_BASE_URL}/api/financial/accounts-receivable`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTJhYmMxMjNkZWY0NTYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MzQ4MTg4NTYsImV4cCI6MTczNDkwNTI1Nn0.vYf_6tJxH2LTKOyYhQO_yE0-WcC8A9lE7T5VN-Ym8sA',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: "Teste de conta a receber",
          amount: 100.00,
          dueDate: new Date().toISOString(),
          status: "PENDENTE",
          category: "OUTROS",
          customerName: "Cliente Teste",
          customerDocument: "123.456.789-00",
          customerEmail: "teste@exemplo.com"
        })
      })

      if (createReceivableResponse.ok) {
        const newReceivable = await createReceivableResponse.json()
        console.log('✅ Conta a receber criada para teste:', newReceivable.id)
        receivablesData.receivables = [newReceivable]
      } else {
        console.error('❌ Erro ao criar conta a receber:', await createReceivableResponse.text())
        return
      }
    }

    const testReceivableId = receivablesData.receivables[0].id
    console.log('✅ Usando conta a receber:', testReceivableId)

    // 3. Tentar atualizar com bankAccountId válido
    console.log('\n3. Testando atualização com bankAccountId VÁLIDO...')
    const updateValidResponse = await fetch(`${API_BASE_URL}/api/financial/accounts-receivable/${testReceivableId}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTJhYmMxMjNkZWY0NTYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MzQ4MTg4NTYsImV4cCI6MTczNDkwNTI1Nn0.vYf_6tJxH2LTKOyYhQO_yE0-WcC8A9lE7T5VN-Ym8sA',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: "Conta atualizada com bankAccountId válido",
        bankAccountId: validBankAccountId
      })
    })

    if (updateValidResponse.ok) {
      console.log('✅ Sucesso! Atualização com bankAccountId válido funcionou')
    } else {
      console.error('❌ Erro na atualização com bankAccountId válido:', await updateValidResponse.text())
    }

    // 4. Tentar atualizar com bankAccountId inválido (para verificar se ainda falha)
    console.log('\n4. Testando atualização com bankAccountId INVÁLIDO...')
    const updateInvalidResponse = await fetch(`${API_BASE_URL}/api/financial/accounts-receivable/${testReceivableId}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTJhYmMxMjNkZWY0NTYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MzQ4MTg4NTYsImV4cCI6MTczNDkwNTI1Nn0.vYf_6tJxH2LTKOyYhQO_yE0-WcC8A9lE7T5VN-Ym8sA',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: "Tentativa com bankAccountId inválido",
        bankAccountId: "id-inexistente-123"
      })
    })

    if (!updateInvalidResponse.ok) {
      console.log('✅ Correto! Atualização com bankAccountId inválido foi rejeitada')
      console.log('📋 Erro retornado:', await updateInvalidResponse.text())
    } else {
      console.error('❌ Problema! Atualização com bankAccountId inválido não deveria ter funcionado')
    }

    // 5. Testar atualização sem bankAccountId (deve funcionar)
    console.log('\n5. Testando atualização SEM bankAccountId...')
    const updateWithoutBankResponse = await fetch(`${API_BASE_URL}/api/financial/accounts-receivable/${testReceivableId}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTJhYmMxMjNkZWY0NTYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MzQ4MTg4NTYsImV4cCI6MTczNDkwNTI1Nn0.vYf_6tJxH2LTKOyYhQO_yE0-WcC8A9lE7T5VN-Ym8sA',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: "Atualização sem bankAccountId"
      })
    })

    if (updateWithoutBankResponse.ok) {
      console.log('✅ Sucesso! Atualização sem bankAccountId funcionou')
    } else {
      console.error('❌ Erro na atualização sem bankAccountId:', await updateWithoutBankResponse.text())
    }

    console.log('\n🎉 Teste concluído!')
    console.log('📝 Resumo das correções implementadas:')
    console.log('   ✅ Frontend agora carrega contas bancárias dinamicamente da API')
    console.log('   ✅ Validação de bankAccountId válido antes de enviar')
    console.log('   ✅ bankAccountId só é enviado se for válido e não vazio')
    console.log('   ✅ Select hardcoded foi substituído por dados dinâmicos')

  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  }
}

// Executar o teste
testAccountsReceivableFix()
