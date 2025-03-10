
import CalfitAvatar from '@/components/Avatar';
import CircularMacroGauge from '@/components/ui/CircularMacroGauge';
import { Badge } from '@/components/ui/badge';
import { CaloriesCard } from '@/components/dashboard/CaloriesCard';

interface NutritionDashboardProps {
  calories: { current: number; target: number };
  protein: { current: number; target: number };
  fat: { current: number; target: number };
  carbs: { current: number; target: number };
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
  return (
    <>
      <div className="flex justify-center mb-8 relative">
        <CalfitAvatar 
          calories={calories} 
          protein={protein}
          showPerfectBalanceBadge={isPerfectBalance}
        />
      </div>

      <div className="flex justify-center space-x-4 mb-5 px-2">
        <CircularMacroGauge 
          label="Protéines" 
          current={protein.current} 
          target={protein.target} 
          color="bg-calfit-red" 
          unit="g"
        />
        
        <CircularMacroGauge 
          label="Glucides" 
          current={carbs.current} 
          target={carbs.target} 
          color="bg-calfit-blue" 
          unit="g"
        />
        
        <CaloriesCard 
          current={calories.current} 
          target={calories.target} 
        />
        
        <CircularMacroGauge 
          label="Lipides" 
          current={fat.current} 
          target={fat.target} 
          color="bg-calfit-yellow" 
          unit="g"
        />
      </div>
    </>
  );
};

export default NutritionDashboard;
