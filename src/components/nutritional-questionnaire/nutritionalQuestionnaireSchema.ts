
import { z } from 'zod';
import { QuestionnaireFormData, MealPreferences } from './types';

// Définition du schéma de validation pour le questionnaire
export const nutritionalQuestionnaireSchema = z.object({
  // Informations personnelles
  name: z.string().min(1, "Le nom est requis"),
  age: z.number().min(18, "L'âge doit être d'au moins 18 ans").max(100, "L'âge doit être inférieur à 100 ans"),
  sex: z.enum(["male", "female"]),
  height: z.number().min(140, "La taille doit être d'au moins 140 cm").max(220, "La taille doit être inférieure à 220 cm"),
  currentWeight: z.number().min(40, "Le poids doit être d'au moins 40 kg").max(200, "Le poids doit être inférieur à 200 kg"),
  targetWeight: z.number().min(40, "Le poids cible doit être d'au moins 40 kg").max(200, "Le poids cible doit être inférieur à 200 kg"),
  bodyFatPercentage: z.number().min(3, "Le pourcentage de graisse corporelle doit être d'au moins 3%").max(70, "Le pourcentage de graisse corporelle doit être inférieur à 70%"),
  startDate: z.date(),
  
  // Objectifs et activité
  goal: z.enum(["weightLoss", "maintenance", "weightGain", "performance", "generalHealth"]),
  nutritionalGoal: z.enum(["cleanBulk", "bodyRecomposition", "perfectDeficit", "progressiveFatLoss", "maintenance"]),
  activityLevel: z.enum(["sedentary", "lightlyActive", "moderatelyActive", "veryActive", "superActive"]),
  occupation: z.enum(["sedentaryJob", "moderateJob", "physicalJob"]),
  
  // Préférences alimentaires
  dietType: z.enum(["balanced", "highProtein", "keto", "vegetarian", "vegan", "mediterranean", "other"]),
  mealsPerDay: z.number().min(2).max(6),
  mealPreferences: z.object({
    breakfast: z.boolean(),
    morningSnack: z.boolean(),
    lunch: z.boolean(),
    afternoonSnack: z.boolean(),
    dinner: z.boolean(),
    eveningSnack: z.boolean(),
  }),
  
  // Allergies et préférences
  allergies: z.array(z.string()),
  foodPreferences: z.array(z.string()),
  dietaryHabits: z.string(),
});

// Valeurs par défaut pour le formulaire
export const defaultQuestionnaireValues: QuestionnaireFormData = {
  // Informations personnelles
  name: "",
  age: 30,
  sex: "male",
  height: 175,
  currentWeight: 80,
  targetWeight: 75,
  bodyFatPercentage: 20,
  startDate: new Date(),
  
  // Objectifs et activité - Changer la valeur par défaut à moderatelyActive (1.5)
  goal: "weightLoss",
  nutritionalGoal: "progressiveFatLoss",
  activityLevel: "moderatelyActive", // Valeur par défaut: modéré (1.5) au lieu de veryActive (1.725)
  occupation: "sedentaryJob",
  
  // Préférences alimentaires
  dietType: "balanced",
  mealsPerDay: 3,
  mealPreferences: {
    breakfast: true,
    morningSnack: false,
    lunch: true,
    afternoonSnack: false,
    dinner: true,
    eveningSnack: false,
  },
  
  // Allergies et préférences
  allergies: [],
  foodPreferences: [],
  dietaryHabits: "",
};
