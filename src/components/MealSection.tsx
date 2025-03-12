import { useState, useRef } from 'react';
import { Plus, ChevronDown, ChevronUp, X, Sun, Coffee, Utensils, Moon, MoreHorizontal } from 'lucide-react';
import MacroProgressBar from '@/components/ui/MacroProgressBar';
import { cn } from '@/lib/utils';
interface FoodItem {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  isUnbalanced?: boolean;
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
  onEditFood?: (food: FoodItem) => void;
}
const foodIcons: Record<string, string> = {
  "yaourt grec": "🥄",
  "yaourt": "🥄",
  "banane": "🍌",
  "œuf": "🥚",
  "pain": "🍞",
  "tomate": "🍅",
  "poulet": "🍗",
  "riz": "🍚",
  "pâtes": "🍝",
  "poisson": "🐟",
  "fromage": "🧀",
  "pomme": "🍎",
  "avocat": "🥑",
  "lait": "🥛",
  "café": "☕",
  "thé": "🍵",
  "jus": "🧃",
  "eau": "💧",
  "chocolat": "🍫",
  "salade": "🥗",
  "steak": "🥩",
  "sushi": "🍣",
  "carotte": "🥕",
  "orange": "🍊",
  "fraise": "🍓"
};
const getFoodEmoji = (foodName: string): string => {
  const lowerName = foodName.toLowerCase();
  for (const [key, emoji] of Object.entries(foodIcons)) {
    if (lowerName.includes(key)) {
      return emoji;
    }
  }
  return "🍽️";
};
const MealSection = ({
  title,
  items,
  dailyTarget,
  onAddFood,
  onRemoveFood,
  onEditFood
}: MealSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [swipingItemId, setSwipingItemId] = useState<number | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const mealTotals = items.reduce((acc, item) => {
    return {
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      fat: acc.fat + item.fat,
      carbs: acc.carbs + item.carbs
    };
  }, {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0
  });
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const getMealIcon = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('petit-déjeuner') || lowerTitle.includes('petit déjeuner')) {
      return <Coffee className="w-5 h-5 mr-2.5 text-orange-400" aria-label="Petit-déjeuner" />;
    } else if (lowerTitle.includes('déjeuner')) {
      return <Sun className="w-5 h-5 mr-2.5 text-yellow-500" aria-label="Déjeuner" />;
    } else if (lowerTitle.includes('dîner')) {
      return <Moon className="w-5 h-5 mr-2.5 text-indigo-400" aria-label="Dîner" />;
    }
    return <Utensils className="w-5 h-5 mr-2.5 text-gray-500" aria-label="Repas" />;
  };
  const handleTouchStart = (e: React.TouchEvent, id: number) => {
    touchStartXRef.current = e.touches[0].clientX;
    setSwipingItemId(id);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartXRef.current || swipingItemId === null) return;
    const touchCurrentX = e.touches[0].clientX;
    const deltaX = touchCurrentX - touchStartXRef.current;
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
    if (deltaX < -100) {
      element.style.transform = 'translateX(-100%)';
      element.style.opacity = '0';
      setTimeout(() => {
        onRemoveFood(id);
      }, 300);
    } else {
      element.style.transform = 'translateX(0)';
    }
    touchStartXRef.current = null;
    setSwipingItemId(null);
  };
  const isUnbalancedFood = (item: FoodItem): boolean => {
    return item.carbs > item.protein * 2 || item.isUnbalanced || false;
  };
  
  const handleFoodClick = (food: FoodItem) => {
    if (onEditFood) {
      onEditFood(food);
    }
  };
  
  return <div className={cn("calfit-card overflow-hidden transition-all duration-300 border-l-4", title.toLowerCase().includes('petit-déjeuner') ? "border-l-orange-400" : title.toLowerCase().includes('déjeuner') ? "border-l-yellow-500" : "border-l-indigo-400")}>
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={toggleExpand}>
        <div className="flex items-center">
          {getMealIcon()}
          <div>
            <h3 className="font-semibold">{title}</h3>
            <span className="text-sm text-muted-foreground">
              {mealTotals.calories} kcal
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 mr-1" onClick={e => {
          e.stopPropagation();
          setShowContextMenu(!showContextMenu);
        }}>
            
          </button>
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        {showContextMenu && <div className="absolute right-12 mt-2 bg-white dark:bg-gray-800 rounded-md -lg py-1 z-10 border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setShowContextMenu(false)}>
              Renommer
            </button>
            <button className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setShowContextMenu(false)}>
              Supprimer
            </button>
          </div>}
      </div>
      
      {isExpanded && <div className="p-4 pt-0 space-y-5 animate-fade-in">
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-muted/30 rounded-lg">
            <MacroProgressBar label="Protéines" current={mealTotals.protein} target={dailyTarget.protein} color="bg-[#E74C3C]" compact />
            
            <MacroProgressBar label="Glucides" current={mealTotals.carbs} target={dailyTarget.carbs} color="bg-[#3498DB]" compact />
            
            <MacroProgressBar label="Lipides" current={mealTotals.fat} target={dailyTarget.fat} color="bg-[#F1C40F]" compact />
          </div>
          
          <div className="space-y-3.5">
            {items.length > 0 ? items.map(item => <div key={item.id} className={`relative overflow-hidden transition-all duration-300 ${swipingItemId === item.id ? 'z-10' : ''}`} onTouchStart={e => handleTouchStart(e, item.id)} onTouchMove={handleTouchMove} onTouchEnd={e => handleTouchEnd(e, item.id)}>
                <div 
                  className={cn(
                    "flex justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300", 
                    isUnbalancedFood(item) ? "bg-orange-50 dark:bg-orange-900/20" : "",
                    "cursor-pointer"
                  )} 
                  title={isUnbalancedFood(item) ? "Aliment déséquilibré: excès de glucides" : "Cliquez pour modifier"}
                  onClick={() => handleFoodClick(item)}
                >
                  <div className="flex items-center">
                    <span className="mr-2.5 text-lg">{getFoodEmoji(item.name)}</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-3 text-sm">
                      <span className="text-[#E74C3C] font-medium">{item.protein}g</span>
                      <span className="text-[#3498DB] font-medium">{item.carbs}g</span>
                      <span className="text-[#F1C40F] font-medium">{item.fat}g</span>
                      <span className="font-medium">{item.calories} kcal</span>
                    </div>
                  </div>
                </div>
                
                
              </div>) : <div className="text-center py-6 text-muted-foreground">
                Aucun aliment ajouté
              </div>}
          </div>
          
          <div className="mt-3">
            <button onClick={e => {
          e.stopPropagation();
          onAddFood();
        }} className="flex items-center gap-1.5 text-sm px-4 py-3 rounded-md bg-[#F39C12]/20 hover:bg-[#F39C12]/30 text-[#F39C12] dark:bg-gray-800 dark:hover:bg-gray-700 transition-all w-full justify-center hover:scale-105 duration-300 hover:-md btn-bounce">
              <Plus size={16} className="animate-pulse-soft text-white" />
              <span className="text-white">Ajouter un aliment</span>
            </button>
          </div>
        </div>}
    </div>;
};
export default MealSection;
