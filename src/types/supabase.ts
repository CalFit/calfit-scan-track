
export type FoodCategory = {
  id: string;
  name: string;
  icon: string | null;
  created_at: string;
}

export type Food = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  user_id: string | null;
  category_id: string | null;
  is_favorite: boolean;
  barcode: string | null;
  serving_size: number | null;
  serving_unit: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type MealLog = {
  id: string;
  user_id: string;
  food_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number;
  date: string;
  created_at: string;
}
