
import CalfitAvatar from '@/components/Avatar';
import CircularMacroGauge from '@/components/ui/CircularMacroGauge';

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
          className={`transform ${pulseAvatar ? 'scale-115 animate-pulse-soft' : 'scale-110'} transition-all duration-300`}
          showPerfectBalanceBadge={isPerfectBalance}
        />
      </div>

      <div className="flex justify-center space-x-4 mb-5 px-2">
        <CircularMacroGauge 
          label="Protéines" 
          current={protein.current} 
          target={protein.target} 
          color="bg-calfit-blue"
          unit="g"
        />
        
        <CircularMacroGauge 
          label="Lipides" 
          current={fat.current} 
          target={fat.target} 
          color="bg-calfit-purple"
          unit="g"
        />
        
        <CircularMacroGauge 
          label="Glucides" 
          current={carbs.current} 
          target={carbs.target} 
          color="bg-calfit-green"
          unit="g"
        />
      </div>
    </>
  );
};

export default NutritionDashboard;
