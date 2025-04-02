import { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useTheme } from '@/providers/ThemeProvider';
import { Settings, Sun, Moon, User, Calculator } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NutritionalQuestionnaire from '@/components/NutritionalQuestionnaire';

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
        localSettings?.name !== settings?.name ||
        localSettings?.notifications !== settings?.notifications ||
        localSettings?.macroTargets?.calories !== settings?.macroTargets?.calories ||
        localSettings?.macroTargets?.protein !== settings?.macroTargets?.protein ||
        localSettings?.macroTargets?.fat !== settings?.macroTargets?.fat ||
        localSettings?.macroTargets?.carbs !== settings?.macroTargets?.carbs;

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
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Réglages</h1>
          <p className={`text-md mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Gérez vos préférences et configurez votre profil
          </p>
        </header>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="profile" className="flex-1">Profil</TabsTrigger>
            <TabsTrigger value="calculator" className="flex-1">Calculateur</TabsTrigger>
            <TabsTrigger value="appearance" className="flex-1">Apparence</TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profile">
            <div className="calfit-card">
              <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <User className="text-calfit-blue w-5 h-5 mr-2" />
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Informations générales</h3>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={localSettings?.name || ''}
                    onChange={handleNameChange}
                    className={`mt-1 block w-full p-2 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm`}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Notifications</span>
                  <Switch
                    checked={localSettings?.notifications || false}
                    onCheckedChange={handleNotificationsChange}
                  />
                </div>
              </div>
            </div>

            <div className="calfit-card mt-6">
              <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <Settings className="text-calfit-blue w-5 h-5 mr-2" />
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Objectifs nutritionnels</h3>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label htmlFor="calories" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    value={localSettings?.macroTargets?.calories || ''}
                    onChange={handleTargetChange}
                    className={`mt-1 block w-full p-2 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm`}
                  />
                </div>
                <div>
                  <label htmlFor="protein" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    Protéines (g)
                  </label>
                  <input
                    type="number"
                    id="protein"
                    name="protein"
                    value={localSettings?.macroTargets?.protein || ''}
                    onChange={handleTargetChange}
                    className={`mt-1 block w-full p-2 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm`}
                  />
                </div>
                <div>
                  <label htmlFor="fat" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    Lipides (g)
                  </label>
                  <input
                    type="number"
                    id="fat"
                    name="fat"
                    value={localSettings?.macroTargets?.fat || ''}
                    onChange={handleTargetChange}
                    className={`mt-1 block w-full p-2 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm`}
                  />
                </div>
                <div>
                  <label htmlFor="carbs" className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    Glucides (g)
                  </label>
                  <input
                    type="number"
                    id="carbs"
                    name="carbs"
                    value={localSettings?.macroTargets?.carbs || ''}
                    onChange={handleTargetChange}
                    className={`mt-1 block w-full p-2 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} rounded-md shadow-sm`}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Onglet Calculateur */}
          <TabsContent value="calculator">
            <div className="calfit-card">
              <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <Calculator className="text-calfit-blue w-5 h-5 mr-2" />
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Calculateur de besoins nutritionnels</h3>
                </div>
              </div>
              <div className="p-4">
                <NutritionalQuestionnaire />
              </div>
            </div>
          </TabsContent>

          {/* Onglet Apparence */}
          <TabsContent value="appearance">
            <div className="calfit-card">
              <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  {theme === 'dark' ? <Moon className="text-calfit-blue w-5 h-5 mr-2" /> : <Sun className="text-calfit-blue w-5 h-5 mr-2" />}
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Apparence</h3>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Thème sombre</span>
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
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
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
