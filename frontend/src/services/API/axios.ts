import axios from 'axios';

// Instância do Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api',  // URL da sua API
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Habilita o envio de cookies em todas as requisições
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // exemplo: tratar erro 401
    if (error.response?.status === 401) {
      console.warn('Não autorizado!')
    }
    return Promise.reject(error)
  }
)

export default api;