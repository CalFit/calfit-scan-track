
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { DatePicker } from "@/components/ui/date-picker";
import { QuestionnaireFormData } from './types';
import { UseFormReturn } from 'react-hook-form';

// Composant pour l'étape des informations personnelles
export const PersonalInfoStep = ({ form }: { form: UseFormReturn<QuestionnaireFormData> }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Informations personnelles</h2>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
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
                  <Input 
                    type="number" 
                    placeholder="Votre âge" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    value={field.value || ''}
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
                  <Input 
                    type="number" 
                    placeholder="Votre taille en cm" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    value={field.value || ''}
                  />
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
                  <Input 
                    type="number"
                    placeholder="Votre poids actuel en kg" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    value={field.value || ''}
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
                    placeholder="Votre poids cible en kg" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    value={field.value || ''}
                  />
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
                  <Input 
                    type="number"
                    placeholder="Votre % de graisse corporelle"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    value={field.value || ''}
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
              <FormLabel>Date de début</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
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
                  <DatePicker
                    mode="single"
                    locale={fr}
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

// Composant pour l'étape des objectifs et activité
export const GoalsActivityStep = ({ form }: { form: UseFormReturn<QuestionnaireFormData> }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Objectifs et niveau d'activité</h2>
        
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objectif principal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre objectif" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weightLoss">Perte de poids</SelectItem>
                  <SelectItem value="maintenance">Maintien du poids</SelectItem>
                  <SelectItem value="weightGain">Prise de poids</SelectItem>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre objectif nutritionnel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cleanBulk">Prise de muscle propre</SelectItem>
                  <SelectItem value="bodyRecomposition">Recomposition corporelle</SelectItem>
                  <SelectItem value="perfectDeficit">Création du déficit parfait</SelectItem>
                  <SelectItem value="progressiveFatLoss">Perte de gras progressive</SelectItem>
                  <SelectItem value="maintenance">Maintien du poids</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Information sur le niveau d'activité fixe */}
        <div className="p-4 bg-calfit-blue/10 rounded-md">
          <h3 className="font-medium mb-2">Niveau d'activité</h3>
          <p>Pour des calculs précis, nous utilisons un niveau d'activité standard 'Modéré (×1.5)' correspondant à une activité physique normale.</p>
        </div>
        
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
                  <SelectItem value="sedentaryJob">Travail sédentaire (bureau)</SelectItem>
                  <SelectItem value="moderateJob">Travail modéré (mobilité)</SelectItem>
                  <SelectItem value="physicalJob">Travail physique</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

// Composant pour l'étape des préférences alimentaires
export const DietPreferencesStep = ({ form }: { form: UseFormReturn<QuestionnaireFormData> }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Préférences alimentaires</h2>
        
        <FormField
          control={form.control}
          name="dietType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de régime</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre type de régime" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="balanced">Équilibré</SelectItem>
                  <SelectItem value="highProtein">Riche en protéines</SelectItem>
                  <SelectItem value="keto">Kéto</SelectItem>
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
                <Input 
                  type="number"
                  placeholder="Nombre de repas"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mealPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Préférences de repas</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div>
                  <FormField
                    control={form.control}
                    name="mealPreferences.breakfast"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Petit-déjeuner
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="mealPreferences.morningSnack"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Collation du matin
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="mealPreferences.lunch"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Déjeuner
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="mealPreferences.afternoonSnack"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Collation de l'après-midi
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="mealPreferences.dinner"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Dîner
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="mealPreferences.eveningSnack"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Collation du soir
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

// Composant pour l'étape des allergies et préférences
export const AllergiesPreferencesStep = ({ form }: { form: UseFormReturn<QuestionnaireFormData> }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Allergies et préférences</h2>
        
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies</FormLabel>
              <Textarea
                placeholder="Entrez vos allergies, séparées par des virgules"
                {...field}
              />
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
              <Textarea
                placeholder="Entrez vos préférences alimentaires, séparées par des virgules"
                {...field}
              />
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
              <Textarea
                placeholder="Décrivez vos habitudes alimentaires"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
