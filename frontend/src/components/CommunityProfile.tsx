import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  Users,
  Bookmark,
  ChevronLeft,
  Plus,
  X,
  Settings,
  Lock,
  Globe,
  UserCheck,
  Edit3,
  Trash2,
  UserMinus,
  Save,
  Link,
} from "lucide-react"

interface Turma {
  id: string
  name: string
  description: string
  image: string
  isPrivate: boolean
  maxMembers: number
  currentMembers: number
  members: Member[]
  pendingRequests: string[]
  events: Event[]
  createdAt: string
}

interface Member {
  id: string
  name: string
  avatar: string
  joinedAt: string
  role: "admin" | "member"
}

interface Event {
  id: string
  title: string
  image: string
  date: string
  time: string
  location: string
  participants: number
  description: string
  turmaId?: string
}

interface PendingRequest {
  id: string
  userName: string
  userAvatar: string
  turmaId: string
  requestDate: string
}

interface CommunityProfile {
  id: string
  name: string
  username: string
  avatar: string
  cover: string
  description: string
  location: string
  website: string
  followers: number
  following: number
  posts: number
  isVerified: boolean
  isAdmin: boolean
}

interface CommunityProfileProps {
  communityId: string
  onNavigateHome: () => void
}

export function CommunityProfile({ communityId, onNavigateHome }: CommunityProfileProps) {
  const [activeTab, setActiveTab] = useState("posts")
  const [joinedEvents, setJoinedEvents] = useState<string[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [showCreateTurmaModal, setShowCreateTurmaModal] = useState(false)
  const [showPendingRequestsModal, setShowPendingRequestsModal] = useState(false)
  const [showManageTurmaModal, setShowManageTurmaModal] = useState(false)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [selectedTurma, setSelectedTurma] = useState<string | null>(null)

  // Dados das comunidades disponíveis
  const communitiesData = {
    "acao-climatica": {
      id: "acao-climatica",
      name: "Ação Climática",
      username: "@acaoclimatica",
      avatar: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
      cover: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
      description: "Comunidade dedicada ao combate às mudanças climáticas através de ações práticas e conscientização.",
      location: "Rio de Janeiro, Brasil",
      website: "www.acaoclimatica.org",
      followers: 12482,
      following: 234,
      posts: 89,
      isVerified: true,
      isAdmin: false,
    },
    "vida-verde": {
      id: "vida-verde",
      name: "Vida Verde",
      username: "@vidaverde",
      avatar: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
      cover: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
      description: "Promovendo um estilo de vida sustentável e ecológico para todos.",
      location: "São Paulo, Brasil",
      website: "www.vidaverde.com.br",
      followers: 8754,
      following: 156,
      posts: 67,
      isVerified: false,
      isAdmin: false,
    },
    "conservacao-oceanica": {
      id: "conservacao-oceanica",
      name: "Conservação Oceânica",
      username: "@conservacaooceanica",
      avatar: "https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg",
      cover: "https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg",
      description: "Protegendo nossos oceanos e vida marinha para as futuras gerações.",
      location: "Salvador, Brasil",
      website: "www.conservacaooceanica.org.br",
      followers: 5231,
      following: 89,
      posts: 45,
      isVerified: true,
      isAdmin: false,
    },
    ecoviva: {
      id: "ecoviva",
      name: "Ecoviva",
      username: "@ecoviva",
      avatar: "/placeholder.svg?height=100&width=100",
      cover: "/placeholder.svg?height=300&width=800",
      description:
        "Comunidade dedicada à sustentabilidade, preservação ambiental e práticas ecológicas para um futuro mais verde.",
      followers: 5280,
      following: 342,
      posts: 127,
      location: "São Paulo, Brasil",
      website: "www.ecoviva.org",
      isVerified: true,
      isAdmin: true, // Apenas Ecoviva é admin
    },
  }

  // Estado do perfil da comunidade
  const [community, setCommunity] = useState<CommunityProfile>(
    communitiesData[communityId as keyof typeof communitiesData] || communitiesData.ecoviva,
  )

  const [editProfile, setEditProfile] = useState<CommunityProfile>(community)

  // Atualizar comunidade quando communityId mudar
  useEffect(() => {
    const communityData = communitiesData[communityId as keyof typeof communitiesData]
    if (communityData) {
      setCommunity(communityData)
      setEditProfile(communityData)
    }
  }, [communityId])

  const [turmas, setTurmas] = useState<Turma[]>([
    {
      id: "t1",
      name: "Horta Urbana Iniciantes",
      description: "Grupo para iniciantes em jardinagem urbana e cultivo de alimentos em casa",
      image: "/placeholder.svg?height=200&width=300",
      isPrivate: false,
      maxMembers: 50,
      currentMembers: 4,
      members: [
        {
          id: "admin",
          name: "Admin da Comunidade",
          avatar: "/placeholder.svg?height=40&width=40",
          joinedAt: "2025-01-01",
          role: "admin",
        },
        {
          id: "user1",
          name: "Maria Silva",
          avatar: "/placeholder.svg?height=40&width=40",
          joinedAt: "2025-01-02",
          role: "member",
        },
        {
          id: "user2",
          name: "João Santos",
          avatar: "/placeholder.svg?height=40&width=40",
          joinedAt: "2025-01-03",
          role: "member",
        },
        {
          id: "user3",
          name: "Ana Costa",
          avatar: "/placeholder.svg?height=40&width=40",
          joinedAt: "2025-01-04",
          role: "member",
        },
      ],
      pendingRequests: [],
      events: [],
      createdAt: "2025-01-01",
    },
    {
      id: "t2",
      name: "Compostagem Avançada",
      description: "Técnicas avançadas de compostagem para membros experientes",
      image: "/placeholder.svg?height=200&width=300",
      isPrivate: true,
      maxMembers: 20,
      currentMembers: 3,
      members: [
        {
          id: "admin",
          name: "Admin da Comunidade",
          avatar: "/placeholder.svg?height=40&width=40",
          joinedAt: "2025-01-05",
          role: "admin",
        },
        {
          id: "user4",
          name: "Carlos Oliveira",
          avatar: "/placeholder.svg?height=40&width=40",
          joinedAt: "2025-01-06",
          role: "member",
        },
        {
          id: "user5",
          name: "Lucia Ferreira",
          avatar: "/placeholder.svg?height=40&width=40",
          joinedAt: "2025-01-07",
          role: "member",
        },
      ],
      pendingRequests: ["req1", "req2"],
      events: [],
      createdAt: "2025-01-05",
    },
  ])

  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
    {
      id: "req1",
      userName: "Pedro Lima",
      userAvatar: "/placeholder.svg?height=40&width=40",
      turmaId: "t2",
      requestDate: "2025-01-10",
    },
    {
      id: "req2",
      userName: "Sofia Rodrigues",
      userAvatar: "/placeholder.svg?height=40&width=40",
      turmaId: "t2",
      requestDate: "2025-01-11",
    },
  ])

  const [newTurma, setNewTurma] = useState({
    name: "",
    description: "",
    isPrivate: false,
    maxMembers: 50,
  })

  // Posts da comunidade - variam por comunidade
  const getPostsForCommunity = (communityId: string) => {
    const postsData = {
      "acao-climatica": [
        {
          id: "1",
          image: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
          likes: 345,
          comments: 42,
          description: "Ação de plantio de árvores no centro da cidade! Juntos fazemos a diferença 🌳",
          date: "1 dia atrás",
        },
        {
          id: "2",
          image: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
          likes: 289,
          comments: 34,
          description: "Workshop sobre energia solar foi um sucesso! Obrigado a todos ⚡",
          date: "3 dias atrás",
        },
        {
          id: "3",
          image: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
          likes: 412,
          comments: 56,
          description: "Palestra sobre mudanças climáticas lotou o auditório! 🌍",
          date: "5 dias atrás",
        },
      ],
      "vida-verde": [
        {
          id: "1",
          image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
          likes: 198,
          comments: 28,
          description: "Dicas de vida sustentável para o dia a dia! Vamos juntos 🌿",
          date: "2 dias atrás",
        },
        {
          id: "2",
          image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
          likes: 156,
          comments: 19,
          description: "Produtos ecológicos que fazem a diferença no nosso planeta 🌍",
          date: "5 dias atrás",
        },
        {
          id: "3",
          image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
          likes: 234,
          comments: 31,
          description: "Feira de produtos orgânicos foi um sucesso! 🥬",
          date: "1 semana atrás",
        },
      ],
      "conservacao-oceanica": [
        {
          id: "1",
          image: "https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg",
          likes: 267,
          comments: 38,
          description: "Limpeza da praia realizada no último domingo. Gratidão a todos! 🌊",
          date: "1 dia atrás",
        },
        {
          id: "2",
          image: "https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg",
          likes: 203,
          comments: 27,
          description: "Protegendo a vida marinha para as futuras gerações 🐠",
          date: "4 dias atrás",
        },
        {
          id: "3",
          image: "https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg",
          likes: 189,
          comments: 22,
          description: "Projeto de conservação de corais em andamento! 🪸",
          date: "6 dias atrás",
        },
      ],
      ecoviva: [
        {
          id: "1",
          image: "/placeholder.svg?height=300&width=300",
          likes: 245,
          comments: 32,
          description: "Nossa nova horta comunitária está crescendo! Venham conhecer 🌱",
          date: "2 dias atrás",
        },
        {
          id: "2",
          image: "/placeholder.svg?height=300&width=300",
          likes: 189,
          comments: 24,
          description: "Workshop de compostagem foi um sucesso! Obrigado a todos que participaram ♻️",
          date: "5 dias atrás",
        },
        {
          id: "3",
          image: "/placeholder.svg?height=300&width=300",
          likes: 312,
          comments: 45,
          description: "Plantio de árvores no parque municipal. Juntos fazemos a diferença! 🌳",
          date: "1 semana atrás",
        },
      ],
    }

    return postsData[communityId as keyof typeof postsData] || []
  }

  // Eventos da comunidade - variam por comunidade
  const getEventsForCommunity = (communityId: string) => {
    const eventsData = {
      "acao-climatica": [
        {
          id: "e1",
          title: "Plantio de Árvores Nativas",
          image: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
          date: "25 de Junho, 2025",
          time: "08:00 - 12:00",
          location: "Parque da Cidade - Rio de Janeiro",
          participants: 67,
          description:
            "Vamos plantar árvores nativas para restaurar a vegetação local e combater as mudanças climáticas.",
        },
        {
          id: "e2",
          title: "Palestra sobre Mudanças Climáticas",
          image: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
          date: "30 de Junho, 2025",
          time: "19:00 - 21:00",
          location: "Auditório Central - Rio de Janeiro",
          participants: 120,
          description: "Especialistas discutirão os impactos das mudanças climáticas e soluções práticas.",
        },
      ],
      "vida-verde": [
        {
          id: "e1",
          title: "Feira de Produtos Orgânicos",
          image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
          date: "22 de Junho, 2025",
          time: "09:00 - 15:00",
          location: "Praça da República - São Paulo",
          participants: 89,
          description: "Feira com produtores locais de alimentos orgânicos e produtos sustentáveis.",
        },
        {
          id: "e2",
          title: "Workshop de Vida Sustentável",
          image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
          date: "28 de Junho, 2025",
          time: "14:00 - 17:00",
          location: "Centro Cultural - São Paulo",
          participants: 45,
          description: "Aprenda práticas sustentáveis para aplicar no seu dia a dia.",
        },
      ],
      "conservacao-oceanica": [
        {
          id: "e1",
          title: "Limpeza da Praia",
          image: "https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg",
          date: "28 de Junho, 2025",
          time: "07:00 - 11:00",
          location: "Praia de Copacabana - Salvador",
          participants: 45,
          description: "Ação coletiva para limpeza da praia e conscientização sobre poluição marinha.",
        },
        {
          id: "e2",
          title: "Mergulho de Conservação",
          image: "https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg",
          date: "5 de Julho, 2025",
          time: "08:00 - 16:00",
          location: "Recife de Corais - Salvador",
          participants: 25,
          description: "Mergulho para monitoramento e conservação dos recifes de corais.",
        },
      ],
      ecoviva: [
        {
          id: "e1",
          title: "Workshop de Jardinagem Urbana",
          image: "/placeholder.svg?height=300&width=300",
          date: "15 de Junho, 2025",
          time: "14:00 - 17:00",
          location: "Parque Ibirapuera",
          participants: 42,
          description:
            "Aprenda técnicas de jardinagem urbana e como cultivar seus próprios alimentos em espaços pequenos.",
        },
        {
          id: "e2",
          title: "Feira de Produtos Orgânicos",
          image: "/placeholder.svg?height=300&width=300",
          date: "20 de Junho, 2025",
          time: "09:00 - 15:00",
          location: "Praça do Pôr do Sol",
          participants: 120,
          description:
            "Feira com produtores locais de alimentos orgânicos, produtos sustentáveis e artesanato ecológico.",
        },
      ],
    }

    return eventsData[communityId as keyof typeof eventsData] || []
  }

  const posts = getPostsForCommunity(community.id)
  const events = getEventsForCommunity(community.id)

  const handleCreateTurma = () => {
    if (newTurma.name && newTurma.description) {
      const turma: Turma = {
        id: `t${turmas.length + 1}`,
        name: newTurma.name,
        description: newTurma.description,
        image: "/placeholder.svg?height=200&width=300",
        isPrivate: newTurma.isPrivate,
        maxMembers: newTurma.maxMembers,
        currentMembers: 1,
        members: [
          {
            id: "admin",
            name: "Você (Admin)",
            avatar: "/placeholder.svg?height=40&width=40",
            joinedAt: new Date().toISOString(),
            role: "admin",
          },
        ],
        pendingRequests: [],
        events: [],
        createdAt: new Date().toISOString(),
      }

      setTurmas([...turmas, turma])
      setNewTurma({ name: "", description: "", isPrivate: false, maxMembers: 50 })
      setShowCreateTurmaModal(false)
    }
  }

  const handleApproveRequest = (requestId: string, turmaId: string) => {
    const request = pendingRequests.find((r) => r.id === requestId)
    if (request) {
      const newMember: Member = {
        id: `user_${Date.now()}`,
        name: request.userName,
        avatar: request.userAvatar,
        joinedAt: new Date().toISOString(),
        role: "member",
      }

      setTurmas(
        turmas.map((turma) =>
          turma.id === turmaId
            ? {
                ...turma,
                members: [...turma.members, newMember],
                currentMembers: turma.currentMembers + 1,
                pendingRequests: turma.pendingRequests.filter((id) => id !== requestId),
              }
            : turma,
        ),
      )

      setPendingRequests(pendingRequests.filter((r) => r.id !== requestId))
    }
  }

  const handleRejectRequest = (requestId: string, turmaId: string) => {
    setTurmas(
      turmas.map((turma) =>
        turma.id === turmaId
          ? { ...turma, pendingRequests: turma.pendingRequests.filter((id) => id !== requestId) }
          : turma,
      ),
    )
    setPendingRequests(pendingRequests.filter((r) => r.id !== requestId))
  }

  const handleRemoveMember = (turmaId: string, memberId: string) => {
    if (memberId === "admin") return // Não pode remover o admin

    setTurmas(
      turmas.map((turma) =>
        turma.id === turmaId
          ? {
              ...turma,
              members: turma.members.filter((member) => member.id !== memberId),
              currentMembers: turma.currentMembers - 1,
            }
          : turma,
      ),
    )
  }

  const handleManageTurma = (turmaId: string) => {
    setSelectedTurma(turmaId)
    setShowManageTurmaModal(true)
  }

  const handleEditProfile = () => {
    setEditProfile(community)
    setShowEditProfileModal(true)
  }

  const handleSaveProfile = () => {
    setCommunity(editProfile)
    setShowEditProfileModal(false)
  }

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing)
    // Atualizar contador de seguidores
    setCommunity((prev) => ({
      ...prev,
      followers: isFollowing ? prev.followers - 1 : prev.followers + 1,
    }))
  }

  const handleJoinEvent = (eventId: string) => {
    if (joinedEvents.includes(eventId)) {
      setJoinedEvents(joinedEvents.filter((id) => id !== eventId))
    } else {
      setJoinedEvents([...joinedEvents, eventId])
    }
  }

  const handleJoinTurma = (turmaId: string) => {
    const turma = turmas.find((t) => t.id === turmaId)
    if (turma) {
      if (turma.isPrivate) {
        // Adicionar à lista de solicitações pendentes
        const newRequest: PendingRequest = {
          id: `req_${Date.now()}`,
          userName: "Você",
          userAvatar: "/placeholder.svg?height=40&width=40",
          turmaId: turmaId,
          requestDate: new Date().toISOString(),
        }
        setPendingRequests([...pendingRequests, newRequest])
        alert("Solicitação enviada! Aguarde a aprovação do administrador.")
      } else {
        // Entrar diretamente na turma pública
        const newMember: Member = {
          id: `user_${Date.now()}`,
          name: "Você",
          avatar: "/placeholder.svg?height=40&width=40",
          joinedAt: new Date().toISOString(),
          role: "member",
        }

        setTurmas(
          turmas.map((t) =>
            t.id === turmaId
              ? {
                  ...t,
                  members: [...t.members, newMember],
                  currentMembers: t.currentMembers + 1,
                }
              : t,
          ),
        )
        alert("Você entrou na turma com sucesso!")
      }
    }
  }

  const getTotalPendingRequests = () => {
    return pendingRequests.length
  }

  const getSelectedTurma = () => {
    return turmas.find((t) => t.id === selectedTurma)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <button onClick={onNavigateHome} className="flex items-center text-green-600">
            <ChevronLeft size={20} />
            <span className="ml-2 font-medium">Voltar</span>
          </button>
          <h1 className="text-xl font-bold">{community.name}</h1>
          <div className="flex items-center gap-2">
            {community.isAdmin && getTotalPendingRequests() > 0 && (
              <button
                onClick={() => setShowPendingRequestsModal(true)}
                className="relative p-2 text-green-600 hover:bg-green-50 rounded-full"
              >
                <UserCheck size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalPendingRequests()}
                </span>
              </button>
            )}
            {community.isAdmin && (
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-full">
                <Settings size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="h-48 bg-green-100 overflow-hidden">
        <img
          src={community.cover || "/placeholder.svg"}
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
                src={community.avatar || "/placeholder.svg"}
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
                    {community.isAdmin && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Administrador
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500">{community.username}</p>
                </div>
                {community.isAdmin ? (
                  <button
                    onClick={handleEditProfile}
                    className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Edit3 size={16} className="inline mr-2" />
                    Editar Perfil
                  </button>
                ) : (
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
                )}
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="flex justify-between mt-6 border-b border-gray-100 pb-4">
            <div className="text-center">
              <div className="font-bold">{community.posts}</div>
              <div className="text-gray-500 text-sm">Publicações</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{community.followers.toLocaleString()}</div>
              <div className="text-gray-500 text-sm">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{turmas.length}</div>
              <div className="text-gray-500 text-sm">Turmas</div>
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
            <button
              onClick={() => setActiveTab("turmas")}
              className={`px-6 py-3 font-medium ${
                activeTab === "turmas"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Turmas ({turmas.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === "posts" && (
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
        )}

        {activeTab === "events" && (
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
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleJoinEvent(event.id)}
                      className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                        joinedEvents.includes(event.id)
                          ? "bg-green-100 text-green-700 border border-green-600"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {joinedEvents.includes(event.id) ? "Participando" : "Participar"}
                    </button>
                    {community.isAdmin && (
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                        <Edit3 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "turmas" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{community.isAdmin ? "Minhas Turmas" : "Turmas da Comunidade"}</h2>
              {community.isAdmin && (
                <button
                  onClick={() => setShowCreateTurmaModal(true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Criar Turma
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {turmas.map((turma) => (
                <div
                  key={turma.id}
                  className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={turma.image || "/placeholder.svg"}
                      alt={turma.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold">{turma.name}</h3>
                      <div className="flex items-center">
                        {turma.isPrivate ? (
                          <Lock size={16} className="text-gray-500" />
                        ) : (
                          <Globe size={16} className="text-green-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{turma.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>
                        {turma.currentMembers}/{turma.maxMembers} membros
                      </span>
                      <span>{turma.isPrivate ? "Privada" : "Pública"}</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(turma.currentMembers / turma.maxMembers) * 100}%` }}
                      ></div>
                    </div>

                    {community.isAdmin && turma.pendingRequests.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-3">
                        <p className="text-yellow-800 text-xs">
                          {turma.pendingRequests.length} solicitação(ões) pendente(s)
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {community.isAdmin ? (
                        <>
                          <button
                            onClick={() => handleManageTurma(turma.id)}
                            className="flex-1 py-2 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            Gerenciar
                          </button>
                          <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                            <Settings size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleJoinTurma(turma.id)}
                          disabled={turma.currentMembers >= turma.maxMembers}
                          className="flex-1 py-2 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {turma.currentMembers >= turma.maxMembers ? "Turma Cheia" : "Entrar"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modais - só aparecem se for admin */}
      {community.isAdmin && (
        <>
          {/* Modal Editar Perfil */}
          {showEditProfileModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-bold">Editar Perfil da Comunidade</h2>
                  <button onClick={() => setShowEditProfileModal(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Comunidade</label>
                    <input
                      type="text"
                      value={editProfile.name}
                      onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Nome da comunidade"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Usuário</label>
                    <input
                      type="text"
                      value={editProfile.username}
                      onChange={(e) => setEditProfile({ ...editProfile, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="@nomedacomunidade"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição/Bio</label>
                    <textarea
                      value={editProfile.description}
                      onChange={(e) => setEditProfile({ ...editProfile, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={4}
                      placeholder="Descreva sua comunidade..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                    <input
                      type="text"
                      value={editProfile.location}
                      onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Cidade, Estado, País"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="text"
                      value={editProfile.website}
                      onChange={(e) => setEditProfile({ ...editProfile, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="www.exemplo.com"
                    />
                  </div>
                </div>

                <div className="flex gap-3 p-4 border-t">
                  <button
                    onClick={() => setShowEditProfileModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Save size={16} className="mr-2" />
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Gerenciar Turma */}
          {showManageTurmaModal && selectedTurma && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-bold">Gerenciar Turma</h2>
                  <button onClick={() => setShowManageTurmaModal(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">{getSelectedTurma()?.name}</h3>
                    <p className="text-gray-600 text-sm">{getSelectedTurma()?.description}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Membros ({getSelectedTurma()?.currentMembers})</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {getSelectedTurma()?.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 border border-gray-100 rounded-md"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={member.avatar || "/placeholder.svg"}
                              alt={member.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="font-medium text-sm">{member.name}</div>
                              <div className="text-xs text-gray-500">
                                {member.role === "admin" ? "Administrador" : "Membro"}
                              </div>
                            </div>
                          </div>
                          {member.role !== "admin" && (
                            <button
                              onClick={() => handleRemoveMember(selectedTurma, member.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Remover membro"
                            >
                              <UserMinus size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowManageTurmaModal(false)}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Fechar
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Criar Turma */}
          {showCreateTurmaModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-bold">Criar Nova Turma</h2>
                  <button onClick={() => setShowCreateTurmaModal(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Turma</label>
                    <input
                      type="text"
                      value={newTurma.name}
                      onChange={(e) => setNewTurma({ ...newTurma, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: Horta Urbana Avançada"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                      value={newTurma.description}
                      onChange={(e) => setNewTurma({ ...newTurma, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={3}
                      placeholder="Descreva o objetivo e atividades da turma..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Limite de Membros</label>
                    <input
                      type="number"
                      value={newTurma.maxMembers}
                      onChange={(e) => setNewTurma({ ...newTurma, maxMembers: Number.parseInt(e.target.value) || 50 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="1"
                      max="500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Privacidade</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="privacy"
                          checked={!newTurma.isPrivate}
                          onChange={() => setNewTurma({ ...newTurma, isPrivate: false })}
                          className="mr-2"
                        />
                        <Globe size={16} className="mr-2 text-green-500" />
                        <div>
                          <div className="font-medium">Pública</div>
                          <div className="text-sm text-gray-500">Qualquer pessoa pode entrar</div>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="privacy"
                          checked={newTurma.isPrivate}
                          onChange={() => setNewTurma({ ...newTurma, isPrivate: true })}
                          className="mr-2"
                        />
                        <Lock size={16} className="mr-2 text-gray-500" />
                        <div>
                          <div className="font-medium">Privada</div>
                          <div className="text-sm text-gray-500">Precisa de aprovação para entrar</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 p-4 border-t">
                  <button
                    onClick={() => setShowCreateTurmaModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateTurma}
                    disabled={!newTurma.name || !newTurma.description}
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Criar Turma
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Solicitações Pendentes */}
          {showPendingRequestsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-bold">Solicitações Pendentes</h2>
                  <button
                    onClick={() => setShowPendingRequestsModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4">
                  {pendingRequests.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Nenhuma solicitação pendente</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingRequests.map((request) => {
                        const turma = turmas.find((t) => t.id === request.turmaId)
                        return (
                          <div key={request.id} className="border border-gray-100 rounded-lg p-3">
                            <div className="flex items-center gap-3 mb-2">
                              <img
                                src={request.userAvatar || "/placeholder.svg"}
                                alt={request.userName}
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="font-medium">{request.userName}</div>
                                <div className="text-sm text-gray-500">Quer entrar em "{turma?.name}"</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveRequest(request.id, request.turmaId)}
                                className="flex-1 py-2 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() => handleRejectRequest(request.id, request.turmaId)}
                                className="flex-1 py-2 px-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                              >
                                Rejeitar
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
