
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
  return (
    <div className="space-y-4">
      <MealSection 
        title={meals.breakfast.title}
        items={meals.breakfast.items}
        onAddFood={() => onAddFoodClick('breakfast')}
        onRemoveFood={(foodId) => onRemoveFood('breakfast', foodId)}
        onEditFood={onEditFood ? (food) => onEditFood('breakfast', food) : undefined}
        dailyTarget={{
          protein: proteinTarget * 0.25,
          fat: fatTarget * 0.25,
          carbs: carbsTarget * 0.25
        }}
      />
      
      <MealSection 
        title={meals.lunch.title}
        items={meals.lunch.items}
        onAddFood={() => onAddFoodClick('lunch')}
        onRemoveFood={(foodId) => onRemoveFood('lunch', foodId)}
        onEditFood={onEditFood ? (food) => onEditFood('lunch', food) : undefined}
        dailyTarget={{
          protein: proteinTarget * 0.4,
          fat: fatTarget * 0.4,
          carbs: carbsTarget * 0.4
        }}
      />
      
      <MealSection 
        title={meals.dinner.title}
        items={meals.dinner.items}
        onAddFood={() => onAddFoodClick('dinner')}
        onRemoveFood={(foodId) => onRemoveFood('dinner', foodId)}
        onEditFood={onEditFood ? (food) => onEditFood('dinner', food) : undefined}
        dailyTarget={{
          protein: proteinTarget * 0.35,
          fat: fatTarget * 0.35,
          carbs: carbsTarget * 0.35
        }}
      />

      <div className="text-center mt-6 mb-10">
        <button 
          className="calfit-button-primary flex items-center justify-center gap-2 mx-auto bg-calfit-blue hover:bg-calfit-blue/90"
          onClick={() => onAddFoodClick('breakfast')}
        >
          <Plus size={18} />
          Ajouter un repas
        </button>
      </div>
    </div>
  );
};

export default MealList;
