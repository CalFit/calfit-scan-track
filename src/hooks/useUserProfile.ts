
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/auth';

export interface UserProfile {
  id: string;
  age: number | null;
  height: number | null;
  weight: number | null;
  body_fat_percentage: number | null;
  updated_at: string | null;
}

export function useUserProfile() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les données du profil utilisateur
  const loadUserProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Récupérer le profil utilisateur depuis Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Erreur lors du chargement du profil:", error);
        // Si le profil n'existe pas encore, ce n'est pas une erreur à afficher
        if (error.code !== 'PGRST116') {
          throw error;
        }
      }

      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement du profil:", err);
      setError("Impossible de charger votre profil");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour mettre à jour le profil utilisateur
  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour mettre à jour votre profil",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Vérifier si le profil existe déjà
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      let result;

      if (existingProfile) {
        // Mettre à jour le profil existant
        result = await supabase
          .from('user_profiles')
          .update({
            ...updatedProfile,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      } else {
        // Insérer un nouveau profil
        result = await supabase
          .from('user_profiles')
          .insert([
            {
              id: user.id,
              ...updatedProfile,
              updated_at: new Date().toISOString(),
            },
          ]);
      }

      if (result.error) throw result.error;

      // Mettre à jour l'état local
      setProfile(prev => prev ? { ...prev, ...updatedProfile } : { 
        id: user.id, 
        ...updatedProfile, 
        updated_at: new Date().toISOString() 
      } as UserProfile);

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
      });

      return true;
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du profil:", err);
      setError("Impossible de mettre à jour votre profil");
      
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos informations",
        variant: "destructive",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Charger le profil au montage du composant si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [user]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    loadUserProfile
  };
}
