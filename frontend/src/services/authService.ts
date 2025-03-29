import axios from 'axios';

// Instância do axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permite enviar cookies nas requisições
});

// Função de login
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/login/', { email, password });
    if (response.status === 200){
    console.log('Login bem-sucedido!')
    return true; 
  }
  else{
    console.log('Login Falhou!')
    return false
  }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw new Error('Usuário ou senha inválidos');
  }
};

export const logoutUser = async() => {
  try{
    const response = await api.post('/logout/');
    return true
    }
    catch(error:any)
    {
    return false
    
  }
};

export const isAuthenticated = async ():Promise<any> => {
  try {
    // Tenta fazer a requisição para verificar o token
    const response = await api.get('/verify/');

    if (response.status === 200){
      return true;  // Retorna true se o token for válido
    }

  } catch (error:any) {
    console.error('Erro na verificação do token:', error.response ? error.response.data : error.message);
      try {
        const refreshResponse = await api.post('/refresh/'); // Usando a mesma instância do axios para refresh
        console.log('Token atualizado:', refreshResponse.data);

        return isAuthenticated();  // Chama novamente a função de verificação

      } catch (refreshError:any) {
        logoutUser()
        return false;  // Retorna false se o refresh falhar
      }
    } 
};
