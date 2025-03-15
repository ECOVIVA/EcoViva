import { create } from 'zustand';
import { AuthState } from '../../types/types';  // Importando as interfaces
import axios from 'axios';

// Instância do Axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/user/create/',  // URL da sua API
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Habilita o envio de cookies em todas as requisições
});

// Adicionando um interceptor para incluir o token em todas as requisições.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Função de login
const loginUser = async (Email: string, password: string) => {
  try {
    const response = await api.post('/token/', { Email, password });
    const { access, user } = response.data;
    
    // Armazenar o token no localStorage para persistência
    localStorage.setItem('authToken', access);

    return { user, access };
  } catch (error) {
    // Tratar erros de forma mais detalhada
    if (axios.isAxiosError(error)) {
      console.error('Erro ao autenticar usuário:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Erro desconhecido ao autenticar');
    } else {
      throw new Error('Erro ao fazer login');
    }
  }
};

// Função para registrar um novo usuário
export const createAccount = async (formData: any) => {
  try {
    const response = await api.post('/register/', formData);
    return response.data;
  } catch (error) {
    // Tratar erro de registro
    if (axios.isAxiosError(error)) {
      console.error('Erro ao criar conta:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Erro desconhecido ao criar conta');
    } else {
      throw new Error('Erro ao criar conta');
    }
  }
};

// Zustand para autenticação
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // Função de login com axios
  login: async (Email: string, password: string) => {
    try {
      const { user, access } = await loginUser(Email, password);
      set({ user, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      return false;
    }
  },

  // Função de logout
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('authToken');  // Limpar o token ao fazer logout
  },

  // Função para inicializar a autenticação
  initAuth: async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Verifique se o token é válido com um endpoint de verificação
        await api.get('/me');  // Endpoint exemplo de verificação
        set({ isAuthenticated: true });
      } catch (error) {
        console.error('Token inválido ou expirado');
        localStorage.removeItem('authToken');
        set({ isAuthenticated: false });
      }
    }
  },

  // Função de registrar novo usuário
  register: async (formData: any) => {
    try {
      const newUser = await createAccount(formData);
      set({ user: newUser, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      return false;
    }
  },
}));

export default api;
