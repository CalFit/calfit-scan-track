
import React from 'react';
import { QuestionnaireFormData, Sex, Goal, ActivityLevel, Occupation, DietType, NutritionalGoal } from './types';
import { nutritionalGoalLabels } from './utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { commonAllergies, commonFoodPreferences } from './utils';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface BasicInfoStepProps {
  form: any;
}

// Étape 1: Informations personnelles
export const PersonalInfoStep: React.FC<BasicInfoStepProps> = ({ form }) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom</FormLabel>
            <FormControl>
              <Input 
                placeholder="Votre nom" 
                {...field} 
                className={cn(isMobile ? "text-base" : "text-sm")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Âge</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))} 
                  className={cn(isMobile ? "text-base" : "text-sm")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Sexe</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="male" id="sex-male" />
                    </FormControl>
                    <FormLabel htmlFor="sex-male" className="cursor-pointer font-normal">Homme</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="female" id="sex-female" />
                    </FormControl>
                    <FormLabel htmlFor="sex-female" className="cursor-pointer font-normal">Femme</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taille (cm)</FormLabel>
              <div className="space-y-2">
                <FormControl>
                  <Slider
                    value={[field.value]}
                    min={140}
                    max={220}
                    step={1}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>140 cm</span>
                  <span>{field.value} cm</span>
                  <span>220 cm</span>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poids actuel (kg)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                  className={cn(isMobile ? "text-base" : "text-sm")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="targetWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poids cible (kg)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                  className={cn(isMobile ? "text-base" : "text-sm")}
                />
              </FormControl>
              <FormDescription>
                Votre poids idéal selon vos objectifs
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bodyFatPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pourcentage de graisse corporelle (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                  className={cn(isMobile ? "text-base" : "text-sm")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date de début du programme</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: fr })
                    ) : (
                      <span>Choisir une date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
};

// Étape 2: Objectifs et niveau d'activité
export const GoalsActivityStep: React.FC<BasicInfoStepProps> = ({ form }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold mb-4">Objectifs et niveau d'activité</h2>
      
      <FormField
        control={form.control}
        name="nutritionalGoal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Programme nutritionnel</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cleanBulk">{nutritionalGoalLabels.cleanBulk}</SelectItem>
                  <SelectItem value="bodyRecomposition">{nutritionalGoalLabels.bodyRecomposition}</SelectItem>
                  <SelectItem value="perfectDeficit">{nutritionalGoalLabels.perfectDeficit}</SelectItem>
                  <SelectItem value="progressiveFatLoss">{nutritionalGoalLabels.progressiveFatLoss}</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Ce programme déterminera votre plan nutritionnel complet
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="goal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objectif principal</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre objectif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weightLoss">Perte de poids</SelectItem>
                  <SelectItem value="maintenance">Maintien du poids</SelectItem>
                  <SelectItem value="weightGain">Prise de masse</SelectItem>
                  <SelectItem value="performance">Performance sportive</SelectItem>
                  <SelectItem value="generalHealth">Santé générale</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Cet objectif déterminera votre apport calorique recommandé
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="activityLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Niveau d'activité physique</FormLabel>
            <div className="space-y-4">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-2"
                >
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="sedentary" id="sedentary" />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel htmlFor="sedentary" className="cursor-pointer font-semibold">Sédentaire</FormLabel>
                      <FormDescription>Peu ou pas d'exercice</FormDescription>
                    </div>
                  </FormItem>
                  
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="lightlyActive" id="lightlyActive" />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel htmlFor="lightlyActive" className="cursor-pointer font-semibold">Légèrement actif</FormLabel>
                      <FormDescription>Exercice léger 1-3 jours/semaine</FormDescription>
                    </div>
                  </FormItem>
                  
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="moderatelyActive" id="moderatelyActive" />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel htmlFor="moderatelyActive" className="cursor-pointer font-semibold">Modérément actif</FormLabel>
                      <FormDescription>Exercice modéré 3-5 jours/semaine</FormDescription>
                    </div>
                  </FormItem>
                  
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="veryActive" id="veryActive" />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel htmlFor="veryActive" className="cursor-pointer font-semibold">Très actif</FormLabel>
                      <FormDescription>Exercice intense 6-7 jours/semaine</FormDescription>
                    </div>
                  </FormItem>
                  
                  <FormItem className="flex items-start space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="superActive" id="superActive" />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel htmlFor="superActive" className="cursor-pointer font-semibold">Extrêmement actif</FormLabel>
                      <FormDescription>Exercice très intense et/ou travail physique</FormDescription>
                    </div>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="occupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type d'occupation quotidienne</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre type d'activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentaryJob">Travail sédentaire (bureau)</SelectItem>
                  <SelectItem value="moderateJob">Travail modérément actif</SelectItem>
                  <SelectItem value="physicalJob">Travail physique</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
};

// Étape 3: Préférences alimentaires et restrictions
export const DietPreferencesStep: React.FC<BasicInfoStepProps> = ({ form }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold mb-4">Préférences alimentaires</h2>
      
      <FormField
        control={form.control}
        name="dietType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de régime alimentaire</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre régime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Équilibré</SelectItem>
                  <SelectItem value="highProtein">Riche en protéines</SelectItem>
                  <SelectItem value="keto">Cétogène (faible en glucides)</SelectItem>
                  <SelectItem value="vegetarian">Végétarien</SelectItem>
                  <SelectItem value="vegan">Végétalien</SelectItem>
                  <SelectItem value="mediterranean">Méditerranéen</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormDescription>
              Ce choix affectera la répartition de vos macronutriments
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="mealsPerDay"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre de repas par jour</FormLabel>
            <div className="space-y-2">
              <FormControl>
                <Slider
                  value={[field.value]}
                  min={2}
                  max={6}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
              </div>
              <div className="text-center text-sm font-medium">
                {field.value} repas par jour
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="mealPreferences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Préférence des repas</FormLabel>
            <FormDescription>
              Sélectionnez les repas que vous souhaitez inclure dans votre programme
            </FormDescription>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value.breakfast} 
                    onCheckedChange={(checked) => {
                      field.onChange({...field.value, breakfast: !!checked});
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">Petit-déjeuner</FormLabel>
              </FormItem>
              
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value.morningSnack} 
                    onCheckedChange={(checked) => {
                      field.onChange({...field.value, morningSnack: !!checked});
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">Collation matinale</FormLabel>
              </FormItem>
              
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value.lunch} 
                    onCheckedChange={(checked) => {
                      field.onChange({...field.value, lunch: !!checked});
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">Déjeuner</FormLabel>
              </FormItem>
              
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value.afternoonSnack} 
                    onCheckedChange={(checked) => {
                      field.onChange({...field.value, afternoonSnack: !!checked});
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">Collation après-midi</FormLabel>
              </FormItem>
              
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value.dinner} 
                    onCheckedChange={(checked) => {
                      field.onChange({...field.value, dinner: !!checked});
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">Dîner</FormLabel>
              </FormItem>
              
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value.eveningSnack} 
                    onCheckedChange={(checked) => {
                      field.onChange({...field.value, eveningSnack: !!checked});
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">Collation du soir</FormLabel>
              </FormItem>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
};

// Étape 4: Allergies et préférences alimentaires
export const AllergiesPreferencesStep: React.FC<BasicInfoStepProps> = ({ form }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold mb-4">Allergies et préférences alimentaires</h2>
      
      <FormField
        control={form.control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Allergies et intolérances</FormLabel>
            <FormDescription>
              Sélectionnez les aliments auxquels vous êtes allergique ou intolérant
            </FormDescription>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {commonAllergies.map((allergy) => (
                <FormItem key={allergy} className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value.includes(allergy)} 
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, allergy]);
                        } else {
                          field.onChange(field.value.filter((item: string) => item !== allergy));
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{allergy}</FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="foodPreferences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Préférences alimentaires</FormLabel>
            <FormDescription>
              Sélectionnez les aliments que vous aimez particulièrement
            </FormDescription>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {commonFoodPreferences.map((preference) => (
                <FormItem key={preference} className="flex items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value.includes(preference)} 
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, preference]);
                        } else {
                          field.onChange(field.value.filter((item: string) => item !== preference));
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{preference}</FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="dietaryHabits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Habitudes alimentaires</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Je saute souvent le petit-déjeuner" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Partagez toute information pertinente sur vos habitudes alimentaires
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
};

// Importation de Button pour le DatePicker
import { Button } from "@/components/ui/button";
