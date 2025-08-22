// Teste simples para verificar a remoção de alunos
const axios = require('axios');

const testRemoveStudents = async () => {
  try {
    console.log('Testando remoção de alunos...');
    
    const response = await axios.delete('api.olimpustech.com/superadmin/classes/cmd4g775x0001vbd0u2hzlcue/students', {
      data: {
        studentIds: ['cmcxv2jz3006mvbxl183metkj']
      },
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtY3h2Mmp5bTAwNmd2YnhscHJncnRodnciLCJyb2xlSWQiOiJjbWN4djJqdmUwMDFkdmJ4bG5nZDBqaXVtIiwiaWF0IjoxNzUyNjExOTIxLCJleHAiOjE3NTMyMTY3MjF9.1Vzm1JbcepOm9087dd03GmYCnEhEhDpCDlV0VnlV1zc',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Sucesso!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
  }
};

testRemoveStudents();
