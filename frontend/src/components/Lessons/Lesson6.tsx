import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Check, Info, Zap } from 'lucide-react';
import api from '../../services/API/axios';
import routes from '../../services/API/routes';

interface EnergySource {
  id: number;
  name: string;
  icon: string;
  description: string;
  efficiency: number;
  color: string;
}

interface EnergyUse {
  id: number;
  name: string;
  icon: string;
  compatibleSources: number[];
  description: string;
  impact: string;
}

interface Connection {
  source: number;
  use: number;
}

interface Props {
  onBack: () => void;
}

const energySources: EnergySource[] = [
  { 
    id: 1, 
    name: "Energia Solar", 
    icon: "☀️", 
    color: "bg-yellow-100 border-yellow-400",
    description: "Energia obtida através da conversão da luz solar em eletricidade",
    efficiency: 20
  },
  { 
    id: 2, 
    name: "Energia Eólica", 
    icon: "🌬️", 
    color: "bg-blue-100 border-blue-400",
    description: "Energia gerada pelo movimento dos ventos",
    efficiency: 35
  },
  { 
    id: 3, 
    name: "Energia Hidrelétrica", 
    icon: "💧", 
    color: "bg-cyan-100 border-cyan-400",
    description: "Energia gerada pela força da água em movimento",
    efficiency: 90
  },
  { 
    id: 4, 
    name: "Biomassa", 
    icon: "🌱", 
    color: "bg-green-100 border-green-400",
    description: "Energia obtida através da decomposição de materiais orgânicos",
    efficiency: 60
  },
  { 
    id: 5, 
    name: "Energia Geotérmica", 
    icon: "🌋", 
    color: "bg-red-100 border-red-400",
    description: "Energia proveniente do calor interno da Terra",
    efficiency: 70
  }
];

const energyUses: EnergyUse[] = [
  {
    id: 1,
    name: "Aquecimento de Água",
    icon: "🚿",
    compatibleSources: [1, 5],
    description: "Aquecimento de água para uso doméstico e comercial",
    impact: "Redução de 70% no consumo de energia elétrica para aquecimento"
  },
  {
    id: 2,
    name: "Geração de Eletricidade",
    icon: "💡",
    compatibleSources: [1, 2, 3, 4, 5],
    description: "Produção de energia elétrica para diversos fins",
    impact: "Potencial de substituição total de fontes não-renováveis"
  },
  {
    id: 3,
    name: "Transporte",
    icon: "🚗",
    compatibleSources: [1, 4],
    description: "Alimentação de veículos elétricos ou biocombustíveis",
    impact: "Redução de até 90% na emissão de gases de efeito estufa"
  },
  {
    id: 4,
    name: "Climatização",
    icon: "❄️",
    compatibleSources: [1, 2, 5],
    description: "Aquecimento e refrigeração de ambientes",
    impact: "Economia de até 60% em custos de climatização"
  },
  {
    id: 5,
    name: "Processos Industriais",
    icon: "🏭",
    compatibleSources: [1, 2, 3, 4, 5],
    description: "Fornecimento de energia para indústrias",
    impact: "Redução significativa na pegada de carbono industrial"
  }
];

export default function Lesson6({ onBack }: Props) {
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [selectedUse, setSelectedUse] = useState<number | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const [efficiency, setEfficiency] = useState(0);
  const [animation, setAnimation] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const allUsesConnected = energyUses.every(use => 
      connections.some(conn => conn.use === use.id)
    );

    if (allUsesConnected && !isCompleted) {
      const completionApi = async() => {
        try{
        const response = await api.post(routes.study.lessons_completion.create, {lesson: 6})
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

      setScore(prev => prev + 50);
      showToast('Parabéns!', 'Você conectou todas as fontes de energia renovável aos seus usos!', true);
      setAnimation('complete');
    }
  }, [connections, isCompleted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      connections.forEach((conn) => {
        const sourceEl = document.getElementById(`source-${conn.source}`);
        const useEl = document.getElementById(`use-${conn.use}`);

        if (sourceEl && useEl) {
          const sourceRect = sourceEl.getBoundingClientRect();
          const useRect = useEl.getBoundingClientRect();
          const canvasRect = canvas.getBoundingClientRect();

          const startX = sourceRect.right - canvasRect.left;
          const startY = sourceRect.top + sourceRect.height / 2 - canvasRect.top;
          const endX = useRect.left - canvasRect.left;
          const endY = useRect.top + useRect.height / 2 - canvasRect.top;

          // Animated gradient line
          const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
          gradient.addColorStop(0, '#60A5FA');
          gradient.addColorStop(1, '#34D399');

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';

          // Animated flow effect
          const time = Date.now() / 1000;
          const dashLength = 20;
          ctx.setLineDash([dashLength, dashLength]);
          ctx.lineDashOffset = -time * 50;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(
            startX + 100, startY,
            endX - 100, endY,
            endX, endY
          );
          ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [connections]);

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

  const handleSourceSelect = (id: number) => {
    setSelectedSource(id);
    setSelectedUse(null);
    setAnimation('source-selected');
    
    const source = energySources.find(s => s.id === id);
    if (source) {
      setEfficiency(source.efficiency);
    }
  };

  const handleUseSelect = (id: number) => {
    if (selectedSource !== null) {
      const use = energyUses.find(u => u.id === id);
      
      if (use && use.compatibleSources.includes(selectedSource)) {
        const existingIndex = connections.findIndex(conn => conn.use === id);
        
        if (existingIndex !== -1) {
          const newConnections = [...connections];
          newConnections[existingIndex] = { source: selectedSource, use: id };
          setConnections(newConnections);
        } else {
          setConnections([...connections, { source: selectedSource, use: id }]);
        }
        
        setScore(prev => prev + 10);
        setAnimation('connection-success');
        showToast('Conexão correta!', 
          `${energySources.find(s => s.id === selectedSource)?.name} pode ser usada para ${use.name}`,
          true
        );
      } else {
        setAnimation('connection-error');
        showToast('Conexão incorreta!', 
          'Esta fonte de energia não é adequada para este uso.',
          false
        );
      }
      
      setSelectedSource(null);
    } else {
      setSelectedUse(id);
      setSelectedSource(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Voltar</span>
                      </button>
            <div className="flex items-center gap-2">
              <Zap className="h-8 w-8" />
              <h1 className="text-2xl font-bold">EcoStudy</h1>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <span className="font-semibold">Pontos: {score}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-blue-700">Lição 6: Energia Renovável</h2>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 hover:bg-blue-50 rounded-full transition-colors"
              >
                <Info className="h-6 w-6 text-blue-700" />
              </button>
            </div>

            {showInfo && (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 p-6 rounded-xl mb-6">
                <h3 className="font-bold text-xl text-blue-800 mb-3">Sobre Energia Renovável</h3>
                <p className="text-blue-700 mb-3">
                  Energias renováveis são fontes de energia que se renovam naturalmente e têm impacto ambiental
                  reduzido em comparação com combustíveis fósseis.
                </p>
                <p className="text-blue-700">
                  Nesta atividade, você aprenderá sobre diferentes fontes de energia renovável e suas aplicações.
                  Conecte cada fonte de energia ao seu uso apropriado.
                </p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso da Lição</span>
                <span className="text-sm font-medium">
                  {connections.length}/{energyUses.length} conexões
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                  style={{ width: `${(connections.length / energyUses.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="relative">
              <canvas 
                ref={canvasRef} 
                className="absolute inset-0 pointer-events-none z-10"
                style={{ width: '100%', height: '100%' }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-bold text-xl text-blue-700 mb-4">Fontes de Energia</h3>
                  <div className="space-y-4">
                    {energySources.map((source) => (
                      <div
                        key={source.id}
                        className="relative"
                        onMouseEnter={() => setShowTooltip(source.id)}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <button
                          id={`source-${source.id}`}
                          onClick={() => handleSourceSelect(source.id)}
                          className={`
                            w-full p-4 rounded-xl border-2 flex items-center gap-3
                            transition-all duration-300 transform
                            ${selectedSource === source.id 
                              ? `ring-4 ring-blue-400 ${source.color} scale-105` 
                              : source.color}
                            hover:scale-105 hover:shadow-lg
                          `}
                        >
                          <span className="text-4xl" role="img" aria-label={source.name}>
                            {source.icon}
                          </span>
                          <div className="flex-1">
                            <div className="font-semibold">{source.name}</div>
                            <div className="text-sm text-gray-600">
                              Eficiência: {source.efficiency}%
                            </div>
                          </div>
                        </button>

                        {showTooltip === source.id && (
                          <div className="absolute z-20 left-full ml-4 top-0 w-64 p-4 bg-white rounded-xl shadow-lg border border-blue-100">
                            <h4 className="font-semibold text-blue-700 mb-2">{source.name}</h4>
                            <p className="text-sm text-gray-600">{source.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className={`
                    text-center p-6 rounded-full bg-gradient-to-r from-blue-100 to-green-100
                    transform transition-all duration-500
                    ${animation === 'source-selected' ? 'scale-110' : ''}
                    ${animation === 'connection-success' ? 'scale-110 bg-green-100' : ''}
                    ${animation === 'connection-error' ? 'scale-110 bg-red-100' : ''}
                  `}>
                    <div className="text-6xl mb-4">
                      {selectedSource !== null ? '➡️' : selectedUse !== null ? '⬅️' : '🔄'}
                    </div>
                    <p className="text-gray-700 font-medium">
                      {selectedSource !== null
                        ? "Selecione um uso para conectar"
                        : selectedUse !== null
                        ? "Selecione uma fonte de energia"
                        : "Conecte as fontes aos seus usos"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-green-700 mb-4">Usos da Energia</h3>
                  <div className="space-y-4">
                    {energyUses.map((use) => {
                      const sourceId = connections.find(conn => conn.use === use.id)?.source;
                      const source = sourceId ? energySources.find(s => s.id === sourceId) : null;

                      return (
                        <div
                          key={use.id}
                          className="relative"
                          onMouseEnter={() => setShowTooltip(use.id + 100)}
                          onMouseLeave={() => setShowTooltip(null)}
                        >
                          <button
                            id={`use-${use.id}`}
                            onClick={() => handleUseSelect(use.id)}
                            className={`
                              w-full p-4 rounded-xl border-2 flex items-center gap-3
                              transition-all duration-300 transform
                              ${selectedUse === use.id 
                                ? 'ring-4 ring-green-400 bg-green-50 scale-105' 
                                : source 
                                  ? source.color
                                  : 'bg-gray-50 border-gray-200'}
                              hover:scale-105 hover:shadow-lg
                            `}
                          >
                            <span className="text-4xl" role="img" aria-label={use.name}>
                              {use.icon}
                            </span>
                            <div className="flex-1">
                              <div className="font-semibold">{use.name}</div>
                              <div className="text-sm text-gray-600">
                                {source 
                                  ? `Conectado a ${source.name}`
                                  : 'Não conectado'}
                              </div>
                            </div>
                          </button>

                          {showTooltip === use.id + 100 && (
                            <div className="absolute z-20 right-full mr-4 top-0 w-64 p-4 bg-white rounded-xl shadow-lg border border-green-100">
                              <h4 className="font-semibold text-green-700 mb-2">{use.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{use.description}</p>
                              <p className="text-sm font-medium text-green-600">{use.impact}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {isCompleted && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl border border-blue-200 text-center">
                <h3 className="text-2xl font-bold text-blue-700 mb-3">
                  🎉 Parabéns! Você completou a Lição 6
                </h3>
                <p className="text-gray-700 mb-4">
                  Você aprendeu sobre diferentes fontes de energia renovável e suas aplicações práticas.
                  Continue explorando para descobrir mais sobre sustentabilidade!
                </p>
                <button
                  onClick={onBack}
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Voltar para o Menu Principal
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-blue-700 mb-4">Dicas de Acessibilidade</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-blue-500 mt-1" />
                <span className="text-gray-700">
                  Use Tab para navegar entre as opções e Enter para selecionar.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-blue-500 mt-1" />
                <span className="text-gray-700">
                  Cada fonte e uso tem descrições detalhadas para leitores de tela.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-blue-500 mt-1" />
                <span className="text-gray-700">
                  As conexões são indicadas por texto além das linhas visuais.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}