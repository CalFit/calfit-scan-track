
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionnaireFormData, CalculatedMacros, NutritionalProgram } from './types';
import { calculateNutritionalProgram, getNutritionalGoalLabel } from './utils';
import MacroProgressBar from '@/components/ui/MacroProgressBar';
import { Progress } from "@/components/ui/progress";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MacroResultsPreviewProps {
  formData: QuestionnaireFormData;
  onMacrosChange: (macros: CalculatedMacros) => void;
}

export const MacroResultsPreview: React.FC<MacroResultsPreviewProps> = ({ formData, onMacrosChange }) => {
  const [nutritionalProgram, setNutritionalProgram] = useState<NutritionalProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Calculer les macros chaque fois que les données du formulaire changent
  useEffect(() => {
    // Ajouter un délai pour l'effet de chargement
    setLoading(true);
    
    try {
      const program = calculateNutritionalProgram(formData);
      setNutritionalProgram(program);
      
      // Notifier le parent des nouvelles valeurs macro calculées
      if (program && program.goal) {
        onMacrosChange(program.goal);
      }
    } catch (error) {
      console.error("Erreur lors du calcul des macros:", error);
    } finally {
      setLoading(false);
    }
    
  }, [formData]);
  
  // Fonction pour formater les nombres avec des espaces pour les milliers
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
  
  const { maintenance, goal, macroDistribution } = nutritionalProgram;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold">Aperçu de votre programme nutritionnel</h2>
      
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
            
            {formData.bodyFatPercentage && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">% Graisse</p>
                <p className="font-semibold">{formData.bodyFatPercentage}%</p>
              </div>
            )}
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date de début</p>
              <p className="font-semibold">{format(formData.startDate, 'dd/MM/yyyy', { locale: fr })}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Section du programme nutritionnel */}
      <Card className="bg-card border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-calfit-blue">
            Programme : {getNutritionalGoalLabel(formData.nutritionalGoal)}
          </CardTitle>
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
                    <td className="border p-2 text-right font-semibold">{formatNumber(goal.calories)} kcal</td>
                    <td className="border p-2 text-right">
                      <span className={goal.calories >= maintenance.calories ? "text-green-500" : "text-red-500"}>
                        {goal.calories >= maintenance.calories ? '+' : ''}{formatNumber(goal.calories - maintenance.calories)} kcal
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Tableau des macronutriments */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-calfit-blue/10">
                    <th className="border p-2 text-left">Macronutriments</th>
                    <th className="border p-2 text-right">Pourcentage</th>
                    <th className="border p-2 text-right">Grammes</th>
                    <th className="border p-2 text-right">Calories</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 font-medium text-[#E74C3C]">Protéines</td>
                    <td className="border p-2 text-right">{macroDistribution.protein}%</td>
                    <td className="border p-2 text-right font-semibold">{goal.protein} g</td>
                    <td className="border p-2 text-right">{goal.protein * 4} kcal</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-medium text-[#F1C40F]">Lipides</td>
                    <td className="border p-2 text-right">{macroDistribution.fat}%</td>
                    <td className="border p-2 text-right font-semibold">{goal.fat} g</td>
                    <td className="border p-2 text-right">{goal.fat * 9} kcal</td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-medium text-[#3498DB]">Glucides</td>
                    <td className="border p-2 text-right">{macroDistribution.carbs}%</td>
                    <td className="border p-2 text-right font-semibold">{goal.carbs} g</td>
                    <td className="border p-2 text-right">{goal.carbs * 4} kcal</td>
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
                current={goal.protein} 
                target={goal.protein} 
                color="bg-[#E74C3C]" 
                unit="g" 
              />
              <MacroProgressBar 
                label="Lipides" 
                current={goal.fat} 
                target={goal.fat} 
                color="bg-[#F1C40F]" 
                unit="g" 
              />
              <MacroProgressBar 
                label="Glucides" 
                current={goal.carbs} 
                target={goal.carbs} 
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
                      value={macroDistribution.protein}
                      text={`${macroDistribution.protein}%`}
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
                      value={macroDistribution.fat}
                      text=""
                      styles={buildStyles({
                        rotation: macroDistribution.protein * 3.6,
                        strokeLinecap: 'butt',
                        pathTransitionDuration: 0.5,
                        pathColor: '#F1C40F',
                        trailColor: 'transparent',
                      })}
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full">
                    <CircularProgressbar
                      value={macroDistribution.carbs}
                      text=""
                      styles={buildStyles({
                        rotation: (macroDistribution.protein + macroDistribution.fat) * 3.6,
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
              <span className="text-sm">Protéines: {macroDistribution.protein}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#F1C40F] rounded-full mr-2"></div>
              <span className="text-sm">Lipides: {macroDistribution.fat}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#3498DB] rounded-full mr-2"></div>
              <span className="text-sm">Glucides: {macroDistribution.carbs}%</span>
            </div>
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
