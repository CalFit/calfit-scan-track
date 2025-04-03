
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Dumbbell, Nut, Wheat } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CircularMacroGaugeProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
  smallSize?: boolean;
}

const CircularMacroGauge = ({
  label,
  current,
  target,
  color,
  unit = 'g',
  smallSize = false
}: CircularMacroGaugeProps) => {
  const [percentage, setPercentage] = useState(0);
  const isMobile = useIsMobile();
  
  // Determine if we should use the small size on mobile devices
  const useSmallSize = smallSize || isMobile;
  
  useEffect(() => {
    // Animate the percentage for a smooth transition
    const timeout = setTimeout(() => {
      setPercentage(Math.min(Math.round(current / target * 100), 100));
    }, 200);
    return () => clearTimeout(timeout);
  }, [current, target]);

  // Determine status color based on percentage
  const getStatusColor = () => {
    if (percentage > 100) return "text-red-500 drop--[0_0_3px_rgba(239,68,68,0.7)]"; // Excess
    if (percentage > 85) return "text-green-500 drop--[0_0_2px_rgba(34,197,94,0.6)]"; // Good
    if (percentage > 60) return "text-yellow-500"; // Medium
    return "text-gray-400"; // Low
  };

  // Get darker background color for better contrast
  const getDarkerBgColor = () => {
    if (color.includes('calfit-blue')) return 'text-[#2874A6]'; // Darker blue
    if (color.includes('calfit-purple') || color.includes('calfit-yellow')) return 'text-[#D4A017]'; // Darker yellow
    if (color.includes('calfit-green') || color.includes('calfit-red')) return 'text-[#C0392B]'; // Darker red
    return color.replace('bg-', 'text-');
  };

  // Style for progress circle - smaller for mobile
  const circleRadius = useSmallSize ? 28 : 38; // Even smaller on mobile
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - percentage / 100 * circleCircumference;

  // Get the appropriate icon based on label
  const getIcon = () => {
    if (label.toLowerCase().includes('protéine')) {
      return <Dumbbell className={`${useSmallSize ? 'w-3.5 h-3.5' : 'w-5 h-5'} mr-1 text-[#E74C3C]`} />;
    } else if (label.toLowerCase().includes('lipide')) {
      return <Nut className={`${useSmallSize ? 'w-3.5 h-3.5' : 'w-5 h-5'} mr-1 text-[#F1C40F]`} />;
    } else if (label.toLowerCase().includes('glucide')) {
      return <Wheat className={`${useSmallSize ? 'w-3.5 h-3.5' : 'w-5 h-5'} mr-1 text-[#3498DB]`} />;
    }
    return null;
  };

  // Determine if we should show the glow effect
  const showGlow = percentage >= 85 && percentage <= 110;
  const isOverTarget = percentage > 100;
  
  return (
    <div className={cn(
      "flex flex-col items-center p-1 hover:scale-105 transition-transform duration-300", 
      useSmallSize ? "w-[80px]" : "w-[96px]" // Smaller on mobile
    )}>
      <div className="relative flex items-center justify-center mb-1 md:mb-2">
        <svg 
          width={useSmallSize ? "70" : "84"} 
          height={useSmallSize ? "70" : "84"} 
          viewBox="0 0 100 100" 
          className="transform -rotate-90"
        >
          {/* Background circle - lighter for better contrast */}
          <circle 
            cx="50" 
            cy="50" 
            r={circleRadius} 
            fill="none" 
            stroke="currentColor" 
            className="text-gray-100 dark:text-gray-800" 
            strokeWidth={useSmallSize ? "10" : "8"} 
          />
          
          {/* Progress circle with animation and darker color */}
          <circle 
            cx="50" 
            cy="50" 
            r={circleRadius} 
            fill="none" 
            stroke="currentColor" 
            className={cn(
              "transition-all duration-1000 ease-out", 
              getDarkerBgColor(), 
              isOverTarget ? "animate-pulse" : ""
            )} 
            strokeWidth={useSmallSize ? "10" : "8"} 
            strokeDasharray={circleCircumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: showGlow ? 'drop-(0 0 3px currentColor)' : 'none'
            }} 
          />
        </svg>
        <div className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-all duration-500", 
          isOverTarget ? "animate-pulse-soft" : ""
        )}>
          <span className={`${useSmallSize ? 'text-lg' : 'text-2xl'} font-medium`}>{percentage}%</span>
          <span className={`${useSmallSize ? 'text-[10px]' : 'text-xs'} font-medium`}>
            {current}/{target} {unit}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center">
        {getIcon()}
        <span className={`${useSmallSize ? 'text-xs' : 'text-sm'} font-medium`}>{label}</span>
      </div>
    </div>
  );
};

export default CircularMacroGauge;
