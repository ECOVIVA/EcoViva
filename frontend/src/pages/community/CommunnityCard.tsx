"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { CommunitiesModal } from "./CommunitiesModal"

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

export const CommunitiesCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const suggestedCommunities: Community[] = [
    {
      id: "acao-climatica",
      name: "Ação Climática",
      members: 12482,
      image: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
      username: "@acaoclimatica",
      description: "Comunidade dedicada ao combate às mudanças climáticas através de ações práticas e conscientização.",
      location: "Rio de Janeiro, Brasil",
      website: "www.acaoclimatica.org",
      isVerified: true,
    },
    {
      id: "vida-verde",
      name: "Vida Verde",
      members: 8754,
      image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg",
      username: "@vidaverde",
      description: "Promovendo um estilo de vida sustentável e ecológico para todos.",
      location: "São Paulo, Brasil",
      website: "www.vidaverde.com.br",
      isVerified: false,
    },
    {
      id: "conservacao-oceanica",
      name: "Conservação Oceânica",
      members: 5231,
      image: "https://images.pexels.com/photos/1295036/pexels-photo-1295036.jpeg",
      username: "@conservacaooceanica",
      description: "Protegendo nossos oceanos e vida marinha para as futuras gerações.",
      location: "Salvador, Brasil",
      website: "www.conservacaooceanica.org.br",
      isVerified: true,
    },
  ]

  const handleCommunityClick = (community: Community) => {
    // Navegar usando React Router
    navigate(`/community/${community.id}`)
  }

  const handleJoinCommunity = (e: React.MouseEvent, community: Community) => {
    e.stopPropagation() // Previne o redirecionamento quando clicar no botão de join
    console.log(`Joining community: ${community.name}`)
    // Aqui você implementaria a lógica para entrar na comunidade
  }

  const handleDiscoverMore = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Comunidades Sugeridas</h3>
        </div>

        <div className="p-2">
          {suggestedCommunities.map((community) => (
            <div
              key={community.id}
              className="p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
              onClick={() => handleCommunityClick(community)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-md overflow-hidden bg-green-100 cursor-pointer">
                  <img
                    src={community.image || "/placeholder.svg"}
                    alt={community.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0 cursor-pointer">
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900 truncate hover:text-green-600 transition-colors">
                      {community.name}
                    </h4>
                    {community.isVerified && (
                      <span className="ml-1 text-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-3 h-3"
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
                  <p className="text-xs text-gray-500">{community.members.toLocaleString()} membros</p>
                </div>
                <button
                  onClick={(e) => handleJoinCommunity(e, community)}
                  className="p-1.5 rounded-full bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
                  title={`Entrar na comunidade ${community.name}`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3">
          <button
            onClick={handleDiscoverMore}
            className="w-full py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors font-medium"
          >
            Descobrir Mais Comunidades
          </button>
        </div>
      </div>

      <CommunitiesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCommunityClick={(id: string) => {
          navigate(`/community/${id}`)
          setIsModalOpen(false)
        }}
      />
    </>
  )
}
