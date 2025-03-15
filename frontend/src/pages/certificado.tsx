import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Award, Download, Leaf, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Certificate() {
  const [userName, setUserName] = useState("Estudante Ecológico")
  const [completionDate, setCompletionDate] = useState("")
  const [certificateId, setCertificateId] = useState("")

  useEffect(() => {
    // Gerar data atual formatada
    const currentDate = new Date()
    setCompletionDate(currentDate.toLocaleDateString("pt-BR"))

    // Gerar ID único para o certificado
    setCertificateId(`ECO-${Math.floor(Math.random() * 10000)}-${currentDate.getFullYear()}`)

    // Verificar se há um nome salvo
    const savedName = localStorage.getItem("userName")
    if (savedName) {
      setUserName(savedName)
    }
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
    localStorage.setItem("userName", e.target.value)
  }

  const handleDownload = () => {
    // Simulação de download do certificado
    alert("Certificado baixado com sucesso!")
  }

  const handleShare = () => {
    // Simulação de compartilhamento
    if (navigator.share) {
      navigator.share({
        title: "Meu Certificado ECOplayer",
        text: `Concluí o curso de reciclagem e meio ambiente e me tornei um ECOplayer certificado!`,
        url: window.location.href,
      })
    } else {
      alert("Compartilhamento não suportado pelo seu navegador")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Certificado ECOplayer</h2>

            <div className="border-8 border-double border-green-200 p-8 mb-8 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="text-center mb-6">
                <Award className="h-16 w-16 text-green-600 mx-auto mb-2" />
                <h3 className="text-2xl font-serif text-green-800">Certificado de Conclusão</h3>
              </div>

              <div className="text-center mb-8">
                <p className="text-lg mb-1">Este certificado é concedido a</p>
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={userName}
                    onChange={handleNameChange}
                    className="text-2xl font-bold text-center w-full border-b-2 border-green-300 bg-transparent focus:outline-none focus:border-green-500 py-1"
                    aria-label="Seu nome"
                  />
                </div>
                <p className="mb-4">
                  por concluir com sucesso todas as 10 lições do programa EcoAprendiz e demonstrar conhecimento e
                  compromisso com práticas sustentáveis e de reciclagem.
                </p>
                <div className="flex justify-between items-center mt-8">
                  <div>
                    <p className="font-bold">Data de Conclusão</p>
                    <p>{completionDate}</p>
                  </div>
                  <div>
                    <p className="font-bold">Certificado Nº</p>
                    <p>{certificateId}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Baixar Certificado
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Compartilhar
              </Button>
            </div>
          </div>

          <div className="bg-green-100 rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold text-green-700 mb-4">Parabéns por se tornar um ECOplayer!</h3>
            <p className="mb-4">
              Você agora faz parte de uma comunidade comprometida com a proteção do meio ambiente. Continue aplicando o
              que aprendeu e inspirando outros a fazerem o mesmo!
            </p>
            <Link href="/">
              <Button variant="outline" className="bg-white">
                Voltar para Início
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

