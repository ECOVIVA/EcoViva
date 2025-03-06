import React, { useEffect, useState } from 'react';
import { useCheckInStore } from '../store/checkInStore';
import { Leaf } from 'lucide-react';

interface CheckInBubbleProps {
  userId: string;
  onCheckIn: () => void;
  hasCheckedInToday: boolean;
}

const CheckInBubble: React.FC<CheckInBubbleProps> = ({ userId, onCheckIn, hasCheckedInToday }) => {
  const { getCheckInProgress, getCheckInStreak } = useCheckInStore();
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setProgress(getCheckInProgress(userId));
    setStreak(getCheckInStreak(userId));
  }, [userId, getCheckInProgress, getCheckInStreak, hasCheckedInToday]);

  const handleCheckIn = () => {
    if (hasCheckedInToday) return;
    
    setIsAnimating(true);
    onCheckIn();
    
    // Update progress after animation
    setTimeout(() => {
      setProgress(getCheckInProgress(userId));
      setStreak(getCheckInStreak(userId));
      setIsAnimating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-6">
        <div 
          className={`w-64 h-64 rounded-full flex items-center justify-center 
                     bg-gradient-to-br from-green-100 to-green-300 
                     shadow-lg relative overflow-hidden
                     ${isAnimating ? 'animate-pulse' : ''}`}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-green-500 transition-all duration-1000"
            style={{ height: `${progress}%`, opacity: 0.7 }}
          />
          
          <div className="z-10 flex flex-col items-center">
            <Leaf className={`h-16 w-16 ${hasCheckedInToday ? 'text-green-800' : 'text-green-600'}`} />
            <span className="text-2xl font-bold text-green-800 mt-2">
              {progress}%
            </span>
            <span className="text-sm text-green-700">
              {streak} dias seguidos
            </span>
          </div>
        </div>
        
        {/* Decorative leaves */}
        <div className="absolute -top-4 -left-4 w-12 h-12 text-green-500 transform rotate-45">
          <Leaf />
        </div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 text-green-500 transform -rotate-45">
          <Leaf />
        </div>
      </div>
      
      <button
        onClick={handleCheckIn}
        disabled={hasCheckedInToday}
        className={`px-6 py-3 rounded-full font-semibold text-white shadow-md
                  transition-all transform hover:scale-105 active:scale-95
                  ${hasCheckedInToday 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'}`}
      >
        {hasCheckedInToday ? 'Já reciclou hoje!' : 'Registrar Reciclagem'}
      </button>
      
      {hasCheckedInToday && (
        <p className="mt-3 text-green-700 text-center">
          Parabéns! Volte amanhã para continuar sua jornada sustentável.
        </p>
      )}
    </div>
  );
};

export default CheckInBubble;