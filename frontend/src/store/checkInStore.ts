import { create } from 'zustand';
import { CheckIn } from '../types';
import { persist } from 'zustand/middleware';

interface CheckInState {
  checkIns: CheckIn[];
  todayCheckIn: CheckIn | null;
  addCheckIn: (userId: string) => void;
  loadUserCheckIns: (userId: string) => void;
  getTodayCheckIn: (userId: string) => CheckIn | null;
  getCheckInStreak: (userId: string) => number;
  getCheckInProgress: (userId: string) => number;
}

export const useCheckInStore = create<CheckInState>()(
  persist(
    (set, get) => ({
      checkIns: [],
      todayCheckIn: null,
      
      addCheckIn: (userId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const existingCheckIn = get().checkIns.find(
          (ci) => ci.userId === userId && ci.date === today
        );
        
        if (existingCheckIn) {
          // User already checked in today
          return;
        }
        
        const newCheckIn: CheckIn = {
          id: Date.now().toString(),
          userId,
          date: today,
          count: 1,
        };
        
        set((state) => ({
          checkIns: [...state.checkIns, newCheckIn],
          todayCheckIn: newCheckIn,
        }));
      },
      
      loadUserCheckIns: (userId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const todayCheckIn = get().checkIns.find(
          (ci) => ci.userId === userId && ci.date === today
        ) || null;
        
        set({ todayCheckIn });
      },
      
      getTodayCheckIn: (userId: string) => {
        const today = new Date().toISOString().split('T')[0];
        return get().checkIns.find(
          (ci) => ci.userId === userId && ci.date === today
        ) || null;
      },
      
      getCheckInStreak: (userId: string) => {
        const userCheckIns = get().checkIns
          .filter((ci) => ci.userId === userId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (userCheckIns.length === 0) return 0;
        
        let streak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let lastDate = new Date(userCheckIns[0].date);
        lastDate.setHours(0, 0, 0, 0);
        
        // If the most recent check-in is not today or yesterday, streak is broken
        const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) return 0;
        
        for (let i = 1; i < userCheckIns.length; i++) {
          const currentDate = new Date(userCheckIns[i].date);
          currentDate.setHours(0, 0, 0, 0);
          
          const prevDate = new Date(userCheckIns[i - 1].date);
          prevDate.setHours(0, 0, 0, 0);
          
          const diffTime = prevDate.getTime() - currentDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            streak++;
          } else {
            break;
          }
        }
        
        return streak;
      },
      
      getCheckInProgress: (userId: string) => {
        const totalCheckIns = get().checkIns.filter((ci) => ci.userId === userId).length;
        // Progress is calculated as a percentage of 30 check-ins (one month)
        return Math.min(Math.round((totalCheckIns / 30) * 100), 100);
      },
    }),
    {
      name: 'ecoviva-checkins',
    }
  )
);