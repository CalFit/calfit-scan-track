
import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, X, Sun, Coffee, Utensils, Moon } from 'lucide-react';
import MacroProgressBar from '@/components/ui/MacroProgressBar';
import { cn } from '@/lib/utils';

interface FoodItem {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface DailyTarget {
  protein: number;
  fat: number;
  carbs: number;
}

interface MealSectionProps {
  title: string;
  items: FoodItem[];
  dailyTarget: DailyTarget;
  onAddFood: () => void;
  onRemoveFood: (id: number) => void;
}

const MealSection = ({ title, items, dailyTarget, onAddFood, onRemoveFood }: MealSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Calculate meal totals
  const mealTotals = items.reduce((acc, item) => {
    return {
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      fat: acc.fat + item.fat,
      carbs: acc.carbs + item.carbs
    };
  }, { calories: 0, protein: 0, fat: 0, carbs: 0 });
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Get the appropriate icon based on meal title
  const getMealIcon = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('petit-déjeuner') || lowerTitle.includes('petit déjeuner')) {
      return <Coffee className="w-5 h-5 mr-2 text-orange-400" />;
    } else if (lowerTitle.includes('déjeuner')) {
      return <Sun className="w-5 h-5 mr-2 text-yellow-500" />;
    } else if (lowerTitle.includes('dîner')) {
      return <Moon className="w-5 h-5 mr-2 text-indigo-400" />;
    }
    return <Utensils className="w-5 h-5 mr-2 text-gray-500" />;
  };
  
  return (
    <div className={cn(
      "calfit-card overflow-hidden transition-all duration-300 border-l-4",
      title.toLowerCase().includes('petit-déjeuner') ? "border-l-orange-400" : 
      title.toLowerCase().includes('déjeuner') ? "border-l-yellow-500" : 
      "border-l-indigo-400"
    )}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          {getMealIcon()}
          <div>
            <h3 className="font-semibold">{title}</h3>
            <span className="text-sm text-muted-foreground">
              {mealTotals.calories} kcal
            </span>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 animate-fade-in">
          {/* Show macros for this meal */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-muted/30 rounded-lg">
            <MacroProgressBar 
              label="Protéines" 
              current={mealTotals.protein} 
              target={dailyTarget.protein}
              color="bg-calfit-blue"
            />
            
            <MacroProgressBar 
              label="Lipides" 
              current={mealTotals.fat} 
              target={dailyTarget.fat}
              color="bg-calfit-purple"
            />
            
            <MacroProgressBar 
              label="Glucides" 
              current={mealTotals.carbs} 
              target={dailyTarget.carbs}
              color="bg-calfit-green"
            />
          </div>
          
          {/* Food list */}
          <div className="space-y-2">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="relative overflow-hidden">
                  <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group hover:translate-x-[-40px] transition-all duration-300">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-3 text-sm">
                        <span className="text-calfit-blue">{item.protein}g</span>
                        <span className="text-calfit-purple">{item.fat}g</span>
                        <span className="text-calfit-green">{item.carbs}g</span>
                        <span>{item.calories} kcal</span>
                      </div>
                    </div>
                  </div>
                  {/* Delete button that appears on swipe */}
                  <button
                    onClick={() => onRemoveFood(item.id)}
                    className="absolute right-0 top-0 h-full bg-red-500 p-3 flex items-center justify-center text-white"
                    style={{ width: '40px' }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Aucun aliment ajouté
              </div>
            )}
          </div>
          
          {/* Add button */}
          <div className="mt-3">
            <button 
              onClick={onAddFood}
              className="flex items-center gap-1.5 text-sm px-3 py-2.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all w-full justify-center hover:scale-105 duration-300"
            >
              <Plus size={16} className="animate-pulse-soft" />
              Ajouter un aliment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSection;
