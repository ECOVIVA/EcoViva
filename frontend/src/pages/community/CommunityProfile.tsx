import type React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ChevronLeft, MapPin, Link, Calendar, Clock, Users, Heart, MessageCircle, Share2, Bookmark } from "lucide-react"

interface Community {
  id: string
  name: string
  members: number
  image: string
  username: string
  description: string
  location: string
  website: string
  isVerified: boolean
}

export const CommunityProfile: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>()
  const [community, setCommunity] = useState<Community | null>(null)
  const [activeTab, setActiveTab] = useState("posts")
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    // Tentar carregar dados do localStorage primeiro
    const savedCommunity = localStorage.getItem("selectedCommunity")
    if (savedCommunity) {
      setCommunity(JSON.parse(savedCommunity))
    } else {
      // Se não houver dados salvos, buscar por ID (simulado)
      // Em uma aplicação real, você faria uma chamada para API
      fetchCommunityById(communityId)
    }
  }, [communityId])

  const fetchCommunityById = (id: string | undefined) => {
    // Simulação de busca por ID
    const communities: Community[] = [
      {
        id: "acao-climatica",
        name: "Ação Climática",
        members: 12482,
        image: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
        username: "@acaoclimatica",
        description:
          "Comunidade dedicada ao combate às mudanças climáticas através de ações práticas e conscientização.",
        location: "Rio de Janeiro, Brasil",
        website: "www.acaoclimatica.org",
        isVerified: true,
      },
      // ... outras comunidades
    ]

    const foundCommunity = communities.find((c) => c.id === id)
    if (foundCommunity) {
      setCommunity(foundCommunity)
    }
  }

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing)
  }

  const handleGoBack = () => {
    window.history.back()
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando comunidade...</p>
        </div>
      </div>
    )
  }

  // Posts mockados para demonstração
  const posts = [
    {
      id: "1",
      image: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
      likes: 245,
      comments: 32,
      description: "Ação de plantio de árvores no centro da cidade! 🌳",
      date: "2 dias atrás",
    },
    {
      id: "2",
      image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
      likes: 189,
      comments: 24,
      description: "Workshop sobre energia solar foi um sucesso! ⚡",
      date: "5 dias atrás",
    },
    {
      id: "3",
      image: "https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg",
      likes: 312,
      comments: 45,
      description: "Limpeza da praia realizada no último domingo 🌊",
      date: "1 semana atrás",
    },
  ]

  // Eventos mockados
  const events = [
    {
      id: "e1",
      title: "Plantio de Árvores Nativas",
      image: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
      date: "25 de Junho, 2025",
      time: "08:00 - 12:00",
      location: "Parque da Cidade",
      participants: 67,
      description: "Vamos plantar árvores nativas para restaurar a vegetação local.",
    },
    {
      id: "e2",
      title: "Palestra sobre Mudanças Climáticas",
      image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
      date: "30 de Junho, 2025",
      time: "19:00 - 21:00",
      location: "Auditório Central",
      participants: 120,
      description: "Especialistas discutirão os impactos das mudanças climáticas.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <button onClick={handleGoBack} className="flex items-center text-green-600">
            <ChevronLeft size={20} />
            <span className="ml-2 font-medium">Voltar</span>
          </button>
          <h1 className="text-xl font-bold">{community.name}</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="h-48 bg-green-100 overflow-hidden">
        <img
          src={community.image || "/placeholder.svg"}
          alt={`Capa da comunidade ${community.name}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Community Profile */}
      <div className="container mx-auto px-4 -mt-16">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-green-100 shadow-md">
              <img
                src={community.image || "/placeholder.svg"}
                alt={community.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold">{community.name}</h1>
                    {community.isVerified && (
                      <span className="ml-1 text-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500">{community.username}</p>
                </div>
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-2 font-medium rounded-md transition-colors ${
                    isFollowing
                      ? "bg-green-100 text-green-700 border border-green-600"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isFollowing ? "Seguindo" : "Seguir"}
                </button>
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="flex justify-between mt-6 border-b border-gray-100 pb-4">
            <div className="text-center">
              <div className="font-bold">{posts.length}</div>
              <div className="text-gray-500 text-sm">Publicações</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{community.members.toLocaleString()}</div>
              <div className="text-gray-500 text-sm">Membros</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{events.length}</div>
              <div className="text-gray-500 text-sm">Eventos</div>
            </div>
          </div>

          {/* Community Description */}
          <div className="py-4">
            <p className="text-gray-800">{community.description}</p>
            <div className="mt-2 flex items-center text-gray-500">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm">{community.location}</span>
            </div>
            <div className="mt-1 flex items-center text-green-600">
              <Link size={16} className="mr-1" />
              <a href={`https://${community.website}`} className="text-sm hover:underline">
                {community.website}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 mt-4">
        <div className="border-b border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-6 py-3 font-medium ${
                activeTab === "posts"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Publicações
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-6 py-3 font-medium ${
                activeTab === "events"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Eventos
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === "posts" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt="Post da comunidade"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <button className="text-gray-700 hover:text-red-500 transition-colors">
                        <Heart size={20} />
                      </button>
                      <button className="text-gray-700 hover:text-gray-900 transition-colors">
                        <MessageCircle size={20} />
                      </button>
                      <button className="text-gray-700 hover:text-gray-900 transition-colors">
                        <Share2 size={20} />
                      </button>
                    </div>
                    <button className="text-gray-700 hover:text-gray-900 transition-colors">
                      <Bookmark size={20} />
                    </button>
                  </div>
                  <div className="text-sm font-medium">{post.likes} curtidas</div>
                  <p className="text-sm mt-1">
                    <span className="font-medium">{community.name}</span> {post.description}
                  </p>
                  <div className="text-gray-500 text-xs mt-1">Ver todos os {post.comments} comentários</div>
                  <div className="text-gray-400 text-xs mt-1">{post.date}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <div className="flex items-center mt-2 text-gray-600">
                    <Calendar size={16} className="mr-1" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center mt-1 text-gray-600">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center mt-1 text-gray-600">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center mt-1 text-gray-600">
                    <Users size={16} className="mr-1" />
                    <span className="text-sm">{event.participants} participantes</span>
                  </div>
                  <p className="mt-3 text-gray-700">{event.description}</p>
                  <button className="mt-4 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Participar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
