
import { useState } from 'react';
import MealSection from '@/components/MealSection';
import { Plus } from 'lucide-react';

export interface FoodItem {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface Meal {
  title: string;
  items: FoodItem[];
}

interface MealsObject {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

interface MealListProps {
  meals: MealsObject;
  proteinTarget: number;
  fatTarget: number;
  carbsTarget: number;
  onAddFoodClick: (mealType: 'breakfast' | 'lunch' | 'dinner') => void;
  onRemoveFood: (mealType: 'breakfast' | 'lunch' | 'dinner', foodId: number) => void;
  onEditFood?: (mealType: 'breakfast' | 'lunch' | 'dinner', food: FoodItem) => void;
}

const MealList = ({ 
  meals, 
  proteinTarget, 
  fatTarget, 
  carbsTarget, 
  onAddFoodClick, 
  onRemoveFood,
  onEditFood
}: MealListProps) => {
  const [searchTerms, setSearchTerms] = useState({
    breakfast: '',
    lunch: '',
    dinner: ''
  });

  const handleSearch = (mealType: 'breakfast' | 'lunch' | 'dinner', term: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [mealType]: term
    }));
  };

  // Filtrer les aliments par repas en fonction des termes de recherche
  const filteredMeals = {
    breakfast: {
      ...meals.breakfast,
      items: searchTerms.breakfast 
        ? meals.breakfast.items.filter(item => 
            item.name.toLowerCase().includes(searchTerms.breakfast.toLowerCase())
          )
        : meals.breakfast.items
    },
    lunch: {
      ...meals.lunch,
      items: searchTerms.lunch 
        ? meals.lunch.items.filter(item => 
            item.name.toLowerCase().includes(searchTerms.lunch.toLowerCase())
          )
        : meals.lunch.items
    },
    dinner: {
      ...meals.dinner,
      items: searchTerms.dinner 
        ? meals.dinner.items.filter(item => 
            item.name.toLowerCase().includes(searchTerms.dinner.toLowerCase())
          )
        : meals.dinner.items
    }
  };

  return (
    <div className="space-y-4">
      <MealSection 
        title={meals.breakfast.title}
        items={filteredMeals.breakfast.items}
        onAddFood={() => onAddFoodClick('breakfast')}
        onRemoveFood={(foodId) => onRemoveFood('breakfast', foodId)}
        onEditFood={onEditFood ? (food) => onEditFood('breakfast', food) : undefined}
        onSearchFood={(term) => handleSearch('breakfast', term)}
        dailyTarget={{
          protein: proteinTarget * 0.25,
          fat: fatTarget * 0.25,
          carbs: carbsTarget * 0.25
        }}
      />
      
      <MealSection 
        title={meals.lunch.title}
        items={filteredMeals.lunch.items}
        onAddFood={() => onAddFoodClick('lunch')}
        onRemoveFood={(foodId) => onRemoveFood('lunch', foodId)}
        onEditFood={onEditFood ? (food) => onEditFood('lunch', food) : undefined}
        onSearchFood={(term) => handleSearch('lunch', term)}
        dailyTarget={{
          protein: proteinTarget * 0.4,
          fat: fatTarget * 0.4,
          carbs: carbsTarget * 0.4
        }}
      />
      
      <MealSection 
        title={meals.dinner.title}
        items={filteredMeals.dinner.items}
        onAddFood={() => onAddFoodClick('dinner')}
        onRemoveFood={(foodId) => onRemoveFood('dinner', foodId)}
        onEditFood={onEditFood ? (food) => onEditFood('dinner', food) : undefined}
        onSearchFood={(term) => handleSearch('dinner', term)}
        dailyTarget={{
          protein: proteinTarget * 0.35,
          fat: fatTarget * 0.35,
          carbs: carbsTarget * 0.35
        }}
      />
    </div>
  );
};

export default MealList;
