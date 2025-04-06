"use client"

import { useState, useEffect, useRef } from "react"
import {
  Send,
  Clock,
  Trophy,
  MessageSquare,
  Droplet,
  Award,
  ChevronUp,
  ChevronDown,
  PlusCircle,
  CheckCircle,
  Star,
} from "lucide-react"
import { useIsMobile } from "../hooks/use-mobile"
import type { UserProgress } from "../types/types"
import { ranks } from "./data/ranks"
import api from "../services/API/axios"
import routes from "../services/API/routes"


const SustainableCheckin = () => {
  const isMobile = useIsMobile()
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const [rippleCount, setRippleCount] = useState(0)
  const [expandedTips, setExpandedTips] = useState(false)
  const [expandedHistory, setExpandedHistory] = useState(false)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    currentXP: 0,
    currentRank: 1,
    checkIns: [],
  })
  const [comment, setComment] = useState("")
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [checkInSuccess, setCheckInSuccess] = useState(false)

  const fetchBubbleData = async () => {
    try {
      // Use the correct endpoint from the Django URLs
      const response = await api.get(routes.user.bubble.profile)
      if (response.status === 200) {
        const bubble = response.data
        setUserProgress({
          currentXP: bubble.progress || 0,
          currentRank: bubble.rank?.id || 1,
          checkIns: bubble.check_ins || [],
        })
      } else {
        console.error("Erro ao buscar dados da bolha.")
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error)
    }
  }

  // Fetch Bubble data when the component is mounted
  useEffect(() => {
    fetchBubbleData()

    // Set up periodic ripples
    const interval = setInterval(() => {
      if (bubbleRef.current) {
        createRipple()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Create ripple effect in the bubble
  const createRipple = () => {
    if (!bubbleRef.current) return

    const bubble = bubbleRef.current
    const bubbleRect = bubble.getBoundingClientRect()
    const bubbleHeight = bubbleRect.height
    const bubbleWidth = bubbleRect.width

    // Calculate random position within the bubble
    const centerX = bubbleWidth / 2
    const waterHeight = bubbleHeight * (getCurrentProgressPercentage() / 100)
    const yPosition = bubbleHeight - waterHeight / 2

    // Only create ripples if there's water in the bubble
    if (waterHeight > 0) {
      const newRipple = {
        id: rippleCount,
        x: centerX,
        y: yPosition,
      }

      setRipples((prev) => [...prev, newRipple])
      setRippleCount((prev) => prev + 1)

      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 1500)
    }
  }

  const getCurrentRank = () => {
    return ranks.find((rank) => rank.id === userProgress.currentRank) || ranks[0]
  }

  const getNextRank = () => {
    return ranks.find((rank) => rank.id === userProgress.currentRank + 1)
  }

  const getXPForCurrentRank = () => {
    const rank = getCurrentRank()
    if (rank.difficulty === "Easy") return 50
    if (rank.difficulty === "Medium") return 25
    return 10
  }

  const getCurrentProgressPercentage = () => {
    const currentRank = getCurrentRank()
    return Math.min(100, Math.floor(((userProgress.currentXP/currentRank.points) * 100)))
  }

  const getRemainingXP = () => {
    const nextRank = getNextRank()

    if (!nextRank) return 0 // Max level reached
    console.log(nextRank, userProgress.currentXP)
    return nextRank.points - userProgress.currentXP
  }

  const handleCheckIn = async () => {
    if (!comment.trim()) return

    setIsCheckingIn(true)

    try {
      // Use the correct endpoint from the Django URLs
      const response = await api.post(routes.user.bubble.check_in, {
        description: comment.trim(),
        xp_earned: getXPForCurrentRank(),
      })

      if (response.status === 201 || response.status === 200) {
          await fetchBubbleData()
        }
        else {
        console.error("Erro ao realizar check-in.")
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error)
    } finally {
      setIsCheckingIn(false)
    }
  }

  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get water fill height style based on progress
  const getWaterStyle = () => {
    const progress = getCurrentProgressPercentage()
    return {
      height: `${progress}%`,
      transition: "height 1s ease-out",
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 overflow-hidden">
      {/* SVG Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top Left Plant SVG */}
        <svg
          className="absolute top-0 left-0 w-64 h-64 md:w-96 md:h-96 text-green-400 opacity-50 transform -translate-x-1/4 -translate-y-1/4"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="currentColor" d="M40,120 Q60,80 100,100 T160,80 Q130,100 140,140 T100,160 Q70,130 40,120" />
          <path
            fill="currentColor"
            d="M70,50 Q90,20 110,40 T150,30 Q120,50 130,90 T90,110 Q60,80 70,50"
            opacity="0.8"
          />
        </svg>

        {/* Bottom Right Wave SVG */}
        <svg
          className="absolute bottom-0 right-0 w-80 h-80 md:w-120 md:h-120 text-cyan-400 opacity-50 transform translate-x-1/4 translate-y-1/4"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M20,50 Q40,20 60,30 T100,10 Q120,30 140,20 T180,40 Q160,60 180,80 T160,120 Q140,100 120,110 T80,130 Q60,110 40,120 T20,90 Q40,70 20,50"
          />
        </svg>

        {/* Top Right Leaf SVG */}
        <svg
          className="absolute top-0 right-0 w-56 h-56 md:w-80 md:h-80 text-emerald-400 opacity-50 transform translate-x-1/4 -translate-y-1/4"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M100,20 Q120,20 140,40 T160,80 Q140,100 120,120 T80,140 Q60,120 40,100 T20,60 Q40,40 60,20 T100,20"
          />
        </svg>

        {/* Bottom Left Droplet SVG */}
        <svg
          className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 text-blue-400 opacity-50 transform -translate-x-1/4 translate-y-1/4"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="currentColor" d="M100,20 Q130,60 140,100 T100,180 Q70,140 60,100 T100,20" />
        </svg>

        {/* Middle background floating circles - Made more vivid */}
        <div className="absolute top-1/3 left-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full bg-green-400 opacity-30 blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-2/3 left-1/4 w-40 h-40 md:w-56 md:h-56 rounded-full bg-teal-400 opacity-30 blur-2xl"></div>
        <div className="absolute top-1/2 right-1/4 w-36 h-36 md:w-64 md:h-64 rounded-full bg-blue-400 opacity-30 blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl relative z-10">
        <header className="text-center mb-16 animate-slide-down">
          <div className="inline-block mb-2 px-3 py-1 bg-green-100 rounded-full text-green-800 text-sm font-medium">
            <Droplet className="inline-block w-4 h-4 mr-1" />
            Green Bubble
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">Sustentabilidade em Cada Check-in</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Registre suas ações sustentáveis, acompanhe seu progresso e evolua sua jornada verde
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* Bubble Visualization - Left Column */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="glassmorphism rounded-xl p-6 w-full mb-6 animate-scale-in backdrop-blur-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm text-green-600 font-medium block mb-1">Seu Nível Atual</span>
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2">{getCurrentRank().icon}</span>
                    {getCurrentRank().name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500 block mb-1">Total de XP</span>
                  <div className="text-xl font-bold text-gray-800 flex items-center justify-end">
                    <Trophy className="w-5 h-5 text-amber-500 mr-1" />
                    {userProgress.currentXP} XP
                  </div>
                </div>
              </div>

              <div className="relative">
                <div
                  ref={bubbleRef}
                  className="relative w-full aspect-square max-w-xs mx-auto rounded-full border-4 border-teal-100 overflow-hidden bg-white/30 backdrop-blur-sm shadow-lg animate-float-bubble"
                >
                  {/* Water Fill */}
                  <div
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-400 to-cyan-300 rounded-b-full"
                    style={getWaterStyle()}
                  >
                    {/* Wave overlay */}
                    <div className="absolute top-0 left-0 w-full h-8 overflow-hidden">
                      <div className="wave h-12 w-[200%] absolute top-[-5px] left-0 bg-white/20 rounded-[100%]"></div>
                      <div
                        className="wave h-10 w-[200%] absolute top-[-5px] left-0 bg-white/10 rounded-[100%]"
                        style={{ animationDelay: "0.5s" }}
                      ></div>
                    </div>
                  </div>

                  {/* Ripple effects */}
                  {ripples.map((ripple) => (
                    <div
                      key={ripple.id}
                      className="ripple"
                      style={{
                        left: `${ripple.x}px`,
                        top: `${ripple.y}px`,
                      }}
                    ></div>
                  ))}

                  {/* Progress indicator */}
                  <div className="absolute bottom-2 left-0 right-0 text-center font-bold text-white text-xl drop-shadow-md">
                    {getCurrentProgressPercentage()}%
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                {getNextRank() ? (
                  <div>
                    <div className="mb-2 text-sm text-gray-600">
                      <span className="font-medium">{getRemainingXP()} XP</span> para o próximo nível
                    </div>
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white">
                        {getCurrentRank().icon}
                      </div>
                      <div className="mx-2 h-0.5 w-10 bg-gray-300"></div>
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-400">
                        {getNextRank()?.icon}
                      </div>
                    </div>
                    <h4 className="text-gray-700">
                      Próximo: <span className="font-semibold">{getNextRank()?.name}</span>
                    </h4>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-1">
                    <Award className="text-amber-500 w-5 h-5" />
                    <span className="font-bold text-gray-800">Nível Máximo Alcançado!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tips Section */}
            <div className="glassmorphism rounded-xl p-6 w-full animate-scale-in backdrop-blur-lg">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setExpandedTips(!expandedTips)}
              >
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <Star className="w-5 h-5 text-amber-500 mr-2" />
                  Dicas Sustentáveis
                </h3>
                {expandedTips ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {expandedTips && (
                <div className="mt-4 space-y-3 animate-slide-down">
                  <div className="p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <p className="text-gray-700">
                      Reduza o uso de plásticos descartáveis optando por alternativas reutilizáveis.
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <p className="text-gray-700">
                      Economize água fechando a torneira enquanto escova os dentes ou ensaboa as mãos.
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <p className="text-gray-700">
                      Use transporte público, bicicleta ou compartilhe caronas para reduzir emissões.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Check-in Form and History - Right Column */}
          <div className="md:col-span-7 flex flex-col">
            {/* Check-in Form */}
            <div className="glassmorphism rounded-xl p-6 mb-6 w-full animate-scale-in backdrop-blur-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <PlusCircle className="w-5 h-5 text-green-600 mr-2" />
                Registrar Ação Sustentável
              </h2>

              <div className="mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>
                    Você ganhará <strong>{getXPForCurrentRank()} XP</strong> por este check-in
                  </span>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Descreva sua ação sustentável..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none bg-white/70 backdrop-blur-sm"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCheckIn}
                  disabled={!comment.trim() || isCheckingIn}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isCheckingIn ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processando...
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Registrar Check-in
                    </>
                  )}
                </button>
              </div>

              {/* Success message */}
              {checkInSuccess && (
                <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-800 rounded-lg flex items-center animate-fade-in">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  <div>
                    <p className="font-medium">Parabéns! Você alcançou um novo nível!</p>
                    <p className="text-sm">Você agora é um {getCurrentRank().name}!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Check-in History */}
            <div className="glassmorphism rounded-xl p-6 w-full animate-scale-in backdrop-blur-lg flex-grow">
              <div
                className="flex justify-between items-center mb-3 cursor-pointer"
                onClick={() => setExpandedHistory(!expandedHistory)}
              >
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
                  Histórico de Check-ins
                </h2>
                {expandedHistory ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${expandedHistory ? "max-h-[500px]" : "max-h-60"} overflow-y-auto pr-2`}
              >
                {userProgress.checkIns.length > 0 ? (
                  <div className="space-y-4">
                    {userProgress.checkIns.map((checkIn) => (
                      <div
                        key={checkIn.id}
                        className="p-4 bg-white/60 backdrop-blur-sm rounded-lg transform transition-all duration-300 hover:bg-white/80 hover:shadow-md"
                      >
                        <p className="text-gray-800">{checkIn.description}</p>
                        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(checkIn.created_at)}
                          </span>
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <Trophy className="w-4 h-4 text-amber-500" />+{checkIn.xp_earned} XP
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum check-in registrado ainda.</p>
                    <p className="text-sm">Registre sua primeira ação sustentável!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ranks Section */}
        <div className="glassmorphism rounded-xl p-6 animate-scale-in backdrop-blur-lg mb-16">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Award className="w-5 h-5 text-green-600 mr-2" />
            Jornada de Sustentabilidade
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ranks.map((rank) => {
              const isCurrentRank = rank.id === userProgress.currentRank
              const isAchieved = userProgress.currentXP >= rank.points

              return (
                <div
                  key={rank.id}
                  className={`relative rounded-lg p-4 transition-all duration-300 ${
                    isCurrentRank
                      ? "bg-gradient-to-br from-green-100 to-emerald-200 shadow-md transform scale-[1.02]"
                      : isAchieved
                        ? "bg-white/70 backdrop-blur-sm"
                        : "bg-white/40 backdrop-blur-sm"
                  }`}
                >
                  {isCurrentRank && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Atual
                    </div>
                  )}

                  <div className="flex items-start mb-2">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br ${
                        isAchieved ? rank.color : "from-gray-300 to-gray-400"
                      } text-white mr-2 text-sm`}
                    >
                      {rank.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{rank.name}</h3>
                      <p className="text-xs text-gray-600">{rank.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={`${
                        rank.difficulty === "Easy"
                          ? "bg-green-100 text-green-800"
                          : rank.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      } px-2 py-0.5 rounded-full text-xs`}
                    >
                      {rank.difficulty === "Easy"
                        ? "+50 XP/check-in"
                        : rank.difficulty === "Medium"
                          ? "+25 XP/check-in"
                          : "+10 XP/check-in"}
                    </span>
                    <span className="text-gray-600">
                      {isAchieved ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Alcançado
                        </span>
                      ) : (
                        <>Requer {rank.points} XP</>
                      )}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <footer className="text-center text-gray-600 text-sm">
          <p>Desenvolvido com 💚 para um futuro mais sustentável</p>
        </footer>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        .glassmorphism {
          background: rgba(255, 255, 255, 0.7);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .animate-slide-down {
          animation: slideDown 0.6s ease-out;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out;
        }
        
        .animate-float-bubble {
          animation: floatBubble 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .ripple {
          position: absolute;
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple 1.5s ease-out;
        }
        
        .wave {
          animation: wave 8s linear infinite;
        }
        
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes floatBubble {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes ripple {
          0% { width: 0; height: 0; opacity: 0.8; }
          100% { width: 200px; height: 200px; opacity: 0; }
        }
        
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

export default SustainableCheckin

