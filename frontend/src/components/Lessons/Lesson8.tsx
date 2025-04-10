
import api from '../../services/API/axios';
import * as useToast from '../../hooks/use-toast';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import routes from '../../services/API/routes';


// Espécies e seus habitats
const species = [
  {
    id: 1,
    name: "Onça-pintada",
    type: "animal",
    icon: "🐆",
    habitat: "floresta",
    description: "Maior felino das Américas, vive principalmente em florestas densas e áreas úmidas.",
  },
  {
    id: 2,
    name: "Arara-azul",
    type: "animal",
    icon: "🦜",
    habitat: "floresta",
    description: "Ave de grande porte com plumagem azul vibrante, habita florestas e se alimenta de sementes e nozes.",
  },
  {
    id: 3,
    name: "Peixe-boi",
    type: "animal",
    icon: "🐋",
    habitat: "agua-doce",
    description: "Mamífero aquático herbívoro que vive em rios e lagos de água doce.",
  },
  {
    id: 4,
    name: "Bromélia",
    type: "planta",
    icon: "🌺",
    habitat: "floresta",
    description: "Planta epífita que cresce sobre outras plantas, comum em florestas tropicais úmidas.",
  },
  {
    id: 5,
    name: "Cacto",
    type: "planta",
    icon: "🌵",
    habitat: "deserto",
    description: "Planta suculenta adaptada a ambientes áridos, armazena água em seu caule.",
  },
  {
    id: 6,
    name: "Lobo-guará",
    type: "animal",
    icon: "🐺",
    habitat: "cerrado",
    description: "Canídeo de pernas longas e pelagem avermelhada, habita áreas de vegetação aberta.",
  },
  {
    id: 7,
    name: "Coral",
    type: "animal",
    icon: "🪸",
    habitat: "oceano",
    description: "Organismo marinho que forma recifes, habitat vital para muitas espécies marinhas.",
  },
  {
    id: 8,
    name: "Alga Marinha",
    type: "planta",
    icon: "🌿",
    habitat: "oceano",
    description: "Organismo fotossintetizante que vive em ambientes marinhos, base da cadeia alimentar oceânica.",
  },
  {
    id: 9,
    name: "Vitória-régia",
    type: "planta",
    icon: "🪷",
    habitat: "agua-doce",
    description: "Planta aquática com folhas gigantes em forma de bandeja que flutuam na superfície da água.",
  },
  {
    id: 10,
    name: "Tamanduá-bandeira",
    type: "animal",
    icon: "🐜",
    habitat: "cerrado",
    description: "Mamífero com focinho alongado e língua pegajosa, especializado em comer formigas e cupins.",
  },
  {
    id: 11,
    name: "Tubarão",
    type: "animal",
    icon: "🦈",
    habitat: "oceano",
    description:
      "Predador marinho com esqueleto cartilaginoso, fundamental para o equilíbrio dos ecossistemas marinhos.",
  },
  {
    id: 12,
    name: "Ipê-amarelo",
    type: "planta",
    icon: "🌳",
    habitat: "cerrado",
    description: "Árvore com flores amarelas vibrantes, típica do cerrado brasileiro.",
  },
];

// Habitats
const habitats = [
  {
    id: "floresta",
    name: "Floresta Tropical",
    icon: "🌴",
    cardClass: "habitat-card-forest",
    description: "Ecossistema com alta biodiversidade, caracterizado por árvores altas e densa vegetação.",
  },
  {
    id: "cerrado",
    name: "Cerrado",
    icon: "🌾",
    cardClass: "habitat-card-cerrado",
    description: "Savana tropical com árvores esparsas, arbustos e gramíneas, sujeita a incêndios periódicos.",
  },
  {
    id: "deserto",
    name: "Deserto",
    icon: "🏜️",
    cardClass: "habitat-card-desert",
    description: "Região árida com pouca precipitação, temperaturas extremas e vegetação adaptada à escassez de água.",
  },
  {
    id: "oceano",
    name: "Oceano",
    icon: "🌊",
    cardClass: "habitat-card-ocean",
    description: "Maior ecossistema do planeta, abriga uma enorme diversidade de vida marinha.",
  },
  {
    id: "agua-doce",
    name: "Água Doce",
    icon: "🏞️",
    cardClass: "habitat-card-freshwater",
    description: "Ecossistemas de rios, lagos e pântanos, fundamentais para a biodiversidade e ciclo da água.",
  },
];

// Facts about biodiversity for random display
const bioFacts = [
  "O Brasil abriga cerca de 20% da biodiversidade mundial, incluindo mais de 116.000 espécies animais e 46.000 espécies vegetais.",
  "Uma única árvore na Amazônia pode abrigar mais de 400 espécies diferentes de insetos.",
  "A cada ano, aproximadamente 18.000 novas espécies são descobertas no mundo.",
  "Os recifes de coral ocupam menos de 1% dos oceanos, mas abrigam mais de 25% de todas as espécies marinhas.",
  "O Pantanal é a maior planície alagável do mundo, servindo de habitat para mais de 4.700 espécies.",
  "O bioma mais ameaçado do Brasil é a Mata Atlântica, com apenas 12% de sua cobertura original restante.",
  "Uma única colher de solo saudável contém mais microrganismos do que o número de pessoas no planeta.",
  "Os manguezais funcionam como berçários naturais para muitas espécies marinhas e protegem a costa contra erosão.",
  "Mais de 80% das espécies de plantas terrestres dependem de polinizadores como abelhas, borboletas e pássaros.",
  "A velocidade atual de extinção de espécies é 1.000 vezes maior que a taxa natural devido à atividade humana."
];

interface Match {
  speciesId: number;
  habitatId: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
  angle?: number;
  opacity?: number;
}

const Index = () => {
  // Game state
  const [selectedSpecies, setSelectedSpecies] = useState<number | null>(null);
  const [selectedHabitat, setSelectedHabitat] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [gameMode, setGameMode] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [correctMatches, setCorrectMatches] = useState(0);
  const [incorrectMatches, setIncorrectMatches] = useState(0);
  const [playerName, setPlayerName] = useState(localStorage.getItem('ecoQuest_playerName') || 'Explorador');
  const [soundEnabled, setSoundEnabled] = useState(localStorage.getItem('ecoQuest_sound') !== 'off');
  const [showTutorial, setShowTutorial] = useState(false);

  // UI state
  const [showInfo, setShowInfo] = useState(false);
  const [showSpeciesInfo, setShowSpeciesInfo] = useState<number | null>(null);
  const [showHabitatInfo, setShowHabitatInfo] = useState<string | null>(null);
  const [bioFactIndex, setBioFactIndex] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Refs
  const timerRef = useRef<number | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const audioSuccess = useRef<HTMLAudioElement | null>(null);
  const audioError = useRef<HTMLAudioElement | null>(null);
  const audioComplete = useRef<HTMLAudioElement | null>(null);
  const audioBgm = useRef<HTMLAudioElement | null>(null);
  
  
  // Generate facts about biodiversity
  useEffect(() => {
    const interval = setInterval(() => {
      setBioFactIndex((prev) => (prev + 1) % bioFacts.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  // Initialize audio elements
  useEffect(() => {
    // Create audio elements if they don't exist
    if (!audioSuccess.current) {
      audioSuccess.current = new Audio();
      audioSuccess.current.src = 'https://assets.mixkit.co/sfx/preview/mixkit-game-success-alert-2039.mp3';
      audioSuccess.current.volume = 0.5;
    }
    
    if (!audioError.current) {
      audioError.current = new Audio();
      audioError.current.src = 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-remove-2576.mp3';
      audioError.current.volume = 0.5;
    }
    
    if (!audioComplete.current) {
      audioComplete.current = new Audio();
      audioComplete.current.src = 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-completed-2068.mp3';
      audioComplete.current.volume = 0.5;
    }
    
    if (!audioBgm.current) {
      audioBgm.current = new Audio();
      audioBgm.current.src = 'https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.mp3';
      audioBgm.current.volume = 0.3;
      audioBgm.current.loop = true;
    }
    
    return () => {
      if (audioSuccess.current) {
        audioSuccess.current = null;
      }
      
      if (audioError.current) {
        audioError.current = null;
      }
      
      if (audioComplete.current) {
        audioComplete.current = null;
      }

      if (audioBgm.current) {
        audioBgm.current.pause();
        audioBgm.current = null;
      }
    };
  }, []);

  // Game timer
  useEffect(() => {
    if (gameStarted && !isCompleted && timeRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, isCompleted]);

  // Track correct matches and handle completion
  useEffect(() => {
    const correctCount = matches.filter((match) => {
      const speciesObj = species.find((s) => s.id === match.speciesId);
      return speciesObj?.habitat === match.habitatId;
    }).length;

    setCorrectMatches(correctCount);
    
    // Check if game is completed
    const requiredMatches = gameMode === 'easy' ? 6 : gameMode === 'medium' ? 9 : 12;
    
    if (correctCount >= requiredMatches && !isCompleted && gameStarted) {
      const completionApi = async() => {
        try{
        const response = await api.post(routes.study.lessons_completion.create, {lesson: 8})

        if (response.status === 201){
          endGame(true);
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
  }, [matches, gameMode]);

  // Handle background music
  useEffect(() => {
    if (gameStarted && soundEnabled && audioBgm.current) {
      audioBgm.current.play().catch(e => console.error('Audio error:', e));
    } else if (audioBgm.current) {
      audioBgm.current.pause();
    }
  }, [gameStarted, soundEnabled]);

  // Store user preferences
  useEffect(() => {
    localStorage.setItem('ecoQuest_sound', soundEnabled ? 'on' : 'off');
    localStorage.setItem('ecoQuest_playerName', playerName);
  }, [soundEnabled, playerName]);

  // Create particle effect
  const createParticles = (x: number, y: number, isSuccess: boolean) => {
    const colors = isSuccess ? 
      ['#0FFF95', '#0B6E4F', '#1A7CA0', '#5ABFDD'] : 
      ['#EF4444', '#F87171', '#FCA5A5', '#FEE2E2'];
    
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      speed: Math.random() * 4 + 2,
      angle: Math.random() * 360,
      opacity: 1
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  // Create confetti effect for game completion
  const createConfetti = () => {
    if (!gameContainerRef.current) return;
    
    const containerRect = gameContainerRef.current.getBoundingClientRect();
    const colors = ['#0FFF95', '#0B6E4F', '#1A7CA0', '#5ABFDD', '#D9923B', '#E3B23C', '#FF6B6B', '#4ECDC4', '#FFD166'];
    
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * containerRect.width,
      y: -20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 12 + 8,
      speed: Math.random() * 6 + 4,
      angle: Math.random() * 60 - 30,
      opacity: 1
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 3000);
  };

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start the game
  const startGame = (mode: 'easy' | 'medium' | 'hard') => {
    setGameMode(mode);
    setGameStarted(true);
    setMatches([]);
    setSelectedSpecies(null);
    setSelectedHabitat(null);
    setIsCompleted(false);
    setScore(0);
    setStreak(0);
    setShowResults(false);
    setIncorrectMatches(0);
    
    // Set time based on difficulty
    if (mode === 'easy') {
      setTimeRemaining(300); // 5 minutes
    } else if (mode === 'medium') {
      setTimeRemaining(240); // 4 minutes
    } else {
      setTimeRemaining(180); // 3 minutes
    }
    
    useToast.toast({
      title: 'Jogo iniciado!',
      description: `Modo ${mode === 'easy' ? 'Fácil' : mode === 'medium' ? 'Médio' : 'Difícil'}. Combine as espécies com seus habitats!`,
      variant: 'default',
    });
  };

  // End the game
  const endGame = (success = false) => {
    setIsCompleted(true);
    setGameStarted(false);
    setShowResults(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const finalScore = calculateFinalScore();
    setScore(finalScore);
    
    // Save progress - in a real app this would use localStorage or API
    const bestScore = Math.max(finalScore, parseInt(localStorage.getItem('ecoQuest_bestScore') || '0'));
    localStorage.setItem('ecoQuest_bestScore', bestScore.toString());
    
    // Play sound and show confetti for successful completion
    if (success) {
      if (soundEnabled && audioComplete.current) {
        audioComplete.current.play().catch(e => console.error('Audio error:', e));
      }
      setShowConfetti(true);
      createConfetti();
      
      useToast.toast({
        title: 'Parabéns!',
        description: `Você completou o desafio com ${correctMatches} correspondências corretas!`,
        variant: 'default',
      });
    } else {
      useToast.toast({
        title: 'Tempo esgotado!',
        description: `Você fez ${correctMatches} correspondências corretas.`,
        variant: 'default',
      });
    }
  };

  // Calculate final score based on correct matches, time remaining, and game mode
  const calculateFinalScore = () => {
    const baseScore = correctMatches * 100;
    const timeBonus = timeRemaining * 2;
    const streakBonus = streak * 25;
    const difficultyMultiplier = gameMode === 'easy' ? 1 : gameMode === 'medium' ? 1.5 : 2;
    
    return Math.round((baseScore + timeBonus + streakBonus) * difficultyMultiplier);
  };

  // Get the habitat assigned to a species
  const getHabitatForSpecies = (speciesId: number) => {
    const match = matches.find((m) => m.speciesId === speciesId);
    return match ? match.habitatId : null;
  };

  // Get all species assigned to a habitat
  const getSpeciesForHabitat = (habitatId: string) => {
    return matches.filter((m) => m.habitatId === habitatId).map((m) => m.speciesId);
  };

  // Check if a species-habitat match is correct
  const isCorrectMatch = (speciesId: number, habitatId: string) => {
    const speciesObj = species.find((s) => s.id === speciesId);
    return speciesObj?.habitat === habitatId;
  };

  // Handle selection of a species
  const handleSpeciesSelect = (id: number, event: React.MouseEvent) => {
    if (isCompleted) return;
    
    setSelectedSpecies(id);
    setShowSpeciesInfo(null);
    
    // If a habitat is already selected, make the match
    if (selectedHabitat) {
      makeMatch(id, selectedHabitat, event);
    }
  };

  // Handle selection of a habitat
  const handleHabitatSelect = (id: string, event: React.MouseEvent) => {
    if (isCompleted) return;
    
    setSelectedHabitat(id);
    setShowHabitatInfo(null);
    
    // If a species is already selected, make the match
    if (selectedSpecies !== null) {
      makeMatch(selectedSpecies, id, event);
    }
  };

  // Make a match between a species and a habitat
  const makeMatch = (speciesId: number, habitatId: string, event: React.MouseEvent) => {
    // Get coordinates for particle effect
    const x = event.clientX;
    const y = event.clientY;
    
    // Check if this is a correct match
    const isCorrect = isCorrectMatch(speciesId, habitatId);
    
    // Update streak
    if (isCorrect) {
      setStreak(prev => prev + 1);
      if (soundEnabled && audioSuccess.current) {
        audioSuccess.current.play().catch(e => console.error('Audio error:', e));
      }
    } else {
      setStreak(0);
      setIncorrectMatches(prev => prev + 1);
      if (soundEnabled && audioError.current) {
        audioError.current.play().catch(e => console.error('Audio error:', e));
      }
    }
    
    // Create particle effect
    createParticles(x, y, isCorrect);
    
    // Check if this species already has a match
    const existingMatchIndex = matches.findIndex(m => m.speciesId === speciesId);
    
    if (existingMatchIndex !== -1) {
      // Replace existing match
      const newMatches = [...matches];
      newMatches[existingMatchIndex] = { speciesId, habitatId };
      setMatches(newMatches);
    } else {
      // Add new match
      setMatches(prev => [...prev, { speciesId, habitatId }]);
    }
    
    // Add toast notification
    const speciesObj = species.find(s => s.id === speciesId);
    const habitatObj = habitats.find(h => h.id === habitatId);
    
    if (isCorrect) {
      useToast.toast({
        title: "Correspondência correta!",
        description: `${speciesObj?.name} realmente vive em ${habitatObj?.name}!`,
        variant: "default",
      });
    } else {
      useToast.toast({
        title: "Correspondência incorreta",
        description: "Esta não é a correspondência ideal. Tente novamente!",
        variant: "destructive",
      });
    }
    
    // Reset selections
    setSelectedSpecies(null);
    setSelectedHabitat(null);
  };

  // Reset the game
  const resetGame = () => {
    setMatches([]);
    setSelectedSpecies(null);
    setSelectedHabitat(null);
    setIsCompleted(false);
    setScore(0);
    setStreak(0);
    setShowResults(false);
    setGameStarted(false);
    setIncorrectMatches(0);
  };

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Update player name
  const updatePlayerName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  // Get filtered species based on game mode
  const filteredSpecies = useMemo(() => {
    if (gameMode === 'easy') {
      return species.slice(0, 6);
    } else if (gameMode === 'medium') {
      return species.slice(0, 9);
    }
    return species;
  }, [gameMode]);

  // Custom progress bar
  const ProgressBar = ({ value }: { value: number }) => (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${value}%` }}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(15,255,149,0.03),transparent_70%)] animate-pulse-ring"></div>
        
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-float"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity || 0.8,
              transform: 'translateY(0)',
              animation: showConfetti ? 
                `float 2s ease-in-out infinite, slide-down 2s ease-out forwards` : 
                'float 1s ease-in-out infinite, fade-out 1s ease-out forwards'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-lg shadow-md py-4 px-6 border-b border-gray-100">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-eco-leaf to-eco-forest text-white rounded-xl shadow-md animate-pulse-ring">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-eco-forest via-eco-leaf to-eco-ocean bg-clip-text text-transparent">
              EcoAprendiz
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            {gameStarted && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="font-mono">{formatTime(timeRemaining)}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                  </svg>
                  <span className="font-semibold">{score}</span>
                </div>
                {streak > 1 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-eco-leaf/10 rounded-full text-xs text-eco-forest animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                    </svg>
                    <span>Sequência: {streak}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button 
                className="button-icon"
                onClick={() => setShowInfo(!showInfo)}
                aria-label="Informações sobre biodiversidade"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
              </button>
              
              <button 
                className="button-icon"
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Configurações"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
              
              <button 
                className="button-icon"
                onClick={() => setShowTutorial(true)}
                aria-label="Tutorial"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 relative z-10" ref={gameContainerRef}>
        <div className="max-w-5xl mx-auto">
          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
              <div className="premium-card p-8 max-w-md w-full animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Configurações</h2>
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Jogador</label>
                    <input 
                      type="text"
                      value={playerName}
                      onChange={updatePlayerName}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-eco-leaf focus:border-eco-leaf"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Som</span>
                    <button 
                      onClick={toggleSound}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${soundEnabled ? 'bg-eco-leaf' : 'bg-gray-300'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="button-primary"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Tutorial Modal */}
          {showTutorial && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
              <div className="premium-card p-8 max-w-lg w-full animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Como Jogar</h2>
                  <button 
                    onClick={() => setShowTutorial(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-eco-leaf/20 flex items-center justify-center text-eco-forest flex-shrink-0">
                      1
                    </div>
                    <p>Selecione uma espécie clicando em seu cartão.</p>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-eco-leaf/20 flex items-center justify-center text-eco-forest flex-shrink-0">
                      2
                    </div>
                    <p>Depois, selecione o habitat onde você acredita que essa espécie vive naturalmente.</p>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-eco-leaf/20 flex items-center justify-center text-eco-forest flex-shrink-0">
                      3
                    </div>
                    <p>Você receberá feedback imediato se a combinação estiver correta ou incorreta.</p>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-eco-leaf/20 flex items-center justify-center text-eco-forest flex-shrink-0">
                      4
                    </div>
                    <p>Complete o desafio combinando o número necessário de espécies antes que o tempo acabe!</p>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={() => setShowTutorial(false)}
                      className="button-primary"
                    >
                      Entendi!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Welcome screen / Game setup */}
          {!gameStarted && !showResults && (
            <div className="premium-card p-8 animate-fade-in">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 rounded-full bg-gradient-to-br from-eco-leaf/20 to-eco-forest/20 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-eco-forest">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-eco-forest via-eco-leaf to-eco-ocean bg-clip-text text-transparent">
                    Desafio de Biodiversidade
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Olá, <span className="font-semibold">{playerName}</span>! Teste seus conhecimentos sobre biodiversidade combinando espécies com seus habitats naturais.
                    Descubra a complexidade e beleza dos diferentes ecossistemas.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => startGame('easy')}
                    className="neo-panel p-6 hover:shadow-lg hover:translate-y-[-2px] transition-all flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100 mb-4 animate-bounce-subtle">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-eco-forest">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Modo Fácil</h3>
                    <p className="text-sm text-gray-600 text-center">
                      6 espécies para combinar<br />
                      5 minutos de tempo<br />
                      Perfeito para iniciantes
                    </p>
                  </button>
                  
                  <button 
                    onClick={() => startGame('medium')}
                    className="neo-panel p-6 hover:shadow-lg hover:translate-y-[-2px] transition-all flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-yellow-100 mb-4 animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-eco-cerrado">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Modo Médio</h3>
                    <p className="text-sm text-gray-600 text-center">
                      9 espécies para combinar<br />
                      4 minutos de tempo<br />
                      Para conhecedores
                    </p>
                  </button>
                  
                  <button 
                    onClick={() => startGame('hard')}
                    className="neo-panel p-6 hover:shadow-lg hover:translate-y-[-2px] transition-all flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-100 mb-4 animate-bounce-subtle" style={{ animationDelay: '0.4s' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Modo Difícil</h3>
                    <p className="text-sm text-gray-600 text-center">
                      Todas as 12 espécies<br />
                      3 minutos de tempo<br />
                      Para especialistas
                    </p>
                  </button>
                </div>
                
                <div className="flex justify-center items-center my-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full"></div>
                  <div className="px-4 text-gray-500 text-sm whitespace-nowrap">MELHOR PONTUAÇÃO</div>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full"></div>
                </div>
                
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-elegant p-4 flex justify-center items-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-eco-forest via-eco-leaf to-eco-ocean bg-clip-text text-transparent animate-pulse">
                      {localStorage.getItem('ecoQuest_bestScore') || '0'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">pontos</div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-eco-leaf/10 to-eco-forest/10 border border-eco-leaf/20">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-6 h-6 text-eco-forest"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" 
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2 text-eco-forest">Sabia que...</h3>
                      <p className="text-gray-700">{bioFacts[bioFactIndex]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Game interface */}
          {gameStarted && !showResults && (
            <div className="premium-card p-6 animate-fade-in">
              {showInfo && (
                <div className="mb-6 p-4 rounded-3xl bg-gradient-to-br from-eco-leaf/10 to-eco-forest/10 border border-eco-leaf/20 animate-slide-up">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-6 h-6 text-eco-forest"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" 
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2 text-eco-forest">Sobre Biodiversidade</h3>
                      <p className="mb-2 text-gray-700">
                        Biodiversidade refere-se à variedade de vida na Terra, incluindo a diversidade dentro das espécies,
                        entre espécies e dos ecossistemas.
                      </p>
                      <p className="text-gray-700">
                        Nesta atividade, você aprenderá sobre diferentes espécies e seus habitats naturais, compreendendo a
                        importância da preservação dos ecossistemas para manter a biodiversidade.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progresso</span>
                  <span className="text-sm font-medium">
                    {matches.length} de {filteredSpecies.length} espécies classificadas
                  </span>
                </div>
                <ProgressBar value={(matches.length / filteredSpecies.length) * 100} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Species section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">Espécies</h3>
                    <div className="text-xs text-gray-500">
                      {correctMatches} corretas, {incorrectMatches} incorretas
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {filteredSpecies.map((s) => {
                      const habitatId = getHabitatForSpecies(s.id);
                      const habitat = habitatId ? habitats.find((h) => h.id === habitatId) : null;
                      const isCorrect = habitatId ? isCorrectMatch(s.id, habitatId) : null;

                      return (
                        <div key={s.id} className="relative">
                          <button
                            onClick={(e) => handleSpeciesSelect(s.id, e)}
                            className={`species-card ${
                              selectedSpecies === s.id
                                ? 'species-card-selected'
                                : habitatId
                                ? isCorrect
                                  ? 'species-card-matched'
                                  : 'species-card-mismatched'
                                : ''
                            } w-full transition-all duration-300`}
                            aria-label={`${s.name} - ${s.type} - ${habitat ? "Classificado como " + habitat.name : "Não classificado"}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-3xl" role="img" aria-hidden="true">
                                {s.icon}
                              </span>
                              <div className="text-left">
                                <div className="font-medium">{s.name}</div>
                                <div className="text-xs text-gray-600 capitalize">{s.type}</div>
                              </div>
                              {habitatId && (
                                <div className="ml-auto">
                                  {isCorrect ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-600">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                          </button>
                          <button
                            onClick={() => setShowSpeciesInfo(showSpeciesInfo === s.id ? null : s.id)}
                            className="info-icon"
                            aria-label={`Informações sobre ${s.name}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                            </svg>
                          </button>

                          {showSpeciesInfo === s.id && (
                            <div className="info-tooltip">
                              <p className="text-sm">{s.description}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Habitats section */}
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Habitats</h3>

                  <div className="space-y-3">
                    {habitats.map((habitat) => {
                      const speciesIds = getSpeciesForHabitat(habitat.id);
                      const correctMatches = speciesIds.filter((id) => isCorrectMatch(id, habitat.id)).length;

                      return (
                        <div key={habitat.id} className="relative">
                          <button
                            onClick={(e) => handleHabitatSelect(habitat.id, e)}
                            className={`habitat-card ${habitat.cardClass} ${selectedHabitat === habitat.id ? 'ring-2 ring-eco-leaf' : ''}`}
                            aria-label={`${habitat.name} - ${speciesIds.length} espécies classificadas`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center text-3xl shadow-md">
                                <span role="img" aria-hidden="true">
                                  {habitat.icon}
                                </span>
                              </div>
                              <div className="text-left flex-1">
                                <div className="font-medium text-gray-800">{habitat.name}</div>
                                <div className="text-xs text-gray-600">
                                  {speciesIds.length} espécies ({correctMatches} corretas)
                                </div>
                              </div>
                            </div>

                            {speciesIds.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {speciesIds.map((id) => {
                                  const speciesObj = species.find((s) => s.id === id);
                                  const correct = isCorrectMatch(id, habitat.id);
                                  
                                  return (
                                    <span
                                      key={id}
                                      className={`badge ${correct ? 'badge-correct' : 'badge-incorrect'}`}
                                    >
                                      <span className="mr-1">{speciesObj?.icon}</span>
                                      <span>{speciesObj?.name}</span>
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </button>
                          <button
                            onClick={() => setShowHabitatInfo(showHabitatInfo === habitat.id ? null : habitat.id)}
                            className="info-icon"
                            aria-label={`Informações sobre ${habitat.name}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                            </svg>
                          </button>

                          {showHabitatInfo === habitat.id && (
                            <div className="info-tooltip">
                              <p className="text-sm">{habitat.description}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Results screen */}
          {showResults && (
            <div className="premium-card p-8 animate-slide-up">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-eco-leaf to-eco-forest flex items-center justify-center text-white mx-auto mb-4 shadow-lg animate-pulse-ring">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold mb-2">Desafio Concluído!</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Você completou o desafio de biodiversidade no modo 
                  <span className="font-medium text-gray-800">
                    {gameMode === 'easy' ? ' Fácil' : gameMode === 'medium' ? ' Médio' : ' Difícil'}
                  </span>.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="neo-panel p-6 text-center">
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-eco-forest to-eco-leaf bg-clip-text text-transparent">
                    {score}
                  </div>
                  <div className="text-gray-500">pontos totais</div>
                </div>
                
                <div className="neo-panel p-6 text-center">
                  <div className="text-5xl font-bold mb-2 text-eco-forest">
                    {correctMatches}
                  </div>
                  <div className="text-gray-500">correspondências corretas</div>
                </div>
                
                <div className="neo-panel p-6 text-center">
                  <div className="text-5xl font-bold mb-2 text-gray-700">
                    {formatTime(300 - timeRemaining)}
                  </div>
                  <div className="text-gray-500">tempo usado</div>
                </div>
              </div>
              
              <p className="mb-6 text-center text-gray-600">
                A biodiversidade é essencial para a manutenção da vida na Terra. Cada espécie tem seu papel 
                no equilíbrio dos ecossistemas e a preservação de seus habitats naturais é fundamental para 
                garantir a sobrevivência de todas as formas de vida, incluindo a nossa.
              </p>
              
              <div className="flex justify-center gap-4">
                <button 
                  onClick={resetGame} 
                  className="button-secondary"
                >
                  Jogar Novamente
                </button>
                <button 
                  onClick={() => startGame(gameMode)} 
                  className="button-primary"
                >
                  Melhorar Minha Pontuação
                </button>
              </div>
            </div>
          )}
          
          {/* Accessibility tips */}
          <div className="mt-8 premium-card p-6">
            <h3 className="text-xl font-bold text-eco-forest mb-4">Dicas de Acessibilidade</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-eco-forest">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span>Use Tab para navegar entre as espécies e habitats, e Enter para selecionar.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-eco-forest">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span>O botão "i" fornece informações adicionais sobre cada espécie e habitat.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-eco-forest">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span>Todas as correspondências são indicadas tanto visualmente quanto em texto para leitores de tela.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;