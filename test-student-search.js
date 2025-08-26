// Script para testar a busca de estudantes
// Execute este script no console do navegador na página da aplicação

async function testStudentSearch() {
  const testName = "Carlos"; // Nome para testar
  
  console.log("🔍 Testando busca de estudantes...");
  
  try {
    // Teste 1: Busca na página de alunos (mesmo endpoint usado)
    console.log("\n📋 Teste 1: Busca na página de alunos");
    const response1 = await fetch('/api/superadmin/students?page=1&limit=10&search=' + encodeURIComponent(testName), {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data1 = await response1.json();
    console.log("Resposta da API (página alunos):", data1);
    console.log("Total de alunos encontrados:", data1.students?.length || 0);
    
    // Teste 2: Busca no modal de turmas (mesmo endpoint, mas limit 100)
    console.log("\n🏫 Teste 2: Busca no modal de turmas");
    const response2 = await fetch('/api/superadmin/students?page=1&limit=100&search=' + encodeURIComponent(testName), {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data2 = await response2.json();
    console.log("Resposta da API (modal turmas):", data2);
    console.log("Total de alunos encontrados:", data2.students?.length || 0);
    
    // Comparação
    console.log("\n🔄 Comparação:");
    console.log("Página alunos encontrou:", data1.students?.length || 0, "alunos");
    console.log("Modal turmas encontrou:", data2.students?.length || 0, "alunos");
    
    if (data1.students && data2.students) {
      const names1 = data1.students.map(s => s.name).sort();
      const names2 = data2.students.map(s => s.name).sort();
      
      console.log("Nomes na página alunos:", names1);
      console.log("Nomes no modal turmas:", names2);
      
      const same = JSON.stringify(names1) === JSON.stringify(names2);
      console.log("Resultados são iguais?", same);
    }
    
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
}

// Execute a função
testStudentSearch();
