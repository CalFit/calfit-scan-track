
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useTheme } from '@/providers/ThemeProvider';
import { Settings, Sun, Moon, User, Calculator } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NutritionalQuestionnaire from '@/components/NutritionalQuestionnaire';
import GoalsTab from '@/components/settings/GoalsTab';
import ProfileTab from '@/components/settings/ProfileTab';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const SettingsPage = () => {
  const { settings, isLoading } = useUserSettings();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // State pour générer une clé unique et forcer la réinitialisation du composant
  const [questionnaireKey, setQuestionnaireKey] = useState<number>(Date.now());
  // State pour définir l'onglet actif
  const [activeTab, setActiveTab] = useState("profile");
  // State pour contrôler si le questionnaire est visible
  const [questionnaireMounted, setQuestionnaireMounted] = useState(true);

  // Vérifier si nous devons basculer vers l'onglet calculateur lors du chargement initial
  useEffect(() => {
    const showCalculator = localStorage.getItem('showCalculator');
    if (showCalculator === 'true') {
      setActiveTab("calculator");
      localStorage.removeItem('showCalculator'); // Nettoyer après utilisation
    }
  }, []);

  // Gestionnaire pour réinitialiser le questionnaire
  const handleQuestionnaireReset = () => {
    console.log("Réinitialisation du questionnaire...");

    // Démonter le composant
    setQuestionnaireMounted(false);
    
    // Attendre que le composant soit démonté, puis le remonter avec une nouvelle clé
    setTimeout(() => {
      // Générer une nouvelle clé pour forcer la réinitialisation du composant
      const newKey = Date.now();
      setQuestionnaireKey(newKey);
      
      console.log("Nouvelle clé générée:", newKey);
      
      // Remonter le composant
      setQuestionnaireMounted(true);
      
      // Basculer automatiquement vers l'onglet du calculateur
      setActiveTab("calculator");
      
      // Stocker dans localStorage pour conserver l'onglet actif même après rechargement
      localStorage.setItem('showCalculator', 'true');
      
      // Afficher un toast pour informer l'utilisateur
      toast({
        title: "Questionnaire prêt",
        description: "Vous pouvez maintenant recommencer le questionnaire",
        duration: 3000,
      });
      
      console.log("Questionnaire réinitialisé avec la clé:", newKey);
    }, 50); // Un court délai pour s'assurer que React a le temps de démonter le composant
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <header>
            <Skeleton className="h-10 w-56 mb-2" />
            <Skeleton className="h-6 w-80 mb-6" />
          </header>
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-80 w-full" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <header>
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Réglages</h1>
          <p className={`text-md mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Gérez vos préférences et configurez votre profil
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="profile" className="flex-1">Profil</TabsTrigger>
            <TabsTrigger value="goals" className="flex-1">Objectifs</TabsTrigger>
            <TabsTrigger value="calculator" className="flex-1">Calculateur</TabsTrigger>
            <TabsTrigger value="appearance" className="flex-1">Apparence</TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>

          {/* Onglet Objectifs */}
          <TabsContent value="goals">
            <GoalsTab />
          </TabsContent>

          {/* Onglet Calculateur */}
          <TabsContent value="calculator">
            <div className="calfit-card">
              <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calculator className="text-calfit-blue w-5 h-5 mr-2" />
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      Calculateur de besoins nutritionnels
                    </h3>
                  </div>
                  {settings.macroTargets && settings.macroTargets.calories > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleQuestionnaireReset} 
                      className="text-sm"
                    >
                      Refaire le questionnaire
                    </Button>
                  )}
                </div>
              </div>
              <div className="p-4">
                {questionnaireMounted ? (
                  <NutritionalQuestionnaire 
                    key={questionnaireKey} 
                    onReset={handleQuestionnaireReset}
                  />
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-muted-foreground">Chargement du questionnaire...</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Onglet Apparence */}
          <TabsContent value="appearance">
            <div className="calfit-card">
              <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  {theme === 'dark' ? <Moon className="text-calfit-blue w-5 h-5 mr-2" /> : <Sun className="text-calfit-blue w-5 h-5 mr-2" />}
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Apparence</h3>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Thème sombre</span>
                  <Switch
                    id="theme"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => {
                      setTheme(checked ? "dark" : "light");
                    }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
