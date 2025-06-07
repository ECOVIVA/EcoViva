import { Leaf, TreePine, Sprout } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">     
      {/* Main content */}
      <div className="relative container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center text-green-800 mb-8">
          Nossas Parcerias
        </h1>
        
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            {/* Logos Section */}
            <div className="flex items-center gap-8">
              {/* EcoViva Logo */}
              <div className="w-32 h-32 flex items-center justify-center bg-green-100 rounded-full p-4">
                <Leaf className="w-20 h-20 text-green-600" />
              </div>
              
              {/* Plus sign */}
              <div className="text-4xl text-green-600 font-light">+</div>
              
              {/* Bleya Logo */}
              <div className="w-32 h-32 flex items-center justify-center bg-black rounded-full p-4">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
                  <path d="M50 95C75 95 95 75 95 50C95 25 75 5 50 5C25 5 5 25 5 50C5 75 25 95 50 95Z" fill="#000000"/>
                  <circle cx="35" cy="30" r="3" fill="white"/>
                  <circle cx="40" cy="15" r="3" fill="white"/>
                  <circle cx="50" cy="25" r="3" fill="white"/>
                  <circle cx="65" cy="30" r="3" fill="white"/>
                  <circle cx="75" cy="40" r="3" fill="white"/>
                  <path d="M50 35V50M50 50H40M50 50H60" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                  <path d="M30 60H45M55 60H70" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                  <path d="M25 70H40M60 70H75" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Partnership Description */}
          <div className="space-y-6 text-gray-700">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Uma Parceria para um Futuro Sustentável
            </h2>
            
            <p className="text-lg leading-relaxed">
              A Bleya tem sido fundamental no desenvolvimento tecnológico da EcoViva, 
              trazendo inovação e excelência técnica para nossa missão de criar um 
              mundo mais sustentável. Como parceira estratégica, a Bleya contribuiu 
              significativamente para a construção de nossas soluções digitais e 
              plataformas tecnológicas.
            </p>

            <div className="bg-green-50 rounded-xl p-6 mt-8">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                Sobre a Bleya
              </h3>
              <p className="text-gray-700">
                A Bleya é uma empresa inovadora especializada em desenvolvimento de 
                tecnologias sustentáveis e soluções digitais de ponta. Com uma equipe 
                altamente qualificada e comprometida com a excelência, a Bleya tem se 
                destacado no mercado por sua abordagem única que combina tecnologia 
                avançada com responsabilidade ambiental.
              </p>
            </div>
          </div>
        </div>

        {/* Environmental Impact Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-green-600 mb-4">
              <Leaf className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Inovação Verde
            </h3>
            <p className="text-gray-600">
              Desenvolvimento de soluções tecnológicas sustentáveis que respeitam o meio ambiente.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-green-600 mb-4">
              <TreePine className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Compromisso Ambiental
            </h3>
            <p className="text-gray-600">
              Práticas sustentáveis em todos os processos de desenvolvimento e operação.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-green-600 mb-4">
              <Sprout className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Futuro Sustentável
            </h3>
            <p className="text-gray-600">
              Construindo juntos um futuro mais verde e tecnologicamente avançado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;