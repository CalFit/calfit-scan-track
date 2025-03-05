
import { useState } from 'react';
import CalfitAvatar from '@/components/Avatar';
import MacroProgressBar from '@/components/ui/MacroProgressBar';
import MainLayout from '@/components/layouts/MainLayout';

// Données fictives pour cette démo
const initialData = {
  calories: { current: 1800, target: 2200 },
  protein: { current: 80, target: 120 },
  fat: { current: 60, target: 70 },
  carbs: { current: 220, target: 250 }
};

const Index = () => {
  const [nutritionData, setNutritionData] = useState(initialData);

  return (
    <MainLayout>
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-2">CalFit</h1>
          <p className="text-muted-foreground">Votre assistant nutritionnel</p>
        </header>

        <div className="flex justify-center mb-10">
          <CalfitAvatar 
            calories={nutritionData.calories} 
            protein={nutritionData.protein}
            className="scale-110 transform"
          />
        </div>

        <div className="calfit-card p-5 space-y-5">
          <h3 className="text-lg font-semibold">Résumé d'aujourd'hui</h3>
          
          <MacroProgressBar 
            label="Calories" 
            current={nutritionData.calories.current} 
            target={nutritionData.calories.target} 
            color="bg-calfit-orange"
            unit="kcal"
          />
          
          <MacroProgressBar 
            label="Protéines" 
            current={nutritionData.protein.current} 
            target={nutritionData.protein.target} 
            color="bg-calfit-blue"
          />
          
          <MacroProgressBar 
            label="Lipides" 
            current={nutritionData.fat.current} 
            target={nutritionData.fat.target} 
            color="bg-calfit-purple"
          />
          
          <MacroProgressBar 
            label="Glucides" 
            current={nutritionData.carbs.current} 
            target={nutritionData.carbs.target} 
            color="bg-calfit-green"
          />
        </div>

        <div className="text-center mt-10">
          <button className="calfit-button-primary">
            + Ajouter un repas
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
