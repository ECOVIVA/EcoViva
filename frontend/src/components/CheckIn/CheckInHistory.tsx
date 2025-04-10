import React from 'react';
import { Clock, Trophy, MessageSquare } from 'lucide-react';
import { CheckIn } from '../types/types';

interface CheckInHistoryProps {
  checkIns: CheckIn[];
}

export const CheckInHistory: React.FC<CheckInHistoryProps> = ({ checkIns }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="text-green-600" />
        Histórico de Check-ins
      </h2>
      <div className="space-y-4">
        {checkIns.map(checkIn => (
          <div
            key={checkIn.id}
            className="p-4 bg-gray-50 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            <p className="text-gray-800">{checkIn.description}</p>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(checkIn.created_at).toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <Trophy className="w-4 h-4" />
                +{checkIn.xp_earned} XP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};