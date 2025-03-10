import { create } from 'zustand';
import { User } from '../types/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initAuth: () => void; // Adiciona a função initAuth aqui na interface
}

// Mock users for demo
const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@example.com',
    password: 'senha123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80'
  }
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          const { password, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          localStorage.setItem('ecovivaUser', JSON.stringify(userWithoutPassword));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('ecovivaUser');
  },
  initAuth: () => {
    const storedUser = localStorage.getItem('ecovivaUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({ user, isAuthenticated: true });
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('ecovivaUser');
      }
    }
  }
}));

// Initialize authentication on app load
useAuthStore.getState().initAuth();
