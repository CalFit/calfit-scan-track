
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { NutritionalProgram, WeeklyProgress, CalculatedMacros } from './types';
import WeeklyProgressForm from './WeeklyProgressForm';
import { generateInitialWeeklyProgress } from './utils';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { QuestionnaireFormData } from './types';

interface ProgressTrackerProps {
  formData: QuestionnaireFormData;
  nutritionalProgram: NutritionalProgram;
  onMacrosAdjustment: (macros: CalculatedMacros) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  formData, 
  nutritionalProgram, 
  onMacrosAdjustment 
}) => {
  const { toast } = useToast();
  const { settings, updateSettings } = useUserSettings();
  
  // État pour stocker l'historique des suivis hebdomadaires
  const [weeklyProgresses, setWeeklyProgresses] = useState<WeeklyProgress[]>([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Initialiser avec un premier suivi basé sur les données du formulaire
  useEffect(() => {
    if (weeklyProgresses.length === 0) {
      const initialProgress = generateInitialWeeklyProgress(formData);
      setWeeklyProgresses([initialProgress]);
    }
  }, [formData]);
  
  // Gérer l'enregistrement d'un nouveau suivi hebdomadaire
  const handleProgressSaved = (progress: WeeklyProgress, adjustedMacros: CalculatedMacros | null) => {
    // Ajouter le nouveau suivi à l'historique
    setWeeklyProgresses(prev => [...prev, progress]);
    
    // Si des macros ajustés sont fournis, les mettre à jour dans l'application
    if (adjustedMacros) {
      onMacrosAdjustment(adjustedMacros);
      
      // Mettre à jour les paramètres utilisateur avec les nouvelles valeurs macro
      updateSettings({
        ...settings,
        macroTargets: {
          calories: adjustedMacros.calories,
          protein: adjustedMacros.protein,
          fat: adjustedMacros.fat,
          carbs: adjustedMacros.carbs
        }
      });
      
      toast({
        title: "Macros ajustées",
        description: "Vos objectifs nutritionnels ont été mis à jour en fonction de vos progrès.",
        duration: 3000,
      });
    }
    
    // Passer à la vue de l'historique
    setActiveTab("history");
  };
  
  // Générer un PDF avec les données de suivi
  const handleExportToPDF = () => {
    toast({
      title: "Export PDF",
      description: "La fonctionnalité d'export PDF sera disponible prochainement.",
      duration: 3000,
    });
    // Note: l'implémentation réelle de l'export PDF nécessiterait l'ajout d'une bibliothèque comme jsPDF
  };
  
  // Afficher le suivi de la semaine suivante ou précédente
  const handleNavigateWeek = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentWeekIndex < weeklyProgresses.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    } else if (direction === 'prev' && currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };
  
  const currentProgress = weeklyProgresses[currentWeekIndex];
  const lastProgress = weeklyProgresses[weeklyProgresses.length - 1];
  const newWeekNumber = lastProgress ? lastProgress.week + 1 : 1;
  
  return (
    <div className="space-y-6">
      <Card className="bg-card border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-calfit-blue">
            Suivi de progression
          </CardTitle>
          <CardDescription>
            Suivez votre évolution physique et ajustez votre programme nutritionnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="new">Nouveau suivi</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>
            
            {/* Onglet aperçu */}
            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-md font-semibold">Résumé de votre progression</h3>
                
                {weeklyProgresses.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-calfit-blue/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Poids de départ</p>
                        <p className="text-xl font-semibold">{formData.currentWeight} kg</p>
                      </div>
                      
                      <div className="p-4 bg-calfit-blue/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Poids actuel</p>
                        <p className="text-xl font-semibold">{lastProgress?.weight || formData.currentWeight} kg</p>
                      </div>
                      
                      <div className="p-4 bg-calfit-blue/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Poids cible</p>
                        <p className="text-xl font-semibold">{formData.targetWeight} kg</p>
                      </div>
                      
                      <div className="p-4 bg-calfit-blue/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Prochain suivi</p>
                        <p className="text-xl font-semibold">{lastProgress ? format(lastProgress.nextCheckDate, 'dd/MM', { locale: fr }) : 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={() => setActiveTab("new")} size="sm">
                        Ajouter un suivi
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Aucune donnée de suivi disponible</p>
                    <Button onClick={() => setActiveTab("new")}>
                      Commencer le suivi
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Onglet nouveau suivi */}
            <TabsContent value="new">
              <WeeklyProgressForm 
                currentWeek={newWeekNumber}
                lastProgress={lastProgress}
                currentProgram={nutritionalProgram}
                onProgressSaved={handleProgressSaved}
              />
            </TabsContent>
            
            {/* Onglet historique */}
            <TabsContent value="history" className="space-y-4">
              {weeklyProgresses.length > 0 ? (
                <>
                  {/* Navigation entre les semaines */}
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNavigateWeek('prev')}
                      disabled={currentWeekIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
                    </Button>
                    
                    <span className="font-semibold">
                      Semaine {currentProgress.week} - {format(currentProgress.date, 'dd/MM/yyyy', { locale: fr })}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNavigateWeek('next')}
                      disabled={currentWeekIndex === weeklyProgresses.length - 1}
                    >
                      Suivant <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  
                  <motion.div
                    key={currentWeekIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-card border-0 shadow-sm mb-4">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-semibold">
                          Mesures et poids
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Poids</p>
                            <p className="font-semibold">{currentProgress.weight} kg</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Poitrine</p>
                            <p className="font-semibold">{currentProgress.measurements.chest || 'N/A'} cm</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Tour de taille</p>
                            <p className="font-semibold">{currentProgress.measurements.waist || 'N/A'} cm</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Hanches</p>
                            <p className="font-semibold">{currentProgress.measurements.hips || 'N/A'} cm</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Cuisses</p>
                            <p className="font-semibold">{currentProgress.measurements.thighs || 'N/A'} cm</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Bras</p>
                            <p className="font-semibold">{currentProgress.measurements.arms || 'N/A'} cm</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-card border-0 shadow-sm mb-4">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-semibold">
                          Performances
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Développé couché</p>
                            <p className="font-semibold">{currentProgress.performance.benchPress || 'N/A'} kg</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Squat</p>
                            <p className="font-semibold">{currentProgress.performance.squat || 'N/A'} kg</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Soulevé de terre</p>
                            <p className="font-semibold">{currentProgress.performance.deadlift || 'N/A'} kg</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {currentProgress.notes && (
                      <Card className="bg-card border-0 shadow-sm mb-4">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md font-semibold">
                            Notes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{currentProgress.notes}</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {currentProgress.adjustedMacros && (
                      <Card className="bg-card border-0 shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md font-semibold">
                            Ajustements macronutritionnels
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Calories</p>
                              <p className="font-semibold">{currentProgress.adjustedMacros.calories} kcal</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Protéines</p>
                              <p className="font-semibold">{currentProgress.adjustedMacros.protein} g</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Lipides</p>
                              <p className="font-semibold">{currentProgress.adjustedMacros.fat} g</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Glucides</p>
                              <p className="font-semibold">{currentProgress.adjustedMacros.carbs} g</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                  
                  {/* Actions */}
                  <div className="flex justify-between mt-4">
                    <Button onClick={() => setActiveTab("new")} variant="default">
                      Nouveau suivi
                    </Button>
                    <Button onClick={handleExportToPDF} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter en PDF
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Aucun historique disponible</p>
                  <Button onClick={() => setActiveTab("new")}>
                    Commencer le suivi
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
