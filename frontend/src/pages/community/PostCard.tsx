import type React from "react"
import { useState } from "react"
import {
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  MapPin,
  Target,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Camera,
  Send,
} from "lucide-react"
import type { Post } from "../../types/typesCM"

interface PostCardProps {
  post: Post
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isParticipating, setIsParticipating] = useState(false)
  const [showParticipationModal, setShowParticipationModal] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Maria Silva",
      content: "Acabei de plantar 5 mudas no meu quintal! 🌱",
      image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
      timestamp: "2h atrás",
      status: "pending", // pending, approved, rejected
      isOwner: false,
    },
    {
      id: 2,
      author: "João Santos",
      content: "Coletei 2kg de lixo na praia hoje! Vamos juntos salvar o planeta! 🌊",
      image: "https://images.pexels.com/photos/2547565/pexels-photo-2547565.jpeg",
      timestamp: "4h atrás",
      status: "approved",
      isOwner: false,
    },
  ])

  const isEventPost = !!post.eventData
  const isEventOwner = post.author === "Você" // Simular se é o dono do evento

  const handleParticipate = () => {
    setIsParticipating(true)
    setShowParticipationModal(false)
    // Aqui seria a lógica para adicionar o usuário aos participantes
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitComment = () => {
    if (newComment.trim() || selectedImage) {
      const comment = {
        id: Date.now(),
        author: "Você",
        content: newComment,
        image: selectedImage,
        timestamp: "agora",
        status: "pending" as const,
        isOwner: false,
      }
      setComments([comment, ...comments])
      setNewComment("")
      setSelectedImage("")
    }
  }

  const handleApproveComment = (commentId: number) => {
    setComments(
      comments.map((comment) => (comment.id === commentId ? { ...comment, status: "approved" as const } : comment)),
    )
  }

  const handleRejectComment = (commentId: number) => {
    setComments(
      comments.map((comment) => (comment.id === commentId ? { ...comment, status: "rejected" as const } : comment)),
    )
  }

  if (isEventPost) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {/* Header do Post */}
        <div className="p-6 pb-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {post.author.charAt(0)}
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <span className="font-semibold text-gray-900">{post.author}</span>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Organizador
                </span>
              </div>
              <div className="text-sm text-gray-500">{post.timestamp}</div>
            </div>
          </div>

          <div className="whitespace-pre-line text-gray-800 mb-4">{post.content}</div>
        </div>

        {/* Imagem do Evento */}
        {post.image && (
          <div className="relative">
            <img src={post.image || "/placeholder.svg"} alt="" className="w-full h-64 object-cover" />
            <div className="absolute top-4 left-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {post.eventData?.category}
              </span>
            </div>
          </div>
        )}

        {/* Detalhes do Evento - Design Melhorado */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-green-600" />
              {post.eventData?.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <Clock size={18} className="mr-3 text-green-600" />
                <div>
                  <div className="font-medium">{post.eventData?.date}</div>
                  <div className="text-sm text-gray-500">às {post.eventData?.time}</div>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin size={18} className="mr-3 text-blue-600" />
                <div>
                  <div className="font-medium">Local</div>
                  <div className="text-sm text-gray-500">{post.eventData?.location}</div>
                </div>
              </div>
            </div>

            {/* Metas do Evento */}
            {post.eventData?.goals && post.eventData.goals.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Target size={18} className="mr-2 text-purple-600" />
                  Metas do Evento
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {post.eventData.goals.map((goal) => (
                    <div key={goal.id} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="font-medium text-gray-900">{goal.title}</div>
                      <div className="text-sm text-gray-600">
                        Meta:{" "}
                        <span className="font-semibold text-green-600">
                          {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">30% concluído</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Participantes */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-700">
                <Users size={18} className="mr-2 text-blue-600" />
                <span className="font-medium">24 participantes confirmados</span>
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
                ))}
                <div className="w-8 h-8 bg-gray-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                  +19
                </div>
              </div>
            </div>

            {/* Botão de Participação */}
            {!isEventOwner && (
              <div className="flex gap-3">
                {!isParticipating ? (
                  <button
                    onClick={() => setShowParticipationModal(true)}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Participar do Evento
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-green-100 text-green-800 py-3 px-6 rounded-lg font-medium flex items-center justify-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Participando
                  </button>
                )}
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Compartilhar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Ações do Post */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between text-gray-500 text-sm pt-4 border-t border-gray-100">
            <button className="flex items-center hover:text-red-500 transition-colors">
              <Heart size={20} className={post.likes > 0 ? "fill-red-500 text-red-500" : ""} />
              <span className="ml-2">{post.likes}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center hover:text-blue-500 transition-colors"
            >
              <MessageCircle size={20} />
              <span className="ml-2">{comments.length}</span>
            </button>
            <button className="flex items-center hover:text-green-500 transition-colors">
              <Share2 size={20} />
              <span className="ml-2">{post.shares}</span>
            </button>
          </div>
        </div>

        {/* Seção de Comentários */}
        {showComments && (
          <div className="border-t border-gray-100 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Participações e Progresso</h4>

            {/* Formulário para Adicionar Comentário (apenas para participantes) */}
            {isParticipating && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">Compartilhe seu progresso</h5>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Conte como está contribuindo para o evento..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />

                {selectedImage && (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setSelectedImage("")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div>
                    <input
                      type="file"
                      id="comment-image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="comment-image"
                      className="flex items-center text-gray-600 hover:text-green-600 cursor-pointer"
                    >
                      <Camera size={20} className="mr-2" />
                      <span className="text-sm">Adicionar foto</span>
                    </label>
                  </div>
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() && !selectedImage}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={16} className="mr-2" />
                    Enviar
                  </button>
                </div>
              </div>
            )}

            {/* Lista de Comentários */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{comment.author}</div>
                        <div className="text-xs text-gray-500">{comment.timestamp}</div>
                      </div>
                    </div>

                    {/* Status da Participação */}
                    <div className="flex items-center">
                      {comment.status === "pending" && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Aguardando aprovação
                        </span>
                      )}
                      {comment.status === "approved" && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          ✓ Aprovado
                        </span>
                      )}
                      {comment.status === "rejected" && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          ✗ Rejeitado
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-800 mb-3">{comment.content}</p>

                  {comment.image && (
                    <img
                      src={comment.image || "/placeholder.svg"}
                      alt="Progresso"
                      className="w-full max-w-md h-48 object-cover rounded-lg mb-3"
                    />
                  )}

                  {/* Botões de Aprovação (apenas para o dono do evento) */}
                  {isEventOwner && comment.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveComment(comment.id)}
                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleRejectComment(comment.id)}
                        className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        <XCircle size={14} className="mr-1" />
                        Rejeitar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de Participação */}
        {showParticipationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Participar do Evento</h3>
              <p className="text-gray-600 mb-6">
                Ao participar deste evento, você se compromete a contribuir para as metas estabelecidas e poderá
                compartilhar seu progresso com fotos e atualizações.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowParticipationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleParticipate}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirmar Participação
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Post normal (não evento)
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-semibold">
            {post.author.charAt(0)}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">{post.author}</div>
            <div className="text-xs text-gray-500">{post.timestamp}</div>
          </div>
        </div>

        <div className="whitespace-pre-line text-gray-800 mb-3">{post.content}</div>

        {post.image && (
          <div className="mb-3 -mx-4">
            <img src={post.image || "/placeholder.svg"} alt="" className="w-full h-auto" />
          </div>
        )}

        <div className="flex items-center justify-between text-gray-500 text-sm pt-3 border-t border-gray-100">
          <button className="flex items-center hover:text-red-500 transition-colors">
            <Heart size={18} className={post.likes > 0 ? "fill-red-500 text-red-500" : ""} />
            <span className="ml-1">{post.likes}</span>
          </button>
          <button className="flex items-center hover:text-blue-500 transition-colors">
            <MessageCircle size={18} />
            <span className="ml-1">{post.comments}</span>
          </button>
          <button className="flex items-center hover:text-green-500 transition-colors">
            <Share2 size={18} />
            <span className="ml-1">{post.shares}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
