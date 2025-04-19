import { useState } from 'react';
import { Heart } from 'lucide-react';
import api from '../services/API/axios';
import routes from '../services/API/routes';

const LikeButton = ({ threadSlug, liked, likesCount }: {threadSlug: string, liked: boolean, likesCount: number}) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [count, setCount] = useState(likesCount);

  const toggleLike = async () => {
    try {
      const res = await api.post(routes.forum.thread.like(threadSlug));
      const newLiked = res.data.liked;
      setIsLiked(newLiked);
      setCount((prev: number) => prev + (newLiked ? 1 : -1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={toggleLike} className="flex items-center space-x-1 text-gray-500 hover:text-green-600">
      <Heart className={`h-5 w-5 ${isLiked ? 'fill-green-500' : ''}`} />
      <span>{count}</span>
    </button>
  );
};

export default LikeButton;