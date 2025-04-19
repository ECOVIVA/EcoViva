import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import api from '../services/API/axios';
import routes from '../services/API/routes';
import { Threads } from '../types/types';
import { useAuth } from '../components/Auth/AuthContext';
import LikeButton from '../components/LikeButton';

interface PostContent {
    thread: string
    content: string;
}

const ThreadDetailPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [thread, setThread] = useState<Threads | null>(null);
  const [postContent, setPostContent] = useState<PostContent>({
    thread: String(slug),
    content: ''
  });

  const [loadingReply, setLoadingReply] = useState(false);

  useEffect(() => {
    fetchThread();
  }, [slug]);

  const fetchThread = async () => {
    try {
      //@ts-ignore
      const response = await api.get(routes.forum.thread.detail(slug));
      if (response.status === 200) {
        setThread(response.data);
      } else {
        console.error(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.content.trim()) return;

    setLoadingReply(true);
    try {
      //@ts-ignore
      const response = await api.post(routes.forum.post.create, {
        content: postContent.content,
        thread: postContent.thread
      });
      if (response.status === 201) {
        setPostContent({...postContent, content: ""});
        fetchThread(); // Recarrega com nova resposta
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingReply(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!thread) {
    return <div className="text-center py-12 text-gray-500">Carregando publicação...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-green-600 hover:underline mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Voltar
          </button>

          <div className="flex items-start space-x-3 mb-4">
            {thread.author.photo ? (
              <img
                src={`http://localhost:8000/${thread.author.photo}`}
                alt={thread.author.username}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-800 font-semibold">
                  {thread.author.username.charAt(0)}
                </span>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-800">{thread.author.username}</h3>
              <p className="text-sm text-gray-500">{formatDate(thread.created_at)}</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-green-800 mb-4">{thread.title}</h1>

          <p className="text-gray-700 whitespace-pre-wrap mb-6">{thread.content}</p>

          {Number(thread.tags?.length) > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {thread.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 border-t pt-4 mb-8">
            <LikeButton threadSlug={thread.slug} liked={thread.liked} likesCount={thread.likes}/>
          </div>

          {/* Respostas */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-green-800 mb-4">Respostas</h2>

            {isAuthenticated && (
              <form onSubmit={handlePostSubmit} className="mb-6">
                <textarea
                  value={postContent.content}
                  onChange={(e) => setPostContent({...postContent, content: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[80px]"
                  placeholder="Escreva uma resposta..."
                  required
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={loadingReply}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {loadingReply ? 'Enviando...' : 'Responder'}
                  </button>
                </div>
              </form>
            )}

            {Number(thread.posts?.length) > 0 ? (
              <div className="space-y-4">
                {thread.posts?.map((post) => (
                  <div key={post.id} className="bg-green-50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-3 mb-2">
                      {post.author.photo ? (
                        <img
                          src={`http://localhost:8000/${post.author.photo}`}
                          alt={post.author.username}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-800 font-semibold text-sm">
                            {post.author.username.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-gray-700">{post.author.username}</span>
                      <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
                    </div>
                    <p className="text-gray-800">{post.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma resposta ainda. Seja o primeiro a comentar!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadDetailPage;
