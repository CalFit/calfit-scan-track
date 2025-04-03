
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { 
  BasicInfoStep, 
  GoalsActivityStep, 
  DietPreferencesStep,
  AllergiesPreferencesStep 
} from './NutritionalFormSteps';
import { MacroResultsPreview } from './MacroResultsPreview';
import { QuestionnaireFormData, CalculatedMacros } from './types';
import { nutritionalQuestionnaireSchema, defaultQuestionnaireValues } from './nutritionalQuestionnaireSchema';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const NutritionalQuestionnaire: React.FC = () => {
  const [step, setStep] = useState(0);
  const [calculatedMacros, setCalculatedMacros] = useState<CalculatedMacros | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { settings, updateSettings } = useUserSettings();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const steps = ["Informations de base", "Activité & Objectifs", "Préférences alimentaires", "Allergies", "Résultats"];
  
  const form = useForm<QuestionnaireFormData>({
    resolver: zodResolver(nutritionalQuestionnaireSchema),
    defaultValues: defaultQuestionnaireValues,
  });
  
  const watchedFormValues = form.watch();
  
  // Lorsque les valeurs calculées changent
  const handleMacrosChange = (macros: CalculatedMacros) => {
    console.log("Nouveaux macros calculés:", macros);
    setCalculatedMacros(macros);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <BasicInfoStep form={form} />;
      case 1:
        return <GoalsActivityStep form={form} />;
      case 2:
        return <DietPreferencesStep form={form} />;
      case 3:
        return <AllergiesPreferencesStep form={form} />;
      case 4:
        return <MacroResultsPreview formData={watchedFormValues} onMacrosChange={handleMacrosChange} />;
      default:
        return null;
    }
  };
  
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
  
  const onPrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const onSaveSettings = () => {
    if (calculatedMacros && calculatedMacros.calories > 0) {
      // Mise à jour des objectifs macros dans les paramètres utilisateur
      updateSettings({
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
      <div className={cn(
        "mb-6",
        isMobile ? "mb-4" : "mb-6"
      )}>
        <div className="flex justify-between items-center mb-2">
          <h2 className={cn(
            "font-semibold text-calfit-blue",
            isMobile ? "text-base" : "text-lg"
          )}>
            Étape {step + 1} sur {steps.length}
          </h2>
          <span className={cn(
            "text-muted-foreground",
            isMobile ? "text-xs" : "text-sm"
          )}>
            {steps[step]}
          </span>
        </div>
        
        {/* Barre de progression */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-calfit-blue h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Indicateurs d'étapes */}
        <div className="flex justify-between mt-1">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={cn(
                "flex-1 text-center",
                index <= step ? "text-calfit-blue" : "text-gray-400",
                isMobile ? "text-[10px]" : "text-xs"
              )}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      
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
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
          
          {/* Boutons de navigation */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevStep}
              disabled={step === 0}
              className={cn(
                "flex items-center",
                isMobile ? "text-sm px-3 py-1.5" : ""
              )}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Précédent
            </Button>
            
            <Button
              type="button"
              onClick={onNextStep}
              className={cn(
                "flex items-center",
                isMobile ? "text-sm px-3 py-1.5" : ""
              )}
            >
              {step < steps.length - 1 ? (
                <>
                  Suivant <ChevronRight className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Enregistrer <Check className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
      
      {/* Dialogue de confirmation */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer vos objectifs nutritionnels</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir mettre à jour vos objectifs nutritionnels avec les valeurs suivantes ?
            </DialogDescription>
          </DialogHeader>
          
          {calculatedMacros && (
            <div className="py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Calories</span>
                <span>{calculatedMacros.calories} kcal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Protéines</span>
                <span>{calculatedMacros.protein} g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Lipides</span>
                <span>{calculatedMacros.fat} g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Glucides</span>
                <span>{calculatedMacros.carbs} g</span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Annuler
            </Button>
            <Button onClick={onSaveSettings}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NutritionalQuestionnaire;
