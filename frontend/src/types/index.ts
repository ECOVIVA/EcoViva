export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  date: string;
  count: number;
}

export interface ForumPost {
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