import React from 'react';
import { Calendar, MapPin, Users, Plus } from 'lucide-react';

export const CommunityEvents: React.FC = () => {
  const events = [
    {
      name: 'Workshop de Compostagem',
      date: '25 de Maio, 2025',
      time: '10:00',
      location: 'Parque Municipal',
      attendees: 45,
      image: 'https://images.pexels.com/photos/4503751/pexels-photo-4503751.jpeg'
    },
    {
      name: 'Feira de Mudas',
      date: '1 de Junho, 2025',
      time: '09:00',
      location: 'Praça Central',
      attendees: 120,
      image: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Eventos da Comunidade</h2>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
          <Plus size={18} className="mr-2" />
          Criar Evento
        </button>
      </div>

      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="md:flex">
              <div className="md:w-64 h-48 md:h-auto">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar size={18} className="mr-2 text-gray-400" />
                    <span>{event.date} às {event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-2 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users size={18} className="mr-2 text-gray-400" />
                    <span>{event.attendees} participantes confirmados</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center space-x-4">
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    Participar
                  </button>
                  <button className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Mais Informações
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};