
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  color?: string;
  height?: string;
  animate?: boolean;
}

const ProgressBar = ({
  percentage,
  label,
  color = 'bg-calfit-blue',
  height = 'h-2.5',
  animate = true
}: ProgressBarProps) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="text-sm font-medium text-center text-calfit-orange">
          {label}
        </div>
      )}
      <div className={cn("w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", height)}>
        <div 
          className={cn(
            color, 
            "transition-all duration-1000 ease-out rounded-full",
            animate && "animate-progress"
          )}
          style={{ 
            width: `${percentage}%`,
            boxShadow: percentage >= 85 ? '0 0 8px currentColor' : 'none'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
