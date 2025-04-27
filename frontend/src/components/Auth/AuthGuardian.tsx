import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Para navegação de redirecionamento
import { isAuth } from './AuthContext';  // Importando a store de autenticação
import CheckInPage from '../../pages/CheckInPage';


interface AuthGuardianProps {
  children: React.ReactNode;  // Componente que será protegido
}

const AuthGuardian: React.FC<AuthGuardianProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true);  // Estado para controle de carregamento

  // Função que verifica o estado de autenticação ao carregar a página
  const checkAuth = async () => {
     const auth = await isAuth();
    if (auth) {
      setIsAuthenticated(true)
      setLoading(false);
    } else {
      setIsAuthenticated(false)
      setLoading(false);  // Se autenticado, para o carregamento
    }
  };

  useEffect(() => {
    console.log(isAuthenticated)
    checkAuth()

    const interval = setInterval(() => {
      checkAuth();
    }, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);  // O efeito será re-executado quando `isAuthenticated` ou `navigate` mudar

  // Exibe uma mensagem de carregamento enquanto estamos verificando a autenticação
  if (loading) {
    return <div>Carregando...</div>;  // Pode substituir por um componente de loading mais estilizado
  }

  if (!isAuthenticated){
    return <CheckInPage/>
  }

  // Caso esteja autenticado, exibe o conteúdo protegido
  return <>{children}</>;
};

export default AuthGuardian;
