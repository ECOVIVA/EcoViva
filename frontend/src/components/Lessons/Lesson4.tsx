import React, { useState, useEffect } from 'react';
import { ArrowLeft, Info, Check, Award, AlertTriangle, Droplets, BarChart3, Timer } from 'lucide-react';
import api from '../../services/API/axios';
import routes from '../../services/API/routes';

// Enhanced puzzle pieces with additional properties
const puzzlePieces = [
  {
    id: 1,
    text: "Fechar a torneira enquanto escova os dentes",
    saving: 12,
    icon: "💧",
    unit: "litros/dia",
    difficulty: "fácil",
    impact: "médio",
    timeToImplement: "imediato",
    initialInvestment: 0,
    monthlyReturn: 5,
  },
  {
    id: 2,
    text: "Reduzir o tempo do banho em 5 minutos",
    saving: 90,
    icon: "🚿",
    unit: "litros/dia",
    difficulty: "médio",
    impact: "alto",
    timeToImplement: "imediato",
    initialInvestment: 0,
    monthlyReturn: 25,
  },
  {
    id: 3,
    text: "Usar a máquina de lavar roupa apenas com carga completa",
    saving: 100,
    icon: "👕",
    unit: "litros/lavagem",
    difficulty: "fácil",
    impact: "alto",
    timeToImplement: "imediato",
    initialInvestment: 0,
    monthlyReturn: 30,
  },
  {
    id: 4,
    text: "Consertar vazamentos de torneiras",
    saving: 40,
    icon: "🔧",
    unit: "litros/dia",
    difficulty: "médio",
    impact: "médio",
    timeToImplement: "1 dia",
    initialInvestment: 50,
    monthlyReturn: 15,
  },
  {
    id: 5,
    text: "Reutilizar água da chuva para plantas",
    saving: 200,
    icon: "🌧️",
    unit: "litros/mês",
    difficulty: "difícil",
    impact: "alto",
    timeToImplement: "1 semana",
    initialInvestment: 200,
    monthlyReturn: 50,
  },
  {
    id: 6,
    text: "Usar regador em vez de mangueira no jardim",
    saving: 50,
    icon: "🌱",
    unit: "litros/dia",
    difficulty: "fácil",
    impact: "médio",
    timeToImplement: "imediato",
    initialInvestment: 30,
    monthlyReturn: 20,
  },
  {
    id: 7,
    text: "Instalar aeradores nas torneiras",
    saving: 30,
    icon: "🚰",
    unit: "litros/dia",
    difficulty: "médio",
    impact: "médio",
    timeToImplement: "1 dia",
    initialInvestment: 40,
    monthlyReturn: 12,
  },
  {
    id: 8,
    text: "Usar descarga com duplo acionamento",
    saving: 70,
    icon: "🚽",
    unit: "litros/dia",
    difficulty: "difícil",
    impact: "alto",
    timeToImplement: "1 dia",
    initialInvestment: 150,
    monthlyReturn: 35,
  },
];

interface Props {
  onBack: () => void;
}

export default function Lesson4({ onBack }: Props) {
  const [waterSaved, setWaterSaved] = useState(0);
  const [selectedPieces, setSelectedPieces] = useState<number[]>([]);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [dailyUsage, setDailyUsage] = useState(300);
  const [targetSaving, setTargetSaving] = useState(150);
  const [budget, setBudget] = useState(500);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [difficulty, setDifficulty] = useState<'fácil' | 'médio' | 'difícil'>('fácil');
  const [showCelebration, setShowCelebration] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    if (waterSaved >= targetSaving && !isCompleted) {
      const completionApi = async() => {
        try{
        const response = await api.post(routes.study.lessons_completion.create, {lesson: 4})

        if (response.status === 201){
          setIsCompleted(true);
          setPuzzleComplete(true);
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


      setScore((prev) => prev + calculateBonus());
      setShowCelebration(true);
      checkAchievements();
      showToast('Parabéns! 🎉', 'Você atingiu a meta de economia de água!', true);
    }
  }, [waterSaved, targetSaving, isCompleted]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          if (!puzzleComplete) {
            showToast('Tempo Esgotado! ⏰', 'Tente novamente para melhorar seu score!', false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateBonus = () => {
    const timeBonus = Math.floor((timeLeft / 300) * 50); // Up to 50 points for speed
    const difficultyBonus = difficulty === 'difícil' ? 30 : difficulty === 'médio' ? 20 : 10;
    const streakBonus = streak * 5; // 5 points per streak
    return 50 + timeBonus + difficultyBonus + streakBonus;
  };

  const checkAchievements = () => {
    const newAchievements: string[] = [];

    if (waterSaved >= targetSaving * 1.5) {
      newAchievements.push("Super Econômico 🌟");
    }
    if (timeLeft > 180) {
      newAchievements.push("Velocista da Água ⚡");
    }
    if (selectedPieces.length >= 6) {
      newAchievements.push("Mestre da Conservação 🎓");
    }
    if (streak >= 3) {
      newAchievements.push("Guardião da Água 🛡️");
    }

    setAchievements((prev) => [...prev, ...newAchievements]);
  };

  const handlePieceSelect = (id: number) => {
    const piece = puzzlePieces.find((piece) => piece.id === id);
    if (!piece) return;

    const totalInvestment = selectedPieces.reduce((total, pieceId) => {
      const selectedPiece = puzzlePieces.find((p) => p.id === pieceId);
      return total + (selectedPiece?.initialInvestment || 0);
    }, piece.initialInvestment);

    if (totalInvestment > budget && !selectedPieces.includes(id)) {
      showToast('Atenção! 💰', 'Orçamento insuficiente para esta ação!', false);
      return;
    }

    if (selectedPieces.includes(id)) {
      setSelectedPieces(selectedPieces.filter((pieceId) => pieceId !== id));
      setWaterSaved((prev) => prev - piece.saving);
      setScore((prev) => Math.max(0, prev - 5));
      setBudget((prev) => prev + piece.initialInvestment);
      setStreak(0);
    } else {
      const newSelectedPieces = [...selectedPieces, id];
      setSelectedPieces(newSelectedPieces);
      setWaterSaved((prev) => prev + piece.saving);
      setScore((prev) => prev + 10);
      setBudget((prev) => prev - piece.initialInvestment);
      setStreak((prev) => prev + 1);

      const monthlyReturn = piece.monthlyReturn;
      setTimeout(() => {
        setBudget((prev) => prev + monthlyReturn);
        showToast('Retorno Mensal! 💰', `+${monthlyReturn} reais de economia!`, true);
      }, 5000);

      showToast('Boa escolha! 🎯', `Esta ação economiza ${piece.saving} ${piece.unit}`, true);
    }

    // Add visual feedback animation
    const element = document.getElementById(`piece-${id}`);
    if (element) {
      element.classList.add('scale-105', 'shadow-lg');
      setTimeout(() => {
        element.classList.remove('scale-105', 'shadow-lg');
      }, 200);
    }
  };

  const handleReset = () => {
    setSelectedPieces([]);
    setWaterSaved(0);
    setPuzzleComplete(false);
    setScore(0);
    setTimeLeft(300);
    setBudget(500);
    setStreak(0);
    setShowCelebration(false);
    setAchievements([]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'fácil':
        return 'text-green-500';
      case 'médio':
        return 'text-yellow-500';
      case 'difícil':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'alto':
        return 'text-blue-600';
      case 'médio':
        return 'text-blue-400';
      case 'baixo':
        return 'text-blue-300';
      default:
        return 'text-gray-500';
    }
  };

  const showToast = (title: string, message: string, success: boolean) => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg transform transition-all duration-500 ${success ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'
      } text-white z-50 backdrop-blur-sm`;
    toast.innerHTML = `
      <h4 class="font-bold">${title}</h4>
      <p>${message}</p>
    `;

    // Add entrance animation
    toast.style.transform = 'translateX(100%)';
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(150%)';
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-green-50">
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 transform animate-[scale-in_0.5s_ease-out] text-center max-w-md">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Incrível!</h2>
            <p className="text-gray-600 mb-4">
              Você economizou {waterSaved} litros de água e ganhou {calculateBonus()} pontos!
            </p>
            {achievements.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-blue-600 mb-2">Conquistas Desbloqueadas:</h3>
                <div className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 p-2 rounded-lg text-blue-700 animate-[fade-in_0.3s_ease-out]"
                    >
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setShowCelebration(false)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              <span className={`font-mono ${timeLeft < 60 ? 'text-red-300' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span>{score} pts</span>
            </div>

            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span>{streak}x</span>
            </div>

            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              <span>{budget} R$</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-6 mb-8 backdrop-blur-sm bg-opacity-90">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
                <Droplets className="h-7 w-7" />
                Lição 4: Economia de Água
              </h2>
              <button onClick={onBack} className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Voltar</span>
              </button>
            </div>

            {showInfo && (
              <div className="bg-blue-50 p-5 rounded-lg mb-6 text-blue-800 border border-blue-200">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Sobre Economia de Água
                </h3>
                <p className="mb-3">
                  A água é um recurso essencial e limitado. Adotar práticas de economia não só beneficia o meio ambiente,
                  mas também reduz seus gastos!
                </p>
                <ul className="list-disc pl-5">
                  <li>Pequenas mudanças geram grandes impactos.</li>
                  <li>Economizar água é um ato de responsabilidade.</li>
                  <li>Cada gota conta para um futuro sustentável.</li>
                </ul>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso para meta de economia</span>
                <span className="text-sm font-medium text-blue-600">
                  {waterSaved} de {targetSaving} litros ({Math.min(100, Math.round((waterSaved / targetSaving) * 100))}%)
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, (waterSaved / targetSaving) * 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-3 text-blue-700 flex items-center gap-2">
                  <span className="text-2xl">💧</span>
                  Escolha ações para economizar água
                </h3>

                <div className="space-y-3">
                  {puzzlePieces.map((piece) => (
                    <button
                      key={piece.id}
                      id={`piece-${piece.id}`}
                      onClick={() => handlePieceSelect(piece.id)}
                      disabled={timeLeft === 0}
                      className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-all transform hover:scale-102 hover:shadow-md ${selectedPieces.includes(piece.id)
                          ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 shadow-inner"
                          : "bg-white border-gray-200 hover:border-blue-300"
                        } ${timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="text-2xl transform transition-transform duration-300 hover:scale-110">
                        {piece.icon}
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium">{piece.text}</div>
                        <div className="text-sm text-blue-600">
                          Economia: {piece.saving} {piece.unit}
                        </div>
                        <div className="flex gap-2 mt-1 text-xs">
                          <span className={`${getDifficultyColor(piece.difficulty)}`}>
                            {piece.difficulty}
                          </span>
                          <span className={`${getImpactColor(piece.impact)}`}>
                            Impacto: {piece.impact}
                          </span>
                          <span className="text-gray-500">
                            Investimento: R${piece.initialInvestment}
                          </span>
                        </div>
                      </div>
                      {selectedPieces.includes(piece.id) && (
                        <Check className="h-5 w-5 text-blue-500 ml-auto animate-[scale-in_0.2s_ease-out]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-blue-700 flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Seu impacto
                </h3>

                <div className="bg-blue-50 rounded-lg p-5 mb-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">Consumo médio diário</h4>
                      <p className="text-gray-600 text-sm">Sem economia</p>
                    </div>
                    <div className="text-xl font-bold text-blue-700">{dailyUsage} L</div>
                  </div>

                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h4 className="font-medium">Novo consumo diário</h4>
                      <p className="text-gray-600 text-sm">Com suas economias</p>
                    </div>
                    <div className="text-xl font-bold text-green-600">{dailyUsage - waterSaved} L</div>
                  </div>

                  <div className="h-40 bg-gradient-to-b from-blue-100 to-blue-300 rounded-lg flex items-end justify-center p-4 relative overflow-hidden">
                    <div
                      className="w-24 bg-blue-500 rounded-t-lg relative transition-all duration-1000 z-10"
                      style={{
                        height: `${Math.min(100, ((dailyUsage - waterSaved) / dailyUsage) * 100)}%`,
                        maxHeight: "90%",
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-700 font-bold">
                        {Math.round((waterSaved / dailyUsage) * 100)}% menos
                      </div>
                    </div>

                    <div className="w-24 bg-blue-600 rounded-t-lg relative mx-4 z-10" style={{ height: "90%" }}>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-700 font-bold">
                        Antes
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-0 right-0 text-center text-blue-800 text-sm font-medium z-10">
                      Comparação de consumo diário
                    </div>

                    <div className="absolute inset-0 bg-blue-50 opacity-20 animate-[pulse_2s_ease-in-out_infinite]"></div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                  <h4 className="font-medium mb-3 text-green-700 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Impacto anual
                  </h4>
                  <p className="mb-4 text-gray-600">Com essas mudanças, você economizaria aproximadamente:</p>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">{Math.round(waterSaved * 365)} L</div>
                      <div className="text-sm text-gray-600">por ano</div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((waterSaved * 365) / 1000)} m³
                      </div>
                      <div className="text-sm text-gray-600">metros cúbicos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {puzzleComplete && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 text-center transform transition-all duration-500 hover:shadow-lg">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-blue-700 mb-2">Parabéns! Você completou a Lição 4</h3>
                <p className="mb-4 text-gray-600">
                  Suas escolhas economizarão {waterSaved} litros de água por dia!
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-white text-blue-600 rounded-lg border border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    Tentar Novamente
                  </button>
                  <button
                    onClick={onBack}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
                  >
                    Voltar ao Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
