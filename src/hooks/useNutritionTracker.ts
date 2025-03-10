
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { initialNutritionData, initialMeals } from '@/data/initialNutritionData';
import { FoodItem } from '@/components/meals/MealList';

type MealType = 'breakfast' | 'lunch' | 'dinner';

export function useNutritionTracker() {
  const { toast } = useToast();
  const [nutritionData, setNutritionData] = useState(initialNutritionData);
  const [meals, setMeals] = useState(initialMeals);
  const [activeMeal, setActiveMeal] = useState<MealType | null>(null);
  const [avatarPulse, setAvatarPulse] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const isPerfectBalance = () => {
    const proteinPercentage = nutritionData.protein.current / nutritionData.protein.target;
    const fatPercentage = nutritionData.fat.current / nutritionData.fat.target;
    const carbsPercentage = nutritionData.carbs.current / nutritionData.carbs.target;
    return proteinPercentage >= 0.85 && proteinPercentage <= 1.05 && 
           fatPercentage >= 0.85 && fatPercentage <= 1.05 && 
           carbsPercentage >= 0.85 && carbsPercentage <= 1.05;
  };
  
  const updateNutritionData = (calories: number, protein: number, fat: number, carbs: number, operation: 'add' | 'remove') => {
    const multiplier = operation === 'add' ? 1 : -1;
    
    setNutritionData(prev => ({
      calories: {
        ...prev.calories,
        current: prev.calories.current + (calories * multiplier)
      },
      protein: {
        ...prev.protein,
        current: prev.protein.current + (protein * multiplier)
      },
      fat: {
        ...prev.fat,
        current: prev.fat.current + (fat * multiplier)
      },
      carbs: {
        ...prev.carbs,
        current: prev.carbs.current + (carbs * multiplier)
      }
    }));
    
    setAvatarPulse(true);
    setTimeout(() => setAvatarPulse(false), 1500);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    toast({
      title: "Date modifiée",
      description: `Affichage des données pour le ${date.toLocaleDateString('fr-FR')}`
    });
  };

  const getRecentFoodsForMeal = () => {
    if (!activeMeal) return [];
    return meals[activeMeal]?.items || [];
  };

  return {
    nutritionData,
    meals,
    activeMeal,
    avatarPulse,
    selectedDate,
    isPerfectBalance,
    setActiveMeal,
    updateNutritionData,
    setMeals,
    handleDateChange,
    getRecentFoodsForMeal
  };
}
