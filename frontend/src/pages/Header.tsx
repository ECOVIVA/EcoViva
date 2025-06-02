import React, { useState } from 'react';
import { Search, Menu, X, Bell, MessageCircle, User } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative top-0 -z-[10] bg-white border-b border-gray-100 shadow-sm">
      <div className="container z[-10] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar comunidades, posts, pessoas..."
                className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          <nav className="flex items-center space-x-1 md:space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors md:hidden">
              <Search size={20} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-500"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
              <MessageCircle size={20} className="text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-500"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                <User size={18} className="text-green-700" />
              </div>
            </button>
          </nav>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-2">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Buscar comunidades, posts, pessoas..."
                className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-50 text-green-700 font-medium">Início</a>
              <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">Minhas Comunidades</a>
              <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">Descobrir</a>
              <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">Notificações</a>
              <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">Mensagens</a>
              <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">Perfil</a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};