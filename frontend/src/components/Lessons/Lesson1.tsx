import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Leaf, Trash, Trash2, Recycle, Droplet, Zap } from 'lucide-react';
import api from '../../services/API/axios';
import routes from '../../services/API/routes';

interface WasteItem {
  id: number;
  name: string;
  type: string;
  icon: string;
  color: string;
}

interface Bin {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
}

interface Props {
  onBack: () => void;
}

const wasteItems: WasteItem[] = [
  { id: 1, name: "Garrafa PET", type: "plastic", icon: "🥤", color: "bg-red-100 border-red-300" },
  { id: 2, name: "Jornal", type: "paper", icon: "📰", color: "bg-blue-100 border-blue-300" },
  { id: 3, name: "Lata de Alumínio", type: "metal", icon: "🥫", color: "bg-yellow-100 border-yellow-300" },
  { id: 4, name: "Pote de Vidro", type: "glass", icon: "🫙", color: "bg-green-100 border-green-300" },
  { id: 5, name: "Casca de Banana", type: "organic", icon: "🍌", color: "bg-amber-100 border-amber-300" },
  { id: 6, name: "Pilha", type: "hazardous", icon: "🔋", color: "bg-purple-100 border-purple-300" },
];

const bins: Bin[] = [
  { id: "plastic", name: "Plástico", color: "bg-red-500", icon: <Trash className="h-6 w-6" /> },
  { id: "paper", name: "Papel", color: "bg-blue-500", icon: <Trash2 className="h-6 w-6" /> },
  { id: "metal", name: "Metal", color: "bg-yellow-500", icon: <Recycle className="h-6 w-6" /> },
  { id: "glass", name: "Vidro", color: "bg-green-500", icon: <Droplet className="h-6 w-6" /> },
  { id: "organic", name: "Orgânico", color: "bg-amber-500", icon: <Leaf className="h-6 w-6" /> },
  { id: "hazardous", name: "Perigoso", color: "bg-purple-500", icon: <Zap className="h-6 w-6" /> },
];

export default function Lesson1({ onBack }: Props) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [correctItems, setCorrectItems] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const allItemsCorrect = wasteItems.length > 0 && correctItems.length === wasteItems.length;
    if (allItemsCorrect && !isCompleted) {
      const completionApi = async() => {
        try{
        const response = await api.post(routes.study.lessons_completion.create, {lesson: 1})

        if (response.status === 201){
          setIsCompleted(true);
        }
        else{
          console.error(response.data)
        }
        }
        catch(e){
          console.error(e)
        }
      }
      
      completionApi()
    }
  }, [correctItems.length, isCompleted]);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const item = wasteItems.find((item) => item.id === draggedItem);
    if (item) {
      if (item.type === binType) {
        if (!correctItems.includes(item.id)) {
          setCorrectItems((prev) => [...prev, item.id]);
          setScore((prev) => prev + 10);
          showToast('Correto!', `${item.name} vai no recipiente de ${binType}!`, true);
        }
      } else {
        showToast('Tente novamente!', `${item.name} não pertence a este recipiente.`, false);
      }
    }
    setDraggedItem(null);
  };

  const showToast = (title: string, message: string, success: boolean) => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      success ? 'bg-green-500' : 'bg-red-500'
    } text-white transform transition-transform duration-300 translate-x-0`;
    toast.innerHTML = `
      <h4 class="font-bold">${title}</h4>
      <p>${message}</p>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transform = 'translateX(150%)';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <header className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8" />
            <h1 className="text-2xl font-bold">EcoStudy</h1>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
            <span className="font-semibold">Pontos: {score}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8 backdrop-blur-sm bg-white/90">
            <h2 className="text-3xl font-bold text-green-700 mb-4">Lição 1: Introdução à Reciclagem</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Arraste cada item para a lixeira correta para aprender sobre separação de resíduos.
            </p>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso da Lição</span>
                <span className="text-sm font-medium">
                  {correctItems.length}/{wasteItems.length}
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(correctItems.length / wasteItems.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                <h3 className="font-bold text-xl mb-4 text-green-700">Itens para Reciclar</h3>
                <div className="grid grid-cols-2 gap-4">
                  {wasteItems.map((item) => (
                    <div
                      key={item.id}
                      draggable={!correctItems.includes(item.id)}
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                        correctItems.includes(item.id)
                          ? "opacity-50 cursor-not-allowed bg-gray-100"
                          : `${item.color} cursor-grab active:cursor-grabbing hover:scale-105 hover:shadow-lg`
                      }`}
                    >
                      <span className="text-3xl" role="img" aria-label={item.name}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                      {correctItems.includes(item.id) && (
                        <Check className="h-5 w-5 text-green-500 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl mb-4 text-green-700">Lixeiras</h3>
                <div className="grid grid-cols-2 gap-4">
                  {bins.map((bin) => (
                    <div
                      key={bin.id}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, bin.id)}
                      className={`${bin.color} text-white p-6 rounded-xl flex flex-col items-center justify-center h-32 transition-all hover:opacity-90 hover:shadow-lg transform hover:-translate-y-1`}
                    >
                      {bin.icon}
                      <span className="mt-3 font-medium text-lg">{bin.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isCompleted && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200 text-center">
                <h3 className="text-2xl font-bold text-green-700 mb-3">
                  🎉 Parabéns! Você completou a Lição 1
                </h3>
                <p className="text-gray-700 mb-4">
                  Você dominou os fundamentos da separação de resíduos para reciclagem.
                </p>
                <button
                  onClick={onBack}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Voltar para o Menu Principal
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}