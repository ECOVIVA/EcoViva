import { ArrowLeft, Info, ShoppingCart, Star, Trash2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Product, Category, LessonState, EnvironmentalImpact } from "../";
import { useState, useEffect } from "react";

const EcoVivaLesson = () => {
  // ===== DATA MODELS =====
  // Produtos para o jogo de consumo consciente
  const products: Product[] = [
    {
      id: 1,
      name: "Camiseta de Algodão Orgânico",
      price: 89.9,
      image: "👕",
      sustainability: 9,
      badges: ["Orgânico", "Comércio Justo"],
      description: "Produzida com algodão orgânico certificado, sem uso de pesticidas e com práticas de comércio justo. Esta camiseta tem uma pegada de carbono 60% menor do que camisetas convencionais e utiliza técnicas de tingimento natural.",
      category: 1,
    },
    {
      id: 2,
      name: "Camiseta Comum",
      price: 39.9,
      image: "👕",
      sustainability: 3,
      badges: [],
      description: "Camiseta comum de algodão convencional, produzida com métodos tradicionais. O cultivo do algodão convencional utiliza grandes quantidades de pesticidas e água, além de práticas que podem esgotar o solo.",
      category: 1,
    },
    {
      id: 3,
      name: "Sabão em Pó Biodegradável",
      price: 28.9,
      image: "🧼",
      sustainability: 8,
      badges: ["Biodegradável", "Sem Fosfatos"],
      description: "Sabão em pó biodegradável, sem fosfatos e com embalagem reciclável. Este produto utiliza ingredientes que se decompõem naturalmente e não contaminam rios e lagos, protegendo a vida aquática.",
      category: 2,
    },
    {
      id: 4,
      name: "Sabão em Pó Comum",
      price: 18.9,
      image: "🧼",
      sustainability: 2,
      badges: [],
      description: "Sabão em pó convencional com componentes químicos que podem prejudicar o meio ambiente. Contém fosfatos que contribuem para a eutrofização de corpos d'água e surfactantes que podem ser tóxicos para organismos aquáticos.",
      category: 2,
    },
    {
      id: 5,
      name: "Garrafa Reutilizável",
      price: 59.9,
      image: "🍶",
      sustainability: 10,
      badges: ["Reutilizável", "Livre de BPA"],
      description: "Garrafa de aço inoxidável, durável e reutilizável, livre de BPA e outros componentes tóxicos. Pode substituir centenas de garrafas plásticas durante sua vida útil, reduzindo significativamente o lixo plástico.",
      category: 3,
    },
    {
      id: 6,
      name: "Garrafa de Água Descartável",
      price: 2.5,
      image: "🍶",
      sustainability: 1,
      badges: [],
      description: "Garrafa de plástico descartável que contribui para a poluição por plásticos. Menos de 30% dessas garrafas são recicladas e muitas acabam em aterros sanitários ou nos oceanos, onde podem levar até 450 anos para se decompor.",
      category: 3,
    },
    {
      id: 7,
      name: "Frutas Orgânicas Locais",
      price: 15.9,
      image: "🍎",
      sustainability: 9,
      badges: ["Orgânico", "Local"],
      description: "Frutas cultivadas organicamente por produtores locais, reduzindo a pegada de carbono do transporte. Métodos de cultivo orgânico promovem a saúde do solo, a biodiversidade e eliminam resíduos de pesticidas nos alimentos.",
      category: 4,
    },
    {
      id: 8,
      name: "Frutas Importadas",
      price: 25.9,
      image: "🍎",
      sustainability: 4,
      badges: ["Importado"],
      description: "Frutas importadas de outros países, com maior pegada de carbono devido ao transporte. O transporte de alimentos a longas distâncias contribui significativamente para as emissões de gases de efeito estufa e reduz a frescura dos produtos.",
      category: 4,
    },
    {
      id: 9,
      name: "Lâmpada LED",
      price: 12.9,
      image: "💡",
      sustainability: 8,
      badges: ["Econômica", "Durável"],
      description: "Lâmpada LED de baixo consumo energético e longa duração, reduzindo o desperdício. Consume até 80% menos energia que lâmpadas incandescentes e pode durar até 25 vezes mais, reduzindo o número de lâmpadas descartadas.",
      category: 5,
    },
    {
      id: 10,
      name: "Lâmpada Incandescente",
      price: 3.9,
      image: "💡",
      sustainability: 2,
      badges: [],
      description: "Lâmpada incandescente tradicional com alto consumo de energia e vida útil curta. Converte apenas 5% da energia que consome em luz, o restante é perdido como calor, resultando em grande desperdício energético.",
      category: 5,
    },
    {
      id: 11,
      name: "Detergente Concentrado",
      price: 15.9,
      image: "🧴",
      sustainability: 7,
      badges: ["Concentrado", "Menos Embalagem"],
      description: "Detergente concentrado que usa menos água e menos embalagem por lavagem. Uma pequena quantidade proporciona o mesmo poder de limpeza que grandes volumes de produtos convencionais, reduzindo o uso de plástico e os custos de transporte.",
      category: 2,
    },
    {
      id: 12,
      name: "Detergente Comum",
      price: 8.9,
      image: "🧴",
      sustainability: 3,
      badges: [],
      description: "Detergente comum com mais água em sua composição e mais embalagem por uso. Contém maior quantidade de água em sua formulação, o que significa mais embalagens plásticas e maior impacto no transporte por unidade de produto efetivo.",
      category: 2,
    },
  ];

  // Categorias de produtos
  const categories: Category[] = [
    { id: 1, name: "Vestuário", icon: "👕" },
    { id: 2, name: "Limpeza", icon: "🧼" },
    { id: 3, name: "Utensílios", icon: "🍶" },
    { id: 4, name: "Alimentos", icon: "🍎" },
    { id: 5, name: "Iluminação", icon: "💡" },
  ];

  // ===== STATE MANAGEMENT =====
  const [lessonState, setLessonState] = useState<LessonState>({
    cart: [],
    budget: 200,
    remainingBudget: 200,
    sustainabilityScore: 0,
    isCompleted: false,
    score: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // ===== UTILITY FUNCTIONS =====
  
  // Calculate sustainability score
  const calculateSustainabilityScore = (cart: number[]): number => {
    if (cart.length === 0) return 0;
    
    const sustainabilityTotal = cart.reduce((total, productId) => {
      const product = products.find((p) => p.id === productId);
      return total + (product?.sustainability || 0);
    }, 0);

    return sustainabilityTotal / cart.length;
  };

  // Calculate remaining budget
  const calculateRemainingBudget = (cart: number[]): number => {
    const totalCost = cart.reduce((total, productId) => {
      const product = products.find((p) => p.id === productId);
      return total + (product?.price || 0);
    }, 0);

    return lessonState.budget - totalCost;
  };

  // Calculate environmental impact
  const calculateEnvironmentalImpact = (sustainabilityScore: number): EnvironmentalImpact => {
    return {
      carbonFootprint: Math.max(0, 10 - sustainabilityScore),
      waterSavings: sustainabilityScore * 50,
      wasteReduction: sustainabilityScore * 0.3,
    };
  };

  // Check if lesson is completed
  const checkLessonCompletion = (cart: number[], sustainabilityScore: number): boolean => {
    return cart.length >= 5 && sustainabilityScore >= 7;
  };

  // Get color based on sustainability value
  const getSustainabilityColorClass = (value: number): string => {
    if (value >= 8) return "text-leaf-600";
    if (value >= 6) return "text-nature-600";
    if (value >= 4) return "text-yellow-500";
    if (value >= 2) return "text-orange-500";
    return "text-red-500";
  };

  // Get sustainability stars visual representation
  const getSustainabilityStars = (value: number) => {
    const fullStars = Math.floor(value / 2);
    const halfStar = value % 2 >= 1;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
        {halfStar && (
          <div className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  // Get badge color
  const getBadgeColor = (badge: string): string => {
    switch (badge) {
      case "Orgânico":
      case "Biodegradável":
      case "Local":
      case "Reutilizável":
        return "bg-leaf-100 text-leaf-800 border-leaf-200";
      case "Comércio Justo":
      case "Sem Fosfatos":
      case "Livre de BPA":
        return "bg-water-100 text-water-800 border-water-200";
      case "Econômica":
      case "Durável":
      case "Concentrado":
      case "Menos Embalagem":
        return "bg-nature-100 text-nature-800 border-nature-200";
      case "Importado":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filter products based on selected category
  const getFilteredProducts = (): Product[] => {
    if (selectedCategory === null) {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  };

  // ===== EVENT HANDLERS =====
  
  // Add product to cart
  const handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Check budget
    if (product.price > lessonState.remainingBudget) {
      toast({
        title: "Orçamento insuficiente!",
        description: "Você não tem orçamento suficiente para este produto.",
        variant: "destructive",
      });
      return;
    }

    // Update cart
    setLessonState((prev) => ({
      ...prev,
      cart: [...prev.cart, productId],
    }));

    // Feedback based on sustainability
    if (product.sustainability >= 7) {
      toast({
        title: "Excelente escolha!",
        description: "Este é um produto com alta sustentabilidade.",
      });
    } else if (product.sustainability >= 4) {
      toast({
        title: "Escolha moderada",
        description: "Este produto tem sustentabilidade média.",
      });
    } else {
      toast({
        title: "Escolha pouco sustentável",
        description: "Existem alternativas mais sustentáveis para este produto.",
        variant: "destructive",
      });
    }
  };

  // Remove product from cart
  const handleRemoveFromCart = (productId: number) => {
    setLessonState((prev) => ({
      ...prev,
      cart: prev.cart.filter((id) => id !== productId),
    }));
  };

  // Reset lesson
  const handleReset = () => {
    setLessonState({
      cart: [],
      budget: 200,
      remainingBudget: 200,
      sustainabilityScore: 0,
      isCompleted: false,
      score: 0,
    });
    setSelectedProduct(null);
    setSelectedCategory(null);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    if (categoryId !== null) {
      setAnimatedIndex(categoryId);
      setTimeout(() => setAnimatedIndex(null), 600);
    }
  };

  // ===== EFFECTS =====
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);