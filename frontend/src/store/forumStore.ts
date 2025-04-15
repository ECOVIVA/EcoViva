import { create } from 'zustand';
import { ForumPost, Comment } from '../types/types';
import { persist } from 'zustand/middleware';

interface ForumState {
  posts: ForumPost[];
  addPost: (userId: string, userName: string, userAvatar: string | undefined, title: string, content: string) => void;
  addComment: (postId: string, userId: string, userName: string, userAvatar: string | undefined, content: string) => void;
  likePost: (postId: string) => void;
}

// Initial mock data
const initialPosts: ForumPost[] = [
  {
    id: '1',
    userId: '1',
    userName: 'João Silva',
    userAvatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
    title: 'Dicas para reciclagem de plástico',
    content: 'Olá pessoal! Queria compartilhar algumas dicas sobre como reciclar plástico corretamente. Primeiro, sempre lave as embalagens antes de descartar...',
    date: '2023-05-15T10:30:00Z',
    likes: 12,
    comments: [
      {
        id: '101',
        userId: '2',
        userName: 'Maria Oliveira',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
        content: 'Ótimas dicas! Também recomendo separar por tipo de plástico quando possível.',
        date: '2023-05-15T14:22:00Z'
      }
    ]
  },
  {
    id: '2',
    userId: '2',
    userName: 'Maria Oliveira',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
    title: 'Evento de limpeza de praia no próximo sábado',
    content: 'Pessoal, estou organizando um evento de limpeza na Praia do Futuro neste sábado. Quem puder participar será muito bem-vindo! Vamos nos encontrar às 8h da manhã...',
    date: '2023-05-10T09:15:00Z',
    likes: 24,
    comments: []
  }
];

export const useForumStore = create<ForumState>()(
  persist(
    (set) => ({
      posts: initialPosts,
      
      addPost: (userId, userName, userAvatar, title, content) => {
        const newPost: ForumPost = {
          id: Date.now().toString(),
          userId,
          userName,
          userAvatar,
          title,
          content,
          date: new Date().toISOString(),
          likes: 0,
          comments: []
        };
        
        set((state) => ({
          posts: [newPost, ...state.posts]
        }));
      },
      
      addComment: (postId, userId, userName, userAvatar, content) => {
        const newComment: Comment = {
          id: Date.now().toString(),
          userId,
          userName,
          userAvatar,
          content,
          date: new Date().toISOString()
        };
        
        set((state) => ({
          posts: state.posts.map((post) => 
            post.id === postId
              ? { ...post, comments: [...post.comments, newComment] }
              : post
          )
        }));
      },
      
      likePost: (postId) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? { ...post, likes: post.likes + 1 }
              : post
          )
        }));
      }
    }),
    {
      name: 'ecoviva-forum'
    }
  )
);