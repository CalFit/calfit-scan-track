
import { z } from "zod";
import { 
  MealPreferences,
  QuestionnaireFormData,
  NutritionalGoal 
} from './types';

// Schéma de validation pour le formulaire du questionnaire nutritionnel
export const nutritionalQuestionnaireSchema = z.object({
  // Informations personnelles
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  age: z.number().min(18, "Vous devez avoir au moins 18 ans").max(100, "Âge maximum 100 ans"),
  sex: z.enum(["male", "female"]),
  height: z.number().min(140, "Taille minimum 140 cm").max(220, "Taille maximum 220 cm"),
  currentWeight: z.number().min(40, "Poids minimum 40 kg").max(200, "Poids maximum 200 kg"),
  targetWeight: z.number().min(40, "Poids cible minimum 40 kg").max(200, "Poids cible maximum 200 kg"),
  bodyFatPercentage: z.number().min(3, "Pourcentage minimum 3%").max(50, "Pourcentage maximum 50%").optional(),
  startDate: z.date().default(() => new Date()),

  // Objectifs et activité
  goal: z.enum(["weightLoss", "maintenance", "weightGain", "performance", "generalHealth"]),
  nutritionalGoal: z.enum(["cleanBulk", "bodyRecomposition", "perfectDeficit", "progressiveFatLoss", "maintenance"]),
  activityLevel: z.enum(["sedentary", "lightlyActive", "moderatelyActive", "veryActive", "superActive"]),
  occupation: z.enum(["sedentaryJob", "moderateJob", "physicalJob"]),
  
  // Préférences alimentaires
  dietType: z.enum(["balanced", "highProtein", "keto", "vegetarian", "vegan", "mediterranean", "other"]),
  mealsPerDay: z.number().min(2, "Minimum 2 repas").max(6, "Maximum 6 repas"),
  mealPreferences: z.object({
    breakfast: z.boolean(),
    morningSnack: z.boolean(),
    lunch: z.boolean(),
    afternoonSnack: z.boolean(),
    dinner: z.boolean(),
    eveningSnack: z.boolean(),
  }),
  allergies: z.array(z.string()),
  foodPreferences: z.array(z.string()),
  dietaryHabits: z.string(),
});

// Valeurs par défaut pour le formulaire
export const defaultQuestionnaireValues: QuestionnaireFormData = {
  name: "",
  age: 30,
  sex: "male",
  height: 175,
  currentWeight: 75,
  targetWeight: 70,
  bodyFatPercentage: 15,
  startDate: new Date(),
  goal: "weightLoss",
  nutritionalGoal: "progressiveFatLoss",
  activityLevel: "moderatelyActive",
  occupation: "sedentaryJob",
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
  allergies: [],
  foodPreferences: [],
  dietaryHabits: "",
};
