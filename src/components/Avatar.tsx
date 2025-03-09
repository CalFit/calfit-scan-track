import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface CalfitAvatarProps {
  calories: {
    current: number;
    target: number;
  };
  protein: {
    current: number;
    target: number;
  };
  className?: string;
  showPerfectBalanceBadge?: boolean;
}

const CalfitAvatar = ({ calories, protein, className, showPerfectBalanceBadge = false }: CalfitAvatarProps) => {
  const caloriePercentage = calories.current / calories.target;
  const proteinPercentage = protein.current / protein.target;
  const caloriesRemaining = calories.target - calories.current;
  
  const avatarState = useMemo(() => {
    if (caloriePercentage > 1.0) {
      return 'overweight';
    } else if (caloriePercentage > 0.8) {
      return 'balanced';
    } else if (caloriePercentage < 0.7) {
      return 'tired';
    } else if (proteinPercentage > 0.9) {
      return 'muscular';
    } else {
      return 'balanced';
    }
  }, [caloriePercentage, proteinPercentage]);

  // Removing the green circle, just keeping colors for different avatar states
  const avatarColors = {
    tired: 'text-gray-400',
    overweight: 'text-orange-400',
    muscular: 'text-[#E74C3C]',
    balanced: 'text-blue-500',
  };

  // Calorie ring styles - changed colors per new requirements
  const calorieRingColor = useMemo(() => {
    if (caloriePercentage > 1.0) return 'text-red-500'; // Over target
    if (caloriePercentage > 0.8) return 'text-orange-400'; // Near target
    return 'text-blue-500'; // Good - changed from green to blue
  }, [caloriePercentage]);

  // Calculate ring parameters
  const ringRadius = 44;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringProgress = Math.min(caloriePercentage, 1) * 100;
  const ringDashoffset = ringCircumference - (ringProgress / 100) * ringCircumference;

  // Status label color
  const statusLabelColor = useMemo(() => {
    if (caloriesRemaining < 0) return 'bg-red-500';
    if (caloriePercentage > 0.8) return 'bg-orange-400';
    return 'bg-blue-500'; // Changed from green to blue
  }, [caloriesRemaining, caloriePercentage]);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Calorie ring - now goes clockwise */}
      <svg 
        width="130" 
        height="130" 
        viewBox="0 0 100 100" 
        className="absolute"
      >
        {/* Background ring */}
        <circle 
          cx="50" 
          cy="50" 
          r={ringRadius} 
          fill="none" 
          stroke="currentColor" 
          className="text-gray-200 dark:text-gray-700" 
          strokeWidth="4"
        />
        
        {/* Progress ring - changed rotation for clockwise motion */}
        <circle 
          cx="50" 
          cy="50" 
          r={ringRadius} 
          fill="none" 
          stroke="currentColor" 
          className={cn(
            "transition-all duration-1000 ease-out",
            calorieRingColor,
            ringProgress >= 100 ? "animate-pulse" : ""
          )} 
          strokeWidth="4" 
          strokeDasharray={ringCircumference} 
          strokeDashoffset={ringDashoffset} 
          strokeLinecap="round"
          style={{ 
            transition: 'stroke-dashoffset 1s ease-in-out',
            filter: 'none',
            transform: 'rotate(-90deg)',
            transformOrigin: 'center'
          }}
        />
      </svg>

      {/* Calories taken display */}
      <div className="absolute top-0 mt-1 text-xs font-medium">
        {calories.current} kcal
      </div>
      
      {/* Perfect balance badge */}
      {showPerfectBalanceBadge && (
        <div className="absolute -right-2 -top-1 bg-[#F1C40F] text-white p-1 rounded-full animate-bounce-subtle">
          <Star size={16} fill="currentColor" />
        </div>
      )}

      {/* Avatar - removed the border */}
      <div className={cn(
        "w-40 h-40 md:w-44 md:h-44 rounded-full flex items-center justify-center transition-all duration-500", 
        avatarColors[avatarState]
      )}>
        <div className="floating-avatar">
          {avatarState === 'tired' && (
            <div className="text-7xl">😴</div>
          )}
          {avatarState === 'overweight' && (
            <div className="text-7xl">🍔</div>
          )}
          {avatarState === 'muscular' && (
            <div className="text-7xl">💪</div>
          )}
          {avatarState === 'balanced' && (
            <div className="text-7xl">😊</div>
          )}
        </div>
      </div>

      {/* Calories remaining label - made smaller */}
      <div className={cn(
        "absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-full",
        statusLabelColor,
        "text-white font-medium text-sm"
      )}>
        <span className="text-xs">
          {caloriesRemaining > 0 
            ? `${caloriesRemaining} kcal restantes` 
            : `${Math.abs(caloriesRemaining)} kcal en excès`}
        </span>
      </div>
    </div>
  );
};

export default CalfitAvatar;
