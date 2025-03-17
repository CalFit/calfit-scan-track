
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFoodDatabase } from '@/hooks/useFoodDatabase';
import { useNavigate } from 'react-router-dom';

const AddFoodPage = () => {
  const navigate = useNavigate();
  const { categories, addFood } = useFoodDatabase();
  
  const [foodData, setFoodData] = useState({
    name: '',
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    category_id: '',
    barcode: '',
    serving_size: 100,
    serving_unit: 'g',
    is_favorite: false,
    image_url: null // Add the missing image_url property
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFoodData({
        ...foodData,
        [name]: parseFloat(value) || 0
      });
    } else if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFoodData({
        ...foodData,
        [name]: target.checked
      });
    } else {
      setFoodData({
        ...foodData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Créer l'objet d'aliment avec tous les champs requis
    const newFood = {
      ...foodData,
      user_id: null // Aliment accessible à tous (valeur par défaut)
    };
    
    const result = await addFood(newFood);
    
    if (result) {
      navigate('/food-search');
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-4 pb-16">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Ajouter un aliment</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
                         focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="category_id">
              Catégorie
            </label>
            <select
              id="category_id"
              name="category_id"
              value={foodData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
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
                         focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
              required
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
                step="0.1"
                placeholder="0"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
                required
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
                step="0.1"
                placeholder="0"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
                required
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
                step="0.1"
                placeholder="0"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="serving_size">
                Portion
              </label>
              <input
                type="number"
                id="serving_size"
                name="serving_size"
                value={foodData.serving_size || ''}
                onChange={handleChange}
                min="0"
                step="1"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="serving_unit">
                Unité
              </label>
              <select
                id="serving_unit"
                name="serving_unit"
                value={foodData.serving_unit}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
              >
                <option value="g">grammes (g)</option>
                <option value="ml">millilitres (ml)</option>
                <option value="unité">unité</option>
                <option value="portion">portion</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="barcode">
              Code-barres (optionnel)
            </label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={foodData.barcode}
              onChange={handleChange}
              placeholder="Ex: 3017620422003"
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-[#3498DB] dark:bg-gray-800"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_favorite"
              name="is_favorite"
              checked={foodData.is_favorite}
              onChange={handleChange}
              className="h-4 w-4 text-[#3498DB] focus:ring-[#3498DB]"
            />
            <label htmlFor="is_favorite" className="ml-2 text-sm">
              Ajouter aux favoris
            </label>
          </div>
          
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-[#3498DB] hover:bg-[#3498DB]/90"
            >
              Ajouter l'aliment
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddFoodPage;
