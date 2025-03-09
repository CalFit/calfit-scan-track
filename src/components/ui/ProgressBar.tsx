
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
  return <div className="w-full space-y-1.5">
      {label && <div className="flex flex-col items-center">
          <div className="text-base font-medium">{label}</div>
          {showDate && <div className="text-xs text-muted-foreground mb-1">
              {getCurrentDate()}
            </div>}
        </div>}
      
      <div className={cn("relative w-full overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-full", height)}>
        <div className={cn("transition-all ease-out duration-1000", animate ? "animate-versement" : "", color)} style={{
        width: `${percentage}%`,
        height: '100%'
      }} />
      </div>
    </div>;
};
export default ProgressBar;
