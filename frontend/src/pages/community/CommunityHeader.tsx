import React from 'react';
import { Edit, Share2 } from 'lucide-react';

export const CommunityHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 pb-32 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-xl bg-white shadow-lg flex items-center justify-center">
            <span className="text-3xl font-bold text-green-600">HU</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Horta Urbana</h1>
              <button className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Edit size={16} />
              </button>
            </div>
            <p className="text-green-50 mt-1">@horta.urbana</p>
            <div className="flex items-center space-x-4 mt-4">
              <button className="px-4 py-1.5 bg-white text-green-700 rounded-full text-sm font-medium hover:bg-green-50 transition-colors">
                Seguir Comunidade
              </button>
              <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};