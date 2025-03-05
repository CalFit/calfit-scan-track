
import { cn } from '@/lib/utils';

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
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium">
          {current}/{target} {unit}
        </span>
      </div>
      <div className="macro-progress-bar">
        <div 
          className={cn("macro-progress-fill", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default MacroProgressBar;
