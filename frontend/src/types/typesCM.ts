export interface Post {
  id: number;
  author: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isCommunityPost: boolean;
}