import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const ComingSoon: React.FC = () => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [phrase, setPhrase] = useState(0);
  
  const phrases = [
    "Transformando o planeta em um lugar melhor",
    "Tecnologia e sustentabilidade em harmonia",
    "O futuro é verde e digital",
    "Inovação para um mundo mais sustentável"
  ];

  useEffect(() => {
    // Glitch effect trigger
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 5000);
    
    // Phrase rotation
    const phraseInterval = setInterval(() => {
      setPhrase(prev => (prev + 1) % phrases.length);
    }, 4000);
    
    return () => {
      clearInterval(glitchInterval);
      clearInterval(phraseInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6 relative z-10 pt-[-50]">
      <div className={`mb-8 transition-all duration-300 ${glitchActive ? 'translate-x-[2px] skew-x-1' : ''}`}>
        <Logo />
      </div>
      
      <div className="relative mb-16">
        <h1 
          className={`text-7xl md:text-9xl font-bold tracking-tighter bg-clip-text text-transparent 
          bg-gradient-to-b from-emerald-100 to-green-400 
          ${glitchActive ? 'translate-x-[3px] skew-x-2' : ''}`}
        >
          EM BREVE
        </h1>
        <div className="absolute -inset-1 bg-gradient-to-r from-green-300 via-emerald-500 to-teal-300 opacity-30 blur-xl rounded-lg -z-10"></div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <p className="text-xl md:text-2xl font-light mb-12 text-emerald-50 leading-relaxed tracking-wide opacity-80 transition-opacity duration-500">
          {phrases[phrase]}
        </p>
        
        <div className="flex justify-center">
          <div className="relative group">
          <Link to="/HistorySection">
            <button className="bg-emerald-500/20 hover:bg-emerald-500/30 backdrop-blur-sm border border-emerald-500/30 text-emerald-100 py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              <span className="relative z-10">Saiba mais sobre nossa missão</span>
              <span className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/30 to-green-400/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            </button>
            </Link>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-teal-400/30 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-900/30 border border-emerald-500/20 backdrop-blur-sm text-emerald-300 cursor-pointer hover:bg-emerald-800/40 transition-all duration-300 hover:scale-110">
          <span className="text-xl">𝕀</span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
