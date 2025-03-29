export interface Rank {
    id: number;
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    requiredXP: number;
    color: string;
    xpPerCheckIn: number;
  }
  
  export const ranks: Rank[] = [
    { id: 1, name: 'Iniciante Verde', difficulty: 'Easy', requiredXP: 100, color: '#34D399', xpPerCheckIn: 50 },
    { id: 2, name: 'Guardião do Eco', difficulty: 'Easy', requiredXP: 150, color: '#10B981', xpPerCheckIn: 50 },
    { id: 3, name: 'Protetor do Planeta', difficulty: 'Easy', requiredXP: 200, color: '#059669', xpPerCheckIn: 50 },
    { id: 4, name: 'Defensor da Natureza', difficulty: 'Medium', requiredXP: 300, color: '#3B82F6', xpPerCheckIn: 25 },
    { id: 5, name: 'Herói Sustentável', difficulty: 'Medium', requiredXP: 400, color: '#2563EB', xpPerCheckIn: 25 },
    { id: 6, name: 'Sustentável Líder', difficulty: 'Medium', requiredXP: 500, color: '#1D4ED8', xpPerCheckIn: 25 },
    { id: 7, name: 'Líder Verde', difficulty: 'Hard', requiredXP: 700, color: '#8B5CF6', xpPerCheckIn: 10 },
    { id: 8, name: 'Guardião da Floresta', difficulty: 'Hard', requiredXP: 800, color: '#7C3AED', xpPerCheckIn: 10 },
    { id: 9, name: 'Protetor Global', difficulty: 'Hard', requiredXP: 1000, color: '#6D28D9', xpPerCheckIn: 10 },
  ];
  
  export const getCurrentRank = (xp: number): Rank => {
    // Start from the highest rank and work down
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (xp >= ranks[i].requiredXP) {
        return ranks[i];
      }
    }
    // Default to first rank if xp is less than all required XPs
    return ranks[0];
  };
  
  export const getNextRank = (currentXP: number): Rank | null => {
    for (let i = 0; i < ranks.length; i++) {
      if (currentXP < ranks[i].requiredXP) {
        return ranks[i];
      }
    }
    // Return null if at max rank
    return null;
  };
  
  export const getXPProgress = (currentXP: number): number => {
    const currentRank = getCurrentRank(currentXP);
    const nextRank = getNextRank(currentXP);
    
    if (!nextRank) {
      return 100; // Max rank reached
    }
    
    const rankStartXP = currentRank.id > 1 ? ranks[currentRank.id - 2].requiredXP : 0;
    const xpInCurrentRank = currentXP - rankStartXP;
    const xpNeededForNextRank = nextRank.requiredXP - rankStartXP;
    
    return Math.min(100, Math.round((xpInCurrentRank / xpNeededForNextRank) * 100));
  };
  
  export const getDifficultyColor = (difficulty: string): string => {
    switch(difficulty) {
      case 'Easy':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-blue-500';
      case 'Hard':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };
  