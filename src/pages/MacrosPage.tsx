
import { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import MacroCard from '@/components/macros/MacroCard';
import MacroDetail from '@/components/macros/MacroDetail';
import { useNutritionTracker } from '@/hooks/useNutritionTracker';
import { Calendar, Dumbbell, Nut, Wheat } from 'lucide-react';

const MacrosPage = () => {
  const [selectedMacro, setSelectedMacro] = useState('calories');
  const { nutritionData } = useNutritionTracker();

  // Macro colors consistent with the Index page
  const macroColors = {
    calories: 'bg-calfit-orange',
    protein: 'bg-[#E74C3C]',
    fat: 'bg-[#F1C40F]',
    carbs: 'bg-[#3498DB]'
  };

  // Macro labels with consistent icons
  const macroLabels = {
    calories: { name: 'Calories', unit: 'kcal', icon: Calendar },
    protein: { name: 'Protéines', unit: 'g', icon: Dumbbell },
    fat: { name: 'Lipides', unit: 'g', icon: Nut },
    carbs: { name: 'Glucides', unit: 'g', icon: Wheat }
  };

  const getPercentage = (key: string) => {
    const data = nutritionData[key as keyof typeof nutritionData];
    if (!data) return 0;
    return Math.min(Math.round((data.current / data.target) * 100), 100);
  };

  // Making sure nutritionData has been loaded
  if (!nutritionData) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <span>Chargement des données...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 pb-4">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Macronutriments</h1>
          <p className="text-muted-foreground">
            Suivez votre consommation quotidienne
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(nutritionData).map(([key, data]) => {
            const percentage = getPercentage(key);
            const isOverTarget = data.current > data.target;
            
            return (
              <MacroCard
                key={key}
                macroKey={key}
                data={data}
                label={macroLabels[key as keyof typeof macroLabels]}
                isSelected={selectedMacro === key}
                isOverTarget={isOverTarget}
                color={macroColors[key as keyof typeof macroColors]}
                percentage={percentage}
                onClick={() => setSelectedMacro(key)}
              />
            );
          })}
        </div>

        <MacroDetail
          selectedMacro={selectedMacro}
          nutritionData={nutritionData}
          macroColors={macroColors}
          macroLabels={macroLabels}
        />
      </div>
    </MainLayout>
  );
};

export default MacrosPage;
