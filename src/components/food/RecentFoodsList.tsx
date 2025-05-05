
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecentFood } from '@/hooks/useRecentFoods';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Food } from '@/types/supabase';

interface RecentFoodsListProps {
  foods: RecentFood[];
  isLoading: boolean;
  onAddFood: (food: Food) => void;
}

const RecentFoodsList: React.FC<RecentFoodsListProps> = ({ 
  foods, 
  isLoading,
  onAddFood 
}) => {
  const convertToFood = (recentFood: RecentFood): Food => {
    return {
      id: recentFood.food_id,
      name: recentFood.name,
      calories: recentFood.calories,
      protein: recentFood.protein,
      fat: recentFood.fat,
      carbs: recentFood.carbs,
      serving_unit: recentFood.serving_unit,
      created_at: new Date().toISOString(), // Ces champs ne sont pas importants pour l'ajout
      updated_at: new Date().toISOString(),
      is_favorite: false,
      barcode: null,
      category_id: null,
      image_url: null,
      serving_size: recentFood.quantity,
      user_id: null
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-muted-foreground">Chargement de l'historique...</p>
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-muted-foreground">Aucun aliment récent pour ce repas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {foods.map((food) => (
        <Card key={food.id} className="overflow-hidden">
          <div className="flex items-center">
            <div className="flex-1 p-3">
              <div className="font-medium">{food.name}</div>
              <div className="text-sm text-muted-foreground">
                {food.quantity} {food.serving_unit} - {food.calories} cal
              </div>
              <div className="text-xs flex gap-2 mt-1">
                <span className="bg-calfit-light-blue text-calfit-blue px-2 py-0.5 rounded-full">
                  {food.protein}g P
                </span>
                <span className="bg-calfit-light-green text-calfit-green px-2 py-0.5 rounded-full">
                  {food.carbs}g G
                </span>
                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                  {food.fat}g L
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="mr-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => onAddFood(convertToFood(food))}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RecentFoodsList;
