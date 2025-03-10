
import { useState } from 'react';
import { X, Search, ScanBarcode } from 'lucide-react';
import ManualFoodEntry from '@/components/ManualFoodEntry';
import ScannerPreview from '@/components/ScannerPreview';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [mode, setMode] = useState<'initial' | 'scan' | 'manual'>('initial');
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  if (!isOpen) return null;

  const handleScanComplete = (barcode: string) => {
    setScannedBarcode(barcode);
    setCameraActive(false);
    
    toast({
      title: "Code-barres scanné",
      description: `Code-barres détecté: ${barcode}`
    });
    
    setMode('manual'); // Pour la démo, on passe directement à l'entrée manuelle
    // Dans une vraie app, on rechercherait d'abord dans une base de données
  };

  const handleScanClick = () => {
    setCameraActive(true);
    setMode('scan');
    
    // Demander l'accès à la caméra
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          // Le stream est disponible pour ScannerPreview
          console.log('Caméra activée avec succès');
        })
        .catch(err => {
          console.error('Erreur d\'accès à la caméra:', err);
          toast({
            title: "Accès caméra refusé",
            description: "Veuillez autoriser l'accès à la caméra pour scanner des codes-barres",
            variant: "destructive"
          });
          setMode('initial');
        });
    } else {
      toast({
        title: "Caméra non disponible",
        description: "Votre appareil ne prend pas en charge l'accès à la caméra",
        variant: "destructive"
      });
      setMode('initial');
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in dark:bg-black/70">
      <div className="w-full max-w-md mx-auto relative">
        <button 
          onClick={() => {
            if (cameraActive) {
              // Arrêter le flux de la caméra si actif
              const tracks = document.querySelectorAll('video').forEach(video => {
                if (video.srcObject) {
                  const mediaStream = video.srcObject as MediaStream;
                  mediaStream.getTracks().forEach(track => track.stop());
                }
              });
            }
            onClose();
          }}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {mode === 'initial' && (
          <div className="calfit-card p-6 space-y-5 animate-scale-in dark:bg-gray-900/80 dark:border-gray-700/50">
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
                onClick={handleScanClick}
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
          <div className="calfit-card overflow-hidden animate-scale-in dark:bg-gray-900/80 dark:border-gray-700/50">
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
