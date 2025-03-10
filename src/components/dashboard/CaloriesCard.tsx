
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
    <div className="flex flex-col items-center justify-center bg-white/10 dark:bg-gray-800/30 shadow-sm rounded-xl px-2 py-1.5 w-20 backdrop-blur-sm">
      <Flame className={`w-5 h-5 ${getCaloriesColor()}`} />
      <div className="text-center mt-1">
        <div className="text-lg font-bold leading-tight">{current}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">/ {target}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">kcal</div>
      </div>
    </div>
  );
};
