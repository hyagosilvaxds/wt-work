import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o token JWT no cabeçalho Authorization
api.interceptors.request.use((config) => {
  const token = Cookies.get("jwtToken");
  if (token) {
    if (!config.headers) {
      config.headers = {} as import("axios").AxiosRequestHeaders;
    }
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Log para debug
  console.log('API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    fullUrl: (config.baseURL || '') + (config.url || ''),
    data: config.data,
    headers: config.headers
  });
  
  return config;
});

// Interceptor de resposta para lidar com erros 401 e 403
api.interceptors.response.use(
  (response) => {
    // Log para debug
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      data: response.data
    });
    
    // Retorna a resposta normalmente se não houver erro
    return response;
  },
  (error) => {
    // Log do erro para debug
    console.log('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      message: error.message
    });
    
    // Verifica se o erro é 401 ou 403
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== "undefined") {
        // Remove o token inválido
        Cookies.remove("jwtToken");

        // Só redireciona se não estiver na página de login
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    // Rejeita a promessa com o erro para que ele possa ser tratado onde for chamado
    return Promise.reject(error);
  }
);

// Função para decodificar o token e obter informações como isAdmin e id
export const getDecodedToken = () => {
  const token = Cookies.get("jwtToken");
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Erro ao decodificar o token JWT:", error);
      return null;
    }
  }
  return null;
};

export default api;