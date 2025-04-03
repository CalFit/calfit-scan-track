
import { Link } from 'react-router-dom';
import { Home, Utensils, BarChart2, Settings } from 'lucide-react';

interface BottomNavigationProps {
  currentPath: string;
}

const BottomNavigation = ({ currentPath }: BottomNavigationProps) => {
  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around p-1 md:p-2 z-50">
      <Link to="/" className={`p-1 md:p-2 rounded-full flex flex-col items-center ${isActive('/') ? 'text-primary' : 'text-muted-foreground'} w-1/4`}>
        <Home className="h-4 w-4 md:h-5 md:w-5" />
        <span className="text-[10px] md:text-xs mt-0.5 md:mt-1">Accueil</span>
      </Link>
      <Link to="/meals" className={`p-1 md:p-2 rounded-full flex flex-col items-center ${isActive('/meals') ? 'text-primary' : 'text-muted-foreground'} w-1/4`}>
        <Utensils className="h-4 w-4 md:h-5 md:w-5" />
        <span className="text-[10px] md:text-xs mt-0.5 md:mt-1">Repas</span>
      </Link>
      <Link to="/macros" className={`p-1 md:p-2 rounded-full flex flex-col items-center ${isActive('/macros') ? 'text-primary' : 'text-muted-foreground'} w-1/4`}>
        <BarChart2 className="h-4 w-4 md:h-5 md:w-5" />
        <span className="text-[10px] md:text-xs mt-0.5 md:mt-1">Macros</span>
      </Link>
      <Link to="/settings" className={`p-1 md:p-2 rounded-full flex flex-col items-center ${isActive('/settings') ? 'text-primary' : 'text-muted-foreground'} w-1/4`}>
        <Settings className="h-4 w-4 md:h-5 md:w-5" />
        <span className="text-[10px] md:text-xs mt-0.5 md:mt-1">Paramètres</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;
