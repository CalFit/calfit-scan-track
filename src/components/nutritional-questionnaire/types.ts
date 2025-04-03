
export type Sex = 'male' | 'female';
export type Goal = 'weightLoss' | 'maintenance' | 'weightGain' | 'performance' | 'generalHealth';
export type ActivityLevel = 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'superActive';
export type Occupation = 'sedentaryJob' | 'moderateJob' | 'physicalJob';
export type DietType = 'balanced' | 'highProtein' | 'keto' | 'vegetarian' | 'vegan' | 'mediterranean' | 'other';

export interface MealPreferences {
  breakfast: boolean;
  morningSnack: boolean;
  lunch: boolean;
  afternoonSnack: boolean;
  dinner: boolean;
  eveningSnack: boolean;
}

export interface QuestionnaireFormData {
  age: number;
  sex: Sex;
  height: number;
  currentWeight: number;
  targetWeight: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  occupation: Occupation;
  dietType: DietType;
  mealsPerDay: number;
  mealPreferences: MealPreferences;
  allergies: string[];
  foodPreferences: string[];
  dietaryHabits: string;
}

export interface CalculatedMacros {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

// Multiplication factors for TDEE calculation

// Activity level multipliers (BMR factor)
export const activityMultipliers = {
  sedentary: 1.2, // Little or no exercise
  lightlyActive: 1.375, // Light exercise 1-3 days/week
  moderatelyActive: 1.55, // Moderate exercise 3-5 days/week
  veryActive: 1.725, // Hard exercise 6-7 days/week
  superActive: 1.9 // Very hard exercise, physical job or training twice a day
};

// Occupation level multipliers (additional factor)
export const occupationMultipliers = {
  sedentaryJob: 0, // Desk job, mostly sitting
  moderateJob: 0.1, // Job requires some physical activity
  physicalJob: 0.2 // Labor-intensive job
};

// Goal multipliers (adjustment factor)
export const goalMultipliers = {
  weightLoss: 0.85, // 15% caloric deficit
  maintenance: 1, // No change
  weightGain: 1.15, // 15% caloric surplus
  performance: 1.2, // 20% caloric surplus for performance
  generalHealth: 1 // No change
};

// Macro distribution by diet type
export const macroDistributionByDiet = {
  balanced: { protein: 0.3, fat: 0.3, carbs: 0.4 },
  highProtein: { protein: 0.4, fat: 0.3, carbs: 0.3 },
  keto: { protein: 0.25, fat: 0.7, carbs: 0.05 },
  vegetarian: { protein: 0.25, fat: 0.3, carbs: 0.45 },
  vegan: { protein: 0.2, fat: 0.3, carbs: 0.5 },
  mediterranean: { protein: 0.25, fat: 0.35, carbs: 0.4 },
  other: { protein: 0.3, fat: 0.3, carbs: 0.4 }
};
