
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
      
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${height}`}>
        <div 
          className={`${color} h-full rounded-full ${animate ? 'transition-all duration-500 ease-out' : ''}`} 
          style={{ 
            width: `${percentage}%`,
            boxShadow: percentage > 90 ? '0 0 8px rgba(255, 255, 0, 0.5)' : 'none'
          }}
        />
      </div>
      
      {showDate && <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{getCurrentDate()}</p>}
    </div>
  );
};

export default ProgressBar;
