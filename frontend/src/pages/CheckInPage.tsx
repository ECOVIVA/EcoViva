import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCheckInStore } from '../store/checkInStore';
import CheckInBubble from '../components/CheckInBubble';
import { Calendar, Award, TrendingUp } from 'lucide-react';

const CheckInPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { addCheckIn, getTodayCheckIn, getCheckInStreak, loadUserCheckIns } = useCheckInStore();
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    if (user?.id) {
      loadUserCheckIns(user.id);
      const todayCheckIn = getTodayCheckIn(user.id);
      setHasCheckedInToday(!!todayCheckIn);
    }
  }, [user, loadUserCheckIns, getTodayCheckIn]);
  
  const handleCheckIn = () => {
    if (!user?.id || hasCheckedInToday) return;
    
    addCheckIn(user.id);
    setHasCheckedInToday(true);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              Registre Sua Reciclagem Diária
            </h1>
            <p className="text-lg text-green-700">
              Cada check-in representa seu compromisso com um planeta mais sustentável.
            </p>
          </div>
          
          {showSuccess && (
            <div className="mb-8 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg text-center animate-pulse">
              <p className="font-semibold">Parabéns! Seu check-in foi registrado com sucesso!</p>
              <p>Continue reciclando e fazendo a diferença.</p>
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
                <CheckInBubble 
                  userId={user?.id || ''} 
                  onCheckIn={handleCheckIn}
                  hasCheckedInToday={hasCheckedInToday}
                />
              </div>
              
              <div className="md:w-1/2 md:pl-8 border-t md:border-t-0 md:border-l border-gray-200 pt-8 md:pt-0 md:pl-8">
                <h3 className="text-xl font-semibold text-green-800 mb-6">
                  Seu Impacto Ambiental
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Check-ins Consecutivos</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {user?.id ? getCheckInStreak(user.id) : 0} dias
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">CO₂ Economizado</h4>
                      <p className="text-2xl font-bold text-green-600">
                        ~{user?.id ? getCheckInStreak(user.id) * 2.5 : 0} kg
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Nível de Sustentabilidade</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {user?.id && getCheckInStreak(user.id) >= 30 
                          ? 'Mestre Ecológico' 
                          : user?.id && getCheckInStreak(user.id) >= 15
                            ? 'Guardião da Natureza'
                            : user?.id && getCheckInStreak(user.id) >= 7
                              ? 'Defensor Ambiental'
                              : 'Iniciante Verde'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-800 text-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-green-300 mb-4">
              Dicas para Reciclagem Eficiente
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="text-green-300 font-bold">•</span>
                <span>Lave as embalagens antes de reciclar para evitar contaminação.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-300 font-bold">•</span>
                <span>Separe os materiais por tipo: papel, plástico, vidro e metal.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-300 font-bold">•</span>
                <span>Remova tampas e rótulos quando possível.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-300 font-bold">•</span>
                <span>Amasse latas e caixas para economizar espaço.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-300 font-bold">•</span>
                <span>Verifique os pontos de coleta seletiva mais próximos de você.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;