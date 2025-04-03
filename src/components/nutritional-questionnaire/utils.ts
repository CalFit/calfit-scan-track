
import { 
  QuestionnaireFormData, 
  CalculatedMacros, 
  activityMultipliers, 
  occupationMultipliers, 
  goalMultipliers,
  macroDistributionByDiet
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

// Calcul des besoins caloriques totaux
export const calculateTDEE = (data: QuestionnaireFormData): number => {
  const bmr = calculateBMR(data);
  
  if (bmr <= 0) return 0;
  
  const activityFactor = activityMultipliers[data.activityLevel] || 1.2;
  const occupationFactor = occupationMultipliers[data.occupation] || 0;
  const goalFactor = goalMultipliers[data.goal] || 1;
  
  // Calcul du TDEE de base
  let tdee = bmr * (activityFactor + occupationFactor);
  
  // Ajustement selon l'objectif
  tdee = tdee * goalFactor;
  
  return Math.round(tdee);
};

// Calcul de la répartition des macronutriments
export const calculateMacros = (data: QuestionnaireFormData): CalculatedMacros => {
  const calories = calculateTDEE(data);
  
  if (calories <= 0) {
    console.error("Impossible de calculer les calories:", data);
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
