
import { useState } from 'react';
import { FoodItem } from './types';

export function useFoodForm(initialBarcode: string | null) {
  const [foodData, setFoodData] = useState<FoodItem>({
    name: '',
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    barcode: initialBarcode || undefined
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert to number for numeric fields
    const numericFields = ['calories', 'protein', 'fat', 'carbs'];
    const processedValue = numericFields.includes(name) 
      ? parseFloat(value) || 0 
      : value;
    
    setFoodData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const validateForm = (): boolean => {
    if (!foodData.name) {
      alert("Le nom de l'aliment est requis");
      return false;
    }
    return true;
  };

  return {
    foodData,
    handleChange,
    validateForm
  };
}
