import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Leaf, Trash, Trash2, Recycle, Droplet, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/hooks/use-toast"

useToast(); // Usando o hook de toast

const wasteItems = [
  { id: 1, name: "Garrafa PET", type: "plastic", icon: "🥤", color: "bg-red-100 border-red-300" },
  { id: 2, name: "Jornal", type: "paper", icon: "📰", color: "bg-blue-100 border-blue-300" },
  { id: 3, name: "Lata de Alumínio", type: "metal", icon: "🥫", color: "bg-yellow-100 border-yellow-300" },
  { id: 4, name: "Pote de Vidro", type: "glass", icon: "🫙", color: "bg-green-100 border-green-300" },
  { id: 5, name: "Casca de Banana", type: "organic", icon: "🍌", color: "bg-amber-100 border-amber-300" },
  { id: 6, name: "Pilha", type: "hazardous", icon: "🔋", color: "bg-purple-100 border-purple-300" },
]

const bins = [
  { id: "plastic", name: "Plástico", color: "bg-red-500", icon: <Trash className="h-6 w-6" /> },
  { id: "paper", name: "Papel", color: "bg-blue-500", icon: <Trash2 className="h-6 w-6" /> },
  { id: "metal", name: "Metal", color: "bg-yellow-500", icon: <Recycle className="h-6 w-6" /> },
  { id: "glass", name: "Vidro", color: "bg-green-500", icon: <Droplet className="h-6 w-6" /> },
  { id: "organic", name: "Orgânico", color: "bg-amber-500", icon: <Leaf className="h-6 w-6" /> },
  { id: "hazardous", name: "Perigoso", color: "bg-purple-500", icon: <Zap className="h-6 w-6" /> },
]

export default function Lesson1() {
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [correctItems, setCorrectItems] = useState<number[]>([])
  const [, setAttempts] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const allItemsCorrect = wasteItems.length > 0 && correctItems.length === wasteItems.length

    if (allItemsCorrect && !isCompleted) {
      setIsCompleted(true)
      // Save progress to localStorage
      localStorage.setItem("lesson1Completed", "true")
    }
  }, [correctItems.length, wasteItems.length, isCompleted])

  const handleDragStart = (_e: React.DragEvent, id: number) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault()

    if (draggedItem === null) return

    const item = wasteItems.find((item) => item.id === draggedItem)

    if (item) {
      setAttempts((prev) => prev + 1)

      if (item.type === binType) {
        // Correct bin
        if (!correctItems.includes(item.id)) {
          setCorrectItems((prev) => [...prev, item.id])
          setScore((prev) => prev + 10)
          toast({
            title: "Correto!",
            description: `${item.name} vai no recipiente de ${binType}!`,
            variant: "default",
          })
        }
      } else {
        // Wrong bin
        toast({
          title: "Tente novamente!",
          description: `${item.name} não pertence a este recipiente.`,
          variant: "destructive",
        })
      }
    }

    setDraggedItem(null)
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
            <h2 className="text-2xl font-bold text-green-700 mb-2">Lição 1: Introdução à Reciclagem</h2>
            <p className="text-gray-600 mb-4">
              Arraste cada item para a lixeira correta para aprender sobre separação de resíduos.
            </p>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso</span>
                <span className="text-sm font-medium">
                  {correctItems.length}/{wasteItems.length}
                </span>
              </div>
              <Progress value={(correctItems.length / wasteItems.length) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-green-700">Itens para Reciclar</h3>
                <div className="grid grid-cols-2 gap-3">
                  {wasteItems.map((item) => (
                    <div
                      key={item.id}
                      draggable={!correctItems.includes(item.id)}
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      className={`p-3 rounded-lg border-2 flex items-center gap-2 transition-all ${
                        correctItems.includes(item.id)
                          ? "opacity-50 cursor-not-allowed bg-gray-100"
                          : `${item.color} cursor-grab active:cursor-grabbing hover:scale-105`
                      }`}
                    >
                      <span className="text-2xl" role="img" aria-label={item.name}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                      {correctItems.includes(item.id) && <Check className="h-5 w-5 text-green-500 ml-auto" />}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-green-700">Lixeiras</h3>
                <div className="grid grid-cols-2 gap-3">
                  {bins.map((bin) => (
                    <div
                      key={bin.id}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, bin.id)}
                      className={`${bin.color} text-white p-4 rounded-lg flex flex-col items-center justify-center h-24 transition-all hover:opacity-90`}
                    >
                      {bin.icon}
                      <span className="mt-2 font-medium">{bin.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isCompleted && (
              <div className="mt-8 p-4 bg-green-100 rounded-lg border border-green-300 text-center">
                <h3 className="text-xl font-bold text-green-700 mb-2">Parabéns! Você completou a Lição 1</h3>
                <p className="mb-4">Você aprendeu os fundamentos da separação de resíduos para reciclagem.</p>
                <Link href="/licoes/2">
                  <Button className="bg-green-600 hover:bg-green-700">Avançar para Lição 2</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-green-700 mb-4">Dicas de Acessibilidade</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Pressione Tab para navegar entre os elementos e Enter para selecionar.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Use as setas do teclado para mover entre as lixeiras.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Ative o leitor de tela para obter descrições detalhadas dos itens.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

