
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

const SettingsPage = () => {
  const { settings, isLoading } = useUserSettings();
  const { theme, setTheme } = useTheme();

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

        <Tabs defaultValue="profile" className="w-full">
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
                <div className="flex items-center">
                  <Calculator className="text-calfit-blue w-5 h-5 mr-2" />
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Calculateur de besoins nutritionnels</h3>
                </div>
              </div>
              <div className="p-4">
                <NutritionalQuestionnaire />
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
