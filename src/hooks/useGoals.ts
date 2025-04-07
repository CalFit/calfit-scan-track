
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from '@/hooks/useUserSettings';
import { MacroTargets } from '@/hooks/useUserSettings';
import { useUserGoals } from './useUserGoals';
import { useAuth } from '@/contexts/auth';

// Interface pour les pourcentages de macros
interface MacroPercentages {
  protein: number;
  fat: number;
  carbs: number;
}

export function useGoals() {
  const { toast } = useToast();
  const { settings, updateSettings } = useUserSettings();
  const { user } = useAuth();
  const { goals, saveUserGoals } = useUserGoals();
  const [macroTargets, setMacroTargets] = useState<MacroTargets>(settings.macroTargets);
  const [percentages, setPercentages] = useState<MacroPercentages>({
    protein: 0,
    fat: 0,
    carbs: 0
  });
  const [originalValues, setOriginalValues] = useState<MacroTargets>(settings.macroTargets);
  const [hasChanges, setHasChanges] = useState(false);

  // Calculer les pourcentages initiaux
  useEffect(() => {
    // S'assurer que nous avons des données valides
    if (settings.macroTargets) {
      setMacroTargets(settings.macroTargets);
      setOriginalValues(settings.macroTargets);
      
      // Calculer les pourcentages initiaux
      calculatePercentagesFromGrams(settings.macroTargets);
    }
  }, [settings]);

  // Calcul des pourcentages à partir des grammes
  const calculatePercentagesFromGrams = (targets: MacroTargets) => {
    const proteinCalories = targets.protein * 4; // 4 calories par gramme de protéine
    const fatCalories = targets.fat * 9; // 9 calories par gramme de lipide
    const carbsCalories = targets.carbs * 4; // 4 calories par gramme de glucide
    
    const totalCalories = targets.calories || (proteinCalories + fatCalories + carbsCalories);
    
    if (totalCalories > 0) {
      setPercentages({
        protein: Math.round((proteinCalories / totalCalories) * 100),
        fat: Math.round((fatCalories / totalCalories) * 100),
        carbs: Math.round((carbsCalories / totalCalories) * 100)
      });
    }
  };

  // Calcul des grammes à partir des pourcentages
  const calculateGramsFromPercentages = (newPercentages: MacroPercentages, calories: number) => {
    return {
      calories,
      protein: Math.round((calories * newPercentages.protein / 100) / 4), // 4 calories par gramme de protéine
      fat: Math.round((calories * newPercentages.fat / 100) / 9), // 9 calories par gramme de lipide
      carbs: Math.round((calories * newPercentages.carbs / 100) / 4) // 4 calories par gramme de glucide
    };
  };

  // Mise à jour des calories et recalcul des grammes
  const handleCaloriesChange = (newCalories: number) => {
    const newTargets = {
      ...macroTargets,
      calories: newCalories
    };

    // Recalculer les grammes en fonction des pourcentages actuels
    if (percentages.protein + percentages.fat + percentages.carbs === 100) {
      const newMacros = calculateGramsFromPercentages(percentages, newCalories);
      setMacroTargets(newMacros);
      setHasChanges(true);
    } else {
      setMacroTargets(newTargets);
      setHasChanges(true);
      // Recalculer les pourcentages si nécessaire
      calculatePercentagesFromGrams(newTargets);
    }
  };

  // Mise à jour d'un macronutriment en grammes
  const handleGramChange = (macro: keyof MacroTargets, value: number) => {
    if (macro === 'calories') {
      handleCaloriesChange(value);
      return;
    }

    const newTargets = {
      ...macroTargets,
      [macro]: value
    };

    setMacroTargets(newTargets);
    setHasChanges(true);
    
    // Recalculer les pourcentages
    calculatePercentagesFromGrams(newTargets);
  };

  // Mise à jour d'un pourcentage de macronutriment
  const handlePercentChange = (macro: keyof MacroPercentages, value: number) => {
    // Calculer combien de pourcentage nous devons redistribuer
    const currentTotal = percentages.protein + percentages.fat + percentages.carbs;
    const difference = value - percentages[macro];
    
    // Nouvelles valeurs de pourcentage
    let newPercentages = { ...percentages };
    newPercentages[macro] = value;
    
    // Redistribuer la différence proportionnellement entre les autres macros
    const otherMacros = Object.keys(percentages).filter(m => m !== macro) as Array<keyof MacroPercentages>;
    const totalOtherPercentages = otherMacros.reduce((total, m) => total + percentages[m], 0);
    
    if (totalOtherPercentages > 0) {
      otherMacros.forEach(m => {
        const ratio = percentages[m] / totalOtherPercentages;
        newPercentages[m] = Math.max(0, Math.round(percentages[m] - (difference * ratio)));
      });
    }
    
    // Ajuster pour s'assurer que le total est 100%
    const newTotal = Object.values(newPercentages).reduce((sum, val) => sum + val, 0);
    if (newTotal !== 100) {
      // Ajuster le dernier macro pour atteindre 100%
      const lastMacro = otherMacros[otherMacros.length - 1];
      newPercentages[lastMacro] += (100 - newTotal);
    }
    
    setPercentages(newPercentages);
    
    // Recalculer les grammes basés sur les nouveaux pourcentages
    const newTargets = calculateGramsFromPercentages(newPercentages, macroTargets.calories);
    setMacroTargets(newTargets);
    setHasChanges(true);
  };

  // Sauvegarder les changements
  const saveChanges = async () => {
    // Mettre à jour les paramètres locaux et dans Supabase si connecté
    const success = await updateSettings({ macroTargets });
    if (success) {
      // Si l'utilisateur est connecté, sauvegarder également dans Supabase
      if (user) {
        await saveUserGoals(macroTargets);
      }
      
      setOriginalValues(macroTargets);
      setHasChanges(false);
      
      toast({
        title: "Objectifs sauvegardés",
        description: "Vos objectifs nutritionnels ont été mis à jour.",
      });
    }
  };

  // Réinitialiser aux valeurs d'origine
  const resetToOriginal = () => {
    setMacroTargets(originalValues);
    calculatePercentagesFromGrams(originalValues);
    setHasChanges(false);
    
    toast({
      title: "Objectifs réinitialisés",
      description: "Vos objectifs nutritionnels ont été réinitialisés aux valeurs calculées.",
    });
  };

  return {
    macroTargets,
    percentages,
    hasChanges,
    handleGramChange,
    handlePercentChange,
    handleCaloriesChange,
    saveChanges,
    resetToOriginal
  };
}
