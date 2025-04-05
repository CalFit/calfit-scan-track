
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ManualFoodEntryProps } from './types';
import { useFoodForm } from './useFoodForm';
import BarcodeInfo from './BarcodeInfo';
import FoodForm from './FoodForm';
import FormActions from './FormActions';

const ManualFoodEntry: React.FC<ManualFoodEntryProps> = ({ initialBarcode, onSubmit, onCancel }) => {
  const { foodData, handleChange, validateForm } = useFoodForm(initialBarcode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(foodData);
    }
  };

  return (
    <div className="calfit-card p-5 space-y-5 animate-scale-in">
      <div className="flex items-center mb-4">
        <button 
          onClick={onCancel}
          className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-semibold">Ajouter un aliment</h3>
      </div>
      
      {initialBarcode && <BarcodeInfo barcode={initialBarcode} />}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FoodForm foodData={foodData} onChange={handleChange} />
        <FormActions onCancel={onCancel} onSubmit={handleSubmit} />
      </form>
    </div>
  );
};

export default ManualFoodEntry;
