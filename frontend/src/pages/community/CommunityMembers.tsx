import React from 'react';
import { Search, UserPlus } from 'lucide-react';

export const CommunityMembers: React.FC = () => {
  const members = [
    {
      name: 'Ana Silva',
      role: 'Administradora',
      joinDate: 'Membro desde Mar 2024',
      contributions: 156
    },
    {
      name: 'Carlos Santos',
      role: 'Moderador',
      joinDate: 'Membro desde Jan 2024',
      contributions: 89
    },
    {
      name: 'Marina Costa',
      role: 'Membro',
      joinDate: 'Membro desde Fev 2024',
      contributions: 45
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Membros da Comunidade</h2>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
          <UserPlus size={18} className="mr-2" />
          Convidar Membros
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar membros..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {members.map((member, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-lg font-medium text-green-700">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    <span className="text-sm text-green-600 font-medium">{member.role}</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span>{member.joinDate}</span>
                    <span className="mx-2">•</span>
                    <span>{member.contributions} contribuições</span>
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Ver Perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};