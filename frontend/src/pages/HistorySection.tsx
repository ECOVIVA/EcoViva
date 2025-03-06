import React from 'react';
import { Leaf, Recycle, School, TreePine, Globe2, ArrowDownCircle, Sprout, Award, Users, Target } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Hero Section with Hexagonal Image */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ clipPath: 'polygon(0% 0%, 100% 0, 100% 84%, 30% 94%, 0 57%)' }}>
          <div
            className="absolute inset-0 transform scale-110"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.3)',
            }}
          />
        </div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-7xl font-bold text-green-400 mb-6 animate-fade-in">
            ECO<span className="text-white">viva</span>
          </h1>
          <p className="text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-delayed">
            Transformando o futuro através da sustentabilidade e educação ambiental
          </p>
          <div className="flex justify-center gap-6 mb-12 animate-fade-in-delayed-2">
            <span className="px-6 py-2 bg-green-500/20 backdrop-blur-sm rounded-full text-white">Inovação Verde</span>
            <span className="px-6 py-2 bg-green-500/20 backdrop-blur-sm rounded-full text-white">Educação</span>
            <span className="px-6 py-2 bg-green-500/20 backdrop-blur-sm rounded-full text-white">Sustentabilidade</span>
          </div>
          <ArrowDownCircle className="w-12 h-12 text-green-400 mx-auto animate-bounce cursor-pointer" />
        </div>
      </header>

      {/* History Section */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative">
          <h2 className="text-5xl font-bold text-green-800 text-center mb-16">Nossa História</h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="bg-green-50 p-8 rounded-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-xl">
                <Sprout className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-green-800 mb-3">2018: O Início</h3>
                <p className="text-gray-600">
                  Nascemos do sonho de transformar a relação entre tecnologia e sustentabilidade.
                  Três jovens empreendedores uniram forças para criar soluções inovadoras em reciclagem.
                </p>
              </div>

              <div className="bg-green-50 p-8 rounded-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-xl">
                <Award className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-green-800 mb-3">2020: Reconhecimento</h3>
                <p className="text-gray-600">
                  Premiados como startup mais inovadora em sustentabilidade,
                  expandimos nossa atuação para programas educacionais.
                </p>
              </div>

              <div className="bg-green-50 p-8 rounded-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-xl">
                <Target className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-green-800 mb-3">2024: Expansão</h3>
                <p className="text-gray-600">
                  Hoje, impactamos mais de 100 escolas e desenvolvemos tecnologias
                  que revolucionam a gestão de resíduos em todo o país.
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className="overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500"
                style={{
                  clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 25% 100%, 0% 50%)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="ECOviva Impact"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section with Floating Cards */}
      <section className="py-24 px-4 bg-gradient-to-br from-green-800 to-green-900 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-10"></div>
        <div className="max-w-6xl mx-auto relative">
          <h2 className="text-5xl font-bold text-white text-center mb-20">Nossa Missão</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="w-12 h-12 text-green-500" />,
                title: "Sustentabilidade",
                description: "Promovemos práticas sustentáveis e inovadoras para um futuro mais verde, desenvolvendo tecnologias que otimizam o processo de reciclagem."
              },
              {
                icon: <School className="w-12 h-12 text-green-500" />,
                title: "Educação",
                description: "Conscientizamos as novas gerações através de programas educacionais interativos e envolventes nas escolas."
              },
              {
                icon: <Recycle className="w-12 h-12 text-green-500" />,
                title: "Inovação",
                description: "Desenvolvemos soluções tecnológicas de ponta para tornar a reciclagem mais eficiente e acessível a todos."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl hover:transform hover:scale-105 transition-all duration-500 hover:shadow-2xl border border-white/20"
              >
                <div className="mb-6 transform hover:rotate-12 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-4">{item.title}</h3>
                <p className="text-green-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section with Animated Stats */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-green-800 text-center mb-20">Nosso Impacto</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-10 rounded-[3rem] transform hover:scale-105 transition-all duration-500 hover:shadow-xl">
              <Globe2 className="w-16 h-16 text-green-700 mb-8" />
              <h3 className="text-3xl font-bold text-green-900 mb-6">Tecnologia Verde</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-700 rounded-full"></div>
                  Processamento de 1000+ toneladas de resíduos mensalmente
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Redução de 45% no tempo de triagem de materiais
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Sistema IoT em 50+ centros de reciclagem
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-10 rounded-[3rem] transform hover:scale-105 transition-all duration-500 hover:shadow-xl">
              <TreePine className="w-16 h-16 text-green-500 mb-8" />
              <h3 className="text-3xl font-bold text-green-800 mb-6">Educação Ambiental</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  100+ escolas parceiras em todo o Brasil
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  50.000+ alunos impactados pelos nossos programas
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  30+ projetos ambientais implementados
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-green-800 text-center mb-20">Nossa Equipe</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Users className="w-16 h-16 text-green-500" />,
                title: "Especialistas",
                description: "Nossa equipe multidisciplinar reúne especialistas em tecnologia, educação e sustentabilidade."
              },
              {
                icon: <Target className="w-16 h-16 text-green-500" />,
                title: "Comprometimento",
                description: "Dedicados a criar soluções inovadoras que impactam positivamente o meio ambiente."
              },
              {
                icon: <Award className="w-16 h-16 text-green-500" />,
                title: "Reconhecimento",
                description: "Premiados por nossas iniciativas em sustentabilidade e inovação tecnológica."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-10 rounded-[2rem] transform hover:scale-105 transition-all duration-500 hover:shadow-xl text-center"
              >
                <div className="mb-6 mx-auto w-fit">{item.icon}</div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section with Geometric Background */}
      <section className="py-24 px-4 bg-gradient-to-br from-green-800 to-green-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: `${Math.random() * 400 + 200}px`,
                  height: `${Math.random() * 400 + 200}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `translate(-50%, -50%) scale(${Math.random() + 0.5})`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-5xl font-bold text-white mb-8">Faça Parte da Mudança</h2>
          <p className="text-2xl text-green-100 mb-12">
            Junte-se a nós nessa missão de criar um mundo mais sustentável
          </p>
          <button className="bg-green-500 text-white px-12 py-6 rounded-full text-xl font-semibold hover:bg-green-400 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/20">
            Entre em Contato
          </button>
        </div>
      </section>


    </div>
  );
}

export default App;