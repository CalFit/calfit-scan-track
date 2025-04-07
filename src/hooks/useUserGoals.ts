
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

      // Récupérer les objectifs depuis Supabase
      const { data, error: fetchError } = await supabase
        .from('user_goals')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Erreur lors du chargement des objectifs:", fetchError);
        // Si ce n'est pas une erreur "not found", traiter comme une vraie erreur
        if (fetchError.code !== 'PGRST116') {
          throw fetchError;
        }
      }

      if (data) {
        setGoals({
          calories: data.calories,
          protein: data.protein,
          fat: data.fat,
          carbs: data.carbs
        });
      } else {
        // Pas de données trouvées, mais ce n'est pas une erreur
        setGoals(null);
        console.log("Aucun objectif trouvé pour cet utilisateur");
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
        .maybeSingle();

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

  // Fonction pour réinitialiser les objectifs nutritionnels
  const resetUserGoals = async () => {
    if (!user) return false;

    try {
      setIsLoading(true);
      setError(null);

      // Option 1: Supprimer les objectifs existants
      const { error: deleteError } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', user.id);

      if (deleteError) throw deleteError;

      // Réinitialiser l'état local
      setGoals(null);

      return true;
    } catch (err: any) {
      console.error("Erreur lors de la réinitialisation des objectifs:", err);
      setError("Impossible de réinitialiser vos objectifs nutritionnels");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Configuration de la subscription en temps réel
  useEffect(() => {
    if (!user) return;
    
    // Charger les objectifs initiaux
    loadUserGoals();
    
    // Créer une souscription aux mises à jour de objectifs
    const channel = supabase
      .channel('user_goals_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_goals',
          filter: `id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Changement détecté dans user_goals:', payload);
          
          // Si c'est une suppression, mettre goals à null
          if (payload.eventType === 'DELETE') {
            setGoals(null);
            toast({
              title: "Objectifs réinitialisés",
              description: "Vos objectifs nutritionnels ont été réinitialisés.",
            });
            return;
          }
          
          // Recharger les objectifs pour les autres types d'événements
          loadUserGoals();
          
          // Notification de mise à jour (uniquement pour les mises à jour, pas pour la première charge)
          if (payload.eventType === 'UPDATE') {
            toast({
              title: "Objectifs mis à jour",
              description: "Vos objectifs nutritionnels ont été synchronisés.",
            });
          } else if (payload.eventType === 'INSERT') {
            toast({
              title: "Objectifs créés",
              description: "Vos objectifs nutritionnels ont été créés et synchronisés.",
            });
          }
        }
      )
      .subscribe();
    
    // Nettoyer la souscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    goals,
    isLoading,
    error,
    saveUserGoals,
    loadUserGoals,
    resetUserGoals
  };
}
