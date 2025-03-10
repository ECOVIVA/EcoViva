import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => { 
    // Verificar se o usuário já está autenticado ao carregar o componente
    initAuth();
    if (isAuthenticated) {
      navigate('/checkin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        navigate('/checkin');
      } else {
        setError('Email ou senha incorretos. Tente novamente.');
      }
    } catch (err) {
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const { initAuth } = useAuthStore.getState(); 
  initAuth();

  const handleSignUpClick = () => {
    const leaf = document.querySelector('.leaf-icon') as HTMLElement;
    if (leaf) {
      leaf.style.transition = 'transform 1s ease-in-out';
      leaf.style.transform = 'rotate(360deg)';

      setTimeout(() => {
        navigate('/signup');
      }, 1000);
    }
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

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                        shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>

            <motion.button
              type="button"
              onClick={handleSignUpClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-center text-green-600 hover:text-green-700 font-medium"
            >
              <Link to="/CreateAccount" className="relative">
                Crie uma contaECO aqui!
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
