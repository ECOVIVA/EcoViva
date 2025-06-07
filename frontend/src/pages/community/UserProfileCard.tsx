import React from 'react';
import { Edit, User } from 'lucide-react';

export const UserProfileCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-green-400 to-green-600"></div>
      <div className="p-4 pt-0 relative">
        <div className="w-20 h-20 rounded-full border-4 border-white bg-green-100 flex items-center justify-center absolute -top-10 left-4 overflow-hidden">
          <User size={32} className="text-green-700" />
        </div>
        
        <div className="pt-12">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-lg">João Silva</h3>
            <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <Edit size={16} className="text-gray-500" />
            </button>
          </div>
          <p className="text-gray-500 text-sm">Entusiasta da Sustentabilidade</p>
          
          <div className="flex justify-between mt-4 text-sm">
            <div>
              <p className="font-semibold">12</p>
              <p className="text-gray-500">Comunidades</p>
            </div>
            <div>
              <p className="font-semibold">243</p>
              <p className="text-gray-500">Conexões</p>
            </div>
            <div>
              <p className="font-semibold">52</p>
              <p className="text-gray-500">Posts</p>
            </div>
          </div>
          
          <button className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors">
            Ver Perfil
          </button>
        </div>
      </div>
    </div>
  );
};