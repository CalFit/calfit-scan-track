
import { Calendar, Dumbbell, Nut, Wheat } from 'lucide-react';
import { useNutritionTracker } from './useNutritionTracker';
import { useUserGoals } from './useUserGoals';
import { useAuth } from '@/contexts/auth';
import { useEffect, useState } from 'react';

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
  // Use the shared data from useNutritionTracker
  const { nutritionData } = useNutritionTracker();
  const { user } = useAuth();
  const { goals, isLoading } = useUserGoals();

  // Match colors with Index page
  const macroColors = {
    calories: 'bg-calfit-orange',
    protein: 'bg-[#E74C3C]',
    fat: 'bg-[#F1C40F]',
    carbs: 'bg-[#3498DB]'
  };

  // Match labels with Index page
  const macroLabels = {
    calories: { name: 'Calories', unit: 'kcal', icon: Calendar },
    protein: { name: 'Protéines', unit: 'g', icon: Dumbbell },
    fat: { name: 'Lipides', unit: 'g', icon: Nut },
    carbs: { name: 'Glucides', unit: 'g', icon: Wheat }
  };

  // Si l'utilisateur est connecté, sync avec les objectifs de Supabase
  useEffect(() => {
    if (user && !isLoading && goals) {
      // Laissons useNutritionTracker gérer cette mise à jour
      console.log("Objectifs nutritionnels chargés depuis Supabase", goals);
    }
  }, [user, goals, isLoading]);

  const getPercentage = (key: string) => {
    return Math.min(Math.round((nutritionData[key as keyof typeof nutritionData].current / 
                              nutritionData[key as keyof typeof nutritionData].target) * 100), 100);
  };

  return {
    nutritionData,
    macroColors,
    macroLabels,
    getPercentage
  };
};
