import React from 'react';
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-900/100 text-white pt-12 pb-6 z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-green-300" />
              <span className="text-xl font-bold">EcoViva</span>
            </div>
            <p className="text-green-100 mb-4">
              Transformando o mundo através da reciclagem e sustentabilidade, um check-in de cada vez.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-green-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-green-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-green-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-300">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-100 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-green-100 hover:text-white transition-colors">
                  Fórum
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-green-100 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <a href="#about" className="text-green-100 hover:text-white transition-colors">
                  Sobre Nós
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-300">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-300 mt-0.5" />
                <span className="text-green-100">Av. Verde, 123, Jardim Ecológico, São Paulo - SP</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-300" />
                <span className="text-green-100">(11) 9876-5432</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-300" />
                <span className="text-green-100">contato@ecoviva.com.br</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-green-900 mt-8 pt-6 text-center text-green-300">
          <p>&copy; {new Date().getFullYear()} EcoViva. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;