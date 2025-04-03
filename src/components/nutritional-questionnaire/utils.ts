
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
  
  if (sex === 'male') {
    return 10 * currentWeight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * currentWeight + 6.25 * height - 5 * age - 161;
  }
};

// Calcul des besoins caloriques totaux
export const calculateTDEE = (data: QuestionnaireFormData): number => {
  const bmr = calculateBMR(data);
  const activityFactor = activityMultipliers[data.activityLevel];
  const occupationFactor = occupationMultipliers[data.occupation];
  const goalFactor = goalMultipliers[data.goal];
  
  // Calcul du TDEE de base
  let tdee = bmr * (activityFactor + occupationFactor);
  
  // Ajustement selon l'objectif
  tdee = tdee * goalFactor;
  
  return Math.round(tdee);
};

// Calcul de la répartition des macronutriments
export const calculateMacros = (data: QuestionnaireFormData): CalculatedMacros => {
  const calories = calculateTDEE(data);
  const { protein: proteinRatio, fat: fatRatio, carbs: carbsRatio } = 
    macroDistributionByDiet[data.dietType];
  
  // Calcul des grammes de protéines, lipides et glucides
  const protein = Math.round((calories * proteinRatio) / 4); // 4 calories par gramme de protéines
  const fat = Math.round((calories * fatRatio) / 9); // 9 calories par gramme de lipides
  const carbs = Math.round((calories * carbsRatio) / 4); // 4 calories par gramme de glucides
  
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
