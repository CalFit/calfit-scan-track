
import { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Settings } from 'lucide-react';

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

  const [name, setName] = useState("Utilisateur");
  const [notifications, setNotifications] = useState(true);

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMacroTargets(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold mb-2">Réglages</h1>
          <p className="text-muted-foreground">
            Personnalisez votre expérience
          </p>
        </header>

        <div className="calfit-card">
          <div className="bg-calfit-green/20 p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <Settings className="text-calfit-green w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Profil</h3>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
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
              <span className="text-sm font-medium">Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-calfit-green"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="calfit-card">
          <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold">Objectifs nutritionnels</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="calories" className="block text-sm font-medium mb-1">
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
              <label htmlFor="protein" className="block text-sm font-medium mb-1">
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
              <label htmlFor="fat" className="block text-sm font-medium mb-1">
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
              <label htmlFor="carbs" className="block text-sm font-medium mb-1">
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
          <button className="calfit-button-primary">
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
