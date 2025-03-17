
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Food, FoodCategory, MealLog } from "@/types/supabase";

export function useFoodDatabase() {
  const { toast } = useToast();
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [recentMeals, setRecentMeals] = useState<{
    breakfast: (Food & { quantity: number })[];
    lunch: (Food & { quantity: number })[];
    dinner: (Food & { quantity: number })[];
  }>({
    breakfast: [],
    lunch: [],
    dinner: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);

  // Charger les catégories alimentaires
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('food_categories')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          setCategories(data);
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des catégories:', error.message);
      }
    };

    fetchCategories();
  }, []);

  // Charger les aliments
  useEffect(() => {
    const fetchFoods = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('foods')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          setFoods(data);
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des aliments:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Filtrer les aliments en fonction du terme de recherche
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFoods([]);
      return;
    }

    const filtered = foods.filter(food => 
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFoods(filtered);
  }, [searchTerm, foods]);

  // Charger les repas récents pour chaque type de repas
  useEffect(() => {
    const fetchRecentMeals = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data: mealLogsData, error: mealLogsError } = await supabase
          .from('meal_logs')
          .select(`
            *,
            food:foods(*)
          `)
          .eq('date', today)
          .order('created_at', { ascending: false });
        
        if (mealLogsError) throw mealLogsError;
        
        if (mealLogsData) {
          // Grouper par type de repas
          const breakfastMeals: (Food & { quantity: number })[] = [];
          const lunchMeals: (Food & { quantity: number })[] = [];
          const dinnerMeals: (Food & { quantity: number })[] = [];
          
          mealLogsData.forEach((log: any) => {
            if (log.food) {
              const foodWithQuantity = {
                ...log.food,
                quantity: log.quantity
              };
              
              if (log.meal_type === 'breakfast') {
                breakfastMeals.push(foodWithQuantity);
              } else if (log.meal_type === 'lunch') {
                lunchMeals.push(foodWithQuantity);
              } else if (log.meal_type === 'dinner') {
                dinnerMeals.push(foodWithQuantity);
              }
            }
          });
          
          setRecentMeals({
            breakfast: breakfastMeals,
            lunch: lunchMeals,
            dinner: dinnerMeals
          });
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des repas récents:', error.message);
      }
    };

    fetchRecentMeals();
  }, []);

  // Ajouter un nouvel aliment
  const addFood = async (newFood: Omit<Food, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('foods')
        .insert([newFood])
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFoods(prev => [...prev, data]);
        
        toast({
          title: "Aliment ajouté",
          description: `${newFood.name} a été ajouté à la base de données`,
          duration: 3000,
        });
        
        return data;
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout d\'un aliment:', error.message);
      
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'aliment",
        variant: "destructive",
        duration: 3000,
      });
      
      return null;
    }
  };

  // Ajouter un aliment à un repas
  const addFoodToMeal = async (foodId: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', quantity: number = 1) => {
    try {
      const user = supabase.auth.getUser();
      const userId = (await user).data.user?.id;
      
      if (!userId) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter un aliment à un repas",
          variant: "destructive",
          duration: 3000,
        });
        return null;
      }
      
      const newMealLog = {
        user_id: userId,
        food_id: foodId,
        meal_type: mealType,
        quantity,
        date: new Date().toISOString().split('T')[0]
      };
      
      const { data, error } = await supabase
        .from('meal_logs')
        .insert([newMealLog])
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Obtenir les détails de l'aliment
        const { data: foodData } = await supabase
          .from('foods')
          .select('*')
          .eq('id', foodId)
          .single();
          
        if (foodData) {
          const foodWithQuantity = {
            ...foodData,
            quantity
          };
          
          // Mettre à jour les repas récents
          setRecentMeals(prev => ({
            ...prev,
            [mealType]: [foodWithQuantity, ...prev[mealType as keyof typeof prev]],
          }));
          
          toast({
            title: "Aliment ajouté au repas",
            description: `${foodData.name} a été ajouté à votre ${getMealTypeName(mealType)}`,
            duration: 3000,
          });
        }
        
        return data;
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout d\'un aliment à un repas:', error.message);
      
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'aliment au repas",
        variant: "destructive",
        duration: 3000,
      });
      
      return null;
    }
  };

  const getMealTypeName = (mealType: string): string => {
    switch (mealType) {
      case 'breakfast':
        return 'petit-déjeuner';
      case 'lunch':
        return 'déjeuner';
      case 'dinner':
        return 'dîner';
      case 'snack':
        return 'collation';
      default:
        return mealType;
    }
  };

  return {
    foods,
    categories,
    recentMeals,
    isLoading,
    searchTerm,
    setSearchTerm,
    filteredFoods,
    addFood,
    addFoodToMeal
  };
}
