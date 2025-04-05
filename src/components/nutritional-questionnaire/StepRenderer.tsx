
import React from 'react';
import { PersonalInfoStep, GoalsActivityStep, DietPreferencesStep, AllergiesPreferencesStep } from './NutritionalFormSteps';
import { MacroResultsPreview } from './MacroResultsPreview';
import ProgressTracker from './ProgressTracker';
import { QuestionnaireFormData, CalculatedMacros, NutritionalProgram } from './types';
import { UseFormReturn } from 'react-hook-form';

interface StepRendererProps {
  step: number;
  form: UseFormReturn<QuestionnaireFormData>;
  formValues: QuestionnaireFormData;
  nutritionalProgram: NutritionalProgram | null;
  onMacrosChange: (macros: CalculatedMacros) => void;
  onMacrosAdjustment: (macros: CalculatedMacros) => void;
  resultsCalculated?: boolean;
}

const StepRenderer: React.FC<StepRendererProps> = ({
  step,
  form,
  formValues,
  nutritionalProgram,
  onMacrosChange,
  onMacrosAdjustment,
  resultsCalculated = false
}) => {
  // Si les résultats ont été calculés, afficher directement la page de résultats
  if (resultsCalculated) {
    return <MacroResultsPreview 
             formData={formValues} 
             onMacrosChange={onMacrosChange} 
             customizable={true} 
           />;
  }

  // Sinon, afficher l'étape correspondant au step actuel
  switch (step) {
    case 0:
      return <PersonalInfoStep form={form} />;
    case 1:
      return <GoalsActivityStep form={form} />;
    case 2:
      return <DietPreferencesStep form={form} />;
    case 3:
      return <AllergiesPreferencesStep form={form} />;
    case 4:
      return <MacroResultsPreview 
               formData={formValues} 
               onMacrosChange={onMacrosChange} 
               customizable={false}
             />;
    case 5:
      return nutritionalProgram ? (
        <ProgressTracker 
          formData={formValues} 
          nutritionalProgram={nutritionalProgram} 
          onMacrosAdjustment={onMacrosAdjustment} 
        />
      ) : (
        <div className="text-center p-8">
          <p className="text-red-500">Impossible de charger le suivi. Veuillez revenir à l'étape précédente et réessayer.</p>
        </div>
      );
    default:
      return null;
  }
};

export default StepRenderer;
