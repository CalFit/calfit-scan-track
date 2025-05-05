
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { ArrowLeft, Search, ScanBarcode, History, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFoodDatabase } from '@/hooks/useFoodDatabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useRecentFoods } from '@/hooks/useRecentFoods';
import RecentFoodsList from '@/components/food/RecentFoodsList';
import ManualFoodEntry from '@/components/food/ManualFoodEntry';
import ScannerPreview from '@/components/ScannerPreview';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const AddFoodPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { categories, addFood } = useFoodDatabase();
  const { 
    filteredFoods, 
    selectedMealType, 
    setSelectedMealType, 
    loading: loadingRecentFoods,
    addFoodToLog
  } = useRecentFoods();
  
  // États pour la gestion de l'interface
  const [mode, setMode] = useState<'initial' | 'scan' | 'manual'>('initial');
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  // Récupérer le type de repas depuis les query params s'il existe
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mealTypeParam = params.get('mealType');
    
    if (mealTypeParam && ['breakfast', 'lunch', 'dinner', 'snack'].includes(mealTypeParam)) {
      setSelectedMealType(mealTypeParam as 'breakfast' | 'lunch' | 'dinner' | 'snack');
    }
  }, [location.search]);
  
  // Gérer le scan de code-barres
  const handleScanComplete = (barcode: string) => {
    setScannedBarcode(barcode);
    setCameraActive(false);
    
    toast({
      title: "Code-barres scanné",
      description: `Code-barres détecté: ${barcode}`
    });
    
    setMode('manual'); // Pour transmettre le code-barres au formulaire manuel
  };

  // Démarrer le scan de code-barres
  const handleScanClick = () => {
    setCameraActive(true);
    setMode('scan');
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
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
  
  // Gérer l'ajout manuel d'un aliment
  const handleManualEntry = () => {
    setScannedBarcode(null);
    setMode('manual');
  };
  
  // Gérer la soumission du formulaire d'ajout
  const handleAddFoodSubmit = async (foodData: any) => {
    try {
      const addedFood = await addFood(foodData);
      
      if (addedFood) {
        // Ajouter l'aliment au journal alimentaire
        await addFoodToLog(addedFood, selectedMealType, foodData.serving_size || 1);
        
        // Rediriger vers la page précédente ou la page des repas
        navigate(-1);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'aliment:', error);
    }
  };
  
  // Gérer l'ajout rapide d'un aliment depuis l'historique
  const handleAddFromHistory = async (food: any) => {
    try {
      // Ajouter directement au journal alimentaire
      await addFoodToLog(food, selectedMealType, food.serving_size || 1);
      
      toast({
        title: "Aliment ajouté",
        description: `${food.name} a été ajouté à votre journal`,
      });
      
      // Rediriger vers la page précédente
      navigate(-1);
    } catch (error) {
      console.error('Erreur lors de l\'ajout depuis l\'historique:', error);
    }
  };

  // Fermer le scanner et revenir à l'écran initial
  const handleCloseScanner = () => {
    if (cameraActive) {
      // Arrêter les flux de la caméra
      document.querySelectorAll('video').forEach(video => {
        if (video.srcObject) {
          const mediaStream = video.srcObject as MediaStream;
          mediaStream.getTracks().forEach(track => track.stop());
        }
      });
      setCameraActive(false);
    }
    setMode('initial');
  };
  
  // Traduire le type de repas
  const getMealTypeLabel = () => {
    switch (selectedMealType) {
      case 'breakfast': return 'petit-déjeuner';
      case 'lunch': return 'déjeuner';
      case 'dinner': return 'dîner';
      case 'snack': return 'collation';
      default: return 'repas';
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-4 pb-16">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Ajouter un aliment</h1>
        </div>
        
        {/* Sélecteur de type de repas */}
        <div className="mb-4">
          <Select 
            value={selectedMealType} 
            onValueChange={(value) => setSelectedMealType(value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un repas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Petit-déjeuner</SelectItem>
              <SelectItem value="lunch">Déjeuner</SelectItem>
              <SelectItem value="dinner">Dîner</SelectItem>
              <SelectItem value="snack">Collation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {mode === 'initial' && (
          <div className="space-y-6">
            {/* Section des méthodes d'ajout */}
            <Card>
              <CardHeader className="bg-calfit-blue/20 pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter un aliment à votre {getMealTypeLabel()}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={handleManualEntry}
                    className="h-auto py-4 bg-calfit-light-blue hover:bg-calfit-light-blue/90 text-calfit-blue hover:text-calfit-blue"
                    variant="ghost"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-white rounded-full">
                        <Search className="w-5 h-5 text-calfit-blue" />
                      </div>
                      <span>Saisie manuelle</span>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={handleScanClick}
                    className="h-auto py-4 bg-calfit-light-green hover:bg-calfit-light-green/90 text-calfit-green hover:text-calfit-green"
                    variant="ghost"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-white rounded-full">
                        <ScanBarcode className="w-5 h-5 text-calfit-green" />
                      </div>
                      <span>Scanner</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Section de l'historique des aliments */}
            <Card>
              <CardHeader className="bg-calfit-blue/20 pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Historique pour {getMealTypeLabel()}
                </CardTitle>
                <CardDescription>
                  Aliments récemment ajoutés à ce repas
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <RecentFoodsList 
                  foods={filteredFoods}
                  isLoading={loadingRecentFoods}
                  onAddFood={handleAddFromHistory}
                />
              </CardContent>
            </Card>
          </div>
        )}
        
        {mode === 'scan' && (
          <Card className="overflow-hidden">
            <CardHeader className="bg-calfit-blue/20">
              <CardTitle className="text-lg">Scanner un code-barres</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScannerPreview onScanComplete={handleScanComplete} />
              <div className="p-4 flex justify-center">
                <Button onClick={handleCloseScanner} variant="outline">
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {mode === 'manual' && (
          <ManualFoodEntry 
            initialBarcode={scannedBarcode}
            onSubmit={handleAddFoodSubmit}
            onCancel={() => setMode('initial')}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default AddFoodPage;
