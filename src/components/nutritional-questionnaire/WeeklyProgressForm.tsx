import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { WeeklyProgress, NutritionalProgram, CalculatedMacros } from './types';
import { calculateMacroAdjustments } from './utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Schéma pour la validation du formulaire
const progressFormSchema = z.object({
  weight: z.number().min(30, "Poids minimum 30kg").max(250, "Poids maximum 250kg"),
  measurements: z.object({
    chest: z.number().min(0),
    waist: z.number().min(0),
    hips: z.number().min(0),
    thighs: z.number().min(0),
    arms: z.number().min(0),
  }),
  performance: z.object({
    benchPress: z.number().min(0),
    squat: z.number().min(0),
    deadlift: z.number().min(0),
  }),
  notes: z.string().optional()
});

type ProgressFormValues = z.infer<typeof progressFormSchema>;

interface WeeklyProgressFormProps {
  currentWeek: number;
  lastProgress: WeeklyProgress | null;
  currentProgram: NutritionalProgram;
  onProgressSaved: (progress: WeeklyProgress, adjustedMacros: CalculatedMacros | null) => void;
}

const WeeklyProgressForm: React.FC<WeeklyProgressFormProps> = ({
  currentWeek,
  lastProgress,
  currentProgram,
  onProgressSaved
}) => {
  const { toast } = useToast();
  const today = new Date();
  const nextCheckDate = new Date(today);
  nextCheckDate.setDate(today.getDate() + 7);
  
  // Utiliser les valeurs précédentes si disponibles, sinon utiliser des valeurs par défaut
  const defaultValues: ProgressFormValues = {
    weight: lastProgress?.weight || (currentProgram?.maintenance ? currentProgram?.maintenance?.calories / 15 : 70),
    measurements: {
      chest: lastProgress?.measurements.chest || 0,
      waist: lastProgress?.measurements.waist || 0,
      hips: lastProgress?.measurements.hips || 0,
      thighs: lastProgress?.measurements.thighs || 0,
      arms: lastProgress?.measurements.arms || 0,
    },
    performance: {
      benchPress: lastProgress?.performance.benchPress || 0,
      squat: lastProgress?.performance.squat || 0,
      deadlift: lastProgress?.performance.deadlift || 0,
    },
    notes: ''
  };
  
  const form = useForm<ProgressFormValues>({
    resolver: zodResolver(progressFormSchema),
    defaultValues
  });
  
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [adjustedMacros, setAdjustedMacros] = useState<CalculatedMacros | null>(null);
  
  const handleCalculateAdjustments = () => {
    const values = form.getValues();
    
    if (!lastProgress) return;
    
    // Calculer les ajustements de macros en fonction du poids actuel vs précédent
    const newAdjustedMacros = calculateMacroAdjustments(
      currentProgram,
      lastProgress,
      values.weight
    );
    
    setAdjustedMacros(newAdjustedMacros);
    setShowAdjustments(true);
  };
  
  const onSubmit = (data: ProgressFormValues) => {
    const newProgress: WeeklyProgress = {
      week: currentWeek,
      date: today,
      nextCheckDate,
      weight: data.weight,
      measurements: {
        chest: data.measurements.chest,
        waist: data.measurements.waist,
        hips: data.measurements.hips,
        thighs: data.measurements.thighs,
        arms: data.measurements.arms
      },
      performance: {
        benchPress: data.performance.benchPress,
        squat: data.performance.squat,
        deadlift: data.performance.deadlift
      },
      notes: data.notes || '',
      adjustedMacros // Peut être null si aucun ajustement n'a été calculé
    };
    
    onProgressSaved(newProgress, adjustedMacros);
    
    toast({
      title: "Progrès sauvegardé",
      description: `Votre suivi de la semaine ${currentWeek} a été enregistré.`,
      duration: 3000,
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card border-0 shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-calfit-blue">
            Suivi de la semaine {currentWeek}
          </CardTitle>
          <CardDescription>
            Date: {format(today, 'dd MMMM yyyy', { locale: fr })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Section poids */}
              <div className="space-y-3">
                <h3 className="text-md font-semibold">Poids actuel</h3>
                
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            type="number"
                            onChange={e => field.onChange(Number(e.target.value) || 0)}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <span className="text-sm font-medium">kg</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {lastProgress && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Précédent: </span>
                    <span className="font-medium">{lastProgress.weight} kg</span>
                    {lastProgress.weight !== form.watch("weight") && (
                      <span className={`ml-2 ${lastProgress.weight < form.watch("weight") ? "text-green-500" : "text-red-500"}`}>
                        ({lastProgress.weight < form.watch("weight") ? "+" : ""}
                        {(form.watch("weight") - lastProgress.weight).toFixed(1)} kg)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <Separator />
              
              {/* Section mesures */}
              <div className="space-y-3">
                <h3 className="text-md font-semibold">Mensurations (en cm)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="measurements.chest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poitrine</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            onChange={e => field.onChange(Number(e.target.value) || 0)}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="measurements.arms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bras</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            onChange={e => field.onChange(Number(e.target.value) || 0)}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="measurements.waist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tour de taille</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            onChange={e => field.onChange(Number(e.target.value) || 0)}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="measurements.thighs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cuisses</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            onChange={e => field.onChange(Number(e.target.value) || 0)}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="measurements.hips"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hanches</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            onChange={e => field.onChange(Number(e.target.value) || 0)}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Section performances */}
              <div className="space-y-3">
                <h3 className="text-md font-semibold">Performances (en kg)</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="performance.benchPress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Développé couché</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            onChange={e => field.onChange(Number(e.target.value) || 0)}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="performance.squat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Squat</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            onChange={e => field.onChange(Number(e.target.value) || 0)}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="performance.deadlift"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Soulevé de terre</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            onChange={e => field.onChange(Number(e.target.value) || 0)}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Section notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ajoutez des notes sur vos progrès, difficultés ou autres observations..."
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Section ajustements */}
              {lastProgress && (
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCalculateAdjustments}
                  >
                    Calculer les ajustements recommandés
                  </Button>
                  
                  {showAdjustments && adjustedMacros && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-calfit-blue/10 p-4 rounded-lg space-y-3"
                    >
                      <h4 className="font-semibold">Ajustements recommandés</h4>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Calories actuelles:</p>
                          <p className="font-medium">{currentProgram.goal.calories} kcal</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Calories ajustées:</p>
                          <p className="font-medium">{adjustedMacros.calories} kcal</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Protéines actuelles:</p>
                          <p className="font-medium">{currentProgram.goal.protein} g</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Protéines ajustées:</p>
                          <p className="font-medium">{adjustedMacros.protein} g</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Lipides actuels:</p>
                          <p className="font-medium">{currentProgram.goal.fat} g</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Lipides ajustés:</p>
                          <p className="font-medium">{adjustedMacros.fat} g</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Glucides actuels:</p>
                          <p className="font-medium">{currentProgram.goal.carbs} g</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground">Glucides ajustés:</p>
                          <p className="font-medium">{adjustedMacros.carbs} g</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
              
              {/* Boutons */}
              <div className="flex justify-end space-x-2">
                <Button type="submit">
                  Enregistrer le suivi
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeeklyProgressForm;
