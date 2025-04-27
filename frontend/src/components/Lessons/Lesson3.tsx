"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Check, Leaf, Info, X, Award, Droplets, Wind, Sun } from "lucide-react"
import api from "../../services/API/axios"
import routes from "../../services/API/routes"

// Animation keyframes defined as CSS-in-JS objects
const keyframes = {
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(5deg); }
    }
  `,
  pulseSlow: `
    @keyframes pulseSlow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(0.95); }
    }
  `,
  bounceSubtle: `
    @keyframes bounceSubtle {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `,
  slideInRight: `
    @keyframes slideInRight {
      0% { transform: translateX(100%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
  `,
  fadeIn: `
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
  `,
  spinSlow: `
    @keyframes spinSlow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
}

// Custom animation classes
const animationClasses = {
  pulseSlow: { animation: "pulseSlow 3s infinite ease-in-out" },
  bounceSubtle: { animation: "bounceSubtle 2s infinite ease-in-out" },
  float: { animation: "float 5s infinite ease-in-out" },
  spinSlow: { animation: "spinSlow 10s linear infinite" },
  slideInRight: { animation: "slideInRight 0.5s forwards" },
  fadeIn: { animation: "fadeIn 0.5s forwards" },
  textShadow: { textShadow: "0 1px 2px rgba(0,0,0,0.2)" },
  scale102: { transform: "scale(1.02)" },
  gradientRadial: { backgroundImage: "radial-gradient(circle, rgba(255,255,255,0) 0%, rgba(101,67,33,0.5) 100%)" },
}

// Itens para compostagem
const compostItems = [
  {
    id: 1,
    name: "Cascas de Frutas",
    type: "compostable",
    icon: "🍎",
    description: "Restos de frutas são ótimos para compostagem, ricos em nutrientes.",
  },
  {
    id: 2,
    name: "Folhas Secas",
    type: "compostable",
    icon: "🍂",
    description: "Adicionam carbono à compostagem e ajudam na aeração.",
  },
  {
    id: 3,
    name: "Borra de Café",
    type: "compostable",
    icon: "☕",
    description: "Rica em nitrogênio, ajuda a atrair minhocas benéficas.",
  },
  {
    id: 4,
    name: "Casca de Ovo",
    type: "compostable",
    icon: "🥚",
    description: "Adiciona cálcio e minerais ao composto final.",
  },
  {
    id: 5,
    name: "Restos de Legumes",
    type: "compostable",
    icon: "🥕",
    description: "Decomposição rápida e ricos em nutrientes.",
  },
  {
    id: 6,
    name: "Saco Plástico",
    type: "non-compostable",
    icon: "🛍️",
    description: "Plásticos não se decompõem naturalmente e contaminam o composto.",
  },
  {
    id: 7,
    name: "Carne",
    type: "non-compostable",
    icon: "🥩",
    description: "Atrai pragas e pode causar mau cheiro na compostagem doméstica.",
  },
  {
    id: 8,
    name: "Laticínios",
    type: "non-compostable",
    icon: "🧀",
    description: "Pode atrair animais indesejados e causar odores.",
  },
  {
    id: 9,
    name: "Óleo de Cozinha",
    type: "non-compostable",
    icon: "🫗",
    description: "Dificulta a decomposição e pode atrair pragas.",
  },
  {
    id: 10,
    name: "Papel Toalha",
    type: "compostable",
    icon: "🧻",
    description: "Papel não tratado pode ser compostado e adiciona carbono.",
  },
  {
    id: 11,
    name: "Pilha",
    type: "non-compostable",
    icon: "🔋",
    description: "Contém metais pesados tóxicos que contaminam o solo.",
  },
  {
    id: 12,
    name: "Vidro",
    type: "non-compostable",
    icon: "🫙",
    description: "Não se decompõe e pode causar acidentes durante o manuseio do composto.",
  },
]

interface Props {
  onBack: () => void
}

export default function Lesson3({ onBack }: Props) {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [compostHealth, setCompostHealth] = useState(50) // 0-100
  const [stage, setStage] = useState(1) // 1-3 (seleção, mistura, resultado)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [showItemInfo, setShowItemInfo] = useState<number | null>(null)
  const [animateStage, setAnimateStage] = useState(false)
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; color: string; speed: number; angle: number }>
  >([])
  const [showConfetti, setShowConfetti] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const confettiRef = useRef<HTMLCanvasElement>(null)
  const [toasts, setToasts] = useState<Array<{ id: number; title: string; message: string; success: boolean }>>([])
  const [nextToastId, setNextToastId] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Generate particles for background effect
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 2,
      color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.random() * 0.3 + 0.1})`,
      speed: Math.random() * 0.5 + 0.2,
      angle: Math.random() * Math.PI * 2,
    }))
    setParticles(newParticles)
  }, [])

  // Animate particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          // Move particle
          const x = particle.x + Math.cos(particle.angle) * particle.speed
          const y = particle.y + Math.sin(particle.angle) * particle.speed

          // Bounce off edges
          let angle = particle.angle
          if (x <= 0 || x >= canvas.width) angle = Math.PI - angle
          if (y <= 0 || y >= canvas.height) angle = -angle

          // Draw particle
          ctx.beginPath()
          ctx.arc(x, y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.fill()

          return {
            ...particle,
            x: x <= 0 ? particle.size : x >= canvas.width ? canvas.width - particle.size : x,
            y: y <= 0 ? particle.size : y >= canvas.height ? canvas.height - particle.size : y,
            angle,
          }
        }),
      )

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [particles])

  // Confetti animation for completion
  useEffect(() => {
    if (!showConfetti || !confettiRef.current) return

    const canvas = confettiRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const confettiPieces = Array.from({ length: 200 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: Math.random() * 10 + 5,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      speedX: Math.random() * 15 - 7.5,
      speedY: Math.random() * -15 - 5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: Math.random() * 0.2 - 0.1,
      gravity: 0.3,
      opacity: 1,
      shape: Math.floor(Math.random() * 3), // 0: square, 1: circle, 2: triangle
    }))

    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let stillActive = false

      confettiPieces.forEach((piece) => {
        if (piece.opacity <= 0) return

        stillActive = true

        piece.x += piece.speedX
        piece.y += piece.speedY
        piece.speedY += piece.gravity
        piece.rotation += piece.rotationSpeed

        // Fade out when reaching bottom
        if (piece.y > canvas.height * 0.8) {
          piece.opacity -= 0.02
        }

        ctx.save()
        ctx.translate(piece.x, piece.y)
        ctx.rotate(piece.rotation)
        ctx.globalAlpha = piece.opacity
        ctx.fillStyle = piece.color

        // Draw different shapes
        if (piece.shape === 0) {
          // Square
          ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size)
        } else if (piece.shape === 1) {
          // Circle
          ctx.beginPath()
          ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Triangle
          ctx.beginPath()
          ctx.moveTo(0, -piece.size / 2)
          ctx.lineTo(piece.size / 2, piece.size / 2)
          ctx.lineTo(-piece.size / 2, piece.size / 2)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()
      })

      if (stillActive) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setShowConfetti(false)
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [showConfetti])

  useEffect(() => {
    if (stage === 3 && compostHealth >= 70) {
      if (!isCompleted) {
        const completionApi = async () => {
          try {
            const response = await api.post(routes.study.lessons_completion.create, { lesson: 3 })

            if (response.status === 201) {
              setIsCompleted(true)
              setShowConfetti(true)
            } else {
              console.error(response.data)
            }
          } catch (e) {
            console.error(e)
          }
        }

        completionApi()
      }
    }
  }, [stage, compostHealth, isCompleted])

  const handleItemSelect = (id: number) => {
    const item = compostItems.find((item) => item.id === id)
    if (!item) return

    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
      if (item.type === "compostable") {
        setCompostHealth((prev) => Math.max(0, prev - 10))
      } else {
        setCompostHealth((prev) => Math.min(100, prev + 10))
      }
      setScore((prev) => Math.max(0, prev - 5))
    } else {
      setSelectedItems([...selectedItems, id])
      if (item.type === "compostable") {
        setCompostHealth((prev) => Math.min(100, prev + 10))
        setScore((prev) => prev + 10)
        showToast("Boa escolha!", `${item.name} é ótimo para compostagem.`, true)
      } else {
        setCompostHealth((prev) => Math.max(0, prev - 15))
        setScore((prev) => Math.max(0, prev - 5))
        showToast("Cuidado!", `${item.name} não deve ir para compostagem.`, false)
      }
    }
  }

  const handleNextStage = () => {
    if (stage < 3 && !isTransitioning) {
      setIsTransitioning(true)
      setAnimateStage(true)

      setTimeout(() => {
        setStage((prev) => prev + 1)
        if (stage === 2 && compostHealth >= 70) {
          setScore((prev) => prev + 20)
        }

        setTimeout(() => {
          setAnimateStage(false)
          setIsTransitioning(false)
        }, 500)
      }, 500)
    }
  }

  const handleReset = () => {
    setIsTransitioning(true)
    setAnimateStage(true)

    setTimeout(() => {
      setSelectedItems([])
      setCompostHealth(50)
      setStage(1)
      setScore(0)
      setIsCompleted(false)

      setTimeout(() => {
        setAnimateStage(false)
        setIsTransitioning(false)
      }, 500)
    }, 500)
  }

  const getCompostHealthText = () => {
    if (compostHealth >= 80) return "Excelente"
    if (compostHealth >= 60) return "Bom"
    if (compostHealth >= 40) return "Regular"
    if (compostHealth >= 20) return "Ruim"
    return "Péssimo"
  }

  const getCompostHealthColor = () => {
    if (compostHealth >= 80) return "text-green-600"
    if (compostHealth >= 60) return "text-green-500"
    if (compostHealth >= 40) return "text-yellow-500"
    if (compostHealth >= 20) return "text-orange-500"
    return "text-red-500"
  }

  const showToast = (title: string, message: string, success: boolean) => {
    const id = nextToastId
    setNextToastId((prev) => prev + 1)

    setToasts((prev) => [...prev, { id, title, message, success }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Inject keyframes */}
      <style dangerouslySetInnerHTML={{ __html: Object.values(keyframes).join("\n") }} />

      {/* Animated background canvas */}
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />

      {/* Confetti canvas for celebration */}
      {showConfetti && (
        <canvas ref={confettiRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" />
      )}

      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg transform transition-all duration-500 ${
              toast.success
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : "bg-gradient-to-r from-red-500 to-rose-600"
            } text-white max-w-xs`}
            style={animationClasses.slideInRight}
          >
            <h4 className="font-bold">{toast.title}</h4>
            <p>{toast.message}</p>
          </div>
        ))}
      </div>

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 relative z-10">
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
               </div>
             </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div
              className={`bg-white rounded-xl shadow-xl p-8 mb-8 backdrop-blur-sm bg-white/90 transition-all duration-500 transform ${
                animateStage ? "opacity-0 scale-95" : "opacity-100 scale-100"
              } hover:shadow-2xl border border-green-100`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-teal-600">
                  Lição 3: Compostagem Básica
                </h2>
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-2 hover:bg-green-50 rounded-full transition-all duration-300 transform hover:rotate-180"
                >
                  <Info className="h-6 w-6 text-green-700" />
                </button>
              </div>

              {showInfo && (
                <div
                  className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 p-6 rounded-xl mb-6 transform transition-all duration-500 shadow-inner"
                  style={animationClasses.fadeIn}
                >
                  <h3 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-green-800 to-teal-700 mb-3">
                    Sobre Compostagem
                  </h3>
                  <p className="text-green-700 mb-3 leading-relaxed">
                    Compostagem é o processo natural de decomposição de materiais orgânicos que resulta em um rico
                    fertilizante. Nem todos os materiais podem ser compostados - alguns podem contaminar o composto ou
                    atrair pragas.
                  </p>
                  <p className="text-green-700 leading-relaxed">
                    Nesta atividade, você aprenderá quais materiais são adequados para compostagem doméstica.
                  </p>

                  <div className="flex flex-wrap gap-4 mt-4 justify-center">
                    <div className="flex items-center gap-2 bg-white/50 p-3 rounded-lg shadow-sm">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium">Umidade adequada</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/50 p-3 rounded-lg shadow-sm">
                      <Wind className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium">Aeração</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/50 p-3 rounded-lg shadow-sm">
                      <Sun className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium">Calor</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium bg-green-100 px-3 py-1 rounded-full">Estágio {stage}/3</span>
                  <span className={`text-sm font-medium ${getCompostHealthColor()} bg-gray-100 px-3 py-1 rounded-full`}>
                    Saúde da Compostagem: {getCompostHealthText()} ({compostHealth}%)
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      compostHealth >= 60
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : compostHealth >= 30
                          ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                          : "bg-gradient-to-r from-red-500 to-rose-500"
                    }`}
                    style={{
                      width: `${compostHealth}%`,
                      boxShadow: "0 0 10px rgba(0, 255, 0, 0.5)",
                    }}
                  />
                </div>
              </div>

              {stage === 1 && (
                <div style={animationClasses.fadeIn}>
                  <h3 className="font-semibold mb-3 text-green-700 text-xl">
                    Selecione os materiais para sua composteira
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Clique nos itens que você acredita que podem ser compostados. Escolha com cuidado!
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                    {compostItems.map((item) => (
                      <div key={item.id} className="relative group">
                        <button
                          onClick={() => handleItemSelect(item.id)}
                          className={`w-full p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-300 transform ${
                            selectedItems.includes(item.id)
                              ? "bg-gradient-to-br from-amber-100 to-amber-200 border-amber-400 scale-105 shadow-lg"
                              : "bg-gray-50 border-gray-200 hover:border-amber-300 hover:scale-105 hover:shadow-md"
                          }`}
                          aria-label={`${item.name} - Clique para ${
                            selectedItems.includes(item.id) ? "remover da" : "adicionar à"
                          } composteira`}
                        >
                          <span
                            className="text-3xl transition-transform duration-300 transform group-hover:scale-125 group-hover:rotate-12"
                            role="img"
                            aria-hidden="true"
                            style={selectedItems.includes(item.id) ? animationClasses.bounceSubtle : {}}
                          >
                            {item.icon}
                          </span>
                          <span className="text-sm font-medium text-center">{item.name}</span>

                          {selectedItems.includes(item.id) && (
                            <div
                              className="absolute -top-2 -right-2 bg-amber-400 rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                              style={animationClasses.bounceSubtle}
                            >
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                        <button
                          onClick={() => setShowItemInfo(showItemInfo === item.id ? null : item.id)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm hover:bg-gray-300 transition-colors z-10"
                          aria-label={`Informações sobre ${item.name}`}
                        >
                          i
                        </button>

                        {showItemInfo === item.id && (
                          <div
                            className="absolute z-20 top-full left-0 right-0 mt-2 p-3 bg-white rounded-lg shadow-lg text-sm"
                            style={animationClasses.fadeIn}
                          >
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                            <p className="text-gray-700 relative z-10">{item.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextStage}
                      disabled={selectedItems.length === 0 || isTransitioning}
                      className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
                    >
                      Próximo Estágio
                    </button>
                  </div>
                </div>
              )}

              {stage === 2 && (
                <div style={animationClasses.fadeIn}>
                  <h3 className="font-semibold mb-3 text-green-700 text-xl">Misturando sua composteira</h3>

                  <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl p-6 mb-6 relative overflow-hidden shadow-inner">
                    <div className="flex flex-wrap gap-3 mb-4">
                      {selectedItems.map((id) => {
                        const item = compostItems.find((item) => item.id === id)
                        return (
                          <div
                            key={id}
                            className={`p-3 rounded-lg ${
                              item?.type === "compostable"
                                ? "bg-gradient-to-r from-green-100 to-green-200 border border-green-300"
                                : "bg-gradient-to-r from-red-100 to-red-200 border border-red-300"
                            } shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 transform`}
                          >
                            <span
                              className="text-2xl mr-2 inline-block"
                              role="img"
                              aria-hidden="true"
                              style={animationClasses.bounceSubtle}
                            >
                              {item?.icon}
                            </span>
                            <span className="text-sm font-medium">{item?.name}</span>
                            {item?.type === "compostable" ? (
                              <Check className="inline h-4 w-4 text-green-500 ml-2" />
                            ) : (
                              <X className="inline h-4 w-4 text-red-500 ml-2" />
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="h-60 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 rounded-xl flex items-center justify-center relative shadow-inner overflow-hidden">
                     
                      {selectedItems.filter((id) => {
                        const item = compostItems.find((item) => item.id === id)
                        return item?.type === "compostable"
                      }).length >= 4 ? (
                        <div className="text-center relative z-10">
                          <span
                            className="text-5xl inline-block"
                            role="img"
                            aria-label="Compostagem saudável"
                            style={animationClasses.bounceSubtle}
                          >
                            🌱
                          </span>
                          <p className="font-medium text-amber-800 mt-2" style={animationClasses.textShadow}>
                            Sua compostagem está progredindo bem!
                          </p>
                        </div>
                      ) : (
                        <div className="text-center relative z-10">
                          <span
                            className="text-5xl inline-block"
                            role="img"
                            aria-label="Compostagem com problemas"
                            style={animationClasses.pulseSlow}
                          >
                            ⚠️
                          </span>
                          <p className="font-medium text-amber-800 mt-2" style={animationClasses.textShadow}>
                            Sua compostagem precisa de mais materiais adequados.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextStage}
                      disabled={isTransitioning}
                      className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Ver Resultado
                    </button>
                  </div>
                </div>
              )}

              {stage === 3 && (
                <div style={animationClasses.fadeIn}>
                  <h3 className="font-semibold mb-3 text-green-700 text-xl">Resultado da sua Compostagem</h3>

                  <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-xl p-8 mb-6 text-center shadow-inner">
                    {compostHealth >= 70 ? (
                      <div style={animationClasses.fadeIn}>
                        <div
                          className="w-40 h-40 mx-auto bg-gradient-to-b from-amber-600 to-amber-800 rounded-full flex items-center justify-center mb-6 shadow-lg overflow-hidden"
                          style={animationClasses.pulseSlow}
                        >
                          <div className="absolute inset-0" style={animationClasses.gradientRadial}></div>
                          <span
                            className="text-7xl relative z-10"
                            role="img"
                            aria-label="Composto saudável"
                            style={animationClasses.bounceSubtle}
                          >
                            🌱
                          </span>
                        </div>
                        <h4 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-600 mb-3">
                          Parabéns!
                        </h4>
                        <p className="text-green-600 mb-4 leading-relaxed">
                          Você criou um composto saudável que pode ser usado para nutrir plantas e jardins.
                        </p>
                      </div>
                    ) : compostHealth >= 40 ? (
                      <div style={animationClasses.fadeIn}>
                        <div
                          className="w-40 h-40 mx-auto bg-gradient-to-b from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-lg overflow-hidden"
                          style={animationClasses.pulseSlow}
                        >
                          <div className="absolute inset-0" style={animationClasses.gradientRadial}></div>
                          <span
                            className="text-7xl relative z-10"
                            role="img"
                            aria-label="Composto médio"
                            style={animationClasses.bounceSubtle}
                          >
                            🌿
                          </span>
                        </div>
                        <h4 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-700 to-amber-600 mb-3">
                          Quase lá!
                        </h4>
                        <p className="text-yellow-600 mb-4 leading-relaxed">
                          Seu composto está razoável, mas poderia ser melhor com uma seleção mais cuidadosa de
                          materiais.
                        </p>
                      </div>
                    ) : (
                      <div style={animationClasses.fadeIn}>
                        <div
                          className="w-40 h-40 mx-auto bg-gradient-to-b from-amber-300 to-amber-500 rounded-full flex items-center justify-center mb-6 shadow-lg overflow-hidden"
                          style={animationClasses.pulseSlow}
                        >
                          <div className="absolute inset-0" style={animationClasses.gradientRadial}></div>
                          <span
                            className="text-7xl relative z-10"
                            role="img"
                            aria-label="Composto ruim"
                            style={animationClasses.bounceSubtle}
                          >
                            ⚠️
                          </span>
                        </div>
                        <h4 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-rose-600 mb-3">
                          Precisa melhorar
                        </h4>
                        <p className="text-red-600 mb-4 leading-relaxed">
                          Sua compostagem não foi bem-sucedida. Você incluiu muitos materiais inadequados.
                        </p>
                      </div>
                    )}

                    <div
                      className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-500 hover:shadow-lg"
                      style={animationClasses.scale102}
                    >
                      <h5 className="font-semibold mb-3 text-green-700">O que você aprendeu:</h5>
                      <ul className="text-left space-y-3">
                        <li className="flex items-start gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors">
                          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 leading-relaxed">
                            Materiais orgânicos como restos de frutas, vegetais e cascas de ovos são ideais para
                            compostagem.
                          </span>
                        </li>
                        <li className="flex items-start gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors">
                          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 leading-relaxed">
                            Evite adicionar carnes, laticínios, óleos e materiais não biodegradáveis.
                          </span>
                        </li>
                        <li className="flex items-start gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors">
                          <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 leading-relaxed">
                            Uma boa compostagem precisa de um equilíbrio entre materiais ricos em carbono e nitrogênio.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handleReset}
                      disabled={isTransitioning}
                      className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Tentar Novamente
                    </button>

                    {compostHealth >= 70 && (
                      <button
                        onClick={onBack}
                        className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                      >
                        Voltar ao Menu
                      </button>
                    )}
                  </div>
                </div>
              )}

              {isCompleted && (
                <div
                  className="mt-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200 text-center transform transition-all duration-500 shadow-lg hover:shadow-xl"
                  style={animationClasses.fadeIn}
                >
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <Award
                      className="h-10 w-10 text-yellow-500 filter drop-shadow-md"
                      style={animationClasses.pulseSlow}
                    />
                  </div>
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-600 mb-3">
                    🎉 Parabéns! Você completou a Lição 3
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Você aprendeu os princípios básicos da compostagem e como transformar resíduos orgânicos em adubo
                    natural.
                  </p>
                  <button
                    onClick={onBack}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    style={animationClasses.pulseSlow}
                  >
                    Voltar para o Menu Principal
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl border border-green-100">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-teal-600 mb-4">
                Dicas de Acessibilidade
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors">
                  <Check className="h-5 w-5 text-green-500 mt-1" />
                  <span className="text-gray-700 leading-relaxed">
                    Use Tab para navegar entre os elementos e Enter para selecioná-los.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors">
                  <Check className="h-5 w-5 text-green-500 mt-1" />
                  <span className="text-gray-700 leading-relaxed">
                    Cada item tem uma descrição detalhada acessível por leitores de tela.
                  </span>
                </li>
                <li className="flex items-start gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors">
                  <Check className="h-5 w-5 text-green-500 mt-1" />
                  <span className="text-gray-700 leading-relaxed">
                    O botão "i" ao lado de cada item fornece informações adicionais.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
