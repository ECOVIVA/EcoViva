import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useForumStore } from '../store/forumStore';
import { MessageSquare, Heart, Send, Plus } from 'lucide-react';

const ForumPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { posts, addPost, addComment, likePost } = useForumStore();
  
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [commentContents, setCommentContents] = useState<Record<string, string>>({});
  
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      alert('Você precisa estar logado para publicar.');
      return;
    }
    
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('Preencha todos os campos.');
      return;
    }
    
    addPost(
      user.id,
      user.username,
      user.avatar,
      newPostTitle,
      newPostContent
    );
    
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPostForm(false);
  };
  
  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      alert('Você precisa estar logado para comentar.');
      return;
    }
    
    const content = commentContents[postId];
    
    if (!content || !content.trim()) {
      return;
    }
    
    addComment(
      postId,
      user.id,
      user.username,
      user.avatar,
      content
    );
    
    // Clear just this comment
    setCommentContents(prev => ({
      ...prev,
      [postId]: ''
    }));
  };
  
  const handleLikePost = (postId: string) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para curtir publicações.');
      return;
    }
    
    likePost(postId);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-green-800">
                Fórum da Comunidade
              </h1>
              <p className="text-green-700">
                Compartilhe ideias, dicas e experiências sobre sustentabilidade
              </p>
            </div>
            
            {isAuthenticated && (
              <button
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nova Publicação
              </button>
            )}
          </div>
          
          {showNewPostForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                Criar Nova Publicação
              </h2>
              
              <form onSubmit={handleAddPost}>
                <div className="mb-4">
                  <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    id="postTitle"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Digite um título para sua publicação"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-1">
                    Conteúdo
                  </label>
                  <textarea
                    id="postContent"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
                    placeholder="Compartilhe suas ideias, dicas ou perguntas..."
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Publicar
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="space-y-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    {post.userAvatar ? (
                      <img 
                        src={post.userAvatar} 
                        alt={post.userName} 
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-800 font-semibold">
                          {post.userName.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-semibold text-gray-800">{post.userName}</h3>
                      <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-green-800 mb-3">{post.title}</h2>
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-green-600"
                    >
                      <Heart className="h-5 w-5" />
                      <span>{post.likes}</span>
                    </button>
                    
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MessageSquare className="h-5 w-5" />
                      <span>{post.comments.length}</span>
                    </div>
                  </div>
                </div>
                
                {post.comments.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4">
                    <h4 className="font-medium text-gray-700 mb-3">Comentários</h4>
                    
                    <div className="space-y-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                          {comment.userAvatar ? (
                            <img 
                              src={comment.userAvatar} 
                              alt={comment.userName} 
                              className="w-8 h-8 rounded-full mt-1"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                              <span className="text-green-800 font-semibold text-sm">
                                {comment.userName.charAt(0)}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-gray-800">{comment.userName}</span>
                                <span className="text-xs text-gray-500">{formatDate(comment.date)}</span>
                              </div>
                              <p className="text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {isAuthenticated && (
                  <div className="border-t border-gray-100 p-4">
                    <form onSubmit={(e) => handleAddComment(post.id, e)}>
                      <div className="flex space-x-3">
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.username} 
                            className="w-8 h-8 rounded-full mt-1"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                            <span className="text-green-800 font-semibold text-sm">
                              {user?.username.charAt(0)}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={commentContents[post.id] || ''}
                            onChange={(e) => setCommentContents({
                              ...commentContents,
                              [post.id]: e.target.value
                            })}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Escreva um comentário..."
                          />
                          <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                          >
                            <Send className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {posts.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">Nenhuma publicação ainda</h3>
              <p className="text-gray-500">
                Seja o primeiro a compartilhar algo com a comunidade!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPage;