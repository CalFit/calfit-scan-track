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
          
          {showDate && <div className="text-xs text-muted-foreground mb-1">
              {getCurrentDate()}
            </div>}
        </div>}
      <div className={cn("w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", height)}>
        <div className={cn(color, "transition-all duration-1000 ease-out rounded-full relative", animate && "animate-versement")} style={{
        width: `${percentage}%`,
        boxShadow: percentage >= 85 ? '0 0 8px currentColor' : 'none'
      }} />
      </div>
    </div>;
};
export default ProgressBar;