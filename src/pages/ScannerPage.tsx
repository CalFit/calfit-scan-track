import { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import ScannerPreview from '@/components/ScannerPreview';
import ManualFoodEntry from '@/components/ManualFoodEntry';
import { useToast } from "@/components/ui/use-toast";
import { X } from 'lucide-react';

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  barcode?: string;
}

// This would be replaced with a real database in a production app
const mockFoodDatabase: FoodItem[] = [
  {
    name: "Yaourt Grec Protéiné",
    calories: 120,
    protein: 15,
    fat: 4,
    carbs: 7,
    barcode: "12345678"
  },
  {
    name: "Barre Protéinée Chocolat",
    calories: 200,
    protein: 20,
    fat: 6,
    carbs: 12,
    barcode: "87654321"
  }
];

const ScannerPage = () => {
  const { toast } = useToast();
  const [scannedFood, setScannedFood] = useState<FoodItem | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [scanError, setScanError] = useState<boolean>(false);

  const handleScanComplete = (barcode: string) => {
    console.log("Barcode scanned:", barcode);
    setScannedBarcode(barcode);
    
    // Simulate database lookup
    const foundFood = mockFoodDatabase.find(food => food.barcode === barcode);
    
    if (foundFood) {
      setScannedFood(foundFood);
      setScanError(false);
      toast({
        title: "Aliment identifié !",
        description: foundFood.name,
      });
    } else {
      setScannedFood(null);
      setScanError(true);
      toast({
        title: "Aliment non trouvé",
        description: "Vous pouvez l'ajouter manuellement",
        variant: "destructive",
      });
    }
  };

  const handleAddFood = () => {
    toast({
      title: "Aliment ajouté !",
      description: `${scannedFood?.name} ajouté à votre journal`,
    });
    // Reset states
    setScannedFood(null);
    setScannedBarcode(null);
    setScanError(false);
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
    setScanError(false);
  };

  const handleManualSubmit = (newFood: FoodItem) => {
    // In a real app, this would add to a database
    console.log("Adding new food item:", newFood);
    // Add barcode if scanned
    if (scannedBarcode) {
      newFood.barcode = scannedBarcode;
    }
    
    // For demo purposes, we'll just set as the scannedFood
    setScannedFood(newFood);
    setShowManualEntry(false);
    toast({
      title: "Aliment ajouté à la base de données !",
      description: newFood.name,
    });
  };

  const handleManualCancel = () => {
    setShowManualEntry(false);
    setScannedBarcode(null);
  };

  const handleReset = () => {
    setScannedFood(null);
    setScannedBarcode(null);
    setScanError(false);
    setShowManualEntry(false);
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

        {!scannedFood && !showManualEntry && (
          <ScannerPreview onScanComplete={handleScanComplete} />
        )}

        {scanError && !showManualEntry && (
          <div className="calfit-card p-5 animate-scale-in text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full">
                <X className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold">Aliment non trouvé</h3>
            <p className="text-muted-foreground">
              Ce code-barres n'est pas dans notre base de données. Voulez-vous l'ajouter manuellement ?
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReset}
                className="calfit-button-secondary flex-1"
              >
                Annuler
              </button>
              <button
                onClick={handleManualEntry}
                className="calfit-button-primary flex-1"
              >
                Ajouter manuellement
              </button>
            </div>
          </div>
        )}

        {showManualEntry && (
          <ManualFoodEntry 
            initialBarcode={scannedBarcode} 
            onSubmit={handleManualSubmit}
            onCancel={handleManualCancel}
          />
        )}

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

            <div className="flex gap-3 mt-4">
              <button 
                onClick={handleReset}
                className="calfit-button-secondary flex-1"
              >
                Annuler
              </button>
              <button 
                onClick={handleAddFood}
                className="calfit-button-primary flex-1"
              >
                Ajouter à mon journal
              </button>
            </div>
          </div>
        )}

        {!scannedFood && !showManualEntry && !scanError && (
          <div className="text-center mt-4">
            <button 
              onClick={handleManualEntry} 
              className="calfit-button-secondary"
            >
              Saisie manuelle
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ScannerPage;
