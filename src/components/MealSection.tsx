
import { useState, useRef } from 'react';
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
  const [swipingItemId, setSwipingItemId] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  
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
      return <Coffee className="w-5 h-5 mr-2.5 text-orange-400" />;
    } else if (lowerTitle.includes('déjeuner')) {
      return <Sun className="w-5 h-5 mr-2.5 text-yellow-500" />;
    } else if (lowerTitle.includes('dîner')) {
      return <Moon className="w-5 h-5 mr-2.5 text-indigo-400" />;
    }
    return <Utensils className="w-5 h-5 mr-2.5 text-gray-500" />;
  };

  // Touch event handlers for swipe-to-delete
  const handleTouchStart = (e: React.TouchEvent, id: number) => {
    touchStartXRef.current = e.touches[0].clientX;
    setSwipingItemId(id);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartXRef.current || swipingItemId === null) return;
    
    const touchCurrentX = e.touches[0].clientX;
    const deltaX = touchCurrentX - touchStartXRef.current;
    
    // Only allow swiping left
    if (deltaX < 0) {
      const element = e.currentTarget as HTMLElement;
      element.style.transform = `translateX(${deltaX}px)`;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, id: number) => {
    if (!touchStartXRef.current || swipingItemId === null) return;
    
    const element = e.currentTarget as HTMLElement;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;
    
    // If swiped more than 100px left, delete the item
    if (deltaX < -100) {
      element.style.transform = 'translateX(-100%)';
      element.style.opacity = '0';
      
      // Add a small delay for the animation
      setTimeout(() => {
        onRemoveFood(id);
      }, 300);
    } else {
      // Reset position
      element.style.transform = 'translateX(0)';
    }
    
    touchStartXRef.current = null;
    setSwipingItemId(null);
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
        <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0 space-y-5 animate-fade-in">
          {/* Show macros for this meal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg">
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
          <div className="space-y-2.5">
            {items.length > 0 ? (
              items.map((item) => (
                <div 
                  key={item.id} 
                  className={`relative overflow-hidden transition-all duration-300 ${swipingItemId === item.id ? 'z-10' : ''}`}
                  onTouchStart={(e) => handleTouchStart(e, item.id)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={(e) => handleTouchEnd(e, item.id)}
                >
                  <div className="flex justify-between p-3.5 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-3 text-sm">
                        <span className="text-calfit-blue font-medium">{item.protein}g</span>
                        <span className="text-calfit-purple font-medium">{item.fat}g</span>
                        <span className="text-calfit-green font-medium">{item.carbs}g</span>
                        <span className="font-medium">{item.calories} kcal</span>
                      </div>
                    </div>
                  </div>
                  {/* Delete indicator */}
                  <div className="absolute right-0 top-0 bottom-0 bg-red-500 flex items-center justify-center px-4">
                    <X className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Aucun aliment ajouté
              </div>
            )}
          </div>
          
          {/* Add button */}
          <div className="mt-3">
            <button 
              onClick={onAddFood}
              className="flex items-center gap-1.5 text-sm px-4 py-3 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all w-full justify-center hover:scale-105 duration-300 hover:shadow-md"
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
