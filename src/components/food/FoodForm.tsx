
import React from 'react';
import { FoodItem } from './types';

interface FoodFormProps {
  foodData: FoodItem;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FoodForm: React.FC<FoodFormProps> = ({ foodData, onChange }) => {
  // Fonction d'aide pour gérer la conversion de valeurs numériques
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, originalOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => {
    const { name, value } = e.target;
    
    // Créer un nouvel événement avec la même structure mais avec une valeur convertie
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: value // La valeur originale reste une chaîne
      }
    };
    
    // Appeler le gestionnaire original
    originalOnChange(newEvent);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Nom de l'aliment
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={foodData.name}
          onChange={onChange}
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
          onChange={(e) => handleNumberChange(e, onChange)}
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
            onChange={(e) => handleNumberChange(e, onChange)}
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
            onChange={(e) => handleNumberChange(e, onChange)}
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
            onChange={(e) => handleNumberChange(e, onChange)}
            min="0"
            placeholder="0"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-calfit-green dark:bg-gray-800"
          />
        </div>
      </div>
    </div>
  );
};

export default FoodForm;
