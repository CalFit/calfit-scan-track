
import { Link } from 'react-router-dom';
import { ChartBar, User, Users, Settings, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  currentPath: string;
}

const BottomNavigation = ({ currentPath }: BottomNavigationProps) => {
  const navItems = [
    { path: '/macros', label: 'Macros', icon: ChartBar },
    { path: '/', label: 'Avatar', icon: User },
    { path: '/food-search', label: 'Aliments', icon: Search },
    { path: '/leaderboard', label: 'Amis', icon: Users },
    { path: '/settings', label: 'Réglages', icon: Settings },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 w-full glass border-t border-border h-16 z-50">
      <div className="container h-full max-w-md mx-auto px-4">
        <nav className="flex items-center justify-between h-full">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all",
                currentPath === item.path
                  ? "text-calfit-blue"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              )}
            >
              <item.icon className={cn(
                "h-6 w-6 mb-1",
                currentPath === item.path && "animate-pulse-soft"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default BottomNavigation;
