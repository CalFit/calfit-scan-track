
import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, X } from 'lucide-react';
import MacroProgressBar from '@/components/ui/MacroProgressBar';

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
  
  // Calcule les totaux pour ce repas
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
  
  return (
    <div className="calfit-card overflow-hidden transition-all duration-300">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <h3 className="font-semibold">{title}</h3>
          <span className="ml-2 text-sm text-muted-foreground">
            {mealTotals.calories} kcal
          </span>
        </div>
        <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 animate-fade-in">
          {/* Affichage des macros pour ce repas */}
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
          
          {/* Liste des aliments */}
          <div className="space-y-2">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group">
                  <span className="font-medium">{item.name}</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-3 text-sm">
                      <span className="text-calfit-blue">{item.protein}g</span>
                      <span className="text-calfit-purple">{item.fat}g</span>
                      <span className="text-calfit-green">{item.carbs}g</span>
                      <span>{item.calories} kcal</span>
                    </div>
                    <button
                      onClick={() => onRemoveFood(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Aucun aliment ajouté
              </div>
            )}
          </div>
          
          {/* Bouton d'ajout */}
          <div className="mt-3">
            <button 
              onClick={onAddFood}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors w-full justify-center"
            >
              <Plus size={16} />
              Ajouter un aliment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSection;
