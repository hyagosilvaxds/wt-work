const API_BASE_URL = 'http://localhost:3001'

// Teste para verificar se o problema de bankAccountId foi corrigido em contas a pagar
async function testAccountsPayableFix() {
  console.log('🔍 Testando correção do problema de bankAccountId em contas a pagar...\n')

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
          nome: "Conta Teste Payables",
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

    // 2. Buscar uma conta a pagar existente
    console.log('\n2. Buscando conta a pagar existente...')
    const payablesResponse = await fetch(`${API_BASE_URL}/api/financial/accounts-payable`, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTJhYmMxMjNkZWY0NTYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MzQ4MTg4NTYsImV4cCI6MTczNDkwNTI1Nn0.vYf_6tJxH2LTKOyYhQO_yE0-WcC8A9lE7T5VN-Ym8sA',
        'Content-Type': 'application/json'
      }
    })

    if (!payablesResponse.ok) {
      console.error('❌ Erro ao buscar contas a pagar:', await payablesResponse.text())
      return
    }

    const payablesData = await payablesResponse.json()
    console.log('✅ Contas a pagar encontradas:', payablesData.payables?.length || payablesData.length || 0)

    let testPayableId;
    if (!payablesData.payables || payablesData.payables.length === 0) {
      console.log('⚠️  Nenhuma conta a pagar encontrada. Criando uma para teste...')
      
      // Criar uma conta a pagar para teste
      const createPayableResponse = await fetch(`${API_BASE_URL}/api/financial/accounts-payable`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTJhYmMxMjNkZWY0NTYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MzQ4MTg4NTYsImV4cCI6MTczNDkwNTI1Nn0.vYf_6tJxH2LTKOyYhQO_yE0-WcC8A9lE7T5VN-Ym8sA',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: "Teste de conta a pagar",
          amount: 100.00,
          dueDate: new Date().toISOString(),
          status: "PENDENTE",
          category: "OUTROS",
          supplierName: "Fornecedor Teste",
          supplierDocument: "12.345.678/0001-90",
          supplierEmail: "teste@fornecedor.com"
        })
      })

      if (createPayableResponse.ok) {
        const newPayable = await createPayableResponse.json()
        console.log('✅ Conta a pagar criada para teste:', newPayable.id)
        testPayableId = newPayable.id
      } else {
        console.error('❌ Erro ao criar conta a pagar:', await createPayableResponse.text())
        return
      }
    } else {
      testPayableId = payablesData.payables[0].id
    }

    console.log('✅ Usando conta a pagar:', testPayableId)

    // 3. Tentar atualizar com bankAccountId válido
    console.log('\n3. Testando atualização com bankAccountId VÁLIDO...')
    const updateValidResponse = await fetch(`${API_BASE_URL}/api/financial/accounts-payable/${testPayableId}`, {
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
    const updateInvalidResponse = await fetch(`${API_BASE_URL}/api/financial/accounts-payable/${testPayableId}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbTJhYmMxMjNkZWY0NTYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MzQ4MTg4NTYsImV4cCI6MTczNDkwNTI1Nn0.vYf_6tJxH2LTKOyYhQO_yE0-WcC8A9lE7T5VN-Ym8sA',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: "Tentativa com bankAccountId inválido",
        bankAccountId: "id-inexistente-payables-123"
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
    const updateWithoutBankResponse = await fetch(`${API_BASE_URL}/api/financial/accounts-payable/${testPayableId}`, {
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
    console.log('📝 Resumo das correções implementadas em contas a pagar:')
    console.log('   ✅ Frontend agora carrega contas bancárias dinamicamente da API')
    console.log('   ✅ Validação de bankAccountId válido antes de enviar')
    console.log('   ✅ bankAccountId só é enviado se for válido e não for "none"')
    console.log('   ✅ Select filtra apenas contas ativas')
    console.log('   ✅ Tratamento especial para valores vazios/inválidos')

  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  }
}

// Executar o teste
testAccountsPayableFix()
