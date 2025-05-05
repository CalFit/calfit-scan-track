
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Food } from "@/types/supabase";

export interface FoodCategory {
  id: string;
  name: string;
  icon: string;
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface RecentMeals {
  breakfast: Food[];
  lunch: Food[];
  dinner: Food[];
}

export function useFoodDatabase() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentMeals, setRecentMeals] = useState<RecentMeals>({
    breakfast: [],
    lunch: [],
    dinner: []
  });
  const { toast } = useToast();

  // Effect to filter foods when searchTerm changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = foods.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFoods(filtered);
    } else {
      setFilteredFoods([]);
    }
  }, [searchTerm, foods]);

  // Fonction pour récupérer les aliments
  const fetchFoods = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For now, we'll use mock data until Supabase is properly configured
      /* 
      const { data, error } = await supabase
        .from('foods')
        .select('*');
        
      if (error) throw error;
      
      if (data) {
        // Convertir les données pour qu'elles correspondent à l'interface Food
        const convertedFoods: Food[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          calories: item.calories,
          protein: item.protein || 0,
          fat: item.fat || 0,
          carbs: item.carbs || 0,
          // L'erreur était ici - assurons-nous que user_id est défini si présent dans item
          ...(item.user_id && { user_id: item.user_id })
        }));
        
        setFoods(convertedFoods);
      }
      */
      
      // Mock data for development
      const mockFoods: Food[] = [
        {
          id: "1",
          name: "Yaourt grec",
          calories: 100,
          protein: 10,
          fat: 0,
          carbs: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_favorite: false,
          barcode: null,
          category_id: null,
          serving_size: 100,
          serving_unit: "g",
          image_url: null,
          user_id: null
        },
        {
          id: "2",
          name: "Banane",
          calories: 105,
          protein: 1.3,
          fat: 0.4,
          carbs: 27,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_favorite: false,
          barcode: null,
          category_id: null,
          serving_size: 120,
          serving_unit: "g",
          image_url: null,
          user_id: null
        }
      ];
      
      setFoods(mockFoods);
      
    } catch (e) {
      console.error('Error fetching foods:', e);
      setError('Impossible de récupérer les aliments');
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement initial des données
  useEffect(() => {
    fetchFoods();
    // Initialisez des catégories vides pour éviter les erreurs
    setCategories([]);

    // Simulons des repas récents pour le développement
    // Cette partie serait normalement remplacée par une requête à la base de données
    setRecentMeals({
      breakfast: [
        {
          id: "1",
          name: "Yaourt grec",
          calories: 100,
          protein: 10,
          fat: 0,
          carbs: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_favorite: false,
          barcode: null,
          category_id: null,
          serving_size: 100,
          serving_unit: "g",
          image_url: null,
          user_id: null
        },
        {
          id: "2",
          name: "Banane",
          calories: 105,
          protein: 1.3,
          fat: 0.4,
          carbs: 27,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_favorite: false,
          barcode: null,
          category_id: null,
          serving_size: 120,
          serving_unit: "g",
          image_url: null,
          user_id: null
        }
      ],
      lunch: [
        {
          id: "3",
          name: "Poulet grillé",
          calories: 165,
          protein: 31,
          fat: 3.6,
          carbs: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_favorite: false,
          barcode: null,
          category_id: null,
          serving_size: 100,
          serving_unit: "g",
          image_url: null,
          user_id: null
        },
        {
          id: "4",
          name: "Riz brun",
          calories: 112,
          protein: 2.6,
          fat: 0.9,
          carbs: 23,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_favorite: false,
          barcode: null,
          category_id: null,
          serving_size: 100,
          serving_unit: "g",
          image_url: null,
          user_id: null
        }
      ],
      dinner: [
        {
          id: "5",
          name: "Saumon",
          calories: 208,
          protein: 20,
          fat: 13,
          carbs: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_favorite: false,
          barcode: null,
          category_id: null,
          serving_size: 100,
          serving_unit: "g",
          image_url: null,
          user_id: null
        },
        {
          id: "6",
          name: "Salade mixte",
          calories: 25,
          protein: 1.5,
          fat: 0.3,
          carbs: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_favorite: false,
          barcode: null,
          category_id: null,
          serving_size: 100,
          serving_unit: "g",
          image_url: null,
          user_id: null
        }
      ]
    });
  }, []);

  // Fonction pour ajouter un nouvel aliment
  const addFood = async (newFood: Omit<Food, 'id'>) => {
    try {
      setIsLoading(true);
      
      // For now, we'll use mock data until Supabase is properly configured
      /*
      const { data, error } = await supabase
        .from('foods')
        .insert([newFood])
        .select();
      
      if (error) throw error;
      
      if (data) {
        // Convertir les données pour qu'elles correspondent à l'interface Food
        const addedFood: Food = {
          id: data[0].id,
          name: data[0].name,
          calories: data[0].calories,
          protein: data[0].protein || 0,
          fat: data[0].fat || 0,
          carbs: data[0].carbs || 0,
        };

        // If data[0] has user_id property, add it to addedFood
        if ('user_id' in data[0] && data[0].user_id !== null) {
          addedFood.user_id = data[0].user_id as string;
        }
        
        setFoods(prev => [...prev, addedFood]);
        
        toast({
          title: 'Aliment ajouté',
          description: `${newFood.name} a été ajouté à votre base de données.`,
        });
      }
      
      return data ? data[0] : null;
      */
      
      // Create mock data with generated ID
      const mockAddedFood: Food = {
        ...newFood,
        id: `new-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_favorite: newFood.is_favorite || false,
        barcode: newFood.barcode || null,
        category_id: newFood.category_id || null,
        image_url: newFood.image_url || null,
        serving_size: newFood.serving_size || null,
        serving_unit: newFood.serving_unit || null,
        user_id: newFood.user_id || null
      };
      
      setFoods(prev => [...prev, mockAddedFood]);
      
      toast({
        title: 'Aliment ajouté',
        description: `${newFood.name} a été ajouté à votre base de données.`,
      });
      
      return mockAddedFood;
    } catch (e) {
      console.error('Error adding food:', e);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter cet aliment à la base de données.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ajouter un aliment à un repas spécifique
  const addFoodToMeal = (foodId: string, mealType: MealType) => {
    const foodToAdd = foods.find(food => food.id === foodId);
    
    if (!foodToAdd) {
      toast({
        title: 'Erreur',
        description: 'Aliment introuvable.',
        variant: 'destructive',
      });
      return;
    }
    
    setRecentMeals(prev => ({
      ...prev,
      [mealType]: [foodToAdd, ...prev[mealType].slice(0, 4)] // Garde les 5 derniers aliments max
    }));
    
    toast({
      title: 'Aliment ajouté',
      description: `${foodToAdd.name} a été ajouté à votre ${mealType === 'breakfast' ? 'petit-déjeuner' : mealType === 'lunch' ? 'déjeuner' : 'dîner'}.`
    });
  };

  return {
    foods,
    categories,
    isLoading,
    error,
    fetchFoods,
    addFood,
    filteredFoods,
    searchTerm,
    setSearchTerm,
    recentMeals,
    addFoodToMeal
  };
}
