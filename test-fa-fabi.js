// Teste específico para o problema "fa" vs "fabi"
// Execute no console do navegador

async function testSpecificSearch() {
  console.log("🧪 Teste específico: 'fa' vs 'fabi'");
  
  // Função para fazer a chamada da API
  const callAPI = async (searchTerm) => {
    try {
      const url = `http://localhost:4000/superadmin/students?page=1&limit=100&search=${encodeURIComponent(searchTerm)}`;
      console.log(`📡 Chamando: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${document.cookie.match(/jwtToken=([^;]+)/)?.[1] || ''}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`❌ Erro na busca por "${searchTerm}":`, error);
      return null;
    }
  };
  
  // Teste 1: Busca por "fa"
  console.log("\n🔍 Teste 1: Buscando por 'fa'");
  const result1 = await callAPI("fa");
  if (result1) {
    console.log(`✅ Encontrados: ${result1.students?.length || 0} alunos`);
    if (result1.students?.length > 0) {
      console.log("📝 Nomes encontrados:", result1.students.map(s => s.name));
      const fabioStudents = result1.students.filter(s => s.name.toLowerCase().includes('fabio'));
      console.log("👤 Alunos com 'fabio' no nome:", fabioStudents.map(s => s.name));
    }
  }
  
  // Teste 2: Busca por "fabi"
  console.log("\n🔍 Teste 2: Buscando por 'fabi'");
  const result2 = await callAPI("fabi");
  if (result2) {
    console.log(`✅ Encontrados: ${result2.students?.length || 0} alunos`);
    if (result2.students?.length > 0) {
      console.log("📝 Nomes encontrados:", result2.students.map(s => s.name));
    } else {
      console.log("❌ Nenhum aluno encontrado!");
    }
  }
  
  // Teste 3: Busca por "fabio"
  console.log("\n🔍 Teste 3: Buscando por 'fabio'");
  const result3 = await callAPI("fabio");
  if (result3) {
    console.log(`✅ Encontrados: ${result3.students?.length || 0} alunos`);
    if (result3.students?.length > 0) {
      console.log("📝 Nomes encontrados:", result3.students.map(s => s.name));
    }
  }
  
  console.log("\n📊 Resumo:");
  console.log(`'fa' encontrou: ${result1?.students?.length || 0} alunos`);
  console.log(`'fabi' encontrou: ${result2?.students?.length || 0} alunos`);
  console.log(`'fabio' encontrou: ${result3?.students?.length || 0} alunos`);
}

// Execute o teste
testSpecificSearch();
