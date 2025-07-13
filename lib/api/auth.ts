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

        console.log("Usuário deslogado com sucesso");
        return true;
    } catch (error: any) {
        console.error("Erro ao fazer logout:", error);
        
        // Mesmo com erro na API, limpar os cookies locais
        Cookies.remove("jwtToken");
        Cookies.remove("user");
        Cookies.remove("userId");
        
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
        console.log('Token decodificado:', decodedToken);
        
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
                
                console.log('Dados do cookie user:', userDataFromCookie);
            } catch (error) {
                console.warn('Erro ao parsear cookie user:', error);
                // Se não conseguir parsear, usar como nome
                userData.name = userData.name || userCookie;
            }
        }
        
        console.log('Dados finais do usuário:', userData);
        return userData;
    } catch (error) {
        console.error('Erro ao decodificar token:', error);
        return null;
    }
};

// Função para obter dados completos do usuário (token + API)
export const getFullUserData = async () => {
    // Primeiro, tentar obter do token
    const tokenData = getUserFromToken();
    
    if (!tokenData) return null;
    
    try {
        // Se o token não tem dados suficientes, buscar da API
        if (!tokenData.name || !tokenData.email) {
            console.log('Dados incompletos no token, buscando da API...');
            const apiData = await getUserData();
            
            return {
                ...tokenData,
                ...apiData
            };
        }
        
        return tokenData;
    } catch (error) {
        console.warn('Erro ao buscar dados da API, usando apenas dados do token:', error);
        return tokenData;
    }
};
