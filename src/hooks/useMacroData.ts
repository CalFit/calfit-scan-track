
import { useState } from 'react';
import { Calendar, Dumbbell, Nut, Wheat } from 'lucide-react';

export interface NutritionDataType {
  calories: { 
    current: number; 
    target: number;
    meals: Array<{ id: number; name: string; value: number }>;
    weekly: Array<{ day: string; value: number; target: number }>;
  };
  protein: { 
    current: number; 
    target: number;
    meals: Array<{ id: number; name: string; value: number }>;
  };
  fat: { 
    current: number; 
    target: number;
    meals: Array<{ id: number; name: string; value: number }>;
  };
  carbs: { 
    current: number; 
    target: number;
    meals: Array<{ id: number; name: string; value: number }>;
  };
}

export const useMacroData = () => {
  // Mock data for the demo
  const [nutritionData] = useState<NutritionDataType>({
    calories: { 
      current: 1800, 
      target: 2200,
      meals: [
        { id: 1, name: "Petit déjeuner", value: 450 },
        { id: 2, name: "Déjeuner", value: 650 },
        { id: 3, name: "Snack", value: 200 },
        { id: 4, name: "Dîner", value: 500 },
      ],
      weekly: [
        { day: "Lun", value: 1900, target: 2200 },
        { day: "Mar", value: 2100, target: 2200 },
        { day: "Mer", value: 1800, target: 2200 },
        { day: "Jeu", value: 2000, target: 2200 },
        { day: "Ven", value: 2300, target: 2200 },
        { day: "Sam", value: 1700, target: 2200 },
        { day: "Dim", value: 1800, target: 2200 },
      ]
    },
    protein: { 
      current: 80, 
      target: 120,
      meals: [
        { id: 1, name: "Petit déjeuner", value: 15 },
        { id: 2, name: "Déjeuner", value: 30 },
        { id: 3, name: "Snack", value: 10 },
        { id: 4, name: "Dîner", value: 25 },
      ]
    },
    fat: { 
      current: 60, 
      target: 70,
      meals: [
        { id: 1, name: "Petit déjeuner", value: 15 },
        { id: 2, name: "Déjeuner", value: 20 },
        { id: 3, name: "Snack", value: 7 },
        { id: 4, name: "Dîner", value: 18 },
      ]
    },
    carbs: { 
      current: 220, 
      target: 250,
      meals: [
        { id: 1, name: "Petit déjeuner", value: 60 },
        { id: 2, name: "Déjeuner", value: 70 },
        { id: 3, name: "Snack", value: 25 },
        { id: 4, name: "Dîner", value: 65 },
      ]
    }
  });

  const macroColors = {
    calories: 'bg-calfit-orange',
    protein: 'bg-calfit-blue',
    fat: 'bg-calfit-purple',
    carbs: 'bg-calfit-green',
  };

  const macroLabels = {
    calories: { name: 'Calories', unit: 'kcal', icon: Calendar },
    protein: { name: 'Protéines', unit: 'g', icon: Dumbbell },
    fat: { name: 'Lipides', unit: 'g', icon: Nut },
    carbs: { name: 'Glucides', unit: 'g', icon: Wheat },
  };

  const getPercentage = (key: string) => {
    return Math.min(Math.round((nutritionData[key as keyof NutritionDataType].current / 
                              nutritionData[key as keyof NutritionDataType].target) * 100), 100);
  };

  return {
    nutritionData,
    macroColors,
    macroLabels,
    getPercentage
  };
};
