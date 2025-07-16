// Teste para verificar se o endpoint de cliente está funcionando
console.log('Teste para verificar endpoint de cliente');

// Simular uma requisição para testar o endpoint
const testClientEndpoint = async () => {
    try {
        const response = await fetch('/api/client/my-classes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken') || document.cookie.match(/jwtToken=([^;]+)/)?.[1]}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Status:', response.status);
        console.log('Response:', await response.json());
    } catch (error) {
        console.error('Erro:', error);
    }
};

// Teste alternativo com superadmin
const testSuperadminEndpoint = async () => {
    try {
        const response = await fetch('/api/superadmin/my-classes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken') || document.cookie.match(/jwtToken=([^;]+)/)?.[1]}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Status:', response.status);
        console.log('Response:', await response.json());
    } catch (error) {
        console.error('Erro:', error);
    }
};

// Executar testes
testClientEndpoint();
testSuperadminEndpoint();
