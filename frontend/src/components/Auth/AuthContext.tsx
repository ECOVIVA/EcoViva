import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
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
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserPhoto: (photoUrl: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const isAuth = (): boolean => {
  const userData = localStorage.getItem('user');
  const authStatus = localStorage.getItem('isAuthenticated');
  return !!userData && authStatus === 'true';
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUserPhoto = (photoUrl: string) => {
    if (user) {
      const updatedUser = { ...user, photo: photoUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const fetchRefresh = async (): Promise<boolean> => {
    try {
      const response: AxiosResponse = await api.post(routes.auth.refresh);
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return false;
    }
  };

  const fetchUser = async (): Promise<boolean> => {
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
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        return true;
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
    return false;
  };

  const verifyAuthentication = async () => {
    try {
      const response = await api.get(routes.auth.verify);
      if (response.status === 200) {
        const fetched = await fetchUser();
        setIsAuthenticated(fetched);
      } else {
        const refreshed = await fetchRefresh();
        if (refreshed) {
          const fetched = await fetchUser();
          setIsAuthenticated(fetched);
        } else {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      const refreshed = await fetchRefresh();
      if (refreshed) {
        const fetched = await fetchUser();
        setIsAuthenticated(fetched);
      } else {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      const success = await fetchUser();
      setIsAuthenticated(success);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const logout = async () => {
    try {
      await api.post(routes.auth.logout);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const auth = isAuth();
      if (auth) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          await verifyAuthentication();
        }
        setLoading(false);
      } else {
        await verifyAuthentication();
      }
    };

    initialize();

    const intervalId = setInterval(() => {
      verifyAuthentication();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        updateUserPhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext, isAuth };
