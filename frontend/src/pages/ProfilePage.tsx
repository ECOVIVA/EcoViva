"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Leaf, Edit2, Save, Camera, ImageIcon, Heart, Plus, Wind, Sun, CloudRain, Sparkles } from "lucide-react"
import { z } from "zod"
import api from "../services/API/axios"
import routes from "../services/API/routes"

// Enhanced schema with more specific validations
const profileSchema = z.object({
  bio: z.string().min(10, "Bio deve ter pelo menos 10 caracteres").max(500, "Bio não pode exceder 500 caracteres"),
  profileImage: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Imagem de perfil não pode exceder 5MB")
    .optional()
    .or(z.string()),
  backgroundImage: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Imagem de fundo não pode exceder 5MB")
    .optional()
    .or(z.string()),
  interests: z.array(z.string()).max(10, "Você pode selecionar no máximo 10 interesses"),
})

const availableInterests = [
  "Agricultura Sustentável",
  "Alimentação Sustentável",
  "Arquitetura Verde",
  "Compostagem",
  "Conservação da Água",
  "Consumo Consciente",
  "Ecoeducação",
  "Economia Circular",
  "Energias Renováveis",
  "Gestão de Resíduos",
  "Mobilidade Sustentável",
  "Moda Sustentável",
  "Mudanças Climáticas",
  "Poluição e Controle Ambiental",
  "Preservação da Biodiversidade",
  "Produção Limpa",
  "Reciclagem",
  "Redução de Plástico",
  "Reflorestamento",
  "Zero Waste (Lixo Zero)",
]

function App() {
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState("")
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150")
  const [backgroundImage, setBackgroundImage] = useState(
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format",
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [userName, setUserName] = useState("")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [showInterestSelector, setShowInterestSelector] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true)
        const response = await api.get(routes.user.profile)
        const data = response.data

        setUserName(data.username || "Usuário")
        setBio(data.bio || "")
        setSelectedInterests(data.interests || [])

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
      } catch (err) {
        console.error("Erro ao carregar perfil:", err)
        setErrors({ general: "Não foi possível carregar o perfil." })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(img.src)
        resolve(img.width <= 1200 && img.height <= 1200)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "background") => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          [type]: `Imagem de ${type === "profile" ? "perfil" : "fundo"} não pode exceder 5MB`,
        })
        return
      }

      // Validate image dimensions
      const validDimensions = await validateImageDimensions(file)
      if (!validDimensions) {
        setErrors({
          ...errors,
          [type]: `Imagem de ${type === "profile" ? "perfil" : "fundo"} não pode exceder 1200x1200 pixels`,
        })
        return
      }

      // Clear previous errors for this field
      const newErrors = { ...errors }
      delete newErrors[type]
      setErrors(newErrors)

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
    } catch (err) {
      console.error(`Erro ao processar imagem de ${type}:`, err)
      setErrors({
        ...errors,
        [type]: `Erro ao processar imagem de ${type === "profile" ? "perfil" : "fundo"}`,
      })
    }
  }

  async function uploadPhotoToServer(photo: File, type: "profile" | "background") {
    try {
      setIsLoading(true)
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
    } catch (err: any) {
      console.error("Erro ao enviar foto:", err)

      // Handle specific API errors
      if (err.response?.data?.message) {
        setErrors({
          ...errors,
          [type]: err.response.data.message,
        })
      } else {
        setErrors({
          ...errors,
          [type]: `Erro ao enviar ${type === "profile" ? "foto de perfil" : "imagem de fundo"} para o servidor.`,
        })
      }
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      const newInterests = prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]

      // Validate interests count
      if (newInterests.length > 10) {
        setErrors({
          ...errors,
          interests: "Você pode selecionar no máximo 10 interesses",
        })
        return prev
      }

      // Clear interests error if it exists
      if (errors.interests) {
        const newErrors = { ...errors }
        delete newErrors.interests
        setErrors(newErrors)
      }

      return newInterests
    })
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setErrors({})
  
      profileSchema.parse({
        bio,
        profileImage,
        backgroundImage,
        interests: selectedInterests,
      })
  
      await api.patch(routes.user.update, {
        bio,
        interests: selectedInterests,
      })
  
      setIsEditing(false)
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        err.errors.forEach((error) => {
          const field = error.path[0].toString()
          newErrors[field] = error.message
        })
        setErrors(newErrors)
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as any).response === 'object' &&
        (err as any).response?.data
      ) {
        const response = (err as any).response
  
        if (response.data.errors) {
          setErrors(response.data.errors)
        } else if (response.data.message) {
          setErrors({ general: response.data.message })
        }
      } else {
        console.error("Erro ao salvar perfil:", err)
        setErrors({ general: "Erro ao salvar as alterações." })
      }
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 p-2 sm:p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative">
          <div className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-r from-emerald-500 to-green-400 overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
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
                  <label className="cursor-pointer px-3 py-1 bg-white/90 rounded text-sm hover:bg-white/100 transition-colors">
                    Escolher Imagem de Fundo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "background")}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className="absolute -bottom-12 sm:-bottom-14 md:-bottom-16 left-4 sm:left-6 md:left-8 z-10">
            <div className="relative group">
              <img
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="text-white" size={20} />
                    <label className="cursor-pointer px-2 py-1 bg-white/90 rounded text-xs sm:text-sm hover:bg-white/100 transition-colors">
                      Escolher Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "profile")}
                        className="hidden"
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 gap-3">
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                {userName} <Leaf className="text-green-500" />
              </h1>
            </div>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processando...
                </span>
              ) : (
                <>
                  {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
                  {isEditing ? "Salvar" : "Editar"}
                </>
              )}
            </button>
          </div>

          {errors.background && (
            <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
              {errors.background}
            </div>
          )}

          {errors.profile && (
            <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
              {errors.profile}
            </div>
          )}

          <div className="relative mb-6">
            {isEditing ? (
              <div className="relative">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className={`w-full p-4 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all bg-emerald-50/50 ${
                    errors.bio ? "border-red-300 focus:ring-red-500" : "border-emerald-100 focus:ring-emerald-500"
                  }`}
                  placeholder="Compartilhe um pouco sobre você..."
                  disabled={isLoading}
                />
                <div
                  className={`absolute bottom-3 right-3 text-sm font-medium ${
                    bio.length > 500 ? "text-red-500" : "text-emerald-600"
                  }`}
                >
                  {bio.length} / 500
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-100">
                <p className="text-gray-700 leading-relaxed">{bio || "Bio não atualizada"}</p>
              </div>
            )}
            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
          </div>

          {errors.general && (
            <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
              {errors.general}
            </div>
          )}

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="text-emerald-500" size={20} />
                <h3 className="text-xl font-bold text-gray-800">Interesses</h3>
              </div>
              {isEditing && (
                <button
                  onClick={() => setShowInterestSelector(!showInterestSelector)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  <Plus size={16} />
                  {showInterestSelector ? "Fechar" : "Adicionar"}
                </button>
              )}
            </div>

            {errors.interests && (
              <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
                {errors.interests}
              </div>
            )}

            {!isEditing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {selectedInterests.length > 0 ? (
                  selectedInterests.map((interest) => (
                    <div
                      key={interest}
                      className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 shadow-sm"
                    >
                      <p className="text-sm font-medium text-emerald-800">{interest}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic col-span-full">Nenhum interesse selecionado</p>
                )}
              </div>
            )}

            {isEditing && showInterestSelector && (
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  {availableInterests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      disabled={isLoading || (selectedInterests.length >= 10 && !selectedInterests.includes(interest))}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        selectedInterests.includes(interest)
                          ? "bg-emerald-500 text-white shadow-md"
                          : selectedInterests.length >= 10
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-600 hover:bg-emerald-100 hover:text-emerald-700"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
