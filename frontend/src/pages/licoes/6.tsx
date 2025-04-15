import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Info, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Fontes de energia renovável e seus usos
const energySources = [
  { id: 1, name: "Energia Solar", icon: "☀️", color: "bg-yellow-100 border-yellow-400" },
  { id: 2, name: "Energia Eólica", icon: "🌬️", color: "bg-blue-100 border-blue-400" },
  { id: 3, name: "Energia Hidrelétrica", icon: "💧", color: "bg-cyan-100 border-cyan-400" },
  { id: 4, name: "Biomassa", icon: "🌱", color: "bg-green-100 border-green-400" },
  { id: 5, name: "Energia Geotérmica", icon: "🌋", color: "bg-red-100 border-red-400" },
]

const energyUses = [
  {
    id: 1,
    name: "Aquecimento de Água",
    icon: "🚿",
    compatibleSources: [1, 5],
    description: "Aquecimento de água para uso doméstico e comercial.",
  },
  {
    id: 2,
    name: "Geração de Eletricidade",
    icon: "💡",
    compatibleSources: [1, 2, 3, 4, 5],
    description: "Produção de energia elétrica para residências, comércio e indústria.",
  },
  {
    id: 3,
    name: "Transporte",
    icon: "🚗",
    compatibleSources: [1, 4],
    description: "Alimentação de veículos elétricos ou biocombustíveis.",
  },
  {
    id: 4,
    name: "Climatização",
    icon: "❄️",
    compatibleSources: [1, 2, 5],
    description: "Aquecimento e refrigeração de ambientes.",
  },
  {
    id: 5,
    name: "Processos Industriais",
    icon: "🏭",
    compatibleSources: [1, 2, 3, 4, 5],
    description: "Fornecimento de energia para processos industriais diversos.",
  },
]

export default function Lesson6() {
  const [selectedSource, setSelectedSource] = useState<number | null>(null)
  const [selectedUse, setSelectedUse] = useState<number | null>(null)
  const [connections, setConnections] = useState<{ source: number; use: number }[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Verificar se a lição foi completada
  useEffect(() => {
    const allUsesConnected = energyUses.every((use) => connections.some((conn) => conn.use === use.id))

    if (allUsesConnected && !isCompleted) {
      setIsCompleted(true)
      localStorage.setItem("lesson6Completed", "true")

      // Bônus por completar
      setScore((prev) => prev + 50)

      toast({
        title: "Parabéns!",
        description: "Você conectou todas as fontes de energia renovável aos seus usos!",
        variant: "default",
      })
    }
  }, [connections, isCompleted])

  // Desenhar as conexões no canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Definir estilo da linha
    ctx.lineWidth = 3
    ctx.lineCap = "round"

    // Desenhar cada conexão
    connections.forEach((conn) => {
      const sourceElement = document.getElementById(`source-${conn.source}`)
      const useElement = document.getElementById(`use-${conn.use}`)

      if (sourceElement && useElement) {
        const sourceRect = sourceElement.getBoundingClientRect()
        const useRect = useElement.getBoundingClientRect()
        const canvasRect = canvas.getBoundingClientRect()

        const startX = sourceRect.right - canvasRect.left
        const startY = sourceRect.top + sourceRect.height / 2 - canvasRect.top
        const endX = useRect.left - canvasRect.left
        const endY = useRect.top + useRect.height / 2 - canvasRect.top

        // Definir cor baseada na fonte de energia
        const source = energySources.find((s) => s.id === conn.source)
        if (source) {
          if (source.id === 1)
            ctx.strokeStyle = "#FBBF24" // Solar - amarelo
          else if (source.id === 2)
            ctx.strokeStyle = "#60A5FA" // Eólica - azul
          else if (source.id === 3)
            ctx.strokeStyle = "#22D3EE" // Hidrelétrica - ciano
          else if (source.id === 4)
            ctx.strokeStyle = "#34D399" // Biomassa - verde
          else if (source.id === 5) ctx.strokeStyle = "#F87171" // Geotérmica - vermelho
        }

        // Desenhar a linha
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.bezierCurveTo(startX + 50, startY, endX - 50, endY, endX, endY)
        ctx.stroke()
      }
    })
  }, [connections])

  // Ajustar o tamanho do canvas quando a janela for redimensionada
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const container = canvas.parentElement
      if (!container) return

      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleSourceSelect = (id: number) => {
    setSelectedSource(id)
    setSelectedUse(null)
  }

  const handleUseSelect = (id: number) => {
    if (selectedSource !== null) {
      // Verificar se a fonte é compatível com o uso
      const use = energyUses.find((u) => u.id === id)

      if (use && use.compatibleSources.includes(selectedSource)) {
        // Verificar se já existe uma conexão para este uso
        const existingConnectionIndex = connections.findIndex((conn) => conn.use === id)

        if (existingConnectionIndex !== -1) {
          // Substituir a conexão existente
          const newConnections = [...connections]
          newConnections[existingConnectionIndex] = { source: selectedSource, use: id }
          setConnections(newConnections)
        } else {
          // Adicionar nova conexão
          setConnections([...connections, { source: selectedSource, use: id }])
        }

        setScore((prev) => prev + 10)

        toast({
          title: "Conexão correta!",
          description: `${energySources.find((s) => s.id === selectedSource)?.name} pode ser usada para ${use.name}.`,
          variant: "default",
        })
      } else {
        toast({
          title: "Conexão incorreta!",
          description: `Esta fonte de energia não é adequada para este uso.`,
          variant: "destructive",
        })
      }

      setSelectedSource(null)
    } else {
      setSelectedUse(id)
      setSelectedSource(null)
    }
  }

  const handleReset = () => {
    setConnections([])
    setSelectedSource(null)
    setSelectedUse(null)
    setIsCompleted(false)
    setScore(0)
  }

  const getConnectionsForSource = (sourceId: number) => {
    return connections.filter((conn) => conn.source === sourceId).length
  }

  const getSourceForUse = (useId: number) => {
    const connection = connections.find((conn) => conn.use === useId)
    return connection ? connection.source : null
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
            <Zap className="h-6 w-6" />
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
              <h2 className="text-2xl font-bold text-blue-700">Lição 6: Energia Renovável</h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                aria-label="Informações sobre energia renovável"
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>

            {showInfo && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4 text-blue-800">
                <h3 className="font-semibold mb-2">Sobre Energia Renovável</h3>
                <p className="mb-2">
                  Energias renováveis são fontes de energia que se renovam naturalmente e têm impacto ambiental reduzido
                  em comparação com combustíveis fósseis.
                </p>
                <p>
                  Nesta atividade, você aprenderá sobre diferentes fontes de energia renovável e suas aplicações.
                  Conecte cada fonte de energia ao seu uso apropriado.
                </p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso</span>
                <span className="text-sm font-medium">
                  {connections.length} de {energyUses.length} conexões (
                  {Math.round((connections.length / energyUses.length) * 100)}%)
                </span>
              </div>
              <Progress value={(connections.length / energyUses.length) * 100} className="h-2" />
            </div>

            <div className="relative">
              <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold mb-3 text-blue-700">Fontes de Energia Renovável</h3>

                  <div className="space-y-3">
                    {energySources.map((source) => (
                      <button
                        key={source.id}
                        id={`source-${source.id}`}
                        onClick={() => handleSourceSelect(source.id)}
                        className={`w-full p-3 rounded-lg border-2 flex items-center gap-3 transition-all ${
                          selectedSource === source.id ? "ring-2 ring-blue-500 " + source.color : source.color
                        }`}
                        aria-label={`${source.name} - ${getConnectionsForSource(source.id)} conexões`}
                      >
                        <span className="text-2xl" role="img" aria-hidden="true">
                          {source.icon}
                        </span>
                        <div className="text-left">
                          <div>{source.name}</div>
                          <div className="text-xs text-gray-600">{getConnectionsForSource(source.id)} conexões</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {selectedSource !== null ? (
                        <span role="img" aria-label="Conectar">
                          ➡️
                        </span>
                      ) : selectedUse !== null ? (
                        <span role="img" aria-label="Selecionar fonte">
                          ⬅️
                        </span>
                      ) : (
                        <span role="img" aria-label="Selecionar">
                          👆
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">
                      {selectedSource !== null
                        ? "Selecione um uso para conectar"
                        : selectedUse !== null
                          ? "Selecione uma fonte de energia"
                          : "Selecione uma fonte ou um uso"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-blue-700">Usos da Energia</h3>

                  <div className="space-y-3">
                    {energyUses.map((use) => {
                      const sourceId = getSourceForUse(use.id)
                      const source = sourceId ? energySources.find((s) => s.id === sourceId) : null

                      return (
                        <button
                          key={use.id}
                          id={`use-${use.id}`}
                          onClick={() => handleUseSelect(use.id)}
                          className={`w-full p-3 rounded-lg border-2 flex items-center gap-3 transition-all ${
                            selectedUse === use.id
                              ? "ring-2 ring-blue-500 bg-gray-100"
                              : sourceId !== null && source
                                ? source.color
                                : "bg-gray-100 border-gray-300"
                          }`}
                          aria-label={`${use.name} - ${source ? "Conectado a " + source.name : "Não conectado"}`}
                        >
                          <span className="text-2xl" role="img" aria-hidden="true">
                            {use.icon}
                          </span>
                          <div className="text-left">
                            <div>{use.name}</div>
                            <div className="text-xs text-gray-600">
                              {source ? `Conectado a ${source.name}` : "Não conectado"}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {isCompleted && (
              <div className="mt-8 p-4 bg-blue-100 rounded-lg border border-blue-300 text-center">
                <h3 className="text-xl font-bold text-blue-700 mb-2">Parabéns! Você completou a Lição 6</h3>
                <p className="mb-4">Você aprendeu sobre diferentes fontes de energia renovável e suas aplicações.</p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={handleReset}>
                    Tentar Novamente
                  </Button>
                  <Link href="/licoes/7">
                    <Button className="bg-blue-600 hover:bg-blue-700">Avançar para Lição 7</Button>
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
                <span>Use Tab para navegar entre as opções e Enter para selecionar.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Cada fonte e uso tem descrições detalhadas para leitores de tela.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>As conexões são indicadas por texto além das linhas visuais.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

