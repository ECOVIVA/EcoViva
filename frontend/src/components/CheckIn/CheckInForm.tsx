import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface CheckInFormProps {
  onSubmit: (comment: string) => void;
}

export const CheckInForm: React.FC<CheckInFormProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Compartilhe suas ações sustentáveis..."
          className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
        />
        
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50"
            disabled={!comment.trim()}
          >
            <Send className="w-5 h-5" />
            Registrar Check-in
          </button>
        </div>
      </div>
    </form>
  );
};