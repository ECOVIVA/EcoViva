import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, Globe } from 'lucide-react';
import { Post } from '../../src/types/typesCM';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
            {post.isCommunityPost ? (
              <span className="text-sm font-medium text-green-700">{post.author.charAt(0)}</span>
            ) : (
              <span className="text-sm font-medium text-green-700">{post.author.split(' ').map(n => n[0]).join('')}</span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{post.author}</h3>
            <div className="flex items-center text-xs text-gray-500">
              <span>{post.timestamp}</span>
              <span className="mx-1">•</span>
              <Globe size={12} className="mr-1" />
              <span>Público</span>
            </div>
          </div>
        </div>
        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <MoreHorizontal size={18} className="text-gray-500" />
        </button>
      </div>
      
      <div className="px-4 pb-3">
        <p className="text-gray-800 mb-3">{post.content}</p>
        {post.image && (
          <div className="rounded-lg overflow-hidden bg-gray-100 -mx-4">
            <img src={post.image} alt="Post" className="w-full h-auto object-cover" />
          </div>
        )}
      </div>
      
      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <Heart size={10} className="text-white" />
          </div>
          <span>{post.likes + (isLiked ? 1 : 0)}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{post.comments} comentários</span>
          <span>{post.shares} compartilhamentos</span>
        </div>
      </div>
      
      <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-colors ${
            isLiked 
              ? 'text-green-600' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span className="text-sm">Curtir</span>
        </button>
        
        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-50 transition-colors">
          <MessageSquare size={18} />
          <span className="text-sm">Comentar</span>
        </button>
        
        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-50 transition-colors">
          <Share2 size={18} />
          <span className="text-sm">Compartilhar</span>
        </button>
        
        <button 
          onClick={() => setIsSaved(!isSaved)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition-colors ${
            isSaved 
              ? 'text-green-600' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          <span className="text-sm">Salvar</span>
        </button>
      </div>
    </div>
  );
};