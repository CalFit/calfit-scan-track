
import { useState } from 'react';
import { X, Search, ScanBarcode } from 'lucide-react';
import ManualFoodEntry from '@/components/ManualFoodEntry';
import ScannerPreview from '@/components/ScannerPreview';

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  barcode?: string;
}

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: FoodItem) => void;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

const AddFoodModal = ({ isOpen, onClose, onAddFood, mealType }: AddFoodModalProps) => {
  const [mode, setMode] = useState<'initial' | 'scan' | 'manual'>('initial');
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleScanComplete = (barcode: string) => {
    setScannedBarcode(barcode);
    setMode('manual'); // Pour la démo, on passe directement à l'entrée manuelle
    // Dans une vraie app, on rechercherait d'abord dans une base de données
  };

  const handleManualSubmit = (food: FoodItem) => {
    onAddFood(food);
    onClose();
  };

  const getMealTitle = () => {
    switch (mealType) {
      case 'breakfast': return 'petit-déjeuner';
      case 'lunch': return 'déjeuner';
      case 'dinner': return 'dîner';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="w-full max-w-md mx-auto relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {mode === 'initial' && (
          <div className="calfit-card p-6 space-y-5 animate-scale-in">
            <h2 className="text-xl font-semibold text-center">
              Ajouter un aliment à votre {getMealTitle()}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setMode('manual')}
                className="calfit-card bg-calfit-light-blue dark:bg-blue-900/20 p-4 flex flex-col items-center space-y-3 hover:scale-105 transition-transform"
              >
                <div className="p-3 bg-white dark:bg-gray-800 rounded-full">
                  <Search className="w-6 h-6 text-calfit-blue" />
                </div>
                <span className="font-medium">Saisie manuelle</span>
              </button>
              
              <button 
                onClick={() => setMode('scan')}
                className="calfit-card bg-calfit-light-green dark:bg-green-900/20 p-4 flex flex-col items-center space-y-3 hover:scale-105 transition-transform"
              >
                <div className="p-3 bg-white dark:bg-gray-800 rounded-full">
                  <ScanBarcode className="w-6 h-6 text-calfit-green" />
                </div>
                <span className="font-medium">Scanner un code</span>
              </button>
            </div>
          </div>
        )}

        {mode === 'scan' && (
          <div className="calfit-card overflow-hidden animate-scale-in">
            <ScannerPreview onScanComplete={handleScanComplete} />
          </div>
        )}

        {mode === 'manual' && (
          <ManualFoodEntry 
            initialBarcode={scannedBarcode} 
            onSubmit={handleManualSubmit}
            onCancel={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AddFoodModal;
