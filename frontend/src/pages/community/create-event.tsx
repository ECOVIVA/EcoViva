"use client"

import type React from "react"
import { useState } from "react"
import {
  Calendar,
  Plus,
  Upload,
  X,
  Tag,
  FileText,
  ImageIcon,
  Target,
  Trash2,
  Users,
  Leaf,
  BookOpen,
  Heart,
  ArrowLeft,
} from "lucide-react"
import { usePosts } from "../../components/Auth/context/post-context" // Adjust the import path as necessary

interface CreateEventProps {
  onBack?: () => void
}

interface EventFormData {
  name: string
  date: string
  time: string
  location: string
  description: string
  category: string
  maxAttendees: string
  image: string
  isPublic: boolean
  requiresRegistration: boolean
  goals: EventGoal[]
}

interface EventGoal {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  category: "participation" | "environmental" | "educational" | "community"
}

export const CreateEvent: React.FC<CreateEventProps> = ({ onBack }) => {
  const { addPost } = usePosts()
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    category: "",
    maxAttendees: "",
    image: "",
    isPublic: true,
    requiresRegistration: true,
    goals: [],
  })

  const [imagePreview, setImagePreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const categories = [
    "Workshop",
    "Feira",
    "Palestra",
    "Mutirão",
    "Plantio",
    "Limpeza",
    "Educação Ambiental",
    "Reciclagem",
    "Outro",
  ]

  const goalCategories = [
    { id: "participation", label: "Participação", icon: Users, color: "blue" },
    { id: "environmental", label: "Ambiental", icon: Leaf, color: "green" },
    { id: "educational", label: "Educacional", icon: BookOpen, color: "purple" },
    { id: "community", label: "Comunidade", icon: Heart, color: "pink" },
  ]

  const goalUnits = [
    "participantes",
    "mudas plantadas",
    "kg de lixo coletado",
    "pessoas capacitadas",
    "materiais reciclados",
    "voluntários",
    "horas de atividade",
    "metros quadrados limpos",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({
          ...prev,
          image: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    setFormData((prev) => ({
      ...prev,
      image: "",
    }))
  }

  const addGoal = () => {
    const newGoal: EventGoal = {
      id: Date.now().toString(),
      title: "",
      description: "",
      targetValue: 0,
      currentValue: 0,
      unit: "participantes",
      category: "participation",
    }

    setFormData((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }))
  }

  const updateGoal = (goalId: string, field: keyof EventGoal, value: any) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) => (goal.id === goalId ? { ...goal, [field]: value } : goal)),
    }))
  }

  const removeGoal = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.filter((goal) => goal.id !== goalId),
    }))
  }

  const createEventPost = (eventData: EventFormData) => {
    const goalsText =
      eventData.goals.length > 0
        ? `\n\n🎯 Metas do evento:\n${eventData.goals
            .map((goal) => `• ${goal.title}: ${goal.targetValue} ${goal.unit}`)
            .join("\n")}`
        : ""

    return {
      id: Date.now(),
      author: "Você",
      timestamp: "agora mesmo",
      content: `🌱 Novo evento criado: ${eventData.name}!\n\n${eventData.description}\n\n📅 ${eventData.date} às ${eventData.time}\n📍 ${eventData.location}${goalsText}\n\n#${eventData.category} #EventoAmbiental #Comunidade`,
      image: eventData.image || undefined,
      likes: 0,
      comments: 0,
      shares: 0,
      isCommunityPost: true,
      eventData: {
        name: eventData.name,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        category: eventData.category,
        goals: eventData.goals.map((goal) => ({
          id: goal.id,
          title: goal.title,
          targetValue: goal.targetValue,
          unit: goal.unit,
        })),
      },
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Mock API call
    setTimeout(() => {
      console.log("Evento criado:", formData)

      // Criar post para o feed
      const newPost = createEventPost(formData)

      // Adicionar ao feed através do contexto
      addPost(newPost)

      setIsSubmitting(false)
      setShowSuccess(true)

      // Reset form after success and go back to feed
      setTimeout(() => {
        setShowSuccess(false)
        setFormData({
          name: "",
          date: "",
          time: "",
          location: "",
          description: "",
          category: "",
          maxAttendees: "",
          image: "",
          isPublic: true,
          requiresRegistration: true,
          goals: [],
        })
        setImagePreview("")
        onBack?.()
      }, 3000)
    }, 1500)
  }

  const isFormValid = formData.name && formData.date && formData.time && formData.location && formData.category

  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-green-900 mb-2">Evento Criado com Sucesso!</h2>
          <p className="text-green-700 mb-4">
            Seu evento "{formData.name}" foi criado e publicado no feed da comunidade.
          </p>

          {formData.goals.length > 0 && (
            <div className="bg-white rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-2">🎯 Metas Definidas:</h3>
              <div className="space-y-2">
                {formData.goals.map((goal) => (
                  <div key={goal.id} className="text-sm text-gray-700 bg-gray-50 rounded p-2">
                    <strong>{goal.title}:</strong> {goal.targetValue} {goal.unit}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-4">Redirecionando para o feed em alguns segundos...</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 max-w-xs mx-auto">
              <div className="bg-green-600 h-1.5 rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header com botão de voltar */}
      <div className="mb-8">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para o Feed
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Novo Evento</h1>
        <p className="text-gray-600">Organize um evento para sua comunidade, defina metas e faça a diferença!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-green-600" />
            Informações Básicas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Evento *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Workshop de Compostagem"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-2">
                Máximo de Participantes
              </label>
              <input
                type="number"
                id="maxAttendees"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: 50"
                min="1"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Evento
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Descreva o que será feito no evento, materiais necessários, objetivos..."
              />
            </div>
          </div>
        </div>

        {/* Data e Local */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600" />
            Data e Local
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Data do Evento *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Horário *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Local do Evento *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Parque Municipal, Rua das Flores, 123"
                required
              />
            </div>
          </div>
        </div>

        {/* Metas do Evento */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Metas do Evento
            </h2>
            <button
              type="button"
              onClick={addGoal}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Plus size={16} className="mr-2" />
              Adicionar Meta
            </button>
          </div>

          {formData.goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma meta definida ainda.</p>
              <p className="text-sm">Adicione metas para tornar seu evento mais impactante!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.goals.map((goal, index) => {
                const categoryInfo = goalCategories.find((cat) => cat.id === goal.category)
                const IconComponent = categoryInfo?.icon || Target

                return (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Meta #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeGoal(goal.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título da Meta</label>
                        <input
                          type="text"
                          value={goal.title}
                          onChange={(e) => updateGoal(goal.id, "title", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Ex: Plantar mudas nativas"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                        <select
                          value={goal.category}
                          onChange={(e) => updateGoal(goal.id, "category", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          {goalCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Numérica</label>
                        <input
                          type="number"
                          value={goal.targetValue}
                          onChange={(e) => updateGoal(goal.id, "targetValue", Number.parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Ex: 100"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unidade</label>
                        <select
                          value={goal.unit}
                          onChange={(e) => updateGoal(goal.id, "unit", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          {goalUnits.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição da Meta</label>
                        <textarea
                          value={goal.description}
                          onChange={(e) => updateGoal(goal.id, "description", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Descreva como essa meta será alcançada..."
                        />
                      </div>
                    </div>

                    {/* Preview da Meta */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <IconComponent size={20} className={`mr-2 text-${categoryInfo?.color || "gray"}-600`} />
                        <span className="font-medium">{goal.title || "Título da meta"}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        Meta: {goal.targetValue} {goal.unit}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Imagem do Evento */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-green-600" />
            Imagem do Evento
          </h2>

          <div className="space-y-4">
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                <input type="file" id="image" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <label htmlFor="image" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Clique para fazer upload</p>
                  <p className="text-sm text-gray-500">PNG, JPG ou GIF até 5MB</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Configurações */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Tag className="w-5 h-5 mr-2 text-green-600" />
            Configurações
          </h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="isPublic" className="ml-3 text-sm font-medium text-gray-700">
                Evento público (visível para todos)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requiresRegistration"
                name="requiresRegistration"
                checked={formData.requiresRegistration}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="requiresRegistration" className="ml-3 text-sm font-medium text-gray-700">
                Requer inscrição prévia
              </label>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end space-x-4 pt-6">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            onClick={onBack}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Criando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Criar Evento
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateEvent
