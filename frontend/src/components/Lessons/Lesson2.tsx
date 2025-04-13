import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Leaf, Info } from 'lucide-react';
import api from '../../services/API/axios';
import routes from '../../services/API/routes';

interface MemoryItem {
  id: number;
  type: string;
  emoji: string;
  name: string;
  flipped?: boolean;
  matched?: boolean;
}

interface Props {
  onBack: () => void;
}

const memoryItems = [
  { id: 1, type: "plastic", emoji: "🥤", name: "Garrafa Plástica" },
  { id: 2, type: "plastic", emoji: "🥤", name: "Garrafa Plástica" },
  { id: 3, type: "paper", emoji: "📰", name: "Jornal" },
  { id: 4, type: "paper", emoji: "📰", name: "Jornal" },
  { id: 5, type: "glass", emoji: "🫙", name: "Pote de Vidro" },
  { id: 6, type: "glass", emoji: "🫙", name: "Pote de Vidro" },
  { id: 7, type: "metal", emoji: "🥫", name: "Lata" },
  { id: 8, type: "metal", emoji: "🥫", name: "Lata" },
  { id: 9, type: "organic", emoji: "🍌", name: "Casca de Banana" },
  { id: 10, type: "organic", emoji: "🍌", name: "Casca de Banana" },
  { id: 11, type: "hazardous", emoji: "🔋", name: "Pilha" },
  { id: 12, type: "hazardous", emoji: "🔋", name: "Pilha" },
];

export default function Lesson2({ onBack }: Props) {
  const [cards, setCards] = useState<MemoryItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    const totalPairs = memoryItems.length / 2;
    if (matchedPairs === totalPairs && !isCompleted) {
      const completionApi = async() => {
        try{
        const response = await api.post(routes.study.lessons_completion.create, {lesson: 2})

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
  }, [matchedPairs, isCompleted]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;

      const timer = setTimeout(() => {
        if (cards[first].type === cards[second].type) {
          setCards((prevCards) =>
            prevCards.map((card, index) => 
              (index === first || index === second) ? { ...card, matched: true } : card
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setScore((prev) => prev + 15);
          showToast('Par encontrado!', `Você encontrou um par de ${cards[first].name}!`, true);
        } else {
          setCards((prevCards) =>
            prevCards.map((card, index) =>
              (index === first || index === second) ? { ...card, flipped: false } : card
            )
          );
          showToast('Tente novamente!', 'Essas cartas não formam um par.', false);
        }

        setFlippedCards([]);
        setMoves((prev) => prev + 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [flippedCards, cards]);

  const initGame = () => {
    const shuffledCards = [...memoryItems]
      .sort(() => Math.random() - 0.5)
      .map(item => ({ ...item, flipped: false, matched: false }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsCompleted(false);
    setScore(0);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) {
      return;
    }

    setCards(cards.map((card, i) => (i === index ? { ...card, flipped: true } : card)));
    setFlippedCards([...flippedCards, index]);
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-green-700">Lição 2: Jogo da Memória Reciclável</h2>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 hover:bg-green-50 rounded-full transition-colors"
              >
                <Info className="h-6 w-6 text-green-700" />
              </button>
            </div>

            {showInfo && (
              <div className="bg-green-50 border border-green-200 p-6 rounded-xl mb-6">
                <h3 className="font-bold text-xl text-green-800 mb-3">Como Jogar</h3>
                <p className="text-green-700 mb-3">
                  Encontre os pares de itens recicláveis virando as cartas. Memorize as posições para encontrar todos os
                  pares com o menor número de movimentos.
                </p>
                <p className="text-green-700">
                  Cada par encontrado te ensina sobre um tipo diferente de material reciclável.
                </p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso do Jogo</span>
                <span className="text-sm font-medium">
                  {matchedPairs}/{memoryItems.length / 2} pares
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${(matchedPairs / (memoryItems.length / 2)) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium text-gray-700">Movimentos: {moves}</span>
              <button
                onClick={initGame}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
              >
                Reiniciar Jogo
              </button>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {cards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`
                    aspect-square rounded-xl transition-all duration-300 transform
                    ${card.flipped || card.matched
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
                      : "bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"}
                    ${card.matched ? "ring-4 ring-green-400 ring-opacity-50" : ""}
                    hover:shadow-lg hover:scale-105
                  `}
                  disabled={card.matched}
                  aria-label={card.flipped || card.matched ? card.name : "Carta virada para baixo"}
                >
                  <div className="h-full w-full flex items-center justify-center">
                    {(card.flipped || card.matched) && (
                      <div className="text-center">
                        <span className="text-4xl block mb-2" role="img" aria-hidden="true">
                          {card.emoji}
                        </span>
                        <span className="text-sm font-medium text-green-800 block">
                          {card.name}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {isCompleted && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200 text-center">
                <h3 className="text-2xl font-bold text-green-700 mb-3">
                  🎉 Parabéns! Você completou a Lição 2
                </h3>
                <p className="text-gray-700 mb-4">
                  Você encontrou todos os pares e aprendeu sobre os diferentes tipos de materiais recicláveis.
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

          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-green-700 mb-4">Dicas de Acessibilidade</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-gray-700">
                  Use Tab para navegar entre as cartas e Enter para selecioná-las.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-gray-700">
                  Cada carta tem uma descrição de áudio para leitores de tela.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-gray-700">
                  O jogo pode ser jogado apenas com o teclado, sem necessidade de mouse.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}