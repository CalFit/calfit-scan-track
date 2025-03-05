
import { useState } from 'react';
import { Apple, ArrowLeft } from 'lucide-react';

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  barcode?: string;
}

interface ManualFoodEntryProps {
  initialBarcode: string | null;
  onSubmit: (food: FoodItem) => void;
  onCancel: () => void;
}

const ManualFoodEntry = ({ initialBarcode, onSubmit, onCancel }: ManualFoodEntryProps) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!foodData.name) {
      alert('Le nom de l'aliment est requis');
      return;
    }
    
    onSubmit(foodData);
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
      
      {initialBarcode && (
        <div className="px-4 py-3 bg-calfit-light-blue dark:bg-blue-900/20 rounded-lg text-sm">
          <p>Code-barres détecté : <span className="font-mono font-medium">{initialBarcode}</span></p>
          <p className="text-xs text-muted-foreground mt-1">
            Cet aliment sera ajouté à notre base de données
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Nom de l'aliment
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={foodData.name}
            onChange={handleChange}
            placeholder="Ex: Yaourt Grec Protéiné"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-calfit-green dark:bg-gray-800"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="calories">
            Calories
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            value={foodData.calories || ''}
            onChange={handleChange}
            min="0"
            placeholder="0"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-calfit-green dark:bg-gray-800"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="protein">
              Protéines (g)
            </label>
            <input
              type="number"
              id="protein"
              name="protein"
              value={foodData.protein || ''}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-calfit-green dark:bg-gray-800"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="fat">
              Lipides (g)
            </label>
            <input
              type="number"
              id="fat"
              name="fat"
              value={foodData.fat || ''}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-calfit-green dark:bg-gray-800"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="carbs">
              Glucides (g)
            </label>
            <input
              type="number"
              id="carbs"
              name="carbs"
              value={foodData.carbs || ''}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-calfit-green dark:bg-gray-800"
            />
          </div>
        </div>
        
        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="calfit-button-secondary flex-1"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="calfit-button-primary flex-1"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualFoodEntry;
