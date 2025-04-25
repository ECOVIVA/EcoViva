"use client"

import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  Info,
  Check,
  Award,
  AlertTriangle,
  Droplets,
  BarChart3,
  Timer,
  Zap,
  TrendingUp,
  Sparkles,
  Flame,
  Star,
  Gift,
  Trophy,
} from "lucide-react"

// Enhanced puzzle pieces with additional properties
const puzzlePieces = [
  {
    id: 1,
    text: "Fechar a torneira enquanto escova os dentes",
    saving: 12,
    icon: "💧",
    unit: "litros/dia",
    difficulty: "fácil",
    impact: "médio",
    timeToImplement: "imediato",
    initialInvestment: 0,
    monthlyReturn: 5,
    category: "hábitos",
    xp: 10,
  },
  {
    id: 2,
    text: "Reduzir o tempo do banho em 5 minutos",
    saving: 90,
    icon: "🚿",
    unit: "litros/dia",
    difficulty: "médio",
    impact: "alto",
    timeToImplement: "imediato",
    initialInvestment: 0,
    monthlyReturn: 25,
    category: "hábitos",
    xp: 20,
  },
  {
    id: 3,
    text: "Usar a máquina de lavar roupa apenas com carga completa",
    saving: 100,
    icon: "👕",
    unit: "litros/lavagem",
    difficulty: "fácil",
    impact: "alto",
    timeToImplement: "imediato",
    initialInvestment: 0,
    monthlyReturn: 30,
    category: "hábitos",
    xp: 15,
  },
  {
    id: 4,
    text: "Consertar vazamentos de torneiras",
    saving: 40,
    icon: "🔧",
    unit: "litros/dia",
    difficulty: "médio",
    impact: "médio",
    timeToImplement: "1 dia",
    initialInvestment: 50,
    monthlyReturn: 15,
    category: "reparos",
    xp: 25,
  },
  {
    id: 5,
    text: "Reutilizar água da chuva para plantas",
    saving: 200,
    icon: "🌧️",
    unit: "litros/mês",
    difficulty: "difícil",
    impact: "alto",
    timeToImplement: "1 semana",
    initialInvestment: 200,
    monthlyReturn: 50,
    category: "infraestrutura",
    xp: 40,
  },
  {
    id: 6,
    text: "Usar regador em vez de mangueira no jardim",
    saving: 50,
    icon: "🌱",
    unit: "litros/dia",
    difficulty: "fácil",
    impact: "médio",
    timeToImplement: "imediato",
    initialInvestment: 30,
    monthlyReturn: 20,
    category: "hábitos",
    xp: 15,
  },
  {
    id: 7,
    text: "Instalar aeradores nas torneiras",
    saving: 30,
    icon: "🚰",
    unit: "litros/dia",
    difficulty: "médio",
    impact: "médio",
    timeToImplement: "1 dia",
    initialInvestment: 40,
    monthlyReturn: 12,
    category: "infraestrutura",
    xp: 20,
  },
  {
    id: 8,
    text: "Usar descarga com duplo acionamento",
    saving: 70,
    icon: "🚽",
    unit: "litros/dia",
    difficulty: "difícil",
    impact: "alto",
    timeToImplement: "1 dia",
    initialInvestment: 150,
    monthlyReturn: 35,
    category: "infraestrutura",
    xp: 35,
  },
  {
    id: 9,
    text: "Instalar sistema de reuso de água cinza",
    saving: 150,
    icon: "♻️",
    unit: "litros/dia",
    difficulty: "difícil",
    impact: "alto",
    timeToImplement: "1 semana",
    initialInvestment: 300,
    monthlyReturn: 60,
    category: "infraestrutura",
    xp: 50,
  },
  {
    id: 10,
    text: "Usar balde em vez de mangueira para lavar o carro",
    saving: 80,
    icon: "🚗",
    unit: "litros/lavagem",
    difficulty: "fácil",
    impact: "médio",
    timeToImplement: "imediato",
    initialInvestment: 20,
    monthlyReturn: 15,
    category: "hábitos",
    xp: 15,
  },
  {
    id: 11,
    text: "Instalar válvula redutora de pressão",
    saving: 25,
    icon: "🔄",
    unit: "litros/dia",
    difficulty: "médio",
    impact: "médio",
    timeToImplement: "1 dia",
    initialInvestment: 80,
    monthlyReturn: 10,
    category: "infraestrutura",
    xp: 25,
  },
  {
    id: 12,
    text: "Verificar e consertar vazamentos ocultos",
    saving: 60,
    icon: "🔍",
    unit: "litros/dia",
    difficulty: "difícil",
    impact: "alto",
    timeToImplement: "2 dias",
    initialInvestment: 120,
    monthlyReturn: 30,
    category: "reparos",
    xp: 30,
  },
]

// Game challenges for bonus points
const challenges = [
  {
    id: 1,
    title: "Economista Iniciante",
    description: "Economize 100 litros de água",
    reward: 50,
    xp: 20,
    icon: <Droplets className="h-5 w-5" />,
    condition: (state: any) => state.waterSaved >= 100,
    completed: false,
  },
  {
    id: 2,
    title: "Mestre do Orçamento",
    description: "Mantenha pelo menos 300 reais no orçamento",
    reward: 75,
    xp: 30,
    icon: <TrendingUp className="h-5 w-5" />,
    condition: (state: any) => state.budget >= 300,
    completed: false,
  },
  {
    id: 3,
    title: "Combo Perfeito",
    description: "Selecione 3 ações da mesma categoria",
    reward: 100,
    xp: 40,
    icon: <Zap className="h-5 w-5" />,
    condition: (state: any) => {
      const categories = state.selectedPieces.map((id: number) => puzzlePieces.find((p) => p.id === id)?.category)
      const categoryCounts = categories.reduce((acc: any, cat: string) => {
        acc[cat] = (acc[cat] || 0) + 1
        return acc
      }, {})
      return Object.values(categoryCounts).some((count: any) => count >= 3)
    },
    completed: false,
  },
  {
    id: 4,
    title: "Velocista",
    description: "Complete a meta em menos de 2 minutos",
    reward: 150,
    xp: 50,
    icon: <Timer className="h-5 w-5" />,
    condition: (state: any) => state.waterSaved >= state.targetSaving && state.timeLeft >= 180,
    completed: false,
  },
]

// Levels and experience system
const levels = [
  { level: 1, xpRequired: 0, title: "Iniciante" },
  { level: 2, xpRequired: 100, title: "Aprendiz" },
  { level: 3, xpRequired: 250, title: "Praticante" },
  { level: 4, xpRequired: 500, title: "Especialista" },
  { level: 5, xpRequired: 1000, title: "Mestre" },
]

// Power-ups for game mechanics
const powerUps = [
  {
    id: 1,
    name: "Tempo Extra",
    description: "Adiciona 30 segundos ao cronômetro",
    cost: 100,
    icon: <Timer className="h-5 w-5" />,
    effect: (_: any, setState: any) => {
      setState((prev: any) => ({ ...prev, timeLeft: prev.timeLeft + 30 }))
    },
  },
  {
    id: 2,
    name: "Multiplicador de Economia",
    description: "Dobra a economia da próxima ação selecionada",
    cost: 150,
    icon: <Zap className="h-5 w-5" />,
    effect: (_: any, setState: any) => {
      setState((prev: any) => ({ ...prev, multiplier: 2, multiplierActive: true }))
    },
  },
  {
    id: 3,
    name: "Bônus de Orçamento",
    description: "Adiciona 100 reais ao seu orçamento",
    cost: 200,
    icon: <TrendingUp className="h-5 w-5" />,
    effect: (_: any, setState: any) => {
      setState((prev: any) => ({ ...prev, budget: prev.budget + 100 }))
    },
  },
]

interface Props {
  onBack: () => void
}

export default function Lesson4({ onBack }: Props) {
  const [waterSaved, setWaterSaved] = useState(0)
  const [selectedPieces, setSelectedPieces] = useState<number[]>([])
  const [puzzleComplete, setPuzzleComplete] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [dailyUsage, setDailyUsage] = useState(300)
  const [targetSaving, setTargetSaving] = useState(150)
  const [budget, setBudget] = useState(500)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [difficulty, setDifficulty] = useState<"fácil" | "médio" | "difícil">("fácil")
  const [showCelebration, setShowCelebration] = useState(false)
  const [achievements, setAchievements] = useState<string[]>([])
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(0)
  const [activeTab, setActiveTab] = useState<"ações" | "desafios" | "loja">("ações")
  const [gameMode, setGameMode] = useState<"casual" | "desafio" | "tempo">("casual")
  const [_, setActiveMultiplier] = useState(1)
  const [multiplierActive, setMultiplierActive] = useState(false)
  const [activeChallenges, setActiveChallenges] = useState(challenges)
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(1)
  const [showPowerUpEffect, setShowPowerUpEffect] = useState(false)
  const [powerUpMessage, setPowerUpMessage] = useState("")
  const [comboCount, setComboCount] = useState(0)
  const [showCombo, setShowCombo] = useState(false)
  const [filteredPieces, setFilteredPieces] = useState(puzzlePieces)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [waterAnimation, setWaterAnimation] = useState(false)

  const waterRef = useRef<HTMLDivElement>(null)
  const gameContainerRef = useRef<HTMLDivElement>(null)

  // Initialize game based on selected difficulty
  useEffect(() => {
    if (difficulty === "fácil") {
      setTargetSaving(150)
      setBudget(500)
      setTimeLeft(300)
    } else if (difficulty === "médio") {
      setTargetSaving(200)
      setBudget(400)
      setTimeLeft(240)
    } else {
      setTargetSaving(250)
      setBudget(300)
      setTimeLeft(180)
    }
  }, [difficulty])

  // Filter pieces based on selected filters
  useEffect(() => {
    let filtered = puzzlePieces

    if (categoryFilter) {
      filtered = filtered.filter((piece) => piece.category === categoryFilter)
    }

    if (difficultyFilter) {
      filtered = filtered.filter((piece) => piece.difficulty === difficultyFilter)
    }

    setFilteredPieces(filtered)
  }, [categoryFilter, difficultyFilter])

  // Check for game completion
  useEffect(() => {
    if (waterSaved >= targetSaving && !isCompleted) {
      const completionApi = async () => {
        try {
          // Simulating API call
          console.log("Lesson completed!")
          setIsCompleted(true)
          setPuzzleComplete(true)
        } catch (e) {
          console.error(e)
        }
      }

      completionApi()
      setScore((prev) => prev + calculateBonus())
      setShowCelebration(true)
      setShowConfetti(true)
      checkAchievements()
      showToast("Parabéns! 🎉", "Você atingiu a meta de economia de água!", true)

      // Trigger water animation
      setWaterAnimation(true)
      setTimeout(() => setWaterAnimation(false), 3000)
    }
  }, [waterSaved, targetSaving, isCompleted])

  // Game timer
  useEffect(() => {
    if (gameMode === "tempo" || gameMode === "desafio") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer)
            if (!puzzleComplete) {
              showToast("Tempo Esgotado! ⏰", "Tente novamente para melhorar seu score!", false)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [gameMode, puzzleComplete])

  // Check challenges completion
  useEffect(() => {
    const gameState = {
      waterSaved,
      selectedPieces,
      budget,
      streak,
      timeLeft,
      targetSaving,
    }

    const updatedChallenges = activeChallenges.map((challenge) => {
      if (!challenge.completed && challenge.condition(gameState)) {
        // Challenge just completed
        setScore((prev) => prev + challenge.reward)
        setXp((prev) => prev + challenge.xp)
        showToast("Desafio Concluído! 🏆", `${challenge.title}: +${challenge.reward} pontos, +${challenge.xp} XP`, true)
        return { ...challenge, completed: true }
      }
      return challenge
    })

    setActiveChallenges(updatedChallenges)
  }, [waterSaved, selectedPieces, budget, streak, timeLeft])

  // Level up system
  useEffect(() => {
    const currentLevel = levels.findIndex((l) => xp < l.xpRequired)
    const newLevel = currentLevel === -1 ? levels.length : currentLevel

    if (newLevel > level) {
      setLevel(newLevel)
      showToast("Nível Aumentado! 🌟", `Você alcançou o nível ${newLevel}: ${levels[newLevel - 1].title}`, true)

      // Add level up animation
      if (gameContainerRef.current) {
        gameContainerRef.current.classList.add("scale-105")
        setTimeout(() => {
          if (gameContainerRef.current) {
            gameContainerRef.current.classList.remove("scale-105")
          }
        }, 500)
      }
    }
  }, [xp, level])

  // Reset multiplier after use
  useEffect(() => {
    if (multiplierActive) {
      showToast("Multiplicador Ativo! ⚡", "A próxima ação terá economia dobrada!", true)
    }
  }, [multiplierActive])

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [showConfetti])

  // Calculate bonus points based on game performance
  const calculateBonus = () => {
    const timeBonus = Math.floor((timeLeft / 300) * 50) // Up to 50 points for speed
    const difficultyBonus = difficulty === "difícil" ? 30 : difficulty === "médio" ? 20 : 10
    const streakBonus = streak * 5 // 5 points per streak
    const levelBonus = level * 10 // 10 points per level
    return 50 + timeBonus + difficultyBonus + streakBonus + levelBonus
  }

  // Check for achievements
  const checkAchievements = () => {
    const newAchievements: string[] = []

    if (waterSaved >= targetSaving * 1.5) {
      newAchievements.push("Super Econômico 🌟")
    }
    if (timeLeft > 180) {
      newAchievements.push("Velocista da Água ⚡")
    }
    if (selectedPieces.length >= 6) {
      newAchievements.push("Mestre da Conservação 🎓")
    }
    if (streak >= 3) {
      newAchievements.push("Guardião da Água 🛡️")
    }
    if (budget > 400) {
      newAchievements.push("Investidor Inteligente 💰")
    }
    if (activeChallenges.filter((c) => c.completed).length >= 3) {
      newAchievements.push("Desafiador Supremo 🏆")
    }

    setAchievements((prev) => [...prev, ...newAchievements])
  }

  // Handle piece selection
  const handlePieceSelect = (id: number) => {
    const piece = puzzlePieces.find((piece) => piece.id === id)
    if (!piece) return

    const totalInvestment = selectedPieces.reduce((total, pieceId) => {
      const selectedPiece = puzzlePieces.find((p) => p.id === pieceId)
      return total + (selectedPiece?.initialInvestment || 0)
    }, piece.initialInvestment)

    if (totalInvestment > budget && !selectedPieces.includes(id)) {
      showToast("Atenção! 💰", "Orçamento insuficiente para esta ação!", false)
      return
    }

    if (selectedPieces.includes(id)) {
      setSelectedPieces(selectedPieces.filter((pieceId) => pieceId !== id))
      setWaterSaved((prev) => prev - piece.saving)
      setScore((prev) => Math.max(0, prev - 5))
      setBudget((prev) => prev + piece.initialInvestment)
      setStreak(0)
      setComboCount(0)
    } else {
      const newSelectedPieces = [...selectedPieces, id]
      setSelectedPieces(newSelectedPieces)

      // Apply multiplier if active
      const savingAmount = multiplierActive ? piece.saving * 2 : piece.saving
      setWaterSaved((prev) => prev + savingAmount)

      // Reset multiplier after use
      if (multiplierActive) {
        setMultiplierActive(false)
        setPowerUpMessage(`Multiplicador aplicado! +${savingAmount} litros`)
        setShowPowerUpEffect(true)
        setTimeout(() => setShowPowerUpEffect(false), 2000)
      }

      // Increase combo count for consecutive selections
      const newComboCount = comboCount + 1
      setComboCount(newComboCount)

      // Apply combo bonus
      if (newComboCount >= 3) {
        const comboBonus = Math.min(newComboCount * 5, 30) // Cap at 30 points
        setScore((prev) => prev + 10 + comboBonus)
        setShowCombo(true)
        setTimeout(() => setShowCombo(false), 2000)
        showToast(`Combo x${newComboCount}! 🔥`, `+${comboBonus} pontos de bônus!`, true)
      } else {
        setScore((prev) => prev + 10)
      }

      // Add XP based on piece difficulty
      setXp((prev) => prev + piece.xp)

      setBudget((prev) => prev - piece.initialInvestment)
      setStreak((prev) => prev + 1)

      // Monthly return with delay
      const monthlyReturn = piece.monthlyReturn
      setTimeout(() => {
        setBudget((prev) => prev + monthlyReturn)
        showToast("Retorno Mensal! 💰", `+${monthlyReturn} reais de economia!`, true)
      }, 5000)

      showToast("Boa escolha! 🎯", `Esta ação economiza ${savingAmount} ${piece.unit}`, true)
    }

    // Add visual feedback animation
    const element = document.getElementById(`piece-${id}`)
    if (element) {
      element.classList.add("scale-105", "shadow-lg")
      setTimeout(() => {
        element.classList.remove("scale-105", "shadow-lg")
      }, 200)
    }
  }

  // Handle power-up purchase
  const handlePowerUpPurchase = (powerUp: any) => {
    if (score < powerUp.cost) {
      showToast("Pontos Insuficientes! ⚠️", "Você não tem pontos suficientes para esta compra.", false)
      return
    }

    setScore((prev) => prev - powerUp.cost)
    powerUp.effect({ waterSaved, selectedPieces, budget, streak, timeLeft }, (newState: any) => {
      if (newState.timeLeft !== undefined) setTimeLeft(newState.timeLeft)
      if (newState.budget !== undefined) setBudget(newState.budget)
      if (newState.multiplier !== undefined) setActiveMultiplier(newState.multiplier)
      if (newState.multiplierActive !== undefined) setMultiplierActive(newState.multiplierActive)
    })

    showToast("Power-Up Ativado! ⚡", powerUp.description, true)
  }

  // Reset game
  const handleReset = () => {
    setSelectedPieces([])
    setWaterSaved(0)
    setPuzzleComplete(false)
    setScore(0)
    setTimeLeft(difficulty === "fácil" ? 300 : difficulty === "médio" ? 240 : 180)
    setBudget(difficulty === "fácil" ? 500 : difficulty === "médio" ? 400 : 300)
    setStreak(0)
    setShowCelebration(false)
    setAchievements([])
    setComboCount(0)
    setActiveChallenges(challenges.map((c) => ({ ...c, completed: false })))
    setMultiplierActive(false)
    setActiveMultiplier(1)
  }

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Get color based on difficulty
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "fácil":
        return "text-green-500"
      case "médio":
        return "text-yellow-500"
      case "difícil":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  // Get color based on impact
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "alto":
        return "text-blue-600"
      case "médio":
        return "text-blue-400"
      case "baixo":
        return "text-blue-300"
      default:
        return "text-gray-500"
    }
  }

  // Display toast notification
  const showToast = (title: string, message: string, success: boolean) => {
    const toast = document.createElement("div")
    toast.className = `fixed top-4 right-4 p-4 rounded-2xl shadow-lg transform transition-all duration-500 ${
      success ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-rose-600"
    } text-white z-50 backdrop-blur-sm`
    toast.innerHTML = `
      <h4 class="font-bold">${title}</h4>
      <p>${message}</p>
    `

    // Add entrance animation
    toast.style.transform = "translateX(100%)"
    document.body.appendChild(toast)
    requestAnimationFrame(() => {
      toast.style.transform = "translateX(0)"
    })

    setTimeout(() => {
      toast.style.transform = "translateX(150%)"
      setTimeout(() => document.body.removeChild(toast), 500)
    }, 3000)
  }

  // Get progress to next level
  const getProgressToNextLevel = () => {
    const currentLevelData = levels[level - 1]
    const nextLevelData = levels[level] || { xpRequired: currentLevelData.xpRequired * 2 }
    const xpForCurrentLevel = currentLevelData.xpRequired
    const xpForNextLevel = nextLevelData.xpRequired
    const xpProgress = xp - xpForCurrentLevel
    const xpNeeded = xpForNextLevel - xpForCurrentLevel
    return Math.min(100, Math.round((xpProgress / xpNeeded) * 100))
  }

  // Render confetti effect
  const renderConfetti = () => {
    if (!showConfetti) return null

    const confettiPieces = []
    const colors = ["#FFC700", "#FF0000", "#2E3191", "#41D3BD", "#0096FF"]

    for (let i = 0; i < 100; i++) {
      const left = Math.random() * 100
      const animationDuration = 3 + Math.random() * 2
      const delay = Math.random()
      const size = 5 + Math.random() * 10
      const color = colors[Math.floor(Math.random() * colors.length)]

      confettiPieces.push(
        <div
          key={i}
          className="absolute top-0 rounded-full animate-fall"
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            animationDuration: `${animationDuration}s`,
            animationDelay: `${delay}s`,
          }}
        />,
      )
    }

    return <div className="fixed inset-0 pointer-events-none z-50">{confettiPieces}</div>
  }

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-green-50 overflow-hidden">
        {/* Confetti Effect */}
        {renderConfetti()}

        {/* Water Animation */}
        {waterAnimation && (
          <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 bg-blue-500 animate-rise h-full opacity-20" />
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
              <div className="text-6xl animate-bounce">💧</div>
            </div>
          </div>
        )}

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 transform animate-[scale-in_0.5s_ease-out] text-center max-w-md shadow-2xl border-4 border-blue-200">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold text-blue-700 mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Incrível!
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Você economizou <span className="font-bold text-blue-600">{waterSaved} litros</span> de água e ganhou{" "}
                <span className="font-bold text-green-600">{calculateBonus()} pontos</span>!
              </p>
              {achievements.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-blue-600 mb-3">Conquistas Desbloqueadas:</h3>
                  <div className="space-y-2">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl text-blue-700 animate-[fade-in_0.3s_ease-out] border border-blue-200 shadow-sm"
                      >
                        {achievement}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowCelebration(false)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md"
                >
                  Continuar
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-white text-blue-600 rounded-xl border border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  Jogar Novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md shadow-2xl border-4 border-blue-200">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">Como Jogar</h2>

              {tutorialStep === 1 && (
                <div className="animate-[fade-in_0.3s_ease-out]">
                  <p className="mb-4">
                    Bem-vindo ao Jogo de Economia de Água! Seu objetivo é economizar água selecionando ações
                    sustentáveis.
                  </p>
                  <p className="mb-4">Cada ação tem um custo inicial e uma economia de água associada.</p>
                </div>
              )}

              {tutorialStep === 2 && (
                <div className="animate-[fade-in_0.3s_ease-out]">
                  <p className="mb-4">Você tem um orçamento limitado para investir em ações de economia.</p>
                  <p className="mb-4">Algumas ações têm retorno mensal, aumentando seu orçamento com o tempo!</p>
                </div>
              )}

              {tutorialStep === 3 && (
                <div className="animate-[fade-in_0.3s_ease-out]">
                  <p className="mb-4">Complete desafios para ganhar pontos e XP extras.</p>
                  <p className="mb-4">
                    Use seus pontos para comprar power-ups na loja que podem ajudar você a atingir sua meta!
                  </p>
                </div>
              )}

              <div className="flex justify-between mt-6">
                {tutorialStep > 1 && (
                  <button
                    onClick={() => setTutorialStep((prev) => prev - 1)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Anterior
                  </button>
                )}

                {tutorialStep < 3 ? (
                  <button
                    onClick={() => setTutorialStep((prev) => prev + 1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors ml-auto"
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors ml-auto"
                  >
                    Começar!
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Power-up Effect */}
        {showPowerUpEffect && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-40">
            <div className="text-3xl font-bold text-blue-600 animate-[scale-in-out_2s_ease-in-out] bg-white/80 px-6 py-3 rounded-full shadow-lg">
              {powerUpMessage}
            </div>
          </div>
        )}

        {/* Combo Effect */}
        {showCombo && comboCount >= 3 && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-40">
            <div className="text-4xl font-bold text-orange-600 animate-[pulse_0.5s_ease-in-out_infinite] bg-white/80 px-6 py-3 rounded-full shadow-lg">
              COMBO x{comboCount}! 🔥
            </div>
          </div>
        )}

        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white p-4 shadow-xl rounded-b-3xl">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <button
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-blue-700/50 px-4 py-2 rounded-xl transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </button>

            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4">
              <div className="flex items-center gap-2 bg-blue-800/30 px-3 py-1.5 rounded-xl">
                <Timer className="h-5 w-5" />
                <span className={`font-mono ${timeLeft < 60 ? "text-red-300 animate-pulse" : ""}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-blue-800/30 px-3 py-1.5 rounded-xl">
                <Award className="h-5 w-5" />
                <span>{score} pts</span>
              </div>

              <div className="flex items-center gap-2 bg-blue-800/30 px-3 py-1.5 rounded-xl">
                <Flame className="h-5 w-5" />
                <span>{streak}x</span>
              </div>

              <div className="flex items-center gap-2 bg-blue-800/30 px-3 py-1.5 rounded-xl">
                <Droplets className="h-5 w-5" />
                <span>{budget} R$</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <div className="max-w-6xl mx-auto" ref={gameContainerRef}>
            {/* Game Container */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 backdrop-blur-sm bg-opacity-90 border border-blue-100 transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Droplets className="h-7 w-7 text-blue-600" />
                  Lição 4: Economia de Água
                </h2>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors text-blue-700"
                  >
                    <Info className="h-5 w-5" />
                    <span>Info</span>
                  </button>

                  <button
                    onClick={() => setShowTutorial(true)}
                    className="flex items-center gap-2 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-xl transition-colors text-green-700"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Tutorial</span>
                  </button>
                </div>
              </div>

              {/* Level and XP Bar */}
              <div className="mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">
                      Nível {level}: {levels[level - 1].title}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {xp} XP / {levels[level] ? levels[level].xpRequired : "MAX"} XP
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500 ease-out"
                    style={{ width: `${getProgressToNextLevel()}%` }}
                  />
                </div>
              </div>

              {/* Info Panel */}
              {showInfo && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-2xl mb-6 text-blue-800 border border-blue-200 shadow-inner">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Sobre Economia de Água
                  </h3>
                  <p className="mb-3">
                    A água é um recurso essencial e limitado. Adotar práticas de economia não só beneficia o meio
                    ambiente, mas também reduz seus gastos!
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Pequenas mudanças geram grandes impactos.</li>
                    <li>Economizar água é um ato de responsabilidade.</li>
                    <li>Cada gota conta para um futuro sustentável.</li>
                    <li>Uma torneira gotejando pode desperdiçar até 40 litros por dia.</li>
                    <li>Um banho de 15 minutos consome cerca de 135 litros de água.</li>
                  </ul>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progresso para meta de economia</span>
                  <span className="text-sm font-medium text-blue-600">
                    {waterSaved} de {targetSaving} litros (
                    {Math.min(100, Math.round((waterSaved / targetSaving) * 100))}
                    %)
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 transition-all duration-500 ease-out relative"
                    style={{ width: `${Math.min(100, (waterSaved / targetSaving) * 100)}%` }}
                  >
                    {waterSaved > 0 && (
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 opacity-30 animate-wave" ref={waterRef}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("ações")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm rounded-t-lg transition-colors ${
                    activeTab === "ações"
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-blue-600 hover:bg-blue-50/50"
                  }`}
                >
                  Ações de Economia
                </button>
                <button
                  onClick={() => setActiveTab("desafios")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm rounded-t-lg transition-colors ${
                    activeTab === "desafios"
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-blue-600 hover:bg-blue-50/50"
                  }`}
                >
                  Desafios
                </button>
                <button
                  onClick={() => setActiveTab("loja")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm rounded-t-lg transition-colors ${
                    activeTab === "loja"
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-blue-600 hover:bg-blue-50/50"
                  }`}
                >
                  Loja de Power-Ups
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
                {/* Left Column */}
                <div>
                  {activeTab === "ações" && (
                    <>
                      <h3 className="font-semibold mb-4 text-blue-700 flex items-center gap-2">
                        <span className="text-2xl">💧</span>
                        Escolha ações para economizar água
                      </h3>

                      {/* Filters */}
                      <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
                        <button
                          onClick={() => {
                            setCategoryFilter(null)
                            setDifficultyFilter(null)
                          }}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            !categoryFilter && !difficultyFilter
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Todos
                        </button>

                        <button
                          onClick={() => setCategoryFilter("hábitos")}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            categoryFilter === "hábitos"
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Hábitos
                        </button>

                        <button
                          onClick={() => setCategoryFilter("infraestrutura")}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            categoryFilter === "infraestrutura"
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Infraestrutura
                        </button>

                        <button
                          onClick={() => setCategoryFilter("reparos")}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            categoryFilter === "reparos"
                              ? "bg-orange-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Reparos
                        </button>

                        <button
                          onClick={() => setDifficultyFilter("fácil")}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            difficultyFilter === "fácil"
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Fácil
                        </button>

                        <button
                          onClick={() => setDifficultyFilter("médio")}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            difficultyFilter === "médio"
                              ? "bg-yellow-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Médio
                        </button>

                        <button
                          onClick={() => setDifficultyFilter("difícil")}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            difficultyFilter === "difícil"
                              ? "bg-red-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Difícil
                        </button>
                      </div>

                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredPieces.map((piece) => (
                          <button
                            key={piece.id}
                            id={`piece-${piece.id}`}
                            onClick={() => handlePieceSelect(piece.id)}
                            disabled={timeLeft === 0}
                            className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 transition-all transform hover:scale-102 hover:shadow-md ${
                              selectedPieces.includes(piece.id)
                                ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 shadow-inner"
                                : "bg-white border-gray-200 hover:border-blue-300"
                            } ${timeLeft === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <div className="text-2xl transform transition-transform duration-300 hover:scale-110">
                              {piece.icon}
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-medium">{piece.text}</div>
                              <div className="text-sm text-blue-600 font-semibold">
                                Economia: {piece.saving} {piece.unit}
                              </div>
                              <div className="flex gap-2 mt-1 text-xs">
                                <span
                                  className={`${getDifficultyColor(piece.difficulty)} px-2 py-0.5 rounded-full bg-gray-100`}
                                >
                                  {piece.difficulty}
                                </span>
                                <span
                                  className={`${getImpactColor(piece.impact)} px-2 py-0.5 rounded-full bg-gray-100`}
                                >
                                  Impacto: {piece.impact}
                                </span>
                                <span className="text-gray-500 px-2 py-0.5 rounded-full bg-gray-100">
                                  R${piece.initialInvestment}
                                </span>
                                <span className="text-green-600 px-2 py-0.5 rounded-full bg-gray-100">
                                  +{piece.xp} XP
                                </span>
                              </div>
                            </div>
                            {selectedPieces.includes(piece.id) && (
                              <Check className="h-5 w-5 text-blue-500 ml-auto animate-[scale-in_0.2s_ease-out]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {activeTab === "desafios" && (
                    <>
                      <h3 className="font-semibold mb-4 text-blue-700 flex items-center gap-2">
                        <Trophy className="h-6 w-6" />
                        Desafios Disponíveis
                      </h3>

                      <div className="space-y-4">
                        {activeChallenges.map((challenge) => (
                          <div
                            key={challenge.id}
                            className={`p-4 rounded-2xl border-2 ${
                              challenge.completed
                                ? "bg-gradient-to-r from-green-50 to-green-100 border-green-300"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-full ${
                                  challenge.completed ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                {challenge.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{challenge.title}</h4>
                                <p className="text-sm text-gray-600">{challenge.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-blue-600">+{challenge.reward} pts</div>
                                <div className="text-xs text-green-600">+{challenge.xp} XP</div>
                              </div>
                              {challenge.completed && <Check className="h-6 w-6 text-green-500" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeTab === "loja" && (
                    <>
                      <h3 className="font-semibold mb-4 text-blue-700 flex items-center gap-2">
                        <Gift className="h-6 w-6" />
                        Loja de Power-Ups
                      </h3>

                      <div className="space-y-4">
                        {powerUps.map((powerUp) => (
                          <div
                            key={powerUp.id}
                            className="p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-3 rounded-full bg-blue-100 text-blue-600">{powerUp.icon}</div>
                              <div className="flex-1">
                                <h4 className="font-medium">{powerUp.name}</h4>
                                <p className="text-sm text-gray-600">{powerUp.description}</p>
                              </div>
                              <button
                                onClick={() => handlePowerUpPurchase(powerUp)}
                                disabled={score < powerUp.cost}
                                className={`px-4 py-2 rounded-xl text-white ${
                                  score >= powerUp.cost
                                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                    : "bg-gray-400 cursor-not-allowed"
                                }`}
                              >
                                {powerUp.cost} pts
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Right Column */}
                <div>
                  <h3 className="font-semibold mb-4 text-blue-700 flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Seu impacto
                  </h3>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 mb-6 border border-blue-200 shadow-inner">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Consumo médio diário</h4>
                        <p className="text-gray-600 text-sm">Sem economia</p>
                      </div>
                      <div className="text-xl font-bold text-blue-700">{dailyUsage} L</div>
                    </div>

                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h4 className="font-medium">Novo consumo diário</h4>
                        <p className="text-gray-600 text-sm">Com suas economias</p>
                      </div>
                      <div className="text-xl font-bold text-green-600">{dailyUsage - waterSaved} L</div>
                    </div>

                    <div className="h-48 bg-gradient-to-b from-blue-100 to-blue-300 rounded-2xl flex items-end justify-center p-4 relative overflow-hidden shadow-inner">
                      <div
                        className="w-28 bg-gradient-to-b from-blue-400 to-blue-600 rounded-t-xl relative transition-all duration-1000 z-10 shadow-lg"
                        style={{
                          height: `${Math.min(100, ((dailyUsage - waterSaved) / dailyUsage) * 100)}%`,
                          maxHeight: "90%",
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-700 font-bold bg-white/80 px-2 py-1 rounded-lg">
                          {Math.round((waterSaved / dailyUsage) * 100)}% menos
                        </div>
                        <div className="absolute inset-0 overflow-hidden opacity-30">
                          <div className="absolute inset-0 animate-wave"></div>
                        </div>
                      </div>

                      <div
                        className="w-28 bg-gradient-to-b from-blue-500 to-blue-700 rounded-t-xl relative mx-6 z-10 shadow-lg"
                        style={{ height: "90%" }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-700 font-bold bg-white/80 px-2 py-1 rounded-lg">
                          Antes
                        </div>
                        <div className="absolute inset-0 overflow-hidden opacity-30">
                          <div className="absolute inset-0 animate-wave"></div>
                        </div>
                      </div>

                      <div className="absolute bottom-2 left-0 right-0 text-center text-blue-800 text-sm font-medium z-10">
                        Comparação de consumo diário
                      </div>

                      <div className="absolute inset-0 bg-blue-50 opacity-20 animate-[pulse_2s_ease-in-out_infinite]"></div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200 shadow-inner">
                    <h4 className="font-medium mb-3 text-green-700 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Impacto anual
                    </h4>
                    <p className="mb-4 text-gray-600">Com essas mudanças, você economizaria aproximadamente:</p>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.round(waterSaved * 365).toLocaleString()} L
                        </div>
                        <div className="text-sm text-gray-600">por ano</div>
                      </div>

                      <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round((waterSaved * 365) / 1000).toLocaleString()} m³
                        </div>
                        <div className="text-sm text-gray-600">metros cúbicos</div>
                      </div>
                    </div>

                    <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-green-100">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">Economia financeira estimada:</div>
                        <div className="text-xl font-bold text-green-600">
                          R$ {Math.round(waterSaved * 365 * 0.01).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Completion Message */}
              {puzzleComplete && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border border-blue-200 text-center transform transition-all duration-500 hover:shadow-lg">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-blue-700 mb-2">Parabéns! Você completou a Lição 4</h3>
                  <p className="mb-4 text-gray-600">Suas escolhas economizarão {waterSaved} litros de água por dia!</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={handleReset}
                      className="px-6 py-2 bg-white text-blue-600 rounded-xl border border-blue-300 hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      Tentar Novamente
                    </button>
                    <button
                      onClick={onBack}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors shadow-md"
                    >
                      Voltar ao Menu
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Custom CSS */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #94a3b8;
            border-radius: 10px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
          
          @keyframes wave {
            0% {
              background-position: 0% 0%;
            }
            100% {
              background-position: 100% 0%;
            }
          }
          
          .animate-wave {
            background: repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.5),
              rgba(255, 255, 255, 0.5) 10px,
              transparent 10px,
              transparent 20px
            );
            background-size: 200% 100%;
            animation: wave 10s linear infinite;
          }
          
          @keyframes scale-in {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes scale-in-out {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
            100% {
              transform: scale(0.8);
              opacity: 0;
            }
          }
          
          @keyframes fade-in {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          
          @keyframes rise {
            0% {
              transform: translateY(100%);
            }
            100% {
              transform: translateY(-100%);
            }
          }
          
          .animate-rise {
            animation: rise 3s ease-in-out;
          }
          
          @keyframes fall {
            0% {
              transform: translateY(-100vh);
            }
            100% {
              transform: translateY(100vh);
            }
          }
          
          .animate-fall {
            animation: fall linear forwards;
          }
        `}</style>
      </div>
    </>
  )
}
