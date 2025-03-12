
import { Flame } from 'lucide-react';

interface CaloriesCardProps {
  current: number;
  target: number;
}

export const CaloriesCard = ({ current, target }: CaloriesCardProps) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const caloriesRemaining = target - current;
  
  // Determine color based on calories consumed
  const getCaloriesColor = () => {
    if (percentage > 100) return 'text-red-500 dark:text-red-400';
    if (percentage > 80) return 'text-orange-500 dark:text-orange-400';
    return 'text-blue-500 dark:text-blue-400';
  };

  return (
    <div className="flex items-center justify-center bg-white/10 dark:bg-gray-800/30 shadow-sm rounded-xl px-4 py-2 backdrop-blur-sm">
      <Flame className={`w-5 h-5 mr-2 ${getCaloriesColor()}`} />
      <div className="text-center">
        <div className="text-lg font-bold leading-tight inline-flex items-center">
          <span>{current}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/ {target}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">calories</div>
      </div>
    </div>
  );
};
