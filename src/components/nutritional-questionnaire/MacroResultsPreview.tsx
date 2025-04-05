
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionnaireFormData, CalculatedMacros, NutritionalProgram } from './types';
import { calculateNutritionalProgram, getNutritionalGoalLabel, generateInitialWeeklyProgress } from './utils';
import CalorieCalculationPreview from './CalorieCalculationPreview';
import MacroProgressBar from '@/components/ui/MacroProgressBar';
import { Progress } from "@/components/ui/progress";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MacroResultsPreviewProps {
  formData: QuestionnaireFormData;
  onMacrosChange: (macros: CalculatedMacros) => void;
  customizable?: boolean;
}

export const MacroResultsPreview: React.FC<MacroResultsPreviewProps> = ({ 
  formData, 
  onMacrosChange,
  customizable = false 
}) => {
  const [nutritionalProgram, setNutritionalProgram] = useState<NutritionalProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [customMacros, setCustomMacros] = useState<CalculatedMacros | null>(null);
  const [editMode, setEditMode] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Calculer les macros chaque fois que les données du formulaire changent
  useEffect(() => {
    // Ajouter un délai pour l'effet de chargement
    setLoading(true);
    
    try {
      const program = calculateNutritionalProgram(formData);
      setNutritionalProgram(program);
      
      // Initialiser les macros personnalisées avec les valeurs calculées
      if (!customMacros) {
        setCustomMacros(program.goal);
      }
      
      // Notifier le parent des nouvelles valeurs macro calculées
      if (program && program.goal) {
        onMacrosChange(program.goal);
      }
    } catch (error) {
      console.error("Erreur lors du calcul des macros:", error);
    } finally {
      setLoading(false);
    }
    
  }, [formData, onMacrosChange]);
  
  // Fonction pour formater les nombres avec des espaces pour les milliers
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  // Fonction pour mettre à jour les macros personnalisées
  const handleMacroChange = (type: 'calories' | 'protein' | 'fat' | 'carbs', value: number) => {
    if (!customMacros) return;
    
    // Créer une copie des macros actuelles
    const newMacros = { ...customMacros };
    
    // Mettre à jour la valeur spécifique
    newMacros[type] = value;
    
    // Si les calories sont modifiées, ajuster la répartition des macronutriments proportionnellement
    if (type === 'calories') {
      const ratio = value / customMacros.calories;
      newMacros.protein = Math.round(customMacros.protein * ratio);
      newMacros.fat = Math.round(customMacros.fat * ratio);
      newMacros.carbs = Math.round(customMacros.carbs * ratio);
    } 
    // Si un macronutriment est modifié, ajuster les autres proportionnellement
    else {
      // Calculer les calories des macros
      const proteinCalories = newMacros.protein * 4;
      const fatCalories = newMacros.fat * 9;
      const carbsCalories = newMacros.carbs * 4;
      
      // Mettre à jour les calories totales
      newMacros.calories = proteinCalories + fatCalories + carbsCalories;
    }
    
    setCustomMacros(newMacros);
  };
  
  // Fonction pour calculer la répartition des macros en pourcentage
  const calculateMacroDistribution = (macros: CalculatedMacros) => {
    const totalCalories = macros.calories > 0 ? macros.calories : 1; // Éviter division par zéro
    const proteinCalories = macros.protein * 4;
    const fatCalories = macros.fat * 9;
    const carbsCalories = macros.carbs * 4;
    
    return {
      protein: Math.round((proteinCalories / totalCalories) * 100),
      fat: Math.round((fatCalories / totalCalories) * 100),
      carbs: Math.round((carbsCalories / totalCalories) * 100)
    };
  };
  
  // Fonction pour appliquer les modifications personnalisées
  const applyCustomMacros = () => {
    if (customMacros) {
      onMacrosChange(customMacros);
      
      setEditMode(false);
      
      toast({
        title: "Modifications appliquées",
        description: "Vos objectifs nutritionnels personnalisés ont été appliqués.",
        duration: 3000,
      });
    }
  };
  
  // Fonction pour réinitialiser les macros personnalisés
  const resetCustomMacros = () => {
    if (nutritionalProgram) {
      setCustomMacros(nutritionalProgram.goal);
      
      toast({
        title: "Macros réinitialisées",
        description: "Les valeurs ont été réinitialisées aux calculs originaux.",
        duration: 3000,
      });
    }
  };
  
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[300px] space-y-4"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-calfit-blue"></div>
        <p className="text-muted-foreground">Calcul en cours...</p>
      </motion.div>
    );
  }
  
  if (!nutritionalProgram) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Impossible de calculer les besoins nutritionnels. Veuillez vérifier vos données.</p>
      </div>
    );
  }
  
  const { maintenance, goal, macroDistribution, lbm, bmr } = nutritionalProgram;
  const initialProgress = generateInitialWeeklyProgress(formData);
  
  // Utiliser les macros personnalisées si disponibles, sinon utiliser celles calculées
  const displayMacros = customMacros || goal;
  const displayDistribution = calculateMacroDistribution(displayMacros);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold">
        {customizable 
          ? "Votre programme nutritionnel personnalisé" 
          : "Aperçu de votre programme nutritionnel"}
      </h2>
      
      {/* Section des informations personnelles */}
      <Card className="bg-card border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-calfit-blue">
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Nom</p>
              <p className="font-semibold">{formData.name || "Non spécifié"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Âge</p>
              <p className="font-semibold">{formData.age} ans</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Sexe</p>
              <p className="font-semibold">{formData.sex === 'male' ? 'Homme' : 'Femme'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Taille</p>
              <p className="font-semibold">{formData.height} cm</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Poids actuel</p>
              <p className="font-semibold">{formData.currentWeight} kg</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Poids cible</p>
              <p className="font-semibold">{formData.targetWeight} kg</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">% Graisse</p>
              <p className="font-semibold">{formData.bodyFatPercentage}%</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Masse maigre estimée</p>
              <p className="font-semibold">{lbm ? lbm.toFixed(1) : 'N/A'} kg</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date de début</p>
              <p className="font-semibold">{format(formData.startDate, 'dd/MM/yyyy', { locale: fr })}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Section des calculs métaboliques */}
      <Card className="bg-card border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-calfit-blue">
            Calculs métaboliques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Métabolisme de base (BMR)</p>
                <p className="font-semibold">{bmr ? formatNumber(bmr) : 'N/A'} kcal</p>
                <p className="text-xs text-muted-foreground">Formule Harris-Benedict révisée</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Maintenance (MMR)</p>
                <p className="font-semibold">{formatNumber(maintenance.calories)} kcal</p>
                <p className="text-xs text-muted-foreground">Niveau d'activité: Modéré (×1.5)</p>
              </div>
            </div>
            <div className="mt-2 text-sm bg-calfit-blue/10 p-2 rounded">
              <p>Votre MMR est calculé avec un niveau d'activité 'Modéré (1.5)', correspondant à une activité physique normale.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Section du programme nutritionnel */}
      <Card className="bg-card border-0 shadow-sm">
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-semibold text-calfit-blue">
            Programme : {getNutritionalGoalLabel(formData.nutritionalGoal)}
          </CardTitle>
          {customizable && (
            <div>
              {!editMode ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="text-calfit-blue border-calfit-blue hover:bg-calfit-blue hover:text-white"
                >
                  Personnaliser
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetCustomMacros}
                    className="text-gray-500 border-gray-300"
                  >
                    Réinitialiser
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={applyCustomMacros}
                    className="bg-calfit-blue hover:bg-calfit-blue/80"
                  >
                    Appliquer
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Tableau comparatif des calories */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-calfit-blue/10">
                    <th className="border p-2 text-left">Calories</th>
                    <th className="border p-2 text-right">Maintenance</th>
                    <th className="border p-2 text-right">Objectif</th>
                    <th className="border p-2 text-right">Différence</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 font-medium">Calories journalières</td>
                    <td className="border p-2 text-right">{formatNumber(maintenance.calories)} kcal</td>
                    <td className="border p-2 text-right font-semibold">{formatNumber(displayMacros.calories)} kcal</td>
                    <td className="border p-2 text-right">
                      <span className={displayMacros.calories >= maintenance.calories ? "text-green-500" : "text-red-500"}>
                        {displayMacros.calories >= maintenance.calories ? '+' : ''}{formatNumber(displayMacros.calories - maintenance.calories)} kcal
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Section d'édition personnalisée - uniquement visible en mode édition */}
            {editMode && customizable && customMacros && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-6 my-4">
                <h3 className="text-md font-semibold mb-4">Personnalisation des objectifs</h3>
                
                <div className="space-y-6">
                  {/* Calories */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Calories: {customMacros.calories} kcal</label>
                      <span className="text-xs text-calfit-blue">
                        Différence: {customMacros.calories - maintenance.calories > 0 ? '+' : ''}
                        {customMacros.calories - maintenance.calories} kcal
                      </span>
                    </div>
                    <Slider
                      value={[customMacros.calories]}
                      min={Math.max(1000, Math.round(maintenance.calories * 0.65))}
                      max={Math.round(maintenance.calories * 1.35)}
                      step={10}
                      onValueChange={(values) => handleMacroChange('calories', values[0])}
                      className="my-4"
                    />
                  </div>
                  
                  {/* Protéines */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-[#E74C3C]">Protéines: {customMacros.protein} g</label>
                      <span className="text-xs">{Math.round((customMacros.protein * 4 / customMacros.calories) * 100)}% des calories</span>
                    </div>
                    <Slider
                      value={[customMacros.protein]}
                      min={Math.max(40, Math.round(customMacros.protein * 0.7))}
                      max={Math.round(customMacros.protein * 1.3)}
                      step={1}
                      onValueChange={(values) => handleMacroChange('protein', values[0])}
                      className="my-4"
                    />
                  </div>
                  
                  {/* Lipides */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-[#F1C40F]">Lipides: {customMacros.fat} g</label>
                      <span className="text-xs">{Math.round((customMacros.fat * 9 / customMacros.calories) * 100)}% des calories</span>
                    </div>
                    <Slider
                      value={[customMacros.fat]}
                      min={Math.max(20, Math.round(customMacros.fat * 0.7))}
                      max={Math.round(customMacros.fat * 1.3)}
                      step={1}
                      onValueChange={(values) => handleMacroChange('fat', values[0])}
                      className="my-4"
                    />
                  </div>
                  
                  {/* Glucides */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-[#3498DB]">Glucides: {customMacros.carbs} g</label>
                      <span className="text-xs">{Math.round((customMacros.carbs * 4 / customMacros.calories) * 100)}% des calories</span>
                    </div>
                    <Slider
                      value={[customMacros.carbs]}
                      min={Math.max(50, Math.round(customMacros.carbs * 0.7))}
                      max={Math.round(customMacros.carbs * 1.3)}
                      step={1}
                      onValueChange={(values) => handleMacroChange('carbs', values[0])}
                      className="my-4"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Tableau des macronutriments */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-calfit-blue/10">
                    <th className="border p-2 text-left">Macronutriments</th>
                    <th className="border p-2 text-right">Pourcentage</th>
                    <th className="border p-2 text-right">Maintenance (g)</th>
                    <th className="border p-2 text-right">Objectif (g)</th>
                    <th className="border p-2 text-right">Calories</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 font-medium text-[#E74C3C]">Protéines</td>
                    <td className="border p-2 text-right">{displayDistribution.protein}%</td>
                    <td className="border p-2 text-right">{maintenance.protein} g</td>
                    <td className="border p-2 text-right font-semibold">{displayMacros.protein} g</td>
                    <td className="border p-2 text-right">{displayMacros.protein * 4} kcal</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-medium text-[#F1C40F]">Lipides</td>
                    <td className="border p-2 text-right">{displayDistribution.fat}%</td>
                    <td className="border p-2 text-right">{maintenance.fat} g</td>
                    <td className="border p-2 text-right font-semibold">{displayMacros.fat} g</td>
                    <td className="border p-2 text-right">{displayMacros.fat * 9} kcal</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-medium text-[#3498DB]">Glucides</td>
                    <td className="border p-2 text-right">{displayDistribution.carbs}%</td>
                    <td className="border p-2 text-right">{maintenance.carbs} g</td>
                    <td className="border p-2 text-right font-semibold">{displayMacros.carbs} g</td>
                    <td className="border p-2 text-right">{displayMacros.carbs * 4} kcal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Visualisation graphique */}
      <Card className="bg-card border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-calfit-blue">
            Visualisation des macros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Barres de progression */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold mb-2">Répartition en grammes</h3>
              <MacroProgressBar 
                label="Protéines" 
                current={displayMacros.protein} 
                target={displayMacros.protein} 
                color="bg-[#E74C3C]" 
                unit="g" 
              />
              <MacroProgressBar 
                label="Lipides" 
                current={displayMacros.fat} 
                target={displayMacros.fat} 
                color="bg-[#F1C40F]" 
                unit="g" 
              />
              <MacroProgressBar 
                label="Glucides" 
                current={displayMacros.carbs} 
                target={displayMacros.carbs} 
                color="bg-[#3498DB]" 
                unit="g" 
              />
            </div>
            
            {/* Graphique circulaire */}
            <div className="flex items-center justify-center">
              <div className="w-48 h-48">
                {/* Utilisation de react-circular-progressbar pour le graphique en camembert */}
                <div className="relative">
                  <div className="w-full h-full">
                    <CircularProgressbar
                      value={displayDistribution.protein}
                      text={`${displayDistribution.protein}%`}
                      styles={buildStyles({
                        rotation: 0,
                        strokeLinecap: 'butt',
                        textSize: '16px',
                        pathTransitionDuration: 0.5,
                        pathColor: '#E74C3C',
                        textColor: '#1A1F2C',
                        trailColor: '#d6d6d6',
                      })}
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full">
                    <CircularProgressbar
                      value={displayDistribution.fat}
                      text=""
                      styles={buildStyles({
                        rotation: displayDistribution.protein * 3.6,
                        strokeLinecap: 'butt',
                        pathTransitionDuration: 0.5,
                        pathColor: '#F1C40F',
                        trailColor: 'transparent',
                      })}
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full">
                    <CircularProgressbar
                      value={displayDistribution.carbs}
                      text=""
                      styles={buildStyles({
                        rotation: (displayDistribution.protein + displayDistribution.fat) * 3.6,
                        strokeLinecap: 'butt',
                        pathTransitionDuration: 0.5,
                        pathColor: '#3498DB',
                        trailColor: 'transparent',
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Légende du graphique */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#E74C3C] rounded-full mr-2"></div>
              <span className="text-sm">Protéines: {displayDistribution.protein}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#F1C40F] rounded-full mr-2"></div>
              <span className="text-sm">Lipides: {displayDistribution.fat}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#3498DB] rounded-full mr-2"></div>
              <span className="text-sm">Glucides: {displayDistribution.carbs}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Section de suivi initial */}
      <Card className="bg-card border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-calfit-blue">
            Date de prochaine vérification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <p className="text-sm">
              Pour suivre vos progrès, nous vous recommandons de vérifier votre poids et vos mesures dans:
            </p>
            <p className="text-xl font-bold">
              7 jours ({format(initialProgress.nextCheckDate, 'dd/MM/yyyy', { locale: fr })})
            </p>
            <p className="text-sm text-muted-foreground">
              Nous pourrons alors ajuster votre plan nutritionnel en fonction de vos résultats.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Section de résumé */}
      <div className="bg-calfit-blue/10 p-4 rounded-lg">
        <p className="text-sm text-center">
          Ce programme nutritionnel est basé sur vos données personnelles et vos objectifs. 
          Pour obtenir les meilleurs résultats, suivez ce plan et ajustez-le en fonction de vos progrès.
        </p>
      </div>
    </motion.div>
  );
};

// Fonction utilitaire pour traduire les niveaux d'activité
function activityLevelToFrench(level: string): string {
  const translations: Record<string, string> = {
    'sedentary': 'Sédentaire (×1.2)',
    'lightlyActive': 'Légèrement actif (×1.375)',
    'moderatelyActive': 'Modérément actif (×1.55)',
    'veryActive': 'Très actif (×1.725)',
    'superActive': 'Extrêmement actif (×1.9)'
  };
  
  return translations[level] || level;
}
