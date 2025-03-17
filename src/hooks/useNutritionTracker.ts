
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { initialNutritionData, initialMeals } from '@/data/initialNutritionData';
import { FoodItem } from '@/components/meals/MealList';
import { useUserSettings } from '@/hooks/useUserSettings';

type MealType = 'breakfast' | 'lunch' | 'dinner';

export function useNutritionTracker() {
  const { toast } = useToast();
  const { settings } = useUserSettings();
  const [nutritionData, setNutritionData] = useState(() => {
    // Initialiser les données de nutrition avec les objectifs des paramètres utilisateur
    return {
      ...initialNutritionData,
      calories: {
        ...initialNutritionData.calories,
        target: settings.macroTargets.calories
      },
      protein: {
        ...initialNutritionData.protein,
        target: settings.macroTargets.protein
      },
      fat: {
        ...initialNutritionData.fat,
        target: settings.macroTargets.fat
      },
      carbs: {
        ...initialNutritionData.carbs,
        target: settings.macroTargets.carbs
      }
    };
  });
  
  const [meals, setMeals] = useState(initialMeals);
  const [activeMeal, setActiveMeal] = useState<MealType | null>(null);
  const [avatarPulse, setAvatarPulse] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Mettre à jour les objectifs lorsque les paramètres utilisateur changent
  useEffect(() => {
    setNutritionData(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        target: settings.macroTargets.calories
      },
      protein: {
        ...prev.protein,
        target: settings.macroTargets.protein
      },
      fat: {
        ...prev.fat,
        target: settings.macroTargets.fat
      },
      carbs: {
        ...prev.carbs,
        target: settings.macroTargets.carbs
      }
    }));
  }, [settings.macroTargets]);
  
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
    
    setNutritionData(prev => {
      // Helper function to update meal distribution
      const updateMealDistribution = (macroKey: string, value: number, mealName: string) => {
        if (!prev[macroKey]?.meals) return prev[macroKey]?.meals || [];
        
        const existingMealIndex = prev[macroKey].meals.findIndex(m => m.name === mealName);
        const mealsCopy = [...prev[macroKey].meals];
        
        if (existingMealIndex >= 0) {
          const updatedValue = mealsCopy[existingMealIndex].value + (value * multiplier);
          mealsCopy[existingMealIndex] = {
            ...mealsCopy[existingMealIndex],
            value: Math.max(0, updatedValue)
          };
        } else if (operation === 'add' && activeMeal) {
          mealsCopy.push({
            id: mealsCopy.length + 1,
            name: mealName,
            value: value
          });
        }
        
        return mealsCopy;
      };
      
      // Get active meal name
      const mealName = activeMeal ? 
        (activeMeal === 'breakfast' ? 'Petit-déjeuner' : 
         activeMeal === 'lunch' ? 'Déjeuner' : 'Dîner') : 
        'Snack';
      
      return {
        calories: {
          ...prev.calories,
          current: prev.calories.current + (calories * multiplier),
          meals: updateMealDistribution('calories', calories, mealName)
        },
        protein: {
          ...prev.protein,
          current: prev.protein.current + (protein * multiplier),
          meals: updateMealDistribution('protein', protein, mealName)
        },
        fat: {
          ...prev.fat,
          current: prev.fat.current + (fat * multiplier),
          meals: updateMealDistribution('fat', fat, mealName)
        },
        carbs: {
          ...prev.carbs,
          current: prev.carbs.current + (carbs * multiplier),
          meals: updateMealDistribution('carbs', carbs, mealName)
        }
      };
    });
    
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
