
import MainLayout from '@/components/layouts/MainLayout';
import AddFoodModal from '@/components/AddFoodModal';
import EditFoodModal from '@/components/EditFoodModal';
import DateSelector from '@/components/DateSelector';
import NutritionDashboard from '@/components/dashboard/NutritionDashboard';
import MealList from '@/components/meals/MealList';
import { useNutritionTracker } from '@/hooks/useNutritionTracker';
import { useFoodActions } from '@/hooks/useFoodActions';

const Index = () => {
  const {
    nutritionData,
    meals,
    activeMeal,
    avatarPulse,
    selectedDate,
    isPerfectBalance,
    setActiveMeal,
    updateNutritionData,
    setMeals,
    handleDateChange,
    getRecentFoodsForMeal
  } = useNutritionTracker();
  
  const {
    showAddFood,
    showEditFood,
    foodToEdit,
    setShowAddFood,
    setShowEditFood,
    handleAddFoodClick,
    handleEditFood,
    handleAddFood,
    handleSaveEditedFood,
    handleRemoveFood
  } = useFoodActions({
    updateNutritionData,
    setMeals,
    setActiveMeal
  });

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

      <AddFoodModal 
        isOpen={showAddFood} 
        onClose={() => setShowAddFood(false)} 
        onAddFood={(food) => handleAddFood(food, activeMeal)} 
        mealType={activeMeal || 'breakfast'} 
        recentFoods={getRecentFoodsForMeal()}
      />
      
      <EditFoodModal 
        isOpen={showEditFood} 
        onClose={() => setShowEditFood(false)} 
        onSave={(editedFood) => handleSaveEditedFood(editedFood, activeMeal, foodToEdit)} 
        food={foodToEdit} 
      />
    </MainLayout>;
};

export default Index;
