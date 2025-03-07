
import { useState } from 'react';
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import MacroProgressBar from '@/components/ui/MacroProgressBar';
import { Dumbbell, Nut, Wheat, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

// Mock data for the demo
const mockData = {
  calories: { 
    current: 1800, 
    target: 2200,
    meals: [
      { id: 1, name: "Petit déjeuner", value: 450 },
      { id: 2, name: "Déjeuner", value: 650 },
      { id: 3, name: "Snack", value: 200 },
      { id: 4, name: "Dîner", value: 500 },
    ],
    weekly: [
      { day: "Lun", value: 1900, target: 2200 },
      { day: "Mar", value: 2100, target: 2200 },
      { day: "Mer", value: 1800, target: 2200 },
      { day: "Jeu", value: 2000, target: 2200 },
      { day: "Ven", value: 2300, target: 2200 },
      { day: "Sam", value: 1700, target: 2200 },
      { day: "Dim", value: 1800, target: 2200 },
    ]
  },
  protein: { 
    current: 80, 
    target: 120,
    meals: [
      { id: 1, name: "Petit déjeuner", value: 15 },
      { id: 2, name: "Déjeuner", value: 30 },
      { id: 3, name: "Snack", value: 10 },
      { id: 4, name: "Dîner", value: 25 },
    ]
  },
  fat: { 
    current: 60, 
    target: 70,
    meals: [
      { id: 1, name: "Petit déjeuner", value: 15 },
      { id: 2, name: "Déjeuner", value: 20 },
      { id: 3, name: "Snack", value: 7 },
      { id: 4, name: "Dîner", value: 18 },
    ]
  },
  carbs: { 
    current: 220, 
    target: 250,
    meals: [
      { id: 1, name: "Petit déjeuner", value: 60 },
      { id: 2, name: "Déjeuner", value: 70 },
      { id: 3, name: "Snack", value: 25 },
      { id: 4, name: "Dîner", value: 65 },
    ]
  }
};

const MacrosPage = () => {
  const [nutritionData] = useState(mockData);
  const [selectedMacro, setSelectedMacro] = useState('calories');

  const macroColors = {
    calories: 'bg-calfit-orange',
    protein: 'bg-calfit-blue',
    fat: 'bg-calfit-purple',
    carbs: 'bg-calfit-green',
  };

  const macroLabels = {
    calories: { name: 'Calories', unit: 'kcal', icon: Calendar },
    protein: { name: 'Protéines', unit: 'g', icon: Dumbbell },
    fat: { name: 'Lipides', unit: 'g', icon: Nut },
    carbs: { name: 'Glucides', unit: 'g', icon: Wheat },
  };

  const getPercentage = (key) => {
    return Math.min(Math.round((nutritionData[key].current / nutritionData[key].target) * 100), 100);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-md shadow-lg border border-gray-200 text-sm">
          <p className="font-semibold mb-1">{label}</p>
          <p className="text-calfit-orange">
            Calories: {payload[0].value} kcal
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Objectif: {payload[0].payload.target} kcal
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-4">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Macronutriments</h1>
          <p className="text-muted-foreground">
            Suivez votre consommation quotidienne
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(nutritionData).map(([key, data]) => {
            const percentage = getPercentage(key);
            const IconComponent = macroLabels[key].icon;
            const isOverTarget = data.current > data.target;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedMacro(key)}
                className={cn(
                  "calfit-card p-4 text-center transition-all hover:shadow-md",
                  selectedMacro === key ? 'ring-2 ring-calfit-blue scale-105' : '',
                  isOverTarget ? 'relative' : ''
                )}
              >
                {isOverTarget && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full animate-pulse" />
                )}
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className={cn(
                    "w-5 h-5 mr-1.5",
                    `text-${macroColors[key].replace('bg-', '')}`
                  )} />
                  <div className="text-lg font-bold">
                    {data.current}
                    <span className="text-xs font-normal ml-1">
                      {key === 'calories' ? 'kcal' : 'g'}
                    </span>
                  </div>
                </div>
                <div className="text-sm">{macroLabels[key].name}</div>
                <div className="macro-progress-bar mt-2 h-2">
                  <div 
                    className={cn(
                      "macro-progress-fill", 
                      macroColors[key],
                      percentage >= 85 && percentage <= 110 ? "shadow-[0_0_8px_currentColor]" : "",
                      isOverTarget ? "animate-pulse" : ""
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="calfit-card p-5 space-y-4">
          <h3 className="text-xl font-semibold flex items-center">
            <span className={`mr-2.5 w-7 h-7 rounded-full ${macroColors[selectedMacro]} flex items-center justify-center animate-pulse-soft`}>
              {React.createElement(macroLabels[selectedMacro].icon, { className: "w-4 h-4 text-white" })}
            </span>
            Détail: {macroLabels[selectedMacro].name}
          </h3>
          
          <MacroProgressBar 
            label={macroLabels[selectedMacro].name}
            current={nutritionData[selectedMacro].current} 
            target={nutritionData[selectedMacro].target} 
            color={macroColors[selectedMacro]}
            unit={macroLabels[selectedMacro].unit}
          />

          {selectedMacro === 'calories' && (
            <div className="pt-4 mb-3">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">Évolution sur 7 jours</h4>
              <div className="h-48 md:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={nutritionData.calories.weekly}
                    margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#FF9600" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1000}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Répartition par repas</h4>
            
            <div className="space-y-2">
              {nutritionData[selectedMacro].meals.map((meal) => (
                <button 
                  key={meal.id} 
                  className="flex justify-between items-center text-sm p-3 w-full hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                >
                  <span className="font-medium">{meal.name}</span>
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">
                      {meal.value} {macroLabels[selectedMacro].unit}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MacrosPage;
