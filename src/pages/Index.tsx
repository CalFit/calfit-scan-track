import { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import AddFoodModal from '@/components/AddFoodModal';
import { useToast } from "@/hooks/use-toast";
import NutritionDashboard from '@/components/dashboard/NutritionDashboard';
import MealList from '@/components/meals/MealList';
import { initialNutritionData, initialMeals } from '@/data/initialNutritionData';
import { Plus } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';

const Index = () => {
  const {
    toast
  } = useToast();
  const [nutritionData, setNutritionData] = useState(initialNutritionData);
  const [meals, setMeals] = useState(initialMeals);
  const [showAddFood, setShowAddFood] = useState(false);
  const [activeMeal, setActiveMeal] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [avatarPulse, setAvatarPulse] = useState(false);

  const overallProgress = () => {
    const caloriePercentage = nutritionData.calories.current / nutritionData.calories.target;
    const proteinPercentage = nutritionData.protein.current / nutritionData.protein.target;
    const fatPercentage = nutritionData.fat.current / nutritionData.fat.target;
    const carbsPercentage = nutritionData.carbs.current / nutritionData.carbs.target;

    return Math.min(Math.round((caloriePercentage + proteinPercentage + fatPercentage + carbsPercentage) / 4 * 100), 100);
  };

  const isPerfectBalance = () => {
    const proteinPercentage = nutritionData.protein.current / nutritionData.protein.target;
    const fatPercentage = nutritionData.fat.current / nutritionData.fat.target;
    const carbsPercentage = nutritionData.carbs.current / nutritionData.carbs.target;

    return proteinPercentage >= 0.85 && proteinPercentage <= 1.05 && 
           fatPercentage >= 0.85 && fatPercentage <= 1.05 && 
           carbsPercentage >= 0.85 && carbsPercentage <= 1.05;
  };

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

    setAvatarPulse(true);
    setTimeout(() => setAvatarPulse(false), 1500);
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
      description: `${foodToRemove.name} a été retiré de votre journal`
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <header className="text-center mb-2">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">CalFit</h1>
          <p className="text-muted-foreground text-sm">Votre assistant nutritionnel</p>
        </header>

        <NutritionDashboard 
          calories={nutritionData.calories} 
          protein={nutritionData.protein} 
          fat={nutritionData.fat} 
          carbs={nutritionData.carbs} 
          pulseAvatar={avatarPulse} 
          isPerfectBalance={isPerfectBalance()} 
        />

        <div className="px-2 mb-6">
          <ProgressBar 
            percentage={overallProgress()} 
            label={`${overallProgress()}% de vos macros atteintes aujourd'hui !`} 
            color="bg-[#F1C40F]" 
            showDate={true} 
          />
        </div>

        <MealList 
          meals={meals} 
          proteinTarget={nutritionData.protein.target} 
          fatTarget={nutritionData.fat.target} 
          carbsTarget={nutritionData.carbs.target} 
          onAddFoodClick={handleAddFoodClick} 
          onRemoveFood={handleRemoveFood} 
        />
      </div>

      <div className="fixed bottom-20 right-4">
        <button 
          onClick={() => setShowAddFood(true)} 
          className="w-14 h-14 bg-[#F39C12] hover:bg-[#F39C12]/90 rounded-full flex items-center justify-center shadow-lg text-white hover:scale-110 transition-all duration-300 btn-bounce"
        >
          <Plus size={28} />
        </button>
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
