
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNutritionalGoalLabel } from './utils';
import { QuestionnaireFormData } from './types';

interface CalorieCalculationPreviewProps {
  maintenanceCalories: number;
  goalCalories: number;
  nutritionalGoal: string;
  highCalorieBulk?: boolean;
}

const CalorieCalculationPreview: React.FC<CalorieCalculationPreviewProps> = ({
  maintenanceCalories,
  goalCalories,
  nutritionalGoal,
  highCalorieBulk
}) => {
  // Calculer la différence entre maintenance et objectif
  const caloriesDifference = goalCalories - maintenanceCalories;
  const isCalorieIncrease = caloriesDifference > 0;
  
  // Déterminer l'explication basée sur le programme
  const getExplanation = () => {
    switch (nutritionalGoal) {
      case 'cleanBulk':
        return highCalorieBulk ? 
          `+400 kcal (option intensive)` : 
          `+200 kcal (option standard)`;
      case 'progressiveFatLoss':
        return `-300 kcal (déficit modéré)`;
      case 'perfectDeficit':
        return `-500 kcal (déficit important)`;
      case 'bodyRecomposition':
        return `-300 kcal (déficit léger avec rééquilibrage des macros)`;
      case 'maintenance':
        return `Aucun ajustement (maintenance)`;
      default:
        return caloriesDifference !== 0 ? 
          `${caloriesDifference > 0 ? '+' : ''}${caloriesDifference.toFixed(0)} kcal` : 
          `Aucun ajustement`;
    }
  };

  return (
    <Card className="bg-card border-0 shadow-sm mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-calfit-blue">
          Calcul calorique: {getNutritionalGoalLabel(nutritionalGoal)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Calories de maintenance:</span>
              <span>{Math.round(maintenanceCalories)} kcal</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Ajustement:</span>
              <span className={isCalorieIncrease ? "text-green-600" : caloriesDifference < 0 ? "text-red-500" : ""}>
                {getExplanation()}
              </span>
            </div>
            <div className="flex justify-between py-2 bg-calfit-blue/10 p-2 rounded-md">
              <span className="font-semibold">Calories cibles:</span>
              <span className="font-bold">{Math.round(goalCalories)} kcal</span>
            </div>
          </div>
          
          {nutritionalGoal === 'cleanBulk' && (
            <div className="text-sm bg-yellow-50 text-yellow-800 p-2 rounded-md">
              <p className="font-medium">Note sur la prise de muscle:</p>
              <p>L'option {highCalorieBulk ? "intensive" : "standard"} vous permet d'optimiser votre prise de masse musculaire tout en limitant la prise de gras.</p>
            </div>
          )}
          
          {nutritionalGoal === 'progressiveFatLoss' && (
            <div className="text-sm bg-blue-50 text-blue-800 p-2 rounded-md">
              <p className="font-medium">Note sur la perte de gras:</p>
              <p>Le déficit modéré de 300 kcal permet une perte de gras progressive sans perte musculaire significative.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieCalculationPreview;
