import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Community } from '@/types/community';
import api from '../services/API/axios';
import routes from '../services/API/routes';

export const CommunitiesCard: React.FC = () => {
  const [communities, setCommunity] = useState<Community[] | null>(null)

   useEffect(() => {
    const fetchCommunity = async() => {
      try{
        const response = await api.get(routes.community.list)
       if (response.status === 200) {
        const data = response.data
        setCommunity(data)
      } else {
        console.error("Erro ao buscar dados da bolha.")
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error)
    }
  }
    
    fetchCommunity()
  }, [])
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Comunidades Sugeridas</h3>
      </div>
      
      <div className="p-2">
        {communities?.map((community, index) => (
          <div key={index} className="p-2 hover:bg-gray-50 rounded-md transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-md overflow-hidden bg-green-100">
                <img 
                  src={community.icon} 
                  alt={community.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{community.name}</h4>
                <p className="text-xs text-gray-500">{community.members_count.toLocaleString()} membros</p>
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