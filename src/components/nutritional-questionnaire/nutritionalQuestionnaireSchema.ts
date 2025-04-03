
import { z } from 'zod';
import { QuestionnaireFormData } from './types';

// Schéma de validation pour le formulaire de questionnaire nutritionnel
export const nutritionalQuestionnaireSchema = z.object({
  // Informations de base
  age: z
    .number()
    .min(15, { message: "L'âge doit être supérieur à 15 ans." })
    .max(100, { message: "L'âge doit être inférieur à 100 ans." }),
  
  sex: z.enum(['male', 'female'], {
    required_error: "Veuillez sélectionner votre sexe",
  }),
  
  height: z
    .number()
    .min(140, { message: "La taille doit être supérieure à 140 cm." })
    .max(220, { message: "La taille doit être inférieure à 220 cm." }),
    
  currentWeight: z
    .number()
    .min(30, { message: "Le poids doit être supérieur à 30 kg." })
    .max(250, { message: "Le poids doit être inférieur à 250 kg." }),
    
  targetWeight: z
    .number()
    .min(30, { message: "Le poids cible doit être supérieur à 30 kg." })
    .max(250, { message: "Le poids cible doit être inférieur à 250 kg." }),
  
  // Objectifs et activité
  goal: z.enum(['weightLoss', 'maintenance', 'weightGain', 'performance', 'generalHealth'], {
    required_error: "Veuillez sélectionner votre objectif",
  }),
  
  activityLevel: z.enum(['sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive', 'superActive'], {
    required_error: "Veuillez sélectionner votre niveau d'activité",
  }),
  
  occupation: z.enum(['sedentaryJob', 'moderateJob', 'physicalJob'], {
    required_error: "Veuillez sélectionner votre type d'occupation",
  }),
  
  // Préférences alimentaires
  dietType: z.enum(['balanced', 'highProtein', 'keto', 'vegetarian', 'vegan', 'mediterranean', 'other'], {
    required_error: "Veuillez sélectionner votre type de régime",
  }),
  
  mealsPerDay: z
    .number()
    .min(2, { message: "Le nombre minimum de repas est de 2." })
    .max(6, { message: "Le nombre maximum de repas est de 6." }),
  
  mealPreferences: z.object({
    breakfast: z.boolean().default(true),
    morningSnack: z.boolean().default(false),
    lunch: z.boolean().default(true),
    afternoonSnack: z.boolean().default(false),
    dinner: z.boolean().default(true),
    eveningSnack: z.boolean().default(false),
  }),
  
  // Allergies et préférences
  dietaryHabits: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  foodPreferences: z.array(z.string()).default([]),
  eatingBehavior: z.string().optional(),
});

// Valeurs par défaut du formulaire
export const defaultQuestionnaireValues: QuestionnaireFormData = {
  age: 30,
  sex: 'male',
  height: 175,
  currentWeight: 70,
  targetWeight: 70,
  goal: 'maintenance',
  activityLevel: 'moderatelyActive',
  occupation: 'sedentaryJob',
  dietType: 'balanced',
  mealsPerDay: 3,
  mealPreferences: {
    breakfast: true,
    morningSnack: false,
    lunch: true,
    afternoonSnack: false,
    dinner: true,
    eveningSnack: false,
  },
  dietaryHabits: '',
  allergies: [],
  foodPreferences: [],
  eatingBehavior: '',
};
