import { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useTheme } from '@/providers/ThemeProvider';
import { Settings, Sun, Moon } from 'lucide-react';
import { useUserSettings, MacroTargets } from '@/hooks/useUserSettings';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  const { settings, saveSettings, isLoading } = useUserSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const { theme, setTheme } = useTheme();

  // Mettre à jour les valeurs locales lorsque les paramètres sont chargés
  useEffect(() => {
    if (!isLoading) {
      setLocalSettings(settings);
    }
  }, [settings, isLoading]);

  // Vérifier s'il y a des modifications non enregistrées
  useEffect(() => {
    if (!isLoading) {
      const isDifferent = 
        localSettings.name !== settings.name ||
        localSettings.notifications !== settings.notifications ||
        localSettings.macroTargets.calories !== settings.macroTargets.calories ||
        localSettings.macroTargets.protein !== settings.macroTargets.protein ||
        localSettings.macroTargets.fat !== settings.macroTargets.fat ||
        localSettings.macroTargets.carbs !== settings.macroTargets.carbs;
      
      setHasChanges(isDifferent);
    }
  }, [localSettings, settings, isLoading]);

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      macroTargets: {
        ...prev.macroTargets,
        [name]: Number(value)
      }
    }));
  };

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

  const handleSaveChanges = () => {
    saveSettings(localSettings);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <span className="text-white">Chargement des paramètres...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold mb-2 text-black">Réglages</h1>
          <p className="text-black">
            Personnalisez votre expérience
          </p>
        </header>

        <div className="calfit-card">
          <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <Settings className="text-calfit-blue w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold text-black">Profil</h3>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-black">
                Nom
              </label>
              <input
                type="text"
                id="name"
                value={localSettings.name}
                onChange={handleNameChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-black">Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={localSettings.notifications}
                  onChange={handleNotificationsChange}
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-calfit-blue"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="calfit-card">
          <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-black">Objectifs nutritionnels</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="calories" className="block text-sm font-medium mb-1 text-black">
                Calories (kcal)
              </label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={localSettings.macroTargets.calories}
                onChange={handleTargetChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="protein" className="block text-sm font-medium mb-1 text-black">
                Protéines (g)
              </label>
              <input
                type="number"
                id="protein"
                name="protein"
                value={localSettings.macroTargets.protein}
                onChange={handleTargetChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="fat" className="block text-sm font-medium mb-1 text-black">
                Lipides (g)
              </label>
              <input
                type="number"
                id="fat"
                name="fat"
                value={localSettings.macroTargets.fat}
                onChange={handleTargetChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="carbs" className="block text-sm font-medium mb-1 text-black">
                Glucides (g)
              </label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                value={localSettings.macroTargets.carbs}
                onChange={handleTargetChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="calfit-card">
          <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <Settings className="text-calfit-blue w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold text-black">Apparence</h3>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-black">Thème sombre</span>
              <Switch
                id="theme"
                checked={theme === "dark"}
                onCheckedChange={(checked) => {
                  setTheme(checked ? "dark" : "light");
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <Button
            className={`${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSaveChanges}
            disabled={!hasChanges}
            variant="default"
          >
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
