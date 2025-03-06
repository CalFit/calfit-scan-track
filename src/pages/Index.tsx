import { useState } from 'react';
import CalfitAvatar from '@/components/Avatar';
import CircularMacroGauge from '@/components/ui/CircularMacroGauge';
import MainLayout from '@/components/layouts/MainLayout';
import MealSection from '@/components/MealSection';
import AddFoodModal from '@/components/AddFoodModal';
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const initialData = {
  calories: { current: 1800, target: 2200 },
  protein: { current: 80, target: 120 },
  fat: { current: 60, target: 70 },
  carbs: { current: 220, target: 250 }
};

const initialMeals = {
  breakfast: {
    title: "Petit-déjeuner",
    items: [
      { id: 1, name: "Yaourt Grec", calories: 120, protein: 15, fat: 5, carbs: 8 },
      { id: 2, name: "Banane", calories: 105, protein: 1, fat: 0, carbs: 27 }
    ]
  },
  lunch: {
    title: "Déjeuner",
    items: [
      { id: 3, name: "Salade de poulet", calories: 350, protein: 30, fat: 15, carbs: 12 }
    ]
  },
  dinner: {
    title: "Dîner",
    items: []
  }
};

const Index = () => {
  const { toast } = useToast();
  const [nutritionData, setNutritionData] = useState(initialData);
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

        <div className="flex justify-center mb-6">
          <CalfitAvatar 
            calories={nutritionData.calories} 
            protein={nutritionData.protein}
            className="scale-110 transform"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <CircularMacroGauge 
            label="Protéines" 
            current={nutritionData.protein.current} 
            target={nutritionData.protein.target} 
            color="bg-calfit-blue"
            unit="g"
          />
          
          <CircularMacroGauge 
            label="Lipides" 
            current={nutritionData.fat.current} 
            target={nutritionData.fat.target} 
            color="bg-calfit-purple"
            unit="g"
          />
          
          <CircularMacroGauge 
            label="Glucides" 
            current={nutritionData.carbs.current} 
            target={nutritionData.carbs.target} 
            color="bg-calfit-green"
            unit="g"
          />
        </div>

        <div className="space-y-6">
          <MealSection 
            title={meals.breakfast.title}
            items={meals.breakfast.items}
            onAddFood={() => handleAddFoodClick('breakfast')}
            onRemoveFood={(foodId) => handleRemoveFood('breakfast', foodId)}
            dailyTarget={{
              protein: nutritionData.protein.target * 0.25,
              fat: nutritionData.fat.target * 0.25,
              carbs: nutritionData.carbs.target * 0.25
            }}
          />
          
          <MealSection 
            title={meals.lunch.title}
            items={meals.lunch.items}
            onAddFood={() => handleAddFoodClick('lunch')}
            onRemoveFood={(foodId) => handleRemoveFood('lunch', foodId)}
            dailyTarget={{
              protein: nutritionData.protein.target * 0.4,
              fat: nutritionData.fat.target * 0.4,
              carbs: nutritionData.carbs.target * 0.4
            }}
          />
          
          <MealSection 
            title={meals.dinner.title}
            items={meals.dinner.items}
            onAddFood={() => handleAddFoodClick('dinner')}
            onRemoveFood={(foodId) => handleRemoveFood('dinner', foodId)}
            dailyTarget={{
              protein: nutritionData.protein.target * 0.35,
              fat: nutritionData.fat.target * 0.35,
              carbs: nutritionData.carbs.target * 0.35
            }}
          />
        </div>

        <div className="text-center mt-10">
          <button 
            className="calfit-button-primary flex items-center justify-center gap-2 mx-auto"
            onClick={() => handleAddFoodClick('breakfast')}
          >
            <Plus size={18} />
            Ajouter un repas
          </button>
        </div>
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
