
import { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import MacroProgressBar from '@/components/ui/MacroProgressBar';

// Données fictives pour cette démo
const mockData = {
  calories: { 
    current: 1800, 
    target: 2200,
    meals: [
      { id: 1, name: "Petit déjeuner", value: 450 },
      { id: 2, name: "Déjeuner", value: 650 },
      { id: 3, name: "Snack", value: 200 },
      { id: 4, name: "Dîner", value: 500 },
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
};

const MacrosPage = () => {
  const [nutritionData] = useState(mockData);
  const [selectedMacro, setSelectedMacro] = useState('calories');

  const macroColors = {
    calories: 'bg-calfit-orange',
    protein: 'bg-calfit-blue',
    fat: 'bg-calfit-purple',
    carbs: 'bg-calfit-green',
  };

  const macroLabels = {
    calories: { name: 'Calories', unit: 'kcal' },
    protein: { name: 'Protéines', unit: 'g' },
    fat: { name: 'Lipides', unit: 'g' },
    carbs: { name: 'Glucides', unit: 'g' },
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold mb-2">Macronutriments</h1>
          <p className="text-muted-foreground">
            Suivez votre consommation quotidienne
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(nutritionData).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedMacro(key)}
              className={`calfit-card p-4 text-center transition-all ${selectedMacro === key ? 'ring-2 ring-calfit-blue' : ''}`}
            >
              <div className="text-lg font-bold">
                {data.current}
                <span className="text-xs font-normal ml-1">
                  {key === 'calories' ? 'kcal' : 'g'}
                </span>
              </div>
              <div className="text-sm">{macroLabels[key].name}</div>
              <div className="macro-progress-bar mt-2 h-2">
                <div 
                  className={`macro-progress-fill ${macroColors[key]}`}
                  style={{ width: `${Math.min(Math.round((data.current / data.target) * 100), 100)}%` }}
                />
              </div>
            </button>
          ))}
        </div>

        <div className="calfit-card p-5 space-y-4">
          <h3 className="text-xl font-semibold">
            Détail: {macroLabels[selectedMacro].name}
          </h3>
          
          <MacroProgressBar 
            label={macroLabels[selectedMacro].name}
            current={nutritionData[selectedMacro].current} 
            target={nutritionData[selectedMacro].target} 
            color={macroColors[selectedMacro]}
            unit={macroLabels[selectedMacro].unit}
          />

          <div className="pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Répartition par repas</h4>
            
            <div className="space-y-3">
              {nutritionData[selectedMacro].meals.map((meal) => (
                <div key={meal.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{meal.name}</span>
                  <span>
                    {meal.value} {macroLabels[selectedMacro].unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MacrosPage;
