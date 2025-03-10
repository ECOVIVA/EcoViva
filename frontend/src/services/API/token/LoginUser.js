import axios from 'axios';

// Instância do axios!!!!
const api = axios.create({
  baseURL: 'http://seu-servidor-django/api/', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // aqui garante que os cookies sejam enviandos a requisiçao
});

// Função para login do usuário.
const loginUser = async (username, password) => {
  try {
    const response = await api.post('/token/', { username, password });
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

// Função para fazer logout e limpar os dados armazenados.
const logoutUser = () => {
  document.cookie = 'access_token=; Max-Age=0'; // Apaga o cookie de token.
  document.cookie = 'refresh_token=; Max-Age=0'; // Apaga o cookie de refresh token.
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

export { loginUser, refreshAccessToken, logoutUser, isAuthenticated };
