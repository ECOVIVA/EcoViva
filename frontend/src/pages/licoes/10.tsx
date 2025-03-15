import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Info, Users, Plus, Minus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Tipos de ações comunitárias
const actionTypes = [
  {
    id: 1,
    name: "Mutirão de Limpeza",
    icon: "🧹",
    description: "Organizar um grupo para limpar áreas públicas como praias, parques ou margens de rios.",
    impact: "Redução imediata de resíduos no ambiente e conscientização da comunidade.",
    difficulty: 2,
    resources: ["Sacos de lixo", "Luvas", "Voluntários", "Ferramentas básicas"],
  },
  {
    id: 2,
    name: "Horta Comunitária",
    icon: "🌱",
    description: "Criar e manter uma horta em espaço público para produção de alimentos orgânicos.",
    impact: "Produção local de alimentos, educação ambiental e fortalecimento comunitário.",
    difficulty: 3,
    resources: ["Terreno", "Sementes", "Ferramentas de jardinagem", "Sistema de irrigação", "Voluntários"],
  },
  {
    id: 3,
    name: "Campanha de Reciclagem",
    icon: "♻️",
    description: "Implementar pontos de coleta e educação sobre separação correta de resíduos.",
    impact: "Aumento da taxa de reciclagem e redução de resíduos em aterros.",
    difficulty: 2,
    resources: ["Contêineres de reciclagem", "Material educativo", "Parceria com cooperativas", "Voluntários"],
  },
  {
    id: 4,
    name: "Plantio de Árvores",
    icon: "🌳",
    description: "Organizar o plantio de espécies nativas em áreas urbanas ou degradadas.",
    impact: "Aumento da cobertura vegetal, melhoria da qualidade do ar e combate às ilhas de calor urbanas.",
    difficulty: 3,
    resources: [
      "Mudas de árvores nativas",
      "Ferramentas de jardinagem",
      "Água",
      "Voluntários",
      "Autorização municipal",
    ],
  },
  {
    id: 5,
    name: "Oficinas de Educação Ambiental",
    icon: "📚",
    description: "Realizar workshops e palestras sobre temas ambientais para diferentes públicos.",
    impact: "Conscientização e mudança de comportamento a longo prazo.",
    difficulty: 1,
    resources: ["Local para eventos", "Material didático", "Especialistas", "Equipamento audiovisual"],
  },
  {
    id: 6,
    name: "Captação de Água da Chuva",
    icon: "🌧️",
    description: "Instalar sistemas de captação de água pluvial em edifícios públicos ou comunitários.",
    impact: "Economia de água potável e redução de enchentes em áreas urbanas.",
    difficulty: 4,
    resources: ["Calhas", "Cisternas", "Material hidráulico", "Mão de obra especializada", "Autorização"],
  },
]

export default function Lesson10() {
  const [selectedAction, setSelectedAction] = useState<number | null>(null)
  const [planningStage, setPlanningStage] = useState(1) // 1-4
  const [actionPlan, setActionPlan] = useState<{
    actionId: number | null
    title: string
    description: string
    location: string
    participants: number
    budget: number
    timeline: number // em semanas
    goals: string[]
    resources: string[]
  }>({
    actionId: null,
    title: "",
    description: "",
    location: "",
    participants: 10,
    budget: 500,
    timeline: 4,
    goals: [],
    resources: [],
  })
  const [newGoal, setNewGoal] = useState("")
  const [newResource, setNewResource] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  // Atualizar o plano quando uma ação é selecionada
  useEffect(() => {
    if (selectedAction !== null) {
      const action = actionTypes.find((a) => a.id === selectedAction)
      if (action) {
        setActionPlan((prev) => ({
          ...prev,
          actionId: action.id,
          title: `${action.name} em `,
          description: action.description,
          resources: [...action.resources],
        }))
      }
    }
  }, [selectedAction])

  // Verificar se a lição foi completada
  useEffect(() => {
    if (planningStage === 4 && !isCompleted) {
      // Verificar se o plano está completo
      const isPlanComplete =
        actionPlan.actionId !== null &&
        actionPlan.title.trim() !== "" &&
        actionPlan.description.trim() !== "" &&
        actionPlan.location.trim() !== "" &&
        actionPlan.goals.length >= 2 &&
        actionPlan.resources.length >= 3

      if (isPlanComplete) {
        setIsCompleted(true)
        localStorage.setItem("lesson10Completed", "true")

        // Calcular pontuação final
        const finalScore = 80 + Math.min(20, actionPlan.goals.length * 5 + actionPlan.resources.length * 2)
        setScore(finalScore)

        toast({
          title: "Parabéns!",
          description: "Você criou um plano de ação comunitária completo!",
          variant: "default",
        })
      }
    }
  }, [planningStage, actionPlan, isCompleted])

  const handleActionSelect = (id: number) => {
    setSelectedAction(id)
    setPlanningStage(2)
  }

  const handleNextStage = () => {
    // Validar o estágio atual antes de avançar
    if (planningStage === 1 && selectedAction === null) {
      toast({
        title: "Selecione uma ação",
        description: "Você precisa escolher um tipo de ação comunitária para continuar.",
        variant: "destructive",
      })
      return
    }

    if (planningStage === 2) {
      if (actionPlan.title.trim() === "" || actionPlan.location.trim() === "") {
        toast({
          title: "Informações incompletas",
          description: "Preencha o título e o local da ação para continuar.",
          variant: "destructive",
        })
        return
      }
    }

    if (planningStage === 3) {
      if (actionPlan.goals.length === 0) {
        toast({
          title: "Defina pelo menos um objetivo",
          description: "Você precisa adicionar pelo menos um objetivo para sua ação.",
          variant: "destructive",
        })
        return
      }
    }

    if (planningStage < 4) {
      setPlanningStage((prev) => prev + 1)
    }
  }

  const handlePrevStage = () => {
    if (planningStage > 1) {
      setPlanningStage((prev) => prev - 1)
    }
  }

  const handleAddGoal = () => {
    if (newGoal.trim() === "") return

    setActionPlan((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal.trim()],
    }))
    setNewGoal("")
  }

  const handleRemoveGoal = (index: number) => {
    setActionPlan((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }))
  }

  const handleAddResource = () => {
    if (newResource.trim() === "") return

    setActionPlan((prev) => ({
      ...prev,
      resources: [...prev.resources, newResource.trim()],
    }))
    setNewResource("")
  }

  const handleRemoveResource = (index: number) => {
    setActionPlan((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }))
  }

  const handleReset = () => {
    setSelectedAction(null)
    setPlanningStage(1)
    setActionPlan({
      actionId: null,
      title: "",
      description: "",
      location: "",
      participants: 10,
      budget: 500,
      timeline: 4,
      goals: [],
      resources: [],
    })
    setIsCompleted(false)
    setScore(0)
  }

  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1:
        return "Fácil"
      case 2:
        return "Moderada"
      case 3:
        return "Desafiadora"
      case 4:
        return "Complexa"
      default:
        return "Desconhecida"
    }
  }

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1:
        return "text-green-600"
      case 2:
        return "text-blue-600"
      case 3:
        return "text-orange-600"
      case 4:
        return "text-red-600"
      default:
        return "text-gray-600"
    }
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
            <Users className="h-6 w-6" />
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
              <h2 className="text-2xl font-bold text-green-700">Lição 10: Ação Comunitária</h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                aria-label="Informações sobre ação comunitária"
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>

            {showInfo && (
              <div className="bg-green-50 p-4 rounded-lg mb-4 text-green-800">
                <h3 className="font-semibold mb-2">Sobre Ação Comunitária</h3>
                <p className="mb-2">
                  Ações comunitárias são iniciativas organizadas por grupos de pessoas para resolver problemas locais e
                  melhorar a qualidade de vida em suas comunidades.
                </p>
                <p>
                  Nesta atividade, você aprenderá a planejar uma ação comunitária voltada para questões ambientais,
                  definindo objetivos, recursos necessários e estratégias de implementação.
                </p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Estágio de Planejamento</span>
                <span className="text-sm font-medium">Etapa {planningStage} de 4</span>
              </div>
              <Progress value={(planningStage / 4) * 100} className="h-2" />
            </div>

            {planningStage === 1 && (
              <div>
                <h3 className="font-semibold mb-3 text-green-700">Escolha um tipo de ação comunitária</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {actionTypes.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionSelect(action.id)}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center text-center transition-all ${
                        selectedAction === action.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                      aria-label={`${action.name} - Dificuldade: ${getDifficultyText(action.difficulty)}`}
                    >
                      <span className="text-4xl mb-2" role="img" aria-hidden="true">
                        {action.icon}
                      </span>
                      <h4 className="font-medium mb-1">{action.name}</h4>
                      <p className={`text-xs ${getDifficultyColor(action.difficulty)}`}>
                        Dificuldade: {getDifficultyText(action.difficulty)}
                      </p>
                    </button>
                  ))}
                </div>

                {selectedAction !== null && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-700">
                      {actionTypes.find((a) => a.id === selectedAction)?.name}
                    </h4>
                    <p className="text-sm text-blue-600 mb-2">
                      {actionTypes.find((a) => a.id === selectedAction)?.description}
                    </p>
                    <p className="text-sm text-blue-600">
                      <strong>Impacto:</strong> {actionTypes.find((a) => a.id === selectedAction)?.impact}
                    </p>
                  </div>
                )}
              </div>
            )}

            {planningStage === 2 && (
              <div>
                <h3 className="font-semibold mb-3 text-green-700">Defina os detalhes básicos da ação</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Título da Ação
                    </label>
                    <Input
                      id="title"
                      value={actionPlan.title}
                      onChange={(e) => setActionPlan((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Mutirão de Limpeza na Praia Central"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-1">
                      Local
                    </label>
                    <Input
                      id="location"
                      value={actionPlan.location}
                      onChange={(e) => setActionPlan((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Ex: Praça Principal, Escola Municipal, etc."
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Descrição
                    </label>
                    <Textarea
                      id="description"
                      value={actionPlan.description}
                      onChange={(e) => setActionPlan((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva brevemente a ação e seus objetivos..."
                      className="w-full min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Número de Participantes: {actionPlan.participants}
                    </label>
                    <Slider
                      value={[actionPlan.participants]}
                      min={5}
                      max={100}
                      step={5}
                      onValueChange={(value) => setActionPlan((prev) => ({ ...prev, participants: value[0] }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {planningStage === 3 && (
              <div>
                <h3 className="font-semibold mb-3 text-green-700">Defina objetivos e metas</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Duração da Ação: {actionPlan.timeline} {actionPlan.timeline === 1 ? "semana" : "semanas"}
                    </label>
                    <Slider
                      value={[actionPlan.timeline]}
                      min={1}
                      max={12}
                      step={1}
                      onValueChange={(value) => setActionPlan((prev) => ({ ...prev, timeline: value[0] }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Orçamento Estimado: R$ {actionPlan.budget.toFixed(2)}
                    </label>
                    <Slider
                      value={[actionPlan.budget]}
                      min={100}
                      max={5000}
                      step={100}
                      onValueChange={(value) => setActionPlan((prev) => ({ ...prev, budget: value[0] }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="goals" className="block text-sm font-medium mb-1">
                      Objetivos Específicos
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        id="goals"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Ex: Coletar 100kg de resíduos"
                        className="flex-1"
                      />
                      <Button onClick={handleAddGoal} type="button">
                        <Plus className="h-4 w-4 mr-1" /> Adicionar
                      </Button>
                    </div>

                    <div className="space-y-2 mt-3">
                      {actionPlan.goals.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">Nenhum objetivo definido ainda.</p>
                      ) : (
                        actionPlan.goals.map((goal, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span>{goal}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveGoal(index)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {planningStage === 4 && (
              <div>
                <h3 className="font-semibold mb-3 text-green-700">Recursos e Implementação</h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="resources" className="block text-sm font-medium mb-1">
                      Recursos Necessários
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        id="resources"
                        value={newResource}
                        onChange={(e) => setNewResource(e.target.value)}
                        placeholder="Ex: Sacos de lixo, luvas, etc."
                        className="flex-1"
                      />
                      <Button onClick={handleAddResource} type="button">
                        <Plus className="h-4 w-4 mr-1" /> Adicionar
                      </Button>
                    </div>

                    <div className="space-y-2 mt-3">
                      {actionPlan.resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{resource}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveResource(index)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-green-700">Resumo do Plano de Ação</h4>

                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Título:</span> {actionPlan.title}
                      </div>
                      <div>
                        <span className="font-medium">Local:</span> {actionPlan.location}
                      </div>
                      <div>
                        <span className="font-medium">Participantes:</span> {actionPlan.participants} pessoas
                      </div>
                      <div>
                        <span className="font-medium">Duração:</span> {actionPlan.timeline}{" "}
                        {actionPlan.timeline === 1 ? "semana" : "semanas"}
                      </div>
                      <div>
                        <span className="font-medium">Orçamento:</span> R$ {actionPlan.budget.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium">Objetivos ({actionPlan.goals.length}):</span>
                        <ul className="list-disc list-inside ml-2 mt-1">
                          {actionPlan.goals.map((goal, index) => (
                            <li key={index} className="text-sm">
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      toast({
                        title: "Plano Salvo!",
                        description: "Seu plano de ação comunitária foi salvo com sucesso.",
                        variant: "default",
                      })
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" /> Finalizar Plano
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handlePrevStage} disabled={planningStage === 1}>
                Voltar
              </Button>

              <Button onClick={handleNextStage} disabled={planningStage === 4}>
                {planningStage < 4 ? "Próximo" : "Finalizar"}
              </Button>
            </div>

            {isCompleted && (
              <div className="mt-8 p-4 bg-green-100 rounded-lg border border-green-300 text-center">
                <h3 className="text-xl font-bold text-green-700 mb-2">Parabéns! Você completou a Lição 10</h3>
                <p className="mb-4">
                  Você aprendeu a planejar uma ação comunitária para resolver problemas ambientais locais.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={handleReset}>
                    Criar Novo Plano
                  </Button>
                  <Link href="/certificado">
                    <Button className="bg-green-600 hover:bg-green-700">Obter Certificado</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-green-700 mb-4">Dicas de Acessibilidade</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Use Tab para navegar entre os campos e Enter para confirmar.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Todos os controles deslizantes podem ser ajustados usando as teclas de seta.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>O resumo do plano é acessível para leitores de tela e possui estrutura semântica.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

