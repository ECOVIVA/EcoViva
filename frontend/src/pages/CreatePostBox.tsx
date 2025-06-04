import React, { useState } from 'react';
import { Image, MessageSquare, Users, Smile, Calendar } from 'lucide-react';

export const CreatePostBox: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden shrink-0">
          <span className="text-sm font-medium text-green-700">JD</span>
        </div>
        <div className="flex-1">
          <div 
            onClick={() => setIsExpanded(true)}
            className={`border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-text w-full ${
              isExpanded ? 'hidden' : 'block'
            }`}
          >
            Compartilhe seus pensamentos com a comunidade...
          </div>
          
          {isExpanded && (
            <div className="space-y-3">
              <textarea 
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none" 
                rows={3}
                placeholder="Compartilhe seus pensamentos com a comunidade..."
                autoFocus
              ></textarea>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Image size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Users size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Smile size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Calendar size={18} className="text-gray-600" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="px-4 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors">
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};