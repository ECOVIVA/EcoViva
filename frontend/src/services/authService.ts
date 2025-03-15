import axios from 'axios';

// Instância do axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/users/', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permite enviar cookies nas requisições
});

// Função de login
export const loginUser = async (Email: string, password: string) => {
  try {
    const response = await api.post('/token/', { Email, password });
    const { access, refresh } = response.data;

    // Armazenando os tokens no cookie
    document.cookie = `access_token=${access}; Max-Age=3600; path=/`;
    document.cookie = `refresh_token=${refresh}; Max-Age=86400; path=/`;

    console.log('Login bem-sucedido!');
    return response.data; // Retorna os tokens
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw new Error('Usuário ou senha inválidos');
  }
};

// Função para renovar o token de acesso
export const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshTokenFromCookie();
    const response = await api.post('/token/refresh/', { refresh: refreshToken });

    // Atualizando o token de acesso
    const { access } = response.data;
    api.defaults.headers['Authorization'] = `Bearer ${access}`;
    document.cookie = `access_token=${access}; Max-Age=3600; path=/`;

    console.log('Token de acesso renovado');
    return response.data; // Retorna o novo token
  } catch (error) {
    console.error('Erro ao renovar o token:', error);
    throw new Error('Falha ao renovar o token');
  }
};

// Função para obter o refresh token armazenado
const getRefreshTokenFromCookie = () => {
  const cookies = document.cookie.split('; ');
  const refreshToken = cookies.find(cookie => cookie.startsWith('refresh_token='));
  return refreshToken ? refreshToken.split('=')[1] : null;
};

// Função para obter o access token armazenado
const getAccessTokenFromCookie = () => {
  const cookies = document.cookie.split('; ');
  const accessToken = cookies.find(cookie => cookie.startsWith('access_token='));
  return accessToken ? accessToken.split('=')[1] : null;
};

export const logoutUser = () => {
  document.cookie = `access_token=; Max-Age=0; path=/; Secure; HttpOnly; SameSite=Strict`;
  document.cookie = `refresh_token=; Max-Age=0; path=/; Secure; HttpOnly; SameSite=Strict`;
  console.log('Usuário deslogado');
};

export const isAuthenticated = () => {
  const token = getAccessTokenFromCookie();
  return !!token; // Retorna true se o token de acesso existir
};
