import { ReactNode } from "react";

// types/types.ts
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string;
  role?: string;
}

export interface Rank {
  description: ReactNode;
  icon: ReactNode;
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpRequired: number;
  color: string;
}

export interface CheckIn {
  date: string;
  userId: string;
  id: string;
  comment: string;
  timestamp: Date;
  xpEarned: number;
}

export interface UserProgress {
  currentXP: number;
  currentRank: number;
  checkIns: CheckIn[];
}

export interface Bubble {
  progress: number; // Progresso do usuário (porcentagem de XP)
  rank: Rank; // Rank atual do usuário
  checkIns: CheckIn[]; // Lista de check-ins feitos pelo usuário
}


export interface ForumPost {
  tags: any;
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
}


export interface ser {
  id: string;
  username: string; 
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  photos: string;
}


export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initAuth: () => void;
  register: (formData: any) => Promise<boolean>;
}

