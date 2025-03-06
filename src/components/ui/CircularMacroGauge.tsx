
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Dumbbell, Avocado, Wheat } from 'lucide-react';

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
    // We use a setTimeout to create an animation
    const timer = setTimeout(() => {
      setPercentage(Math.min(Math.round((current / target) * 100), 100));
    }, 100);
    
    return () => clearTimeout(timer);
  }, [current, target]);
  
  // Determine status color
  const getStatusColor = () => {
    if (percentage > 100) return "text-red-500"; // Excess
    if (percentage > 85) return "text-green-500"; // Good
    if (percentage > 60) return "text-yellow-500"; // Medium
    return "text-gray-400"; // Low
  };
  
  // Style for progress circle
  const circleRadius = 35;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (percentage / 100) * circleCircumference;

  // Circle animation
  const strokeTransition = {
    strokeDashoffset: {
      transition: 'stroke-dashoffset 0.8s ease-in-out'
    }
  };

  // Get the appropriate icon based on label
  const getIcon = () => {
    if (label.toLowerCase().includes('protéine')) {
      return <Dumbbell className="w-4 h-4 mr-1" />;
    } else if (label.toLowerCase().includes('lipide')) {
      return <Avocado className="w-4 h-4 mr-1" />;
    } else if (label.toLowerCase().includes('glucide')) {
      return <Wheat className="w-4 h-4 mr-1" />;
    }
    return null;
  };

  // Determine if we should show the glow effect
  const showGlow = percentage >= 85 && percentage <= 110;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center mb-2">
        <svg width="90" height="90" viewBox="0 0 100 100" className="transform -rotate-90">
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
          
          {/* Progress circle */}
          <circle 
            cx="50" 
            cy="50" 
            r={circleRadius} 
            fill="none" 
            stroke="currentColor" 
            className={cn(
              "transition-all duration-1000", 
              color.replace('bg-', 'text-'),
              percentage > 100 ? "animate-pulse" : ""
            )} 
            strokeWidth="6" 
            strokeDasharray={circleCircumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            style={strokeTransition.strokeDashoffset}
          />
        </svg>
        <div className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-all duration-300",
          showGlow ? `${color.replace('bg-', 'text-')} drop-shadow-[0_0_3px_currentColor]` : ""
        )}>
          <span className={`text-xl font-bold ${getStatusColor()}`}>{percentage}%</span>
          <span className="text-xs text-muted-foreground">{current}/{target}{unit}</span>
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
