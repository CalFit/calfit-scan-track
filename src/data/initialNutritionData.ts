
export const initialNutritionData = {
  calories: { current: 1800, target: 2200 },
  protein: { current: 80, target: 120 },
  fat: { current: 60, target: 70 },
  carbs: { current: 220, target: 250 }
};

export const initialMeals = {
  breakfast: {
    title: "Petit-déjeuner",
    items: [
      { id: 1, name: "Yaourt Grec", calories: 120, protein: 15, fat: 5, carbs: 8 },
      { id: 2, name: "Banane", calories: 105, protein: 1, fat: 0, carbs: 27 }
    ]
  },
  lunch: {
    title: "Déjeuner",
    items: [
      { id: 3, name: "Salade de poulet", calories: 350, protein: 30, fat: 15, carbs: 12 }
    ]
  },
  dinner: {
    title: "Dîner",
    items: []
  }
};
