"use client"


import { useEffect, useRef, useState } from "react"
import {
  Leaf,
  Recycle,
  School,
  ArrowDownCircle,
  Sprout,
  Award,
  Users,
  Target,
  Heart,
  Zap,
  Sparkles,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Link } from "react-router-dom"

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero")
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({})
  const { scrollY } = useScroll()
  const [isLoaded, setIsLoaded] = useState(false)


  // Parallax effects
  const heroImageY = useTransform(scrollY, [0, 500], [0, 150])
  const heroTextY = useTransform(scrollY, [0, 500], [0, -50])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  // Scroll-triggered animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      Object.entries(sectionsRef.current).forEach(([key, section]) => {
        if (!section) return

        const sectionTop = section.offsetTop
        const sectionBottom = sectionTop + section.offsetHeight

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(key)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Page load animation
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const section = sectionsRef.current[sectionId]
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      })
    }
  }

  // Floating animation for cards
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  }

  const scrollToNextSection = () => {
    const sections = ["hero", "history", "mission", "impact", "team", "contact"]
    const currentIndex = sections.indexOf(activeSection)
    const nextIndex = (currentIndex + 1) % sections.length
    scrollToSection(sections[nextIndex])
  }

  const scrollToPrevSection = () => {
    const sections = ["hero", "history", "mission", "impact", "team", "contact"]
    const currentIndex = sections.indexOf(activeSection)
    const prevIndex = (currentIndex - 1 + sections.length) % sections.length
    scrollToSection(sections[prevIndex])
  }




  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 overflow-hidden">
      {/* Floating Navigation Dots with Integrated Buttons */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-4">
        {/* Up Button */}
        <motion.button
          onClick={scrollToPrevSection}
          className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-white bg-white/80 hover:bg-green-500 backdrop-blur-sm shadow-md mb-2 transition-all duration-300"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <ChevronUp className="w-4 h-4" />
        </motion.button>

        {/* navegações entre dots */}
        <div className="flex flex-col gap-4">
          {["hero", "history", "mission", "team", "contact"].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === section ? "bg-green-500 scale-150" : "bg-gray-300 hover:bg-green-300"
                }`}
              aria-label={`Scroll to ${section} section`}
            />
          ))}
        </div>

        {/* Down Button */}
        <motion.button
          onClick={scrollToNextSection}
          className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-white bg-white/80 hover:bg-green-500 backdrop-blur-sm shadow-md mt-2 transition-all duration-300"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Hero Section with Parallax Effect */}
      <motion.header
        ref={(el) => {
          sectionsRef.current.hero = el;
        }}
        
        className="relative h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            clipPath: "polygon(0% 0%, 100% 0, 100% 84%, 30% 94%, 0 57%)",
            y: heroImageY,
          }}
        >
          <motion.div
            className="absolute inset-0 transform scale-110"
            style={{
              backgroundImage:
                "url('https://th.bing.com/th/id/R.34fa1f8ef9b6536890a74dec53e5a689?rik=SXLJfUYR78WlxQ&pid=ImgRaw&r=0')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={{ filter: "brightness(0.1)", scale: 1.2 }}
            animate={{ filter: "brightness(0.3)", scale: 1.1 }}
            transition={{ duration: 2 }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-900/50 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
        </motion.div>

        <motion.div className="relative z-10 text-center px-4" style={{ y: heroTextY, opacity: heroOpacity }}>
          <motion.h1
            className="text-7xl font-bold text-green-400 mb-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            ECO<span className="text-white">viva</span>
          </motion.h1>

          <motion.p
            className="text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Transformando o futuro através da sustentabilidade e educação ambiental
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {["Inovação Verde", "Educação", "Sustentabilidade"].map((tag, index) => (
              <motion.span
                key={tag}
                className="px-6 py-2 bg-green-500/20 backdrop-blur-sm rounded-full text-white"
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(34, 197, 94, 0.4)",
                  boxShadow: "0 0 15px rgba(34, 197, 94, 0.6)",
                }}
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => scrollToSection("history")}
          >
            <ArrowDownCircle className="w-12 h-12 text-green-400 mx-auto cursor-pointer" />
          </motion.div>
        </motion.div>

        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-green-300/30"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
              }}
              animate={{
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </motion.header>

      {/* History Section with Staggered Animation */}
      <section
        ref={(el) => {
          sectionsRef.current.history = el;
        }}
        className="py-24 px-4 bg-white relative overflow-hidden"
      >

        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="max-w-6xl mx-auto relative">
          <motion.h2
            className="text-5xl font-bold text-green-800 text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Nossa História
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              {[
                {
                  icon: <Sprout className="w-12 h-12 text-green-500 mb-4" />,
                  title: "♻️ Por que incentivar a reciclagem?",
                  description:
                    "A ECOviva transforma a reciclagem em algo acessível, educativo e motivador dentro das escolas. Incentivar essa prática desde cedo é essencial para criar consciência ambiental real. Com pequenas ações e check-ins, mostramos que cada aluno pode fazer a diferença — juntos, construímos um futuro mais sustentável.",
                },
                {
                  icon: <Award className="w-12 h-12 text-green-500 mb-4" />,
                  title: "🌱 Como a ECOviva pode servir para você?",
                  description:
                    "A ECOviva é uma ferramenta feita para engajar alunos, facilitar a educação ambiental e gerar impacto real. Seja você educador, gestor ou estudante, ela ajuda a tornar a reciclagem algo prático, organizado e divertido dentro da escola.",
                },
                {
                  icon: <Target className="w-12 h-12 text-green-500 mb-4" />,
                  title: "🌍 Vamos juntos transformar o hoje para garantir o amanhã.",
                  description:
                    "A ECOviva não é só uma plataforma — é um movimento. Um passo concreto para tornar a educação mais consciente, participativa e sustentável. Ao incentivar pequenas atitudes, criamos grandes mudanças. 📣 Agora é a sua vez de fazer parte disso. Vamos juntos?",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-green-50 p-8 rounded-2xl hover:shadow-xl relative overflow-hidden group"
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <motion.div className="absolute -right-20 -bottom-20 w-40 h-40 bg-green-100 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                  <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
                    {item.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-green-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600 relative z-10">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div
                className="overflow-hidden shadow-2xl"
                style={{
                  clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 25% 100%, 0% 50%)",
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <motion.img
                  src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="ECOviva Impact"
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.2 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.5 }}
                  viewport={{ once: true }}
                />
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-10 -left-10 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                animate={floatingAnimation}
              >
                <Leaf className="w-10 h-10 text-green-500" />
              </motion.div>

              <motion.div
                className="absolute -bottom-5 -right-5 w-16 h-16 bg-green-200 rounded-full flex items-center justify-center"
                animate={{
                  y: [0, -15, 0],
                  transition: {
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 1,
                  },
                }}
              >
                <Recycle className="w-8 h-8 text-green-700" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section with 3D Card Effect */}
      <section
        ref={(el) => {
          sectionsRef.current.mission = el;
        }}
        
        className="py-24 px-4 bg-gradient-to-br from-green-800 to-green-900 relative"
      >
        <motion.div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-95"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />

        <div className="max-w-6xl mx-auto relative">
          <motion.h2
            className="text-5xl font-bold text-white text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Nossa Missão
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="w-12 h-12 text-green-500" />,
                title: "Sustentabilidade",
                description:
                  "Promovemos práticas sustentáveis e inovadoras para um futuro mais verde, desenvolvendo tecnologias que otimizam o processo de reciclagem.",
              },
              {
                icon: <School className="w-12 h-12 text-green-500" />,
                title: "Educação",
                description:
                  "Conscientizamos as novas gerações através de programas educacionais interativos e envolventes nas escolas.",
              },
              {
                icon: <Recycle className="w-12 h-12 text-green-500" />,
                title: "Inovação",
                description:
                  "Desenvolvemos soluções tecnológicas de ponta para tornar a reciclagem mais eficiente e acessível a todos.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 perspective group"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <motion.div className="transform-gpu transition-all duration-500 group-hover:rotate-y-10 group-hover:rotate-x-10">
                  <motion.div
                    className="mb-6 bg-white/10 w-20 h-20 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{item.title}</h3>
                  <p className="text-green-100">{item.description}</p>

                  <motion.div
                    className="w-full h-1 bg-gradient-to-r from-green-300 to-transparent mt-6 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                    viewport={{ once: true }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-green-300/40"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight + 500,
                opacity: 0,
              }}
              animate={{
                y: [null, -500],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </section>

      {/* Team Section with Hover Effects */}
      <section
        ref={(el) => {
          sectionsRef.current.team = el;
        }}
        
        className="py-24 px-4 bg-green-50 relative overflow-hidden"
      >
        {/* Background patterns */}
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-green-200 rounded-full"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative">
          <motion.h2
            className="text-5xl font-bold text-green-800 text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Nossa Equipe
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Users className="w-16 h-16 text-green-500" />,
                title: "Especialistas",
                description:
                  "Nossa equipe multidisciplinar reúne especialistas em tecnologia, educação e sustentabilidade.",
              },
              {
                icon: <Target className="w-16 h-16 text-green-500" />,
                title: "Comprometimento",
                description: "Dedicados a criar soluções inovadoras que impactam positivamente o meio ambiente.",
              },
              {
                icon: <Award className="w-16 h-16 text-green-500" />,
                title: "Reconhecimento",
                description: "Premiados por nossas iniciativas em sustentabilidade e inovação tecnológica.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-10 rounded-[2rem] relative overflow-hidden group"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <motion.div
                  className="absolute -right-20 -bottom-20 w-40 h-40 bg-green-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />

                <motion.div
                  className="mb-6 mx-auto w-fit relative z-10"
                  whileHover={{
                    rotate: 360,
                    scale: 1.2,
                    transition: { duration: 0.8 },
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-0 group-hover:opacity-70"
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />
                  {item.icon}
                </motion.div>

                <motion.h3
                  className="text-2xl font-bold text-green-800 mb-4 text-center relative z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  {item.title}
                </motion.h3>

                <motion.p
                  className="text-gray-600 text-center relative z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  {item.description}
                </motion.p>

                <motion.div
                  className="w-12 h-1 bg-green-500 mx-auto mt-6 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "3rem" }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  viewport={{ once: true }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section with Geometric Background and Animated Button */}
      <section
        ref={(el) => {
          sectionsRef.current.contact = el;
        }}
        
        className="py-24 px-4 bg-gradient-to-br from-green-800 to-green-900 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: `${Math.random() * 400 + 200}px`,
                  height: `${Math.random() * 400 + 200}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `translate(-50%, -50%) scale(${Math.random() + 0.5})`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.h2
            className="text-5xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Faça Parte da Mudança
          </motion.h2>

          <motion.p
            className="text-2xl text-green-100 mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Junte-se a nós nessa missão de criar um mundo mais sustentável
          </motion.p>
          <Link to="/CheckInPage">
            <motion.button
              className="bg-green-500 text-white px-12 py-6 rounded-full text-xl font-semibold relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
            >
              <motion.span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.span className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur opacity-30 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-pulse" />
              <motion.span className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.span className="relative z-10 flex items-center justify-center gap-2">
                Crie sua Conta Aqui
                <Sparkles className="w-5 h-5" />
              </motion.span>
            </motion.button>
          </Link>


          {/* Floating icons */}
          <motion.div
            className="absolute -top-10 -left-10 md:left-0 w-20 h-20 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            animate={floatingAnimation}
          >
            <Heart className="w-10 h-10 text-green-300" />
          </motion.div>

          <motion.div
            className="absolute -bottom-5 -right-5 md:right-0 w-16 h-16 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            animate={{
              y: [0, -15, 0],
              transition: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: 1,
              },
            }}
          >
            <Zap className="w-8 h-8 text-green-300" />
          </motion.div>
        </div>
      </section>
    </div>
  )
}

