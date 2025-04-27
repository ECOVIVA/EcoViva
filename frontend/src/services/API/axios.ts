import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
// Instância do Axios
const api = axios.create({
  baseURL: apiUrl,  // URL da sua API
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