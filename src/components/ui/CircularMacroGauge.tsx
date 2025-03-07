
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Dumbbell, Nut, Wheat } from 'lucide-react';

interface CircularMacroGaugeProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
}

const CircularMacroGauge = ({
  label,
  current,
  target,
  color,
  unit = 'g'
}: CircularMacroGaugeProps) => {
  const [percentage, setPercentage] = useState(0);
  
  useEffect(() => {
    // Animate the percentage for a smooth transition
    const timeout = setTimeout(() => {
      setPercentage(Math.min(Math.round((current / target) * 100), 100));
    }, 200);
    
    return () => clearTimeout(timeout);
  }, [current, target]);
  
  // Determine status color based on percentage
  const getStatusColor = () => {
    if (percentage > 100) return "text-red-500 drop-shadow-[0_0_3px_rgba(239,68,68,0.7)]"; // Excess
    if (percentage > 85) return "text-green-500 drop-shadow-[0_0_2px_rgba(34,197,94,0.6)]"; // Good
    if (percentage > 60) return "text-yellow-500"; // Medium
    return "text-gray-400"; // Low
  };
  
  // Style for progress circle
  const circleRadius = 35;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (percentage / 100) * circleCircumference;

  // Get the appropriate icon based on label
  const getIcon = () => {
    if (label.toLowerCase().includes('protéine')) {
      return <Dumbbell className="w-4 h-4 mr-1" />;
    } else if (label.toLowerCase().includes('lipide')) {
      return <Nut className="w-4 h-4 mr-1" />;
    } else if (label.toLowerCase().includes('glucide')) {
      return <Wheat className="w-4 h-4 mr-1" />;
    }
    return null;
  };

  // Determine if we should show the glow effect
  const showGlow = percentage >= 85 && percentage <= 110;
  const isOverTarget = percentage > 100;
  
  return (
    <div className="flex flex-col items-center p-2 hover:scale-105 transition-transform duration-300">
      <div className="relative flex items-center justify-center mb-3">
        <svg width="96" height="96" viewBox="0 0 100 100" className="transform -rotate-90">
          {/* Background circle */}
          <circle 
            cx="50" 
            cy="50" 
            r={circleRadius} 
            fill="none" 
            stroke="currentColor" 
            className="text-gray-200 dark:text-gray-700" 
            strokeWidth="6"
          />
          
          {/* Progress circle with animation */}
          <circle 
            cx="50" 
            cy="50" 
            r={circleRadius} 
            fill="none" 
            stroke="currentColor" 
            className={cn(
              "transition-all duration-1000 ease-out", 
              color.replace('bg-', 'text-'),
              isOverTarget ? "animate-pulse" : ""
            )} 
            strokeWidth="6" 
            strokeDasharray={circleCircumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: showGlow ? 'drop-shadow(0 0 3px currentColor)' : 'none'
            }}
          />
        </svg>
        <div className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-all duration-500",
          isOverTarget ? "animate-pulse-soft" : ""
        )}>
          <span className={`text-xl font-bold ${getStatusColor()}`}>{percentage}%</span>
          <span className="text-xs text-muted-foreground">{current}/{target} {unit}</span>
        </div>
      </div>
      <div className="flex items-center justify-center">
        {getIcon()}
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};

export default CircularMacroGauge;
