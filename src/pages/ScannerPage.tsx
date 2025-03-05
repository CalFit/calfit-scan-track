
import { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import ScannerPreview from '@/components/ScannerPreview';
import { useToast } from "@/components/ui/use-toast";

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

const mockFoodData: FoodItem = {
  name: "Yaourt Grec Protéiné",
  calories: 120,
  protein: 15,
  fat: 4,
  carbs: 7
};

const ScannerPage = () => {
  const { toast } = useToast();
  const [scannedFood, setScannedFood] = useState<FoodItem | null>(null);

  const handleScanComplete = () => {
    // Simuler un délai pour la recherche dans la base de données
    setTimeout(() => {
      setScannedFood(mockFoodData);
      toast({
        title: "Aliment identifié !",
        description: "Yaourt Grec Protéiné",
      });
    }, 800);
  };

  const handleAddFood = () => {
    toast({
      title: "Aliment ajouté !",
      description: "Yaourt Grec ajouté à votre journal",
    });
    setScannedFood(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold mb-2">Scanner d'aliments</h1>
          <p className="text-muted-foreground">
            Scannez le code-barres d'un produit pour l'ajouter à votre journal
          </p>
        </header>

        <ScannerPreview onScanComplete={handleScanComplete} />

        {scannedFood && (
          <div className="calfit-card p-5 space-y-4 animate-scale-in">
            <h3 className="text-xl font-semibold">{scannedFood.name}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl text-center">
                <div className="text-lg font-bold">{scannedFood.calories}</div>
                <div className="text-xs text-muted-foreground">Calories</div>
              </div>
              <div className="bg-calfit-light-blue p-3 rounded-xl text-center">
                <div className="text-lg font-bold">{scannedFood.protein}g</div>
                <div className="text-xs text-muted-foreground">Protéines</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl text-center">
                <div className="text-lg font-bold">{scannedFood.fat}g</div>
                <div className="text-xs text-muted-foreground">Lipides</div>
              </div>
              <div className="bg-calfit-light-green p-3 rounded-xl text-center">
                <div className="text-lg font-bold">{scannedFood.carbs}g</div>
                <div className="text-xs text-muted-foreground">Glucides</div>
              </div>
            </div>

            <button 
              onClick={handleAddFood}
              className="calfit-button-primary w-full mt-4"
            >
              Ajouter à mon journal
            </button>
          </div>
        )}

        <div className="text-center mt-4">
          <button className="calfit-button-secondary">
            Saisie manuelle
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ScannerPage;
