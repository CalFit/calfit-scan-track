import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  user_id?: string;
  category_id?: string;
  is_favorite?: boolean;
  barcode?: string;
  serving_size?: number;
  serving_unit?: string;
  image_url?: string;
  brand?: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  icon: string;
}

export function useFoodDatabase() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fonction temporaire/simulée pour ne pas causer d'erreurs
  const fetchFoods = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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
          user_id: item.user_id,
        }));
        
        setFoods(convertedFoods);
      }
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
  }, []);

  // Fonction pour ajouter un nouvel aliment
  const addFood = async (newFood: Omit<Food, 'id'>) => {
    try {
      setIsLoading(true);
      
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
          user_id: data[0].user_id,
        };
        
        setFoods(prev => [...prev, addedFood]);
        
        toast({
          title: 'Aliment ajouté',
          description: `${newFood.name} a été ajouté à votre base de données.`,
        });
      }
      
      return data ? data[0] : null;
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

  // Autres fonctions...

  return {
    foods,
    categories,
    isLoading,
    error,
    fetchFoods,
    addFood,
    // ... autres fonctions exportées
  };
}
