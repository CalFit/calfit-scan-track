
import React, { useEffect, useState } from 'react';
import { CalculatedMacros, QuestionnaireFormData } from './types';
import { calculateMacros } from './utils';
import CircularMacroGauge from '@/components/ui/CircularMacroGauge';
import MacroProgressBar from '@/components/ui/MacroProgressBar';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Slider } from "@/components/ui/slider";

interface MacroResultsPreviewProps {
  formData: QuestionnaireFormData;
  onMacrosChange: (macros: CalculatedMacros) => void;
}

export const MacroResultsPreview: React.FC<MacroResultsPreviewProps> = ({ 
  formData, 
  onMacrosChange 
}) => {
  const [macros, setMacros] = useState<CalculatedMacros>({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });
  
  const [proteinPercentage, setProteinPercentage] = useState(30);
  const [fatPercentage, setFatPercentage] = useState(30);
  const [carbsPercentage, setCarbsPercentage] = useState(40);
  const [isCalculating, setIsCalculating] = useState(true);
  
  const isMobile = useIsMobile();
  
  // Calcul initial des macros basé sur les données du formulaire
  useEffect(() => {
    setIsCalculating(true);
    
    try {
      const calculatedMacros = calculateMacros(formData);
      
      if (calculatedMacros && calculatedMacros.calories > 0) {
        setMacros(calculatedMacros);
        
        // Calculer les pourcentages initiaux
        const proteinCals = Math.round((calculatedMacros.protein * 4 / calculatedMacros.calories) * 100);
        const fatCals = Math.round((calculatedMacros.fat * 9 / calculatedMacros.calories) * 100);
        const carbsCals = 100 - proteinCals - fatCals;
        
        setProteinPercentage(proteinCals);
        setFatPercentage(fatCals);
        setCarbsPercentage(carbsCals);
        
        // Informer le parent des macros calculées
        onMacrosChange(calculatedMacros);
      }
    } catch (error) {
      console.error("Erreur lors du calcul des macros:", error);
    } finally {
      setIsCalculating(false);
    }
  }, [formData, onMacrosChange]);
  
  // Mettre à jour les macros lorsque les pourcentages changent
  useEffect(() => {
    if (isCalculating || macros.calories <= 0) return;
    
    // Assurons-nous que les pourcentages totalisent 100%
    const total = proteinPercentage + fatPercentage + carbsPercentage;
    if (Math.abs(total - 100) > 1) return; // Tolérance de 1% pour les erreurs d'arrondi
    
    // Calculer les macros en fonction des pourcentages
    const calories = macros.calories; // On garde les calories calculées
    const protein = Math.round((calories * proteinPercentage / 100) / 4);
    const fat = Math.round((calories * fatPercentage / 100) / 9);
    const carbs = Math.round((calories * carbsPercentage / 100) / 4);
    
    const newMacros = { calories, protein, fat, carbs };
    setMacros(newMacros);
    onMacrosChange(newMacros);
  }, [proteinPercentage, fatPercentage, carbsPercentage, macros.calories, onMacrosChange, isCalculating]);

  // Ajuster les pourcentages de manière à ce que leur somme soit toujours 100%
  const adjustPercentages = (type: 'protein' | 'fat' | 'carbs', value: number) => {
    let newProtein = proteinPercentage;
    let newFat = fatPercentage;
    let newCarbs = carbsPercentage;
    
    if (type === 'protein') {
      newProtein = value;
      // Ajuster les autres proportionnellement
      const remaining = 100 - value;
      const oldSum = fatPercentage + carbsPercentage;
      if (oldSum > 0) {
        newFat = Math.round(fatPercentage / oldSum * remaining);
        newCarbs = 100 - newProtein - newFat;
      }
    } else if (type === 'fat') {
      newFat = value;
      // Ajuster les autres proportionnellement
      const remaining = 100 - value;
      const oldSum = proteinPercentage + carbsPercentage;
      if (oldSum > 0) {
        newProtein = Math.round(proteinPercentage / oldSum * remaining);
        newCarbs = 100 - newProtein - newFat;
      }
    } else if (type === 'carbs') {
      newCarbs = value;
      // Ajuster les autres proportionnellement
      const remaining = 100 - value;
      const oldSum = proteinPercentage + fatPercentage;
      if (oldSum > 0) {
        newProtein = Math.round(proteinPercentage / oldSum * remaining);
        newFat = 100 - newProtein - newCarbs;
      }
    }
    
    setProteinPercentage(newProtein);
    setFatPercentage(newFat);
    setCarbsPercentage(newCarbs);
  };

  if (isCalculating) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-pulse text-center">
          <p>Calcul en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold mb-4">Aperçu de vos besoins nutritionnels</h2>
      
      <Card className={cn(
        "p-4 border-2 border-calfit-blue/30 shadow-lg",
        isMobile ? "p-3" : "p-4"
      )}>
        <div className="text-center mb-4">
          <h3 className={cn(
            "font-bold text-calfit-blue",
            isMobile ? "text-lg" : "text-xl"
          )}>
            Besoins caloriques estimés
          </h3>
          <p className={cn(
            "font-semibold",
            isMobile ? "text-2xl" : "text-3xl"
          )}>
            {macros.calories > 0 ? macros.calories : "-"} kcal
          </p>
          <p className="text-sm text-muted-foreground">par jour</p>
        </div>
        
        <div className={cn(
          "flex justify-center items-center gap-2 flex-wrap mb-6",
          isMobile ? "gap-1" : "gap-3"
        )}>
          <CircularMacroGauge 
            label="Protéines" 
            current={macros.protein} 
            target={macros.protein} 
            color="bg-[#E74C3C]" 
            unit="g"
            smallSize={isMobile}
          />
          <CircularMacroGauge 
            label="Lipides" 
            current={macros.fat} 
            target={macros.fat} 
            color="bg-[#F1C40F]" 
            unit="g"
            smallSize={isMobile}
          />
          <CircularMacroGauge 
            label="Glucides" 
            current={macros.carbs} 
            target={macros.carbs} 
            color="bg-[#3498DB]" 
            unit="g"
            smallSize={isMobile}
          />
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium mb-2">Ajustez la répartition des macronutriments</h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium flex items-center">
                  <span className="h-3 w-3 rounded-full bg-[#E74C3C] inline-block mr-2"></span>
                  Protéines: {proteinPercentage}%
                </label>
                <span className="text-xs text-muted-foreground">{macros.protein}g</span>
              </div>
              <Slider
                value={[proteinPercentage]}
                min={10}
                max={60}
                step={1}
                onValueChange={(value) => adjustPercentages('protein', value[0])}
                className="protein-slider"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium flex items-center">
                  <span className="h-3 w-3 rounded-full bg-[#F1C40F] inline-block mr-2"></span>
                  Lipides: {fatPercentage}%
                </label>
                <span className="text-xs text-muted-foreground">{macros.fat}g</span>
              </div>
              <Slider
                value={[fatPercentage]}
                min={10}
                max={70}
                step={1}
                onValueChange={(value) => adjustPercentages('fat', value[0])}
                className="fat-slider"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium flex items-center">
                  <span className="h-3 w-3 rounded-full bg-[#3498DB] inline-block mr-2"></span>
                  Glucides: {carbsPercentage}%
                </label>
                <span className="text-xs text-muted-foreground">{macros.carbs}g</span>
              </div>
              <Slider
                value={[carbsPercentage]}
                min={5}
                max={70}
                step={1}
                onValueChange={(value) => adjustPercentages('carbs', value[0])}
                className="carbs-slider"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <h4 className="font-medium mb-2">Répartition calorique</h4>
            <div className="h-6 w-full rounded-full overflow-hidden flex">
              <div 
                className="bg-[#E74C3C] h-full" 
                style={{ width: `${proteinPercentage}%` }}
                title={`Protéines: ${proteinPercentage}%`}
              ></div>
              <div 
                className="bg-[#F1C40F] h-full" 
                style={{ width: `${fatPercentage}%` }}
                title={`Lipides: ${fatPercentage}%`}
              ></div>
              <div 
                className="bg-[#3498DB] h-full" 
                style={{ width: `${carbsPercentage}%` }}
                title={`Glucides: ${carbsPercentage}%`}
              ></div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
