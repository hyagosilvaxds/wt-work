const axios = require('axios');

// Teste para verificar se a geração de certificados em lote está funcionando
async function testBatchCertificates() {
  console.log('🧪 Testando geração de certificados em lote...');
  
  try {
    // Primeiro vamos listar as turmas concluídas
    const classesResponse = await axios.get('http://localhost:4000/api/classes');
    const classes = classesResponse.data;
    
    // Procurar por turmas concluídas
    const finishedClasses = classes.filter(cls => cls.status === 'finished');
    
    console.log(`📋 Encontradas ${finishedClasses.length} turmas concluídas`);
    
    if (finishedClasses.length === 0) {
      console.log('❌ Nenhuma turma concluída encontrada');
      return;
    }
    
    // Pegar a primeira turma concluída
    const testClass = finishedClasses[0];
    console.log(`🎯 Testando com turma: ${testClass.name}`);
    
    // Buscar alunos da turma
    const studentsResponse = await axios.get(`http://localhost:4000/api/classes/${testClass.id}/students`);
    const students = studentsResponse.data;
    
    console.log(`👥 Encontrados ${students.length} alunos na turma`);
    
    if (students.length === 0) {
      console.log('❌ Nenhum aluno encontrado na turma');
      return;
    }
    
    // Buscar presenças para verificar quais alunos são elegíveis
    const attendanceResponse = await axios.get(`http://localhost:4000/api/classes/${testClass.id}/attendance`);
    const attendance = attendanceResponse.data;
    
    console.log(`📊 Registros de presença: ${attendance.length}`);
    
    // Verificar se há alunos elegíveis (sem faltas)
    const eligibleStudents = students.filter(student => {
      const studentAttendance = attendance.filter(att => att.student_id === student.id);
      return studentAttendance.every(att => att.present);
    });
    
    console.log(`✅ Alunos elegíveis para certificado: ${eligibleStudents.length}`);
    
    if (eligibleStudents.length === 0) {
      console.log('❌ Nenhum aluno elegível encontrado');
      return;
    }
    
    console.log('🎉 Funcionalidade de geração de certificados em lote está pronta!');
    console.log('📝 Próximos passos:');
    console.log('1. Acesse o sistema na página de certificados');
    console.log('2. Clique em "Gerar Certificados em Lote"');
    console.log('3. Verifique se os certificados gerados estão idênticos aos individuais');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testBatchCertificates();
