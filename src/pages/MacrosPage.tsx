import { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import MacroCard from '@/components/macros/MacroCard';
import MacroDetail from '@/components/macros/MacroDetail';
import { useNutritionTracker } from '@/hooks/useNutritionTracker';
import { Calendar, Dumbbell, Nut, Wheat } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';

const MacrosPage = () => {
  const [selectedMacro, setSelectedMacro] = useState('calories');
  const { nutritionData } = useNutritionTracker();
  const { settings } = useUserSettings();

  const macroColors = {
    calories: 'bg-calfit-orange',
    protein: 'bg-[#E74C3C]',
    fat: 'bg-[#F1C40F]',
    carbs: 'bg-[#3498DB]'
  };

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
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{settings.name} - Macronutriments</h1>
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

        {/* Ajout des boutons sous les macros */}
        <div className="space-y-3 mt-4">
          <button className="w-full flex items-center justify-between p-4 bg-blue-600 text-white rounded-lg shadow-lg">
            <span>🔍 Chercher ou ajouter un aliment</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 bg-green-600 text-white rounded-lg shadow-lg">
            <span>📋 Voir mes repas</span>
          </button>
        </div>

      </div>
    </MainLayout>
  );
};

export default MacrosPage;
