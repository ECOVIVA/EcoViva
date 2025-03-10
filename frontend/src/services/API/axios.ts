// authStore.ts
import { create } from 'zustand';
import { user, AuthState } from '../../types/types';  // Importando as interfaces
import axios from 'axios';

// Instância do Axios
const api = axios.create({
  baseURL: 'http://seu-servidor-django/api/', // Substitua com sua URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Função de login
const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/token/', { email, password });
    const { access, user } = response.data;
    document.cookie = `access_token=${access}; Max-Age=3600; path=/`;
    return { user, access }; // Retorna o usuário e o token
  } catch (error) {
    throw new Error('Erro ao fazer login');
  }
};

// Função para registrar um novo usuário
export const createAccount = async (formData: any) => {
  try {
    const response = await api.post('/register/', formData);
    return response.data; // Retorna os dados do usuário
  } catch (error) {
    throw new Error('Erro ao criar conta');
  }
};

// Zustand para autenticação
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // Função de login com axios
  login: async (email: string, password: string) => {
    try {
      const { user, access } = await loginUser(email, password);
      localStorage.setItem('authToken', access);
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
    localStorage.removeItem('authToken');
  },

  // Função para inicializar a autenticação
  initAuth: () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      set({ isAuthenticated: true });
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
