
import React from 'react';
import { Calculator } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useGoals } from '@/hooks/useGoals';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useMacroData } from '@/hooks/useMacroData';

const GoalsTab = () => {
  const { theme } = useTheme();
  const { 
    macroTargets, 
    percentages, 
    hasChanges,
    handleGramChange, 
    handlePercentChange, 
    handleCaloriesChange,
    saveChanges,
    resetToOriginal
  } = useGoals();
  
  const { macroLabels, macroColors } = useMacroData();
  const isDarkTheme = theme === 'dark';

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    field: string, 
    type: 'gram' | 'percent'
  ) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) return;

    if (type === 'gram') {
      handleGramChange(field as keyof typeof macroTargets, value);
    } else {
      handlePercentChange(field as keyof typeof percentages, value);
    }
  };

  return (
    <div className="calfit-card">
      <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <Calculator className="text-calfit-blue w-5 h-5 mr-2" />
          <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>
            Objectifs nutritionnels
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Résumé des objectifs */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h4 className={`text-md font-medium mb-3 ${isDarkTheme ? 'text-white' : 'text-black'}`}>
            Résumé de vos objectifs
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Calories:</span>
              <span className="font-semibold">{macroTargets.calories} kcal</span>
            </div>
            
            <div className="flex justify-between">
              <span className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Protéines:</span>
              <span className="font-semibold">{macroTargets.protein} g ({percentages.protein}%)</span>
            </div>
            
            <div className="flex justify-between">
              <span className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Lipides:</span>
              <span className="font-semibold">{macroTargets.fat} g ({percentages.fat}%)</span>
            </div>
            
            <div className="flex justify-between">
              <span className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Glucides:</span>
              <span className="font-semibold">{macroTargets.carbs} g ({percentages.carbs}%)</span>
            </div>
          </div>
        </div>

        {/* Section des modifications */}
        <div>
          <h4 className={`text-md font-medium mb-3 ${isDarkTheme ? 'text-white' : 'text-black'}`}>
            Ajuster vos objectifs
          </h4>

          {/* Calories */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${isDarkTheme ? 'text-white' : 'text-black'}`}>
              Calories (kcal)
            </label>
            <input
              type="number"
              value={macroTargets.calories}
              onChange={(e) => handleCaloriesChange(Number(e.target.value))}
              className={`w-full p-2 rounded-md border ${
                isDarkTheme 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              min="1000"
              max="5000"
              step="50"
            />
          </div>

          {/* Macronutriments */}
          {['protein', 'fat', 'carbs'].map((macro) => (
            <div key={macro} className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label className={`block text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                  {macroLabels[macro as keyof typeof macroLabels].name} ({percentages[macro as keyof typeof percentages]}%)
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={macroTargets[macro as keyof typeof macroTargets]}
                    onChange={(e) => handleInputChange(e, macro, 'gram')}
                    className={`w-20 p-1 text-center rounded-md border ${
                      isDarkTheme 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    min="0"
                    step="1"
                  />
                  <span className={`ml-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>g</span>
                </div>
              </div>

              {/* Slider pour ajuster le pourcentage */}
              <div className="mt-2">
                <Slider
                  value={[percentages[macro as keyof typeof percentages]]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => handlePercentChange(macro as keyof typeof percentages, value[0])}
                  className={`${macro === 'protein' ? 'bg-[#E74C3C]/20' : 
                              macro === 'fat' ? 'bg-[#F1C40F]/20' : 
                              'bg-[#3498DB]/20'}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={resetToOriginal}
            className="text-sm"
          >
            Réinitialiser les objectifs
          </Button>
          
          <Button
            onClick={saveChanges}
            disabled={!hasChanges}
            className="text-sm"
          >
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalsTab;
