import { create } from 'zustand';
import { User as UserType } from '../types/types';
import { loginUser } from '../services/authService';

interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    try {
      const response = await loginUser(email, password);
      if (response?.token) {
        const user: UserType = {
          id: response.user.id,
          username: response.user.username,
          first_name: response.user.first_name,
          last_name: response.user.last_name,
          email: response.user.email,
          phone: response.user.phone,
          avatar: response.user.avatar, // Certifique-se de que o avatar seja recebido corretamente
          role: response.user.role,
        };
console.log('User logged in:', user);

        set({ user, isAuthenticated: true });
        localStorage.setItem('ecovivaUser', JSON.stringify(user));

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('ecovivaUser');
  },
  initAuth: () => {
    const storedUser = localStorage.getItem('ecovivaUser');
    console.log('Stored User in localStorage:', storedUser);  // Adicionei este log para depuração
  
    if (storedUser) {
      try {
        const user: UserType = JSON.parse(storedUser);
        console.log('Parsed User:', user);  // Log do usuário após o parse
        set({ user, isAuthenticated: true });
      } catch (error) {
        console.error('Erro ao processar usuário salvo:', error);
        localStorage.removeItem('ecovivaUser');
      }
    }
  },
}));

// Inicializar a autenticação assim que a aplicação for carregada
useAuthStore.getState().initAuth();
