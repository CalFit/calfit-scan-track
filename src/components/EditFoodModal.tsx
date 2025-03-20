import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Apple, X } from 'lucide-react';

interface FoodItem {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface EditFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (food: FoodItem) => void;
  food: FoodItem | null;
}

const EditFoodModal = ({ isOpen, onClose, onSave, food }: EditFoodModalProps) => {
  const [foodData, setFoodData] = useState<FoodItem | null>(null);

  useEffect(() => {
    if (food) {
      setFoodData({ ...food });
    }
  }, [food]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!foodData) return;
    
    const { name, value } = e.target;
    
    // Convert to number for numeric fields
    const numericFields = ['calories', 'protein', 'fat', 'carbs'];
    const processedValue = numericFields.includes(name) 
      ? parseFloat(value) || 0 
      : value;
    
    setFoodData({
      ...foodData,
      [name]: processedValue
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodData) return;
    
    // Basic validation
    if (!foodData.name) {
      alert("Le nom de l'aliment est requis");
      return;
    }
    
    onSave(foodData);
    onClose();
  };

  if (!foodData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier l'aliment</DialogTitle>
        </DialogHeader>
        
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
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
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
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                       focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
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
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
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
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
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
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#3498DB] hover:bg-[#3498DB]/90"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFoodModal;
