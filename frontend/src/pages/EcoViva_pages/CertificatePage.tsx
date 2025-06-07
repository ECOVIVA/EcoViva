import { Leaf, Award, School, Users, ChevronDown } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
         
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <Leaf className="h-20 w-20 text-green-600 mx-auto mb-6 animate-bounce" />
            <h1 className="text-5xl font-bold text-green-800 mb-4">
              Certificação EXPOtec
            </h1>
            <p className="text-2xl text-green-700 mb-8">
              Ecoviva - Inovação em Sustentabilidade
            </p>
            <ChevronDown className="h-8 w-8 text-green-600 mx-auto animate-bounce" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Event Details */}
          <div className="bg-white rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <Award className="h-12 w-12 text-green-600 mb-6" />
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Apresentação de Excelência
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              A EXPOtec, realizada no centro de Guarulhos/SP, representa uma 
              plataforma excepcional para a apresentação de projetos inovadores 
              em sustentabilidade. Este evento reúne mentes brilhantes e 
              projetos revolucionários, proporcionando visibilidade e 
              reconhecimento aos participantes.
            </p>
          </div>

          {/* Academic Recognition */}
          <div className="bg-white rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <School className="h-12 w-12 text-green-600 mb-6" />
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Reconhecimento Acadêmico
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Os projetos foram avaliados por uma banca especializada composta 
              por professores de renomadas universidades e instituições 
              educacionais de São Paulo, garantindo uma análise criteriosa e 
              profissional das iniciativas apresentadas.
            </p>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mt-16">
          <div className="bg-green-700 rounded-3xl p-12 text-white shadow-xl">
            <Users className="h-16 w-16 mb-8 animate-pulse" />
            <h2 className="text-4xl font-bold mb-6">
              Impacto e Reconhecimento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">50+</div>
                <div className="text-xl">Projetos Apresentados</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">30+</div>
                <div className="text-xl">Instituições Participantes</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">100%</div>
                <div className="text-xl">Compromisso Ambiental</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
   

    </div>
  );
}

export default App;