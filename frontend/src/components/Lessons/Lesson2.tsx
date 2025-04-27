"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Check, Leaf, Info, Award, Sparkles, RefreshCw, Brain, Zap, Clock } from "lucide-react"

interface MemoryItem {
  id: number
  type: string
  emoji: string
  name: string
  flipped?: boolean
  matched?: boolean
  color: string
  glowColor: string
}

interface Props {
  onBack: () => void
}

// Enhanced memory items with colors for visual appeal
const memoryItems = [
  {
    id: 1,
    type: "plastic",
    emoji: "🥤",
    name: "Garrafa Plástica",
    color: "from-red-100 to-pink-200",
    glowColor: "rgba(244, 63, 94, 0.4)",
  },
  {
    id: 2,
    type: "plastic",
    emoji: "🥤",
    name: "Garrafa Plástica",
    color: "from-red-100 to-pink-200",
    glowColor: "rgba(244, 63, 94, 0.4)",
  },
  {
    id: 3,
    type: "paper",
    emoji: "📰",
    name: "Jornal",
    color: "from-blue-100 to-sky-200",
    glowColor: "rgba(59, 130, 246, 0.4)",
  },
  {
    id: 4,
    type: "paper",
    emoji: "📰",
    name: "Jornal",
    color: "from-blue-100 to-sky-200",
    glowColor: "rgba(59, 130, 246, 0.4)",
  },
  {
    id: 5,
    type: "glass",
    emoji: "🫙",
    name: "Pote de Vidro",
    color: "from-green-100 to-emerald-200",
    glowColor: "rgba(52, 211, 153, 0.4)",
  },
  {
    id: 6,
    type: "glass",
    emoji: "🫙",
    name: "Pote de Vidro",
    color: "from-green-100 to-emerald-200",
    glowColor: "rgba(52, 211, 153, 0.4)",
  },
  {
    id: 7,
    type: "metal",
    emoji: "🥫",
    name: "Lata",
    color: "from-yellow-100 to-amber-200",
    glowColor: "rgba(251, 191, 36, 0.4)",
  },
  {
    id: 8,
    type: "metal",
    emoji: "🥫",
    name: "Lata",
    color: "from-yellow-100 to-amber-200",
    glowColor: "rgba(251, 191, 36, 0.4)",
  },
  {
    id: 9,
    type: "organic",
    emoji: "🍌",
    name: "Casca de Banana",
    color: "from-amber-100 to-yellow-200",
    glowColor: "rgba(217, 119, 6, 0.4)",
  },
  {
    id: 10,
    type: "organic",
    emoji: "🍌",
    name: "Casca de Banana",
    color: "from-amber-100 to-yellow-200",
    glowColor: "rgba(217, 119, 6, 0.4)",
  },
  {
    id: 11,
    type: "hazardous",
    emoji: "🔋",
    name: "Pilha",
    color: "from-purple-100 to-fuchsia-200",
    glowColor: "rgba(192, 132, 252, 0.4)",
  },
  {
    id: 12,
    type: "hazardous",
    emoji: "🔋",
    name: "Pilha",
    color: "from-purple-100 to-fuchsia-200",
    glowColor: "rgba(192, 132, 252, 0.4)",
  },
]

// Define animations as a CSS string
const animationStyles = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes glow {
    0%, 100% { filter: drop-shadow(0 0 5px currentColor); }
    50% { filter: drop-shadow(0 0 15px currentColor); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
  }
  
  @keyframes scoreJump {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  
  @keyframes fall {
    0% { 
      transform: translateY(-50px) rotate(0deg); 
      opacity: 1;
    }
    100% { 
      transform: translateY(1000px) rotate(720deg); 
      opacity: 0;
    }
  }
  
  @keyframes flipCard {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(180deg); }
  }
  
  @keyframes unflipCard {
    0% { transform: rotateY(180deg); }
    100% { transform: rotateY(0deg); }
  }
  
  @keyframes matchPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  .shake-animation {
    animation: shake 0.5s ease-in-out;
  }
  
  .float-animation {
    animation: float 3s ease-in-out infinite;
  }
  
  .pulse-animation {
    animation: pulse 2s ease-in-out infinite;
  }
  
  .glow-animation {
    animation: glow 2s ease-in-out infinite;
  }
  
  .score-jump {
    animation: scoreJump 0.5s ease-in-out;
  }
  
  .match-pulse {
    animation: matchPulse 0.5s ease-in-out;
  }
  
  .flip-card {
    animation: flipCard 0.5s ease-in-out forwards;
  }
  
  .unflip-card {
    animation: unflipCard 0.5s ease-in-out forwards;
  }
  
  .card-front {
    backface-visibility: hidden;
    transform: rotateY(180deg);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .card-back {
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  
  .card-flipped .card-inner {
    transform: rotateY(180deg);
  }
`

export default function EnhancedMemoryGame({ onBack }: Props) {
  const [cards, setCards] = useState<MemoryItem[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [timer, setTimer] = useState(0)
  const [confetti, setConfetti] = useState(false)
  const [scoreAnimation, setScoreAnimation] = useState(false)
  const [lastMatchedPair, setLastMatchedPair] = useState<string | null>(null)
  const [cardFlipAnimation, setCardFlipAnimation] = useState<number | null>(null)

  // Refs for animations
  const scoreRef = useRef<HTMLDivElement>(null)
  const confettiRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Add the animation styles to the document head
    const styleElement = document.createElement("style")
    styleElement.innerHTML = animationStyles
    document.head.appendChild(styleElement)

    initGame()

    return () => {
      // Clean up the style element when component unmounts
      document.head.removeChild(styleElement)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    const totalPairs = memoryItems.length / 2
    if (matchedPairs === totalPairs && !isCompleted && gameStarted) {
      // Simulate API call
      setTimeout(() => {
        setIsCompleted(true)
        triggerConfetti()
        if (timerRef.current) clearInterval(timerRef.current)
      }, 500)
    }
  }, [matchedPairs, isCompleted, gameStarted])

  useEffect(() => {
    if (moves === 1 && !gameStarted) {
      setGameStarted(true)
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
  }, [moves, gameStarted])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards

      const timer = setTimeout(() => {
        if (cards[first].type === cards[second].type) {
          setCards((prevCards) =>
            prevCards.map((card, index) => (index === first || index === second ? { ...card, matched: true } : card)),
          )
          setMatchedPairs((prev) => prev + 1)
          setScore((prev) => prev + 15)
          setLastMatchedPair(cards[first].type)
          animateScore()
          showToast("Par encontrado! 🎉", `Você encontrou um par de ${cards[first].name}!`, true)
        } else {
          setCards((prevCards) =>
            prevCards.map((card, index) => (index === first || index === second ? { ...card, flipped: false } : card)),
          )
          showToast("Tente novamente! 🤔", "Essas cartas não formam um par.", false)
        }

        setFlippedCards([])
        setMoves((prev) => prev + 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [flippedCards, cards])

  // Confetti animation effect
  const triggerConfetti = () => {
    setConfetti(true)
    setTimeout(() => setConfetti(false), 3000)
  }

  // Score animation effect
  const animateScore = () => {
    setScoreAnimation(true)
    setTimeout(() => setScoreAnimation(false), 1000)
  }

  const initGame = () => {
    const shuffledCards = [...memoryItems]
      .sort(() => Math.random() - 0.5)
      .map((item) => ({ ...item, flipped: false, matched: false }))

    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setIsCompleted(false)
    setScore(0)
    setGameStarted(false)
    setTimer(0)
    setLastMatchedPair(null)

    if (timerRef.current) clearInterval(timerRef.current)
  }

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) {
      return
    }

    setCardFlipAnimation(index)
    setTimeout(() => setCardFlipAnimation(null), 500)

    setCards(cards.map((card, i) => (i === index ? { ...card, flipped: true } : card)))
    setFlippedCards([...flippedCards, index])
  }

  const showToast = (title: string, message: string, success: boolean) => {
    const toast = document.createElement("div")
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-xl ${
      success ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-rose-600"
    } text-white transform transition-all duration-500 translate-x-0 z-50 backdrop-blur-sm`

    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-2xl">${success ? "✅" : "❌"}</span>
        <div>
          <h4 class="font-bold text-lg">${title}</h4>
          <p>${message}</p>
        </div>
      </div>
    `

    document.body.appendChild(toast)

    // Animate in
    setTimeout(() => {
      toast.style.transform = "translateX(0) scale(1)"
    }, 10)

    // Animate out
    setTimeout(() => {
      toast.style.transform = "translateX(150%) scale(0.8)"
      toast.style.opacity = "0"
      setTimeout(() => document.body.removeChild(toast), 500)
    }, 3000)
  }

  // Format timer to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Generate random confetti pieces
  const renderConfetti = () => {
    const pieces = []
    const colors = ["red", "blue", "green", "yellow", "purple", "pink", "orange"]

    for (let i = 0; i < 100; i++) {
      const left = Math.random() * 100
      const top = Math.random() * 100
      const size = Math.random() * 10 + 5
      const color = colors[Math.floor(Math.random() * colors.length)]
      const delay = Math.random() * 3
      const duration = Math.random() * 3 + 2

      pieces.push(
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            animation: `fall ${duration}s ease-in ${delay}s forwards`,
            opacity: 0,
          }}
        />,
      )
    }

    return pieces
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-teal-50 to-blue-100 overflow-hidden">
      {/* Confetti container */}
      {confetti && (
        <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {renderConfetti()}
        </div>
      )}

      {/* Header with animated gradient */}
     <header className="bg-gradient-to-r from-green-600 via-teal-500 to-emerald-600 text-white p-6 shadow-lg relative overflow-hidden">
             <div className="container mx-auto flex items-center justify-between relative z-10">
               <button
                 onClick={onBack}
                 className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
               >
                 <ArrowLeft className="h-5 w-5" />
                 <span>Voltar</span>
               </button>
     
               <div className="flex items-center gap-2 pulse-animation">
                 <Leaf className="h-8 w-8 glow-animation text-green-300" />
                 <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200">
                   EcoStudy
                 </h1>
               </div>
     
               <div
                 ref={scoreRef}
                 className={`flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${scoreAnimation ? "score-jump" : ""}`}
               >
                 <Award className="h-5 w-5 text-yellow-300" />
                 <span className="font-semibold">Pontos: {score}</span>
               </div>
             </div>
           </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main content card with glass effect */}
          <div className="rounded-xl shadow-2xl p-8 mb-8 backdrop-blur-md bg-white/80 border border-white/50 transition-all duration-500 hover:shadow-emerald-200/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-teal-600 mb-0 flex items-center gap-3">
                <Brain className="h-7 w-7 text-teal-500" />
                Lição 2: Jogo da Memória Reciclável
              </h2>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 hover:bg-green-50 rounded-full transition-colors relative group"
                aria-label="Mostrar informações"
              >
                <Info className="h-6 w-6 text-green-700" />
                <span className="absolute -top-10 right-0 bg-green-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Como jogar
                </span>
              </button>
            </div>

            {showInfo && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 p-6 rounded-xl mb-6 shadow-inner animate-in fade-in slide-in-from-top-5 duration-300">
                <h3 className="font-bold text-xl text-green-800 mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Como Jogar
                </h3>
                <p className="text-green-700 mb-3">
                  Encontre os pares de itens recicláveis virando as cartas. Memorize as posições para encontrar todos os
                  pares com o menor número de movimentos.
                </p>
                <p className="text-green-700">
                  Cada par encontrado te ensina sobre um tipo diferente de material reciclável e aumenta sua pontuação!
                </p>
              </div>
            )}

            {/* Game stats with animated elements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 shadow-inner flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className={`h-5 w-5 text-green-600 ${moves > 0 ? "animate-spin" : ""}`} />
                  <span className="font-medium text-green-800">Movimentos</span>
                </div>
                <span className="text-xl font-bold text-green-700">{moves}</span>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-sky-100 rounded-lg p-4 shadow-inner flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Tempo</span>
                </div>
                <span className="text-xl font-bold text-blue-700">{formatTime(timer)}</span>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-fuchsia-100 rounded-lg p-4 shadow-inner flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-800">Pares</span>
                </div>
                <span className="text-xl font-bold text-purple-700">
                  {matchedPairs}/{memoryItems.length / 2}
                </span>
              </div>
            </div>

            {/* Progress bar with animation */}
            <div className="mb-6">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 transition-all duration-1000 ease-out"
                  style={{ width: `${(matchedPairs / (memoryItems.length / 2)) * 100}%` }}
                />
              </div>
            </div>

            {/* Last matched pair indicator */}
            {lastMatchedPair && (
              <div className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 p-3 rounded-lg shadow-sm match-pulse">
                <p className="text-amber-800 text-center font-medium">
                  Último par encontrado: {memoryItems.find((item) => item.type === lastMatchedPair)?.name}
                </p>
              </div>
            )}

            <div className="flex justify-end mb-6">
              <button
                onClick={initGame}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reiniciar Jogo
              </button>
            </div>

            {/* Memory card grid with 3D flip effect */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className={`aspect-square perspective-1000 cursor-pointer ${
                    card.flipped || card.matched ? "card-flipped" : ""
                  }`}
                  onClick={() => handleCardClick(index)}
                >
                  <div
                    className={`card-inner rounded-xl shadow-md ${
                      cardFlipAnimation === index ? "transition-none" : "transition-transform"
                    }`}
                  >
                    {/* Card Back */}
                    <div
                      className={`card-back rounded-xl flex items-center justify-center ${
                        card.flipped || card.matched ? "" : "bg-gradient-to-br from-green-500 to-emerald-600"
                      }`}
                    >
                      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
                        {/* Decorative elements on card back */}
                        <div className="absolute inset-0">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute rounded-full bg-white/10"
                              style={{
                                width: `${Math.random() * 30 + 10}px`,
                                height: `${Math.random() * 30 + 10}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 2}s`,
                              }}
                            />
                          ))}
                        </div>
                        <Leaf className="h-10 w-10 text-white/80" />
                      </div>
                    </div>

                    {/* Card Front */}
                    <div
                      className={`card-front rounded-xl flex items-center justify-center bg-gradient-to-br ${card.color} border-2 border-white/50`}
                      style={{
                        boxShadow: card.matched ? `0 0 15px ${card.glowColor}` : "none",
                      }}
                    >
                      <div className="text-center p-2">
                        <span
                          className={`text-4xl block mb-2 ${card.matched ? "animate-bounce" : ""}`}
                          role="img"
                          aria-hidden="true"
                        >
                          {card.emoji}
                        </span>
                        <span className="text-sm font-medium text-gray-800 block">{card.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Completion card with animations */}
            {isCompleted && (
              <div className="mt-8 p-8 bg-gradient-to-r from-green-100 via-emerald-50 to-teal-100 rounded-xl border border-green-200 text-center relative overflow-hidden shadow-xl transition-all duration-1000 animate-in fade-in slide-in-from-bottom-10">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-green-500/10"
                      style={{
                        width: `${Math.random() * 100 + 20}px`,
                        height: `${Math.random() * 100 + 20}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${Math.random() * 5 + 3}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10">
                  <div className="inline-block p-4 bg-white/50 backdrop-blur-sm rounded-full mb-4 pulse-animation">
                    <Award className="h-12 w-12 text-yellow-500" />
                  </div>

                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-teal-600 mb-3">
                    🎉 Parabéns! Você completou a Lição 2
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto mb-6">
                    <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Tempo</p>
                      <p className="text-xl font-bold text-green-700">{formatTime(timer)}</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Movimentos</p>
                      <p className="text-xl font-bold text-green-700">{moves}</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Pontuação</p>
                      <p className="text-xl font-bold text-green-700">{score}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 max-w-lg mx-auto">
                    Você encontrou todos os pares e aprendeu sobre os diferentes tipos de materiais recicláveis.
                    Continue praticando para melhorar sua memória e conhecimento sobre reciclagem!
                  </p>

                  <button
                    onClick={onBack}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
                  >
                    Voltar para o Menu Principal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Accessibility tips card with enhanced styling */}
          <div className="rounded-xl shadow-xl p-8 backdrop-blur-md bg-white/80 border border-white/50 transition-all duration-500 hover:shadow-blue-200/30">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-sky-600 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Dicas de Acessibilidade
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-md">
                <Check className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-gray-700">
                  Use <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Tab</kbd> para navegar entre as cartas e{" "}
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> para selecioná-las.
                </span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-md">
                <Check className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-gray-700">
                  Cada carta tem uma descrição de áudio para leitores de tela, facilitando o acesso para todos.
                </span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-md">
                <Check className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-gray-700">
                  O jogo pode ser jogado apenas com o teclado, sem necessidade de mouse, tornando-o mais acessível.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
