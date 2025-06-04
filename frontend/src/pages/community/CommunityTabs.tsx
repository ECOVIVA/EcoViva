import React from 'react';
import { Layout, Users, Calendar, BookOpen } from 'lucide-react';

interface CommunityTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const CommunityTabs: React.FC<CommunityTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'sobre', label: 'Sobre', icon: Layout },
    { id: 'salas', label: 'Salas', icon: BookOpen },
    { id: 'eventos', label: 'Eventos', icon: Calendar },
    { id: 'membros', label: 'Membros', icon: Users },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon size={18} className="mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};