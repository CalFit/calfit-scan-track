
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import AddFoodModal from '@/components/AddFoodModal';
import EditFoodModal from '@/components/EditFoodModal';
import DateSelector from '@/components/DateSelector';
import { useToast } from "@/hooks/use-toast";
import NutritionDashboard from '@/components/dashboard/NutritionDashboard';
import MealList from '@/components/meals/MealList';
import { initialNutritionData, initialMeals } from '@/data/initialNutritionData';
import { Plus } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';

const Index = () => {
  const { toast } = useToast();
  const [nutritionData, setNutritionData] = useState(initialNutritionData);
  const [meals, setMeals] = useState(initialMeals);
  const [showAddFood, setShowAddFood] = useState(false);
  const [showEditFood, setShowEditFood] = useState(false);
  const [activeMeal, setActiveMeal] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);
  const [avatarPulse, setAvatarPulse] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [foodToEdit, setFoodToEdit] = useState<any>(null);
  
  const overallProgress = () => {
    const caloriePercentage = nutritionData.calories.current / nutritionData.calories.target;
    const proteinPercentage = nutritionData.protein.current / nutritionData.protein.target;
    const fatPercentage = nutritionData.fat.current / nutritionData.fat.target;
    const carbsPercentage = nutritionData.carbs.current / nutritionData.carbs.target;
    return Math.min(Math.round((caloriePercentage + proteinPercentage + fatPercentage + carbsPercentage) / 4 * 100), 100);
  };
  
  const isPerfectBalance = () => {
    const proteinPercentage = nutritionData.protein.current / nutritionData.protein.target;
    const fatPercentage = nutritionData.fat.current / nutritionData.fat.target;
    const carbsPercentage = nutritionData.carbs.current / nutritionData.carbs.target;
    return proteinPercentage >= 0.85 && proteinPercentage <= 1.05 && fatPercentage >= 0.85 && fatPercentage <= 1.05 && carbsPercentage >= 0.85 && carbsPercentage <= 1.05;
  };
  
  const handleAddFoodClick = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    setActiveMeal(mealType);
    setShowAddFood(true);
  };
  
  const handleEditFood = (mealType: 'breakfast' | 'lunch' | 'dinner', food: any) => {
    setActiveMeal(mealType);
    setFoodToEdit(food);
    setShowEditFood(true);
  };
  
  const handleAddFood = (food: any) => {
    if (!activeMeal) return;
    
    const newFood = {
      ...food,
      id: Math.random()
    };
    
    setMeals(prev => ({
      ...prev,
      [activeMeal]: {
        ...prev[activeMeal],
        items: [...prev[activeMeal].items, newFood]
      }
    }));
    
    updateNutritionData(food.calories, food.protein, food.fat, food.carbs, 'add');
    
    const mealNames = {
      breakfast: 'petit-déjeuner',
      lunch: 'déjeuner',
      dinner: 'dîner'
    };
    
    toast({
      title: "Aliment ajouté !",
      description: `${food.name} ajouté à votre ${mealNames[activeMeal]}`
    });
    
    setShowAddFood(false);
  };
  
  const handleSaveEditedFood = (editedFood: any) => {
    if (!activeMeal || !foodToEdit) return;
    
    // Calculer les différences pour mettre à jour les totaux
    const caloriesDiff = editedFood.calories - foodToEdit.calories;
    const proteinDiff = editedFood.protein - foodToEdit.protein;
    const fatDiff = editedFood.fat - foodToEdit.fat;
    const carbsDiff = editedFood.carbs - foodToEdit.carbs;
    
    // Mettre à jour les repas
    setMeals(prev => ({
      ...prev,
      [activeMeal]: {
        ...prev[activeMeal],
        items: prev[activeMeal].items.map(item => 
          item.id === editedFood.id ? editedFood : item
        )
      }
    }));
    
    // Mettre à jour les totaux de nutrition
    updateNutritionData(caloriesDiff, proteinDiff, fatDiff, carbsDiff, 'add');
    
    toast({
      title: "Aliment modifié",
      description: `${editedFood.name} a été mis à jour`
    });
    
    setFoodToEdit(null);
    setShowEditFood(false);
  };
  
  const updateNutritionData = (calories: number, protein: number, fat: number, carbs: number, operation: 'add' | 'remove') => {
    const multiplier = operation === 'add' ? 1 : -1;
    
    setNutritionData(prev => ({
      calories: {
        ...prev.calories,
        current: prev.calories.current + (calories * multiplier)
      },
      protein: {
        ...prev.protein,
        current: prev.protein.current + (protein * multiplier)
      },
      fat: {
        ...prev.fat,
        current: prev.fat.current + (fat * multiplier)
      },
      carbs: {
        ...prev.carbs,
        current: prev.carbs.current + (carbs * multiplier)
      }
    }));
    
    setAvatarPulse(true);
    setTimeout(() => setAvatarPulse(false), 1500);
  };
  
  const handleRemoveFood = (mealType: 'breakfast' | 'lunch' | 'dinner', foodId: number) => {
    const foodToRemove = meals[mealType].items.find(item => item.id === foodId);
    if (!foodToRemove) return;
    
    setMeals(prev => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        items: prev[mealType].items.filter(item => item.id !== foodId)
      }
    }));
    
    updateNutritionData(foodToRemove.calories, foodToRemove.protein, foodToRemove.fat, foodToRemove.carbs, 'remove');
    
    toast({
      title: "Aliment supprimé",
      description: `${foodToRemove.name} a été retiré de votre journal`
    });
  };
  
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // Ici, vous pourriez charger les données pour la date sélectionnée
    toast({
      title: "Date modifiée",
      description: `Affichage des données pour le ${date.toLocaleDateString('fr-FR')}`
    });
  };

  return <MainLayout>
      <div className="space-y-6">
        <header className="text-center mb-2">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">CalFit</h1>
          <DateSelector date={selectedDate} onChange={handleDateChange} />
        </header>

        <NutritionDashboard 
          calories={nutritionData.calories} 
          protein={nutritionData.protein} 
          fat={nutritionData.fat} 
          carbs={nutritionData.carbs} 
          pulseAvatar={avatarPulse} 
          isPerfectBalance={isPerfectBalance()} 
        />

        <div className="px-2 mb-6">
          <ProgressBar 
            percentage={overallProgress()} 
            label={`${overallProgress()}% de vos macros atteintes aujourd'hui !`} 
            color="bg-[#F1C40F]" 
            showDate={true} 
          />
        </div>

        <MealList 
          meals={meals} 
          proteinTarget={nutritionData.protein.target} 
          fatTarget={nutritionData.fat.target} 
          carbsTarget={nutritionData.carbs.target} 
          onAddFoodClick={handleAddFoodClick} 
          onRemoveFood={handleRemoveFood}
          onEditFood={handleEditFood}
        />
      </div>

      <div className="fixed bottom-20 right-4">
        
      </div>

      <AddFoodModal 
        isOpen={showAddFood} 
        onClose={() => setShowAddFood(false)} 
        onAddFood={handleAddFood} 
        mealType={activeMeal || 'breakfast'} 
      />
      
      <EditFoodModal 
        isOpen={showEditFood} 
        onClose={() => setShowEditFood(false)} 
        onSave={handleSaveEditedFood} 
        food={foodToEdit} 
      />
    </MainLayout>;
};

export default Index;
