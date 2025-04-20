import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../../services/API/axios';
import routes from '../../services/API/routes';
import { AxiosResponse } from 'axios';

interface User {
  photo?: string;
  id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserPhoto: (photoUrl: string) => void; // Função para atualizar a foto
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Função para atualizar a foto do usuário
  const updateUserPhoto = (photoUrl: string) => {
    if (user) {
      setUser({ ...user, photo: photoUrl });
    }
  };

  // Renova o token caso esteja expirado
  const fetchRefresh = async (): Promise<boolean> => {
    try {
      const response: AxiosResponse = await api.post(routes.auth.refresh);
      if (response.status === 200) {
        return true;
      }
      console.error('Falha ao renovar token', response);
      return false;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return false;
    }
  };

  // Verifica se o token atual é válido
  const verifyAuthentication = async () => {
    try {
      const response: AxiosResponse = await api.get(routes.auth.verify);
      if (response.status === 200) {
        setIsAuthenticated(true);
        await fetchUser(); // garante que o user seja carregado também
      } else {
        const refreshed = await fetchRefresh();
        setIsAuthenticated(refreshed);
      }
    } catch (error) {
      const refreshed = await fetchRefresh();
      setIsAuthenticated(refreshed);
    }
  };

  // Carrega dados do usuário autenticado
  const fetchUser = async () => {
    try {
      const response: AxiosResponse = await api.get(routes.user.profile);
      if (response.status === 200) {
        const userData: User = {
          id: response.data.id,
          name: response.data.username,
          email: response.data.email,
          photo: response.data.photo || undefined,
        };
        setUser(userData);
       }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const login = async () => {
    try {
      await fetchUser();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const logout = async () => {
    try {
      await api.post(routes.auth.logout);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  useEffect(() => {
    verifyAuthentication();
    const intervalId = setInterval(() => {
      verifyAuthentication();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserPhoto }}>
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

export { AuthProvider, useAuth, AuthContext };
