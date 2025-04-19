import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import api from '../services/API/axios';
import routes from '../services/API/routes';

interface LikeButtonProps {
  threadSlug: string;
  liked: boolean;
  likesCount: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ threadSlug, liked: initialLiked, likesCount: initialCount }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [animating, setAnimating] = useState(false);
  
  const handleLike = async () => {
    try {
      setAnimating(true);
      const endpoint = liked 
        ? routes.forum.thread.unlike.replace(':slug', threadSlug)
        : routes.forum.thread.like.replace(':slug', threadSlug);
      
      const response = await api.post(endpoint);
      
      if (response.status === 200 || response.status === 201) {
        setLiked(!liked);
        setLikesCount(prev => liked ? prev - 1 : prev + 1);
        
        // Create floating hearts if liking
        if (!liked) {
          createFloatingHearts();
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setTimeout(() => setAnimating(false), 500);
    }
  };
  
  const createFloatingHearts = () => {
    const container = document.createElement('div');
    container.className = 'floating-hearts-container';
    document.body.appendChild(container);
    
    // Position container near the like button
    const button = document.getElementById(`like-button-${threadSlug}`);
    if (button) {
      const rect = button.getBoundingClientRect();
      container.style.position = 'fixed';
      container.style.left = `${rect.left + rect.width / 2}px`;
      container.style.top = `${rect.top}px`;
      container.style.pointerEvents = 'none';
      
      // Create multiple hearts
      for (let i = 0; i < 6; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '❤️';
        
        // Random horizontal direction
        const leftOffset = Math.random() * 100 - 50;
        
        // Add styles
        heart.style.position = 'absolute';
        heart.style.fontSize = `${Math.random() * 10 + 15}px`;
        heart.style.opacity = '1';
        heart.style.transform = 'scale(0)';
        heart.style.left = `${leftOffset}px`;
        heart.style.top = '0';
        heart.style.transformOrigin = 'center center';
        heart.style.animation = `float-up ${Math.random() * 1 + 1.5}s forwards`;
        heart.style.animationDelay = `${Math.random() * 0.5}s`;
        
        container.appendChild(heart);
      }
      
      // Clean up after animation
      setTimeout(() => {
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }, 3000);
    }
  };

  return (
    <button 
      id={`like-button-${threadSlug}`}
      className={`like-button ${liked ? 'liked' : ''} ${animating ? 'animating' : ''}`}
      onClick={handleLike}
      aria-label={liked ? 'Descurtir' : 'Curtir'}
    >
      <Heart className="heart-icon" />
      <span className="like-count">{likesCount}</span>
    </button>
  );
};

export default LikeButton;