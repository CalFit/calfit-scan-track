
export type Sex = 'male' | 'female';
export type Goal = 'weightLoss' | 'maintenance' | 'weightGain' | 'performance' | 'generalHealth';
export type ActivityLevel = 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'superActive';
export type Occupation = 'sedentaryJob' | 'moderateJob' | 'physicalJob';
export type DietType = 'balanced' | 'highProtein' | 'keto' | 'vegetarian' | 'vegan' | 'mediterranean' | 'other';

// Nouveaux types pour les objectifs nutritionnels spécifiques
export type NutritionalGoal = 'cleanBulk' | 'bodyRecomposition' | 'perfectDeficit' | 'progressiveFatLoss';

export interface MealPreferences {
  breakfast: boolean;
  morningSnack: boolean;
  lunch: boolean;
  afternoonSnack: boolean;
  dinner: boolean;
  eveningSnack: boolean;
}

export interface QuestionnaireFormData {
  // Informations personnelles
  name: string;
  age: number;
  sex: Sex;
  height: number;
  currentWeight: number;
  targetWeight: number;
  bodyFatPercentage: number;
  startDate: Date;
  
  // Objectifs et activité
  goal: Goal;
  nutritionalGoal: NutritionalGoal;
  activityLevel: ActivityLevel;
  occupation: Occupation;
  
  // Préférences alimentaires
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

export interface NutritionalProgram {
  maintenance: CalculatedMacros;
  goal: CalculatedMacros;
  macroDistribution: {
    protein: number; // pourcentage
    fat: number; // pourcentage
    carbs: number; // pourcentage
  };
}

// Facteurs de multiplication pour le calcul du TDEE

// Multiplicateurs de niveau d'activité (facteur BMR)
export const activityMultipliers = {
  sedentary: 1.2, // Peu ou pas d'exercice
  lightlyActive: 1.375, // Exercice léger 1-3 jours/semaine
  moderatelyActive: 1.55, // Exercice modéré 3-5 jours/semaine
  veryActive: 1.725, // Exercice intense 6-7 jours/semaine
  superActive: 1.9 // Exercice très intense, travail physique ou entraînement deux fois par jour
};

// Multiplicateurs de niveau d'occupation (facteur supplémentaire)
export const occupationMultipliers = {
  sedentaryJob: 0, // Travail de bureau, principalement assis
  moderateJob: 0.1, // Travail nécessitant une certaine activité physique
  physicalJob: 0.2 // Travail à forte intensité physique
};

// Multiplicateurs d'objectif (facteur d'ajustement)
export const goalMultipliers = {
  weightLoss: 0.85, // 15% de déficit calorique
  maintenance: 1, // Pas de changement
  weightGain: 1.15, // 15% d'excédent calorique
  performance: 1.2, // 20% d'excédent calorique pour la performance
  generalHealth: 1 // Pas de changement
};

// Multiplicateurs d'objectif nutritionnel spécifique (facteur d'ajustement)
export const nutritionalGoalMultipliers = {
  cleanBulk: 1.15, // Prise de muscle propre: 15% d'excédent calorique
  bodyRecomposition: 1.0, // Recomposition corporelle: maintien calorique avec ajustement des macros
  perfectDeficit: 0.8, // Création du déficit parfait: 20% de déficit calorique
  progressiveFatLoss: 0.9 // Perte de gras progressive: 10% de déficit calorique
};

// Répartition des macros par type de régime
export const macroDistributionByDiet = {
  balanced: { protein: 0.3, fat: 0.3, carbs: 0.4 },
  highProtein: { protein: 0.4, fat: 0.3, carbs: 0.3 },
  keto: { protein: 0.25, fat: 0.7, carbs: 0.05 },
  vegetarian: { protein: 0.25, fat: 0.3, carbs: 0.45 },
  vegan: { protein: 0.2, fat: 0.3, carbs: 0.5 },
  mediterranean: { protein: 0.25, fat: 0.35, carbs: 0.4 },
  other: { protein: 0.3, fat: 0.3, carbs: 0.4 }
};

// Répartition des macros par objectif nutritionnel spécifique
export const macroDistributionByNutritionalGoal = {
  cleanBulk: { protein: 0.35, fat: 0.25, carbs: 0.4 },
  bodyRecomposition: { protein: 0.4, fat: 0.3, carbs: 0.3 },
  perfectDeficit: { protein: 0.45, fat: 0.25, carbs: 0.3 },
  progressiveFatLoss: { protein: 0.4, fat: 0.3, carbs: 0.3 }
};
