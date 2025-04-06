"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Info, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Fontes de poluição e suas soluções
const pollutionSources = [
  {
    id: 1,
    name: "Fábrica emitindo fumaça",
    type: "ar",
    icon: "🏭",
    description: "Indústrias que emitem gases poluentes sem filtros adequados.",
  },
  {
    id: 2,
    name: "Descarte incorreto de lixo",
    type: "solo",
    icon: "🗑️",
    description: "Resíduos descartados em locais inadequados, contaminando o solo.",
  },
  {
    id: 3,
    name: "Vazamento de óleo",
    type: "agua",
    icon: "🛢️",
    description: "Derramamento de petróleo e derivados em ambientes aquáticos.",
  },
  {
    id: 4,
    name: "Veículos com alta emissão",
    type: "ar",
    icon: "🚗",
    description: "Automóveis e caminhões que emitem grandes quantidades de gases poluentes.",
  },
  {
    id: 5,
    name: "Esgoto não tratado",
    type: "agua",
    icon: "🚽",
    description: "Despejo de esgoto doméstico e industrial sem tratamento adequado em rios e mares.",
  },
  {
    id: 6,
    name: "Uso excessivo de agrotóxicos",
    type: "solo",
    icon: "🌱",
    description: "Aplicação intensiva de pesticidas e herbicidas que contaminam o solo e lençóis freáticos.",
  },
  {
    id: 7,
    name: "Queimadas",
    type: "ar",
    icon: "🔥",
    description: "Incêndios florestais e queima de vegetação que liberam fumaça e partículas no ar.",
  },
  {
    id: 8,
    name: "Lixo plástico nos oceanos",
    type: "agua",
    icon: "🥤",
    description: "Acúmulo de resíduos plásticos em ambientes marinhos, afetando a vida aquática.",
  },
  {
    id: 9,
    name: "Mineração sem controle",
    type: "solo",
    icon: "⛏️",
    description: "Extração mineral sem práticas adequadas de recuperação ambiental.",
  },
]

// Soluções para os problemas de poluição
const pollutionSolutions = [
  {
    id: 1,
    name: "Filtros industriais",
    type: "ar",
    icon: "🔬",
    description: "Instalação de filtros e tecnologias de captura de poluentes em chaminés industriais.",
  },
  {
    id: 2,
    name: "Coleta seletiva",
    type: "solo",
    icon: "♻️",
    description: "Separação e reciclagem de resíduos para reduzir o volume de lixo em aterros.",
  },
  {
    id: 3,
    name: "Barreiras de contenção",
    type: "agua",
    icon: "🧱",
    description: "Uso de barreiras flutuantes para conter vazamentos de óleo em ambientes aquáticos.",
  },
  {
    id: 4,
    name: "Veículos elétricos",
    type: "ar",
    icon: "🔋",
    description: "Substituição de veículos a combustão por modelos elétricos ou híbridos.",
  },
  {
    id: 5,
    name: "Estações de tratamento",
    type: "agua",
    icon: "🏗️",
    description: "Construção e operação de estações de tratamento de esgoto antes do despejo em corpos d'água.",
  },
  {
    id: 6,
    name: "Agricultura orgânica",
    type: "solo",
    icon: "🌿",
    description: "Práticas agrícolas que evitam o uso de agrotóxicos sintéticos e priorizam métodos naturais.",
  },
  {
    id: 7,
    name: "Monitoramento por satélite",
    type: "ar",
    icon: "🛰️",
    description: "Uso de tecnologia para detectar e combater queimadas rapidamente.",
  },
  {
    id: 8,
    name: "Limpeza de praias e oceanos",
    type: "agua",
    icon: "🧹",
    description: "Ações de remoção de resíduos plásticos de ambientes marinhos e costeiros.",
  },
  {
    id: 9,
    name: "Recuperação de áreas degradadas",
    type: "solo",
    icon: "🌱",
    description: "Técnicas de reflorestamento e recuperação do solo em áreas afetadas pela mineração.",
  },
]

// Tipos de poluição
const pollutionTypes = [
  { id: "ar", name: "Poluição do Ar", icon: "💨", color: "bg-blue-100 border-blue-400" },
  { id: "agua", name: "Poluição da Água", icon: "💧", color: "bg-cyan-100 border-cyan-400" },
  { id: "solo", name: "Poluição do Solo", icon: "🌱", color: "bg-amber-100 border-amber-400" },
]

export default function Lesson9() {
  const [selectedProblem, setSelectedProblem] = useState<number | null>(null)
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null)
  const [connections, setConnections] = useState<{ problemId: number; solutionId: number }[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [activeType, setActiveType] = useState<string | null>(null)
  const [showProblemInfo, setShowProblemInfo] = useState<number | null>(null)
  const [showSolutionInfo, setShowSolutionInfo] = useState<number | null>(null)

  // Verificar se a lição foi completada
  useEffect(() => {
    const correctConnections = connections.filter((conn) => {
      const problem = pollutionSources.find((p) => p.id === conn.problemId)
      const solution = pollutionSolutions.find((s) => s.id === conn.solutionId)
      return problem?.type === solution?.type
    }).length

    // Lição completa quando tiver pelo menos 6 conexões corretas
    if (correctConnections >= 6 && !isCompleted) {
      setIsCompleted(true)
      localStorage.setItem("lesson9Completed", "true")

      // Calcular pontuação final
      const finalScore = Math.round((correctConnections / pollutionSources.length) * 100)
      setScore(finalScore)

      toast({
        title: "Parabéns!",
        description: `Você conectou ${correctConnections} problemas às suas soluções!`,
        variant: "default",
      })
    }
  }, [connections, isCompleted])

  const handleProblemSelect = (id: number) => {
    setSelectedProblem(id)
    setSelectedSolution(null)

    // Definir o tipo ativo baseado no problema selecionado
    const problem = pollutionSources.find((p) => p.id === id)
    if (problem) {
      setActiveType(problem.type)
    }
  }

  const handleSolutionSelect = (id: number) => {
    if (selectedProblem !== null) {
      // Verificar se a solução é compatível com o problema
      const problem = pollutionSources.find((p) => p.id === selectedProblem)
      const solution = pollutionSolutions.find((s) => s.id === id)

      if (!problem || !solution) return

      // Verificar se já existe uma conexão para este problema
      const existingConnectionIndex = connections.findIndex((conn) => conn.problemId === selectedProblem)

      if (existingConnectionIndex !== -1) {
        // Substituir a conexão existente
        const newConnections = [...connections]
        newConnections[existingConnectionIndex] = { problemId: selectedProblem, solutionId: id }
        setConnections(newConnections)
      } else {
        // Adicionar nova conexão
        setConnections([...connections, { problemId: selectedProblem, solutionId: id }])
      }

      // Verificar se a conexão está correta
      if (problem.type === solution.type) {
        setScore((prev) => prev + 10)
        toast({
          title: "Conexão correta!",
          description: `${solution.name} é uma boa solução para ${problem.name}!`,
          variant: "default",
        })
      } else {
        toast({
          title: "Conexão incorreta",
          description: "Esta solução não é a mais adequada para este problema.",
          variant: "destructive",
        })
      }

      setSelectedProblem(null)
      setActiveType(null)
    } else {
      setSelectedSolution(id)
      setSelectedProblem(null)

      // Definir o tipo ativo baseado na solução selecionada
      const solution = pollutionSolutions.find((s) => s.id === id)
      if (solution) {
        setActiveType(solution.type)
      }
    }
  }

  const handleReset = () => {
    setConnections([])
    setSelectedProblem(null)
    setSelectedSolution(null)
    setActiveType(null)
    setIsCompleted(false)
    setScore(0)
  }

  const getSolutionForProblem = (problemId: number) => {
    const connection = connections.find((conn) => conn.problemId === problemId)
    return connection ? connection.solutionId : null
  }

  const isCorrectConnection = (problemId: number, solutionId: number) => {
    const problem = pollutionSources.find((p) => p.id === problemId)
    const solution = pollutionSolutions.find((s) => s.id === solutionId)
    return problem?.type === solution?.type
  }

  const getFilteredProblems = () => {
    if (activeType === null) {
      return pollutionSources
    }
    return pollutionSources.filter((problem) => problem.type === activeType)
  }

  const getFilteredSolutions = () => {
    if (activeType === null) {
      return pollutionSolutions
    }
    return pollutionSolutions.filter((solution) => solution.type === activeType)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Toaster />
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            <Trash2 className="h-6 w-6" />
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
              <h2 className="text-2xl font-bold text-blue-700">Lição 9: Poluição e Soluções</h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                aria-label="Informações sobre poluição"
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>

            {showInfo && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4 text-blue-800">
                <h3 className="font-semibold mb-2">Sobre Poluição e Soluções</h3>
                <p className="mb-2">
                  A poluição é a introdução de contaminantes no ambiente natural que causam efeitos adversos. Ela pode
                  afetar o ar, a água e o solo, impactando a saúde humana e os ecossistemas.
                </p>
                <p>
                  Nesta atividade, você aprenderá sobre diferentes tipos de poluição e as soluções que podem ser
                  implementadas para combatê-los.
                </p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso</span>
                <span className="text-sm font-medium">
                  {connections.length} de {pollutionSources.length} problemas conectados
                </span>
              </div>
              <Progress value={(connections.length / pollutionSources.length) * 100} className="h-2" />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={activeType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveType(null)}
              >
                Todos os tipos
              </Button>
              {pollutionTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={activeType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveType(type.id)}
                  className="flex items-center gap-1"
                >
                  <span role="img" aria-hidden="true">
                    {type.icon}
                  </span>
                  {type.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3 text-blue-700">Problemas de Poluição</h3>

                <div className="space-y-3">
                  {getFilteredProblems().map((problem) => {
                    const solutionId = getSolutionForProblem(problem.id)
                    const solution = solutionId ? pollutionSolutions.find((s) => s.id === solutionId) : null
                    const isCorrect = solutionId ? isCorrectConnection(problem.id, solutionId) : null
                    const type = pollutionTypes.find((t) => t.id === problem.type)

                    return (
                      <div key={problem.id} className="relative">
                        <button
                          onClick={() => handleProblemSelect(problem.id)}
                          className={`w-full p-3 rounded-lg border-2 flex items-center gap-3 transition-all ${
                            selectedProblem === problem.id
                              ? "ring-2 ring-blue-500 bg-blue-50"
                              : solutionId
                                ? isCorrect
                                  ? "bg-green-100 border-green-400"
                                  : "bg-red-100 border-red-400"
                                : type
                                  ? type.color
                                  : "bg-gray-100 border-gray-300"
                          }`}
                          aria-label={`${problem.name} - ${solution ? "Conectado a " + solution.name : "Não conectado"}`}
                        >
                          <span className="text-2xl" role="img" aria-hidden="true">
                            {problem.icon}
                          </span>
                          <div className="text-left flex-1">
                            <div className="font-medium">{problem.name}</div>
                            <div className="text-xs text-gray-600">{type?.name}</div>
                          </div>

                          {solutionId && (
                            <div className="flex items-center gap-1">
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                              <div className="text-sm">{solution?.name}</div>
                              {isCorrect ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          )}
                        </button>
                        <button
                          onClick={() => setShowProblemInfo(showProblemInfo === problem.id ? null : problem.id)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                          aria-label={`Informações sobre ${problem.name}`}
                        >
                          i
                        </button>

                        {showProblemInfo === problem.id && (
                          <div className="absolute z-10 top-full left-0 right-0 mt-1 p-2 bg-white rounded shadow-lg text-xs">
                            <p>{problem.description}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-blue-700">Soluções</h3>

                <div className="space-y-3">
                  {getFilteredSolutions().map((solution) => {
                    const type = pollutionTypes.find((t) => t.id === solution.type)

                    return (
                      <div key={solution.id} className="relative">
                        <button
                          onClick={() => handleSolutionSelect(solution.id)}
                          className={`w-full p-3 rounded-lg border-2 flex items-center gap-3 transition-all ${
                            selectedSolution === solution.id
                              ? "ring-2 ring-blue-500 bg-blue-50"
                              : type
                                ? type.color
                                : "bg-gray-100 border-gray-300"
                          }`}
                          aria-label={`${solution.name} - Solução para ${type?.name}`}
                        >
                          <span className="text-2xl" role="img" aria-hidden="true">
                            {solution.icon}
                          </span>
                          <div className="text-left">
                            <div className="font-medium">{solution.name}</div>
                            <div className="text-xs text-gray-600">{type?.name}</div>
                          </div>
                        </button>
                        <button
                          onClick={() => setShowSolutionInfo(showSolutionInfo === solution.id ? null : solution.id)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                          aria-label={`Informações sobre ${solution.name}`}
                        >
                          i
                        </button>

                        {showSolutionInfo === solution.id && (
                          <div className="absolute z-10 top-full left-0 right-0 mt-1 p-2 bg-white rounded shadow-lg text-xs">
                            <p>{solution.description}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-700">Dica</h4>
                  <p className="text-sm text-blue-600">
                    Conecte cada problema de poluição com uma solução do mesmo tipo (ar, água ou solo). Clique em um
                    problema e depois em uma solução para conectá-los.
                  </p>
                </div>
              </div>
            </div>

            {isCompleted && (
              <div className="mt-8 p-4 bg-blue-100 rounded-lg border border-blue-300 text-center">
                <h3 className="text-xl font-bold text-blue-700 mb-2">Parabéns! Você completou a Lição 9</h3>
                <p className="mb-4">
                  Você aprendeu sobre diferentes tipos de poluição e as soluções que podem ser implementadas para
                  combatê-los.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={handleReset}>
                    Tentar Novamente
                  </Button>
                  <Link href="/licoes/10">
                    <Button className="bg-blue-600 hover:bg-blue-700">Avançar para Lição 10</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-blue-700 mb-4">Dicas de Acessibilidade</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Use Tab para navegar entre os problemas e soluções, e Enter para selecionar.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>O botão "i" fornece informações detalhadas sobre cada problema e solução.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Você pode filtrar por tipo de poluição usando os botões no topo da atividade.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

