import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';  // Para navegação de redirecionamento
import { useAuthStore } from '../store/authStore';  // Importando a store de autenticação

interface AuthGuardianProps {
  children: React.ReactNode;  // Componente que será protegido
}

const AuthGuardian: React.FC<AuthGuardianProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, initAuth } = useAuthStore();  // Estado de autenticação
  const token = localStorage.getItem('authToken');
  const [loading, setLoading] = useState(true);  // Estado para controle de carregamento

  // Função que verifica o estado de autenticação ao carregar a página
  const checkAuth = () => {
    // Se não estiver autenticado e não tiver token, redireciona para a página de login
    if (!isAuthenticated && !token) {
      navigate('/login');
    } else {
      setLoading(false);  // Se autenticado, ou se já tiver token, para o carregamento
    }
  };

  // Verifica se o token é válido quando a página é carregada
  useEffect(() => {
    initAuth();  // Inicializa o estado de autenticação
  }, [initAuth]);

  useEffect(() => {
    checkAuth();  // Verifica a cada mudança de estado
  }, [isAuthenticated, token, navigate]);

  // Exibe uma mensagem de carregamento enquanto estamos verificando a autenticação
  if (loading) {
    return <div>Carregando...</div>;  // Isso pode ser um componente de loading mais estilizado
  }

  // Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" />;
  }

  // Caso esteja autenticado, exibe o conteúdo protegido
  return <>{children}</>;
};

export default AuthGuardian;
