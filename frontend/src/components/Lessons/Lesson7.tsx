import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Info, ShoppingCart, Star, Trash2, Leaf, Droplet, Zap, BarChart2, RefreshCw } from 'lucide-react';
import { Product, Category, LessonState, EnvironmentalImpact } from '../../types/types';
import routes from '../../services/API/routes';
import api from '../../services/API/axios';

// Products for the conscious consumption lesson
const products: Product[] = [
  {
    id: 1,
    name: "Camiseta de Algodão Orgânico",
    price: 89.9,
    image: "👕",
    sustainability: 9,
    badges: ["Orgânico", "Comércio Justo", "Baixo Impacto"],
    description: "Produzida com algodão orgânico certificado, cultivado sem pesticidas ou fertilizantes sintéticos. Tingimento natural com baixo consumo de água e zero efluentes tóxicos. Fabricação em condições de comércio justo garantindo salários justos aos trabalhadores.",
    category: 1,
    carbonFootprint: 2.5,
    waterUsage: 500,
    wasteProduction: 0.2,
    energy: 4.3,
    locallySourced: true,
    lifespan: 36,
    recyclable: true,
    ingredients: ["Algodão orgânico certificado", "Tintas naturais", "Botões de coco"]
  },
  {
    id: 2,
    name: "Camiseta Convencional",
    price: 39.9,
    image: "👕",
    sustainability: 3,
    badges: [],
    description: "Camiseta de algodão convencional, produzida com métodos tradicionais de cultivo que utilizam pesticidas e grandes quantidades de água. Processo de tingimento químico e fabricação em escala industrial.",
    category: 1,
    carbonFootprint: 8.7,
    waterUsage: 2700,
    wasteProduction: 1.2,
    energy: 10.5,
    locallySourced: false,
    lifespan: 12,
    recyclable: false
  },
  {
    id: 3,
    name: "Sabão em Pó Biodegradável",
    price: 28.9,
    image: "🧼",
    sustainability: 8,
    badges: ["Biodegradável", "Sem Fosfatos", "Embalagem Reciclável"],
    description: "Sabão em pó biodegradável formulado com enzimas naturais que não contaminam cursos d'água. Sem fosfatos ou sulfatos agressivos. Embalagem produzida com papel 100% reciclado e reciclável.",
    category: 2,
    carbonFootprint: 3.2,
    waterUsage: 200,
    wasteProduction: 0.3,
    energy: 5.1,
    locallySourced: true,
    lifespan: 6,
    recyclable: true,
    ingredients: ["Carbonato de sódio", "Silicato de sódio", "Enzimas naturais", "Surfactantes biodegradáveis"]
  },
  {
    id: 4,
    name: "Sabão em Pó Comum",
    price: 18.9,
    image: "🧼",
    sustainability: 2,
    badges: [],
    description: "Sabão em pó convencional contendo fosfatos e componentes químicos que podem causar eutrofização de lagos e rios. Embalagem mista de difícil reciclagem.",
    category: 2,
    carbonFootprint: 7.8,
    waterUsage: 450,
    wasteProduction: 1.4,
    energy: 9.2,
    locallySourced: false,
    lifespan: 6,
    recyclable: false
  },
  {
    id: 5,
    name: "Garrafa Reutilizável",
    price: 59.9,
    image: "🍶",
    sustainability: 10,
    badges: ["Reutilizável", "Livre de BPA", "Produção Carbono-Zero"],
    description: "Garrafa de aço inoxidável durável com vida útil estimada de 12+ anos, eliminando o consumo de centenas de garrafas plásticas. Fabricada em instalação carbono-zero usando energia renovável.",
    category: 3,
    carbonFootprint: 1.2,
    waterUsage: 100,
    wasteProduction: 0.1,
    energy: 3.2,
    locallySourced: true,
    lifespan: 144,
    recyclable: true
  },
  {
    id: 6,
    name: "Garrafa de Água Descartável",
    price: 2.5,
    image: "🍶",
    sustainability: 1,
    badges: [],
    description: "Garrafa de plástico descartável feita de PET virgem. Após uso único, a maioria acaba em aterros ou oceanos, onde leva até 450 anos para se decompor, liberando microplásticos no ambiente.",
    category: 3,
    carbonFootprint: 12.4,
    waterUsage: 300,
    wasteProduction: 2.5,
    energy: 11.3,
    locallySourced: false,
    lifespan: 1,
    recyclable: true
  },
  {
    id: 7,
    name: "Frutas Orgânicas Locais",
    price: 15.9,
    image: "🍎",
    sustainability: 9,
    badges: ["Orgânico", "Local", "Sazonal"],
    description: "Frutas de estação cultivadas por agricultores locais em sistemas orgânicos que promovem a biodiversidade e saúde do solo. Não utilizam pesticidas sintéticos e têm baixa pegada de carbono no transporte.",
    category: 4,
    carbonFootprint: 0.8,
    waterUsage: 150,
    wasteProduction: 0.05,
    energy: 1.2,
    locallySourced: true,
    lifespan: 7,
    recyclable: true,
    ingredients: ["Frutas da estação cultivadas naturalmente"]
  },
  {
    id: 8,
    name: "Frutas Importadas",
    price: 25.9,
    image: "🍎",
    sustainability: 4,
    badges: ["Importado", "Traçabilidade"],
    description: "Frutas importadas de outros continentes, resultando em significativa emissão de carbono devido ao transporte aéreo. Cultivo em grande escala com uso moderado de agroquímicos.",
    category: 4,
    carbonFootprint: 9.6,
    waterUsage: 580,
    wasteProduction: 0.8,
    energy: 8.7,
    locallySourced: false,
    lifespan: 5,
    recyclable: true
  },
  {
    id: 9,
    name: "Lâmpada LED",
    price: 12.9,
    image: "💡",
    sustainability: 8,
    badges: ["Econômica", "Durável", "Baixo Consumo"],
    description: "Lâmpada LED de alta eficiência energética que consome até 90% menos energia que incandescentes e dura até 25 vezes mais. Contém materiais recicláveis e não usa mercúrio.",
    category: 5,
    carbonFootprint: 4.2,
    waterUsage: 120,
    wasteProduction: 0.3,
    energy: 1.5,
    locallySourced: false,
    lifespan: 60,
    recyclable: true
  },
  {
    id: 10,
    name: "Lâmpada Incandescente",
    price: 3.9,
    image: "💡",
    sustainability: 2,
    badges: [],
    description: "Lâmpada incandescente tradicional que converte apenas 5% da energia em luz (95% vira calor). Vida útil curta resultando em mais resíduos e maior consumo de recursos para produção e substituição frequente.",
    category: 5,
    carbonFootprint: 10.1,
    waterUsage: 420,
    wasteProduction: 1.5,
    energy: 15.6,
    locallySourced: false,
    lifespan: 2,
    recyclable: false
  },
  {
    id: 11,
    name: "Detergente Concentrado",
    price: 15.9,
    image: "🧴",
    sustainability: 7,
    badges: ["Concentrado", "Menos Embalagem", "Biodegradável"],
    description: "Detergente super concentrado que rende 3x mais que os convencionais, reduzindo embalagem e transporte. Fórmula biodegradável com ingredientes de fontes renováveis e baixo impacto em vida aquática.",
    category: 2,
    carbonFootprint: 3.5,
    waterUsage: 180,
    wasteProduction: 0.2,
    energy: 4.9,
    locallySourced: true,
    lifespan: 8,
    recyclable: true,
    ingredients: ["Surfactantes vegetais", "Óleos essenciais", "Conservantes naturais"]
  },
  {
    id: 12,
    name: "Detergente Comum",
    price: 8.9,
    image: "🧴",
    sustainability: 3,
    badges: [],
    description: "Detergente convencional com alto teor de água e menor rendimento, exigindo mais embalagens e transporte por volume útil. Contém surfactantes derivados de petróleo e conservantes sintéticos.",
    category: 2,
    carbonFootprint: 6.7,
    waterUsage: 380,
    wasteProduction: 0.9,
    energy: 7.8,
    locallySourced: false,
    lifespan: 4,
    recyclable: true
  },
];

// Product categories
const categories: Category[] = [
  { 
    id: 1, 
    name: "Vestuário", 
    icon: "👕", 
    description: "Roupas e acessórios de moda",
    color: "bg-nature-100 border-nature-300",
    gradientFrom: "from-nature-200",
    gradientTo: "to-nature-50"
  },
  { 
    id: 2, 
    name: "Limpeza", 
    icon: "🧼", 
    description: "Produtos para limpeza doméstica",
    color: "bg-blue-100 border-blue-300",
    gradientFrom: "from-blue-200",
    gradientTo: "to-blue-50"
  },
  { 
    id: 3, 
    name: "Utensílios", 
    icon: "🍶", 
    description: "Utensílios e objetos do dia-a-dia",
    color: "bg-cyan-100 border-cyan-300",
    gradientFrom: "from-cyan-200",
    gradientTo: "to-cyan-50"
  },
  { 
    id: 4, 
    name: "Alimentos", 
    icon: "🍎", 
    description: "Alimentos e produtos orgânicos",
    color: "bg-leaf-100 border-leaf-300",
    gradientFrom: "from-leaf-200",
    gradientTo: "to-leaf-50"
  },
  { 
    id: 5, 
    name: "Iluminação", 
    icon: "💡", 
    description: "Produtos de iluminação residencial",
    color: "bg-yellow-100 border-yellow-300",
    gradientFrom: "from-yellow-200",
    gradientTo: "to-yellow-50"
  },
];

// Sustainability tips
const sustainabilityTips = [
  {
    id: 1,
    title: "Prefira produtos locais",
    description: "Produtos locais reduzem a pegada de carbono associada ao transporte de longas distâncias.",
    icon: "🚚",
    category: 0
  },
  {
    id: 2,
    title: "Verifique certificações",
    description: "Busque por certificações como orgânico, comércio justo e manejo florestal sustentável.",
    icon: "✅",
    category: 0
  },
  {
    id: 3,
    title: "Considere a durabilidade",
    description: "Produtos mais duráveis geram menos resíduos ao longo do tempo, mesmo que o investimento inicial seja maior.",
    icon: "⏱️",
    category: 0
  },
  {
    id: 4,
    title: "Roupas Eco-friendly",
    description: "Prefira tecidos orgânicos ou reciclados e marcas comprometidas com práticas sustentáveis.",
    icon: "👚",
    category: 1
  },
  {
    id: 5,
    title: "Limpeza consciente",
    description: "Produtos de limpeza biodegradáveis e concentrados reduzem a poluição da água e usam menos embalagens.",
    icon: "🧹",
    category: 2
  },
  {
    id: 6,
    title: "Garrafas reutilizáveis",
    description: "Uma garrafa reutilizável pode substituir centenas de garrafas descartáveis ao longo de sua vida útil.",
    icon: "♻️",
    category: 3
  },
  {
    id: 7,
    title: "Alimentos sazonais",
    description: "Alimentos da estação geralmente requerem menos recursos para cultivo e têm melhor sabor e valor nutricional.",
    icon: "🌱",
    category: 4
  },
  {
    id: 8,
    title: "Iluminação eficiente",
    description: "LEDs consomem até 90% menos energia e duram muito mais que lâmpadas incandescentes tradicionais.",
    icon: "💡",
    category: 5
  }
];

export default function Lesson7() {
  // Main state
  const [state, setState] = useState<LessonState>({
    cart: [],
    budget: 200,
    remainingBudget: 200,
    sustainabilityScore: 0,
    isCompleted: false,
    score: 0,
    environmentalImpact: {
      carbonFootprint: 0,
      waterSavings: 0,
      wasteReduction: 0,
      energySavings: 0,
      biodiversityImpact: 0
    }
  });

  // UI state
  const [showInfo, setShowInfo] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [comparingProducts, setComparingProducts] = useState<number[]>([]);
  const [showTip, setShowTip] = useState<number | null>(null);
  const [animation, setAnimation] = useState<string | null>(null);
  const [visibleConfetti, setVisibleConfetti] = useState(false);
  const [tooltipData, setTooltipData] = useState<{show: boolean, content: string, x: number, y: number}>({
    show: false,
    content: '',
    x: 0,
    y: 0
  });

  // Refs
  const impactChartsRef = useRef<HTMLDivElement>(null);
  const productListRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Calculate budget, sustainability score and impact
  useEffect(() => {
    calculateState();
    
    // Check if lesson is completed
    if (state.cart.length >= 5 && state.sustainabilityScore >= 7 && !state.isCompleted) {
      completeLesson();
    }
  }, [state.cart]);

  // Animate charts when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-scale-up');
          }
        });
      },
      { threshold: 0.3 }
    );

    const chartElements = document.querySelectorAll('.impact-chart');
    chartElements.forEach(el => observer.observe(el));

    return () => {
      chartElements.forEach(el => observer.unobserve(el));
    };
  }, []);
  
  // Handle confetti animation when lesson is completed
  useEffect(() => {
    if (state.isCompleted && visibleConfetti) {
      const timeout = setTimeout(() => {
        setVisibleConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [state.isCompleted, visibleConfetti]);

  // Calculate all state metrics based on cart
  const calculateState = () => {
    const cartProducts = state.cart.map(id => products.find(p => p.id === id)!);
    
    // Calculate costs
    const totalCost = cartProducts.reduce((total, product) => total + product.price, 0);
    const remainingBudget = state.budget - totalCost;
    
    // Calculate sustainability score (0-10)
    const sustainabilityTotal = cartProducts.reduce((total, product) => total + product.sustainability, 0);
    const avgSustainability = cartProducts.length > 0 ? sustainabilityTotal / cartProducts.length : 0;
    
    // Calculate environmental impact
    const environmentalImpact: EnvironmentalImpact = {
      carbonFootprint: cartProducts.reduce((total, p) => total + p.carbonFootprint, 0),
      waterSavings: cartProducts.reduce((total, p) => total + (p.sustainability > 5 ? p.waterUsage * 0.5 : 0), 0),
      wasteReduction: cartProducts.reduce((total, p) => total + (p.sustainability > 5 ? p.wasteProduction * 0.6 : 0), 0),
      energySavings: cartProducts.reduce((total, p) => total + (p.sustainability > 5 ? p.energy * 0.7 : 0), 0),
      biodiversityImpact: cartProducts.reduce((total, p) => total + (p.sustainability > 7 ? 10 : p.sustainability > 5 ? 5 : 0), 0)
    };
    
    setState(prev => ({
      ...prev,
      remainingBudget,
      sustainabilityScore: avgSustainability,
      environmentalImpact
    }));
  };

  // Handle lesson completion
  const completeLesson = () => {
    // Calculate final score based on sustainability and budget usage
    const finalScore = Math.round(state.sustainabilityScore * 10) + Math.floor(state.remainingBudget / 10);
    // Show success toast
    showToast('🎉 Parabéns!', 'Você completou as compras de forma consciente e sustentável!', 'success');
    
    // Trigger confetti animation
    setVisibleConfetti(true);
    setAnimation('complete');
    
    const completionApi = async() => {
      try{
      const response = await api.post(routes.study.lessons_completion.create, {lesson: 7})

      if (response.status === 201){
        setState(prev => ({
          ...prev,
          isCompleted: true,
          score: finalScore
        }));
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
  };

  // Add product to cart
  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if budget is sufficient
    if (product.price > state.remainingBudget) {
      showToast('Orçamento insuficiente', 'Você não tem orçamento para este produto.', 'error');
      setAnimation('error');
      return;
    }

    // Add to cart with visual feedback based on sustainability
    setState(prev => ({
      ...prev,
      cart: [...prev.cart, productId]
    }));

    // Provide feedback based on sustainability
    if (product.sustainability >= 7) {
      showToast('Ótima Escolha!', 'Este produto tem alta sustentabilidade!', 'success');
      setAnimation('good-choice');
    } else if (product.sustainability >= 4) {
      showToast('Escolha Moderada', 'Este produto tem sustentabilidade média.', 'info');
      setAnimation('medium-choice');
    } else {
      showToast('Escolha Pouco Sustentável', 'Existem alternativas mais ecológicas para este produto.', 'warning');
      setAnimation('poor-choice');
    }

    // Scroll to impact charts after adding a few items
    if (state.cart.length === 2 && impactChartsRef.current) {
      setTimeout(() => {
        impactChartsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1000);
    }
  };

  // Remove product from cart
  const handleRemoveFromCart = (productId: number) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(id => id !== productId)
    }));
    showToast('Produto Removido', 'Item removido do carrinho.', 'info');
  };

  // Reset lesson
  const handleReset = () => {
    setState({
      cart: [],
      budget: 200,
      remainingBudget: 200,
      sustainabilityScore: 0,
      isCompleted: false,
      score: 0,
      environmentalImpact: {
        carbonFootprint: 0,
        waterSavings: 0,
        wasteReduction: 0,
        energySavings: 0,
        biodiversityImpact: 0
      }
    });
    setSelectedCategory(null);
    setSelectedProduct(null);
    setComparingProducts([]);
    setAnimation(null);
    showToast('Lição Reiniciada', 'Todos os dados foram redefinidos.', 'info');
  };

  // Compare products
  const handleCompareProduct = (productId: number) => {
    if (comparingProducts.includes(productId)) {
      setComparingProducts(prev => prev.filter(id => id !== productId));
    } else if (comparingProducts.length < 2) {
      setComparingProducts(prev => [...prev, productId]);
    } else {
      showToast('Limite Atingido', 'Você só pode comparar até 2 produtos de cada vez.', 'info');
    }
  };

  // Show toast notification
  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const toast = document.createElement('div');
    const colors = {
      success: 'bg-gradient-to-r from-leaf-500 to-nature-500',
      error: 'bg-gradient-to-r from-red-500 to-red-400',
      info: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      warning: 'bg-gradient-to-r from-yellow-500 to-amber-500'
    };
    
    toast.className = `fixed top-4 right-4 p-4 rounded-xl shadow-xl ${colors[type]} text-white z-50 transform transition-all duration-500 translate-y-0 max-w-md`;
    toast.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    
    toast.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0 mr-3">
          ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
        </div>
        <div>
          <h4 class="font-bold text-lg">${title}</h4>
          <p class="mt-1 text-sm opacity-90">${message}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Add entrance animation
    setTimeout(() => {
      toast.classList.add('opacity-100', 'translate-y-0');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      toast.classList.add('translate-y-[-20px]', 'opacity-0');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
  };

  // Get filtered products based on selected category
  const getFilteredProducts = () => {
    if (selectedCategory === null) {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  };

  // Handle tooltip display
  const handleTooltip = (show: boolean, content: string = '', event?: React.MouseEvent) => {
    if (show && event) {
      setTooltipData({
        show,
        content,
        x: event.clientX,
        y: event.clientY
      });
    } else {
      setTooltipData(prev => ({...prev, show}));
    }
  };

  // Render sustainability stars
  const SustainabilityStars = ({ value }: { value: number }) => {
    const fullStars = Math.floor(value / 2);
    const halfStar = value % 2 >= 1;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {halfStar && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  // Render sustainability score color
  const getSustainabilityColor = (value: number) => {
    if (value >= 8) return "text-leaf-600";
    if (value >= 6) return "text-nature-500";
    if (value >= 4) return "text-yellow-500";
    if (value >= 2) return "text-orange-500";
    return "text-red-500";
  };

  // Render product comparison
  const renderProductComparison = () => {
    if (comparingProducts.length === 0) return null;
    
    const comparedProducts = comparingProducts.map(id => products.find(p => p.id === id)!);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-nature-800">Comparação de Produtos</h3>
            <button 
              onClick={() => setComparingProducts([])}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparedProducts.map(product => (
              <div key={product.id} className={`p-6 rounded-xl ${product.sustainability >= 7 ? 'bg-gradient-to-br from-leaf-50 to-nature-100 border border-nature-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3" role="img" aria-hidden="true">{product.image}</span>
                  <div>
                    <h4 className="font-bold text-lg">{product.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Sustentabilidade:</span>
                      <SustainabilityStars value={product.sustainability} />
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700">{product.description}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Preço:</span>
                    <span>R$ {product.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Pegada de Carbono:</span>
                    <span>{product.carbonFootprint} kg CO₂</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Uso de Água:</span>
                    <span>{product.waterUsage} L</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Produção de Resíduos:</span>
                    <span>{product.wasteProduction} kg</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Consumo de Energia:</span>
                    <span>{product.energy} kWh</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Vida Útil:</span>
                    <span>{product.lifespan} meses</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Produção Local:</span>
                    <span>{product.locallySourced ? '✅ Sim' : '❌ Não'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Reciclável:</span>
                    <span>{product.recyclable ? '✅ Sim' : '❌ Não'}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.badges.map((badge, idx) => (
                    <span key={idx} className="px-2 py-1 bg-nature-100 text-nature-800 rounded-full text-xs font-medium">
                      {badge}
                    </span>
                  ))}
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={() => {
                      handleAddToCart(product.id);
                      setComparingProducts([]);
                    }}
                    disabled={state.cart.includes(product.id) || product.price > state.remainingBudget}
                    className={`w-full py-2 px-4 rounded-lg transition-colors ${
                      state.cart.includes(product.id) 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : product.price > state.remainingBudget
                        ? 'bg-red-100 text-red-500 cursor-not-allowed'
                        : 'bg-nature-500 hover:bg-nature-600 text-white'
                    }`}
                  >
                    {state.cart.includes(product.id) 
                      ? 'Já está no carrinho' 
                      : product.price > state.remainingBudget
                      ? 'Orçamento insuficiente'
                      : 'Adicionar ao Carrinho'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {comparedProducts.length === 2 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-nature-50 to-leaf-50 rounded-xl border border-nature-100">
              <h4 className="font-bold text-lg text-nature-800 mb-4">Análise Comparativa</h4>
              
              <div className="space-y-4">
                {/* Price comparison */}
                <div className="flex items-center">
                  <span className="font-medium w-32">Economia:</span>
                  <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        comparedProducts[0].price < comparedProducts[1].price 
                          ? 'bg-nature-500' 
                          : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.abs(
                          100 - (comparedProducts[0].price / comparedProducts[1].price) * 100
                        )}%` 
                      }}
                    />
                  </div>
                  <span className="ml-3 font-medium">
                    {comparedProducts[0].price < comparedProducts[1].price 
                      ? `${Math.round((1 - comparedProducts[0].price / comparedProducts[1].price) * 100)}% mais barato` 
                      : `${Math.round((comparedProducts[0].price / comparedProducts[1].price - 1) * 100)}% mais caro`}
                  </span>
                </div>
                
                {/* Carbon footprint comparison */}
                <div className="flex items-center">
                  <span className="font-medium w-32">Carbono:</span>
                  <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        comparedProducts[0].carbonFootprint < comparedProducts[1].carbonFootprint 
                          ? 'bg-nature-500' 
                          : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.abs(
                          100 - (comparedProducts[0].carbonFootprint / comparedProducts[1].carbonFootprint) * 100
                        )}%` 
                      }}
                    />
                  </div>
                  <span className="ml-3 font-medium">
                    {comparedProducts[0].carbonFootprint < comparedProducts[1].carbonFootprint 
                      ? `${Math.round((1 - comparedProducts[0].carbonFootprint / comparedProducts[1].carbonFootprint) * 100)}% menos carbono` 
                      : `${Math.round((comparedProducts[0].carbonFootprint / comparedProducts[1].carbonFootprint - 1) * 100)}% mais carbono`}
                  </span>
                </div>
                
                {/* Water usage comparison */}
                <div className="flex items-center">
                  <span className="font-medium w-32">Água:</span>
                  <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        comparedProducts[0].waterUsage < comparedProducts[1].waterUsage 
                          ? 'bg-blue-500' 
                          : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.abs(
                          100 - (comparedProducts[0].waterUsage / comparedProducts[1].waterUsage) * 100
                        )}%` 
                      }}
                    />
                  </div>
                  <span className="ml-3 font-medium">
                    {comparedProducts[0].waterUsage < comparedProducts[1].waterUsage 
                      ? `${Math.round((1 - comparedProducts[0].waterUsage / comparedProducts[1].waterUsage) * 100)}% menos água` 
                      : `${Math.round((comparedProducts[0].waterUsage / comparedProducts[1].waterUsage - 1) * 100)}% mais água`}
                  </span>
                </div>
                
                {/* Lifespan comparison */}
                <div className="flex items-center">
                  <span className="font-medium w-32">Durabilidade:</span>
                  <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        comparedProducts[0].lifespan > comparedProducts[1].lifespan 
                          ? 'bg-nature-500' 
                          : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, Math.abs(
                          100 - (comparedProducts[1].lifespan / Math.max(comparedProducts[0].lifespan, 1)) * 100
                        ))}%` 
                      }}
                    />
                  </div>
                  <span className="ml-3 font-medium">
                    {comparedProducts[0].lifespan > comparedProducts[1].lifespan 
                      ? `${Math.round(comparedProducts[0].lifespan / comparedProducts[1].lifespan)}x mais durável` 
                      : `${Math.round(comparedProducts[1].lifespan / comparedProducts[0].lifespan)}x menos durável`}
                  </span>
                </div>
                
                {/* Total impact assessment */}
                <div className="mt-6 p-4 bg-white bg-opacity-50 rounded-lg">
                  <p className="font-bold text-nature-800">
                    {comparedProducts[0].sustainability > comparedProducts[1].sustainability
                      ? `O produto "${comparedProducts[0].name}" é ${Math.round(comparedProducts[0].sustainability / comparedProducts[1].sustainability * 10) / 10}x mais sustentável do que "${comparedProducts[1].name}".`
                      : `O produto "${comparedProducts[1].name}" é ${Math.round(comparedProducts[1].sustainability / comparedProducts[0].sustainability * 10) / 10}x mais sustentável do que "${comparedProducts[0].name}".`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render confetti for completion celebration
  const renderConfetti = () => {
    if (!visibleConfetti) return null;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(100)].map((_, i) => {
          const size = Math.random() * 1 + 0.5;
          const left = Math.random() * 100;
          const animationDuration = Math.random() * 3 + 2;
          const delay = Math.random() * 5;
          const color = [
            'bg-leaf-500',
            'bg-nature-500',
            'bg-yellow-500',
            'bg-blue-500',
            'bg-cyan-500',
          ][Math.floor(Math.random() * 5)];
          
          return (
            <div
              key={i}
              className={`absolute ${color} rounded-full opacity-80`}
              style={{
                width: `${size}rem`,
                height: `${size}rem`,
                left: `${left}%`,
                top: '-20px',
                animation: `confetti ${animationDuration}s ease-in forwards ${delay}s`
              }}
            />
          );
        })}
        
        <style jsx>{`
          @keyframes confetti {
            0% {
              transform: translateY(0) rotate(0);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nature-50 via-leaf-50 to-green-50 pb-20"> 
      {/* Dynamic tooltip */}
      {tooltipData.show && (
        <div 
          className="fixed z-50 bg-white p-3 rounded-lg shadow-lg text-sm max-w-xs animate-fade-in"
          style={{
            left: `${tooltipData.x + 15}px`,
            top: `${tooltipData.y + 15}px`
          }}
        >
          {tooltipData.content}
        </div>
      )}
      
      {/* Confetti celebration */}
      {renderConfetti()}
      
      {/* Product comparison modal */}
      {renderProductComparison()}
      
      {/* Header */}
      <header className="bg-gradient-to-r from-nature-400 to-leaf-600 text-white py-24 px-24  top-25 z-30 rounded-3xl">
        <div className="flex items-center justify-between mb-1 h-1">
        <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 backdrop-blur-sm group "
                aria-label="Voltar para página inicial"
              >
                <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Voltar</span>
              </button>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <h1 className="text-4xl font-bold">EcoCompras Conscientes</h1>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
            <span className="font-medium">Pontuação: {state.score}</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center mt-12">
            <p className="text-xl text-white/90 font-medium mb-4">
              Cada escolha de compra é uma decisão que impacta o futuro do nosso planeta
            </p>
            <p className="text-base text-white/80 leading-relaxed">
              Quando compramos de forma consciente, não estamos apenas adquirindo produtos - 
              estamos escolhendo apoiar práticas sustentáveis, reduzir nosso impacto ambiental 
              e construir um futuro mais verde para as próximas gerações.
            </p>
          </div>
       

      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Lesson title card */}
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-nature-100 relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nature-400 to-leaf-400"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-leaf-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-nature-700 to-leaf-600 bg-clip-text text-transparent">
                Lição 7: Consumo Consciente e Sustentável
              </h2>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 hover:bg-nature-50 rounded-full transition-colors relative z-10"
                aria-label="Mostrar informações sobre consumo consciente"
              >
                <Info className="h-6 w-6 text-nature-600" />
              </button>
            </div>

            {showInfo && (
              <div className="bg-gradient-to-r from-nature-50 to-leaf-50 border border-nature-200 p-6 rounded-xl mb-6 animate-scale-up relative z-10">
                <h3 className="font-bold text-xl text-nature-700 mb-3">Sobre Consumo Consciente</h3>
                <p className="text-gray-700 mb-3">
                  O consumo consciente é uma forma de escolher produtos e serviços levando em consideração 
                  o impacto ambiental, social e econômico das suas escolhas. Ao fazer compras conscientes, 
                  você contribui para a conservação dos recursos naturais e a redução da pegada ecológica.
                </p>
                <p className="text-gray-700">
                  Nesta atividade, você irá simular compras de diversos produtos, comparando alternativas 
                  mais e menos sustentáveis. Seu objetivo é atingir uma pontuação alta de sustentabilidade
                  enquanto administra seu orçamento limitado.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-nature-700 flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-nature-500" /> Objetivo
                    </h4>
                    <p className="text-sm text-gray-600">
                      Comprar pelo menos 5 produtos com uma pontuação média de sustentabilidade de 7 ou mais.
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-nature-700 flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-nature-500" /> Pontuação
                    </h4>
                    <p className="text-sm text-gray-600">
                      Sua pontuação final será baseada na sustentabilidade média dos produtos e no orçamento restante.
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-nature-700 flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-nature-500" /> Comparação
                    </h4>
                    <p className="text-sm text-gray-600">
                      Compare produtos similares para entender as diferenças em impacto ambiental.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-leaf-50 to-nature-50 p-5 rounded-xl mb-5 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Orçamento Restante</span>
                    <span className="text-sm font-medium text-gray-700">
                      R$ {state.remainingBudget.toFixed(2)} <span className="text-gray-500">de R$ {state.budget.toFixed(2)}</span>
                    </span>
                  </div>
                  <div className="h-4 bg-white rounded-full overflow-hidden border border-nature-200">
                    <div 
                      className="h-full bg-gradient-to-r from-leaf-400 to-nature-500 transition-all duration-500"
                      style={{ width: `${(state.remainingBudget / state.budget) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Sustentabilidade</span>
                    <span className={`text-sm font-medium ${getSustainabilityColor(state.sustainabilityScore)}`}>
                      {state.sustainabilityScore.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="h-4 bg-white rounded-full overflow-hidden border border-nature-200">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        state.sustainabilityScore >= 7 
                          ? 'bg-gradient-to-r from-nature-400 to-leaf-500' 
                          : state.sustainabilityScore >= 5 
                          ? 'bg-gradient-to-r from-yellow-400 to-nature-400' 
                          : 'bg-gradient-to-r from-red-400 to-yellow-400'
                      }`}
                      style={{ width: `${(state.sustainabilityScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex-none">
                  <span className="text-sm font-medium text-gray-700 block text-center mb-1">Carrinho</span>
                  <div className="h-10 px-4 bg-white rounded-full flex items-center justify-center border border-nature-200">
                    <span className="font-medium text-nature-700">{state.cart.length}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-sm text-gray-500">5 min.</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sustainability tips ticker */}
            <div className="bg-nature-800 bg-opacity-90 text-white px-4 py-3 rounded-xl shadow-inner overflow-hidden relative z-10">
              <div className="flex items-center gap-2 animate-marquee">
                {sustainabilityTips.concat(sustainabilityTips).map((tip, index) => (
                  <div 
                    key={`tip-${index}`}
                    className="flex-shrink-0 px-4 py-1 bg-white bg-opacity-10 rounded-lg flex items-center gap-2 mr-6"
                    onMouseEnter={() => setShowTip(tip.id)}
                    onMouseLeave={() => setShowTip(null)}
                  >
                    <span role="img" aria-hidden="true" className="text-lg">{tip.icon}</span>
                    <span className="font-medium whitespace-nowrap">{tip.title}</span>
                    
                    {showTip === tip.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white text-gray-800 rounded-lg shadow-lg z-20 animate-fade-in">
                        <h4 className="font-semibold text-nature-700 mb-1">{tip.title}</h4>
                        <p className="text-sm">{tip.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <style jsx>{`
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                  display: flex;
                  animation: marquee 30s linear infinite;
                  width: fit-content;
                }
              `}</style>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Category filter */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-nature-100 relative overflow-hidden animate-fade-in">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-nature-200 opacity-50 rounded-full"></div>
                <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-leaf-200 opacity-30 rounded-full"></div>
                
                <h3 className="font-bold text-xl text-nature-700 mb-4 relative z-10">Categorias de Produtos</h3>
                
                <div className="flex flex-wrap gap-3 relative z-10">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`relative overflow-hidden category-btn ${
                      selectedCategory === null ? 'active' : 'border-gray-200 hover:border-nature-300'
                    }`}
                  >
                    <span className="relative z-10 font-medium">Todos</span>
                    {selectedCategory === null && (
                      <div className="absolute inset-0 bg-gradient-to-r from-nature-100 to-leaf-100 rounded-full opacity-50"></div>
                    )}
                  </button>
                  
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`relative overflow-hidden category-btn ${
                        selectedCategory === category.id ? 'active' : 'border-gray-200 hover:border-nature-300'
                      }`}
                      onMouseEnter={(e) => handleTooltip(true, category.description, e)}
                      onMouseLeave={() => handleTooltip(false)}
                    >
                      <span
                        role="img"
                        aria-hidden="true"
                        className={`text-xl ${
                          selectedCategory === category.id ? 'animate-pulse' : ''
                        }`}
                      >
                        {category.icon}
                      </span>
                      <span className="relative z-10 font-medium">{category.name}</span>
                      
                      {selectedCategory === category.id && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${category.gradientFrom} ${category.gradientTo} rounded-full opacity-70`}></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Products grid */}
              <div 
                ref={productListRef}
                className="bg-white rounded-2xl shadow-lg p-6 border border-nature-100 animate-fade-in"
              >
                <h3 className="font-bold text-xl text-nature-700 mb-4 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-nature-500" />
                  Produtos Disponíveis
                  {selectedCategory !== null && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      • {categories.find(c => c.id === selectedCategory)?.name}
                    </span>
                  )}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredProducts().map((product) => {
                    const isInCart = state.cart.includes(product.id);
                    const isSelected = selectedProduct === product.id;
                    const isComparing = comparingProducts.includes(product.id);
                    
                    return (
                      <div
                        key={product.id}
                        className={`relative rounded-xl border-2 transition-all duration-300 overflow-hidden product-card ${
                          isInCart 
                            ? 'border-nature-400 shadow-md shadow-nature-100' 
                            : isSelected || isComparing
                            ? 'border-blue-300 shadow-md' 
                            : product.sustainability >= 7
                            ? 'border-nature-200 hover:border-nature-300' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {/* Background gradient based on sustainability */}
                        <div 
                          className={`absolute inset-0 opacity-5 ${
                            product.sustainability >= 7 
                              ? 'bg-gradient-to-br from-leaf-300 to-nature-300' 
                              : product.sustainability >= 4
                              ? 'bg-gradient-to-br from-yellow-300 to-orange-300' 
                              : 'bg-gradient-to-br from-red-300 to-orange-300'
                          }`}
                        ></div>
                        
                        {/* Product content */}
                        <div className="p-4 relative z-10">
                          <div className="flex">
                            {/* Product image */}
                            <div className={`text-4xl mr-3 ${isInCart ? 'animate-bounce' : 'animate-pulse-subtle'}`} role="img" aria-hidden="true">
                              {product.image}
                            </div>
                            
                            {/* Product details */}
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {product.name}
                                {isInCart && (
                                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-nature-100 text-nature-800">
                                    No Carrinho
                                  </span>
                                )}
                              </h4>
                              
                              <div className="flex justify-between items-center">
                                <div className="text-sm font-medium text-gray-700">
                                  R$ {product.price.toFixed(2)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <SustainabilityStars value={product.sustainability} />
                                </div>
                              </div>
                              
                              
                                
                              <div className="flex flex-wrap gap-1 mt-2">
                                {product.badges.map((badge, index) => (
                                  <span 
                                    key={index} 
                                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-nature-100 text-nature-800 animate-badge-pulse"
                                    style={{ animationDelay: `${index * 0.5}s` }}
                                  >
                                    {badge}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="mt-3 flex justify-between items-center">
                            <button
                              onClick={() => handleAddToCart(product.id)}
                              disabled={isInCart || product.price > state.remainingBudget}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                isInCart 
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                  : product.price > state.remainingBudget
                                  ? 'bg-red-100 text-red-400 cursor-not-allowed'
                                  : product.sustainability >= 7
                                  ? 'bg-nature-500 hover:bg-nature-600 text-white'
                                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                              }`}
                            >
                              {isInCart ? 'No Carrinho' : 'Adicionar'}
                            </button>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCompareProduct(product.id)}
                                className={`px-2 py-1 rounded-lg text-sm transition-colors ${
                                  isComparing 
                                    ? 'bg-blue-100 text-blue-600' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {isComparing ? 'Comparando' : 'Comparar'}
                              </button>
                              
                              <button
                                onClick={() => setSelectedProduct(isSelected ? null : product.id)}
                                className={`px-2 py-1 rounded-lg text-sm transition-colors ${
                                  isSelected 
                                    ? 'bg-gray-100 text-gray-700' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {isSelected ? 'Ocultar' : 'Detalhes'}
                              </button>
                            </div>
                          </div>
                          
                          {/* Product details */}
                          {isSelected && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm animate-fade-in">
                              <p className="text-gray-700 mb-3">{product.description}</p>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Zap className="h-3 w-3 text-yellow-500" />
                                  <span>Energia: {product.energy} kWh</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Droplet className="h-3 w-3 text-blue-500" />
                                  <span>Água: {product.waterUsage} L</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Leaf className="h-3 w-3 text-nature-500" />
                                  <span>CO₂: {product.carbonFootprint} kg</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <RefreshCw className="h-3 w-3 text-cyan-500" />
                                  <span>Vida útil: {product.lifespan} meses</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Environmental impact visualization */}
              <div 
                ref={impactChartsRef}
                className="bg-white rounded-2xl shadow-lg p-6 border border-nature-100 opacity-100 impact-chart"
              >
                <h3 className="font-bold text-xl text-nature-700 mb-6">Impacto Ambiental das suas Escolhas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Carbon footprint chart */}
                  <div className="bg-gradient-to-br from-leaf-50 to-nature-50 rounded-xl p-5 border border-nature-100 relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-leaf-200 rounded-full opacity-30"></div>
                    
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-leaf-600" />
                      Pegada de Carbono
                    </h4>
                    
                    <div className="flex items-end mb-4">
                      <div className="text-3xl font-bold text-leaf-700">
                        {state.environmentalImpact.carbonFootprint.toFixed(1)}
                      </div>
                      <div className="text-gray-600 ml-2 mb-1">kg CO₂</div>
                    </div>
                    
                    <div className="h-24 bg-white bg-opacity-50 rounded-lg p-3 relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-leaf-300 to-leaf-100 opacity-20"></div>
                      
                      {state.cart.map((id, index) => {
                        const product = products.find(p => p.id === id);
                        if (!product) return null;
                        
                        return (
                          <div
                            key={`carbon-${id}`}
                            className="absolute bottom-0 rounded-t-sm transition-all duration-500"
                            style={{
                                left: `${(index / Math.max(state.cart.length - 1, 1)) * 80 + 10}%`,
                                width: '8%',
                                height: `${(product.carbonFootprint / 15) * 100}%`,
                                backgroundColor: product.sustainability >= 7 
                                  ? 'rgba(16, 185, 129, 0.7)' 
                                  : product.sustainability >= 4 
                                  ? 'rgba(234, 179, 8, 0.7)' 
                                  : 'rgba(239, 68, 68, 0.7)',
                                transform: 'translateX(-50%)'
                              }}                              
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
                              {product.image}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      {state.cart.length === 0 
                        ? 'Adicione produtos ao carrinho para ver seu impacto de carbono.'
                        : state.environmentalImpact.carbonFootprint < 20 
                        ? 'Excelente! Suas escolhas têm baixo impacto de carbono.'
                        : state.environmentalImpact.carbonFootprint < 40 
                        ? 'Suas escolhas têm impacto de carbono moderado.'
                        : 'Suas escolhas têm alto impacto de carbono. Considere alternativas.'}
                    </div>
                  </div>
                  
                  {/* Water usage chart */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100 relative overflow-hidden">
                    <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-blue-200 rounded-full opacity-30"></div>
                    
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-blue-600" />
                      Economia de Água
                    </h4>
                    
                    <div className="flex items-end mb-4">
                      <div className="text-3xl font-bold text-blue-700">
                        {state.environmentalImpact.waterSavings.toFixed(0)}
                      </div>
                      <div className="text-gray-600 ml-2 mb-1">litros</div>
                    </div>
                    
                    <div className="h-24 bg-white bg-opacity-50 rounded-lg relative overflow-hidden flex items-end">
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-200 to-transparent opacity-30"></div>
                      
                      <div className="absolute left-0 bottom-0 w-full bg-blue-400 transition-all duration-1000 ease-in-out" style={{
                        height: `${Math.min((state.environmentalImpact.waterSavings / 1000) * 100, 100)}%`,
                        opacity: 0.3
                      }}></div>
                      
                      {/* Water drops animation */}
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={`drop-${i}`}
                          className="absolute bottom-0 rounded-full bg-blue-400 opacity-70"
                          style={{
                            left: `${20 * i + 10}%`,
                            width: '8px',
                            height: '8px',
                            animation: `water-drop ${2 + i * 0.5}s infinite ease-in-out ${i * 0.7}s`
                          }}
                        ></div>
                      ))}
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      {state.environmentalImpact.waterSavings === 0 
                        ? 'Adicione produtos ao carrinho para ver economia de água.'
                        : state.environmentalImpact.waterSavings > 500 
                        ? 'Incrível! Suas escolhas economizam muita água.'
                        : state.environmentalImpact.waterSavings > 200 
                        ? 'Boa economia de água com suas escolhas.'
                        : 'Suas escolhas economizam alguma água.'}
                    </div>
                  </div>
                  
                  {/* Waste reduction chart */}
                  <div className="bg-gradient-to-br from-nature-50 to-yellow-50 rounded-xl p-5 border border-nature-100 relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-yellow-200 rounded-full opacity-30"></div>
                    
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-nature-600" />
                      Redução de Resíduos
                    </h4>
                    
                    <div className="flex items-end mb-4">
                      <div className="text-3xl font-bold text-nature-700">
                        {state.environmentalImpact.wasteReduction.toFixed(1)}
                      </div>
                      <div className="text-gray-600 ml-2 mb-1">kg</div>
                    </div>
                    
                    <div className="h-24 bg-white bg-opacity-50 rounded-lg p-3 relative overflow-hidden">
                      <div className="absolute inset-0">
                        <div className="absolute left-0 bottom-0 h-1/3 w-full bg-nature-100"></div>
                        <div className="absolute left-0 bottom-1/3 h-1/3 w-full bg-nature-50"></div>
                      </div>
                      
                      {state.cart.map((id, index) => {
                        const product = products.find(p => p.id === id);
                        if (!product) return null;
                        
                        return product.sustainability >= 5 ? (
                          <div
                            key={`waste-${id}`}
                            className="absolute transition-all duration-500"
                            style={{
                              top: `${30 + Math.random() * 40}%`,
                              left: `${(index / Math.max(state.cart.length - 1, 1)) * 80 + 10}%`,
                              transform: 'translateX(-50%)'
                            }}
                          >
                            <div className="text-sm animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                              ♻️
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      {state.environmentalImpact.wasteReduction === 0 
                        ? 'Adicione produtos ao carrinho para ver redução de resíduos.'
                        : state.environmentalImpact.wasteReduction > 2 
                        ? 'Excelente! Suas escolhas reduzem significativamente os resíduos.'
                        : state.environmentalImpact.wasteReduction > 1 
                        ? 'Suas escolhas ajudam a reduzir resíduos.'
                        : 'Suas escolhas começam a reduzir resíduos.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shopping cart and information column */}
            <div className="space-y-8">
              {/* Shopping cart */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-nature-100 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-nature-700">Seu Carrinho</h3>
                  <span className="px-2 py-1 bg-nature-100 rounded-full text-xs font-medium text-nature-800">
                    {state.cart.length} {state.cart.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>
                
                {state.cart.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">Seu carrinho está vazio</p>
                    <p className="text-sm text-gray-400 mt-1">Adicione produtos para começar</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {state.cart.map((productId) => {
                      const product = products.find(p => p.id === productId);
                      if (!product) return null;
                      
                      return (
                        <div
                          key={productId}
                          className={`flex items-center p-3 rounded-xl border transition-all ${
                            product.sustainability >= 7 
                              ? 'border-nature-200 bg-gradient-to-r from-nature-50 to-leaf-50' 
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex-shrink-0 text-2xl mr-3" role="img" aria-hidden="true">
                            {product.image}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate">{product.name}</div>
                            <div className="flex justify-between items-center mt-1">
                              <div className="text-sm text-gray-500">R$ {product.price.toFixed(2)}</div>
                              <div className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                                product.sustainability >= 7 
                                  ? 'bg-leaf-100 text-leaf-800' 
                                  : product.sustainability >= 4 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                Eco: {product.sustainability}/10
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveFromCart(productId)}
                            className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">R$ {(state.budget - state.remainingBudget).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sustentabilidade:</span>
                    <span className={`font-medium ${getSustainabilityColor(state.sustainabilityScore)}`}>
                      {state.sustainabilityScore.toFixed(1)}/10
                      {state.sustainabilityScore >= 7 && ' ✓'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={handleReset}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
                  >
                    Limpar Carrinho
                  </button>
                </div>
              </div>
              
              {/* Lesson completion status */}
              {state.isCompleted ? (
                <div className="bg-gradient-to-r from-leaf-500 to-nature-600 rounded-2xl shadow-xl p-6 text-white animate-scale-up">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl mb-3">🎉 Parabéns!</h3>
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      <span className="font-bold">{state.score}</span>
                      <span className="text-sm opacity-80 ml-1">pts</span>
                    </div>
                  </div>
                  
                  <p className="mb-4 text-white text-opacity-90">
                    Você completou a Lição 7 com sucesso! Suas escolhas de consumo demonstram um 
                    alto nível de consciência ambiental. Continue aplicando esses conhecimentos
                    nas suas compras do dia a dia.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white bg-opacity-10 p-3 rounded-lg text-center backdrop-blur-sm">
                      <div className="text-2xl font-bold">
                        {state.cart.length}
                      </div>
                      <div className="text-xs text-white text-opacity-80">Produtos</div>
                    </div>
                    
                    <div className="bg-white bg-opacity-10 p-3 rounded-lg text-center backdrop-blur-sm">
                      <div className="text-2xl font-bold">
                        {state.remainingBudget.toFixed(0)}
                      </div>
                      <div className="text-xs text-white text-opacity-80">Orçamento restante</div>
                    </div>
                    
                    <div className="bg-white bg-opacity-10 p-3 rounded-lg text-center backdrop-blur-sm">
                      <div className="text-2xl font-bold">
                        {state.sustainabilityScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-white text-opacity-80">Sustentabilidade</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2 px-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white font-medium transition-colors"
                    >
                      Tentar Novamente
                    </button>
                    
                    <button
                      onClick={() => navigate('/')}
                      className="flex-1 py-2 px-4 bg-white text-nature-700 hover:bg-opacity-90 rounded-lg font-medium transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-nature-100 animate-fade-in">
                  <h3 className="font-bold text-xl text-nature-700 mb-4">Objetivo da Lição</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-nature-100 rounded-full flex items-center justify-center text-nature-700 font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Compre pelo menos 5 produtos</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Adicione 5 ou mais produtos ao seu carrinho.
                        </p>
                        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-nature-500 transition-all duration-500"
                            style={{ width: `${Math.min(state.cart.length / 5, 1) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-nature-100 rounded-full flex items-center justify-center text-nature-700 font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Atinja sustentabilidade 7+</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Mantenha uma pontuação média de sustentabilidade de 7 ou mais.
                        </p>
                        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              state.sustainabilityScore >= 7 
                                ? 'bg-leaf-500' 
                                : 'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min(state.sustainabilityScore / 7, 1) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-nature-100 rounded-full flex items-center justify-center text-nature-700 font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Fique dentro do orçamento</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Mantenha-se dentro do orçamento de R$ 200,00.
                        </p>
                        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-nature-500 transition-all duration-500"
                            style={{ width: `${(state.remainingBudget / state.budget) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Accessibility tips */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-nature-100 animate-fade-in">
                <h3 className="font-bold text-xl text-nature-700 mb-4">Dicas de Acessibilidade</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-nature-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Use Tab para navegar entre os produtos e Enter para selecionar.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-nature-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Todos os produtos têm descrições detalhadas acessíveis por leitores de tela.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-nature-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      As informações de sustentabilidade são fornecidas tanto visualmente quanto em texto.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        
        @keyframes badge-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        
        @keyframes scale-up {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-badge-pulse {
          animation: badge-pulse 2s ease-in-out infinite;
        }
        
        .animate-scale-up {
          animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
