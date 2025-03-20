import { cn } from '@/lib/utils';
import React from 'react';

interface MacroCardProps {
  macroKey: string;
  data: {
    current: number;
    target: number;
  };
  label: {
    name: string;
    unit: string;
    icon: React.ElementType;
  };
  isSelected: boolean;
  isOverTarget: boolean;
  color: string;
  percentage: number;
  onClick: () => void;
}

const MacroCard = ({
  macroKey,
  data,
  label,
  isSelected,
  isOverTarget,
  color,
  percentage,
  onClick
}: MacroCardProps) => {
  const IconComponent = label.icon;
  
  // Get color based on macro type to match Index page
  const getIconColor = () => {
    if (macroKey === 'protein') return 'text-[#E74C3C]';
    if (macroKey === 'carbs') return 'text-[#3498DB]';
    if (macroKey === 'fat') return 'text-[#F1C40F]';
    return 'text-calfit-orange';
  };
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "calfit-card p-4 text-center transition-all hover:-md",
        isSelected ? 'ring-2 ring-[#3498DB] scale-105' : '',
        isOverTarget ? 'relative' : ''
      )}
    >
      {isOverTarget && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full animate-pulse" />
      )}
      <div className="flex items-center justify-center mb-2">
        <IconComponent className={cn(
          "w-5 h-5 mr-1.5",
          getIconColor()
        )} />
        <div className="text-lg font-bold">
          {data.current}
          <span className="text-xs font-normal ml-1">
            {macroKey === 'calories' ? 'kcal' : 'g'}
          </span>
        </div>
      </div>
      <div className="text-sm">{label.name}</div>
      <div className="macro-progress-bar mt-2 h-2">
        <div 
          className={cn(
            "macro-progress-fill", 
            color,
            percentage >= 85 && percentage <= 110 ? "-[0_0_8px_currentColor]" : "",
            isOverTarget ? "animate-pulse" : ""
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </button>
  );
};

export default MacroCard;
