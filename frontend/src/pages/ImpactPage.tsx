import React, { useEffect, useState } from 'react';
import { Leaf, TreePine, Droplets, Wind, Sprout, Bird, Factory, Recycle, Scale } from 'lucide-react';

const ImpactPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleVisibility = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.75;
        setIsVisible(prev => ({
          ...prev,
          [section.id]: isVisible
        }));
      });
    };

    window.addEventListener('scroll', () => {
      handleScroll();
      handleVisibility();
    });
    handleVisibility(); // Check initial visibility

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.5}px)`,
  };

  const impactMetrics = [
    { icon: TreePine, value: '1.2M', label: 'Árvores Preservadas' },
    { icon: Recycle, value: '50K', label: 'Toneladas Recicladas' },
    { icon: Droplets, value: '800M', label: 'Litros de Água Economizados' },
    { icon: Factory, value: '-30%', label: 'Redução de Emissões de CO₂' },
  ];

  const ecosystemsProtected = [
    {
      title: 'Florestas Tropicais',
      icon: TreePine,
      description: 'Preservação de mais de 500 hectares de mata nativa',
      impact: 'Proteção de 150 espécies endêmicas'
    },
    {
      title: 'Recursos Hídricos',
      icon: Droplets,
      description: 'Conservação de bacias hidrográficas',
      impact: 'Recuperação de 20 nascentes'
    },
    {
      title: 'Qualidade do Ar',
      icon: Wind,
      description: 'Redução da poluição atmosférica',
      impact: 'Equivalente a 10.000 carros fora das ruas'
    },
    {
      title: 'Biodiversidade',
      icon: Bird,
      description: 'Proteção da fauna e flora local',
      impact: 'Aumento de 40% na população de espécies ameaçadas'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80')] bg-cover bg-center"
          style={parallaxStyle}
        >
          <div className="absolute inset-0 bg-green-900/50 backdrop-blur-sm"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeInUp">
            Nosso Impacto Ambiental
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Transformando o presente para garantir um futuro sustentável
          </p>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Leaf className="h-12 w-12 text-white" />
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactMetrics.map((metric, index) => (
              <div 
                key={metric.label}
                className="animate-on-scroll"
                id={`metric-${index}`}
                style={{ 
                  animation: isVisible[`metric-${index}`] ? 'fadeInUp 0.6s ease-out forwards' : 'none',
                  animationDelay: `${index * 0.2}s`,
                  opacity: isVisible[`metric-${index}`] ? 1 : 0
                }}
              >
                <div className="bg-green-50 rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <metric.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-4xl font-bold text-green-800 mb-2">{metric.value}</h3>
                  <p className="text-green-600">{metric.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Protection */}
      <section className="py-20 bg-gradient-to-r from-green-900 to-green-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80')] bg-cover bg-center"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16">
            Ecossistemas Protegidos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ecosystemsProtected.map((eco, index) => (
              <div 
                key={eco.title}
                className="animate-on-scroll"
                id={`eco-${index}`}
                style={{ 
                  animation: isVisible[`eco-${index}`] ? 'slideInRight 0.6s ease-out forwards' : 'none',
                  animationDelay: `${index * 0.2}s`,
                  opacity: isVisible[`eco-${index}`] ? 1 : 0
                }}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-colors duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-500/20 p-4 rounded-full">
                      <eco.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">{eco.title}</h3>
                      <p className="text-green-100 mb-4">{eco.description}</p>
                      <div className="flex items-center space-x-2 text-green-300">
                        <Scale className="h-5 w-5" />
                        <span>{eco.impact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Impact Map */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-16">
            Nosso Alcance Global
          </h2>
          
          <div className="bg-green-50 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div 
                className="animate-on-scroll"
                id="map-content"
                style={{ 
                  animation: isVisible['map-content'] ? 'fadeInUp 0.6s ease-out forwards' : 'none',
                  opacity: isVisible['map-content'] ? 1 : 0
                }}
              >
                <h3 className="text-2xl font-semibold text-green-800 mb-6">
                  Presença Internacional
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>12 países alcançados</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>50+ parcerias globais</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>200+ projetos ativos</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>1M+ de pessoas impactadas</span>
                  </li>
                </ul>
              </div>
              
              <div 
                className="animate-on-scroll relative"
                id="map-image"
                style={{ 
                  animation: isVisible['map-image'] ? 'scaleIn 0.6s ease-out forwards' : 'none',
                  opacity: isVisible['map-image'] ? 1 : 0
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1589519160732-57fc498494f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                  alt="Mapa de Impacto Global"
                  className="rounded-2xl shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-green-600 text-white p-4 rounded-full shadow-lg">
                  <Sprout className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-green-900 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div 
            className="animate-on-scroll"
            id="cta"
            style={{ 
              animation: isVisible['cta'] ? 'fadeInUp 0.6s ease-out forwards' : 'none',
              opacity: isVisible['cta'] ? 1 : 0
            }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Faça Parte da Mudança
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-12">
              Cada pequena ação conta. Junte-se a nós nessa missão de 
              transformar o mundo em um lugar mais sustentável.
            </p>
            <button className="bg-white text-green-800 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-100 transition-colors duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Comece Sua Jornada Verde
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImpactPage;