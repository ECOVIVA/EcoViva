import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

interface CheckInBubbleProps {
  currentXP: number;
  nextLevelXP: number;
  currentRankName: string;
  xpToEarn: number;
  onLevelUp?: () => void;
}

export const CheckInBubble: React.FC<CheckInBubbleProps> = ({
  currentXP,
  nextLevelXP,
  currentRankName,
  xpToEarn,
  onLevelUp,
}) => {
  const [lastXP, setLastXP] = useState(currentXP);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayXP, setDisplayXP] = useState(currentXP);
  
  // Calculate progress
  const progress = (currentXP / nextLevelXP) * 100;
  
  // Check for XP changes to trigger animations
  useEffect(() => {
    // If XP increased
    if (currentXP > lastXP) {
      // Start animation
      setIsAnimating(true);
      
      // Check if user will level up with this XP gain
      const willLevelUp = currentXP >= nextLevelXP && lastXP < nextLevelXP;
      
      if (willLevelUp) {
        // Trigger level up after animation
        const animTimer = setTimeout(() => {
          if (onLevelUp) onLevelUp();
          
          // Reset animation state after completion
          const resetTimer = setTimeout(() => {
            setIsAnimating(false);
          }, 1000);
          
          return () => clearTimeout(resetTimer);
        }, 1000);
        
        return () => clearTimeout(animTimer);
      } else {
        // Regular XP gain animation
        const timer = setTimeout(() => {
          setIsAnimating(false);
        }, 1500);
        
        // Smoothly increment the displayed XP
        let startValue = lastXP;
        const endValue = currentXP;
        const duration = 1200;
        const startTime = Date.now();
        
        const updateDisplayXP = () => {
          const now = Date.now();
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Use cubic-bezier easing for natural feel
          const easedProgress = cubicBezier(0.34, 1.56, 0.64, 1, progress);
          const currentValue = Math.round(startValue + (endValue - startValue) * easedProgress);
          
          setDisplayXP(currentValue);
          
          if (progress < 1) {
            requestAnimationFrame(updateDisplayXP);
          }
        };
        
        requestAnimationFrame(updateDisplayXP);
        
        return () => clearTimeout(timer);
      }
    }
    
    setLastXP(currentXP);
  }, [currentXP, lastXP, nextLevelXP, onLevelUp]);
  
  // Cubic bezier function for smooth animation easing
  const cubicBezier = (x1: number, y1: number, x2: number, y2: number, t: number) => {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    
    const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
    const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
    const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
    
    const solveCurveX = (x: number, epsilon: number = 1e-6) => {
      let t0 = 0;
      let t1 = 1;
      let t2 = x;
      
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      
      for (let i = 0; i < 8; i++) {
        const x2 = sampleCurveX(t2);
        if (Math.abs(x2 - x) < epsilon) return t2;
        
        const derivative = sampleCurveDerivativeX(t2);
        if (Math.abs(derivative) < epsilon) break;
        
        t2 = t2 - (x2 - x) / derivative;
      }
      
      let t = 0;
      while (t1 > t0) {
        const x2 = sampleCurveX(t2);
        if (Math.abs(x2 - x) < epsilon) return t2;
        
        if (x > x2) t0 = t2;
        else t1 = t2;
        
        t2 = (t1 - t0) * 0.5 + t0;
      }
      
      return t2;
    };
    
    return sampleCurveY(solveCurveX(t));
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Main bubble container */}
      <div
        className={`relative w-72 h-72 rounded-full flex items-center justify-center bg-gradient-to-b from-[#f0f8ff] to-[#f5f9fd] shadow-[0_0_30px_rgba(72,201,233,0.2)] smooth-corners overflow-hidden
        ${isAnimating ? 'animate-pulse-glow' : 'animate-pulse-soft'}`}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#48c9e9]/5 via-[#48c9e9]/10 to-[#48c9e9]/5 animate-shimmer-slow rounded-full"></div>
        
        {/* Glass reflection effect */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bubble-reflection rounded-t-full"></div>
        
        {/* Center content with dynamic animation */}
        <div 
          className={`text-center z-10 transition-all duration-700 ${isAnimating ? 'scale-110' : 'scale-100'}`}
        >
          <div className="relative mb-3">
            <div 
              className={`text-5xl font-bold bg-gradient-to-r from-[#006c9c] to-[#00a3c4] bg-clip-text text-transparent transition-all duration-700 ${isAnimating ? 'scale-110' : ''}`}
            >
              {displayXP}
            </div>
            <span className="absolute -right-6 top-2 text-xl font-medium text-[#00a3c4]">XP</span>
          </div>
          <div className="text-sm font-medium px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-[#006c9c] shadow-sm">
            {currentRankName}
          </div>
        </div>
        
        {/* Pulsing ring animation when gaining XP */}
        {isAnimating && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-[#48c9e9]/40 scale-105 animate-pulse-glow"></div>
            <div className="absolute inset-0 rounded-full border-2 border-[#48c9e9]/30 scale-110 animate-pulse-glow animation-delay-100"></div>
            <div className="absolute inset-0 rounded-full border-2 border-[#48c9e9]/20 scale-115 animate-pulse-glow animation-delay-200"></div>
          </>
        )}
      </div>
      
      {/* XP per check-in indicator */}
      <div className="mt-8 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md transition-all duration-300 hover:shadow-lg transform hover:translate-y-[-2px]">
        <Trophy className="w-5 h-5 text-[#00a3c4]" />
        <span className="text-[#006c9c] font-medium">+{xpToEarn} XP per check-in</span>
      </div>
      
      {/* Progress bar */}
      <div className="mt-6 relative w-full max-w-xs h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-[#48c9e9] to-[#0095c0] transition-all duration-1000 ease-bounce-soft"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:500px_100%] animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default CheckInBubble;