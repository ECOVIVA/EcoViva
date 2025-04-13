import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Leaf, Info, X } from 'lucide-react';
import api from '../../services/API/axios';
import routes from '../../services/API/routes';

// Itens para compostagem
const compostItems = [
  {
    id: 1,
    name: "Cascas de Frutas",
    type: "compostable",
    icon: "🍎",
    description: "Restos de frutas são ótimos para compostagem, ricos em nutrientes.",
  },
  {
    id: 2,
    name: "Folhas Secas",
    type: "compostable",
    icon: "🍂",
    description: "Adicionam carbono à compostagem e ajudam na aeração.",
  },
  {
    id: 3,
    name: "Borra de Café",
    type: "compostable",
    icon: "☕",
    description: "Rica em nitrogênio, ajuda a atrair minhocas benéficas.",
  },
  {
    id: 4,
    name: "Casca de Ovo",
    type: "compostable",
    icon: "🥚",
    description: "Adiciona cálcio e minerais ao composto final.",
  },
  {
    id: 5,
    name: "Restos de Legumes",
    type: "compostable",
    icon: "🥕",
    description: "Decomposição rápida e ricos em nutrientes.",
  },
  {
    id: 6,
    name: "Saco Plástico",
    type: "non-compostable",
    icon: "🛍️",
    description: "Plásticos não se decompõem naturalmente e contaminam o composto.",
  },
  {
    id: 7,
    name: "Carne",
    type: "non-compostable",
    icon: "🥩",
    description: "Atrai pragas e pode causar mau cheiro na compostagem doméstica.",
  },
  {
    id: 8,
    name: "Laticínios",
    type: "non-compostable",
    icon: "🧀",
    description: "Pode atrair animais indesejados e causar odores.",
  },
  {
    id: 9,
    name: "Óleo de Cozinha",
    type: "non-compostable",
    icon: "🫗",
    description: "Dificulta a decomposição e pode atrair pragas.",
  },
  {
    id: 10,
    name: "Papel Toalha",
    type: "compostable",
    icon: "🧻",
    description: "Papel não tratado pode ser compostado e adiciona carbono.",
  },
  {
    id: 11,
    name: "Pilha",
    type: "non-compostable",
    icon: "🔋",
    description: "Contém metais pesados tóxicos que contaminam o solo.",
  },
  {
    id: 12,
    name: "Vidro",
    type: "non-compostable",
    icon: "🫙",
    description: "Não se decompõe e pode causar acidentes durante o manuseio do composto.",
  },
];

interface Props {
  onBack: () => void;
}

export default function Lesson3({ onBack }: Props) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [compostHealth, setCompostHealth] = useState(50); // 0-100
  const [stage, setStage] = useState(1); // 1-3 (seleção, mistura, resultado)
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showItemInfo, setShowItemInfo] = useState<number | null>(null);

  useEffect(() => {
    if (stage === 3 && compostHealth >= 70) {
      if (!isCompleted) {
        const completionApi = async() => {
          try{
          const response = await api.post(routes.study.lessons_completion.create, {lesson: 3})
  
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
    }
  }, [stage, compostHealth, isCompleted]);

  const handleItemSelect = (id: number) => {
    const item = compostItems.find((item) => item.id === id);
    if (!item) return;

    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
      if (item.type === "compostable") {
        setCompostHealth((prev) => Math.max(0, prev - 10));
      } else {
        setCompostHealth((prev) => Math.min(100, prev + 10));
      }
      setScore((prev) => Math.max(0, prev - 5));
    } else {
      setSelectedItems([...selectedItems, id]);
      if (item.type === "compostable") {
        setCompostHealth((prev) => Math.min(100, prev + 10));
        setScore((prev) => prev + 10);
        showToast('Boa escolha!', `${item.name} é ótimo para compostagem.`, true);
      } else {
        setCompostHealth((prev) => Math.max(0, prev - 15));
        setScore((prev) => Math.max(0, prev - 5));
        showToast('Cuidado!', `${item.name} não deve ir para compostagem.`, false);
      }
    }
  };

  const handleNextStage = () => {
    if (stage < 3) {
      setStage((prev) => prev + 1);
      if (stage === 2 && compostHealth >= 70) {
        setScore((prev) => prev + 20);
      }
    }
  };

  const handleReset = () => {
    setSelectedItems([]);
    setCompostHealth(50);
    setStage(1);
    setScore(0);
    setIsCompleted(false);
  };

  const getCompostHealthText = () => {
    if (compostHealth >= 80) return "Excelente";
    if (compostHealth >= 60) return "Bom";
    if (compostHealth >= 40) return "Regular";
    if (compostHealth >= 20) return "Ruim";
    return "Péssimo";
  };

  const getCompostHealthColor = () => {
    if (compostHealth >= 80) return "text-green-600";
    if (compostHealth >= 60) return "text-green-500";
    if (compostHealth >= 40) return "text-yellow-500";
    if (compostHealth >= 20) return "text-orange-500";
    return "text-red-500";
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
              <h2 className="text-3xl font-bold text-green-700">Lição 3: Compostagem Básica</h2>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 hover:bg-green-50 rounded-full transition-colors"
              >
                <Info className="h-6 w-6 text-green-700" />
              </button>
            </div>

            {showInfo && (
              <div className="bg-green-50 border border-green-200 p-6 rounded-xl mb-6">
                <h3 className="font-bold text-xl text-green-800 mb-3">Sobre Compostagem</h3>
                <p className="text-green-700 mb-3">
                  Compostagem é o processo natural de decomposição de materiais orgânicos que resulta em um rico
                  fertilizante. Nem todos os materiais podem ser compostados - alguns podem contaminar o composto ou
                  atrair pragas.
                </p>
                <p className="text-green-700">
                  Nesta atividade, você aprenderá quais materiais são adequados para compostagem doméstica.
                </p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Estágio {stage}/3</span>
                <span className={`text-sm font-medium ${getCompostHealthColor()}`}>
                  Saúde da Compostagem: {getCompostHealthText()} ({compostHealth}%)
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    compostHealth >= 60
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : compostHealth >= 30
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                      : "bg-gradient-to-r from-red-500 to-rose-500"
                  }`}
                  style={{ width: `${compostHealth}%` }}
                />
              </div>
            </div>

            {stage === 1 && (
              <div>
                <h3 className="font-semibold mb-3 text-green-700">Selecione os materiais para sua composteira</h3>
                <p className="text-gray-600 mb-4">
                  Clique nos itens que você acredita que podem ser compostados. Escolha com cuidado!
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                  {compostItems.map((item) => (
                    <div key={item.id} className="relative">
                      <button
                        onClick={() => handleItemSelect(item.id)}
                        className={`w-full p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                          selectedItems.includes(item.id)
                            ? "bg-amber-100 border-amber-400"
                            : "bg-gray-50 border-gray-200 hover:border-amber-300"
                        }`}
                        aria-label={`${item.name} - Clique para ${
                          selectedItems.includes(item.id) ? "remover da" : "adicionar à"
                        } composteira`}
                      >
                        <span className="text-3xl" role="img" aria-hidden="true">
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium text-center">{item.name}</span>
                      </button>
                      <button
                        onClick={() => setShowItemInfo(showItemInfo === item.id ? null : item.id)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm hover:bg-gray-300 transition-colors"
                        aria-label={`Informações sobre ${item.name}`}
                      >
                        i
                      </button>

                      {showItemInfo === item.id && (
                        <div className="absolute z-10 top-full left-0 right-0 mt-2 p-3 bg-white rounded-lg shadow-lg text-sm">
                          <p className="text-gray-700">{item.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNextStage}
                    disabled={selectedItems.length === 0}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próximo Estágio
                  </button>
                </div>
              </div>
            )}

            {stage === 2 && (
              <div>
                <h3 className="font-semibold mb-3 text-green-700">Misturando sua composteira</h3>

                <div className="bg-amber-100 rounded-xl p-6 mb-6 relative overflow-hidden">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {selectedItems.map((id) => {
                      const item = compostItems.find((item) => item.id === id);
                      return (
                        <div
                          key={id}
                          className={`p-3 rounded-lg ${
                            item?.type === "compostable" ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          <span className="text-2xl mr-2" role="img" aria-hidden="true">
                            {item?.icon}
                          </span>
                          <span className="text-sm font-medium">{item?.name}</span>
                          {item?.type === "compostable" ? (
                            <Check className="inline h-4 w-4 text-green-500 ml-2" />
                          ) : (
                            <X className="inline h-4 w-4 text-red-500 ml-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="h-40 bg-gradient-to-b from-amber-200 to-amber-600 rounded-xl flex items-center justify-center relative">
                    {selectedItems.filter((id) => {
                      const item = compostItems.find((item) => item.id === id);
                      return item?.type === "compostable";
                    }).length >= 4 ? (
                      <div className="text-center">
                        <span className="text-5xl" role="img" aria-label="Compostagem saudável">
                          🌱
                        </span>
                        <p className="font-medium text-amber-800 mt-2">
                          Sua compostagem está progredindo bem!
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-5xl" role="img" aria-label="Compostagem com problemas">
                          ⚠️
                        </span>
                        <p className="font-medium text-amber-800 mt-2">
                          Sua compostagem precisa de mais materiais adequados.
                        </p>
                      </div>
                    )}

                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-8 h-8 opacity-50 animate-bounce"
                        style={{
                          left: `${Math.random() * 90}%`,
                          top: `${Math.random() * 80}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1 + Math.random() * 2}s`,
                        }}
                      >
                        {selectedItems[Math.floor(Math.random() * selectedItems.length)] && (
                          <span className="text-2xl">
                            {
                              compostItems.find(
                                (item) =>
                                  item.id ===
                                  selectedItems[Math.floor(Math.random() * selectedItems.length)]
                              )?.icon
                            }
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNextStage}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Ver Resultado
                  </button>
                </div>
              </div>
            )}

            {stage === 3 && (
              <div>
                <h3 className="font-semibold mb-3 text-green-700">Resultado da sua Compostagem</h3>

                <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-xl p-8 mb-6 text-center">
                  {compostHealth >= 70 ? (
                    <div>
                      <div className="w-40 h-40 mx-auto bg-gradient-to-b from-amber-600 to-amber-800 rounded-full flex items-center justify-center mb-6">
                        <span className="text-7xl" role="img" aria-label="Composto saudável">
                          🌱
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold text-green-700 mb-3">Parabéns!</h4>
                      <p className="text-green-600 mb-4">
                        Você criou um composto saudável que pode ser usado para nutrir plantas e jardins.
                      </p>
                    </div>
                  ) : compostHealth >= 40 ? (
                    <div>
                      <div className="w-40 h-40 mx-auto bg-gradient-to-b from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6">
                        <span className="text-7xl" role="img" aria-label="Composto médio">
                          🌿
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold text-yellow-700 mb-3">Quase lá!</h4>
                      <p className="text-yellow-600 mb-4">
                        Seu composto está razoável, mas poderia ser melhor com uma seleção mais cuidadosa de
                        materiais.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-40 h-40 mx-auto bg-gradient-to-b from-amber-300 to-amber-500 rounded-full flex items-center justify-center mb-6">
                        <span className="text-7xl" role="img" aria-label="Composto ruim">
                          ⚠️
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold text-red-700 mb-3">Precisa melhorar</h4>
                      <p className="text-red-600 mb-4">
                        Sua compostagem não foi bem-sucedida. Você incluiu muitos materiais inadequados.
                      </p>
                    </div>
                  )}

                  <div className="bg-white p-6 rounded-xl">
                    <h5 className="font-semibold mb-3">O que você aprendeu:</h5>
                    <ul className="text-left space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">
                          Materiais orgânicos como restos de frutas, vegetais e cascas de ovos são ideais para
                          compostagem.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">
                          Evite adicionar carnes, laticínios, óleos e materiais não biodegradáveis.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">
                          Uma boa compostagem precisa de um equilíbrio entre materiais ricos em carbono e
                          nitrogênio.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Tentar Novamente
                  </button>

                  {compostHealth >= 70 && (
                    <button
                      onClick={onBack}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Voltar ao Menu
                    </button>
                  )}
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200 text-center">
                <h3 className="text-2xl font-bold text-green-700 mb-3">
                  🎉 Parabéns! Você completou a Lição 3
                </h3>
                <p className="text-gray-700 mb-4">
                  Você aprendeu os princípios básicos da compostagem e como transformar resíduos orgânicos em
                  adubo natural.
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
                  Use Tab para navegar entre os elementos e Enter para selecioná-los.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-gray-700">
                  Cada item tem uma descrição detalhada acessível por leitores de tela.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-500 mt-1" />
                <span className="text-gray-700">
                  O botão "i" ao lado de cada item fornece informações adicionais.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}