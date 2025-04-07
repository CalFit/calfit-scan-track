
export type UserGoal = {
  id: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  created_at?: string;
  updated_at?: string;
}

export type UserProfile = {
  id: string;
  age: number | null;
  height: number | null;
  weight: number | null;
  body_fat_percentage: number | null;
  updated_at: string | null;
}
