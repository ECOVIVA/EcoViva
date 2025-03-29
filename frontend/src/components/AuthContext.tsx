import { useAuthStore } from '@/store/authStore';
import { loginUser, logoutUser, isAuthenticated as Auth } from '../services/authService';
import React, { createContext, useState, useContext, ReactNode } from 'react';
interface User {
  profile_picture?: string;
  id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: (email:string, password :string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const { initAuth } = useAuthStore();
  

  const login = async(email:string, password:string) => {
    try {
      const login = await loginUser(email, password)
      if (login){
        console.log("login feito com sucesso!!!")
        setIsAuthenticated(true);
        return true
      }
      else{
        console.log("login falhou!!!")
        setIsAuthenticated(false);
        return false
      }
    } catch (error) {
      console.error("Erro ao fazer login", error);
      return false
    }
  };

  const logout = async() => {
      logoutUser()
      setIsAuthenticated(false);
  };

  const isAuth = async() => {
    const auth = await Auth()
    console.log(auth)
    if (auth){
      setIsAuthenticated(true)
      return true
    }

    else{
      setIsAuthenticated(false)
      return false
    }
  }; 

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext,  };
