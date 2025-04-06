"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Leaf, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Imagens para o jogo de memória
const memoryItems = [
  { id: 1, type: "plastic", emoji: "🥤", name: "Garrafa Plástica" },
  { id: 2, type: "plastic", emoji: "🥤", name: "Garrafa Plástica" },
  { id: 3, type: "paper", emoji: "📰", name: "Jornal" },
  { id: 4, type: "paper", emoji: "📰", name: "Jornal" },
  { id: 5, type: "glass", emoji: "🫙", name: "Pote de Vidro" },
  { id: 6, type: "glass", emoji: "🫙", name: "Pote de Vidro" },
  { id: 7, type: "metal", emoji: "🥫", name: "Lata" },
  { id: 8, type: "metal", emoji: "🥫", name: "Lata" },
  { id: 9, type: "organic", emoji: "🍌", name: "Casca de Banana" },
  { id: 10, type: "organic", emoji: "🍌", name: "Casca de Banana" },
  { id: 11, type: "hazardous", emoji: "🔋", name: "Pilha" },
  { id: 12, type: "hazardous", emoji: "🔋", name: "Pilha" },
]

export default function Lesson2() {
  const [cards, setCards] = useState<Array<(typeof memoryItems)[0] & { flipped: boolean; matched: boolean }>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  // Inicializar o jogo
  useEffect(() => {
    initGame()
  }, [])

  // Verificar se o jogo foi completado
  useEffect(() => {
    const totalPairs = memoryItems.length / 2

    if (matchedPairs === totalPairs && !isCompleted) {
      setIsCompleted(true)
      localStorage.setItem("lesson2Completed", "true")
    }
  }, [matchedPairs, isCompleted])

  // Verificar pares quando duas cartas são viradas
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards

      // Create a timeout to prevent immediate state updates
      const timer = setTimeout(() => {
        if (cards[first].type === cards[second].type) {
          // Par encontrado
          setCards((prevCards) =>
            prevCards.map((card, index) => (index === first || index === second ? { ...card, matched: true } : card)),
          )
          setMatchedPairs((prev) => prev + 1)
          setScore((prev) => prev + 15)
          toast({
            title: "Par encontrado!",
            description: `Você encontrou um par de ${cards[first].name}!`,
            variant: "default",
          })
        } else {
          // Par não encontrado - virar as cartas de volta
          setCards((prevCards) =>
            prevCards.map((card, index) => (index === first || index === second ? { ...card, flipped: false } : card)),
          )
          toast({
            title: "Tente novamente!",
            description: "Essas cartas não formam um par.",
            variant: "destructive",
          })
        }

        // Reset flipped cards
        setFlippedCards([])
        setMoves((prev) => prev + 1)
      }, 1000)

      // Clean up the timeout
      return () => clearTimeout(timer)
    }
  }, [flippedCards])

  const initGame = () => {
    // Embaralhar as cartas
    const shuffledCards = [...memoryItems]
      .sort(() => Math.random() - 0.5)
      .map((item) => ({ ...item, flipped: false, matched: false }))

    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setIsCompleted(false)
    setScore(0)
  }

  const handleCardClick = (index: number) => {
    // Ignorar se já temos 2 cartas viradas ou se a carta já foi virada/combinada
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) {
      return
    }

    // Virar a carta
    setCards(cards.map((card, i) => (i === index ? { ...card, flipped: true } : card)))

    // Adicionar à lista de cartas viradas
    setFlippedCards([...flippedCards, index])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <Toaster />
      <header className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6" />
            <h1 className="text-xl font-bold">EcoAprendiz</h1>
          </div>
          <div className="flex items-center gap-2">
            <span>Pontos: {score}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-700">Lição 2: Jogo da Memória Reciclável</h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                aria-label="Informações sobre o jogo"
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>

            {showInfo && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4 text-blue-800">
                <h3 className="font-semibold mb-2">Como Jogar</h3>
                <p className="mb-2">
                  Encontre os pares de itens recicláveis virando as cartas. Memorize as posições para encontrar todos os
                  pares com o menor número de movimentos.
                </p>
                <p>Cada par encontrado te ensina sobre um tipo diferente de material reciclável.</p>
              </div>
            )}

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso</span>
                <span className="text-sm font-medium">
                  {matchedPairs}/{memoryItems.length / 2} pares
                </span>
              </div>
              <Progress value={(matchedPairs / (memoryItems.length / 2)) * 100} className="h-2" />
            </div>

            <div className="flex justify-between items-center mb-4 text-sm">
              <span>Movimentos: {moves}</span>
              <Button variant="outline" size="sm" onClick={initGame}>
                Reiniciar Jogo
              </Button>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {cards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`aspect-square rounded-lg transition-all transform ${
                    card.flipped || card.matched ? "bg-green-100 rotate-y-180" : "bg-green-600 hover:bg-green-500"
                  } ${card.matched ? "ring-2 ring-green-500" : ""}`}
                  disabled={card.matched}
                  aria-label={card.flipped || card.matched ? card.name : "Carta virada para baixo"}
                >
                  <div className="h-full w-full flex items-center justify-center">
                    {(card.flipped || card.matched) && (
                      <div className="text-center">
                        <span className="text-3xl block" role="img" aria-hidden="true">
                          {card.emoji}
                        </span>
                        <span className="text-xs mt-1 block">{card.name}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {isCompleted && (
              <div className="mt-8 p-4 bg-green-100 rounded-lg border border-green-300 text-center">
                <h3 className="text-xl font-bold text-green-700 mb-2">Parabéns! Você completou a Lição 2</h3>
                <p className="mb-4">
                  Você encontrou todos os pares e aprendeu sobre os diferentes tipos de materiais recicláveis.
                </p>
                <Link href="/licoes/3">
                  <Button className="bg-green-600 hover:bg-green-700">Avançar para Lição 3</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-green-700 mb-4">Dicas de Acessibilidade</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Use Tab para navegar entre as cartas e Enter para selecioná-las.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Cada carta tem uma descrição de áudio para leitores de tela.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>O jogo pode ser jogado apenas com o teclado, sem necessidade de mouse.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

