
import CalfitAvatar from '@/components/Avatar';
import CircularMacroGauge from '@/components/ui/CircularMacroGauge';
import { CaloriesCard } from '@/components/dashboard/CaloriesCard';
import { useNutritionTracker } from '@/hooks/useNutritionTracker';

interface NutritionDashboardProps {
  calories?: { current: number; target: number };
  protein?: { current: number; target: number };
  fat?: { current: number; target: number };
  carbs?: { current: number; target: number };
  pulseAvatar?: boolean;
  isPerfectBalance?: boolean;
}

const NutritionDashboard = ({ 
  calories,
  protein,
  fat,
  carbs,
  pulseAvatar = false,
  isPerfectBalance = false
}: NutritionDashboardProps) => {
  // If props aren't provided, use data from useNutritionTracker
  const { nutritionData, avatarPulse, isPerfectBalance: isBalanced } = useNutritionTracker();

  // Use provided props or fall back to nutritionData
  const caloriesData = calories || nutritionData.calories;
  const proteinData = protein || nutritionData.protein;
  const fatData = fat || nutritionData.fat;
  const carbsData = carbs || nutritionData.carbs;
  const isPulsing = pulseAvatar || avatarPulse;
  const isInBalance = isPerfectBalance || isBalanced();

  return (
    <>
      <div className="flex justify-center mb-4 relative">
        <CalfitAvatar 
          calories={caloriesData} 
          protein={proteinData}
          showPerfectBalanceBadge={isInBalance}
        />
      </div>

      {/* Calories card below avatar */}
      <div className="flex justify-center mb-4">
        <CaloriesCard 
          current={caloriesData.current} 
          target={caloriesData.target} 
        />
      </div>

      <div className="flex justify-center space-x-4 mb-5 px-2">
        <CircularMacroGauge 
          label="Protéines" 
          current={proteinData.current} 
          target={proteinData.target} 
          color="bg-calfit-red" 
          unit="g"
        />
        
        <CircularMacroGauge 
          label="Glucides" 
          current={carbsData.current} 
          target={carbsData.target} 
          color="bg-calfit-blue" 
          unit="g"
        />
        
        <CircularMacroGauge 
          label="Lipides" 
          current={fatData.current} 
          target={fatData.target} 
          color="bg-calfit-yellow" 
          unit="g"
        />
      </div>
    </>
  );
};

export default NutritionDashboard;
