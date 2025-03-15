
import React, { useEffect, useRef } from 'react';

interface ProgressBarProps {
  value: number;
  className?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  className = "", 
  showPercentage = false 
}) => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${value}%`;
    }
  }, [value]);

  return (
    <div className={`progress-bar ${className}`}>
      <div 
        ref={progressRef} 
        className="progress-bar-fill"
        style={{ width: `${value}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      {showPercentage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-white">
          {Math.round(value)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;