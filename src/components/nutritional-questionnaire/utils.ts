
import { 
  QuestionnaireFormData, 
  CalculatedMacros, 
  activityMultipliers,
  occupationMultipliers, 
  goalMultipliers,
  nutritionalGoalMultipliers,
  macroDistributionByDiet,
  macroDistributionByNutritionalGoal,
  NutritionalProgram,
  WeeklyProgress
} from './types';

// Calcul de la masse maigre (Lean Body Mass)
export const calculateLBM = (data: QuestionnaireFormData): number => {
  const { currentWeight, bodyFatPercentage } = data;
  
  if (!currentWeight || bodyFatPercentage === undefined) {
    console.error("Données manquantes pour le calcul LBM:", { currentWeight, bodyFatPercentage });
    return 0;
  }
  
  // Formule exacte pour le calcul de la masse maigre
  const lbm = currentWeight * (1 - bodyFatPercentage / 100);
  return parseFloat(lbm.toFixed(2)); // Arrondi à 2 décimales comme dans le CSV
};

// Calcul du métabolisme de base selon la formule de Harris-Benedict RÉVISÉE
export const calculateBMR = (data: QuestionnaireFormData): number => {
  const { sex, currentWeight, height, age } = data;
  
  if (!age || !currentWeight || !height) {
    console.error("Données manquantes pour le calcul BMR:", { age, currentWeight, height });
    return 0;
  }
  
  let bmr: number;
  
  // Application de la formule Harris-Benedict révisée:
  // BMR = (10 × Poids(kg)) + (6.25 × Taille(cm)) − (5 × Âge(ans)) + 5 (pour hommes)
  // ou BMR = (10 × Poids(kg)) + (6.25 × Taille(cm)) − (5 × Âge(ans)) - 161 (pour femmes)
  if (sex === 'male') {
    bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
  }
  
  // Retourne la valeur avec 2 décimales pour précision
  return parseFloat(bmr.toFixed(2));
};

// Calcul des besoins caloriques pour le maintien (MMR) avec un facteur d'activité FIXE à 1.5
export const calculateMaintenanceTDEE = (data: QuestionnaireFormData): number => {
  const bmr = calculateBMR(data);
  
  if (bmr <= 0) return 0;
  
  // Application du facteur d'activité FIXE modéré (1.5)
  // Le facteur d'activité est désormais toujours 1.5, quel que soit le choix de l'utilisateur
  const activityFactor = 1.5; // Facteur d'activité fixe à "modéré"
  
  // Calcul du MMR (Maintenance Metabolic Rate)
  let mmr = bmr * activityFactor;
  
  // Retourne la valeur avec 2 décimales pour précision
  return parseFloat(mmr.toFixed(2));
};

// Calcul des besoins caloriques pour l'objectif spécifique
export const calculateGoalTDEE = (data: QuestionnaireFormData): number => {
  const maintenanceTDEE = calculateMaintenanceTDEE(data);
  
  if (maintenanceTDEE <= 0) return 0;
  
  // Ajustement basé sur l'objectif nutritionnel spécifique
  let goalTDEE = maintenanceTDEE;
  
  switch (data.nutritionalGoal) {
    case 'maintenance':
      // Maintien = aucun changement
      goalTDEE = maintenanceTDEE;
      break;
    case 'bodyRecomposition':
      // Recomposition corporelle: -300 kcal exactement comme dans le CSV
      goalTDEE = maintenanceTDEE - 300;
      break;
    case 'cleanBulk':
      // Prise de masse: +300 kcal exactement comme dans le CSV
      goalTDEE = maintenanceTDEE + 300;
      break;
    case 'perfectDeficit':
    case 'progressiveFatLoss':
      // Perte de poids: -500 kcal exactement comme dans le CSV
      goalTDEE = maintenanceTDEE - 500;
      break;
    default:
      // Pour tout autre cas, utiliser le multiplicateur ou 1.0 par défaut
      const nutritionalGoalFactor = nutritionalGoalMultipliers[data.nutritionalGoal] || 1.0;
      goalTDEE = maintenanceTDEE * nutritionalGoalFactor;
  }
  
  // Retourne la valeur avec 2 décimales comme dans le CSV
  return parseFloat(goalTDEE.toFixed(2));
};

// Calcul des macronutriments pour le maintien selon la répartition CSV
export const calculateMaintenanceMacros = (data: QuestionnaireFormData): CalculatedMacros => {
  const calories = calculateMaintenanceTDEE(data);
  
  if (calories <= 0) {
    console.error("Impossible de calculer les calories de maintien:", data);
    return { calories: 0, protein: 0, fat: 0, carbs: 0 };
  }
  
  // Utilisation des ratios exacts du fichier CSV pour la maintenance:
  // Glucides = 57.5%, Protéines = 17.4%, Lipides = 25.2%
  const csvDistribution = {
    carbs: 0.575,
    protein: 0.174, 
    fat: 0.252
  };
  
  // Si l'utilisateur a choisi un régime spécifique, utiliser cette distribution à la place
  const distribution = data.dietType !== 'balanced' ? 
    macroDistributionByDiet[data.dietType] || csvDistribution : 
    csvDistribution;
  
  // Calcul des grammes de protéines, lipides et glucides avec 2 décimales
  const protein = parseFloat((calories * distribution.protein / 4).toFixed(1)); // 4 calories par gramme de protéines
  const fat = parseFloat((calories * distribution.fat / 9).toFixed(1));         // 9 calories par gramme de lipides
  const carbs = parseFloat((calories * distribution.carbs / 4).toFixed(1));     // 4 calories par gramme de glucides
  
  return { 
    calories: parseFloat(calories.toFixed(2)), 
    protein, 
    fat, 
    carbs 
  };
};

// Calcul des macronutriments pour l'objectif spécifique
export const calculateGoalMacros = (data: QuestionnaireFormData): CalculatedMacros => {
  const calories = calculateGoalTDEE(data);
  
  if (calories <= 0) {
    console.error("Impossible de calculer les calories pour l'objectif:", data);
    return { calories: 0, protein: 0, fat: 0, carbs: 0 };
  }
  
  // Utilisation des ratios exacts du fichier CSV pour la maintenance comme base
  const csvDistribution = {
    carbs: 0.575,
    protein: 0.174,
    fat: 0.252
  };
  
  // Ajuster la distribution en fonction de l'objectif nutritionnel spécifique
  let distribution = csvDistribution;
  
  if (data.nutritionalGoal in macroDistributionByNutritionalGoal) {
    distribution = macroDistributionByNutritionalGoal[data.nutritionalGoal];
  } else if (data.dietType !== 'balanced' && data.dietType in macroDistributionByDiet) {
    distribution = macroDistributionByDiet[data.dietType];
  }
  
  // Calcul des grammes de protéines, lipides et glucides avec 2 décimales
  const protein = parseFloat((calories * distribution.protein / 4).toFixed(1)); // 4 calories par gramme de protéines
  const fat = parseFloat((calories * distribution.fat / 9).toFixed(1));         // 9 calories par gramme de lipides
  const carbs = parseFloat((calories * distribution.carbs / 4).toFixed(1));     // 4 calories par gramme de glucides
  
  return { 
    calories: parseFloat(calories.toFixed(2)), 
    protein, 
    fat, 
    carbs 
  };
};

// Calcul du programme nutritionnel complet
export const calculateNutritionalProgram = (data: QuestionnaireFormData): NutritionalProgram => {
  const lbm = calculateLBM(data);
  const bmr = calculateBMR(data);
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
  
  return { 
    lbm, 
    bmr, 
    maintenance, 
    goal, 
    macroDistribution 
  };
};

// Générer une première entrée pour le suivi hebdomadaire
export const generateInitialWeeklyProgress = (data: QuestionnaireFormData): WeeklyProgress => {
  const today = new Date();
  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(today.getDate() + 7);
  
  return {
    week: 1,
    date: today,
    nextCheckDate: oneWeekLater,
    weight: data.currentWeight,
    measurements: {
      chest: 0,
      waist: 0,
      hips: 0,
      thighs: 0,
      arms: 0
    },
    performance: {
      benchPress: 0,
      squat: 0,
      deadlift: 0
    },
    notes: '',
    adjustedMacros: null  // Aucun ajustement pour la première semaine
  };
};

// Calculer les ajustements de macros recommandés en fonction des progrès
export const calculateMacroAdjustments = (
  currentProgram: NutritionalProgram, 
  lastProgress: WeeklyProgress,
  newWeight: number
): CalculatedMacros => {
  // Si le poids n'a pas changé
  if (newWeight === lastProgress.weight) {
    return currentProgram.goal; // Conserver les mêmes macros
  }
  
  // Si l'utilisateur perd du poids mais l'objectif est de prendre du muscle
  if (newWeight < lastProgress.weight && 
      (currentProgram.goal.calories > currentProgram.maintenance.calories)) {
    // Augmenter les calories de 200
    return {
      calories: currentProgram.goal.calories + 200,
      protein: Math.round(((currentProgram.goal.calories + 200) * currentProgram.macroDistribution.protein/100) / 4),
      fat: Math.round(((currentProgram.goal.calories + 200) * currentProgram.macroDistribution.fat/100) / 9),
      carbs: Math.round(((currentProgram.goal.calories + 200) * currentProgram.macroDistribution.carbs/100) / 4)
    };
  }
  
  // Si l'utilisateur gagne du poids mais l'objectif est de perdre du poids
  if (newWeight > lastProgress.weight && 
      (currentProgram.goal.calories < currentProgram.maintenance.calories)) {
    // Réduire les calories de 200
    return {
      calories: Math.max(1200, currentProgram.goal.calories - 200), // Minimum 1200 calories par jour
      protein: Math.round(((currentProgram.goal.calories - 200) * currentProgram.macroDistribution.protein/100) / 4),
      fat: Math.round(((currentProgram.goal.calories - 200) * currentProgram.macroDistribution.fat/100) / 9),
      carbs: Math.round(((currentProgram.goal.calories - 200) * currentProgram.macroDistribution.carbs/100) / 4)
    };
  }
  
  // Sinon, tout va bien, on garde les mêmes macros
  return currentProgram.goal;
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
  progressiveFatLoss: "Perte de gras progressive",
  maintenance: "Maintien du poids"
};

// Obtenir le nom affiché pour un objectif nutritionnel
export const getNutritionalGoalLabel = (goal: string): string => {
  return nutritionalGoalLabels[goal as keyof typeof nutritionalGoalLabels] || goal;
};

// Calculer les calories nécessaires pour gagner ou perdre 1kg de poids
export const calculateCaloriesForWeightChange = (
  direction: 'gain' | 'loss', 
  durationWeeks: number = 4
): number => {
  // 1kg de graisse = environ 7700 calories
  const caloriesPerKg = 7700;
  const daysInPeriod = durationWeeks * 7;
  
  // Calcul des calories supplémentaires par jour pour atteindre 1kg dans la durée spécifiée
  const caloriesPerDay = caloriesPerKg / daysInPeriod;
  
  return direction === 'gain' ? caloriesPerDay : -caloriesPerDay;
};

// Générer un plan nutritionnel progressif sur plusieurs semaines
export const generateProgressivePlan = (
  initialProgram: NutritionalProgram, 
  durationWeeks: number = 12,
  targetWeightChange: number = 0 // en kg, positif pour gain, négatif pour perte
): NutritionalProgram[] => {
  const weeklyPlans: NutritionalProgram[] = [initialProgram];
  
  if (targetWeightChange === 0 || durationWeeks <= 1) {
    return weeklyPlans;
  }
  
  // Calculer l'ajustement calorique hebdomadaire nécessaire
  const direction = targetWeightChange > 0 ? 'gain' : 'loss';
  const absoluteTargetChange = Math.abs(targetWeightChange);
  const weeklyCalorieAdjustment = calculateCaloriesForWeightChange(direction, durationWeeks);
  
  // Générer le plan pour chaque semaine
  for (let week = 1; week < durationWeeks; week++) {
    const previousPlan = weeklyPlans[week - 1];
    const newCalories = Math.round(previousPlan.goal.calories + weeklyCalorieAdjustment);
    
    // Calculer les nouvelles macros basées sur la même distribution
    const newMacros: CalculatedMacros = {
      calories: newCalories,
      protein: Math.round((newCalories * previousPlan.macroDistribution.protein / 100) / 4),
      fat: Math.round((newCalories * previousPlan.macroDistribution.fat / 100) / 9),
      carbs: Math.round((newCalories * previousPlan.macroDistribution.carbs / 100) / 4),
    };
    
    // Créer le nouveau programme pour cette semaine
    const newProgram: NutritionalProgram = {
      ...previousPlan,
      goal: newMacros
    };
    
    weeklyPlans.push(newProgram);
  }
  
  return weeklyPlans;
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
  progressiveFatLoss: "Perte de gras progressive",
  maintenance: "Maintien du poids"
};

// Obtenir le nom affiché pour un objectif nutritionnel
export const getNutritionalGoalLabel = (goal: string): string => {
  return nutritionalGoalLabels[goal as keyof typeof nutritionalGoalLabels] || goal;
};
