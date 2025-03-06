
import { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import AddFoodModal from '@/components/AddFoodModal';
import { useToast } from "@/hooks/use-toast";
import NutritionDashboard from '@/components/dashboard/NutritionDashboard';
import MealList from '@/components/meals/MealList';
import { initialNutritionData, initialMeals } from '@/data/initialNutritionData';

const Index = () => {
  const { toast } = useToast();
  const [nutritionData, setNutritionData] = useState(initialNutritionData);
  const [meals, setMeals] = useState(initialMeals);
  const [showAddFood, setShowAddFood] = useState(false);
  const [activeMeal, setActiveMeal] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);

  const handleAddFoodClick = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    setActiveMeal(mealType);
    setShowAddFood(true);
  };

  const handleAddFood = (food: any) => {
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

    setNutritionData(prev => ({
      calories: {
        ...prev.calories,
        current: prev.calories.current + food.calories
      },
      protein: {
        ...prev.protein,
        current: prev.protein.current + food.protein
      },
      fat: {
        ...prev.fat,
        current: prev.fat.current + food.fat
      },
      carbs: {
        ...prev.carbs,
        current: prev.carbs.current + food.carbs
      }
    }));

    const mealNames = {
      breakfast: 'petit-déjeuner',
      lunch: 'déjeuner',
      dinner: 'dîner'
    };

    toast({
      title: "Aliment ajouté !",
      description: `${food.name} ajouté à votre ${mealNames[activeMeal]}`,
    });
    
    setShowAddFood(false);
  };

  const handleRemoveFood = (mealType: 'breakfast' | 'lunch' | 'dinner', foodId: number) => {
    const foodToRemove = meals[mealType].items.find(item => item.id === foodId);
    if (!foodToRemove) return;

    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        items: prev[mealType].items.filter(item => item.id !== foodId)
      }
    }));

    setNutritionData(prev => ({
      calories: {
        ...prev.calories,
        current: prev.calories.current - foodToRemove.calories
      },
      protein: {
        ...prev.protein,
        current: prev.protein.current - foodToRemove.protein
      },
      fat: {
        ...prev.fat,
        current: prev.fat.current - foodToRemove.fat
      },
      carbs: {
        ...prev.carbs,
        current: prev.carbs.current - foodToRemove.carbs
      }
    }));

    toast({
      title: "Aliment supprimé",
      description: `${foodToRemove.name} a été retiré de votre journal`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-2">CalFit</h1>
          <p className="text-muted-foreground">Votre assistant nutritionnel</p>
        </header>

        <NutritionDashboard 
          calories={nutritionData.calories}
          protein={nutritionData.protein}
          fat={nutritionData.fat}
          carbs={nutritionData.carbs}
        />

        <MealList 
          meals={meals}
          proteinTarget={nutritionData.protein.target}
          fatTarget={nutritionData.fat.target}
          carbsTarget={nutritionData.carbs.target}
          onAddFoodClick={handleAddFoodClick}
          onRemoveFood={handleRemoveFood}
        />
      </div>

      <AddFoodModal 
        isOpen={showAddFood}
        onClose={() => setShowAddFood(false)}
        onAddFood={handleAddFood}
        mealType={activeMeal || 'breakfast'}
      />
    </MainLayout>
  );
};

export default Index;
