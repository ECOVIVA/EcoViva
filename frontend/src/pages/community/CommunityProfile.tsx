import React from 'react';
import { Users, Calendar, BookOpen, Settings, Share2, Bell } from 'lucide-react';
import { CommunityHeader } from './CommunityHeader';
import { CommunityTabs } from './CommunityTabs';
import { CommunityRooms } from './CommunityRooms';
import { CommunityMembers } from './CommunityMembers';

export const CommunityProfile: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('sobre');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-6 -mt-8">
          {/* Informações principais */}
          <div className="flex-1">
            <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="mt-6">
              {activeTab === 'sobre' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre a Comunidade</h3>
                  <p className="text-gray-600 mb-6">
                    Uma comunidade dedicada à promoção da agricultura urbana sustentável. 
                    Compartilhamos conhecimentos sobre cultivo de alimentos em espaços urbanos, 
                    técnicas de compostagem e permacultura.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Users className="text-green-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Membros</p>
                          <p className="text-lg font-semibold text-gray-900">12.482</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="text-green-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Salas Ativas</p>
                          <p className="text-lg font-semibold text-gray-900">8</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="text-green-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Eventos</p>
                          <p className="text-lg font-semibold text-gray-900">5</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'salas' && <CommunityRooms />}
              {activeTab === 'membros' && <CommunityMembers />}
            </div>
          </div>
          
          {/* Barra lateral */}
          <div className="lg:w-80 space-y-6">
            {/* Ações da comunidade */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Ações da Comunidade</h3>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Participar da Comunidade
                </button>
                <button className="w-full py-2 px-4 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center">
                  <Bell size={18} className="mr-2" />
                  Ativar Notificações
                </button>
                <button className="w-full py-2 px-4 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center">
                  <Share2 size={18} className="mr-2" />
                  Compartilhar
                </button>
              </div>
            </div>
            
            {/* Administradores */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Administradores</h3>
                {/* Mostrar apenas para admins */}
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Settings size={16} />
                </button>
              </div>
              <div className="space-y-4">
                {['Ana Silva', 'Carlos Santos', 'Marina Costa'].map((admin, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-green-700">
                        {admin.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{admin}</p>
                      <p className="text-xs text-gray-500">Administrador</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};