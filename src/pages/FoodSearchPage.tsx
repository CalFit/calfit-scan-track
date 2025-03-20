import { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useFoodDatabase } from '@/hooks/useFoodDatabase';
import { Search, Plus, Scan, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Food } from '@/types/supabase';
import { useNavigate } from 'react-router-dom';

const FoodSearchPage = () => {
  const navigate = useNavigate();
  const {
    foods,
    recentMeals,
    isLoading,
    searchTerm,
    setSearchTerm,
    filteredFoods,
    addFoodToMeal
  } = useFoodDatabase();
  
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [searchActive, setSearchActive] = useState(false);

  const handleSelectFood = (food: Food) => {
    addFoodToMeal(food.id, selectedMealType);
    setSearchTerm('');
    setSearchActive(false);
  };

  const getFoodEmoji = (foodName: string): string => {
    const foodIcons: Record<string, string> = {
      "yaourt": "🥄",
      "banane": "🍌",
      "œuf": "🥚",
      "pain": "🍞",
      "tomate": "🍅",
      "poulet": "🍗",
      "riz": "🍚",
      "pâtes": "🍝",
      "poisson": "🐟",
      "fromage": "🧀",
      "pomme": "🍎",
      "avocat": "🥑",
      "lait": "🥛",
      "café": "☕",
      "thé": "🍵",
      "jus": "🧃",
      "eau": "💧",
      "chocolat": "🍫",
      "salade": "🥗",
      "steak": "🥩",
      "sushi": "🍣",
      "carotte": "🥕",
      "orange": "🍊",
      "fraise": "🍓"
    };
    
    const lowerName = foodName.toLowerCase();
    for (const [key, emoji] of Object.entries(foodIcons)) {
      if (lowerName.includes(key)) {
        return emoji;
      }
    }
    return "🍽️";
  };

  const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <MainLayout>
      <div className="space-y-4 pb-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Aliments</h1>
          <div className="text-sm text-muted-foreground flex items-center">
            <Calendar className="w-4 h-4 mr-1.5" />
            <span>{getFormattedDate()}</span>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-900 px-4 py-3">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Rechercher un aliment..."
              className="flex-1 bg-transparent focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchActive(true);
              }}
            />
          </div>
          
          {/* Résultats de recherche */}
          {searchActive && filteredFoods.length > 0 && (
            <div className="absolute w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
              {filteredFoods.map((food) => (
                <button
                  key={food.id}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-left border-b border-gray-200 dark:border-gray-700 last:border-0"
                  onClick={() => handleSelectFood(food)}
                >
                  <div className="flex items-center">
                    <span className="mr-2.5 text-lg">{getFoodEmoji(food.name)}</span>
                    <span className="font-medium">{food.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{food.calories} kcal</span>
                </button>
              ))}
            </div>
          )}
          
          {searchActive && searchTerm && filteredFoods.length === 0 && (
            <div className="absolute w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 p-4 text-center">
              <p className="text-muted-foreground">Aucun aliment trouvé</p>
              <Button
                className="mt-2 w-full"
                variant="outline"
                onClick={() => navigate('/add-food')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un nouvel aliment
              </Button>
            </div>
          )}
        </div>

        {/* Sélecteur de repas */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {['breakfast', 'lunch', 'dinner'].map((mealType) => (
            <button
              key={mealType}
              className={`p-3 rounded-lg text-center transition-colors ${
                selectedMealType === mealType 
                  ? 'bg-[#3498DB]/20 dark:bg-[#3498DB]/30 border-2 border-[#3498DB]' 
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
              onClick={() => setSelectedMealType(mealType as 'breakfast' | 'lunch' | 'dinner')}
            >
              {mealType === 'breakfast' && 'Petit-déjeuner'}
              {mealType === 'lunch' && 'Déjeuner'}
              {mealType === 'dinner' && 'Dîner'}
            </button>
          ))}
        </div>

        {/* Aliments récents par repas */}
        <div className="mt-6">
          <div className="flex items-center mb-3">
            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
            <h2 className="text-lg font-semibold">
              Récents - {selectedMealType === 'breakfast' ? 'Petit-déjeuner' : selectedMealType === 'lunch' ? 'Déjeuner' : 'Dîner'}
            </h2>
          </div>
          
          <div className="space-y-3.5">
            {recentMeals[selectedMealType]?.length > 0 ? (
              recentMeals[selectedMealType].map((food) => (
                <div
                  key={food.id}
                  className="flex justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <div className="flex items-center">
                    <span className="mr-2.5 text-lg">{getFoodEmoji(food.name)}</span>
                    <span className="font-medium">{food.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-3 text-sm">
                      <span className="text-[#E74C3C] font-medium">{food.protein}g</span>
                      <span className="text-[#3498DB] font-medium">{food.carbs}g</span>
                      <span className="text-[#F1C40F] font-medium">{food.fat}g</span>
                      <span className="font-medium">{food.calories} kcal</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p>Aucun aliment récent pour ce repas</p>
                <p className="text-sm mt-1">Ajoutez des aliments pour les voir apparaître ici</p>
              </div>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="fixed bottom-20 right-4 flex flex-col space-y-2">
          <Button
            size="icon"
            className="rounded-full h-14 w-14 bg-[#3498DB] hover:bg-[#3498DB]/90 shadow-lg"
            onClick={() => navigate('/add-food')}
          >
            <Plus className="h-6 w-6" />
          </Button>
          
          <Button
            size="icon"
            className="rounded-full h-14 w-14 bg-green-500 hover:bg-green-600 shadow-lg"
            onClick={() => navigate('/scan-food')}
          >
            <Scan className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default FoodSearchPage;
