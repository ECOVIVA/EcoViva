import { ReactNode } from "react";

// types/types.ts
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  bio?: string
  photo?: string;
  interests?: string[];
  role?: string;
}

export interface Rank {
  description?: ReactNode;
  icon?: ReactNode;
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  color: string;
}

export interface CheckIn {
  bubble: number;
  id: number;
  description: string;
  created_at: string;
  xp_earned: number;
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


export interface Threads {
  id: string;
  slug: string;
  author: User;
  title: string;
  content: string;
  created_at: string;
  updated_at: string
  likes: number;
  tags?: string[];
  posts?: Posts[];
}

export interface Posts {
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

