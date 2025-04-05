
export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  barcode?: string;
}

export interface ManualFoodEntryProps {
  initialBarcode: string | null;
  onSubmit: (food: FoodItem) => void;
  onCancel: () => void;
}
