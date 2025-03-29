import { create } from 'zustand';
import { User as UserType } from '../types/types';
import { isAuthenticated as isAuth, loginUser, logoutUser } from '../services/authService';

interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    try {
      const response = await loginUser(email, password);
      if (response) {
        console.log('aaa')
        set({ isAuthenticated: true });
        return true;
      } else {
        console.log('bbb')

        set({ isAuthenticated: false });
        return false;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  },

  logout: async() => {
    await logoutUser()
    set({ isAuthenticated: false });
  },

  initAuth: async() => {
      try {
        const auth = await isAuth()
        if (auth){
        return true
      }
      else{
        return false

      }
      } catch (error) {
        return false
      }
    }
}));

// Inicializar a autenticação assim que a aplicação for carregada
useAuthStore.getState().initAuth();
