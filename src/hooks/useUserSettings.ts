import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface MacroTargets {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface UserSettings {
  name: string;
  macroTargets: MacroTargets;
  notifications: boolean;
}

// Valeurs par défaut
const defaultSettings: UserSettings = {
  name: "Alexandre",
  macroTargets: {
    calories: 2200,
    protein: 120,
    fat: 70,
    carbs: 250
  },
  notifications: true
};

// Clé pour le stockage local
const SETTINGS_STORAGE_KEY = 'calfit-user-settings';

export function useUserSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les paramètres depuis le stockage local au démarrage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Sauvegarder les paramètres dans le stockage local
  const saveSettings = (newSettings: UserSettings) => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      
      toast({
        title: "Modifications sauvegardées",
        description: "Vos paramètres ont été mis à jour avec succès.",
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos paramètres.",
        variant: "destructive",
        duration: 3000,
      });
      
      return false;
    }
  };

  // Mettre à jour un paramètre spécifique
  const updateSettings = (partialSettings: Partial<UserSettings>) => {
    const newSettings = {
      ...settings,
      ...partialSettings
    };
    return saveSettings(newSettings);
  };

  // Réinitialiser les paramètres
  const resetSettings = () => {
    return saveSettings(defaultSettings);
  };

  return {
    settings,
    isLoading,
    saveSettings,
    updateSettings,
    resetSettings
  };
}
