import { Rank } from '../../types/types';
import  rank1  from '../data/icons/rank1.png'
import  rank2  from '../data/icons/rank2.png'
import  rank3  from '../data/icons/rank3.png'
import  rank4  from '../data/icons/rank4.png'
import  rank5  from '../data/icons/rank5.png'
import  rank6  from '../data/icons/rank6.png'
import  rank7  from '../data/icons/rank7.png'
import  rank8  from '../data/icons/rank8.png'
import  rank9  from '../data/icons/rank9.png'



export const ranks: Rank[] = [
  { id: 1, icon: <img src={rank1} alt="Guardião do Eco"/>, name: 'Iniciante Verde', difficulty: 'Easy', points: 100, color: '#4ade80' },
  { id: 2, icon: <img src={rank2} alt="Guardião do Eco"/> ,name: 'Guardião do Eco', difficulty: 'Easy', points: 150, color: '#22c55e' },
  { id: 3, icon: <img src={rank3} alt="Guardião do Eco"/> ,name: 'Protetor do Planeta', difficulty: 'Easy', points: 200, color: '#16a34a' },
  { id: 4, icon: <img src={rank4} alt="Guardião do Eco"/> ,name: 'Defensor da Natureza', difficulty: 'Medium', points: 300, color: '#15803d' },
  { id: 5, icon: <img src={rank5} alt="Guardião do Eco"/> ,name: 'Herói Sustentável', difficulty: 'Medium', points: 400, color: '#166534' },
  { id: 6, icon: <img src={rank6} alt="Guardião do Eco"/> ,name: 'Sustentável Líder', difficulty: 'Medium', points: 500, color: '#14532d' },
  { id: 7, icon: <img src={rank7} alt="Guardião do Eco"/> ,name: 'Líder Verde', difficulty: 'Hard', points: 700, color: '#052e16' },
  { id: 8, icon: <img src={rank8} alt="Guardião do Eco"/> ,name: 'Guardião da Floresta', difficulty: 'Hard', points: 800, color: '#022c22' },
  { id: 9, icon: <img src={rank9} alt="Guardião do Eco"/> ,name: 'Mestre da Sustentabilidade', difficulty: 'Hard', points: 1000, color: '#134e4a' }
];