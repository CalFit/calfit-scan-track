import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { FoodItem } from '@/components/meals/MealList';

type MealType = 'breakfast' | 'lunch' | 'dinner';

type UseFoodActionsProps = {
  updateNutritionData: (calories: number, protein: number, fat: number, carbs: number, operation: 'add' | 'remove') => void;
  setMeals: React.Dispatch<React.SetStateAction<any>>;
  setActiveMeal: React.Dispatch<React.SetStateAction<MealType | null>>;
};

export function useFoodActions({ 
  updateNutritionData, 
  setMeals, 
  setActiveMeal 
}: UseFoodActionsProps) {
  const { toast } = useToast();
  const [showAddFood, setShowAddFood] = useState(false);
  const [showEditFood, setShowEditFood] = useState(false);
  const [foodToEdit, setFoodToEdit] = useState<FoodItem | null>(null);

  const handleAddFoodClick = (mealType: MealType) => {
    setActiveMeal(mealType);
    setShowAddFood(true);
  };
  
  const handleEditFood = (mealType: MealType, food: FoodItem) => {
    setActiveMeal(mealType);
    setFoodToEdit(food);
    setShowEditFood(true);
  };
  
  const handleAddFood = (food: any, activeMeal: MealType | null) => {
    if (!activeMeal) return;
    
    const newFood = {
      ...food,
      id: Math.random()
    };
    
    setMeals(prev => ({
      ...prev,
      [activeMeal]: {
        ...prev[activeMeal],
        items: [...prev[activeMeal].items, newFood]
      }
    }));
    
    updateNutritionData(food.calories, food.protein, food.fat, food.carbs, 'add');
    
    const mealNames = {
      breakfast: 'petit-déjeuner',
      lunch: 'déjeuner',
      dinner: 'dîner'
    };
    
    toast({
      title: "Aliment ajouté !",
      description: `${food.name} ajouté à votre ${mealNames[activeMeal]}`
    });
    
    setShowAddFood(false);
  };
  
  const handleSaveEditedFood = (editedFood: FoodItem, activeMeal: MealType | null, foodToEdit: FoodItem | null) => {
    if (!activeMeal || !foodToEdit) return;
    
    // Calculer les différences pour mettre à jour les totaux
    const caloriesDiff = editedFood.calories - foodToEdit.calories;
    const proteinDiff = editedFood.protein - foodToEdit.protein;
    const fatDiff = editedFood.fat - foodToEdit.fat;
    const carbsDiff = editedFood.carbs - foodToEdit.carbs;
    
    // Mettre à jour les repas
    setMeals(prev => ({
      ...prev,
      [activeMeal]: {
        ...prev[activeMeal],
        items: prev[activeMeal].items.map(item => 
          item.id === editedFood.id ? editedFood : item
        )
      }
    }));
    
    // Mettre à jour les totaux de nutrition
    updateNutritionData(caloriesDiff, proteinDiff, fatDiff, carbsDiff, 'add');
    
    toast({
      title: "Aliment modifié",
      description: `${editedFood.name} a été mis à jour`
    });
    
    setFoodToEdit(null);
    setShowEditFood(false);
  };
  
  const handleRemoveFood = (mealType: MealType, foodId: number) => {
    const foodToRemove = setMeals(prev => {
      const food = prev[mealType].items.find(item => item.id === foodId);
      if (food) {
        updateNutritionData(food.calories, food.protein, food.fat, food.carbs, 'remove');
        
        toast({
          title: "Aliment supprimé",
          description: `${food.name} a été retiré de votre journal`
        });
      }
      
      return {
        ...prev,
        [mealType]: {
          ...prev[mealType],
          items: prev[mealType].items.filter(item => item.id !== foodId)
        }
      };
    });
  };

  return {
    showAddFood,
    showEditFood,
    foodToEdit,
    setShowAddFood,
    setShowEditFood,
    handleAddFoodClick,
    handleEditFood,
    handleAddFood,
    handleSaveEditedFood,
    handleRemoveFood
  };
}
