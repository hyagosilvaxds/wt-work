import api from './client';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";

// Função para login
export async function login({ email, password }: { email: string; password: string }) {
    try {
        const response = await api.post<{ accessToken: string; user: any }>('/auth/signin', { email, password });

        // Log da resposta completa do servidor para depuração
        console.log("Resposta do servidor:", response);

        const { accessToken, user } = response.data;

        if (!accessToken || typeof accessToken !== 'string') {
            console.error("Token inválido ou ausente:", accessToken);
            throw new Error("Token inválido ou ausente");
        }

        // Armazena o token JWT no cookie
        Cookies.set("jwtToken", accessToken, { expires: 7 });
        
        // Armazena dados do usuário no cookie
        if (user) {
            const userDataToStore = typeof user === 'string' ? user : JSON.stringify(user);
            Cookies.set("user", userDataToStore, { expires: 7 });
        }

        // Decodifica o token para extrair dados adicionais
        const decodedToken = jwtDecode<{ roleId: string; id: string; [key: string]: any }>(accessToken);
        Cookies.set("userId", decodedToken.id, { expires: 7 }); // Armazena o ID do usuário no cookie

        // Buscar permissões do usuário após login bem-sucedido
        try {
            const permissionsResponse = await api.get('/auth/permissions');
            if (permissionsResponse.data && permissionsResponse.data.permissions) {
                savePermissionsToCookie(permissionsResponse.data.permissions);
            }
        } catch (permissionsError) {
            console.warn('Erro ao buscar permissões do usuário:', permissionsError);
            // Não bloquear o login se as permissões falharem
        }

        console.log("Usuário logado com sucesso:", response.data);
        console.log("Token decodificado:", decodedToken);
        console.log("Dados do usuário:", user);

        return true;
    } catch (error: any) {
        console.error("Erro ao tentar fazer login:", error.response || error);
        const message =
            error.response?.data?.message || 'Erro ao tentar fazer login';
        throw new Error(message);
    }
}

// Função para logout
export async function logout() {
    try {
        await api.post('/auth/logout');

        // Remove todos os cookies relacionados à autenticação
        Cookies.remove("jwtToken");
        Cookies.remove("user");
        Cookies.remove("userId");
        Cookies.remove("PERMISSIONS");

        console.log("Usuário deslogado com sucesso");
        return true;
    } catch (error: any) {
        console.error("Erro ao fazer logout:", error);
        
        // Mesmo com erro na API, limpar os cookies locais
        Cookies.remove("jwtToken");
        Cookies.remove("user");
        Cookies.remove("userId");
        Cookies.remove("PERMISSIONS");
        
        // Não lançar erro para não impedir o logout local
        return true;
    }
}

// Função para registro de usuário
export async function register(userData: { email: string; password: string; name: string, roleId?: string }) {
    try {
        const response = await api.post<{ accessToken: string }>("/auth/signup", {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            roleId: userData.roleId || "user" 
        });
            

        const { accessToken } = response.data;

        if (!accessToken || typeof accessToken !== 'string') {
            console.error("Token inválido ou ausente:", accessToken);
            throw new Error("Token inválido ou ausente");
        }

        // Armazena o token JWT no cookie
        Cookies.set("jwtToken", accessToken, { expires: 7 }); 
        Cookies.set("user", userData.name, { expires: 7 });

        console.log("Usuário registrado com sucesso:", response.data);
        return true;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        console.error("Erro ao registrar:", error);
        throw new Error("Ocorreu um erro inesperado. Tente novamente.");
    }
}

export const getUserData = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data; // Retorna os dados do usuário
    } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
        throw error; // Rejeita a promessa para que o erro possa ser tratado onde for chamado
    }
};

// Função para editar dados do usuário
export const updateUserData = async (userData: { name?: string; email?: string; phone?: string; avatar?: string }) => {
    try {
        const response = await api.patch('/user/me/edit', userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        throw error;
    }
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
    const token = Cookies.get("jwtToken");
    if (!token) return false;
    
    try {
        const decoded = jwtDecode<{ exp: number }>(token);
        const currentTime = Date.now() / 1000;
        
        // Verificar se o token expirou
        if (decoded.exp && decoded.exp < currentTime) {
            // Token expirado, limpar cookies
            Cookies.remove("jwtToken");
            Cookies.remove("user");
            Cookies.remove("userId");
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Token inválido, limpar cookies
        Cookies.remove("jwtToken");
        Cookies.remove("user");
        Cookies.remove("userId");
        return false;
    }
};

// Função para obter dados do usuário do token
export const getUserFromToken = () => {
    const token = Cookies.get("jwtToken");
    const userCookie = Cookies.get("user");
    
    if (!token) return null;
    
    try {
        const decodedToken = jwtDecode<any>(token);
        
        // Tentar construir o objeto de usuário com dados disponíveis
        let userData: any = {};
        
        // Dados do token JWT
        if (decodedToken) {
            userData = {
                id: decodedToken.sub || decodedToken.id || decodedToken.userId,
                email: decodedToken.email,
                name: decodedToken.name,
                roleId: decodedToken.roleId || decodedToken.role,
                ...decodedToken
            };
        }
        
        // Se temos dados do cookie user, tentar combinar
        if (userCookie) {
            try {
                const userDataFromCookie = typeof userCookie === 'string' ? 
                    (userCookie.startsWith('{') ? JSON.parse(userCookie) : { name: userCookie }) :
                    userCookie;
                
                userData = {
                    ...userData,
                    ...userDataFromCookie
                };
            } catch (error) {
                console.warn('Erro ao parsear cookie user:', error);
                // Se não conseguir parsear, usar como nome
                userData.name = userData.name || userCookie;
            }
        }
        
        return userData;
    } catch (error) {
        console.error('Erro ao decodificar token:', error);
        return null;
    }
};

// Função para obter dados completos do usuário (token + API)
// Função para buscar dados do role baseado no roleId
const getRoleByIdFromAPI = async (roleId: string) => {
    try {
        const response = await api.get(`/roles/${roleId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar role:', error);
        return null;
    }
};

export const getFullUserData = async () => {
    // Primeiro, tentar obter do token
    const tokenData = getUserFromToken();
    
    if (!tokenData) return null;
    
    try {
        // Se o token não tem dados suficientes, buscar da API
        if (!tokenData.name || !tokenData.email) {
            const apiData = await getUserData();
            
            const combinedData = {
                ...tokenData,
                ...apiData
            };
            
            return combinedData;
        }
        
        // Se não temos dados do role mas temos roleId, buscar o role
        if (!tokenData.role && tokenData.roleId) {
            const roleData = await getRoleByIdFromAPI(tokenData.roleId);
            if (roleData) {
                tokenData.role = roleData;
            }
        }
        
        return tokenData;
    } catch (error) {
        console.warn('Erro ao buscar dados da API, usando apenas dados do token:', error);
        return tokenData;
    }
};

// Função para buscar permissões do usuário
export const getUserPermissions = async () => {
    try {
        console.log('Fazendo requisição para /auth/permissions...')
        const response = await api.get('/auth/permissions');
        console.log('Resposta de /auth/permissions:', response.data)
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar permissões do usuário:', error);
        throw error;
    }
};

// Função para salvar permissões no cookie
export const savePermissionsToCookie = (permissions: any[]) => {
    try {
        const permissionsString = JSON.stringify(permissions);
        Cookies.set("PERMISSIONS", permissionsString, { expires: 7 });
        console.log('Permissões salvas no cookie:', permissions);
    } catch (error) {
        console.error('Erro ao salvar permissões no cookie:', error);
    }
};

// Função para obter permissões do cookie
export const getPermissionsFromCookie = () => {
    try {
        const permissionsString = Cookies.get("PERMISSIONS");
        if (!permissionsString) return [];
        return JSON.parse(permissionsString);
    } catch (error) {
        console.error('Erro ao obter permissões do cookie:', error);
        return [];
    }
};

// Função para buscar turmas do cliente (para usuários do tipo CLIENTE)
export const getClientClasses = async () => {
    try {
        // Tentar o endpoint específico para clientes primeiro
        let response;
        
        try {
            response = await api.get('/superadmin/my-classes');
        } catch (error: any) {
            // Se não encontrar o endpoint específico, usar o endpoint geral
            // e filtrar pelo clientId do usuário
            const userData = getUserFromToken();
            
            response = await api.get('/superadmin/classes', {
                params: {
                    page: 1,
                    limit: 1000
                }
            });
            
            // Se temos dados do usuário e é um cliente, filtrar as turmas
            if (userData && response.data && response.data.classes) {
                const userClientId = userData.clientId || userData.id;
                const filteredClasses = response.data.classes.filter((turma: any) => {
                    return turma.clientId === userClientId;
                });
                
                response.data = {
                    ...response.data,
                    classes: filteredClasses
                };
            }
        }
        
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar turmas do cliente:', error);
        throw error;
    }
};

// Função para buscar dados do dashboard do cliente
export const getClientDashboard = async (clientId: string) => {
    try {
        const response = await api.get(`/superadmin/clients/${clientId}/dashboard`);
        console.log('Dados do dashboard do cliente:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados do dashboard do cliente:', error);
        throw error;
    }
};

