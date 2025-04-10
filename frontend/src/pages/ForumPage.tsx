import React, { useEffect, useState } from 'react';
import { MessageSquare, Heart, Send, Plus } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import api from '../services/API/axios';
import routes from '../services/API/routes';
import { Threads } from '../types/types';

const ForumPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [threads, setThreads] = useState<Threads[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const threadsApi = async () => {
      try {
        const response = await api.get(routes.forum.thread.list);
        if (response.status === 200) {
          setThreads(response.data);
        } else {
          console.error(response.data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    threadsApi();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-green-800">Fórum da Comunidade</h1>
              <p className="text-green-700">
                Compartilhe ideias, dicas e experiências sobre sustentabilidade
              </p>
            </div>

            {isAuthenticated && (
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="h-5 w-5 mr-2" />
                Nova Publicação
              </button>
            )}
          </div>

          {/* Formulário de nova publicação */}
          {isAuthenticated && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Criar Nova Publicação</h2>

              <form>
                <div className="mb-4">
                  <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    id="postTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
                    placeholder="Compartilhe suas ideias, dicas ou perguntas..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
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

          {/* Lista de publicações */}
          <div className="space-y-8">
            {threads.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    {post.author.photo ? (
                      <img
                        src={`http://localhost:8000/${post.author.photo}`}
                        alt={post.author.username}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-800 font-semibold">
                          {post.author.username.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-800">{post.author.username}</h3>
                      <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-green-800 mb-3">{post.title}</h2>
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600">
                      <Heart className="h-5 w-5" />
                      <span>{post.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
