import type React from "react"
import { useState } from "react"
import { ImageIcon, Smile, Calendar } from "lucide-react"

interface CreatePostBoxProps {
  onCreateEvent?: () => void
}

export const CreatePostBox: React.FC<CreatePostBoxProps> = ({ onCreateEvent }) => {
  const [postContent, setPostContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (postContent.trim()) {
      console.log("Novo post:", postContent)
      setPostContent("")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-semibold">
            V
          </div>
          <div className="flex-1">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="O que você está fazendo para o meio ambiente hoje?"
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="flex items-center text-gray-500 hover:text-green-600 transition-colors"
                >
                  <ImageIcon size={20} className="mr-1" />
                  <span className="text-sm">Foto</span>
                </button>
                <button
                  type="button"
                  onClick={onCreateEvent}
                  className="flex items-center text-gray-500 hover:text-green-600 transition-colors"
                >
                  <Calendar size={20} className="mr-1" />
                  <span className="text-sm">Evento</span>
                </button>
                <button
                  type="button"
                  className="flex items-center text-gray-500 hover:text-green-600 transition-colors"
                >
                  <Smile size={20} className="mr-1" />
                  <span className="text-sm">Emoji</span>
                </button>
              </div>
              <button
                type="submit"
                disabled={!postContent.trim()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
