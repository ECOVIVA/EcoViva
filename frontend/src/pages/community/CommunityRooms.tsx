import React from 'react';
import { Users, Lock, Plus } from 'lucide-react';

export const CommunityRooms: React.FC = () => {
  const rooms = [
    {
      name: 'Iniciantes em Horta',
      description: 'Aprenda os fundamentos básicos de cultivo urbano',
      members: 156,
      isPrivate: false,
      image: 'https://images.pexels.com/photos/1084540/pexels-photo-1084540.jpeg'
    },
    {
      name: 'Compostagem Avançada',
      description: 'Técnicas avançadas de compostagem e manejo de resíduos',
      members: 89,
      isPrivate: true,
      image: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg'
    },
    {
      name: 'Hidroponia',
      description: 'Cultivo sem solo: técnicas e práticas',
      members: 124,
      isPrivate: false,
      image: 'https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Salas de Estudo</h2>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
          <Plus size={18} className="mr-2" />
          Criar Nova Sala
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 overflow-hidden">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    {room.name}
                    {room.isPrivate && (
                      <Lock size={16} className="ml-2 text-gray-400" />
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{room.description}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Users size={16} className="mr-1" />
                  <span>{room.members} membros</span>
                </div>
                <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                  {room.isPrivate ? 'Solicitar Acesso' : 'Participar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};