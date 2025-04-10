import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ArrowRight, Check, X, Leaf, Info, Trophy, Timer, 
  Award, Sparkles, Heart, RotateCcw, Clock, Star, BarChart, 
  BookOpen, Medal, Target
} from 'lucide-react';

// Enhanced quiz questions about plastic reduction
const quizQuestions = [
  {
    id: 1,
    question: "Qual alternativa é melhor para substituir sacolas plásticas descartáveis?",
    options: [
      { id: "a", text: "Sacolas de papel descartáveis", fact: "Sacolas de papel exigem 4x mais energia para produzir do que sacolas plásticas." },
      { id: "b", text: "Sacolas biodegradáveis de uso único", fact: "Sacolas biodegradáveis ainda geram resíduos e muitas exigem condições específicas para se degradar." },
      { id: "c", text: "Sacolas reutilizáveis de tecido", fact: "Uma sacola de algodão reutilizável precisa ser usada 131 vezes para compensar seu impacto ambiental inicial." },
      { id: "d", text: "Sacolas plásticas mais grossas", fact: "Sacolas mais grossas usam mais plástico, agravando o problema se descartadas após poucas utilizações." },
    ],
    correctAnswer: "c",
    explanation: "Sacolas reutilizáveis de tecido têm o menor impacto ambiental quando usadas múltiplas vezes, reduzindo significativamente o consumo de plástico descartável.",
    difficulty: "fácil",
    category: "consumo",
    timeToAnswer: 20
  },
  {
    id: 2,
    question: "Aproximadamente, quanto tempo leva para uma garrafa plástica se decompor na natureza?",
    options: [
      { id: "a", text: "10 anos", fact: "Mesmo 10 anos é tempo suficiente para causar danos aos ecossistemas." },
      { id: "b", text: "50 anos", fact: "Neste período, o plástico apenas se fragmenta em pedaços menores (microplásticos)." },
      { id: "c", text: "100 anos", fact: "Um século inteiro de poluição para cada garrafa descartada incorretamente." },
      { id: "d", text: "450 anos ou mais", fact: "Algumas estimativas sugerem até 1000 anos para decomposição completa." },
    ],
    correctAnswer: "d",
    explanation: "As garrafas plásticas podem levar 450 anos ou mais para se decompor completamente na natureza, causando danos prolongados aos ecossistemas.",
    difficulty: "médio",
    category: "impacto",
    timeToAnswer: 15
  },
  {
    id: 3,
    question: "Qual destas opções NÃO é uma boa alternativa para reduzir o uso de plásticos?",
    options: [
      { id: "a", text: "Usar canudos de papel descartáveis diariamente", fact: "A produção de papel também consome recursos e energia consideráveis." },
      { id: "b", text: "Levar sua própria garrafa reutilizável", fact: "Uma garrafa reutilizável pode substituir centenas de garrafas plásticas por ano." },
      { id: "c", text: "Comprar alimentos a granel", fact: "Compras a granel podem reduzir até 80% das embalagens plásticas em alimentos." },
      { id: "d", text: "Usar potes de vidro para armazenamento", fact: "Potes de vidro duram décadas e não liberam substâncias químicas nos alimentos." },
    ],
    correctAnswer: "a",
    explanation: "Embora canudos de papel sejam melhores que os de plástico, seu uso diário ainda gera resíduos desnecessários. O ideal é usar alternativas reutilizáveis como canudos de metal ou simplesmente não usar canudos.",
    difficulty: "médio",
    category: "soluções",
    timeToAnswer: 25
  },
  {
    id: 4,
    question: "Qual é o principal destino do plástico descartado incorretamente?",
    options: [
      { id: "a", text: "Aterros sanitários", fact: "Mesmo em aterros, o plástico pode levar séculos para se decompor." },
      { id: "b", text: "Oceanos", fact: "Estima-se que até 2050 haja mais plástico do que peixes nos oceanos." },
      { id: "c", text: "Incineração", fact: "A queima de plástico libera compostos tóxicos na atmosfera." },
      { id: "d", text: "Reciclagem", fact: "Apenas 9% de todo o plástico já produzido foi reciclado." },
    ],
    correctAnswer: "b",
    explanation: "Grande parte do plástico descartado incorretamente acaba nos oceanos, formando grandes ilhas de lixo e afetando a vida marinha.",
    difficulty: "fácil",
    category: "impacto",
    timeToAnswer: 15
  },
  {
    id: 5,
    question: "Qual destas ações tem maior impacto na redução do consumo de plásticos?",
    options: [
      { id: "a", text: "Recusar produtos com excesso de embalagens", fact: "Aproximadamente 40% do plástico produzido é usado para embalagens descartáveis." },
      { id: "b", text: "Separar o lixo para reciclagem", fact: "A reciclagem é importante, mas tem limitações e usa energia." },
      { id: "c", text: "Reutilizar embalagens plásticas", fact: "Reutilizar estende a vida útil, mas eventualmente a embalagem será descartada." },
      { id: "d", text: "Comprar produtos biodegradáveis", fact: "Muitos produtos 'biodegradáveis' precisam de condições específicas para se degradar." },
    ],
    correctAnswer: "a",
    explanation: "Recusar produtos com excesso de embalagens ataca o problema na fonte, reduzindo a demanda e incentivando as empresas a repensarem suas embalagens.",
    difficulty: "difícil",
    category: "soluções",
    timeToAnswer: 20
  },
  {
    id: 6,
    question: "Qual destes microplásticos é mais comum nos oceanos?",
    options: [
      { id: "a", text: "Fragmentos de garrafas PET", fact: "As garrafas PET se fragmentam em pedaços cada vez menores ao longo do tempo." },
      { id: "b", text: "Microesferas de cosméticos", fact: "Milhões de microesferas são lançadas diariamente nos sistemas de esgoto." },
      { id: "c", text: "Fibras de roupas sintéticas", fact: "Uma única lavagem de roupas sintéticas pode liberar até 700.000 microfibras." },
      { id: "d", text: "Pellets industriais", fact: "Bilhões de pellets são perdidos anualmente durante o transporte e produção." },
    ],
    correctAnswer: "c",
    explanation: "As fibras de roupas sintéticas são a forma mais comum de microplásticos nos oceanos, liberadas durante a lavagem de roupas feitas de materiais como poliéster e nylon.",
    difficulty: "difícil",
    category: "ciência",
    timeToAnswer: 25
  },
  {
    id: 7,
    question: "Qual é a melhor maneira de lidar com plásticos de uso único?",
    options: [
      { id: "a", text: "Reciclar sempre que possível", fact: "A reciclagem requer energia e recursos, e muitos plásticos são reciclados apenas uma vez." },
      { id: "b", text: "Substituir por plásticos biodegradáveis", fact: "Plásticos 'biodegradáveis' frequentemente requerem instalações industriais para degradação." },
      { id: "c", text: "Evitar completamente seu uso", fact: "Prevenir o uso é muito mais eficaz do que lidar com o resíduo depois." },
      { id: "d", text: "Reutilizar várias vezes", fact: "Plásticos de uso único não são projetados para reutilização e podem liberar substâncias nocivas." },
    ],
    correctAnswer: "c",
    explanation: "A melhor abordagem é evitar completamente o uso de plásticos descartáveis, optando por alternativas reutilizáveis e duráveis.",
    difficulty: "médio",
    category: "soluções",
    timeToAnswer: 20
  },
  {
    id: 8,
    question: "Qual tipo de plástico é mais difícil de reciclar?",
    options: [
      { id: "a", text: "PET (garrafas de bebidas)", fact: "O PET é um dos plásticos mais reciclados globalmente." },
      { id: "b", text: "PEAD (frascos de shampoo)", fact: "PEAD tem altas taxas de reciclagem e é frequentemente transformado em outros produtos." },
      { id: "c", text: "Isopor (poliestireno expandido)", fact: "O isopor é 98% ar, tornando seu transporte para reciclagem economicamente inviável." },
      { id: "d", text: "PP (potes de margarina)", fact: "O PP tem valor de reciclagem moderado e é frequentemente reciclado." },
    ],
    correctAnswer: "c",
    explanation: "O isopor (poliestireno expandido) é um dos plásticos mais difíceis de reciclar devido ao seu volume, baixo peso e baixo valor de mercado para reciclagem.",
    difficulty: "médio",
    category: "ciência",
    timeToAnswer: 20
  },
];

// Achievement definitions with unlock conditions and rewards
const achievements = [
  { 
    id: 'quick_thinker', 
    name: 'Pensador Rápido', 
    description: 'Responda 3 perguntas em menos de 50% do tempo disponível', 
    icon: <Clock className="h-6 w-6 text-blue-500" />,
    reward: 25,
    unlocked: false
  },
  { 
    id: 'perfect_score', 
    name: 'Nota Perfeita', 
    description: 'Acerte todas as perguntas', 
    icon: <Star className="h-6 w-6 text-yellow-500" />,
    reward: 50,
    unlocked: false
  },
  { 
    id: 'streak_master', 
    name: 'Mestre das Sequências', 
    description: 'Acerte 5 perguntas consecutivas', 
    icon: <BarChart className="h-6 w-6 text-green-500" />,
    reward: 30,
    unlocked: false
  },
  { 
    id: 'knowledge_seeker', 
    name: 'Buscador do Conhecimento', 
    description: 'Leia todas as explicações detalhadas', 
    icon: <BookOpen className="h-6 w-6 text-purple-500" />,
    reward: 20,
    unlocked: false
  },
  { 
    id: 'eco_warrior', 
    name: 'Guerreiro Ecológico', 
    description: 'Complete o quiz em menos de 3 minutos', 
    icon: <Award className="h-6 w-6 text-cyan-500" />,
    reward: 35,
    unlocked: false
  },
];

const EcoQuiz = () => {
  // Game state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quickAnswers, setQuickAnswers] = useState(0);
  const [readExplanations, setReadExplanations] = useState<number[]>([]);
  const [gameTimer, setGameTimer] = useState(0);
  const [showAchievement, setShowAchievement] = useState<{ id: string, name: string, reward: number } | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [userAchievements, setUserAchievements] = useState<typeof achievements>(JSON.parse(JSON.stringify(achievements)));
  const [challengeMode, setChallengeMode] = useState(false);
  const [challengeTimeLeft, setChallengeTimeLeft] = useState(180); // 3 minutes in seconds
  const [quizCategory, setQuizCategory] = useState<string | null>(null);
  const [lifelines, setLifelines] = useState({
    hint: 2,
    fiftyFifty: 1,
    extraTime: 1
  });
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState<'normal' | 'challenge' | 'timed'>('normal');
  const [showFact, setShowFact] = useState<string | null>(null);
  const [answerTimes, setAnswerTimes] = useState<Record<number, number>>({});
  const [fastestAnswer, setFastestAnswer] = useState<number | null>(null);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [bonusPointsEarned, setBonusPointsEarned] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // Animation state
  const [fadeIn, setFadeIn] = useState(false);
  const [shakeIncorrect, setShakeIncorrect] = useState(false);
  const [pulseCorrect, setPulseCorrect] = useState(false);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [scoreToAnimate, setScoreToAnimate] = useState(0);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number | null>(null);
  
  // Filter questions based on category and difficulty
  const getFilteredQuestions = () => {
    let filtered = [...quizQuestions];
    
    if (categoryFilters.length > 0) {
      filtered = filtered.filter(q => categoryFilters.includes(q.category));
    }
    
    if (difficultyLevel) {
      filtered = filtered.filter(q => q.difficulty === difficultyLevel);
    }
    
    return filtered;
  };
  
  // Start the quiz with selected options
  const startQuiz = (mode: 'normal' | 'challenge' | 'timed') => {
    setQuizMode(mode);
    setGameStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setIsCompleted(false);
    setScore(0);
    setStreak(0);
    setQuickAnswers(0);
    setReadExplanations([]);
    setGameTimer(0);
    setEliminatedOptions([]);
    setTotalTimeSpent(0);
    setBonusPointsEarned(0);
    
    if (mode === 'challenge') {
      setChallengeMode(true);
      setChallengeTimeLeft(180); // 3 minutes
    } else {
      setChallengeMode(false);
    }
    
    // Start timers
    startQuestionTimer();
    startGameTimer();
  };
  
  // Start timer for current question
  const startQuestionTimer = () => {
    const question = quizQuestions[currentQuestion];
    setQuestionTimeLeft(question.timeToAnswer);
    questionStartTimeRef.current = Date.now();
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Auto-select wrong answer if time runs out
          if (!selectedAnswers[question.id]) {
            handleTimeOut();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Start overall game timer
  const startGameTimer = () => {
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    
    gameTimerRef.current = setInterval(() => {
      setGameTimer(prev => prev + 1);
      
      if (challengeMode) {
        setChallengeTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(gameTimerRef.current!);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
  };
  
  // Handle timeout when question time runs out
  const handleTimeOut = () => {
    const question = quizQuestions[currentQuestion];
    setShowExplanation(true);
    setStreak(0);
    
    // Mark answer as timed out (wrong)
    setSelectedAnswers(prev => ({
      ...prev,
      [question.id]: "timeout"
    }));
    
    showToast("Tempo esgotado!", "Você não respondeu a tempo.", "warning");
  };
  
  // Check for achievements after each answer
  useEffect(() => {
    checkAchievements();
  }, [quickAnswers, streak, readExplanations, selectedAnswers, gameTimer]);
  
  // Start new question timer when moving to next question
  useEffect(() => {
    if (gameStarted && !isCompleted && !showExplanation) {
      startQuestionTimer();
    }
    
    // Apply fade-in animation for new question
    setFadeIn(true);
    const timeout = setTimeout(() => setFadeIn(false), 500);
    
    return () => {
      clearTimeout(timeout);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, gameStarted]);
  
  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, []);
  
  // Check for game completion
  useEffect(() => {
    const filteredQuestions = getFilteredQuestions();
    const allQuestionsAnswered = Object.keys(selectedAnswers).length === filteredQuestions.length;
    
    if (allQuestionsAnswered && !isCompleted && gameStarted) {
      endGame();
    }
  }, [selectedAnswers, isCompleted, gameStarted]);
  
  // End the game and calculate final score
  const endGame = () => {
    // Clear all timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    
    // Calculate score
    const filteredQuestions = getFilteredQuestions();
    const correctAnswers = Object.entries(selectedAnswers).filter(([questionId, answer]) => {
      const question = filteredQuestions.find(q => q.id === Number(questionId));
      return question?.correctAnswer === answer;
    }).length;
    
    const baseScore = Math.round((correctAnswers / filteredQuestions.length) * 100);
    const finalScore = baseScore + bonusPointsEarned;
    
    setScore(finalScore);
    setIsCompleted(true);
    setShowResults(true);
    
    if (finalScore >= 70) {
      localStorage.setItem("ecoQuizCompleted", "true");
      showToast("Parabéns!", `Você completou o quiz com ${finalScore}% de acertos!`, "success");
    } else {
      showToast("Quase lá!", `Você acertou ${finalScore}% das questões. Tente novamente para melhorar.`, "info");
    }
  };
  
  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    
    const question = quizQuestions[currentQuestion];
    const isCorrect = answer === question.correctAnswer;
    
    // Calculate time taken to answer
    const timeTaken = questionStartTimeRef.current 
      ? Math.floor((Date.now() - questionStartTimeRef.current) / 1000)
      : question.timeToAnswer;
    
    setAnswerTimes({
      ...answerTimes,
      [question.id]: timeTaken
    });
    
    // Update total time spent
    setTotalTimeSpent(prev => prev + timeTaken);
    
    // Check if answer was quick (< 50% of allowed time)
    if (timeTaken < question.timeToAnswer * 0.5) {
      setQuickAnswers(prev => prev + 1);
      // Add bonus points for fast answer
      const bonus = 5;
      setBonusPointsEarned(prev => prev + bonus);
      showToast("Resposta Rápida!", `+${bonus} pontos de bônus`, "info");
    }
    
    // Update streak
    if (isCorrect) {
      setStreak(prev => prev + 1);
      setPulseCorrect(true);
      setTimeout(() => setPulseCorrect(false), 700);
      
      // Animation for score
      setScoreToAnimate(10);
      setShowScoreAnimation(true);
      setTimeout(() => setShowScoreAnimation(false), 1000);
    } else {
      setStreak(0);
      setShakeIncorrect(true);
      setTimeout(() => setShakeIncorrect(false), 700);
    }
    
    // Track fastest answer
    if (fastestAnswer === null || timeTaken < fastestAnswer) {
      setFastestAnswer(timeTaken);
    }
    
    // Update selected answers
    setSelectedAnswers({
      ...selectedAnswers,
      [question.id]: answer
    });
    
    setShowExplanation(true);
    
    // Clear question timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Show toast based on answer
    if (isCorrect) {
      showToast("Correto!", "Muito bem!", "success");
    } else {
      showToast("Incorreto", "Tente entender o motivo na explicação.", "error");
    }
  };
  
  // Move to next question
  const handleNextQuestion = () => {
    setShowExplanation(false);
    setShowHint(false);
    setEliminatedOptions([]);
    setShowFact(null);
    
    const filteredQuestions = getFilteredQuestions();
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  // Move to previous question
  const handlePrevQuestion = () => {
    setShowExplanation(false);
    setShowHint(false);
    setEliminatedOptions([]);
    setShowFact(null);
    
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // Reset the quiz
  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setShowExplanation(false);
    setIsCompleted(false);
    setScore(0);
    setStreak(0);
    setQuickAnswers(0);
    setReadExplanations([]);
    setGameTimer(0);
    setShowHint(false);
    setEliminatedOptions([]);
    setShowFact(null);
    setShowResults(false);
    setTotalTimeSpent(0);
    setBonusPointsEarned(0);
    
    // Reset lifelines
    setLifelines({
      hint: 2,
      fiftyFifty: 1,
      extraTime: 1
    });
    
    startQuiz(quizMode);
  };
  
  // Check if an answer is correct
  const isAnswerCorrect = (questionId: number, answerId: string) => {
    const question = quizQuestions.find(q => q.id === questionId);
    return question?.correctAnswer === answerId;
  };
  
  // Calculate progress percentage
  const getProgressPercentage = () => {
    const filteredQuestions = getFilteredQuestions();
    return Math.round((Object.keys(selectedAnswers).length / filteredQuestions.length) * 100);
  };
  
  // Use 50/50 lifeline to eliminate two wrong answers
  const useFiftyFifty = () => {
    if (lifelines.fiftyFifty <= 0 || showExplanation) return;
    
    const question = quizQuestions[currentQuestion];
    const correctAnswer = question.correctAnswer;
    
    // Get all wrong answer IDs
    const wrongAnswerIds = question.options
      .filter(option => option.id !== correctAnswer)
      .map(option => option.id);
    
    // Randomly select two wrong answers to eliminate
    const shuffled = wrongAnswerIds.sort(() => 0.5 - Math.random());
    const toEliminate = shuffled.slice(0, 2);
    
    setEliminatedOptions(toEliminate);
    setLifelines({...lifelines, fiftyFifty: lifelines.fiftyFifty - 1});
    
    showToast("50:50 Ativado!", "Duas opções incorretas foram eliminadas.", "info");
  };
  
  // Use hint lifeline to get a clue
  const useHint = () => {
    if (lifelines.hint <= 0 || showExplanation) return;
    
    setShowHint(true);
    setLifelines({...lifelines, hint: lifelines.hint - 1});
    
    showToast("Dica Ativada!", "Uma dica foi revelada para esta pergunta.", "info");
  };
  
  // Use extra time lifeline
  const useExtraTime = () => {
    if (lifelines.extraTime <= 0 || showExplanation) return;
    
    const extraSeconds = 15;
    setQuestionTimeLeft(prev => prev + extraSeconds);
    setLifelines({...lifelines, extraTime: lifelines.extraTime - 1});
    
    showToast("Tempo Extra!", `+${extraSeconds} segundos adicionados.`, "info");
  };
  
  // Show fact about selected option
  const showOptionFact = (optionId: string) => {
    const question = quizQuestions[currentQuestion];
    const option = question.options.find(opt => opt.id === optionId);
    
    if (option) {
      setShowFact(option.fact);
    }
  };
  
  // Mark explanation as read
  const markExplanationAsRead = () => {
    const questionId = quizQuestions[currentQuestion].id;
    if (!readExplanations.includes(questionId)) {
      setReadExplanations([...readExplanations, questionId]);
    }
  };
  
  // Check for achievements and unlock them
  const checkAchievements = () => {
    const newAchievements = [...userAchievements];
    let achievementUnlocked = false;
    let latestAchievement = null;
    
    // Quick Thinker: Answer 3 questions in less than 50% of the time
    if (quickAnswers >= 3 && !newAchievements.find(a => a.id === 'quick_thinker')?.unlocked) {
      const achievement = newAchievements.find(a => a.id === 'quick_thinker');
      if (achievement) {
        achievement.unlocked = true;
        achievementUnlocked = true;
        latestAchievement = achievement;
        setUnlockedAchievements([...unlockedAchievements, 'quick_thinker']);
        setBonusPointsEarned(prev => prev + achievement.reward);
      }
    }
    
    // Perfect Score: Answer all questions correctly
    const filteredQuestions = getFilteredQuestions();
    if (Object.keys(selectedAnswers).length === filteredQuestions.length) {
      const allCorrect = Object.entries(selectedAnswers).every(([questionId, answer]) => {
        const question = filteredQuestions.find(q => q.id === Number(questionId));
        return question?.correctAnswer === answer;
      });
      
      if (allCorrect && !newAchievements.find(a => a.id === 'perfect_score')?.unlocked) {
        const achievement = newAchievements.find(a => a.id === 'perfect_score');
        if (achievement) {
          achievement.unlocked = true;
          achievementUnlocked = true;
          latestAchievement = achievement;
          setUnlockedAchievements([...unlockedAchievements, 'perfect_score']);
          setBonusPointsEarned(prev => prev + achievement.reward);
        }
      }
    }
    
    // Streak Master: 5 correct answers in a row
    if (streak >= 5 && !newAchievements.find(a => a.id === 'streak_master')?.unlocked) {
      const achievement = newAchievements.find(a => a.id === 'streak_master');
      if (achievement) {
        achievement.unlocked = true;
        achievementUnlocked = true;
        latestAchievement = achievement;
        setUnlockedAchievements([...unlockedAchievements, 'streak_master']);
        setBonusPointsEarned(prev => prev + achievement.reward);
      }
    }
    
    // Knowledge Seeker: Read all explanations
    if (readExplanations.length === filteredQuestions.length && 
        !newAchievements.find(a => a.id === 'knowledge_seeker')?.unlocked) {
      const achievement = newAchievements.find(a => a.id === 'knowledge_seeker');
      if (achievement) {
        achievement.unlocked = true;
        achievementUnlocked = true;
        latestAchievement = achievement;
        setUnlockedAchievements([...unlockedAchievements, 'knowledge_seeker']);
        setBonusPointsEarned(prev => prev + achievement.reward);
      }
    }
    
    // Eco Warrior: Complete the quiz in under 3 minutes
    if (isCompleted && gameTimer <= 180 && !newAchievements.find(a => a.id === 'eco_warrior')?.unlocked) {
      const achievement = newAchievements.find(a => a.id === 'eco_warrior');
      if (achievement) {
        achievement.unlocked = true;
        achievementUnlocked = true;
        latestAchievement = achievement;
        setUnlockedAchievements([...unlockedAchievements, 'eco_warrior']);
        setBonusPointsEarned(prev => prev + achievement.reward);
      }
    }
    
    if (achievementUnlocked && latestAchievement) {
      setUserAchievements(newAchievements);
      setShowAchievement({
        id: latestAchievement.id,
        name: latestAchievement.name,
        reward: latestAchievement.reward
      });
      
      // Hide achievement notification after 3 seconds
      setTimeout(() => {
        setShowAchievement(null);
      }, 3000);
    }
  };
  
  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Display toast message
  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const toast = document.createElement('div');
    let bgColor = 'bg-blue-500';
    
    switch (type) {
      case 'success': bgColor = 'bg-green-500'; break;
      case 'error': bgColor = 'bg-red-500'; break;
      case 'warning': bgColor = 'bg-yellow-500'; break;
      case 'info': bgColor = 'bg-blue-500'; break;
    }
    
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${bgColor} text-white transform transition-transform duration-300 translate-x-0 z-50`;
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        ${type === 'success' ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
        ${type === 'error' ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' : ''}
        ${type === 'warning' ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>' : ''}
        ${type === 'info' ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>' : ''}
        <h4 class="font-bold">${title}</h4>
      </div>
      <p class="ml-6">${message}</p>
    `;
    document.body.appendChild(toast);
    
    // Add entrance animation
    toast.animate([
      { transform: 'translateX(100%)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 }
    ], {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards'
    });
    
    // Exit animation after 3 seconds
    setTimeout(() => {
      toast.animate([
        { transform: 'translateX(0)', opacity: 1 },
        { transform: 'translateX(100%)', opacity: 0 }
      ], {
        duration: 300,
        easing: 'ease-in',
        fill: 'forwards'
      }).onfinish = () => document.body.removeChild(toast);
    }, 3000);
  };
  
  // Get all unique categories from questions
  const getCategories = () => {
    const categories = new Set(quizQuestions.map(q => q.category));
    return Array.from(categories);
  };
  
  // Get all unique difficulty levels
  const getDifficultyLevels = () => {
    const difficulties = new Set(quizQuestions.map(q => q.difficulty));
    return Array.from(difficulties);
  };
  
  // Toggle category filter
  const toggleCategoryFilter = (category: string) => {
    if (categoryFilters.includes(category)) {
      setCategoryFilters(categoryFilters.filter(c => c !== category));
    } else {
      setCategoryFilters([...categoryFilters, category]);
    }
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-100 via-blue-50 to-purple-100">
      {/* Decorative circles in background */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      
      {/* Achievement notification */}
      {showAchievement && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg shadow-lg animate-slide-down">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-300" />
            <div>
              <h3 className="font-bold">Conquista Desbloqueada!</h3>
              <p className="text-sm">{showAchievement.name} (+{showAchievement.reward} pontos)</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating score animation */}
      {showScoreAnimation && (
        <div className="fixed top-24 right-8 z-50 animate-float-up">
          <span className="text-xl font-bold text-green-500">+{scoreToAnimate}</span>
        </div>
      )}
      
      <header className="bg-gradient-to-r from-green-600 to-teal-500 text-white p-4 shadow-md relative z-10">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={() => window.location.href = "/ECOlições"} 
            className="flex items-center gap-2 p-2 hover:bg-green-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 animate-pulse" />
            <h1 className="text-xl font-bold tracking-wide">EcoQuiz</h1>
          </div>
          
          {gameStarted && !isCompleted && (
            <div className="flex items-center gap-4">
              {challengeMode && (
                <div className="flex items-center gap-1">
                  <Timer className="h-5 w-5 text-red-200" />
                  <span className={`${challengeTimeLeft <= 30 ? 'text-red-200 animate-pulse' : ''}`}>
                    {formatTime(challengeTimeLeft)}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Trophy className="h-5 w-5" />
                <span>{score + bonusPointsEarned}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Target className="h-5 w-5" />
                <span>Seq: {streak}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {!gameStarted ? (
          // Quiz start screen
          <div className="max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8 transform transition-all duration-500 hover:shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-green-700 mb-2">Quiz: Redução de Plásticos</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Teste seus conhecimentos sobre como reduzir o uso de plásticos e proteger o meio ambiente. 
                  Responda às perguntas, ganhe pontos e desbloqueie conquistas!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                    <Medal className="h-5 w-5" />
                    Conquistas Disponíveis
                  </h3>
                  <ul className="space-y-3">
                    {achievements.map(achievement => (
                      <li key={achievement.id} className="flex items-start gap-3 p-2 hover:bg-green-100 rounded-lg transition-colors">
                        <div className="mt-0.5">{achievement.icon}</div>
                        <div>
                          <h4 className="font-medium">{achievement.name}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-green-600 mt-1">+{achievement.reward} pontos</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="bg-blue-50 rounded-lg p-6 mb-4">
                    <h3 className="text-xl font-bold text-blue-700 mb-4">Personalize seu Quiz</h3>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Categorias:</h4>
                      <div className="flex flex-wrap gap-2">
                        {getCategories().map(category => (
                          <button
                            key={category}
                            onClick={() => toggleCategoryFilter(category)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              categoryFilters.includes(category)
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            } transition-colors`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Dificuldade:</h4>
                      <div className="flex flex-wrap gap-2">
                        {getDifficultyLevels().map(difficulty => (
                          <button
                            key={difficulty}
                            onClick={() => setDifficultyLevel(difficulty === difficultyLevel ? null : difficulty)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              difficulty === difficultyLevel
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            } transition-colors`}
                          >
                            {difficulty}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-purple-700 mb-4">Escolha o Modo de Jogo</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => startQuiz('normal')}
                        className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-2 border-2 border-transparent hover:border-green-300"
                      >
                        <BookOpen className="h-8 w-8 text-green-500" />
                        <h4 className="font-medium">Modo Normal</h4>
                        <p className="text-xs text-center text-gray-500">Responda no seu ritmo</p>
                      </button>
                      
                      <button
                        onClick={() => startQuiz('timed')}
                        className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-2 border-2 border-transparent hover:border-blue-300"
                      >
                        <Clock className="h-8 w-8 text-blue-500" />
                        <h4 className="font-medium">Contra o Relógio</h4>
                        <p className="text-xs text-center text-gray-500">Tempo limitado por pergunta</p>
                      </button>
                      
                      <button
                        onClick={() => startQuiz('challenge')}
                        className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-2 border-2 border-transparent hover:border-purple-300"
                      >
                        <Trophy className="h-8 w-8 text-purple-500" />
                        <h4 className="font-medium">Modo Desafio</h4>
                        <p className="text-xs text-center text-gray-500">Complete em 3 minutos</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => startQuiz('normal')}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold rounded-full shadow-lg transform transition-transform hover:scale-105"
                >
                  Iniciar Quiz
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Quiz in progress
          <div className="max-w-4xl mx-auto">
            <div className={`bg-white bg-opacity-80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8 transition-all duration-500 ${fadeIn ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-700">Redução de Plásticos</h2>
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Mostrar informações"
                >
                  <Info className="h-5 w-5 text-green-600" />
                </button>
              </div>

              {showInfo && (
                <div className="bg-green-50 p-4 rounded-lg mb-4 text-green-800 animate-fade-in">
                  <h3 className="font-semibold mb-2">Sobre Redução de Plásticos</h3>
                  <p className="mb-2">
                    Os plásticos descartáveis são um dos maiores problemas ambientais da atualidade. Eles poluem oceanos,
                    afetam a vida selvagem e podem levar centenas de anos para se decompor.
                  </p>
                  <p>
                    Neste quiz, você aprenderá sobre alternativas ao uso de plásticos e como suas escolhas diárias podem
                    fazer a diferença na redução deste tipo de poluição.
                  </p>
                </div>
              )}

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Pergunta {currentQuestion + 1} de {quizQuestions.length}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                      {quizQuestions[currentQuestion].difficulty}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                      {quizQuestions[currentQuestion].category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-600">
                      {getProgressPercentage()}% completado
                    </span>
                    {!showExplanation && (
                      <span className={`text-sm font-medium ${questionTimeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>
                        <Timer className="h-4 w-4 inline mr-1" /> {questionTimeLeft}s
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-teal-500 transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>

              <div className="p-6 mb-6 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 shadow-inner">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  {quizQuestions[currentQuestion].question}
                </h3>

                {/* Answer options */}
                <div className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((option) => {
                    const isSelected = selectedAnswers[quizQuestions[currentQuestion].id] === option.id;
                    const isCorrect = quizQuestions[currentQuestion].correctAnswer === option.id;
                    const isEliminated = eliminatedOptions.includes(option.id);
                    
                    let optionClasses = "flex items-start p-4 rounded-lg border-2 transition-all duration-300 transform";
                    
                    // Add animation classes based on state
                    if (showExplanation && isSelected) {
                      if (isCorrect) {
                        optionClasses += " bg-green-100 border-green-500 " + (pulseCorrect ? "animate-pulse" : "");
                      } else {
                        optionClasses += " bg-red-100 border-red-500 " + (shakeIncorrect ? "animate-shake" : "");
                      }
                    } else if (isEliminated) {
                      optionClasses += " opacity-50 bg-gray-100 border-gray-300";
                    } else {
                      optionClasses += " border-gray-200 hover:border-green-300 hover:bg-green-50";
                    }
                    
                    return (
                      <div key={option.id} className={optionClasses}>
                        <button 
                          onClick={() => handleAnswerSelect(option.id)}
                          className="flex items-start w-full text-left"
                          disabled={showExplanation || isEliminated}
                        >
                          <div className="flex-shrink-0 mt-0.5 mr-3">
                            <div className={`h-6 w-6 flex items-center justify-center rounded-full border-2 ${
                              showExplanation && isSelected 
                                ? isCorrect 
                                  ? "border-green-500 bg-green-500 text-white" 
                                  : "border-red-500 bg-red-500 text-white"
                                : "border-gray-300"
                            }`}>
                              {showExplanation && isSelected ? (
                                isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />
                              ) : (
                                <span>{option.id.toUpperCase()}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className={`${showExplanation && isCorrect ? "font-medium" : ""}`}>
                              {option.text}
                            </p>
                            {showFact === option.fact && (
                              <p className="text-sm text-blue-600 mt-1 animate-fade-in">
                                {option.fact}
                              </p>
                            )}
                          </div>
                        </button>
                        
                        {showExplanation && (
                          <button 
                            onClick={() => showOptionFact(option.id)}
                            className="ml-3 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            Fato
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Lifelines */}
                {!showExplanation && (
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={useFiftyFifty}
                      disabled={lifelines.fiftyFifty <= 0}
                      className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                        lifelines.fiftyFifty > 0
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      } transition-colors`}
                    >
                      <span>50:50</span>
                      <span className="text-xs">({lifelines.fiftyFifty})</span>
                    </button>
                    
                    <button
                      onClick={useHint}
                      disabled={lifelines.hint <= 0}
                      className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                        lifelines.hint > 0
                          ? "bg-purple-500 text-white hover:bg-purple-600"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      } transition-colors`}
                    >
                      <Info className="h-4 w-4" />
                      <span>Dica</span>
                      <span className="text-xs">({lifelines.hint})</span>
                    </button>
                    
                    <button
                      onClick={useExtraTime}
                      disabled={lifelines.extraTime <= 0}
                      className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
                        lifelines.extraTime > 0
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      } transition-colors`}
                    >
                      <Clock className="h-4 w-4" />
                      <span>+15s</span>
                      <span className="text-xs">({lifelines.extraTime})</span>
                    </button>
                  </div>
                )}
                
                {/* Hint display */}
                {showHint && (
                  <div className="mt-4 p-3 bg-purple-100 border border-purple-300 rounded-lg animate-fade-in">
                    <h4 className="font-medium text-purple-800 mb-1 flex items-center gap-1">
                      <Info className="h-4 w-4" />
                      Dica:
                    </h4>
                    <p className="text-purple-700 text-sm">
                      {
                        quizQuestions[currentQuestion].difficulty === "fácil"
                          ? `A resposta correta está relacionada a ${quizQuestions[currentQuestion].category}.`
                          : quizQuestions[currentQuestion].difficulty === "médio"
                            ? `Pense em soluções sustentáveis a longo prazo.`
                            : `A resposta considera o impacto ambiental completo, não apenas o descarte.`
                      }
                    </p>
                  </div>
                )}

                {/* Explanation */}
                {showExplanation && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Explicação:
                    </h4>
                    <p className="text-blue-700">{quizQuestions[currentQuestion].explanation}</p>
                    
                    <button 
                      onClick={markExplanationAsRead}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Marcar como lida
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    currentQuestion === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  } transition-colors`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Anterior
                </button>

                {showExplanation && currentQuestion < quizQuestions.length - 1 && (
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 flex items-center gap-2 transition-colors"
                  >
                    Próxima
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}

                {showExplanation && currentQuestion === quizQuestions.length - 1 && !isCompleted && (
                  <button
                    onClick={endGame}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                  >
                    Finalizar Quiz
                  </button>
                )}
              </div>

              {/* Stats bar */}
              <div className="mt-6 flex items-center justify-between text-xs text-gray-500 border-t pt-4">
                <div>Tempo total: {formatTime(gameTimer)}</div>
                <div>Sequência atual: {streak} acertos</div>
                <div>Bônus: +{bonusPointsEarned} pontos</div>
              </div>
            </div>

            {/* Results screen */}
            {showResults && (
              <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500 mb-2">
                    Quiz Completado!
                  </h2>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">{score + bonusPointsEarned}%</span>
                  </div>
                  <p className="text-gray-600">
                    {score + bonusPointsEarned >= 70 
                      ? "Parabéns! Você demonstrou excelente conhecimento sobre redução de plásticos!" 
                      : "Bom trabalho! Continue aprendendo sobre redução de plásticos para melhorar seu conhecimento."
                    }
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-bold text-blue-700 mb-3">Estatísticas</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Tempo total:</span>
                        <span className="font-medium">{formatTime(gameTimer)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Maior sequência:</span>
                        <span className="font-medium">{streak} acertos</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Respostas rápidas:</span>
                        <span className="font-medium">{quickAnswers}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Resposta mais rápida:</span>
                        <span className="font-medium">{fastestAnswer !== null ? `${fastestAnswer}s` : 'N/A'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Bônus obtidos:</span>
                        <span className="font-medium text-green-600">+{bonusPointsEarned} pontos</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-bold text-purple-700 mb-3">Conquistas Desbloqueadas</h3>
                    {userAchievements.filter(a => a.unlocked).length > 0 ? (
                      <ul className="space-y-2">
                        {userAchievements.filter(a => a.unlocked).map(achievement => (
                          <li key={achievement.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                            <div>{achievement.icon}</div>
                            <div>
                              <h4 className="font-medium">{achievement.name}</h4>
                              <p className="text-xs text-gray-500">{achievement.description}</p>
                            </div>
                            <div className="ml-auto text-green-600 font-medium">+{achievement.reward}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Nenhuma conquista desbloqueada. Tente novamente!
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Tentar Novamente
                  </button>
                  
                  <button
                    onClick={() => setGameStarted(false)}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-colors"
                  >
                    Menu Principal
                  </button>
                </div>
              </div>
            )}

            {/* Accessibility tips */}
            <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Dicas de Acessibilidade
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use Tab para navegar entre as opções e Espaço para selecionar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Todas as questões e respostas são compatíveis com leitores de tela.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>O quiz pode ser completado usando apenas o teclado.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
      
      <style jsx>{`
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes shake {
          10%, 90% {
            transform: translate3d(-1px, 0, 0);
          }
          20%, 80% {
            transform: translate3d(2px, 0, 0);
          }
          30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
          }
          40%, 60% {
            transform: translate3d(4px, 0, 0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float-up {
          animation: floatUp 1s ease-out forwards;
        }
        
        @keyframes floatUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
        
        .animate-slide-down {
          animation: slideDown 0.5s ease-out, slideUp 0.5s ease-in 2.5s forwards;
        }
        
        @keyframes slideDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translate(-50%, 0);
            opacity: 1;
          }
          to {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
        }
        
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
      `}</style>
    </div>
  );
};

export default EcoQuiz;