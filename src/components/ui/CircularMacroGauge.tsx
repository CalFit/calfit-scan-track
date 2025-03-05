
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CircularMacroGaugeProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
}

const CircularMacroGauge = ({
  label,
  current,
  target,
  color,
  unit = 'g'
}: CircularMacroGaugeProps) => {
  const [percentage, setPercentage] = useState(0);
  
  useEffect(() => {
    // Nous utilisons un délai pour créer une animation
    const timer = setTimeout(() => {
      setPercentage(Math.min(Math.round((current / target) * 100), 100));
    }, 100);
    
    return () => clearTimeout(timer);
  }, [current, target]);
  
  // Détermine la couleur du statut
  const getStatusColor = () => {
    if (percentage > 100) return "text-red-500"; // Dépassement
    if (percentage > 85) return "text-green-500"; // Bon
    if (percentage > 60) return "text-yellow-500"; // Moyen
    return "text-gray-400"; // Faible
  };
  
  // Style pour le cercle de progression
  const circleRadius = 35;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (percentage / 100) * circleCircumference;

  // Animation de l'arc de cercle
  const strokeTransition = {
    strokeDashoffset: {
      transition: 'stroke-dashoffset 0.8s ease-in-out'
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center mb-2">
        <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
          {/* Cercle de fond */}
          <circle 
            cx="50" 
            cy="50" 
            r={circleRadius} 
            fill="none" 
            stroke="currentColor" 
            className="text-gray-200 dark:text-gray-700" 
            strokeWidth="6"
          />
          
          {/* Cercle de progression */}
          <circle 
            cx="50" 
            cy="50" 
            r={circleRadius} 
            fill="none" 
            stroke="currentColor" 
            className={cn("transition-all duration-1000", color.replace('bg-', 'text-'))} 
            strokeWidth="6" 
            strokeDasharray={circleCircumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            style={strokeTransition.strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold ${getStatusColor()}`}>{percentage}%</span>
          <span className="text-xs text-muted-foreground">{current}/{target}{unit}</span>
        </div>
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default CircularMacroGauge;
