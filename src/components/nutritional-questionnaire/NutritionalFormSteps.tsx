// Importe uniquement ce qui est nécessaire pour éviter l'erreur de date-picker
import React, { useEffect, useState } from 'react';
import { 
  FormField, FormItem, FormLabel, FormControl, 
  FormMessage, FormDescription
} from '@/components/ui/form';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'; // Ajout de l'import manquant
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  commonAllergies, commonFoodPreferences, 
  nutritionalGoalLabels
} from './utils';
import { 
  Sex, Goal, ActivityLevel, Occupation, 
  DietType, NutritionalGoal 
} from './types';
import CleanBulkOptions from './CleanBulkOptions';

// Import DatePicker from correct location
import { DatePicker } from '@/components/ui/date-picker';

export const PersonalInfoStep: React.FC<{ form: any }> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Informations Personnelles</h2>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom</FormLabel>
            <FormControl>
              <Input placeholder="Votre nom" {...field} />
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
                <Input type="number" placeholder="Votre âge" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sexe</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre sexe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Homme</SelectItem>
                  <SelectItem value="female">Femme</SelectItem>
                </SelectContent>
              </Select>
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
              <FormControl>
                <Input type="number" placeholder="Votre taille en cm" {...field} />
              </FormControl>
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
                <Input type="number" placeholder="Votre poids actuel en kg" {...field} />
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
                <Input type="number" placeholder="Votre poids cible en kg" {...field} />
              </FormControl>
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
                <Input type="number" placeholder="Votre % de graisse corporelle" {...field} />
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
          <FormItem className="flex flex-col space-y-1.5">
            <FormLabel>Date de début</FormLabel>
            <FormControl>
              <DatePicker
                onSelect={field.onChange}
                defaultMonth={field.value}
                mode="single"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export const GoalsActivityStep: React.FC<{ form: any }> = ({ form }) => {
  const [showCleanBulkOptions, setShowCleanBulkOptions] = useState(false);
  const nutritionalGoal = form.watch('nutritionalGoal');
  
  useEffect(() => {
    setShowCleanBulkOptions(nutritionalGoal === 'cleanBulk');
  }, [nutritionalGoal]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Objectifs et Activité Physique</h2>
      
      <FormField
        control={form.control}
        name="goal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objectif principal</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un objectif" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="weightLoss">Perte de poids</SelectItem>
                <SelectItem value="maintenance">Maintien du poids</SelectItem>
                <SelectItem value="weightGain">Gain de poids/muscle</SelectItem>
                <SelectItem value="performance">Performance sportive</SelectItem>
                <SelectItem value="generalHealth">Santé générale</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="nutritionalGoal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objectif nutritionnel spécifique</FormLabel>
            <Select onValueChange={(value) => {
              field.onChange(value);
              setShowCleanBulkOptions(value === 'cleanBulk');
            }} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un programme" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(nutritionalGoalLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Clean Bulk Options (new component) */}
      <CleanBulkOptions form={form} visible={showCleanBulkOptions} />
      
      <FormField
        control={form.control}
        name="activityLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Niveau d'activité physique</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre niveau d'activité" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="moderatelyActive">Modérément actif</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="occupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type d'occupation</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre type d'occupation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="sedentaryJob">Travail sédentaire</SelectItem>
                <SelectItem value="moderateJob">Travail modéré</SelectItem>
                <SelectItem value="physicalJob">Travail physique</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="text-sm text-muted-foreground italic my-2">
        <p>L'activité sera fixée à modérée pour ce calcul nutritionnel.</p>
      </div>
    </div>
  );
};

export const DietPreferencesStep: React.FC<{ form: any }> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Préférences Alimentaires</h2>
      
      <FormField
        control={form.control}
        name="dietType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de régime alimentaire</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un régime" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="balanced">Équilibré</SelectItem>
                <SelectItem value="highProtein">Riche en protéines</SelectItem>
                <SelectItem value="keto">Cétogène</SelectItem>
                <SelectItem value="vegetarian">Végétarien</SelectItem>
                <SelectItem value="vegan">Végan</SelectItem>
                <SelectItem value="mediterranean">Méditerranéen</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
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
            <FormControl>
              <Input type="number" placeholder="Nombre de repas" {...field} />
            </FormControl>
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
              <Textarea
                placeholder="Décrivez vos habitudes alimentaires"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Décrivez vos habitudes alimentaires typiques.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export const AllergiesPreferencesStep: React.FC<{ form: any }> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Allergies et Préférences</h2>
      
      <FormField
        control={form.control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Allergies</FormLabel>
            <div className="flex flex-wrap gap-2">
              {commonAllergies.map((allergy) => (
                <div key={allergy} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergy}
                    checked={field.value?.includes(allergy)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([...(field.value || []), allergy]);
                      } else {
                        field.onChange(field.value?.filter((v: string) => v !== allergy));
                      }
                    }}
                  />
                  <label
                    htmlFor={allergy}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {allergy}
                  </label>
                </div>
              ))}
            </div>
            <FormDescription>
              Sélectionnez les allergies auxquelles vous êtes sensible.
            </FormDescription>
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
            <div className="flex flex-wrap gap-2">
              {commonFoodPreferences.map((preference) => (
                <div key={preference} className="flex items-center space-x-2">
                  <Checkbox
                    id={preference}
                    checked={field.value?.includes(preference)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange([...(field.value || []), preference]);
                      } else {
                        field.onChange(field.value?.filter((v: string) => v !== preference));
                      }
                    }}
                  />
                  <label
                    htmlFor={preference}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {preference}
                  </label>
                </div>
              ))}
            </div>
            <FormDescription>
              Sélectionnez vos préférences alimentaires.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
