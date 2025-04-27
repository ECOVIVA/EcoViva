import { useEffect } from 'react';
import Stars from '../components/comingsoon/Stars';
import ComingSoon from '../components/comingsoon/ComingSoon';

function App() {
  useEffect(() => {
    document.title = 'EcoViva | Em Breve';
    
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.removeChild(cursor);
    };
  }, []);
  
  return (
    <div className=" bg-gradient-to-b from-[#042211] to-[#073321] text-white overflow-hidden relative">
      <Stars />
      
      {/* Radial glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -z-1 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl -z-1 animate-[pulse_8s_ease-in-out_infinite]"></div>
      
      <ComingSoon />
    </div>
  );
}

export default App;