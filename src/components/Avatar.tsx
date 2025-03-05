
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

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
}

const CalfitAvatar = ({ calories, protein, className }: CalfitAvatarProps) => {
  const caloriePercentage = calories.current / calories.target;
  const proteinPercentage = protein.current / protein.target;
  
  const avatarState = useMemo(() => {
    if (caloriePercentage < 0.7) {
      return 'tired';
    } else if (caloriePercentage > 1.3) {
      return 'overweight';
    } else if (proteinPercentage > 0.9) {
      return 'muscular';
    } else {
      return 'balanced';
    }
  }, [caloriePercentage, proteinPercentage]);

  const avatarColors = {
    tired: 'text-gray-400',
    overweight: 'text-orange-400',
    muscular: 'text-calfit-blue',
    balanced: 'text-calfit-green',
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className={cn(
        "w-48 h-48 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4", 
        avatarColors[avatarState]
      )}>
        <div className="floating-avatar">
          {avatarState === 'tired' && (
            <div className="text-8xl">😴</div>
          )}
          {avatarState === 'overweight' && (
            <div className="text-8xl">🍔</div>
          )}
          {avatarState === 'muscular' && (
            <div className="text-8xl">💪</div>
          )}
          {avatarState === 'balanced' && (
            <div className="text-8xl">😊</div>
          )}
        </div>
      </div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 px-4 py-1 rounded-full shadow-lg border border-gray-200 dark:border-gray-800">
        <span className="text-sm font-semibold">
          {avatarState === 'tired' && "Fatigué"}
          {avatarState === 'overweight' && "Surcharge"}
          {avatarState === 'muscular' && "Musclé"}
          {avatarState === 'balanced' && "Équilibré"}
        </span>
      </div>
    </div>
  );
};

export default CalfitAvatar;
