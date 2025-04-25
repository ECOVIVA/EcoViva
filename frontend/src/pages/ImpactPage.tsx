import React from "react"
import { useEffect, useState, useRef } from "react"
import {
  TreePine,
  Droplets,
  Wind,
  Bird,
  Factory,
  Recycle,
  Scale,
  Timer,
  BarChart4,
  CheckCircle2,
  ArrowRight,
  Globe,
  Sparkles,
  Heart,
  Lightbulb,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Leaf,
  Trash2,
  RecycleIcon,
} from "lucide-react"
import CreateAccount from "./CreateAccount"
import { Link } from "react-router-dom"

const FutureImpactPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({})
  const [pledgeCount] = useState(1458) // Starting pledge count
  const [hasPledged] = useState(false)
  const [activeTab, setActiveTab] = useState("plastic")
  const [activeVision, setActiveVision] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  // Modal states
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showGuideModal, setShowGuideModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [activeGuide, setActiveGuide] = useState(0)

  // Guide content
  const guides = [
    {
      title: "Compostagem Doméstica",
      icon: Leaf,
      description:
        "A compostagem doméstica é uma forma simples e eficaz de reciclar resíduos orgânicos e reduzir o lixo enviado para aterros sanitários.",
      steps: [
        "Separe restos de alimentos como cascas de frutas, legumes e borra de café",
        "Combine com materiais secos como folhas e papel picado",
        "Mantenha a composteira em local ventilado e revire periodicamente",
        "Em 3-6 meses, você terá um adubo rico em nutrientes para suas plantas",
      ],
      impact: "Cada 100kg de resíduos compostados evita a emissão de 50kg de CO₂ na atmosfera",
    },
    {
      title: "Reciclagem Criativa",
      icon: RecycleIcon,
      description:
        "A reciclagem criativa, ou upcycling, transforma materiais que seriam descartados em novos objetos de maior valor e utilidade.",
      steps: [
        "Identifique materiais com potencial como garrafas, latas e caixas",
        "Pesquise ideias de transformação ou crie suas próprias",
        "Utilize ferramentas simples como tesoura, cola e tinta",
        "Compartilhe suas criações e inspire outras pessoas",
      ],
      impact:
        "Além de reduzir resíduos, o upcycling economiza 95% da energia necessária para reciclar o mesmo material",
    },
    {
      title: "Redução de Resíduos Plásticos",
      icon: Trash2,
      description:
        "Reduzir o consumo de plásticos descartáveis é fundamental para proteger os ecossistemas, especialmente os oceanos.",
      steps: [
        "Substitua itens descartáveis por alternativas duráveis (garrafas, sacolas)",
        "Evite produtos com microplásticos como alguns cosméticos",
        "Prefira embalagens biodegradáveis ou recicláveis",
        "Participe de iniciativas de limpeza de praias e rios",
      ],
      impact: "Cada pessoa que reduz seu consumo de plástico evita cerca de 40kg de resíduos plásticos por ano",
    },
  ]

  // For the rotating visions of the future
  const futureVisions = [
    {
      icon: Globe,
      title: "Um Planeta Restaurado",
      description: "Ecossistemas recuperados e biodiversidade florescendo novamente",
    },
    {
      icon: Sparkles,
      title: "Ar e Água Limpos",
      description: "Redução drástica da poluição e melhoria da qualidade de vida",
    },
    {
      icon: Heart,
      title: "Comunidades Sustentáveis",
      description: "Cidades verdes com economia circular e zero desperdício",
    },
    {
      icon: Lightbulb,
      title: "Inovação Verde",
      description: "Tecnologias sustentáveis transformando nossa relação com o planeta",
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const handleVisibility = () => {
      const sections = document.querySelectorAll(".animate-on-scroll")
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const isVisible = rect.top <= window.innerHeight * 0.75
        setIsVisible((prev) => ({
          ...prev,
          [section.id]: isVisible,
        }))
      })
    }

    window.addEventListener("scroll", () => {
      handleScroll()
      handleVisibility()
    })
    handleVisibility() // Check initial visibility

    // Auto-rotate future visions
    const interval = setInterval(() => {
      setActiveVision((prev) => (prev + 1) % futureVisions.length)
    }, 5000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(interval)
    }
  }, [futureVisions.length])

  // Handle modal backdrop clicks
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowVideoModal(false)
      setShowGuideModal(false)
      setShowAccountModal(false)
    }
  }

  // Navigate through guides
  const nextGuide = () => {
    setActiveGuide((prev) => (prev + 1) % guides.length)
  }

  const prevGuide = () => {
    setActiveGuide((prev) => (prev - 1 + guides.length) % guides.length)
  }

  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.3}px)`,
  }

  const potentialImpactMetrics = [
    {
      icon: TreePine,
      value: "1.5M",
      label: "Árvores Preservadas até 2035",
      color: "from-green-400 to-green-600",
    },
    {
      icon: Recycle,
      value: "75K",
      label: "Toneladas Recicladas Anualmente",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: Droplets,
      value: "950M",
      label: "Litros de Água Economizados",
      color: "from-cyan-400 to-cyan-600",
    },
    {
      icon: Factory,
      value: "40%",
      label: "Redução de Emissões de CO₂",
      color: "from-amber-400 to-amber-600",
    },
  ]

  const futureEcosystems = [
    {
      title: "Florestas Tropicais",
      icon: TreePine,
      description: "Potencial de preservação de mais de 1000 hectares de mata nativa",
      impact: "Proteção de 300+ espécies endêmicas",
    },
    {
      title: "Recursos Hídricos",
      icon: Droplets,
      description: "Conservação e recuperação de bacias hidrográficas",
      impact: "Recuperação de 50+ nascentes até 2035",
    },
    {
      title: "Qualidade do Ar",
      icon: Wind,
      description: "Redução significativa da poluição atmosférica",
      impact: "Equivalente a 25.000 carros fora das ruas",
    },
    {
      title: "Biodiversidade",
      icon: Bird,
      description: "Proteção e recuperação da fauna e flora local",
      impact: "Aumento de 60% na população de espécies ameaçadas",
    },
  ]

  const recyclingGuides = {
    plastic: {
      title: "Plásticos",
      description: "Plásticos podem levar até 450 anos para se decompor na natureza.",
      steps: [
        "Lave embalagens para remover resíduos",
        "Separe por tipo (PET, PEAD, PVC, etc.)",
        "Compacte para economizar espaço",
        "Descarte em pontos de coleta seletiva",
      ],
      impact: "Cada tonelada de plástico reciclado economiza 5,774 kWh de energia",
    },
    paper: {
      title: "Papel e Papelão",
      description: "Reciclar papel reduz o desmatamento e economiza água.",
      steps: [
        "Remova fitas adesivas, grampos e plásticos",
        "Mantenha seco e limpo",
        "Dobre caixas para economizar espaço",
        "Separe por tipo (jornal, revista, papelão)",
      ],
      impact: "Cada tonelada de papel reciclado poupa 22 árvores",
    },
    glass: {
      title: "Vidro",
      description: "O vidro é 100% reciclável e pode ser reciclado infinitamente.",
      steps: [
        "Lave para remover resíduos",
        "Remova tampas e rótulos quando possível",
        "Separe por cor (transparente, verde, âmbar)",
        "Cuidado com vidros quebrados",
      ],
      impact: "Reciclar vidro reduz a poluição do ar em 20% e da água em 50%",
    },
    metal: {
      title: "Metal",
      description: "Metais como alumínio e aço são altamente recicláveis.",
      steps: [
        "Lave latas e embalagens",
        "Compacte para economizar espaço",
        "Separe por tipo (alumínio, aço)",
        "Remova rótulos quando possível",
      ],
      impact: "Reciclar alumínio usa 95% menos energia que produzi-lo do zero",
    },
  }

  const handlePledge = () => {
    if (!hasPledged) {
      setShowAccountModal(true)
    }
  }


  const VideoIntro: React.FC = () => {
    return <video src="../../public/EcoVivavideo.mp4" autoPlay loop muted playsInline className="w-full h-auto object-cover" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white overflow-hidden">
      {/* Minimalist Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Simple background with subtle overlay */}
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80')] bg-cover bg-center"
          style={parallaxStyle}
        >
          <div className="absolute inset-0 bg-green-900/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fadeInUp">O Futuro que Podemos Criar</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto animate-fadeInUp-delayed mb-12">
            Se começarmos a reciclar hoje, até 2035 podemos transformar nosso planeta em um lugar melhor para todos
          </p>
        </div>

        {/* Simple scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <ChevronDown className="h-10 w-10 text-white" />
        </div>
      </section>

      {/* Vision 2035 */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-green-800 mb-6 relative inline-block">
              Visão 2035: Um Mundo Transformado
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-700">
              Se todos começarmos a reciclar consistentemente hoje, até 2035 poderemos criar um impacto ambiental
              positivo sem precedentes. A reciclagem não é apenas uma escolha, é um compromisso com as futuras gerações
              e com a saúde do nosso planeta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-3xl p-8 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                  <div className="bg-green-200 p-3 rounded-full">
                    <Timer className="h-6 w-6 text-green-700" />
                  </div>
                  <span>Tempo é Essencial</span>
                </h3>
              </div>
              <p className="text-green-700">
                Temos apenas 11 anos até 2035. Cada dia de ação conta para reverter os danos ambientais e criar um
                futuro sustentável para as próximas gerações.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-3xl p-8 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                  <div className="bg-green-200 p-3 rounded-full">
                    <BarChart4 className="h-6 w-6 text-green-700" />
                  </div>
                  <span>Impacto Exponencial</span>
                </h3>
              </div>
              <p className="text-green-700">
                Quanto mais pessoas reciclam, maior o impacto. Se 50% da população adotar práticas de reciclagem,
                podemos reduzir as emissões de carbono em até 40% até 2035.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-3xl p-8 shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                  <div className="bg-green-200 p-3 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-700" />
                  </div>
                  <span>Ações Simples, Grande Impacto</span>
                </h3>
              </div>
              <p className="text-green-700">
                Pequenas mudanças nos hábitos diários, como separar corretamente os resíduos, podem resultar em uma
                transformação ambiental significativa a longo prazo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision Showcase */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-green-100 to-green-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>

        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-6">
            Visões do Futuro Sustentável
          </h2>
          <p className="text-center text-green-700 max-w-3xl mx-auto mb-16">
            Veja como será o mundo em 2035 se todos nos comprometermos com a reciclagem e práticas sustentáveis
          </p>

          <div className="max-w-5xl mx-auto">
            {/* Vision Showcase */}
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
              {/* Vision content */}
              <div className="min-h-[400px] md:min-h-[500px] p-8 md:p-12 flex flex-col md:flex-row items-center">
                {/* Vision image/icon */}
                <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
                  <div className="relative">
                    <div className="relative bg-gradient-to-br from-green-100 to-green-200 p-12 rounded-full shadow-xl">
                      {React.createElement(futureVisions[activeVision].icon, {
                        className: "h-32 w-32 text-green-600",
                        strokeWidth: 1.5,
                      })}
                    </div>
                  </div>
                </div>

                {/* Vision text */}
                <div className="w-full md:w-1/2 md:pl-8">
                  <div className="animate-fadeIn">
                    <h3 className="text-3xl font-bold text-green-800 mb-6">{futureVisions[activeVision].title}</h3>
                    <p className="text-xl text-gray-700 mb-8">{futureVisions[activeVision].description}</p>

                    {/* Impact metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      {potentialImpactMetrics.slice(0, 2).map((metric, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`bg-gradient-to-br ${metric.color} p-3 rounded-full text-white`}>
                            <metric.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-bold text-green-800">{metric.value}</div>
                            <div className="text-xs text-gray-600">{metric.label.split(" ")[0]}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vision navigation */}
              <div className="bg-green-50 p-4 flex justify-center">
                <div className="flex space-x-2">
                  {futureVisions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveVision(idx)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeVision === idx ? "bg-green-600 w-6" : "bg-green-300"
                      }`}
                      aria-label={`Ver visão ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Additional metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12">
              {potentialImpactMetrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="animate-on-scroll"
                  id={`future-metric-${index}`}
                  style={{
                    animation: isVisible[`future-metric-${index}`]
                      ? `fadeInUp 0.6s ease-out ${index * 0.2}s forwards`
                      : "none",
                    opacity: isVisible[`future-metric-${index}`] ? 1 : 0,
                  }}
                >
                  <div className="bg-white rounded-2xl p-6 text-center transform transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-xl">
                    <div
                      className={`bg-gradient-to-br ${metric.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white`}
                    >
                      <metric.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-1">{metric.value}</h3>
                    <p className="text-green-600 text-sm">{metric.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Future Ecosystems - Enhanced with better transitions */}
      <section className="py-20 bg-gradient-to-r from-green-900 to-green-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80')] bg-cover bg-center"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-6">Ecossistemas que Podemos Salvar</h2>
          <p className="text-center text-green-100 max-w-3xl mx-auto mb-16">
            Com práticas de reciclagem consistentes até 2035, podemos proteger e restaurar ecossistemas vitais para o
            equilíbrio do nosso planeta.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {futureEcosystems.map((eco, index) => (
              <div
                key={eco.title}
                className="animate-on-scroll"
                id={`future-eco-${index}`}
                style={{
                  animation: isVisible[`future-eco-${index}`]
                    ? `slideInRight 0.6s ease-out ${index * 0.2}s forwards`
                    : "none",
                  opacity: isVisible[`future-eco-${index}`] ? 1 : 0,
                }}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 transition-all duration-500 hover:bg-white/20 hover:scale-[1.03] hover:shadow-xl">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-500/20 p-4 rounded-2xl">
                      <eco.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">{eco.title}</h3>
                      <p className="text-green-100 mb-4">{eco.description}</p>
                      <div className="flex items-center space-x-2 text-green-300">
                        <Scale className="h-5 w-5" />
                        <span>{eco.impact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recycling Guide - Enhanced with better transitions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-6">Guia Prático de Reciclagem</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16">
            Aprenda como reciclar corretamente diferentes materiais e entenda o impacto positivo que cada ação pode ter
            no nosso futuro.
          </p>

          <div className="max-w-4xl mx-auto">
            {/* Custom Tabs - Enhanced */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-center bg-green-50 rounded-full p-2">
                {Object.keys(recyclingGuides).map((key) => (
                  <button
                    key={key}
                    className={`px-6 py-3 font-medium text-sm rounded-full transition-all duration-300 ${
                      activeTab === key
                        ? "bg-green-600 text-white shadow-md transform scale-105"
                        : "text-green-700 hover:bg-green-100"
                    }`}
                    onClick={() => setActiveTab(key)}
                  >
                    {recyclingGuides[key as keyof typeof recyclingGuides].title}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content - Enhanced */}
            <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 animate-fadeIn transition-all duration-500">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-green-800 mb-2">
                  {recyclingGuides[activeTab as keyof typeof recyclingGuides].title}
                </h3>
                <p className="text-gray-600">
                  {recyclingGuides[activeTab as keyof typeof recyclingGuides].description}
                </p>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold text-green-700 mb-4">Como Reciclar:</h4>
                <ul className="space-y-4">
                  {recyclingGuides[activeTab as keyof typeof recyclingGuides].steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 transition-all duration-300 hover:translate-x-2">
                      <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 pt-1">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl">
                <h4 className="font-semibold text-green-800 mb-3">Impacto Ambiental:</h4>
                <p className="text-green-700">{recyclingGuides[activeTab as keyof typeof recyclingGuides].impact}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline to 2035 - Enhanced with better transitions */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-16">Linha do Tempo até 2035</h2>

          <div className="max-w-4xl mx-auto relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-300 via-green-500 to-green-700 rounded-full"></div>

            {/* Timeline items */}
            <div className="space-y-24 relative">
              {/* 2025 */}
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3 w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 border-4 border-white z-10 shadow-lg"></div>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold text-green-700 mb-1">2025</h3>
                    <p className="text-gray-600">Aumento de 20% na taxa global de reciclagem</p>
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <div className="bg-white p-6 rounded-3xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                      <h4 className="font-semibold text-green-800 mb-2">Primeiros Resultados</h4>
                      <p>Redução de 10% na poluição dos oceanos e início da recuperação de ecossistemas marinhos.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2030 */}
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-700 border-4 border-white z-10 shadow-lg"></div>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                    <div className="bg-white p-6 rounded-3xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                      <h4 className="font-semibold text-green-800 mb-2">Transformação Visível</h4>
                      <p>
                        Recuperação significativa de habitats naturais e redução de 25% nas emissões de gases de efeito
                        estufa.
                      </p>
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <h3 className="text-2xl font-bold text-green-700 mb-1">2030</h3>
                    <p className="text-gray-600">Economia circular implementada em 50% das indústrias globais</p>
                  </div>
                </div>
              </div>

              {/* 2035 */}
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3 w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-green-800 border-4 border-white z-10 shadow-lg"></div>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold text-green-700 mb-1">2035</h3>
                    <p className="text-gray-600">Meta de 80% de reciclagem global alcançada</p>
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <div className="bg-white p-6 rounded-3xl shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                      <h4 className="font-semibold text-green-800 mb-2">Um Novo Mundo</h4>
                      <p>
                        Redução de 40% nas emissões globais, recuperação de ecossistemas críticos e melhoria
                        significativa na qualidade de vida global.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pledge Section - Enhanced with better transitions */}
      <section className="py-20 bg-gradient-to-b from-green-900 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div
            className="animate-on-scroll"
            id="pledge"
            style={{
              animation: isVisible["pledge"] ? "fadeInUp 0.6s ease-out forwards" : "none",
              opacity: isVisible["pledge"] ? 1 : 0,
            }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Faça Seu Compromisso</h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
              Junte-se a {pledgeCount.toLocaleString()} pessoas que já se comprometeram a reciclar regularmente e
              contribuir para um futuro sustentável até 2035.
            </p>

            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-105">
              <h3 className="text-2xl font-semibold mb-6">Eu me comprometo a:</h3>
              <div className="space-y-4 text-left mb-8">
                <div className="flex items-start gap-3 transition-all duration-300 hover:translate-x-2">
                  <CheckCircle2 className="h-6 w-6 text-green-300 flex-shrink-0 mt-0.5" />
                  <p>Separar corretamente meus resíduos recicláveis</p>
                </div>
                <div className="flex items-start gap-3 transition-all duration-300 hover:translate-x-2">
                  <CheckCircle2 className="h-6 w-6 text-green-300 flex-shrink-0 mt-0.5" />
                  <p>Reduzir meu consumo de produtos descartáveis</p>
                </div>
                <div className="flex items-start gap-3 transition-all duration-300 hover:translate-x-2">
                  <CheckCircle2 className="h-6 w-6 text-green-300 flex-shrink-0 mt-0.5" />
                  <p>Incentivar amigos e familiares a adotarem práticas sustentáveis</p>
                </div>
              </div>

              <button
                onClick={handlePledge}
                disabled={hasPledged}
                className={`w-full px-6 py-4 rounded-full font-medium transition-all duration-500 ${
                  hasPledged
                    ? "bg-green-600 hover:bg-green-600 cursor-not-allowed"
                    : "bg-white text-green-800 hover:bg-green-100 hover:scale-105 hover:shadow-lg"
                }`}
              >
                {hasPledged ? "Compromisso Registrado!" : "Fazer Meu Compromisso"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Resources - Enhanced with better transitions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-16">Recursos Educacionais</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 overflow-hidden group">
              <div className="bg-gradient-to-br from-green-400 to-green-600 h-3 w-full group-hover:h-5 transition-all duration-300"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-green-700">Guias Práticos</h3>
                <p className="text-gray-600 mb-4">Aprenda técnicas eficientes de reciclagem para o dia a dia</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <span>Compostagem doméstica</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <span>Reciclagem criativa</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                    <span>Redução de resíduos plásticos</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowGuideModal(true)}
                  className="w-full px-4 py-2 bg-white border-2 border-green-600 text-green-600 rounded-full hover:bg-green-50 transition-all duration-300 transform hover:scale-105"
                >
                  Acessar Guias
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 overflow-hidden group">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 h-3 w-full group-hover:h-5 transition-all duration-300"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-blue-700">Vídeos Educativos</h3>
                <p className="text-gray-600 mb-4">Conteúdo visual para entender o impacto da reciclagem</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <span>O ciclo de vida dos materiais</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <span>Impacto da reciclagem nos oceanos</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                    <span>Tecnologias de reciclagem do futuro</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="w-full px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                >
                  Assistir Vídeos
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 overflow-hidden group">
              <div className="bg-gradient-to-br from-amber-400 to-amber-600 h-3 w-full group-hover:h-5 transition-all duration-300"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-amber-700">Ferramentas Interativas</h3>
                <p className="text-gray-600 mb-4">Recursos digitais para aprender enquanto se diverte</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                    <ArrowRight className="h-4 w-4 text-amber-600" />
                    <span>Calculadora de pegada ecológica</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                    <ArrowRight className="h-4 w-4 text-amber-600" />
                    <span>Quiz sobre sustentabilidade</span>
                  </li>
                  <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                    <ArrowRight className="h-4 w-4 text-amber-600" />
                    <span>Simulador de impacto ambiental</span>
                  </li>
                </ul>
                <Link to="/ECOstudy">
                <button className="  w-full px-4 py-2 bg-white border-2 border-amber-600 text-amber-600 rounded-full hover:bg-amber-50 transition-all duration-300 transform hover:scale-105">
                  Explorar Ferramentas
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action - Enhanced with better transitions */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">O Futuro Está em Nossas Mãos</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-10">
            Cada gesto de reciclagem hoje é um passo em direção a um 2035 mais verde e sustentável. Não é apenas sobre
            preservar o planeta para nós, mas garantir um lar saudável para as próximas gerações.
          </p>
          <button className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500 hover:scale-105">
            Comece Sua Jornada Sustentável Agora
          </button>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl animate-fadeIn border border-green-200 relative">
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <Leaf className="w-full h-full text-green-600" strokeWidth={0.5} />
            </div>
            <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
              <Recycle className="w-full h-full text-green-600" strokeWidth={0.5} />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-green-100">
              <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                <div className="bg-green-100 p-1.5 rounded-full">
                  <Play className="h-4 w-4 text-green-600" />
                </div>
                <span>EcoViva: Impacto da Reciclagem</span>
              </h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 rounded-full hover:bg-green-100 transition-colors"
              ></button>
            </div>

            {/* Conteúdo */}
            <div className="p-6 md:p-8">
              <div className="relative aspect-video bg-green-900/10 rounded-xl overflow-hidden shadow-inner mb-6">
                <video controls autoPlay className="w-full h-full rounded-xl">
                  <source src="../../public/EcoVivavideo.mp4" type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>

              {/* Mensagem de ajuda para o vídeo */}
              <div className="text-center mb-4">
                <a
                  href="https://www.youtube.com/watch?v=7k2G6gbqpzo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Não está conseguindo ver o vídeo? Clique aqui!</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-external-link"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>

              {/* Informações adicionais */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg text-green-800 mb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    <span>Impacto Global</span>
                  </h4>
                  <p className="text-gray-600 text-sm md:text-base">
                    Este vídeo explora como diferentes materiais percorrem seu ciclo de vida e como a reciclagem pode
                    reduzir significativamente o impacto ambiental, economizando recursos naturais e protegendo
                    ecossistemas vitais para o equilíbrio do planeta.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">#Reciclagem</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">#MeioAmbiente</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">#Sustentabilidade</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-green-100 bg-green-50">
              <button
                onClick={() => setShowVideoModal(false)}
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Fechar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guide Modal with Carousel */}
      {showGuideModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl animate-fadeIn border border-green-200 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <Leaf className="w-full h-full text-green-600" strokeWidth={0.5} />
            </div>
            <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
              <Recycle className="w-full h-full text-green-600" strokeWidth={0.5} />
            </div>

            <div className="flex justify-between items-center p-4 border-b border-green-100">
              <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                <div className="bg-green-100 p-1.5 rounded-full">
                  {React.createElement(guides[activeGuide].icon, { className: "h-4 w-4 text-green-600" })}
                </div>
                <span>EcoViva: Guias Práticos</span>
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-2 rounded-full hover:bg-green-100 transition-colors"
              ></button>
            </div>

            {/* Carousel */}
            <div className="relative">
              {/* Guide Content */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="w-full md:w-1/3 flex justify-center">
                    <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 md:p-8 rounded-full shadow-md">
                      {React.createElement(guides[activeGuide].icon, {
                        className: "h-16 w-16 md:h-20 md:w-20 text-green-600",
                        strokeWidth: 1.5,
                      })}
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <h4 className="text-xl md:text-2xl font-bold text-green-800 mb-3 md:mb-4">
                      {guides[activeGuide].title}
                    </h4>
                    <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base">{guides[activeGuide].description}</p>

                    <h5 className="font-semibold text-green-700 mb-2 md:mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Como fazer:</span>
                    </h5>
                    <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                      {guides[activeGuide].steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 md:gap-3 text-sm md:text-base">
                          <div className="bg-green-200 text-green-800 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 md:p-4 rounded-lg">
                      <h5 className="font-semibold text-green-800 mb-1 md:mb-2 flex items-center gap-2">
                        <Scale className="h-4 w-4 text-green-600" />
                        <span>Impacto:</span>
                      </h5>
                      <p className="text-green-700 text-sm md:text-base">{guides[activeGuide].impact}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between p-4 border-t border-green-100 bg-green-50">
                <div className="flex items-center gap-2">
                  {guides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveGuide(idx)}
                      className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all duration-300 ${
                        activeGuide === idx ? "bg-green-600 w-4 md:w-6" : "bg-green-300"
                      }`}
                      aria-label={`Ver guia ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prevGuide}
                    className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-green-700" />
                  </button>
                  <button
                    onClick={nextGuide}
                    className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-green-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Creation Modal */}
      {showAccountModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowAccountModal(false)}
        >
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl animate-fadeIn border border-green-200 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <Leaf className="w-full h-full text-green-600" strokeWidth={0.5} />
            </div>
            <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
              <Recycle className="w-full h-full text-green-600" strokeWidth={0.5} />
            </div>

            <div className="flex justify-between items-center p-4 border-b border-green-100">
              <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                <div className="bg-green-100 p-1.5 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <span>Crie uma Conta para Continuar</span>
              </h3>
              <button
                onClick={() => setShowAccountModal(false)}
                className="p-2 rounded-full hover:bg-green-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
                <h4 className="font-semibold text-green-800 mb-2">Benefícios da sua conta EcoViva:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Ganhe pontos a cada check-in diário com atividades de reciclagem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Suba no ranking e compare seu progresso com outros usuários</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Desbloqueie recompensas exclusivas e certificados de impacto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Acompanhe seu impacto ambiental acumulado ao longo do tempo</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col space-y-4 mb-6">
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="group px-10 py-3 bg-green-500 text-white rounded-full font-semibold text-lg hover:bg-green-400 transition-all duration-300 shadow-xl hover:shadow-green-400/50 transform hover:-translate-y-1 relative overflow-hidden mx-auto"
                >
                  <span className="relative z-10">Faça login aqui</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>

                <button
                  onClick={CreateAccount}
                  className="group px-10 py-3 bg-green-500 text-white rounded-full font-semibold text-lg hover:bg-green-700 transition-all duration-300 shadow-xl hover:shadow-green-500/50 transform hover:-translate-y-1 relative overflow-hidden mx-auto"
                >
                  <span className="relative z-10">Crie sua conta aqui!</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>Para fazer seu compromisso com o planeta, você precisa ter uma conta.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom styles for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-fadeInUp-delayed {
          animation: fadeInUp 0.8s ease-out 0.2s forwards;
        }
        
        /* Improve responsiveness */
        @media (max-width: 640px) {
          .container {
            padding-left: 16px;
            padding-right: 16px;
          }
          
          h1 {
            font-size: 2.5rem;
          }
          
          h2 {
            font-size: 2rem;
          }
        }

        .text-shadow {
          text-shadow: 0 1px 3px rgba(0,0,0,0.8);
        }

        @media (max-width: 640px) {
          .fixed.inset-0.flex {
            align-items: flex-start;
            padding-top: 2rem;
            padding-bottom: 2rem;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  )
}

export default FutureImpactPage
