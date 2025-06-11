import React, { useState, useEffect } from 'react';
import { Leaf, Sparkles } from 'lucide-react';

interface CreateCommunityTransitionProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const CreateCommunityTransition: React.FC<CreateCommunityTransitionProps> = ({ 
  isOpen, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const messages = [
    "Ficamos muito feliz em vê-lo aqui...",
    "Obrigado(a) por contribuir e nos ajudar a criar um mundo mais sustentável."
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setShowProgress(false);
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    // First message appears after 500ms
    timeouts.push(setTimeout(() => {
      setCurrentStep(1);
    }, 500));

    // Second message appears after 3 seconds
    timeouts.push(setTimeout(() => {
      setCurrentStep(2);
    }, 3000));

    // Progress bar starts after 5.5 seconds
    timeouts.push(setTimeout(() => {
      setShowProgress(true);
    }, 5500));

    // Complete transition after 8 seconds
    timeouts.push(setTimeout(() => {
      onComplete();
    }, 8000));

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-50 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-50 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-yellow-50 rounded-full opacity-25 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
        {/* Icon with animation */}
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Leaf size={32} className="text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
              <Sparkles size={16} className="text-white" />
            </div>
          </div>
        </div>

        {/* Messages with fade-in animation */}
        <div className="space-y-8 min-h-[120px] flex flex-col justify-center">
          {currentStep >= 1 && (
            <h1 
              className={`text-3xl md:text-4xl font-bold text-gray-800 transition-all duration-1000 transform ${
                currentStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {messages[0]}
            </h1>
          )}
          
          {currentStep >= 2 && (
            <p 
              className={`text-xl md:text-2xl text-gray-600 font-medium transition-all duration-1000 delay-300 transform ${
                currentStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {messages[1]}
            </p>
          )}
        </div>

        {/* Progress bar with Windows-style animation */}
        {showProgress && (
          <div className="mt-16">
            <div className="w-full max-w-md mx-auto">
              <div className="mb-4">
                <p className="text-sm text-gray-500 font-medium">Preparando sua experiência...</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-progress-bar"></div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Carregando recursos</span>
                <span>Quase pronto...</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-green-300 rounded-full opacity-60 animate-float-${i % 3 + 1}`}
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i * 10)}%`,
                animationDelay: `${i * 0.5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes progress-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(360deg); }
        }
        
        .animate-progress-bar {
          animation: progress-bar 2.5s ease-out forwards;
        }
        
        .animate-float-1 {
          animation: float-1 4s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float-2 5s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float-3 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};