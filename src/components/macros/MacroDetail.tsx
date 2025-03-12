
import React from 'react';
import MacroProgressBar from '@/components/ui/MacroProgressBar';
import WeeklyCalorieChart from './WeeklyCalorieChart';
import MealDistribution from './MealDistribution';

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
  // Get icon and text color based on macro type
  const getIconColor = () => {
    if (selectedMacro === 'protein') return 'bg-[#E74C3C]';
    if (selectedMacro === 'carbs') return 'bg-[#3498DB]';
    if (selectedMacro === 'fat') return 'bg-[#F1C40F]';
    return 'bg-calfit-orange';
  };
  
  return (
    <div className="calfit-card p-5 space-y-4">
      <h3 className="text-xl font-semibold flex items-center">
        <span className={`mr-2.5 w-7 h-7 rounded-full ${getIconColor()} flex items-center justify-center animate-pulse-soft`}>
          {React.createElement(macroLabels[selectedMacro].icon, { className: "w-4 h-4 text-white" })}
        </span>
        Détail: {macroLabels[selectedMacro].name}
      </h3>
      
      <MacroProgressBar 
        label={macroLabels[selectedMacro].name}
        current={nutritionData[selectedMacro].current} 
        target={nutritionData[selectedMacro].target} 
        color={macroColors[selectedMacro]}
        unit={macroLabels[selectedMacro].unit}
      />

      {selectedMacro === 'calories' && (
        <WeeklyCalorieChart data={nutritionData.calories.weekly} />
      )}

      <MealDistribution 
        meals={nutritionData[selectedMacro].meals} 
        selectedMacro={selectedMacro}
        unit={macroLabels[selectedMacro].unit}
      />
    </div>
  );
};

export default MacroDetail;
