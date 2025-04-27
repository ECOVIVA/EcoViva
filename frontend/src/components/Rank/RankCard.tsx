import React from 'react';
import { Rank } from '../../types/types';

interface RankCardProps {
  rank: Rank;
  isCurrentRank: boolean;
  progress: number;
}

export const RankCard: React.FC<RankCardProps> = ({ rank, isCurrentRank, progress }) => {
  return (
    <div
      className={`relative p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
        isCurrentRank ? 'bg-gradient-to-br from-green-100 to-green-200 shadow-lg scale-105' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
          style={{ backgroundColor: rank.color }}
        >
          {rank.id}
        </div>
        <div>
          <h3 className="font-bold text-lg">{rank.name}</h3>
          <p className={`text-sm ${
            rank.difficulty === 'Easy' ? 'text-green-600' :
            rank.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {rank.difficulty}
          </p>
        </div>
      </div>
      {isCurrentRank && (
        <div className="mt-3">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {progress}% até o próximo rank
          </p>
        </div>
      )}
    </div>
  );
};