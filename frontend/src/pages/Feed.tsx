import React, { useState } from 'react';
import { PostCard } from './PostCard';
import { CreatePostBox } from './CreatePostBox';
import { mockPosts } from '../pages/data/mockData';

export const Feed: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  return (
    <div className="flex-1 max-w-2xl mx-auto py-4 px-4 md:px-6">
      <div className="mb-4">
        <CreatePostBox />
      </div>
      
      <div className="mb-4 border-b border-gray-200">
        <div className="flex space-x-1">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'all' 
                ? 'text-green-600 border-b-2 border-green-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Todas as Publicações
          </button>
          <button 
            onClick={() => setActiveTab('communities')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'communities' 
                ? 'text-green-600 border-b-2 border-green-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Comunidades
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'users' 
                ? 'text-green-600 border-b-2 border-green-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Usuários
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {mockPosts
          .filter(post => {
            if (activeTab === 'all') return true;
            if (activeTab === 'communities') return post.isCommunityPost;
            if (activeTab === 'users') return !post.isCommunityPost;
            return true;
          })
          .map(post => (
            <PostCard key={post.id} post={post} />
          ))
        }
      </div>
    </div>
  );
};