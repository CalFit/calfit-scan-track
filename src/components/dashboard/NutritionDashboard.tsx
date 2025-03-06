
import CalfitAvatar from '@/components/Avatar';
import CircularMacroGauge from '@/components/ui/CircularMacroGauge';

interface NutritionDashboardProps {
  calories: { current: number; target: number };
  protein: { current: number; target: number };
  fat: { current: number; target: number };
  carbs: { current: number; target: number };
}

const NutritionDashboard = ({ calories, protein, fat, carbs }: NutritionDashboardProps) => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <CalfitAvatar 
          calories={calories} 
          protein={protein}
          className="scale-110 transform"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
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
