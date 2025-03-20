import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings, Award, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      name: 'Accueil', 
      path: '/', 
      icon: Home
    },
    { 
      name: 'Repas', 
      path: '/meals', 
      icon: Utensils
    },
    { 
      name: 'Macros', 
      path: '/macros', 
      icon: BarChart2
    },
    { 
      name: 'Classement', 
      path: '/leaderboard', 
      icon: Award
    },
    { 
      name: 'Réglages', 
      path: '/settings', 
      icon: Settings
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background dark:border-gray-800">
      <nav className="flex justify-between px-2">
        {navItems.map(item => (
          <Link 
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-1 flex-col items-center justify-center py-2 text-xs",
              location.pathname === item.path 
                ? "text-calfit-blue" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="mb-1 h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigation;
