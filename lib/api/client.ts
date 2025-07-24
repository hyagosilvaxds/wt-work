import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "https://api.olimpustech.com",
  timeout: 600000,
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
  
  return config;
});

// Interceptor de resposta para lidar com erros 401 e 403
api.interceptors.response.use(
  (response) => {
    // Retorna a resposta normalmente se não houver erro
    return response;
  },
  (error) => {
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