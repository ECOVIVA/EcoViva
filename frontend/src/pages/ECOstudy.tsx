"use client"

import { useState, useEffect } from "react"
import { Book, Leaf, TreePine, Recycle, Wind, Sprout, Fish, ArrowDownCircle } from "lucide-react"
import Lesson1 from "../components/Lessons/Lesson1"
import Lesson2 from "../components/Lessons/Lesson2"
import Lesson3 from "../components/Lessons/Lesson3"
import Lesson4 from "../components/Lessons/Lesson4"
// import Lesson5 from "../components/Lessons/Lesson5"
import Lesson6 from "../components/Lessons/Lesson6"
import Lesson7 from "../components/Lessons/Lesson7"
import Lesson8 from "../components//Lessons/Lesson8"
import ParticleBackground from "../components/particle-background"
import { Link } from 'react-router-dom';
import { motion } from "framer-motion"

const App = () => {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [animatedItems, setAnimatedItems] = useState<number[]>([])

  useEffect(() => {
    // Simulating loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      // Animate items one by one with a delay
      const animationInterval = setInterval(() => {
        setAnimatedItems((prev) => {
          if (prev.length >= lessons.length) {
            clearInterval(animationInterval)
            return prev
          }
          return [...prev, prev.length]
        })
      }, 150)

      return () => clearInterval(animationInterval)
    }
  }, [isLoading])

  const lessons = [
    {
      id: 1,
      title: "Reciclagem Básica",
      icon: <Recycle className="w-10 h-10" />,
      description:
        "Aprenda os fundamentos da separação de resíduos e como implementar um sistema eficiente em sua casa. Descubra o impacto positivo que pequenas mudanças podem trazer ao meio ambiente.",
      difficulty: "Iniciante",
      duration: "20 min",
      background: "from-green-400 to-emerald-600",
      topics: ["Separação", "Redução", "Reuso"],
    },
    {
      id: 2,
      title: "Jogo da Memória Reciclável",
      icon: <Leaf className="w-10 h-10" />,
      description:
        "Teste sua memória enquanto aprende sobre os diferentes materiais recicláveis e seus processos. Esta atividade interativa combina diversão com conhecimento ambiental.",
      difficulty: "Iniciante",
      duration: "15 min",
      background: "from-blue-400 to-cyan-600",
      topics: ["Materiais", "Jogos", "Aprendizado"],
    },
    {
      id: 3,
      title: "Compostagem Básica",
      icon: <Sprout className="w-10 h-10" />,
      description:
        "Aprenda a transformar resíduos orgânicos em adubo natural para suas plantas. Descubra técnicas de compostagem adequadas para diferentes espaços, desde apartamentos até jardins.",
      difficulty: "Intermediário",
      duration: "2 min",
      background: "from-yellow-400 to-amber-600",
      topics: ["Adubo", "Orgânicos", "Jardim"],
    },
    {
      id: 4,
      title: "Economia de Agua",
      icon: <Fish className="w-10 h-10" />,
      description:
        "Compreenda a importância da conservação da água para a saúde do planeta. Explore as diversas maneiras em que o uso responsável dos recursos hídricos contribui para o equilíbrio ambiental.",
      difficulty: "Intermediário",
      duration: "2 min",
      background: "from-sky-400 to-blue-600",
      topics: ["Consumo médio diário", "Agua"],
    },
    {
      id: 5,
      title: "Agricultura Sustentável",
      icon: <Sprout className="w-10 h-10" />,
      description:
        "Práticas agrícolas eco-friendly que preservam o solo e reduzem o impacto ambiental. Aprenda sobre permacultura, agroflorestas e técnicas de cultivo orgânico.",
      difficulty: "Avançado",
      duration: "35 min",
      background: "from-lime-400 to-green-600",
      topics: ["Permacultura", "Orgânicos", "Regeneração"],
    },
    {
      id: 6,
      title: "Energia Renovavel",
      icon: <Wind className="w-10 h-10" />,
      description:
        "Entenda a importância da energia renovável para a saúde do planeta. Descubra como fontes limpas de energia, como solar e eólica, contribuem para um futuro sustentável e equilibrado.",
      difficulty: "Intermediário",
      duration: "1 min",
      background: "from-sky-400 to-blue-600",
      topics: ["Conecte", "Escolhas", "Conservação"],
    },
    {
      id: 7,
      title: "Consumo Consciente e Sustentável",
      icon: <TreePine className="w-10 h-10" />,
      description:
        "Adote o consumo consciente e sustentável para preservar os recursos naturais do planeta. Cada escolha de compra impacta o meio ambiente e contribui para um futuro mais equilibrado e ecológico.",
      difficulty: "Avançado",
      duration: "2-4 min",
      background: "from-emerald-400 to-teal-600",
      topics: ["Compra Conciente", "Preservação", "Reciclagem"],
    },
    {
      id: 8,
      title: "Qualidade do Ar",
      icon: <Wind className="w-10 h-10" />,
      description:
        "Monitoramento e preservação do ar que respiramos. Compreenda as fontes de poluição atmosférica e as soluções para melhorar a qualidade do ar em ambientes urbanos.",
      difficulty: "Intermediário",
      duration: "25 min",
      background: "from-cyan-400 to-sky-600",
      topics: ["Poluição", "Saúde", "Urbano"],
    },
    {
      id: 9,
      title: "Botânica Básica",
      icon: <Leaf className="w-10 h-10" />,
      description:
        "Introdução ao mundo das plantas e sua diversidade fascinante. Aprenda sobre os diferentes tipos de plantas, suas estruturas e funções ecológicas.",
      difficulty: "Iniciante",
      duration: "20 min",
      background: "from-teal-400 to-emerald-600",
      topics: ["Plantas", "Fotossíntese", "Taxonomia"],
    },
    {
      id: 10,
      title: "Literatura Ambiental",
      icon: <Book className="w-10 h-10" />,
      description:
        "Obras essenciais sobre meio ambiente que expandirão seu conhecimento e consciência ecológica. Descubra autores e livros que inspiraram o movimento ambientalista.",
      difficulty: "Iniciante",
      duration: "15 min",
      background: "from-indigo-400 to-violet-600",
      topics: ["Livros", "Autores", "Filosofia"],
    },
  ]

  if (selectedLesson === 1) {
    return <Lesson1 onBack={() => setSelectedLesson(null)} />
  }

  if (selectedLesson === 2) {
    return <Lesson2 onBack={() => setSelectedLesson(null)} />
  }

  if (selectedLesson === 3) {
    return <Lesson3 onBack={() => setSelectedLesson(null)} />
  }

  if (selectedLesson === 4) {
    return <Lesson4 onBack={() => setSelectedLesson(null)} />
  }

  if (selectedLesson === 5) {
    // @ts-ignore
    return <Lesson5 onBack={() => setSelectedLesson(null)} />
  }

  if (selectedLesson === 6) {
    return <Lesson6 onBack={() => setSelectedLesson(null)} />
  }
  if (selectedLesson === 7) {
    // @ts-ignore
    return <Lesson7 onBack={() => setSelectedLesson(null)} />
  }
  if (selectedLesson === 8) {
    // @ts-ignore
    return <Lesson8 onBack={() => setSelectedLesson(null)} />
  }

  function scrollToSection(arg0: string): void {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-emerald-50 to-teal-50">
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-green-700 to-emerald-600 z-50">
          <div className="text-center text-white">
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="w-20 h-20 animate-pulse" />
              </div>
              <div className="absolute inset-0 border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-3xl font-bold">EcoStudy</h2>
            <p className="mt-2 text-green-200">Conectando você com a natureza...</p>
          </div>
        </div>
      ) : (
        <>
          <header className="relative bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 text-white py-32 px-8 md:px-16 overflow-hidden">
            {/* Particle background */}
            <div className="absolute inset-0 overflow-hidden">
              <ParticleBackground />

              {/* Light rays */}
              <div className="absolute inset-0 bg-gradient-radial from-green-400/20 via-transparent to-transparent -top-1/5 -left-1/5 w-[140%] h-[140%]"></div>

              {/* Organic shapes */}
              <div className="absolute -right-10 -top-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -left-20 -bottom-40 w-[30rem] h-[30rem] bg-emerald-400/10 rounded-full blur-3xl"></div>
              <div className="absolute right-1/4 bottom-5 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl"></div>

              {/* Honeycomb pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <pattern
                  id="honeycomb"
                  x="0"
                  y="0"
                  width="40"
                  height="70"
                  patternUnits="userSpaceOnUse"
                  patternTransform="scale(2) rotate(30)"
                >
                  <path
                    d="M0,35 l20,0 l10,-17.5 l-10,-17.5 l-20,0 l-10,17.5 z"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#honeycomb)" />
              </svg>
            </div>

            <div className="container mx-auto relative z-10">
              <div className="flex flex-col items-center justify-center gap-3 mb-8">
                <div className="p-5 bg-white/20 rounded-full backdrop-blur-sm shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300">
                  <Leaf className="h-16 w-16 drop-shadow-lg animate-pulse" />
                </div>
                <h1 className="text-5xl sm:text-6xl font-extrabold mt-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-green-100 drop-shadow-md">
                  EcoStudy
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full mt-2"></div>
              </div>
              <p className="text-center text-xl text-green-50 max-w-3xl mx-auto leading-relaxed backdrop-blur-sm bg-black/5 p-4 rounded-xl">
                Explore o mundo fascinante da sustentabilidade através de lições interativas e envolventes. Descubra
                como pequenas ações podem gerar um grande impacto positivo para nosso planeta.
              </p>
              <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            whileHover={{ scale: 1.2 }}
          >
            <ArrowDownCircle className="w-12 h-52 text-green-400 mx-auto cursor-pointer" />
          </motion.div>
            </div>
          </header>

          <main className="container mx-auto px-4 sm:px-6 py-16">
            <div className="mb-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-green-800 mb-4">Nossas Lições Ambientais</h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Mergulhe em tópicos fascinantes sobre meio ambiente e sustentabilidade através de nossas lições
                cuidadosamente elaboradas para inspirar e educar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {lessons.map((lesson, index) => {
                const isComingSoon = lesson.id === 9 || lesson.id === 10

                return (
                  <div
                    key={lesson.id}
                    onClick={() => !isComingSoon && setSelectedLesson(lesson.id)}
                    className={`group relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${isComingSoon ? "cursor-default" : "cursor-pointer"
                      } ${animatedItems.includes(index) ? "animate-fade-in opacity-100" : "opacity-0"}`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${lesson.background} opacity-95`} />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                    {/* Decorative elements */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full"></div>
                    <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full"></div>

                    {/* Blur overlay for coming soon lessons */}
                    {isComingSoon && (
                      <div className="absolute inset-0 backdrop-blur-sm bg-black/20 z-10 flex flex-col items-center justify-center">
                        <div className="bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm text-white font-bold text-lg shadow-lg">
                          Em breve
                        </div>
                      </div>
                    )}

                    <div className="relative p-6 sm:p-8 text-white h-full flex flex-col">
                      <div className="flex items-start justify-between mb-6">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm transform transition-transform duration-300 group-hover:rotate-3 shadow-lg">
                          {lesson.icon}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className="text-sm font-medium bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm shadow-md">
                            {lesson.difficulty}
                          </span>
                          <span className="text-sm bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm shadow-md">
                            {lesson.duration}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold mb-3 group-hover:underline decoration-2 underline-offset-4 transition-all">
                        {lesson.title}
                      </h3>

                      <p className="text-white/90 mb-6 flex-grow text-sm sm:text-base">{lesson.description}</p>

                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {lesson.topics.map((topic, i) => (
                            <span key={i} className="text-xs bg-white/10 px-3 py-1 rounded-full shadow-sm">
                              {topic}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm text-sm shadow-md">
                            {lesson.id <= 8 ? "Disponível" : "Em breve"}
                          </div>

                          <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300 shadow-md">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </main>

          <section className="bg-gradient-to-r from-green-700 to-emerald-600 py-20 px-6 text-white relative overflow-hidden">
            {/* Add particle background to this section too */}
            <ParticleBackground className="opacity-50" />

            <div className="container mx-auto text-center relative z-10">
              {/* Decorative elements */}
              <div className="absolute -right-20 top-0 w-64 h-64 bg-white/5 rounded-full"></div>
              <div className="absolute -left-20 bottom-0 w-80 h-80 bg-white/5 rounded-full"></div>

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Junte-se à Nossa Missão Ecológica</h2>
                <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-10 text-green-50">
                  Acreditamos que a educação ambiental é o primeiro passo para um mundo mais sustentável. Explore nossas
                  lições e comece sua jornada ecológica hoje.
                </p>
                <Link to="/CheckInPage">
                  <button className="bg-white text-green-700 hover:bg-green-100 px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                    Começar Agora
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default App
