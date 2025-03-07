
import { cn } from '@/lib/utils';
import { Dumbbell, Nut, Wheat } from 'lucide-react';

interface MacroProgressBarProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
}

const MacroProgressBar = ({
  label,
  current,
  target,
  color,
  unit = 'g'
}: MacroProgressBarProps) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const isOverTarget = current > target;
  
  // Get the appropriate icon based on label
  const getIcon = () => {
    if (label.toLowerCase().includes('protéine')) {
      return <Dumbbell className="w-4 h-4 mr-1.5" />;
    } else if (label.toLowerCase().includes('lipide')) {
      return <Nut className="w-4 h-4 mr-1.5" />;
    } else if (label.toLowerCase().includes('glucide')) {
      return <Wheat className="w-4 h-4 mr-1.5" />;
    }
    return null;
  };
  
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {getIcon()}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-medium ml-2">
          {current}/{target} {unit}
        </span>
      </div>
      <div className="macro-progress-bar h-3 rounded-full overflow-hidden">
        <div 
          className={cn(
            "macro-progress-fill transition-all duration-700", 
            color,
            isOverTarget ? "animate-pulse" : ""
          )}
          style={{ 
            width: `${percentage}%`,
            boxShadow: percentage >= 85 && percentage <= 110 ? '0 0 10px currentColor' : 'none'
          }}
        />
      </div>
    </div>
  );
};

export default MacroProgressBar;
