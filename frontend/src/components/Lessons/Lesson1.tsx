"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Check, Leaf, Trash, Trash2, Recycle, Droplet, Zap, Award, Sparkles, RefreshCw } from "lucide-react"

interface WasteItem {
  id: number
  name: string
  type: string
  icon: string
  color: string
  glowColor: string
  shadowColor: string
}

interface Bin {
  id: string
  name: string
  color: string
  hoverColor: string
  activeColor: string
  icon: React.ReactNode
}

interface Props {
  onBack: () => void
}

// Enhanced waste items with more visual properties
const wasteItems: WasteItem[] = [
  {
    id: 1,
    name: "Garrafa PET",
    type: "plastic",
    icon: "🥤",
    color: "bg-gradient-to-br from-red-100 to-pink-200",
    glowColor: "red-400",
    shadowColor: "rgba(244, 63, 94, 0.4)",
  },
  {
    id: 2,
    name: "Jornal",
    type: "paper",
    icon: "📰",
    color: "bg-gradient-to-br from-blue-100 to-sky-200",
    glowColor: "blue-400",
    shadowColor: "rgba(59, 130, 246, 0.4)",
  },
  {
    id: 3,
    name: "Lata de Alumínio",
    type: "metal",
    icon: "🥫",
    color: "bg-gradient-to-br from-yellow-100 to-amber-200",
    glowColor: "yellow-400",
    shadowColor: "rgba(251, 191, 36, 0.4)",
  },
  {
    id: 4,
    name: "Pote de Vidro",
    type: "glass",
    icon: "🫙",
    color: "bg-gradient-to-br from-green-100 to-emerald-200",
    glowColor: "green-400",
    shadowColor: "rgba(52, 211, 153, 0.4)",
  },
  {
    id: 5,
    name: "Casca de Banana",
    type: "organic",
    icon: "🍌",
    color: "bg-gradient-to-br from-amber-100 to-yellow-200",
    glowColor: "amber-400",
    shadowColor: "rgba(217, 119, 6, 0.4)",
  },
  {
    id: 6,
    name: "Pilha",
    type: "hazardous",
    icon: "🔋",
    color: "bg-gradient-to-br from-purple-100 to-fuchsia-200",
    glowColor: "purple-400",
    shadowColor: "rgba(192, 132, 252, 0.4)",
  },
]

// Enhanced bins with hover and active states
const bins: Bin[] = [
  {
    id: "plastic",
    name: "Plástico",
    color: "bg-gradient-to-r from-red-500 to-pink-600",
    hoverColor: "from-red-600 to-pink-700",
    activeColor: "from-red-700 to-pink-800",
    icon: <Trash className="h-6 w-6" />,
  },
  {
    id: "paper",
    name: "Papel",
    color: "bg-gradient-to-r from-blue-500 to-sky-600",
    hoverColor: "from-blue-600 to-sky-700",
    activeColor: "from-blue-700 to-sky-800",
    icon: <Trash2 className="h-6 w-6" />,
  },
  {
    id: "metal",
    name: "Metal",
    color: "bg-gradient-to-r from-yellow-500 to-amber-600",
    hoverColor: "from-yellow-600 to-amber-700",
    activeColor: "from-yellow-700 to-amber-800",
    icon: <Recycle className="h-6 w-6" />,
  },
  {
    id: "glass",
    name: "Vidro",
    color: "bg-gradient-to-r from-green-500 to-emerald-600",
    hoverColor: "from-green-600 to-emerald-700",
    activeColor: "from-green-700 to-emerald-800",
    icon: <Droplet className="h-6 w-6" />,
  },
  {
    id: "organic",
    name: "Orgânico",
    color: "bg-gradient-to-r from-amber-500 to-yellow-600",
    hoverColor: "from-amber-600 to-yellow-700",
    activeColor: "from-amber-700 to-yellow-800",
    icon: <Leaf className="h-6 w-6" />,
  },
  {
    id: "hazardous",
    name: "Perigoso",
    color: "bg-gradient-to-r from-purple-500 to-fuchsia-600",
    hoverColor: "from-purple-600 to-fuchsia-700",
    activeColor: "from-purple-700 to-fuchsia-800",
    icon: <Zap className="h-6 w-6" />,
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
`

export default function EnhancedLesson1({ onBack }: Props) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [correctItems, setCorrectItems] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [activeBin, setActiveBin] = useState<string | null>(null)
  const [confetti, setConfetti] = useState(false)
  const [scoreAnimation, setScoreAnimation] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  // Refs for animations
  const scoreRef = useRef<HTMLDivElement>(null)
  const confettiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add the animation styles to the document head
    const styleElement = document.createElement("style")
    styleElement.innerHTML = animationStyles
    document.head.appendChild(styleElement)

    return () => {
      // Clean up the style element when component unmounts
      document.head.removeChild(styleElement)
    }
  }, [])

  useEffect(() => {
    const allItemsCorrect = wasteItems.length > 0 && correctItems.length === wasteItems.length
    if (allItemsCorrect && !isCompleted) {
      // Simulate API call
      setTimeout(() => {
        setIsCompleted(true)
        triggerConfetti()
      }, 500)
    }
  }, [correctItems.length, isCompleted])

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

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItem(id)
    // Add a ghost image for dragging
    const ghostElement = document.createElement("div")
    const item = wasteItems.find((item) => item.id === id)
    if (item) {
      ghostElement.innerHTML = `<span style="font-size: 40px;">${item.icon}</span>`
      ghostElement.className = "opacity-70"
      document.body.appendChild(ghostElement)
      e.dataTransfer.setDragImage(ghostElement, 20, 20)
      setTimeout(() => {
        document.body.removeChild(ghostElement)
      }, 0)
    }
  }

  const handleDragOver = (e: React.DragEvent, binId: string) => {
    e.preventDefault()
    setActiveBin(binId)
  }

  const handleDragLeave = () => {
    setActiveBin(null)
  }

  const handleDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault()
    setActiveBin(null)

    if (draggedItem === null) return

    const item = wasteItems.find((item) => item.id === draggedItem)
    if (item) {
      if (item.type === binType) {
        if (!correctItems.includes(item.id)) {
          setCorrectItems((prev) => [...prev, item.id])
          setScore((prev) => prev + 10)
          animateScore()
          showToast("Correto! 🎉", `${item.name} vai no recipiente de ${binType}!`, true)
        }
      } else {
        showToast("Tente novamente! 🤔", `${item.name} não pertence a este recipiente.`, false)
        // Add shake animation to the wrong bin
        const binElement = document.getElementById(`bin-${binType}`)
        if (binElement) {
          binElement.classList.add("shake-animation")
          setTimeout(() => {
            binElement.classList.remove("shake-animation")
          }, 500)
        }
      }
    }
    setDraggedItem(null)
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
        {/* Animated background shapes */}
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
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-teal-600 mb-4 flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-yellow-500" />
              Lição 1: Introdução à Reciclagem
            </h2>

            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Arraste cada item para a lixeira correta para aprender sobre separação de resíduos. Vamos cuidar do nosso
              planeta juntos!
            </p>

            {/* Progress bar with animation */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <RefreshCw className={`h-4 w-4 ${correctItems.length > 0 ? "animate-spin" : ""}`} />
                  Progresso da Lição
                </span>
                <span className="text-sm font-medium bg-green-100 px-2 py-1 rounded-md">
                  {correctItems.length}/{wasteItems.length}
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 transition-all duration-1000 ease-out"
                  style={{ width: `${(correctItems.length / wasteItems.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Items section with hover effects */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200 shadow-lg transition-all duration-300 hover:shadow-xl">
                <h3 className="font-bold text-xl mb-4 text-green-700 flex items-center gap-2">
                  <Recycle className="h-5 w-5 text-green-600" />
                  Itens para Reciclar
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {wasteItems.map((item) => (
                    <div
                      key={item.id}
                      draggable={!correctItems.includes(item.id)}
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`p-4 rounded-xl border-2 border-white/50 flex items-center gap-3 transition-all duration-300 ${
                        correctItems.includes(item.id)
                          ? "opacity-50 cursor-not-allowed bg-gray-100"
                          : `${item.color} cursor-grab active:cursor-grabbing hover:scale-105 hover:shadow-lg`
                      }`}
                      style={{
                        boxShadow:
                          hoveredItem === item.id && !correctItems.includes(item.id)
                            ? `0 0 15px ${item.shadowColor}`
                            : "none",
                        transform:
                          hoveredItem === item.id && !correctItems.includes(item.id)
                            ? "translateY(-5px)"
                            : "translateY(0)",
                      }}
                    >
                      <span
                        className={`text-3xl transition-all duration-300 ${
                          hoveredItem === item.id && !correctItems.includes(item.id) ? "scale-125" : ""
                        }`}
                        role="img"
                        aria-label={item.name}
                      >
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                      {correctItems.includes(item.id) && <Check className="h-5 w-5 text-green-500 ml-auto" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bins section with hover and active states */}
              <div>
                <h3 className="font-bold text-xl mb-4 text-green-700 flex items-center gap-2">
                  <Trash className="h-5 w-5 text-green-600" />
                  Lixeiras
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {bins.map((bin) => (
                    <div
                      id={`bin-${bin.id}`}
                      key={bin.id}
                      onDragOver={(e) => handleDragOver(e, bin.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, bin.id)}
                      className={`
                        ${activeBin === bin.id ? `bg-gradient-to-r ${bin.activeColor}` : `bg-gradient-to-r ${bin.color}`} 
                        text-white p-6 rounded-xl flex flex-col items-center justify-center h-32 
                        transition-all duration-300 hover:shadow-xl transform 
                        ${activeBin === bin.id ? "scale-110" : "hover:scale-105"}
                      `}
                      style={{
                        boxShadow:
                          activeBin === bin.id ? "0 0 20px rgba(0, 0, 0, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div
                        className={`
                        ${activeBin === bin.id ? "scale-125" : ""} 
                        transition-transform duration-300
                      `}
                      >
                        {bin.icon}
                      </div>
                      <span className="mt-3 font-medium text-lg">{bin.name}</span>

                      {/* Animated indicator when bin is active */}
                      {activeBin === bin.id && (
                        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          <div className="absolute -inset-1 border-2 border-white/30 rounded-xl"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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
                    🎉 Parabéns! Você completou a Lição 1
                  </h3>

                  <p className="text-gray-700 mb-6 max-w-lg mx-auto">
                    Você dominou os fundamentos da separação de resíduos para reciclagem. Continue aprendendo para se
                    tornar um verdadeiro defensor do meio ambiente!
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
        </div>
      </main>
    </div>
  )
}
