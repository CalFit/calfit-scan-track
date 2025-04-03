
export type Sex = 'male' | 'female';
export type Goal = 'weightLoss' | 'maintenance' | 'weightGain' | 'performance' | 'generalHealth';
export type ActivityLevel = 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'superActive';
export type Occupation = 'sedentaryJob' | 'moderateJob' | 'physicalJob';
export type DietType = 'balanced' | 'highProtein' | 'keto' | 'vegetarian' | 'vegan' | 'mediterranean' | 'other';

export interface QuestionnaireFormData {
  // Basic info
  age: number;
  sex: Sex;
  height: number;
  currentWeight: number;
  targetWeight: number;
  
  // Goals and activity
  goal: Goal;
  activityLevel: ActivityLevel;
  occupation: Occupation;
  
  // Diet preferences
  dietType: DietType;
  mealsPerDay: number;
  mealPreferences: {
    breakfast: boolean;
    morningSnack: boolean;
    lunch: boolean;
    afternoonSnack: boolean;
    dinner: boolean;
    eveningSnack: boolean;
  };
  
  // Additional info
  dietaryHabits: string;
  allergies: string[];
  foodPreferences: string[];
  eatingBehavior: string;
}

export interface CalculatedMacros {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

// Base données pour le calcul des macros et calories
export const activityMultipliers = {
  sedentary: 1.2, // Peu ou pas d'exercice
  lightlyActive: 1.375, // Exercice léger 1-3 jours/semaine
  moderatelyActive: 1.55, // Exercice modéré 3-5 jours/semaine
  veryActive: 1.725, // Exercice intense 6-7 jours/semaine
  superActive: 1.9, // Exercice très intense et travail physique
};

export const occupationMultipliers = {
  sedentaryJob: 0,
  moderateJob: 0.1,
  physicalJob: 0.2,
};

export const goalMultipliers = {
  weightLoss: 0.8,
  maintenance: 1,
  weightGain: 1.1,
  performance: 1.2,
  generalHealth: 1,
};

export const macroDistributionByDiet: Record<DietType, { protein: number; fat: number; carbs: number }> = {
  balanced: { protein: 0.3, fat: 0.3, carbs: 0.4 },
  highProtein: { protein: 0.4, fat: 0.3, carbs: 0.3 },
  keto: { protein: 0.25, fat: 0.7, carbs: 0.05 },
  vegetarian: { protein: 0.25, fat: 0.3, carbs: 0.45 },
  vegan: { protein: 0.2, fat: 0.3, carbs: 0.5 },
  mediterranean: { protein: 0.25, fat: 0.35, carbs: 0.4 },
  other: { protein: 0.3, fat: 0.3, carbs: 0.4 },
};
