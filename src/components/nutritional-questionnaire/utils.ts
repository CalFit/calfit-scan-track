
import { 
  QuestionnaireFormData, 
  CalculatedMacros, 
  activityMultipliers, 
  occupationMultipliers, 
  goalMultipliers,
  nutritionalGoalMultipliers,
  macroDistributionByDiet,
  macroDistributionByNutritionalGoal,
  NutritionalProgram
} from './types';

// Calcul du métabolisme de base selon l'équation de Mifflin-St Jeor
export const calculateBMR = (data: QuestionnaireFormData): number => {
  const { sex, currentWeight, height, age } = data;
  
  if (!age || !currentWeight || !height) {
    console.error("Données manquantes pour le calcul BMR:", { age, currentWeight, height });
    return 0;
  }
  
  if (sex === 'male') {
    return 10 * currentWeight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * currentWeight + 6.25 * height - 5 * age - 161;
  }
};

// Calcul des besoins caloriques pour le maintien (TDEE)
export const calculateMaintenanceTDEE = (data: QuestionnaireFormData): number => {
  const bmr = calculateBMR(data);
  
  if (bmr <= 0) return 0;
  
  const activityFactor = activityMultipliers[data.activityLevel] || 1.2;
  const occupationFactor = occupationMultipliers[data.occupation] || 0;
  
  // Calcul du TDEE de maintenance
  let tdee = bmr * (activityFactor + occupationFactor);
  
  return Math.round(tdee);
};

// Calcul des besoins caloriques pour l'objectif spécifique
export const calculateGoalTDEE = (data: QuestionnaireFormData): number => {
  const maintenanceTDEE = calculateMaintenanceTDEE(data);
  
  if (maintenanceTDEE <= 0) return 0;
  
  // Utiliser d'abord le multiplicateur d'objectif nutritionnel spécifique s'il est disponible
  const nutritionalGoalFactor = nutritionalGoalMultipliers[data.nutritionalGoal] || 1;
  
  // Calcul du TDEE ajusté pour l'objectif
  let goalTDEE = maintenanceTDEE * nutritionalGoalFactor;
  
  return Math.round(goalTDEE);
};

// Calcul des macronutriments pour le maintien
export const calculateMaintenanceMacros = (data: QuestionnaireFormData): CalculatedMacros => {
  const calories = calculateMaintenanceTDEE(data);
  
  if (calories <= 0) {
    console.error("Impossible de calculer les calories de maintien:", data);
    return { calories: 0, protein: 0, fat: 0, carbs: 0 };
  }
  
  const distribution = macroDistributionByDiet[data.dietType] || 
    { protein: 0.3, fat: 0.3, carbs: 0.4 };
  
  // Calcul des grammes de protéines, lipides et glucides
  const protein = Math.round((calories * distribution.protein) / 4); // 4 calories par gramme de protéines
  const fat = Math.round((calories * distribution.fat) / 9); // 9 calories par gramme de lipides
  const carbs = Math.round((calories * distribution.carbs) / 4); // 4 calories par gramme de glucides
  
  return { calories, protein, fat, carbs };
};

// Calcul des macronutriments pour l'objectif spécifique
export const calculateGoalMacros = (data: QuestionnaireFormData): CalculatedMacros => {
  const calories = calculateGoalTDEE(data);
  
  if (calories <= 0) {
    console.error("Impossible de calculer les calories pour l'objectif:", data);
    return { calories: 0, protein: 0, fat: 0, carbs: 0 };
  }
  
  // Utiliser la distribution des macros basée sur l'objectif nutritionnel spécifique
  const distribution = macroDistributionByNutritionalGoal[data.nutritionalGoal] || 
    macroDistributionByDiet[data.dietType] || 
    { protein: 0.3, fat: 0.3, carbs: 0.4 };
  
  // Calcul des grammes de protéines, lipides et glucides
  const protein = Math.round((calories * distribution.protein) / 4); // 4 calories par gramme de protéines
  const fat = Math.round((calories * distribution.fat) / 9); // 9 calories par gramme de lipides
  const carbs = Math.round((calories * distribution.carbs) / 4); // 4 calories par gramme de glucides
  
  return { calories, protein, fat, carbs };
};

// Calcul du programme nutritionnel complet
export const calculateNutritionalProgram = (data: QuestionnaireFormData): NutritionalProgram => {
  const maintenance = calculateMaintenanceMacros(data);
  const goal = calculateGoalMacros(data);
  
  // Calculer la répartition des macros en pourcentage
  const totalCalories = goal.calories > 0 ? goal.calories : 1; // Éviter la division par zéro
  const proteinCalories = goal.protein * 4;
  const fatCalories = goal.fat * 9;
  const carbsCalories = goal.carbs * 4;
  
  const macroDistribution = {
    protein: Math.round((proteinCalories / totalCalories) * 100),
    fat: Math.round((fatCalories / totalCalories) * 100),
    carbs: Math.round((carbsCalories / totalCalories) * 100)
  };
  
  // S'assurer que la somme est de 100%
  const total = macroDistribution.protein + macroDistribution.fat + macroDistribution.carbs;
  const tolerance = 0.01; // Définir une tolérance pour les erreurs d'arrondi
  if (Math.abs(total - 100) > tolerance) {
    // Ajuster les glucides pour que le total soit 100%
    macroDistribution.carbs += (100 - total);
  }
  
  return { maintenance, goal, macroDistribution };
};

// Liste des allergènes communs pour les options de sélection
export const commonAllergies = [
  "Lactose", "Gluten", "Arachides", "Fruits à coque", 
  "Œufs", "Poisson", "Crustacés", "Soja", "Sésame"
];

// Liste des préférences alimentaires pour les options de sélection
export const commonFoodPreferences = [
  "Viande rouge", "Volaille", "Poisson", "Fruits de mer", 
  "Produits laitiers", "Légumes", "Fruits", "Céréales complètes", 
  "Légumineuses", "Noix et graines"
];

// Traduction des objectifs nutritionnels pour l'affichage
export const nutritionalGoalLabels = {
  cleanBulk: "Prise de muscle propre",
  bodyRecomposition: "Recomposition corporelle",
  perfectDeficit: "Création du déficit parfait",
  progressiveFatLoss: "Perte de gras progressive"
};

// Obtenir le nom affiché pour un objectif nutritionnel
export const getNutritionalGoalLabel = (goal: string): string => {
  return nutritionalGoalLabels[goal as keyof typeof nutritionalGoalLabels] || goal;
};
