"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Leaf, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

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

export default function Lesson3() {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [compostHealth, setCompostHealth] = useState(50) // 0-100
  const [stage, setStage] = useState(1) // 1-3 (seleção, mistura, resultado)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [showItemInfo, setShowItemInfo] = useState<number | null>(null)

  // Verificar se a lição foi completada
  useEffect(() => {
    if (stage === 3 && compostHealth >= 70) {
      if (!isCompleted) {
        setIsCompleted(true)
        localStorage.setItem("lesson3Completed", "true")
      }
    }
  }, [stage, compostHealth, isCompleted])

  const handleItemSelect = (id: number) => {
    const item = compostItems.find((item) => item.id === id)

    if (!item) return

    // Verificar se o item já está selecionado
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))

      // Ajustar a saúde da compostagem
      if (item.type === "compostable") {
        setCompostHealth((prev) => Math.max(0, prev - 10))
      } else {
        setCompostHealth((prev) => Math.min(100, prev + 10))
      }

      setScore((prev) => Math.max(0, prev - 5))
    } else {
      // Adicionar item
      setSelectedItems([...selectedItems, id])

      // Ajustar a saúde da compostagem
      if (item.type === "compostable") {
        setCompostHealth((prev) => Math.min(100, prev + 10))
        setScore((prev) => prev + 10)
        toast({
          title: "Boa escolha!",
          description: `${item.name} é ótimo para compostagem.`,
          variant: "default",
        })
      } else {
        setCompostHealth((prev) => Math.max(0, prev - 15))
        setScore((prev) => Math.max(0, prev - 5))
        toast({
          title: "Cuidado!",
          description: `${item.name} não deve ir para compostagem.`,
          variant: "destructive",
        })
      }
    }
  }

  const handleNextStage = () => {
    if (stage < 3) {
      setStage((prev) => prev + 1)

      // Bônus para estágio final se tiver boa saúde
      if (stage === 2 && compostHealth >= 70) {
        setScore((prev) => prev + 20)
      }
    }
  }

  const handleReset = () => {
    setSelectedItems([])
    setCompostHealth(50)
    setStage(1)
    setScore(0)
    setIsCompleted(false)
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
              <h2 className="text-2xl font-bold text-green-700">Lição 3: Compostagem Básica</h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                aria-label="Informações sobre compostagem"
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>

            {showInfo && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4 text-blue-800">
                <h3 className="font-semibold mb-2">Sobre Compostagem</h3>
                <p className="mb-2">
                  Compostagem é o processo natural de decomposição de materiais orgânicos que resulta em um rico
                  fertilizante. Nem todos os materiais podem ser compostados - alguns podem contaminar o composto ou
                  atrair pragas.
                </p>
                <p>Nesta atividade, você aprenderá quais materiais são adequados para compostagem doméstica.</p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Estágio {stage}/3</span>
                <span className={`text-sm font-medium ${getCompostHealthColor()}`}>
                  Saúde da Compostagem: {getCompostHealthText()} ({compostHealth}%)
                </span>
              </div>
              <Progress
                value={compostHealth}
                className="h-2"
                indicatorClassName={
                  compostHealth >= 60 ? "bg-green-500" : compostHealth >= 30 ? "bg-yellow-500" : "bg-red-500"
                }
              />
            </div>

            {stage === 1 && (
              <div>
                <h3 className="font-semibold mb-3 text-green-700">Selecione os materiais para sua composteira</h3>
                <p className="text-gray-600 mb-4">
                  Clique nos itens que você acredita que podem ser compostados. Escolha com cuidado!
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                  {compostItems.map((item) => (
                    <div key={item.id} className="relative">
                      <button
                        onClick={() => handleItemSelect(item.id)}
                        className={`w-full p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                          selectedItems.includes(item.id)
                            ? "bg-amber-100 border-amber-400"
                            : "bg-gray-50 border-gray-200 hover:border-amber-300"
                        }`}
                        aria-label={`${item.name} - Clique para ${selectedItems.includes(item.id) ? "remover da" : "adicionar à"} composteira`}
                      >
                        <span className="text-2xl" role="img" aria-hidden="true">
                          {item.icon}
                        </span>
                        <span className="text-sm text-center">{item.name}</span>
                      </button>
                      <button
                        onClick={() => setShowItemInfo(showItemInfo === item.id ? null : item.id)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                        aria-label={`Informações sobre ${item.name}`}
                      >
                        i
                      </button>

                      {showItemInfo === item.id && (
                        <div className="absolute z-10 top-full left-0 right-0 mt-1 p-2 bg-white rounded shadow-lg text-xs">
                          <p>{item.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNextStage} disabled={selectedItems.length === 0}>
                    Próximo Estágio
                  </Button>
                </div>
              </div>
            )}

            {stage === 2 && (
              <div>
                <h3 className="font-semibold mb-3 text-green-700">Misturando sua composteira</h3>

                <div className="bg-amber-100 rounded-lg p-4 mb-6 relative overflow-hidden">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedItems.map((id) => {
                      const item = compostItems.find((item) => item.id === id)
                      return (
                        <div
                          key={id}
                          className={`p-2 rounded ${item?.type === "compostable" ? "bg-green-100" : "bg-red-100"}`}
                        >
                          <span className="text-xl mr-1" role="img" aria-hidden="true">
                            {item?.icon}
                          </span>
                          <span className="text-sm">{item?.name}</span>
                          {item?.type === "compostable" ? (
                            <Check className="inline h-4 w-4 text-green-500 ml-1" />
                          ) : (
                            <X className="inline h-4 w-4 text-red-500 ml-1" />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="h-32 bg-gradient-to-b from-amber-200 to-amber-600 rounded-lg flex items-center justify-center relative">
                    {selectedItems.filter((id) => {
                      const item = compostItems.find((item) => item.id === id)
                      return item?.type === "compostable"
                    }).length >= 4 ? (
                      <div className="text-center">
                        <span className="text-4xl" role="img" aria-label="Compostagem saudável">
                          🌱
                        </span>
                        <p className="font-medium text-amber-800">Sua compostagem está progredindo bem!</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-4xl" role="img" aria-label="Compostagem com problemas">
                          ⚠️
                        </span>
                        <p className="font-medium text-amber-800">
                          Sua compostagem precisa de mais materiais adequados.
                        </p>
                      </div>
                    )}

                    {/* Animação de "mistura" */}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-6 h-6 opacity-50 animate-bounce"
                        style={{
                          left: `${Math.random() * 90}%`,
                          top: `${Math.random() * 80}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1 + Math.random() * 2}s`,
                        }}
                      >
                        {selectedItems[Math.floor(Math.random() * selectedItems.length)] && (
                          <span className="text-xl">
                            {
                              compostItems.find(
                                (item) => item.id === selectedItems[Math.floor(Math.random() * selectedItems.length)],
                              )?.icon
                            }
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNextStage}>Ver Resultado</Button>
                </div>
              </div>
            )}

            {stage === 3 && (
              <div>
                <h3 className="font-semibold mb-3 text-green-700">Resultado da sua Compostagem</h3>

                <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg p-6 mb-6 text-center">
                  {compostHealth >= 70 ? (
                    <div>
                      <div className="w-32 h-32 mx-auto bg-gradient-to-b from-amber-600 to-amber-800 rounded-full flex items-center justify-center mb-4">
                        <span className="text-6xl" role="img" aria-label="Composto saudável">
                          🌱
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-green-700 mb-2">Parabéns!</h4>
                      <p className="text-green-600 mb-4">
                        Você criou um composto saudável que pode ser usado para nutrir plantas e jardins.
                      </p>
                    </div>
                  ) : compostHealth >= 40 ? (
                    <div>
                      <div className="w-32 h-32 mx-auto bg-gradient-to-b from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-6xl" role="img" aria-label="Composto médio">
                          🌿
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-yellow-700 mb-2">Quase lá!</h4>
                      <p className="text-yellow-600 mb-4">
                        Seu composto está razoável, mas poderia ser melhor com uma seleção mais cuidadosa de materiais.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-32 h-32 mx-auto bg-gradient-to-b from-amber-300 to-amber-500 rounded-full flex items-center justify-center mb-4">
                        <span className="text-6xl" role="img" aria-label="Composto ruim">
                          ⚠️
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-red-700 mb-2">Precisa melhorar</h4>
                      <p className="text-red-600 mb-4">
                        Sua compostagem não foi bem-sucedida. Você incluiu muitos materiais inadequados.
                      </p>
                    </div>
                  )}

                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">O que você aprendeu:</h5>
                    <ul className="text-left space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          Materiais orgânicos como restos de frutas, vegetais e cascas de ovos são ideais para
                          compostagem.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Evite adicionar carnes, laticínios, óleos e materiais não biodegradáveis.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          Uma boa compostagem precisa de um equilíbrio entre materiais ricos em carbono e nitrogênio.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleReset}>
                    Tentar Novamente
                  </Button>

                  {compostHealth >= 70 && (
                    <Link href="/licoes/4">
                      <Button className="bg-green-600 hover:bg-green-700">Próxima Lição</Button>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="mt-8 p-4 bg-green-100 rounded-lg border border-green-300 text-center">
                <h3 className="text-xl font-bold text-green-700 mb-2">Parabéns! Você completou a Lição 3</h3>
                <p className="mb-4">
                  Você aprendeu os princípios básicos da compostagem e como transformar resíduos orgânicos em adubo
                  natural.
                </p>
                <Link href="/licoes/4">
                  <Button className="bg-green-600 hover:bg-green-700">Avançar para Lição 4</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-green-700 mb-4">Dicas de Acessibilidade</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Use Tab para navegar entre os elementos e Enter para selecionar.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Cada item tem uma descrição detalhada acessível por leitores de tela.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>O botão "i" ao lado de cada item fornece informações adicionais.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

