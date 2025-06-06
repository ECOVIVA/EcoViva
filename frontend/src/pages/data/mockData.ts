import type { Post } from "../../types/typesCM"

export const mockPosts: Post[] = [
  {
    id: 1,
    author: "Horta Urbana",
    timestamp: "2h atrás",
    content:
      "Participe do nosso workshop neste fim de semana para aprender como começar sua própria horta na varanda! Vamos cobrir noções básicas de solo, seleção de recipientes e as melhores plantas para espaços pequenos. 🌱 #HortaUrbana #VidaSustentável",
    image: "https://images.pexels.com/photos/1084540/pexels-photo-1084540.jpeg",
    likes: 42,
    comments: 12,
    shares: 5,
    isCommunityPost: true,
  },
  {
    id: 2,
    author: "Sara Santos",
    timestamp: "4h atrás",
    content: `Acabei de instalar meu primeiro sistema de captação de água da chuva! É incrível quanto podemos coletar e reutilizar para jardinagem. Se alguém precisar de ajuda para montar o seu, estou à disposição para compartilhar o que aprendi.`,
    image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg",
    likes: 28,
    comments: 7,
    shares: 2,
    isCommunityPost: false,
  },
  {
    id: 3,
    author: "Vida Sem Resíduos",
    timestamp: "8h atrás",
    content:
      "LEMBRETE: Nossa feira de trocas mensal acontece no próximo sábado! Traga seus itens usados em bom estado e leve algo novo para você. Vamos reduzir o consumo juntos e manter itens úteis fora dos aterros. 🔄 #LixoZero",
    likes: 36,
    comments: 9,
    shares: 15,
    isCommunityPost: true,
  },
  {
    id: 4,
    author: "Miguel Costa",
    timestamp: "1d atrás",
    content:
      "Encontrei esse aplicativo incrível que ajuda a rastrear sua pegada de carbono e sugere maneiras personalizadas de reduzi-la. Já uso há um mês e consegui reduzir meu impacto em 15%! Alguém mais já experimentou apps de rastreamento de carbono?",
    image: "https://images.pexels.com/photos/5409751/pexels-photo-5409751.jpeg",
    likes: 54,
    comments: 23,
    shares: 8,
    isCommunityPost: false,
  },
  {
    id: 5,
    author: "Energia Sustentável",
    timestamp: "1d atrás",
    content:
      "NOVO RECURSO: Acabamos de publicar nosso guia de melhorias na eficiência energética residencial. De pequenos ajustes a grandes reformas, descubra como reduzir seu consumo de energia e economizar dinheiro. Link na bio! ⚡ #EnergiaLimpa",
    image: "https://images.pexels.com/photos/9875400/pexels-photo-9875400.jpeg",
    likes: 63,
    comments: 14,
    shares: 27,
    isCommunityPost: true,
  },
]
