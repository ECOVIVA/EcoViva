
// Quebra-cabeça de economia de água
const puzzlePieces = [
  { id: 1, text: "Fechar a torneira enquanto escova os dentes", saving: 12, icon: "🚿", unit: "litros/dia" },
  { id: 2, text: "Reduzir o tempo do banho em 5 minutos", saving: 90, icon: "🛁", unit: "litros/dia" },
  {
    id: 3,
    text: "Usar a máquina de lavar roupa apenas com carga completa",
    saving: 100,
    icon: "👕",
    unit: "litros/lavagem",
  },
  { id: 4, text: "Consertar vazamentos de torneiras", saving: 40, icon: "🔧", unit: "litros/dia" },
  { id: 5, text: "Reutilizar água da chuva para plantas", saving: 200, icon: "🌧️", unit: "litros/mês" },
  { id: 6, text: "Usar regador em vez de mangueira no jardim", saving: 50, icon: "🌱", unit: "litros/dia" },
  { id: 7, text: "Instalar aeradores nas torneiras", saving: 30, icon: "🚰", unit: "litros/dia" },
  { id: 8, text: "Usar descarga com duplo acionamento", saving: 70, icon: "🚽", unit: "litros/dia" },
]

export default function Lesson4() {
  const [waterSaved, setWaterSaved] = useState(0)
  const [selectedPieces, setSelectedPieces] = useState<number[]>([])
  const [puzzleComplete, setPuzzleComplete] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [dailyUsage, setDailyUsage] = useState(300) // Uso diário médio em litros
  const [targetSaving, setTargetSaving] = useState(150) // Meta de economia

  // Verificar se a lição foi completada
  useEffect(() => {
    if (waterSaved >= targetSaving && !isCompleted) {
      setIsCompleted(true)
      setPuzzleComplete(true)
      localStorage.setItem("lesson4Completed", "true")

      // Bônus por completar
      setScore((prev) => prev + 50)

      toast({
        title: "Parabéns!",
        description: `Você atingiu a meta de economia de água!`,
        variant: "default",
      })
    }
  }, [waterSaved, targetSaving, isCompleted])

  const handlePieceSelect = (id: number) => {
    const piece = puzzlePieces.find((piece) => piece.id === id)

    if (!piece) return

    // Verificar se a peça já está selecionada
    if (selectedPieces.includes(id)) {
      setSelectedPieces(selectedPieces.filter((pieceId) => pieceId !== id))
      setWaterSaved((prev) => prev - piece.saving)
      setScore((prev) => Math.max(0, prev - 5))
    } else {
      // Adicionar peça
      setSelectedPieces([...selectedPieces, id])
      setWaterSaved((prev) => prev + piece.saving)
      setScore((prev) => prev + 10)

      toast({
        title: "Boa escolha!",
        description: `Esta ação economiza ${piece.saving} ${piece.unit}.`,
        variant: "default",
      })
    }
  }

  const handleReset = () => {
    setSelectedPieces([])
    setWaterSaved(0)
    setPuzzleComplete(false)
    setScore(0)
  }

  const getWaterSavingPercentage = () => {
    return Math.min(100, Math.round((waterSaved / targetSaving) * 100))
  }

  const getNewDailyUsage = () => {
    // Simplificação para cálculo diário
    const dailySavings = selectedPieces.reduce((total, id) => {
      const piece = puzzlePieces.find((p) => p.id === id)
      if (piece) {
        if (piece.unit === "litros/dia") {
          return total + piece.saving
        } else if (piece.unit === "litros/lavagem") {
          return total + piece.saving / 7 // Assumindo uma lavagem por semana
        } else if (piece.unit === "litros/mês") {
          return total + piece.saving / 30 // Dividindo por dias no mês
        }
      }
      return total
    }, 0)

    return Math.max(0, dailyUsage - dailySavings)
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
            <Droplet className="h-6 w-6" />
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
              <h2 className="text-2xl font-bold text-blue-700">Lição 4: Economia de Água</h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                aria-label="Informações sobre economia de água"
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>

            {showInfo && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4 text-blue-800">
                <h3 className="font-semibold mb-2">Sobre Economia de Água</h3>
                <p className="mb-2">
                  A água é um recurso precioso e limitado. Pequenas mudanças em nossos hábitos diários podem resultar em
                  grande economia de água, ajudando a preservar este recurso vital para as futuras gerações.
                </p>
                <p>
                  Nesta atividade, você aprenderá diferentes maneiras de economizar água no dia a dia e o impacto que
                  essas ações podem ter.
                </p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso para meta de economia</span>
                <span className="text-sm font-medium text-blue-600">
                  {waterSaved} de {targetSaving} litros ({getWaterSavingPercentage()}%)
                </span>
              </div>
              <Progress value={getWaterSavingPercentage()} className="h-2" indicatorClassName="bg-blue-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3 text-blue-700">Escolha ações para economizar água</h3>
                <p className="text-gray-600 mb-4">
                  Selecione as ações que você pode implementar para economizar água. Tente atingir a meta de{" "}
                  {targetSaving} litros.
                </p>

                <div className="space-y-2">
                  {puzzlePieces.map((piece) => (
                    <button
                      key={piece.id}
                      onClick={() => handlePieceSelect(piece.id)}
                      className={`w-full p-3 rounded-lg border-2 flex items-center gap-3 transition-all ${
                        selectedPieces.includes(piece.id)
                          ? "bg-blue-100 border-blue-400"
                          : "bg-gray-50 border-gray-200 hover:border-blue-300"
                      }`}
                      aria-label={`${piece.text} - Economiza ${piece.saving} ${piece.unit}`}
                    >
                      <span className="text-2xl" role="img" aria-hidden="true">
                        {piece.icon}
                      </span>
                      <div className="text-left">
                        <div>{piece.text}</div>
                        <div className="text-sm text-blue-600 font-medium">
                          Economiza: {piece.saving} {piece.unit}
                        </div>
                      </div>
                      {selectedPieces.includes(piece.id) && <Check className="h-5 w-5 text-blue-500 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-blue-700">Seu impacto</h3>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">Consumo médio diário</h4>
                      <p className="text-gray-600 text-sm">Sem economia</p>
                    </div>
                    <div className="text-xl font-bold text-blue-700">{dailyUsage} L</div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">Novo consumo diário</h4>
                      <p className="text-gray-600 text-sm">Com suas economias</p>
                    </div>
                    <div className="text-xl font-bold text-green-600">{getNewDailyUsage()} L</div>
                  </div>

                  <div className="h-40 bg-gradient-to-b from-blue-100 to-blue-300 rounded-lg flex items-end justify-center p-4 relative">
                    <div
                      className="w-24 bg-blue-500 rounded-t-lg relative transition-all duration-1000"
                      style={{
                        height: `${Math.min(100, (getNewDailyUsage() / dailyUsage) * 100)}%`,
                        maxHeight: "90%",
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-700 font-bold">
                        {Math.round((1 - getNewDailyUsage() / dailyUsage) * 100)}% menos
                      </div>
                    </div>

                    <div className="w-24 bg-blue-600 rounded-t-lg relative mx-4" style={{ height: "90%" }}>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-700 font-bold">
                        Antes
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-0 right-0 text-center text-blue-800 text-sm">
                      Comparação de consumo diário
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Impacto anual</h4>
                  <p className="mb-4">Com essas mudanças, você economizaria aproximadamente:</p>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{Math.round(waterSaved * 365)} L</div>
                      <div className="text-sm text-gray-600">por ano</div>
                    </div>

                    <div className="bg-white p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((waterSaved * 365) / 1000)} m³
                      </div>
                      <div className="text-sm text-gray-600">metros cúbicos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {puzzleComplete && (
              <div className="mt-8 p-4 bg-blue-100 rounded-lg border border-blue-300 text-center">
                <h3 className="text-xl font-bold text-blue-700 mb-2">Parabéns! Você completou a Lição 4</h3>
                <p className="mb-4">
                  Você aprendeu várias maneiras de economizar água no dia a dia e o impacto que essas ações podem ter.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={handleReset}>
                    Tentar Novamente
                  </Button>
                  <Link href="/licoes/5">
                    <Button className="bg-blue-600 hover:bg-blue-700">Avançar para Lição 5</Button>
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
                <span>Todas as informações visuais possuem descrições para leitores de tela.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>O contraste de cores foi otimizado para melhor legibilidade.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

