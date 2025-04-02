
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pb-16 overflow-auto">
        {children}
      </main>
      <BottomNavigation currentPath={currentPath} />
    </div>
  );
};

export default MainLayout;
