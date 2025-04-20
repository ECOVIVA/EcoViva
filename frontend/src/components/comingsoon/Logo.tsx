import React from 'react';
import { Sprout } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2 relative">
      <div className="text-emerald-400">
        <Sprout size={48} className="animate-pulse" />
      </div>
      <span className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-500 to-teal-400 ml-2">
        EcoViva
      </span>
      <div className="absolute top-1 right-0 w-20 h-10 bg-gradient-to-r from-transparent to-green-400/20 blur-xl -z-10"></div>
    </div>
  );
};

export default Logo;