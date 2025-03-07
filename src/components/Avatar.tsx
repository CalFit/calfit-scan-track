
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

  const avatarColors = {
    tired: 'text-gray-400 border-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.5)]',
    overweight: 'text-orange-400 border-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.5)]',
    muscular: 'text-calfit-blue border-calfit-blue shadow-[0_0_15px_rgba(77,151,255,0.5)]',
    balanced: 'text-calfit-green border-calfit-green shadow-[0_0_15px_rgba(88,204,2,0.5)]',
  };

  // Calorie ring styles
  const calorieRingColor = useMemo(() => {
    if (caloriePercentage > 1.0) return 'text-red-500'; // Over target
    if (caloriePercentage > 0.8) return 'text-orange-400'; // Near target
    return 'text-calfit-green'; // Good
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
    return 'bg-calfit-green';
  }, [caloriesRemaining, caloriePercentage]);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Calorie ring */}
      <svg 
        width="130" 
        height="130" 
        viewBox="0 0 100 100" 
        className="absolute transform -rotate-90"
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
        
        {/* Progress ring */}
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
            filter: ringProgress >= 85 ? 'drop-shadow(0 0 3px currentColor)' : 'none'
          }}
        />
      </svg>

      {/* Calories taken display */}
      <div className="absolute top-0 mt-1 text-xs font-medium">
        {calories.current} kcal
      </div>
      
      {/* Perfect balance badge */}
      {showPerfectBalanceBadge && (
        <div className="absolute -right-2 -top-1 bg-calfit-orange text-white p-1 rounded-full shadow-lg animate-bounce-subtle">
          <Star size={16} fill="currentColor" />
        </div>
      )}

      {/* Avatar */}
      <div className={cn(
        "w-40 h-40 md:w-44 md:h-44 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4 transition-all duration-500", 
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

      {/* Calories remaining label (replacing "Équilibré") */}
      <div className={cn(
        "absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full shadow-lg border border-gray-200 dark:border-gray-800",
        statusLabelColor,
        "text-white font-medium"
      )}>
        <span className="text-sm">
          {caloriesRemaining > 0 
            ? `${caloriesRemaining} kcal restantes` 
            : `${Math.abs(caloriesRemaining)} kcal en excès`}
        </span>
      </div>
    </div>
  );
};

export default CalfitAvatar;
