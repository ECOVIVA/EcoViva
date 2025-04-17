import React, { useContext, useState} from 'react';
import { Leaf, Mail, Lock, Eye, EyeOff, User, Phone, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/Auth/AuthContext'; // Mantenha o import do AuthContext
import api from '../services/API/axios';
import routes from '../services/API/routes';


function App() {
  const navigator = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    photo: null as File | null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Verifica se as senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (!authContext) {
      return <div>Contexto não encontrado. Verifique se você envolveu o componente com o AuthProvider.</div>;
    }

    try {
      // Enviando dados de texto (usuário) como JSON
      const userData = {
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        photo: formData.photo
      };

      const response = await api.post(routes.user.create, userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert("Usuário cadastrado com sucesso!");
        navigator('/CheckInpage');
      }
    } catch (err) {
      setError("Ocorreu um erro ao criar a conta. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-green-800">
            Criar Conta EcoViva
          </h2>
          <p className="mt-2 text-gray-600">
            Junte-se à nossa comunidade sustentável
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                            shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 
                            focus:border-green-500"
                  placeholder="Nome"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Sobrenome
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg 
                          shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 
                          focus:border-green-500"
                placeholder="Sobrenome"
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nome de Usuário
            </label>
            <input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg 
                        shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 
                        focus:border-green-500"
              placeholder="Nome de usuário"
            />
          </div>

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
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                          shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 
                          focus:border-green-500"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                          shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 
                          focus:border-green-500"
                placeholder="(00) 00000-0000"
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
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 
                          rounded-lg shadow-sm placeholder-gray-400 focus:outline-none 
                          focus:ring-green-500 focus:border-green-500"
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 
                          rounded-lg shadow-sm placeholder-gray-400 focus:outline-none 
                          focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
              Foto de Perfil
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="photo"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                  >
                    <span>Upload uma foto</span>
                    <input id="photo" name="photo" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG até 10MB</p>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                        shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <a href="/Login" className="font-medium text-green-600 hover:text-green-500">
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;