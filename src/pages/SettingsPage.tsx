
import { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MacroTargets {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

const SettingsPage = () => {
  const [macroTargets, setMacroTargets] = useState<MacroTargets>({
    calories: 2200,
    protein: 120,
    fat: 70,
    carbs: 250
  });

  const [name, setName] = useState("Alexandre");
  const [notifications, setNotifications] = useState(true);
  const [initialValues, setInitialValues] = useState({
    name,
    macroTargets,
    notifications
  });

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMacroTargets(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleSaveChanges = () => {
    // On sauvegarderait normalement dans une base de données
    // Mais pour cette démo, on met simplement à jour les valeurs initiales
    setInitialValues({
      name,
      macroTargets,
      notifications
    });
    
    // Afficher une notification de succès
    toast({
      title: "Modifications sauvegardées",
      description: "Vos paramètres ont été mis à jour avec succès.",
      duration: 3000,
    });
  };

  // Vérifier si des modifications ont été apportées
  const hasChanges = () => {
    return (
      name !== initialValues.name ||
      notifications !== initialValues.notifications ||
      macroTargets.calories !== initialValues.macroTargets.calories ||
      macroTargets.protein !== initialValues.macroTargets.protein ||
      macroTargets.fat !== initialValues.macroTargets.fat ||
      macroTargets.carbs !== initialValues.macroTargets.carbs
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold mb-2 text-white">Réglages</h1>
          <p className="text-white">
            Personnalisez votre expérience
          </p>
        </header>

        <div className="calfit-card">
          <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <Settings className="text-calfit-blue w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold text-white">Profil</h3>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-white">
                Nom
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-calfit-blue"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="calfit-card">
          <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-white">Objectifs nutritionnels</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="calories" className="block text-sm font-medium mb-1 text-white">
                Calories (kcal)
              </label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={macroTargets.calories}
                onChange={handleTargetChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="protein" className="block text-sm font-medium mb-1 text-white">
                Protéines (g)
              </label>
              <input
                type="number"
                id="protein"
                name="protein"
                value={macroTargets.protein}
                onChange={handleTargetChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="fat" className="block text-sm font-medium mb-1 text-white">
                Lipides (g)
              </label>
              <input
                type="number"
                id="fat"
                name="fat"
                value={macroTargets.fat}
                onChange={handleTargetChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="carbs" className="block text-sm font-medium mb-1 text-white">
                Glucides (g)
              </label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                value={macroTargets.carbs}
                onChange={handleTargetChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              />
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <button 
            className={`calfit-button-secondary ${!hasChanges() ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSaveChanges}
            disabled={!hasChanges()}
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
