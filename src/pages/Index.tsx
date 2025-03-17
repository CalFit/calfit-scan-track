
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import NutritionDashboard from '@/components/dashboard/NutritionDashboard';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Bonjour 👋</h1>
        
        <div className="bg-calfit-light-blue dark:bg-blue-900/20 rounded-lg p-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Chercher ou ajouter un aliment</h2>
            <p className="text-sm text-muted-foreground">Suivez vos macros facilement</p>
          </div>
          <Link to="/food-search">
            <Button size="icon" variant="default" className="bg-calfit-blue">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        <NutritionDashboard />
      </div>
    </MainLayout>
  );
};

export default Index;
