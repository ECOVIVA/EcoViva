import type React from "react"
import { X, Plus } from "lucide-react"

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

interface CommunitiesModalProps {
  isOpen: boolean
  onClose: () => void
  onCommunityClick: (id: string) => void
}

export const CommunitiesModal: React.FC<CommunitiesModalProps> = ({ isOpen, onClose, onCommunityClick }) => {
  if (!isOpen) return null

  const allCommunities: Community[] = [
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
    {
      id: "energia-renovavel",
      name: "Energia Renovável",
      members: 9876,
      image: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg",
      username: "@energiarenovavel",
      description: "Promovendo o uso de energias limpas e renováveis para um futuro sustentável.",
      location: "Brasília, Brasil",
      website: "www.energiarenovavel.gov.br",
      isVerified: true,
    },
    {
      id: "agricultura-organica",
      name: "Agricultura Orgânica",
      members: 6543,
      image: "https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg",
      username: "@agriculturaorganica",
      description: "Conectando produtores e consumidores de alimentos orgânicos e sustentáveis.",
      location: "Minas Gerais, Brasil",
      website: "www.agriculturaorganica.com.br",
      isVerified: false,
    },
    {
      id: "reciclagem-criativa",
      name: "Reciclagem Criativa",
      members: 4321,
      image: "https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg",
      username: "@reciclagemcriativa",
      description: "Transformando resíduos em arte e objetos úteis através da criatividade.",
      location: "Porto Alegre, Brasil",
      website: "www.reciclagemcriativa.org",
      isVerified: false,
    },
  ]

  const handleCommunityClick = (community: Community) => {
    onCommunityClick(community.id)
    onClose()
  }

  const handleJoinCommunity = (e: React.MouseEvent, community: Community) => {
    e.stopPropagation()
    console.log(`Joining community: ${community.name}`)
    // Implementar lógica para entrar na comunidade
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Descobrir Comunidades</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allCommunities.map((community) => (
              <div
                key={community.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCommunityClick(community)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-green-100 flex-shrink-0">
                    <img
                      src={community.image || "/placeholder.svg"}
                      alt={community.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <h3 className="font-semibold text-gray-900 truncate hover:text-green-600 transition-colors">
                        {community.name}
                      </h3>
                      {community.isVerified && (
                        <span className="ml-1 text-green-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
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
                    <p className="text-sm text-gray-500 mb-2">{community.username}</p>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{community.description}</p>
                    <p className="text-xs text-gray-500">{community.members.toLocaleString()} membros</p>
                  </div>
                  <button
                    onClick={(e) => handleJoinCommunity(e, community)}
                    className="p-2 rounded-full bg-green-50 hover:bg-green-100 text-green-700 transition-colors flex-shrink-0"
                    title={`Entrar na comunidade ${community.name}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
