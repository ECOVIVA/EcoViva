import React, { useContext, useState } from 'react';
import { Leaf, Mail, Lock, Eye, EyeOff, User, Phone, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/Auth/AuthContext'; // Mantenha o import do AuthContext
import api from '../services/API/axios';
import routes from '../services/API/routes';
import { userSchema, type UserSchema } from '../schemas/userSchemas';
import VerificationMessage from '../components/VerificationMenssage';

function App() {
  const navigate = useNavigate();
  const [showVerification, setShowVerification] = useState(false);

  const [formData, setFormData] = useState<UserSchema>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    photo: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoError, setPhotoError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setPhotoError("");
    setIsLoading(true);

    try {
      // Validate form data using Zod
      const validatedData = userSchema.parse(formData);

      if (!authContext) {
        throw new Error("Contexto de autenticação não encontrado");
      }

      const userData = new FormData();
      userData.append('username', validatedData.username);
      userData.append('first_name', validatedData.firstName);
      userData.append('last_name', validatedData.lastName);
      userData.append('email', validatedData.email);
      // @ts-ignore
      userData.append('phone', validatedData.phone);
      userData.append('password', validatedData.password);
      if (validatedData.photo) userData.append('photo', validatedData.photo);

      const response = await api.post(routes.user.create, userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setShowVerification(true);
      }
    } catch (err: any) {
      if (err.errors) {
        const validationErrors: Record<string, string> = {};
        err.errors.forEach((error: any) => {
          if (error.path) {
            validationErrors[error.path[0]] = error.message;
          }
        });
        setErrors(validationErrors);
      } else if (err.response?.data) {
        const apiErrors = err.response.data;

        if (apiErrors.email) {
          setErrors((prev) => ({
            ...prev,
            email: apiErrors.email[0],
          }));
        }

        if (apiErrors.username) {
          setErrors((prev) => ({
            ...prev,
            username: apiErrors.username[0],
          }));
        }

        if (apiErrors.photo) {
          setPhotoError(apiErrors.photo[0]);
        }
      } else {
        setErrors({
          submit: "Ocorreu um erro ao criar a conta. Tente novamente."
        });
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationClose = () => {
    setShowVerification(false);
    navigate('/login');
  };

  return (
    <>
      {showVerification && (
        <VerificationMessage
          email={formData.email}
          onClose={handleVerificationClose}
        />
      )}

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>

          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
            Criar conta
          </h2>



          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nome de usuário
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Digite seu nome de usuário"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Digite seu nome"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Sobrenome
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Digite seu sobrenome"
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Digite seu email"
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}

            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Digite seu telefone"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Confirme sua senha"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                Foto de Perfil
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="photo"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                    >
                      <span>Fazer upload de arquivo</span>
                      <input
                        id="photo"
                        name="photo"
                        type="file"
                        className="sr-only"
                        onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG até 10MB</p>
                </div>
              </div>
            </div>
            {photoError && (
              <div className="mb-4 p-3 text-red-500 rounded-lg text-sm">
                {photoError}
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Criando conta..." : "Criar conta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
