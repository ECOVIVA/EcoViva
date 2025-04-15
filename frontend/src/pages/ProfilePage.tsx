"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import {
  Leaf,
  Edit2,
  Save,
  Award,
  Camera,
  ImageIcon,
  Trophy,
  Target,
  Users,
  Droplets,
  Recycle,
  Star,
  Sparkles,
  Wind,
  Sun,
  CloudRain,
  Zap,
} from "lucide-react"
import { z } from "zod"
import api from "../services/API/axios"
import routes from "../services/API/routes"

const profileSchema = z.object({
  bio: z.string().min(10, "Bio deve ter pelo menos 10 caracteres"),
  profileImage: z.instanceof(File).optional().or(z.string()),
  backgroundImage: z.instanceof(File).optional().or(z.string()),
})

function App() {
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState("")
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150")
  const [backgroundImage, setBackgroundImage] = useState(
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format",
  )
  const [error, setError] = useState("")
  const [userName, setUserName] = useState("")
  const [ecoProgress, setEcoProgress] = useState(0)
  const [rank, setRank] = useState({
    title: "Iniciante Verde",
    level: "Easy",
    points: 100,
    nextLevel: 150,
  })
  const [showBubbles, setShowBubbles] = useState(false)
  const progressBarRef = useRef(null)
  const progressControls = useAnimation()
  const [windowWidth, setWindowWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "Primeiro Plantio",
      description: "Plantou sua primeira árvore e contribuiu para um mundo mais verde",
      icon: "Leaf",
      date: "10/03/2023",
      completed: true,
      color: "green",
    },
    {
      id: 2,
      title: "Economizador de Água",
      description: "Economizou 100 litros de água através de práticas sustentáveis",
      icon: "Droplets",
      date: "15/04/2023",
      completed: true,
      color: "blue",
    },
    {
      id: 3,
      title: "Reciclador Iniciante",
      description: "Reciclou 50kg de materiais, reduzindo o impacto ambiental",
      icon: "Recycle",
      date: "22/05/2023",
      completed: true,
      color: "teal",
    },
    {
      id: 4,
      title: "Influenciador Verde",
      description: "Convenceu 5 amigos a adotar práticas sustentáveis em seu dia a dia",
      icon: "Users",
      date: "30/06/2023",
      completed: false,
      color: "purple",
    },
    {
      id: 5,
      title: "Energia Renovável",
      description: "Começou a utilizar fontes de energia renovável em sua residência",
      icon: "Zap",
      date: "05/07/2023",
      completed: true,
      color: "yellow",
    },
    {
      id: 6,
      title: "Coletor de Chuva",
      description: "Implementou sistema de coleta de água da chuva para reuso",
      icon: "CloudRain",
      date: "",
      completed: false,
      color: "cyan",
    },
  ])

  // Handle responsive layout detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setWindowWidth(width)
      setIsMobile(width < 640)
      setIsTablet(width >= 640 && width < 1024)
      setIsDesktop(width >= 1024)
    }

    // Set initial values
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get(routes.user.profile)
        const data = response.data

        setUserName(data.username || "Usuário")
        setBio(data.bio || "")

        if (data.photo) {
          const fullProfileUrl = `http://localhost:8000${data.photo}`
          setProfileImage(fullProfileUrl)
          localStorage.setItem("profileImage", fullProfileUrl)
        } else {
          const storedProfileImage = localStorage.getItem("profileImage")
          if (storedProfileImage) setProfileImage(storedProfileImage)
        }

        if (data.backgroundImage) {
          const fullBgUrl = `http://localhost:8000${data.backgroundImage}`
          setBackgroundImage(fullBgUrl)
          localStorage.setItem("backgroundImage", fullBgUrl)
        } else {
          const storedBackgroundImage = localStorage.getItem("backgroundImage")
          if (storedBackgroundImage) setBackgroundImage(storedBackgroundImage)
        }

        const currentPoints = data.rank?.points || 0
        const nextLevelPoints = data.rank?.difficulty?.points_for_activity || 1000
        const progress = Math.round((currentPoints / nextLevelPoints) * 100)
        setEcoProgress(progress)

        setRank({
          title: data.rank?.title || "Sem título",
          level: data.rank?.difficulty?.name || "Bronze",
          points: currentPoints,
          nextLevel: nextLevelPoints,
        })

        // Simulating achievements data from API
        if (data.achievements) {
          setAchievements(data.achievements)
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err)
        setError("Não foi possível carregar o perfil.")
      }
    }

    fetchProfile()

    // Start animations after a delay
    const timer = setTimeout(() => {
      setShowBubbles(true)
      progressControls.start({ width: `${ecoProgress}%` })
    }, 800)

    return () => clearTimeout(timer)
  }, [ecoProgress, progressControls])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "background") => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)

    if (type === "profile") {
      setProfileImage(imageUrl)
    } else {
      setBackgroundImage(imageUrl)
    }

    const uploadedPhotoUrl = await uploadPhotoToServer(file, type)
    if (uploadedPhotoUrl) {
      if (type === "profile") {
        setProfileImage(uploadedPhotoUrl)
        localStorage.setItem("profileImage", uploadedPhotoUrl)
      } else {
        setBackgroundImage(uploadedPhotoUrl)
        localStorage.setItem("backgroundImage", uploadedPhotoUrl)
      }
    }
  }

  async function uploadPhotoToServer(photo: File, type: "profile" | "background") {
    try {
      const formData = new FormData()
      if (type === "profile") {
        formData.append("photo", photo)
      } else {
        formData.append("backgroundImage", photo)
      }

      const response = await api.patch(routes.user.update, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const key = type === "profile" ? "photo" : "backgroundImage"
      const serverPath = response.data[key]
      if (!serverPath) throw new Error("Caminho de imagem inválido no retorno")

      return `http://localhost:8000${serverPath}`
    } catch (err) {
      console.error("Erro ao enviar foto:", err)
      setError("Erro ao enviar foto para o servidor.")
      return null
    }
  }

  const handleSave = async () => {
    try {
      profileSchema.parse({ bio, profileImage, backgroundImage })

      await api.patch(routes.user.update, { bio })

      setIsEditing(false)
      setError("")
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else {
        console.error("Erro ao salvar perfil:", err)
        setError("Erro ao salvar as alterações.")
      }
    }
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Leaf":
        return <Leaf size={24} />
      case "Droplets":
        return <Droplets size={24} />
      case "Recycle":
        return <Recycle size={24} />
      case "Users":
        return <Users size={24} />
      case "Zap":
        return <Zap size={24} />
      case "CloudRain":
        return <CloudRain size={24} />
      default:
        return <Star size={24} />
    }
  }

  const getColorClass = (color: string, completed: boolean) => {
    if (!completed) return "bg-gray-100 text-gray-400"

    switch (color) {
      case "green":
        return "bg-gradient-to-br from-green-50 to-emerald-100 text-emerald-600 border-emerald-200"
      case "blue":
        return "bg-gradient-to-br from-blue-50 to-sky-100 text-blue-600 border-blue-200"
      case "teal":
        return "bg-gradient-to-br from-teal-50 to-cyan-100 text-teal-600 border-teal-200"
      case "purple":
        return "bg-gradient-to-br from-purple-50 to-violet-100 text-purple-600 border-purple-200"
      case "yellow":
        return "bg-gradient-to-br from-yellow-50 to-amber-100 text-amber-600 border-amber-200"
      case "cyan":
        return "bg-gradient-to-br from-cyan-50 to-sky-100 text-cyan-600 border-cyan-200"
      default:
        return "bg-gradient-to-br from-green-50 to-emerald-100 text-emerald-600 border-emerald-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-teal-100 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        layout
      >
        {/* Background with parallax effect */}
        <div className="relative">
          <motion.div
            className="relative bg-gradient-to-r from-emerald-500 to-green-400 overflow-hidden group"
            initial={{ height: 0 }}
            animate={{
              height: isMobile ? 180 : isTablet ? 220 : 256,
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
            }}
            layout
          >
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ delay: 0.3, duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />

            {/* Animated nature elements */}
            <motion.div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-white/20"
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                    opacity: 0,
                  }}
                  animate={{
                    y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                    opacity: [0.1, 0.3, 0.1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 15 + Math.random() * 20,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 5,
                  }}
                >
                  {i % 5 === 0 ? (
                    <Leaf size={i % 2 === 0 ? 24 : 16} />
                  ) : i % 5 === 1 ? (
                    <Wind size={i % 2 === 0 ? 24 : 16} />
                  ) : i % 5 === 2 ? (
                    <Sun size={i % 2 === 0 ? 24 : 16} />
                  ) : i % 5 === 3 ? (
                    <CloudRain size={i % 2 === 0 ? 24 : 16} />
                  ) : (
                    <Sparkles size={i % 2 === 0 ? 24 : 16} />
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="text-white" size={24} />
                  <label className="cursor-pointer px-4 py-2 bg-white/90 rounded-full text-sm font-medium hover:bg-white/100 transition-colors">
                    Escolher Imagem de Fundo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "background")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </motion.div>

          {/* Profile image with glow effect - CENTERED */}
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="absolute left-1/2 transform -translate-x-1/2 -ml-4 z-10"
            style={{
              top: isMobile ? "130px" : isTablet ? "170px" : "200px",
            }}
            layout
          >
            <div className="relative group">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-green-300 via-emerald-400 to-teal-300 blur-lg opacity-70 group-hover:opacity-100 transition-opacity"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              ></motion.div>
              <div className="relative">
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                />
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="text-white" size={24} />
                      <label className="cursor-pointer px-3 py-1 bg-white/90 rounded-full text-sm font-medium hover:bg-white/100 transition-colors">
                        Escolher Foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "profile")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div className="pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6 md:px-10 pb-10" layout>
          <motion.div className="flex flex-col items-center text-center mb-8" layout>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center"
              layout
            >
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2"
                layout
              >
                {userName}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
                >
                  <Leaf className="text-green-500" />
                </motion.div>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-2 mt-2 flex-wrap justify-center"
                layout
              >
                <Award className="text-yellow-500" size={20} />
                <span className="text-sm font-medium text-gray-600">{rank.title}</span>
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-yellow-200">
                  Nível {rank.level}
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 max-w-lg text-center"
              layout
            >
              {isEditing ? (
                <div className="mb-4">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-green-50"
                    placeholder="Atualize sua bio"
                  />
                </div>
              ) : (
                <p className="text-md font-medium text-gray-700 italic">{bio || "Bio não atualizada"}</p>
              )}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full hover:from-emerald-600 hover:to-green-600 transition-all shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
              {isEditing ? "Salvar Perfil" : "Editar Perfil"}
            </motion.button>
          </motion.div>

          {/* Eco Progress Section with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mt-10 bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-2xl border border-green-100 shadow-sm"
            layout
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <motion.h3 className="text-xl font-bold text-gray-800 flex items-center gap-2" layout>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                  }}
                >
                  <Target className="text-emerald-500" size={24} />
                </motion.div>
                Progresso Ecológico
              </motion.h3>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.8, type: "spring" }}
                className="px-4 py-1.5 bg-gradient-to-r from-green-100 to-emerald-200 rounded-full text-emerald-700 font-bold text-lg border border-green-200 shadow-sm self-start sm:self-auto"
                layout
              >
                {ecoProgress}%
              </motion.div>
            </div>

            <div className="h-10 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full overflow-hidden relative border border-gray-200 shadow-inner">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-[radial-gradient(circle,_#22c55e_1px,_transparent_1px)] bg-[length:8px_8px]"></div>
              </div>

              {/* Progress bar with animated gradient */}
              <motion.div
                ref={progressBarRef}
                initial={{ width: "0%" }}
                animate={progressControls}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                }}
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  background: "linear-gradient(90deg, #34d399 0%, #10b981 50%, #059669 100%)",
                  backgroundSize: "200% 100%",
                }}
              >
                {/* Animated bubbles */}
                <AnimatePresence>
                  {showBubbles && (
                    <>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute rounded-full bg-white/30"
                          initial={{
                            width: `${8 + Math.random() * 12}px`,
                            height: `${8 + Math.random() * 12}px`,
                            x: `${Math.random() * 100}%`,
                            y: "100%",
                            opacity: 0,
                          }}
                          animate={{
                            y: [40, -20],
                            opacity: [0, 0.7, 0],
                            scale: [0.8, 1.2, 0.9],
                          }}
                          transition={{
                            duration: 2 + Math.random() * 3,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: Math.random() * 5,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                {/* Multiple shimmer effects */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 0.5,
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 0.2,
                    delay: 0.5,
                  }}
                />
              </motion.div>

              {/* Milestone markers */}
              <div className="absolute inset-0 flex items-center">
                {[25, 50, 75].map((milestone) => (
                  <div
                    key={milestone}
                    className={`absolute h-full flex flex-col items-center justify-center ${
                      ecoProgress >= milestone ? "text-white" : "text-gray-400"
                    }`}
                    style={{ left: `${milestone}%` }}
                  >
                    <div className={`h-10 w-0.5 ${ecoProgress >= milestone ? "bg-white/30" : "bg-gray-300/30"}`}></div>
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 ${
                        ecoProgress >= milestone ? "bg-white/80 border-white" : "bg-gray-200 border-gray-300"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mt-2 px-1">
              <span className="font-medium">0</span>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="flex items-center gap-1.5"
              >
                <span className="font-semibold text-emerald-700">{rank.points}</span>
                <span>/</span>
                <span>{rank.nextLevel}</span>
                <span className="text-xs text-gray-500">pontos</span>
              </motion.div>
            </div>

            {/* Level progression - Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
              className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm text-gray-600"
              layout
            >
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-300 to-emerald-400"></div>
                <span>Iniciante</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                <span>Intermediário</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600"></div>
                <span>Avançado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-700"></div>
                <span>Expert</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Achievements Section with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 }}
            className="mt-12"
            layout
          >
            <motion.h3 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6" layout>
              <motion.div
                animate={{
                  rotate: [0, 15, 0, -15, 0],
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 4,
                }}
              >
                <Trophy className="text-yellow-500" size={28} />
              </motion.div>
              Conquistas Ambientais
            </motion.h3>

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5" layout>
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 2.6 + index * 0.15,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  }}
                  className={`p-4 sm:p-5 rounded-xl border ${
                    achievement.completed
                      ? getColorClass(achievement.color, true)
                      : "bg-gray-50 border-gray-200 opacity-70"
                  } transition-all duration-300 relative overflow-hidden`}
                  layout
                >
                  {/* Background pattern */}
                  {achievement.completed && (
                    <div className="absolute inset-0 opacity-10">
                      <div className="w-full h-full bg-[radial-gradient(circle,_#000000_1px,_transparent_1px)] bg-[length:12px_12px]"></div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 sm:gap-4 relative z-10">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 sm:p-3 rounded-full ${
                        achievement.completed
                          ? `bg-white/80 shadow-md ${
                              achievement.color === "green"
                                ? "text-emerald-600"
                                : achievement.color === "blue"
                                  ? "text-blue-600"
                                  : achievement.color === "teal"
                                    ? "text-teal-600"
                                    : achievement.color === "purple"
                                      ? "text-purple-600"
                                      : achievement.color === "yellow"
                                        ? "text-amber-600"
                                        : achievement.color === "cyan"
                                          ? "text-cyan-600"
                                          : "text-emerald-600"
                            }`
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {getIconComponent(achievement.icon)}
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-base sm:text-lg text-gray-800">{achievement.title}</h4>
                        {achievement.completed && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 3 + index * 0.1 }}
                            className={`px-2 py-0.5 ${
                              achievement.color === "green"
                                ? "bg-green-100 text-green-700"
                                : achievement.color === "blue"
                                  ? "bg-blue-100 text-blue-700"
                                  : achievement.color === "teal"
                                    ? "bg-teal-100 text-teal-700"
                                    : achievement.color === "purple"
                                      ? "bg-purple-100 text-purple-700"
                                      : achievement.color === "yellow"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : achievement.color === "cyan"
                                          ? "bg-cyan-100 text-cyan-700"
                                          : "bg-green-100 text-green-700"
                            } text-xs font-semibold rounded-full`}
                          >
                            Concluído
                          </motion.span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1.5">{achievement.description}</p>
                      {achievement.completed && (
                        <div className="flex items-center gap-2 mt-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "auto" }}
                            transition={{ delay: 3.2 + index * 0.1 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs bg-black/5 px-2 py-1 rounded-md whitespace-nowrap">
                              Conquistado em {achievement.date}
                            </p>
                          </motion.div>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 3.4 + index * 0.1 }}
                          >
                            <Sparkles size={14} className="text-yellow-500" />
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Decorative elements for completed achievements */}
                  {achievement.completed && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 3.5 + index * 0.1 }}
                        className="absolute -bottom-2 -right-2 w-16 sm:w-20 h-16 sm:h-20 opacity-10"
                      >
                        {getIconComponent(achievement.icon)}
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 3.6 + index * 0.1 }}
                        className="absolute top-2 right-2"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            achievement.color === "green"
                              ? "bg-green-400"
                              : achievement.color === "blue"
                                ? "bg-blue-400"
                                : achievement.color === "teal"
                                  ? "bg-teal-400"
                                  : achievement.color === "purple"
                                    ? "bg-purple-400"
                                    : achievement.color === "yellow"
                                      ? "bg-yellow-400"
                                      : achievement.color === "cyan"
                                        ? "bg-cyan-400"
                                        : "bg-green-400"
                          }`}
                        ></div>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Summary stats - Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.8 }}
              className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-5 rounded-xl border border-emerald-100"
              layout
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <motion.div
                  className="flex flex-col items-center p-3 bg-white/70 rounded-lg border border-green-100"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  layout
                >
                  <Leaf className="text-green-500 mb-2" size={24} />
                  <span className="text-xl sm:text-2xl font-bold text-gray-800">
                    {achievements.filter((a) => a.completed).length}
                  </span>
                  <span className="text-xs text-gray-500">Conquistas</span>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center p-3 bg-white/70 rounded-lg border border-green-100"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  layout
                >
                  <Target className="text-emerald-500 mb-2" size={24} />
                  <span className="text-xl sm:text-2xl font-bold text-gray-800">{rank.points}</span>
                  <span className="text-xs text-gray-500">Pontos</span>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center p-3 bg-white/70 rounded-lg border border-green-100"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  layout
                >
                  <Award className="text-yellow-500 mb-2" size={24} />
                  <span className="text-xl sm:text-2xl font-bold text-gray-800">{rank.level}</span>
                  <span className="text-xs text-gray-500">Nível</span>
                </motion.div>
                <motion.div
                  className="flex flex-col items-center p-3 bg-white/70 rounded-lg border border-green-100"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  layout
                >
                  <Trophy className="text-amber-500 mb-2" size={24} />
                  <span className="text-xl sm:text-2xl font-bold text-gray-800">{Math.round(ecoProgress)}%</span>
                  <span className="text-xs text-gray-500">Progresso</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default App
