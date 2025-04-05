
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { QuestionnaireFormData, CalculatedMacros, NutritionalProgram } from './types';
import { nutritionalQuestionnaireSchema, defaultQuestionnaireValues } from './nutritionalQuestionnaireSchema';
import { calculateNutritionalProgram } from './utils';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Composants refactorisés
import QuestionnaireHeader from './QuestionnaireHeader';
import QuestionnaireNavigation from './QuestionnaireNavigation';
import ConfirmationDialog from './ConfirmationDialog';
import StepRenderer from './StepRenderer';

const NutritionalQuestionnaire: React.FC = () => {
  // États
  const [step, setStep] = useState(0);
  const [calculatedMacros, setCalculatedMacros] = useState<CalculatedMacros | null>(null);
  const [nutritionalProgram, setNutritionalProgram] = useState<NutritionalProgram | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [resultsCalculated, setResultsCalculated] = useState(false);
  
  // Hooks
  const { settings, updateSettings } = useUserSettings();
  const { toast } = useToast();
  
  // Définition des étapes
  const steps = ["Informations personnelles", "Objectifs & Activité", "Préférences alimentaires", "Allergies", "Résultats", "Suivi hebdomadaire"];
  
  // Configuration du formulaire
  const form = useForm<QuestionnaireFormData>({
    resolver: zodResolver(nutritionalQuestionnaireSchema),
    defaultValues: {
      ...defaultQuestionnaireValues,
      name: settings.name || defaultQuestionnaireValues.name
    },
  });
  const formValues = form.getValues();
  const watchedFormValues = form.watch();
  
  // Calculer le programme nutritionnel chaque fois que les données du formulaire changent
  useEffect(() => {
    if (step === 4) { // Seulement à l'étape des résultats
      try {
        const program = calculateNutritionalProgram(watchedFormValues);
        setNutritionalProgram(program);
      } catch (error) {
        console.error("Erreur lors du calcul du programme nutritionnel:", error);
      }
    }
  }, [watchedFormValues, step]);
  
  // Lorsque les valeurs calculées changent
  const handleMacrosChange = (macros: CalculatedMacros) => {
    setCalculatedMacros(macros);
    setResultsCalculated(true);
  };
  
  // Lorsque les macros sont ajustées dans le suivi hebdomadaire
  const handleMacrosAdjustment = (macros: CalculatedMacros) => {
    setCalculatedMacros(macros);
    
    // Mettre à jour également le programme nutritionnel
    if (nutritionalProgram) {
      setNutritionalProgram({
        ...nutritionalProgram,
        goal: macros
      });
    }
  };
  
  // Fonction pour refaire le questionnaire
  const handleRestartQuestionnaire = () => {
    form.reset(defaultQuestionnaireValues);
    setStep(0);
    setResultsCalculated(false);
    setCalculatedMacros(null);
    setNutritionalProgram(null);
    
    toast({
      title: "Questionnaire réinitialisé",
      description: "Toutes les données ont été réinitialisées.",
      duration: 3000,
    });
  };
  
  // Fonction pour passer à l'étape suivante
  const onNextStep = async () => {
    // Si nous ne sommes pas à la dernière étape, avancer
    if (step < steps.length - 1) {
      // Valider les champs de l'étape actuelle
      const isValid = await form.trigger();
      if (isValid) {
        setStep(step + 1);
      }
    } else {
      // Nous sommes à la dernière étape, ouvrir la boîte de dialogue de confirmation
      if (calculatedMacros && calculatedMacros.calories > 0) {
        setShowConfirmDialog(true);
      } else {
        toast({
          title: "Erreur de calcul",
          description: "Impossible de calculer vos besoins nutritionnels. Veuillez vérifier vos données.",
          variant: "destructive",
        });
      }
    }
  };
  
  // Fonction pour revenir à l'étape précédente
  const onPrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  // Fonction pour sauvegarder les paramètres
  const onSaveSettings = () => {
    if (calculatedMacros && calculatedMacros.calories > 0) {
      // Mise à jour des objectifs macros dans les paramètres utilisateur
      updateSettings({
        name: watchedFormValues.name,
        macroTargets: {
          calories: calculatedMacros.calories,
          protein: calculatedMacros.protein,
          fat: calculatedMacros.fat,
          carbs: calculatedMacros.carbs,
        }
      });
      
      setShowConfirmDialog(false);
      
      toast({
        title: "Programme nutritionnel mis à jour",
        description: "Vos objectifs nutritionnels ont été enregistrés avec succès.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les valeurs. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pb-4">
      {/* En-tête avec indicateur de progression */}
      {!resultsCalculated && (
        <QuestionnaireHeader 
          currentStep={step} 
          totalSteps={steps.length} 
          stepNames={steps} 
        />
      )}
      
      {/* Contenu du formulaire */}
      <Form {...form}>
        <form className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={step} 
              className="min-h-[300px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepRenderer
                step={step}
                form={form}
                formValues={watchedFormValues}
                nutritionalProgram={nutritionalProgram}
                onMacrosChange={handleMacrosChange}
                onMacrosAdjustment={handleMacrosAdjustment}
                resultsCalculated={resultsCalculated}
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Boutons de navigation */}
          {!resultsCalculated && (
            <QuestionnaireNavigation
              currentStep={step}
              totalSteps={steps.length}
              onPrevStep={onPrevStep}
              onNextStep={onNextStep}
              isLastStep={step === steps.length - 1}
            />
          )}
          
          {/* Bouton pour refaire le questionnaire (visible seulement après calcul) */}
          {resultsCalculated && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleRestartQuestionnaire}
                className="px-6 py-2 bg-calfit-blue text-white rounded-md hover:bg-calfit-blue/80 transition-colors"
              >
                Refaire le questionnaire
              </button>
            </div>
          )}
        </form>
      </Form>
      
      {/* Dialogue de confirmation */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        calculatedMacros={calculatedMacros}
        onConfirm={onSaveSettings}
      />
    </div>
  );
};

export default NutritionalQuestionnaire;
