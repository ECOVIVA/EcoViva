import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Leaf, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Espécies e seus habitats
const species = [
  {
    id: 1,
    name: "Onça-pintada",
    type: "animal",
    icon: "🐆",
    habitat: "floresta",
    description: "Maior felino das Américas, vive principalmente em florestas densas e áreas úmidas.",
  },
  {
    id: 2,
    name: "Arara-azul",
    type: "animal",
    icon: "🦜",
    habitat: "floresta",
    description: "Ave de grande porte com plumagem azul vibrante, habita florestas e se alimenta de sementes e nozes.",
  },
  {
    id: 3,
    name: "Peixe-boi",
    type: "animal",
    icon: "🐋",
    habitat: "agua-doce",
    description: "Mamífero aquático herbívoro que vive em rios e lagos de água doce.",
  },
  {
    id: 4,
    name: "Bromélia",
    type: "planta",
    icon: "🌺",
    habitat: "floresta",
    description: "Planta epífita que cresce sobre outras plantas, comum em florestas tropicais úmidas.",
  },
  {
    id: 5,
    name: "Cacto",
    type: "planta",
    icon: "🌵",
    habitat: "deserto",
    description: "Planta suculenta adaptada a ambientes áridos, armazena água em seu caule.",
  },
  {
    id: 6,
    name: "Lobo-guará",
    type: "animal",
    icon: "🐺",
    habitat: "cerrado",
    description: "Canídeo de pernas longas e pelagem avermelhada, habita áreas de vegetação aberta.",
  },
  {
    id: 7,
    name: "Coral",
    type: "animal",
    icon: "🪸",
    habitat: "oceano",
    description: "Organismo marinho que forma recifes, habitat vital para muitas espécies marinhas.",
  },
  {
    id: 8,
    name: "Alga Marinha",
    type: "planta",
    icon: "🌿",
    habitat: "oceano",
    description: "Organismo fotossintetizante que vive em ambientes marinhos, base da cadeia alimentar oceânica.",
  },
  {
    id: 9,
    name: "Vitória-régia",
    type: "planta",
    icon: "🪷",
    habitat: "agua-doce",
    description: "Planta aquática com folhas gigantes em forma de bandeja que flutuam na superfície da água.",
  },
  {
    id: 10,
    name: "Tamanduá-bandeira",
    type: "animal",
    icon: "🐜",
    habitat: "cerrado",
    description: "Mamífero com focinho alongado e língua pegajosa, especializado em comer formigas e cupins.",
  },
  {
    id: 11,
    name: "Tubarão",
    type: "animal",
    icon: "🦈",
    habitat: "oceano",
    description:
      "Predador marinho com esqueleto cartilaginoso, fundamental para o equilíbrio dos ecossistemas marinhos.",
  },
  {
    id: 12,
    name: "Ipê-amarelo",
    type: "planta",
    icon: "🌳",
    habitat: "cerrado",
    description: "Árvore com flores amarelas vibrantes, típica do cerrado brasileiro.",
  },
]

// Habitats
const habitats = [
  {
    id: "floresta",
    name: "Floresta Tropical",
    icon: "🌴",
    color: "bg-green-100 border-green-400",
    description: "Ecossistema com alta biodiversidade, caracterizado por árvores altas e densa vegetação.",
  },
  {
    id: "cerrado",
    name: "Cerrado",
    icon: "🌾",
    color: "bg-yellow-100 border-yellow-400",
    description: "Savana tropical com árvores esparsas, arbustos e gramíneas, sujeita a incêndios periódicos.",
  },
  {
    id: "deserto",
    name: "Deserto",
    icon: "🏜️",
    color: "bg-amber-100 border-amber-400",
    description: "Região árida com pouca precipitação, temperaturas extremas e vegetação adaptada à escassez de água.",
  },
  {
    id: "oceano",
    name: "Oceano",
    icon: "🌊",
    color: "bg-blue-100 border-blue-400",
    description: "Maior ecossistema do planeta, abriga uma enorme diversidade de vida marinha.",
  },
  {
    id: "agua-doce",
    name: "Água Doce",
    icon: "🏞️",
    color: "bg-cyan-100 border-cyan-400",
    description: "Ecossistemas de rios, lagos e pântanos, fundamentais para a biodiversidade e ciclo da água.",
  },
]

export default function Lesson8() {
  const [selectedSpecies, setSelectedSpecies] = useState<number | null>(null)
  const [selectedHabitat, setSelectedHabitat] = useState<string | null>(null)
  const [matches, setMatches] = useState<{ speciesId: number; habitatId: string }[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [showSpeciesInfo, setShowSpeciesInfo] = useState<number | null>(null)
  const [showHabitatInfo, setShowHabitatInfo] = useState<string | null>(null)

  // Verificar se a lição foi completada
  useEffect(() => {
    const correctMatches = matches.filter((match) => {
      const species = species.find((s) => s.id === match.speciesId)
      return species?.habitat === match.habitatId
    }).length

    // Lição completa quando tiver pelo menos 8 correspondências corretas
    if (correctMatches >= 8 && !isCompleted) {
      setIsCompleted(true)
      localStorage.setItem("lesson8Completed", "true")

      // Calcular pontuação final
      const finalScore = Math.round((correctMatches / species.length) * 100)
      setScore(finalScore)

      toast({
        title: "Parabéns!",
        description: `Você fez ${correctMatches} correspondências corretas!`,
        variant: "default",
      })
    }
  }, [matches, isCompleted])

  const handleSpeciesSelect = (id: number) => {
    setSelectedSpecies(id)
    setSelectedHabitat(null)
  }

  const handleHabitatSelect = (id: string) => {
    if (selectedSpecies !== null) {
      // Verificar se já existe uma correspondência para esta espécie
      const existingMatchIndex = matches.findIndex((match) => match.speciesId === selectedSpecies)

      if (existingMatchIndex !== -1) {
        // Substituir a correspondência existente
        const newMatches = [...matches]
        newMatches[existingMatchIndex] = { speciesId: selectedSpecies, habitatId: id }
        setMatches(newMatches)
      } else {
        // Adicionar nova correspondência
        setMatches([...matches, { speciesId: selectedSpecies, habitatId: id }])
      }

      // Verificar se a correspondência está correta
      const selectedSpeciesObj = species.find((s) => s.id === selectedSpecies)

      if (selectedSpeciesObj && selectedSpeciesObj.habitat === id) {
        setScore((prev) => prev + 10)
        toast({
          title: "Correspondência correta!",
          description: `${selectedSpeciesObj.name} realmente vive em ${habitats.find((h) => h.id === id)?.name}!`,
          variant: "default",
        })
      } else {
        toast({
          title: "Hmmm, não é bem assim...",
          description: "Esta não é a correspondência ideal. Tente novamente!",
          variant: "destructive",
        })
      }

      setSelectedSpecies(null)
    } else {
      setSelectedHabitat(id)
      setSelectedSpecies(null)
    }
  }

  const handleReset = () => {
    setMatches([])
    setSelectedSpecies(null)
    setSelectedHabitat(null)
    setIsCompleted(false)
    setScore(0)
  }

  const getHabitatForSpecies = (speciesId: number) => {
    const match = matches.find((m) => m.speciesId === speciesId)
    return match ? match.habitatId : null
  }

  const getSpeciesForHabitat = (habitatId: string) => {
    return matches.filter((m) => m.habitatId === habitatId).map((m) => m.speciesId)
  }

  const isCorrectMatch = (speciesId: number, habitatId: string) => {
    const speciesObj = species.find((s) => s.id === speciesId)
    return speciesObj?.habitat === habitatId
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
              <h2 className="text-2xl font-bold text-green-700">Lição 8: Biodiversidade</h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                aria-label="Informações sobre biodiversidade"
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>

            {showInfo && (
              <div className="bg-green-50 p-4 rounded-lg mb-4 text-green-800">
                <h3 className="font-semibold mb-2">Sobre Biodiversidade</h3>
                <p className="mb-2">
                  Biodiversidade refere-se à variedade de vida na Terra, incluindo a diversidade dentro das espécies,
                  entre espécies e dos ecossistemas.
                </p>
                <p>
                  Nesta atividade, você aprenderá sobre diferentes espécies e seus habitats naturais, compreendendo a
                  importância da preservação dos ecossistemas para manter a biodiversidade.
                </p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso</span>
                <span className="text-sm font-medium">
                  {matches.length} de {species.length} espécies classificadas
                </span>
              </div>
              <Progress value={(matches.length / species.length) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3 text-green-700">Espécies</h3>

                <div className="grid grid-cols-2 gap-3">
                  {species.map((s) => {
                    const habitatId = getHabitatForSpecies(s.id)
                    const habitat = habitatId ? habitats.find((h) => h.id === habitatId) : null
                    const isCorrect = habitatId ? isCorrectMatch(s.id, habitatId) : null

                    return (
                      <div key={s.id} className="relative">
                        <button
                          onClick={() => handleSpeciesSelect(s.id)}
                          className={`w-full p-3 rounded-lg border-2 flex items-center gap-2 transition-all ${
                            selectedSpecies === s.id
                              ? "ring-2 ring-green-500 bg-green-50"
                              : habitatId
                                ? isCorrect
                                  ? "bg-green-100 border-green-400"
                                  : "bg-red-100 border-red-400"
                                : "bg-gray-50 border-gray-200 hover:border-green-300"
                          }`}
                          aria-label={`${s.name} - ${s.type} - ${habitat ? "Classificado como " + habitat.name : "Não classificado"}`}
                        >
                          <span className="text-2xl" role="img" aria-hidden="true">
                            {s.icon}
                          </span>
                          <div className="text-left">
                            <div className="font-medium">{s.name}</div>
                            <div className="text-xs text-gray-600 capitalize">{s.type}</div>
                          </div>
                          {habitatId && (
                            <div className="ml-auto">
                              {isCorrect ? (
                                <Check className="h-5 w-5 text-green-600" />
                              ) : (
                                <X className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                          )}
                        </button>
                        <button
                          onClick={() => setShowSpeciesInfo(showSpeciesInfo === s.id ? null : s.id)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                          aria-label={`Informações sobre ${s.name}`}
                        >
                          i
                        </button>

                        {showSpeciesInfo === s.id && (
                          <div className="absolute z-10 top-full left-0 right-0 mt-1 p-2 bg-white rounded shadow-lg text-xs">
                            <p>{s.description}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-green-700">Habitats</h3>

                <div className="space-y-3">
                  {habitats.map((habitat) => {
                    const speciesIds = getSpeciesForHabitat(habitat.id)
                    const correctMatches = speciesIds.filter((id) => isCorrectMatch(id, habitat.id)).length

                    return (
                      <div key={habitat.id} className="relative">
                        <button
                          onClick={() => handleHabitatSelect(habitat.id)}
                          className={`w-full p-3 rounded-lg border-2 flex items-center gap-3 transition-all ${
                            selectedHabitat === habitat.id ? "ring-2 ring-green-500 " + habitat.color : habitat.color
                          }`}
                          aria-label={`${habitat.name} - ${speciesIds.length} espécies classificadas`}
                        >
                          <span className="text-3xl" role="img" aria-hidden="true">
                            {habitat.icon}
                          </span>
                          <div className="text-left flex-1">
                            <div className="font-medium">{habitat.name}</div>
                            <div className="text-xs text-gray-600">
                              {speciesIds.length} espécies ({correctMatches} corretas)
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {speciesIds.map((id) => {
                              const speciesObj = species.find((s) => s.id === id)
                              return (
                                <span
                                  key={id}
                                  className={`inline-flex items-center text-xs px-1 rounded ${
                                    isCorrectMatch(id, habitat.id) ? "bg-green-200" : "bg-red-200"
                                  }`}
                                >
                                  {speciesObj?.icon} {speciesObj?.name}
                                </span>
                              )
                            })}
                          </div>
                        </button>
                        <button
                          onClick={() => setShowHabitatInfo(showHabitatInfo === habitat.id ? null : habitat.id)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                          aria-label={`Informações sobre ${habitat.name}`}
                        >
                          i
                        </button>

                        {showHabitatInfo === habitat.id && (
                          <div className="absolute z-10 top-full left-0 right-0 mt-1 p-2 bg-white rounded shadow-lg text-xs">
                            <p>{habitat.description}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-700">Sabia que...</h4>
                  <p className="text-sm text-blue-600 mb-2">
                    O Brasil é um dos países com maior biodiversidade do mundo, abrigando cerca de 20% de todas as
                    espécies do planeta.
                  </p>
                  <p className="text-sm text-blue-600">
                    A preservação dos habitats naturais é fundamental para manter o equilíbrio dos ecossistemas e evitar
                    a extinção de espécies.
                  </p>
                </div>
              </div>
            </div>

            {isCompleted && (
              <div className="mt-8 p-4 bg-green-100 rounded-lg border border-green-300 text-center">
                <h3 className="text-xl font-bold text-green-700 mb-2">Parabéns! Você completou a Lição 8</h3>
                <p className="mb-4">
                  Você aprendeu sobre diferentes espécies e seus habitats naturais, compreendendo a importância da
                  biodiversidade.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={handleReset}>
                    Tentar Novamente
                  </Button>
                  <Link href="/licoes/9">
                    <Button className="bg-green-600 hover:bg-green-700">Avançar para Lição 9</Button>
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
                <span>Use Tab para navegar entre as espécies e habitats, e Enter para selecionar.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>O botão "i" fornece informações adicionais sobre cada espécie e habitat.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>
                  Todas as correspondências são indicadas tanto visualmente quanto em texto para leitores de tela.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

