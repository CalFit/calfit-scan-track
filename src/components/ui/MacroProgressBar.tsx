
import { cn } from '@/lib/utils';
import { Dumbbell, Nut, Wheat } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Force compact view on mobile
  const useCompactView = compact || isMobile;

  // Get the appropriate icon based on label with new colors
  const getIcon = () => {
    if (label.toLowerCase().includes('protéine')) {
      return <Dumbbell className={`${useCompactView ? 'w-3 h-3' : 'w-4 h-4'} mr-1 text-[#E74C3C]`} />;
    } else if (label.toLowerCase().includes('lipide')) {
      return <Nut className={`${useCompactView ? 'w-3 h-3' : 'w-4 h-4'} mr-1 text-[#F1C40F]`} />;
    } else if (label.toLowerCase().includes('glucide')) {
      return <Wheat className={`${useCompactView ? 'w-3 h-3' : 'w-4 h-4'} mr-1 text-[#3498DB]`} />;
    }
    return null;
  };

  // Get correct background color based on label
  const getBackgroundColor = () => {
    if (label.toLowerCase().includes('protéine')) {
      return 'bg-[#E74C3C]';
    } else if (label.toLowerCase().includes('lipide')) {
      return 'bg-[#F1C40F]';
    } else if (label.toLowerCase().includes('glucide')) {
      return 'bg-[#3498DB]';
    }
    return color;
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center my-0 mx-[10px] sm:mx-[20px] py-0 px-[2px]">
        <div className="flex items-center">
          {getIcon()}
        </div>
        <span className={`${useCompactView ? 'text-xs' : 'text-sm'} font-medium ml-1`}>
          {current}/{target} {unit}
        </span>
      </div>
      <div className={`macro-progress-bar ${useCompactView ? 'h-1.5' : 'h-2.5'} rounded-full overflow-hidden`}>
        <div 
          className={cn(
            "macro-progress-fill transition-all duration-700", 
            getBackgroundColor(), 
            ""
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
