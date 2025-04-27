import React from 'react';
import { Mail } from 'lucide-react';

interface VerificationMessageProps {
  email: string;
  onClose: () => void;
}

const VerificationMessage: React.FC<VerificationMessageProps> = ({ email, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">Verifique seu email</h3>
          <div className="mt-3">
            <p className="text-sm text-gray-500">
              Enviamos um link de verificação para
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">{email}</p>
            <p className="mt-3 text-sm text-gray-500">
              Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
              Verifique também sua pasta de spam caso não encontre o email.
            </p>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Ir para login
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationMessage;