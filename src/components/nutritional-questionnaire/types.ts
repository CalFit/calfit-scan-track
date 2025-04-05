
export type Sex = 'male' | 'female';
export type Goal = 'weightLoss' | 'maintenance' | 'weightGain' | 'performance' | 'generalHealth';
// Modification de ActivityLevel pour n'autoriser que l'option moderatelyActive
export type ActivityLevel = 'moderatelyActive';
export type Occupation = 'sedentaryJob' | 'moderateJob' | 'physicalJob';
export type DietType = 'balanced' | 'highProtein' | 'keto' | 'vegetarian' | 'vegan' | 'mediterranean' | 'other';

// Types d'objectifs nutritionnels spécifiques
export type NutritionalGoal = 'cleanBulk' | 'bodyRecomposition' | 'perfectDeficit' | 'progressiveFatLoss' | 'maintenance';

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
  
  // Options avancées
  highCalorieBulk?: boolean; // Option pour +400 kcal au lieu de +200 kcal pour prise de muscle
}

export interface CalculatedMacros {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface Measurements {
  chest: number;
  waist: number;
  hips: number;
  thighs: number;
  arms: number;
}

export interface Performance {
  benchPress: number;
  squat: number;
  deadlift: number;
  // Des exercices supplémentaires peuvent être ajoutés ici
}

export interface WeeklyProgress {
  week: number;
  date: Date;
  nextCheckDate: Date;
  weight: number;
  measurements: Measurements;
  performance: Performance;
  notes: string;
  adjustedMacros: CalculatedMacros | null; // Macros ajustées si nécessaire
}

export interface NutritionalProgram {
  lbm?: number; // Lean Body Mass (masse maigre)
  bmr?: number; // Basal Metabolic Rate (métabolisme de base)
  maintenance: CalculatedMacros;
  goal: CalculatedMacros;
  macroDistribution: {
    protein: number; // pourcentage
    fat: number; // pourcentage
    carbs: number; // pourcentage
  };
  weeklyProgress?: WeeklyProgress[]; // Suivi hebdomadaire facultatif
}

// Facteurs de multiplication pour le calcul du TDEE

// Multiplicateurs de niveau d'activité (facteur BMR) - conservé mais désormais nous n'utilisons que 1.5
export const activityMultipliers = {
  sedentary: 1.2, // Peu ou pas d'exercice
  lightlyActive: 1.375, // Exercice léger 1-3 jours/semaine
  moderatelyActive: 1.5, // Valeur fixe utilisée pour tous les calculs
  veryActive: 1.725, // Exercice intense 6-7 jours/semaine
  superActive: 1.9 // Exercice très intense ou entraînement deux fois par jour
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
  cleanBulk: 1.15, // Prise de muscle propre: 15% d'excédent calorique (peut être ajusté dynamiquement)
  bodyRecomposition: 1.0, // Recomposition corporelle: maintien calorique avec ajustement des macros
  perfectDeficit: 0.8, // Création du déficit parfait: 20% de déficit calorique
  progressiveFatLoss: 0.9, // Perte de gras progressive: légèrement révisé (maintenant -10% au lieu de -20%)
  maintenance: 1.0 // Maintien du poids sans changement
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
  cleanBulk: { protein: 0.25, fat: 0.25, carbs: 0.5 },
  bodyRecomposition: { protein: 0.35, fat: 0.25, carbs: 0.4 },
  perfectDeficit: { protein: 0.4, fat: 0.3, carbs: 0.3 },
  progressiveFatLoss: { protein: 0.35, fat: 0.35, carbs: 0.3 },
  maintenance: { protein: 0.174, fat: 0.252, carbs: 0.575 } // Ratios exacts du CSV
};
