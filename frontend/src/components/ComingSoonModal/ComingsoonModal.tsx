import React, { useEffect } from 'react'
import { X, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'


interface ComingSoonModalProps {
  lesson: {
    id: number
    title: string
    background: string
    icon: React.ReactNode
    difficulty: string
    duration: string
    description: string
    topics: string[]
  }
  onClose: () => void
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ lesson, onClose }) => {
  useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('modal-backdrop')) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/50 backdrop-blur-sm overflow-y-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`relative max-w-2xl w-full mx-4 my-8 rounded-3xl overflow-hidden shadow-2xl`}
        >
          {/* Background with gradient and particle effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${lesson.background}`}></div>
          <div className="absolute inset-0 overflow-hidden opacity-50">

          </div>
          
          <div className="relative p-8 text-white z-10">
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                {lesson.icon}
              </div>
              <div>
                <h3 className="text-3xl font-bold">{lesson.title}</h3>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    {lesson.difficulty}
                  </span>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    {lesson.duration}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Coming soon badge */}
            <div className="inline-block bg-gradient-to-r from-yellow-500 to-amber-500 px-5 py-2 rounded-full font-bold text-white shadow-lg mb-6 animate-pulse">
              Em Desenvolvimento
            </div>
            
            <p className="text-lg mb-8 backdrop-blur-sm bg-black/10 p-4 rounded-xl">
              {lesson.description}
            </p>
            
            {/* Topics */}
            <div className="mb-8">
              <h4 className="font-bold mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Tópicos que serão abordados:
              </h4>
              <div className="flex flex-wrap gap-2">
                {lesson.topics.map((topic, i) => (
                  <span key={i} className="text-sm bg-white/10 px-4 py-2 rounded-full shadow-sm">
                    {topic}
                  </span>
                ))}
              </div>
             </div>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ComingSoonModal