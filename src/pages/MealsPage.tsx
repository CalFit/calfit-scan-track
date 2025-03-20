import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, ScanBarcode } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import { useNutritionTracker } from '@/hooks/useNutritionTracker';
import { useFoodActions } from '@/hooks/useFoodActions';
import MealList from '@/components/meals/MealList';
import AddFoodModal from '@/components/AddFoodModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FoodItem } from '@/components/meals/MealList';

const MealsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    nutritionData, 
    meals, 
    setMeals, 
    activeMeal, 
    setActiveMeal,
    updateNutritionData,
    getRecentFoodsForMeal
  } = useNutritionTracker();
  
  const { 
    showAddFood,
    setShowAddFood,
    handleAddFoodClick,
    handleAddFood,
    handleRemoveFood,
    handleEditFood
  } = useFoodActions({ updateNutritionData, setMeals, setActiveMeal });

  const filteredMeals = searchTerm 
    ? {
        breakfast: {
          ...meals.breakfast,
          items: meals.breakfast.items.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        },
        lunch: {
          ...meals.lunch,
          items: meals.lunch.items.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        },
        dinner: {
          ...meals.dinner,
          items: meals.dinner.items.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }
      }
    : meals;

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Mes Repas</h1>
        
        <div className="sticky top-0 z-10 bg-background pt-2 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un aliment..."
              className="pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between gap-2 mb-6">
          <Button 
            className="flex-1 gap-2" 
            onClick={() => handleAddFoodClick('breakfast')}
          >
            <Plus size={16} />
            Ajouter
          </Button>
          
          <Link to="/food-search" className="flex-1">
            <Button className="w-full gap-2" variant="outline">
              <Search size={16} />
              Rechercher
            </Button>
          </Link>
          
          <Link to="/scanner" className="flex-1">
            <Button className="w-full gap-2" variant="secondary">
              <ScanBarcode size={16} />
              Scanner
            </Button>
          </Link>
        </div>
        
        <MealList
          meals={filteredMeals}
          proteinTarget={nutritionData.protein.target}
          fatTarget={nutritionData.fat.target}
          carbsTarget={nutritionData.carbs.target}
          onAddFoodClick={handleAddFoodClick}
          onRemoveFood={handleRemoveFood}
          onEditFood={handleEditFood}
        />
      </div>
      
      {showAddFood && activeMeal && (
        <AddFoodModal
          isOpen={showAddFood}
          onClose={() => setShowAddFood(false)}
          onAddFood={(food) => handleAddFood(food, activeMeal)}
          mealType={activeMeal}
          recentFoods={getRecentFoodsForMeal()}
        />
      )}
    </MainLayout>
  );
};

export default MealsPage;
