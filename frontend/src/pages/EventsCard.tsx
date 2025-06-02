import React from 'react';
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react';

export const EventsCard: React.FC = () => {
  const upcomingEvents = [
    { 
      name: 'Dia de Limpeza da Praia', 
      date: '15 de Maio, 2025', 
      time: '9:00',
      location: 'Praia de Copacabana',
      community: 'Conservação Oceânica',
      attendees: 24,
      image: 'https://images.pexels.com/photos/3952224/pexels-photo-3952224.jpeg'
    },
    { 
      name: 'Workshop de Vida Sustentável', 
      date: '22 de Maio, 2025', 
      time: '14:00',
      location: 'Centro Cultural Verde',
      community: 'Vida Verde',
      attendees: 18,
      image: 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg'
    }
  ];
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-green-600" />
          <h3 className="font-semibold text-gray-900">Próximos Eventos</h3>
        </div>
        <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">
          Ver Calendário
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
      
      <div className="divide-y divide-gray-100">
        {upcomingEvents.map((event, index) => (
          <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex space-x-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={event.image} 
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{event.name}</h4>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    <span>{event.date} às {event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-2 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users size={14} className="mr-2 text-gray-400" />
                    <span>{event.attendees} participantes</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">{event.community}</span>
                  <button className="px-4 py-1.5 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-full transition-colors font-medium">
                    Participar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-green-50">
        <button className="w-full py-2.5 px-4 bg-white text-green-700 hover:bg-green-700 hover:text-white rounded-lg transition-colors font-medium border border-green-200 hover:border-green-700 flex items-center justify-center">
          <Calendar size={18} className="mr-2" />
          Ver Todos os Eventos
        </button>
      </div>
    </div>
  );
};