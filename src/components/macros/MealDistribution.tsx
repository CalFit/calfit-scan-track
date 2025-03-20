import React from 'react';
import { ChevronRight } from 'lucide-react';

interface MealProps {
  id: number;
  name: string;
  value: number;
}

interface MealDistributionProps {
  meals: MealProps[];
  selectedMacro: string;
  unit: string;
}

const MealDistribution = ({ meals, selectedMacro, unit }: MealDistributionProps) => {
  return (
    <div className="pt-4">
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Répartition par repas</h4>
      
      <div className="space-y-2">
        {meals.map((meal) => (
          <button 
            key={meal.id} 
            className="flex justify-between items-center text-sm p-3 w-full hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          >
            <span className="font-medium">{meal.name}</span>
            <div className="flex items-center">
              <span className="mr-2 font-medium">
                {meal.value} {unit}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MealDistribution;
