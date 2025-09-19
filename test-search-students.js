// Teste para verificar a busca de estudantes
const axios = require('axios');

const makeRequest = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `https://api.olimpustech.com${endpoint}?${queryString}`;
    
    console.log(`📡 Fazendo requisição para: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtY3h2Mmp5bTAwNmd2YnhscHJncnRodnciLCJyb2xlSWQiOiJjbWN4djJqdmUwMDFkdmJ4bG5nZDBqaXVtIiwiaWF0IjoxNzUyNjExOTIxLCJleHAiOjE3NTMyMTY3MjF9.1Vzm1JbcepOm9087dd03GmYCnEhEhDpCDlV0VnlV1zc',
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`❌ Erro na requisição:`, error.response?.data || error.message);
    throw error;
  }
};

// Teste 1: Buscar todos os estudantes (sem filtro)
async function testGetAllStudents() {
  console.log('\n=== Teste 1: Buscar Todos os Estudantes ===');
  
  try {
    const result = await makeRequest('/superadmin/students', {
      page: 1,
      limit: 20
    });
    
    console.log(`✅ Encontrados ${result.students?.length || 0} estudantes`);
    console.log(`📊 Total: ${result.pagination?.total || 0}`);
    
    if (result.students && result.students.length > 0) {
      console.log('\n📋 Primeiros estudantes:');
      result.students.slice(0, 5).forEach((student, index) => {
        console.log(`  ${index + 1}. ${student.name} (${student.cpf})`);
      });
    }
    
    return result;
  } catch (error) {
    console.log('❌ Erro ao buscar estudantes:', error.message);
  }
}

// Teste 2: Buscar estudantes com letra 'A'
async function testSearchStudentsWithA() {
  console.log('\n=== Teste 2: Buscar Estudantes com "A" ===');
  
  try {
    const result = await makeRequest('/superadmin/students', {
      page: 1,
      limit: 20,
      search: 'A'
    });
    
    console.log(`✅ Encontrados ${result.students?.length || 0} estudantes com "A"`);
    
    if (result.students && result.students.length > 0) {
      console.log('\n📋 Estudantes encontrados:');
      result.students.forEach((student, index) => {
        console.log(`  ${index + 1}. ${student.name} (${student.cpf})`);
      });
    }
    
    return result;
  } catch (error) {
    console.log('❌ Erro ao buscar estudantes com A:', error.message);
  }
}

// Teste 3: Buscar estudantes com letra 'C'
async function testSearchStudentsWithC() {
  console.log('\n=== Teste 3: Buscar Estudantes com "C" ===');
  
  try {
    const result = await makeRequest('/superadmin/students', {
      page: 1,
      limit: 20,
      search: 'C'
    });
    
    console.log(`✅ Encontrados ${result.students?.length || 0} estudantes com "C"`);
    
    if (result.students && result.students.length > 0) {
      console.log('\n📋 Estudantes encontrados:');
      result.students.forEach((student, index) => {
        console.log(`  ${index + 1}. ${student.name} (${student.cpf})`);
      });
    }
    
    return result;
  } catch (error) {
    console.log('❌ Erro ao buscar estudantes com C:', error.message);
  }
}

// Teste 4: Buscar estudantes com letra 'D' e além
async function testSearchStudentsWithD() {
  console.log('\n=== Teste 4: Buscar Estudantes com "D" ===');
  
  try {
    const result = await makeRequest('/superadmin/students', {
      page: 1,
      limit: 20,
      search: 'D'
    });
    
    console.log(`✅ Encontrados ${result.students?.length || 0} estudantes com "D"`);
    
    if (result.students && result.students.length > 0) {
      console.log('\n📋 Estudantes encontrados:');
      result.students.forEach((student, index) => {
        console.log(`  ${index + 1}. ${student.name} (${student.cpf})`);
      });
    }
    
    return result;
  } catch (error) {
    console.log('❌ Erro ao buscar estudantes com D:', error.message);
  }
}

// Teste 5: Buscar estudantes com termo específico
async function testSearchStudentsWithTerm(term) {
  console.log(`\n=== Teste 5: Buscar Estudantes com "${term}" ===`);
  
  try {
    const result = await makeRequest('/superadmin/students', {
      page: 1,
      limit: 20,
      search: term
    });
    
    console.log(`✅ Encontrados ${result.students?.length || 0} estudantes com "${term}"`);
    
    if (result.students && result.students.length > 0) {
      console.log('\n📋 Estudantes encontrados:');
      result.students.forEach((student, index) => {
        console.log(`  ${index + 1}. ${student.name} (${student.cpf})`);
      });
    }
    
    return result;
  } catch (error) {
    console.log(`❌ Erro ao buscar estudantes com "${term}":`, error.message);
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🔍 Iniciando testes de busca de estudantes...');
  
  await testGetAllStudents();
  await testSearchStudentsWithA();
  await testSearchStudentsWithC();
  await testSearchStudentsWithD();
  await testSearchStudentsWithTerm('Carlos');
  await testSearchStudentsWithTerm('silva');
  await testSearchStudentsWithTerm('123');
  
  console.log('\n✨ Testes de busca concluídos!');
}

// Executar se o arquivo for chamado diretamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testGetAllStudents,
  testSearchStudentsWithA,
  testSearchStudentsWithC,
  testSearchStudentsWithD,
  testSearchStudentsWithTerm,
  runAllTests
};
