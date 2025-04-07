
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/auth';
import { MacroTargets } from '@/hooks/useUserSettings';
import { UserGoal } from '@/types/supabase-types';

export function useUserGoals() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [goals, setGoals] = useState<MacroTargets | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les objectifs nutritionnels
  const loadUserGoals = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Récupérer les objectifs depuis Supabase en utilisant any pour contourner les limitations de type
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Erreur lors du chargement des objectifs:", error);
        // Si les objectifs n'existent pas encore, ce n'est pas une erreur à afficher
        if (error.code !== 'PGRST116') {
          throw error;
        }
      }

      if (data) {
        setGoals({
          calories: data.calories,
          protein: data.protein,
          fat: data.fat,
          carbs: data.carbs
        });
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement des objectifs:", err);
      setError("Impossible de charger vos objectifs nutritionnels");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour sauvegarder les objectifs nutritionnels
  const saveUserGoals = async (newGoals: MacroTargets) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder vos objectifs",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Vérifier si les objectifs existent déjà
      const { data: existingGoals, error: checkError } = await supabase
        .from('user_goals')
        .select('id')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;

      if (existingGoals) {
        // Mettre à jour les objectifs existants
        result = await supabase
          .from('user_goals')
          .update({
            calories: newGoals.calories,
            protein: newGoals.protein,
            fat: newGoals.fat,
            carbs: newGoals.carbs,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      } else {
        // Insérer de nouveaux objectifs
        result = await supabase
          .from('user_goals')
          .insert({
            id: user.id,
            calories: newGoals.calories,
            protein: newGoals.protein,
            fat: newGoals.fat,
            carbs: newGoals.carbs
          });
      }

      if (result.error) throw result.error;

      // Mettre à jour l'état local
      setGoals(newGoals);

      toast({
        title: "Objectifs sauvegardés",
        description: "Vos objectifs nutritionnels ont été enregistrés avec succès",
      });

      return true;
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde des objectifs:", err);
      setError("Impossible de sauvegarder vos objectifs nutritionnels");
      
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos objectifs",
        variant: "destructive",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les objectifs au montage du composant si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      loadUserGoals();
    } else {
      setGoals(null);
      setIsLoading(false);
    }
  }, [user]);

  return {
    goals,
    isLoading,
    error,
    saveUserGoals,
    loadUserGoals
  };
}
