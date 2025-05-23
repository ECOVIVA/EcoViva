import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../components/Auth/AuthContext';
import api from '../services/API/axios';
import routes from '../services/API/routes';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

const LoginPage: React.FC = () => {
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Contexto não encontrado. Verifique se você envolveu o componente com o AuthProvider.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validation = loginSchema.safeParse({ email: Email, password });

    if (!validation.success) {
      const fieldError = validation.error.errors[0];
      setErrors({ [fieldError.path[0]]: fieldError.message });
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post(routes.auth.login, {
        email: Email,
        password: password,
      });

      if (response.status === 200) {
        authContext.login();
        navigate('/');
      } else {
        setErrors({ general: 'Erro desconhecido. Tente novamente.' });
      }
    } catch (error: any) {
      console.error('Erro de autenticação', error);
      if (error.response && error.response.data) {
        const data = error.response.data;

        if (typeof data === 'object' && !Array.isArray(data)) {
          const firstKey = Object.keys(data)[0];
          const firstError = data[firstKey];
          setErrors({ general: firstError });
        } else if (data.detail) {
          setErrors({ general: data.detail || '.' });
        } else {
          setErrors({ general: 'Erro ao fazer login. Verifique os dados e tente novamente.' });
        }
      } else {
        setErrors({ general: 'Ocorreu um erro inesperado. Tente novamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    navigate('/CreateAccount');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-green-800">Bem-vindo à EcoViva</h2>
          <p className="mt-2 text-gray-600">Entre para continuar sua jornada sustentável</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="Email"
                name="Email"
                type="email"
                autoComplete="username"
                required
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Seu Email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                type="button"
                onClick={handleSignUpClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm whitespace-nowrap border border-green-600 text-green-600 hover:text-white hover:bg-green-600 rounded-full font-medium transition-all duration-200"
              >
                <Link to="/CreateAccount" className="relative block text-center">
                  Crie uma conta ECO aqui!
                  <motion.div
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm whitespace-nowrap border border-green-600 text-green-600 hover:text-white hover:bg-green-600 rounded-full font-medium transition-all duration-200"
              >
                <Link to="/RequestPassword" className="relative block text-center">
                  Esqueceu sua senha??
                  <motion.div
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.button>
              
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;