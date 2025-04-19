"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Leaf, Recycle, Users, ArrowRight, BarChart } from "lucide-react"

const HomePage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const [motivationalPhrase, setMotivationalPhrase] = useState("")
  const [calculatorValues, setCalculatorValues] = useState({
    plastic: 0,
    paper: 0,
    glass: 0,
    metal: 0,
  })

  const featuresRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const impactRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Frases motivacionais sobre reciclagem
  const motivationalPhrases = [
    "Cada reciclagem é um passo para um planeta mais verde.",
    "Transforme hábitos, transforme o mundo.",
    "Pequenas ações diárias, grandes impactos globais.",
    "Reciclar hoje para respirar melhor amanhã.",
    "Seja a mudança que o planeta precisa.",
    "Um futuro sustentável começa com sua ação hoje.",
    "Junte-se à revolução verde. Recicle.",
    "Sua reciclagem de hoje é o ar puro de amanhã.",
    "Cada material reciclado é uma nova chance para a natureza.",
    "Plante sustentabilidade, colha um mundo melhor.",
  ]

  // Controla o efeito de scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)

    // Efeito de carregamento inicial com tempo maior
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 5000) // 5 segundos

    // Atualiza a frase motivacional a cada 5 segundos
    const phraseInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * motivationalPhrases.length)
      setMotivationalPhrase(motivationalPhrases[randomIndex])
    }, 5000)

    // Define a primeira frase imediatamente
    setMotivationalPhrase(motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)])

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
      clearInterval(phraseInterval)
    }
  }, [])

  // Efeito de parallax para o hero
  const heroParallaxStyle = {
    transform: `translateY(${scrollY * 0.4}px)`,
  }

  // Efeito de opacidade baseado no scroll
  const getOpacity = (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return 0

    const rect = ref.current.getBoundingClientRect()
    const windowHeight = window.innerHeight

    if (rect.top > windowHeight) return 0
    if (rect.bottom < 0) return 0

    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
    const visibleRatio = visibleHeight / rect.height

    return Math.min(visibleRatio * 1.5, 1)
  }

  // Calcula o impacto ambiental com base nos valores do calculador
  const calculateImpact = () => {
    const plasticImpact = calculatorValues.plastic * 0.5 // kg de CO2 economizado
    const paperImpact = calculatorValues.paper * 0.3
    const glassImpact = calculatorValues.glass * 0.4
    const metalImpact = calculatorValues.metal * 0.8

    const totalImpact = plasticImpact + paperImpact + glassImpact + metalImpact
    const treesEquivalent = totalImpact * 0.05 // Árvores equivalentes
    const waterSaved =
      calculatorValues.plastic * 3 +
      calculatorValues.paper * 10 +
      calculatorValues.glass * 0.5 +
      calculatorValues.metal * 2 // Litros de água economizados

    return {
      co2: totalImpact.toFixed(1),
      trees: treesEquivalent.toFixed(1),
      water: waterSaved.toFixed(0),
    }
  }

  const impact = calculateImpact()

  // Dados para as estatísticas

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Overlay de carregamento com partículas brancas subindo */}
      <div
        className={`fixed inset-0 bg-gradient-to-b from-green-900 to-green-700 z-50 flex flex-col items-center justify-center transition-opacity duration-1000 ${
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Partículas brancas subindo */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white/60 animate-float-up"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-10px`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDuration: `${Math.random() * 5 + 3}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}

        {/* Logo central simplificado */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-32 h-32 bg-green-600 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center">
              <Leaf className="h-16 w-16 text-white animate-grow" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mt-8 mb-2 animate-fade-in">EcoViva</h1>
          <p className="text-green-200 text-lg animate-fade-in animation-delay-300">Transformando o planeta juntos</p>

          {/* Barra de progresso */}
          <div className="w-64 h-2 bg-green-800/50 rounded-full mt-8 overflow-hidden">
            <div className="h-full bg-green-400 animate-progress rounded-full"></div>
          </div>
          <p className="text-green-200 mt-2 text-sm animate-pulse">Carregando experiência sustentável...</p>
        </div>
      </div>

      {/* Hero Section com efeito parallax */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')] bg-cover bg-center"
          style={heroParallaxStyle}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 to-green-600/70 backdrop-blur-sm"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`max-w-3xl mx-auto text-center transform transition-all duration-1000 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            <div className="inline-block p-3 bg-green-100 rounded-full mb-6 animate-bounce-slow">
              <Leaf className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight text-shadow-lg">
              <span className="block transform transition-transform hover:scale-105 duration-300">
                Transforme o Planeta
              </span>
              <span className="block transform transition-transform hover:scale-105 duration-300 delay-100">
                Com Cada Reciclagem
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed text-shadow-sm">
              Junte-se à comunidade EcoViva e faça parte da revolução sustentável. Registre suas reciclagens diárias e
              veja seu impacto crescer.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/CheckInPage"
                className="group px-10 py-4 bg-green-500 text-white rounded-full font-semibold text-lg hover:bg-green-400 transition-all duration-300 shadow-xl hover:shadow-green-400/50 transform hover:-translate-y-1 relative overflow-hidden"
              >
                <span className="relative z-10">Começar Agora</span>
                <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <a
                href="#about"
                className="group px-10 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/30 shadow-xl transform hover:-translate-y-1"
              >
                Saiba Mais
                <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Frase motivacional */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 w-auto max-w-md">
          <div className="flex items-center">
            <div className="bg-green-500/20 p-2 rounded-full mr-3">
              <Leaf className="h-5 w-5 text-green-300" />
            </div>
            <p className="text-white text-center text-sm sm:text-base font-medium animate-fade-phrase">
              {motivationalPhrase}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section com cards animados */}
      <section
        ref={featuresRef}
        className="py-24 bg-gradient-to-b from-white to-green-50"
        style={{ opacity: getOpacity(featuresRef) }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 transform transition-all duration-700">
            <h2 className="text-4xl font-bold text-green-800 mb-6 relative inline-block">
              Como Funciona
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-300 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            </h2>
            <p className="text-xl text-green-700 max-w-2xl mx-auto">
              Nossa plataforma torna fácil e divertido acompanhar seu impacto ambiental positivo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <Recycle className="h-10 w-10 text-green-600" />,
                title: "Recicle Diariamente",
                description:
                  "Separe seus resíduos e recicle-os corretamente. Cada pequena ação conta para um planeta mais limpo.",
                delay: "0",
              },
              {
                icon: <Leaf className="h-10 w-10 text-green-600" />,
                title: "Faça Check-in",
                description:
                  "Registre sua reciclagem diária na plataforma e veja sua bolha de impacto crescer com o tempo.",
                delay: "200",
              },
              {
                icon: <Users className="h-10 w-10 text-green-600" />,
                title: "Conecte-se",
                description:
                  "Participe do nosso fórum para compartilhar dicas, experiências e inspirar outros na jornada sustentável.",
                delay: "400",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-green-100 relative overflow-hidden"
                style={{ transitionDelay: `${feature.delay}ms` }}
              >
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-green-100 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-full flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-bold text-green-800 mb-4 text-center group-hover:text-green-600 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-green-700 text-center text-lg">{feature.description}</p>

                <div className="w-0 h-1 bg-gradient-to-r from-green-300 to-green-600 mt-6 mx-auto group-hover:w-1/2 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section com efeitos de revelação */}
      <section
        id="about"
        ref={aboutRef}
        className="py-32 bg-gradient-to-br from-green-800 to-green-900 text-white relative overflow-hidden"
        style={{ opacity: getOpacity(aboutRef) }}
      >
        {/* Círculos decorativos */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-700/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-700/30 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 transform transition-all duration-700 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

              <img
                src="https://cdn.pixabay.com/photo/2020/05/30/17/18/wind-power-plant-5239642_1280.jpg"
                alt="EcoViva Team"
                className="rounded-lg shadow-2xl transform group-hover:scale-105 transition-transform duration-500 relative z-10"
              />

              {/* Elementos decorativos */}
              <div className="absolute -top-5 -left-5 w-20 h-20 border-t-4 border-l-4 border-green-400 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
              <div className="absolute -bottom-5 -right-5 w-20 h-20 border-b-4 border-r-4 border-green-400 rounded-br-lg opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
            </div>

            <div className="md:w-1/2 transform transition-all duration-700">
              <h2 className="text-4xl font-bold text-green-300 mb-8 relative inline-block">
                Sobre a EcoViva
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-green-400"></div>
              </h2>

              <p className="text-green-100 mb-8 text-xl leading-relaxed">
                A EcoViva alem de uma equipe, alem de um projeto, alem de uma empresa baseada em sustentabilidade, ela é uma
                encentivação a sociedade atual que vem enfrentando varios problemas referente a educação ambiental.
              </p>

              <p className="text-green-100 mb-10 text-xl leading-relaxed">
               Por isso, Acreditamos que pequenas ações consistentes podem gerar um grande impacto. Por isso, desenvolvemos uma
                plataforma que torna a reciclagem uma atividade gratificante e mensurável.
              </p>

              <Link
                to="/HistorySection"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-1"
              >
                Saiba Mais
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Calculadora de Impacto Ambiental */}
      <section ref={impactRef} className="py-24 bg-white" style={{ opacity: getOpacity(impactRef) }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block p-2 bg-green-100 rounded-full mb-4">
              <BarChart className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold text-green-800 mb-6">Calcule Seu Impacto</h2>
            <p className="text-xl text-green-700 max-w-2xl mx-auto">
              Descubra quanto suas ações de reciclagem podem impactar positivamente o meio ambiente
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-green-50 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold text-green-800 mb-6">Quanto você recicla por mês?</h3>

                  <div className="space-y-6">
                    {[
                      { name: "plastic", label: "Plástico (kg)", icon: <Recycle /> },
                      { name: "paper", label: "Papel (kg)", icon: <Recycle /> },
                      { name: "glass", label: "Vidro (kg)", icon: <Recycle /> },
                      { name: "metal", label: "Metal (kg)", icon: <Recycle /> },
                    ].map((item) => (
                      <div key={item.name} className="space-y-2">
                        <label className="flex items-center text-green-800 font-medium">
                          <span className="mr-2">{item.icon}</span>
                          {item.label}
                        </label>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={calculatorValues[item.name as keyof typeof calculatorValues]}
                            onChange={(e) =>
                              setCalculatorValues({
                                ...calculatorValues,
                                [item.name]: Number.parseInt(e.target.value),
                              })
                            }
                            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="ml-3 w-12 text-center font-bold text-green-700">
                            {calculatorValues[item.name as keyof typeof calculatorValues]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:w-1/2 bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-2xl font-bold text-green-800 mb-6">Seu Impacto Mensal</h3>

                  <div className="space-y-8">
                    <div className="text-center p-4 bg-green-100 rounded-lg">
                      <div className="text-4xl font-bold text-green-700 mb-2">{impact.co2} kg</div>
                      <div className="text-green-600">CO₂ economizado</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-700 mb-2">{impact.trees}</div>
                        <div className="text-green-600">Árvores equivalentes</div>
                      </div>

                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-700 mb-2">{impact.water}L</div>
                        <div className="text-green-600">Água economizada</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section com efeito de gradiente animado */}
      <section ref={ctaRef} className="py-24 relative overflow-hidden" style={{ opacity: getOpacity(ctaRef) }}>
        {/* Fundo animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 animate-gradient-x"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white text-shadow-lg transform transition-all duration-700">
            Pronto para fazer a diferença?
          </h2>

          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90 text-shadow-sm transform transition-all duration-700 delay-100">
            Junte-se a milhares de pessoas comprometidas com um futuro mais sustentável. Cada check-in é um passo em
            direção a um planeta mais limpo.
          </p>

          <Link
            to="/CheckInPage"
            className="group px-10 py-5 bg-white text-green-600 rounded-full font-bold text-xl hover:bg-green-50 transition-all duration-300 shadow-2xl hover:shadow-white/30 inline-flex items-center transform hover:-translate-y-1 relative overflow-hidden"
          >
            <span className="relative z-10">Comece Sua Jornada</span>
            <ArrowRight className="ml-3 h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            <span className="absolute inset-0 bg-gradient-to-r from-white to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>

          {/* Decoração final */}
          <div className="mt-16 flex justify-center">
            <div className="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-full animate-pulse">
              <Leaf className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Estilos globais para animações */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes scroll-down {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(8px); opacity: 0; }
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes grow {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-phrase {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-5px);
          }
        }
        
        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          80% {
            width: 85%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        
        .animate-scroll-down {
          animation: scroll-down 1.5s infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        
        .text-shadow-sm {
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .text-shadow-lg {
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .animate-grow {
          animation: grow 2s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animate-progress {
          animation: progress 4s ease-in-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-fade-phrase {
          animation: fade-phrase 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default HomePage
