import { useState, useEffect } from 'react';
import { CheckInForm } from '../components/CheckInForm';
import { CheckInHistory } from '../components/CheckInHistory';
import { CheckInBubble } from '../components/CheckInBubble';
import { RankCarousel } from '../components/RankCarousel';
import { ranks } from './data/ranks';
import { CheckIn, UserProgress } from '../types/types';
import AuthGuardian from '@/components/AuthGuardian';

function App() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    currentXP: 0,
    currentRank: 1,
    checkIns: [],
  });

  const getCurrentRank = () => {
    return ranks.find(rank => rank.id === userProgress.currentRank)!;
  };

  const getNextRank = () => {
    return ranks.find(rank => rank.id === userProgress.currentRank + 1);
  };

  const getXPForCurrentRank = () => {
    const rank = getCurrentRank();
    if (rank.difficulty === 'Easy') return 50;
    if (rank.difficulty === 'Medium') return 25;
    return 10;
  };

  const calculateProgress = (rankId: number) => {
    const rank = ranks.find(r => r.id === rankId)!;
    const nextRank = ranks.find(r => r.id === rank.id + 1);
    if (!nextRank) return 100;

    const xpInCurrentLevel = userProgress.currentXP - rank.xpRequired;
    const xpNeededForNextLevel = nextRank.xpRequired - rank.xpRequired;
    return Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100));
  };

  // Fetch Bubble data when the component is mounted
  useEffect(() => {
    const fetchBubbleData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/bubble/profile/`, {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const bubble = await response.json();
          setUserProgress({
            currentXP: bubble.progress,
            currentRank: bubble.rank.id,
            checkIns: bubble.check_ins || [],
          });
        } else {
          console.error("Erro ao buscar dados da bolha.");
        }
      } catch (error) {
        console.error("Erro ao conectar com a API:", error);
      }
    };

    fetchBubbleData();
  }, []);

  const handleCheckIn = async (comment: string) => {
    const response = await fetch(`http://localhost:8000/api/users/bubble/check-in/create/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment }),
      credentials: 'include'
    });

    if (response.ok) {
      const newCheckIn: CheckIn = await response.json();
      setUserProgress(prev => ({
        ...prev,
        currentXP: prev.currentXP + newCheckIn.xp_earned,
        checkIns: [newCheckIn, ...prev.checkIns],
      }));
    } else {
      const error = await response.text();
      console.error(`Erro ao realizar check-in: ${error}`);
    }
  };

  const nextRank = getNextRank();

  return (
    <AuthGuardian>
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Registro de Check-in Sustentável
          </h1>
          <p className="text-lg text-gray-600">
            Registre suas ações sustentáveis e evolua sua jornada verde
          </p>
        </header>

        <div className="max-w-4xl mx-auto mb-12">
          <CheckInBubble
            currentXP={userProgress.currentXP}
            nextLevelXP={nextRank ? nextRank.xpRequired : getCurrentRank().xpRequired}
            currentRankName={getCurrentRank().name}
            xpToEarn={getXPForCurrentRank()}
          />
          <div className="mt-8">
            <CheckInForm onSubmit={handleCheckIn} />
          </div>
        </div>

        <div className="space-y-8">
          <RankCarousel
            ranks={ranks}
            currentRank={userProgress.currentRank}
            calculateProgress={calculateProgress}
          />

          <CheckInHistory checkIns={userProgress.checkIns} />
        </div>
      </div>
    </div>
    </AuthGuardian>
  );
}

export default App;
