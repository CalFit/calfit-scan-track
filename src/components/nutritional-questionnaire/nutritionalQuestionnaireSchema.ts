import * as z from "zod";

// Define the schema for the questionnaire form
export const nutritionalQuestionnaireSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit comporter au moins 2 caractères.",
  }),
  age: z.number().min(18, {
    message: "Vous devez avoir au moins 18 ans.",
  }),
  sex: z.enum(["male", "female"]),
  height: z.number().min(100, {
    message: "La taille doit être d'au moins 100 cm.",
  }),
  currentWeight: z.number().min(30, {
    message: "Le poids doit être d'au moins 30 kg.",
  }),
  targetWeight: z.number().min(30, {
    message: "Le poids cible doit être d'au moins 30 kg.",
  }),
  bodyFatPercentage: z.number().min(5, {
    message: "Le pourcentage de graisse corporelle doit être d'au moins 5%.",
  }),
  startDate: z.date(),
  goal: z.enum(["weightLoss", "maintenance", "weightGain", "performance", "generalHealth"]),
  nutritionalGoal: z.enum(["cleanBulk", "bodyRecomposition", "perfectDeficit", "progressiveFatLoss", "maintenance"]),
  activityLevel: z.enum(["moderatelyActive"]),
  occupation: z.enum(["sedentaryJob", "moderateJob", "physicalJob"]),
  dietType: z.enum(["balanced", "highProtein", "keto", "vegetarian", "vegan", "mediterranean", "other"]),
  mealsPerDay: z.number().min(1, {
    message: "Vous devez manger au moins un repas par jour.",
  }),
  mealPreferences: z.object({
    breakfast: z.boolean(),
    morningSnack: z.boolean(),
    lunch: z.boolean(),
    afternoonSnack: z.boolean(),
    dinner: z.boolean(),
    eveningSnack: z.boolean()
  }),
  allergies: z.string().array(),
  foodPreferences: z.string().array(),
  dietaryHabits: z.string(),
  highCalorieBulk: z.boolean().optional(),
});

// Default values for the form
export const defaultQuestionnaireValues: Partial<QuestionnaireFormData> = {
  name: "",
  age: 30,
  sex: "male",
  height: 175,
  currentWeight: 75,
  targetWeight: 70,
  bodyFatPercentage: 20,
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
    eveningSnack: false
  },
  allergies: [],
  foodPreferences: [],
  dietaryHabits: "",
  highCalorieBulk: false
};
