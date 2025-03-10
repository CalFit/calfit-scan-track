
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  color?: string;
  height?: string;
  animate?: boolean;
  showDate?: boolean;
}

const ProgressBar = ({
  percentage,
  label,
  color = 'bg-calfit-orange',
  height = 'h-2.5',
  animate = true,
  showDate = false
}: ProgressBarProps) => {
  // Get current date in "Vendredi 7 mars 2025" format
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return (
    <div className="w-full space-y-1.5">
      {label && <p className="text-sm font-medium">{label}</p>}
      <div className={cn("w-full rounded-full bg-gray-200 dark:bg-gray-700", height)}>
        <div 
          className={cn(
            "rounded-full transition-all duration-700",
            color,
            animate ? "animate-progress" : ""
          )}
          style={{ 
            width: `${percentage}%`,
            height: '100%',
            boxShadow: percentage >= 85 && percentage <= 110 ? '0 0 10px currentColor' : 'none'
          }}
        />
      </div>
      {showDate && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{getCurrentDate()}</p>
      )}
    </div>
  );
};

export default ProgressBar;
