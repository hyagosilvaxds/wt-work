// Script para debug dos dados do usuário

// Executar no console do navegador para testar
function debugUserData() {
    // Verificar cookies
    console.log('=== COOKIES ===');
    console.log('jwtToken:', document.cookie.match(/jwtToken=([^;]+)/)?.[1]?.substring(0, 20) + '...' || 'não encontrado');
    console.log('user:', document.cookie.match(/user=([^;]+)/)?.[1] || 'não encontrado');
    
    // Verificar token decodificado
    const token = document.cookie.match(/jwtToken=([^;]+)/)?.[1];
    if (token) {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            console.log('=== TOKEN DECODIFICADO ===');
            console.log('Token completo:', decoded);
            console.log('Role no token:', decoded.role);
            console.log('RoleId no token:', decoded.roleId);
            console.log('RoleName no token:', decoded.roleName);
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
        }
    }
    
    // Verificar dados do localStorage (se houver)
    console.log('=== LOCALSTORAGE ===');
    console.log('Chaves:', Object.keys(localStorage));
    
    // Fazer requisição de teste para /auth/me
    fetch('/api/auth/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
    .then(data => {
        console.log('=== DADOS DA API /auth/me ===');
        console.log('Dados completos:', data);
        console.log('Role nos dados:', data.role);
    }).catch(error => {
        console.error('Erro na API /auth/me:', error);
    });
}

// Executar automaticamente
debugUserData();
