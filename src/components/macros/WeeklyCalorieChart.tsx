
import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

interface WeeklyCalorieChartProps {
  data: Array<{
    day: string;
    value: number;
    target: number;
  }>;
}

// Custom tooltip component with proper typing
const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
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

const WeeklyCalorieChart = ({ data }: WeeklyCalorieChartProps) => {
  return (
    <div className="pt-4 mb-3">
      <h4 className="text-sm font-medium text-muted-foreground mb-4">Évolution sur 7 jours</h4>
      <div className="h-48 md:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
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
  );
};

export default WeeklyCalorieChart;
