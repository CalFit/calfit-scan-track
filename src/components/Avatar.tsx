
import { useMemo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface CalfitAvatarProps {
  calories: {
    current: number;
    target: number;
  };
  protein: {
    current: number;
    target: number;
  };
  className?: string;
  showPerfectBalanceBadge?: boolean;
  onCalorieChange?: () => void;
}

const CalfitAvatar = ({ calories, protein, className, showPerfectBalanceBadge = false, onCalorieChange }: CalfitAvatarProps) => {
  const [animatedCalories, setAnimatedCalories] = useState(calories.current);
  const [showIndicator, setShowIndicator] = useState(false);
  
  // Mettre à jour les calories animées lorsque les calories réelles changent
  useEffect(() => {
    if (calories.current !== animatedCalories) {
      // Montrer l'indicateur lorsque les calories changent
      setShowIndicator(true);
      
      // Animation de déplacement des calories
      const startValue = animatedCalories;
      const endValue = calories.current;
      const duration = 1000; // 1 seconde
      const startTime = Date.now();
      
      const animateCalories = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        
        if (elapsed < duration) {
          const progress = elapsed / duration;
          // Fonction d'ease-out pour une animation plus naturelle
          const easeOutProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = startValue + (endValue - startValue) * easeOutProgress;
          setAnimatedCalories(Math.round(currentValue));
          requestAnimationFrame(animateCalories);
        } else {
          setAnimatedCalories(endValue);
          
          // Masquer l'indicateur après un délai
          setTimeout(() => {
            setShowIndicator(false);
          }, 2000);
          
          // Déclencher l'événement de changement de calories
          if (onCalorieChange) {
            onCalorieChange();
          }
        }
      };
      
      requestAnimationFrame(animateCalories);
    }
  }, [calories.current, animatedCalories, onCalorieChange]);
  
  const caloriePercentage = animatedCalories / calories.target;
  const proteinPercentage = protein.current / protein.target;
  const caloriesRemaining = calories.target - animatedCalories;
  
  const avatarState = useMemo(() => {
    if (caloriePercentage > 1.0) {
      return 'overweight';
    } else if (caloriePercentage > 0.8) {
      return 'balanced';
    } else if (caloriePercentage < 0.7) {
      return 'tired';
    } else if (proteinPercentage > 0.9) {
      return 'muscular';
    } else {
      return 'balanced';
    }
  }, [caloriePercentage, proteinPercentage]);

  // Removing the green circle, just keeping colors for different avatar states
  const avatarColors = {
    tired: 'text-gray-400',
    overweight: 'text-orange-400',
    muscular: 'text-[#E74C3C]',
    balanced: 'text-blue-500',
  };

  // Calorie ring styles - changed colors per new requirements
  const calorieRingColor = useMemo(() => {
    if (caloriePercentage > 1.0) return 'text-red-500'; // Over target
    if (caloriePercentage > 0.8) return 'text-orange-400'; // Near target
    return 'text-blue-500'; // Good - changed from green to blue
  }, [caloriePercentage]);

  // Calculate ring parameters
  const ringRadius = 44;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringProgress = Math.min(caloriePercentage, 1) * 100;
  const ringDashoffset = ringCircumference - (ringProgress / 100) * ringCircumference;

  // Status label color
  const statusLabelColor = useMemo(() => {
    if (caloriesRemaining < 0) return 'bg-red-500';
    if (caloriePercentage > 0.8) return 'bg-orange-400';
    return 'bg-blue-500'; // Changed from green to blue
  }, [caloriesRemaining, caloriePercentage]);
  
  // Calculer la position de l'indicateur dynamique
  const calculateIndicatorPosition = () => {
    const angle = (ringProgress / 100) * 2 * Math.PI - (Math.PI / 2); // Commencer à midi (-90°)
    const radius = 50; // Milieu de l'avatar en unités SVG
    const indicatorRadius = 55; // Légèrement plus grand que le rayon de l'anneau
    
    // Calculer les coordonnées x et y
    const x = radius + indicatorRadius * Math.cos(angle);
    const y = radius + indicatorRadius * Math.sin(angle);
    
    return { x, y };
  };
  
  const indicatorPosition = calculateIndicatorPosition();

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Calorie ring - now goes clockwise */}
      <svg 
        width="130" 
        height="130" 
        viewBox="0 0 100 100" 
        className="absolute"
      >
        {/* Background ring */}
        <circle 
          cx="50" 
          cy="50" 
          r={ringRadius} 
          fill="none" 
          stroke="currentColor" 
          className="text-gray-200 dark:text-gray-700" 
          strokeWidth="4"
        />
        
        {/* Progress ring - changed rotation for clockwise motion */}
        <circle 
          cx="50" 
          cy="50" 
          r={ringRadius} 
          fill="none" 
          stroke="currentColor" 
          className={cn(
            calorieRingColor,
            ""
          )} 
          strokeWidth="4" 
          strokeDasharray={ringCircumference} 
          strokeDashoffset={ringDashoffset} 
          strokeLinecap="round"
          style={{ 
            transition: 'stroke-dashoffset 1s ease-in-out',
            filter: 'none',
            transform: 'rotate(-90deg)',
            transformOrigin: 'center'
          }}
        />
        
        {/* Indicateur dynamique */}
        {showIndicator && (
          <g 
            className="animate-bounce-once"
            style={{
              filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.7))',
              transform: `translate(${indicatorPosition.x - 4}px, ${indicatorPosition.y - 4}px)`,
              transition: 'transform 0.5s ease-out'
            }}
          >
            <circle 
              cx="4" 
              cy="4" 
              r="4" 
              fill="white" 
              className="animate-pulse"
            />
            <circle 
              cx="4" 
              cy="4" 
              r="2.5" 
              fill={calorieRingColor.replace('text-', '')} 
            />
          </g>
        )}
        
        {/* Calories display at indicator position */}
        {showIndicator && (
          <text 
            x={indicatorPosition.x} 
            y={indicatorPosition.y - 8} 
            textAnchor="middle" 
            fill="currentColor" 
            className={cn(
              calorieRingColor,
              "text-xs font-bold animate-fade-in"
            )}
            style={{
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
            }}
          >
            {animatedCalories} kcal
          </text>
        )}
      </svg>

      
      {/* Perfect balance badge */}
      {showPerfectBalanceBadge && (
        <div className="absolute -right-2 -top-1 bg-[#F1C40F] text-white p-1 rounded-full animate-bounce-subtle">
          <Star size={16} fill="currentColor" />
        </div>
      )}

      {/* Avatar - removed the border */}
      <div className={cn(
        "w-40 h-40 md:w-44 md:h-44 rounded-full flex items-center justify-center transition-all duration-500", 
        avatarColors[avatarState]
      )}>
        <div className="floating-avatar">
          {avatarState === 'tired' && (
            <div className="text-7xl">😴</div>
          )}
          {avatarState === 'overweight' && (
            <div className="text-7xl">🍔</div>
          )}
          {avatarState === 'muscular' && (
            <div className="text-7xl">💪</div>
          )}
          {avatarState === 'balanced' && (
            <div className="text-7xl">😊</div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default CalfitAvatar;
