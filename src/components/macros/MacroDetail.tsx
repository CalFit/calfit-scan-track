
import React from 'react';
import MacroProgressBar from '@/components/ui/MacroProgressBar';
import WeeklyCalorieChart from './WeeklyCalorieChart';
import MealDistribution from './MealDistribution';
import { useIsMobile } from '@/hooks/use-mobile';

interface MacroDetailProps {
  selectedMacro: string;
  nutritionData: any;
  macroColors: Record<string, string>;
  macroLabels: Record<string, { name: string; unit: string; icon: React.ElementType }>;
}

const MacroDetail = ({ 
  selectedMacro, 
  nutritionData, 
  macroColors, 
  macroLabels 
}: MacroDetailProps) => {
  const isMobile = useIsMobile();
  
  // Get icon and text color based on macro type
  const getIconColor = () => {
    if (selectedMacro === 'protein') return 'bg-[#E74C3C]';
    if (selectedMacro === 'carbs') return 'bg-[#3498DB]';
    if (selectedMacro === 'fat') return 'bg-[#F1C40F]';
    return 'bg-calfit-orange';
  };
  
  return (
    <div className="calfit-card p-3 sm:p-5 space-y-3 sm:space-y-4 w-full max-w-full overflow-hidden">
      <h3 className="text-lg sm:text-xl font-semibold flex items-center">
        <span className={`mr-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full ${getIconColor()} flex items-center justify-center animate-pulse-soft`}>
          {React.createElement(macroLabels[selectedMacro].icon, { className: "w-3 h-3 sm:w-4 sm:h-4 text-white" })}
        </span>
        Détail: {macroLabels[selectedMacro].name}
      </h3>
      
      <MacroProgressBar 
        label={macroLabels[selectedMacro].name}
        current={nutritionData[selectedMacro].current} 
        target={nutritionData[selectedMacro].target} 
        color={macroColors[selectedMacro]}
        unit={macroLabels[selectedMacro].unit}
        compact={isMobile}
      />

      {selectedMacro === 'calories' && nutritionData.calories.weekly && (
        <div className="w-full overflow-x-auto -mx-1 px-1">
          <div className="min-w-[300px]">
            <WeeklyCalorieChart data={nutritionData.calories.weekly} />
          </div>
        </div>
      )}

      {nutritionData[selectedMacro].meals && (
        <MealDistribution 
          meals={nutritionData[selectedMacro].meals} 
          selectedMacro={selectedMacro}
          unit={macroLabels[selectedMacro].unit}
        />
      )}
    </div>
  );
};

export default MacroDetail;
