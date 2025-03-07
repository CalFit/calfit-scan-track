import { cn } from '@/lib/utils';
import { Dumbbell, Nut, Wheat } from 'lucide-react';
interface MacroProgressBarProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
  compact?: boolean;
}
const MacroProgressBar = ({
  label,
  current,
  target,
  color,
  unit = 'g',
  compact = false
}: MacroProgressBarProps) => {
  const percentage = Math.min(Math.round(current / target * 100), 100);
  const isOverTarget = current > target;

  // Get the appropriate icon based on label
  const getIcon = () => {
    if (label.toLowerCase().includes('protéine')) {
      return <Dumbbell className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />;
    } else if (label.toLowerCase().includes('lipide')) {
      return <Nut className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />;
    } else if (label.toLowerCase().includes('glucide')) {
      return <Wheat className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />;
    }
    return null;
  };
  return <div className="space-y-1.5">
      <div className="flex justify-between items-center my-0 mx-[20px] px-0 py-0">
        <div className="flex items-center">
          {getIcon()}
          
        </div>
        <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium ml-1`}>
          {current}/{target}
        </span>
      </div>
      <div className={`macro-progress-bar ${compact ? 'h-2' : 'h-3'} rounded-full overflow-hidden`}>
        <div className={cn("macro-progress-fill transition-all duration-700", color, isOverTarget ? "animate-pulse" : "")} style={{
        width: `${percentage}%`,
        boxShadow: percentage >= 85 && percentage <= 110 ? '0 0 10px currentColor' : 'none'
      }} />
      </div>
    </div>;
};
export default MacroProgressBar;