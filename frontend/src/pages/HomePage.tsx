import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Recycle, Users, Award, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')] bg-cover bg-center opacity-60 rounded-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block p-2 bg-green-100 rounded-full mb-4">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
              Transforme o Planeta com Cada Reciclagem
            </h1>
            <p className="text-xl text-green-200 mb-8">
              Junte-se à comunidade EcoViva e faça parte da revolução sustentável. 
              Registre suas reciclagens diárias e veja seu impacto crescer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login" 
                className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors shadow-md"
              >
                Começar Agora
              </Link>
              <a 
                href="#about" 
                className="px-8 py-3 bg-white text-green-700 rounded-full font-semibold hover:bg-green-50 transition-colors shadow-md border border-green-200"
              >
                Saiba Mais
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Como Funciona</h2>
            <p className="text-lg text-green-700 max-w-2xl mx-auto">
              Nossa plataforma torna fácil e divertido acompanhar seu impacto ambiental positivo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Recycle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-3 text-center">Recicle Diariamente</h3>
              <p className="text-green-700 text-center">
                Separe seus resíduos e recicle-os corretamente. Cada pequena ação conta para um planeta mais limpo.
              </p>
            </div>
            
            <div className="bg-green-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-3 text-center">Faça Check-in</h3>
              <p className="text-green-700 text-center">
                Registre sua reciclagem diária na plataforma e veja sua bolha de impacto crescer com o tempo.
              </p>
            </div>
            
            <div className="bg-green-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-3 text-center">Conecte-se</h3>
              <p className="text-green-700 text-center">
                Participe do nosso fórum para compartilhar dicas, experiências e inspirar outros na jornada sustentável.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-20 bg-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="EcoViva Team" 
                className="rounded-lg shadow-xl"
              />
            </div>
            
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-green-300 mb-6">Sobre a EcoViva</h2>
              <p className="text-green-100 mb-6 text-lg">
                Fundada em 2020, a EcoViva nasceu da paixão por um planeta mais sustentável. 
                Nossa missão é incentivar práticas de reciclagem diárias e construir uma 
                comunidade engajada na preservação ambiental.
              </p>
              <p className="text-green-100 mb-8 text-lg">
                Acreditamos que pequenas ações consistentes podem gerar um grande impacto. 
                Por isso, desenvolvemos uma plataforma que torna a reciclagem uma atividade 
                gratificante e mensurável.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-700 p-2 rounded-full">
                    <Recycle className="h-5 w-5 text-green-300" />
                  </div>
                  <span>+50 toneladas recicladas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-700 p-2 rounded-full">
                    <Users className="h-5 w-5 text-green-300" />
                  </div>
                  <span>+10.000 usuários ativos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-700 p-2 rounded-full">
                    <Award className="h-5 w-5 text-green-300" />
                  </div>
                  <span>5 prêmios ambientais</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-700 p-2 rounded-full">
                    <Leaf className="h-5 w-5 text-green-300" />
                  </div>
                  <span>+100 projetos apoiados</span>
                </div>
              </div>
              
              <Link 
                to="/forum" 
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors shadow-md"
              >
                Conheça Nossa Comunidade
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para fazer a diferença?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas comprometidas com um futuro mais sustentável. 
            Cada check-in é um passo em direção a um planeta mais limpo.
          </p>
          <Link 
            to="/login" 
            className="px-8 py-4 bg-white text-green-600 rounded-full font-semibold text-lg hover:bg-green-50 transition-colors shadow-lg inline-flex items-center"
          >
            Comece Sua Jornada
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;