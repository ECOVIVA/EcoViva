import React from 'react';
import { Home, Users, Compass, Bookmark, Calendar, Settings, HelpCircle } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-64 p-4 border-r border-gray-100 shrink-0">
      <nav className="space-y-1">
        <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md bg-green-50 text-green-700">
          <Home size={20} />
          <span className="font-medium">Início</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          <Users size={20} />
          <span>Minhas Comunidades</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          <Compass size={20} />
          <span>Descobrir</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          <Bookmark size={20} />
          <span>Salvos</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          <Calendar size={20} />
          <span>Eventos</span>
        </a>
      </nav>
      
      <div className="mt-8">
        <h3 className="text-xs uppercase text-gray-500 font-semibold px-3 mb-2">Minhas Comunidades</h3>
        <div className="space-y-1">
          {['Horta Urbana', 'Vida Sem Resíduos', 'Energia Sustentável', 'Conservação Florestal', 'Produtos Ecológicos'].map((community, index) => (
            <a 
              key={index} 
              href="#" 
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                <span className="text-xs font-medium text-green-700">{community.charAt(0)}</span>
              </div>
              <span className="truncate">{community}</span>
            </a>
          ))}
        </div>
        <a href="#" className="flex items-center space-x-1 px-3 py-2 mt-1 text-sm text-green-600 hover:underline">
          <span>Ver todas as comunidades</span>
        </a>
      </div>

      <div className="mt-auto pt-8">
        <nav className="space-y-1">
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            <Settings size={20} />
            <span>Configurações</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            <HelpCircle size={20} />
            <span>Ajuda e Suporte</span>
          </a>
        </nav>
      </div>
    </aside>
  );
};