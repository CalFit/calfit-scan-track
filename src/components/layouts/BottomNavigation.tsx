
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
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around p-2">
      <Link to="/" className={`p-2 rounded-full flex flex-col items-center ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Accueil</span>
      </Link>
      <Link to="/meals" className={`p-2 rounded-full flex flex-col items-center ${isActive('/meals') ? 'text-primary' : 'text-muted-foreground'}`}>
        <Utensils className="h-5 w-5" />
        <span className="text-xs mt-1">Repas</span>
      </Link>
      <Link to="/macros" className={`p-2 rounded-full flex flex-col items-center ${isActive('/macros') ? 'text-primary' : 'text-muted-foreground'}`}>
        <BarChart2 className="h-5 w-5" />
        <span className="text-xs mt-1">Macros</span>
      </Link>
      <Link to="/settings" className={`p-2 rounded-full flex flex-col items-center ${isActive('/settings') ? 'text-primary' : 'text-muted-foreground'}`}>
        <Settings className="h-5 w-5" />
        <span className="text-xs mt-1">Paramètres</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;
