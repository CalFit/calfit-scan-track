
import { useState } from 'react';
import CalfitAvatar from '@/components/Avatar';
import CircularMacroGauge from '@/components/ui/CircularMacroGauge';
import MainLayout from '@/components/layouts/MainLayout';
import MealSection from '@/components/MealSection';
import { Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Données fictives pour cette démo
const initialData = {
  calories: { current: 1800, target: 2200 },
  protein: { current: 80, target: 120 },
  fat: { current: 60, target: 70 },
  carbs: { current: 220, target: 250 }
};

// Données fictives des repas
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

  const handleAddFood = (mealType: 'breakfast' | 'lunch' | 'dinner', food: any) => {
    // Dans une version réelle, ce serait l'endroit où vous ajouteriez vraiment l'aliment
    toast({
      title: "Aliment ajouté !",
      description: `${food.name} ajouté à votre ${mealType === 'breakfast' ? 'petit-déjeuner' : mealType === 'lunch' ? 'déjeuner' : 'dîner'}`,
    });
    
    setShowAddFood(false);
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
          {/* Sections des repas */}
          <MealSection 
            title={meals.breakfast.title}
            items={meals.breakfast.items}
            onAddFood={() => handleAddFoodClick('breakfast')}
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
    </MainLayout>
  );
};

export default Index;
