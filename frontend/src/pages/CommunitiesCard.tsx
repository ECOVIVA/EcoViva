import React from 'react';
import { Plus } from 'lucide-react';

export const CommunitiesCard: React.FC = () => {
  const suggestedCommunities = [
    { name: 'Ação Climática', members: 12482, image: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg' },
    { name: 'Vida Verde', members: 8754, image: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg' },
    { name: 'Conservação Oceânica', members: 5231, image: 'https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg' }
  ];
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Comunidades Sugeridas</h3>
      </div>
      
      <div className="p-2">
        {suggestedCommunities.map((community, index) => (
          <div key={index} className="p-2 hover:bg-gray-50 rounded-md transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-md overflow-hidden bg-green-100">
                <img 
                  src={community.image} 
                  alt={community.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{community.name}</h4>
                <p className="text-xs text-gray-500">{community.members.toLocaleString()} membros</p>
              </div>
              <button className="p-1.5 rounded-full bg-green-50 hover:bg-green-100 text-green-700 transition-colors">
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3">
        <button className="w-full py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors font-medium">
          Descobrir Mais Comunidades
        </button>
      </div>
    </div>
  );
};