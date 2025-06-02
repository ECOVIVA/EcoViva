import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <a href="#" className="hover:text-green-700 transition-colors">Sobre</a>
            <a href="#" className="hover:text-green-700 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-green-700 transition-colors">Termos</a>
            <a href="#" className="hover:text-green-700 transition-colors">Diretrizes</a>
            <a href="#" className="hover:text-green-700 transition-colors">Central de Ajuda</a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-500">
          <p>© 2025 Ecoviva. Todos os direitos reservados.</p>
          <p className="mt-2 md:mt-0">Construindo comunidades sustentáveis juntos.</p>
        </div>
      </div>
    </footer>
  );
};