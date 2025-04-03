
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import NutritionDashboard from '@/components/dashboard/NutritionDashboard';
import { Button } from '@/components/ui/button';
import { Search, Utensils } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6 max-w-full">
        {/* Titre de la page */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Bonjour 👋</h1>

        {/* Section des macros */}
        <NutritionDashboard />

        {/* Boutons déplacés sous les macros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {/* Bouton Chercher/Ajouter un aliment */}
          <div className="bg-calfit-light-blue dark:bg-blue-900/20 rounded-lg p-3 md:p-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm md:text-base">Chercher ou ajouter un aliment</h2>
              <p className="text-xs md:text-sm text-muted-foreground">Suivez vos macros facilement</p>
            </div>
            <Link to="/food-search">
              <Button size={isMobile ? "sm" : "icon"} variant="default" className="bg-calfit-blue">
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
          </div>

          {/* Bouton Voir mes repas */}
          <div className="bg-calfit-light-green dark:bg-green-900/20 rounded-lg p-3 md:p-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm md:text-base">Voir mes repas</h2>
              <p className="text-xs md:text-sm text-muted-foreground">Gérez votre alimentation</p>
            </div>
            <Link to="/meals">
              <Button size={isMobile ? "sm" : "icon"} variant="default" className="bg-calfit-green">
                <Utensils className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
