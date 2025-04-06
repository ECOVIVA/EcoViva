import React, { useState } from 'react';
import { Leaf, Send } from 'lucide-react';

function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Código de verificação reenviado com sucesso!');
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-emerald-100 p-3 rounded-full">
            <Leaf className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">ECOviva</h1>
        <p className="text-center text-gray-600 mb-8">
          Não recebeu o código de verificação?<br />
          Reenviaremos para seu email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="seu@email.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 
                     transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Send className="w-4 h-4" />
            Reenviar Código
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-center">
            {message}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Juntos por um futuro mais sustentável 🌱
        </p>
      </div>
    </div>
  );
}

export default App;