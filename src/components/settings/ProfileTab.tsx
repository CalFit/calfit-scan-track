
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";

const ProfileTab = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast(); // Properly initialize the toast function
  const { settings, saveSettings, isLoading: isLoadingSettings } = useUserSettings();
  const { profile, updateProfile, isLoading: isLoadingProfile, loadUserProfile } = useUserProfile();
  
  const [localSettings, setLocalSettings] = useState(settings);
  const [localProfile, setLocalProfile] = useState({
    age: profile?.age || '',
    height: profile?.height || '',
    weight: profile?.weight || '',
    body_fat_percentage: profile?.body_fat_percentage || ''
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const isDarkTheme = theme === 'dark';
  const isLoading = isLoadingSettings || isLoadingProfile;

  // Mettre à jour les valeurs locales lorsque les paramètres et le profil sont chargés
  useEffect(() => {
    if (!isLoadingSettings) {
      setLocalSettings(settings);
    }
    if (!isLoadingProfile && profile) {
      setLocalProfile({
        age: profile.age || '',
        height: profile.height || '',
        weight: profile.weight || '',
        body_fat_percentage: profile.body_fat_percentage || ''
      });
    }
  }, [settings, profile, isLoadingSettings, isLoadingProfile]);

  // Recharger les données du profil lorsque l'utilisateur change
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  // Vérifier s'il y a des modifications non enregistrées
  useEffect(() => {
    if (!isLoading) {
      // Vérifier les changements dans les paramètres
      const isSettingsDifferent = localSettings?.name !== settings?.name ||
                                 localSettings?.notifications !== settings?.notifications;
      
      // Vérifier les changements dans le profil
      const isProfileDifferent = 
        (profile?.age !== (localProfile.age === '' ? null : Number(localProfile.age))) || 
        (profile?.height !== (localProfile.height === '' ? null : Number(localProfile.height))) || 
        (profile?.weight !== (localProfile.weight === '' ? null : Number(localProfile.weight))) || 
        (profile?.body_fat_percentage !== (localProfile.body_fat_percentage === '' ? null : Number(localProfile.body_fat_percentage)));

      setHasChanges(isSettingsDifferent || isProfileDifferent);
    }
  }, [localSettings, settings, localProfile, profile, isLoading]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSettings(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handleNotificationsChange = () => {
    setLocalSettings(prev => ({
      ...prev,
      notifications: !prev.notifications
    }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    // Sauvegarder les paramètres de base
    const settingsSaved = await saveSettings(localSettings);
    
    // Sauvegarder les données du profil si l'utilisateur est connecté
    let profileSaved = true;
    if (user) {
      profileSaved = await updateProfile({
        age: localProfile.age === '' ? null : Number(localProfile.age),
        height: localProfile.height === '' ? null : Number(localProfile.height),
        weight: localProfile.weight === '' ? null : Number(localProfile.weight),
        body_fat_percentage: localProfile.body_fat_percentage === '' ? null : Number(localProfile.body_fat_percentage)
      });
    }
    
    if (settingsSaved && profileSaved) {
      setHasChanges(false);
      
      // Notification de succès
      toast({
        title: "Modifications enregistrées",
        description: "Vos informations de profil ont été mises à jour et synchronisées.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="calfit-card">
        <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="calfit-card">
      <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <User className="text-calfit-blue w-5 h-5 mr-2" />
          <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>
            Informations générales
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label htmlFor="name" className={`block text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-black'}`}>
            Nom d'utilisateur
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={localSettings?.name || ''}
            onChange={handleNameChange}
            className={`mt-1 block w-full p-2 border ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm`}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-black'}`}>Notifications</span>
          <Switch
            checked={localSettings?.notifications || false}
            onCheckedChange={handleNotificationsChange}
          />
        </div>
        
        {/* Nouvelles données personnelles */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className={`mb-3 font-semibold ${isDarkTheme ? 'text-white' : 'text-black'}`}>
            Données personnelles
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className={`block text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                Âge (années)
              </label>
              <input
                type="number"
                id="age"
                name="age"
                min="0"
                max="120"
                value={localProfile.age}
                onChange={handleProfileChange}
                className={`mt-1 block w-full p-2 border ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm`}
              />
            </div>
            
            <div>
              <label htmlFor="height" className={`block text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                Taille (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                min="0"
                max="300"
                step="0.1"
                value={localProfile.height}
                onChange={handleProfileChange}
                className={`mt-1 block w-full p-2 border ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm`}
              />
            </div>
            
            <div>
              <label htmlFor="weight" className={`block text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                Poids (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                min="0"
                max="500"
                step="0.1"
                value={localProfile.weight}
                onChange={handleProfileChange}
                className={`mt-1 block w-full p-2 border ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm`}
              />
            </div>
            
            <div>
              <label htmlFor="body_fat_percentage" className={`block text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-black'}`}>
                % Graisse corporelle
              </label>
              <input
                type="number"
                id="body_fat_percentage"
                name="body_fat_percentage"
                min="0"
                max="100"
                step="0.1"
                value={localProfile.body_fat_percentage}
                onChange={handleProfileChange}
                className={`mt-1 block w-full p-2 border ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm`}
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <Button
            className={`w-full ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSaveChanges}
            disabled={!hasChanges}
            variant="default"
          >
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
