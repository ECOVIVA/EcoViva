import axios from 'axios';
import { loginUser } from './path/to/axiosFile';

// Instância do axios!!!!
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/users/', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // aqui garante que os cookies sejam enviandos a requisiçao
});


// Função para login do usuário.
const loginUser = async (Email, password) => {
  try {
    const response = await api.post('/token/', { Email, password });
    const { access, refresh } = response.data;

    // Armazenando o token de acesso e refresh no cookie.
    document.cookie = `access_token=${access}; Max-Age=3600; path=/`;
    document.cookie = `refresh_token=${refresh}; Max-Age=86400; path=/`; // 24 horas para refresh.

    console.log('Login bem-sucedido!');
    return response.data; // Retorna o token
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw new Error('Usuário ou senha inválidos');
  }
};



// Função para renovar o token de acesso.
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshTokenFromCookie();
    const response = await api.post('/token/refresh/', { refresh: refreshToken });

    // Atualiza o token de acesso armazenado.
    const { access } = response.data;

    // Atualiza o cabeçalho Authorization para usar o novo token de acesso.
    api.defaults.headers['Authorization'] = `Bearer ${access}`;

    // Atualiza o cookie com o novo token de acesso.
    document.cookie = `access_token=${access}; Max-Age=3600; path=/`;

    console.log('Token de acesso renovado');
    return response.data; // Retorna o novo token.
  } catch (error) {
    console.error('Erro ao renovar o token:', error);
    throw new Error('Falha ao renovar o token');
  }
};

// Função para obter o refresh token armazenado no cookie.
const getRefreshTokenFromCookie = () => {
  const cookies = document.cookie.split('; ');
  const refreshToken = cookies.find(cookie => cookie.startsWith('refresh_token='));

  if (refreshToken) {
    return refreshToken.split('=')[1];
  }
  return null;
};


// Essas opções ajudam a melhorar a segurança dos cookies, evitando que eles sejam acessados via JavaScript em algumas situações e garantem que apenas conexões HTTPS possam enviar os cookies.
const logoutUser = () => {
  document.cookie = `access_token=${access}; Max-Age=3600; path=/; Secure; HttpOnly; SameSite=Strict`;
  document.cookie = `refresh_token=${refresh}; Max-Age=86400; path=/; Secure; HttpOnly; SameSite=Strict`;  
  console.log('Usuário deslogado');
};

// Função para verificar se o usuário está autenticado.
const isAuthenticated = () => {
  const token = getAccessTokenFromCookie();
  return !!token; // Retorna true se o token existir, caso contrário, false.
};

// Função para obter o access token armazenado no cookie.
const getAccessTokenFromCookie = () => {
  const cookies = document.cookie.split('; ');
  const accessToken = cookies.find(cookie => cookie.startsWith('access_token='));

  if (accessToken) {
    return accessToken.split('=')[1];
  }
  return null;
};

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  login: async (email, password) => {
    try {
      const response = await loginUser(email, password);
      set({ isAuthenticated: true, user: response });
      return true;
    } catch (error) {
      set({ isAuthenticated: false });
      return false;
    }
  }
}));
export { loginUser, refreshAccessToken, logoutUser, isAuthenticated };
